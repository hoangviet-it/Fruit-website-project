
import React, {useState, useContext, useEffect, isValidElement} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../utils/loading/Loading'
import { useHistory, useParams, Link } from 'react-router-dom'

const initialState = {
    email: '',
    address: '',
    phone: '',
    name_client: '',
    note: '',
    status_order: '',
    _id: ''
}

export default function CreateOrder() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [order, setOrder] = useState(initialState)
    const [cart, setCart] = state.userAPI.cart
    const [statusOrder] = state.statusOrderAPI.statusOrder
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [money, setMoney] = state.orderAPI.money
    const [ship, sstSShip] = useState(30000)
    const [code, setCode] = state.orderAPI.code
    const [discount] = state.discountAPI.discount
    const [checkDiscount, setCheckDiscount] = state.discountAPI.checkCodeDiscount
    const [callback, setCallback] = state.orderAPI.callback
    const [callback1, setCallback1] = state.inforClientAPI.callback
    const [inforClient] = state.inforClientAPI.inforClient
    const [user_id] = state.userAPI.user_id
    const [showInput, setShowInput] = useState(false)
    const [notify] = state.notifyAPI.notify
    const [discounts] = state.discountAPI.discount
    const [codeDiscount, setCodeDiscount] = state.orderAPI.code

    const history = useHistory()
    const param = useParams()

    const [disable, setDisable] = useState(false)
    const [onEdit, setOnEdit] = useState(false)

    // xử lý xóa dữ liệu trong giỏ hàng khi đã xác nhận đặt hàng
    useEffect(() =>{
        const updateCart = async () => {
            await axios.patch('/user/addcart', {cart}, {
                headers: {Authorization: token}
            })
        }
        updateCart()
    }, [cart])

    // khóa form không cho nhập liệu khi giỏ hàng đang rỗng
    useEffect(() =>{
        cart.length===0 ? setDisable(true) : setDisable(false)
    })

    // tính tổng tiền hàng
    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) =>{
                return prev + ((item.price/100)*(100-item.discount) * item.quantity)
            },0)

            setTotal(total)
        }
        getTotal()
    },[cart])

    // lấy dữ liệu từ input
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setOrder({...order, [name]:value})
    }

    // submit form thông tin khách hàng và thêm đơn hàng
    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            const res = await axios.post('/api/order', {...order, money}, {
                headers: {Authorization: token}
            })
            handleOrder()
            setCode('')
            setMoney(0)
            setCallback(!callback)
            postInforClient()
            updatePays()
            updateNotifyOrder()

        } catch (err) {
            alert(err.response.data.msg)
        }
        // setConfirm(true)
    }

    // chuyển dữ liệu từ giỏ hàng vào đơn hàng
    const handleOrder = async() => {
        try {
            const res = await axios.patch('/api/order', {cart}, {
                headers: {Authorization: token}
            })
            setCart([])
            setOrder(initialState)
            history.push("/cart")
            alert(res.data.msg)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý ẩn input khi tài khoản hiện tại đẵ mua hàng và có thông tin trong db infor_client
    useEffect(()=>{
        const handelInput = ()=>{
            inforClient.map(client=>{
                if(user_id===client.user_id){
                    setShowInput(true)
                }
            })
        }
        handelInput()
    })

    // thêm thông tin của khách hàng mới mua lần đầu vào db infor_client
    const postInforClient = async () =>{
        try {
            inforClient.forEach(async (client)=>{
                if(user_id!==client.user_id){
                    await axios.post('/api/inforclient', {...order}, {
                        headers: {Authorization: token}
                    })
                    setCallback1(!callback1)
                }
            })
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xử lý cập nhật số lần mua của khách hàng
    const updatePays = () =>{
        try {
            inforClient.forEach(async el=>{
                if(user_id===el.user_id){
                    await axios.patch('/api/inforclient', {pays: el.pays+1}, {
                        headers: {Authorization: token}
                    })
                }
            })
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // update newOder trong db Notify để hiển thị thông báo khi có đơn hàng mới
    const updateNotifyOrder = () =>{
        try {
            notify.forEach(async el=>{
                await axios.put(`/api/update_neworder/${'635cd52464f5b7334c594007'}`, {newOrder: el.newOrder+1}, {
                    headers: {Authorization: token}
                })
            })

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa item "reload" trong localStorage cho chức năng cập nhật thông báo đơn hàng mới
    useEffect(()=>{
        const reload = ()=>{
            const itemReload = localStorage.getItem('reload')
            if(itemReload){
                setLoading(true)
                window.location.reload()
                localStorage.removeItem('reload')
            }
        }
        reload()
    },[])

    // lấy dữ liệu từ input mã khuyến mãi
    const handleChangeInputDisc = e =>{
        const {value} = e.target
        setCodeDiscount(value)
    }

    // xử lý button áp dụng mã khuyến mãi
    const DiscountCode = () =>{
        discounts.forEach((item)=>{
            if(item.code===codeDiscount){
                setMoney((total/100)*(100-item.persent)+ship)
                setCheckDiscount(true)
                //setCodeDiscount('')
                alert("Áp dụng mã khuyến mãi thành công!")
            }
        })
    }

  return (
    
    loading ? <div style={{marginBottom:'150px'}}><Loading/></div>
    :
    <div className="container-order">
        <form onSubmit={handleSubmit}>
            <div className="wrap-btnUpdate">
                <h4>Thông tin của bạn:</h4>
                <Link to='/updateinforclient'>Chỉnh sửa thông tin</Link>
            </div>

            <div className="row-infor-order">
                <label htmlFor="name_client">Họ Tên<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="name_client" id="name_client" required 
                            value={order.name_client=client.name_client} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="name_client" id="name_client" required 
                value={order.name_client} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="address">Địa chỉ nhận hàng<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="address" id="address" required 
                            value={order.address=client.address} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="address" id="address" required 
                value={order.address} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="phone">Điện thoại<span> *</span></label><br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="text" name="phone" id="phone" required 
                            value={order.phone=client.phone} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="text" name="phone" id="phone" required 
                value={order.phone} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="email">Email<span> *</span></label> <br></br>
                {
                    inforClient.map((client)=>{
                        if(user_id===client.user_id){
                            return <input key={client._id} type="email" name="email" id="email" required 
                            value={order.email=client.email} onChange={handleChangeInput} disabled={true}/>
                        }
                    })
                }
                <input style={showInput?{display:'none'}:{display:'block'}} type="email" name="email" id="email" required 
                value={order.email} onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="row-infor-order">
                <label htmlFor="note">Ghi chú</label> <br></br>
                <textarea type="text" name="note" id="note" value={order.note} placeholder="Ghi chú về đơn hàng..." rows="7"
                onChange={handleChangeInput} disabled={disable}/>
            </div>

            <div className="tl-btn" style={onEdit?{display:'block'}:{display:'none'}}>
                <div className="row-infor-order">
                    <label htmlFor="status_order">Trạng thái</label>
                    <select name="status_order" value={order.status_order} onChange={handleChangeInput}>
                        <option value="">Chọn trạng thái</option>
                        {
                            statusOrder.map(statusOrder =>(
                                <option value={statusOrder._id} key={statusOrder._id}>
                                    {statusOrder.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>  
        </form>

        <div className="infor-pro-order">
            <h4>Đơn hàng của bạn:</h4>
            <p>Dự kiến: từ 1 - 2 ngày</p>
            <p className="tt-order-inf">Sản phẩm</p>
            <hr></hr>
            {
                cart.map(cart =>{
                    return  <div className="total-item-order" key={cart._id}>
                                <span className="title-pro-ord-inf">{cart.title} &nbsp;&nbsp; 
                                    <span className="multi">x</span>&nbsp;&nbsp; {cart.quantity}</span>
                                <span className="price-pro-ord-inf">
                                    {((cart.price/100)*(100-cart.discount)).toLocaleString("en")} <u>đ</u>/kg</span>
                            </div>
                })
            }
            <br></br>
            <div className="total-item-order">
                <p className="tt-order-inf">Tạm tính</p>
                <p>{total.toLocaleString("en")} <u>đ</u></p>
            </div>

            <div className="total-item-order">
                <p className="tt-order-inf">Mã khuyến mãi</p>
                {
                    discount.map(discount=>{
                        if(code===discount.code){
                            return <p key={discount._id} style={checkDiscount?{display:'inline'}:{display:'none'}}>-{discount.persent}%</p>
                        }
                    })
                }
            </div>
            <hr></hr>

            <div className="total-item-order">
                <p className="tt-order-inf">Phí giao hàng</p>
                <p>{ship.toLocaleString("en")} <u>đ</u></p>
            </div>
            <hr></hr>

            <div className="total-item-order">
                <p className="tt-order-inf">Tổng</p>
                <p className="money-ord">{money===0 ? (money+total+ship).toLocaleString("en") : money.toLocaleString("en")} <u>đ</u></p>
            </div>
            <p>(Đã bao gồm các hình thức khuyến mãi)</p>
            <hr></hr>
            <div className="wrap-code-item">
                <p>Nhập mã khuyến mãi (nếu có)</p>
                <div className="code-item">
                    <input type="text" name="code" id="code" value={codeDiscount}
                    onChange={handleChangeInputDisc} />
                    <span onClick={DiscountCode}>Áp dụng</span>
                    <p>(Chỉ áp dụng trên tiền hàng)</p>
                </div>
            </div>
            <hr></hr>
            <div className="pay-radio">
                <input type="radio" name="pay" />
                <span>Chuyển khoản trực tiếp</span>
            </div>
            <div className="pay-radio">
                <input type="radio" name="pay" defaultChecked={true} />
                <span>Thanh toán khi nhận hàng (COD)</span>
            </div>

            <button onClick={handleSubmit}>ĐẶT HÀNG</button> 
        </div>

        {/* <button onClick={handleOrder} style={confirm ? {display: 'block'} : {display: 'none'}}>Xác Nhận Đặt Hàng </button>  */}
    </div>
  )
}
