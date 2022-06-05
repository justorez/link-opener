type Handler = ({
    payload,
    sender
}: {
    payload: any
    sender: chrome.runtime.MessageSender
}) => any

interface Message {
    type: string,
    payload: any
}

export class MessageHub {
    handlers: { [key: string]: Handler } = {}
    namespace = ''

    constructor(namespace?: string) {
        this.namespace = namespace || ''
    }

    listen() {
        chrome.runtime.onMessage.addListener(
            (message: Message, sender, sendResponse) => {
                const { type, payload } = message
                if (!type.startsWith(this.namespace)) {
                    return
                }

                console.log('[message received]', type, payload)
                const handler = this.handlers[type]

                if (!handler) {
                    sendResponse({ data: 'Not Found Handler!' })
                    return true
                }

                const res = handler({ payload, sender })
                if (res && res.then) {
                    res.then((data: any) => sendResponse({ data }))
                } else {
                    sendResponse({ data: res })
                }

                // 保持消息通道一直对 sender 开放，直到 sendResponse 方法调用完毕
                return true
            }
        )
    }

    send(type: string, payload?: any) {
        return chrome.runtime.sendMessage({ 
            type: this._genType(type), 
            payload 
        })
    }

    async sendTab(type: string, payload?: any) {
        const [ tab ] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        })
        return chrome.tabs.sendMessage(tab.id as number, {
            type: this._genType(type),
            payload
        })
    }

    on(type: string, handler: Handler) {
        type = this._genType(type), 
        this.handlers[type] = handler
    }

    _genType(type: string) {
        return this.namespace ? `${this.namespace}:${type}` : type
    }
}

export const MESSAGE_TYPES = {
    QUERY_WHITELIST: 'query_whitelist',
    CLOSE: 'close',
    OPEN: 'open',
    SWITCH: 'switch'
}

export default new MessageHub()
