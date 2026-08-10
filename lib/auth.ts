import {betterAuth} from "better-auth/minimal";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {emailOTP, phoneNumber} from "better-auth/plugins";
import {Resend} from "resend";

import {prisma} from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

function maskPhoneNumber(phone: string) {
  return `${phone.slice(0, 6)}****${phone.slice(-4)}`;
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  const visibleLocalPart = localPart.slice(0, 2);

  return `${visibleLocalPart}***@${domain}`;
}

async function sendEmailOtp(email: string, otp: string) {
  if (!resendApiKey || !emailFrom) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email provider is not configured");
    }

    console.info(
      `[auth] 邮箱验证码 ${maskEmail(email)}：${otp}（5 分钟内有效）`,
    );
    return;
  }

  const resend = new Resend(resendApiKey);
  const {error} = await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "跨境服务平台验证码",
    text: `您的验证码是 ${otp}，5 分钟内有效。请勿将验证码提供给他人。`,
    html: `<p>您的验证码是 <strong style="font-size: 24px; letter-spacing: 0.12em;">${otp}</strong></p><p>验证码将在 5 分钟后失效。请勿将验证码提供给他人。</p>`,
  });

  if (error) {
    console.error("[auth] Resend 邮箱验证码发送失败", {
      name: error.name,
      message: error.message,
    });
    throw new Error(`Unable to send email OTP: ${error.message}`);
  }
}

async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resendApiKey || !emailFrom) {
    throw new Error("Email provider is not configured");
  }

  const resend = new Resend(resendApiKey);
  const {error} = await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "重置您的跨境服务平台密码",
    text: `请在 1 小时内打开以下链接重置密码：${resetUrl}\n\n如果不是您本人操作，请忽略此邮件。`,
    html: `<p>您正在重置跨境服务平台的登录密码。</p><p><a href="${resetUrl}">重置密码</a></p><p>此链接将在 1 小时后失效。如果不是您本人操作，请忽略此邮件。</p>`,
  });

  if (error) {
    console.error("[auth] Resend 密码重置邮件发送失败", {
      name: error.name,
      message: error.message,
    });
    throw new Error(`Unable to send password reset email: ${error.message}`);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({user, url}) => {
      await sendPasswordResetEmail(user.email, url);
    },
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.user.update({
            where: {id: user.id},
            data: {onboardingRequired: true},
          });
        },
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: "hashed",
      changeEmail: {
        enabled: true,
        verifyCurrentEmail: false,
      },
      rateLimit: {
        window: 60,
        max: 3,
      },
      sendVerificationOTP: async ({email, otp}) => {
        await sendEmailOtp(email, otp);
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
