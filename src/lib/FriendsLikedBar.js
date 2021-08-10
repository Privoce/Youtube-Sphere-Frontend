/* global chrome */
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {getFriendLiked} from "../api/request"
import {Typography} from "@material-ui/core";

let useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        // objectFit:"contain",
        zIndex: 300,
        padding: 0,
    },
    imageList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        width: "100%",
    },
    title: {
        // color: theme.palette.primary.light,
        // color:"black"
    },

    titleBar: {
        zIndex: 3000,
        width: "40%",
        height: 184
        // background:
        //     'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    imgFullHeight: {
        height: 320,
    },
    imgFullWidth: {
        width: 320,
    }
}));

export default function FriendsLikedBar() {
    const classes = useStyles();
    const [liked, setLiked] = useState(null);

    useEffect(() => {
        console.log("useEffect start")
        // chrome.storage.local.get(["infraUser"], (result) => {
        //     const currUser = result.infraUser;
        //     // if (!currUser) {
        //     //     // eslint-disable-next-line no-restricted-globals
        //     //     if(confirm("You are not logged in. Log in first?")) {
        //     //         chrome.runtime.sendMessage("externalLogin");
        //     //     }
        //     //     return;
        //     // }
        //     if (currUser) {
        //         //获取好友喜欢的列表
        //         getFriendLiked("id0").then((response) => {
        //             console.log(response.data);
        //             if (response.data) {
        //                 console.log(response.data)
        //                 setLiked(response.data);
        //                 // return response.data.friendsLiked;
        //             }
        //             console.log(liked)
        //         }).catch((err) => {
        //             console.log("axios err at getFriendsList", err);
        //         })
        //     }
        // })
        getFriendLiked("id0").then((response) => {
            if (response.data) {
                setLiked(response.data);
                // return response.data.friendsLiked;
            }
            console.log(liked)
        }).catch((err) => {
            console.log("axios err at getFriendsList", err);
        })
    }, [])

    return (
        liked ?
            <div className={classes.root}>
                <ImageList className={classes.imageList} cols={3} rowHeight={180}>
                    {liked.map((item) => (
                        <ImageListItem key={item.videoId} >
                            <a href={"https://www.youtube.com/watch?v=" + item.videoId} target="_blank">
                                <img src={item.videoThumbnail} alt={item.videoTitle} className={classes.img}/>
                            </a>
                            {/*<ImageListItemBar*/}
                            {/*    title={item.videoInfo.title}*/}
                            {/*    subtitle={<span>liked by: {item.nickname}</span>}*/}
                            {/*    classes={{*/}
                            {/*        root: classes.titleBar,*/}
                            {/*        title: classes.title,*/}
                            {/*    }}*/}
                            {/*    actionIcon={*/}
                            {/*        <IconButton aria-label={`star ${item.videoInfo.title}`}>*/}
                            {/*            <StarBorderIcon className={classes.title}/>*/}
                            {/*        </IconButton>*/}
                            {/*    }*/}
                            {/*/>*/}
                        </ImageListItem>
                    ))}
                </ImageList>
            </div> :
            <Typography variant="body1">no friends info</Typography>
    )
}