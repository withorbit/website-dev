interface FileMetadata {
	title: string;
	updatedAt: string;
}

export async function load({ params }) {
	const file = await import(`../../content/legal/${params.page}.md`);

	return {
		content: file.default,
		meta: file.metadata as FileMetadata,
	};
}
