import pino from "pino";
import pretty from "pino-pretty";
import { dev } from "$app/environment";

const stream = pretty({ colorize: true })

export const logger = pino(dev ? stream : {})
