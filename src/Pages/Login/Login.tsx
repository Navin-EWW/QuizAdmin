/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSignInAPI } from "../../api/auth/admin.api";
import { AxiosResponse } from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { object, string } from "yup";
import UseToast from "../../hooks/useToast";
import { useAuthStore } from "../../store/auth";
import ButtonSpinner from "../../utils/ButtonSpinner";


export function Login() {
  const { setToken, setUser, token } = useAuthStore();
  const [show, setShow] = useState<boolean>(false);
  const [apiError, setApiErrors] = useState<string | any>("");
  const navigate = useNavigate();
  const {
    mutate,
    isLoading: loading,
    error: mutateError,
  }: {
    mutate: UseMutateFunction<AxiosResponse<any, any>, unknown, any, unknown>;
    error: any;
    isLoading: boolean;
  } = useMutation(AdminSignInAPI, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setToken(data.accessToken);
        setUser(data.data);
        navigate("/dashboard");
        UseToast(data?.message);
      }
    },
    onError: (data: any) => {
      typeof data !== "string"
        ? setApiErrors(data?.message)
        : setApiErrors(data);
    },
  });

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setApiErrors("");
      }, 7000);
    }
  }, [apiError]);

  const AdminSchema = object().shape({
    email: string()
      .email("Invalid Email Format. Please try again.")
      .required("Required Field"),

    password: string().required("Required Field").trim("Required Field"),
  });

  const { handleSubmit, handleBlur, handleChange, errors, touched } = useFormik(
    {
      validationSchema: AdminSchema,

      initialValues: {
        deviceType: "WEB",
        userType: "USER",
        rememberMe: false,
        email: "",
        password: "",
      },

      onSubmit: async (values, { resetForm }) => {
        event?.preventDefault();
        localStorage.setItem("rememberMe", JSON.stringify(values.rememberMe));
        if (useAuthStore.persist) {
          useAuthStore.persist.setOptions({
            getStorage: () =>
              values.rememberMe ? localStorage : sessionStorage,
          });
          useAuthStore.persist.rehydrate();
        }
        mutate({
          email: values.email,
          password: values.password,
          deviceType: "WEB",
          userType: "ADMIN",
        });

        // resetForm();
      },

      onReset: () => {},
    }
  );

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
    localStorage.setItem(
      "persist:root",
      sessionStorage.getItem("persist:root") || ""
    );
  }, []);

  return (
    <section className="bg-background_grey  min-h-screen">
      <motion.div
        className="container "
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: [0.5, 0.5, 0.5, 0.5],
        }}
        initial={{ opacity: 0 }}
        // whileHover={{ scale: 1.2 }}
      >
        {/* <div className="container"> */}

        <div className="w-full max-w-md mx-auto py-16">
          <div className="flex flex-col justify-center items-center">
         
         <img className="w-20 h-20" src={"./logo.svg"} alt="logo"/>
            <div className="flex justify-center">
              <p className="w-[360px] text-center font-Inter font-extrabold text-font_black text-3xl tracking-[-1px]">
                Sign in to your account
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white p-8 rounded-md w-[448px] ">
              <div className="font-Inter">
                <label
                  htmlFor="email-address"
                  className="inline-block mb-2 text-font_dark font-medium text-sm"
                >
                  Email Address
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    disabled={loading}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="email-address"
                    name="email"
                    type="email"
                    // maxLength={70}
                    autoComplete="email"
                    className={`w-full border-2 pr-10 ${
                      touched?.email && errors?.email
                        ? "border-error_red text-error_text"
                        : "border-grey_border_table"
                    } px-3 py-3  placeholder-grey_border focus:outline-none bg-white rounded-md`}
                    placeholder="Email Address"
                  />
                  {touched?.email && errors?.email && (
                    <div className="pointer-events-none absolute top-4 right-3 flex items-center">
                      <svg
                        className="h-5 w-5 fill-error_red"
                        x-description="Heroicon name: mini/exclamation-circle"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {touched?.email && errors?.email && (
                <p className="mt-21 text-sm text-error_red" id="email-error">
                  {errors.email}
                </p>
              )}

              <div className="pt-4 relative font-Inter">
                <label
                  htmlFor="password"
                  className="inline-block mb-2 text-font_dark text-sm font-medium"
                >
                  Password
                </label>
                <input
                  // value={values.password}
                  disabled={loading}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="password"
                  name="password"
                  maxLength={15}
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className={`w-full pr-10 border-2 ${
                    touched?.password && errors?.password
                      ? "border-error_red text-error_text"
                      : "border-grey_border_table"
                  } px-3 py-3 placeholder-grey_border pr-10 focus:outline-none text-base bg-white rounded-md`}
                  placeholder="Password"
                />
                <div className="absolute right-3 bottom-3">
                  <a className="cursor-pointer" onClick={() => setShow(!show)}>
                    {show ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 stroke-grey_border"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 stroke-grey_border"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </a>
                </div>
              </div>
              {touched?.password && errors?.password && (
                <p className="mt-21 text-sm text-error_red" id="email-error">
                  {errors.password}
                </p>
              )}

              <div className="flex items-center justify-between py-6">
                <div className="flex gap-3 items-center">
                  <input
                    onChange={handleChange}
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="signin-check relative h-4 w-4 rounded appearance-none checked:bg-blue_primary cursor-pointer border border-1 border-grey_border checked:border-none focus:ring-grey_border after:absolute"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-font_black font-normal font-Inter text-sm"
                  >
                    Stay Logged In
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue_primary font-Inter text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
              <div>
                {apiError && (
                  <p className="mb-4 text-sm text-error_red" id="email-error">
                    {apiError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full items-center border border-transparent rounded-md bg-blue_primary hover:bg-hoverChange px-6 py-3 text-base font-Inter font-medium text-white shadow-sm focus:outline-none"
                >
                  {loading ? <ButtonSpinner /> : "Sign In"}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* </div> */}
        {/* {loading && <Spinner/>} */}
      </motion.div>
    </section>
  );
}
