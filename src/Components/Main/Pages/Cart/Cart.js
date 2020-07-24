import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './Cart.css';
const axios = require('axios');

const Cart = (props) => {
    //States
    const [total, setTotal] = useState(0);
    const [displayCheckout, setDisplayCheckout] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [orderFinished, setOrderFinished] = useState(false);

    //State Functions
    const onClickDisplay = () => {
        setDisplayCheckout(!displayCheckout)
    }
    const onChangeName = (e) => {
        setName(e.target.value);
    }
    const onChangePhone = (e) => {
        setPhone(e.target.value);
    }
    const onChangeMail = (e) => {
        setMail(e.target.value);
    }
    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    }
    const onChangeZip = (e) => {
        setZip(e.target.value);
    }
    const onChangeCity = (e) => {
        setCity(e.target.value);
    }
    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    }
    const updateAmount = (e) => {
        console.log(e.target.id)
        let newCart = props.cart;
        let findProduct = newCart.findIndex(cartProduct => cartProduct._id === e.target.id);
        if (findProduct !== -1) {
            newCart[findProduct].amount = e.target.value;
            props.updateCart([...newCart]);
        }
    }
    const onClickDeleteItem = (e) => {
        console.log(e.target.id)
        let newCart = props.cart;
        let index = newCart.findIndex(cartProduct => cartProduct._id === e.target.id);
        newCart.splice(index, 1);
        props.updateCart([...newCart]);
    }

    //Submit function
    const onSubmit = (e) => {
        e.preventDefault();
        const order = {
            type: "order",
            date: new Date().toString(),
            cart: props.cart,
            customer: {
                name: name,
                phone: phone,
                mail: mail,
                address: address,
                zipCode: zip,
                city: city,
                country: country
            },
            payment: {
                method: "invoice",
                sum: total,
                paid: false
            },
            handled: false
        }

        axios.post('http://localhost:5000/addorder', {
            order: order
        })
            .then(function (response) {
                let emptyArray = []
                props.updateCart([...emptyArray]);
                setName("");
                setPhone("");
                setMail("");
                setAddress("");
                setZip("");
                setCity("");
                setCountry("");
                setOrderFinished(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //Render functions
    let products = props.cart.map(product => {
        return (
            <tr>
                <td><img src={product.title ? require(`../../../../images/${product.title.toLowerCase()}.png`) : ""} /></td>
                <td>{product.title}</td>
                <td><input type="number" min={1} value={product.amount} id={product._id} onChange={updateAmount}/></td>
                <td>{product.price} kr</td>
                <td>
                    <div className="deleteItem" id={product._id} onClick={onClickDeleteItem}>✘</div>
                </td>
            </tr>
        )
    })

    //useEffects
    useEffect(() => {
        if (props.cart.length > 0) {
            let totalSum = 0;
            for (let product of props.cart) {
                let sum = product.amount * product.price;
                totalSum += parseInt(sum);
            }
            setTotal(totalSum);
        }
    }, [props.cart])

    useEffect(() => {
        if (props.cart.length === 0) {
            setTotal(0);
        }
    }, [props.cart])

    if (orderFinished) {
        return <Redirect to='/confirmation' />
    }

    return (
        <div id="Cart">
            <h1>Your cart</h1>
            <table id="Cart_Table">
                <thead>
                    <tr>
                        <th></th><th>Title</th><th>Amount</th><th>Price</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td><td></td><td></td><td>Total: {total} SEK</td><td></td>
                    </tr>
                </tfoot>
            </table>

            <button onClick={onClickDisplay} style={displayCheckout ? { "display": "none" } : { "display": "block" }}>Place Order</button>

            <div id="CheckoutForm" style={displayCheckout ? { display: "block" } : { display: "none" }}>
                <form onSubmit={onSubmit}>
                    <label htmlFor="Checkout_Name">
                        Name: <br /> <input type="text" id="Checkout_Name" value={name} onChange={onChangeName} />
                    </label>
                    <label htmlFor="Checkout_Phone">
                        Phone number: <br /> <input type="tel" id="Checkout_Phone" value={phone} onChange={onChangePhone} />
                    </label>
                    <label htmlFor="Checkout_Mail">
                        E-mail: <br /> <input type="email" id="Checkout_Mail" value={mail} onChange={onChangeMail} />
                    </label>
                    <label htmlFor="Checkout_Address">
                        Address: <br /> <input type="text" id="Checkout_Address" value={address} onChange={onChangeAddress} />
                    </label>
                    <label htmlFor="Checkout_zipCode">
                        zipCode: <br /> <input type="number" id="Checkout_zipCode" value={zip} onChange={onChangeZip} />
                    </label>
                    <label htmlFor="Checkout_City">
                        City: <br /> <input type="text" id="Checkout_City" value={city} onChange={onChangeCity} />
                    </label>
                    <label htmlFor="Checkout_Country">
                        Country: <br /> <input type="text" id="Checkout_Country" value={country} onChange={onChangeCountry} />
                    </label>
                    <button>Order</button>
                </form>
            </div>
        </div>
    );
}

export default Cart;
