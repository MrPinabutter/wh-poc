import { Ticker } from "pixi.js";
import { useEffect, useState } from "react";

const useAnimate = (depVariables: unknown[]) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation loop using Ticker
  useEffect(() => {
    const ticker = new Ticker();
    ticker.add(() => {
      setAnimationProgress((prev) => {
        const newProgress = Math.min(1, prev + 0.2); // Adjust increment for desired speed
        return newProgress;
      });
    });
    ticker.start();

    return () => ticker.stop();
  }, depVariables);

  return { animationProgress, setAnimationProgress };
};

export default useAnimate;
