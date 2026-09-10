"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DynamicRouteButtonProps = Omit<ButtonProps, "children"> & {
  children: string;
};

export default function DynamicRouteButton({
  children,
  ...props
}: DynamicRouteButtonProps) {
const routeChildren = children.toLowerCase();
  const router = useRouter();

  const handleClick = () => {
    router.push(routeChildren);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
