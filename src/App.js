import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { cart$ } from './Storage/Store.js'
import { updateCart } from './Storage/Store.js'
import Header from "./Components/Header/Header";
import Search from "./Components/Search/Search";
import Main from "./Components/Main/Main";
import './App.css';
const axios = require('axios');

const App = () => {
  //States
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [reloadHome, setReloadHome] = useState(false);
  const [lastLoggedIn, setLastLoggedIn] = useState("");
  const [cart, updateNewCart] = useState([]);

  console.log(cart)

  //State-functions
  const updateSearch = (e) => {
    setSearch(e.target.value);
  }
  const updateReloadHome = (boolean) => {
    setSearch("");
    setReloadHome(boolean);
  }
  const updateLastLoggedIn = (date) => {
    setLastLoggedIn(date)
  }

  //useEffects
  useEffect(() => {
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
      const emptyArray = []
      setProducts([...emptyArray])
    }
  }, [search]);

  useEffect(() => {
    cart$.subscribe((cart) => {
      updateNewCart(cart);
    })
  }, [cart]);

  return (
    <div id="App">
      <Router>
        <Header
          reloadHome={reloadHome}
          updateReloadHome={updateReloadHome}
          cart={cart}
        />
        <Search
          search={search}
          updateSearch={updateSearch}
          products={products}
          reloadHome={reloadHome}
          updateReloadHome={updateReloadHome} />
        <Main
          search={search}
          products={products}
          reloadHome={reloadHome}
          updateReloadHome={updateReloadHome}
          cart={cart}
          updateCart={updateCart}
          lastLoggedIn={lastLoggedIn}
          updateLastLoggedIn={updateLastLoggedIn}
        />
      </Router>
    </div>
  );
}

export default App;
