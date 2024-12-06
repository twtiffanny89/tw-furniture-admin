"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import ReduxProvider from "./reduxProvidor";
import Head from "next/head";
import { Inter } from "next/font/google"; // Google Fonts (example)

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../favicon.ico" />
      </Head>
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
