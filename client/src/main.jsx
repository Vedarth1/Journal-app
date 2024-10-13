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
import EditJournal from "./pages/EditJournal.jsx";
import PublicJournalPage from "./pages/publicjournalpage.jsx";
import ViewSharedJournal from "./pages/viewSharedJournal.jsx";

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
  },
  {
    path:"/user/edit-journal/:id",
    element: <EditJournal/>
  },
  {
    path:"/public/journal/:public_url",
    element:<PublicJournalPage/>
  },
  {
    path:"/user/sharedjournal/:permission/:id",
    element:<ViewSharedJournal/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
