import * as lsp from "vscode-languageserver"
import {File} from "@server/psi/File"
import {Contract} from "@server/psi/Decls"
import {UnusedInspection} from "./UnusedInspection"
import {superConstant, superField, superMethod} from "@server/search/implementations"

export class UnusedContractMembersInspection extends UnusedInspection {
    protected checkFile(file: File, diagnostics: lsp.Diagnostic[]): void {
        file.getContracts().forEach(contract => {
            this.inspectContract(contract, diagnostics)
        })
    }

    private inspectContract(contract: Contract, diagnostics: lsp.Diagnostic[]) {
        contract.ownFields().forEach(field => {
            const nameIdent = field.nameIdentifier()
            if (!nameIdent) return

            this.checkUnused(nameIdent, contract.file, diagnostics, {
                kind: "Field",
                code: "unused-field",
                rangeNode: nameIdent,
                skipIf: () => superField(field) !== null,
            })
        })

        contract.ownConstants().forEach(constant => {
            const nameIdent = constant.nameIdentifier()
            if (!nameIdent) return

            this.checkUnused(nameIdent, contract.file, diagnostics, {
                kind: "Constant",
                code: "unused-constant",
                rangeNode: nameIdent,
                skipIf: () => superConstant(constant) !== null,
            })
        })

        contract.ownMethods().forEach(method => {
            if (method.isGetMethod) return // get methods are always used

            const nameIdent = method.nameIdentifier()
            if (!nameIdent) return

            this.checkUnused(nameIdent, contract.file, diagnostics, {
                kind: "Method",
                code: "unused-method",
                rangeNode: nameIdent,
                skipIf: () => superMethod(method) !== null,
            })
        })
    }
}
