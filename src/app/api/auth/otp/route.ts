import { NextResponse } from "next/server";

// In-memory OTP storage with TTL (10 minutes)
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global cache across serverless warm invocations
const emailOtpStore = new Map<string, OtpRecord>();
const whatsappOtpStore = new Map<string, OtpRecord>();

// Helper to generate a random 6-digit numeric OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean phone numbers to standard format (digits with optional leading +)
function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, phone, code } = body;

    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    // -------------------------------------------------------------
    // 1. SEND EMAIL OTP
    // -------------------------------------------------------------
    if (action === "send-email") {
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid business email address." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
      const otp = generateOtp();

      emailOtpStore.set(normalizedEmail, {
        code: otp,
        expiresAt: now + tenMinutes,
        attempts: 0,
      });

      let emailSent = false;
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Argent & Co. Trade <verify@argent-silver.com>",
              to: normalizedEmail,
              subject: `${otp} is your Argent & Co. Wholesale Trade verification code`,
              html: `
                <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                  <h2 style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0;">ARGENT & CO.</h2>
                  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-top: -6px;">Wholesale Fine 925 Sterling Silver</p>
                  <p style="font-size: 14px; color: #334155; line-height: 1.6;">Use the verification code below to verify your business email address and unlock trade pricing access:</p>
                  <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #020617; font-family: monospace;">${otp}</span>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">This code will expire in 10 minutes. If you did not apply for an Argent & Co. trade account, you can safely disregard this email.</p>
                </div>
              `,
            }),
          });
          if (res.ok) emailSent = true;
        } catch (err) {
          console.warn("Resend email dispatch error:", err);
        }
      }

      console.log(`[AUTH:EMAIL_OTP] Generated for ${normalizedEmail}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: emailSent
          ? `Verification code dispatched to ${normalizedEmail}`
          : `Verification code generated for ${normalizedEmail}`,
        devCode: otp,
        dispatchedViaApi: emailSent,
      });
    }

    // -------------------------------------------------------------
    // 2. VERIFY EMAIL OTP
    // -------------------------------------------------------------
    if (action === "verify-email") {
      if (!email || !code) {
        return NextResponse.json(
          { success: false, error: "Email and verification code are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
      const record = emailOtpStore.get(normalizedEmail);

      if (!record) {
        return NextResponse.json(
          { success: false, error: "No OTP was requested for this email or it has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (now > record.expiresAt) {
        emailOtpStore.delete(normalizedEmail);
        return NextResponse.json(
          { success: false, error: "This verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (record.attempts >= 5) {
        emailOtpStore.delete(normalizedEmail);
        return NextResponse.json(
          { success: false, error: "Too many incorrect attempts. Please request a new verification code." },
          { status: 429 }
        );
      }

      if (record.code.trim() !== code.toString().trim()) {
        record.attempts += 1;
        return NextResponse.json(
          { success: false, error: `Invalid verification code. Please check and try again (${5 - record.attempts} attempts remaining).` },
          { status: 400 }
        );
      }

      // Successful verification
      emailOtpStore.delete(normalizedEmail);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Email address successfully verified.",
      });
    }

    // -------------------------------------------------------------
    // 3. SEND WHATSAPP OTP
    // -------------------------------------------------------------
    if (action === "send-whatsapp") {
      if (!phone || phone.trim().length < 6) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid WhatsApp phone number with country code." },
          { status: 400 }
        );
      }

      const sanitized = sanitizePhone(phone);
      const otp = generateOtp();

      whatsappOtpStore.set(sanitized, {
        code: otp,
        expiresAt: now + tenMinutes,
        attempts: 0,
      });

      let whatsappSent = false;
      const metaToken = process.env.WHATSAPP_API_TOKEN;
      const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      // Clean number for WhatsApp international URL / Meta API (digits only, no +)
      const digitsOnly = sanitized.replace(/\D/g, "");

      if (metaToken && metaPhoneId) {
        try {
          const res = await fetch(
            `https://graph.facebook.com/v19.0/${metaPhoneId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${metaToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: digitsOnly,
                type: "text",
                text: {
                  body: `*ARGENT & CO. WHOLESALE*\nYour WhatsApp trade verification code is: *${otp}*.\n\nValid for 10 minutes. Do not share this code with anyone.`,
                },
              }),
            }
          );
          if (res.ok) whatsappSent = true;
        } catch (err) {
          console.warn("Meta WhatsApp Cloud API dispatch error:", err);
        }
      }

      // Generate direct WhatsApp click-to-chat link
      const whatsappMsg = `Hello Argent & Co. Wholesale, my verification code is ${otp}`;
      const whatsappDirectUrl = `https://api.whatsapp.com/send?phone=${digitsOnly}&text=${encodeURIComponent(whatsappMsg)}`;

      console.log(`[AUTH:WHATSAPP_OTP] Generated for ${sanitized}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: whatsappSent
          ? `WhatsApp verification code dispatched to ${sanitized}`
          : `WhatsApp verification code generated for ${sanitized}`,
        devCode: otp,
        whatsappDirectUrl,
        dispatchedViaApi: whatsappSent,
      });
    }

    // -------------------------------------------------------------
    // 4. VERIFY WHATSAPP OTP
    // -------------------------------------------------------------
    if (action === "verify-whatsapp") {
      if (!phone || !code) {
        return NextResponse.json(
          { success: false, error: "Phone number and verification code are required." },
          { status: 400 }
        );
      }

      const sanitized = sanitizePhone(phone);
      const record = whatsappOtpStore.get(sanitized);

      if (!record) {
        return NextResponse.json(
          { success: false, error: "No OTP was requested for this phone number or it has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (now > record.expiresAt) {
        whatsappOtpStore.delete(sanitized);
        return NextResponse.json(
          { success: false, error: "This WhatsApp verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (record.attempts >= 5) {
        whatsappOtpStore.delete(sanitized);
        return NextResponse.json(
          { success: false, error: "Too many incorrect attempts. Please request a new WhatsApp verification code." },
          { status: 429 }
        );
      }

      if (record.code.trim() !== code.toString().trim()) {
        record.attempts += 1;
        return NextResponse.json(
          { success: false, error: `Invalid WhatsApp code. Please check and try again (${5 - record.attempts} attempts remaining).` },
          { status: 400 }
        );
      }

      // Successful verification
      whatsappOtpStore.delete(sanitized);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "WhatsApp phone number successfully verified.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action specified." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("OTP API Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error processing verification." },
      { status: 500 }
    );
  }
}
