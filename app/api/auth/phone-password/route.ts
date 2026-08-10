import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const bodySchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/),
  password: z.string().min(8).max(128),
});

const invalidCredentials = () =>
  NextResponse.json(
    {error: "Invalid credentials"},
    {status: 401},
  );

export async function POST(request: Request) {
  const parsedBody = bodySchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return invalidCredentials();
  }

  const user = await prisma.user.findUnique({
    where: {phoneNumber: `+86${parsedBody.data.phone}`},
    select: {email: true, role: true},
  });

  if (!user || user.role !== "CUSTOMER") {
    return invalidCredentials();
  }

  try {
    const response = await auth.api.signInEmail({
      headers: request.headers,
      body: {
        email: user.email,
        password: parsedBody.data.password,
        rememberMe: true,
      },
      asResponse: true,
    });

    return response;
  } catch {
    return invalidCredentials();
  }
}
