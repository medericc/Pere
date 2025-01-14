"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [{ displayName: "Blog", herf: "/blog" }];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogoClick = () => {
    if (pathname === "/blog") {
      router.push("/"); // Redirige vers la page d'accueil si sur /blog
    } else if (pathname === "/") {
      setShowModal(true); // Affiche la modale si déjà sur la page d'accueil
    }
  };

  return (
    <>
      <header className="flex justify-between items-center py-9 px-5 md:px-0">
        <div onClick={handleLogoClick} className="cursor-pointer flex space-x-2 items-center">
          <Image
            src={theme === "light" ? "/light-union.svg" : "/dark-union.svg"}
            width={36}
            height={36}
            alt="logo"
            priority
          />
          <div className="text-2xl">
            Meta<span className="font-bold">Blog</span>
          </div>
        </div>
        <div className="flex space-x-10">
          <nav className="space-x-10">
            {links.map((l, idx) => (
              <Link href={l.herf} key={idx}>
                {l.displayName}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            className="focus:outline-none"
            aria-label="Toggle theme"
          >
            <Image
              src={theme === "light" ? "/light-toggle.svg" : "/dark-toggle.svg"}
              alt="theme toggle"
              width={48}
              height={28}
              priority
            />
          </button>
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#242535] p-8 rounded-md shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl mb-4 font-bold">Welcome Modal</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You have clicked on the logo.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
