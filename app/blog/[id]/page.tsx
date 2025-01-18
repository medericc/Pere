"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useParams } from "next/navigation";
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

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { categories } = useCategoryContext();
  const flattenedCategories = categories.flat().filter((category: any) => category.id && category.name);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;

      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        console.log("article data", data);

        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Article not found.</p>
      </div>
    );
  }

  const category = flattenedCategories.find((cat) => cat.id === article.category_id);
  const categoryName = category ? category.name : "Uncategorized";
  const publishedAt = article.published_at ? new Date(article.published_at) : null;
  const formattedDate = publishedAt && !isNaN(publishedAt.getTime()) 
    ? publishedAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : "Invalid Date";

  return (
    <div>
      <Header />
      <div className="mb-20 px-5 md:px-0">
        <div className="h-[250px] md:h-[600px] rounded-md relative cursor-pointer">
          <Image 
            src={article.image_path || "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2607&q=80"}
            alt={article.title}
            fill
            className="object-cover rounded-md"
            priority
          />
          <div className="absolute -bottom-8 bg-white dark:bg-[#242535] p-6 ml-10 rounded-lg shadow-lg max-w-[80%] md:max-w-[40%]">
            <p className="text-xs bg-blue-700 w-fit py-1 px-2 text-white rounded-md mb-1">
              {categoryName}
            </p>
            <h2 className="text-base md:text-3xl font-bold">
              {article.title}
            </h2>
            <p className="text-sm mt-4 line-clamp-3">
              {article.content && article.content.length > 150 ? article.content.substring(0, 150) + "..." : article.content}
            </p>
            <p className="text-sm mt-4">
              {article.author_username || "Unknown Author"} | {formattedDate}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}