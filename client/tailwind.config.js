/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				jost: ["Jost"],
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: ["autumn", "sunset"],
		darkTheme: "sunset",
	},
};
