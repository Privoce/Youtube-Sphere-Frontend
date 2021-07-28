import {Divider, IconButton, InputBase, makeStyles} from "@material-ui/core";
import React, {useState} from "react";
import {searchAccount} from "../api/request";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        fontSize: 'medium'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}))

export default function AccountSearchBar({resultPullUp}) {
    const classes = useStyles()
    const [msg, setMsg] = useState(null);
    let inputField = null

    const searchHandler = () => {
        searchAccount(msg).then((response) => {
            if (response.status == 200) {
                resultPullUp(response.data)
            }
        }).catch((err) => {
            console.log(err)
        })
        inputField.value = "";
    }
    const changeHandler = (event) => {
        setMsg(event.target.value)
    }

    return (
        <div className={classes.root}>
            <IconButton className={classes.iconButton}>
                <MenuIcon size="large"/>
            </IconButton>
            <InputBase
                className={classes.input}
                placeholder="Search e-mail, phone or name to find friends!"
                inputProps={{ 'aria-label': 'search matching users'}}
                onChange={changeHandler}
                inputRef={(re) => inputField = re}
                style={{fontSize: 20}}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton onClick={searchHandler} className={classes.iconButton} aria-label="search">
                <SearchIcon size={"large"}/>
            </IconButton>
        </div>
    );
}