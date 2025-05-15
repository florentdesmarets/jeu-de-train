import React, { useEffect, useState } from "react";

export default function ScoreBoard({ score }) {
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || 0
  );
  const [topPlayers, setTopPlayers] = useState(
    JSON.parse(localStorage.getItem("highScores")) || []
  );
  const [playerName, setPlayerName] = useState(null); // important: null au départ

  // Charger le pseudo une fois au montage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    } else {
      setPlayerName("Anonyme");
    }
  }, []);

  // Met à jour bestScore et highScores uniquement quand playerName est connu
  useEffect(() => {
    if (!playerName) return; // on attend que playerName soit défini

    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score);
    }

    const existing = topPlayers.find((p) => p.name === playerName);

    if (!existing || score > existing.score) {
      const filtered = topPlayers.filter((p) => p.name !== playerName);
      const updatedScores = [...filtered, { name: playerName, score }];
      const sorted = updatedScores.sort((a, b) => b.score - a.score).slice(0, 5);

      localStorage.setItem("highScores", JSON.stringify(sorted));
      setTopPlayers(sorted);
    }
  }, [score, playerName]); // on dépend de playerName ici aussi

  // Affiche le bouton "reset" après 5 clics sur le titre
  useEffect(() => {
    const title = document.querySelector("h1");
    if (!title) return;

    let clicks = 0;

    const handleClick = () => {
      clicks++;
      if (clicks >= 5) {
        const btn = document.querySelector(".reset-scores-btn");
        if (btn) btn.classList.add("show");
      }
    };

    title.addEventListener("click", handleClick);
    return () => title.removeEventListener("click", handleClick);
  }, []);

  const handleReset = () => {
    localStorage.removeItem("highScores");
    localStorage.removeItem("bestScore");
    window.location.reload();
  };

  return (
    <div className="scoreboard">
      <p>⏱️ Score : {score}</p>
      <p>🏆 Meilleur score : {bestScore}</p>

      <div className="top-players">
        <h4>Top joueurs :</h4>
        <ul>
          {topPlayers.map((player, index) => (
            <li key={index}>
              {player.name} - {player.score}
            </li>
          ))}
        </ul>
      </div>

      <button className="reset-scores-btn" onClick={handleReset}>
        Réinitialiser scores
      </button>
    </div>
  );
}
