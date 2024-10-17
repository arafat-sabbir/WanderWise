import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section
      id={id}
      className={cn("max-w-5xl 2xl:max-w-5xl mx-auto", className)}
    >
      {children}
    </section>
  );
};

export default Container;
