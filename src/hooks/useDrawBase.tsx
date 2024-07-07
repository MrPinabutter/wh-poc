import { useState } from "react";
import { Graphics as PixiGraphics } from "pixi.js";
import { wellCenterBase, wellInitialPosition, wellMaxHeight } from "../constants/canva";

const useDrawBase = () => {
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

  // Base items
  const totalHeight = wellStructure.reduce((acc, it) => acc + it.height, 0);

  // Virtual Dimensions
  const virtualDimensions = wellStructure.map((it) => ({
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
            .reduce((acc, items) => acc + items.virtualHeight, wellInitialPosition),
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
    totalHeight
  };
};

export default useDrawBase;
