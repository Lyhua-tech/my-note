"use client";

import React, { useState, useEffect } from "react";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  note: Note;
}

export default function Item({ note }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(note?.status || "todo");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/note?status=${status}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    console.log(status);
    fetchNotes();
  }, [status]);

  // Function to update the note status
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/note/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating status:", errorData.message);
        return;
      }

      setStatus(newStatus); // Update the local state with the new status
    } catch (error) {
      console.error("Error updating note status:", error);
    }
  };

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
      router.refresh();
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  return (
    <div className="border-2 border-zinc-200 p-3 rounded-md">
      <select
        value={status}
        onChange={(e) => handleUpdateStatus(e.target.value)} // Trigger update on change
      >
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <h2 className="mb-2">ID: {note?.id}</h2>
      <h1 className="text-xl font-semibold">{note?.title}</h1>
      <p>{note?.content}</p>
      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          className="font-semibold border-zinc-200 border rounded-md px-3"
          onClick={() => router.push(`/update/${note?.id}`)}
        >
          Update
        </button>
        <button
          className="font-semibold text-red-500 border-zinc-200 border rounded-md px-3"
          onClick={() => handleDelete(note?.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
