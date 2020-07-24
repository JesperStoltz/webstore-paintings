import React, { useState, useEffect } from 'react';
import './Orders.css';
const axios = require('axios');

const Orders = (props) => {
    //States
    const [orders, setOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState(false);

    //State-functions
    const onChangeHandled = (e) => {
        let editedOrders = orders;
        editedOrders[e.target.id].handled = !editedOrders[e.target.id].handled;
        setOrders([...editedOrders])
    }
    const onClickDisplay = () => {
        setDisplayOrders(!displayOrders)
    }

    //Save Order Changes Function
    const onClickSave = (e) => {
        const index = e.currentTarget.parentElement.parentElement.id
         const order = {
            type: orders[index].type,
            date: orders[index].date,
            cart: orders[index].cart,
            customer: orders[index].customer,
            payment: orders[index].payment,
            handled: orders[index].handled,
        } 

         axios.post('http://localhost:5000/editorder/' + e.target.id, {
            order: order
        })
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            }); 
    }

    console.log(props.lastLoggedIn)

    //Render-functions
    let orderList = orders.sort(function(firstOrder, secondOrder){ return firstOrder.date > secondOrder.date ? -1 : 1}).map((order, index) => {
        const dateSplit = order.date.toString().split(" ");
        const dateString = dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[3];
        return (
            <tr id={index} key={index}>
                {props.lastLoggedIn < order.date ? <td>NEW!</td> : <td></td>}
                <td>{dateString}</td>
                <td>{order._id}</td>
                <td>{order.customer.name}</td>
                <td>{order.payment.sum}</td>
                <td>{order.payment.paid ? "✔" : "✘"}</td>
                <td><input type="checkbox" checked={orders[index].handled} id={index} onChange={onChangeHandled} /></td>
                <td><button id={order._id} onClick={onClickSave}>Save</button></td>
            </tr>
        )
    })

    //useEffects
    useEffect(() => {
        axios.get('http://localhost:5000/getorders')
            .then(function (response) {
                setOrders(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div id="Orders">
            <button onClick={onClickDisplay}>{displayOrders ? "Click here to stop displaying all orders" : "Click here to display all orders"}</button>
            <table style={ displayOrders ? {display: "inline-block"} : {display: "none"}}>
                <thead>
                    <tr>
                        <th></th><th>Date</th><th>Order-ID</th><th>Customer</th><th>Sum</th><th>Paid</th><th>Handled</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList}
                </tbody>
            </table>
        </div>
    );
}

export default Orders;
