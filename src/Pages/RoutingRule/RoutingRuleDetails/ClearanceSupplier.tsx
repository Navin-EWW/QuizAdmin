import React, { useState, useEffect, useMemo } from "react";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import { useFormik } from "formik";
import DropDownField from "../../../Components/MultipleInputField/DropDownField";
import TextInputField from "../../../Components/MultipleInputField/TextInputField";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { flagArray as Flag } from "../../../Components/Flags";
import { CountryCode } from "libphonenumber-js";
import { useMutation, useQuery } from "@tanstack/react-query";

import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import UseToast from "../../../hooks/useToast";
import { number, object, string } from "yup";
import _, { isEmpty } from "lodash";
import ButtonSpinner from "../../../utils/ButtonSpinner";

import { ClearanceList } from "../../../api/routingRule/routingRule";
import { UpdateClearanceList } from "../../../api/routingRule/routingRule";

type Props = {
  editCnt: boolean;
  setEditCnt: any;
  id: string | undefined;
  cancelModal: boolean;
  clearanceSupplierData: any;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  compareToggle: boolean;
  tabRedirect: boolean;
  state?: string;
};

const ClearanceSupplier = ({
  editCnt,
  setcancelModal,
  setcompareToggle,
  compareToggle,
  refetch,
  setEditCnt,
  id,
  clearanceSupplierData,
  tabRedirect,
  cancelModal,
  state,
}: Props) => {
  const [apiError, setapiError] = useState<string>("");
  const [clearanceListData, setclearanceListData] = useState<any>([]);

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 11000);
    }
  }, [apiError]);

  const { mutate, isLoading } = useMutation(UpdateClearanceList, {
    onSuccess: (data: any) => {
      refetch();
      setEditCnt(!editCnt);
      dirty && UseToast(data?.message);
    },
    onError: (data: any) => {
      if (data?.message) {
        setapiError(data?.message);
      } else {
        setapiError(data);
      }
    },
  });

  const { dataUpdatedAt, error, isError, isFetching } = useQuery(
    ["ClearanceList"],
    () => ClearanceList(),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          setclearanceListData(data?.data);
        }
      },
    }
  );

  const ClearanceSupplierSchema = object()
    .nullable()
    .shape({
      exportCustomClearanceSupplierName: string()
        // .required("Required Field")
        .trim("Required Field")
        .nullable(),
      importCustomClearanceSupplierName: string()
        // .required("Required Field")
        .trim("Required Field")
        .nullable(),
    });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    setTouched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: ClearanceSupplierSchema,
    enableReinitialize: true,
    initialValues: {
      exportCustomClearanceSupplierName:
        clearanceSupplierData?.exportCustomerClearenceSupplier?.name || "",
      importCustomClearanceSupplierName:
        clearanceSupplierData?.importCustomerClearenceSupplier?.name || "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      const mainData = {
        exportCustomerClearanceSupplierId: clearanceListData.find(
          (x: any) => x?.name === values?.exportCustomClearanceSupplierName
        )?.id,
        importCustomerClearanceSupplierId: clearanceListData.find(
          (x: any) => x?.name === values?.importCustomClearanceSupplierName
        )?.id,
        id,
      };
      mutate(mainData);
    },
  });
  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue(
      "exportCustomClearanceSupplierName",
      clearanceSupplierData?.exportCustomerClearenceSupplier?.name || ""
    );
    setFieldValue(
      "importCustomClearanceSupplierName",
      clearanceSupplierData?.importCustomerClearenceSupplier?.name || ""
    );
    setTouched({});
    setapiError("");
  };

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  const cancelClicked = () => {
    if (dirty) {
      setcancelModal(true);
    } else {
      setEditCnt(!editCnt);
    }
  };

  return (
    <div className="relative pb-10 mb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit}>
        <div className="bg-white px-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div
              className={`space-y-6 sm:space-y-5 ${
                !editCnt && "pb-5"
              } font-Inter`}
            >
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <DropDownField
                  label="Export Custom Clearance Supplier"
                  disabled={editCnt}
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={clearanceListData}
                  // isSystemVariable={true}
                  isSelectType={
                    !values?.exportCustomClearanceSupplierName ? true : false
                  }
                  defaltText="Select Clearance Supplier Name"
                  name="exportCustomClearanceSupplierName"
                  onChangeCountry={handleChange}
                  id="exportCustomClearanceSupplierName"
                  title={values?.exportCustomClearanceSupplierName || "-"}
                  error={errors?.exportCustomClearanceSupplierName}
                  errorStatus={
                    touched?.exportCustomClearanceSupplierName &&
                    Boolean(errors?.exportCustomClearanceSupplierName)
                  }
                />

                <DropDownField
                  label="Import Custom Clearance Supplier"
                  disabled={editCnt}
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={clearanceListData}
                  // isSystemVariable={true}
                  isSelectType={
                    !values?.importCustomClearanceSupplierName ? true : false
                  }
                  defaltText="Select Clearance Supplier Name"
                  onChangeCountry={handleChange}
                  name="importCustomClearanceSupplierName"
                  id="importCustomClearanceSupplierName"
                  title={values?.importCustomClearanceSupplierName || "-"}
                  error={errors?.importCustomClearanceSupplierName}
                  errorStatus={
                    touched?.importCustomClearanceSupplierName &&
                    Boolean(errors?.importCustomClearanceSupplierName)
                  }
                />
              </div>

              <div className=" border-grey_border_table sm:pt-5">
                {apiError && (
                  <p className="mt-21 text-sm text-error_red" id="email-error">
                    {apiError}
                  </p>
                )}

                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || !dirty}
                      className={`rounded-md ${
                        dirty
                          ? "bg-blue_primary hover:bg-hoverChange"
                          : "bg-grey_border_table_disable"
                      }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none`}
                    >
                      {isLoading ? <ButtonSpinner /> : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none hover:bg-grey_bg tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                      onClick={cancelClicked}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClearanceSupplier;
