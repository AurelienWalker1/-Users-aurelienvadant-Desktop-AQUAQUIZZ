import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

const API_BASE = "https://aquaquizz-backend.onrender.com";

function ReadyPage({ player }) {
  const navigate = useNavigate();

  const [nextQuestion, setNextQuestion] = useState(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    loadNextQuestion();
  }, []);

  async function loadNextQuestion() {
    try {
      const response = await fetch(
        `${API_BASE}/api/next-question/${player.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur prochaine question");
        return;
      }

      setLocked(data.locked);
      setFinished(data.finished);

      if (!data.finished) {
        setNextQuestion(data.nextNumber);
      }
    } catch (err) {
      setError("Impossible de contacter le backend");
    }
  }

  function handleGo() {
    if (!nextQuestion || locked || finished) return;

    navigate(`/question/${nextQuestion}/play`);
  }

  function goRanking() {
    navigate("/ranking");
  }

  if (error) {
    return (
      <div className="card">
        <img src={logo} alt="AQUALAND" className="app-logo" />

        <h1>AQUAQUIZZ</h1>

        <p>{error}</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="card">
        <img src={logo} alt="AQUALAND" className="app-logo" />

        <h1>AQUAQUIZZ</h1>

        <div className="result bad">
          🔒 Le jeu est terminé pour aujourd'hui.
          <br />
          Le classement est maintenant final.
        </div>

        <button onClick={goRanking}>
          Voir le classement
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="card">
        <img src={logo} alt="AQUALAND" className="app-logo" />

        <h1>AQUAQUIZZ</h1>

        <div className="result good">
          🏆 Bravo, tu as terminé les 20 questions !
        </div>

        <button onClick={goRanking}>
          Voir le classement
        </button>
      </div>
    );
  }

  if (!nextQuestion) {
    return (
      <div className="card">
        <img src={logo} alt="AQUALAND" className="app-logo" />

        <h1>AQUAQUIZZ</h1>

        <p>Recherche de ta prochaine question...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <img src={logo} alt="AQUALAND" className="app-logo" />

      <h1>AQUAQUIZZ</h1>

      <h2>Question {nextQuestion}</h2>

      <div className="intro-box">
        <p>Es-tu prêt ?</p>

        <p>
          Le chrono démarrera uniquement lorsque tu appuieras sur GO.
        </p>
      </div>

      <button onClick={handleGo}>
        GO
      </button>
    </div>
  );
}

export default ReadyPage;dyPage;
