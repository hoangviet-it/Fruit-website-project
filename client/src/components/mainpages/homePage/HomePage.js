import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productitem/Productitem'
import HeaderFixed from '../../header/HeaderFixed'
import image1 from '../../header/icon/slide1.jpg'
import image2 from '../../header/icon/slide2.jpg'
import image3 from '../../header/icon/slide3.jpg'
import UpHeadPage from '../../header/icon/up.svg'
import vegetable from '../../header/icon/vegetable.jpg'
import carot from '../../header/icon/carot.jpg'
import backgroundDiscount from '../../header/icon/img-discount.png'
import lockUser from '../../header/icon/user-lock.svg'
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
  
    const items = [
        {
        src: (image1),
        altText: 'HOANG VIET',
        caption: 'Chuyên các loại trái cây tươi ngon'
        },
        {
        src: (image2),
        altText: 'HOANG VIET',
        caption: 'Nơi các loại rau hội tựu'
        },
        {
        src: (image3),   
        altText: 'HOANG VIET',
        caption: 'Cung cấp đầy đủ củ quả nội ngoại'
        }
    ];

export default function HomePage() {
    const state = useContext(GlobalState)
    const [productsAll, setProductsAll] = state.productsAPI.productAll
    const [products, setProducts] = state.productsAPI.products
    const [discounts, setDiscount] = useState([])
    const [vegetableState, setVegetableState] = state.productsAPI.category
    const [users] = state.userAPI.users
    const [isLogged] = state.userAPI.isLogged
    const [idUser] = state.userAPI.user_id
    const [userDissable] = state.userAPI.dissable
    const [dissablee, setDissable] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [OnOffSlide, setOnOffSlide] = useState(0)
    const [OnOffDisc, setOnOffDisc] =useState(0)
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)
    

    // xử lý carousel
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
        <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.src}
        >
            <img src={item.src} alt={item.altText} />
            <CarouselCaption captionText={item.caption} captionHeader={item.altText} />
        </CarouselItem>
        );
    });

    // đưa sản phẩm khuyến mãi từ products vào mảng discount
    useEffect(() =>{
        const disC = productsAll.filter((pro) =>{
            return (pro.discount>0)
        })
        setDiscount(disC)
    }, [productsAll])

    // xử lý ẩn hiện nút back to top khi cuộn chuột và header fixed
    // check tại khoản bị khóa khi đăng nhập
    // lấy dữ liệu slide trong db notify
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

        const dissableUser = ()=>{
            if(isLogged&&userDissable===true){
                setDissable(true)
            }
            else {
                setDissable(false)
            }
        }
        dissableUser()

        const getData = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setOnOffSlide(el.slide)
                    setOnOffDisc(el.discount)
                }
            })
        }
        getData()
    })

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

    // xử lý hiển thị danh mục các loại rau khi chọn danh mục rau tại trang chủ
    const handleVegetable = () => {
        setVegetableState('category=6335a3fe6e46243300f74458')
    }

    // xử lý hiển thị danh mục các loại củ khi chọn danh mục rau tại trang chủ
    const handlecarot = () => {
        setVegetableState('category=6335a4096e46243300f74459')
    }

    // check tại khoản bị khóa khi đăng nhập
    // lấy dữ liệu slide trong db notify
    // useEffect(()=>{
    //     const dissableUser = ()=>{
    //         if(isLogged&&userDissable===true){
    //             setDissable(true)
    //         }
    //         else {
    //             setDissable(false)
    //         }
    //     }
    //     dissableUser()

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

    // nút quay lại form login khi bị khóa tài khoản
    const backFormlogin = async ()=>{
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/login";
    }

  return (
    <>
        {
            header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
        }
        <div className="user-dissabled" style={!dissablee?{display:'none'}:{display:'block'}}>
            <img src={lockUser} alt=''></img>
            <h3>Tài khoản của bạn đã bị khóa do vi phạm chính sách của cửa hàng.</h3>
            <span onClick={backFormlogin}>Quay lại</span>
        </div>

        <div className="container-homepage">

            <div className="section-slide" style={OnOffSlide===1?{display:'block'}:{display:'none'}}>
                <Carousel className="wrap-carousel" activeIndex={activeIndex} next={next} previous={previous}>
                    <CarouselIndicators className="item_crs" items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Carousel>
                <div className="opacity-slide"></div>
            </div>

            <div className="content-homepage">

                <div className="wrap-offer line-homepage">
                    <div className="line-offer"></div>
                    <p className="title-offer">MỚI NHẤT</p>
                </div>

                <div className="new-product-hp">
                    {
                        products.map((product, index) =>{
                            if(index<=3) {
                                return <ProductItem key={product._id} product={product}/>
                            }
                        })
                    }
                </div>

                <div className="category-homepage">
                    <div className="item-cate-home">
                        <div className="image-cate-home"><img src={vegetable} alt='' ></img></div>
                        <div className="floating-item">
                            <p className="title-cate-home">RAU SẠCH TƯƠI NGON</p>
                            <p className="description-cate-home">BỔ SUNG CHẤT DINH DƯỠNG MỖI NGÀY</p>
                            <Link to='/product' onClick={handleVegetable}>XEM NGAY</Link>
                        </div>
                    </div>
                    <div className="item-cate-home">
                        <div className="image-cate-home"><img src={carot} alt='' ></img></div>
                        <div className="floating-item">
                            <p className="title-cate-home">CÁC LOẠI CỦ BỔ DƯỠNG</p>
                            <p className="description-cate-home">GIAO HÀNG TRONG CHỚP MẮT</p>
                            <Link to='/product' onClick={handlecarot}>XEM NGAY</Link>
                        </div>
                    </div>
                </div>

                <div className="wrap-offer line-homepage">
                    <div className="line-offer"></div>
                    <p className="title-offer">KHUYẾN MÃI</p>
                </div>

                <div className="discount-product-hp">
                    {
                        discounts.map((discount, index) =>{
                            if(index<=3) {
                                return <ProductItem key={discount._id} product={discount}/>
                            }
                        })
                    }
                </div>

                <div className="bg-discount-home" style={OnOffDisc===1?{display:'block'}:{display:'none'}}>
                    <div className="bg-img"><img src={backgroundDiscount} alt=''></img></div>
                    <div className="content-discount-home">
                        <p className="title-disc-ct-home">RẤT NHIỀU SẢN PHẨM GIẢM MẠNH</p>
                        <p className="ct-persent-disc-home">Với các % ưu đãi cực lớn, 
                        nhanh tay đặt ngay nào !</p>
                        <Link to='/discountpage'>XEM NGAY</Link>
                    </div>
                </div>

            </div>

            <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
                <img src={UpHeadPage} alt="" width="15" />
            </Link>
        </div>
    </>
  )
}
