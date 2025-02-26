"use client";

import Link from "next/link";
import CashImage from "../custom/CashImage";
import { routed } from "@/constants/navigation/routed";

const Navbar = () => {
  return (
    <footer className="flex items-center justify-end px-4 h-14 absolute z-50 left-0 right-0 top-0 bg-white">
      <h1 className="font-bold text-xl">Dashboard</h1>

      <div className="flex items-center gap-2 justify-end w-full">
        <div className="flex flex-col text-gray-700">
          <span className="text-xs leading-3 font-medium">{"TW Store"}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {"Admin"}
          </span>
        </div>
        <Link
          href={`/${routed.userManagement}/${routed.aboutUs}`}
          prefetch={true}
        >
          <CashImage
            width={32}
            height={32}
            borderRadius={16}
            imageUrl="https://picsum.photos/500/500?image=200"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Navbar;
