import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Productitem from '../utils/productitem/Productitem'
import LoadMore from '../products/LoadMore'
import Loading from '../utils/loading/Loading'
import CircleRight from '../../header/icon/circle-right.svg'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'

export default function DiscountPage() {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.productAll
    const [categories, setCategories] = state.categoriesAPI.categories
    const [category, setCategory] = state.productsAPI.cateDiscout
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)

    // show sản phẩm của tất cả thể loại
    const displayAllPro = () => {
        setCategory('')
    }

    // truyền id của category về db để get ra sản phẩm cùng loại
    const handleCategory = id =>{
        setCategory(id)
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
    <div className="container-discountpage">
        <div>
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Khuyến mãi</span>
            </div>

            <div className="list-cate-page-disc"> 
                <h3>DANH MỤC KHUYẾN MÃI</h3>
                <ul className="row-list-disc-page">
                    <li className="all item-cate-disc-page" onClick={displayAllPro}>Tất cả</li>
                    {
                        categories.map(category =>(
                            <li className="item-cate-disc-page" key={category._id} onClick={()=>handleCategory('category='+category._id)}>
                                {category.name}
                            </li>
                        ))
                    }
                </ul>
                
            </div>
        </div>

        <div className="wrap-card-pro-disc">
            <div className="card-pro-discountPage">
                {
                    products.map(pro =>{
                        if(pro.discount>0){
                            return <Productitem key={pro._id} product={pro} />
                        }
                    })
                }
            </div>
            {/* <LoadMore /> */}
            {products.length === 0 && <Loading/>}
        </div>
        <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
            <img src={UpHeadPage} alt="" width="15" />
        </Link>
    </div>
    </>
  )
}
