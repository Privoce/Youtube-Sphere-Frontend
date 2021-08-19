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

function SearchFriendInput({pullUpSearchResult}) {
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
        inputField.value = "";
    }
    return (
        <FormControl fullWidth>
            <Input
                id="search-friends"
                value={value}
                placeholder="Search e-mail/phone/name"
                onChange={handleChange}
                inputRef={(ref) => inputField = ref}
                endAdorment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleSearch}
                        >
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}

function SearchModule() {
    const [result, setResult] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
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
                anchorEl={anchorEl}
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

    const profile = {
        avatar: "Avatar: ",
        name: "Username: ",
        mobile: "Mobile: ",
        email: "E-Mail: ",
        logout: "Log Out"
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
        }
    }, [props.user])

    return (
        <div>
            <SearchModule />
            {renderFriends()}
        </div>
    )
}