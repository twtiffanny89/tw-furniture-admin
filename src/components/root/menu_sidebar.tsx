import { useState, useEffect } from "react";
import { slideBarData } from "@/constants/data/slide_bar_data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuSidebar = () => {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  function onNavigation(item: string) {
    if (item == "/logout") {
    } else {
      setActiveHref(item);
    }
  }

  return (
    <div className="bg-gray-700 w-20 lg:w-[16%] xl:w-[14%] overflow-y-scroll px-4  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className="h-20" />
      <div data-aos="fade-right" className=" ">
        <div className="text-sm flex flex-col space-y-4 text-gray-300">
          {slideBarData.map((section, index) => (
            <div className="flex flex-col gap-2" key={section.title + index}>
              <span className="hidden lg:block text-white font-light">
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
                    className={`flex mb-2 lg:mb-0 items-center justify-center lg:justify-start gap-2 py-1 md:px-1.5 rounded-md transition-colors ${
                      isActive
                        ? "text-white font-semibold bg-blue-500 shadow-md" // Active background blue-500
                        : "text-gray-400 hover:text-white hover:bg-blue-500 hover:bg-opacity-30" // Hover effect with blue-500
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
    </div>
  );
};

export default MenuSidebar;
