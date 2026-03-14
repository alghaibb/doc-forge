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

interface ResetPasswordProps {
  otp: string;
  name?: string;
}

export function ResetPassword({ otp, name }: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Doc Forge password reset code: {otp}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>Doc Forge</Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.title}>
              Reset your password
            </Heading>
            <Text style={styles.text}>
              {name ? `Hi ${name},` : "Hi,"}
            </Text>
            <Text style={styles.text}>
              We received a request to reset the password for your Doc Forge
              account. Use the code below to proceed.
            </Text>
            <Section style={styles.codeContainer}>
              <Text style={styles.code}>{otp}</Text>
            </Section>
            <Section style={styles.warningBox}>
              <Text style={styles.warningText}>
                If you didn&apos;t request a password reset, please ignore this
                email or contact support if you have concerns about your
                account&apos;s security.
              </Text>
            </Section>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This code will expire in 10 minutes for security reasons. After
              that, you&apos;ll need to request a new password reset.
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
  warningBox: {
    backgroundColor: theme.colors.mutedBackground,
    borderRadius: "6px",
    padding: "12px 16px",
    marginTop: "8px",
  },
  warningText: {
    fontSize: "13px",
    lineHeight: "20px",
    color: theme.colors.muted,
    margin: "0",
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

export default ResetPassword;
