import React, { useRef, useEffect, useState } from "react";

const GameCanvas = ({ onScoreChange, onGameOver }) => {
  const width = 500;
  const height = 300;

  const trainWidth = 80;
  const trainHeight = 50;
  const trainX = 20;

  const groundHeight = 40;
  const groundY = height - groundHeight;

  const gravity = 0.5;
  const jumpVelocity = 14;

  const obstacleSpeed = 4;

  const trainY = useRef(groundY - trainHeight);
  const velocityY = useRef(0);
  const isOnGround = useRef(true);
  const animationFrameId = useRef(null);

  const obstacles = useRef([]);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const trainImage = new Image();
    trainImage.src = "/assets/train.png";

    const obstacleImage = new Image();
    obstacleImage.src = "/assets/obstacles/man.png";

    let frameCount = 0;
    let hasStarted = false;

    const startLoop = () => {
      if (hasStarted) return;
      hasStarted = true;
      animationFrameId.current = requestAnimationFrame(loop);
    };

    const loop = () => {
      if (gameOver) return;

      frameCount++;

      velocityY.current += gravity;
      trainY.current += velocityY.current;

      if (trainY.current > groundY - trainHeight) {
        trainY.current = groundY - trainHeight;
        velocityY.current = 0;
        isOnGround.current = true;
      } else {
        isOnGround.current = false;
      }

      // Ajouter un obstacle aléatoire
      if (frameCount % 90 === 0) {
        const randomHeight = Math.floor(Math.random() * 70) + 20;
        const aspectRatio = 0.6; // pour calculer une largeur approximative
        const obstacleWidth = Math.floor(randomHeight * aspectRatio);

        const obs = {
          x: width,
          y: groundY - randomHeight,
          width: obstacleWidth,
          height: randomHeight,
          image: new Image()
        };
        obs.image.src = "../public/assets/man.png";
        obstacles.current.push(obs);
      }

      // Mise à jour des positions des obstacles
      obstacles.current = obstacles.current
        .map((obs) => ({ ...obs, x: obs.x - obstacleSpeed }))
        .filter((obs) => obs.x + obs.width > 0);

      // Collision
      for (const obs of obstacles.current) {
        const collided =
          trainX < obs.x + obs.width &&
          trainX + trainWidth > obs.x &&
          trainY.current < obs.y + obs.height &&
          trainY.current + trainHeight > obs.y;

        if (collided) {
          setGameOver(true);
          onGameOver?.();
          return;
        }
      }

      // DESSIN

      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, width, height);

      const stripeWidth = 20;
      for (let x = 0; x < width; x += stripeWidth * 2) {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(
          (x - (frameCount * obstacleSpeed) % (stripeWidth * 2)),
          groundY,
          stripeWidth,
          groundHeight
        );
        ctx.fillStyle = "#1e6b1e";
        ctx.fillRect(
          (x + stripeWidth - (frameCount * obstacleSpeed) % (stripeWidth * 2)),
          groundY,
          stripeWidth,
          groundHeight
        );
      }

      // Obstacles (image ou carré rouge)
      obstacles.current.forEach((obs) => {
        if (obs.image.complete && obs.image.naturalWidth !== 0) {
          ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);
        } else {
          ctx.fillStyle = "crimson";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
      });

      // Train
      if (trainImage.complete && trainImage.naturalWidth !== 0) {
        ctx.drawImage(trainImage, trainX, trainY.current, trainWidth, trainHeight);
      } else {
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(trainX, trainY.current, trainWidth, trainHeight);
      }

      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(`Score : ${score}`, 10, 20);

      if (frameCount % 10 === 0) {
        setScore((prev) => {
          const newScore = prev + 1;
          onScoreChange?.(newScore);
          return newScore;
        });
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    trainImage.onload = startLoop;
    setTimeout(startLoop, 1000);

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  const handleJump = () => {
    if (!gameOver && isOnGround.current) {
      velocityY.current = -jumpVelocity;
      isOnGround.current = false;
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        tabIndex={0}
        style={{
          border: "2px solid #333",
          backgroundColor: "#000",
          outline: "none",
          display: "block",
          margin: "0 auto",
        }}
        onClick={() => {
          handleJump();
          canvasRef.current?.focus();
        }}
        onTouchStart={handleJump}
      />
      {gameOver && (
        <div style={{ textAlign: "center", color: "white", marginTop: "10px" }}>
          <div className="resultColor">💥 Collision !</div>
          <p>Score final : {score}</p>
        </div>
      )}
    </>
  );
};

export default GameCanvas;
