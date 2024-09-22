import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@pages/Root";
import HomePage from "@pages/HomePage";
import MovieDetail from "@pages/MovieDetail";
import Watch from "@pages/Watch";
import SearchPage from "@pages/SearchPage";
import SignIn from "@pages/SignIn";
import SignUp from "@pages/SignUp";
import SingleMovie from "@pages/SingleMovie";
import TV from "@pages/TV";
import CartoonMovie from "@pages/CartoonMovie";

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/info/:slug",
                element: <MovieDetail />,
            },
            {
                path: "/watch/:slug",
                element: <Watch />,
            },
            {
                path: "/search",
                element: <SearchPage />,
            },
            {
                path: "/movie",
                element: <SingleMovie />,
            },
            {
                path: "/tv",
                element: <TV />,
            },
            {
                path: "/cartoon",
                element: <CartoonMovie />,
            },
        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "/sign-up",
        element: <SignUp />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
