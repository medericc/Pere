"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/posts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (username && password) {
      login(username);
      router.push("/dashboard");
    } else {
      alert("Please enter both username and password.");
    }
  };

  const closeModal = (e) => {
    
    if (e.target.id === "modal-overlay") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="mb-20 px-5 md:px-0">
        <div
          onClick={() => setShowModal(true)} // Un seul clic ouvre la modale
          className="h-[250px] md:h-[600px] rounded-md relative cursor-pointer"
        >
          <Image src={"/images/hero.png"} alt="hero image" sizes="100vh" fill />
          <div className="absolute -bottom-8 bg-white dark:bg-[#242535] p-6 ml-10 rounded-lg shadow-lg max-w-[80%] md:max-w-[40%]">
            <p className="text-xs bg-blue-700 w-fit py-1 px-2 text-white rounded-md mb-1">
              Technology
            </p>
            <h2 className="text-base md:text-3xl font-bold">
              The Impact of Technology on the Workplace: How Technology is
              Changing
            </h2>
            <p className="text-sm mt-4">Jason Francisco | August 20, 2022</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-5">
        {posts.map((p, idx) => (
          <Link
            key={idx}
            href={`/blog/${p.slug}`}
            className="p-4 group rounded-lg border w-[392px] border-gray-200 dark:border-gray-700"
          >
            <div className="h-60 w-full relative overflow-hidden rounded-md object-cover group-hover:scale-105 duration-300 transition-all">
              <Image
                src={p.thumbnail}
                alt={`${p.title} - thumbnail`}
                sizes="100vh"
                fill
              />
            </div>
            <p className="text-sm bg-gray-100 dark:bg-gray-700/95 text-blue-700 dark:text-blue-500 font-semibold my-4 w-fit px-2 py-1 rounded-sm">
              {p.category}
            </p>
            <h2 className="text-2xl leading-7 font-bold py-1 line-clamp-2">
              {p.title}
            </h2>
            <div className="text-gray-500 flex text-base space-x-10 py-3">
              <div>{p.author}</div>
              <div>{p.date}</div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />

      {/* Modal */}
      {showModal && (
        <div
          id="modal-overlay"
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-[#242535] p-8 rounded-md shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl mb-4 font-bold">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-6 border rounded-md dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
