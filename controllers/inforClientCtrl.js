const InforClient = require('../models/inforClientModel')


const inforClientCtrl = {
    // Read
    inforClient: async (req, res) =>{
        try {

            const inforClient = await InforClient.find()
            res.json(inforClient)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createInforClient: async (req, res) =>{
        try {
            
            const {name_client, address, phone, email} = req.body;

            const newClient = new InforClient({user_id: req.user.id, name_client, address, phone, email})
            await newClient.save()

            res.json({msg: "Đã tạo 1 thông tin khách hàng mới!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateInforClient: async (req, res) =>{
        try {
            const {name_client, address, phone, email} = req.body;
            const user = await InforClient.findOne({user_id: req.user.id})
            if(!user) return res.status(400).json({msg: "Không thể cập nhật do chưa có thông tin cá nhân. Hãy tiếp tục mua hàng để cập nhật thông tin tài khoản!"})
            
            await InforClient.findOneAndUpdate({user_id: req.user.id}, {name_client, address, phone, email})

            res.json({msg: "Đã cập nhật thành công !"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteInforClient: async (req, res) =>{
        try {
            
            await InforClient.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updatePays: async (req, res) => {
        try {
            const {pays} = req.body;
            await InforClient.findOneAndUpdate({user_id: req.user.id}, {pays})
            res.json({msg: "Đã cập nhật!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = inforClientCtrl