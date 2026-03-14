import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { render } from "@react-email/components";
import { VerifyEmail } from "@/components/emails/verify-email";
import { ResetPassword } from "@/components/emails/reset-password";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const html = await render(VerifyEmail({ otp }));
          await sendEmail({
            to: email,
            subject: "Verify your Doc Forge email",
            html,
          });
        } else if (type === "forget-password") {
          const html = await render(ResetPassword({ otp }));
          await sendEmail({
            to: email,
            subject: "Reset your Doc Forge password",
            html,
          });
        } else if (type === "sign-in") {
          const html = await render(VerifyEmail({ otp }));
          await sendEmail({
            to: email,
            subject: "Your Doc Forge sign-in code",
            html,
          });
        }
      },
    }),
  ],
});
