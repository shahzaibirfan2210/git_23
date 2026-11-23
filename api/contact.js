const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

function respond(res, status, body) {
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { error: "Method not allowed." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return respond(res, 400, { error: "Please check your details and try again." });
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return respond(res, 400, { error: "Please check your details and try again." });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    !message ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return respond(res, 400, { error: "Please check your details and try again." });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_TO_EMAIL?.trim();
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !recipient || !sender) {
    console.error("Contact form is missing required Vercel environment variables.");
    return respond(res, 503, {
      error: "The contact form is not configured yet. Please try again later.",
    });
  }

  if (!EMAIL_PATTERN.test(recipient)) {
    console.error("CONTACT_TO_EMAIL must be a valid email address.");
    return respond(res, 503, {
      error: "The contact form is not configured yet. Please try again later.",
    });
  }

  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: "New message from your portfolio",
        text: `From: ${name}\nReply to: ${email}\n\n${message}`,
      }),
    });

    if (!delivery.ok) {
      console.error("Resend rejected a portfolio message.", { status: delivery.status });
      return respond(res, 502, {
        error: "Could not send your message right now. Please try again later.",
      });
    }

    return respond(res, 200, { message: "Your message has been sent." });
  } catch (error) {
    console.error("Could not reach Resend to deliver a portfolio message.", error);
    return respond(res, 502, {
      error: "Could not send your message right now. Please try again later.",
    });
  }
}
