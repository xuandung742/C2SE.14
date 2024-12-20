const { Cart } = require('../models/cart');
const { Orders } = require("../models/orders");
const { Product } = require("../models/products");
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) => {

    try {

        const cartList = await Cart.find({ status: 1, ...req.query });

        if (!cartList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(cartList);

    } catch (error) {
        res.status(500).json({ success: false })
    }
});



router.post('/add', async (req, res) => {
    try {
        // Kiểm tra sản phẩm có tồn tại trong database
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({
                status: false,
                msg: "Sản phẩm không tồn tại."
            });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng của user chưa
        let cartItem = await Cart.findOne({ productId: req.body.productId, userId: req.body.userId, status: 1 });

        if (cartItem) {
            // Sản phẩm đã có trong giỏ hàng, tăng số lượng và cập nhật subtotal
            const newQuantity = cartItem.quantity + req.body.quantity; // Tăng theo số lượng từ client
            cartItem.quantity = newQuantity; // Cập nhật lại số lượng
            cartItem.subTotal = cartItem.price * newQuantity; // Cập nhật lại tổng tiền

            // Lưu lại cartItem đã cập nhật
            await cartItem.save();

            return res.status(200).json({
                status: true,
                msg: "Số lượng sản phẩm trong giỏ hàng đã được cập nhật.",
                cartItem
            });
        }

        else {
            // Thêm sản phẩm mới vào giỏ hàng
            let newCartItem = new Cart({
                productTitle: req.body.productTitle,
                image: req.body.image,
                rating: req.body.rating,
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.price,
                productId: req.body.productId,
                userId: req.body.userId,
                countInStock: req.body.countInStock,
                status: 1
            });

            newCartItem = await newCartItem.save();

            return res.status(201).json({
                msg: "Đã thêm sản phẩm vào giỏ hàng.",
                cartItem: newCartItem
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng."
        });
    }
});


router.delete('/:id', async (req, res) => {

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
        res.status(404).json({ msg: "Không tìm thấy sản phẩm với ID đã cho." })
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: 'Không tìm thấy sản phẩm trong giỏ hàng',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Sản phẩm trong giỏ hàng đã được xóa'
    })
});

router.post("/buyProducts", async (req, res) => {
    try {
        const { products, ...rest } = req.body; // Lấy danh sách các sản phẩm từ request

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống" });
        }

        const purchase = [];

        // Duyệt qua từng sản phẩm trong giỏ hàng
        for (const item of products) {
            // Kiểm tra dữ liệu sản phẩm
            if (
                !item.productTitle ||
                !item.price ||
                !item.quantity ||
                !item.subTotal
            ) {
                return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
            }
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        countInStock: -Number(item.quantity),
                    },
                },
                { new: true } // Trả về tài liệu đã cập nhật
            );

            // Tạo thông tin thanh toán cho sản phẩm
            const paymentProduct = {
                productTitle: item.productTitle,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                subTotal: item.subTotal,
            };

            purchase.push(paymentProduct);

            // update đơn hàng thành 0 để xoá khỏi giỏ hàng
            await Cart.updateOne(
                { status: 1 },
                { $set: { status: 0 } }
            );
        }

        const totalMoney = purchase.reduce((acc, item) => acc + item.subTotal, 0);

        const paymentData = {
            ...rest,
            products: purchase,
            amount: totalMoney,
        };
        await Orders.create(paymentData);

        return res.status(200).json({
            message: "Mua hàng thành công",
            data: paymentData,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {

    const catrItem = await Cart.findById(req.params.id);

    if (!catrItem) {
        res.status(500).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng với ID đã cho!' })
    }
    return res.status(200).send(catrItem);
})



router.put('/:id', async (req, res) => {

    const cartList = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId
        },
        { new: true }
    )

    if (!cartList) {
        return res.status(500).json({
            message: 'Không thể cập nhật giỏ hàng!',
            success: false
        })
    }

    res.send(cartList);

})


module.exports = router;

