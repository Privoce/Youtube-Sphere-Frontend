/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import {infraEvent} from "@/lib/helper";
import FriendsButton from "../lib/FriendsButton";
import SearchButton from "../lib/SearchButton";
import FriendsLikedBar from "../lib/FriendsLikedBar";
import ReactionButton from "../lib/ReactionButton";
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
            document.querySelector("ytd-rich-grid-renderer").insertBefore(likedBar,document.querySelector(".ytd-rich-grid-renderer #contents"));
            likedBar.style.width="92%";
            likedBar.style.marginLeft="2vw";
            ReactDOM.render(<FriendsLikedBar/>, likedBar);
            likedBarInjectionFlag = true;
        }
    }

    let buttonBar=document.createElement('div')
    buttonBar.id='buttonBar'
    document.getElementById("end").insertBefore(buttonBar,document.getElementById("buttons"))
    ReactDOM.render(<ButtonBar/>,buttonBar)

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
                document.querySelector("ytd-rich-grid-renderer").insertBefore(likedBar,document.querySelector(".ytd-rich-grid-renderer #contents"));
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

console.log("added")