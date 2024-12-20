const { HealthForm } = require("../models/healthform");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const forms = await HealthForm.find(req.query);

    if (!forms) {
      return res.status(500).json({ success: false, message: "Không tìm thấy dữ liệu!" });
    }

    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/add", async (req, res) => {
  let newForm = new HealthForm({
    age: req.body.age,
    gender: req.body.gender,
    weight: req.body.weight,
    height: req.body.height,
    goal: req.body.goal,
    dietary: req.body.dietary,
    activityLevel: req.body.activityLevel,
    healthConditions: req.body.healthConditions,
    userId: req.body.userId,
  });

  if (!newForm) {
    res.status(500).json({
      error: err,
      success: false
    })
  }

  newForm = await newForm.save();

  res.status(201).json(newForm);

});

router.get('/:id', async (req, res) => {

  const newForm = await HealthForm.findById(req.params.id);

  if (!newForm) {
    res.status(500).json({
      message: 'Không tìm thấy dữ liệu!'
    })
  }
  return res.status(200).send(newForm);
})

// // Xóa form theo ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const form = await HealthForm.findById(req.params.id);

//     if (!form) {
//       return res.status(404).json({ message: "Không tìm thấy form với ID đã cho!" });
//     }

//     await HealthForm.findByIdAndDelete(req.params.id);

//     return res.status(200).json({
//       success: true,
//       message: "Form đã được xóa thành công!",
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Lấy thông tin form theo ID
// router.get("/:id", async (req, res) => {
//   try {
//     const form = await HealthForm.findById(req.params.id);

//     if (!form) {
//       return res.status(404).json({ message: "Không tìm thấy form với ID đã cho!" });
//     }

//     return res.status(200).json(form);
//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;
