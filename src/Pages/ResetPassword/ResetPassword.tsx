/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  AdminResetPasswordCheckInAPI,
  AdminResetPasswordAPI,
} from "../../api/auth/admin.api";
import _ from "lodash";
import ResetSuccess from "./ResetSuccess";
import Header from "../../Components/AppHeader/Headers";
import ResetLinkExpired from "./ResetLinkExpired";
import { useFormik } from "formik";
import { object, ref, string } from "yup";

export function ResetPassword() {
  const [showp, setShowp] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [apiError, setApiErrors] = useState<any>({});
  const [tokenData, setTokenData] = useState("");
  const [passwordSetSuccess, setSuccess] = useState(false);
  const [linkExpired, setExpired] = useState(false);
  const [userType, setUserType] = useState("");

  const { mutate: resetPasswordMutate } = useMutation(AdminResetPasswordAPI, {
    onSuccess: (data: any) => {
      if (data.status) {
        setSuccess(true);
      }
    },
    onError: (data: any) => {
      setApiErrors(data);
    },
  });

  const AdminSchema = object().shape({
    password: string()
      .required("Required Field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Password must contain at least 8 characters, one uppercase, one lowercase and one number." ??
          ""
      )
      .max(15, "password should be maximum 15 characters")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      ),
    confirm_password: string()
      .required("Required Field")
      .oneOf([ref("password")], "Password must be the same as new password.")
      .max(15, "password should be maximum 15 characters")
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        "A password can’t start or end with a blank space."
      ),
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
      password: "",
      confirm_password: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      resetPasswordMutate({
        body: {
          password: values.password,
          confirm_password: values.confirm_password,
        },
        params: { token: tokenData, userType },
      });

      resetForm();
    },

    onReset: () => {},
  });

  const { mutate: resetPasswordCheckMutate } = useMutation(
    AdminResetPasswordCheckInAPI,
    {
      onSuccess: (data: any) => {},
      onError: (data: any) => {
        if (!data?.status) {
          setApiErrors(data);
        }

        if (data.link_expired) {
          setExpired(true);
        }
      },
    }
  );

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token") || "";
    const userDataType = params.get("userType") === "ADMIN" ? "ADMIN" : "USER";
    setUserType(userDataType === "ADMIN" ? "ADMIN" : "USER");
    setTokenData(token || "");
    resetPasswordCheckMutate({ token, userType: userDataType });
  }, []);

  return (
    <>
      <Header />
      {linkExpired && <ResetLinkExpired userType={userType} />}
      {passwordSetSuccess && <ResetSuccess userType={userType} />}
      {!(linkExpired || passwordSetSuccess) && (
        <section className="bg-background_grey min-h-screen">
          <div className="container flex items-center justify-center py-28 px-4">
            <div className="w-full max-w-md">
              <h2 className="text-center font-Nunito font-bold text-font_black text-text_28 uppercase">
                Reset Password
              </h2>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="">
                  <div className="pt-4 font-Nunito">
                    <label
                      htmlFor="password"
                      className="inline-block mb-2 text-grey_border text-sm font-normal"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id="password"
                        name="password"
                        maxLength={15}
                        type={showp ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Password"
                        className={`w-full border ${
                          touched?.password && errors?.password
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table"
                        } px-3 py-3 text-grey_border pr-10 placeholder-grey_border focus:outline-none text-base bg-white`}
                      />
                      <div
                        className="absolute right-3 bottom-3"
                        onClick={() => setShowp(!showp)}
                      >
                        {!showp ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 stroke-grey_border ml-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {touched?.password && errors?.password && (
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {errors?.password}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 font-Nunito mb-8">
                    <label
                      htmlFor="password"
                      className="inline-block mb-2 text-grey_border text-sm font-normal"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        onBlur={handleBlur}
                        onChange={handleChange}
                        id="confirm_password"
                        maxLength={15}
                        value={values.confirm_password}
                        name="confirm_password"
                        type={showCp ? "text" : "password"}
                        autoComplete="current-password"
                        className={`w-full border ${
                          touched?.confirm_password && errors?.confirm_password
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table"
                        } px-3 py-3 text-grey_border pr-10 placeholder-grey_border focus:outline-none text-base bg-white`}
                        placeholder="Password"
                      />
                      <div
                        className="absolute right-3  bottom-3"
                        onClick={() => setShowCp(!showCp)}
                      >
                        {!showCp ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 stroke-grey_border "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {touched?.confirm_password && errors?.confirm_password && (
                      <p
                        className="mt-21 text-sm text-error_red"
                        id="email-error"
                      >
                        {errors?.confirm_password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full items-center border border-transparent bg-blue_primary hover:bg-hoverChange px-6 py-3 text-base font-Nunito font-normal text-white shadow-sm focus:outline-none"
                  >
                    Save
                  </button>
                </div>

                {apiError?.message && (
                  <p className="mt-21 text-sm text-error_red" id="email-error">
                    {apiError.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
