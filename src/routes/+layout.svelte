<script lang="ts">
	import "../app.css";

	import dayjs from "dayjs";
	import localizedFormat from "dayjs/plugin/localizedFormat";
	import { Toaster } from "$lib/components/ui/sonner";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
	import ProgressBar from "$lib/components/ProgressBar.svelte";

	dayjs.extend(localizedFormat);
</script>

<ProgressBar />

<div class="flex min-h-screen flex-col overflow-clip">
	<Header />

	<main class="grow">
		<slot />
	</main>

	<Footer />
</div>

<Notifications />
<Toaster />
