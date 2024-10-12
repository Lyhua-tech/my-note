import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Action to read
export const GET = async (req: NextRequest, res: NextResponse) => {
  const notes = await prisma.note.findMany({});

  return NextResponse.json({
    notes,
  });
};

// Action to create
export const POST = async (req: NextRequest) => {
  try {
    const { title, content } = await req.json();
    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
};

// Action to delete
export const DELETE = async (req: NextRequest) => {
  try {
    const url = new URL(req.url).searchParams;
    const id = Number(url.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const note = await prisma.note.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Note deleted successfully", note });
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Delete error:", error.message);
      return NextResponse.json(
        {
          message: "Error deleting the note",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    } else {
      // Handle any other unknown errors
      console.error("Unknown error:", error);
      return NextResponse.json(
        {
          message: "An unknown error occurred",
        },
        {
          status: 500,
        }
      );
    }
  }
};

// Action to update or edit
export const PUT = async (req: NextRequest) => {
  const { title, content, id } = await req.json();

  const note = await prisma.note.update({
    where: {
      id: Number(id),
    },

    data: {
      title,
      content,
    },
  });

  return NextResponse.json({
    note,
  });
};
