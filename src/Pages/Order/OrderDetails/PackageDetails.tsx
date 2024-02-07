import React, { useEffect, useMemo, useState } from "react";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import { useFormik } from "formik";
import TextInputField from "../../../Components/MultipleInputField/TextInputField";
import ProductTable from "./ProductTable";
import DropDownField from "../../../Components/MultipleInputField/DropDownField";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import _, { isNaN } from "lodash";
import { array, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { UpdatePackageDetails } from "../../../api/orderDetails/orderDetails.api";
import ButtonSpinner from "../../../utils/ButtonSpinner";

type Props = {
  editCnt: boolean;
  setEditCnt: any;
  packageDetails: any;
  setcancelModal: React.Dispatch<boolean>;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  compareToggle: boolean;
  show: boolean;
  countriesDetails: any[];
  tabRedirect: boolean;
  state?: string;
  shipmentTermList: any;
};

const PackageDetails = ({
  editCnt,
  setcancelModal,
  setEditCnt,
  refetch,
  setcompareToggle,
  countriesDetails,
  compareToggle,
  shipmentTermList,
  tabRedirect,
  show,
  state,
  packageDetails,
}: Props) => {
  const [apiError, setapiError] = useState<string>("");
  const [currencyDropdown, setcurrencyDropdown] = useState<boolean>(false);
  const [insuranceCurrencyDropdown, setinsuranceCurrencyDropdown] =
    useState<boolean>(false);
  const EditArray = packageDetails?.products.map((x: any) => {
    return { edit: false };
  });
  const [editableFields, seteditableFields] = useState(EditArray);

  let currencyArray = [];

  const countriesDetailsArray = countriesDetails;
  for (let a of countriesDetailsArray) {
    let obj = a;
    currencyArray.push({ ...a, name: a?.currency });
  }

  const floatingPointValidation = (
    num: string | number | undefined,
    point: number
  ) => {
    const number: number | any = num
      ?.toString()
      ?.split(".")[1]
      ?.split("")?.length;

    const validation = number > point;
    return !validation;
  };

  const { mutate, isLoading } = useMutation(UpdatePackageDetails, {
    onSuccess: (data: any) => {
      refetch();
      setEditCnt(!editCnt);
      seteditableFields(EditArray);
      UseToast(data?.message);
      setapiError("");
    },
    onError: (data: any) => {
      if (data?.message) {
        setapiError(data?.message);
      } else {
        setapiError(data);
      }
    },
  });

  const PackageSchema = object()
    .nullable()
    .shape({
      declaredValueCurrency: string()
        .required("Required Field")
        .trim("Required Field")
        .nullable(),
      declaredValue: string()
        .required("Required Field")
        .trim("Required Field")
        .matches(
          /^\d+(\.\d{0,2})?$/,
          "Please enter max two number after point. "
        )
        .nullable(),
      estimatedGrossWeight: string()
        .required("Required Field")
        .trim("Required Field")
        .matches(
          /^\d+(\.\d{0,3})?$/,
          "Please enter max three number after point."
        )

        .nullable(),
      estimatedVolumeWeight: string()
        .matches(
          /^\d+(\.\d{0,3})?$/,
          "Please enter max three number after point. "
        )
        .nullable(),
      shipmentTerm: string().nullable(),

      cargoValue: string()
        .matches(
          /^\d+(\.\d{0,2})?$/,
          "Please enter max two number after point. "
        )
        .nullable(),

      freightShippingFee: string()
        .matches(
          /^\d+(\.\d{0,2})?$/,
          "Please enter max two number after point. "
        )
        .nullable(),

      insuranceValue: string()
        .matches(
          /^\d+(\.\d{0,2})?$/,
          "Please enter max two number after point. "
        )
        .nullable(),

      insuranceType: string()
        .max(16, "Please enter max 16 characters.")
        .nullable(),

      products: array().of(
        object().shape({
          productDescriptioninEnglish: string()
            .required("Required Field")
            .trim("Required Field")
            .test(
              "productDescriptioninEnglish",
              "Only String Allowed",
              (value) => {
                return isNaN(Number(value));
              }
            ),
          productDescriptionInOriginLanguage: string()
            .required("Required Field")
            .trim("Required Field")
            .test(
              "productDescriptioninEnglish",
              "Only String Allowed",
              (value) => {
                return isNaN(Number(value));
              }
            ),
          productDescriptioninDestinationLanguage: string()
            .nullable()
            .test(
              "productDescriptioninDestinationLanguage",
              "Only String Allowed",
              (value) => {
                return !_.isEmpty(value) ? isNaN(Number(value)) : true;
              }
            ),
          productCategory: string()
            .nullable()
            .test("productCategory", "Only String Allowed", (value) => {
              return !_.isEmpty(value) ? isNaN(Number(value)) : true;
            }),

          productUnitPrice: string()
            .required("Required Field")
            .trim("Required Field")
            .matches(
              /^\d+(\.\d{0,2})?$/,
              "Please enter max two number after point. "
            ),
          productUnitPriceCurrency: string()
            .required("Required Field")
            .trim("Required Field"),
          productQuantity: string()
            .required("Required Field")
            .trim("Required Field"), //integer
        })
      ),
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
    validationSchema: PackageSchema,
    enableReinitialize: true,
    initialValues: {
      declaredValueCurrency:
        packageDetails?.declaredValue?.Currency?.toString(),
      declaredValue: packageDetails?.declaredValue?.Value?.toString(),
      packageHeight: packageDetails?.size?.packageHeight?.toString(),
      packageLength: packageDetails?.size?.packageLength?.toString(),
      packageWidth: packageDetails?.size?.packageWidth?.toString(),
      estimatedGrossWeight: packageDetails?.estimatedGrossWeight?.toString(),
      estimatedVolumeWeight: packageDetails?.estimatedVolumeWeight?.toString(),
      numberofPackage: packageDetails?.numberofPackage?.toString(),
      shipmentTerm: packageDetails?.shipmentTerm?.toString(),
      cargoValue: packageDetails?.cargoValue?.toString(),
      insuranceValue: packageDetails?.insurance?.insuranceValue?.toString(),
      insuranceCurrency:
        packageDetails?.insurance?.insuranceCurrency?.toString(),
      insuranceType: packageDetails?.insurance?.insuranceType?.toString(),
      freightShippingFee: packageDetails?.freightShippingFee?.toString(),
      products: packageDetails?.products,
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      let productArray = [];

      for (let a of values?.products) {
        let obj = {
          ...a,
          productDescriptionInEnglish: a?.productDescriptioninEnglish,
          productDescriptionInDestinationLanguage:
            a?.productDescriptioninDestinationLanguage,
          productId: a?.id,
          id: state,
        };
        delete obj["productDescriptioninEnglish"];
        delete obj["productDescriptioninDestinationLanguage"];
        productArray?.push(obj);
      }

      const shipmentId = shipmentTermList?.values?.find(
        (x: any) => values?.shipmentTerm
      )?.id;

      mutate({
        id: state,
        declaredValue: values?.declaredValue?.toString(),
        declaredValueCurrency: values?.declaredValueCurrency?.toString(),
        packageHeight: values?.packageHeight?.toString(),
        packageLength: values?.packageLength?.toString(),
        packageWidth: values?.packageWidth?.toString(),
        packageGrossWeight: values?.estimatedGrossWeight?.toString(),
        packageVolumeWeight: values?.estimatedVolumeWeight?.toString(),
        shipmentTerm: shipmentId?.toString(),
        numberOfPackage: values?.numberofPackage?.toString(),
        cargoValue: values?.cargoValue?.toString(),
        freightShippingFee: values?.freightShippingFee?.toString(),
        insuranceValue: values?.insuranceValue?.toString(),
        insuranceCurrency: values?.insuranceCurrency?.toString(),
        insuranceType: values?.insuranceType?.toString(),
        products: productArray,
      });
    },
  });



  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 7000);
    }
  }, [apiError]);

  const defaultValues = () => {
    setFieldValue(
      "declaredValueCurrency",
      packageDetails?.declaredValue?.Currency?.toString()
    );
    setFieldValue(
      "declaredValue",
      packageDetails?.declaredValue?.Value?.toString()
    );
    setFieldValue(
      "packageHeight",
      packageDetails?.size?.packageHeight?.toString()
    );
    setFieldValue(
      "packageLength",
      packageDetails?.size?.packageLength?.toString()
    );
    setFieldValue(
      "packageWidth",
      packageDetails?.size?.packageWidth?.toString()
    );
    setFieldValue(
      "estimatedGrossWeight",
      packageDetails?.estimatedGrossWeight?.toString()
    );
    setFieldValue(
      "estimatedVolumeWeight",
      packageDetails?.estimatedVolumeWeight?.toString()
    );
    setFieldValue(
      "numberofPackage",
      packageDetails?.numberofPackage?.toString()
    );
    setFieldValue("shipmentTerm", packageDetails?.shipmentTerm?.toString());
    setFieldValue("cargoValue", packageDetails?.cargoValue?.toString());
    setFieldValue(
      "freightShippingFee",
      packageDetails?.freightShippingFee?.toString()
    );
    setFieldValue(
      "insuranceValue",
      packageDetails?.insurance?.insuranceValue?.toString()
    );
    setFieldValue(
      "insuranceCurrency",
      packageDetails?.insurance?.insuranceCurrency?.toString()
    );
    setFieldValue(
      "insuranceType",
      packageDetails?.insurance?.insuranceType?.toString()
    );
    setFieldValue("products", packageDetails?.products);
    seteditableFields(EditArray);
    setTouched({});
    setapiError("");
  };

  const cancelClicked = () => {
    if (dirty) {
      setcancelModal(true);
    } else {
      setapiError("");
      setEditCnt(!editCnt);
      seteditableFields(EditArray);
    }
  };

  const toFixedFunction = (num: number, string: string) => {
    let number = Number(string).toFixed(num);
    return number;
  };

  return show ? (
    <div className="relative pb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit} noValidate>
        <div className="bg-white p-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5 font-Inter">
              <div>
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Declared Value
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  type="number"
                  label="Value"
                  min={0}
                  name="declaredValue"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  id="declaredValue"
                  onlyForPackage={true}
                  onChange={(e: any) =>
                    e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString())
                  }
                  onBlur={handleBlur}
                  title={values?.declaredValue}
                  editCnt={editCnt}
                  errorStatus={
                    touched?.declaredValue && Boolean(errors?.declaredValue)
                  }
                  error={errors?.declaredValue}
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Currency
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{values?.declaredValueCurrency}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.declaredValueCurrency)}
                        text="Select a Currency"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          setFieldValue("declaredValueCurrency", e);
                          setcurrencyDropdown(false);
                        }}
                        divOnClick={() => {
                          setinsuranceCurrencyDropdown(false);
                        }}
                        isOpen={currencyDropdown}
                        setIsOpen={setcurrencyDropdown}
                        array={currencyArray}
                        value={values?.declaredValueCurrency}
                        id="declaredValueCurrency"
                        name="declaredValueCurrency"
                        iconsvg={
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                              fill="#6B7B80"
                            />
                          </svg>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Size
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  type="number"
                  label="Package Height"
                  min={0}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  title={values?.packageHeight}
                  editCnt={editCnt}
                  errorStatus={
                    touched?.packageHeight && Boolean(errors?.packageHeight)
                  }
                  error={errors?.packageHeight}
                  name="packageHeight"
                  id="packageHeight"
                  onChange={(e: any) => {
                    e?.target?.value?.length <= 128 &&
                      setFieldValue(
                        e?.target?.id,
                        e?.target?.value?.toString()
                      );
                  }}
                  onBlur={handleBlur}
                />
                <TextInputField
                  type="number"
                  title={values?.packageLength}
                  label="Package Length"
                  name="packageLength"
                  id="packageLength"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  editCnt={editCnt}
                  min={0}
                  errorStatus={
                    touched?.packageLength && Boolean(errors?.packageLength)
                  }
                  error={errors?.packageLength}
                  onChange={(e: any) => {
                    e?.target?.value?.length <= 128 &&
                      setFieldValue(
                        e?.target?.id,
                        e?.target?.value?.toString()
                      );
                  }}
                  onBlur={handleBlur}
                />
                <TextInputField
                  type="number"
                  title={values?.packageWidth}
                  label="Package Width"
                  editCnt={editCnt}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  min={0}
                  errorStatus={
                    touched?.packageWidth && Boolean(errors?.packageWidth)
                  }
                  error={errors?.packageWidth}
                  name="packageWidth"
                  id="packageWidth"
                  onChange={(e: any) => {
                    e?.target?.value?.length <= 128 &&
                      setFieldValue(
                        e?.target?.id,
                        e?.target?.value?.toString()
                      );
                  }}
                  onBlur={handleBlur}
                />
              </div>
              <FormInputFiled
                type="number"
                label={`Estimated Gross Weight`}
                min={0}
                name="estimatedGrossWeight"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                id="estimatedGrossWeight"
                handleOnChange={(e) => {
                  e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                }}
                onBlur={handleBlur}
                disabled={editCnt}
                value={values?.estimatedGrossWeight}
                editCnt={editCnt}
                placeholder=""
                errorStatus={
                  touched?.estimatedGrossWeight &&
                  Boolean(errors?.estimatedGrossWeight)
                }
                error={errors?.estimatedGrossWeight}
              />
              <FormInputFiled
                disabled={editCnt}
                label={`Estimated Volume Weight`}
                value={values?.estimatedVolumeWeight}
                editCnt={editCnt}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                handleOnChange={(e) => {
                  e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                }}
                placeholder=""
                id="estimatedVolumeWeight"
                name="estimatedVolumeWeight"
                type="number"
                min={0}
                onBlur={handleBlur}
                error={errors.estimatedVolumeWeight}
                errorStatus={
                  touched?.estimatedVolumeWeight &&
                  Boolean(errors?.estimatedVolumeWeight)
                }
              />

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Shipment Term
                </label>
                {editCnt ? (
                  <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                    {values?.shipmentTerm}
                  </span>
                ) : (
                  <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                    <select
                      disabled={editCnt || isLoading}
                      id="shipmentTerm"
                      name="shipmentTerm"
                      value={values?.shipmentTerm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      <option value="">Select a proper shipment term</option>
                      {shipmentTermList?.values?.map((x: any) => {
                        return <option> {x?.value}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>
              <FormInputFiled
                disabled={editCnt}
                label={`Number of Package`}
                editCnt={editCnt}
                value={values?.numberofPackage}
                handleOnChange={(e) => {
                  e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                }}
                placeholder=""
                id="numberofPackage"
                name="numberofPackage"
                min={0}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                type="number"
                onBlur={handleBlur}
                error={errors.numberofPackage}
                errorStatus={
                  touched?.numberofPackage && Boolean(errors?.numberofPackage)
                }
              />
              <FormInputFiled
                disabled={editCnt}
                label={`Cargo Value`}
                editCnt={editCnt}
                value={values?.cargoValue}
                handleOnChange={(e) => {
                  e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                }}
                id="cargoValue"
                name="cargoValue"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                type="number"
                min={0}
                onBlur={handleBlur}
                error={errors?.cargoValue}
                errorStatus={touched?.cargoValue && Boolean(errors?.cargoValue)}
              />
              <FormInputFiled
                disabled={editCnt}
                label={`Freight Shipping Fee`}
                editCnt={editCnt}
                value={values?.freightShippingFee}
                handleOnChange={(e) => {
                  e?.target?.value?.length <= 128 &&
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                }}
                placeholder=""
                id="freightShippingFee"
                name="freightShippingFee"
                type="number"
                min={0}
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                onBlur={handleBlur}
                error={errors.freightShippingFee}
                errorStatus={
                  touched?.freightShippingFee &&
                  Boolean(errors?.freightShippingFee)
                }
              />
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Insurance
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  label="Value"
                  id="insuranceValue"
                  type="number"
                  name="insuranceValue"
                  min={0}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  title={values?.insuranceValue}
                  editCnt={editCnt}
                  errorStatus={
                    touched?.insuranceValue && Boolean(errors?.insuranceValue)
                  }
                  error={errors?.insuranceValue}
                  onChange={(e: any) => {
                    e?.target?.value?.length <= 128 &&
                      setFieldValue(
                        e?.target?.id,
                        e?.target?.value?.toString()
                      );
                  }}
                  onBlur={handleBlur}
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-5">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Currency
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg ">
                    {editCnt ? (
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
                        <span>{values?.insuranceCurrency}</span>
                      </div>
                    ) : (
                      <InputDropDown
                        disabled={isLoading}
                        noValueHere={_.isEmpty(values?.insuranceCurrency)}
                        text="Select a Currency"
                        onchangeValue={(
                          e: React.ChangeEvent<HTMLInputElement>,
                          text: string
                        ) => {
                          setFieldValue("insuranceCurrency", e);
                          setinsuranceCurrencyDropdown(false);
                        }}
                        divOnClick={() => {
                          setcurrencyDropdown(false);
                        }}
                        isOpen={insuranceCurrencyDropdown}
                        setIsOpen={setinsuranceCurrencyDropdown}
                        array={currencyArray}
                        value={values?.insuranceCurrency}
                        id="insuranceValue"
                        name="insuranceValue"
                        iconsvg={
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                              fill="#6B7B80"
                            />
                          </svg>
                        }
                      />
                    )}
                  </div>
                </div>
                <TextInputField
                  label="Type"
                  id="insuranceType"
                  name="insuranceType"
                  maxLength={16}
                  type="text"
                  title={values?.insuranceType}
                  editCnt={editCnt}
                  onChange={(e: any) => {
                    setFieldValue(e?.target?.id, e?.target?.value?.toString());
                  }}
                  onBlur={handleBlur}
                  errorStatus={
                    touched?.insuranceType && Boolean(errors?.insuranceType)
                  }
                  error={errors?.insuranceType}
                />
              </div>
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Product
                  </label>
                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>
                {/* //table */}
                <ProductTable
                  refetch={refetch}
                  seteditableFields={seteditableFields}
                  editableFields={editableFields}
                  errorsArray={errors?.products || [{}]}
                  currencyArray={currencyArray}
                  realProductsData={packageDetails?.products}
                  editCnt={editCnt}
                  productsData={values?.products}
                  setFieldValue={setFieldValue}
                  tabRedirect={tabRedirect}
                />
              </div>
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
                    disabled={isLoading}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-grey_border_table  hover:bg-grey_bg py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
                    onClick={cancelClicked}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default PackageDetails;
