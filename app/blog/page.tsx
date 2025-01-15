"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArticleContext, Article } from "@/components/AuthContext";

export default function BlogPage() {
  const { articles, setArticles } = useArticleContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à l'API pour récupérer les articles
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Erreur lors de la récupération des articles.");
        const data: Article[] = await res.json(); // Assurez-vous que l'API renvoie des données compatibles avec le type Article
        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [setArticles]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-5">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.id}`}
            className="p-4 group rounded-lg border w-[392px] border-gray-200 dark:border-gray-700"
          >
            {/* image */}
            <div className="h-60 w-full relative overflow-hidden rounded-md object-cover group-hover:scale-105 duration-300 transition-all">
              <Image
                src={article.thumbnail || "/placeholder.jpg"} // Image par défaut si `thumbnail` est null
                alt={`${article.title} - thumbnail`}
                sizes="100vh"
                fill
              />
            </div>

            {/* category */}
            <p className="text-sm bg-gray-100 dark:bg-gray-700/95 text-blue-700 dark:text-blue-500 font-semibold my-4 w-fit px-2 py-1 rounded-sm">
              {article.category || "Non classé"}
            </p>

            {/* title */}
            <h2 className="text-2xl leading-7 font-bold py-1 line-clamp-2">
              {article.title}
            </h2>

            {/* author and date */}
            <div className="text-gray-500 flex text-base space-x-10 py-3">
              <div>{article.author_username || "Auteur inconnu"}</div>
              <div>{new Date(article.created_at).toLocaleDateString()}</div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
