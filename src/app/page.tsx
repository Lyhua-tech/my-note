import Image from "next/image";
import Link from "next/link";
import React from "react";
import Item from "./item";

const getPosts = async () => {
  const res = await fetch(process.env.BASE_URL + "/api/note", {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error("Error fetching posts:", res.status);
    return null;
  }

  try {
    const json = await res.json();
    console.log("Fetched notes:", json); // Log fetched notes
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

const Page = async () => {
  const notes = await getPosts();

  if (!notes) {
    return <p>Error fetching notes.</p>;
  }

  const todoNotes = notes.notes.filter((note: any) => note.status === "todo");
  const doingNotes = notes.notes.filter((note: any) => note.status === "doing");
  const doneNotes = notes.notes.filter((note: any) => note.status === "done");

  return (
    <div className="w-[1200px] mx-auto py-20">
      <Link
        href={"/create"}
        className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white"
      >
        Create
      </Link>
      <div className="flex space-x-5 mt-3">
        <section>
          <p>Todo</p>
          <div className="grid grid-cols-1 gap-5 mt-8 border-zinc-200 max-w-[400]">
            {todoNotes.length > 0 ? (
              todoNotes
                // .sort(
                //   (a: any, b: any) =>
                //     new Date(b.createdAt) - new Date(a.createdAt)
                // ) // Sort by created date
                .map((note: any) => <Item key={note.id} note={note} />) // Use note.id as the key
            ) : (
              <p>No Todo notes available.</p>
            )}
          </div>
        </section>
        <section>
          <p>Doing</p>
          <div className="grid grid-cols-1 gap-5 mt-8 border-zinc-200 max-w-[400]">
            {doingNotes.length > 0 ? (
              doingNotes
                // .sort(
                //   (a: any, b: any) =>
                //     new Date(b.createdAt) - new Date(a.createdAt)
                // ) // Sort by created date
                .map((note: any) => <Item key={note.id} note={note} />) // Use note.id as the key
            ) : (
              <p>No Doing notes available.</p>
            )}
          </div>
        </section>
        <section>
          <p>Done</p>
          <div className="grid grid-cols-1 gap-5 mt-8 border-zinc-200 max-w-[400]">
            {doneNotes.length > 0 ? (
              doneNotes
                // .sort(
                //   (a: any, b: any) =>
                //     new Date(b.createdAt) - new Date(a.createdAt)
                // ) // Sort by created date
                .map((note: any) => <Item key={note.id} note={note} />) // Use note.id as the key
            ) : (
              <p>No Done notes available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
