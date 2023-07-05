import Modal from "../ui/Modal";
import React from "react";
import { FacetedSpecification, VoiceIndex, Voice } from "../Model";
import Select from "react-select";

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
  const groupedTermOptions = searchResult.facets.map((f) => ({
    label: f.name,
    options: f.term_buckets.map((tb) => ({
      value: tb.term,
      label: `${tb.term} (${tb.count})`,
      facet_id: tb.facet_id,
    })),
  }));
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
        <Select
          isMulti
          options={groupedTermOptions}
          value={groupedTermOptions
            .flatMap((f) => f.options)
            .filter(
              (o) =>
                o.facet_id in spec && spec[o.facet_id].indexOf(o.value) > -1
            )}
          onChange={(e) => {
            let selected: [string, string][] = Array.from(e.values(), (v) => [
              v.facet_id,
              v.value,
            ]);
            let newSpec = selected.reduce((s, [facet_id, term]) => {
              s[facet_id] = s[facet_id] || [];
              s[facet_id].push(term);
              return s;
            }, {} as { [facet_id: string]: string[] });
            setSpec(newSpec);
          }}
        />

        <div className="d-flex justify-content-between gap-2">
          {searchResult.facets.map((f) => {
            let options = f.term_buckets.map((tb) => ({
              value: tb.term,
              label: `${tb.term} (${tb.count})`,
            }));
            return (
              <div className="flex-grow-1" key={f.facet_id}>
                {f.name}
                <Select
                  isMulti
                  value={options.filter(
                    ({ value }) =>
                      f.facet_id in spec && spec[f.facet_id].indexOf(value) > -1
                  )}
                  name={f.facet_id}
                  options={options}
                  onChange={(e) => {
                    setSpec({
                      ...spec,
                      [f.facet_id]: Array.from(e.values(), (v) => v.value),
                    });
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="row">
          <div className="col-5">
            {searchResult.facets.map((f) => (
              <div key={f.facet_id}>
                {f.name}
                <div>
                  {f.term_buckets.map((tb) => (
                    <div
                      key={tb.term}
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
                <label className="list-group-item" key={v.id}>
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
