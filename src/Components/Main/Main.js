import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import SelectedProduct from "./Pages/SelectedProduct/SelectedProduct";
import Cart from "./Pages/Cart/Cart";
import Confirmation from "./Pages/Confirmation/Confirmation";
import LoginToAdmin from "./Pages/LoginToAdmin/LoginToAdmin";
import AdminHome from "./Admin/AdminHome/AdminHome";
import './Main.css';

const Main = (props) => {
    return (
        <main>
            <Switch>
                <Route path="/selectedproduct">
                    <SelectedProduct cart={props.cart} updateCart={props.updateCart} />
                </Route>
                <Route path="/cart">
                    <Cart cart={props.cart} updateCart={props.updateCart} />
                </Route>
                <Route path="/confirmation">
                    <Confirmation />
                </Route>
                <Route path="/logintoadmin">
                    <LoginToAdmin updateLastLoggedIn={props.updateLastLoggedIn}/>
                </Route>
                <Route path="/adminhome">
                    <AdminHome lastLoggedIn={props.lastLoggedIn}/>
                </Route>
                <Route path="/">
                    <Home products={props.products} reloadHome={props.reloadHome} updateReloadHome={props.updateReloadHome} cart={props.cart} updateCart={props.updateCart}/>
                </Route>
            </Switch>
        </main>
    );
}

export default Main;
