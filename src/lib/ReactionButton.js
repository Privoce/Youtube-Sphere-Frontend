/* global chrome */
import React, {useState, useEffect, useMemo} from "react";
import {IconButton, Popover, ButtonGroup, Button, Icon, Snackbar, useMediaQuery} from "@material-ui/core";
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CloseIcon from "@material-ui/icons/Close";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import {makeStyles, createTheme, ThemeProvider} from "@material-ui/core/styles";
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
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () => createTheme({
            palette: {
                type: prefersDarkMode ? 'dark' : 'light',
            }
        }),
        [prefersDarkMode],
    );

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
    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    }

    const handleLike = (reactionType) => (event) => {
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
                    const currentUrl = new URL(window.location.href);
                    reactionToVideo(currUser.id, currentUrl.searchParams.get("v"), reactionType,0,0).then((response)=>{
                        console.log(response)
                        if (response.status == 200) {
                            setSnackBarOpen(true);
                        }
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
            <ThemeProvider theme={theme}>
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
                        <IconButton id="like" children={<ThumbUpIcon />} onClick={handleLike("like")}/>
                        <IconButton id="dislike" children={<ThumbDownIcon />} onClick={handleLike("dislike")}/>
                        <IconButton id="happy" children={<SentimentVerySatisfiedIcon />} onClick={handleLike("happy")}/>
                        <IconButton id="sad" children={<SentimentVeryDissatisfiedIcon />} onClick={handleLike("sad")}/>
                    </ButtonGroup>
                </Popover>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}
                    message="Reaction Succeeded"
                    action={
                        <>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    }
                />
            </ThemeProvider>

        </div>

    )
}