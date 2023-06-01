import { Voice } from "../Model";

const badgeProperties = [
  { label: "Age", getter: (v: Voice) => v.age },
  { label: "Gender", getter: (v: Voice) => v.gender },
  { label: "Language", getter: (v: Voice) => v.lang },
];
export default ({
  voice,
  asTable,
  variant,
  vertical,
}: {
  voice: Voice;
  asTable?: boolean | undefined;
  variant?: undefined | string;
  vertical?: boolean;
}) => {
  let showAsTable: boolean = asTable === undefined ? true : asTable;
  return (
    <>
      {showAsTable ? (
        <table className="table table-bordered">
          {badgeProperties.map(({ label, getter }) => (
            <tr>
              <th>{label}</th>
              <td>{getter(voice)}</td>
            </tr>
          ))}
        </table>
      ) : (
        badgeProperties.map(({ label, getter }) => (
          <span className={!!vertical ? "d-block text-end" : "me-1"}>
            <span className={`badge text-bg-${variant || "light"}`}>
              {getter(voice)}
            </span>
          </span>
        ))
      )}
    </>
  );
};
