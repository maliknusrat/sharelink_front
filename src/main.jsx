import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import SIgnIn from "./pages/Authentication/SignIn/SIgnIn";
import FromUpload from './pages/FromUpload/FromUpload';
import SignUp from "./pages/Authentication/SignUp/SignUp";
import Main from './Layout/Main';
import AllFiles from "./pages/FromUpload/AllFiles";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/fileupload",
        element: <FromUpload />,
      },
      {
        path: "/allfiles",
        element: <AllFiles />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SIgnIn />,
  },
]);


//KEY: 321561368724537
//SECRET:J8CN5BsNk4bZIBUib1rGv1tLR_c
// CLOUDE NAME: dtpk8agke
// Mongodb
// pass:czH62FxmasoX9tbt
// user:sharelink


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);