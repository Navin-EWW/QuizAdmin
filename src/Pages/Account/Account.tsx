import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";
import { ResetPassword, UserProfile } from "../../api/account/account.api";
import LogOutModel from "../../Components/LogOutModel/LogOutModel";
import UseToast from "../../hooks/useToast";
import Spinner from "../../utils/Spinner";
import { AccountResponseType } from "../../types/account";
import moment from "moment";

export function MyAccount() {
  const [account, setAccount] = useState<AccountResponseType>({
    firstName: "navin",
    lastName: "Kumar",
    fullName: "navin Kumar",
    email: "navinkumar@yopmail.com",
    createdAt: "2024-02-02T10:25:48.427Z",
  });
  const [password, setPassword] = useState(false);
  const [logOutOpen, setlogOutOpen] = useState<boolean>(false);
  
  const { isFetching, refetch } = useQuery(
    ["UserProfile"],
    () => UserProfile(),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          console.log("first");
          // setAccount(data.data);
        }
      },
    }
  );


  const signOutClicked = () => {
    setlogOutOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey font-Inter">
      <div className="py-5">
        <h3 className="text-2xl font-bold">My Account</h3>
      </div>
      {isFetching ? (
        <Spinner />
      ) : (
        <dl className="px-5 py-5 sm:py-0 bg-white rounded-md font-medium md:shadow-md">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:py-5 border-b border-grey_border_table text-sm">
            <label className="text-font_dark">First Name</label>
            <p className="mt-1 sm:col-span-2 capitalize sm:mt-0">{account.firstName}</p>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:py-5 border-b border-grey_border_table text-sm">
            <label className="text-font_dark capitalize">Last Name</label>
            <p className="mt-1 sm:col-span-2 sm:mt-0">{account.lastName}</p>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:py-5 border-b border-grey_border_table text-sm">
            <label className="text-font_dark lowercase">Email</label>
            <p className="mt-1 sm:col-span-2 sm:mt-0">{account.email}</p>
          </div>
          <LogOutModel open={logOutOpen} setOpen={setlogOutOpen} />
          {!password ? (
            <div className="py-4 sm:grid sm:grid-cols-3 sm:py-5 border-b items-center border-grey_border_table text-sm">
              <div className="text-font_dark">Password</div>
              <button
                type="button"
                onClick={() => {
                  setPassword(true);
                }}
                className="mt-1 w-fit sm:mt-0 rounded-md bg-button_color hover:bg-btnClip_hover py-2 px-4 text-blue_primary focus:outline-none tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
              >
                Reset Password
              </button>
            </div>
          ) : (
            <ResetPass setPassword={setPassword} />
          )}
          <div className="py-4 sm:grid sm:grid-cols-3 sm:py-5 border-b border-grey_border_table text-sm">
            <label className="text-font_dark">Created At</label>
            <p className="mt-1 sm:col-span-2 sm:mt-0">{

            moment(account.createdAt).format("dddd , Do MMMM YYYY, h:mm:ss a")
            }</p>
          </div>
        </dl>
      )}
      <div className="flex flex-wrap justify-end mt-5">
        <button
          type="button"
          className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm text-white focus:outline-none tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
          onClick={signOutClicked}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function ResetPass({ setPassword }: any) {
  const [apiError, setApiErrors] = useState<any>({});
  const [pwd, setPwd] = useState<boolean>(false);
  const [cnpwd, setCnpwd] = useState<boolean>(false);
  const [newpwd, setNewpwd] = useState<boolean>(false);

  const { mutate, error }: any = useMutation(ResetPassword, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setPassword(false);
        UseToast(data.message, "success");
      } else {
        // setApiErrors(data);
      }
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setApiErrors({ status: false, message: data })
        : setApiErrors(data);
    },
  });

  const AdminSchema = object().shape({
    current_password: string().required("Required Field"),
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
      )
      .notOneOf(
        [ref("current_password")],
        "Current password and New password can't be the same" ?? ""
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
      current_password: "**********",
      password: "",
      confirm_password: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({
        ...values
      });
      apiError.status && resetForm();
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:grid sm:grid-cols-3 border-b py-4 border-grey_border_table font-Inter"
    >
      <div className="col-span-3 text-sm sm:grid sm:grid-cols-3">
        <label className="block text-font_dark font-medium">
          Current Password
        </label>
        <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
          <input
            onChange={handleChange}
            autoComplete="new-password"
            onBlur={handleBlur}
            disabled={true}
            // type={!pwd ? "password" : "text"}
            type={"password"}
            name="current_password"
            maxLength={15}
            value={(values?.current_password).trimStart()}
            id="current_password"
            placeholder="Current Password"
            className={`block w-full max-w-lg rounded-md font-normal border ${
              touched?.current_password && Boolean(errors?.current_password)
                ? " border-error_red text-error_text"
                : "border-grey_border_table"
            } active:border-blue_primary pr-10 focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `}
          />

          <div className="absolute top-[9px] flex items-center right-3">
            {true ? (
              <svg
                onClick={() => setPwd(!pwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border cursor-pointer"
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
                onClick={() => setPwd(!pwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border cursor-pointer "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>

          {touched?.current_password && Boolean(errors?.current_password) && (
            <p className="mt-21 text-sm text-error_red" id="email-error">
              {errors?.current_password}
            </p>
          )}
        </div>
      </div>

      <div className="col-span-3 text-sm sm:grid sm:grid-cols-3 pt-5">
        <label className="block text-font_dark font-medium">New Password</label>
        <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
          <input
            autoComplete="none"
            onChange={handleChange}
            onBlur={handleBlur}
            type={!newpwd ? "password" : "text"}
            name="password"
            maxLength={15}
            value={(values?.password).trimStart()}
            id="password"
            placeholder="New Password"
            className={`block w-full max-w-lg rounded-md font-normal border ${
              touched?.password && Boolean(errors?.password)
                ? " border-error_red text-error_text"
                : "border-grey_border_table"
            } active:border-blue_primary pr-10 focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `}
          />
          <div className=" absolute top-[9px]  flex items-center right-3">
            {newpwd ? (
              <svg
                onClick={() => setNewpwd(!newpwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border  cursor-pointer"
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
                onClick={() => setNewpwd(!newpwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>

          {touched?.password && Boolean(errors?.password) && (
            <p className="mt-21 text-sm text-error_red" id="email-error">
              {errors?.password}
            </p>
          )}
        </div>
      </div>

      <div className="col-span-3 text-sm sm:grid sm:grid-cols-3 pt-5">
        <label
          htmlFor="re_enter_pass"
          className="block text-font_dark font-medium"
        >
          Repeat New Password
        </label>
        <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
          <input
            autoComplete="none"
            onChange={handleChange}
            onBlur={handleBlur}
            type={!cnpwd ? "password" : "text"}
            name="confirm_password"
            id="confirm_password"
            maxLength={15}
            value={(values?.confirm_password).trimStart()}
            placeholder="Confirm New Password"
            className={`block w-full max-w-lg rounded-md font-normal border ${
              touched?.confirm_password && Boolean(errors?.confirm_password)
                ? " border-error_red text-error_text"
                : "border-grey_border_table active:border-blue_primary focus:text-font_black"
            }  focus:outline-none sm:max-w-xs pr-10 py-2 px-3 text-sm `}
          />

          <div className=" absolute top-[9px] flex items-center right-3">
            {cnpwd ? (
              <svg
                onClick={() => setCnpwd(!cnpwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border cursor-pointer"
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
                onClick={() => setCnpwd(!cnpwd)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-grey_border cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </div>

          {touched?.confirm_password && Boolean(errors?.confirm_password) && (
            <p className="mt-21 text-sm text-error_red" id="email-error">
              {errors?.confirm_password}
            </p>
          )}

          {apiError?.message && (
            <p className="mt-21 text-sm text-error_red" id="email-error">
              {apiError?.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex col-span-1 col-start-2 gap-3 pt-5">
        <button
          type="submit"
          className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
        >
          Confirm
        </button>

        <button
          type="button"
          onClick={() => {
            setPassword(false);
          }}
          className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
