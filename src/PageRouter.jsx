import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import ComingSoonPage from "./pages/ComingSoonPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UpdateProfile from "./pages/UpdateProfile";
import LandingPage from "./pages/LandingPage";

export default function PageRouter() {
    return (
        <Router>
            <AuthProvider>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/coming-soon" component={ComingSoonPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route exact path="/" component={LandingPage} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/update-profile" component={UpdateProfile} />
                </Switch>
            </AuthProvider>
        </Router>
    );
}

