"use client";
import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import Link from "next/link";

const HomeProperties = async () => {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties`
        );
        const data = await res.json();
        // console.log(data);
        setProperties(data.properties);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperties();
  }, []);

  const recentProperties = properties
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);
  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProperties.length === 0
              ? "No properties found"
              : recentProperties.map((item) => (
                  <PropertyCard property={item} key={item._id} />
                ))}
          </div>
        </div>
      </section>
      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
