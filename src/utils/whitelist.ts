class Whitelist {
    STORAGE_KEY = 'whitelist'
    list: Set<string> = new Set()
    storage = chrome.storage.sync

    constructor() {
        this.storage.get(this.STORAGE_KEY, (item) => {
            const listJSON = item[ this.STORAGE_KEY ]
            this.list = new Set(
                listJSON ? JSON.parse(listJSON) : []
            )
        })
    }

    add(urls: string | string[]) {
        if (!Array.isArray(urls)) {
            urls = [ urls ]
        }
        urls.forEach(url => url && this.list.add(url))
        this.persist()
    }

    remove(urls: string | string[]) {
        if (!Array.isArray(urls)) {
            urls = [ urls ]
        }
        urls.forEach(x => this.list.delete(x))
        this.persist()
    }

    has(url: string | undefined) {
        return url ? this.list.has(url) : false
    }

    save(urls: string[]) {
        this.list.clear()
        this.add(urls)
        this.persist()
    }

    toArray() {
        return [ ...this.list ]
    }

    toJSON() {
        return JSON.stringify( this.toArray() )
    }

    private persist() {
        this.storage.set({
            [this.STORAGE_KEY]: this.toJSON()
        })
    }
}

export default new Whitelist()
