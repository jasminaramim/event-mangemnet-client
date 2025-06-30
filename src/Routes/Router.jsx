import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Home/Home";
import App from "../App";
import NotFound from "../Components/Shared/NotFound";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import AddEvents from "../Components/Event/AddEvents";
import MyEvents from "../Components/Event/MyEvents";
import EventsAll from "../Components/Home/EventsAll";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    
      {
        path: "/add-event",
        element: (
          <PrivateRoute>
            <AddEvents/>
          </PrivateRoute>
        )
      },
        {
        path: "/my-events",
        element: (
          <PrivateRoute>
            <MyEvents/>
          </PrivateRoute>
        )
      },
      {
        path: "events",
        element: (
          <PrivateRoute>
            <EventsAll/>
          </PrivateRoute>
        )
      },
    ],
  },
    {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
