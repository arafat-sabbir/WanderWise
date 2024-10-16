import { House } from "lucide-react";
import Link from "next/link";

const BackToHome = () => {
  return (
    <Link
      href={"/"}
      className="absolute top-20 left-20 flex gap-1 hover:text-primary transition duration-300 text-xl items-center"
    >
      <House />
      Home
    </Link>
  );
};

export default BackToHome;
