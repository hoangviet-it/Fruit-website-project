import {useState, useEffect} from 'react'
import axios from 'axios'

export default function DiscountAPI() {
    const [inforClient, setInforClient] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getinforClient = async () =>{
            const res = await axios.get('/api/inforclient')
            setInforClient(res.data)
        }
        getinforClient()
    },[callback])

    return {
        inforClient: [inforClient, setInforClient],
        callback: [callback, setCallback]
    }
}
