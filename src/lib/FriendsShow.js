/* global chrome */
import {
    InputAdornment,
    Input,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar, ListItemText, Typography, Icon, Popover
} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import SearchIcon from "@material-ui/icons/Search";
import {createRelation} from "../api/request";
import {searchAccount, getFriendsList} from "../api/request";
import {useHistory} from "react-router-dom";

function SearchFriendInput({pullUpSearchResult, onClick}) {
    const [value, setValue] = useState("");
    let inputField = null;

    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSearch = () => {
        searchAccount(value).then((response) => {
            if (response.status == 200) {
                pullUpSearchResult(response.data);
            }
        })
        setValue("");
        onClick();
    }
    return (
        <div style={{display: 'flex'}} id="friends-search-bar">
            <Input
                fullWidth={true}
                id="search-friends"
                value={value}
                placeholder="Search e-mail/phone/name"
                onChange={handleChange}
            />
            <IconButton onClick={handleSearch}>
                <SearchIcon />
            </IconButton>
        </div>
    )
}

function SearchModule() {
    const [result, setResult] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)

    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }

    const handleClick = (event) => {
        // setAnchorEl(event.currentTarget);
        setAnchorEl(document.getElementById("friends-search-bar"));
        setOpen(true);
    }
    const handleClose = () => {
        // setAnchorEl(null);
        setOpen(false);
    }
    const pullUpFriends = (friends) => {
        setResult(friends);
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
            <SearchFriendInput pullUpSearchResult={pullUpFriends} onClick={handleClick}/>
            <Popover
                open={open}
                anchorEl={document.getElementById("friends-search-bar")}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {
                    'We have found the following results:\n'
                }
                {renderDialog()}
            </Popover>
        </div>
    )
}

export default function FriendsShow(props) {
    const [friends, setFriends] = useState(null);
    // const history = useHistory();

    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }

    const logoutRequest = () => {
        // chrome.runtime.sendMessage({msg: "externalLogin"});
        chrome.storage.local.set({infraUser: ''});
    }

    const renderFriends = () => {
        return (
            friends ?
            <List>
                {friends.map((friend) => {
                    const {username,nickname, phone, email, photo} = friend;
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

    useEffect(() => {
        if (props.user) {
            getFriendsList(props.user.id).then((response) => {
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
        } else {
            console.log("direct to login");
            // console.log(props);
            // props.history.push("/login");
        }
        // if no user: push history /login
    }, [props.user])

    return (
        <div style={{marginLeft: '10px', marginRight: '10px'}}>
            <h3 style={{textAlign: 'center'}} onClick={logoutRequest}>Sphere - Private Youtube Social Network</h3>
            <SearchModule />
            {renderFriends()}
        </div>
    )
}