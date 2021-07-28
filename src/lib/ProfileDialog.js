/* eslint-disable no-restricted-globals */
/* global chrome */
import {Dialog, DialogContent, DialogActions, DialogContentText, Button, Avatar} from "@material-ui/core";
import {List, ListItem} from "@material-ui/core";
import {useState, useEffect} from "react";
import {useLanguage} from "uselanguage";
import {useAuthing} from "@authing/react-ui-components";
import {appId, appHost} from "../api/config";



export default function ProfileDialog({ closeDialog }) {
    const [open, setOpen] = useState(true);
    const [currUser, setCurrUser] = useState(null);
    const {
        language: {
            words: profile
        }
    } = useLanguage();
    const { authClient } = useAuthing({
        appId,
        appHost
    });
    useEffect(() => {
        const init = async () => {
            const user = await authClient.getCurrentUser();
            setCurrUser(user)
        }
        init();
    }, [])

    const handleLogout = () => {
        if (confirm("Sure to Log Out?")) {
            authClient.logout();
            if (process.env.REACT_APP_CHROME_EXT == 'true') {
                chrome.storage.local.set({infraUser: ''})
            }
            location.reload()
        }
    }
    if (!currUser)
        return (
            <Dialog open={true}>
                <DialogContent>
                    <DialogContentText>
                        Loading
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color={"primary"} fullWidth={true} onClick={closeDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    const {username, phone, email, photo} = currUser;

    return (
        <Dialog open={open}>
            <DialogContent>
                <List>
                    <ListItem>
                        {profile.avatar}
                        <Avatar alt={username} src={photo} />
                    </ListItem>
                    <ListItem>
                        {profile.name}
                        {username || 'NONAME'}
                    </ListItem>
                    {phone && <ListItem>
                        {profile.mobile}
                        {phone}
                    </ListItem>}
                    {email && <ListItem>
                        {profile.email}
                        {email}
                    </ListItem>}
                </List>
            </DialogContent>
            <DialogActions>
                <Button color={"primary"} onClick={closeDialog}>
                    {profile.logout}
                </Button>
            </DialogActions>
        </Dialog>
    )
}