import React, {useContext, useEffect, useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../../mainpages/utils/loading/Loading'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import UpdateProduct from '../updateProduct/UpdateProduct'

export default function ListProductDiscount() {
    const state = useContext(GlobalState)
    const [productsAll] = state.productsAPI.productAll
    const [categories] = state.categoriesAPI.categories
    const [status] = state.statusAPI.status
    const [category1, setCategory1] = state.productsAPI.cateDiscout
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [callback, setCallback] = state.productsAPI.callback
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [product_id, setProduct_id] = state.productsAPI.product_id
    const [amountProDisc, setAmountProDisc] = useState(0)
    const [search, setSearch] = state.productsAPI.search1

    // nút xóa sản phẩm
    const deleteProduct = async (id, public_id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            setLoading(true)
            await axios.post('/api/destroy', {public_id},{
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

    // nút cập nhật sản phẩm
    const updateProduct = (id)=> {
        setupdatePro(!updatePro)
        setProduct_id(id)
    }

    // số lượng sản phẩm đang khuyến mãi
    useEffect(()=>{
        var a=0
        productsAll.forEach(el=>{
            if(el.discount!==0){
                a++
            }
        })
        setAmountProDisc(a)
    })

  return (
        <>
            {
                updatePro ? <UpdateProduct/>
                :
                loading ? <div style={{marginTop:'150px'}}><Loading/></div>
                :
                <div className="container-promana list-pro-cont-ad">
                    <div className="createPro-and-title">
                            <h5>SẢN PHẨM KHUYẾN MÃI</h5>
                            <input type="text" value={search} placeholder="Nhập tên sản phẩm . . ." 
                                onChange={e=>setSearch(e.target.value.toLowerCase())} />
                            <span>
                                <span>Tìm theo thể loại: </span>
                                <select className="filter-pro-ad" value={category1} onChange={e=>setCategory1(e.target.value)}>
                                    <option value={''}>Tất cả</option>
                                    {
                                        categories.map(cate =>{
                                            return <option key={cate._id} value={`category=${cate._id}`}>{cate.name}</option>
                                        })
                                    }
                                </select>
                            </span>
                    </div>
                    <h6>Số lượng: {amountProDisc} sản phẩm</h6>
                    <table>
                        <tbody>
                            <tr>
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
                                    if(pro.discount!==0){
                                    return  <tr key={pro._id}>
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
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </>
  )
}
