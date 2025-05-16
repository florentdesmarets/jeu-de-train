import React, { useState, useEffect } from "react";
import GameCanvas from "./components/GameCanvas";
import ScoreBoard from "./components/ScoreBoard";
import './App.css'

export default function App() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [gameKey, setGameKey] = useState(0); // Clé pour redémarrer GameCanvas

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setGameOver(true);
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setGameKey(prev => prev + 1); // Force remount du canvas
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() !== "") {
      localStorage.setItem("playerName", playerName); // ✅ Enregistrement dans le localStorage
      setHasStarted(true);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className={`app-container ${theme}`}>
      {!hasStarted ? (
  <>
    <img
    className="logo"
      src = {`${import.meta.env.BASE_URL}assets/logo.png`}
      alt="Logo "
      style={{ width: "120px", marginBottom: "20px" }}
    />
    <h3>Le jeu de plateforme</h3>
    <form className="name-entry" onSubmit={handleNameSubmit}>
      <label>Entrez votre pseudo :</label>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        required
      />
      <button type="submit">Commencer</button>
      <label>Un jeu fais par le Dem</label>
    </form>
  </>
) : (
        <>
          <button className="theme-toggle" onClick={toggleTheme}>
            Mode {theme === "light" ? "Nuit 🌙" : "Jour ☀️"}
          </button>
          <h1>LE JEU DU TRAIN</h1>
          <ScoreBoard score={score} playerName={playerName} />
          <GameCanvas
            key={gameKey}
            isRunning={!gameOver}
            onScoreChange={setScore}
            onGameOver={() => handleGameOver(score)}
          />
          {gameOver && (
            <button className="restart-btn" onClick={restartGame}>
              Rejouer
            </button>
          )}
        </>
      )}
    </div>
  );
}
