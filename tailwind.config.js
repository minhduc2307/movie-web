/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            height: {
                custom: "calc(100vh - 88px)",
            },
            width: {
                "content-inner": "min(400px, 100%)",
            },
            gridTemplateColumns: {
                footer: "2fr 1fr 1fr 1fr",
            },
        },
    },
    plugins: [],
};
