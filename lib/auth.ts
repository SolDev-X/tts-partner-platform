import {betterAuth} from "better-auth/minimal";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {emailOTP, phoneNumber} from "better-auth/plugins";

import {prisma} from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

function maskPhoneNumber(phone: string) {
  return `${phone.slice(0, 6)}****${phone.slice(-4)}`;
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  const visibleLocalPart = localPart.slice(0, 2);

  return `${visibleLocalPart}***@${domain}`;
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
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
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
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: "hashed",
      rateLimit: {
        window: 60,
        max: 3,
      },
      sendVerificationOTP: async ({email, otp, type}) => {
        if (process.env.NODE_ENV === "production") {
          throw new Error("Email provider is not configured");
        }

        console.info(
          `[auth] 邮箱验证码 ${maskEmail(email)}：${otp}（${type}，5 分钟内有效）`,
        );
      },
    }),
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
