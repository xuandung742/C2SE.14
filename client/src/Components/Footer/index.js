import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { TbDiscount2 } from "react-icons/tb";
import { CiBadgeDollar } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import newsLetterImg from "../../assets/images/newsletter.png";
import Button from "@mui/material/Button";
import { IoMailOutline } from "react-icons/io5";
import Banners from "../banners/index";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { AiOutlineShop } from 'react-icons/ai';
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { RiCouponFill } from 'react-icons/ri';
import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";



const Footer = () => {
  const [bannerList, setBannerList] = useState([]);

  return (
    <>

      <footer>
        <div className="container">
          <div className="topInfo row">
            <div className="col d-flex align-items-center">
              <span><AiOutlineShop  /></span>
              <span className="ml-2">Sản phẩm tươi mới</span>
            </div>
            <div className="col d-flex align-items-center">
              <span><MdOutlineLocalShipping /></span>
              <span className="ml-2">Freeship mọi đơn hàng</span>
            </div>
            <div className="col d-flex align-items-center">
              <span><HiOutlineReceiptRefund  /></span>
              <span className="ml-2">30 ngày đổi trả</span>
            </div>
            <div className="col d-flex align-items-center">
              <span><RiMoneyDollarCircleLine /></span>
              <span className="ml-2">Giá tốt nhất thị trường</span>
            </div>
          </div>
          <div className="row mt-4 linksWrap">
            <div className="col">
              <h5>Về chúng tôi</h5>
              <ul>
                <li>Hotline: +123.456.789</li>
                <li>Email: email@gmail.com</li>
                <li>Địa Chỉ: Đà Nẵng</li>
              </ul>
            </div>

            <div className="col">
              <h5>Hỗ trợ khách hàng</h5>
              <ul>
                <li><Link to="#">Hướng dẫn mua hàng</Link></li>
                <li><Link to="#">Chính sách giao hàng</Link></li>
                <li><Link to="#">Chính sách đổi trả & hoàn tiền</Link></li>
                <li><Link to="#">Trạng thái đơn hàng</Link></li>
              </ul>
            </div>

            <div className="col">
              <h5>Sản phẩm</h5>
              <ul>
                <li><Link to="#">Vitamin và khoáng chất</Link></li>
                <li><Link to="#">Sữa dinh dưỡng</Link></li>
                <li><Link to="#">Ngũ cốc & Yến mạch</Link></li>
              </ul>
            </div>

            <div className="col">
              <h5>Theo dõi chúng tôi</h5>
              <ul className="list list-inline mt-3 mb-0 socials">
                <li className="list-inline-item">
                  <Link to="https://fb.com/XD.l3f4"><FaFacebookF /></Link>
                </li>

                <li className="list-inline-item">
                  <Link to="#"><FaYoutube /></Link>
                </li>

                <li className="list-inline-item">
                  <Link to="#"><FaInstagram /></Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
