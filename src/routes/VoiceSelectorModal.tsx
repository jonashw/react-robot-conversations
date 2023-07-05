import Modal from "../ui/Modal";
import React from "react";
import { FacetedSpecification, VoiceIndex, Voice } from "../Model";
import Select from "react-select";
import "../ui/react-select.scss";
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
  forceFilterMenuOpen,
}: {
  voiceIndex: VoiceIndex;
  onVoiceSelect: (v: Voice) => void;
  shown: boolean;
  setShown: (s: boolean) => void;
  forceFilterMenuOpen?: boolean;
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
      scrollable
      headerContent={
        <div className="d-grid gap-2">
          <div>
            Showing {searchResult.records.length} of{" "}
            {voiceIndex.ix.records.length} voices
          </div>
          <Select
            menuIsOpen={forceFilterMenuOpen ? true : undefined}
            classNamePrefix="react-select"
            className="react-select-container"
            isMulti
            placeholder="Filter voices..."
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
        </div>
      }
      footerContent={
        <button
          className="btn btn-success"
          disabled={!selectedVoice}
          onClick={() => {
            onVoiceSelect(selectedVoice!);
            setShown(false);
            setSelectedVoice(undefined);
          }}
        >
          Select {!!selectedVoice && `"${selectedVoice.name}"`}
        </button>
      }
    >
      <div className="d-grid gap-2">
        <div>
          Showing {searchResult.records.length} of{" "}
          {voiceIndex.ix.records.length} voices
        </div>

        <div className="list-group">
          {searchResult.records.map((v: Voice) => (
            <label className="list-group-item" key={v.id}>
              <div className="d-flex justify-content-start align-items-baseline">
                <input
                  type="radio"
                  name="voice_id"
                  value={v.id}
                  onChange={(e) => setSelectedVoiceById(e.target.value)}
                />
                <div className="ps-2">
                  {v.name}
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
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
};
