"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category: number;
  author_username: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: 1, // Valeur par défaut pour la catégorie
    thumbnail: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Récupère les articles et les catégories
  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/categories")
        ]);

        if (!articlesRes.ok) throw new Error("Erreur lors de la récupération des articles");
        if (!categoriesRes.ok) throw new Error("Erreur lors de la récupération des catégories");

        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();

        // Vérification des catégories
        console.log('Catégories récupérées avant aplatissement:', categoriesData);

        // Aplatir les catégories et extraire uniquement les objets valides
        const validCategories = categoriesData.flat().filter((category: any) => category.id && category.name);

        // Vérification des catégories filtrées
        console.log('Catégories récupérées après extraction des noms:', validCategories);

        // Vérification des articles pour s'assurer que chaque article a un category valide
        const validArticles = articlesData.map((article: Article) => ({
          ...article,
          category: article.category || 1 // Valeur par défaut si category est indéfini
        }));

        setArticles(validArticles);
        setCategories(validCategories);  // Mettez à jour avec les catégories filtrées
      } catch (error) {
        console.error("Erreur de récupération:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'upload de l'image");
        }

        const result = await res.json();
        const imageUrl = result.imageUrl; // L'URL de l'image renvoyée par le backend

        if (isEditing) {
          setEditArticle({ ...editArticle!, thumbnail: imageUrl });
        } else {
          setNewArticle({ ...newArticle, thumbnail: imageUrl });
        }
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing 
        ? `/api/articles?id=${editArticle?.id}` 
        : "/api/articles";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { ...editArticle }
            : { ...newArticle, author_username: user?.username }
        ),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'article");

      const updatedArticle = await res.json();

      if (isEditing) {
        setArticles(prev =>
          prev.map(article => article.id === updatedArticle.id ? updatedArticle : article)
        );
      } else {
        setArticles(prev => [...prev, updatedArticle]);
      }

      setNewArticle({
        title: "",
        content: "",
        category: 1,
        thumbnail: ""
      });
      setIsEditing(false);
      setEditArticle(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'article");

      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (article: Article) => {
    setIsEditing(true);
    setEditArticle(article);
    setNewArticle({
      title: article.title,
      content: article.content,
      category: article.category || 1, // Utiliser 1 comme valeur par défaut si category est indéfini
      thumbnail: article.thumbnail || "",
    });
  };

  const getCategoryName = (categoryId: number | undefined) => {
    console.log("cat=", categoryId);
    if (categoryId === undefined) {
      return "Non classé";
    }
    return categories.find(cat => cat.id === categoryId)?.name || "Non classé";
  };

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
        </h2>

        <input
          type="text"
          placeholder="Titre"
          value={isEditing ? editArticle?.title || "" : newArticle.title}
          onChange={(e) =>
            isEditing
              ? setEditArticle({ ...editArticle!, title: e.target.value })
              : setNewArticle({ ...newArticle, title: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />

        <textarea
          placeholder="Contenu"
          value={isEditing ? editArticle?.content || "" : newArticle.content}
          onChange={(e) =>
            isEditing
              ? setEditArticle({ ...editArticle!, content: e.target.value })
              : setNewArticle({ ...newArticle, content: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md min-h-[200px] dark:bg-gray-700 dark:border-gray-600"
          required
        />

        <select
          value={isEditing ? editArticle?.category || 1 : newArticle.category}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            isEditing
              ? setEditArticle({ ...editArticle!, category: value })
              : setNewArticle({ ...newArticle, category: value });
          }}
          className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          {categories.length > 0 ? (
            categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Aucune catégorie disponible</option>
          )}
        </select>

        {isEditing && editArticle?.thumbnail && (
          <div className="mb-4">
            <img
              src={editArticle.thumbnail}
              alt="Image actuelle"
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Image actuelle</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 mb-4 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Modifier" : "Créer"}
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tous les articles</h2>
        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md"
            >
              {article.thumbnail && (
                <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Auteur : {article.author_username || "Auteur inconnu"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Catégorie : {getCategoryName(article.category)}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(article)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}