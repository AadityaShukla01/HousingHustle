"use client";

import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isBookmark, setIsBookmark] = useState(false);
  const [loadBtn, setLoadBtn] = useState(false);
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks/check`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: property._id,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setIsBookmark(data.isBookmark);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong...");
      } finally {
        setLoadBtn(true);
      }
    };
    checkBookmarkStatus();
  }, [property._id, userId]);

  const handleBtn = async () => {
    if (!userId) {
      toast.error("You need to login to bookmark property");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: property._id,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        setIsBookmark(data.isBookmark);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };
  return isBookmark ? (
    <>
      {loadBtn && (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
          onClick={handleBtn}
        >
          <FaBookmark className="mr-2" /> Remove from bookmark
        </button>
      )}
    </>
  ) : (
    <>
      {loadBtn && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
          onClick={handleBtn}
        >
          <FaBookmark className="mr-2" /> Bookmark Property
        </button>
      )}
    </>
  );
};

export default BookmarkButton;
