import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("Missing SIGNING_SECRET in environment variables");
    return new Response("Error: Missing signing secret", { status: 500 });
  }

  const svix = new Webhook(SIGNING_SECRET);

  try {
    // Extract headers and body
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing Svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify the webhook
    const evt = svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    // Process only user.created events
    if (evt.type === "user.created") {
      const { email_addresses, first_name, last_name } = evt.data;

      // Save user to the database
      await prisma.user.create({
        data: {
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
        },
      });

      console.log("User created and saved:", email_addresses[0]?.email_address);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Error: Unable to process webhook", { status: 400 });
  }
}
