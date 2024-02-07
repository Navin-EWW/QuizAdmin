import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddAdmin, AdminRoles } from "../../../api/admin/admin";
import _, { debounce } from "lodash";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import UseToast from "../../../hooks/useToast";
import { object, string } from "yup";
import { useFormik } from "formik";
import { capitalizeFirst } from "../../../utils/Capitalization";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { subjectDataType } from "../../../types/quiz";
import { AddSubject } from "../../../api/quiz/quizApi";

export function CreateSubject() {
  // const [errors, setErrors] = useState<ErrorsState>({});

  const [compareToggle, setcompareToggle] = useState<boolean>(false);
  const [apiErrors, setapiErrors] = useState<any>("");

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const navigate = useNavigate();

  const { mutate, error, isLoading } = useMutation(AddSubject, {
    onSuccess: (data: any) => {
      setcompareToggle(false);
      UseToast(data.message, "success");
      successNavigate();
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setapiErrors({ status: false, message: data })
        : setapiErrors(data);
    },
  });

  const successNavigate = useCallback(
    debounce(() => navigate("/admin/list"), 200),
    []
  );

  const createSubjectBasicSchema = object().shape({
    subjectName: string()
      .required("Required Field")
      .matches(/^[A-Za-z\s]+$/, "Subject name must contain alphabet ")
      .min(2, "Minimum 2 characters are required in subject name.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in subject name.")
      .max(35, "Too long"),
    descriptionName: string()
      .min(2, "Minimum 2 characters are required in subject name.")
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
    validationSchema: createSubjectBasicSchema,

    initialValues: {
      subjectName: "",
      descriptionName: "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      console.log(values, "------onSubmit-");
      mutate({
        subjectName: values.subjectName ?? "",
        descriptionName: values.descriptionName ?? "",
      });

      // error?.status && resetForm();
    },
  });


  const cancelClicked = () => {
    navigate("/admin/list");
  };
  useEffect(() => {
    if (!apiErrors.status) {
      setTimeout(() => {
        setapiErrors("");
      }, 7000);
    }
  }, [apiErrors]);

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  return (
    <section>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <div className="px-4 sm:px-6 lg:px-8 bg-background_grey ">
        <div className="flex justify-between items-center py-5 ">
          <h1 className="text-2xl font-semibold text-font_black">
            + New Subject
          </h1>
        </div>

        <form
          className="space-y-1 pb-20"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="bg-white p-5 rounded-md shadow-md">
            <div className="space-y-6 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5 font-Inter">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center  items-start sm:gap-4 sm:pt-5">
                  <label
                    htmlFor="subjectName"
                    className="block text-font_dark font-medium"
                  >
                    Subject Name*
                  </label>

                  <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                    <input
                      disabled={isLoading}
                      type="text"
                      name="subjectName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      maxLength={35}
                      value={capitalizeFirst(values?.subjectName).trimStart()}
                      id="subjectName"
                      className={`block w-full max-w-lg rounded-md font-normal border ${
                        touched?.subjectName && Boolean(errors?.subjectName)
                          ? "border-error_red text-error_text"
                          : "border-grey_border_table"
                      } focus:outline-none sm:max-w-xs py-2 pr-10  px-3 text-sm   active:border-blue_primary focus:text-font_black`}
                    />

                    {touched?.subjectName && Boolean(errors?.subjectName) && (
                      <div className="pointer-events-none absolute top-[9px] flex items-center right-3">
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

                    {touched?.subjectName && Boolean(errors?.subjectName) && (
                      <p className="mt-21 text-sm text-error_red">
                        {errors?.subjectName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="descriptionName"
                    className="block text-font_dark font-medium"
                  >
                    Description
                  </label>

                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <textarea
                      disabled={isLoading}
                      // type="text"
                      maxLength={100}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={(values?.descriptionName).trimStart()}
                      name="descriptionName"
                      id="descriptionName"
                      rows={4}
                      className="block w-full max-w-lg rounded-md font-normal border border-grey_border_table sm:max-w-xs focus:outline-none py-2 px-3 text-sm active:border-blue_primary focus:text-font_black"
                    />
                  </div>
                </div>
              </div>
              {apiErrors && (
                <p className="mt-21 text-sm text-error_red" id="email-error">
                  {apiErrors.message}
                </p>
              )}
            </div>
          </div>

          <div className="py-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="min-w-[151.44px] rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
              >
                {isLoading ? <ButtonSpinner /> : "Create New Subject  "}
              </button>

              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
                onClick={cancelClicked}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export interface ErrorsState {
  [id: string]: string;
}
