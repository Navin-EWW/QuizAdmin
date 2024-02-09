import { ArrowLeftIcon, HomeModernIcon } from "@heroicons/react/24/outline";
// import { current } from "@reduxjs/toolkit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminRoles, AdminUser } from "../../../api/admin/admin";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import Spinner from "../../../utils/Spinner";

import UseToast from "../../../hooks/useToast";
import SubjectAbout from "./SubjectAbout";
import Subjectlog from "./SubjectLog";
import moment from "moment";
import {
  AddSubject,
  SubjectListById,
  UpdateSubject,
} from "../../../api/quiz/quizApi";
import { subjectResponseType } from "../../../types/quiz";
import { object, string } from "yup";
import { useFormik } from "formik";
import { capitalizeFirst } from "../../../utils/Capitalization";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { debounce } from "lodash";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function SubjectDetail() {
  const [subjectData, setsubjectData] = useState<subjectResponseType>();
  const [editCnt, setEditCnt] = useState(true);
  const [apiErrors, setapiErrors] = useState<any>("");

  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [tabRedirect, settabRedirect] = useState<boolean>(false);

  const navigate = useNavigate();
  let { id } = useParams();

  const SubjectBasicSchema = object().shape({
    subjectName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "Subject name must contain alphabet ")
      .min(2, "Minimum 2 characters are required in subject name.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in subject name.")
      .max(35, "Too long"),
    descriptionName: string().min(
      2,
      "Minimum 2 characters are required in subject name."
    ),
  });
  const { mutate, error, isLoading } = useMutation(AddSubject, {
    onSuccess: (data) => {
      UseToast(data.message, "success");
      setEditCnt(!editCnt);
    },
    onError: (error) => {
      console.log(error);
      setEditCnt(!editCnt);
      typeof error === "string"
        ? setapiErrors({ status: false, message: error })
        : setapiErrors(error);
    },
  });

  const refechData = useCallback(
    debounce(() => refetch(), 500),
    []
  );
  const {
    mutate: updateSubject,
    error: updateErrorSubject,
    isLoading: updateIsLoading,
  } = useMutation(UpdateSubject, {
    onSuccess: (data) => {
      UseToast(data.message, "success");
      setEditCnt(!editCnt);
      refechData();
    },
    onError: (error: any) => {
      console.log(error);
      setEditCnt(!editCnt);
      refechData()
      UseToast(error, "error");
      typeof error === "string"
        ? setapiErrors({ status: false, message: error })
        : setapiErrors(error);
    },
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
    validationSchema: SubjectBasicSchema,

    initialValues: {
      subjectName: "",
      descriptionName: "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      console.log(values, "------onSubmit-");

      editCnt
        ? mutate({
            name: values.subjectName ?? "",
            discription: values.descriptionName ?? "",
          })
        : updateSubject({
            id: id,
            name: values.subjectName ?? "",
            discription: values.descriptionName ?? "",
          });
    },
  });

  const { refetch } = useQuery(
    ["SubjectListById"],
    () => SubjectListById({ id: id ?? "" }),
    {
      onSuccess(data) {
        setsubjectData(data.data);
        setFieldValue("subjectName", data.data.name);
        setFieldValue("descriptionName", data.data.discription);
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/subject/list");
      },
    }
  );

  useEffect(() => {
    if (!id) {
      navigate("/admin/list");
      refetch();
    }
  }, [id]);

  const confirmBack = () => {
    settabRedirect(!tabRedirect);
    setEditCnt(true);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  return (
    // <div
    //   className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey
    //    ${
    //     isFetched && "animate-blinking"
    //   }
    //   `}
    // >
    <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey`}>
      <div>
        <Link to="/subject/list" className="flex gap-2 items-end py-4">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Subject listing
        </Link>
      </div>

      <div className="flex justify-between items-center py-5 ">
        <h2 className="pb-4 text-2xl font-semibold text-font_black">
          Subject Details
        </h2>

        <a
          onClick={() => navigate("/subject/add")}
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New Subject
        </a>
      </div>

      {/* {!isLoading && ( */}
      {
        <>
          <div className="flex gap-4 items-center p-5 bg-white rounded-lg shadow-md mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="6" fill="#00145b" />
              <path
                d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 26C20.134 26 17 29.134 17 33H31C31 29.134 27.866 26 24 26Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <span className="text-sm text-font_dark">
                Subject Name
                {/* {data?.role?.name} */}
              </span>
              <p className="text-2xl font-semibold">{subjectData?.name}</p>
            </div>
          </div>

          <div className="bg-white px-5 pt-5 rounded-t-md shadow-md ">
            <div className="flex gap-2 flex-wrap justify-between sm:hidden py-4">
              <button
                type="button"
                onClick={() => setEditCnt(!editCnt)}
                className="bg-blue_primary px-4 py-2 text-white hover:bg-grey_bg rounded-md text-sm"
              >
                Edit Subject Info
              </button>
            </div>

            <div className="hidden sm:flex justify-between items-center border-b border-grey_border_table">
              <div className="">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <p
                    className={classNames(
                      true
                        ? "border-blue_primary text-font_black"
                        : "border-transparent text-font_dark",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium  cursor-pointer"
                    )}
                  >
                    About
                  </p>
                </nav>
              </div>

              {editCnt && (
                <button
                  type="button"
                  onClick={() => setEditCnt(!editCnt)}
                  className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
                >
                  Edit Subject Info
                </button>
              )}
            </div>
            <DialogBox
              showDialog={cancelModel}
              confirmNavigation={confirmBack}
              cancelNavigation={cancelBack}
            />
          </div>

          <div className="relative pb-10">
            <form
              className="space-y-8 shadow-md"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div className="bg-white p-5 rounded-b-md overflow-hidden">
                <div className="space-y-6 sm:space-y-5">
                  <div className="space-y-6 sm:space-y-5 font-Inter">
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                      <label
                        htmlFor="subjectName"
                        className="block text-font_dark font-medium"
                      >
                        {!editCnt ? "Subject Name*" : "Subject Name"}
                      </label>

                      <div className="relative mt-1 sm:col-span-2 sm:mt-0  rounded-md sm:max-w-xs max-w-lg w-full">
                        <input
                          disabled={editCnt}
                          maxLength={35}
                          type="text"
                          name="subjectName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={capitalizeFirst(
                            values?.subjectName
                          ).trimStart()}
                          id="subjectName"
                          className={
                            !editCnt
                              ? `block w-full max-w-lg rounded-md font-normal border  ${
                                  touched?.subjectName &&
                                  Boolean(errors?.subjectName)
                                    ? "border-error_red text-error_text"
                                    : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                                } focus:outline-none sm:max-w-xs py-2 px-3 text-sm   focus:text-font_black`
                              : "block w-full max-w-lg rounded-md font-normal pr-10 bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                          }
                        />

                        {!editCnt &&
                          touched?.subjectName &&
                          Boolean(errors?.subjectName) && (
                            <div className="pointer-events-none absolute top-[9px]  flex items-center right-3 ">
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
                            </div>
                          )}

                        {!editCnt && (
                          <p className="mt-21 text-sm text-error_red">
                            {touched?.subjectName &&
                            Boolean(errors?.subjectName)
                              ? errors.subjectName
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label
                        htmlFor="userId"
                        className="block text-font_dark font-medium"
                      >
                        {!editCnt ? "User Id*" : "User Id"}
                      </label>

                      <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                        <input
                          disabled={true}
                          maxLength={35}
                          type="text"
                          name="userId"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={subjectData?.id}
                          id="userId"
                          className={
                            !editCnt
                              ? `block w-full max-w-lg rounded-md font-normal border border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:outline-none sm:max-w-xs py-2 px-3 text-sm focus:text-font_black`
                              : "block w-full max-w-lg rounded-md pr-10 font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm "
                          }
                        />
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label
                        htmlFor="descriptionName"
                        className="block text-font_dark font-medium"
                      >
                        Discription
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <textarea
                          name="descriptionName"
                          style={{ resize: editCnt ? "none" : "vertical" }}
                          maxLength={100}
                          id="descriptionName"
                          value={
                            editCnt
                              ? subjectData?.discription
                              : values?.descriptionName ?? ""
                          }
                          placeholder=""
                          onChange={handleChange}
                          disabled={editCnt}
                          rows={values?.descriptionName.length > 100 ? 4 : 2}
                          className={
                            editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>

                    {!editCnt && (
                      <div className="py-5">
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="min-w-[151.44px] rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
                          >
                            {/* {isLoading ? <ButtonSpinner /> : "Create New Subject  "}
                             */}
                            save
                          </button>

                          <button
                            type="button"
                            className="ml-3 inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
                            onClick={() => setEditCnt(!editCnt)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      }

      {/* {(isLoading || !data) && <Spinner />} */}
    </div>
  );
}
