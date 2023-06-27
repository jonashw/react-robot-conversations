import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}></Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
