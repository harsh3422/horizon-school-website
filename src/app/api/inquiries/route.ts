import { db } from "@/db";
import { admissionInquiries } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  program?: unknown;
  message?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;
    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 40);
    const program = clean(body.program, 160);
    const message = clean(body.message, 2000);

    if (name.length < 2 || !email.includes("@") || !program) {
      return NextResponse.json(
        { ok: false, message: "Please provide a parent name, valid email, and entry stage." },
        { status: 400 },
      );
    }

    const [inquiry] = await db
      .insert(admissionInquiries)
      .values({ name, email, phone: phone || null, program, message: message || null })
      .returning({ id: admissionInquiries.id });

    return NextResponse.json(
      {
        ok: true,
        id: inquiry.id,
        message: "Thank you! Our family admissions team will contact you within one school day."
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to save admissions inquiry", error);
    return NextResponse.json(
      { ok: false, message: "We could not send your request. Please try again." },
      { status: 500 },
    );
  }
}