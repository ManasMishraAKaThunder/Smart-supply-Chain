import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
