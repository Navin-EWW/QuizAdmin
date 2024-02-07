import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { object, string } from "yup";
import {
  MerchantDetail,
  MerchantType,
  UpdateMerchant,
} from "../../../api/merchant/merchant";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import { TextFormatInput } from "../../../Components/TextFormatInput/TextFormatInput";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import UseToast from "../../../hooks/useToast";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { capitalizeFirst } from "../../../utils/Capitalization";
import { flagArray } from "../../../utils/Flags";
import FormInputFiled from "../UserDetails/FormInputFiled";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type Props = {
  editCnt: boolean;
  setEditCnt: any;
  state: any;
  show?: boolean;
  tabRedirect: boolean;
  compareToggle: boolean;
  setcompareToggle: React.Dispatch<boolean>;
};

export default function MerchantAbout({
  show,
  setcompareToggle,
  compareToggle,
  editCnt,
  tabRedirect,
  setEditCnt,
  state,
}: Props) {
  const [merchantData, setMerchantData] = useState<MerchantData>(
    initialMerchantDataData
  );

  const [apierror, setapierror] = useState<any>("");
  const [cancelModel, setcancelModel] = useState<boolean>(false);

  const [merchantType, setMerchantType] = useState<any[]>([]);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const { dataUpdatedAt, refetch } = useQuery(
    ["merchantDetails"],
    () =>
      MerchantDetail({
        id: state,
      }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          setMerchantData(data?.data);
        }
      },
    }
  );

  useQuery(["type"], () => MerchantType(), {
    keepPreviousData: true,
    onSuccess(data: any) {
      if (data.status) {
        setMerchantType(data.data?.types);
      }
    },
  });

  const { mutate, isLoading }: any = useMutation(UpdateMerchant, {
    onSuccess: (data: any) => {
      dirty && UseToast(data?.message, "success");
      refetch();
      setEditCnt(!editCnt);
    },
    onError: (data: any) => {
      typeof data === "string"
        ? setapierror({ status: false, message: data })
        : setapierror(data);
    },
  });

  const MerchentBasicSchema = object().shape({
    name: string()
      .required("Required Field")
      // .max(35, "Too long")
      .min(2, "Name must contain 2 or more characters. please try again"),
    legalEntityName: string()
      .required("Required Field")
      // .max(35, "Too long")
      .min(
        2,
        "Legal entity name must contain 2 or more characters. please try again."
      ),
    description: string(),
    address: string().required("Required Field"),
    type: string().required("Required Field"),
    creditPeriod: string()
      .required("Required Field")
      .max(2, "Credit Period must be 2 characters"),
    businessRegistration: string().required("Required Field"),
    // .max(9999999999, "Business Registration max limit 10 characters"),
    idCard: string(),
    country: string().required("Required Field"),
  });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    setValues,
    setTouched,
    errors,
    touched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: MerchentBasicSchema,
    enableReinitialize: true,
    initialValues: {
      name: merchantData?.name || "",
      legalEntityName: merchantData?.legalEntityName || "",
      description: merchantData?.description || "",
      address: merchantData?.address || "",
      type: merchantData?.type || "",
      creditPeriod: merchantData?.creditPeriod || "",
      businessRegistration:
        String(merchantData?.businessRegistration).replace(/\s/g, "") || "",
      idCard: merchantData?.idCard || "",
      country: merchantData?.country || "",
      status: merchantData?.status || "",
      createdBy: {
        firstName: merchantData?.createdBy?.firstName,
        lastName: merchantData?.createdBy?.lastName,
      },
      createdOn: merchantData?.createdOn,
      merchantCode: merchantData?.merchantCode,
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({
        ...values,
        merchantId: state,
      });
    },
  });

  const switchOnChange = (e: any) => {
    setFieldValue("status", values.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
  };

  const defaultValues = () => {
    setFieldValue("name", merchantData?.name);
    setFieldValue("legalEntityName", merchantData?.legalEntityName);
    setFieldValue("description", merchantData?.description);
    setFieldValue("address", merchantData?.address);
    setFieldValue("type", merchantData?.type);
    setFieldValue("creditPeriod", merchantData?.creditPeriod);
    setFieldValue(
      "businessRegistration",
      String(merchantData?.businessRegistration).replace(/\s/g, "") || ""
    );
    setFieldValue("idCard", merchantData?.idCard);
    setFieldValue("country", merchantData?.country);
    setFieldValue("status", merchantData?.status);
    setFieldValue("merchantCode", merchantData?.merchantCode);

    setTouched({});
    setapierror("");
  };

  useEffect(() => {
    if (!apierror.status) {
      setTimeout(() => {
        setapierror("");
      }, 7000);
    }
  }, [apierror]);
  const cancelClicked = () => {
    if (compareToggle) {
      setcancelModel(true);
    } else {
      setEditCnt(!editCnt);
    }
    // refetch();
    // cancelBack();
  };

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

  const confirmBack = () => {
    defaultValues();
    setEditCnt(!editCnt);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  return show ? (
    <div className="relative pb-10">
      <form
        className="space-y-8 shadow-md rounded-b-lg"
        onSubmit={handleSubmit}
      >
        <div className="bg-white p-5 rounded-b-lg">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                Basic Information
              </h3>
            </div>
            <div className="space-y-6 sm:space-y-5 font-Inter">
              {/* <FormInputFiled
                disabled={editCnt}
                label={`Merchant Name${!editCnt ? "*" : ""}`}
                editCnt={editCnt}
                value={
                  editCnt
                    ? capitalizeFirst(merchantData?.name).trimStart()
                    : capitalizeFirst(values?.name).trimStart()
                }
                handleOnChange={handleChange}
                placeholder="Merchant Name"
                id="name"
                name="name"
                type="text"
                onBlur={handleBlur}
                error={errors?.name}
                errorStatus={touched?.name && Boolean(errors?.name)}
              /> */}

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {`Merchant Name${!editCnt ? "*" : ""}`}
                </label>

                <div
                  className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
                >
                  <textarea
                    style={{ resize: "none" }}
                    onChange={handleChange}
                    disabled={editCnt}
                    value={
                      editCnt
                        ? capitalizeFirst(merchantData?.name).trimStart()
                        : capitalizeFirst(values?.name).trimStart()
                    }
                    placeholder="Merchant Name"
                    id="name"
                    name="name"
                    rows={values?.name.length > 34 ? 2 : 1}
                    className={
                      editCnt
                        ? `block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                            !editCnt ? "text-table_head_color" : ""
                          }`
                        : `block rounded-md w-full border font-normal ${
                            touched?.name && Boolean(errors?.name)
                              ? "border-error_red text-error_text "
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm ${
                            editCnt ? "text-table_head_color" : ""
                          }`
                    }
                  />
                  {touched?.name && Boolean(errors?.name) && (
                    <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 fill-error_red"
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
                  {touched?.name && Boolean(errors?.name) && (
                    <p className="mt-21 text-sm text-error_red">
                      {errors?.name}
                    </p>
                  )}
                </div>
              </div>

              {/* <FormInputFiled
                disabled={editCnt}
                label={`Legal Entity Name${!editCnt ? "*" : ""}`}
                editCnt={editCnt}
                value={
                  editCnt
                    ? capitalizeFirst(merchantData?.legalEntityName).trimStart()
                    : capitalizeFirst(values?.legalEntityName).trimStart()
                }
                handleOnChange={handleChange}
                id="legalEntityName"
                name="legalEntityName"
                type="text"
                onBlur={handleBlur}
                error={errors?.legalEntityName}
                errorStatus={
                  touched?.legalEntityName && Boolean(errors?.legalEntityName)
                }
              /> */}
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {`Legal Entity Name${!editCnt ? "*" : ""}`}
                </label>

                <div
                  className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
                >
                  <textarea
                    style={{ resize: "none" }}
                    onChange={handleChange}
                    disabled={editCnt}
                    onBlur={handleBlur}
                    value={
                      editCnt
                        ? capitalizeFirst(
                            merchantData?.legalEntityName
                          ).trimStart()
                        : capitalizeFirst(values?.legalEntityName).trimStart()
                    }
                    id="legalEntityName"
                    name="legalEntityName"
                    rows={values?.legalEntityName.length > 34 ? 2 : 1}
                    className={
                      editCnt
                        ? `block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                            !editCnt ? "text-table_head_color" : ""
                          }`
                        : `block rounded-md w-full border font-normal ${
                            touched?.legalEntityName &&
                            Boolean(errors?.legalEntityName)
                              ? "border-error_red text-error_text "
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm ${
                            editCnt ? "text-table_head_color" : ""
                          }`
                    }
                  />
                  {touched?.legalEntityName &&
                    Boolean(errors?.legalEntityName) && (
                      <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                        <svg
                          className="h-5 w-5 fill-error_red"
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
                  {touched?.legalEntityName &&
                    Boolean(errors?.legalEntityName) && (
                      <p className="mt-21 text-sm text-error_red">
                        {errors?.legalEntityName}
                      </p>
                    )}
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Description
                </label>

                <div
                  className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg`}
                >
                  <textarea
                    style={{ resize: editCnt ? "none" : "vertical" }}
                    onChange={handleChange}
                    disabled={editCnt}
                    onBlur={handleBlur}
                    value={capitalizeFirst(values?.description)}
                    id="description"
                    name="description"
                    // type="text"
                    rows={4}
                    className={
                      editCnt
                        ? `block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                            !editCnt ? "text-table_head_color" : ""
                          }`
                        : `block rounded-md w-full border font-normal ${
                            touched?.description && Boolean(errors?.description)
                              ? "border-error_red text-error_text "
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm ${
                            editCnt ? "text-table_head_color" : ""
                          }`
                    }
                  />
                  {touched?.description && Boolean(errors?.description) && (
                    <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 fill-error_red"
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
                  {touched?.description && Boolean(errors?.description) && (
                    <p className="mt-21 text-sm text-error_red">
                      {errors?.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Address{!editCnt ? "*" : ""}
                </label>

                <div
                  className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  max-w-[520px]`}
                >
                  <textarea
                    onChange={handleChange}
                    style={{ resize: editCnt ? "none" : "vertical" }}
                    disabled={editCnt}
                    onBlur={handleBlur}
                    value={capitalizeFirst(values?.address)}
                    id="address"
                    name="address"
                    rows={4}
                    // maxLength={120}
                    className={
                      editCnt
                        ? `block w-full pr-10 max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                            !editCnt ? "text-table_head_color" : ""
                          }`
                        : `block rounded-md w-full border font-normal ${
                            touched?.address && Boolean(errors?.address)
                              ? "border-error_red text-error_text "
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                          } focus:text-font_black focus:outline-none w-full py-2 px-3 text-sm ${
                            editCnt ? "text-table_head_color" : ""
                          }`
                    }
                  />
                  {touched?.address && Boolean(errors?.address) && (
                    <div className="pointer-events-none absolute top-[9px] right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 fill-error_red"
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
                  {touched?.address && Boolean(errors?.address) && (
                    <p className="mt-21 text-sm text-error_red">
                      {errors?.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="type"
                  className="block text-font_dark font-medium"
                >
                  {!editCnt ? "Type*" : "Type"}
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {editCnt ? (
                    <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                      {values?.type}
                    </span>
                  ) : (
                    <select
                      disabled={editCnt}
                      id="type"
                      name="type"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={editCnt ? merchantData?.type : values?.type}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal  ${
                              touched?.type && Boolean(errors?.type)
                                ? "border-error_red text-error_text"
                                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                            }  focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      <option value="">Select Type</option>
                      {merchantType.map((type, index) => (
                        <option
                          selected={merchantData?.type === type}
                          value={`${type}`}
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  )}

                  <p className="mt-21 text-sm text-error_red" id="email-error">
                    {touched?.type && Boolean(errors?.type) ? errors.type : ""}
                  </p>
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="country"
                  className="block text-font_dark font-medium"
                >
                  {!editCnt ? "Country*" : "Country"}
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {editCnt ? (
                    <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                      {values?.country}
                    </span>
                  ) : (
                    <select
                      disabled={editCnt}
                      id="country"
                      name="country"
                      value={values?.country}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm appearance-none`
                          : `block w-full text-font_black max-w-lg rounded-md border font-normal  ${
                              touched?.country && Boolean(errors?.country)
                                ? "border-error_red text-error_text"
                                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                            }  focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      {flagArray.map((country, index) => (
                        <option
                          selected={merchantData?.country === country?.country}
                          value={country.country}
                        >
                          {country.country}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="mt-21 text-sm text-error_red" id="email-error">
                    {touched?.country && Boolean(errors?.country)
                      ? errors?.country
                      : ""}
                  </p>
                </div>
              </div>

              <FormInputFiled
                disabled={true}
                label="Created On"
                editCnt={editCnt}
                value={
                  merchantData?.createdOn
                    ? moment(merchantData?.createdOn).format(
                        "YYYY/MM/DD HH:mm:ss"
                      )
                    : ""
                }
                id="createdOn"
                name="createdOn"
                type="text"
              />

              <FormInputFiled
                disabled={true}
                label="Created By"
                editCnt={editCnt}
                value={
                  capitalizeFirst(merchantData?.createdBy?.firstName) +
                  " " +
                  capitalizeFirst(merchantData?.createdBy?.lastName)
                }
                id="createdOn"
                name="createdOn"
                type="text"
              />

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="active_state"
                  className="block text-font_dark font-medium"
                >
                  Active
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {editCnt ? (
                    <SwitchToggle
                      disabled={editCnt}
                      enabled={merchantData?.status === "ACTIVE"}
                    />
                  ) : (
                    <SwitchToggle
                      enabled={values?.status === "ACTIVE"}
                      onChange={switchOnChange}
                    />
                  )}
                </div>
              </div>

              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <h3 className="text-lg mt-2Created By font-bold leading-6 text-font_black font-Inter">
                  Detail Information
                </h3>
              </div>

              <div className="space-y-6 sm:space-y-5 font-Inter">
                <FormInputFiled
                  disabled={true}
                  label="Merchant Code"
                  editCnt={editCnt}
                  value={merchantData?.merchantCode}
                  id="merchantCode"
                  name="merchantCode"
                  type="text"
                />

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label
                    htmlFor="creditPeriod"
                    className="block text-font_dark font-medium"
                  >
                    {!editCnt ? "Credit Term*" : "Credit Term"}
                  </label>

                  <div className="relative mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                    {editCnt ? (
                      <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                        {values?.creditPeriod} days
                      </span>
                    ) : (
                      <div className="relative group  mt-1 rounded-md sm:col-span-2 sm:mt-0 sm:max-w-xs max-w-lg w-full">
                        <select
                          name="creditPeriod"
                          id="creditPeriod"
                          placeholder=""
                          disabled={editCnt}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={
                            editCnt
                              ? merchantData?.creditPeriod
                              : values?.creditPeriod
                          }
                          className={`block w-full max-w-lg rounded-md border font-normal ${
                            touched?.creditPeriod &&
                            Boolean(errors?.creditPeriod)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary active:border-blue_primary "
                          }  focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `}
                        >
                          <option value="">Day(s)</option>
                          <option value="7">7 Days</option>
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                        </select>
                        {/* <XMarkIcon
                          onClick={() => (values.creditPeriod = "")}
                          className="w-4 h-4 absolute top-[10px] right-4 opacity-0 group-hover:opacity-100"
                        /> */}

                        <p
                          className="mt-21 text-sm text-error_red"
                          id="email-error"
                        >
                          {touched?.creditPeriod &&
                          Boolean(errors?.creditPeriod)
                            ? errors.creditPeriod
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <TextFormatInput
                  formatType="### ### ### ### ### ### ### ### ### ### ### ###"
                  name="businessRegistration"
                  defaultValue={
                    editCnt
                      ? String(merchantData?.businessRegistration)
                      : String(values?.businessRegistration)
                  }
                  onChange={(e) => {
                    setValues({ ...values, businessRegistration: e });
                  }}
                  error={errors?.businessRegistration}
                  errorStatus={
                    touched?.businessRegistration &&
                    Boolean(errors?.businessRegistration)
                  }
                  onBlur={handleBlur}
                  disabled={editCnt}
                  editCnt={editCnt}
                  id="businessRegistration"
                  label={`Business Registration${!editCnt ? "*" : ""}`}
                />
                <FormInputFiled
                  disabled={editCnt}
                  label="ID Card"
                  editCnt={editCnt}
                  value={editCnt ? merchantData?.idCard : values?.idCard}
                  handleOnChange={handleChange}
                  id="idCard"
                  name="idCard"
                  type="text"
                  onBlur={handleBlur}
                  error={errors?.idCard}
                  errorStatus={touched?.idCard && Boolean(errors?.idCard)}
                />
              </div>

              <div>
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
                      onClick={cancelClicked}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <DialogBox
                  // @ts-ignore
                  showDialog={showPrompt}
                  confirmNavigation={confirmNavigation}
                  cancelNavigation={cancelNavigation}
                />
                <DialogBox
                  showDialog={cancelModel}
                  confirmNavigation={confirmBack}
                  cancelNavigation={cancelBack}
                />

                {!apierror.status ? (
                  <span
                    className="mt-21 text-sm text-error_red"
                    id="email-error"
                  >
                    {apierror?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}
interface MerchantData {
  address: string;
  businessRegistration: number | string;
  country: string;
  createdBy: { firstName: string; lastName: string };
  createdOn: string;
  creditPeriod: string | number;
  description: string;
  id: string;
  idCard: string;
  legalEntityName: string;
  merchantCode: string;
  name: string;
  preferredServiceLane: string;
  status: string;
  type: string;
  updatedAt: string;
}

const initialMerchantDataData: MerchantData = {
  address: "",
  businessRegistration: "",
  country: "",
  createdBy: { firstName: "", lastName: "" },
  createdOn: "",
  creditPeriod: "",
  description: "",
  id: "",
  idCard: "",
  legalEntityName: "",
  merchantCode: "",
  name: "",
  preferredServiceLane: "",
  status: "",
  type: "",
  updatedAt: "",
};

type SwitchProps = {
  enabled: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
};
