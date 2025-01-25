import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, UserJSON } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

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

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data as UserJSON;

    // Get primary email address
    const primaryEmail = email_addresses.find((email) => email.verification?.status === "verified")?.email_address;

    if (!primaryEmail) {
      return new Response("No verified email found", { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail,
          firstName: first_name || null,
          lastName: last_name || null,
          role: "STUDENT",
        },
      });

      console.log("User successfully saved to the database");
    } catch (error) {
      console.error("Error saving user to database:", error);
      return new Response("Error saving user to the database", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
