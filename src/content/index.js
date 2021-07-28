/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import {infraEvent} from "@/lib/helper";
import FriendsButton from "../lib/FriendsButton";
import SearchButton from "../lib/SearchButton";

function mockServerSync(user) {
    console.log('mock', user);
}


function SharingButton() {
    // generating invitation link and popup
}
function ReactionButton() {
    // now: like this video, record url, timestamp, reactionType, (upload to personal server)\
    // TODO: extend reaction type, cancelling
}
function SocialToolBar() {
    // abstract div
}
console.log("before");

function ButtonDiv() {
    return (
        <>
            <SearchButton />

        </>
    )
}

// eslint-disable-next-line no-restricted-globals
if (location.href.indexOf('youtube') !== -1) {
    let floaterDiv = document.createElement("div");
    floaterDiv.id = "infra-full-container";
    document.querySelector("body").appendChild(floaterDiv);
    ReactDOM.render(<ButtonDiv />, document.querySelector("#infra-full-container"));
}



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