import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@pages/Root";
import "./index.css";
import UserProvider from "./context/UserProvider";
import FavoriteList from "@pages/FavoriteList";
import ModalProvider from "@context/ModalProvider";

const HomePage = lazy(() => import("@pages/HomePage"));
const MovieDetail = lazy(() => import("@pages/MovieDetail"));
const Watch = lazy(() => import("@pages/Watch"));
const SearchPage = lazy(() => import("@pages/SearchPage"));
const SignIn = lazy(() => import("@pages/SignIn"));
const SignUp = lazy(() => import("@pages/SignUp"));
const SingleMovie = lazy(() => import("@pages/SingleMovie"));
const TV = lazy(() => import("@pages/TV"));
const CartoonMovie = lazy(() => import("@pages/CartoonMovie"));
const NotFound = lazy(() => import("@pages/NotFound"));

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
            {
                path: "/favorite",
                element: <FavoriteList />,
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
    {
        path: "/*",
        element: <NotFound />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <ModalProvider>
                <RouterProvider router={router} />
            </ModalProvider>
        </UserProvider>
    </StrictMode>,
);
