import { mdsvex } from "mdsvex";
import sequence from "svelte-sequential-preprocessor";
import { preprocessMeltUI } from "@melt-ui/pp";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/**
 * @type {import("@sveltejs/kit").Config}
 */
export default {
	extensions: [".svelte", ".svx", ".md"],
	preprocess: sequence([
		vitePreprocess(),
		preprocessMeltUI(),
		mdsvex({ extensions: [".svx", ".md"] }),
	]),
	kit: {
		adapter: adapter(),
		alias: {
			"$routes/*": "./src/routes/*",
		},
	},
};
