import React, { useState } from "react";

export default function NameEntry({ onStart }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim());
      onStart?.(); // Lance le jeu
    }
  };

  return (
    <form className="name-entry" onSubmit={handleSubmit}>
      <label>Entrez votre pseudo :</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre pseudo"
      />
      <button type="submit">Jouer</button>
    </form>
  );
}
