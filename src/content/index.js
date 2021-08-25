/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import {infraEvent} from "@/lib/helper";
import FriendsButton from "../lib/FriendsButton";
import SearchButton from "../lib/SearchButton";
import FriendsLikedBar from "../lib/FriendsLikedBar";
import ReactionButton from "../lib/ReactionButton";
import {createUserRequest} from "../api/request";
import ButtonBar from "../lib/ButtonBar";


function ButtonDiv() {
    return (
        <>
            <SearchButton />
            <FriendsButton />
            <ReactionButton />
        </>
    )
}

let likedBarInjectionFlag = false;


// eslint-disable-next-line no-restricted-globals
if (location.href.indexOf('youtube') !== -1) {
    if (!likedBarInjectionFlag) {
        console.log("first try");
        if (document.querySelector("ytd-rich-grid-renderer")) {
            let likedBar=document.createElement('div');
            likedBar.id="likedBar";
            likedBar.className="likedBar";
            let fatherElement = document.querySelector("ytd-rich-grid-renderer")
            fatherElement.insertBefore(likedBar,document.querySelector("ytd-rich-grid-renderer div.ytd-rich-grid-renderer"));
            likedBar.style.width="92%";
            likedBar.style.marginLeft="2vw";
            ReactDOM.render(<FriendsLikedBar/>, likedBar);
            likedBarInjectionFlag = true;
        }
    }

    let buttonBar=document.createElement('div')
    buttonBar.id='buttonBar'
    let fatherDivForButtons = document.querySelector("#info");
    fatherDivForButtons.insertBefore(buttonBar,fatherDivForButtons.querySelector("#info-contents"));
    ReactDOM.render(<ReactionButton />,buttonBar);
    console.log(fatherDivForButtons);

    // let floaterDiv = document.createElement("div");
    // floaterDiv.id = "infra-full-container";
    // document.querySelector("body").appendChild(floaterDiv);
    // ReactDOM.render(<ButtonDiv />, document.querySelector("#infra-full-container"));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message.message);
    // eslint-disable-next-line no-restricted-globals
    if (message.message === 'retryInject' && location.href.indexOf('youtube') !== -1) {
        if (!likedBarInjectionFlag) {
            console.log("second try");
            if (document.querySelector("ytd-rich-grid-renderer")) {
                let likedBar=document.createElement('div');
                likedBar.id="likedBar";
                likedBar.className="likedBar";
                let fatherElement = document.querySelector("ytd-rich-grid-renderer")
                fatherElement.insertBefore(likedBar,document.querySelector("ytd-rich-grid-renderer div.ytd-rich-grid-renderer"));
                likedBar.style.width="92%";
                likedBar.style.marginLeft="2vw";
                ReactDOM.render(<FriendsLikedBar/>, likedBar);
                likedBarInjectionFlag = true;
            }
        }
    }
})

console.log("aft");

window.addEventListener("message", (event) => {
    console.log("message");
    if (event.source != window) {
        return;
    }

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Status update: ", event.data.text);
        if (event.data.text == "login") {
            chrome.storage.local.set({infraUser: event.data.user}, () => {
                console.log("infraUser is set to: ", event.data.user);
            })
            infraEvent.emit("statusChange")
        } else if (event.data.text == "logout") {
            chrome.storage.local.set({infraUser: ""}, () => {
                console.log("infraUser is set to: ");
            });
            infraEvent.emit("statusChange")
        }
    }
})

document.addEventListener('SPHERE_LOGIN', (event) => {
    console.log(event);
    console.log(event.detail.user)
    chrome.storage.local.set({infraUser: event.detail.user}, () => {
        console.log("infraUser is set to:", event.detail.user);
        const currUser = event.detail.user;
        createUserRequest(currUser.id,currUser.nickname??currUser.username).then((response)=>{
            console.log(response.data)
        })
    })
    infraEvent.emit("statusChange", { user: event.detail.user });
    chrome.runtime.sendMessage({
        msg: "login",
        user: event.detail.user
    }, (response) => {
        console.log(response);
    })
    console.log("message sent");
});
document.addEventListener('SPHERE_LOGOUT', (event) => {
    chrome.storage.local.set({infraUser: ''}, () => {
        console.log("infraUser is set to: ");
    })
    infraEvent.emit("statusChange", { user: "" });
    chrome.runtime.sendMessage({
        msg: "logout"
    }, (response) => {
        console.log(response);
    })
})

console.log("added")