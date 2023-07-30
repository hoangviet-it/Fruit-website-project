import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import LoadMore from '../../mainpages/products/LoadMore'
import LoadMoreUser from '../utilAdmin/LoadMoreUser'
import close from '../../header/icon/close.svg'

export default function ReportManagement() {
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [productAll] = state.productsAPI.productAll
    const [categories] = state.categoriesAPI.categories
    const [orders] = state.orderAPI.orderAll
    const [category, setCategory] = state.productsAPI.category
    const [searchPro, setSearchPro] = state.productsAPI.search
    const [users] = state.userAPI.users
    const [searchUser, setSearchUser] = state.userAPI.search
    const [showPageReport, setShowPageReport] = useState(1)
    const [active, setActive] = useState(false)
    const [search, setSearch] = useState('')
    const [amountOrder, setAmountOrder] = useState(0)
    const [amountProduct, setAmountProduct] = useState(0)
    const [turnover, setTurnover] = useState(0)
    const [totalPro, setTotalPro] = useState(0)
    const [totalShip, setTotalShip] = useState(0)
    const [reportOrder, setReportOrder] = useState([])
    const [reportPro, setRepotPro] = useState(false)
    const [idOrd, setIdOrd] = useState('')
    const [turnoverPro, setTurnoverPro] = useState(0)
    const [arrQuan, setArrQuan] = useState(0)
    const [price, setPrice] = useState(0)
    const [idPro, setIdPro] = useState('')
    const [idUser, setIdUser] = useState('')
    const [amountOrd, setAmountOrd] = useState(0)
    const [amProOrd, setAmProOrd] = useState(0)
    const [turnOverUser, setTurnOverUser] = useState(0)
    const [shipUser, setShipUser] = useState(0)
    const [temp, setTemp] = useState(0)


    // show page report theo phân loại
    const showClientPayed = (value)=>{
        setShowPageReport(value)
        setActive(true)
    }

    // xử lý các thông số doanh thu theo thời gian
    useEffect(()=>{
        // số lượng đơn hàng theo tháng
        var countOrder=0
        const checkDate = ()=>{
            orders.forEach(i=>{
                if(i.createdAt.slice(0,7)===search&&i.status_order==="632878dea2e7052bc439f979"){
                    countOrder++
                }
            })
        }
        checkDate()
        setAmountOrder(countOrder)

        // số lượng sản phẩm theo tháng
        var a=[]
        const amountPro = () =>{
            orders.forEach(i=>{
                if(i.createdAt.slice(0,7)===search&&i.status_order==="632878dea2e7052bc439f979"){
                    i.product.forEach(el=>{
                        a.push(el.quantity)
                    })
                }
            })
        }
        amountPro()
        setAmountProduct(a.reduce((pre, item)=>{
                return pre + item
            },0)
        )

        // số doanh thu theo tháng
        var t=0
        var b=[]
        var c=0
        const turnover = () =>{
            orders.forEach(i=>{
                if(i.createdAt.slice(0,7)===search&&i.status_order==="632878dea2e7052bc439f979"){
                    if(i.total===0){
                        i.product.forEach(el=>{
                            t=(((el.price/100)*(100-el.discount))*(el.quantity))
                            b.push(t)
                        })
                    }
                    else {
                        c++
                        t=i.total
                        b.push(t)
                    }
                }
            })
        }
        turnover()
        setTurnover(b.reduce((pre, item)=>{
            return pre + item
        },0)+((countOrder*30000)-(c*30000)))

        setTotalPro(b.reduce((pre, item)=>{
            return pre + item
        },0)-(c*30000))

        setTotalShip((countOrder*30000))
    })

    // xem chi tiết report đơn hàng
    const DetailReport = ()=>{
        var a=[]
        orders.forEach(i=>{
            if(i.createdAt.slice(0,7)===search&&i.status_order==="632878dea2e7052bc439f979"){
                a.push(i)
            }
        })
        setReportOrder(a)
    }

    // xem chi tiết report sản phẩm của đơn hàng
    const DetaiReportlPro = (id)=>{
        setIdOrd(id)
        setRepotPro(true)
    }

    // đóng chi tiết sản phẩm
    const closeDetailProRep = ()=>{
        setRepotPro(false)
    }

    // xử lý nút làm mới page thời gian
    const Refresh = ()=>{
        setSearch('')
        setReportOrder([])
    }
    
    //xử lý thông tin chi tiết thống kê theo sản phẩm
    const showSold = (id)=>{    //xử lý số lượng đã bán (có thể làm cho chi tiết sản phẩm client)
        setIdPro(id)
        var c=[]
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"){
                el.product.forEach(i=>{
                    if(i._id===id){
                        c.push(i.quantity)
                    }
                }) 
            }
        })
        setArrQuan(c.reduce((p,i)=>{
            return p+i
        },0))

        // tổng doanh thu sản phẩm
        var t=[]
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"){
                el.product.forEach(i=>{
                    if(i._id===id){
                        t.push(((i.price/100)*(100-i.discount))*(i.quantity))
                    }
                })
            }
        })
        setTurnoverPro(t.reduce((p,i)=>{
            return p + i
        },0))

        // giá bán sản phẩm
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"){
                el.product.forEach(i=>{
                    if(i._id===id){
                        setPrice((i.price/100)*(100-i.discount))
                    }
                })
            }
        })
    }

    // đóng chi tiết thống kê theo sản phẩm
    const hidenReportPro = ()=>{
        setIdPro('')
        setPrice(0)
        setIdUser('')
        setTurnOverUser(0)
    }

    // show detail report user
    const DetailReportUsser = (id) =>{
        setIdUser(id)

        // đếm số đơn hàng đã mua (status_order= đã giao) của user
        var a=0
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"&&el.user_id===id){
                a++
            }
        })
        setAmountOrd(a)

        // đếm tổng số lượng hàng trong tất cả đơn hàng (đã mua/đã giao) của user
        var b=[]
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"&&el.user_id===id){
                el.product.forEach(i=>{
                    b.push(i.quantity)
                })
            }
        })
        setAmProOrd(b.reduce((p,i)=>{
            return p + i
        },0))

        // tính tổng doanh thu theo user
        var c=[]
        var d=0
        orders.forEach(el=>{
            if(el.status_order==="632878dea2e7052bc439f979"&&el.user_id===id){
                if(el.total===0){
                    el.product.forEach(i=>{
                       c.push(((i.price/100)*(100-i.discount))*(i.quantity))
                    })
                }
                else {
                    d++
                    c.push(el.total)
                }
            }
        })
        setTemp(c.reduce((p,i)=>{
            return p + i
        },0))

        setShipUser(a*30000)

        setTurnOverUser(c.reduce((p,i)=>{
            return p + i
        },0)+((a*30000)-(d*30000)))
    }
    

return (
    <div className={reportPro||idPro!==""||idUser!==""?"bg-disabale-black":""}>
        <div className="title-line-create-pro-ad">
            <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">THỐNG KÊ DOANH THU</div>
        </div>

        <div className="btn-classify-user-ad btn-cate-report-ad">
            <button onClick={()=>showClientPayed(1)} style={active?{border:'1px solid #FF9900',borderRadius:'5px',padding:'5px 10px',color:'#000'}:{borderRadius:'5px',padding:'5px 10px',color:'#000',backgroundColor:'#FFCC00',boxShadow:'0px 0px 6px #aaa'}}>
                Thời gian</button>

            <button onClick={()=>showClientPayed(2)}>
                sản phẩm</button>

            <button onClick={()=>showClientPayed(3)}>
                Khách hàng</button>

            <input type="text" value={search} placeholder="Nhập thời gian cần tìm (vd: năm - tháng) . . ." 
                onChange={e=>setSearch(e.target.value)} style={showPageReport===1?{display:'inline'}:{display:'none'}} />
            
            <span className="btn-refresh-page-time" onClick={Refresh} style={showPageReport===1?{display:'inline'}:{display:'none'}}>Refresh</span>

            <span style={showPageReport===2?{display:'inline'}:{display:'none'}} className="setting-rep-pro">
                <span className="tt-cap-select-pro-rep">Lọc thể loại: </span>
                <select className="select-category-pro-rep" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option value={''}>Tất cả</option>
                    {
                        categories.map(cate=>{
                            return <option key={cate._id} value={`category=${cate._id}`}>{cate.name}</option>
                        })
                    }
                </select>
                <input type="text" value={searchPro} placeholder="Nhập tên sản phẩm . . ."
                onChange={e=>setSearchPro(e.target.value)} />
            </span>

            <input type="text" value={searchUser} placeholder="Nhập tên tài khoản . . ." 
                onChange={e=>setSearchUser(e.target.value)} style={showPageReport===3?{display:'inline'}:{display:'none'}} />
        </div>

        <div className="container-report-mana-ad" style={showPageReport===1?{display:'block'}:{display:'none'}}>
            <div className="table-cate-pro-ad table-report-ad">
                <h5 className="tt-sta-pro-ad">Thống kê doanh thu theo thời gian (tháng)</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>Thời gian</th>
                            <th>Số lượng đơn hàng</th>
                            <th>Tổng số lượng</th>
                            <th>Doanh thu</th>
                            <th>Tổng tiền hàng</th>
                            <th>Tổng tiền ship</th>
                            <th>Chi tiết</th>
                        </tr>
                        <tr>
                            <td>{search}</td>
                            <td>{amountOrder} đơn</td>
                            <td>{amountProduct} sản phẩm(kg)</td>
                            <td>{turnover.toLocaleString("en")} <u>đ</u></td>
                            <td>{totalPro.toLocaleString("en")} <u>đ</u></td>
                            <td>{totalShip.toLocaleString("en")} <u>đ</u></td>
                            <td>
                                {
                                    search===''?'':<span className="btn-see-detail-report" onClick={DetailReport}>Xem</span>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="detail-report-ord">
                <h5>Chi tiết các đơn hàng theo tháng</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Người đặt hàng</th>
                            <th>Tổng tiền</th>
                            <th>Chi tiết</th>
                        </tr>
                        {   
                            reportOrder.map((rep, index)=>{
                                return <tr key={rep._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td>{index+1}</td>
                                    <td>{rep._id}</td>
                                    <td>{rep.createdAt.slice(0,10)}</td>
                                    <td>{rep.name_client}</td>
                                    {
                                        rep.total===0 ?
                                        <td> 
                                            {
                                                (rep.product.reduce((pre,item)=>{
                                                    return pre + ((item.price/100)*(100-item.discount) * item.quantity)
                                                },0)+30000).toLocaleString("en") 
                                            } <u>đ</u>
                                        </td>
                                        : 
                                        <td>{rep.total.toLocaleString("en")} <u>đ</u></td>
                                    }
                                    <td><span className="btn-see-detail-report" onClick={()=>DetaiReportlPro(rep._id)}>Xem</span></td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className={!reportPro?"detail-pro-ord-report":"true-detail-pro-ord-report"}>
                <span className="close-table-pro-detail-rep" onClick={closeDetailProRep}><img src={close} alt=''></img></span>
                <h5>Chi tiết các sản phẩm</h5>
                <div className="ord-and-ship-inf-rep">
                    <table>
                        <tbody>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Mã tài khoản</th>
                                <th>Tên tài khoản</th>
                                <th>Phí vận chuyển</th>
                            </tr>
                            <tr>
                                <td>{idOrd}</td>
                                {
                                    orders.map(ord=>{
                                        if(ord._id===idOrd){
                                            return <>
                                                <td>{ord.user_id}</td>
                                                <td>{ord.user_name}</td>
                                            </>
                                        }
                                    })
                                }
                                <td>30,000 <u>đ</u></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                        </tr>
                        {
                            orders.map((ord, index)=>{
                                if(ord._id===idOrd){
                                    return ord.product.map(pro=>{
                                        return <tr key={pro._id}>
                                            <td>{<img className="img-pro-report-detail" src={pro.images.url} alt=''></img>}</td>
                                            <td>{pro.product_id}</td>
                                            <td>{pro.title}</td>
                                            {
                                                pro.discount===0?
                                                <td>{pro.price.toLocaleString("en")} <u>đ</u></td>
                                                :
                                                <td>
                                                    {((pro.price/100)*(100-pro.discount)).toLocaleString("en")} 
                                                    <u>đ</u><br/>
                                                    <del>{pro.price.toLocaleString("en")} <u>đ</u></del>
                                                </td>

                                            }
                                            <td>x {pro.quantity}</td>
                                        </tr>
                                    })
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

        <div className="container-report-pro-ad" style={showPageReport===2?{display:'block'}:{display:'none'}}>
            <div className="table-cate-pro-ad detail-report-ord">
                <h5 className="tt-sta-pro-ad">Thống kê doanh thu theo sản phẩm</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Thể loại</th>
                            <th>Chi tiết thống kê</th>
                        </tr>
                        {
                            products.map((pro, index)=>{
                                return <tr key={pro._id} style={(index+1)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                    <td>{index+1}</td>
                                    <td><img className="img-report-pro-ad" src={pro.images.url} alt=''></img></td>
                                    <td>{pro.product_id}</td>
                                    <td>{pro.title}</td>
                                    {
                                        categories.map(cate=>{
                                            if(cate._id===pro.category){
                                                return <td key={cate._id}>{cate.name}</td>
                                            }
                                        })
                                    }
                                    <td><span className="btn-see-detail-rep-pro" onClick={()=>showSold(pro._id)}>Xem</span></td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <br/>
                <LoadMore/>
                <br/>
            </div>

            <div className={idPro!==""?"table-report-pro-detail":"hiden-table-report-pro-detail"}>
                <span className="close-table-pro-detail-rep wrap-img-close-pro-dt-rep" onClick={hidenReportPro}><img className="img-close-dt-pro-rep" src={close} alt=''></img></span>
                <h5 className="tt-sta-pro-ad">Chi tiết thống kê</h5>
                <div className="inf-pro-detail-rep">
                    {
                        productAll.map(pro=>{
                            if(pro._id===idPro){
                                return <>
                                    <p><span style={{fontWeight:'500'}}>Mã sp: </span>{pro.product_id}</p>
                                    <p><span style={{fontWeight:'500'}}>Sản phẩm: </span>{pro.title}</p>
                                </>
                            }
                        })
                    }
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th>Giá bán</th>
                            <th>Số lượng đã bán</th>
                            <th>Tổng doanh thu</th>
                        </tr>
                        <tr style={{backgroundColor:'#FFFFCC'}}>
                            <td>{price.toLocaleString("en")} <u>đ</u></td>
                            <td>{arrQuan} sản phẩm (kg)</td>
                            <td>{turnoverPro.toLocaleString("en")} <u>đ</u></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div className="container-report-user-ad" style={showPageReport===3?{display:'block'}:{display:'none'}}>
            <div className="table-cate-pro-ad detail-report-ord table-rep-user">
                <h5 className="tt-sta-pro-ad">Thống kê doanh thu theo tài khoản</h5>
                <table>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th>Mã tài khoản</th>
                            <th>Tên tài khoản</th>
                            <th>Email</th>
                            <th>Chi tiết thống kê</th>
                        </tr>
                        {
                            users.map((user, index)=>{
                                if(user.role===0){
                                    return <tr key={user._id} style={(index)%2!==0?{backgroundColor:'#FFFFCC'}:{backgroundColor:'#fff'}}>
                                        <td>{index}</td>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><span className="btn-see-detail-rep-pro" onClick={()=>DetailReportUsser(user._id)}>Xem</span></td>
                                    </tr>
                                }
                            })
                        }
                    </tbody>
                </table>
                <LoadMoreUser/>
            </div>

            <div className={idUser!==""?"table-report-pro-detail table-rep-user-detail":"hiden-table-report-pro-detail"}>
                <span className="close-table-pro-detail-rep wrap-img-close-pro-dt-rep" onClick={hidenReportPro}><img className="img-close-dt-pro-rep" src={close} alt=''></img></span>
                <h5 className="tt-sta-pro-ad">Chi tiết thống kê</h5>
                {
                    users.map(user=>{
                        if(user._id===idUser){
                            return <div key={user._id} className="inf-pro-detail-rep">
                                <p><span style={{fontWeight:'500'}}>Mã tk: </span>{user._id}</p>
                                <p><span style={{fontWeight:'500'}}>Tài khoản: </span>{user.name}</p>
                            </div>
                        }
                    })
                }
                <table>
                    <tbody>
                        <tr>
                            <th>Tổng đơn hàng</th>
                            <th>Tổng số lượng hàng</th>
                            <th>Tổng tiền hàng</th>
                            <th>Tổng tiền ship</th>
                            <th>Tổng doanh thu</th>
                        </tr>
                        <tr style={{backgroundColor:'#FFFFCC'}}>
                            <td>{amountOrd} đơn</td>
                            <td>{amProOrd} sản phẩm (kg)</td>
                            <td>{temp.toLocaleString("en")} <u>đ</u></td>
                            <td>{shipUser.toLocaleString("en")} <u>đ</u></td>
                            <td>{turnOverUser.toLocaleString("en")} <u>đ</u></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
