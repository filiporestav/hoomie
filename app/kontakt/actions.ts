// app/kontakt/actions.ts

import nodemailer from "nodemailer";

// Serverfunktion för att skicka e-post
export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Ersätt med din SMTP-server
    port: 587, // Standardport för SMTP
    secure: false, // true för 465, false för andra portarna
    auth: {
      user: "your-email@example.com", // Din e-postadress
      pass: "your-email-password", // Ditt e-postlösenord
    },
  });

  const mailOptions = {
    from: email,
    to: "support@hoomie.se", // Mottagarens e-post
    subject: `Nytt meddelande från ${name}`,
    text: message,
    html: `<p>Du har fått ett nytt meddelande från ${name} (${email}):</p><p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ success: true, message: "E-post skickat!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Det gick inte att skicka e-post.",
      }),
      { status: 500 }
    );
  }
}
