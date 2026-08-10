import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const parsedBody = passwordSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({error: "Invalid password"}, {status: 400});
  }

  try {
    await auth.api.changePassword({
      headers: request.headers,
      body: {...parsedBody.data, revokeOtherSessions: true},
    });
    return NextResponse.json({status: true});
  } catch {
    return NextResponse.json(
      {error: "Current password is incorrect"},
      {status: 400},
    );
  }
}
