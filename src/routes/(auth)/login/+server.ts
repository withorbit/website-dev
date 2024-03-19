import { redirect } from "@sveltejs/kit";

export async function GET({ locals }) {
	if (!locals.user) {
		redirect(302, "/");
	}

	return new Response();
}
