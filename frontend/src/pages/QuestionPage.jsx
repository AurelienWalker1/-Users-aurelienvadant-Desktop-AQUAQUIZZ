import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logo from "../assets/logo.png";

const API_BASE = "https://aquaquizz-backend.onrender.com";

function QuestionPage({ player }) {
  const { number } = useParams();

  const [questionData, setQuestionData] = useState(null);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const response = await fetch(
          `${API_BASE}/api/question/${number}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Erreur question");
          return;
        }

        setQuestionData(data);
        setLocked(data.locked);
        setStartTime(data.locked ? null : Date.now());
        setElapsedTime(0);
        setResult(null);
        setHasAnswered(false);
      } catch (err) {
        setError("Impossible de contacter le backend");
      }
    }

    loadQuestion();
  }, [number]);

  useEffect(() => {
    if (!startTime || hasAnswered || locked) return;

    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(timer);
  }, [startTime, hasAnswered, locked]);

  function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);

    return `${seconds}.${tenths}s`;
  }

  async function handleAnswer(choice) {
    if (locked) {
