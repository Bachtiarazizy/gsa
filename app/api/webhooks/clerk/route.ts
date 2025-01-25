import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  const wh = new Webhook(SIGNING_SECRET);

  // Get headers from the request
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Ensure all necessary headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  // Parse the payload from the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify the webhook with the provided headers and payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  // Handle the 'user.created' event
  if (evt.type === "user.created") {
    const userPayload = payload.data;
    const primaryEmail = userPayload.email_addresses[0]?.email_address; // Access the first email address

    // Ensure the email exists before saving
    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    try {
      // Save the user to the database
      await prisma.user.create({
        data: {
          clerkId: userPayload.id,
          email: primaryEmail,
          firstName: userPayload.first_name || null,
          lastName: userPayload.last_name || null,
          role: "STUDENT", // Default role for new users
        },
      });

      console.log("User successfully saved to the database", userPayload.id);
    } catch (error) {
      console.error("Error saving user to database:", error);
      console.error("Payload:", userPayload);
      return new Response("Error saving user to the database", { status: 500 });
    }
  }

  // Return a success response when the webhook is processed
  return new Response("Webhook received", { status: 200 });
}
