const Orders = require('../models/orderModel')
const Users = require('../models/userModel')
const StatusOrder = require('../models/statusOrderModel')

class APIsort {
    constructor (query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

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

const orderCtrl = {
    getOrder: async (req, res) =>{
        try {
            const features = new APIsort(Orders.find(), req.query).sorting().filtering().paginating()
            const order = await features.query
            res.json({
                status: 'thành công',
                result: order.length,
                orders: order
            })
            
            // const order = await Orders.find()
            // res.json(order)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createOrder: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            //res.json(user.name)  // lấy data của user đang đăng nhập

            const statusOrder = await StatusOrder.findOne({name: 'Chờ giao'})
            const {email, address, phone, name_client, note, money} = req.body;

            if(name_client==='') return res.status(400).json({msg: "Chưa nhập tên người nhận."})
            
            if(address==='') return res.status(400).json({msg: "Chưa nhập địa chỉ nhận hàng."})
            
            if(phone==='') return res.status(400).json({msg: "Chưa nhập số điện thoại."})

            if(email==='') return res.status(400).json({msg: "Chưa nhập Email."})

            const exist = await Orders.findOne({user_id: req.user.id, product: []})
            if(exist) return res.status(400).json({msg: "Thông tin đơn hàng đã tồn tại.  Hãy \"XÁC NHẬN ĐẶT HÀNG\" để hoàn tất đặt hàng!"})

            const newOrder = new Orders({email, address, phone, name_client, note, status_order: statusOrder.id, user_id: req.user.id, user_name: user.name, total: money})
            await newOrder.save()

            res.json({msg: "Thông tin của bạn đã được tạo.  Nhấn \"XÁC NHẬN ĐẶT HÀNG\" để hoàn tất việc mua hàng !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateOrder: async (req, res) =>{
        try {
            const {status_order} = req.body;
            await Orders.findOneAndUpdate({_id: req.params.id}, {status_order})

            res.json({msg: "Đã cập nhật thành công 1 đơn hàng.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async (req, res) =>{
        try {
            await Orders.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    addDataProductOrder: async (req, res) =>{
        try{
            await Orders.findOneAndUpdate({product: [], user_id: req.user.id}, {
                product: req.body.cart
            })

            return res.json({msg: "Đặt hàng thành công!   Bạn có thể theo dõi đơn hàng tại \"ĐƠN HÀNG CỦA TÔI\"!"})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    // api lấy đơn hàng theo id user đang đăng nhập
    getMyOrder: async (req, res) =>{
        try {

            const features = new APIsort(Orders.find({user_id: req.user.id}), req.query).sorting()
            const myorder = await features.query
            res.json(myorder)
            // const myorder = await Orders.find({user_id: req.user.id})
            // res.json(myorder)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = orderCtrl