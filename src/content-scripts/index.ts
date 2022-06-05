import { MessageHub, MESSAGE_TYPES } from '../utils/messageHub'

const contentMsgHub = new MessageHub('content:background')
const popupMsgHub = new MessageHub('content:popup')
const links = document.querySelectorAll('a')

popupMsgHub.listen()
popupMsgHub.on(MESSAGE_TYPES.SWITCH, ({ payload }) => {
    if (payload) {
        processLinks(links)
    } else {
        restoreLinks(links)
    }
})

async function run() {
    const { data: whitelist } = await contentMsgHub.send(MESSAGE_TYPES.QUERY_WHITELIST)
    const host = window.location.hostname

    console.log('[LINK OPENER] whitelist', whitelist)
    if (whitelist.includes(host)) {
        return
    }
    
    processLinks(links)
}

function processLinks(links?: NodeListOf<HTMLAnchorElement>) {
    if (!links || links[0].dataset.backup_lo) {
        return
    }

    links.forEach(link => {
        link.dataset.backup_lo = link.target
        link.target = '_blank'
    })
}

function restoreLinks(links?: NodeListOf<HTMLAnchorElement>) {
    if (!links) return

    links.forEach(link => {
        link.target = link.dataset.backup_lo || ''
        link.removeAttribute('data-backup_lo')
    })
}

run()
