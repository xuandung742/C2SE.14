const { ProductReviews } = require('../models/productReviews');
const { Product } = require('../models/products'); // Import model Product
const express = require('express');
const router = express.Router();


// Lấy tất cả các đánh giá hoặc các đánh giá của sản phẩm cụ thể
router.get(`/`, async (req, res) => {
    let reviews = [];
    try {
        if (req.query.productId !== undefined && req.query.productId !== null && req.query.productId !== "") {
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            reviews = await ProductReviews.find();
        }

        if (!reviews) {
            res.status(500).json({ success: false });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Lấy tổng số lượng đánh giá
router.get(`/get/count`, async (req, res) => {
    const productsReviews = await ProductReviews.countDocuments();

    if (!productsReviews) {
        res.status(500).json({ success: false });
    } else {
        res.send({
            productsReviews: productsReviews
        });
    }
});

// Lấy thông tin đánh giá theo ID
router.get('/:id', async (req, res) => {
    const review = await ProductReviews.findById(req.params.id);

    if (!review) {
        res.status(500).json({ message: 'Không tìm thấy đánh giá với ID đã cho' });
    }
    return res.status(200).send(review);
});

// Thêm đánh giá và cập nhật điểm đánh giá sản phẩm
router.post('/add', async (req, res) => {
    const { customerId, customerName, review, customerRating, productId } = req.body;

    try {
        // Tạo đối tượng đánh giá mới
        let newReview = new ProductReviews({
            customerId,
            customerName,
            review,
            customerRating,
            productId
        });

        // Lưu đánh giá vào cơ sở dữ liệu
        newReview = await newReview.save();

        // Cập nhật rating của sản phẩm
        const product = await Product.findById(productId);
        if (product) {
            // Lấy tất cả đánh giá của sản phẩm
            const reviews = await ProductReviews.find({ productId: productId });
            // Tính tổng điểm của tất cả các đánh giá
            const totalRating = reviews.reduce((sum, review) => sum + review.customerRating, 0);
            // Tính điểm trung bình
            const newRating = totalRating / reviews.length;

            // Cập nhật rating của sản phẩm
            product.rating = newRating;
            await product.save();
        }

        return res.status(201).json({
            success: true,
            review: newReview
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
