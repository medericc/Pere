// src/app/privacy/page.tsx
"use client";

import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
     <p className="mb-4">
  Date d’effet : {new Date().toLocaleDateString()}
</p>


      <p className="mb-4">
        Cette application mobile (&#34;Trivia Biblique&#34;) respecte la vie privée de ses utilisateurs et ne collecte, ne stocke ni ne partage aucune donnée personnelle ou sensible.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">1. Collecte de données</h2>
      <p className="mb-4">
        L’application ne collecte aucune information personnelle identifiable (comme le nom, l’adresse, l’adresse e-mail ou l’emplacement) ni aucune donnée sur l’utilisation de l’appareil.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">2. Utilisation des données</h2>
      <p className="mb-4">
        Aucune donnée n’est collectée, utilisée ou partagée.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">3. Sécurité</h2>
      <p className="mb-4">
        Aucune donnée n’étant collectée, aucune mesure particulière de sécurité n’est nécessaire.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">4. Publicité et suivi</h2>
      <p className="mb-4">
        L’application ne contient pas de publicité et n’effectue aucun suivi des utilisateurs.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">5. Enfants</h2>
      <p className="mb-4">
        Cette application est conçue pour tous les publics, y compris les enfants de moins de 13 ans, et ne collecte aucune donnée personnelle.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">6. Modifications</h2>
      <p className="mb-4">
        Si des modifications sont apportées à cette politique, elles seront publiées sur cette page et mises à jour dans l’application.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-4">7. Contact</h2>
      <p className="mb-4">
        Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à l’adresse suivante :
      </p>
      <p className="mb-4">
        📧 paroissenavarrenx64@gmail.com
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
