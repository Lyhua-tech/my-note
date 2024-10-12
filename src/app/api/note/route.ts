import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Action to fetch all notes
export const GET = async (req: NextRequest) => {
  try {
    const notes = await prisma.note.findMany(); // Ensure this matches your schema
    return NextResponse.json({ notes }); // Return notes in the expected format
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Action to create a new note
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

// Action to delete a note
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

// Action to update or edit a note
export const PUT = async (req: NextRequest) => {
  try {
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

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update note" },
      { status: 500 }
    );
  }
};
