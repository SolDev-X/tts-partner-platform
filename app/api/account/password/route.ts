import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const passwordSchema = z.object({
  password: z.string().min(8).max(128),
  companyName: z.string().trim().min(2).max(80),
});

async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user;
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const [credentialAccount, account] = await Promise.all([
    prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
        password: {not: null},
      },
      select: {id: true},
    }),
    prisma.user.findUnique({
      where: {id: user.id},
      select: {onboardingRequired: true},
    }),
  ]);

  return NextResponse.json({
    hasPassword: Boolean(credentialAccount),
    needsOnboarding: Boolean(account?.onboardingRequired),
  });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const parsedBody = passwordSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({error: "Invalid password"}, {status: 400});
  }

  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credential",
      password: {not: null},
    },
    select: {id: true},
  });

  const account = await prisma.user.findUnique({
    where: {id: user.id},
    select: {onboardingRequired: true},
  });

  if (credentialAccount || !account?.onboardingRequired) {
    return NextResponse.json({error: "Password already set"}, {status: 409});
  }

  try {
    await auth.api.setPassword({
      headers: request.headers,
      body: {newPassword: parsedBody.data.password},
    });

    await prisma.user.update({
      where: {id: user.id},
      data: {
        name: parsedBody.data.companyName,
        onboardingRequired: false,
      },
    });

    return NextResponse.json({status: true});
  } catch {
    return NextResponse.json({error: "Unable to set password"}, {status: 400});
  }
}
