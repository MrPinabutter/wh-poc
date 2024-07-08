import { useMemo } from "react";
import "./App.css";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { BlurFilter } from "pixi.js";
import useDrawBase from "./hooks/useDrawBase";

import { useFish } from "./hooks/useFish";
import useRuler from "./hooks/useRuler";

const App = () => {
  const {
    draw,
    wellStructure,
    setWellStructure,
    wellHeight,
    graphicsRefs,
    handleChangeWellPartHeight,
    wellPartHeights,
  } = useDrawBase();

  const { drawRuler, fontLoaded } = useRuler({
    totalTicks: 14,
    tickHeight: 10,
    wellHeight,
  });

  // without this line, all mouse events are broken
  useMemo(() => new BlurFilter(0), []);

  const { animatedFishPosition, onChangeFish, fishPosition, fishRef, fishY } =
    useFish({ wellHeight });

  if (!fontLoaded) return <>Loading...</>;

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
          onChange={onChangeFish}
        />
      </div>
      <Stage
        width={800}
        height={1200}
        options={{
          background: 0xf5f5f5,
          resolution: 2,
          antialias: true,
          autoDensity: true,
          premultipliedAlpha: true,
        }}
      >
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
          width={fishPosition.width}
          height={fishPosition.height}
          image={"/src/assets/images/nemo.webp"}
        />

        <Graphics draw={drawRuler} />

        <Container x={200} y={200}></Container>
      </Stage>
    </>
  );
};

export default App;
