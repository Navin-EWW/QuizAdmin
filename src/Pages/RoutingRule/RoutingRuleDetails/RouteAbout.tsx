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
import { AboutTypes } from "./RoutingRuleDetails";

type Props = {
  editCnt: boolean;
  setEditCnt: any;

  cancelModal: boolean;
  aboutData: AboutTypes | undefined;
  //   refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  compareToggle: boolean;
  tabRedirect: boolean;
  show: boolean;
  state?: string;
};

const RouteAbout = ({
  editCnt,
  setEditCnt,
  setcancelModal,
  setcompareToggle,
  compareToggle,
  show,
  aboutData,
  tabRedirect,
  cancelModal,
  state,
}: Props) => {
  const [apiError, setapiError] = useState<string>("");

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 11000);
    }
  }, [apiError]);

  const RouteLocationSchema = object().nullable().shape({});

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
    validationSchema: RouteLocationSchema,
    enableReinitialize: true,
    initialValues: {
      transportation: aboutData?.transportationMode?.value || "",
      productType: aboutData?.productType?.value || "",
      pickUp: aboutData?.pickup || "",
      originCountry: aboutData?.originCountry?.name || "",
      originProvince: aboutData?.originProvince || "",
      originCity: aboutData?.originCity || "",
      destinationCountry: aboutData?.destinationCountry?.name || "",
      destinationProvince: aboutData?.destinationProvince || "",
      destinationCity: aboutData?.destinationCity || "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
    },
  });

  const isLoading = false;

  useMemo(() => {
    if (show) {
    }
  }, [show]);

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("transportation", aboutData?.transportationMode?.value || "");
    setFieldValue("productType", aboutData?.productType?.value || "");
    setFieldValue("pickUp", aboutData?.pickup || "");
    setFieldValue("originCountry", aboutData?.originCountry?.name || "");
    setFieldValue("originProvince", aboutData?.originProvince || "");
    setFieldValue("originCity", aboutData?.originCity || "");
    setFieldValue(
      "destinationCountry",
      aboutData?.destinationCountry?.name || ""
    );
    setFieldValue("destinationProvince", aboutData?.destinationProvince || "");
    setFieldValue("destinationCity", aboutData?.destinationCity || "");
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

  return show ? (
    <div className="relative pb-10 mb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit}>
        <div className="bg-white px-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div
              className={`space-y-6 sm:space-y-5 ${
                !editCnt && "pb-5"
              } font-Inter`}
            >
              <FormInputFiled
                firstElement={true}
                disabled={editCnt}
                label={`Transportation`}
                editCnt={editCnt}
                value={values?.transportation}
                handleOnChange={handleChange}
                placeholder=""
                id="transportation"
                name="transportation"
                type="text"
                error={errors.transportation}
                errorStatus={
                  touched?.transportation && Boolean(errors?.transportation)
                }
                onBlur={handleBlur}
              />
              <FormInputFiled
                disabled={editCnt}
                label={`Product Type`}
                editCnt={editCnt}
                value={values?.productType}
                handleOnChange={handleChange}
                placeholder=""
                id="productType"
                name="productType"
                type="text"
                onBlur={handleBlur}
                error={errors.productType}
                errorStatus={
                  touched?.productType && Boolean(errors?.productType)
                }
              />
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Pickup
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <span
                    // onClick={(e) => StatusHandle(user)}
                    className={`${
                      aboutData?.pickup === undefined ||
                      aboutData?.pickup === null
                        ? "text-font_black bg-white"
                        : aboutData?.pickup
                        ? "text-font_green bg-light_geen"
                        : "text-Incative_red bg-light_red"
                    } rounded-full ml-3 px-6 py-1 text-xs font-medium cursor-pointer`}
                  >
                    {aboutData?.pickup === undefined ||
                    aboutData?.pickup === null
                      ? ""
                      : aboutData?.pickup
                      ? "True"
                      : "False"}
                  </span>
                </div>
              </div>

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Origin
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  //   disabled={true}
                  name="originCountry"
                  id="originCountry"
                  type="text"
                  onBlur={handleBlur}
                  label="Country"
                  disabled={true}
                  editCnt={editCnt}
                  onChange={handleChange}
                  title={values?.originCountry}
                  error={errors.originCountry}
                  errorStatus={
                    touched?.originCountry && Boolean(errors?.originCountry)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="originProvince"
                  id="originProvince"
                  type="text"
                  onBlur={handleBlur}
                  label="Province"
                  disabled={true}
                  editCnt={editCnt}
                  onChange={handleChange}
                  title={values?.originProvince}
                  error={errors.originProvince}
                  errorStatus={
                    touched?.originProvince && Boolean(errors?.originProvince)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="originCity"
                  id="originCity"
                  type="text"
                  disabled={true}
                  onBlur={handleBlur}
                  label="City"
                  editCnt={editCnt}
                  onChange={handleChange}
                  title={values?.originCity}
                  error={errors?.originCity}
                  errorStatus={
                    touched?.originCity && Boolean(errors?.originCity)
                  }
                />
              </div>
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Destination
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  //   disabled={isLoading}
                  name="destinationCountry"
                  id="destinationCountry"
                  disabled={true}
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Country"
                  editCnt={editCnt}
                  title={values?.destinationCountry}
                  error={errors?.destinationCountry}
                  errorStatus={
                    touched?.destinationCountry &&
                    Boolean(errors?.destinationCountry)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="destinationProvince"
                  id="destinationProvince"
                  disabled={true}
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Province"
                  editCnt={editCnt}
                  title={values?.destinationProvince}
                  error={errors?.destinationProvince}
                  errorStatus={
                    touched?.destinationProvince &&
                    Boolean(errors?.destinationProvince)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="destinationCity"
                  id="destinationCity"
                  type="text"
                  disabled={true}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="City"
                  editCnt={editCnt}
                  title={values?.destinationCity}
                  error={errors?.destinationCity}
                  errorStatus={
                    touched?.destinationCity && Boolean(errors?.destinationCity)
                  }
                />
              </div>
              <div className=" border-grey_border_table sm:pt-5">
                {apiError && (
                  <p className="mt-21 text-sm text-error_red">{apiError}</p>
                )}

                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      type="submit"
                      //   disabled={isLoading || !dirty}
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
  ) : null;
};

export default RouteAbout;
