"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = searchParams.get("location");
  const propertyType = searchParams.get("propertyType");
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/search?location=${location}&propertyType=${propertyType}`
        );

        if (res.ok) {
          setProperties(await res.json());
        } else {
          toast.error("Unable to search for properties....");
        }
      } catch (error) {
        toast.error("Unable to search for properties....");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location, propertyType]);
  console.log(properties);
  return (
    <>
      <section class="px-4 py-6">
        <div class="container-xl lg:container m-auto px-4 py-6">
          <Link
            href={"/"}
            className="flex gap-3 items-center mb-4 text-blue-600 text-xl"
          >
            <FaLongArrowAltLeft />
            Back to home page
          </Link>
          {properties.length === 0 ? (
            <p className="text-center text-2xl">No properties.</p>
          ) : (
            <>
              <h1 className="text-2xl text-center mb-4 font-bold">Search results</h1>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((item) => (
                  <PropertyCard key={item._id} property={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResults;
