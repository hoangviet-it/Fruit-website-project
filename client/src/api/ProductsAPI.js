import {useState, useEffect} from 'react'
import axios from 'axios'

export default function ProductsAPI() {
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [callback1, setCallback1] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [search1, setSearch1] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [productAll, setProductAll] = useState([])
    const [resultAll, setResultAll] = useState(0)
    const [cateDiscout, setCatediscount] = useState('')
    const [createProduct, setCreateProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)
    const [product_id, setProduct_id] = useState('')


    // lấy sản phẩm theo phân trang
    useEffect(() =>{
        const getProducts = async () =>{
            const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()
    },[callback, category, sort, search, page])


    // lấy tất cả sản phẩm trong database
    useEffect(() =>{
        const getProductsAll = async () =>{
            const res = await axios.get(`/api/products?${cateDiscout}&title[regex]=${search1}`)
            setProductAll(res.data.products)
            setResultAll(res.data.result)
        }
        getProductsAll()
    },[cateDiscout, callback1, search1])

    return {
        products: [products, setProducts],     // trả product theo phân trang (6sp/1page)
        callback: [callback, setCallback],
        callback1: [callback1, setCallback1],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        search1: [search1, setSearch1],
        page:  [page, setPage],
        result: [result, setResult],
        productAll: [productAll, setProductAll],     //tất cả product
        resultAll: [resultAll, setResultAll],
        cateDiscout: [cateDiscout, setCatediscount],
        createProduct: [createProduct, setCreateProduct],
        updateProduct: [updateProduct, setUpdateProduct],
        product_id: [product_id, setProduct_id]
    }
}