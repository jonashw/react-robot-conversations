import React from "react";
import { Voice } from "../Model";
import VoiceBadges from "./VoiceBadges";
export default ({
  voices,
  selected,
  setSelected,
}: {
  voices: { [v: string]: Voice };
  selected: Voice | undefined;
  setSelected: (a: Voice | undefined) => void;
}) => {
  //const voice: {[id:string]: Voice} = voices;
  return (
    <table className="table table-bordered">
      <tbody>
        {Object.values(voices).map((voice) => (
          <tr
            className={selected === voice ? "table-primary" : ""}
            style={{ cursor: "pointer" }}
            onClick={() => setSelected(voice)}
          >
            <td style={{ borderRight: "none", width: "4em" }}>
              <input type="radio" checked={selected === voice} readOnly />
            </td>
            <td
              className="text-start"
              style={{
                borderLeft: "none",
                borderRight: "none",
                width: "7em",
              }}
            >
              {voice.name}
            </td>
            <td
              className="text-start"
              style={{
                borderLeft: "none",
              }}
            >
              <VoiceBadges voice={voice} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
