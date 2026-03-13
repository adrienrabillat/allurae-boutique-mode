import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: "ALLURAE <onboarding@resend.dev>",
      to: "delivered@resend.dev", // Special email for testing Resend
      subject: "Test Email from ALLURAE Local Environment",
      html: "<p>It works! Resend is correctly configured in your local environment.</p>",
    });

    console.log("Email sent successfully!");
    console.log("Response:", data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
