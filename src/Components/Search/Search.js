import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import './Search.css';

const Search = (props) => {
    let products = props.products.map(product => {
        return (
            <>
                <Link to={`/selectedproduct/#${product._id}`} key={product._id} onClick={() => { props.updateReloadHome(!props.reloadHome) }}><div>{product.title}</div></Link>
                <hr />
            </>
        )
    });

    return (
        <div id="Search">
            <div id="Search_Container">
                <input type="text" placeholder="Search" onChange={props.updateSearch} value={props.search} />
                {props.search.length < 3 ? <></> :
                    <div id="Search_Dropdown_container">
                        <Link to={props.search.length >= 3 ? `/search?${props.search}` : `/`} onClick={() => { props.updateReloadHome(!props.reloadHome) }}><div id="Search_Dropdown_ShowAll">{`Show all products containing: "${props.search}"...`}</div></Link>
                        <hr />
                        {products}
                    </div>
                }
            </div>
        </div>
    );
}

export default Search;
