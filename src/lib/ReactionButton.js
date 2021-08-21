/* global chrome */
import React, {useState, useEffect} from "react";
import {IconButton, Popover, ButtonGroup, Button, Icon} from "@material-ui/core";
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import {makeStyles} from "@material-ui/core/styles";
import {getFriendLiked, reactionToVideo} from "../api/request";

const useStyle = makeStyles((theme) => ({
    popover: {
        pointerEvent: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    }
}));

export default function ReactionButton() {
    const classes = useStyle();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)

    const togglePopoverOn = (event) => {
        if (!anchorEl) {
            setAnchorEl(event.currentTarget);
        }
        setOpen(true);
    };
    const togglePopoverOff = () => {
        setOpen(false);
    }
    const continuePopover = () => {
        setOpen(true);
    }

    const handleLike = (event)=>{
        let url=window.location.href
        if (url.indexOf("watch")!==-1){
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
                    reactionToVideo(currUser.id,window.location.href,"like",0,0).then((response)=>{
                        console.log(response)
                    })
                }
            })
        }
    }


    return (
        <div
            style={{zIndex: 996}}
            id="sphere-search-button"
        >
            <IconButton
                onMouseEnter={togglePopoverOn}
                onMouseLeave={togglePopoverOff}
            >
                <WifiTetheringIcon />
            </IconButton>
            <Popover
                onMouseEnter={continuePopover}
                onMouseLeave={togglePopoverOff}
                id="hover-reaction-bar"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                onClose={togglePopoverOff}
            >
                <ButtonGroup>
                    <IconButton children={<ThumbUpIcon />} onClick={handleLike}/>
                    <IconButton children={<ThumbDownIcon />}/>
                    <IconButton children={<SentimentVerySatisfiedIcon />}/>
                    <IconButton children={<SentimentVeryDissatisfiedIcon />}/>
                </ButtonGroup>
            </Popover>
        </div>

    )
}