"use client";

import { EnterOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    // Because this is a client side (because we use 'use client on top'), so we don't have to add http in the api
    await fetch("/api/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="w-[500px] mx-auto space-y-2 pt-20">
      <button
        onClick={() => router.push("/")}
        className="px-4 py-1 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white"
      >
        <LeftOutlined
          style={{ fontSize: "20px", color: "white", textAlign: "center" }}
        />
      </button>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-2">
        <input
          type="text"
          placeholder="What is your task today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded-md text-neutral-900 text-xl"
        />
        <textarea
          rows={10}
          placeholder="Tell me more"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded-md text-neutral-900 text-lg"
        />
        <button
          disabled={isLoading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white text-lg  "
        >
          {isLoading ? "Loading ..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
