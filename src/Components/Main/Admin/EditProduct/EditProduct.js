import React, { useState, useEffect } from 'react';
import './EditProduct.css';
const axios = require('axios');

const EditProduct = () => {
    //States
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedProductTitle, setSelectedProductTitle] = useState("");
    const [selectedProductTags, setSelectedProductTags] = useState([]);
    const [tag, setTag] = useState("");
    const [errors, setErrors] = useState([]);
    const [displayEditor, setDisplayEditor] = useState(false);


    //State-functions
    const onChangeSelect = (e) => {
        if (e.currentTarget.value === "selectOption") {
            setSelectedProduct({});
        }
        else {
            axios.get('http://localhost:5000/getproduct/' + e.currentTarget.value)
                .then(function (response) {
                    setSelectedProduct(response.data[0]);
                    setSelectedProductTitle(response.data[0].title);
                    setSelectedProductTags(response.data[0].tags)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    const onChangeTitle = (e) => {
        let editSelectedProduct = { ...selectedProduct, title: e.target.value };
        setSelectedProduct(editSelectedProduct)
    }
    const onChangeDescription = (e) => {
        let editSelectedProduct = { ...selectedProduct, description: e.target.value };
        setSelectedProduct(editSelectedProduct)
    }
    const onChangeAmount = (e) => {
        let editSelectedProduct = { ...selectedProduct, amount: e.target.value };
        setSelectedProduct(editSelectedProduct)
    }
    const onChangeTag = (e) => {
        setTag(e.target.value);
    }
    const onChangePrice = (e) => {
        let editSelectedProduct = { ...selectedProduct, price: e.target.value };
        setSelectedProduct(editSelectedProduct);
    }
    const onClickTags = (e) => {
        e.preventDefault();
        let tagsArray = selectedProductTags;
        tagsArray.push(tag);
        setSelectedProductTags([...tagsArray]);
        let editSelectedProduct = { ...selectedProduct, tags: tagsArray }
        setSelectedProduct(editSelectedProduct)
        setTag("");
    }
    const onClickRemoveTag = (e) => {
        let tagsArray = selectedProductTags;
        tagsArray.splice(e.target.id, 1);
        let editSelectedProduct = { ...selectedProduct, tags: tagsArray }
        setSelectedProduct(editSelectedProduct)
    }
    const onClickDisplay = () => {
        setDisplayEditor(!displayEditor)
    }
    //Submit-function
    const onSubmit = (e) => {
        e.preventDefault();

        const errorsArray = errors;
        errorsArray.length = 0;
        setErrors([...errorsArray]);

        if (!selectedProduct.title) {
            let newErrors = errors;
            newErrors.push("A product needs a Title to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (!selectedProduct.description) {
            let newErrors = errors;
            newErrors.push("A product needs a Description to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (!selectedProduct.amount) {
            let newErrors = errors;
            newErrors.push("A product needs an Amount of at least 1 to be eligible for subsmission.")
            setErrors([...newErrors]);
        }
        if (selectedProduct.tags.length === 0) {
            let newErrors = errors;
            newErrors.push("A product needs at least one Tag to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (errors.length !== 0) {
            return;
        }

        const product = {
            type: "product",
            title: selectedProduct.title,
            description: selectedProduct.description,
            amount: selectedProduct.amount,
            tags: selectedProduct.tags,
            reviews: selectedProduct.reviews,
            price: selectedProduct.price,
        }
        axios.post('http://localhost:5000/product/' + selectedProduct._id, {
            product: product
        })
            .then(function (response) {
                setSelectedProduct({});
                setSelectedProductTags([]);
                setSelectedProductTitle("");
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //Render-functions
    let optionsList = products.map(option => {
        return (
            <option id={option._id} value={option._id} key={option._id}>{option.title}</option>
        )
    });
    let tagsList = selectedProductTags.map((tag, index) => {
        return (
            <div id={index} className="tag" onClick={onClickRemoveTag}>{tag}</div>
        )
    });
    let errorMessages = errors.map(error => {
        return (
            <p className="errorMessage_error">{error}</p>
        )
    });

    useEffect(() => {
        axios.get('http://localhost:5000/getproductlist')
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <>
        <button onClick={onClickDisplay}>{displayEditor ? "Click here to stop displaying product editor" : "Click here to display product editor"}</button>
        <div id="EditProduct" style={ displayEditor ? {display: "inline-block"} : {display: "none"}}>
            <label htmlFor="products">Choose the item you'd like to edit from the list below.</label>
            <select id="EditProduct_Productlist" name="arts" onChange={onChangeSelect}>
                <option id="selectOption" value="selectOption" key="selectOption">Products</option>
                {optionsList}
            </select>
            <div style={errors.length > 0 ? { display: "inline-block" } : { display: "none" }}>
                The following errors occurred when attempting to add the product:
                {errorMessages}
            </div>
            {
                selectedProduct.type === "product" ?
                    <div id="EditProduct_SelectedProduct">
                        <h2>{selectedProductTitle}</h2>
                        <form onSubmit={onSubmit}>
                            <label htmlFor="SelectedProduct_Title">Title</label>
                            <input type="text" id="SelectedProduct_Title" value={selectedProduct.title} onChange={onChangeTitle} />
                            <label htmlFor="SelectedProduct_Description">Description</label>
                            <textarea id="SelectedProduct_Description" value={selectedProduct.description} onChange={onChangeDescription} />
                            <label htmlFor="SelectedProduct_Amount">Amount</label>
                            <input type="number" id="SelectedProduct_Amount" value={selectedProduct.amount} onChange={onChangeAmount} />
                            <label htmlFor="SelectedProduct_Amount">Price</label>
                            <input type="number" id="SelectedProduct_Price" value={selectedProduct.price} onChange={onChangePrice} />
                            <div id="SelectedProduct_Tags">
                                <label htmlFor="tags">
                                    Tags: <input id="tags" type="text" placeholder="E.g. 'Acryllic' or 'Wolf'" onChange={onChangeTag} value={tag} /><button id="Tags-Button" onClick={onClickTags}>Add tag</button>
                                </label>
                                {tagsList}
                            </div>
                            <button>Submit Edited Product</button>
                        </form>
                    </div>
                    :
                    <></>
            }

        </div>
        </>
    );
}

export default EditProduct;
