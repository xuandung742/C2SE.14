import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight, FaBox, FaCartShopping, FaFileImage, FaImage, FaImages } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { TbSlideshow } from "react-icons/tb";
import { BsFileImageFill } from "react-icons/bs";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    if (activeTab === index) {
      setIsToggleSubmenu(!isToggleSubmenu);
    } else {
      setIsToggleSubmenu(false);
      setIsToggleSubmenu(true);
    }

  };
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      history("/login");
    }
  }, []);

  const logout = () => {
    localStorage.clear();

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Đăng xuất thành công!",
    });

    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <NavLink exact activeClassName="is-active" to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => {
                  isOpenSubmenu(0);
                  context.setIsOpenNav(false);
                }}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                Dashboard
              </Button>
            </NavLink>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <FaImages />
              </span>
              Slide Banner
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Add Banner
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/list"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner List
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(2)}
            >
              <span className="icon">
                <BiSolidCategory />
              </span>
              Category
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/category"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Category List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/category/add"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Add Category
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(3)}
            >
              <span className="icon">
                <FaBox />
              </span>
              Product
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/products"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Product List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/product/upload"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Product Upload
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink exact activeClassName="is-active" to="/orders">
              <Button
                className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? "active" : ""
                  }`}
                onClick={() => {
                  isOpenSubmenu(4);
                  context.setIsOpenNav(false);
                }}
              >
                <span className="icon">
                  {" "}
                  <FaCartShopping fontSize="small" />
                </span>
                Order
              </Button>
            </NavLink>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 5 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(5)}
            >
              <span className="icon">
                <FaImage />
              </span>
              Home Banner
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/banners"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/banners/add"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner Upload
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(6)}
            >
              <span className="icon">
                <FaFileImage />
              </span>
              Home Side Banner
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/homeSideBanners"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/homeSideBanners/add"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner Upload
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 7 && isToggleSubmenu === true ? "active" : ""
                }`}
              onClick={() => isOpenSubmenu(7)}
            >
              <span className="icon">
                <FaImage />
              </span>
              Home Bottom Banner
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 7 && isToggleSubmenu === true
                ? "colapse"
                : "colapsed"
                }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/homeBottomBanners"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banners List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/homeBottomBanners/add"
                    end
                    activeClassName="is-active"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Banner Upload
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button style={{background: "#7E80FF", color: "#fff"}}
              variant="contained"
              onClick={() => {
                logout();
                context.setIsOpenNav(false);
              }}
            >
              <IoMdLogOut /> Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
