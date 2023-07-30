import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import BtnRender from './BtnRender'
import { GlobalState } from '../../../../GlobalState'

export default function Productitem({product, filter}) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart

    // set item localStorage cho chức năng thông báo đánh giá ở component DetailProduct
    const setItemLocalSto = ()=>{
        localStorage.setItem('reloadPage', true)
    }

    return (
        <>
            <div className="product_card" style={filter ? {display: 'none'} : {display: 'block'}}>
                <p className="p-link-detail-pro" onClick={setItemLocalSto}><Link to={`/detail/${product._id}`}><img src={product.images.url} alt="" /></Link></p>

                <div className="product_box">
                    <h4 title={product.title}>{product.title}</h4>
                    {
                        product.discount>0 ? 
                        <span>
                            <span>{((product.price/100)*(100-product.discount)).toLocaleString("en")} đ/kg</span>
                            <p style={{color: '#888'}}><del>{(product.price).toLocaleString("en")} đ/kg</del></p>
                        </span>
                        : <span>{(product.price).toLocaleString("en")} đ/kg</span>
                    }
                    {
                        product.discount>0 ? '' : <p className="description-pro">Xuất xứ: {product.description}</p>
                    }               
                </div>  
                {
                    product.discount>0?<div className="persent-number">-{product.discount}%</div>:''
                }
                {
                    product.status==="632879b1a2e7052bc439f97b"?<div className="notify-near-pro">Hàng sắp về</div>:''
                }
                {
                    product.status==="63247a157819fc3aa0ac3f5a"? <h5 style={{textAlign:'center',marginTop:'10px',color:'#FF6600'}}><i>Tạm hết hàng !</i></h5> 
                    :
                    product.status==="632879b1a2e7052bc439f97b"? <Link id="btn_buy" className="btn-pre-order" to='#!' onClick={() => addCart(product)}>ĐẶT TRƯỚC</Link>
                    :
                    <BtnRender product={product}/>
                }
            </div>

            <div className="product_card" style={filter ? {display: 'block'} : {display: 'none'}}>
                <p className="p-link-detail-pro" onClick={setItemLocalSto}><Link to={`/detail/${product._id}`}><img src={product.images.url} alt="" /></Link></p>

                <div className="product_box">
                    <h4 title={product.title}>{product.title}</h4>
                    {
                        product.discount>0 ? 
                        <span>
                            <span>{((product.price/100)*(100-product.discount)).toLocaleString("en")} đ/kg</span>
                            <p style={{color: '#888'}}><del>{(product.price).toLocaleString("en")} đ/kg</del></p>
                        </span>
                        : <span>{(product.price).toLocaleString("en")} đ/kg</span>
                    }     
                    {
                        product.discount>0 ? '' : <p className="description-pro">Xuất xứ: {product.description}</p>
                    }  
                </div>
                {
                    product.discount>0?<div className="persent-number">-{product.discount}%</div>:''
                }
                {
                    product.status==="632879b1a2e7052bc439f97b"?<div className="notify-near-pro">Hàng sắp về</div>:''
                }
                {
                    product.status==="63247a157819fc3aa0ac3f5a"? <h5 style={{textAlign:'center',marginTop:'10px',color:'#FF6600'}}><i>Tạm hết hàng !</i></h5> 
                    :
                    product.status==="632879b1a2e7052bc439f97b"? <Link id="btn_buy" className="btn-pre-order" to='#!' onClick={() => addCart(product)}>ĐẶT TRƯỚC</Link>
                    :
                    <BtnRender product={product}/>
                }
            </div>
        </> 
    )
}