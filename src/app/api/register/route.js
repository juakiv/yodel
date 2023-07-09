import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/server/prisma";
import validateServerSession from "@/lib/server/validateServerSession";

export async function POST(request) {
  const user = await validateServerSession();

  if(user) {
    return NextResponse.json({
      success: false,
      message: "Olet jo kirjautunut."
    }, {
      status: 401
    });
  }

  const data = await request.json();

  if (!["email", "password", "password_again"].every(field => Object.keys(data).includes(field) && data[field] !== "")) {
    return NextResponse.json({
      success: false,
      message: "Kaikki kentät ovat pakollisia."
    }, {
      status: 422
    });
  }

  const isEmailInUse = await prisma.user.count({
    where: {
      email: data.email
    }
  }) > 0;

  if (isEmailInUse) {
    return NextResponse.json({
      success: false,
      message: "Antamallasi sähköpostilla on jo tehty tili."
    }, {
      status: 422
    });
  }

  if (data.password !== data.password_again) {
    return NextResponse.json({
      success: false,
      message: "Salasanat eivät täsmää."
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

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const token = [...Array(40)].map(() => Math.random().toString(36)[2]).join('');
  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      sessions: {
        create: {
          token: token,
          expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        }
      }
    }
  });

  if(!createdUser) {
    return NextResponse.json({
      success: false,
      message: "Käyttäjätilin luominen epäonnistui."
    }, {
      status: 422
    });
  }

  const response = NextResponse.json({
    success: true
  });
  response.cookies.set("sessionToken", token);
  return response;
}