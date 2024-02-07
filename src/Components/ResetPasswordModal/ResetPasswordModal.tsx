import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import _ from "lodash";

type Props = {};

export default function ResetPasswordModal({
  onBlur,
  confirm_passwordError,
  passwordError,
  open,
  setOpen,
  handleSubmit,
  onChange,
  disableEyeIcon,
  confirmPasswordStatus,
  passwordStatus,
  resetForm,
  apiError,
}: any) {
  const [pwd, setPwd] = useState(false);
  const [cnpwd, setCnpwd] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-font_black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-lg sm:p-6">
                <div className="flex justify-between items-center border-b border-grey_border_table pb-5">
                  <span className="font-bold text-xl">Reset Password</span>
                  <button
                    type="button"
                    className="bg-white hover:bg-grey_bg"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mt-3">
                    <div className="relative w-full mb-4">
                      <label htmlFor="new_pass" className="block mb-2">
                        New Password
                      </label>
                      <input
                        onBlur={onBlur}
                        type={!pwd ? "password" : "text"}
                        id="password"
                        name="password"
                        maxLength={15}
                        onChange={onChange}
                        className={`w-full rounded-md font-normal border ${
                          passwordStatus
                            ? "border-error_red  text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                        }  focus:outline-none pr-10 py-2 z-0 px-3 text-sm `}
                      />

                      {!disableEyeIcon && (
                        <div className="absolute top-[40px] flex items-center right-3 ">
                          {pwd ? (
                            <svg
                              onClick={() => setPwd(!pwd)}
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
                              onClick={() => setPwd(!pwd)}
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
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          )}
                        </div>
                      )}

                      {passwordStatus && (
                        <p
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {passwordError}
                        </p>
                      )}
                    </div>

                    <div className="relative w-full mb-4">
                      <label htmlFor="confirm_pass" className="block mb-2">
                        Repeat New Password
                      </label>
                      <input
                        onBlur={onBlur}
                        type={!cnpwd ? "password" : "text"}
                        id="confirm_password"
                        name="confirm_password"
                        maxLength={15}
                        onChange={onChange}
                        className={`w-full rounded-md font-normal border ${
                          confirmPasswordStatus
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                        }  focus:text-font_black focus:outline-none py-2 px-3 text-sm `}
                      />

                      {!disableEyeIcon && (
                        <div className="absolute top-[40px] flex items-center right-3 bg-white">
                          {cnpwd ? (
                            <svg
                              onClick={() => setCnpwd(!cnpwd)}
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
                      )}

                      {confirmPasswordStatus && (
                        <p
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {confirm_passwordError}
                        </p>
                      )}
                    </div>

                    {apiError && (
                      <p className="mt-21 text-sm text-error_red">{apiError}</p>
                    )}
                  </div>
                  <div className="mt-5 flex gap-5">
                    <button
                      type="submit"
                      className="w-full rounded-md px-5 py-2 bg-blue_primary hover:bg-hoverChange text-white"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-md border border-grey_border_table px-5 py-2"
                      onClick={() => {
                        setOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// export interface ErrorsStateResetPassword {
//   [id: string]: string
// }

// const initialResetPasswordData: ResetPasswordDataType = {
//   password: '',
//   confirm_password: ''
// }

// export interface ResetPasswordDataType {
//   password: string,
//   confirm_password: string
// }
