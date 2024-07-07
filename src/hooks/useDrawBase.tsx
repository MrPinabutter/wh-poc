import { createRef, useEffect, useRef, useState } from "react";
import { Graphics as PixiGraphics, Ticker } from "pixi.js";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "../constants/canva";
import { lerp } from "../utils";

const useDrawBase = () => {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Dimensions
  const [wellStructure, setWellStructure] = useState([
    {
      type: "wellPart",
      name: "top",
      height: 100,
      width: 240,
      bgColor: 0xaa0012,
      bgColorHover: 0x661122,
      actualColor: 0xaa0012,
    },
    {
      type: "wellPart",
      name: "middle",
      height: 100,
      width: 220,
      bgColor: 0x3311aa,
      bgColorHover: 0x44aadd,
      actualColor: 0x3311aa,
    },
    {
      type: "wellPart",
      name: "bottom",
      height: 100,
      width: 200,
      bgColor: 0x22aa77,
      bgColorHover: 0x44dd99,
      actualColor: 0x22aa77,
    },
  ]);

  const [wellPartHeights, setWellPartHeights] = useState(
    wellStructure.map((it) => it.height)
  );

  const handleChangeWellPartHeight = (val: string, idx: number) => {
    setWellPartHeights((old) =>
      old.map((inputVal, inputIdx) => (inputIdx === idx ? +val : inputVal))
    );
    setAnimationProgress(0)
  };

  // Animation loop using Ticker
  useEffect(() => {
    const ticker = new Ticker();
    ticker.add(() => {
      setAnimationProgress((prev) => {
        const newProgress = Math.min(1, prev + 0.005); // Adjust increment for desired speed
        return newProgress;
      });
    });
    ticker.start();

    return () => ticker.stop();
  }, [wellPartHeights]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphicsRefs = useRef<any>([]);

  if (graphicsRefs.current.length !== wellStructure.length) {
    graphicsRefs.current = wellStructure.map(
      (_, i) => graphicsRefs.current[i] || createRef()
    );
  }

  // Animated heights
  const animatedWellParts = wellStructure.map((it, idx) => {
    const { height = it.height } =
      graphicsRefs.current?.[idx]?.current?.getBounds() || {};

    return {
      ...it,
      height: lerp(height, wellPartHeights?.[idx], animationProgress),
    };
  });

  // Base items
  const totalHeight = animatedWellParts.reduce((acc, it) => acc + it.height, 0);

  // Virtual Dimensions
  const virtualDimensions = animatedWellParts.map((it) => ({
    ...it,
    virtualHeight: (it.height * wellMaxHeight) / totalHeight,
  }));

  // Positions
  const wellPositions = virtualDimensions.map((it, idx, arr) => ({
    ...it,
    position:
      idx == 0
        ? wellInitialPosition
        : arr
            .slice(0, idx)
            .reduce(
              (acc, items) => acc + items.virtualHeight,
              wellInitialPosition
            ),
  }));

  const draw = wellPositions.map((wellPart) => (g: PixiGraphics) => {
    g.clear();
    g.beginFill(wellPart.actualColor)
      .drawRect(
        wellCenterBase - wellPart.width / 2,
        wellPart.position,
        wellPart.width,
        wellPart.virtualHeight
      )
      .endFill();
  });

  return {
    draw,
    wellStructure,
    setWellStructure,
    totalHeight,
    graphicsRefs,
    wellPartHeights,
    handleChangeWellPartHeight,
  };
};

export default useDrawBase;
