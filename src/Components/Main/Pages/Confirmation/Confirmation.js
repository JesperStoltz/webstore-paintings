import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './Confirmation.css';

const Confirmation = () => {
    const [countdown, setCountdown] = useState(5);
    const [returnToHome, setReturnToHome] = useState(false);

    useEffect(() => {
        let count = countdown;
        let interval;
        const counter = () => {
            if (count !== 0) {
                count--;
                setCountdown(count);
            }
            else {
                clearInterval(interval)
                setReturnToHome(true);
            }
        }
        interval = setInterval(counter, 1000);
    }, [])

    if (returnToHome) {
        return <Redirect to='/' />
    }
    
    return (
        <div id="Confirmation">
            <h1>Thank you for your order!</h1>
            <p>You will soon be redirected back to our webshop...</p>
            <p>{countdown}s</p>
        </div>
    );
}

export default Confirmation;
