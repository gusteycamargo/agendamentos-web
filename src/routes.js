import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { isAuthenticated, isAdm } from "./services/auth";
import Login from './pages/Login';
import NewSchedule from './pages/Schedule/New Schedule';
import NewCategory from "./pages/Category/New Category";
import NewCampus from "./pages/Campus/New Campus";
import NewCourse from "./pages/Course/New Course";
import NewEquipament from "./pages/Equipament/New Equipament";
import NewPlace from "./pages/Place/New Place";
import NewUser from "./pages/User/New User";
import ViewCampus from "./pages/Campus/View Campus";
import ViewCategory from "./pages/Category/View Category";
import ViewCourse from "./pages/Course/View Course";
import ViewEqupament from "./pages/Equipament/View Equpament";
import ViewPlace from "./pages/Place/View Place";
import ViewUser from "./pages/User/View User";
import ViewSchedule from "./pages/Schedule/View Schedule";
import EditCampus from "./pages/Campus/Edit Campus";

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
      <PrivateRoute path="/schedule/view" component={ViewSchedule} />
      <PrivateRoute path="/schedule/edit" component={() => <h1>App</h1>} />
      <PrivateRoute path="/schedule/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/new" component={NewCategory} />
      <AdmRoute path="/category/view" component={ViewCategory} />
      <AdmRoute path="/category/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/category/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/campus/new" component={NewCampus} />
      <AdmRoute path="/campus/view" component={ViewCampus} />
      <AdmRoute path="/campus/edit" component={EditCampus} />
      <AdmRoute path="/campus/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/new" component={NewCourse} />
      <AdmRoute path="/course/view" component={ViewCourse} />
      <AdmRoute path="/course/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/course/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/new" component={NewEquipament} />
      <AdmRoute path="/equipament/view" component={ViewEqupament} />
      <AdmRoute path="/equipament/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/equipament/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/new" component={NewPlace} />
      <AdmRoute path="/place/view" component={ViewPlace} />
      <AdmRoute path="/place/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/place/delete" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/new" component={NewUser} />
      <AdmRoute path="/user/view" component={ViewUser} />
      <AdmRoute path="/user/edit" component={() => <h1>App</h1>} />
      <AdmRoute path="/user/delete" component={() => <h1>App</h1>} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;