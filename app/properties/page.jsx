"use client";

import React, { useEffect, useState } from "react";
// import properties from "@/properties.json";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";

const PropertiesPage = async () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties?page=${page}&pageSize=${pageSize}`
        );
        const data = await res.json();
        setProperties(data.properties);
        setTotalItems(data.total);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProperties();
  }, [page, pageSize]);

  // console.log(properties);
  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          {properties?.length === 0 ? (
            <p>No properties.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((item, index) => (
                <PropertyCard key={index} property={item} />
              ))}
            </div>
          )}
          <Pagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </>
  );
};

export default PropertiesPage;
