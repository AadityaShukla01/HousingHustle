"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyHeader from "@/components/PropertyHeader";
import Link from "next/link";
import {
  FaBed,
  FaRulerCombined,
  FaBath,
  FaMoneyBill,
  FaMapMarker,
  FaArrowLeft,
  FaTimes,
  FaCheck,
  FaShare,
} from "react-icons/fa";
import PropertyImages from "@/components/PropertyImages";
import PropertyMap from "@/components/PropertyMap";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButton from "@/components/ShareButton";
import MessageForm from "@/components/MessageForm";

async function fetchproperty(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${id}`,
      {
        cache: "no-store",
      }
    );
    // console.log(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${id}`);
    if (!res.ok) {
      throw new Error("FAILED TO FETCH DATA..");
    }
    // console.log(res);

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchpropertyData = async () => {
      try {
        const property = await fetchproperty(id);
        setProperty(property);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (property == null) {
      fetchpropertyData();
    }
  }, [id, property]);

  if (!property && !loading) {
    return (
      <h1 className="text-center mt-10 text-2xl">No property found....</h1>
    );
  }
  return (
    <>
      {!loading && property && (
        <>
          <PropertyHeader image={property.images[0]} />
          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/properties"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Properties
              </Link>
            </div>
          </section>
          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
                <main>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                    <div className="text-gray-500 mb-4">{property.type}</div>
                    <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
                    <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                      <FaMapMarker className="inline mr-2 text-red-700 mt-1" />
                      <p className="text-orange-700">
                        {property.location.street}, {property.location.city}{" "}
                        {property.location.state}
                      </p>
                    </div>

                    <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
                      Rates & Options
                    </h3>
                    <div className="flex flex-col md:flex-row justify-around">
                      <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                        <div className="text-gray-500 mr-2 font-bold">
                          Nightly
                        </div>
                        <div className="text-2xl font-bold">
                          {property.rates.nightly ? (
                            <div className="text-2xl font-bold text-blue-500">
                              ${`${property.rates.nightly}`}
                            </div>
                          ) : (
                            <FaTimes />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                        <div className="text-gray-500 mr-2 font-bold">
                          Weekly
                        </div>
                        <div className="text-2xl font-bold">
                          {property.rates.weekly ? (
                            <div className="text-2xl font-bold text-blue-500">
                              ${`${property.rates.weekly}`}
                            </div>
                          ) : (
                            <FaTimes />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
                        <div className="text-gray-500 mr-2 font-bold">
                          Monthly
                        </div>{" "}
                        <div className="text-2xl font-bold">
                          {property.rates.monthly ? (
                            <div className="text-2xl font-bold text-blue-500">
                              ${`${property.rates.monthly}`}
                            </div>
                          ) : (
                            <FaTimes />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-lg font-bold mb-6">
                      Description & Details
                    </h3>
                    <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
                      <p>
                        <FaBed className="inline mr-2" /> {property.beds}
                        <span className="hidden sm:inline"> Beds</span>
                      </p>
                      <p>
                        <FaBath className="inline mr-2" /> {property.baths}
                        <span className="hidden sm:inline"> Baths</span>
                      </p>
                      <p>
                        <FaRulerCombined className="inline mr-2" />
                        {property.square_feet}
                        <span className="hidden sm:inline"> sqft</span>
                      </p>
                    </div>
                    <p className="text-gray-500 my-4 text-center">
                      {property.description}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-lg font-bold mb-6">Amenities</h3>

                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none">
                      {property.amenities.map((item, index) => (
                        <li key={index}>
                          <div className="flex flex-row items-center">
                            <div>
                              <FaCheck className="inline text-green-600 mr-2" />{" "}
                            </div>
                            <div>{item}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <div id="map">
                      <PropertyMap property={property} />
                    </div>
                  </div>
                </main>

                {/* <!-- Sidebar --> */}
                <aside className="space-y-4">
                  <BookmarkButton property={property} />
                  <ShareButton property={property} />

                  {/* <!-- Contact Form --> */}
                  <MessageForm property={property} />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
        </>
      )}
    </>
  );
};

export default PropertyPage;
