/* global chrome */
import React, {useEffect, useState} from "react";
import {People,Search} from "@material-ui/icons";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemText, Tooltip, Typography
} from "@material-ui/core";
import AccountSearchBar from "./AccountSearchBar";
import {createRelation,getFriendsList} from "../api/request"
import {infraEvent} from "./helper";

export default function ButtonBar(){
    const [searchResult, setSearchResult] = useState(null);
    const [searchOpen, serSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null);
    const [open, setOpen] = useState(false)
    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }

    const resultPullUp = (resultResponse) => {
        setSearchResult(resultResponse);
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
        chrome.storage.local.get(["infraUser"], (result) => {
            if (result.infraUser) {
                setUser(result.infraUser)
            } else {
                setUser(null)
            }
        })
        console.log("mounted"+user);
        return (() => {
            infraEvent.removeListener(statusChangeHandler)
        })
    }, [])


    const searchToggleDialog = () => {
        chrome.storage.local.get(["infraUser"], (result) => {
            console.log(result);
            const currUser = result.infraUser;
            if (!currUser && !searchOpen) {
                // eslint-disable-next-line no-restricted-globals
                if(confirm("You are not logged in. Log in first?")) {
                    chrome.runtime.sendMessage("externalLogin");
                }
                return;
            }
            serSearchOpen(!searchOpen);
        })
    }

    const friendsToggleDialog = async () => {
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
                getFriendsList(currUser.id).then((response) => {
                    if (response.status == 200) {
                        return response.data;
                    }
                }).then((response) => {
                    if (response) {
                        setFriends(response);
                        console.log("friends fetched.")
                    }
                }).catch((err) => {
                    console.log("axios err at getFriendsList", err);
                })
            }
            setOpen(!open);
        })

    }

    const connectUser = (uuid) => {
        console.log(uuid)
        chrome.storage.local.get(["infraUser"], (result) => {
            const currUser = result.infraUser;
            createRelation(currUser.id, uuid).then((response) => {
                console.log(response)
                if (response.status == 200) {
                    return response.data
                }
            }).then((response) => {
                if (response.status == 1) {
                    alert("Adding Friend Successfully!");
                } else {
                    alert(response.errMsg);
                }
            }).catch((err) => {
                console.log("add friend fatal error, ", err);
            })
        })

    }

    const searchRenderDialog = () => {
        return (
            <List style={{width: '100%'}}>
                {(searchResult||[]).map((friend) => {
                    const {username,nickname, phone, email, photo, id} = friend;
                    return (
                        <ListItem alignItems="flex-start" onClick={connectUser.bind(this,id)} button>
                            <ListItemAvatar>
                                <Avatar alt={nickname || username} src={photo}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={nickname || username}
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
        )
    }

    const friendsRenderDialog = () => {
        return (
            friends ?
                <List>
                    {friends.map((friend) => {
                        const {nickname, username,phone, email, photo} = friend;
                        return (
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={nickname || username} src={photo}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={nickname || username}
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
            <Tooltip title="search for friends">
                <IconButton>
                    <Search onClick={searchToggleDialog} fontSize="large"/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={searchOpen}
                scroll='paper'
                maxWidth='md'
                fullWidth={true}
                style={{height: '75vh', top: '13%'}}
            >
                <DialogTitle>
                    <AccountSearchBar resultPullUp={resultPullUp}/>
                </DialogTitle>
                <DialogContent dividers={true}>

                    {
                        'We have found the following results:\n'
                    }

                    {searchRenderDialog()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={searchToggleDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Tooltip title="friends list">
                <IconButton onClick={friendsToggleDialog}>
                    <People fontSize="large" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} scroll={"paper"}>
                <DialogContent>
                    {friendsRenderDialog()}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={friendsToggleDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}