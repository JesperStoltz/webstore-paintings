import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { auth$ } from "../../../../Storage/Store";
import { updateAuth } from "../../../../Storage/Store";
import './LoginToAdmin.css';
const axios = require('axios');

const LoginToAdmin = (props) => {
    //States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [adminLogin, setAdminLogin] = useState(false);

    //State-functions
    const onChangeName = (e) => {
        setUsername(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    //Submit-function
    const onSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/loginuser', {
            name: username,
            password: password
        })
            .then(function (response) {
                if (response.status === 200) { 
                    props.updateLastLoggedIn(response.data.lastLoggedIn)
                    updateAuth(true);
                    setAdminLogin(true);
                };
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    if (auth$._value) {
        return <Redirect to='/adminhome'/>
    }

    return (
        <div id="LoginToAdmin">
            <form onSubmit={onSubmit}>
                <label htmlFor="LoginToAdmin_Username">Admin Username:</label>
                <input id="LoginToAdmin_Username" type="text" onChange={onChangeName} />
                <label htmlFor="LoginToAdmin_Password">Admin Password:</label>
                <input id="LoginToAdmin_Password" type="password" onChange={onChangePassword} />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default LoginToAdmin;
