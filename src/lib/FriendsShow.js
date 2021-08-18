import {
    InputAdornment,
    Input,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar, ListItemText, Typography, Icon
} from "@material-ui/core";
import React, {useState} from "react";
import SearchIcon from "@material-ui/icons/Search";

function SearchFriendInput({pullUpSearchResult}) {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSearch = () => {

    }
    return (
        <FormControl fullWidth>
            <Input
                id="search-friends"
                value={value}
                placeholder="Search e-mail/phone/name"
                onChange={handleChange}
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

export default function FriendsShow() {
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

    return (
        <div>
            <SearchFriendInput />
            {renderFriends()}
        </div>
    )
}