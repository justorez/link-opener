import { MessageHub, MESSAGE_TYPES } from "./utils/messageHub"
import whitelist from './utils/whitelist'

const contentMsgHub = new MessageHub('content:background')
contentMsgHub.listen()

contentMsgHub.on(MESSAGE_TYPES.QUERY_WHITELIST, () => {
    return whitelist.toArray()
})