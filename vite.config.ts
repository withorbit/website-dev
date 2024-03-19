import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ["@prisma/client", "sveltekit-superforms", "zod"],
	},
});
