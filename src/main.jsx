import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@pages/Root";
import "./i18n";
import "./index.css";
import UserProvider from "./context/UserProvider";
import ThemeProvider from "./context/ThemeProvider";
import Spinner from "@components/Spinner";
import ProtectedRoute from "@components/ProtectedRoute";
import ErrorPage from "@pages/ErrorPage";

const HomePage = lazy(() => import("@pages/HomePage"));
const CatalogPage = lazy(() => import("@pages/CatalogPage"));
const MovieDetail = lazy(() => import("@pages/MovieDetail"));
const Watch = lazy(() => import("@pages/Watch"));
const FavoriteList = lazy(() => import("@pages/FavoriteList"));
const SignIn = lazy(() => import("@pages/SignIn"));
const SignUp = lazy(() => import("@pages/SignUp"));
const NotFound = lazy(() => import("@pages/NotFound"));

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/movies",
                element: <CatalogPage />,
            },
            {
                path: "/movies/:slug",
                element: <MovieDetail />,
            },
            {
                path: "/favorites",
                element: (
                    <ProtectedRoute>
                        <FavoriteList />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/watch/:slug",
        element: (
            <Suspense fallback={<Spinner fullScreen />}>
                <Watch />
            </Suspense>
        ),
    },
    {
        path: "/sign-in",
        element: (
            <Suspense fallback={<Spinner />}>
                <SignIn />
            </Suspense>
        ),
    },
    {
        path: "/sign-up",
        element: (
            <Suspense fallback={<Spinner />}>
                <SignUp />
            </Suspense>
        ),
    },
    {
        path: "*",
        element: (
            <Suspense fallback={<Spinner />}>
                <NotFound />
            </Suspense>
        ),
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </ThemeProvider>
    </StrictMode>
);
