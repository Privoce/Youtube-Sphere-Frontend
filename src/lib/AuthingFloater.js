/* global chrome */
import { useState, useEffect, useRef } from 'react';
import {AuthingGuard} from '@authing/react-ui-components'
import '@authing/react-ui-components/lib/index.min.css'
import { appId, GuardConfig } from "@/api/config";
import {IconButton} from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {infraEvent} from "./helper";
import {useLanguage} from "uselanguage";



export default function AuthingFloater({ serverSync, openDialog }) {
    const [guardOpen, setGuardOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isReg, setIsReg] = useState(false);
    const currAuthClient = useRef(null);
    const {
        language: {value: lang}
    } = useLanguage();

    const handleGuardLoaded = async (authClient) => {
        currAuthClient.current = authClient;
        const currUser = await authClient.getCurrentUser();
        if (currUser) {
            if (process.env.REACT_APP_CHROME_EXT == 'true') {
                chrome.storage.local.set({infraUser: currUser}, () => {
                    console.log("injection success")
                })
            }
            setGuardOpen(false);
            setUser(currUser)
        }
    }
    const handleGuardLogin = async (user) => {
        console.log(user)
        setUser(user)
        setGuardOpen(false)
    }
    const handleGuardClose = () => {
        setGuardOpen(false)
    }
    const handleRegisterSuccess = (user) => {
        setUser(user);
        setIsReg(true);
        setGuardOpen(false)
    }
    const handleProfileButton = () => {
        if (user) {
            openDialog(); // change to toggleDialog
        } else {
            setGuardOpen(true);
        }
    }
    useEffect(() => {
        const statusInvalidHandler = infraEvent.addListener('statusInvalid', () => {
            setGuardOpen(true)
        })
        return () => infraEvent.removeListener(statusInvalidHandler)
    }, []);
    useEffect(() => {
        const initialRequest = async () => {
            const auth = currAuthClient.current;
            const { status } = await auth.checkLoginStatus();
            if (!status) return;
            if (isReg) {
                serverSync(user)
            }
        }
        if (user) {
            initialRequest();
        }
    }, [user, isReg]);
    return (
        <div>
            <AuthingGuard
                visible={guardOpen}
                onRegisterInfoCompleted={handleRegisterSuccess}
                onLoad={handleGuardLoaded}
                onLogin={handleGuardLogin}
                onClose={handleGuardClose}
                appId={appId}
                config={GuardConfig}
            />
            <IconButton onClick={handleProfileButton} style={{position: "absolute"}}>
                <AccountCircleIcon />
            </IconButton>
        </div>
    );
}