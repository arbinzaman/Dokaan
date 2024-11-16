import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/landingPage/home/Homee";
import Main from "../layouts/Main";
import Login from "../pages/landingPage/home/Login";
import SignUp from "../pages/landingPage/home/SignUp";
    
const router = createBrowserRouter ([
    {
        path: "/",
        element: <Main/>,
        children:[
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/signup",
                element: <SignUp/>
            }
        ]
    }
]);

export default router;