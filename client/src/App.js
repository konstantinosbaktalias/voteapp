import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Survey from './components/Survey';
import EditSurvey from './components/EditSurvey';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
        <Navbar/>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/survey/:id">
            <Survey />
          </Route>
          <Route path="/edit/:id">
            <EditSurvey />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;