const Notify = require('../models/notifyModel')

const notifyCtrl = {

    getNotify: async (req, res) =>{
        try {
            const notify = await Notify.find()
            res.json(notify)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateNewOrder: async (req, res) =>{
        try {
            const {newOrder} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {newOrder})

            res.json({msg: "Có đơn hàng mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateNewReview: async (req, res) =>{
        try {
            const {newReview} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {newReview})

            res.json({msg: "Có đánh giá mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createNotify: async (req, res) =>{
        try {
            const {newOrder, newReview} = req.body;

            const newNotify = new Notify({newOrder, newReview})
            await newNotify.save()

            res.json({msg: "Đã tạo 1 notify mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateSlide: async (req, res) =>{
        try {
            const {slide} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {slide})

            res.json({msg: "Đã cập nhật slide!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateDiscount: async (req, res) =>{
        try {
            const {discount} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {discount})

            res.json({msg: "Đã cập nhật khuyến mãi!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateCancelOrder: async (req, res) =>{
        try {
            const {cancelOrder} = req.body;
            await Notify.findOneAndUpdate({_id: req.params.id}, {cancelOrder})

            res.json({msg: "Đã Hủy đơn hàng!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}
module.exports = notifyCtrl