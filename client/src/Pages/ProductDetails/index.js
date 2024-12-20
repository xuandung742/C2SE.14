import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import Button from "@mui/material/Button";
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "./RelatedProducts";

import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { FaHeart } from "react-icons/fa";


const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentlyViewdProducts, setRecentlyViewdProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsData, setreviewsData] = useState([]);
  const [isAddedToMyList, setSsAddedToMyList] = useState(false);

  let [cartFields, setCartFields] = useState({});
  let [productQuantity, setProductQuantity] = useState();
  const [tabError, setTabError] = useState(false);

  const { id } = useParams();

  const context = useContext(MyContext);

  const isActive = (index) => {
    setActiveSize(index);
    setTabError(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSize(null);
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);

      if (
        res?.productRam.length === 0 &&
        res?.productWeight.length === 0 &&
        res?.size.length === 0
      ) {
        setActiveSize(1);
      }

      fetchDataFromApi(
        `/api/products/subCatId?subCatId=${res?.subCatId
        }&location=${localStorage.getItem("location")}`
      ).then((res) => {
        const filteredData = res?.products?.filter((item) => item.id !== id);
        setRelatedProductData(filteredData);
      });
    });

    fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
      setreviewsData(res);
    });

    const user = JSON.parse(localStorage.getItem("user"));

    fetchDataFromApi(
      `/api/my-list?productId=${id}&userId=${user?.userId}`
    ).then((res) => {
      if (res.length !== 0) {
        setSsAddedToMyList(true);
      }
    });


    context.setEnableFilterTab(false);
  }, [id]);

  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: 1,
  });

  const onChangeInput = (e) => {
    setReviews(() => ({
      ...reviews,
      [e.target.name]: e.target.value,
    }));
  };

  const changeRating = (e) => {
    setRating(e.target.value);
    reviews.customerRating = e.target.value;
  };

  const addReview = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user !== null) {
      reviews.customerName = user?.name;
      reviews.customerId = user?.userId;
      reviews.productId = id;

      if (reviews.review !== "") {

        setIsLoading(true);

        postData("/api/productReviews/add", reviews).then((res) => {
          setIsLoading(false);

          reviews.customerRating = 1;

          setReviews({
            review: "",
            customerRating: 1,
          });

          fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setreviewsData(res);
          });
        });
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Vui lòng nhập đánh giá sản phẩm",
        });
      }

    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng đăng nhập để tiếp tục",
      });
    }
  };

  const quantity = (val) => {
    setProductQuantity(val);
  };

  const addtoCart = () => {
    if (activeSize !== null) {
      const user = JSON.parse(localStorage.getItem("user"));

      cartFields.productTitle = productData?.name;
      cartFields.image = productData?.images[0];
      cartFields.rating = productData?.rating;
      cartFields.price = productData?.price;
      cartFields.quantity = productQuantity;
      cartFields.subTotal = parseInt(productData?.price * productQuantity);
      cartFields.productId = productData?.id;
      cartFields.countInStock = productData?.countInStock;
      cartFields.userId = user?.userId;

      context.addToCart(cartFields);
      console.log(cartFields)
    } else {
      setTabError(true);
    }
  };

  const selectedItem = () => { };

  const gotoReviews = () => {
    window.scrollTo({
      top: 550,
      behavior: "smooth",
    });

    setActiveTabs(2);
  };

  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      const data = {
        productTitle: productData?.name,
        image: productData?.images[0],
        rating: productData?.rating,
        price: productData?.price,
        productId: id,
        userId: user?.userId,
      };
      postData(`/api/my-list/add/`, data).then((res) => {
        if (res.status !== false) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Sản phẩm đã được thêm vào danh sách",
          });

          fetchDataFromApi(
            `/api/my-list?productId=${id}&userId=${user?.userId}`
          ).then((res) => {
            if (res.length !== 0) {
              setSsAddedToMyList(true);
            }
          });
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
        }
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng đăng nhập để tiếp tục",
      });
    }
  };
  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN');
  };

  return (
    <>
      <section className="productDetails section">
        <div className="container">
          {productData?.length === 0 ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "300px" }}
            >
              <CircularProgress />
            </div>
          ) : (
            <div className="row">
              <div className="col-md-4 pl-5 part1">
                <ProductZoom
                  images={productData?.images}
                  discount={productData?.discount}
                />
              </div>

              <div className="col-md-7 pl-5 pr-5 part2">
                <h2 className="hd text-capitalize">{productData?.name}</h2>
                <ul className="list list-inline d-flex align-items-center">
                  <li className="list-inline-item">
                    <div className="d-flex align-items-center">
                      <span className="text-light mr-2">Thương hiệu: </span>
                      <span>{productData?.brand}</span>
                    </div>
                  </li>

                  <li className="list-inline-item">
                    <div className="d-flex align-items-center">
                      <Rating
                        name="read-only"
                        value={parseInt(productData?.rating)}
                        precision={0.5}
                        readOnly
                        size="small"
                      />

                      <span
                        className="text-light cursor ml-2"
                        onClick={gotoReviews}
                      >
                        {reviewsData?.length} Đánh giá
                      </span>
                    </div>
                  </li>
                </ul>

                <div className="d-flex info mb-3">
                  <span className="oldPrice productdt">đ {formatPrice(productData?.oldPrice)}</span>
                  <span className="netPrice text-danger ml-2 productdt">đ {formatPrice(productData?.price)}</span>
                </div>

                {productData?.countInStock >= 1 ? (
                  <span className="badge badge-success">CÒN HÀNG</span>
                ) : (
                  <span className="badge badge-danger">TẠM HẾT</span>
                )}

                <p className="mt-3"> {productData?.description}</p>
                {productData?.productWeight?.length !== 0 && (
                  <div className="productSize d-flex align-items-center">
                    <span>Phân loại:</span>
                    <ul
                      className={`list list-inline mb-0 pl-4 ${tabError === true && "error"
                        }`}
                    >
                      {productData?.productWeight?.map((item, index) => {
                        return (
                          <li className="list-inline-item">
                            <a
                              className={`tag ${activeSize === index ? "active" : ""
                                }`}
                              onClick={() => isActive(index)}
                            >
                              {item}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="d-flex align-items-center mt-3 actions_">
                  <QuantityBox
                    quantity={quantity}
                    item={productData}
                    selectedItem={selectedItem}
                  />

                  <div className="d-flex align-items-center btnActions">
                    <Button
                      className="btn-blue btn-lg btn-big btn-round bg-red"
                      onClick={() => addtoCart()}
                    >
                      <BsCartFill /> &nbsp;
                      {context.addingInCart === true
                        ? "..."
                        : " Thêm vào giỏ hàng"}
                    </Button>

                    <Tooltip
                      title={`${isAddedToMyList === true
                        ? "Đã thêm vào yêu thích"
                        : "Thêm vào yêu thích"
                        }`}
                      placement="top"
                    >
                      <Button
                        className={`btn-blue btn-lg btn-big btn-circle ml-4`}
                        onClick={() => addToMyList(id)}
                      >
                        {isAddedToMyList === true ? (
                          <FaHeart className="text-danger" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </Button>
                    </Tooltip>

                    {/* <Tooltip title="Add to Compare" placement="top">
                      <Button className="btn-blue btn-lg btn-big btn-circle ml-2">
                        <MdOutlineCompareArrows />
                      </Button>
                    </Tooltip> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          <br />

          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 && "active"}`}
                    onClick={() => {
                      setActiveTabs(0);
                    }}
                  >
                    Mô tả
                  </Button>
                </li>
                {/* <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && "active"}`}
                    onClick={() => {
                      setActiveTabs(1);
                    }}
                  >
                    Thông tin chi tiết
                  </Button>
                </li> */}
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 && "active"}`}
                    onClick={() => {
                      setActiveTabs(2);
                    }}
                  >
                    Đánh giá ({reviewsData?.length})
                  </Button>
                </li>
              </ul>

              <br />

              {activeTabs === 0 && (
                <div className="tabContent">{productData?.description}</div>
              )}


              {activeTabs === 2 && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Đánh giá sản phẩm</h3>
                      <br />

                      {reviewsData?.length !== 0 &&
                        reviewsData
                          ?.slice(0)
                          ?.reverse()
                          ?.map((item, index) => {
                            return (
                              <div
                                className="reviewBox mb-4 border-bottom"
                                key={index}
                              >
                                <div className="info">
                                  <div className="d-flex align-items-center w-100">
                                    <h5>{item?.customerName}</h5>

                                    <div className="ml-auto">
                                      <Rating
                                        name="half-rating-read"
                                        value={item?.customerRating}
                                        readOnly
                                        size="small"
                                      />
                                    </div>
                                  </div>

                                  <h6 className="text-light">
                                    {item?.dateCreated?.split('T')[0]}
                                  </h6>

                                  <p>{item?.review} </p>
                                </div>
                              </div>
                            );
                          })}

                      <br className="res-hide" />

                      <form className="reviewForm" onSubmit={addReview}>
                        <h4>Thêm đánh giá</h4>
                        <div className="form-group">
                          <textarea
                            className="form-control shadow"
                            placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                            name="review"
                            value={reviews.review}
                            onChange={onChangeInput}
                          ></textarea>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <Rating
                                name="rating"
                                value={rating}
                                precision={0.5}
                                onChange={changeRating}
                              />
                            </div>
                          </div>
                        </div>

                        <br />
                        <div className="form-group">
                          <Button
                            type="submit"
                            className="btn-blue btn-lg btn-big btn-round"
                          >
                            {isLoading === true ? (
                              <CircularProgress
                                color="inherit"
                                className="loader"
                              />
                            ) : (
                              "Gửi đánh giá"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <br />

          {relatedProductData?.length !== 0 && (
            <RelatedProducts
              title="SẢN PHẨM LIÊN QUAN"
              data={relatedProductData}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
