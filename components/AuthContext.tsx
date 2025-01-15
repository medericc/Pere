"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Définition des types pour les informations utilisateur et les articles
interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userInfo: User) => void;
  logout: () => void;
}

type Article = {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: string;
  author_username: string;
  created_at: string;
};

type ArticleContextType = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

// Création des contextes
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

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

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook pour utiliser le contexte des articles
export const useArticleContext = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticleContext must be used within an ArticleProvider");
  }
  return context;
};

// Fournisseur combiné pour simplifier l'utilisation
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ArticleProvider>{children}</ArticleProvider>
    </AuthProvider>
  );
};

// Exportation du type Article
export type { Article };
