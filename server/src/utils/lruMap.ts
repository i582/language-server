export class LRUMap<K, V> extends Map<K, V> {
    constructor(private readonly _options: {size: number; dispose: (entries: [K, V][]) => void}) {
        super()
    }

    override set(key: K, value: V) {
        super.set(key, value)
        this._checkSize()
        return this
    }

    override get(key: K): V | undefined {
        if (!this.has(key)) {
            return undefined
        }
        const result = super.get(key)
        if (result === undefined) return undefined

        this.delete(key)
        this.set(key, result)
        return result
    }

    private _checkSize(): void {
        setTimeout(() => {
            const slack = Math.ceil(this._options.size * 0.3)

            if (this.size < this._options.size + slack) {
                return
            }
            const result = Array.from(this.entries()).slice(0, slack)
            for (const [key] of result) {
                this.delete(key)
            }
            this._options.dispose(result)
        }, 0)
    }
}
