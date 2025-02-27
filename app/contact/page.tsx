"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

const Contact = () => {
  const [masses, setMasses] = useState<{ date: string; time: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i);
      return {
        date: format(date, 'EEEE, d MMMM yyyy'), // Format: "Day, Date Month Year"
        time: '10:00 AM' // Example mass time
      };
    });
    setMasses(next7Days);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    alert('Message envoyé!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Paroisse Saint François-Xavier - Navarrenx</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Responsable</h2>
          <p>Abbé</p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Adresse</h2>
          <p>Presbytère,<br />Place Darralde<br />Navarrenx, 64190</p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Téléphone</h2>
          <p>05.59.66.50.59</p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Mail</h2>
          <p>paroissenavarrenx64@gmail.com</p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Horaires des Messes</h2>
          <ul className="list-disc list-inside">
            {masses.map((mass, index) => (
              <li key={index}>
                {mass.date} à {mass.time}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Formulaire de Contact</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">Nom</label>
              <input
                className="input input-primary w-full"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                className="input input-primary w-full"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
              <textarea
                className="textarea textarea-primary w-full"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;