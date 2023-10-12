import { canvaskit } from "@canvaskit-tilemap/core";
import { TextLayer } from "@canvaskit-tilemap/react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { store } from "../store";
import { state } from "./state";

const areaNames = [
  { name: "Fontaine", x: -5539, y: -5395, children: [] },
  { name: "Sümer", x: -4781, y: 829, children: [] },
  { name: "Liyue", x: -875, y: -1094, children: [] },
  { name: "Mondstadt", x: 1476, y: -3067, children: [] },
  { name: "Daoqi", x: 4746, y: 4685, children: [] },
];

export function AreaNamesLayer() {
  const { zoomLevel } = useSnapshot(state);
  const { activeSubArea, activeTopArea } = useSnapshot(store);

  // 只在提瓦特大陆显示地名
  if (activeSubArea && activeSubArea.getMapId() != activeTopArea.getMapId()) {
    return null;
  }

  const style = {
    textStyle: {
      color: canvaskit.WHITE,
      fontSize: 30,
      shadows: [{ color: canvaskit.BLACK, blurRadius: 2 }],
    },
  };
  const areaNames1 = areaNames;
  return (
    <>
      {areaNames1.map((i) => (
        <TextLayer
          key={i.name}
          x={i.x}
          y={i.y}
          text={i.name}
          fontUrl={require("../../images/font.otf")}
          hidden={zoomLevel > -4}
          style={style}
          zIndex={zIndex.underground + 2}
        />
      ))}
    </>
  );
}
