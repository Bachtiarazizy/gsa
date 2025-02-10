// app/api/courses/[courseId]/chapters/[chapterId]/discussions/route.ts
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        content,
        userId,
        chapterId: params.chapterId, // Use chapterId from URL params
      },
      include: {
        replies: true,
        likes: true,
      },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("[DISCUSSIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// // app/api/course/[courseId]/chapters/[chapterId]/discussions/reply/route.ts
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
//   try {
//     const { userId } = auth();
//     const { content, discussionId } = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const reply = await db.reply.create({
//       data: {
//         content,
//         userId,
//         discussionId,
//       },
//       include: {
//         likes: true,
//       },
//     });

//     return NextResponse.json(reply);
//   } catch (error) {
//     console.error("[DISCUSSIONS_REPLY_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// // app/api/discussions/like/route.ts
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const { discussionId } = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Check if user already liked the discussion
//     const existingLike = await db.discussionLike.findUnique({
//       where: {
//         userId_discussionId: {
//           userId,
//           discussionId,
//         },
//       },
//     });

//     if (existingLike) {
//       // Unlike if already liked
//       await db.discussionLike.delete({
//         where: {
//           userId_discussionId: {
//             userId,
//             discussionId,
//           },
//         },
//       });
//     } else {
//       // Create new like
//       await db.discussionLike.create({
//         data: {
//           userId,
//           discussionId,
//         },
//       });
//     }

//     // Get updated discussion with likes and replies
//     const updatedDiscussion = await db.discussion.findUnique({
//       where: {
//         id: discussionId,
//       },
//       include: {
//         replies: {
//           include: {
//             likes: true,
//           },
//         },
//         likes: true,
//       },
//     });

//     return NextResponse.json(updatedDiscussion);
//   } catch (error) {
//     console.error("[DISCUSSIONS_LIKE_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// // app/api/discussions/reply/like/route.ts
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const { replyId } = await req.json();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Check if user already liked the reply
//     const existingLike = await db.replyLike.findUnique({
//       where: {
//         userId_replyId: {
//           userId,
//           replyId,
//         },
//       },
//     });

//     if (existingLike) {
//       // Unlike if already liked
//       await db.replyLike.delete({
//         where: {
//           userId_replyId: {
//             userId,
//             replyId,
//           },
//         },
//       });
//     } else {
//       // Create new like
//       await db.replyLike.create({
//         data: {
//           userId,
//           replyId,
//         },
//       });
//     }

//     // Get the reply and its parent discussion id
//     const reply = await db.reply.findUnique({
//       where: {
//         id: replyId,
//       },
//       include: {
//         likes: true,
//       },
//     });

//     const discussionId = (
//       await db.reply.findUnique({
//         where: { id: replyId },
//         select: { discussionId: true },
//       })
//     )?.discussionId;

//     return NextResponse.json({
//       discussionId,
//       updatedReply: reply,
//     });
//   } catch (error) {
//     console.error("[REPLY_LIKE_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
