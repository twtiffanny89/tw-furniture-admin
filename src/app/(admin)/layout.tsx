"use client";

import { useEffect } from "react";
import "../globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import Aos from "aos";
import MenuSidebar from "@/components/root/menu_sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      easing: "ease-out",
    });
  }, []);
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <body className="flex h-screen container">
        <MenuSidebar />
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col pb-16">
          {children}
        </div>
      </body>
    </html>
  );
}
