
const Category = require('../models/categoryModel')
const Products = require('../models/productModel')

const categoryCtrl = {
    // Read category
    categories: async (req, res) =>{
        try {
            const categories = await Category.find()
            res.json(categories)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // create category
    createCategory: async (req, res) =>{
        try {
            // chỉ admin (role === 1) mới có thể tạo , xóa, cập nhật category 
            const {name} = req.body;
            const category = await Category.findOne({name})
            
            if(category) return res.status(400).json({msg: "Tên category bị trùng! Hãy chọn tên khác."})

            const newCategory = new Category({name})
            await newCategory.save()

            res.json({msg: "Đã tạo 1 thể loại mới!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // xóa category
    deleteCategory: async (req, res) =>{
        try {
            const products = await Products.findOne({category: req.params.id})
            if(products) return res.status(400).json({msg: "Vui lòng xóa hết các sản phẩm liên quan."})
            
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "Đã xóa!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // cập nhật category
    updateCategory: async (req, res) =>{
        try {
            const {name} = req.body;
            await Category.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Đã cập nhật thành công 1 thể loại.!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl