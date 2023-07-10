import { NextResponse } from "next/server";

import validateServerSession from "@/lib/server/validateServerSession";
import validateEmail from "@/lib/server/validateEmail";
import prisma from "@/lib/server/prisma";

export async function POST(request) {
  const user = await validateServerSession();

  if(!user) {
    return NextResponse.json({ success: false, message: "Et ole kirjautunut."}, { status: 401 });
  }

  const data = await request.json();

  if(data.email === null || data.email === "" || !validateEmail(data.email)) {
    return NextResponse.json({ success: false, message: "Et antanut sähköpostiosoitetta tai sähköpostiosoite on epäkelpo."}, { status: 422 });
  }

  const isEmailFree = await prisma.user.count({ where: { email: data.email } }) === 0;
  if(!isEmailFree) {
    return NextResponse.json({ success: false, message: "Sähköpostiosoite on varattu."}, { status: 422 });
  }

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      email: data.email
    }
  });

  return NextResponse.json({ success: true });
}