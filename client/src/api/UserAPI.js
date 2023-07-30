import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Productitem from '../components/mainpages/utils/productitem/Productitem'

export default function UserAPI(token) {
    const [users, setUssers] = useState([])
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [user, setUser] = useState([])
    const [user_id, setUserId] = useState([])
    const [callback, setCallback] = useState(false)
    const [dissable, setDissable] = useState(false)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)

    useEffect(() => {
        if(token){
            const getUser = async () =>{
                try{
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)
                    setUser(res.data.name)
                    setUserId(res.data._id)
                    setDissable(res.data.dissable)
                    
                } 
                catch (err){
                    alert(err.response.data.msg)
                }
            }
            getUser()
        }      
    },[token])

    const addCart = async (product) =>{
        if(!isLogged) return alert("Hãy đăng nhập hoặc tạo tài khoản để tiếp tục mua hàng !")

        const check = cart.every(item =>{
            return item._id !== product._id
        })

        if(check){
            setCart([...cart, {...product, quantity: 1}])
            
            await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1}]},{
                headers: {Authorization: token}
            })
            alert("Đã thêm vào giỏ hàng.")
        } 
        else{
            alert("Sản phẩm này đã có trong giỏ hàng.")
        }
    }

    useEffect(() => {
        const readUser = async () =>{
            try{
                const res = await axios.get(`/user/readuser?limit=${page*10}&name[regex]=${search}`)
                setUssers(res.data.users)
                setResult(res.data.result)               
            } 
            catch (err){
                alert(err.response.data.msg)
            }
        }
        readUser()   
    },[callback, search, page])

  return {
      users: [users, setUssers],
      page: [page, setPage],
      result: [result, setResult],
      isLogged: [isLogged, setIsLogged],
      isAdmin: [isAdmin, setIsAdmin],
      cart: [cart, setCart],
      user: [user, setUser],
      user_id: [user_id, setUserId],
      addCart: addCart,
      callback: [callback, setCallback],
      dissable: [dissable, setDissable],
      search: [search, setSearch]
  }
}