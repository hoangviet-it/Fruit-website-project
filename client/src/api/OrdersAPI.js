import {useState, useEffect} from 'react'
import axios from 'axios'

export default function OrdersAPI(token) {
    const [order, setOrder] = useState([])
    const [myOrder, setMyOrder] = useState([])
    const [money, setMoney] = useState(0)
    const [code, setCode] = useState('')
    const [callback, setCallback] = useState(false)
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [search, setSearch] = useState('')
    const [orderAll, setOrderAll] = useState([])
    const [resultAll, setResultAll] = useState(0)

    useEffect(() =>{
        const getOrder = async () =>{
            const res = await axios.get(`/api/order?limit=${page*9}&${status}&name_client[regex]=${search}`)
            setOrder(res.data.orders)
            setResult(res.data.result)
        }
        getOrder()
    },[callback, status, page, search])


    useEffect(() =>{
        const getOrderAll = async () =>{
            const res = await axios.get('/api/order')
            setOrderAll(res.data.orders)
            setResultAll(res.data.result)
        }
        getOrderAll()
    },[callback, status, page, search])
    

    useEffect(() =>{
        if(token){
            const getMyOrder = async () =>{
                try {
                    const res = await axios.get('/api/myorder', {
                        headers: {Authorization: token}
                    })
                    setMyOrder(res.data)

                } catch (err) {
                    alert(err.response.data.msg)
                }
                
            }
            getMyOrder()
        }
    },[token, callback])

    return {
        order: [order, setOrder],   //đơn hàng có phân trang
        money: [money, setMoney],
        code: [code, setCode],
        myOrder: [myOrder, setMyOrder],
        callback: [callback, setCallback],
        status: [status, setStatus],
        result: [result, setResult],
        page: [page, setPage],
        search: [search, setSearch],
        orderAll: [orderAll, setOrderAll], // tất cả đơn hàng
        resultAll: [resultAll, setResultAll]
    }
}
