/* global chrome */
import React, {useEffect, useMemo, useState} from 'react';
import {createTheme, makeStyles} from '@material-ui/core/styles';
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, useMediaQuery} from "@material-ui/core";
import {getFriendLiked} from "../api/request"
import {Typography, ThemeProvider} from "@material-ui/core";
import {infraEvent} from "./helper";

let useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 260,
    },
    content:{
    }
}));

export default function FriendsLikedBar() {
    const classes = useStyles();
    const [liked, setLiked] = useState(null);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () => createTheme({
            palette: {
                type: prefersDarkMode ? 'dark' : 'light',
            }
        }),
        [prefersDarkMode],
    );

    useEffect(() => {
        console.log("useEffect start")
        chrome.storage.local.get(["infraUser"], (result) => {
            const currUser = result.infraUser;
            if (!currUser) {
                // eslint-disable-next-line no-restricted-globals
                if(confirm("You are not logged in. Log in first?")) {
                    chrome.runtime.sendMessage({msg: "externalLogin"});
                }
                return;
            }
            if (currUser) {
                //获取好友喜欢的列表
                getFriendLiked(currUser.id).then((response) => {
                    if (response.data) {
                        setLiked(response.data);
                        // return response.data.friendsLiked;
                    }
                    console.log(liked)
                }).catch((err) => {
                    console.log("axios err at getFriendsList", err);
                })
            }
        })
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // console.log(message);
            if (message.message == "login") {
                getFriendLiked(message.user.id).then((response) => {
                    if (response.data) {
                        setLiked(response.data);
                        // return response.data.friendsLiked;
                    }
                    console.log(liked)
                }).catch((err) => {
                    console.log("axios err at getFriendsList", err);
                })
                sendResponse("received");
            } else if (message.message == "logout") {
                sendResponse("received");
            }
            return true;
        })
    }, [])

    const handleClick =(url)=>{
        window.open(url,"_self")
    }

    return (
        <>
            <div style={{height: '64px'}}></div>
            <ThemeProvider theme={theme}>
            {liked ?
            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                {
                    liked.map((item)=>(
                        <Grid item>
                            <Card className={classes.root}>
                                <CardActionArea onClick={handleClick.bind(this,item.videoUrl)}>
                                    <CardMedia
                                        component="img"
                                        alt="Contemplative Reptile"
                                        height="170"
                                        image={item.videoThumbnail}
                                        title={item.videoTitle}
                                    />
                                    <CardContent className={classes.content}>
                                        <Typography gutterBottom variant="h5" component="h2" noWrap>
                                            {item.videoTitle}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            liked by: {<Typography variant="subtitle2">{item.nickname.toString()}</Typography>}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid> :
            <Typography variant="body1">no friends info</Typography>}
            </ThemeProvider>
        </>

    )
}