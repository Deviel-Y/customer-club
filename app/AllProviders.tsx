"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

const AllProviders = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <NextUIProvider>{children}</NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default AllProviders;
