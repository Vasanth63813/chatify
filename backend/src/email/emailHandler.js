import { ResendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const { data, error } = await ResendClient.emails.send({
    from: `${sender.name}<${sender.email}>`,
    to: email,
    subject: "Welcome To Chatify",
    html: createWelcomeEmailTemplate(name, clientUrl),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};
