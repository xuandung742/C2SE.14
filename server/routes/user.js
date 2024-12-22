const { User } = require("../models/user");
const { ImageUpload } = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { log } = require("console");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("images"), async (req, res) => {
    let imagesArr = [];

    try {
        for (let i = 0; i < req.files.length; i++) {
            const img = await cloudinary.uploader.upload(req.files[i].path, {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            });

            imagesArr.push(img.secure_url);
            fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }

        let imagesUploaded = new ImageUpload({ images: imagesArr });
        await imagesUploaded.save();

        res.status(200).json(imagesArr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", msg: "Error uploading images" });
    }
});

router.post(`/signup`, async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {

        const existingUser = await User.findOne({ email: email });
        const existingUserByPh = await User.findOne({ phone: phone });

        if (existingUser) {
            res.json({ status: 'FAILED', msg: "Email đã được sử dụng!" })
            return;
        }

        if (existingUserByPh) {
            res.json({ status: 'FAILED', msg: "Số điện thoại đã được sử dụng!" })
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin
        });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token: token,
            msg: "Đăng kí tài khoản thành công."
        })

    } catch (error) {
        console.log(error);
        res.json({ status: 'FAILED', msg: "Lỗi" });
        return;
    }
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "Người dùng không tồn tại!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Thông tin đăng nhập không hợp lệ" });
        }

        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.SECRET_KEY_JWT
        );
        res
            .status(200)
            .json({ user: existingUser, token, msg: "Đăng nhập thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Đã xảy ra lỗi trong quá trình đăng nhập" });
    }
});

const sendPasswordResetEmail = (email, newPassword) => {
    const transporter = nodemailer.createTransport({
        tls: { rejectUnauthorized: false },
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "Password Reset",
        text: `Your new password is: ${newPassword}`,
    };

    return transporter.sendMail(mailOptions);
};

const generateRandomPassword = () => {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$%&*";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return newPassword;
};

router.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, msg: "Vui lòng nhập email!" });
    }
    console.log(email)

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: true, msg: "Không tìm thấy người dùng!" });
        }

        const newPassword = generateRandomPassword();
        console.log(`New password generated: ${newPassword}`); // Debug new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Attempt to send email
        try {
            await sendPasswordResetEmail(email, newPassword);
            console.log("Email đặt lại mật khẩu đã được gửi"); // Debug email sending
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res
                .status(500)
                .json({ error: true, msg: "Lỗi khi gửi email đặt lại" });
        }

        res
            .status(200)
            .json({ status: 200, message: "Đã đặt lại mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi:", error);
        res
            .status(500)
            .json({ error: true, msg: "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu" });
    }
});

router.put("/changePassword/:id", async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: true, msg: "Không tìm thấy người dùng!" });
        }

        const matchOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchOldPassword) {
            return res
                .status(400)
                .json({ error: true, msg: "Mật khẩu cũ không đúng" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ msg: "Mật khẩu đã được thay đổi thành công" });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: true, msg: "Đã xảy ra lỗi trong quá trình thay đổi mật khẩu" });
    }
});

router.get("/", async (req, res) => {
    try {
        const userList = await User.find();
        res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Lỗi khi truy xuất người dùng" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "Không tìm thấy người dùng" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Lỗi khi truy xuất người dùng" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: true, msg: "Không tìm thấy người dùng" });
        }
        res.status(200).json({ msg: "Người dùng đã bị xóa thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Lỗi khi xóa người dùng" });
    }
});

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments()

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount: userCount
    });
})

router.post(`/authWithGoogle`, async (req, res) => {
    const { name, phone, email, password, images, isAdmin } = req.body;


    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            const result = await User.create({
                name: name,
                phone: phone,
                email: email,
                password: password,
                images: images,
                isAdmin: isAdmin
            });


            const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).send({
                user: result,
                token: token,
                msg: "Đăng nhập thành công!"
            })

        }

        else {
            const existingUser = await User.findOne({ email: email });
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).send({
                user: existingUser,
                token: token,
                msg: "Đăng nhập thành công!"
            })
        }

    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', async (req, res) => {

    const { name, phone, email } = req.body;

    const userExist = await User.findById(req.params.id);

    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: name,
            phone: phone,
            email: email,
            password: newPassword,
            images: imagesArr,
        },
        { new: true }
    )

    if (!user)
        return res.status(400).send('the user cannot be Updated!')

    res.send(user);
})

router.delete("/deleteImage", async (req, res) => {
    const imgUrl = req.query.img;
    const imageName = imgUrl.split("/").pop().split(".")[0];

    try {
        const response = await cloudinary.uploader.destroy(imageName);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: true, msg: "Error deleting image from Cloudinary" });
    }
});

module.exports = router;