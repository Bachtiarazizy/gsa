// app/api/student-profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

// Define validation schema for student profile data
const studentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  university: z.string().min(1, "University is required"),
  major: z.string().min(1, "Major is required"),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Validate the request body
    const validatedData = studentProfileSchema.parse(body);

    // Check if profile already exists for this user
    const existingProfile = await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (existingProfile) {
      return new NextResponse("Profile already exists", { status: 400 });
    }

    // Create new student profile
    const studentProfile = await prisma.studentProfile.create({
      data: {
        userId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        university: validatedData.university,
        major: validatedData.major,
      },
    });

    return NextResponse.json(studentProfile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_POST]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Validate the request body
    const validatedData = studentProfileSchema.parse(body);

    // Update existing profile
    const updatedProfile = await prisma.studentProfile.update({
      where: {
        userId,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        university: validatedData.university,
        major: validatedData.major,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
