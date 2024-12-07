import React from "react";
import Input from "../custom/input";
import Button from "../custom/button";

const Header = () => {
  return (
    <div className="p-4 bg-white">
      <h1 className="font-bold text-xl">User Profile</h1>
      <div className="flex mt-2 ">
        <div className="flex flex-1 gap-2">
          <Input className="max-w-md h-9" />
          <Button className="w-9 h-9 "></Button>
          <Button className="px-4 h-9  font-normal text-xs">Export</Button>
        </div>
        <Button className="px-4 h-9 ml-2 font-normal text-xs">+ Add New</Button>
      </div>
    </div>
  );
};

export default Header;
