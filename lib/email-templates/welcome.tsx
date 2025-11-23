import { Text, Button, Section } from "@react-email/components";
import { BaseEmail } from "./base";

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ firstName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <BaseEmail
      preview={`Welcome to Velovs & Co, ${firstName}!`}
      title={`Welcome aboard, ${firstName}! 🎉`}
    >
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        Thank you for joining Velovs & Co! We're excited to have you as part of our
        community.
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        You've been granted <strong>10 free credits</strong> to get started.
        These credits can be used to:
      </Text>

      <Section style={{ margin: "20px 0" }}>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 📊 Access your comprehensive financial dashboard
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 📈 Track your portfolio in real-time
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 10px 0",
          }}
        >
          • 🤖 Get AI-powered financial insights instantly
        </Text>
        <Text
          style={{
            fontSize: "16px",
            lineHeight: "26px",
            color: "#374151",
            margin: "0 0 20px 0",
          }}
        >
          • 🔒 Manage secure transactions with confidence
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, margin: "30px 0" }}>
        <Button
          href={dashboardUrl}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
            textAlign: "center" as const,
            display: "inline-block",
            padding: "12px 24px",
          }}
        >
          Get Started Now
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0 0 20px 0",
        }}
      >
        If you have any questions or need help getting started, don't hesitate
        to reach out to our support team.
      </Text>

      <Text
        style={{
          fontSize: "16px",
          lineHeight: "26px",
          color: "#374151",
          margin: "0",
        }}
      >
        Best regards,
        <br />
        The Velovs Team
      </Text>
    </BaseEmail>
  );
}