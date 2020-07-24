import React, { useState } from 'react';
import './AddProduct.css';
const axios = require('axios');

const AddProduct = () => {
    //States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState([]);
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState([]);
    const [displayAddProduct, setDisplayAddProduct] = useState(false);
/*     const [image, setImage] = useState({}); */

    //State-functions
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    }
    const onChangeTag = (e) => {
        setTag(e.target.value);
    }
    const onClickTags = (e) => {
        e.preventDefault();
        let tagsArray = tags;
        tagsArray.push(tag);
        setTags([...tagsArray]);
        setTag("");
    }
    const onClickRemoveTag = (e) => {
        let tagsArray = tags;
        tagsArray.splice(e.currentTarget.id, 1);
        setTags([...tagsArray]);
    }
    const onChangePrice = (e) => {
        setPrice(e.target.value);
    }
    const onClickDisplay = () => {
        setDisplayAddProduct(!displayAddProduct)
    }
    //Submit-function
    const onSubmit = (e) => {
        e.preventDefault();

        const errorsArray = errors;
        errorsArray.length = 0;
        setErrors([...errorsArray]);

        if (!title) {
            let newErrors = errors;
            newErrors.push("A product needs a Title to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (!description) {
            let newErrors = errors;
            newErrors.push("A product needs a Description to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (!amount) {
            let newErrors = errors;
            newErrors.push("A product needs an Amount of at least 1 to be eligible for subsmission.")
            setErrors([...newErrors]);
        }
        if (tags.length === 0) {
            let newErrors = errors;
            newErrors.push("A product needs at least one Tag to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (!price) {
            let newErrors = errors;
            newErrors.push("A product needs a price to be eligible for submission.")
            setErrors([...newErrors]);
        }
        if (errors.length !== 0) {
            return;
        }

        const product = {
            type: "product",
            image: `images/${title.toLowerCase()}.png`,
            title: title,
            description: description,
            amount: amount,
            tags: tags,
            reviews: [],
            price: price,
        }

        axios.post('http://localhost:5000/addproduct', {
            product: product
        })
            .then(function (response) {
                setTitle("");
                setDescription("");
                setAmount(0);
                setTags([]);
                setPrice(0);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    let tagsEntered = tags.map((tag, index) => {
        return (
            <div className="tag" id={index} onClick={onClickRemoveTag}><p>{tag}</p></div>
        )
    });
    let errorMessages = errors.map(error => {
        return (
            <p className="errorMessage_error">{error}</p>
        )
    });


/*     const changeImage = (e) => {
         setImage({...e.target.files[0]})
    }
    console.log(image)
    const uploadFile = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/upload', {
            file: image
    })
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });
    } */

    return (
        <>
            <button id="AddProduct_Button" onClick={onClickDisplay}>{displayAddProduct ? "Click here to stop displaying product adder" : "Click here to display product adder"}</button>
{/* 
            <form method="post" enctype="multipart/form-data" action="http://localhost:5000/upload">
                <input type="file" name="file" onChange={changeImage}/>
                <input type="submit" value="Submit" onClick={uploadFile}/>
            </form>
 */}
            <div id="AddProduct" style={displayAddProduct ? { display: "inline-block" } : { display: "none" }}>
                <div style={errors.length > 0 ? { display: "inline-block" } : { display: "none" }}>
                    The following errors occurred when attempting to add the product:
                {errorMessages}
                </div>
                <form onSubmit={onSubmit}>
                    <label htmlFor="title">
                        Title: <br /> <input id="title" type="text" placeholder="E.g. 'Reaching for the heavens'... " onChange={onChangeTitle} value={title} />
                    </label>
                    <label htmlFor="description">
                        Description: <br /> <textarea id="description" type="text" placeholder="E.g. 'Acryllic painting created by pouring red and blue with..." onChange={onChangeDescription} value={description} />
                    </label>
                    <label htmlFor="amount">
                        Amount: <br /> <input id="amount" type="number" onChange={onChangeAmount} value={amount} />
                    </label>
                    <label htmlFor="price">
                        Price: <br /> <input id="price" type="number" onChange={onChangePrice} value={price} />
                    </label>
                    <label htmlFor="tags">
                        Tags: <br /> <input id="tags" type="text" placeholder="E.g. 'Acryllic' or 'Wolf'" onChange={onChangeTag} value={tag} /><button id="Tags-Button" onClick={onClickTags}>Add tag</button>
                    </label>
                    <div id="AddProduct_tags_container">
                        {tagsEntered}
                    </div>
                    <button>Submit Product</button>
                </form>
            </div>
        </>
    );
}

export default AddProduct;
