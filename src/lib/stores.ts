import type { User } from "lucia";
import { writable } from "svelte/store";

export const currentUser = writable<User | null>(null);
export const busy = writable(false);

export const notificationsOpen = writable(false);
// export const colorPickerOpen = writable(false);

export const emoteDeleteOpen = writable(false);
export const emoteReportOpen = writable(false);

export const setCreateOpen = writable(false);
export const setDeleteOpen = writable(false);
export const setEditOpen = writable(false);
export const setSelectOpen = writable(false);

export const editorSelectOpen = writable(false);
export const userSelectOpen = writable(false);
