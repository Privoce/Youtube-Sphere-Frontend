/* global chrome */
import React, {useState, useEffect, useMemo} from 'react';
import LoginTip from "../lib/LoginTip";
import FriendsShow from "../lib/FriendsShow";
import {HashRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import {Paper, Container} from "@material-ui/core";
import "./index.css";
import {useMediaQuery} from "@material-ui/core";

function RoutedLoginTip({to, user}) {
    return (
        <Route
            path={to}
            render = {
                (routeProps) => {
                    console.log("render executed");
                    return <LoginTip user={user} {...routeProps}/>

                }
            }
        />
    )
}
function RoutedFriendsShow({to, user}) {
    return (
        <Route
            path={to}
            render={
                (routeProps) => <FriendsShow user={user} {...routeProps}/>
            }
        />
    )
}

export default function Popup() {
    const [user, setUser] = useState(null);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () => createTheme({
            palette: {
                type: prefersDarkMode ? 'dark' : 'light',
            }
        }),
        [prefersDarkMode],
    );

    useEffect(() => {
        chrome.storage.local.get(["infraUser"], (result) => {
            setUser(result.infraUser);
            console.log("user read:", result.infraUser);
            // alert(result.infraUser ? "success" : "null");
        })
        /*chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName == "local" && 'infraUser' in changes) {
                setUser(changes.infraUser.newValue);
            }
        })*/
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // console.log(message);
            if (message.msg == "login") {
                setUser(message.user);
                sendResponse("received");
            } else if (message.msg == "logout") {
                setUser(null);
                sendResponse("received");
            }
            return true;
        })
    }, [])

    return (
            <Container>
                {user ? <FriendsShow user={user} /> : <LoginTip user={user} />}
            </Container>
    )
}