import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import OperatingRegionsTable from "./OperatingRegionsTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import { object, ref, string, number, boolean } from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import {
  EditSupplierAboutAPI,
  serviceSupplierAboutAPI,
} from "../../../api/serviceSupplier/serviceSupplier";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import Spinner from "../../../utils/Spinner";

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
  setnameS: Dispatch<SetStateAction<string | undefined>>;
};

const ServiceSupplierAbout = ({
  editCnt,
  setnameS,
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
  const params = useParams();
  const [serviceSupplierAboutData, setserviceSupplierAboutData] =
    useState<ServiceSupplierAboutTypes>();
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
      refetch();
    },
    onError: (data: any) => {
      setEditCnt(!editCnt);
      typeof data === "string"
        ? setapiError({ status: false, message: data })
        : setapiError(data);
    },
  });

  const { refetch, isLoading, isFetching, isFetched } = useQuery(
    ["serviceSupplierAbout"],
    () => serviceSupplierAboutAPI(id),
    {
      onSuccess(data) {
        setserviceSupplierAboutData(data?.data);
        setnameS(data?.data?.name);
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/service-supplier/list");
      },
    }
  );

  const serviceSupplierAboutSchema = object().nullable().shape({
    firstMile: boolean(),
    lastMile: boolean(),
    internationalMile: boolean(),
    integration: boolean(),
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
    validationSchema: serviceSupplierAboutSchema,
    enableReinitialize: true,
    initialValues: {
      firstMile: serviceSupplierAboutData?.firstMile,
      lastMile: serviceSupplierAboutData?.lastMile,
      internationalMile: serviceSupplierAboutData?.internationalMile,
      integration: serviceSupplierAboutData?.integration,
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      mutate({
        id: id,
        firstMile: values.firstMile,
        internationalMile: values.internationalMile,
        lastMile: values.lastMile,
        integration: values.integration,
      });
    },
  });

  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  const defaultValues = () => {
    setFieldValue("firstMile", serviceSupplierAboutData?.firstMile);
    setFieldValue("lastMile", serviceSupplierAboutData?.lastMile);
    setFieldValue(
      "internationalMile",
      serviceSupplierAboutData?.internationalMile
    );
    setFieldValue("integration", serviceSupplierAboutData?.integration);
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
    if (dirty) {
      setcancelModal(true);
    } else {
      setEditCnt(!editCnt);
    }
  };

  return show ? (
    <div className="relative pb-20">
      {isFetched ? (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="bg-white px-5 pt-5  shadow-md rounded-b-md">
            <div className="space-y-6 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5 font-Inter">
                {!editCnt ? (
                  <FormInputFiled
                    firstElement={true}
                    disabled={false}
                    label={`Supplier Name`}
                    editCnt={editCnt}
                    value={
                      serviceSupplierAboutData?.name
                        ? serviceSupplierAboutData?.name
                        : ""
                    }
                    // handleOnChange={handleChange}
                    placeholder="Supplier Name"
                    id="supplierName"
                    name="supplierName"
                    type="text"
                  />
                ) : (
                  <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
                    <label className="block text-font_dark font-medium">
                      Supplier Name
                    </label>
                    <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                      <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                        {serviceSupplierAboutData?.name}
                      </label>
                    </div>
                  </div>
                )}

                {!editCnt && (
                  <FormInputFiled
                    disabled={!editCnt}
                    label={`Operating Regions`}
                    editCnt={editCnt}
                    value={
                      serviceSupplierAboutData?.operatingRegions.length
                        ? serviceSupplierAboutData?.operatingRegions.join(",")
                        : ""
                    }
                    handleOnChange={handleChange}
                    // placeholder="Operating Regions"
                    id="operatingRegions"
                    name="operatingRegions"
                    type="text"
                  />
                )}

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Complete Intergation
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    {!editCnt ? (
                      <SwitchToggle
                        enabled={values?.integration}
                        onChange={() => {
                          setFieldValue(
                            "integration",
                            values.integration ? false : true
                          );
                        }}
                        extraCss="ml-0"
                      />
                    ) : (
                      <span
                        className={`${
                          values?.integration
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {values?.integration ? "True" : "False"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    First Mile
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    {!editCnt ? (
                      <SwitchToggle
                        enabled={values?.firstMile}
                        onChange={() => {
                          setFieldValue(
                            "firstMile",
                            values.firstMile ? false : true
                          );
                        }}
                        extraCss="ml-0"
                      />
                    ) : (
                      <span
                        // onClick={(e) => StatusHandle(user)}
                        className={`${
                          values?.firstMile
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {values?.firstMile ? "True" : "False"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    International
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    {!editCnt ? (
                      <SwitchToggle
                        enabled={values?.internationalMile}
                        onChange={() => {
                          setFieldValue(
                            "internationalMile",
                            values.internationalMile ? false : true
                          );
                        }}
                        extraCss="ml-0"
                      />
                    ) : (
                      <span
                        // onClick={(e) => StatusHandle(user)}
                        className={`${
                          values?.internationalMile
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {values?.internationalMile ? "True" : "False"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Last Mile
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    {!editCnt ? (
                      <SwitchToggle
                        enabled={values?.lastMile}
                        onChange={() => {
                          setFieldValue(
                            "lastMile",
                            values.lastMile ? false : true
                          );
                        }}
                        extraCss="ml-0"
                      />
                    ) : (
                      <span
                        // onClick={(e) => StatusHandle(user)}
                        className={`${
                          values?.lastMile
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {values?.lastMile ? "True" : "False"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Created On
                  </label>
                  <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                    {editCnt ? (
                      <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                        {serviceSupplierAboutData?.createdOn
                          ? moment(serviceSupplierAboutData?.createdOn).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )
                          : "-"}
                      </label>
                    ) : (
                      <div className="text-left flex sm:gap-5 gap-3 w-full ">
                        <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs ">
                          <div className="relative ">
                            <DatePicker
                              disabled={!editCnt}
                              startDate={new Date()}
                              onChange={(e: any) => {
                                // selectedDate(e);
                              }}
                              className="border rounded-md w-full py-2 px-3 focus:outline-blue_primary border-grey_border_table bg-disable_grey focus:text-font_black"
                              placeholderText="Start"
                              value={
                                serviceSupplierAboutData?.createdOn
                                  ? moment(
                                      serviceSupplierAboutData?.createdOn
                                    ).format("DD/MM/YYYY")
                                  : "-"
                              }
                              selectsStart
                              // maxDate={new Date()}
                            />
                            <button
                              type="button"
                              className="block absolute top-4 right-3"
                            >
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
                            </button>
                          </div>
                        </div>
                        <div
                          className={`mt-1 sm:col-span-2 sm:mt-0 sm:max-w-xs`}
                        >
                          <div className="relative">
                            <input
                              disabled={!editCnt}
                              value={
                                serviceSupplierAboutData?.createdOn
                                  ? moment(
                                      serviceSupplierAboutData?.createdOn
                                    ).format("HH:mm:ss")
                                  : "-"
                              }
                              className={
                                editCnt
                                  ? `block rounded-md font-normal bg-transparent border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_blackfocus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                                  : `block w-[100px] sm:w-[148px] rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm bg-disable_grey`
                              }
                            />
                            <button
                              type="button"
                              className="block absolute top-4 right-3"
                            >
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
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <FormInputFiled
                  disabled={true}
                  label={`Created By`}
                  editCnt={editCnt}
                  value={
                    serviceSupplierAboutData?.createdBy
                      ? serviceSupplierAboutData?.createdBy
                      : ""
                  }
                  handleOnChange={handleChange}
                  onBlur={handleBlur}
                  id="createdBy"
                  name="createdBy"
                  type="text"
                />

                {editCnt && (
                  <div className="sm:border-t border-grey_border_table sm:pt-5">
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                      <label className="block sm:col-span-1 text-font_dark  font-medium">
                        Operating Regions
                      </label>
                      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                    </div>
                    <OperatingRegionsTable operatingRegionid={id} />
                  </div>
                )}

                {apiError && (
                  <div className=" border-grey_border_table sm:pt-5">
                    <p className="mt-21 text-sm text-error_red">{apiError}</p>
                  </div>
                )}

                {!editCnt && (
                  <div className=" border-grey_border_table pb-8 sm:pt-5">
                    <div className="flex gap-3 flex-wrap justify-end">
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

export default ServiceSupplierAbout;

export interface ServiceSupplierAboutTypes {
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
