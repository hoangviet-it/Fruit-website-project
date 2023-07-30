import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'

export default function CategoryManagement() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [token] = state.token
    var [name, setName] = useState('')
    const [onEdit, setOnEdit] = useState(false)
    const [idCategory, setIdcategory] = useState('')
    const [callback, setCallback] = state.categoriesAPI.callback

    // hiện form cập nhật
    const btnUpdate =(id)=>{
        setOnEdit(true)
        setIdcategory(id)
    }

    // đóng form cập nhật
    const CloseUpdate =()=>{
        setOnEdit(false)
    }

    // xử lý thêm vào cập nhật thể loại
    const handleSubmit = async ()=>{
        try {
            if(onEdit){
                const res = await axios.put(`api/category/${idCategory}`, {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback(!callback)
            }
            else {
                const res = await axios.post('api/category', {name: name}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
                setName('')
                setCallback(!callback)
            }

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // lấy id khi click vào nút xóa
    const btnDelete = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try{
            const res = await axios.delete(`/api/category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setOnEdit(false)
            
        } catch(err){
            alert(err.response.data.msg)
        }
    }

return (
    <>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad">QUẢN LÝ THỂ LOẠI</div>
        </div>

        <h6 style={{marginLeft:'20px', marginTop:'10px'}}><span>Số lượng: </span>{categories.length} thể loại</h6>
        
        <div className="container-category-mana-ad">
            <div className="table-cate-pro-ad">
                <h5 className="tt-sta-pro-ad">Danh mục thể loại sản phẩm</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Tên thể loại</th>
                            <th>Ngày tạo</th>
                            <th>Tùy chỉnh</th>
                        </tr>
                        {
                            categories.map((cate, index)=>{
                                return <tr key={cate._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td>{index+1}</td>
                                    <td>{cate.name}</td>
                                    <td>{cate.createdAt.slice(0,10)}</td>
                                    <td>
                                        <span><img onClick={()=>btnUpdate(cate._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                        <span><img onClick={()=>btnDelete(cate._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="form-create-cate-ad">
                {
                    onEdit?<h5>Cập nhật thể loại</h5>:<h5>Thêm thể loại</h5>
                }
                {   
                    onEdit?
                    categories.map(cate=>{
                        if(cate._id===idCategory){
                            return <p><span style={{fontWeight:'500', marginTop:'10px', display:'inline-block'}}>Tên thể loại: </span> &nbsp;{cate.name}</p>
                        }
                    }):''
                }
                <input type="text" name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Nhập tên mới..." />
                <br></br>
                <span className="btn-cre-and-upd-ad-cate" onClick={handleSubmit}>{onEdit?"Cập nhật":"Thêm"}</span>
                <br/>
                <span className="btn-close-udate-cate-ad" onClick={CloseUpdate} style={onEdit?{display:'inline-block'}:{display:'none'}}>Hủy</span>
            </div>
        </div>

    </>
  )
}
