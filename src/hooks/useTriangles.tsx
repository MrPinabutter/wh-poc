import { Graphics as PixiGraphics } from "pixi.js";
import { createRef, useRef, useState } from "react";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "../constants/canva";

interface useTrianglesProps {
  wellHeight: number;
}

const useTriangles = ({ wellHeight }: useTrianglesProps) => {
  // Dimensions
  const [triangles, settriangles] = useState([
    {
      name: "triangles",
      height: 15,
      width: 30,
      bgColor: 0xaa0012,
      bgColorHover: 0xac1133,
      actualColor: 0x555555,
      realY: 120,
    },
    {
      type: "triangles",
      name: "middle",
      height: 15,
      width: 30,
      bgColor: 0x3311aa,
      bgColorHover: 0x44aadd,
      actualColor: 0x777777,
      realY: 100,
    },
    {
      type: "triangles",
      name: "bottom",
      height: 15,
      width: 30,
      bgColor: 0x22aa77,
      bgColorHover: 0x44dd99,
      actualColor: 0x999999,
      realY: 200,
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphicsRefs = useRef<any>([]);

  if (graphicsRefs.current.length !== triangles.length) {
    graphicsRefs.current = triangles.map(
      (_, i) => graphicsRefs.current[i] || createRef()
    );
  }

  // Virtual Dimensions
  const virtualDimensions = triangles.map((it) => ({
    ...it,
    virtualY: wellInitialPosition + (it.realY * wellMaxHeight) / wellHeight,
  }));

  //       a
  //      /|
  //     / |
  //    b  |
  //     \ |
  //      \|
  //       c

  const draw = virtualDimensions.map((wellPart) => (g: PixiGraphics) => {
    const offsetX = 100;
    g.clear();
    g.beginFill(wellPart.actualColor)
      .moveTo(wellCenterBase + offsetX + wellPart.width, wellPart.virtualY) // b
      .lineTo(wellCenterBase + offsetX, wellPart.virtualY + wellPart.height / 2) // a
      .lineTo(wellCenterBase + offsetX, wellPart.virtualY - wellPart.height / 2) // c
      .endFill();
    g.beginFill(wellPart.actualColor)
      .moveTo(wellCenterBase - offsetX - wellPart.width, wellPart.virtualY) // b
      .lineTo(wellCenterBase - offsetX, wellPart.virtualY + wellPart.height / 2) // a
      .lineTo(wellCenterBase - offsetX, wellPart.virtualY - wellPart.height / 2) // c
      .endFill();
  });

  return {
    draw,
    triangles,
    settriangles,
    graphicsRefs,
  };
};

export default useTriangles;
