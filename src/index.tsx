import React from "react";
import ReactDOM from "react-dom/client";
import SketchesRoute from "./routes/SketchesRoute";
import { SketchRoute } from "./routes/SketchRoute";
import ErrorPage from "./ErrorPage";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <div style={{ height: "100vw" }}>
          <Outlet />
        </div>
      }
      errorElement={<ErrorPage />}
    >
      <Route path="/sketches/:sketch_id" element={<SketchRoute />} />
      <Route index element={<SketchesRoute />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
