"use client";

import PropertyCard from "@/components/PropertyCard";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
const SavedProperties = () => {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);

  //fetch users'bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks`
        );

        if (res.ok) {
          const data = await res.json();
          setBookmarks(data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch bookmarks...");
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <>
      <section class="px-4 py-6">
        <div class="container-xl lg:container m-auto px-4 py-6">
          {bookmarks.length === 0 ? (
            <p className="text-xl text-center">No properties.</p>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bookmarks.map((item) => (
                <PropertyCard key={item._id} property={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SavedProperties;
