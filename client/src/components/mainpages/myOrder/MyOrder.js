import React, {useState, useContext, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import user from '../../header/icon/user-solid.svg'
import axios from 'axios'

export default function MyOrder() {
    const state = useContext( GlobalState)
    const [token] = state.token
    const [myOrder] = state.orderAPI.myOrder
    const [ship] = useState(30000)
    const [statusOrder] = state.statusOrderAPI.statusOrder
    const [username] = state.userAPI.user
    const [userId] = state.userAPI.user_id
    const [clients] = state.inforClientAPI.inforClient
    const [detail, setDetail] = useState(false)
    const [idOrder, setIdOrder] = useState('')
    const [callback, setcallback] = state.orderAPI.callback
    const [notify] = state.notifyAPI.notify

    //xử lý truyền id của đơn hàng để xem chi tiết đơn hàng
    const DetailMyOrder = (id_Odrder) =>{
        setDetail(true)
        setIdOrder(id_Odrder)
    }

    // xử lý quay lại trang đơn hàng của tôi
    const BackToMyOrder = () =>{
        setDetail(false)
    }

    // xử lý hủy đơn hàng
    const CancelOrder = async (id) =>{
        var a = '632878eca2e7052bc439f97a'
        if(window.confirm("Bạn muốn hủy đơn hàng này?"))
        try {
            await axios.patch(`/api/order/${id}`, {status_order: a}, {
                headers: {Authorization: token}
            })
            setcallback(!callback)
            alert('Đã hủy đơn hàng!')
            cancelOrder()
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý thông báo khi hủy đơn hàng
    const cancelOrder = ()=>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_cancelorder/${'635cd52464f5b7334c594007'}`, {cancelOrder: el.cancelOrder+1}, {
                    headers: {Authorization: token}
                })
            })
            localStorage.setItem('reload', true)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // tự động reload trang khi tìm thấy item 'reload' trong localStorage
    useEffect(()=>{
        if(localStorage.getItem('reload')){
            window.location.reload()
            localStorage.removeItem('reload')
        }
    })

    return (
        <div className="container-myOrder">
            <div className="crumb">
                <Link to='/' className="crumb-homepage">
                    <img src={Home} alt=''></img>
                    <span>Trang chủ</span>
                </Link>
                <img src={Next} alt=''></img>
                <span className="crumb-name">Đơn hàng của tôi</span>
            </div>

            <div className="wrap-myorder">
                <div className="inf-client">
                    <h4>Thông tin tài khoản</h4>
                    <div className="inf-icon-client">
                        <img src={user} alt=''></img>
                        <span>{username}</span>
                    </div>
                    {
                        clients.map(client=>{
                            if(client.user_id===userId){
                                return  <div key={client._id} className="item-inf-client">
                                            <p><span>Khách hàng:</span> {client.name_client}</p>
                                            <p><span>SĐT:</span> {client.phone}</p>
                                            <p><span>Email:</span> {client.email}</p>
                                            <p><span>Địa chỉ:</span> {client.address}</p>
                                        </div>
                            }
                        })
                    }
                    <Link to='/updateinforclient'>Chỉnh sửa thông tin</Link>
                </div>

                <div className="element-order" style={detail?{display:'none'}:{display:'block'}} >
                    <h4>Đơn hàng của tôi</h4>
                    <p>(Bấm vào đơn hàng để xem chi tiết)</p>
                    <hr></hr>
                    <table>
                        <tbody>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Tên người nhận</th>
                                <th>Ngày đặt hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                            {
                                myOrder.map((myor, index) =>{
                                    return <tr key={myor._id} className="row-table-myor" onClick={()=>DetailMyOrder(myor._id)}>
                                                <td>{index+1}</td>
                                                <td>{myor._id}</td>
                                                <td>{myor.name_client}</td>
                                                <td>{myor.createdAt.slice(0,10)}</td>
                                                {
                                                    myor.total===0 ? <td>{(myor.product.reduce((prev, item) =>{
                                                        return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                    },0)+ship).toLocaleString("en")} VNĐ</td>
                                                    :
                                                    <td>{myor.total.toLocaleString("en")} VNĐ</td>
                                                }
                                                
                                                {
                                                    statusOrder.map(el => {
                                                        if(myor.status_order===el._id){
                                                            return <td style={el.name==='Chờ giao'?{color:'red'}:el.name==='Đang giao'
                                                            ?{color:'#0066FF'}:el.name==='Đã giao'?{color:'#00CC00'}
                                                            :{color:'#aaa'}} key={el._id}>{el.name}</td>
                                                        }
                                                    })
                                                }
                                                                            
                                            </tr> 
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="detail-myorder element-order" style={detail?{display:'block'}:{display:'none'}}>
                    <div>
                        <h4>Thông tin chi tiết đơn hàng</h4>
                        <p>Dự kiến giao: 1 - 2 ngày kể từ ngày đặt hàng</p>
                    </div>
                    {
                        myOrder.map(myo=>{
                            if(myo._id===idOrder&&myo.status_order==="6328789da2e7052bc439f977"){
                                return <span key={myo._id} className="btn-cancel-ord" onClick={()=>CancelOrder(myo._id)}>Hủy đơn hàng</span>
                            }
                        })
                    }
                    <button onClick={BackToMyOrder} className="btn-back-to-ord">Quay lại</button>
                    <hr></hr>
                    {
                        myOrder.map(myor =>{
                            if(idOrder===myor._id){
                            return  <div key={myor._id} className="detail-Order">
                                        <p><span>Đơn hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{myor._id}
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

                                        <p><span>Ngày đặt:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;{myor.createdAt.slice(0,10)}
                                        </p>

                                        <p><span>Tên người nhận:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;{myor.name_client}
                                        </p>

                                        <p><span>Điện thoại:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;{myor.phone}
                                        </p>

                                        <p><span>Địa chỉ nhận hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{myor.address}</p>

                                        <p><span>Tạm tính: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {
                                                (myor.product.reduce((prev, item) =>{
                                                    return prev + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)).toLocaleString("en")
                                            } VNĐ
                                        </p>

                                        {
                                            myor.total===0 ? '': 
                                            <p><span>Mã khuyến mãi: </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {
                                                    ((myor.total - ship)*100/(myor.product.reduce((prev, item) =>{
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
                                            },0)+ship).toLocaleString("en")} VNĐ &nbsp;(Đã bao gồm các hình thức khuyến mãi)</p>
                                            :
                                            <p><span>Tổng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {myor.total.toLocaleString("en")} VNĐ &nbsp;(Đã bao gồm các hình thức khuyến mãi)
                                            </p>
                                        }

                                        <p><span>Ghi chú: </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {myor.note}
                                        </p>
                                        <hr></hr>

                                        <h5>Sản phẩm</h5>
                                        {myor.product.map(pro =>{
                                            return  <table key={pro._id}>
                                                        <tbody>
                                                            <tr>
                                                                <td><img src={pro.images.url}></img></td>
                                                                <td>{pro.product_id}</td>
                                                                <td>{pro.title}</td>
                                                                <td>{((pro.price/100)*(100-pro.discount)).toLocaleString("en")} VNĐ</td>
                                                                <td>Số lượng: {pro.quantity}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                            })
                                        }
                                    </div>
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}
