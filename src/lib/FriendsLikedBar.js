/* global chrome */
import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Card, CardActionArea, CardActions, CardContent, CardMedia,Grid} from "@material-ui/core";
import {getFriendLiked} from "../api/request"
import {Typography} from "@material-ui/core";

let useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 320,
    },
    content:{
    }
}));

export default function FriendsLikedBar() {
    const classes = useStyles();
    const [liked, setLiked] = useState(null);

    useEffect(() => {
        console.log("useEffect start")
        chrome.storage.local.get(["infraUser"], (result) => {
            const currUser = result.infraUser;
            if (!currUser) {
                // eslint-disable-next-line no-restricted-globals
                if(confirm("You are not logged in. Log in first?")) {
                    chrome.runtime.sendMessage("externalLogin");
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
    }, [])

    const handleClick =(event)=>{
        window.open("https://www.youtube.com/watch?v=u6gIDiOeTHc","_blank")
    }

    return (
        liked ?
            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={4}>
                {
                    liked.map((item)=>(
                        <Grid item>
                            <Card className={classes.root}>
                                <CardActionArea onClick={handleClick}>
                                    <CardMedia
                                        component="img"
                                        alt="Contemplative Reptile"
                                        height="170"
                                        image={item.videoThumbnail}
                                        title={item.videoTitle}
                                    />
                                    <CardContent className={classes.content}>
                                        <Typography gutterBottom variant="h5" component="h2">
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
            <Typography variant="body1">no friends info</Typography>
    )
}