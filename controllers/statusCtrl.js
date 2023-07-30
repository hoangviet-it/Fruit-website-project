
const status = require('../models/statusModel')

const statusCtrl = {
    // Read status
    status: async (req, res) =>{
        try {
            const st = await status.find()
            res.json(st)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create status
    createStatus: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật status
            const {name} = req.body;
            const st = await status.findOne({name})
            
            if(st) return res.status(400).json({msg: "Tên trạng thái bị trùng! Hãy nhập tên khác."})

            const newStatus = new status({name})
            await newStatus.save()

            res.json({msg: "đã tạo 1 trạng thái mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateStatus: async (req, res) =>{
        try {
            const {name} = req.body;
            await status.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Đã cập nhật thành công 1 trạng thái sản phẩm !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteStatus: async (req, res) => {
        try {
            await status.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = statusCtrl