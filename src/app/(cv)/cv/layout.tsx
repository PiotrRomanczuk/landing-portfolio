"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function CVLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setTheme } = useTheme();

  // Force light theme so print/PDF gets white canvas (no black margins)
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return <>{children}</>;
}
