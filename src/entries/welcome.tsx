import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Welcome from "./welcome/index";

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <Welcome />
  </StrictMode>
);
