/* global chrome */
import React, {useEffect} from 'react';
import {Button, Typography} from "@material-ui/core"
import {useHistory} from "react-router-dom";

export default function LoginTip(props) {

    const loginRequest = () => {
        chrome.runtime.sendMessage({msg: "externalLogin"});
    }
    // const history = useHistory();

    useEffect(() => {
        /*const loginListener = (message, sender, sendResponse) => {
            if (message.message === 'success') {
                chrome.storage.local.set(['infraUser'], message.user);
                props.history.push('/friends');
            }
        }
        chrome.runtime.onMessage.addListener(loginListener);
        return (() => {
            chrome.runtime.onMessage.removeListener(loginListener);
        })*/
        if (props.user) {
            console.log("direct to friends");
            // console.log(props);
            // props.history.push("/friends");
        }
    }, [props.user]);

    useEffect(() => {
        console.log("mounted");
    }, [])

    return (
        <div style={{alignItems: 'center'}}>
            <Typography variant='h3'>
                You are not logged in. Log in Now?
            </Typography>
            <Button variant="contained" color="primary" onClick={loginRequest}>Login</Button>
        </div>
    )
}