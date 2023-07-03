import React from "react";
import { Outlet, useLoaderData, Link, NavLink } from "react-router-dom";
import { VoiceBoard, VoiceIndex } from "../Model";
import { getSketches, getVoiceIndex } from "../DataService";

export const loader = async ({ params }: { params: any }) => {
  let id = parseInt(params.sketch_id || "");
  let voiceIndex = await getVoiceIndex();
  let sketches = await getSketches(voiceIndex);
  let sketch = sketches.filter((s) => s.id === id)[0];
  if (!sketch) {
    throw "Did not find sketch by id " + id;
  }
  return { sketch, voiceIndex };
};

export const action = async () => {};

export function SketchRoute() {
  const { sketch, voiceIndex } = useLoaderData() as {
    sketch: VoiceBoard;
    voiceIndex: VoiceIndex;
  };

  return (
    <div>
      {!!sketch && !!voiceIndex ? (
        <div style={{ flexGrow: 1 }}>
          <nav
            className="navbar bg-body-tertiary mb-2"
            style={{ position: "sticky", top: "0", zIndex: 3000 }}
          >
            <form
              className="container-fluid justify-content-between"
              style={{ flexWrap: "nowrap" }}
            >
              <Link className="btn btn-lg me-3" to="/">
                ‹
              </Link>
              <a
                className="navbar-brand flex-grow-1"
                style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {sketch.name}
              </a>
            </form>
          </nav>
          <ul className="nav nav-tabs nav-fill mb-2">
            {(
              [
                ["Play", "play"],
                ["Edit", "edit"],
              ] as [string, string][]
            ).map(([label, to]) => (
              <li className="nav-item">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="container-fluid" style={{ paddingBottom: "4em" }}>
            <Outlet />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
