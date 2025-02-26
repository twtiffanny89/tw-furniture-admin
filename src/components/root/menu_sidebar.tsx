"use client";

import { useState, useEffect } from "react";
import { slideBarData } from "@/constants/data/slide_bar_data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModalConfirmLogout from "../modal/modal_confirm_logout";
import { routed } from "@/constants/navigation/routed";
import { removeAllCookies } from "@/utils/security/token";
import CenteredLoading from "../loading/center_loading";

const MenuSidebar = () => {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  function onNavigation(item: string) {
    if (item == "/logout") {
      setOpenModal(true);
    } else {
      setActiveHref(item);
    }
  }

  function onNavigationLogout() {
    setOpenModal(false);
    setIsLogout(true);
    if (removeAllCookies()) {
      router.replace(`/${routed.login}`);
    }
  }

  return (
    <div className="bg-black w-20 lg:w-[16%] xl:w-[14%] overflow-y-scroll px-4 pt-20  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className=" ">
        <div className="text-sm flex flex-col space-y-4 text-gray-300 pb-20">
          {slideBarData.map((section, index) => (
            <div className="flex flex-col gap-2" key={section.title + index}>
              <span className="hidden lg:block text-white font-light overflow-hidden whitespace-nowrap overflow-ellipsis">
                {section.title}
              </span>
              {section.items.map((item, index) => {
                const isActive = activeHref == item.href;
                return (
                  <Link
                    prefetch={true}
                    href={item.href == "/logout" ? "" : item.href}
                    key={item.label + index}
                    onClick={() => onNavigation(item.href)}
                    className={`flex mb-2 lg:mb-0 items-center justify-center lg:justify-start gap-2 py-1 md:px-1.5 rounded transition-colors ${
                      isActive
                        ? "text-white font-semibold bg-primary shadow-md" // Active background blue-500
                        : "text-white hover:text-white hover:bg-primary opacity-85 hover:bg-opacity-75" // Hover effect with blue-500
                    }`}
                  >
                    {/* Render the icon */}
                    <span className="text-lg lg:text-sm">{item.icon}</span>
                    <span className="text-sm hidden lg:block overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ModalConfirmLogout
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={onNavigationLogout}
      />
      <CenteredLoading loading={isLogout} />
    </div>
  );
};

export default MenuSidebar;
