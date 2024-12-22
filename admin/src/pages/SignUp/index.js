import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/pattern.webp";
import { MyContext } from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaPhoneAlt } from "react-icons/fa";

import googleIcon from "../../assets/images/googleIcon.png";
import { IoMdHome } from "react-icons/io";
import { postData } from "../../utils/api";

import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = (e) => {
    e.preventDefault();
    try {
      if (formfields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Tên không được để trống!",
        });
        return false;
      }

      if (formfields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Email không được để trống!",
        });
        return false;
      }

      if (formfields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Số điện thoại không được để trống",
        });
        return false;
      }

      if (formfields.password === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Mật khẩu không được để trống!",
        });
        return false;
      }

      if (formfields.confirmPassword === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Vui lòng nhập lại mật khẩu!",
        });
        return false;
      }

      if (formfields.confirmPassword !== formfields.password) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Mật khẩu không trùng khớp!",
        });
        return false;
      }

      setIsLoading(true);

      postData("/api/user/signup", formfields)
        .then((res) => {
          console.log(res);

          if (res.status !== "FAILED") {
            context.setAlertBox({
              open: true,
              error: false,
              msg: res?.msg,
            });

            setTimeout(() => {
              setIsLoading(true);
              history("/login");
            }, 2000);
          } else {
            setIsLoading(false);
            context.setAlertBox({
              open: true,
              error: true,
              msg: res.msg,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error posting data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
          isAdmin: true,
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          try {
            if (res.error !== true) {
              localStorage.setItem("token", res.token);

              const user = {
                name: res.user?.name,
                email: res.user?.email,
                userId: res.user?.id,
              };

              localStorage.setItem("user", JSON.stringify(user));

              context.setAlertBox({
                open: true,
                error: false,
                msg: res.msg,
              });

              setTimeout(() => {
                context.setIsLogin(true);
                history("/dashboard");
              }, 2000);
            } else {
              context.setAlertBox({
                open: true,
                error: true,
                msg: res.msg,
              });
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        });

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Đăng nhập thành công!",
        });

        // window.location.href = "/";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Email da duoc su dung
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: errorMessage,
        });
        // ...
      });
  };

  return (
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection signUpSection">
        <div className="loginBox">
          <Link
            to={"/"}
            className="d-flex align-items-center flex-column logo"
          >
            <img src={Logo} />
            <span className="ml-2">SMARTFOOD</span>
          </Link>

          <div className="wrapper mt-3 card border ">
            <form onSubmit={signUp}>
              <div
                className={`form-group position-relative ${inputIndex === 0 && "focus"
                  }`}
              >
                <span className="icon">
                  <FaUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ và tên"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  autoFocus
                  name="name"
                  onChange={onchangeInput}
                />
              </div>

              <div
                className={`form-group position-relative ${inputIndex === 1 && "focus"
                  }`}
              >
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                  name="email"
                  onChange={onchangeInput}
                />
              </div>

              <div
                className={`form-group position-relative ${inputIndex === 2 && "focus"
                  }`}
              >
                <span className="icon">
                  <FaPhoneAlt />
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Số điện thoại"
                  onFocus={() => focusInput(2)}
                  onBlur={() => setInputIndex(null)}
                  name="phone"
                  onChange={onchangeInput}
                />
              </div>

              <div
                className={`form-group position-relative ${inputIndex === 3 && "focus"
                  }`}
              >
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={`${isShowPassword === true ? "text" : "password"}`}
                  className="form-control"
                  placeholder="Mật khẩu"
                  onFocus={() => focusInput(3)}
                  onBlur={() => setInputIndex(null)}
                  name="password"
                  onChange={onchangeInput}
                />

                <span
                  className="toggleShowPassword"
                  onClick={() => setisShowPassword(!isShowPassword)}
                >
                  {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
              </div>

              <div
                className={`form-group position-relative ${inputIndex === 4 && "focus"
                  }`}
              >
                <span className="icon">
                  <IoShieldCheckmarkSharp />
                </span>
                <input
                  type={`${isShowConfirmPassword === true ? "text" : "password"
                    }`}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  onFocus={() => focusInput(4)}
                  onBlur={() => setInputIndex(null)}
                  name="confirmPassword"
                  onChange={onchangeInput}
                />

                <span
                  className="toggleShowPassword"
                  onClick={() =>
                    setisShowConfirmPassword(!isShowConfirmPassword)
                  }
                >
                  {isShowConfirmPassword === true ? (
                    <IoMdEyeOff />
                  ) : (
                    <IoMdEye />
                  )}
                </span>
              </div>

              {
                // <FormControlLabel
                //   control={<Checkbox />}
                //   label="I agree to the all Terms & Condiotions"
                // />
              }

              <div className="form-group">
                <Button
                  type="submit"
                  className="btn-blue btn-lg w-100 btn-big"
                >
                  {isLoading === true ? <CircularProgress /> : "Đăng Ký "}
                </Button>
              </div>

              <div className="form-group text-center mb-0">
                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                  <span className="line"></span>
                  <span className="txt">hoặc</span>
                  <span className="line"></span>
                </div>

                <Button
                  variant="outlined"
                  className="w-100 btn-lg btn-big loginWithGoogle"
                  onClick={signInWithGoogle}
                >
                  <img src={googleIcon} width="25px" /> &nbsp; Tiếp tục với Google
                </Button>
              </div>
            </form>

          </div>
          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              Bạn đã có tài khoản?
              <Link to={"/login"} className="link color ml-2">
                Đăng nhập
              </Link>
            </span>

          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
