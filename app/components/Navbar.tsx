"use client";

import { Avatar } from "@nextui-org/react";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-end items-center p-5">
      <Avatar
        alt="Profile Avater"
        fallback="?"
        size="lg"
        isBordered
        color="primary"
      />
    </div>
  );
};

export default Navbar;
