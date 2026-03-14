import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { theme } from "./theme";

interface VerifyEmailProps {
  otp: string;
  name?: string;
}

export function VerifyEmail({ otp, name }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Doc Forge verification code: {otp}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>Doc Forge</Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.title}>
              Verify your email address
            </Heading>
            <Text style={styles.text}>
              {name ? `Hi ${name},` : "Hi,"}
            </Text>
            <Text style={styles.text}>
              Thanks for signing up for Doc Forge. Use the code below to verify
              your email address.
            </Text>
            <Section style={styles.codeContainer}>
              <Text style={styles.code}>{otp}</Text>
            </Section>
            <Text style={styles.textSmall}>
              If you didn&apos;t create an account on Doc Forge, you can safely
              ignore this email.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This code will expire in 10 minutes. If it has expired, you can
              request a new one from the sign-in page.
            </Text>
            <Text style={styles.footerText}>
              &copy; {new Date().getFullYear()} Doc Forge. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: theme.colors.mutedBackground,
    fontFamily: theme.fontFamily,
    margin: "0",
    padding: "0",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center" as const,
    padding: "20px 0",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700",
    color: theme.colors.primary,
    margin: "0",
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius,
    border: `1px solid ${theme.colors.border}`,
    padding: "40px 32px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: theme.colors.foreground,
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    color: theme.colors.foreground,
    margin: "0 0 16px",
  },
  textSmall: {
    fontSize: "13px",
    lineHeight: "20px",
    color: theme.colors.muted,
    margin: "16px 0 0",
  },
  codeContainer: {
    textAlign: "center" as const,
    margin: "24px 0",
    backgroundColor: theme.colors.mutedBackground,
    borderRadius: "8px",
    padding: "16px",
    border: `1px dashed ${theme.colors.border}`,
  },
  code: {
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "8px",
    color: theme.colors.foreground,
    margin: "0",
    fontFamily: theme.fontFamily,
  },
  hr: {
    borderColor: theme.colors.border,
    margin: "24px 0",
  },
  footer: {
    textAlign: "center" as const,
    padding: "0 20px",
  },
  footerText: {
    fontSize: "12px",
    lineHeight: "18px",
    color: theme.colors.footerText,
    margin: "0 0 8px",
  },
};

export default VerifyEmail;
