import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import ComingSoonPage from "./pages/ComingSoonPage";
import HomePage from "./pages/HomePage";

export default function PageRouter() {
    return (
        <Router>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
                <Route path="/coming-soon" component={ComingSoonPage} />
                <Route path="/" component={HomePage}>
                    <Redirect to="/coming-soon" />
                </Route>
            </Switch>

        </Router>
    );
}

