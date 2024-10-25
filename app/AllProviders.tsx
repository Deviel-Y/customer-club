"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

const AllProviders = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default AllProviders;
