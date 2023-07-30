import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

export default function UserClient() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [clients] = state.inforClientAPI.inforClient
    const [users] = state.userAPI.users
    const [userNotPay, setUserNotPay] = useState(false)
    const [userPayed, setUsserPayed] = useState([])
    const [ObjectId, setObjectId] = useState([])
    const [active, setActive] = useState(true)
    const [idUser, setIdUser] = useState('')
    const [formDetail, setFormDetail] = useState(false)
    const [callback, setCallback] = state.userAPI.callback
    const [search, setSearch] = state.userAPI.search
    const [lockBackgr, setLockbackgr] = useState(false)
    const [reviews] = state.reviewsAPI.review


    //show danh sách khách hàng chưa mua hàng
    const showClientNotPay = ()=>{
        setUserNotPay(true)
        setActive(!active)
    }

    const showClientPayed = ()=>{
        setUserNotPay(false)
        setActive(!active)
    }

    //xử lý lấy user id của tài khoản chưa mua hàng (ko có trog db inforClient)
    useEffect(()=>{
        const getIdNotPay = ()=>{
            var a = []
            users.forEach(el=>{
                return a.push(el._id)
            })
    
            var b = []
            clients.forEach(el=>{
                return b.push(el.user_id)
            })
    
            //setUsserPayed(Object.assign({}, userArray.filter(value => -1 === clientArray.indexOf(value))))
            setObjectId(a.filter(value => -1 === b.indexOf(value)))     // dữ liệu không trùng giữ 2 mảng ( =>tài khoản chưa mua hàng)
    
            var temporary=[]
            users.filter(el=>{
                return ObjectId.forEach((i)=>{
                    if(el._id===i){
                        temporary.push(el)
                    }
                })
            })
            setUsserPayed(temporary)
        }
        getIdNotPay()
    },[userNotPay])

    //lấy id user để show form chi tiết
    const showDetailUser = (id)=>{
        setIdUser(id)
        setFormDetail(true)
        setLockbackgr(true)
    }

    // đóng form detail user
    const closeDetail = ()=>{
        setFormDetail(false)
        setLockbackgr(false)
    }

    // cập nhật dissable vào db
    const dissableUser = async (id)=>{
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: true}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // cập nhật dissable = false mở khóa cho user
    const enableUser = async (id)=>{
        try {
            const res = await axios.patch(`user/dissableuser/${id}`, {dissable: false}, {
                headers: {Authorization: token}
            })
            alert("Đã mở khóa!")
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    // xóa user bị khóa
    const deleteUserDisa = async (id)=>{
        if(window.confirm("Bạn chắc chắn muốn xóa ?"))
        try {
            const res = await axios.delete(`user/deleteuser/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            deteleInforClient(id)
            deleteReview(id)
            setCallback(!callback)

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xóa thông tin khách hàng khi tài khoản bị xóa
    const deteleInforClient = (id)=>{
        try {
            clients.forEach(async el=>{
                if(el.user_id===id){
                    await axios.delete(`api/inforclient/${el._id}`, {
                        headers: {Authorization: token}
                    })
                }
            })

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }

    // xóa các đánh giá khi xóa tài khoản
    const deleteReview = (id)=>{
        try {
            reviews.filter(async rev=>{
                if(rev.user_id===id){
                    await axios.delete(`api/review/${rev._id}`, {
                        headers: {Authorization: token}
                    })
                }
            })

        } catch (err) {
            alert(err.reponse.data.msg)
        }
    }


return (
    <div className={lockBackgr?"wrap-mana-user":""}>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">QUẢN LÝ KHÁCH HÀNG</div>
        </div>

        <div className="btn-classify-user-ad">
            <button onClick={showClientPayed} style={active?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Đã mua hàng</button>
            <button onClick={showClientNotPay} style={!active?{backgroundColor:'#FFCC33',boxShadow:'0px 0px 6px #ccc', color:'#000'}:{backgroundColor:'#fff',boxShadow:'5px 5px 6px #ccc', color:'#7ec522'}}>
                Chưa mua hàng</button>
            <input type="text" value={search} placeholder="Nhập tên tài khoản . . ." 
                onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="container-user-mana-ad" style={userNotPay?{display:'none'}:{display:'block'}}>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Tên khách hàng</th>
                        <th>Email</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        users.map(user=>{
                            return  clients.map((client, index)=>{
                                if(user._id===client.user_id){
                                    return <tr key={client._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index+1}</td>
                                        <td>{client.user_id}</td>
                                        {
                                            users.map(user=>{
                                                if(client.user_id===user._id){
                                                    return <td key={user._id}>{user.name}</td>
                                                }
                                            })
                                        }
                                        <td>{client.name_client}</td>
                                        <td>{client.email}</td>
                                        <td>
                                            <span className="btn-see-detail" onClick={()=>showDetailUser(client.user_id)}>Chi tiết</span>
                                            {
                                                user._id===client.user_id&&user.dissable===true ? <>
                                                <span className="btn-see-detail btn-dissable" 
                                                    onClick={()=>enableUser(client.user_id)}>Mở khóa</span>
                                                <span className="btn-see-detail btn-delete-user-disa"
                                                    onClick={()=>deleteUserDisa(client.user_id)}>Xóa</span></>
                                                :
                                                <span className="btn-see-detail btn-dissable" 
                                                    onClick={()=>dissableUser(client.user_id)}>Khóa</span>
                                            }
                                        </td>
                                    </tr>
                                }
                            })
                        })
                    }
                </tbody>
            </table>
        </div>

        <div className="detail-user-mana-ad" style={formDetail?{top:'20vh', transition:'linear 0.3s'}:{top:'-100%', transition:'linear 0.3s'}}>
            <h5>Thông tin chi tiết khách hàng</h5>
            <hr/>
            {
                clients.map((client, index)=>{
                    if(idUser===client.user_id){
                        return <div key={client._id} className="item-detail-user-ad">
                            <p><span>Mã tài khoản:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.user_id}</p>
                            {
                                users.map(user=>{
                                    if(client.user_id===user._id){
                                        return <p key={user._id}><span>Tên tài khoản:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {user.name}</p>
                                    }
                                })
                            }
                            <p><span>Tên khách hàng:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.name_client}</p>
                            <p><span>Địa chỉ:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.address}</p>
                            <p><span>SĐT:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.phone}</p>
                            <p><span>Email:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.email}</p>
                            <p><span>Ngày tạo:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.createdAt.slice(0,10)}</p>
                            <p><span>Lượt đã mua:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {client.pays} đơn</p>
                        </div>
                    }
                })
            }
            <hr/>
            <span className="btn-form-detail" onClick={closeDetail}>Đóng</span>
        </div>

        <div className="table-user-payed" style={userNotPay?{display:'block'}:{display:'none'}}>
            <table>
                <tbody>
                    <tr>
                        <th>STT</th>
                        <th>Mã tài khoản</th>
                        <th>Tên tài khoản</th>
                        <th>Ngày tạo</th>
                        <th>Ghi chú</th>
                        <th>Tùy chỉnh</th>
                    </tr>
                    {
                        users.map((user)=>{
                            return  userPayed.map((up, index)=>{
                                    if(user._id===up._id&&user.role===0){
                                        return <tr key={up._id} style={(index)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                            <td>{index}</td>
                                            <td>{up._id}</td>
                                            <td>{up.name}</td>
                                            <td>{up.createdAt.slice(0,10)}</td>
                                            <td>Chưa có thông tin<br/>
                                                (chưa mua hàng)
                                            </td>
                                            <td>
                                                {                                              
                                                    user._id===up._id&&user.dissable===true ? 
                                                    <>
                                                        <span className="btn-see-detail btn-dissable" 
                                                            onClick={()=>enableUser(up._id)}>Mở khóa</span>
                                                        <span className="btn-see-detail btn-delete-user-disa"
                                                            onClick={()=>deleteUserDisa(up._id)}>Xóa</span>
                                                    </>
                                                    :
                                                    <span className="btn-see-detail btn-dissable" 
                                                        onClick={()=>dissableUser(up._id)}>Khóa</span>
                                                }
                                            </td>
                                        </tr>
                                    }
                            })
                        })
                    }
                        
                </tbody>
            </table>
        </div>
    </div>
  )
}
