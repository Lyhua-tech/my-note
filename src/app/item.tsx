"use client";

import React, { useState, useEffect } from "react";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  note: Note;
}

export default function Item({ note }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(note?.status || "todo");

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

      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error("Error updating note status:", error);
    }
  };

  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     try {
  //       const response = await fetch(`/api/note?status=${status}`);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching notes:", error);
  //     }
  //   };
  //   console.log(status);
  //   fetchNotes();
  // }, [status, handleUpdateStatus]);

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
    <div className="border-2 border-zinc-200 p-3 rounded-md h-[200px]  ">
      <select
        value={status}
        onChange={(e) => handleUpdateStatus(e.target.value)}
        className=" border-zinc-200 border rounded-md px-3 "
      >
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <h2 className="mb-2">ID: {note?.id}</h2>
      <h1 className="text-xl font-semibold">{note?.title}</h1>
      <p className="truncate">{note?.content}</p>
      <div className="flex justify-end gap-3 mt-4 text-sm">
        <Button
          className="font-semibold border-zinc-200 border rounded-md px-3"
          onClick={() => router.push(`/update/${note?.id}`)}
        >
          Update
        </Button>
        <Button
          className="font-semibold  rounded-md px-3"
          onClick={() => handleDelete(note?.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
