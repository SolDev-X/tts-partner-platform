import {betterAuth} from "better-auth/minimal";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {phoneNumber} from "better-auth/plugins";

import {prisma} from "@/lib/prisma";

function maskPhoneNumber(phone: string) {
  return `${phone.slice(0, 6)}****${phone.slice(-4)}`;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: {
        type: ["CUSTOMER", "ADMIN"],
        required: true,
        defaultValue: "CUSTOMER",
        input: false,
      },
    },
  },
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      phoneNumberValidator: (phone) => /^\+861[3-9]\d{9}$/.test(phone),
      sendOTP: ({phoneNumber: phone, code}) => {
        if (process.env.NODE_ENV === "production") {
          throw new Error("SMS provider is not configured");
        }

        console.info(
          `[auth] 手机验证码 ${maskPhoneNumber(phone)}：${code}（5 分钟内有效）`,
        );
      },
      signUpOnVerification: {
        getTempEmail: (phone) =>
          `phone-${phone.replace(/\D/g, "")}@placeholder.invalid`,
        getTempName: (phone) => `用户${phone.slice(-4)}`,
      },
    }),
  ],
});
