"use client";

import React from "react";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  note: Note;
}

export default function Item({ note }: Props) {
  const router = useRouter();
  console.log(note);
  React.useEffect(() => {
    console.log("Note prop received:", note);
  }, [note]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/note?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting note:", errorData.message);
        return;
      }

      router.refresh(); // Refresh the router on success
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  return (
    <div className="border-2 border-black p-3 rounded-md">
      <h2 className="mb-2">ID: {note?.id}</h2>
      <h1 className="text-xl font-semibold">{note?.title}</h1>
      <p>{note?.content}</p>

      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          className="font-semibold"
          onClick={() => router.push(`/update/${note?.id}`)}
        >
          Update
        </button>
        <button
          className="font-semibold text-red-500"
          onClick={() => handleDelete(note?.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
