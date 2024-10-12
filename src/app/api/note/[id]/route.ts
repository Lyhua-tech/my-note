import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const id = Number(context.params.id || 0);

  // Correct this line from `post` to `note`
  const note = await prisma.note.findUnique({
    where: {
      id: id,
    },
  });

  return NextResponse.json({ note });
};

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id);
  const { status } = await req.json(); // Destructure the status from the request body

  try {
    // Update the note with the new status in the database
    const updatedNote = await prisma.note.update({
      where: { id: Number(id) }, // Convert id to a number if it's a string
      data: { status }, // Update the status
    });

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note status:", error);
    return NextResponse.json(
      { message: "Error updating note status" },
      { status: 500 }
    );
  }
}
