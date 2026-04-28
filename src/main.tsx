
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

/* ── Apply saved theme BEFORE React renders to prevent flash ── */
(function () {
  try {
    const saved = localStorage.getItem("vama-theme");
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

createRoot(document.getElementById("root")!).render(<App />);