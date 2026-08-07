import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.diaryEntry.findMany({
      orderBy: { pageIndex: "asc" },
    });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch diary entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pages } = body;

    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload, pages array expected" },
        { status: 400 }
      );
    }

    const upsertPromises = pages.map((page, index) => {
      const pageIndex = typeof page.pageIndex === "number" ? page.pageIndex : index;
      return prisma.diaryEntry.upsert({
        where: { pageIndex },
        update: {
          title: page.title || "",
          text: page.text || "",
          date: page.date || "",
        },
        create: {
          pageIndex,
          title: page.title || "",
          text: page.text || "",
          date: page.date || "",
        },
      });
    });

    const savedEntries = await prisma.$transaction(upsertPromises);

    return NextResponse.json({ success: true, data: savedEntries });
  } catch (error) {
    console.error("Error saving diary entries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save diary entries" },
      { status: 500 }
    );
  }
}
