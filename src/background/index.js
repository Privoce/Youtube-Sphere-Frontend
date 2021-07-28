/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message == 'externalLogin') {
        chrome.tabs.create({"url": "http://ec2-18-166-42-129.ap-east-1.compute.amazonaws.com:8080/"})
    }
})