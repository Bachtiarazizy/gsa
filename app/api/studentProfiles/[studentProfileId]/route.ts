import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/db";
import { z } from "zod";

// Define validation schema for student profile data
const studentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  university: z.string().min(1, "University is required"),
  major: z.string().min(1, "Major is required"),
});

export async function GET(req: Request, { params }: { params: { studentProfileId: string } }) {
  try {
    const { userId } = await auth();
    const { studentProfileId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the specific student profile
    const profile = await prisma.studentProfile.findUnique({
      where: {
        id: studentProfileId,
      },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Check if the profile belongs to the authenticated user
    if (profile.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STUDENT_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { studentProfileId: string } }) {
  try {
    const { userId } = await auth();
    const { studentProfileId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check if the profile exists and belongs to the user
    const existingProfile = await prisma.studentProfile.findUnique({
      where: {
        id: studentProfileId,
      },
    });

    if (!existingProfile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    if (existingProfile.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();

    // Validate the request body
    const validatedData = studentProfileSchema.parse(body);

    // Update the student profile
    const updatedProfile = await prisma.studentProfile.update({
      where: {
        id: studentProfileId,
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
    console.error("[STUDENT_PROFILE_PUT]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { studentProfileId: string } }) {
  try {
    const { userId } = await auth();
    const { studentProfileId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check if the profile exists and belongs to the user
    const existingProfile = await prisma.studentProfile.findUnique({
      where: {
        id: studentProfileId,
      },
    });

    if (!existingProfile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    if (existingProfile.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the student profile
    await prisma.studentProfile.delete({
      where: {
        id: studentProfileId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STUDENT_PROFILE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
