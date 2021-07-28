/* global chrome */
import React from "react";
import {
    Button,
    Dialog,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    DialogContent,
    DialogActions,
    IconButton,
    Typography
} from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People'
import {useEffect, useState} from "react";
import {appId, appHost} from "../api/config";
import {infraEvent} from "./helper";
import {useLanguage} from "uselanguage";
import {getFriendsList} from "@/api/request";

export default function FriendsButton() {
    // see friends list
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null);
    const [open, setOpen] = useState(false)

    /*const {
        language: {
            words: profile
        }
    } = useLanguage();*/
    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }
    const getFriends = (user) => {
        // call backend interface
        setFriends(null);
    }

    useEffect(() => {
        const statusChangeHandler = infraEvent.addListener("statusChange", () => {
            chrome.storage.local.get(["infraUser"], (result) => {
                if (result.infraUser) {
                    setUser(result.infraUser)
                } else {
                    setUser(null)
                }
            })
        })
        console.log("mounted");
        chrome.storage.local.get(["infraUser"], (result) => {
            if (result.infraUser) {
                setUser(result.infraUser)
            } else {
                setUser(null)
            }
        })
        return (() => {
            infraEvent.removeListener(statusChangeHandler)
        })
    }, [])

    const toggleDialog = async () => {
        chrome.storage.local.get(["infraUser"], (result) => {
            console.log(result);
            const currUser = result.infraUser;
            if (!currUser && !open) {
                // eslint-disable-next-line no-restricted-globals
                if(confirm("You are not logged in. Log in first?")) {
                    chrome.runtime.sendMessage("externalLogin");
                }
                return;
            }
            if (currUser && !open) {
                getFriendsList(currUser.id, currUser.token).then((response) => {
                    return response.json();
                }).then((response) => {
                    if (response.friends) {
                        setFriends(response.friends);
                    }
                }).catch((err) => {
                    console.log("axios err at getFriendsList", err);
                })
            }
            setOpen(!open);
        })

    }

    const renderDialog = () => {
        return (
            friends ?
                <List>
                    {friends.map((friend) => {
                        const {username, phone, email, photo} = friend;
                        return (
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt={username} src={photo}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={username || 'NONAME'}
                                        secondary={
                                            <>
                                                {phone && (
                                                    <Typography display="inline">
                                                        {profile.phone}
                                                        {phone}
                                                    </Typography>
                                                )}
                                                {email && (
                                                    <Typography display="inline">
                                                        {profile.email}
                                                        {email}
                                                    </Typography>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                            )
                    })}
                </List>
                : <Typography variant="body1">Explore more with Infra!</Typography>
        )
    }

    return (
        <div>
            <Dialog open={open} scroll={"paper"}>
                <DialogContent>
                    {renderDialog()}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={toggleDialog}>Close</Button>
                </DialogActions>
            </Dialog>
            <IconButton onClick={toggleDialog} style={{position: "fixed", right: "50px", bottom: "50px", zIndex: 999}}>
                <PeopleIcon />
            </IconButton>
        </div>
    )
}