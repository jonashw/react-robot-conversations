import React from "react";
import ReactDOM from "react-dom/client";
import {
  SketchesRoute,
  loader as SketchesLoader,
} from "./routes/SketchesRoute";
import { SketchRoute, loader as SketchLoader } from "./routes/SketchRoute";
import { loader as HomeLoader, HomeRoute } from "./routes/HomeRoute";
import ErrorPage from "./ErrorPage";
import DarkModeToggle from "./ui/DarkModeToggle";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  useNavigation,
} from "react-router-dom";

const RootRoute = () => {
  const navigation = useNavigation();

  return (
    <div style={{ height: "100vw" }}>
      {navigation.state === "loading" ? <div>Loading...</div> : <></>}
      <Outlet />
      <div className="d-none">
        <DarkModeToggle />
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootRoute />} errorElement={<ErrorPage />}>
      <Route index loader={SketchesLoader} element={<SketchesRoute />} />
      <Route
        path="/sketches/:sketch_id"
        loader={SketchLoader}
        element={<SketchRoute />}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
