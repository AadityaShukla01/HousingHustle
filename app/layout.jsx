import React from "react";
import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "./utils/AuthProvider.js";
AuthProvider;
import { ContextProvider } from "@/context/MessageContext.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'photoswipe/dist/photoswipe.css'

export const metadata = {
  title: "HousingHustle | Get your dream property",
};

//entry point to our application
//children passed as props are the pages we will render

const layout = ({ children }) => {
  return (
    <ContextProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <Navbar />
            <main>
              <div>{children}</div>
            </main>
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </ContextProvider>
  );
};

export default layout;
