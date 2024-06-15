import { useCallback, useState } from "react";
import "./App.css";

import { Container, Graphics, Stage } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";

const App = () => {
  // Dimensions
  const [wellStructure, setWellStructure] = useState([
    {
      name: "top",
      height: 100,
      width: 240,
      bgColor: 0xaa0012,
    },
    {
      name: "middle",
      height: 100,
      width: 220,
      bgColor: 0x3311aa,
    },
    {
      name: "bottom",
      height: 100,
      width: 200,
      bgColor: 0x22aa77,
    },
  ]);

  const maxHeight = 600;
  const totalHeight = wellStructure.reduce((acc, it) => acc + it.height, 0);

  // Virtual Dimensions
  const virtualDimensions = wellStructure.map((it) => ({
    ...it,
    virtualHeight: (it.height * maxHeight) / totalHeight,
  }));

  // Positions
  const initialPosition = 200;
  const wellPositions = virtualDimensions.map((it, idx, arr) => ({
    ...it,
    position:
      idx == 0
        ? initialPosition
        : arr
            .slice(0, idx)
            .reduce((acc, items) => acc + items.virtualHeight, initialPosition),
  }));

  // Base items
  const centerBase = 350;

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      wellPositions.map((wellPart) => {
        g.beginFill(wellPart.bgColor)
          .drawRect(
            centerBase - wellPart.width / 2,
            wellPart.position,
            wellPart.width,
            wellPart.virtualHeight
          )
          .endFill();
      });
    },
    [wellPositions]
  );


  return (
    <>
      <div className="flex gap-4">
        {wellStructure.map((it, index) => (
          <div className="flex flex-col gap-2" key={it.name}>
            <span className="w-full text-start">{it.name}</span>
            <input
              className="border border-slate-400 rounded-md"
              value={it.height}
              onChange={(e) =>
                setWellStructure((old) =>
                  old.map((item, idx) =>
                    idx === index
                      ? { ...item, height: Number(e.target.value) }
                      : item
                  )
                )
              }
            />
          </div>
        ))}
      </div>
      <Stage width={1200} height={1600} options={{ background: 0xf5f5f5 }}>
        <Graphics draw={draw} />

        <Container x={200} y={200}></Container>
      </Stage>
    </>
  );
};

export default App;
