import React, { useEffect } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { IoMdCloseCircle } from "react-icons/io";

import { fetchDataFromApi } from '../../utils/api';


const Sidebar = (props) => {
    const [value, setValue] = useState([0, 10000000]);
    const [value2, setValue2] = useState(0);

    const [subCatId, setSubCatId] = useState('');
    const [filterSubCat, setfilterSubCat] = React.useState();

    const [catId, setCatId] = useState('');
    const [filterCat, setFilterCat] = useState('');

    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [homeSideBanners, setHomeSideBanners] = useState([]);


    const context = useContext(MyContext);

    const { id } = useParams();

    useEffect(() => {
        setSubCatId(id);
        fetchDataFromApi("/api/homeSideBanners").then((res) => {
            setHomeSideBanners(res);
        });
    }, [id])


    useEffect(() => {
        setIsOpenFilter(props.isOpenFilter)
    }, [props.isOpenFilter])


    const handleChange = (event) => {
        setfilterSubCat(event.target.value);
        props.filterData(event.target.value)
        setSubCatId(event.target.value)
    };

    useEffect(() => {
        props.filterByPrice(value, subCatId);
    }, [value, id]);

    const filterByRating = (rating) => {
        props.filterByRating(rating, subCatId);
    }
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN');
    };

    return (
        <>
            <div className={`sidebar ${isOpenFilter === true && 'open'}`}>

                {
                    context.windowWidth < 992 && <>
                        <div className='info d-flex align-items-center'>
                            <h5>Bộ lọc tìm kiếm</h5>
                            <span className='ml-auto closeFilters'><IoMdCloseCircle onClick={() => context?.setIsOpenFilters(!context?.isOpenFilters)} /></span>
                        </div>
                        <hr />
                    </>
                }

                {/* <div className="filterBox">
                    <h6>DANH MỤC</h6>

                    <div className='scroll'>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={filterSubCat}
                            onChange={handleChange}
                        >

                      
                            {
                                context?.subCategoryData?.length !== 0 &&  context?.subCategoryData?.map((item, index) => {

                                    return (
                                        <FormControlLabel value={item?.id} control={<Radio />} label={item?.name} />

                                    )
                                })
                            }
                        </RadioGroup>

                    </div>
                </div> */}


                <div className="filterBox">
                    <h6>KHOẢNG GIÁ</h6>

                    <RangeSlider value={value} onInput={setValue} min={0} max={10000000} step={5} />


                    <div className='d-flex pt-2 pb-2 priceRange'>
                        <span>Từ: <strong className='text-dark'>đ{formatPrice(value[0])}</strong></span>
                        <span className='ml-auto'>Đến: <strong className='text-dark'>đ{formatPrice(value[1])}</strong></span>
                    </div>

                </div>


                <div className="filterBox">
                    <h6>ĐÁNH GIÁ</h6>

                    <div className='scroll pl-0'>
                        <ul>
                            <li onClick={() => filterByRating(5)} className='cursor' >
                                <Rating name="read-only" value={5} readOnly size="small"
                                />

                            </li>
                            <li onClick={() => filterByRating(4)} className='cursor'>
                                <Rating name="read-only" value={4} readOnly size="small"
                                />
                            </li>
                            <li onClick={() => filterByRating(3)} className='cursor'>
                                <Rating name="read-only" value={3} readOnly size="small"
                                />
                            </li>
                            <li onClick={() => filterByRating(2)} className='cursor'>
                                <Rating name="read-only" value={2} readOnly size="small"
                                />
                            </li>
                            <li onClick={() => filterByRating(1)} className='cursor'>
                                <Rating name="read-only" value={1} readOnly size="small"
                                />
                            </li>
                        </ul>


                    </div>
                </div>



                {homeSideBanners?.length !== 0 &&
                    [...homeSideBanners] // Tạo một bản sao mảng để không thay đổi mảng gốc
                        .sort(() => 0.5 - Math.random()) // Trộn ngẫu nhiên mảng
                        .slice(0, 2) // Lấy 2 phần tử đầu tiên
                        .map((item, index) => {
                            return (
                                <div className="banner mb-3" key={index}>
                                    {item?.subCatId !== null ? (
                                        <Link
                                            to={`/products/subCat/${item?.subCatId}`}
                                            className="box"
                                        >
                                            <img
                                                src={item?.images[0]}
                                                className="w-100 transition"
                                                alt="banner img"
                                            />
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/products/category/${item?.catId}`}
                                            className="box"
                                        >
                                            <img
                                                src={item?.images[0]}
                                                className="cursor w-100 transition"
                                                alt="banner img"
                                            />
                                        </Link>
                                    )}
                                </div>
                            );
                        })}


            </div>
        </>
    )
}

export default Sidebar;