import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import DropDownField from "../../../Components/MultipleInputField/DropDownField";
import TextInputField from "../../../Components/MultipleInputField/TextInputField";

import _ from "lodash";
import { object, string } from "yup";
import { UpdateServiceSupplier } from "../../../api/routingRule/routingRule";
import UseToast from "../../../hooks/useToast";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { serviceSupplierTypes } from "./RoutingRuleDetails";
import { capitalizeFirst } from "../../../utils/Capitalization";
import PhoneNumberValidator from "../../../utils/PhoneNumberValidator";

type Props = {
  editCnt: boolean;
  setEditCnt: any;
  cancelModal: boolean;
  id: string | undefined;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  serviceSupplierData: serviceSupplierTypes | undefined;
  compareToggle: boolean;
  tabRedirect: boolean;
  state?: string;
};

const ServiceSupplier = ({
  editCnt,
  setcancelModal,
  setcompareToggle,
  id,
  serviceSupplierData,
  compareToggle,
  setEditCnt,
  tabRedirect,
  refetch,
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

  const { mutate, isLoading } = useMutation(UpdateServiceSupplier, {
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

  let internationMileIsThere = !_.isEmpty(
    serviceSupplierData?.internationalMile?.internationalMileServiceSupplier
  );
  let lastMileIsThere = !_.isEmpty(
    serviceSupplierData?.lastMile?.lastMileServiceSupplier
  );

  const ServiceSuppilerSchema = object()
    .nullable()
    .shape({
      firstMileContactName: string()
        // .required("Required Field")
        // .trim("Required Field")
        .min(2, "Minimum 2 characters are required in contact name.")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in contact name.")
        .nullable(),
      firstMileContactPhone: string()
        // .required("Required Field")
        // .trim("Required Field")
        // .test("errorPhoneNo", "Invalid phone number" ?? "", (value) => {
        //   return PhoneNumberValidator(value ?? "", countryCode);
        // })
        .nullable(),
      firstMileAddress: string()
        // .required("Required Field")
        // .trim("Required Field")
        .nullable(),

      internationalMileSupplier: string()
        .min(2, "Minimum 2 characters are required in contact name.")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed in contact name.")
        .nullable(),
      internationalMileContactPhone: string().nullable(),
      internationalMileCompany: string().nullable(),
      internationalMileCity: string().nullable(),
      internationalMileAddress: string().nullable(),
      internationalMilePostCode: string().nullable(),
      internationalMileDestinationAddress: string().nullable(),
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
    validationSchema: ServiceSuppilerSchema,
    enableReinitialize: true,
    initialValues: {
      firstMileSupplier:
        serviceSupplierData?.firstMile?.firstMileServiceSupplier || "",
      firstMileContactName:
        serviceSupplierData?.firstMile?.firstMileDestinationContactName || "",
      firstMileContactPhone:
        serviceSupplierData?.firstMile?.firstMileDestinationContactPhone || "",
      firstMileAddress:
        serviceSupplierData?.firstMile?.firstMileDestinationAddress || "",
      firstMileFloor:
        serviceSupplierData?.firstMile?.firstMileDestinationFloor || "",
      firstMileRoom:
        serviceSupplierData?.firstMile?.firstMileDestinationRoom || "",
      internationalMileSupplier:
        serviceSupplierData?.internationalMile
          ?.internationalMileServiceSupplier || "",
      internationalMileContactName:
        serviceSupplierData?.internationalMile?.internationalSenderName || "",
      internationalMileContactPhone:
        serviceSupplierData?.internationalMile?.internationalSenderPhone || "",
      internationalMileAddress:
        serviceSupplierData?.internationalMile?.internationalSenderAdress || "",
      internationalMileCompany:
        serviceSupplierData?.internationalMile?.internationalSenderCompany ||
        "",
      internationalMileCity:
        serviceSupplierData?.internationalMile?.internationalSenderCity || "",
      internationalMilePostCode:
        serviceSupplierData?.internationalMile?.internationalSenderPostCode ||
        "",
      internationalMileDestinationAddress:
        serviceSupplierData?.internationalMile
          ?.internationalDestinationAddress || "",
      lastMileSupplier:
        serviceSupplierData?.lastMile?.lastMileServiceSupplier || "",
      lastMileReturnAddress:
        serviceSupplierData?.lastMile?.lastMileReturnAddress || "",
      lastMileReturnCity:
        serviceSupplierData?.lastMile?.lastMileReturnCity || "",
      lastMileReturnCountry:
        serviceSupplierData?.lastMile?.lastMileReturnCountry || "",
      lastMileReturnName:
        serviceSupplierData?.lastMile?.lastMileReturnName || "",
      lastMileReturnPhone:
        serviceSupplierData?.lastMile?.lastMileReturnPhone || "",
      lastMileReturnPostcode:
        serviceSupplierData?.lastMile?.lastMileReturnPostcode || "",
      lastMileSenderAddress:
        serviceSupplierData?.lastMile?.lastMileSenderAddress || "",
      lastMileSenderCity:
        serviceSupplierData?.lastMile?.lastMileSenderCity || "",
      lastMileSenderCountry:
        serviceSupplierData?.lastMile?.lastMileSenderCountry || "",
      lastMileSenderName:
        serviceSupplierData?.lastMile?.lastMileSenderName || "",
      lastMileSenderPhone:
        serviceSupplierData?.lastMile?.lastMileSenderPhone || "",
      lastMileSenderPostcode:
        serviceSupplierData?.lastMile?.lastMileSenderPostcode || "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({
        id: id,
        firstMileDestinationContactName: values?.firstMileContactName,
        firstMileDestinationContactPhone:
          values?.firstMileContactPhone?.toString(),
        firstMileDestinationAddress: values?.firstMileAddress,
        firstMileDestinationFloor: values?.firstMileFloor,
        firstMileDestinationRoom: values?.firstMileRoom,
        internationalSenderName: values?.internationalMileContactName,
        internationalSenderPhone:
          values?.internationalMileContactPhone?.toString(),
        internationalSenderCompany: values?.internationalMileCompany,
        internationalSenderCity: values?.internationalMileCity,
        internationalSenderAdress: values?.internationalMileAddress,
        internationalSenderPostCode: values?.internationalMilePostCode,
        internationalDestinationAddress:
          values?.internationalMileDestinationAddress,
      });
    },
  });

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue(
      "firstMileSupplier",
      serviceSupplierData?.firstMile?.firstMileServiceSupplier || ""
    );
    setFieldValue(
      "firstMileContactName",
      serviceSupplierData?.firstMile?.firstMileDestinationContactName || ""
    );
    setFieldValue(
      "firstMileContactPhone",
      serviceSupplierData?.firstMile?.firstMileDestinationContactPhone || ""
    );
    setFieldValue(
      "firstMileAddress",
      serviceSupplierData?.firstMile?.firstMileDestinationAddress || ""
    );
    setFieldValue(
      "firstMileFloor",
      serviceSupplierData?.firstMile?.firstMileDestinationFloor || ""
    );
    setFieldValue(
      "firstMileRoom",
      serviceSupplierData?.firstMile?.firstMileDestinationRoom || ""
    );
    setFieldValue(
      "internationalMileSupplier",
      serviceSupplierData?.internationalMile
        ?.internationalMileServiceSupplier || ""
    );
    setFieldValue(
      "internationalMileContactName",
      serviceSupplierData?.internationalMile?.internationalSenderName || ""
    );
    setFieldValue(
      "internationalMileContactPhone",
      serviceSupplierData?.internationalMile?.internationalSenderPhone || ""
    );
    setFieldValue(
      "internationalMileAddress",
      serviceSupplierData?.internationalMile?.internationalSenderAdress || ""
    );
    setFieldValue(
      "internationalMileCompany",
      serviceSupplierData?.internationalMile?.internationalSenderCompany || ""
    );
    setFieldValue(
      "internationalMileCity",
      serviceSupplierData?.internationalMile?.internationalSenderCity || ""
    );
    setFieldValue(
      "internationalMilePostCode",
      serviceSupplierData?.internationalMile?.internationalSenderPostCode || ""
    );
    setFieldValue(
      "internationalMileDestinationAddress",
      serviceSupplierData?.internationalMile?.internationalDestinationAddress ||
        ""
    );
    setFieldValue(
      "lastMileSupplier",
      serviceSupplierData?.lastMile?.lastMileServiceSupplier || ""
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
      <form
        className="space-y-8 shadow-md"
        onSubmit={(e) => {
          e?.preventDefault();
          handleSubmit();
        }}
      >
        <div className="bg-white px-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div
              className={`space-y-6 sm:space-y-5 ${
                !editCnt && "pb-5"
              } font-Inter`}
            >
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    First Mile
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <DropDownField
                  label="Supplier"
                  disabled={true}
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={[{ value: values?.firstMileSupplier }]}
                  isSystemVariable={true}
                  title={values?.firstMileSupplier}
                  error={errors.firstMileSupplier}
                  errorStatus={
                    touched?.firstMileSupplier &&
                    Boolean(errors?.firstMileSupplier)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="firstMileContactName"
                  id="firstMileContactName"
                  type="text"
                  onBlur={handleBlur}
                  label="Contact Name"
                  editCnt={editCnt}
                  title={capitalizeFirst(
                    values?.firstMileContactName
                  ).trimStart()}
                  onChange={handleChange}
                  onlyForPackage={true}
                  error={errors.firstMileContactName}
                  errorStatus={
                    touched?.firstMileContactName &&
                    Boolean(errors?.firstMileContactName)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="firstMileContactPhone"
                  id="firstMileContactPhone"
                  type="number"
                  maxLength={32}
                  onBlur={handleBlur}
                  label="Contact Phone"
                  onKeyDown={(evt) =>
                    (evt.key === "e" || evt.key === "E" || evt.key === "+") &&
                    evt.preventDefault()
                  }
                  editCnt={editCnt}
                  onlyForPackage={true}
                  title={values?.firstMileContactPhone}
                  onChange={handleChange}
                  error={errors.firstMileContactPhone}
                  errorStatus={
                    touched?.firstMileContactPhone &&
                    Boolean(errors?.firstMileContactPhone)
                  }
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium mt-5">
                    Address
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>
                {/* <TextInputField
                  //   disabled={isLoading}
                  name="firstMileAddress"
                  id="firstMileAddress"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isAddress={true}
                  label="Full Address"
                  onlyForPackage={true}
                  editCnt={editCnt}
                  title={capitalizeFirst(values?.firstMileAddress).trimStart()}
                  error={errors.firstMileAddress}
                  errorStatus={
                    touched?.firstMileAddress &&
                    Boolean(errors?.firstMileAddress)
                  }
                /> */}
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Full Address
                  </label>
                  <div className="mt-1 sm:col-span-3 sm:mt-0">
                    <textarea
                      style={{
                        resize: editCnt ? "none" : "vertical",
                      }}
                      name="firstMileAddress"
                      id="firstMileAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={capitalizeFirst(
                        values?.firstMileAddress
                      ).trimStart()}
                      // placeholder="firstMileAddress"
                      disabled={editCnt}
                      rows={values?.firstMileAddress.length > 60 ? 3 : 1}
                      className={
                        editCnt
                          ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                          : `block w-full  rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none  py-2 px-3 text-sm `
                      }
                    />
                  </div>
                </div>

                <TextInputField
                  //   disabled={isLoading}
                  name="firstMileFloor"
                  id="firstMileFloor"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Floor"
                  onlyForPackage={true}
                  editCnt={editCnt}
                  title={capitalizeFirst(values?.firstMileFloor).trimStart()}
                  error={errors.firstMileFloor}
                  errorStatus={
                    touched?.firstMileFloor && Boolean(errors?.firstMileFloor)
                  }
                />

                <TextInputField
                  //   disabled={isLoading}
                  name="firstMileRoom"
                  id="firstMileRoom"
                  onlyForPackage={true}
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Room"
                  editCnt={editCnt}
                  title={capitalizeFirst(values?.firstMileRoom).trimStart()}
                  error={errors.firstMileRoom}
                  errorStatus={
                    touched?.firstMileRoom && Boolean(errors?.firstMileRoom)
                  }
                />
              </div>

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    International
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <DropDownField
                  label="Supplier"
                  disabled={true}
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={[{ value: values?.internationalMileSupplier || "-" }]}
                  isSystemVariable={true}
                  title={values?.internationalMileSupplier || "-"}
                  error={errors.internationalMileSupplier}
                  errorStatus={
                    touched?.internationalMileSupplier &&
                    Boolean(errors?.internationalMileSupplier)
                  }
                />
                {internationMileIsThere && (
                  <>
                    <TextInputField
                      //   disabled={isLoading}
                      name="internationalMileContactName"
                      onlyForPackage={true}
                      id="internationalMileContactName"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Contact Name"
                      editCnt={editCnt}
                      title={values?.internationalMileContactName}
                      error={errors.internationalMileContactName}
                      errorStatus={
                        touched?.internationalMileContactName &&
                        Boolean(errors?.internationalMileContactName)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="internationalMileContactPhone"
                      id="internationalMileContactPhone"
                      type="number"
                      onBlur={handleBlur}
                      onlyForPackage={true}
                      label="Contact Phone"
                      onChange={handleChange}
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "+") &&
                        evt.preventDefault()
                      }
                      maxLength={32}
                      editCnt={editCnt}
                      title={values?.internationalMileContactPhone}
                      error={errors.internationalMileContactPhone}
                      errorStatus={
                        touched?.internationalMileContactPhone &&
                        Boolean(errors?.internationalMileContactPhone)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="internationalMileCompany"
                      id="internationalMileCompany"
                      type="text"
                      onlyForPackage={true}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Sender Company"
                      editCnt={editCnt}
                      title={capitalizeFirst(
                        values?.internationalMileCompany
                      ).trimStart()}
                      error={errors.internationalMileCompany}
                      errorStatus={
                        touched?.internationalMileCompany &&
                        Boolean(errors?.internationalMileCompany)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      name="internationalMileCity"
                      id="internationalMileCity"
                      type="text"
                      onBlur={handleBlur}
                      onlyForPackage={true}
                      onChange={handleChange}
                      label="Sender City"
                      editCnt={editCnt}
                      title={capitalizeFirst(
                        values?.internationalMileCity
                      ).trimStart()}
                      error={errors.internationalMileCity}
                      errorStatus={
                        touched?.internationalMileCity &&
                        Boolean(errors?.internationalMileCity)
                      }
                    />
                    {/* <TextInputField
                      //   disabled={isLoading}
                      name="internationalMileAddress"
                      id="internationalMileAddress"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onlyForPackage={true}
                      label="Sender Address"
                      editCnt={editCnt}
                      isAddress={true}
                      title={capitalizeFirst(
                        values?.internationalMileAddress
                      ).trimStart()}
                      error={errors.internationalMileAddress}
                      errorStatus={
                        touched?.internationalMileAddress &&
                        Boolean(errors?.internationalMileAddress)
                      }
                    /> */}
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Sender Address
                      </label>
                      <div className="mt-1 sm:col-span-3 sm:mt-0">
                        <textarea
                          style={{
                            resize: editCnt ? "none" : "vertical",
                          }}
                          name="internationalMileAddress"
                          id="internationalMileAddress"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={capitalizeFirst(
                            values?.internationalMileAddress
                          ).trimStart()}
                          // placeholder="internationalMileAddress"
                          disabled={editCnt}
                          rows={
                            values?.internationalMileAddress.length > 60 ? 3 : 1
                          }
                          className={
                            editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full  rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none  py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>
                    <TextInputField
                      //   disabled={isLoading}
                      name="internationalMilePostCode"
                      id="internationalMilePostCode"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender Post Code"
                      onlyForPackage={true}
                      editCnt={editCnt}
                      title={values?.internationalMilePostCode}
                      error={errors.internationalMilePostCode}
                      errorStatus={
                        touched?.internationalMilePostCode &&
                        Boolean(errors?.internationalMilePostCode)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      onlyForPackage={true}
                      name="internationalMileDestinationAddress"
                      id="internationalMileDestinationAddress"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Destination Address"
                      editCnt={editCnt}
                      title={capitalizeFirst(
                        values?.internationalMileDestinationAddress
                      ).trimStart()}
                      error={errors.internationalMileDestinationAddress}
                      errorStatus={
                        touched?.internationalMileDestinationAddress &&
                        Boolean(errors?.internationalMileDestinationAddress)
                      }
                    />
                  </>
                )}
              </div>

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Last Mile
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <DropDownField
                  label="Supplier"
                  disabled={true}
                  onBlur={handleBlur}
                  editCnt={editCnt}
                  array={[{ value: values?.lastMileSupplier || "-" }]}
                  isSystemVariable={true}
                  title={values?.lastMileSupplier || "-"}
                  error={errors.lastMileSupplier}
                  errorStatus={
                    touched?.lastMileSupplier &&
                    Boolean(errors?.lastMileSupplier)
                  }
                />

                {lastMileIsThere && (
                  <>
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderName"
                      onlyForPackage={true}
                      id="lastMileSenderName"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender Name"
                      editCnt={editCnt}
                      title={values?.lastMileSenderName}
                      error={errors.lastMileSenderName}
                      errorStatus={
                        touched?.lastMileSenderName &&
                        Boolean(errors?.lastMileSenderName)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderAddress"
                      onlyForPackage={true}
                      id="lastMileSenderAddress"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender Address"
                      editCnt={editCnt}
                      title={capitalizeFirst(
                        values?.lastMileSenderAddress
                      ).trimStart()}
                      error={errors.lastMileSenderAddress}
                      errorStatus={
                        touched?.lastMileSenderAddress &&
                        Boolean(errors?.lastMileSenderAddress)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderCity"
                      onlyForPackage={true}
                      id="lastMileSenderCity"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender City"
                      editCnt={editCnt}
                      title={values?.lastMileSenderCity}
                      error={errors.lastMileSenderCity}
                      errorStatus={
                        touched?.lastMileSenderCity &&
                        Boolean(errors?.lastMileSenderCity)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderPostcode"
                      id="lastMileSenderPostcode"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender Post Code"
                      onlyForPackage={true}
                      editCnt={editCnt}
                      title={values?.lastMileSenderPostcode}
                      error={errors.lastMileSenderPostcode}
                      errorStatus={
                        touched?.lastMileSenderPostcode &&
                        Boolean(errors?.lastMileSenderPostcode)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderCountry"
                      id="lastMileSenderCountry"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Sender Country"
                      onlyForPackage={true}
                      editCnt={editCnt}
                      title={values?.lastMileSenderCountry}
                      error={errors.lastMileSenderCountry}
                      errorStatus={
                        touched?.lastMileSenderCountry &&
                        Boolean(errors?.lastMileSenderCountry)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileSenderPhone"
                      id="lastMileSenderPhone"
                      type="number"
                      onBlur={handleBlur}
                      onlyForPackage={true}
                      label="Sender Phone"
                      onChange={handleChange}
                      maxLength={32}
                      editCnt={editCnt}
                      title={values?.lastMileSenderPhone}
                      error={errors.lastMileSenderPhone}
                      errorStatus={
                        touched?.lastMileSenderPhone &&
                        Boolean(errors?.lastMileSenderPhone)
                      }
                    />
                    {/*  */}
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnName"
                      onlyForPackage={true}
                      id="lastMileReturnName"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Return Name"
                      editCnt={editCnt}
                      title={values?.lastMileReturnName}
                      error={errors.lastMileReturnName}
                      errorStatus={
                        touched?.lastMileReturnName &&
                        Boolean(errors?.lastMileReturnName)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnAddress"
                      onlyForPackage={true}
                      id="lastMileReturnAddress"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Return Address"
                      editCnt={editCnt}
                      title={values?.lastMileReturnAddress}
                      error={errors.lastMileReturnAddress}
                      errorStatus={
                        touched?.lastMileReturnAddress &&
                        Boolean(errors?.lastMileReturnAddress)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnCity"
                      onlyForPackage={true}
                      id="lastMileReturnCity"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Return City"
                      editCnt={editCnt}
                      title={values?.lastMileReturnCity}
                      error={errors.lastMileReturnCity}
                      errorStatus={
                        touched?.lastMileReturnCity &&
                        Boolean(errors?.lastMileReturnCity)
                      }
                    />
                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnPostcode"
                      id="lastMileReturnPostcode"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Return Post Code"
                      onlyForPackage={true}
                      editCnt={editCnt}
                      title={values?.lastMileReturnPostcode}
                      error={errors.lastMileReturnPostcode}
                      errorStatus={
                        touched?.lastMileReturnPostcode &&
                        Boolean(errors?.lastMileReturnPostcode)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnCountry"
                      id="lastMileReturnCountry"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Return Country"
                      onlyForPackage={true}
                      editCnt={editCnt}
                      title={values?.lastMileReturnCountry}
                      error={errors.lastMileReturnCountry}
                      errorStatus={
                        touched?.lastMileReturnCountry &&
                        Boolean(errors?.lastMileReturnCountry)
                      }
                    />

                    <TextInputField
                      //   disabled={isLoading}
                      name="lastMileReturnPhone"
                      id="lastMileReturnPhone"
                      type="number"
                      onBlur={handleBlur}
                      onlyForPackage={true}
                      label="Return Phone"
                      onChange={handleChange}
                      maxLength={32}
                      editCnt={editCnt}
                      title={values?.lastMileReturnPhone}
                      error={errors.lastMileReturnPhone}
                      errorStatus={
                        touched?.lastMileReturnPhone &&
                        Boolean(errors?.lastMileReturnPhone)
                      }
                    />
                  </>
                )}
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

export default ServiceSupplier;
