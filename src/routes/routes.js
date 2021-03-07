import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from '../pages/Login';
import NewSchedule from '../pages/Schedule/NewSchedule';
// import NewCategory from "../pages/Category/New Category";
// import NewCampus from "../pages/Campus/New Campus";
// import NewCourse from "../pages/Course/New Course";
// import NewEquipament from "../pages/Equipament/New Equipament";
// import NewPlace from "../pages/Place/New Place";
// import NewUser from "../pages/User/New User";
// import ViewCampus from "../pages/Campus/View Campus";
// import ViewCategory from "../pages/Category/View Category";
// import ViewCourse from "../pages/Course/View Course";
// import ViewEqupament from "../pages/Equipament/View Equpament";
// import ViewPlace from "../pages/Place/View Place";
// import ViewUser from "../pages/User/View User";
import ViewSchedule from "../pages/Schedule/ViewSchedule";
// import EditCampus from "../pages/Campus/Edit Campus";
// import EditCategory from "../pages/Category/Edit Category";
// import EditCourse from "../pages/Course/Edit Course";
// import EditEquipament from "../pages/Equipament/Edit Equipament";
// import EditPlace from "../pages/Place/Edit Place";
// import EditUser from "../pages/User/Edit User";
import EditSchedule from "../pages/Schedule/EditSchedule";
// import DeleteCampus from "../pages/Campus/Delete Campus";
// import DeleteCategory from "../pages/Category/Delete Category";
// import DeleteCourse from "../pages/Course/Delete Course";
// import DeleteEquipament from "../pages/Equipament/Delete Equipament";
// import DeletePlace from "../pages/Place/Delete Place";
// import DeleteUser from "../pages/User/Delete User";
import DeleteSchedule from "../pages/Schedule/DeleteSchedule";
// import Reports from "../pages/Reports";
// import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
// import AdmRoute from "./AdmRoute";

const Routes = () => (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/schedule/new" component={NewSchedule} />
      <PrivateRoute path="/schedule/edit" component={EditSchedule} />
      <PrivateRoute path="/schedule/view" component={ViewSchedule} />
      <PrivateRoute path="/schedule/edit" component={EditSchedule} />
      <PrivateRoute path="/schedule/delete" component={DeleteSchedule} />
      {/* <AdmRoute path="/category/new" component={NewCategory} />
      <AdmRoute path="/category/view" component={ViewCategory} />
      <AdmRoute path="/category/edit" component={EditCategory} />
      <AdmRoute path="/category/delete" component={DeleteCategory} />
      <AdmRoute path="/campus/new" component={NewCampus} />
      <AdmRoute path="/campus/view" component={ViewCampus} />
      <AdmRoute path="/campus/edit" component={EditCampus} />
      <AdmRoute path="/campus/delete" component={DeleteCampus} />
      <AdmRoute path="/course/new" component={NewCourse} />
      <AdmRoute path="/course/view" component={ViewCourse} />
      <AdmRoute path="/course/edit" component={EditCourse} />
      <AdmRoute path="/course/delete" component={DeleteCourse} />
      <AdmRoute path="/equipament/new" component={NewEquipament} />
      <AdmRoute path="/equipament/view" component={ViewEqupament} />
      <AdmRoute path="/equipament/edit" component={EditEquipament} />
      <AdmRoute path="/equipament/delete" component={DeleteEquipament} />
      <AdmRoute path="/place/new" component={NewPlace} />
      <AdmRoute path="/place/view" component={ViewPlace} />
      <AdmRoute path="/place/edit" component={EditPlace} />
      <AdmRoute path="/place/delete" component={DeletePlace} />
      <AdmRoute path="/user/new" component={NewUser} />
      <AdmRoute path="/user/view" component={ViewUser} />
      <AdmRoute path="/user/edit" component={EditUser} />
      <AdmRoute path="/user/delete" component={DeleteUser} />
      <AdmRoute path="/reports" component={Reports} />
      <Route path="*" component={NotFound} /> */}
    </Switch>
);

export default Routes;