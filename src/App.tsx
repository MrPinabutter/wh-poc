import { useCallback, useState } from "react";
import "./App.css";

import { Container, Graphics, Stage } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";

const App = () => {
  // Dimensions
  const [wellHeadHeight, setWellHeadHeight] = useState(100);
  const [wellHeight, setWellHeight] = useState(100);
  const [wellTailHeight, setWellTailHeight] = useState(100);

  const maxHeight = 600;
  const totalHeight = wellHeadHeight + wellHeight + wellTailHeight;

  // Virtual Dimensions
  const virtualWellHeadHeight = (wellHeadHeight * maxHeight) / totalHeight;
  const wellHeadWidht = 240;

  const virtualWellHeight = (wellHeight * maxHeight) / totalHeight;
  const wellWidht = 220;

  const virtualWellTailHeight = (wellTailHeight * maxHeight) / totalHeight;
  const wellTailWidht = 200;

  // Positions
  const wellHeadPosition = 200;
  const offsetPositionWell = virtualWellHeadHeight + wellHeadPosition;
  const offsetPositionWellTail = offsetPositionWell + virtualWellHeight;

  // Base items
  const centerBase = 350;

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.beginFill(0xaa0012)
        .drawRect(
          centerBase - wellHeadWidht / 2,
          wellHeadPosition,
          wellHeadWidht,
          virtualWellHeadHeight
        )
        .endFill();
      g.beginFill(0x3311aa)
        .drawRect(
          centerBase - wellWidht / 2,
          offsetPositionWell,
          wellWidht,
          virtualWellHeight
        )
        // .lineStyle(0.1, 0x003020)
        .endFill();
      g.beginFill(0x22aa77)
        .drawRect(
          centerBase - wellTailWidht / 2,
          offsetPositionWellTail,
          wellTailWidht,
          virtualWellTailHeight
        )
        .endFill();
    },
    [
      offsetPositionWell,
      offsetPositionWellTail,
      virtualWellHeadHeight,
      virtualWellHeight,
      virtualWellTailHeight,
    ]
  );

  return (
    <>
      <input
        value={wellHeadHeight}
        onChange={(e) => setWellHeadHeight(+e.target.value)}
      />
      <input
        value={wellHeight}
        onChange={(e) => setWellHeight(+e.target.value)}
      />
      <input
        value={wellTailHeight}
        onChange={(e) => setWellTailHeight(+e.target.value)}
      />
      <Stage width={1200} height={1600} options={{ background: 0xf5f5f5 }}>
        {/* <Sprite image={bunnyUrl} x={300} y={150} />
        <Sprite image={bunnyUrl} x={500} y={150} />
        <Sprite image={bunnyUrl} x={400} y={200} /> */}
        <Graphics draw={draw} />

        <Container x={200} y={200}></Container>
      </Stage>
    </>
  );
};

export default App;
