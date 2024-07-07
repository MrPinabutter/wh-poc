import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { BlurFilter, Ticker } from "pixi.js";
import { lerp } from "./utils";
import useDrawBase from "./hooks/useDrawBase";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "./constants/canva";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

import * as PIXI from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const App = () => {
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    draw,
    wellStructure,
    setWellStructure,
    animateTotalHeight,
    graphicsRefs,
    handleChangeWellPartHeight,
    wellPartHeights,
  } = useDrawBase();

  // without this line, all mouse events are broken
  useMemo(() => new BlurFilter(0), []);

  // FISH Image sizes
  const fishSize = {
    width: 1920,
    height: 1076,
  };

  const fishScale = 0.07;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fishRef = useRef<any>(null);

  const [fishY, setFishY] = useState(100);
  const [fish] = useState({
    realX: wellCenterBase,
    realY: 100,
    width: fishScale * fishSize.width,
    height: fishScale * fishSize.height,
  });

  const fishPosition = {
    ...fish,
    virtualX: fish.realX - fish.width / 2,
  };

  const animatedFishPosition = {
    virtualY: lerp(
      fishRef.current?.transform?.position?._y ?? fish.realY,
      wellInitialPosition +
        (fishY * wellMaxHeight) / animateTotalHeight -
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
              value={wellPartHeights?.[index]}
              onChange={(e) => {
                handleChangeWellPartHeight(e.target.value, index);
              }}
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
              ref={graphicsRefs.current?.[idx]}
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
