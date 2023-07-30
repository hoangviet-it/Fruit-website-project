import React, {useState, useContext, useEffect} from 'react';
import {GlobalState} from '../../GlobalState';
import {Link} from 'react-router-dom';
import Menu from './icon/menu.svg';
import Close from './icon/close.svg';
import Cart from './icon/cart.svg';
import User from './icon/user-solid.svg'
import Down from './icon/down.svg'
import Logo from './icon/logo.png'
import Search from './icon/search.svg'
import login from './icon/login.svg'
import logout from './icon/logout.svg'
import register from './icon/register.svg'
import order from './icon/order.svg'
import setting from './icon/setting.svg'
import userCheck from './icon/usercheck.svg'
import axios from 'axios'
import MyOrder from '../mainpages/myOrder/MyOrder';

export default function HeaderFixed() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart
    const [user] = state.userAPI.user
    const [search, setSearch] = state.productsAPI.search
    const [category, setCategory] = state.productsAPI.category
    const [click, setClick] = useState(false)

    const logoutUser = async () =>{
        await axios.get('/user/logout')
        localStorage.removeItem('Login')
        localStorage.removeItem('reload')
        window.location.href = "/";
    }

    // xủ lý click vào mục tài khoản
    const handleClickAccount = () =>{
        setClick(!click)
    }

    // xử lý click mục đơn hàng của tôi
    const handelMyOrder = ()=>{
        setClick(!click)
        localStorage.setItem('reload', true)    // tạo item 'reload' trong localStorage
    }

    // xử lý refresh homepage
    const refreshHomePage = () =>{
        setCategory('')
    }


return (
    <header id="header" className="headreFixed" style={isAdmin?{display:'none'}:{display:'block'}}>
        <div className="container-header">

            <div className="wrap-logo">
                <Link to='/'>
                    <h1>
                        <img className="logo" src={Logo}></img>
                    </h1>
                </Link>
            </div>

            <div className="content-header">
                <div className="function-header">

                    <div className="func-search">
                        <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                            onChange={e=>setSearch(e.target.value.toLowerCase())} />

                        <Link to='/product'>
                            <span className="wrap-icon-search">
                                <img className="icon-search" src={Search} alt=""></img>
                            </span>
                        </Link>
                    </div>
                    
                    <div className="account">
                        <span className="icon-acc" onClick={handleClickAccount} style={isLogged ?{backgroundColor:'#7ec522'}:{backgroundColor:'#fff'}}>
                            {
                                // isLogged ? <img className="icon-user" src={userCheck} alt=''></img>
                                isLogged ? <span style={{padding:'0px 5px',color:'#fff',textTransform:'uppercase',fontWeight:'700', fontSize:'1.1rem'}}>
                                    {user.slice(0,1)}</span>
                                : <img className="icon-user" src={User} alt=''></img>
                            }
                        </span>

                        <span className="dropdown-acc" onClick={handleClickAccount}>
                            {
                                isLogged ? <span>{user}</span> : <span>Tài khoản</span>
                            }

                            <span>
                                <img className="icon-dropdown" src={Down}></img>
                            </span>
                        </span>
                        
                        <div className="ctrl-acc" style={click ? {display: 'block'} : {display: 'none'}}>
                            {
                                isLogged ?  <div>
                                                <Link to='/myorder' onClick={handelMyOrder}>
                                                    <p><img src={order} alt=''></img>Đơn hàng của tôi</p></Link>
                                                <Link to='/updateinforclient' onClick={handleClickAccount}>
                                                    <p style={{borderBottom:'1px solid #bbb'}}><img src={setting} alt=''></img>Thiết lập</p></Link>
                                                <Link to='/' onClick={logoutUser}>
                                                    <p><img src={logout} alt=''></img>Đăng xuất</p></Link>
                                            </div>
                                :   <div>
                                        <Link to='/login' onClick={handleClickAccount}>
                                            <p><img src={login} alt=''></img>Đăng nhập</p></Link>
                                        <Link to='/register' onClick={handleClickAccount}>
                                            <p><img src={register} alt=''></img>Đăng ký</p></Link>
                                    </div>
                            }
                        </div>
                        
                        <span className="wrap-cart">
                            <Link to='/cart'><img className="icon-cart" src={Cart}></img></Link>
                            <span style={cart.length<=0?{display:'none'}:{display:'block'}}>{cart.length}</span>
                        </span>
                    </div>

                </div>

                <div className="menu-header">
                    <ul>
                        <Link to='/' onClick={refreshHomePage}>                          
                            <li>TRANG CHỦ</li>
                        </Link>
                        <Link to='/intro'>                          
                            <li>GIỚI THIỆU</li>
                        </Link>
                        <Link to='/product'>                         
                            <li>SẢN PHẨM</li>
                        </Link>
                        <Link to='/discountpage'>                          
                            <li>KHUYẾN MÃI</li>
                        </Link>
                        <Link to='/contact'>                          
                            <li>LIÊN HỆ</li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    </header>
  )
}
