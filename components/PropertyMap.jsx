"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Map, Marker } from "react-map-gl";
import { setDefaults, fromAddress } from "react-geocode";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import pin from "@/public/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(null);
  const [err, setErr] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "us", // Default region for responses.
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );
        if (res.results.length === 0) {
          setErr(true);
          setLoading(false);
          return;
        }
        const { lat, lng } = res.results[0].geometry.location;

        console.log(lat, lng);
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
        setLoading(false);
      } catch (error) {
        setErr("No location found...");
        console.log(error);
      }
    };

    fetchCoords();
  }, []);
  return (
    // {err}
    err ? (
      <p className="text-xl">{err}</p>
    ) : (
      !loading &&
        !err(
          <div>
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
              mapLib={import("mapbox-gl")}
              initialViewState={{
                longitude: lng,
                latitude: lat,
                zoom: 15,
              }}
              style={{
                width: "100%",
                height: 500,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
            >
              <Marker longitude={lng} latitude={lat} anchor="bottom">
                <Image src={pin} alt="location" width={40} height={40} />
              </Marker>
            </Map>
          </div>
        )
    )
  );
};

export default PropertyMap;
