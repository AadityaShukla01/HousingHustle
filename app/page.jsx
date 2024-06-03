import React from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HomeProperties from "@/components/HomeProperties";
import connectDB from "@/config/database";

const HomePage = () => {
  return (
    <>
      <Hero />
      <HomeProperties />
      <Footer />
    </>
  );
};

export default HomePage;
