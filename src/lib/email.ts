import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const { to, subject, html } = options
  const { data, error } = await resend.emails.send({
    from: "noreply@codewithmj.com",
    to,
    subject,
    html,
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}