"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  // The update page will need an id in a url
  const id = params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    // Because this is a client side (because we use 'use client on top'), so we don't have to add http in the api
    await fetch("/api/note", {
      method: "PUT", // Method put is to update
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        id,
      }),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });

    setIsLoading(false);

    router.push("/");
  };

  useEffect(() => {
    console.log("Page params:", params); // Check if the correct ID is being passed
    getData();
  }, []);
  

  const getData = async () => {
    try {
      const res = await fetch(`/api/note/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await res.json();

      if (!json) {
        router.push("/404");
        return;
      }

      setTitle(json.note.title);
      setContent(json.note.content);
    } catch (error) {
      console.error("Error fetching note:", error);
      router.push("/404");
    }
  };

  return (
    <form
      className="w-[500px] mx-auto pt-20 flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Input your title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded-md"
      />
      <textarea
        rows={10}
        placeholder="Input your content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded-md"
      />
      <button disabled={isLoading}>
        {isLoading ? "Loading ..." : "Update"}
      </button>
    </form>
  );
};

export default Page;
