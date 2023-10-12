import { Switch } from "../components/switch";
import {
  state,
  toggleMarkedVisible,
  toggleTeleport,
  toggleUnderground,
} from "./state";

export function Settings() {
  return (
    <div className="absolute z-10 bottom-4 left-4 flex flex-col gap-1.5">
      <Switch
        defaultValue={state.undergroundEnabled}
        label="katmanlı harita"
        onChange={toggleUnderground}
      />
      <Switch
        defaultValue={state.teleportVisible}
        label="Işınlanma noktası"
        onChange={toggleTeleport}
      />
      <Switch
        defaultValue={state.markedVisible}
        label="İşaretli nokta"
        onChange={toggleMarkedVisible}
      />
    </div>
  );
}
