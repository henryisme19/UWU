import './EditMyShopScreen2.css';
import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router';
import axios from 'axios';
import Loading from '../components/Loading';

const userData = JSON.parse(localStorage.getItem("userData"));

const MyShopEditProductScreen2 = (props) => {
    let { id } = useParams();

    const inputFileRef = useState(null);
    const [photo, setPhoto] = useState('');

    const [product, setProduct] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [category, setCategory] = useState('');
    const [shopId, setShopId] = useState('');
    const [shopName, setShopName] = useState('');

    const [productImageUrl, setProductImageUrl] = useState('');
    const [productLoading, setProductLoading] = useState(true);


    const onProductNameChange = (event) => {
        setProductName(event.currentTarget.value);
    }

    const onProductDescChange = (event) => {
        setProductDescription(event.currentTarget.value);
    }

    const onPriceChange = (event) => {
        setPrice(event.currentTarget.value);
    }

    const onCountInStockChange = (event) => {
        setCountInStock(event.currentTarget.value);
    }

    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value);
    }

    const onPhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/products/${id}`);
            const result = await response.json();

            setProduct(result);
            setProductName(result.name);
            setProductDescription(result.description);
            setPrice(result.price);
            setCountInStock(result.countInStock);
            setCategory(result.category);
            setProductImageUrl(result.imageUrl);
            setShopId(result.shopId);
            setShopName(result.shopName);
            setProductLoading(false);
        }


        catch (error) {
            alert("An error has been occurred while trying to fetch data... Please check console.");
            console.log(error);
            props.history.push("/myshop");
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (productName !== "" && productDescription !== "" && price !== "" && countInStock !== "" && category !== "" && shopId !== "" && shopName !== "") {
            if (price > 0 && countInStock > 0) {

                const formData = new FormData();

                formData.append('name', productName);
                formData.append('description', productDescription);
                formData.append('price', price);
                formData.append('countInStock', countInStock); // Capital Error (countinstock should be countInStock)
                formData.append('category', category);
                formData.append('profile_pic', photo);

                formData.append('shopId', shopId); // shopId is required
                formData.append('shopName', shopName); // shopName is required

                axios.put(`http://localhost:5000/products/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    if (res.data.img) {
                        setProductImageUrl(res.data.img);
                    }
                    props.history.push("/myshop");

                    alert("your information has been updated!");
                }).catch(error => {
                    console.log(error);
                    alert("error occured");
                });

                setPhoto(null);
                document.getElementById("imgFile").value = "";

            } else {
                alert("Product Price and Count In Stock must not be 0");
            }
        } else {
            alert("Please fill in the blank");
        }
    }

    const onDelete = async () => {
        await axios.delete(`http://localhost:5000/products/${id}`)
            .then(res => {
                //props.history.push("/myshop");
            }).catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (productLoading && product===null) {
        return <Loading />
    }

    return (
        <div className="profile">
            <div className="account-information">
                <h1 className="text-center">Edit Product (Dont edit/delete product yet)</h1>

                <div className="container" >
                    <div className="column-1 box" >

                        {/* Do the styling on your own.*/}
                        <img
                            src={`${process.env.PUBLIC_URL}/images/${productImageUrl}?${Date.now()}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
                            }} alt="" />

                        <form className="form" method="POST" encType="multipart/form-data">
                            <p type="Product Name:">
                                <input type="text" name="name" value={productName} onChange={onProductNameChange}
                                    placeholder="Product name" required />
                            </p>
                            <p type="Product Description:">
                                <input type="text" name="description" value={productDescription} onChange={onProductDescChange}
                                    placeholder="Product Description" required />
                            </p>

                            <p type="Product Price:">
                                <input type="number" name="price" value={price} onChange={onPriceChange}
                                    placeholder="Price" required />
                            </p>

                            <p type="Product Category:">
                                <select type="text" name="category" value={category} onChange={onCategoryChange} required>
                                    <option value selected>Select</option>
                                    <option value="Headphones">Headphones</option>
                                    <option value="Speakers">Speaker</option>
                                    <option value="Smart Device">Smart Device</option>
                                    <option value="Mobile Phone">Mobile Phone</option>
                                    <option value="Camera">Camera</option>
                                    <option value="Smart Watch">Smart Watch</option>
                                </select>
                            </p>

                            <p type="Product Count In Stock:">
                                <input type="number" name="countinstock"
                                    value={countInStock}
                                    onChange={onCountInStockChange}
                                    min="1"
                                    max="100" required />
                            </p>

                            <p type="Product Picture">
                                <input ref={inputFileRef} id="imgFile" type="file" accept=".png, .jpg, .jpeg"
                                    name="photo"
                                    onChange={onPhotoChange} />
                            </p>

                            <br />

                            <center>
                                <button type="submit" className="button3" onClick={onSubmit}>Update</button>
                                <button type="delete" className="button3" onClick={onDelete}>Delete</button>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyShopEditProductScreen2
