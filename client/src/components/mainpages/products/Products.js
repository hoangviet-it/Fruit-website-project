import React, {useContext, useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productitem/Productitem'
import DiscountItem from '../discount/DiscountProduct'
import Loading from '../utils/loading/Loading'
import Filters from './Filters'
import LoadMore from './LoadMore'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import CircleRight from '../../header/icon/circle-right.svg'
import Dollar from '../../header/icon/dollar.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'


export default function Products() {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = state.productsAPI.category
    const [middle, setmiddle] = useState(false)
    const [filterPrice, setFilterPrice] = useState(false)
    const [filterPrice1, setFilterPrice1] = useState(false)
    const [filterPrice2, setFilterPrice2] = useState(false)
    const [filterPrice3, setFilterPrice3] = useState(false)
    const [discounts, setDiscount] = useState([])
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)

    
    // xử lý đưa các sản phẩm khuyến mãi vào mảng discount
    useEffect(() =>{
        const disC = products.filter((pro) =>{
            return (pro.discount>0)
        })
        setDiscount(disC)
    }, [products])

    // truyền id của category về db để get ra sản phẩm cùng loại
    const handleCategory = id =>{
        setmiddle(false)
        setCategory(id)
    }

    // show sản phẩm của tất cả thể loại
    const displayAllPro = () => {
        setCategory('')
    }

    // xử lý click lọc theo giá sản phẩm
    const allPrice = () =>{
        setmiddle(false)
    }

    const less100 = () =>{
        setmiddle(true)
        setFilterPrice(true)
        setFilterPrice3(false)
        setFilterPrice2(false)
        setFilterPrice1(false)
    }

    const from_100_to_199 = () =>{
        setmiddle(true)
        setFilterPrice1(true)
        setFilterPrice3(false)
        setFilterPrice2(false)
        setFilterPrice(false)
    }

    const from_200_to_500 = () =>{
        setmiddle(true)
        setFilterPrice2(true)
        setFilterPrice3(false)
        setFilterPrice1(false)
        setFilterPrice(false)
    }

    const bigger500 = () =>{
        setmiddle(true)
        setFilterPrice3(true)
        setFilterPrice2(false)
        setFilterPrice1(false)
        setFilterPrice(false)
    }

    // xử lý ẩn hiện nút back to top khi cuộn chuột
    useEffect(()=>{
        window.onscroll = ()=> {
            const scrollFunction = ()=> {
                if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                    setBtnBackTop(true)
                } else {
                    setBtnBackTop(false)
                }
            }
            scrollFunction()

            const scrollheader = ()=> {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    setHeader(true)
                } else {
                    setHeader(false)
                }
            }
            scrollheader()
        }
    })

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }
    
    
    return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="container-pro">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Danh mục sản phẩm</span>
            </div>

            <div className="wrap-list-category">
                <div className="list-category">
                    <div className="list-category-item"> 
                        <h3>DANH MỤC SẢN PHẨM</h3>
                        <button className="all" onClick={displayAllPro}><img src={CircleRight} alt=''></img>Tất cả</button>
                        {
                            categories.map(category =>(
                                <div className="list-row" key={category._id}>
                                    <button onClick={()=>handleCategory('category='+category._id)}>
                                        <img src={CircleRight} alt=''></img>
                                        {category.name}
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    <div className="list-price-item">
                        <h3>LỌC THEO GIÁ</h3>
                        <button onClick={allPrice}><img src={Dollar} alt=''></img>Tất cả</button>
                        <button onClick={less100}><img src={Dollar} alt=''></img>Dưới 100,000</button>
                        <button onClick={from_100_to_199}><img src={Dollar} alt=''></img>Từ 100,000 - 199,000</button>
                        <button onClick={from_200_to_500}><img src={Dollar} alt=''></img>Từ 200,000 - 500,000</button>
                        <button onClick={bigger500}><img src={Dollar} alt=''></img>Trên 500,000</button>
                        
                    </div>

                    <div className="list-discount-item">
                        <h3>SẢN PHẨM KHUYẾN MÃI</h3>
                        {
                            discounts.map((pro, index, products) =>{
                                //if(pro.discount>0){
                                    if(index<=2){
                                        return <DiscountItem key={pro._id} pro={pro} />
                                    }
                                //}
                            })
                        }
                    </div>

                </div>

                <div className="pro-card">
                    <Filters />

                    <div className="line"></div>

                    <div className='products' style={middle ? {display: 'none'} : {display: 'flex'}}>
                        {
                            products.map(product =>{
                                return <ProductItem key={product._id} product={product} filter={filterPrice}/>
                            })
                        }
                    </div>

                    <div className='products' style={middle&&filterPrice ? {display: 'flex'} : {display: 'none'}}>
                        {
                            products.map(product =>{
                                if(((product.price/100)*(100-product.discount))<100000){
                                    return <ProductItem key={product._id} product={product} filter={filterPrice}/>
                                }
                            })   
                        }
                    </div>

                    <div className='products' style={middle&&filterPrice1 ? {display: 'flex'} : {display: 'none'}}>
                        {
                            products.map(product =>{
                                if(((product.price/100)*(100-product.discount))>=100000&&((product.price/100)*(100-product.discount))<=199000){
                                    return <ProductItem key={product._id} product={product} filter={filterPrice1}/>
                                }
                            })   
                        }
                    </div>

                    <div className='products' style={middle&&filterPrice2 ? {display: 'flex'} : {display: 'none'}}>
                        {
                            products.map(product =>{
                                if(((product.price/100)*(100-product.discount))>=200000&&((product.price/100)*(100-product.discount))<=500000){
                                    return <ProductItem key={product._id} product={product} filter={filterPrice2}/>
                                }
                            })   
                        }
                    </div>

                    <div className='products' style={middle&&filterPrice3 ? {display: 'flex'} : {display: 'none'}}>
                        {
                            products.map(product =>{
                                if(((product.price/100)*(100-product.discount))>500000){
                                    return <ProductItem key={product._id} product={product} filter={filterPrice3}/>
                                }
                            })   
                        }
                    </div>

                    <LoadMore />

                    <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
                        <img src={UpHeadPage} alt="" width="15" />
                    </Link>

                    {products.length === 0 && <Loading/>}
                </div>
            </div>
        </div>
    </>
    )
}