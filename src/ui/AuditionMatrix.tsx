import { Voice, Utterance } from "../Model";
import React from "react";
export default ({
  voices,
  phrases,
  active,
  playSequence,
}: {
  voices: Voice[];
  phrases: string[];
  active: Utterance | undefined;
  playSequence: (utterances: Utterance[]) => void;
}) => {
  type Dimension<T> = {
    name: string;
    values: T[];
    label: (t: T) => string;
    isActive: (activeUtterance: Utterance, t: T) => boolean;
  };
  type Phrase = string;
  let phraseDimension: Dimension<Phrase> = {
    name: "Phrase",
    values: phrases,
    label: (p: string) => p,
    isActive: (activeUtterance: Utterance, p: string) =>
      activeUtterance.phrase === p,
  };
  let voiceDimension: Dimension<Voice> = {
    name: "Voice",
    values: voices,
    label: (v: Voice) => v.name,
    isActive: (activeUtterance: Utterance, v: Voice) =>
      activeUtterance.voice === v,
  };
  //type GenericDimension = //
  const auditionMatrixLayout = <A, B>(
    firstDimension: Dimension<A>,
    secondDimension: Dimension<B>,
    getUtterance: (a: A, b: B) => Utterance
  ) => ({
    name: `by ${firstDimension.name} and then by ${secondDimension.name}`,
    firstDimension: firstDimension.values.map((a) => ({
      label: firstDimension.label(a),
      isActive: (au: Utterance) => firstDimension.isActive(au, a),
      utterances: secondDimension.values.map((b) => getUtterance(a, b)),
    })),
    secondDimension: secondDimension.values.map((b) => ({
      label: secondDimension.label(b),
      isActive: (au: Utterance) => secondDimension.isActive(au, b),
      utterances: firstDimension.values.map((a) => getUtterance(a, b)),
    })),
  });

  let layouts = [
    auditionMatrixLayout(phraseDimension, voiceDimension, (phrase, voice) => ({
      voice,
      phrase,
    })),
    auditionMatrixLayout(voiceDimension, phraseDimension, (voice, phrase) => ({
      voice,
      phrase,
    })),
  ];
  const [layout, setLayout] = React.useState(layouts[1]);
  return (
    <>
      <table
        style={{ fontSize: "0.7rem" }}
        className="table table-sm table-bordered mt-3"
      >
        <thead>
          <tr>
            <th>&times;</th>
            {layout.firstDimension.map((d) => (
              <th
                className={
                  "rotate" +
                  (!!active && d.isActive(active) ? " table-primary" : "")
                }
                onClick={async () => {
                  playSequence(d.utterances);
                }}
              >
                <div>
                  <span>{d.label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {layout.secondDimension.map((d) => (
            <tr>
              <th
                className={
                  !!active && d.isActive(active) ? "table-primary" : ""
                }
                onClick={async () => {
                  playSequence(d.utterances);
                }}
              >
                {d.label}
              </th>
              {d.utterances.map((u) => {
                let isActive =
                  !!active &&
                  active.voice === u.voice &&
                  active.phrase === u.phrase;
                return (
                  <td className={"p-0"}>
                    <div className="d-grid" style={{ position: "relative" }}>
                      <button
                        style={{
                          border: "none",
                          borderRadius: 0,
                        }}
                        className={
                          "btn btn-sm " +
                          (isActive ? "btn-primary" : "btn-outline-primary")
                        }
                        onClick={() => {
                          playSequence([u]);
                        }}
                      >
                        <img
                          src="/icons/play.svg"
                          style={{
                            height: "0.7em",
                            filter: `invert(${isActive ? 0 : 1})`,
                          }}
                        />
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-grid gap-2">
        {layouts.map((l) => (
          <button
            className={
              "btn btn-lg btn-outline-primary" +
              (l.name === layout.name ? " active" : "")
            }
            onClick={() => setLayout(l)}
          >
            {l.name}
          </button>
        ))}
      </div>
    </>
  );
};
