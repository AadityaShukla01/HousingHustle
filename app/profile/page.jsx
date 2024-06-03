"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import profileDefault from "@/public/images/profile.png";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profilePic = session?.user?.image;

  const [properties, setProperties] = useState([]);
  //initialised with null array & not null because we will receive an array of properties
  const [loading, setLoading] = useState(false);

  //fetch data so we need useEffect
  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/user/${userId}`
        );

        if (res.ok) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    //fetch only if u have session available else not possible
    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // remove the property from UI
        const updatedProperties = properties.filter((item) => item._id != id);

        setProperties(updatedProperties);
        toast.success("Property deleted successfully...");
      } else {
        toast.error("Failed to delete property....");
      }
    } catch (error) {
      toast.error("Failed to delete property....");
    }
  };
  return (
    <div>
      <section className="bg-blue-50">
        <div className="container m-auto py-24">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 mx-20 mt-10">
                <div className="mb-4">
                  <Image
                    className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                    src={profilePic || profileDefault}
                    alt="User"
                    width={20}
                    height={20}
                  />
                </div>
                <h2 className="text-2xl mb-4">
                  <span className="font-bold block">Name: </span>{" "}
                  {session?.user?.name}
                </h2>
                <h2 className="text-2xl">
                  <span className="font-bold block">Email: </span>{" "}
                  {session?.user?.email}
                </h2>
              </div>

              <div className="md:w-3/4 md:pl-4">
                <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
                {!loading &&
                  properties.length > 0 &&
                  properties.map((item) => (
                    <div className="mb-10">
                      <Link href={`/properties/${item._id}`}>
                        <Image
                          className="h-32 w-full rounded-md object-cover"
                          src={item.images[0]}
                          alt="Property 1"
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      </Link>
                      <div className="mt-2">
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-gray-600">
                          <b> Address:</b>{" "}
                          {item.location.street +
                            "," +
                            item.location.city +
                            " " +
                            item.location.state}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link
                          href={`/properties/${item._id}/edit`}
                          className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </Link>
                        <button
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                          type="button"
                          onClick={() => deleteHandler(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
