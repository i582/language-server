import {Connection} from "vscode-languageserver"
import * as fs from "fs"
import * as path from "path"

export class Logger {
    private logFile: fs.WriteStream | null = null
    private static instance: Logger | null = null

    private constructor(
        private connection: Connection,
        logPath?: string,
    ) {
        if (logPath) {
            const logDir = path.dirname(logPath)
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, {recursive: true})
            }
            this.logFile = fs.createWriteStream(logPath, {flags: "a"})
        }
    }

    static initialize(connection: Connection, logPath?: string): Logger {
        if (!Logger.instance) {
            const instance = new Logger(connection, logPath)

            console.log = (...args) => {
                instance.log(...args)
            }
            console.info = (...args) => {
                instance.info(...args)
            }
            console.warn = (...args) => {
                instance.warn(...args)
            }
            console.error = (...args) => {
                instance.error(...args)
            }

            Logger.instance = instance
        }
        return Logger.instance
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            throw new Error("Logger not initialized")
        }
        return Logger.instance
    }

    private formatDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, "0")

        const year = date.getFullYear().toString()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())
        const seconds = pad(date.getSeconds())

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
    }

    private formatMessage(args: unknown[]): string {
        return args
            .filter(arg => arg !== undefined)
            .map(arg => (typeof arg === "object" ? JSON.stringify(arg) : arg.toString()))
            .join(" ")
    }

    private writeToFile(message: string) {
        if (this.logFile) {
            this.logFile.write(message + "\n")
        }
    }

    log(...args: unknown[]) {
        const message = this.formatMessage(args)
        this.connection.console.log(message)
        this.writeToFile(`[LOG] [${this.formatDate(new Date())}] ${message}`)
    }

    info(...args: unknown[]) {
        const message = this.formatMessage(args)
        this.connection.console.info(message)
        this.writeToFile(`[INFO] [${this.formatDate(new Date())}] ${message}`)
    }

    warn(...args: unknown[]) {
        const message = this.formatMessage(args)
        this.connection.console.warn(message)
        this.writeToFile(`[WARN] [${this.formatDate(new Date())}] ${message}`)
    }

    error(...args: unknown[]) {
        const message = this.formatMessage(args)
        this.connection.console.error(message)
        this.writeToFile(`[ERROR] [${this.formatDate(new Date())}] ${message}`)
    }

    dispose() {
        if (this.logFile) {
            this.logFile.end()
            this.logFile = null
        }
    }
}
