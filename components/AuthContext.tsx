"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Définition des types pour les informations utilisateur, articles et catégories
interface User {
  username: string;
  email: string;
  role: string;
}

type Category = {
  id: number;
  name: string;
};

type Article = {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: number; // Utilisation d'un ID ici
  categoryName?: string; // Ajout d'un champ pour le nom
  author_username: string;
  created_at: string;
};

interface AuthContextType {
  user: User | null;
  login: (userInfo: User) => void;
  logout: () => void;
}

type ArticleContextType = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

type CategoryContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

// Création des contextes
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Fournisseur pour le contexte d'authentification avec persistance
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Erreur lors du parsing des données utilisateur :", error);
        }
      }
    }
  }, []);

  const login = (userInfo: User) => {
    setUser(userInfo);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userInfo)); // Sauvegarde dans localStorage
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); // Supprime les données d'utilisateur
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fournisseur pour le contexte des articles avec persistance
export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedArticles = localStorage.getItem("articles");
      if (savedArticles) {
        try {
          setArticles(JSON.parse(savedArticles));
        } catch (error) {
          console.error("Erreur lors du parsing des articles :", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("articles", JSON.stringify(articles)); // Sauvegarde les articles à chaque modification
    }
  }, [articles]);

  return (
    <ArticleContext.Provider value={{ articles, setArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

// Fournisseur pour le contexte des catégories avec persistance
export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories") // Remplacez par votre endpoint
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur lors du chargement des catégories :", err));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hooks pour utiliser les contextes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticleContext must be used within an ArticleProvider");
  }
  return context;
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
};

// Fournisseur combiné pour simplifier l'utilisation
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ArticleProvider>
        <CategoryProvider>{children}</CategoryProvider>
      </ArticleProvider>
    </AuthProvider>
  );
};

// Exportation des types
export type { Article, Category };
