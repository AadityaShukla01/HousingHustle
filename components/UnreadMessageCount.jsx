"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMessageContext } from "@/context/MessageContext";
const UnreadMessageCount = () => {
  const { count, setCount } = useMessageContext();

  useEffect(() => {
    const getCount = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/unread-count`
        );
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error");
      }
    };

    getCount();
  }, [count]);
  return (
    <>
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {count}
        </span>
      )}
    </>
  );
};

export default UnreadMessageCount;
