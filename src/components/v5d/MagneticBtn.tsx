"use client";

import type { AnchorHTMLAttributes } from "react";
import { useMagnetic } from "./useMagnetic";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  radius?: number;
  strength?: number;
};

export function MagneticBtn({ radius, strength, children, ...rest }: Props) {
  const ref = useMagnetic<HTMLAnchorElement>({ radius, strength });
  return (
    <a ref={ref} {...rest}>
      {children}
    </a>
  );
}
