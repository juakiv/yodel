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
    include: {
      user: {
        select: {
          id: true,
          email: true,
          points: true
        }
      }
    }
  });

  if(!user) {
    return false;
  }

  return user.user;
}