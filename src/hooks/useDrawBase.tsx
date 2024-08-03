import { Graphics as PixiGraphics } from "pixi.js";
import { createRef, useRef, useState } from "react";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "../constants/canva";
import { lerp } from "../utils";
import useAnimate from "./useAnimate";

const useDrawBase = () => {
  // Dimensions
  const [wellStructure, setWellStructure] = useState([
    {
      type: "wellPart",
      name: "top",
      height: 100,
      width: 240,
      bgColor: 0xaa0012,
      bgColorHover: 0xbb2233,
      actualColor: 0xaa0012,
    },
    {
      type: "wellPart",
      name: "middle",
      height: 100,
      width: 220,
      bgColor: 0x3311aa,
      bgColorHover: 0x4433aa,
      actualColor: 0x3311aa,
    },
    {
      type: "wellPart",
      name: "bottom",
      height: 100,
      width: 200,
      bgColor: 0x22aa77,
      bgColorHover: 0x33bb88,
      actualColor: 0x22aa77,
    },
  ]);

  const [wellPartHeights, setWellPartHeights] = useState(
    wellStructure.map((it) => it.height)
  );
  const { animationProgress, setAnimationProgress } = useAnimate([
    wellPartHeights,
  ]);

  const [lastTotalHeight, setLastTotalHeight] = useState(
    wellStructure.reduce((acc, it) => acc + it.height, 0)
  );

  const handleChangeWellPartHeight = (newVal: string, idx: number) => {
    setWellPartHeights((old) =>
      old.map((oldVal, inputIdx) => (inputIdx === idx ? +newVal : oldVal))
    );

    setLastTotalHeight(wellStructure.reduce((acc, it) => acc + it.height, 0));

    setWellStructure((old) =>
      old.map((oldVal, inputIdx) =>
        inputIdx === idx ? { ...oldVal, height: +newVal } : oldVal
      )
    );
    setAnimationProgress(0);
  };

  const animateTotalHeight = lerp(
    lastTotalHeight,
    wellPartHeights.reduce((acc, it) => acc + it, 0),
    animationProgress
  );

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
      height: lerp(height, wellPartHeights?.[idx], animationProgress), // NOTE: ONLY WORKS BECAUSE OF PROPORTIONS ARE MAINTAINED
    };
  });

  // Base items
  const totalHeight = animatedWellParts.reduce((acc, it) => acc + it.height, 0);
  const wellHeight = wellPartHeights.reduce((acc, it) => acc + it, 0);

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
    wellHeight,
    wellPositions,
    wellPartHeights,
    animateTotalHeight,
    handleChangeWellPartHeight,
  };
};

export default useDrawBase;
