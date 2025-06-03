"use client";
import { useState } from "react";
import {
  BookType,
  IdCard,
  ScrollText,
  Settings,
  Menu,
  Mails,
  StickyNote,
  X,
  LayoutDashboard,
  LogOut,
  User
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white p-4 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="mb-6">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex flex-col items-center space-y-6 mb-6">
          {/* <Image
            src="/logo/user.png"
            alt="profile-photo"
            width={isOpen ? 100 : 40}
            height={isOpen ? 100 : 40}
            className="rounded-full"
          /> */}
          <User/>
          {isOpen && (
            <h1 className="text-teal-200 font-semibold text-lg text-center">
              Welcome! {"John Doe"}
            </h1>
          )}
        </div>

        <nav className="space-y-2">
          {[
            { href: "/", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/users", icon: LayoutDashboard, label: "Add User" },
            { href: "/certificates", icon: StickyNote, label: "Certificate Generation" },
            { href: "/ids", icon: IdCard, label: "ID Card Generation" },
            { href: "/banners", icon: IdCard, label: "Banner Generation" },
            { href: "/bulkids", icon: IdCard, label: "Bulk ID Card Generation" },
            { href: "/CFP", icon: ScrollText, label: "Call For Paper" },
            { href: "/invitation-card", icon: Mails, label: "Invitation Card Generation" },
            { href: "/abstractbook", icon: BookType, label: "Abstract Book Compilation" },
            { href: "/settings", icon: Settings, label: "Settings" },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <Icon size={22} />
                {isOpen && <span>{label}</span>}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          {isOpen && (
            <button className="bg-red-600 p-2 w-full rounded-full flex items-center justify-center gap-2">
              <LogOut size={20} />
              <span className="font-semibold">Log out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
