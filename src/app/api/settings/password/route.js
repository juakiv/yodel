import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import validateServerSession from "@/lib/server/validateServerSession";

export async function POST(request) {
  const user = await validateServerSession();

  if(!user) {
    return NextResponse.json({ success: false, message: "Et ole kirjautunut."}, { status: 401 });
  }

  const data = await request.json();
  if (!["current_password", "password", "password_again"].every(field => Object.keys(data).includes(field) && data[field] !== "")) {
    return NextResponse.json({
      success: false,
      message: "Kaikki kentät ovat pakollisia."
    }, {
      status: 422
    });
  }

  if(data.password.length < 6) {
    return NextResponse.json({
      success: false,
      message: "Salasanan tulee olla vähintään 6 merkkiä."
    }, {
      status: 422
    });
  }

  if(data.password !== data.password_again) {
    return NextResponse.json({
      success: false,
      message: "Salasanat eivät täsmää."
    }, {
      status: 422
    });
  }

  const currentPassword = await prisma.user.findFirst({
    where: {
      id: user.id
    },
    select: {
      password: true
    }
  });

  const passwordMatch = await bcrypt.compare(data.current_password, currentPassword.password);
  if(!passwordMatch) {
    return NextResponse.json({
      success: false,
      message: "Nykyinen salasana on väärä."
    }, {
      status: 422
    });
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      password: hashedPassword
    }
  });

  return NextResponse.json({ success: true });
}