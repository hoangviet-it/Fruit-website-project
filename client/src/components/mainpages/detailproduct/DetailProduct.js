import React, {useContext, useState, useEffect} from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Productitem from '../utils/productitem/Productitem'
import Loading from '../utils/loading/Loading'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import facebook from '../../header/icon/facebook-color.png'
import intagram from '../../header/icon/instagram-color.png'
import skype from '../../header/icon/skype-color.png'
import gmail from '../../header/icon/gmail-color.png'
import star from '../../header/icon/star.png'
import starYello from '../../header/icon/star-yello.png'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'

const defaultreview = {
    star: 0,
    content: '',
    _id: ''
}

export default function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [review, setReview] = useState(defaultreview)
    const addCart = state.userAPI.addCart
    const [products] = state.productsAPI.productAll
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token
    const [reviews] = state.reviewsAPI.review
    const [refresh, setRefresh] = state.reviewsAPI.refresh
    const [userId] = state.userAPI.user_id
    const [detailProduct, setdetailProduct] = useState([])
    const [focusBtn, setFocusBtn] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [orders] = state.orderAPI.orderAll
    const [sold, setSold] = useState(0)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)

    const [starr1, setStar1] = useState(false)
    const [starr2, setStar2] = useState(false)
    const [starr3, setStar3] = useState(false)
    const [starr4, setStar4] = useState(false)
    const [starr5, setStar5] = useState(false)

    const Star1 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(false)
        setStar3(false)
        setStar4(false)
        setStar5(false)
    }

    const Star2 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(false)
        setStar4(false)
        setStar5(false)
    }

    const Star3 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(false)
        setStar5(false)
    }

    const Star4 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(true)
        setStar5(false)
    }

    const Star5 = (amount) => {
        setReview({...review, star: amount})
        setStar1(true)
        setStar2(true)
        setStar3(true)
        setStar4(true)
        setStar5(true)
    }

    // xử lý số lượng đã bán
    useEffect(()=>{
        var a=[]
        const sold = ()=>{
            orders.forEach(el=>{
                if(el.status_order==="632878dea2e7052bc439f979"){
                    el.product.forEach(i=>{
                        if(i._id===params.id){
                            a.push(i.quantity)
                        }
                    })
                }
            })
        }
        sold()
        setSold(a.reduce((p, i)=>{
            return p+i
        },0))
    })

    // lấy dữ liệu detail
    useEffect(() =>{
        if(params.id){
            products.forEach(product => {
                if(product._id===params.id) setdetailProduct(product)
            });
        }
    },[params.id, products])

    // xử lý focus nút mô tả
    const ClickFocusDescription = () => {
        setFocusBtn(false)
    }

    // focus nút đánh giá
    const ClickFocusReview = ()=>{
        setFocusBtn(true)
    }

    // thay đổi value input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setReview({...review, [name]:value})
    }

    // tạo bình luận mới
    const createReview = async() => {
        try {
            if(isLogged) {
                const res = await axios.post('/api/review', {product: params.id, ...review}, {
                    headers: {Authorization: token}
                })
                setReview(defaultreview)
                alert(res.data.msg)
                updateNotifyReview()
            }
            else {
               alert("Hãy đăng nhập để đánh giá sản phẩm!")
            }
            setRefresh(!refresh)
            setStar1(false)
            setStar2(false)
            setStar3(false)
            setStar4(false)
            setStar5(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa bình luận
    const deleteReview = async(id) => {
        try{
            if(isLogged) {
                const res = await axios.delete(`/api/review/${id}`, {
                    headers: {Authorization: token}
                })
                setRefresh(!refresh)
                alert(res.data.msg)
            }
            else {
                alert("Bạn chưa đăng nhập.")
            }
            
        } catch(err){
            alert(err.response.data.msg)
        }
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

            // show header fixed
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

    // cập nhật thông báo khi có đánh giá mới
    const updateNotifyReview = () =>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_newreview/${'635cd52464f5b7334c594007'}`, {newReview: el.newReview+1}, {
                    headers: {Authorization: token}
                })
            })
            localStorage.setItem('reloadPage', true)
            setReload(true)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // reload khi mở trang và sau khi bấm nút đăng để cập nhật thông báo đánh giá mới
    useEffect(()=>{
        if(localStorage.getItem('reloadPage')){
            window.location.reload()
            setLoading(true)
            localStorage.removeItem('reloadPage')
        }
    },[reload])

    if(detailProduct.length === 0) return null;

    return (
        
        loading ? <div style={{marginBottom:'150px'}}><Loading/></div>
        :
        <>
            {
                header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
            }
            <div className="container-detail">

                <div className="crumb">
                    <Link to='/' className="crumb-homepage">
                        <img src={Home} alt=''></img>
                        <span>Trang chủ</span>
                    </Link>
                    <img src={Next} alt=''></img>
                    <Link to='/product' className="crumb-homepage">
                        <span>Danh mục sản phẩm</span>
                    </Link>
                    <img src={Next} alt=''></img>
                    <span className="crumb-name">Chi tiết sản phẩm</span>
                </div>

                <div className="detail">
                    <img src={detailProduct.images.url} alt="" />

                    <div className="box-detail">
                        <div className="row">
                            <h2>{detailProduct.title}</h2>
                            <h6>#Mã: {detailProduct.product_id}</h6>
                        </div>
                        <p>Trạng thái: {detailProduct.status==="632479ee7819fc3aa0ac3f59" ? "Còn Hàng" : detailProduct.status==="63247a157819fc3aa0ac3f5a"
                            ?"Hết Hàng":"Sắp về"}</p>
                        <p>Giá bán: {detailProduct.discount>0 ? <del>{(detailProduct.price).toLocaleString("en")} VND/kg</del> : <span>{(detailProduct.price).toLocaleString("en")} VND/kg</span>}</p>
                        <p>Khuyến mãi: <span>{detailProduct.discount}%</span></p>
                        <p style={detailProduct.discount===0?{display:'none'}:{display:'block'}}>Giá giảm còn: <span>{((detailProduct.price/100)*(100-detailProduct.discount)).toLocaleString("en")} VND/kg</span></p>
                        <p>Xuất xứ: {detailProduct.description}</p>
                        <p>Đã bán: {sold}</p>
                        
                        {
                            detailProduct.status==="63247a157819fc3aa0ac3f5a"?<h3 style={{color:'#FF6600', marginTop:'15px'}}><i>Tạm hết hàng !</i></h3>
                            :
                            <Link to='#!' className="cart" onClick={() => addCart(detailProduct)}>THÊM VÀO GIỎ HÀNG</Link>
                        }

                        <div className="icon-share">
                            <Link to='#!'>
                                <img src={facebook} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={intagram} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={skype} alt=''></img>
                            </Link>
                            <Link to='#!'>
                                <img src={gmail} alt=''></img>
                            </Link>
                        </div>

                    </div>
                </div>

                <div className="review-pro">
                    <div className="btn-review">
                        <button onClick={ClickFocusDescription} style={!focusBtn?{backgroundColor: '#7ec522',color:'#fff'}
                            :{backgroundColor: '#fff', color:'#000'}}>Mô tả</button>
                        <button onClick={ClickFocusReview} style={focusBtn?{backgroundColor: '#7ec522',color:'#fff'}
                            :{backgroundColor: '#fff', color:'#000'}}>Đánh giá ()</button>
                    </div>

                    <div className="content-review">
                        <div className="content-description" style={focusBtn?{display:'none'}:{display:'block'}}>
                            <h3>Thông tin về {detailProduct.title}: </h3>
                            <br></br>
                            <p>{detailProduct.content}</p>                       
                        </div>
                        <div className="content-review-item" style={!focusBtn?{display:'none'}:{display:'block'}}>

                            <span>Đánh giá: 
                            <span onClick={()=>Star1(1)}>{starr1?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span> 
                            <span onClick={()=>Star2(2)}>{starr2?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star3(3)}>{starr3?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star4(4)}>{starr4?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            <span onClick={()=>Star5(5)}>{starr5?<img src={starYello} alt=''></img>:<img src={star} alt=''></img>}</span>
                            </span>
                            <br></br>
                            <br></br>
                        
                            <form>
                                <label htmlFor="content">Viết nhận xét:</label>
                                <textarea type="text" name="content" id="content" required value={review.content} rows={4}
                                    onChange={handleChangeInput} placeholder="Nhận xét..." />
                            </form>
                            <button onClick={createReview}>Đăng</button>
                        </div>

                    </div>

                    <div className="showComment">
                    <span>Các bình luận về sản phẩm:</span>
                        <div className="row-comment">
                            {
                                reviews.map((review, index) =>{
                                    if(review.product===params.id){
                                    return <div  key={review._id}>
                                                <span className="row-comment-item">
                                                    <div className="inf-user-comment">
                                                        <div>
                                                            <span className="name-comment">{review.username.slice(0,1)}</span>
                                                            <span>{review.username}</span> &nbsp;
                                                            <span style={{color:'#3366FF', fontSize:'14px'}}><i>{review.createdAt.slice(0,10)}</i></span>
                                                            <span className="star-in-comment">
                                                                {
                                                                    review.star===1 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    : 
                                                                    review.star===2 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===3 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===4 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :
                                                                    review.star===5 ? 
                                                                    <span>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                        <img src={starYello} alt=''></img>
                                                                    </span>
                                                                    :''
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="btn-delete-cmt" onClick={()=>deleteReview(review._id)} 
                                                                style={userId===review.user_id?{display:'block'}:{display:'none'}}>X</span>
                                                        </div>
                                                    </div>
                                                    <p>{review.content}</p>
                                                </span>
                                            </div>
                                    }
                                })
                            }
                        </div>
                    <p style={{marginTop:'20px'}}>Cuộn xuống để xem nhiều bình luận hơn!</p>
                    </div>
                </div>

                <div className="offer">
                    <div className="wrap-offer">
                        <div className="line-offer"></div>
                        <p className="title-offer">SẢN PHẨM ĐỀ XUẤT</p>
                    </div>

                    <div className="products">
                        {
                            products.map((product, index) =>{
                                if(product._id!==params.id && index<=3){
                                    return <Productitem key={product._id} product={product} />
                                }
                            })
                        }
                    </div>
                </div>

                <Link to='#!' className={btnBackTop?"head-page":""} onClick={scroll}>
                    <img src={UpHeadPage} alt="" width="15" />
                </Link>
            </div>
        </>
    )
}