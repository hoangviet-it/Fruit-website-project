import React,{useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'

export default function Cart() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [cart, setCart] = state.userAPI.cart
    const [discounts] = state.discountAPI.discount
    const [codeDiscount, setCodeDiscount] = state.orderAPI.code
    const [money, setMoney] = state.orderAPI.money
    const [total, setTotal] = useState(0)
    const [ship] = useState(30000)
    const [checkDiscount, setCheckDiscount] = state.discountAPI.checkCodeDiscount

    //tính tổng tiền hàng
    useEffect(() =>{
        const getTotal = async () =>{
            const total = await cart.reduce((prev, item) =>{
                return prev + ((item.price/100)*(100-item.discount) * item.quantity)
            },0)

            setTotal(total)
        }
        getTotal()
    },[cart])

    // set dữ liệu vào db
    const addToCart = async () =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }

    //tăng số lượng
    const increment = (id) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.quantity+=1
            }
        })
        setCart([...cart])
        addToCart()
    }

    // giảm số lượng
    const decrement = (id) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity-=1
            }
        })
        setCart([...cart])
        addToCart()
    }

    // xóa khỏi giỏ hàng
    const removeProduct = id =>{
        if(window.confirm("Bạn chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng ?")){
            cart.forEach((item, index) =>{
                if(item._id === id){
                    cart.splice(index,1)
                }
            })
            setCart([...cart])
            addToCart()
        }
    }

    // lấy dữ liệu từ input
    // const handleChangeInput = e =>{
    //     const {value} = e.target
    //     setCodeDiscount(value)
    // }

    // xử lý button áp dụng mã khuyến mãi
    // const DiscountCode = () =>{
    //     discounts.forEach((item)=>{
    //         if(item.code===codeDiscount){
    //             setMoney((total/100)*(100-item.persent)+ship)
    //             setCheckDiscount(true)
    //             //setCodeDiscount('')
    //             alert("Áp dụng mã khuyến mãi thành công!")
    //         }
    //     })
    // }

    // tạo item "reload" trong localStorage để load lại page cho chức năng cập nhật số thông báo ở component CreateOrder
    useEffect(()=>{
        if(cart.length===0){
            localStorage.removeItem('reload')
        }
        else {
            localStorage.setItem('reload', true)
        }
    },[])

    if(cart.length === 0)
        return  <div className="empty-cart">
                    <h2>Giỏ hàng</h2>
                    <h2>Chưa có sản phẩm nào</h2>
                    <Link to='/product' className="continue-buy">QUAY LẠI TRANG MUA HÀNG</Link>
                </div>

    return (
        <div className="wrap-container-cart">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Giỏ hàng</span>
            </div>

            <p className="title-cart-head">GIỎ HÀNG (<span>{cart.length} sản phẩm</span>)</p>

            <div className="container-cart">

                <div className="cart-item">
                    {
                        cart.map(product =>(
                            <div className="cart" key={product._id}>
                                <div className="box-cart-left">
                                    <img src={product.images.url} alt="" />
                                    <span>
                                        <h3>{product.title}</h3>
                                        <p>Xuất xứ: {product.description}</p>
                                        <div className="delete-pro-cart" onClick={()=>removeProduct(product._id)}>Xóa khỏi giỏ hàng</div>
                                    </span>
                                </div>

                                <div className="box-cart">
                                    <div className="price-cart">
                                        <p>{((product.price/100)*(100-product.discount)).toLocaleString("en")} <u>đ</u>/kg</p>
                                        <div>
                                            <span style={product.discount===0?{display:'none'}:{display:'inline'}}>
                                                <del style={{color:'#888'}}>{product.price.toLocaleString("en")} <u>đ</u>/kg</del>&nbsp;&nbsp;|&nbsp;</span>
                                            <span>-{product.discount}%</span>
                                        </div>
                                    </div>
                                    <span className="amount">
                                        <span className="btn-amount" onClick={()=>decrement(product._id)} 
                                        style={{borderTopLeftRadius: '4px',borderBottomLeftRadius: '4px',cursor:'pointer'}}>-</span>
                                        <span>{product.quantity}</span>
                                        <span className="btn-amount" onClick={()=>increment(product._id)}
                                        style={{borderTopRightRadius: '4px',borderBottomRightRadius: '4px',cursor:'pointer'}}>+</span>
                                    </span>

                                    {/* <div className="delete-pro-cart" onClick={()=>removeProduct(product._id)}>X</div> */}
                                </div>
                            </div>
                        ))
                    }
                    <Link to='/product' className="continue-buy">TIẾP TỤC MUA HÀNG</Link>
                </div>

                <div className="total">
                    {/* <div className="wrap-code-item">
                        <p>Nhập mã khuyến mãi (nếu có)</p>
                        <div className="code-item">
                            <input type="text" name="code" id="code" value={codeDiscount}
                            onChange={handleChangeInput} />
                            <span onClick={DiscountCode}>Áp dụng</span>
                            <p>(Chỉ áp dụng trên tiền hàng)</p>
                        </div>
                    </div> */}

                    <div className="item-total">
                        {/* <p>
                            <span style={{color:'#000', marginLeft:'0',}}>Mã khuyến mãi: </span>         
                            {
                                discounts.map(discount=>{
                                    if(codeDiscount===discount.code){
                                        return <span key={discount._id} 
                                        style={checkDiscount?{display:'inline',color:'#3366CC'}:{display:'none'}}>- {discount.persent}%</span>
                                    }
                                })
                            }
                        </p> */}
                        <p>Tiền hàng: &nbsp;<span style={{color:'#3366CC'}}>{(total).toLocaleString("en")} <u>đ</u></span></p>
                        <p>Phí vận chuyển: <span style={{color:'#3366CC'}}>{ship.toLocaleString("en")} <u>đ</u></span></p>
                        <hr></hr>
                        <p>Thành tiền: <span>{money===0?((total+ship).toLocaleString("en")):(money.toLocaleString("en"))} <u>đ</u></span></p>
                        <div className="note-total">(Đã bao gồm các hình thức khuyến mãi)</div>
                        <Link to='/order'>TIẾN HÀNH ĐẶT HÀNG</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}