import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <div>dashboard</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
