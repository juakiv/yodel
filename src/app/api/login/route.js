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

  if (!["email", "password"].every(field => Object.keys(data).includes(field) && data[field] !== "")) {
    return NextResponse.json({
      success: false,
      message: "Molemmat kentät ovat pakollisia."
    }, {
      status: 422
    });
  }

  const findEmail = await prisma.user.findFirst({
    where: {
      email: data.email
    }
  });

  if (!findEmail) {
    return NextResponse.json({
      success: false,
      message: "Käyttäjätunnus tai salasana on väärä."
    }, {
      status: 422
    });
  }
  
  const passwordMatch = await bcrypt.compare(data.password, findEmail.password);
  if(!passwordMatch) {
    return NextResponse.json({
      success: false,
      message: "Käyttäjätunnus tai salasana on väärä."
    }, {
      status: 422
    });
  }
  
  const token = [...Array(40)].map(() => Math.random().toString(36)[2]).join('');
  await prisma.session.create({
    data: {
      token: token,
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      userId: findEmail.id
    }
  });

  const response = NextResponse.json({
    success: true,
    message: "success"
  });
  response.cookies.set("sessionToken", token);
  return response;
}