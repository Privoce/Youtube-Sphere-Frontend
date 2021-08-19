/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message == 'externalLogin') {
        chrome.tabs.create({"url": "https://stage.nicegoodthings.com/"})
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