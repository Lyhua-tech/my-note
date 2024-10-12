import Image from "next/image";
import Link from "next/link";
import React from "react";
import Item from "./item";

const getPosts = async () => {
  const res = await fetch(process.env.BASE_URL + "/api/note", {
    next: { revalidate: 0 },
  });

  // Check if the response status is OK (status code 200)
  if (!res.ok) {
    console.error("Error fetching posts:", res.status, res.statusText);
    return null; // or handle the error as needed
  }

  // Try to parse the response as JSON
  try {
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

const Page = async () => {
  const notes = await getPosts();

  return (
    <div className="w-[1200px] mx-auto py-20">
      <Link
        href={"/create"}
        className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white"
      >
        Create
      </Link>
      <div className="grid grid-cols-3 gap-5 mt-8">
        {notes?.notes
          ?.map((note: any, i: number) => <Item key={i} note={note} />)
          .sort()
          .reverse()}
      </div>
    </div>
  );
};

export default Page;
