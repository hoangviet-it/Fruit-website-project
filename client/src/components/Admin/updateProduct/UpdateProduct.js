import React, {useState, useContext, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../../mainpages/utils/loading/Loading'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: '',
    content: '',
    category: '',
    status: '',
    discount: '',
    _id: ''
}

export default function UpdateProduct() {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [catedories] = state.categoriesAPI.categories
    const [status] = state.statusAPI.status
    const [discounts] = state.discountAPI.discount
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    
    const [products] = state.productsAPI.products
    const [callback, setCallback] = state.productsAPI.callback
    const [updatePro, setupdatePro] = state.productsAPI.updateProduct
    const [product_id] = state.productsAPI.product_id

    useEffect(() =>{
        if(product_id){
            products.forEach(product =>{
                if(product._id === product_id){
                    setProduct(product)
                    setImages(product.images)
                }
            })
        }
        else{
            setProduct(initialState)
            setImages(false)
        }
    }, [product_id, products])

    const handleUpload = async e => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            const file = e.target.files[0]
           
            if(!file) return alert('File không tồn tại.')

            if(file.size>1024*1024) //1mb
                return alert('Kính thước file quá lớn.')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('File không đúng định dạng.')

            let formdata = new FormData()
            formdata.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formdata, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setImages(res.data)          

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () =>{
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setImages(false)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    // xử lý submit update
    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert('Bạn không phải Admin.')
            if(!images) return alert('Chưa thêm hình ảnh.')

            const res = await axios.put(`/api/products/${product._id}`, {...product, images}, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)

            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    // trở về trang quản lý sản phẩm
    const backToProManagement = ()=>{
        setupdatePro(!updatePro)
    }

  return (
    <>
    <div className="title-line-create-pro-ad">
        <div className="item-tt-line-cre-pro-ad item-ttline-update-pro-ad">Chỉnh sửa sản phẩm</div>
    </div>

    <div className="create_product">
        <div className="upload">
            <input type="file" name="file" id="file_up" onChange={handleUpload} />
            {
                loading ? <div id="file_img"><Loading/></div>
                :<div id="file_img" style={styleUpload}>
                    <img src={images ? images.url: ''} alt="" />
                    <span onClick={handleDestroy}>X</span>
                </div>
            }

            <div className="btn-form-create-pro-ad">
                <span className="btn-back-pro" onClick={backToProManagement}>Trở về</span>
                <button className="btn-create-pro btn-update-pro" onClick={handleSubmit}>Cập nhật</button>
            </div>
        </div>

        <div className="form-create">
            <div className="row">
                <span>
                    <label className="label-create" htmlFor="product_id">Mã sản phẩm</label>
                    <input type="text" name="product_id" id="product_id" required value={product.product_id} 
                    onChange={handleChangeInput} disabled={true} />
                </span>
                <span>
                    <label className="label-create" htmlFor="title">Tên sản phẩm</label>
                    <input type="text" name="title" id="title" required value={product.title}
                    onChange={handleChangeInput} />
                </span>
            </div>

            <div className="row">
                <span>
                    <label className="label-create" htmlFor="price">Giá</label>
                    <input type="number" name="price" id="price" required value={product.price}
                    onChange={handleChangeInput} />
                </span>
                <span>
                    <label className="label-create" htmlFor="discount">Khuyến mãi</label>
                    <select name="discount" value={product.discount} onChange={handleChangeInput}>
                        <option value="">Không</option>
                        {
                            discounts.map(discount =>(
                                <option value={discount.persent} key={discount._id}>
                                    {discount.name}
                                </option>
                            ))
                        }
                    </select>     
                </span>

                <div className="row-origin">
                    <span>
                        <label className="label-create label-origin" htmlFor="description">Xuất xứ</label><br></br>
                        <input type="text" name="description" id="description" required value={product.description} rows="5"
                        onChange={handleChangeInput} />
                    </span>
                    <span>
                        <label className="label-create label-origin" htmlFor="category">Thể loại: </label>&nbsp;
                        <select className="select-cre-pro-ad" name="category" value={product.category} onChange={handleChangeInput}>
                            <option value="">Chọn thể loại</option>
                            {
                                catedories.map(category =>(
                                    <option value={category._id} key={category._id}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        </select>     
                    </span>
                </div>
            </div>

            <div className="row">
                <span>
                    <label className="label-create" htmlFor="status">Trạng thái: </label>
                    <select className="select-cre-pro-ad" name="status" value={product.status} onChange={handleChangeInput}>
                        <option value="">Chọn Trạng thái</option>
                        {
                            status.map(statuss =>(
                                <option value={statuss._id} key={statuss._id}>
                                    {statuss.name}
                                </option>
                            ))
                        }
                    </select>   
                </span>
            </div>

            <div className="row">
                <label className="label-create" htmlFor="content">Mô tả</label>
                <textarea type="text" name="content" id="content" required value={product.content} rows="7"
                onChange={handleChangeInput} />
            </div>
        </div>
    </div>
    </>
  )
}