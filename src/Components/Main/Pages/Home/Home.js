import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import './Home.css';
const axios = require('axios');

const Home = (props) => {
    //States
    const [products, setProducts] = useState([]);

    //State functions
    const AddToCart = (product) => {
        let newCart = props.cart;
        let findProduct = newCart.findIndex(cartProduct => cartProduct._id === product._id);
         if (findProduct === -1){
            newCart.push(product);
            props.updateCart([...newCart]);
        } 
        else {
            let amount = newCart[findProduct].amount;
            amount++;
            newCart[findProduct].amount = amount;
            props.updateCart([...newCart]);
        } 
    }

    //Render functions
    let productsMap = products.map(product => {
        return (
            <div className="productcard" key={product.title}>
                <div className="productcard_image"><img src={product.image ? product.image : ""} alt={product.title} /></div>
                <Link to={`/selectedproduct/#${product._id}`} key={product._id}><div className="productcard_title">{product.title}</div></Link>
                <div className="productcard_price">{product.price} kr</div>
                <button onClick={() => { AddToCart(product) }}>Add to Cart</button>
            </div>
        )
    });

    //useEffects
    useEffect(() => {
        let searchUrl = window.location.search.split("");
        searchUrl.shift();
        let search = "";
        for (let letter of searchUrl) {
            search += letter;
        }

        if (search.length >= 3) {
            axios.get('http://localhost:5000/getproducts?search=' + search)
                .then(function (response) {
                    setProducts(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            axios.get('http://localhost:5000/getproducts')
                .then(function (response) {
                    setProducts(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [props.reloadHome]);

    return (
        <div id="Home">
            {productsMap}
        </div>
    );
}

export default Home;
