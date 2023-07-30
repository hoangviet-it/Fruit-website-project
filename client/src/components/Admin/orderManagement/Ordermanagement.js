import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMore from '../../Admin/utilAdmin/LoadMore'
import iconUpdate from '../../header/icon/icon-update.svg'
import iconDelete from '../../header/icon/icon-delete.svg'
import Loading from '../../mainpages/utils/loading/Loading'

const statusDefault = {
    status_order: ''
}

export default function Ordermanagement() {
    const state = useContext(GlobalState)
    const [order, setOrder] = useState(statusDefault)
    const [orders] = state.orderAPI.order
    const [statusOrder] = state.statusOrderAPI.statusOrder
    const [token] = state.token
    const [id_Order, setId_Order] = useState('')
    const [showInputUpdate, setShowInputUpdate] = useState(false)
    const [callback, setCallback] = state.orderAPI.callback
    const [status, setStatus] = state.orderAPI.status
    const [idOrder, setIdOrder] = useState('')
    const [showDetail, setShowDetail] = useState(false)
    const [search, setSearch] = state.orderAPI.search
    const [notify] = state.notifyAPI.notify
    const [newNotify, setNewNotify] = useState(0)

    // lấy data của newOrder trong db Notify
    useEffect(()=>{
        const tickNewOrder = ()=>{
            notify.forEach(el=>{
                if(el._id==="635cd52464f5b7334c594007"){
                    setNewNotify(el.newOrder)
                }
            })
        }
        tickNewOrder()
    })

    // xóa đơn hàng
    const deleteOrder = async (id) =>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            const res = await axios.delete(`api/order/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // láy id khi click vào đơn hàng
    const handleUpdateOrder = (id)=>{
        setId_Order(id)
        setShowInputUpdate(true)
    }

    const handelInputUpdate = e =>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
    }

    // cập nhật đơn hàng
    const updateOrder = async ()=> {
        try {
            const res = await axios.patch(`api/order/${id_Order}`, {...order}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
            setShowInputUpdate(false)
            setOrder(statusDefault)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // đóng input cập nhật trạng thái
    const closeUpdate = ()=>{
        setShowInputUpdate(false)
    }

    // láy id đơn hàng khi nhấp vào dòng đơn hàng
    const DetailOrder = (id)=>{
        setIdOrder(id)
        setShowDetail(true)
    }

    // ẩn detail
    const BackToOrder = ()=>{
        setShowDetail(false)
        setShowInputUpdate(false)
    }


return (
    <div className={showInputUpdate?"bg-disa-black":""}>
        <div className="createPro-and-title">
            <h5>QUẢN LÝ ĐƠN HÀNG</h5>
            <div className="filter-status-ord-ad">
                <span style={{fontWeight:'600'}}>Lọc theo trạng thái: </span>
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                    <option value={''}>Tất cả</option>
                    {
                        statusOrder.map(sta=>{
                            return <option key={sta._id} value={`status_order=${sta._id}`}>{sta.name}</option>
                        })
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Nhập tên người nhận . . ." 
            onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="container-ord-mana-ad" style={!showDetail?{display:'block'}:{display:'none'}}>
            <p className="note-mana-ord"><i>(Bấm vào đơn hàng để xem chi tiết)</i></p>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Tên người nhận</th>
                        <th>Tổng tiền</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th className="setting-pro-mana-table">Tùy chỉnh</th>
                    </tr>
                    {
                        orders.map((ord, index)=>{
                            return <tr key={ord._id} className={newNotify===0?"row-table-ord-ad":(index+1)<=newNotify?"tickNewOrd row-table-ord-ad":"row-table-ord-ad"} 
                                        style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#FFF'}}>
                                <td onClick={()=>DetailOrder(ord._id)}>{index+1}</td>
                                <td onClick={()=>DetailOrder(ord._id)}>{ord._id}</td>
                                <td onClick={()=>DetailOrder(ord._id)}>{ord.name_client}</td>
                                    {
                                        ord.total===0 ? <td onClick={()=>DetailOrder(ord._id)}>{(ord.product.reduce((prev, item) =>{
                                            return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                        },0)+30000).toLocaleString("en")}đ</td>
                                        :
                                        <td onClick={()=>DetailOrder(ord._id)}>{ord.total.toLocaleString("en")}đ</td>
                                    }
                                <td onClick={()=>DetailOrder(ord._id)}>{ord.createdAt.slice(0,10)}</td>
                                {
                                    statusOrder.map(sta=>{
                                        if(sta._id===ord.status_order){
                                            return <td key={sta._id} onClick={()=>DetailOrder(ord._id)}>{sta.name}</td>
                                        }
                                    })
                                }
                                <td className="collum-table-mana-pro">
                                    <span><img onClick={()=>handleUpdateOrder(ord._id)} className="img-icon update-ic-mana" src={iconUpdate}></img></span>
                                    <span><img onClick={()=>deleteOrder(ord._id)} className="img-icon delete-ic-mana" src={iconDelete}></img></span>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <LoadMore />
        </div>

        <div className="detail-order-mana-ad" style={showDetail?{display:'block'}:{display:'none'}}>
            <div className="tt-and-btn-detail-upd-ad">
                <div>
                    <h4>Thông tin chi tiết đơn hàng</h4>
                    <p>Dự kiến giao: 1 - 2 ngày kể từ ngày đặt hàng</p>
                </div>
                <div>
                    <span onClick={()=>handleUpdateOrder(idOrder)} className="img-icon update-ic-mana update-sta-ord-ad">Cập nhật trạng thái</span>
                    <button onClick={BackToOrder} className="btn-back-to-ord">Quay lại</button>
                </div>
            </div>
            <hr></hr>
            {
                orders.map(myor =>{
                    if(idOrder===myor._id){
                    return  <div key={myor._id} className="detail-Order content-detail-ord-ad">
                                <div className="inf-detail-ord-ad">
                                    <p><span>Đơn hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{myor._id}
                                    </p>

                                    <p><span>Ngày đặt:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;{myor.createdAt.slice(0,10)}
                                    </p>

                                    {
                                        statusOrder.map(el => {
                                            if(myor.status_order===el._id){
                                                return <p key={el._id}><span>Trạng thái:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    &nbsp;&nbsp;&nbsp;&nbsp;{el.name}</p>
                                            }
                                        })
                                    }

                                    <p><span>Tài khoản đặt hàng:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {myor.user_name}
                                    </p>

                                    <p><span>Tên người nhận:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;{myor.name_client}
                                    </p>

                                    <p><span>Điện thoại:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;{myor.phone}
                                    </p>

                                    <p><span>Email: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {myor.email}</p>

                                    <p><span>Địa chỉ nhận hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{myor.address}</p>

                                    <p><span>Tạm tính: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            (myor.product.reduce((prev, item) =>{
                                                return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                            },0)).toLocaleString("en")
                                        }đ
                                    </p>

                                    {
                                        myor.total===0 ? '': 
                                        <p><span>Mã khuyến mãi: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {
                                                ((myor.total - 30000)*100/(myor.product.reduce((prev, item) =>{
                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)))-100
                                            }%
                                            &nbsp;(áp dụng trên số tiền tạm tính)
                                        </p>
                                    }

                                    <p><span>Phí giao hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30,000 VNĐ</p>
                                    
                                    {
                                        myor.total===0 ? <p><span>Tổng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {(myor.product.reduce((prev, item) =>{
                                            return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                        },0)+30000).toLocaleString("en")}đ &nbsp;(Đã bao gồm các hình thức khuyến mãi)</p>
                                        :
                                        <p><span>Tổng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {myor.total.toLocaleString("en")}đ &nbsp;(Đã bao gồm các hình thức khuyến mãi)
                                        </p>
                                    }

                                    <p><span>Ghi chú: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {myor.note}
                                    </p>
                                </div>

                                <div className="table-pro-detail-prrd-ad">
                                    <h5>Sản phẩm</h5>
                                    {myor.product.map(pro =>{
                                        return  <table key={pro._id}>
                                                    <tbody>
                                                        <tr>
                                                            <td><img src={pro.images.url}></img></td>
                                                            <td>{pro.product_id}</td>
                                                            <td>{pro.title}</td>
                                                            <td>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")}đ</td>
                                                            <td>Số lượng: {pro.quantity}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                        })
                                    }
                                </div>
                            </div>
                    }
                })
            }
        </div>

        <div className={showInputUpdate?"update-status-ord-ad":"close-update-status-ord-ad"}>
            <h5>Cập nhật trạng thái đơn hàng</h5>
            <span><span style={{fontWeight:'600'}}>Đơn hàng: </span>&nbsp;{id_Order}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <br/>
            <select value={order.status_order} name="status_order" onChange={handelInputUpdate}>
                <option>Chọn trạng thái</option>
                {
                    statusOrder.map(sta=>{
                        return <option key={sta._id} value={sta._id}>{sta.name}</option>
                    })
                }
            </select>
            <span onClick={updateOrder} className="btn-update-status-ord">Cập nhật</span><br/>
            <span onClick={closeUpdate} className="btn-close-update-sta-ord">Hủy</span>
        </div>
    </div>
  )
}
