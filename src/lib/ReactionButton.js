import React, {useState, useEffect} from "react";
import {IconButton, Popover, ButtonGroup, Button, Icon} from "@material-ui/core";
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import {makeStyles} from "@material-ui/core/styles";

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


    return (
        <div
            style={{position: "fixed", right: "150px", bottom: "50px", zIndex: 996}}
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
                    <IconButton children={<ThumbUpIcon />}/>
                    <IconButton children={<ThumbDownIcon />}/>
                    <IconButton children={<SentimentVerySatisfiedIcon />}/>
                    <IconButton children={<SentimentVeryDissatisfiedIcon />}/>
                </ButtonGroup>
            </Popover>
        </div>

    )
}