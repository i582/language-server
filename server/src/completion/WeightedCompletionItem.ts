import {CompletionItem} from "vscode-languageserver-types"

export enum CompletionWeight {
    CONTEXT_ELEMENT = 0,
    VARIABLE = 50,
    PARAM = 60,
    FIELD = 70,
    KEYWORD = 80,
    FUNCTION = 90,
    SNIPPET = 95,
    CONSTANT = 100,
    PRIMITIVE = 105,
    STRUCT = 110,
    TRAIT = 120,
    LOWEST = 500,
}

export type WeightedCompletionItem = CompletionItem & {
    weight?: CompletionWeight
}

export class CompletionResult {
    elements: WeightedCompletionItem[] = []

    public add(...element: WeightedCompletionItem[]) {
        this.elements.push(...element)
    }

    public sorted(): CompletionItem[] {
        if (this.elements.length === 0) return []

        const sorted = this.elements.sort((a, b) => {
            if (!a.weight || !b.weight) return 0
            return a.weight - b.weight
        })

        let groupIndex = 0
        let lastWeight = sorted[0].weight ?? 0

        sorted.forEach(item => {
            if (lastWeight !== item.weight) {
                groupIndex++
                lastWeight = item.weight as number
            }

            item.sortText = groupIndex.toString()
        })

        return sorted
    }
}
