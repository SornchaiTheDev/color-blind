import React, { createContext, useEffect, useState } from "react";
import useTimer from "./useTimer";
import useColor from "./useColor";
import useAuth from "./useAuth";

// Context Initial
export const Context = createContext(null);

function ContextProvider({ children }) {
  const [score, setScore] = useState(0);
  const [column, setColumn] = useState(2);
  const [mode, setMode] = useState("EASY");
  const { user } = useAuth();

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const {
    setMaxTimer,
    timer,
    startTimer,
    resetTimer,
    minusTimer,
    setMinusTime,
    maxTimer,
    isStart,
  } = useTimer({ mode, setMode, column });
  const { colors, correctIndex, randomColor, blink, stopBlink } = useColor({
    score,
  });

  const correct = () => {
    setScore((prev) => prev + 1);
    resetTimer();
  };
  const wrong = () => {
    if (timer > 0) return minusTimer();
    setMode("GAME_OVER");
  };

  useEffect(() => {
    if (score > 0 && score % 5 == 0 && column <= 4)
      setColumn((prev) => prev + 1);
    if (score >= 5 && score <= 40) setMode("NORMAL");
    if (score > 40 && score <= 60) setMode("HARD");
    if (score > 60 && score <= 80) setMode("INSANE");
  }, [score]);

  useEffect(() => {
    console.log(mode);
    switch (mode) {
      case "EASY":
        randomColor(column);
        setMaxTimer(10);
        setMinusTime(2);
        break;
      case "NORMAL":
        randomColor(column);
        setMaxTimer(5);
        setMinusTime(3);
        blink(2, column);
        break;
      case "HARD":
        stopBlink();
        randomColor(column);
        setMaxTimer(10);
        setMinusTime(4);
        blink(1, column);
        break;
      case "INSANE":
        stopBlink();
        randomColor(column);
        setMaxTimer(2);
        setMinusTime(1);
        break;
      case "GAME_OVER":
        stopBlink();
        break;
      case "RESET":
        setScore(0);
        setColumn(2);
        resetTimer();
        setMode("EASY");
        break;
    }
  }, [score, mode, column]);

  const contextValue = {
    user,
    isStart,
    timer,
    startTimer,
    resetTimer,
    maxTimer,
    colors,
    correctIndex,
    randomColor,
    score,
    minusTimer,
    column,
    correct,
    wrong,
    mode,
    setMode,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default ContextProvider;
