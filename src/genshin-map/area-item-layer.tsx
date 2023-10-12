import { MarkerLayer } from "@canvaskit-tilemap/react";
import classNames from "classnames";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { zIndex } from ".";
import { AreaItem } from "../data_pb";
import { store } from "../store";
import { activateMarker, AreaItemMarker, state } from "./state";

const isSafari = navigator.userAgent.includes("iPhone");
const teleportNames = [
  "ışınlanma çapası",
  "Yedi Göksel Tanrı Heykeli",
  "gizli bölge",
  "fetih alanı",
  "Ödül Gizli Bölgesi",
  "dalga teknesi bağlantı noktası",
];
export const borderlessNames = [...teleportNames, "Mağara girişi"];

interface AreaItemLayerProps {
  areaItem: AreaItem;
  hidden?: boolean;
}

export const bottomCenterAnchor = [0, 1] as [number, number];

export function AreaItemLayer(props: AreaItemLayerProps) {
  const { activeMarker, marked, markedVisible } = useSnapshot(state);
  const [items, undergroundItems, markedItems, markedUndergroundItems] =
    useMemo(() => {
      const items = [];
      const undergroundItems = [];
      const markedItems = [];
      const markedUndergroundItems = [];
      for (const item of getMarkers(props.areaItem)) {
        if (item.marker == activeMarker?.marker) {
          continue;
        }
        if (item.marker?.getUnderground()) {
          if (marked.has(item.marker.getId())) {
            markedUndergroundItems.push(item);
          } else {
            undergroundItems.push(item);
          }
        } else {
          if (marked.has(item.marker.getId())) {
            markedItems.push(item);
          } else {
            items.push(item);
          }
        }
      }
      return [items, undergroundItems, markedItems, markedUndergroundItems];
    }, [activeMarker?.areaItem == props.areaItem && activeMarker]);

  const commonProps = { ...props, onClick: activateMarker };
  const Component = borderlessNames.includes(props.areaItem.getName())
    ? BorderlessMarkerLayer
    : DefaultMarkerLayer;

  return (
    <>
      {markedVisible && markedUndergroundItems.length > 0 && (
        <Component
          {...commonProps}
          items={markedUndergroundItems}
          underground
          marked
        />
      )}
      {markedVisible && markedItems.length > 0 && (
        <Component {...commonProps} items={markedItems} marked />
      )}
      {undergroundItems.length > 0 && (
        <Component {...commonProps} items={undergroundItems} underground />
      )}
      {items.length > 0 && <Component {...commonProps} items={items} />}
    </>
  );
}

interface MarkerLayerProps extends AreaItemLayerProps {
  items: AreaItemMarker[];
  underground?: boolean;
  marked?: boolean;
  onClick: (item: AreaItemMarker) => void;
}

function DefaultMarkerLayer({
  areaItem,
  underground = false,
  marked = false,
  ...props
}: MarkerLayerProps) {
  const { undergroundEnabled } = useSnapshot(state);
  if (undergroundEnabled && !underground) {
    props.hidden = true;
  }
  return (
    <MarkerLayer
      {...props}
      className={classNames("p-1", marked && "opacity-70")}
      anchor={bottomCenterAnchor}
      zIndex={zIndex.marker}
      cacheKey={`${areaItem.getName()}_${underground}_${marked}`}
    >
      <div
        className={classNames(
          "w-6 h-6 flex justify-center items-center rounded-full border border-solid bg-gray-700",
          isSafari ? "drop-shadow" : "drop-shadow-sm",
          marked ? "border-cyan-600/90" : "border-white"
        )}
      >
        <img
          className="w-11/12 h-11/12 object-contain"
          src={`icons/${areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {underground && (
        <img
          className="absolute w-3 h-3 bottom-0.5 right-0.5"
          src={require("../../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function BorderlessMarkerLayer({
  areaItem,
  underground = false,
  marked = false,
  ...props
}: MarkerLayerProps) {
  return (
    <MarkerLayer
      {...props}
      anchor={bottomCenterAnchor}
      cacheKey={`${areaItem.getName()}_${underground}`}
      zIndex={
        areaItem.getName() == "Yedi Göksel Tanrı Heykeli" ? zIndex.marker + 2 : zIndex.marker + 1
      }
    >
      <div
        className={classNames(
          "flex justify-center items-center",
          areaItem.getName() == "Yedi Göksel Tanrı Heykeli" ? "w-9 h-9" : "w-7 h-7"
        )}
      >
        <img
          className="w-full h-full object-contain"
          src={`icons/${areaItem.getIcon()}`}
          crossOrigin="anonymous"
        />
      </div>
      {underground && (
        <img
          className="absolute w-3 h-3 bottom-0.5 right-0.5"
          src={require("../../images/icon-underground.png")}
        />
      )}
    </MarkerLayer>
  );
}

function getMarkers(areaItem: AreaItem): AreaItemMarker[] {
  const markerMap = store.mapData.getMarkerMap();
  return areaItem
    .getMarkerList()
    .map((i) => markerMap.get(i))
    .map((i) => ({ x: i!.getX(), y: i!.getY(), marker: i!, areaItem }));
}
