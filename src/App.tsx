import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { BlurFilter, Graphics as PixiGraphics, Ticker } from "pixi.js";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const App = () => {
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

  // Base items
  const centerBase = 350;

  const maxHeight = 800;
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

  const draw = wellPositions.map((wellPart) => (g: PixiGraphics) => {
    g.clear();
    g.beginFill(wellPart.actualColor)
      .drawRect(
        centerBase - wellPart.width / 2,
        wellPart.position,
        wellPart.width,
        wellPart.virtualHeight
      )
      .endFill();
  });

  // without this line, all mouse events are broken
  useMemo(() => new BlurFilter(0), []);

  // FISH
  const fishSize = {
    width: 1920,
    height: 1076,
  };

  const fishScale = 0.07;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fishRef = useRef<any>(null);

  const [fishY, setFishY] = useState(100);
  const [fish] = useState({
    realX: centerBase,
    realY: 100,
    width: fishScale * fishSize.width,
    height: fishScale * fishSize.height,
  });

  const fishPosition = {
    ...fish,
    virtualX: fish.realX - fish.width / 2,
    virtualY:
      initialPosition +
      (fish.realY * maxHeight) / totalHeight -
      fish.height / 2,
  };

  const animatedFishPosition = {
    virtualY: lerp(
      fishRef.current?.transform?.position?._y ?? fish.realY,
      initialPosition +
        (fishY * maxHeight) / totalHeight -
        fishPosition.height / 2,
      animationProgress
    ),
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
  }, [fishY]);

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
      <div className="flex flex-col gap-2 max-w-96">
        <span className="w-full text-start">fish</span>
        <input
          className="border border-slate-400 rounded-md"
          value={fishY}
          onChange={(e) => {
            setAnimationProgress(0);
            setFishY(+e.target.value);
          }}
        />
      </div>
      <Stage width={1200} height={1600} options={{ background: 0xf5f5f5 }}>
        {draw.map((it, idx) => {
          return (
            <Graphics
              key={idx}
              draw={it}
              onmouseenter={() => {
                setWellStructure((old) =>
                  old.map((actualItem, oldIdx) =>
                    oldIdx == idx
                      ? { ...actualItem, actualColor: actualItem.bgColorHover }
                      : actualItem
                  )
                );
              }}
              onmouseleave={() => {
                setWellStructure((old) =>
                  old.map((actualItem, oldIdx) =>
                    oldIdx == idx
                      ? { ...actualItem, actualColor: actualItem.bgColor }
                      : actualItem
                  )
                );
              }}
              interactive={true}
            />
          );
        })}

        <Sprite
          ref={fishRef}
          x={fishPosition.virtualX}
          y={animatedFishPosition.virtualY}
          width={fish.width}
          height={fish.height}
          image={"/src/assets/images/nemo.webp"}
        />

        <Container x={200} y={200}></Container>
      </Stage>
    </>
  );
};

export default App;
