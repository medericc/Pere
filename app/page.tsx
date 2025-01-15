"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: string;
  author_username?: string;
  created_at: string;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Changed from username to identifier
  const [password, setPassword] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, login } = useAuth();
  const router = useRouter();

  // Updated login handler
  const handleLogin = async () => {
    if (identifier && password) {
      try {
        const res = await fetch(`/api/login?identifier=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          login(data); // Login with user data
          router.push("/dashboard");
        } else {
          alert("Login failed: Incorrect email/username or password.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter both identifier and password.");
    }
  };

  // Fonction pour fermer la modal
  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modal-overlay") {
      setShowModal(false);
    }
  };

  // Appel à l'API pour récupérer les articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Erreur lors de la récupération des articles.");
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Fermeture de la modal avec Escape
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div>
      <Header setShowModal={setShowModal} />

      {/* Section Hero */}
      <div className="mb-20 px-5 md:px-0">
        <div className="h-[250px] md:h-[600px] rounded-md relative cursor-pointer">
          <Image src="/images/hero.png" alt="Hero image" sizes="100vh" fill />
          <div className="absolute -bottom-8 bg-white dark:bg-[#242535] p-6 ml-10 rounded-lg shadow-lg max-w-[80%] md:max-w-[40%]">
            <p className="text-xs bg-blue-700 w-fit py-1 px-2 text-white rounded-md mb-1">
              Technology
            </p>
            <h2 className="text-base md:text-3xl font-bold">
              The Impact of Technology on the Workplace: How Technology is Changing
            </h2>
            <p className="text-sm mt-4">Jason Francisco | August 20, 2022</p>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-5">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.id}`}
            className="p-4 group rounded-lg border w-[392px] border-gray-200 dark:border-gray-700"
          >
            <div className="h-60 w-full relative overflow-hidden rounded-md object-cover group-hover:scale-105 duration-300 transition-all">
              <Image
                src={article.thumbnail || "/placeholder.jpg"}
                alt={`${article.title} - thumbnail`}
                sizes="100vh"
                fill
              />
            </div>
            <p className="text-sm bg-gray-100 dark:bg-gray-700/95 text-blue-700 dark:text-blue-500 font-semibold my-4 w-fit px-2 py-1 rounded-sm">
              {article.category || "Non classé"}
            </p>
            <h2 className="text-2xl leading-7 font-bold py-1 line-clamp-2">
              {article.title}
            </h2>
            <div className="text-gray-500 flex text-base space-x-10 py-3">
              <div>{article.author_username || "Auteur inconnu"}</div>
              <div>{new Date(article.created_at).toLocaleDateString()}</div>
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
            {user ? (
              <>
                <h2 className="text-2xl mb-4 font-bold">You are logged in!</h2>
                <p className="text-lg mb-6">
                  Do you want to go to your dashboard?
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl mb-4 font-bold">Login</h2>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}