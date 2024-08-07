import { Graphics as PixiGraphics } from "pixi.js";
import { createRef, useRef, useState } from "react";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "../constants/canva";

interface useTrianglesProps {
  wellStructure: {
    type: string;
    name: string;
    height: number;
    width: number;
    bgColor: number;
    bgColorHover: number;
    actualColor: number;
  }[];
}

const useTriangles = ({ wellStructure }: useTrianglesProps) => {
  // REMOVER O WELLHEIGHT
  const wellHeight = wellStructure.reduce((acc, it) => acc + it.height, 0);
  const wellStructureWithRealY = wellStructure.map((it, idx, arr) => {
    const realY = arr.slice(0, idx).reduce((acc, it) => it.height + acc, 0);
    return { ...it, realY };
  });

  // Dimensions
  const [triangles, setTriangles] = useState([
    {
      name: "triangles",
      height: 15,
      width: 30,
      bgColor: 0xaa0012,
      bgColorHover: 0xac1133,
      actualColor: 0x555555,
      realY: 99,
    },
    {
      type: "triangles",
      name: "middle",
      height: 15,
      width: 30,
      bgColor: 0x3311aa,
      bgColorHover: 0x44aadd,
      actualColor: 0x777777,
      realY: 200,
    },
    {
      type: "triangles",
      name: "bottom",
      height: 15,
      width: 30,
      bgColor: 0x22aa77,
      bgColorHover: 0x44dd99,
      actualColor: 0x999999,
      realY: 6,
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

  //       a ------ a'
  //      /           \
  //     /             \
  //    b               b'
  //     \             /
  //      \           /
  //       c ------ c'

  const draw = virtualDimensions.map((triangle) => (g: PixiGraphics) => {
    const offsetX =
      (wellStructureWithRealY.find(
        (wellPart) =>
          wellPart.realY <= triangle.realY &&
          wellPart.realY + wellPart.height > triangle.realY
      )?.width || 0) / 2;

    g.clear();
    g.beginFill(triangle.actualColor)
      .moveTo(wellCenterBase + offsetX, triangle.virtualY + triangle.height / 2) // a
      .lineTo(wellCenterBase + offsetX + triangle.width, triangle.virtualY) // b
      .lineTo(wellCenterBase + offsetX, triangle.virtualY - triangle.height / 2) // c
      .lineTo(wellCenterBase - offsetX, triangle.virtualY - triangle.height / 2) // c'
      .lineTo(wellCenterBase - offsetX - triangle.width, triangle.virtualY) // b'
      .lineTo(wellCenterBase - offsetX, triangle.virtualY + triangle.height / 2) // a'
      .endFill();
  });

  return {
    draw,
    triangles,
    setTriangles,
    graphicsRefs,
  };
};

export default useTriangles;
