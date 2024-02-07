/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AdminForgotPasswordAPI } from "../../api/auth/admin.api";
import ForgotPasswordFormCheck from "./ForgotPasswordValidator";
import _ from "lodash";
import { ErrorsState } from ".";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../Components/AppHeader/Headers";
import { useFormik } from "formik";
import { object, string } from "yup";

export function ForgotPassword() {
  const [error, setErrors] = useState<ErrorsState>({});
  const search = useLocation().search;
  // const User=new URLSearchParams(search).get("userType");
  const [UserType] = useState(new URLSearchParams(search).get("userType"));
  const [LinkSended, setLinkSended] = useState(true);

  const [userData, setUserData] = useState({
    email: "",
    userType: "",
  });

  const { t } = useTranslation();
  const [apiError, setApiErrors] = useState<ErrorsState>({});

  const { mutate } = useMutation(AdminForgotPasswordAPI, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setLinkSended(!LinkSended);
      }
    },
    onError: (data: ErrorsState) => {
      setApiErrors(data);
    },
  });

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setApiErrors({});
      }, 7000);
    }
  }, [apiError]);

  const AdminSchema = object().shape({
    email: string()
      .email("Invalid Email Format. Please try again.")
      .required("Required Field")
      .max(100, "Too long"),
  });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: AdminSchema,

    initialValues: {
      email: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      mutate({
        email: values.email,
        userType: "ADMIN",
      });

      resetForm();
    },

    onReset: () => {},
  });

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const userType = params.get("userType");
    setUserData({
      ...userData,
      userType: "ADMIN",
    });
  }, []);

  return (
    <>
      <Header />
      {LinkSended ? (
        <section className={`bg-background_grey min-h-screen`}>
          <Link
            to={"/login"}
            className="container px-4 font-bold text-font_dark text-sm flex items-center gap-2 font-Nunito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25"
              />
            </svg>
            <span>Back to sign in</span>
          </Link>

          <div className="container flex items-center justify-center py-[7.3rem] px-4">
            <div className="w-full max-w-md">
              <h2 className="text-center font-Nunito font-bold text-font_black text-text_28 uppercase">
                forgot password
              </h2>
              <p className="text-font_black text-base font-regular pt-2 pb-5">
                Lost your password? Please enter your email address. You will
                receive a link to create a new password via email.
              </p>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="">
                  <div className="font-Nunito mb-8">
                    <label
                      htmlFor="email-address"
                      className="inline-block mb-2 text-grey_border font-normal text-sm"
                    >
                      {UserType === "ADMIN"
                        ? "Email Address"
                        : t("ForgotPassword.EmailAddress")}
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        id="email-address"
                        name="email"
                        type="text"
                        maxLength={100}
                        autoComplete="email"
                        className={`w-full pr-10 border ${
                          touched?.email && Boolean(errors?.email)
                            ? "border-error_red text-error_text"
                            : "border-grey_border"
                        }  px-3 py-3 text-grey_border placeholder-grey_border focus:outline-none text-base bg-white`}
                        placeholder={"Email Address"}
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />

                      <div className="pointer-events-none absolute inset-y-1 flex items-center right-3 bg-white">
                        {touched?.email && Boolean(errors?.email) && (
                          <svg
                            className="h-5 w-5 fill-error_red ml-3"
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
                        )}
                      </div>
                    </div>
                    {touched?.email && Boolean(errors?.email) && (
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full items-center border border-transparent bg-blue_primary hover:bg-hoverChange px-6 py-3 text-base font-Nunito font-normal text-white shadow-sm focus:outline-none"
                  >
                    {"Send"}
                  </button>
                </div>
                {apiError && apiError.message && (
                  <p
                    className="mt-21 mb-2 text-sm text-error_red"
                    id="email-error"
                  >
                    {apiError.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-background_grey min-h-screen">
          <div className="container">
            <Link
              to="/login"
              className="px-4 font-bold text-font_dark text-sm flex items-center gap-2 font-Nunito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25"
                />
              </svg>
              <span>Back to sign in</span>
            </Link>
            <div className="flex justify-center items-center w-full min-h-[500px]">
              <div className=" max-w-md mx-auto py-29 px-4">
                <h2 className="text-center font-Nunito font-bold text-font_black text-text_28 uppercase">
                  Reset link sent
                </h2>
                <p className="font-Nunito text-center font-normal pt-4 text-font_black">
                  Check your inbox for the link to reset your password.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
