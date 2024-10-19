"use client";
import React, { useState } from "react";
import { Menu, User, Info, Phone } from "lucide-react"; // Import the icons
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/features/hooks";
import { logOut, selectCurrentUser } from "@/redux/features/auth/authSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const pathName = usePathname()
  const dispatch = useAppDispatch();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 text-lg font-semibold"
          >
            <Image src="/wise.png" alt="Logo" height={40} width={40} />
            <h1>Wander Wise</h1>
          </Link>

          {/* Navigation Links - hidden on mobile */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
            <Link
              href="/dashboard"
              className={`${pathName==="/dashboard"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <Link
              href="/about"
              className={`${pathName==="/about"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <Info className="w-5 h-5" /> About
            </Link>
            <Link
              href="/contact"
              className={`${pathName==="/contact"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <Phone className="w-5 h-5" /> Contact
            </Link>
            </div>
          </div>

          {/* User Dropdown */}
          {user ? (
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    height={32}
                    width={32}
                    className="h-12 w-12 border-2 rounded-full cursor-pointer"
                    src={user?.profilePicture as string}
                    alt="User avatar"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/dashboard">Manage Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logOut());
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button>
              <Link href="/auth/sign-in">Login</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - hidden by default, shown when menu button is clicked */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className={`${pathName==="/dashboard"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <Link
              href="/about"
              className={`${pathName==="/about"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <Info className="w-5 h-5" /> About
            </Link>
            <Link
              href="/contact"
              className={`${pathName==="/contact"?"text-blue-600":"text-gray-600"} hover:text-gray-900  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2`}
            >
              <Phone className="w-5 h-5" /> Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
