
const Products = require('../models/productModel')


// filter, sort, paginating
class APIfeatures {
    constructor (query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    // Lọc dữ liệu theo thuộc tính = giá trị
    filtering(){
        const queryObj = {...this.queryString}
        console.log({before: queryObj})
        const excludedFields = ['page', 'sort', 'limit']    // mảng (loại trừ các giá trị này)
        excludedFields.forEach(el => delete(queryObj[el]))      // duyệt qua mảng và xóa các giá trị trên query có trong mảng
       
        console.log({after: queryObj})

        let queryStr = JSON.stringify(queryObj)
        // console.log({queryObj, queryStr})

        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        console.log({queryStr})

        // gte : lớn hơn hoặc bằng (theo giá)
        // lte : nhỏ hơn hoặc bằng (theo giá)
        // gt : lớn hơn (theo giá)
        // lt : nhỏ hơn (theo giá)
        // regex : theo ký tự bất kỳ (theo thuộc tính kiểu chuổi ký tự)

        this.query.find(JSON.parse(queryStr))


        return this;
    }

    // Sắp xếp dữ liệu theo tên thuộc tính
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')       // tách ngay dấu phẩy và thay bằng khoẳng trắng
            console.log(sortBy)
            this.query =  this.query.sort(sortBy)

        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
    
    // phân trang
    paginating(){
        const page = this.queryString.page * 1 || 1         // số trang
        const limit = this.queryString.limit * 1 //|| 9     // giới hạn trong 1 trang
        const skip = (page - 1) * limit;                    // bước nhảy (bỏ qua phần tử ở trang đầu)

        this.query = this.query.skip(skip).limit(limit)     
        // skip(): bỏ qua số phần tử đầu, limit(): lưu số phần tử đầu tiếp theo sao khi skip bỏ qua

        return this;
    }
}

// controller of product
const productCtrl = {

    getProducts: async (req, res) =>{
        try {
            //console.log(req.query)

            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status: 'thành công',
                result: products.length,
                products: products
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createProduct: async (req, res) =>{
        try {
            const {product_id, title, price, description, content, images, category, status} = req.body;
            if(!images) return res.status(400).json({msg: "Chưa thêm hình ảnh.!"})

            if(title==='') return res.status(400).json({msg: "Chưa nhập tên sản phẩm."})
            if(price==='') return res.status(400).json({msg: "Chưa nhập giá."})
            if(description==='') return res.status(400).json({msg: "Chưa thêm xuất xứ sản phẩm."})
            if(content==='') return res.status(400).json({msg: "Chưa thêm mô tả sản phẩm."})
            if(category==='') return res.status(400).json({msg: "Chưa chọn thể loại."})
            if(status==='') return res.status(400).json({msg: "Chưa thêm trạng thái."})
            
            const product = await Products.findOne({product_id})
            if(product) return res.status(400).json({msg: "Sản phẩm này đã tồn tại (bị trùng product_id)."})

            const newProduct = new Products({product_id, title: title.toLowerCase(), price, description, content, images, category, status})
            await  newProduct.save()

            res.json({msg: "Đã thêm 1 sản phẩm mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async (req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateProduct: async (req, res) =>{
        try {
            const {title, price, description, content, images, category, status, discount} = req.body;
            if(!images) return res.status(400).json({msg: "Chưa thêm hình ảnh.!"})

            await Products.findOneAndUpdate({_id: req.params.id}, {title: title.toLowerCase(), price, description, content, images, category, status, discount})

            res.json({msg: "cập nhật thành công.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = productCtrl