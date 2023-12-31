import { cookies } from "next/headers";
import prisma from "./prisma";

export default async function validateServerSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value ?? null;

  if(!sessionToken) {
    return false;
  }

  const user = await prisma.session.findFirst({
    where: {
      token: sessionToken,
      expiresAt: {
        gte: new Date()
      }
    },
    select: {
      id: true,
      token: true,
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });

  if(!user) {
    return false;
  }

  user.user["sessionId"] = user.id;
  user.user["token"] = user.token;
  return user.user;
}