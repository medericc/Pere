"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams  } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import articlesData from "@/data/articles.json";
import { Button } from "@/components/ui/button";
interface Article {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  link?: string;
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
 

  useEffect(() => {
    if (!id) return;

    const foundArticle = articlesData.find((article) => article.id === Number(id));
    setArticle(foundArticle || null);
    setLoading(false);
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

  return (
    <>
      <Header />
      <div className="px-5 md:px-20 my-10">
        <div className="mb-10 flex justify-center">
  <div className="w-full md:max-w-3xl mx-auto">
    <Image
      src={
        article.image_path ||
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=2607&q=80"
      }
      alt={article.title}
      width={1600}
      height={900}
      className="w-full h-auto rounded-lg object-cover"
      priority
    />
  </div>
</div>

        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">{article.title}</h1>
        <p className="text-base md:text-lg">{article.content}</p>
        {article.link && (
          <div className="mt-6 flex justify-center">
             {article.link && (
          <div className="mt-2 flex justify-center">
            <Button
              asChild
              className="text-lg px-8 py-4 md:text-xl md:px-10 md:py-5"
            >
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Voir le livre en entier
              </a>
            </Button>
          </div>
        )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
