"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

import data from "@/data/articles.json";

interface Article {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  category_id: number;
  author_username?: string;
  published_at?: string;
}

interface Category {
  id: number;
  name: string;
}

const categoriesData: Category[] = [
  { id: 1, name: "Pères apostoliques" },
  { id: 2, name: "Apologistes" },
  { id: 3, name: "Grec" },
  { id: 4, name: "Latins" },
  { id: 5, name: "Désert" },
  { id: 6, name: "Docteurs" },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const articlesData = data.map((article) => ({
          ...article,
          published_at: article.published_at || "1970-01-01T00:00:00.000Z",
        }));

        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterAndSearchArticles = (articles: Article[]) => {
    let updatedArticles = articles;

    if (selectedCategory !== null) {
      updatedArticles = updatedArticles.filter(
        (article) => article.category_id === selectedCategory
      );
    }

    if (searchTerm !== "") {
      updatedArticles = updatedArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return updatedArticles;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const latestArticle = articles.reduce((prev, current) =>
    prev.id > current.id ? prev : current
  );

  const filteredArticles = filterAndSearchArticles(
    articles.filter((article) => article.id !== latestArticle.id)
  );

  return (
    <div>
      <Header />
      
      {/* Sélection du dernier article (ID le plus élevé) */}
      {articles.length > 0 && (
        <div className="mb-20 px-5 md:px-0">
          <Link href={`/blog/${latestArticle.id}`} className="h-[250px] md:h-[600px] rounded-md relative cursor-pointer block">
            <Image
              src={latestArticle.image_path || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2607&q=80"}
              alt={latestArticle.title}
              fill
              className="object-cover rounded-md"
              priority
            />
            <div className="absolute -bottom-8 bg-white dark:bg-[#242535] p-5 ml-10 rounded-lg shadow-lg max-w-[80%] md:max-w-[40%]">
              <p className="text-xs bg-blue-700 w-fit py-1 px-2 text-white rounded-md mb-1">
                {categories.find(cat => cat.id === latestArticle.category_id)?.name || "Uncategorized"}
              </p>
              <h2 className="text-base md:text-3xl font-bold">
                {latestArticle.title}
              </h2>
              <p className="text-sm mt-3 line-clamp-3">
                {latestArticle.content.length > 150
                  ? latestArticle.content.substring(0, 150) + "..."
                  : latestArticle.content}
              </p>
              <p className="text-xs mt-4">
                {latestArticle.author_username || "Unknown Author"} | {new Date(latestArticle.published_at!).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Link>
        </div>
      )}
  
      {/* Menu déroulant de filtrage */}
      <div className="mb-8 px-4">
        <div className="flex justify-center mb-4">
          <select
            className="px-4 py-2 rounded-full border w-full max-w-md"
            value={selectedCategory ?? ""}
            onChange={(event) => handleCategoryClick(Number(event.target.value) || null)}
          >
            <option value="">Tout</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 rounded-full border w-full max-w-md"
          />
        </div>
      </div>
  
      {/* Liste des articles sauf le dernier */}
      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-5 max-w-7xl mx-auto px-4">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.id}`}
            className="p-4 group rounded-lg border w-full max-w-[392px] border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-60 w-full overflow-hidden rounded-md">
              <img
                src={article.image_path || "/images/placeholder.jpg"}
                alt={article.title}
                className="object-cover w-full h-full rounded-md transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-2xl leading-7 font-bold py-1 line-clamp-2 mt-2">
              {article.title}
            </h2>
            <p className="text-sm mt-2 line-clamp-3">
              {article.content.length > 150
                ? article.content.substring(0, 150) + "..."
                : article.content}
            </p>
          </Link>
        ))}
      </div>
  
      <Footer />
    </div>
  );
}