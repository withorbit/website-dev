export async function load({ locals }) {
	return { authUser: locals.user };
}
