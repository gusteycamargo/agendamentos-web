import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { isAuthenticated, isAdm } from "./services/auth";
import Login from './pages/Login';
import NewSchedule from './pages/New Schedule';

const AdmRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAdm() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <PrivateRoute path="/schedule/new" component={NewSchedule} />
      <PrivateRoute path="/schedule/view" component={() => <h1>App</h1>} />
      <PrivateRoute path="/schedule/edit" component={() => <h1>App</h1>} />
      <PrivateRoute path="/schedule/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/campus/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/campus/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/campus/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/campus/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/new" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/view" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/delete" component={() => <h1>App</h1>} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;