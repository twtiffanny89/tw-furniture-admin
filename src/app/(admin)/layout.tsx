import "../globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import MenuSidebar from "@/components/root/menu_sidebar";
import Navbar from "@/components/root/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../favicon.ico" />
      </Head>

      <body>
        <Navbar />
        <div className="flex h-screen container">
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
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col pt-16 px-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
