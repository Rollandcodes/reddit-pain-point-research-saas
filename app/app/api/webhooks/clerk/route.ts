/**
 * Clerk Webhook Handler - User Events
 * Handles user.created events to send welcome emails
 * 
 * Setup:
 * 1. Install svix: npm install svix
 * 2. Go to Clerk Dashboard → Webhooks
 * 3. Add endpoint: https://yourdomain.com/api/webhooks/clerk
 * 4. Subscribe to: user.created
 * 5. Copy signing secret to CLERK_WEBHOOK_SECRET env var
 * 
 * Note: Uncomment the Webhook import below after installing svix package
 */

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { config } from "@/lib/config";
import { sendWelcomeEmail } from "@/lib/email";

//

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  // Verify the webhook signature from Clerk using svix
  const headerList = headers();
  const svix_id = headerList.get("svix-id") || "";
  const svix_timestamp = headerList.get("svix-timestamp") || "";
  const svix_signature = headerList.get("svix-signature") || "";
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  const wh = new Webhook(secret);
  const payload = await request.text();
  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }


  const eventType = evt.type;
  if (eventType === "user.created") {
    const userEmail = evt.data?.email_addresses?.[0]?.email_address;
    const userName = evt.data?.first_name || "there";
    if (config.email.enabled && userEmail) {
      await sendWelcomeEmail(userEmail, { userName, email: userEmail });
    }
  }



  return NextResponse.json({ ok: true });
}
