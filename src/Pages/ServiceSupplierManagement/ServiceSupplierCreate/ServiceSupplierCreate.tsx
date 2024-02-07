import React, { useState, useEffect, useMemo, useCallback } from "react";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import LebalWithInput from "../Components/LebalWithInput";
import FirstMile from "./FirstMile";
import UseToast from "../../../hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateServiceSupplier,
  SupplierStatusListAPI,
} from "../../../api/serviceSupplier/serviceSupplier";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { array, boolean, object, string } from "yup";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import _, { debounce, isEmpty } from "lodash";
import Spinner from "../../../utils/Spinner";
import { capitalizeFirst } from "../../../utils/Capitalization";

type Props = {};

export function ServiceSupplierCreate({}: Props) {
  const [firstMileData, setfirstMileData] = useState<MileStatuesTypes[]>([]);
  const [internationalMileData, setinternationalMileData] = useState<
    MileStatuesTypes[]
  >([]);

  const [mileToggleStore, setmileToggleStore] = useState<number | undefined>(
    undefined
  );
  const [allMileData, setallMileData] = useState<MileStatuesTypes[]>([]);
  const [compareToggle, setcompareToggle] = useState(false);
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);
  const [apiErrors, setapiErrors] = useState<any>("");

  const [thirdMileData, setthirdMileData] = useState<MileStatuesTypes[]>([]);
  const navigate = useNavigate();
  const [fieldErrorValidate, setfieldErrorValidate] = useState(false);
  const [mileStatusValidate, setmileStatusValidate] = useState(true);

  let firstMileValues: any = [];
  let secondMileValues: any = [];
  let thirdMileValues: any = [];
  let allMileValues: any = [];

  const valuesArray = (array: any[]) => {
    let statuesArray = [];

    for (let a of array) {
      for (let i of a?.textArray) {
        if (!_.isEmpty(i?.text?.trim())) {
          statuesArray.push({
            mile: a?.mile,
            internalStatusId: a?.internalStatus?.id,
            supplierStatusName: i?.text,
          });
        }
      }
    }

    return statuesArray;
  };

  const { refetch, isLoading } = useQuery(
    ["SupplierStatusListAPI"],
    () => SupplierStatusListAPI(),
    {
      onSuccess(data: any) {
        let firstMile: MileStatuesTypes[] = [];
        let secondMile: MileStatuesTypes[] = [];
        let thirdMile: MileStatuesTypes[] = [];
        let allMile: MileStatuesTypes[] = [];
        for (let a of data?.data) {
          if (a?.mile === "FIRST_MILE") {
            firstMile.push({ ...a, textArray: [{ text: "" }] });
          } else if (a?.mile === "INTERNATIONAL_MILE") {
            secondMile.push({ ...a, textArray: [{ text: "" }] });
          } else if (a?.mile === "LAST_MILE") {
            thirdMile.push({ ...a, textArray: [{ text: "" }] });
          } else if (a?.mile === "ALL") {
            allMile.push({ ...a, textArray: [{ text: "" }] });
          }
        }

        setfirstMileData(firstMile);
        setinternationalMileData(secondMile);
        setthirdMileData(thirdMile);
        setallMileData(allMile);
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/service-supplier/list");
      },
    }
  );

  const { mutate, isLoading: mutateIsLoading } = useMutation(
    CreateServiceSupplier,
    {
      onSuccess: (data: any) => {
        setcompareToggle(false);
        dirty && UseToast(data?.message);
        successNavigate();
      },
      onError: (data: any) => {
        if (data?.message) {
          setapiErrors(data?.message);
        } else {
          setapiErrors(data);
        }
      },
    }
  );

  const successNavigate = useCallback(
    debounce(() => navigate("/service-supplier/list"), 200),
    []
  );

  const cancelBack = () => {
    setcancelModel(false);
    setmileToggleStore(undefined);
  };

  const CreateServiceSupplierSchema = object()
    .nullable()
    .shape({
      name: string()
        .required("Required Field")
        .trim("Required Field")
        .min(
          2,
          "A Supplier Name must contain 2 or more characters. Please try again"
        )
        .nullable(),
      mainData: array()
        .min(1, "Atleast one Field is Required")
        .required("required"),
    });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    isSubmitting,
    isValidating,
    errors,
    touched,
    setTouched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: CreateServiceSupplierSchema,
    enableReinitialize: true,
    initialValues: {
      name: "",
      firstMileStatus: true,
      secondMileStatus: false,
      thirdMileStatus: false,
      firstMileData: firstMileData,
      internationalMileData: internationalMileData,
      thirdMileData: thirdMileData,
      allMileData: allMileData,
      mainData: [],
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      if (mileStatusValidate && fieldErrorValidate) {
        mutate({
          name: values?.name,
          firstMile: values?.firstMileStatus,
          internationalMile: values?.secondMileStatus,
          lastMile: values?.thirdMileStatus,
          status: values?.mainData,
        });
      }
    },
  });

  const setMainDataValue = () => {
    setFieldValue(
      "mainData",
      valuesArray([
        ...values?.firstMileData,
        ...values?.internationalMileData,
        ...values?.thirdMileData,
        ...values?.allMileData,
      ])
    );
  };

  let firstMileActive = values?.firstMileData !== firstMileData;
  let secondMileActive =
    values?.internationalMileData !== internationalMileData;
  let thirdMileActive = values?.thirdMileData !== thirdMileData;

  firstMileValues = valuesArray(values?.firstMileData);
  secondMileValues = valuesArray(values?.internationalMileData);
  thirdMileValues = valuesArray(values?.thirdMileData);
  allMileValues = valuesArray(values?.allMileData);

  const confirmBack = () => {
    if (mileToggleStore === 0) {
      setFieldValue("firstMileStatus", false);
      setFieldValue("firstMileData", firstMileData);
    } else if (mileToggleStore === 1) {
      setFieldValue("secondMileStatus", false);
      setFieldValue("internationalMileData", internationalMileData);
    } else if (mileToggleStore === 2) {
      setFieldValue("thirdMileStatus", false);
      setFieldValue("thirdMileData", thirdMileData);
    }
    debounce(() => setMainDataValue(), 200), cancelBack();
  };

  useEffect(() => {
    if (apiErrors) {
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

  useMemo(() => {
    const mileStatusValidate =
      values?.firstMileStatus ||
      values?.secondMileStatus ||
      values?.thirdMileStatus;

    setmileStatusValidate(mileStatusValidate);
  }, [
    values?.firstMileStatus,
    values?.secondMileStatus,
    values?.thirdMileStatus,
  ]);

  useMemo(() => {
    const firstMileValues = valuesArray(values?.firstMileData);
    const secondMileValues = valuesArray(values?.internationalMileData);
    const thirdMileValues = valuesArray(values?.thirdMileData);
    const allMileValues = valuesArray(values?.allMileData);

    const mileStatus =
      !_.isEmpty(firstMileValues) ||
      !_.isEmpty(secondMileValues) ||
      !_.isEmpty(thirdMileValues) ||
      !_.isEmpty(allMileValues);
    setMainDataValue();

    setfieldErrorValidate(mileStatus);
  }, [
    values?.firstMileData,
    values?.internationalMileData,
    values?.thirdMileData,
    values?.allMileData,
  ]);

  useMemo(() => {
    if (isSubmitting && !_.isEmpty(errors?.name)) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [isSubmitting, errors]);

  return (
    <form
      onSubmit={(e) => {
        e?.preventDefault();
        handleSubmit();
      }}
    >
      <div className="px-8 pt-6 pb-20 bg-bg_Grey">
        <h2 className="text-2xl font-Inter text-font_black font-semibold pb-4">
          + New service supplier
        </h2>
        <div className="px-6 pb-6 bg-white shadow-header rounded-md min-h-[300px]">
          <h2 className="py-5 font-medium font-Inter text-[18px]">
            Basic Information
          </h2>

          <FormInputFiled
            disabled={isLoading}
            error={errors?.name}
            errorStatus={touched?.name && Boolean(errors?.name)}
            label={"Supplier Name"}
            editCnt={false}
            value={capitalizeFirst(values?.name).trimStart()}
            handleOnChange={handleChange}
            onBlur={handleBlur}
            id="name"
            name="name"
            type="text"
          />

          <div
            className={`text-sm mt-5 sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5`}
          >
            <label className="block text-font_dark font-Inter font-medium">
              First Mile
            </label>
            <div
              className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
            >
              <SwitchToggle
                extraCss={"ml-0"}
                disabled={false}
                id="firstMileStatus"
                name="firstMileStatus"
                enabled={values?.firstMileStatus}
                checked={values?.firstMileStatus}
                onChange={(e) => {
                  if (firstMileActive) {
                    setmileToggleStore(0);
                    setcancelModel(true);
                  } else {
                    setFieldValue("firstMileStatus", e);
                  }
                }}
              />
            </div>
          </div>

          <div
            className={`text-sm mt-5 sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5`}
          >
            <label className="block text-font_dark font-Inter font-medium">
              International
            </label>
            <div
              className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
            >
              <SwitchToggle
                extraCss={"ml-0"}
                disabled={false}
                id="secondMileStatus"
                name="secondMileStatus"
                enabled={values?.secondMileStatus}
                checked={values?.secondMileStatus}
                onChange={(e) => {
                  if (secondMileActive) {
                    setmileToggleStore(1);
                    setcancelModel(true);
                  } else {
                    setFieldValue("secondMileStatus", e);
                  }
                }}
              />
            </div>
          </div>

          <div
            className={`text-sm mt-5 sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5`}
          >
            <label className="block text-font_dark font-Inter font-medium">
              Last Mile
            </label>
            <div
              className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
            >
              <SwitchToggle
                extraCss={"ml-0"}
                id="thirdMileStatus"
                name="thirdMileStatus"
                disabled={false}
                enabled={values?.thirdMileStatus}
                checked={values?.thirdMileStatus}
                onChange={(e) => {
                  if (thirdMileActive) {
                    setmileToggleStore(2);
                    setcancelModel(true);
                  } else {
                    setFieldValue("thirdMileStatus", e);
                  }
                }}
              />
            </div>
          </div>
          {!mileStatusValidate && (
            <p className="mt-4 text-sm text-error_red">
              Atleast one Mile is Required
            </p>
          )}
        </div>

        <div className="px-6 mt-5 bg-white shadow-header rounded-md min-h-[300px]">
          <h2 className="py-5 border-b border-grey_border_table font-medium font-Inter text-[18px]">
            Status mapping
          </h2>
          <div>
            <div className="text-sm mt-5 pb-5 gap-3 sm:grid md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-7">
              <div className="md:col-span-7 lg:col-span-1 font-Inter font-medium text-font_dark text-sm">
                {""}
              </div>
              <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_dark text-sm">
                Customer Status
              </div>
              <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_dark text-sm">
                Internal Status
              </div>
              <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_dark text-sm">
                Supplier Status
              </div>
            </div>
            {values?.firstMileStatus && (
              <FirstMile
                disabled={mutateIsLoading}
                title="First Mile"
                setFieldValue={setFieldValue}
                data={values?.firstMileData}
                mileName="firstMileData"
                setMainDataValue={setMainDataValue}
              />
            )}
            {/* <p>anckasnc</p> */}
            {values?.secondMileStatus && (
              <FirstMile
                setMainDataValue={setMainDataValue}
                disabled={mutateIsLoading}
                setFieldValue={setFieldValue}
                title="International Mile"
                data={values?.internationalMileData}
                mileName="internationalMileData"
              />
            )}
            {values?.thirdMileStatus && (
              <FirstMile
                setMainDataValue={setMainDataValue}
                disabled={mutateIsLoading}
                setFieldValue={setFieldValue}
                title="Last Mile"
                data={values?.thirdMileData}
                mileName="thirdMileData"
              />
            )}
            <FirstMile
              setMainDataValue={setMainDataValue}
              disabled={mutateIsLoading}
              setFieldValue={setFieldValue}
              title="All Mile"
              data={values?.allMileData}
              mileName="allMileData"
            />
            {touched?.mainData &&
              Boolean(errors?.mainData) &&
              !fieldErrorValidate && (
                <p className="mt-4 text-sm text-error_red">
                  {errors?.mainData}
                </p>
              )}
            {apiErrors && (
              <p className="mb-5 text-sm text-error_red">{apiErrors}</p>
            )}
            {/* <DialogBox
              message="You have unsaved changes that will be lost if you
                          decide to continue. Are you sure you want to toggle
                          this Mile?"
              showDialog={cancelModel}
              confirmNavigation={confirmBack}
              cancelNavigation={cancelBack}
            /> */}
            <DialogBox
              // @ts-ignore
              showDialog={showPrompt}
              confirmNavigation={confirmNavigation}
              cancelNavigation={cancelNavigation}
            />
          </div>
        </div>

        <div className="flex mt-5 justify-end">
          <button
            disabled={mutateIsLoading || !dirty}
            type="submit"
            className={`rounded-md ${
              !dirty
                ? "bg-grey_border_table_disable"
                : "bg-blue_primary hover:bg-hoverChange"
            }  py-2 px-4 text-sm font-medium text-white focus:outline-none min-w-[137.88px]  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
          >
            {mutateIsLoading ? (
              <ButtonSpinner />
            ) : (
              "Create New Service Provider"
            )}
          </button>
          <button
            disabled={mutateIsLoading}
            onClick={successNavigate}
            type="reset"
            className="ml-3 inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
          >
            Cancel
          </button>
        </div>
        {(isLoading || _.isEmpty(firstMileData)) && <Spinner />}
      </div>
    </form>
  );
}

// export default ServiceSupplierCreate;

export interface MileStatuesTypes {
  mile: string;
  internalStatus: InternalStatus;
  externalStatus: ExternalStatus;
  textArray: TextArrayType[];
}

export interface InternalStatus {
  id: string;
  name: string;
}

export interface TextArrayType {
  text: string | undefined | null;
}
export interface ExternalStatus {
  id: string;
  name: string;
}
export interface ValuesTypes {
  mile: string;
  internalStatusId: string;
  supplierStatusName: string;
}
