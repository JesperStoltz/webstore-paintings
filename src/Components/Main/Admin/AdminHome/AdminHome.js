import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { auth$ } from "../../../../Storage/Store";
import { updateAuth } from "../../../../Storage/Store";
import './AdminHome.css';
import AddProduct from "../AddProduct/AddProduct";
import EditProduct from "../EditProduct/EditProduct";
import Orders from "../Orders/Orders";

const AdminHome = (props) => {
    const [adminLogin, setAdminLogin] = useState(false);
    const onSubmitLogout = () => {
        updateAuth(false); 
        setAdminLogin(false); 
    }

    if (!auth$._value) {
        return <Redirect to='/logintoadmin' />
    }

    return (
        <div id="AdminHome">
            Welcome to your admin control panel!
            Choose your action below.

            <div id="AdminHome_add_container">
                <AddProduct />
            </div>
            <div id="AdminHome_edit_container">
                <EditProduct />
            </div>
            <div id="AdminHome_orders_container">
                <Orders lastLoggedIn={props.lastLoggedIn}/>
            </div>
            <div id="AdminHome_logout_container">
                <form onSubmit={onSubmitLogout}>
                    <button>Logout from Admin</button>
                </form>
            </div>
        </div>
    );
}

export default AdminHome;
