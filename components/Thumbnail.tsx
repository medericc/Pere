"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IPost {
  slug: string;
  thumbnail: string;
}

export default function Thumbnail() {
  const [post, setPost] = useState<IPost | null>(null);
  const router = useRouter();
  const { slug } = router.query; // Assurez-vous que le paramètre "slug" correspond bien à votre route dynamique.

  useEffect(() => {
    if (slug) {
      fetch(`/api/articles/${slug}`)
        .then((response) => response.json())
        .then((data) => setPost(data))
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [slug]);

  return (
    <div className="h-[250px] md:h-[500px] mb-10 overflow-hidden rounded-lg relative">
      <Image
        src={post?.thumbnail || "/images/hero.png"}
        alt="Thumbnail image"
        fill
        sizes="100vh"
      />
    </div>
  );
}
