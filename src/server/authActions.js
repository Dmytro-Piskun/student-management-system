"use server";

import prisma from '@/lib/prisma'; // Import the singleton Prisma client
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";
import { encodeJWT, decodeJWT } from '@/utils/jwtUtils';
import { redirect } from 'next/navigation';

export async function register(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    if (!username || !password) {
      throw new Error("Please fill in all fields");
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.$transaction(async (tx) => {
     
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          role: "TEACHER",
        },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });

      await tx.teacher.create({
        data: {
          userId: user.id
        }
      });

      return user;
    });

    const token = await encodeJWT({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    await cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function login(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    if (!username || !password) {
      throw new Error("Please fill in all fields");
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const token = await encodeJWT({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    await cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  } catch (error) {
    return {
      error: error.message,
    };

  }
}

export async function logout() {
  await cookies().delete("token");
  redirect('/login');
}

export async function getUser() {
  const token = cookies().get("token")?.value;
  if (!token) {
    return null;
  }

  return await decodeJWT(token);
}