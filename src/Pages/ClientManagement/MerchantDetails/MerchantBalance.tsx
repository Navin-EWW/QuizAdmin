import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import { object, ref, string, number, boolean } from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import { EditSupplierAboutAPI } from "../../../api/serviceSupplier/serviceSupplier";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import Spinner from "../../../utils/Spinner";
import MerchantBalanceLog from "./MerchantBalanceLog";

type MerchantBalanceType = {
  merchantId: string;
  merchantAPIKey: string;
  secret: string;
  accountBalance: string;
  connectStatus: boolean;
};

type Props = {
  editCnt: boolean;
  setEditCnt: React.Dispatch<boolean>;
  cancelModal: boolean;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
  compareToggle: boolean;
  tabRedirect: boolean;
  show: boolean;
  state?: string;
  // setnameS?: Dispatch<SetStateAction<string | undefined>>;
};

const MerchantBalance = ({
  editCnt,
  // setnameS,
  setEditCnt,
  setcancelModal,
  setcompareToggle,
  compareToggle,
  show,
  tabRedirect,
  cancelModal,
  state,
}: Props) => {
  const [apiError, setapiError] = useState<any>("");
  const navigate = useNavigate();
  const [showeye, setShowEye] = useState<boolean>(false);
  const params = useParams();

  const [MerchantBalanceDataData, setMerchantBalanceDataData] =
    useState<MerchantBalanceType>();

  const id: string | undefined = params?.id;

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 5000);
    }
  }, [apiError]);

  const {
    mutate,
    error,
    isLoading: onmutateIsloading,
  } = useMutation(EditSupplierAboutAPI, {
    onSuccess: (data) => {
      setEditCnt(!editCnt);
      UseToast(data.message, "success");
      //   refetch();
    },
    onError: (data: any) => {
      setEditCnt(!editCnt);
      typeof data === "string"
        ? setapiError({ status: false, message: data })
        : setapiError(data);
    },
  });

  //   const { refetch, isLoading, isFetching, isFetched } = useQuery(
  //     ["MerchantBalanceData"],
  //     () => MerchantBalanceDataAPI(id),
  //     {
  //       onSuccess(data) {
  //         setMerchantBalanceDataData(data?.data);
  //         setnameS(data?.data?.name);
  //       },
  //       onError(error: any) {
  //         typeof error !== "string"
  //           ? UseToast(error?.message, "error")
  //           : UseToast(error, "error");
  //         navigate("/service-supplier/list");
  //       },
  //     }
  //   );

  const MerchantBalanceDataSchema = object()
    .nullable()
    .shape({
      merchantId: string().required("Required Field"),
      merchantAPIKey: string().required("Required Field"),
      secret: string().required("Required Field"),
      accountBalance: string().required("Required Field"),
      connectStatus: boolean().required("Required Field"),
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
    validationSchema: MerchantBalanceDataSchema,
    enableReinitialize: true,
    initialValues: {
      merchantId: "87654321",
      merchantAPIKey: "abcabc",
      secret: "12343200000000",
      accountBalance: "HK$29,416.00",
      connectStatus: false,
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      console.log(values);
      // mutate({
      //   id: id,
      //   merchantId: values.merchantId,
      //   merchantAPIKey: values.merchantAPIKey,
      //   secret: values.secret,
      //   accountBalance: values.accountBalance,
      //   connectStatus: values.connectStatus,
      // });
    },
  });

  useEffect(() => {
    // defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("merchantId", MerchantBalanceDataData?.merchantId);
    setFieldValue("merchantAPIKey", MerchantBalanceDataData?.merchantAPIKey);
    setFieldValue("secret", MerchantBalanceDataData?.secret);
    setFieldValue("accountBalance", MerchantBalanceDataData?.accountBalance);
    setFieldValue(
      "lastMconnectStatusile",
      MerchantBalanceDataData?.connectStatus
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

  const cancelClicked = () => {
    // if (dirty) {
    //   setcancelModal(true);
    // } else {
    //   setEditCnt(!editCnt);
    // }
    setEditCnt(!editCnt);
  };

  const isFetched = true;

  return show ? (
    <div className="relative pb-20">
      {isFetched ? (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="bg-white px-5 pt-5  shadow-md rounded-b-md">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                  JP local merchant connected
                </h3>
              </div>
              <div className="space-y-6 sm:space-y-5 font-Inter sm:border-t border-grey_border_table">
                {!editCnt ? (
                  <FormInputFiled
                    firstElement={true}
                    disabled={false}
                    label={`Merchant ID`}
                    editCnt={editCnt}
                    value={values.merchantId ? values.merchantId : ""}
                    handleOnChange={handleChange}
                    placeholder="Merchant ID"
                    error={errors?.merchantId}
                    errorStatus={
                      touched?.merchantId && Boolean(errors?.merchantId)
                    }
                    id="merchantId"
                    name="merchantId"
                    type="text"
                  />
                ) : (
                  <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Merchant ID
                    </label>
                    <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                      <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                        {values.merchantId ? values.merchantId : "-"}
                      </label>
                    </div>
                  </div>
                )}

                {!editCnt ? (
                  <FormInputFiled
                    disabled={!editCnt}
                    label={`Merchant API Key`}
                    editCnt={editCnt}
                    value={values.merchantAPIKey ? values.merchantAPIKey : ""}
                    handleOnChange={handleChange}
                    id="merchantAPIKey"
                    name="merchantAPIKey"
                    type="text"
                  />
                ) : (
                  <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Merchant API Key
                    </label>
                    <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                      <div className="block relative truncate w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 pl-3 pr-10 text-sm">
                        {showeye
                          ? values.merchantAPIKey
                            ? values.merchantAPIKey
                            : "-"
                          : values.merchantAPIKey
                          ? values.merchantAPIKey.replace(/./g, "*")
                          : "-"}

                        {values.merchantAPIKey && (
                          <span className="absolute top-2 right-3">
                            <a
                              className="cursor-pointer"
                              onClick={() => setShowEye(!showeye)}
                            >
                              {showeye ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-6 h-6 stroke-grey_border"
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
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-6 h-6 stroke-grey_border"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                  />
                                </svg>
                              )}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Secret
                  </label>
                  <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16">
                    <div className="flex rounded-md font-normal">
                      <input
                        name="Secret"
                        id="Secret"
                        placeholder="Secret"
                        maxLength={15}
                        onChange={handleChange}
                        value={
                          values.secret ? values.secret.replace(/./g, "*") : "-"
                        }
                        disabled={true}
                        className={
                          editCnt
                            ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                            : `block w-full max-w-lg rounded-md border  bg-disable_grey font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                        }
                      />
                    </div>
                    <span
                      className={`block truncate text-sm w-full text-table_head_color ${
                        editCnt ? "px-3" : ""
                      } py-2`}
                    >
                      (Masked information can only be re-generated at the local
                      portal and re-import to the international portal)
                    </span>
                  </div>
                </div>
                {!editCnt ? (
                  <FormInputFiled
                    disabled={!editCnt}
                    label={`Account Balance`}
                    editCnt={editCnt}
                    value={values.accountBalance ? values.accountBalance : ""}
                    handleOnChange={handleChange}
                    // placeholder="Operating Regions"
                    id="accountBalance"
                    name="accountBalance"
                    type="text"
                  />
                ) : (
                  <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                    <label className="block text-font_dark font-medium">
                      Account Balance
                    </label>
                    <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 p r-6">
                      <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                        {values.accountBalance ? values.accountBalance : "-"}
                      </label>
                    </div>
                  </div>
                )}

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Connect status
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0 px-3">
                    {!editCnt ? (
                      <SwitchToggle
                        enabled={values?.connectStatus}
                        onChange={() => {
                          setFieldValue(
                            "connectStatus",
                            values.connectStatus ? false : true
                          );
                        }}
                        extraCss="ml-0"
                      />
                    ) : (
                      <span
                        className={`${
                          values?.connectStatus
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {values?.connectStatus ? "True" : "False"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:border-t border-grey_border_table sm:pt-5">
                  <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                    <label className="block sm:col-span-1 text-font_dark font-medium">
                      Log
                    </label>
                  </div>
                  <MerchantBalanceLog
                    editCnt={editCnt}
                    operatingRegionid={id}
                  />
                </div>

                {apiError && (
                  <div className="sm:pt-5">
                    <p className="mt-21 text-sm text-error_red">{apiError}</p>
                  </div>
                )}

                {!editCnt && (
                  <div className="flex gap-3 flex-wrap justify-end pb-8">
                    <button
                      type="submit"
                      disabled={onmutateIsloading || !dirty}
                      className={`rounded-md ${
                        dirty
                          ? "bg-blue_primary hover:bg-hoverChange"
                          : "bg-grey_border_table_disable"
                      }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none`}
                    >
                      {onmutateIsloading ? <ButtonSpinner /> : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      disabled={onmutateIsloading}
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
        </form>
      ) : (
        <Spinner />
      )}
    </div>
  ) : null;
};

export default MerchantBalance;

export interface MerchantBalanceDataTypes {
  id: string;
  name: string;
  operatingRegions: string[];
  integration: boolean | undefined;
  firstMile: boolean | undefined;
  internationalMile: boolean | undefined;
  lastMile: boolean | undefined;
  createdOn: Date;
  createdBy: string | null;
}
