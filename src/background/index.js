/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message == 'externalLogin') {
        chrome.tabs.create({"url": "https://login.qmcurtis.me/"})
    }
})