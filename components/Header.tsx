"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogoClick = () => {
    router.push("/"); // Always navigate to the homepage
  };

  return (
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
        BibleEn<span className="font-bold">Main</span>
        </div>
      </div>
      <div className="flex space-x-10">
       
        <button onClick={toggleTheme} className="focus:outline-none" aria-label="Toggle theme">
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
  );
}