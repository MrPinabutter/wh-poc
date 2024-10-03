import { Graphics as PixiGraphics } from "pixi.js";
import * as PIXI from "pixi.js";

import { useEffect, useRef, useState } from "react";
import { wellInitialPosition, wellMaxHeight } from "../constants/canva";

interface ScaleRuler {
  totalTicks: number;
  tickHeight: number;
  wellHeight: number;
}

const useRuler = ({
  totalTicks = 30,
  tickHeight = 10,
  wellHeight,
}: ScaleRuler) => {
  const rulerRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load the bitmap font
    PIXI.Assets.load("src/assets/fonts/Minecraft.ttf")
      .then(() => {
        setFontLoaded(true);
      })
      .catch((error) => {
        console.log(error);

        setFontLoaded(true);
      });
  }, []);

  const drawRuler = (g: PixiGraphics) => {
    g.clear();
    g.removeChildren();
    g.lineStyle(2, 0x000000, 1);

    const spacing = wellMaxHeight / totalTicks;
    const virtualSpacing = wellHeight / totalTicks;

    for (let i = 0; i <= totalTicks; i++) {
      const y = i * spacing + wellInitialPosition;
      const virtualY = i * virtualSpacing;
      g.moveTo(20, y);
      g.lineTo(tickHeight, y);

      // Add the tick text
      const text = new PIXI.Text(virtualY.toFixed(0), {
        fontSize: 14,
        fontFamily: "Minecraft",
      });

      text.cacheAsBitmap = true;
      text.position.set(tickHeight + 5 + 20, y - text.height / 2); // Adjust the position to the right of the tick
      g.addChild(text);
    }
  };

  return { drawRuler, rulerRef, fontLoaded };
};

export default useRuler;
