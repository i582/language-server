import * as lsp from "vscode-languageserver"
import {File} from "@server/psi/File"
import {TactCompiler} from "@server/compiler/TactCompiler"
import {URI} from "vscode-uri"

export class CompilerInspection {
    async inspect(file: File): Promise<lsp.Diagnostic[]> {
        if (file.fromStdlib) return []

        try {
            const filePath = URI.parse(file.uri).fsPath
            const errors = await TactCompiler.compile(filePath)

            return errors.map(error => ({
                severity: lsp.DiagnosticSeverity.Error,
                range: {
                    start: {
                        line: error.line,
                        character: error.character,
                    },
                    end: {
                        line: error.line,
                        character: error.character + (error.length ?? 1),
                    },
                },
                message: error.message,
                source: "tact-compiler",
                code: "compiler-error",
            }))
        } catch (error) {
            return []
        }
    }
}
