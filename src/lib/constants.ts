export const TWITCH_COLORS = [
	"rgb(0, 0, 255)",
	"rgb(0, 128, 0)",
	"rgb(0, 255, 127)",
	"rgb(30, 144, 255)",
	"rgb(46, 139, 87)",
	"rgb(95, 158, 160)",
	"rgb(138, 43, 226)",
	"rgb(154, 205, 50)",
	"rgb(178, 34, 34)",
	"rgb(210, 105, 30)",
	"rgb(218, 165, 32)",
	"rgb(255, 0, 0)",
	"rgb(255, 69, 0)",
	"rgb(255, 105, 180)",
	"rgb(255, 127, 80)",
] as const;

export const ROLE_COLORS = {
	Admin: "bg-red-500",
	Moderator: "bg-green-400",
	Maintainer: "bg-indigo-400",
	Contributor: "bg-cyan-400",
	Founder: "bg-amber-400",
	Subscriber: "bg-purple-500",
	Verified: "bg-slate-300",
} as const;
