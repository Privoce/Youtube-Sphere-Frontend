/* global chrome */
import React, {useState} from 'react';
import {
    IconButton,
    List,
    ListItem,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Button
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AccountSearchBar from "./AccountSearchBar";
import {createRelation} from "../api/request";


export default function SearchButton() {
    const [result, setResult] = useState(null);
    const [open, setOpen] = useState(false);
    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }

    const resultPullUp = (resultResponse) => {
        setResult(resultResponse);
    }

    const toggleDialog = () => {
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

    const renderDialog = () => {
        return (
            <List style={{width: '100%'}}>
                {(result||[]).map((friend) => {
                    const {username, phone, email, photo, id} = friend;
                    return (
                        <ListItem alignItems="flex-start" onClick={connectUser.bind(this,id)} button>
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
        )
    }

    return (
        <div>
            <IconButton onClick={toggleDialog} style={{position: "fixed", right: "100px", bottom: "50px", zIndex: 996}}>
                <SearchIcon />
            </IconButton>
            <Dialog
                open={open}
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

                    {renderDialog()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}