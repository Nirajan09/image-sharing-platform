"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../authContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { token, userId, logout, loading } = useAuth();

  const menuItems = [
    { label: "Home", path: "/", show: true },
    { label: "Register", path: "/auth/sign-up", show: !userId },
    { label: "Login", path: "/auth/sign-in", show: !userId },
    { label: "Media", path: "/dashboard/media", href:"/dashboard/media?page=1", show: userId },
    { label: "Upload Image", path: "/dashboard/upload", show: userId },
    { label: "Uploaded Image", path: `/dashboard/media/${userId}`, show: userId },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  const isActive = (path) => {
    if (path === "/") return pathName === "/";
    if (path === "/dashboard/media") return pathName === "/dashboard/media";
    return pathName.startsWith(path);
  };
  const renderMenuItems = () =>
    menuItems.map(
      (item) =>
        item.show && (
          <Link
            key={item.label}
            href={item.href||item.path}
            onClick={() => setMenuOpen(false)}
            className={`relative hover:text-[#3B28CC] ${
              isActive(item.path)
                ? "bg-[#3B28CC] text-white px-2 py-1 hover:text-white"
                : ""
            }`}
          >
            {item.label}
          </Link>
        )
    );

  return (
    <header className="w-full px-4 h-[4rem] border-b-[#3B28CC] text-gray shadow-md relative z-50">
      <div className="max-w-9xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b] select-none">Pixify.</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-xl font-bold text-[#1e293b]">
          {renderMenuItems()}
          {token && (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
            >
              Logout
            </Button>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Slide-in Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 border-b-[#3B28CC] bg-white p-6 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold select-none">Menu</h2>
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 text-base font-bold justify-center items-center ">
          {renderMenuItems()}
          {token && (
            <Button
              onClick={() => {
                setOpenDialog(true);
                setMenuOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 w-full text-white mt-4 text-sm cursor-pointer"
            >
              Logout
            </Button>
          )}
        </nav>
      </div>

      {/* Optional overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account and redirected to the login
              page. You can always log in again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleLogout}>
              {loading ? "Logging Out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
