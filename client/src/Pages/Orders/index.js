import React, { useContext, useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [products, setproducts] = useState([]);
    const [page, setPage] = useState(1);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const context = useContext(MyContext);

    const history = useNavigate();
    const translateStatus = (status) => {
        switch (status) {
            case "pending":
                return "Đang xử lý";
            case "confirm":
                return "Đã xác nhận";
            case "delivered":
                return "Đã giao hàng";
            default:
                return "Không xác định";
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        }
        else {
            history("/signIn");
        }

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/orders?userid=${user?.userId}`).then((res) => {
            setOrders(res);
        })


        context.setEnableFilterTab(false);

    }, []);




    const showProducts = (id) => {
        fetchDataFromApi(`/api/orders/${id}`).then((res) => {
            setIsOpenModal(true);
            setproducts(res.products);
        })
    }
    console.log(orders)


    return (
        <>
            <section className="section">
                <div className='container'>
                    <h2 className='hd'>Đơn Hàng</h2>

                    <div className='table-responsive orderTable'>
                        <table className='table table-striped table-bordered'>
                            <thead className='thead-light'>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Tổng tiền</th>
                                    <th>Email</th>
                                    <th>Trạng thái đơn hàng</th>
                                    <th>Ngày</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    orders?.length !== 0 && orders?.map((order, index) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td><span className='text-blue fonmt-weight-bold'>{order?.id}</span></td>
                                                    <td><span className='text-blue fonmt-weight-bold cursor' onClick={() => showProducts(order?._id)}>Xem chi tiết</span>
                                                    </td>
                                                    <td>{order?.name}</td>
                                                    <td>{order?.phoneNumber}</td>
                                                    <td>{order?.address}</td>
                                                    <td>{order?.amount}</td>
                                                    <td>{order?.email}</td>
                                                    {/* <td>
                                                        {order?.status === "pending" ?
                                                            <span className='badge badge-danger'>{order?.status}</span> :
                                                            <span className='badge badge-success'>{order?.status}</span>
                                                        }
                                                    </td> */}
                                                    <td>
                                                        <span
                                                            className={`badge ${order?.status === "pending" ? 'badge-danger' : 'badge-success'}`}
                                                        >
                                                            {translateStatus(order?.status)}
                                                        </span>
                                                    </td>

                                                    <td>{order?.date?.split("T")[0]}</td>
                                                </tr>

                                            </>

                                        )
                                    })
                                }

                            </tbody>


                        </table>
                    </div>




                </div>
            </section>


            <Dialog open={isOpenModal} className="productModal" >
                <Button className='close_' onClick={() => setIsOpenModal(false)}><MdClose /></Button>
                <h4 class="mb-1 font-weight-bold pr-5 mb-4">Sản phẩm</h4>

                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Hình ảnh</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                products?.length !== 0 && products?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{item?.id}</td>
                                            <td style={{ whiteSpace: "inherit" }}><span>
                                                {item?.productTitle?.substr(0, 30) + '...'}
                                            </span></td>
                                            <td>
                                                <div className='img'>
                                                    <img src={item?.image} />
                                                </div>
                                            </td>
                                            <td>{item?.quantity}</td>
                                            <td>{item?.price}</td>
                                            <td>{item?.subTotal}</td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </Dialog>

        </>
    )
}

export default Orders;