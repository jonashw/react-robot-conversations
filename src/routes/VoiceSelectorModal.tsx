import Modal from "../ui/Modal";
import React from "react";
import { FacetedSpecification, VoiceIndex, Voice } from "../Model";
const TermBadge = ({
  term,
  count,
  active,
}: {
  term: string;
  count?: number;
  active?: boolean;
}) => (
  <span
    style={{ fontWeight: "normal" }}
    className={"badge rounded-pill text-bg-" + (active ? "light" : "dark")}
  >
    {term} {!!count && <>({count})</>}
  </span>
);

export default ({
  voiceIndex,
  onVoiceSelect,
  shown,
  setShown,
}: {
  voiceIndex: VoiceIndex;
  onVoiceSelect: (v: Voice) => void;
  shown: boolean;
  setShown: (s: boolean) => void;
}) => {
  const [spec, setSpec] = React.useState<FacetedSpecification>({});
  let searchResult = voiceIndex.facetedSearch(spec);
  const [selectedVoice, setSelectedVoice] = React.useState<Voice | undefined>(
    undefined
  );
  const setSelectedVoiceById = (id: string) => {
    let v = voiceIndex.getAll().filter((v) => v.id === id)[0];
    if (!v) {
      alert(`voice not found by ID '${id}'`);
      return;
    }
    setSelectedVoice(v);
  };
  const footerContent = (
    <div className="d-grid">
      <button
        className="btn btn-success"
        disabled={!selectedVoice}
        onClick={() => {
          onVoiceSelect(selectedVoice!);
          setShown(false);
          setSelectedVoice(undefined);
        }}
      >
        Select this voice
      </button>
    </div>
  );
  return (
    <Modal
      shown={shown}
      setShown={setShown}
      title="Select a voice"
      fullscreen
      scrollable
      footerContent={footerContent}
    >
      <>
        {/*
        <div className="d-flex justify-content-between">
          {searchResult.facets.map((f) => (
            <div>
              {f.name}
              <select
                className="form-control"
                name={f.facet_id}
                onChange={(e) => {
                  setSpec(
                    voiceIndex.ix.toggleQueryTerm(
                      spec,
                      f.facet_id,
                      e.target.value
                    )
                  );
                }}
              >
                {f.term_buckets.map((tb) => (
                  <option value={tb.term}>
                    {tb.term} ({tb.count})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      */}
        <div className="row">
          <div className="col-5">
            {searchResult.facets.map((f) => (
              <div>
                {f.name}
                <div>
                  {f.term_buckets.map((tb) => (
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSpec(
                          voiceIndex.ix.toggleQueryTerm(
                            spec,
                            tb.facet_id,
                            tb.term
                          )
                        );
                      }}
                    >
                      <TermBadge
                        term={tb.term}
                        count={tb.count}
                        active={tb.in_query}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="col-7">
            <div className="list-group">
              {searchResult.records.map((v: Voice) => (
                <label className="list-group-item">
                  <div>
                    <input
                      type="radio"
                      name="voice_id"
                      value={v.id}
                      onChange={(e) => setSelectedVoiceById(e.target.value)}
                    />
                    <span className="ps-2">{v.name}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <TermBadge
                      term={v.gender}
                      active={
                        "gender" in spec && spec.gender.indexOf(v.gender) > -1
                      }
                    />
                    <TermBadge
                      term={v.age}
                      active={"age" in spec && spec.age.indexOf(v.age) > -1}
                    />
                    <TermBadge
                      term={v.lang}
                      active={"lang" in spec && spec.lang.indexOf(v.lang) > -1}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};
