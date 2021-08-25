/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.msg == 'externalLogin') {
        chrome.tabs.create({"url": "https://nicegoodthings.com/transfer/user/sphere "})
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('url changed.')
        chrome.tabs.sendMessage( tabId, {
            message: 'retryInject',
            url: changeInfo.url
        })
    }
})