import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMore from '../../mainpages/products/LoadMore'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import Loading from '../../mainpages/utils/loading/Loading'
import CreateProduct from '../../mainpages/createProduct/CreateProduct'
import UpdateProduct from '../../Admin/updateProduct/UpdateProduct'

export default function ProductManagement() {
    const state = useContext(GlobalState)
    const [productsAll, setProductAll] = state.productsAPI.products
    const [categories, setCategories] = state.categoriesAPI.categories
    const [status, setStatus] = state.statusAPI.status
    const [category, setCategory] =state.productsAPI.category
    const [valueCategory, setValuecategory] = useState('')
    const [createProduct, setCreateProduct] = state.productsAPI.createProduct
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [callback, setCallback] = state.productsAPI.callback
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [product_id, setProduct_id] = state.productsAPI.product_id

    // show component thêm sản phẩm mới
    const ShowCreateProduct = () =>{
        setCreateProduct(!createProduct)
    }

    // xóa sản phẩm
    const deleteProduct = async (id, public_id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            setLoading(true)
            const ress = await axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })

            const res = await axios.delete(`/api/products/${id}`,{
                headers: {Authorization: token}
            })
            alert(res.data.msg)        
            setCallback(!callback)
            setLoading(false)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const updateProduct = (id)=> {
        setupdatePro(!updatePro)
        setProduct_id(id)
    }
    
return (
    <>
    {
        loading ? <div style={{marginTop:'150px'}}><Loading/></div>
        :
        <div className="container-promana">
            {
                createProduct ? <CreateProduct/>
                : updatePro ? <UpdateProduct/> 
                : 
            <div>
                <div className="createPro-and-title">
                    <h5>QUẢN LÝ SẢN PHẨM</h5>

                    <div className="element-create">
                        <span>Tìm theo trạng thái: </span>
                        <select className="filter-pro-ad" value={category} onChange={e=>setCategory(e.target.value)}>
                            <option value={''}>Tất cả</option>
                            {
                                status.map(sta =>{
                                    return <option key={sta._id} value={`status=${sta._id}`}>{sta.name}</option>
                                })
                            }
                        </select>

                        <span>Tìm theo thể loại: </span>
                        <select className="filter-pro-ad" value={category} onChange={e=>setCategory(e.target.value)}>
                            <option value={''}>Tất cả</option>
                            {
                                categories.map(cate =>{
                                    return <option key={cate._id} value={`category=${cate._id}`}>{cate.name}</option>
                                })
                            }
                        </select>
                        <p className="btn-create-pro-ad" onClick={ShowCreateProduct}>Thêm sản phẩm</p>
                    </div>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Khuyến mãi</th>
                            <th>Ngày tạo</th>
                            <th>Thể loại</th>
                            <th>Trạng thái</th>
                            <th className="setting-pro-mana-table">Tùy chỉnh</th>
                        </tr>
                        {
                            productsAll.map((pro, index) =>{
                                return <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td className="collum-table-mana-pro">{index+1}</td>
                                    <td className="collum-table-mana-pro img-pro-table"><img src={pro.images.url} alt=''></img></td>
                                    <td className="collum-table-mana-pro">{pro.product_id}</td>
                                    <td className="collum-table-mana-pro">{pro.title}</td>
                                    <td className="collum-table-mana-pro" style={{paddingTop:'20px'}}>
                                        {
                                            pro.discount>0 ? <p>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")}đ<br></br>
                                                <del>{pro.price.toLocaleString("en")}đ</del>
                                            </p>
                                            :<p>{pro.price.toLocaleString("en")}đ</p>
                                        }
                                    </td>
                                    <td className="collum-table-mana-pro" style={{paddingLeft:'30px'}}>{pro.discount}%</td>
                                    <td className="collum-table-mana-pro">{pro.createdAt.slice(0,10)}</td>
                                    {
                                        categories.map(cate =>{
                                            if(pro.category===cate._id){
                                                return <td key={cate._id} className="collum-table-mana-pro">{cate.name}</td>
                                            }
                                        })
                                    }

                                    {
                                        status.map(sta =>{
                                            if(pro.status===sta._id){
                                                return <td key={sta._id} className="collum-table-mana-pro">{sta.name}</td>
                                            }
                                        })
                                    }
                                    <td className="collum-table-mana-pro setting-pro-mana-table">
                                        <span><img onClick={()=>updateProduct(pro._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                        <span><img onClick={()=>deleteProduct(pro._id,pro.images.public_id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <br></br>
                <LoadMore/>
            </div>
            }
        </div>
    }
    </>
  )
}
