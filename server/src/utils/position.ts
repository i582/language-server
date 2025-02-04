import * as lsp from "vscode-languageserver/node"
import * as Parser from "web-tree-sitter"

export function asNullableLspRange(node: Parser.Node | null | undefined): lsp.Range {
    if (!node) {
        return lsp.Range.create(0, 1, 0, 1)
    }

    return lsp.Range.create(
        node.startPosition.row,
        node.startPosition.column,
        node.endPosition.row,
        node.endPosition.column,
    )
}

export function asLspRange(node: Parser.Node): lsp.Range {
    return lsp.Range.create(
        node.startPosition.row,
        node.startPosition.column,
        node.endPosition.row,
        node.endPosition.column,
    )
}

export function asParserPoint(position: lsp.Position): Parser.Point {
    return {
        column: position.character,
        row: position.line,
    }
}

export function asLspTextEdit(
    start: Parser.Point,
    end: Parser.Point,
    newText: string,
): lsp.TextEdit {
    return {
        range: lsp.Range.create(start.row, start.column, end.row, end.column),
        newText,
    }
}
