import React, { useState, useEffect } from 'react';
import './SelectedProduct.css';
const axios = require('axios');

const SelectedProduct = (props) => {
    //States
    const [product, setProduct] = useState({});
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    //State-functions
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    const onChangeRating = (e) => {
        setRating(e.target.value);
    }
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

    //Submit-function
    const onSubmit = (e) => {
        e.preventDefault();
        let tempProduct = product;
        tempProduct.reviews.push({ comment: comment, rating: rating })

        axios.post('http://localhost:5000/product/' + tempProduct._id, {
            product: tempProduct
        })
            .then(function (response) {
                setProduct({ ...tempProduct });
            })
            .catch(function (error) {
                console.log(error);
            });

        //Connect review and rating to product after having added products to the backend with those keys
        //Then post entire object to edit-route.
        //Then update product with the new edited product with /getproduct:id
    }

    //Render functions
    let reviews;
    if (product.reviews) {
        reviews = product.reviews.map(review => {
            return (
                <div className="review_container">
                    <div className="review_rating">Rating: {review.rating}</div>
                    <div className="review_comment">{review.comment}</div>
                </div>
            )
        });
    }

    //useEffects
    useEffect(() => {
        let hashId = window.location.hash.split("");
        hashId.shift();
        let productId = "";
        for (let symbol of hashId) {
            productId += symbol;
        }
        axios.get('http://localhost:5000/getproduct/' + productId)
            .then(function (response) {
                setProduct({ ...response.data[0] })
                console.log(response.data[0])
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    return (
        <div id="SelectedProduct">
            <div id="SelectedProduct_Top">
                <div id="SelectedProduct_Image">
                    <img src={product.title ? require(`../../../../images/${product.title.toLowerCase()}.png`) : ""} alt={product.title} />
                </div>
                <div id="SelectedProduct_Description">
                    {product.description}
                </div>
            </div>
            <h1>{product.title}</h1>
            <button onClick={() => { AddToCart(product) }}>Add to Cart</button>
            <div id="SelectedProduct_Review">
                <h3>Would you like to add a review to this product?</h3>
                <form onSubmit={onSubmit}>
                    <label htmlFor="Review_Rating">Leave a rating</label>
                    <div>
                        {rating}
                        <input id="Review_Rating" type="range" min={1} max={5} value={rating} onChange={onChangeRating} />
                    </div>
                    <label htmlFor="Review_Comment">Leave a comment</label>
                    <textarea id="Review_Comment" value={comment} onChange={onChangeComment} />
                    <button>Send review</button>
                </form>
                <hr/>
            </div>
            <div id="SelectedProduct_Reviews">
                {reviews}
            </div>
        </div>
    );
}

export default SelectedProduct;
