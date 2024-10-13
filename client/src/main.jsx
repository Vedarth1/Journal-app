import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import ErrorPage from './pages/errorpage.jsx'
import Login from './pages/login.jsx';
import SignUp from "./pages/signup.jsx";
import './index.css'
import DashBoard from "./pages/dashboard.jsx";
import ViewJournal from "./pages/ViewJournal.jsx";
import CreateJournal from "./pages/createJournal.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/user/dashboard",
    element: <DashBoard/>
  },
  {
    path:"/user/viewjournal/:id",
    element: <ViewJournal/>
  },
  {
    path:"/user/createjournal",
    element: <CreateJournal/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
