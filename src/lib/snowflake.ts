import dayjs, { type Dayjs } from "dayjs";

export class Snowflake {
	#increment = 0n;

	public static readonly EPOCH = 1696118400000n;

	public static compare(a: string, b: string): number {
		return a === b ? 0 : a.length < b.length ? -1 : a.length > b.length ? 1 : a < b ? -1 : 1;
	}

	public static toDate(id: string): Dayjs {
		return dayjs(Number((BigInt(id) >> 22n) + Snowflake.EPOCH));
	}

	public next(): string {
		const increment = this.#increment;
		this.#increment = (increment + 1n) & 4095n;

		return (((BigInt(Date.now()) - Snowflake.EPOCH) << 22n) | (increment & 4095n)).toString();
	}
}

export const snowflake = new Snowflake();
