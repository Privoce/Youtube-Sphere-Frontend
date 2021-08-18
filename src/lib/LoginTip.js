/* global chrome */
import React, {useEffect} from 'react';
import {Button, Typography} from "@material-ui/core"

export default function LoginTip(props) {

    const loginRequest = () => {
        chrome.runtime.sendMessage("externalLogin");
    }

    useEffect(() => {
        const loginListener = (message, sender, sendResponse) => {
            if (message.message === 'success') {
                chrome.storage.local.set(['infraUser'], message.user);
                props.history.push('/show');
            }
        }
        chrome.runtime.onMessage.addListener(loginListener);
        return (() => {
            chrome.runtime.onMessage.removeListener(loginListener);
        })
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