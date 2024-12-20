import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";
import { ConfigProvider, Radio } from "antd";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";


import { useNavigate } from "react-router-dom";

import { BsCreditCard2BackFill } from "react-icons/bs";

const Checkout = () => {
  const [formFields, setFormFields] = useState({
    fullName: "",
    streetAddressLine1: "",
    city: "",
    phoneNumber: "",
    email: "",
    paymentMethod: 2,
  });
  const myTheme = {
    components: {
      Radio: {
        colorPrimary: "black",
        colorPrimaryHover: "black",
        // fontFamily: "Montserrat",
        paddingXS: 10,
        marginXS: 10,
        controlInteractiveSize: 18,
      },
    },
  };
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const total = (80000 / 24000).toFixed(2);
  useEffect(() => {
    window.scrollTo(0, 0);

    context.setEnableFilterTab(false);
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);

      setTotalAmount(
        res.length !== 0 &&
        res
          .map((item) => parseInt(item.price) * item.quantity)
          .reduce((total, value) => total + value, 0)
      );
    });
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const context = useContext(MyContext);

  const checkout = (e) => {
    e.preventDefault();

    console.log(cartData);

    console.log(formFields);
    if (formFields.fullName === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập họ và tên",
      });
      return false;
    }

    if (formFields.phoneNumber === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập số điện thoại",
      });
      return false;
    }

    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập email",
      });
      return false;
    }

    if (formFields.city === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập thành phố",
      });
      return false;
    }

    if (formFields.streetAddressLine1 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập địa chỉ",
      });
      return false;
    }


    if (formFields.paymentMethod === "" || formFields.paymentMethod === 2) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng chọn phương thức thanh toán",
      });
      return false;
    }

    if (paymentMethod) {
      alert(
        `Bạn đã chọn phương thức thanh toán: ${paymentMethod === "1"
          ? "Thanh toán khi nhận hàng"
          : "Thanh toán qua Momo"
        }`
      );
    }

    // const addressInfo = {
    //   name: formFields.fullName,
    //   phoneNumber: formFields.phoneNumber,
    //   address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
    //   date: new Date()
    //     .toLocaleString("en-GB", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     })
    //     .replace(/\//g, "/"),
    // };



    const amount = cartData.reduce((acc, item) => acc + item.subTotal, 0);

    // Thanh Toán
    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userid: JSON.parse(localStorage.getItem("user")).userId,
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: `${formFields.streetAddressLine1}, ${formFields.city}`,
      email: formFields.email,
      products: cartData.map((item) => ({
        id: item.id,
        image: item.image,
        price: item.price,
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
        subTotal: item.subTotal,
      })),
      amount: amount,
      paymentMethod: formFields.paymentMethod, // 0: Thanh toán khi nhận hàng, 1: PayPal
    };

    try {
      // Gửi dữ liệu đơn hàng đến server
      postData("/api/cart/buyProducts", orderData);

      // setCartData(cartResponse);
      // if (response.success) {
      //   // Xóa giỏ hàng sau khi đặt hàng thành công

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Đặt hàng thành công!",
      });
      setTimeout(() => {
        navigate("/")
      }, 3000);

      //   // Điều hướng đến trang xác nhận đơn hàng
      //   // history("/order-success");
      // } else {
      //   throw new Error("Đặt hàng thất bại.");
      // }
    } catch (error) {
      console.error("Error placing order:", error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.",
      });

    }

  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">ĐỊA CHỈ NHẬN HÀNG</h2>

              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Họ và tên *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Số điện thoại *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="phoneNumber"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Địa chỉ *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Tỉnh/Thành phố"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Tên đường, tòa nhà, số nhà"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">ĐƠN HÀNG CỦA BẠN</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Tổng cộng</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartData?.length !== 0 &&
                        cartData?.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                {item?.productTitle?.substr(0, 20) + "..."}{" "}
                                <b>× {item?.quantity}</b>
                              </td>

                              <td>
                                {item?.subTotal?.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </td>
                            </tr>
                          );
                        })}

                      <tr>
                        <td>Tạm tính </td>

                        <td>
                          {(cartData?.length !== 0
                            ? cartData
                              ?.map(
                                (item) => parseInt(item.price) * item.quantity
                              )
                              .reduce((total, value) => total + value, 0)
                            : 0
                          )?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="table-responsive mt-3">
                  <h6>Phương thức thanh toán:</h6>
                  <ConfigProvider theme={myTheme}>
                    {" "}
                    <Radio.Group>
                      <div className="flex flex-col gap-6 ">
                        <Radio
                          className="mb-2"
                          value="cash"
                          onChange={() => {
                            setFormFields((prevPayment) => ({
                              ...prevPayment,
                              paymentMethod: 0,
                            }));
                            setShowPayPalButton(false);
                          }}
                          disabled={isPaid} // Vô hiệu hóa nút radio khi thanh toán thành công
                        >
                          <span>Thanh toán khi nhận hàng</span>
                        </Radio>
                        <Radio
                          value="paypal"
                          onChange={() => {
                            setFormFields((prevPayment) => ({
                              ...prevPayment,
                              paymentMethod: 2,
                            }));
                            setShowPayPalButton(true);
                          }}
                        >
                          <span className="flex gap-4 items-center justify-center">
                            Thanh toán trực tuyến{" "}
                            {/* <BsCreditCard2BackFill fontSize={20} /> */}
                          </span>
                        </Radio>
                      </div>
                    </Radio.Group>
                  </ConfigProvider>
                  {showPayPalButton && !isPaid && (
                    <div className="flex flex-col gap-4 border-2 border-gray-100 rounded-lg my-2 w-full overflow-hidden">
                      <PayPalScriptProvider
                        options={{
                          clientId:
                            "AcOq3RkWYOLeq6hxAwkXFv4jenjO_oCS8qKKWQigf5Sy1O_QtRwQMeBRqylsZ7y3EG85Miv9EtGrtkwu",
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: "horizontal" }}
                          createOrder={(data, actions) => {
                            console.log(data);
                            return actions.order.create({
                              intent: "CAPTURE", // Thêm thuộc tính intent ở đây
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD", // Mã tiền tệ
                                    value: total.toString(), // Giả định 'total' là biến chứa tổng tiền
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            console.log(data);
                            return actions.order
                              .capture()
                              .then((details) => {
                                console.log(
                                  "Transaction completed by " +
                                  details.payer.name.given_name
                                );
                                // Gọi hàm xử lý thành công ở đây
                                setFormFields((prevPayment) => ({
                                  ...prevPayment,
                                  paymentMethod: 1,
                                }));
                                setIsPaid(true);
                              });
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="btn-blue bg-red btn-lg btn-big mt-2"
                >
                  <IoBagCheckOutline /> &nbsp; Hoàn tất
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;