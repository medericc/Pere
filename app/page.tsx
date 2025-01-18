"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCategoryContext } from "@/components/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  category_id: number;
  author_username?: string;
  published_at?: string;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  
  const { user, login } = useAuth();
  const router = useRouter();
  const { categories } = useCategoryContext();
  const flattenedCategories = categories.flat().filter((category: any) => category.id && category.name);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        console.log("data", data);
        
        const articlesWithDefaultDate = data.map((article: Article) => ({
          ...article,
          published_at: article.published_at || "1970-01-01T00:00:00.000Z",
        }));

        setArticles(articlesWithDefaultDate);
        setFilteredArticles(articlesWithDefaultDate);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    let updatedArticles = articles;

    if (selectedCategory) {
      updatedArticles = updatedArticles.filter(article => article.category_id === selectedCategory);
    }

    if (sortOrder === "recent") {
      updatedArticles.sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());
    } else {
      updatedArticles.sort((a, b) => new Date(a.published_at!).getTime() - new Date(b.published_at!).getTime());
    }

    setFilteredArticles(updatedArticles);
  }, [selectedCategory, sortOrder, articles]);

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
          login(data);
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

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modal-overlay") {
      setShowModal(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleSortOrderChange = (order: "recent" | "oldest") => {
    setSortOrder(order);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const latestArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div>
      <Header setShowModal={setShowModal} />
      {latestArticle && (
        <div className="mb-20 px-5 md:px-0">
          <div className="h-[250px] md:h-[600px] rounded-md relative cursor-pointer">
            <Image 
              src={latestArticle.image_path || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2607&q=80"}
              alt={latestArticle.title}
              fill
              className="object-cover rounded-md"
              priority
            />
            <div className="absolute -bottom-8 bg-white dark:bg-[#242535] p-6 ml-10 rounded-lg shadow-lg max-w-[80%] md:max-w-[40%]">
              <p className="text-xs bg-blue-700 w-fit py-1 px-2 text-white rounded-md mb-1">
                {flattenedCategories.find(cat => cat.id === latestArticle.category_id)?.name || "Uncategorized"}
              </p>
              <h2 className="text-base md:text-3xl font-bold">
                {latestArticle.title}
              </h2>
              <p className="text-sm mt-4">{latestArticle.author_username || "Unknown Author"} | {new Date(latestArticle.published_at!).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8 px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {flattenedCategories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full border ${selectedCategory === category.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} dark:bg-gray-700 dark:text-white`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name.length > 3 ? category.name.slice(0, 3) : category.name}
            </button>
          ))}
          <button
              className={`px-4 py-2 rounded-full border ${selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} dark:bg-gray-700 dark:text-white`}
              onClick={() => handleCategoryClick(null)}
            >
              Tout
            </button>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-full border ${sortOrder === "recent" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} dark:bg-gray-700 dark:text-white`}
            onClick={() => handleSortOrderChange("recent")}
          >
            Récents
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${sortOrder === "oldest" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} dark:bg-gray-700 dark:text-white`}
            onClick={() => handleSortOrderChange("oldest")}
          >
            Moins récents
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-5 max-w-7xl mx-auto px-4">
        {remainingArticles.map((article) => {
          const category = flattenedCategories.find((cat) => cat.id === article.category_id);
          const categoryName = category ? category.name : "Uncategorized";
          console.log(`Article ID: ${article.id}, published_at: ${article.published_at}`);
          const publishedAt = article.published_at ? new Date(article.published_at) : null;
          console.log(`Converted Date for Article ID: ${article.id}, Date: ${publishedAt}`);
          const formattedDate = publishedAt && !isNaN(publishedAt.getTime()) 
            ? publishedAt.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : "Invalid Date";

          return (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="p-4 group rounded-lg border w-full max-w-[392px] border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-md">
                <img
                  src={article.image_path || "/images/placeholder.jpg"}
                  alt={article.title}
                  className="object-cover w-full h-full rounded-md transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <p className="text-sm bg-gray-100 dark:bg-gray-700/95 text-blue-700 dark:text-blue-500 font-semibold my-4 w-fit px-2 py-1 rounded-sm">
                {categoryName}
              </p>
              <h2 className="text-2xl leading-7 font-bold py-1 line-clamp-2">
                {article.title}
              </h2>
              <div className="text-gray-500 flex text-base space-x-10 py-3">
                <div>{article.author_username || "Unknown Author"}</div>
                <div>{formattedDate}</div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <Footer />
      
      {showModal && (
        <div
          id="modal-overlay"
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
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
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
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