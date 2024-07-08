import { useRef, useState } from "react";
import {
  wellCenterBase,
  wellInitialPosition,
  wellMaxHeight,
} from "../constants/canva";
import { lerp } from "../utils";
import useAnimate from "./useAnimate";

interface useFishProps {
  wellHeight: number;
}

export const useFish = ({ wellHeight }: useFishProps) => {
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

  const { setAnimationProgress, animationProgress } = useAnimate([fishY]);

  const fishPosition = {
    ...fish,
    virtualX: fish.realX - fish.width / 2,
  };

  const animatedFishPosition = {
    virtualY: lerp(
      fishRef.current?.transform?.position?._y ?? fish.realY,
      wellInitialPosition +
        (fishY * wellMaxHeight) / wellHeight -
        fishPosition.height / 2,
      animationProgress
    ),
  };

  const onChangeFish = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationProgress(0);
    if (!Number.isNaN(+e.target.value)) setFishY(+e.target.value);
  };

  return {
    fishRef,
    fishY,
    fishPosition,
    animatedFishPosition,
    onChangeFish,
  };
};
