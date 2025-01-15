"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: string;
  author_username: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    thumbnail: "",
  });

  // Redirige si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Récupère les articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        // AuthContext : Ajoutez des logs pour vérifier le rôle
console.log("Utilisateur connecté :", user);

        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Erreur lors de la récupération des articles.");
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Gestion de la soumission du formulaire pour la création ou modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/articles/${editArticle?.id}` : "/api/articles";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { ...editArticle }
            : { ...newArticle, author_username: user?.username }
        ),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'article.");

      const updatedArticle = await res.json();

      if (isEditing) {
        setArticles((prev) =>
          prev.map((article) => (article.id === updatedArticle.id ? updatedArticle : article))
        );
      } else {
        setArticles((prev) => [...prev, updatedArticle]);
      }

      setNewArticle({ title: "", content: "", category: "", thumbnail: "" });
      setIsEditing(false);
      setEditArticle(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Gestion de la suppression d'un article
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'article.");

      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Pré-remplit le formulaire pour la modification
  const handleEdit = (article: Article) => {
    setIsEditing(true);
    setEditArticle(article);
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
          className="bg-red-600 text-white px-4 py-2 rounded-md"
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
              ? setEditArticle({ ...editArticle, title: e.target.value } as Article)
              : setNewArticle({ ...newArticle, title: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
          required
        />
        <textarea
          placeholder="Contenu"
          value={isEditing ? editArticle?.content || "" : newArticle.content}
          onChange={(e) =>
            isEditing
              ? setEditArticle({ ...editArticle, content: e.target.value } as Article)
              : setNewArticle({ ...newArticle, content: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={isEditing ? editArticle?.category || "" : newArticle.category}
          onChange={(e) =>
            isEditing
              ? setEditArticle({ ...editArticle, category: e.target.value } as Article)
              : setNewArticle({ ...newArticle, category: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string; // Contient les données en Base64
        if (isEditing) {
          setEditArticle({ ...editArticle, thumbnail: base64Image } as Article);
        } else {
          setNewArticle({ ...newArticle, thumbnail: base64Image });
        }
      };
      reader.readAsDataURL(file); // Convertit en Base64
    }
  }}
  className="w-full p-2 mb-4 border rounded-md"
/>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {isEditing ? "Modifier" : "Créer"}
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Tous les articles</h2>
        <ul>
  {articles.map((article) => (
    <li
      key={article.id}
      className="bg-white dark:bg-gray-700 p-4 rounded-md mb-4 shadow-md"
    >
      <h3 className="text-xl font-bold">{article.title}</h3>
      <p className="text-sm text-gray-500">Auteur : {article.author_username}</p>
      <p className="text-sm text-gray-500">{article.category || "Non classé"}</p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleEdit(article)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDelete(article.id)}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
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
