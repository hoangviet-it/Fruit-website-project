import React, {useState, useContext, useEffect} from 'react'
import {GlobalState} from '../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Down from '../header/icon/down.svg'
import Noti from '../header/icon/notification.svg'
import menu from '../header/icon/menu.svg'
import logout from '../header/icon/logout.svg'
import ProductManagement from './productManagement/ProductManagement'
import DashBoard from './dashBoard/DashBoard'
import Ordermanagement from './orderManagement/Ordermanagement'
import CategoryManagement from './categoryManagement/CategoryManagement'
import UserClient from './userClient/UserClient'
import StatusManagement from './statusManagement/StatusManagement'
import DiscountManagement from './discountManagement/DiscountManagement'
import ReviewManagement from './reviewManagement/ReviewManagement'
import ReportManagement from './reportManagement/ReportManagement'
import ListProductDiscount from './productManagement/ListProductDiscount'
import imgDashboard from '../header/icon/dashboard.svg'
import imgUser from '../header/icon/user-solid.svg'
import imgPro from '../header/icon/product.svg'
import imgCategory from '../header/icon/category.svg'
import imgOrder from '../header/icon/order.svg'
import imgStatus from '../header/icon/status.svg'
import imgDiscount from '../header/icon/discount.svg'
import imgReview from '../header/icon/review.svg'
import imgHomepage from '../header/icon/home.svg'
import imgReport from '../header/icon/report.svg'

function ControlAd() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin
    const [user] = state.userAPI.user
    const [search, setSearch] = state.productsAPI.search
    const [notify] = state.notifyAPI.notify
    const [callback, setcallback] = state.notifyAPI.callback
    const [hide, setHide] = useState(false)
    const [show, setShow] =useState(false)
    const [activate, setActivate] = useState(false) // dùng activate thẻ p control khi click
    const [newNotify, setNewNotify] = useState(0)
    const [notifyOrder, setNotifyOrder] = useState(0)
    const [notifyReview, setNotifyReview] = useState(0)
    const [OnOffSlide, setOnOffSlide] =useState(0)
    const [OnOffDisc, setOnOffDisc] =useState(0)
    const [notifyCancelOrd, setNotifyCancelOrd] = useState(0)
    
    const [DashboardPage, setDashboardPage] = useState(true)
    const [ProductPage, setProductPage] = useState(false)
    const [OrderPage, setOrderPage] = useState(false)
    const [CategoryPage, setCategoryPage] = useState(false)
    const [UserClientPage, setUserClientPage] = useState(false)
    const [StatusPage, setStatusPage] = useState(false)
    const [DiscountPage, setDiscountPage] = useState(false)
    const [ReviewPage, setReviewPage] = useState(false)
    const [ReportPage, setReportPage] = useState(false)
    const [NotifyPage, setNotifyPage] = useState(false)
    const [Home, setHome] = useState(false)
    const [listProDisc, setListProDisc] = useState(false)

    // hiển thị thông báo
    // số liệu trong thông báo
    useEffect(()=>{
        const sum = ()=>{
            var a=[]
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    a.push(el.newOrder)
                    a.push(el.newReview)
                    a.push(el.cancelOrder)
                }
            })
            setNewNotify(a.reduce((p, i)=>{
                return p+i
            },0))
        }
        sum()

        const sum1 = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setNotifyOrder(el.newOrder)
                    setNotifyReview(el.newReview)
                    setNotifyCancelOrd(el.cancelOrder)
                    setOnOffSlide(el.slide)
                    setOnOffDisc(el.discount)
                }
            })
        }
        sum1()
    })

    // số liệu trong thông báo
    // useEffect(()=>{
    //     const sum = ()=>{
    //         notify.forEach(el=>{
    //             if(el._id==="635cd52464f5b7334c594007"){
    //                 setNotifyOrder(el.newOrder)
    //                 setNotifyReview(el.newReview)
    //                 setNotifyCancelOrd(el.cancelOrder)
    //                 setOnOffSlide(el.slide)
    //                 setOnOffDisc(el.discount)
    //             }
    //         })
    //     }
    //     sum()
    // })

    // lấy dữ liệu slide, discount trong db notify
    // useEffect(()=>{
    //     const getData = ()=>{
    //         notify.forEach(el=>{
    //             if(el._id==="635cd52464f5b7334c594007"){
    //                 setOnOffSlide(el.slide)
    //                 setOnOffDisc(el.discount)
    //             }
    //         })
    //     }
    //     getData()
    // })

    // đăng xuất
    const logoutUser = async () =>{
        await axios.get('/user/logout')
        localStorage.removeItem('Login')
        window.location.href = "/";
    }

    // ẩn hiện bảng điều khiển
    const hideDashboard = ()=>{
        setHide(!hide)
    }

    // ẩn hiện option tài khoản
    const showOptionAd = () =>{
        setShow(!show)
    }

    // show component các nội dung page
    const ShowPage = (value)=>{
        if(value===4){
            setProductPage(true)
            setDashboardPage(false)
            setOrderPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===1){
            setDashboardPage(true)
            setProductPage(false)
            setOrderPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===6){
            setOrderPage(true)
            setDashboardPage(false)
            setProductPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===5){
            setCategoryPage(true)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===3){
            setUserClientPage(true)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===7){
            setStatusPage(true)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===8){
            setDiscountPage(true)
            setStatusPage(false)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===9){
            setReviewPage(true)
            setDiscountPage(false)
            setStatusPage(false)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
        else if(value===11){
            setReportPage(true)
            setReviewPage(false)
            setDiscountPage(false)
            setStatusPage(false)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setNotifyPage(false)
            setHome(false)
            setListProDisc(false)
        }
    }

    // click vào thông báo đơn hàng mới
    const ShowPageOrder = (value) =>{
        if(value===6){
            setOrderPage(true)
            setDashboardPage(false)
            setProductPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_neworder/${'635cd52464f5b7334c594007'}`, {newOrder: el.newOrder=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 3*1000)
    }

    const ShowPageCancelOrder = (value) =>{ 
        if(value===6){
            setOrderPage(true)
            setDashboardPage(false)
            setProductPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_cancelorder/${'635cd52464f5b7334c594007'}`, {cancelOrder: el.cancelOrder=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 1000)
    }

    // click vào thông báo đánh giá mới
    const ShowPageReview = (value) =>{
        if(value===9){
            setReviewPage(true)
            setDiscountPage(false)
            setStatusPage(false)
            setUserClientPage(false)
            setCategoryPage(false)
            setOrderPage(false)
            setDashboardPage(false)
            setProductPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setListProDisc(false)
        }
        setTimeout(() => {
            try {
                notify.forEach(async el=>{
                    await axios.put(`/api/update_newreview/${'635cd52464f5b7334c594007'}`, {newReview: el.newReview=0}, {
                        headers: {Authorization: token}
                    })
                    setcallback(!callback)
                })
            } catch (err) {
                alert(err.response.data.msg)
            }
        }, 3*1000);
    }

    // show form thông báo
    const ShowPageNotify = ()=>{
        setNotifyPage(true)
    }

    // đóng form thông báo
    const hidenNotifyPage = ()=>{
        setNotifyPage(false)
    }

    // xử lý show form control trang chủ
    const showManaHome = ()=>{
        setHome(!Home)
    }

    // xử lý bật tắt slide
    const slide = async ()=>{
        var a=0; var b=1
        if(OnOffSlide===1){
            try {
                const res = await axios.put(`/api/update_slide/${'635cd52464f5b7334c594007'}`, {slide: a}, {
                    headers: {Authorization: token}
                })
                setcallback(!callback)
                alert("Đã tắt Slide !")

            } catch (err) {
                alert(err.response.data.msg)
            }
        }
        else {
            try {
                await axios.put(`/api/update_slide/${'635cd52464f5b7334c594007'}`, {slide: b}, {
                    headers: {Authorization: token}
                })
                setcallback(!callback)
                alert("Đã bật Slide !")

            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    // xử lý bật tắt discount on home page
    const discount = async ()=>{
        var a=0; var b=1
        if(OnOffDisc===1){
            try {
                const res = await axios.put(`/api/update_discount/${'635cd52464f5b7334c594007'}`, {discount: a}, {
                    headers: {Authorization: token}
                })
                setcallback(!callback)
                alert("Đã tắt thông tin khuyến mãi !")

            } catch (err) {
                alert(err.response.data.msg)
            }
        }
        else {
            try {
                await axios.put(`/api/update_discount/${'635cd52464f5b7334c594007'}`, {discount: b}, {
                    headers: {Authorization: token}
                })
                setcallback(!callback)
                alert("Đã bật thông tin khuyến mãi !")

            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    // xem danh sách các sản phẩm đang khuyến mãi
    const showListProDisc = (value)=>{
        if(value===12){
            setListProDisc(true)
            setProductPage(false)
            setDashboardPage(false)
            setOrderPage(false)
            setCategoryPage(false)
            setUserClientPage(false)
            setStatusPage(false)
            setDiscountPage(false)
            setReviewPage(false)
            setReportPage(false)
            setNotifyPage(false)
            setHome(false)
        }
    }

return (
    <div className="container-admin">
        <div className="navigation-ad" style={hide?{transform:'translateX(-100%)',transition:'linear 0.4s'}:{transform:'translateX(0)',transition:'linear 0.4s'}}>
            <div className="logo-ad">
                <p>
                    HOANGVIETFRUIT
                </p>
            </div>

            <div className="list-nav-ad">
                <p onClick={()=>ShowPage(1)}><span><img className="img-icon-control-ad" src={imgDashboard} alt=''/>Dashboard</span></p>
                <p onClick={()=>ShowPage(3)}><span><img className="img-icon-control-ad" src={imgUser} alt=''/>Khách hàng</span></p>
                <p onClick={()=>ShowPage(4)}><span><img className="img-icon-control-ad" src={imgPro} alt=''/>Sản phẩm</span></p>
                <p onClick={()=>ShowPage(5)}><span><img className="img-icon-control-ad" src={imgCategory} alt=''/>Thể loại</span></p>
                <p onClick={()=>ShowPage(6)}><span><img className="img-icon-control-ad" src={imgOrder} alt=''/>Đơn hàng</span></p>
                <p onClick={()=>ShowPage(7)}><span><img className="img-icon-control-ad" src={imgStatus} alt=''/>Trạng thái</span></p>
                <p onClick={()=>ShowPage(8)}><span><img className="img-icon-control-ad" src={imgDiscount} alt=''/>Khuyến mãi</span></p>
                <p onClick={()=>ShowPage(9)}><span><img className="img-icon-control-ad" src={imgReview} alt=''/>Đánh giá</span></p>
                <p onClick={showManaHome}><span><img className="img-icon-control-ad" src={imgHomepage} alt=''/>Trang chủ</span></p>
                <p onClick={()=>ShowPage(11)}><span><img className="img-icon-control-ad" src={imgReport} alt=''/>Thống kê doanh thu</span></p>
                {
                    !Home?'':
                    <div className="HomeManagement-ad">
                        <div className="item-contrl-home-mana">
                            <span className="item-mana-home-ad">Slide</span>
                            <br/>
                            <span className="item-mana-home-ad btn-contrl-home" onClick={slide} style={OnOffSlide===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                {OnOffSlide===1?"Tắt":"Bật"}</span>
                        </div>

                        <div className="item-contrl-home-mana">
                            <span className="item-mana-home-ad">Khuyến mãi</span>
                            <br/>
                            <span className="item-mana-home-ad btn-contrl-home" onClick={discount} style={OnOffDisc===1?{backgroundColor:'#33CC33'}:{backgroundColor:'#FFCC00', color:'#000'}}>
                                {OnOffDisc===1?"Tắt":"Bật"}</span>
                        </div>
                    </div>
                }
            </div>
        </div>

        <div className="content-ad">
            <div className="header-content-ad" style={hide?{marginLeft:'-17%',width:'100%',transition:'linear 0.4s'}:{marginLeft:'0',transition:'linear 0.4s'}}>
                <div className="header-ad-left">
                    <img src={menu} alt='' onClick={hideDashboard}></img>
                    <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                        onChange={e=>setSearch(e.target.value.toLowerCase())} style={ProductPage?{display:'inline'}:{display:'none'}} />
                    <span onClick={()=>showListProDisc(12)} className="Btn-list-discounting" style={ProductPage?{display:'inline'}:{display:'none'}}>Đang khuyến mãi</span>
                </div>

                <div className="header-ad-right">
                    <span className="notification-ad" onClick={ShowPageNotify}>
                        <img src={Noti} alt=''></img>
                        {
                            newNotify===0?'': <span className="lenght-noti-ad">{newNotify}</span>
                        }
                    </span>
                    <span className="icon-ad-login" onClick={showOptionAd}>AD</span>
                    <span className="name-ad" onClick={showOptionAd}>{user}</span>
                    <span>
                        <img className="icon-dropdown" src={Down}></img>
                    </span>
                    <div className="option-acc-ad" style={show?{display:'block'}:{display:'none'}}>
                        <p onClick={logoutUser}><img src={logout} alt=''></img>Đăng Xuất</p>
                    </div>
                </div>
            </div>

            <div className={NotifyPage?"bg-disc-body-content-ad body-content-ad":"body-content-ad"}>
                {
                    ProductPage?<ProductManagement/>:''
                }
                {
                    DashboardPage?<DashBoard/>:''
                }
                {
                    OrderPage?<Ordermanagement/>:''
                }
                {
                    CategoryPage?<CategoryManagement/>:''
                }
                {
                    UserClientPage?<UserClient/>:''
                }
                {
                    StatusPage?<StatusManagement/>:''
                }
                {
                    DiscountPage?<DiscountManagement/>:''
                }
                {
                    ReviewPage?<ReviewManagement/>:''
                }
                {
                    ReportPage?<ReportManagement/>:''
                }
                {
                    listProDisc?<ListProductDiscount/>:''
                }

                <div className={NotifyPage?"notify-form-ad-ctrl":"hiden-notify-page"}>
                    <div className="tt-and-close-notify-ad">
                        <h5>Thông báo</h5>
                        <p className="btn-close-notify" onClick={hidenNotifyPage}>X</p>
                    </div>
                    {
                        newNotify===0 ? <h5 className="notify-when-db-empty">Chưa có thông báo mới !</h5>
                        :
                        <div className="container-notify-ad">
                            <p style={notifyOrder===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageOrder(6)}><span></span>Có {notifyOrder} đơn hàng mới!</p>
                            <p style={notifyReview===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageReview(9)}><span></span>Có {notifyReview} đánh giá mới từ khách hàng !</p>
                            <p style={notifyCancelOrd===0?{display:'none'}:{display:'block'}} onClick={()=>ShowPageCancelOrder(6)}><span></span>Có {notifyCancelOrd} đơn hàng bị hủy !</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
export default ControlAd;