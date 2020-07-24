import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './Header.css';

const Header = (props) => {
    return (
        <header id="Header">
            <div id="Header_logo">
            <Link to="/" onClick={() => { props.updateReloadHome(!props.reloadHome) }}><div id="Header_logo">Illustrated Adventure</div></Link>
            </div>
            <div id="Header_toAdmin">
            <Link to="/logintoadmin"><div id="Header_Admin">Login To Admin</div></Link>
            </div>
            <div id="Header_toCart">
            <Link to="/cart"><div id="Header_cart">{props.cart.length}</div></Link>
            </div>
        </header>
    );
}

export default Header;
