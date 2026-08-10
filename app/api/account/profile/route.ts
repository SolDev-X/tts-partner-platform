import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

const profileSchema = z.object({
  companyName: z.string().trim().min(2).max(80),
});

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const parsedBody = profileSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({error: "Invalid company name"}, {status: 400});
  }

  await auth.api.updateUser({
    headers: request.headers,
    body: {name: parsedBody.data.companyName},
  });

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    select: {name: true},
  });

  return NextResponse.json({name: user?.name ?? parsedBody.data.companyName});
}
