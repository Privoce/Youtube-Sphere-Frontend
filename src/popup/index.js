import React from 'react';
import LoginTip from "../lib/LoginTip";
import FriendsShow from "../lib/FriendsShow";
import {Router, Route, Link, Switch, Redirect} from 'react-router-dom';

export default function Popup() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/login">

                    </Route>
                    <Route path="/friend">

                    </Route>
                </Switch>
            </div>
        </Router>
    )
}