import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, FormGroup, Checkbox } from '@mui/material';
import { fetchDataFromApi, postData } from '../../utils/api';
import { MyContext } from '../../App';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const diseases = [
    'Kidney Disease', 'Hypertension', 'Heart Disease', 'Diabetes', 'Acne', 'Osteoporosis',
];
const diseaseTranslation = {
    "Kidney Disease": "Bệnh thận",
    "Hypertension": "Tăng huyết áp",
    "Heart Disease": "Bệnh tim",
    "Diabetes": "Bệnh tiểu đường",
    "Acne": "Mụn trứng cá",
    "Osteoporosis": "Loãng xương"
};



function getStyles(disease, diseaseName, theme) {
    return {
        fontWeight: diseaseName.includes(disease)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AIForm = () => {

    const context = useContext(MyContext);
    const [dietary, setdietary] = React.useState('');
    const [activityLevel, setactivityLevel] = React.useState('');

    const [isOpenModal, setisOpenModal] = useState(false);

    const [forms, setForms] = useState({
        age: "",
        gender: "",
        weight: "",
        height: "",
        dietary: "omnivorous",
        activityLevel: "Lightly Active",
        healthConditions: [],
        userId: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        const user = JSON.parse(localStorage.getItem("user"));

        forms.userId = user?.userId;


        console.log(forms)

        postData("/api/healthForm/add", forms).then((res) => {

        })
    };

    const changeDiet = (event) => {
        setdietary(event.target.value);
        forms.dietary = event.target.value
    };
    const changeActivity = (event) => {
        setactivityLevel(event.target.value)
        forms.activityLevel = event.target.value
    };
    const changeDietary = (event) => {
        const {
            target: { value },
        } = event;
        setDiseaseName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const onChangeInput = (e) => {
        setForms(() => ({
            ...forms,
            [e.target.name]: e.target.value
        }))
    }

    const theme = useTheme();
    const [diseaseName, setDiseaseName] = React.useState([]);

    return (
        <>
            <Button className='formAI' onClick={() => setisOpenModal(true)}>
                <div className='info d-flex flex-column'>
                    <span className='label'>Tư Vấn</span>
                </div>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setisOpenModal(false)} className='aiform' TransitionComponent={Transition}>
                <div className="dialogContent">
                    <h4 className='mb-0'>Vui lòng nhập các thông tin dưới đây</h4>
                    <Button className='close_' onClick={() => setisOpenModal(false)}><MdClose /></Button>
                    <form onSubmit={handleSubmit}>
                        <div className="w-auto mt-3">
                            <TextField
                                label="Tuổi"
                                id="standard-size-small"
                                defaultValue="Small"
                                size="small"
                                variant="standard"
                                type='number'
                                className='w-100'
                                name='age' onChange={onChangeInput}
                                value={forms.age}
                            />
                        </div>
                        <div className='mt-4'>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Giới tính</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="male"
                                    className='ml-3'
                                    value={forms.gender}
                                    name='gender' onChange={onChangeInput}
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Nam" />
                                    <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="d-flex">
                            <FormControl className='w-50' variant="standard" sx={{ mr: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">Chiều cao</InputLabel>
                                <Input
                                    id="standard-adornment-weight"
                                    endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    name='height' onChange={onChangeInput}
                                    value={forms.height}
                                />
                            </FormControl>

                            <FormControl className='w-50' variant="standard" sx={{ ml: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">Cân nặng</InputLabel>
                                <Input
                                    id="standard-adornment-height"
                                    endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                    aria-describedby="standard-height-helper-text"
                                    inputProps={{
                                        'aria-label': 'height',
                                    }}
                                    name='weight' onChange={onChangeInput}
                                    value={forms.weight}
                                />
                            </FormControl>
                        </div>

                        <div className="d-flex mt-4">
                            <FormControl className='w-50' variant="standard" sx={{ mr: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">Chế độ ăn</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={forms.dietary}
                                    onChange={changeDiet}
                                    label="Chế độ ăn"
                                    name='dietary'
                                >
                                    <MenuItem value="vegan">Ăn chay</MenuItem>
                                    <MenuItem value="vegetarian">Ăn thuần chay</MenuItem>
                                    <MenuItem value="omnivorous">Ăn tạp</MenuItem>
                                    <MenuItem value="pescatarian">Pescatarian</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl className='w-50' variant="standard" sx={{ ml: 1 }}>
                                <InputLabel id="demo-simple-select-standard-label">Mức độ vận động</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={forms.activityLevel}
                                    onChange={changeActivity}
                                    label="Mức độ vận động"
                                    name='activityLevel'
                                >
                                    <MenuItem value="Sedentary">Ít vận động</MenuItem>
                                    <MenuItem value="Lightly Active">Vận động nhẹ</MenuItem>
                                    <MenuItem value="Moderately Active">Vận động nhiều</MenuItem>
                                    <MenuItem value="Very Active">Vận động rất nhiều</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className='mt-4 mb-4'>
                            <FormControl className='w-100'>
                                <InputLabel id="demo-multiple-chip-label">Tình trạng sức khỏe</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={forms.healthConditions}
                                    onChange={(e) => {
                                        setForms({
                                            ...forms,
                                            healthConditions: e.target.value
                                        });
                                    }}
                                    input={<OutlinedInput id="select-multiple-chip" label="Tình trạng sức khỏe" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={diseaseTranslation[value] || value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {diseases.map((disease) => (
                                        <MenuItem
                                            key={disease}
                                            value={disease}
                                            style={getStyles(disease, forms.healthConditions, theme)}
                                        >
                                            {diseaseTranslation[disease] || disease}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                        </div>

                        <Button variant="contained" type="submit" className='btn-blue bg-red btn-lg btn-big w-100 mt-2'>
                            Gửi
                        </Button>
                    </form>
                </div>
            </Dialog>

            <div>
                
            </div>

        </>
    );
};

export default AIForm;


// import React, { useContext, useState } from 'react';
// import Button from '@mui/material/Button';
// import { MdClose } from "react-icons/md";
// import Slide from '@mui/material/Slide';
// import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select, Input, InputAdornment, Box, Chip } from '@mui/material';
// import { postData } from '../../utils/api';
// import { MyContext } from '../../App';
// import { useTheme } from '@mui/material/styles';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };
// const diseases = [
//     'Kidney Disease', 'Hypertension', 'Heart Disease', 'Diabetes', 'Acne', 'Osteoporosis',
// ];
// const diseaseTranslation = {
//     "Kidney Disease": "Bệnh thận",
//     "Hypertension": "Tăng huyết áp",
//     "Heart Disease": "Bệnh tim",
//     "Diabetes": "Bệnh tiểu đường",
//     "Acne": "Mụn trứng cá",
//     "Osteoporosis": "Loãng xương"
// };

// const AIForm = () => {
//     const [isOpenModal, setisOpenModal] = useState(false);
//     const [forms, setForms] = useState({
//         age: "",
//         gender: "male",
//         weight: "",
//         height: "",
//         dietary: "omnivorous",
//         activityLevel: "Lightly Active",
//         healthConditions: [],
//         userId: "",
//     });

//     const [response, setResponse] = useState(null); // Thêm state để lưu phản hồi từ Flask

//     const onChangeInput = (e) => {
//         setForms({
//             ...forms,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const user = JSON.parse(localStorage.getItem("user"));
//         forms.userId = user?.userId;

//         const response = await postData("/api/health", forms); // Gửi dữ liệu lên Flask
//         setResponse(response); // Lưu phản hồi vào state
//     };

//     const theme = useTheme();

//     return (
//         <>
//             <Button onClick={() => setisOpenModal(true)}>
//                 Tư Vấn
//             </Button>

//             <Slide direction="up" in={isOpenModal} mountOnEnter unmountOnExit>
//                 <div className="dialogContent">
//                     <h4>Vui lòng nhập các thông tin dưới đây</h4>
//                     <Button onClick={() => setisOpenModal(false)}>
//                         <MdClose />
//                     </Button>
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             label="Tuổi"
//                             type="number"
//                             name="age"
//                             value={forms.age}
//                             onChange={onChangeInput}
//                         />

//                         <FormControl>
//                             <FormLabel>Giới tính</FormLabel>
//                             <RadioGroup
//                                 value={forms.gender}
//                                 name="gender"
//                                 onChange={onChangeInput}
//                             >
//                                 <FormControlLabel value="male" control={<Radio />} label="Nam" />
//                                 <FormControlLabel value="female" control={<Radio />} label="Nữ" />
//                             </RadioGroup>
//                         </FormControl>

//                         <FormControl>
//                             <Input
//                                 name="height"
//                                 value={forms.height}
//                                 onChange={onChangeInput}
//                                 endAdornment={<InputAdornment position="end">cm</InputAdornment>}
//                                 placeholder="Chiều cao"
//                             />
//                         </FormControl>

//                         <FormControl>
//                             <Input
//                                 name="weight"
//                                 value={forms.weight}
//                                 onChange={onChangeInput}
//                                 endAdornment={<InputAdornment position="end">kg</InputAdornment>}
//                                 placeholder="Cân nặng"
//                             />
//                         </FormControl>

//                         <Select
//                             name="healthConditions"
//                             multiple
//                             value={forms.healthConditions}
//                             onChange={(e) => setForms({ ...forms, healthConditions: e.target.value })}
//                             renderValue={(selected) => selected.join(', ')}
//                             MenuProps={MenuProps}
//                         >
//                             {diseases.map((disease) => (
//                                 <MenuItem key={disease} value={disease}>
//                                     {diseaseTranslation[disease] || disease}
//                                 </MenuItem>
//                             ))}
//                         </Select>

//                         <Button type="submit">Gửi</Button>
//                     </form>
//                 </div>
//             </Slide>

//             {response && (
//                 <div>
//                     <p>BMI: {response.bmi}</p>
//                     <p>Condition: {response.condition}</p>
//                     <p>Nutrition Recommendations: {response.nutrition_recommendation}</p>
//                     <h3>Recommended Products:</h3>
//                     <ul>
//                         {response.recommended_products.map((product, index) => (
//                             <li key={index}>
//                                 {product.name}: {product.nutrition}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AIForm;
