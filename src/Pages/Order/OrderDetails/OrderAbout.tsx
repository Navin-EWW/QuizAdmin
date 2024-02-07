import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { number, object, string } from "yup";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import ResetPasswordModal from "../../../Components/ResetPasswordModal/ResetPasswordModal";
import SwitchToggle from "../../../Components/SwitchToggle/SwitchToggle";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import { capitalizeFirst } from "../../../utils/Capitalization";
import _, { includes } from "lodash";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./OrderAbout.css";
import TextInputField from "../../../Components/MultipleInputField/TextInputField";
import moment from "moment";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../../hooks/useToast";
import {
  RoutingRuleDetails,
  UpdateOrderDetails,
} from "../../../api/orderDetails/orderDetails.api";
import {
  ExternalTrackingResponseType,
  InternalTrackingResponseType,
} from "../../../types/order";
import ButtonSpinner from "../../../utils/ButtonSpinner";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
type Props = {
  internalTracking: InternalTrackingResponseType[];
  externalTracking: ExternalTrackingResponseType[];
  editCnt: boolean;
  setEditCnt: any;
  province?: string;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  compareToggle: boolean;
  tabRedirect: boolean;
  cancelModal: boolean;
  setcancelModal: React.Dispatch<boolean>;
  orderDetailsData: any;
  transportationTypeDetails: any;
  show: boolean;
  productTypeDetails: any;
  pickUpSlotsDetails: any;
};

export default function OrderAbout({
  internalTracking,
  externalTracking,
  orderDetailsData,
  tabRedirect,
  cancelModal,
  pickUpSlotsDetails,
  editCnt,
  refetch,
  setcancelModal,
  setcompareToggle,
  productTypeDetails,
  transportationTypeDetails,
  compareToggle,
  setEditCnt,
  show,
  province,
}: Props) {
  internalTracking = _.sortBy(internalTracking, "triggeredAt")?.reverse();
  externalTracking = _.sortBy(externalTracking, "triggeredAt")?.reverse();

  const [apiError, setapiError] = useState<string>("");
  const [routingRuleDetails, setroutingRuleDetails] = useState<any[]>([]);

  const external = externalTracking?.filter((data) => {
    if (data?.externalStatus?.name) {
      return data;
    }
  });

  const internal = internalTracking?.filter((data) => {
    if (data?.internalStatus?.name) {
      return data;
    }
  });

  const OrderAboutSchema = object().shape({
    // actualGrossWeight: string().required("Required Field").nullable(),
    // actualVolumeWeight: string().required("Required Field").nullable(),
    // actualVolumeWeight: string().required("Required Field").nullable(),
  });

  useQuery(["fetchRoutingRule"], () => RoutingRuleDetails(), {
    onSuccess(data: any) {
      setroutingRuleDetails(data?.data);
    },
    onError(error: any) {},
  });

  const { mutate, isLoading } = useMutation(UpdateOrderDetails, {
    onSuccess: (data: any) => {
      refetch();
      setEditCnt(!editCnt);
      setapiError("");
      UseToast(data?.message);
      setFieldValue("remarks", "");
    },
    onError: (data: any) => {
      if (data?.message) {
        setapiError(data?.message);
      } else {
        setapiError(data);
      }
    },
  });

  useEffect(() => {
    if (apiError) {
      setTimeout(() => {
        setapiError("");
      }, 11000);
    }
  }, [apiError]);

  const cancelClicked = () => {
    if (dirty) {
      setcancelModal(true);
    } else {
      setEditCnt(!editCnt);
    }
  };

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
    // validationSchema: OrderAboutSchema,
    enableReinitialize: true,
    initialValues: {
      merchantName: orderDetailsData?.merchantName,
      flag: orderDetailsData?.flag,
      merchantCode: orderDetailsData?.merchantCode,
      customerOrderNo: orderDetailsData?.customerOrderNo,
      shipmentReferenceNo: orderDetailsData?.shipmentReferenceNo,
      transportationMode: orderDetailsData?.transportationMode,
      status: orderDetailsData?.status,
      ruleId: orderDetailsData?.ruleId,
      orderCreatedAt: orderDetailsData?.orderCreatedAt,
      pickupDate: orderDetailsData?.pickUp,
      deliveryDate: orderDetailsData?.deliveryDate,
      chargeableWeight: orderDetailsData?.chargeableWeight,
      actualGrossWeight: orderDetailsData?.actualGrossWeight,
      actualVolumeWeight: orderDetailsData?.actualVolumeWeight,
      payment: orderDetailsData?.payment,
      packageType: orderDetailsData?.packageType,
      createdBy: orderDetailsData?.createdBy,
      remarks: "",
    },

    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();

      mutate({
        transportationModeId: transportationTypeDetails?.values.find(
          (x: any) => x?.value === values?.transportationMode
        )?.id,
        pickUpDate: selectedDate(values?.pickupDate?.PickupDate),
        pickUpSlotId: pickUpSlotsDetails?.values.find(
          (x: any) => x?.value === values?.pickupDate?.PickupSlot
        )?.id,
        actualVolumeWeight: values?.actualVolumeWeight
          ? values?.actualVolumeWeight?.toString()
          : null,
        routingRuleId: routingRuleDetails.find(
          (x: any) => x?.code === values?.ruleId
        )?.id,
        actualGrossWeight: values?.actualGrossWeight
          ? values?.actualGrossWeight?.toString()
          : null,

        productTypeId: productTypeDetails?.values.find(
          (x: any) => x?.value === values?.packageType
        )?.id,
        remarks: values?.remarks,
        flag: values?.flag,
        id: province,
      });
    },
  });
  useEffect(() => {
    defaultValues();
  }, [tabRedirect]);

  useMemo(() => {
    if (dirty) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [dirty]);

  const defaultValues = () => {
    setFieldValue("transportationMode", orderDetailsData?.transportationMode);
    setFieldValue("pickupDate", orderDetailsData?.pickUp);
    setFieldValue("actualGrossWeight", orderDetailsData?.actualGrossWeight);
    setFieldValue("actualVolumeWeight", orderDetailsData?.actualVolumeWeight);
    setFieldValue("remarks", "");
    setFieldValue("packageType", orderDetailsData?.packageType);
    setFieldValue("flag", orderDetailsData?.flag);
    setFieldValue("ruleId", orderDetailsData?.ruleId);

    setTouched({});
    setapiError("");
  };
  const selectedDate = (d: any) => {
    let newDate: Date | any;
    newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);

    let currentdate = moment(d)
      .endOf("date")
      .utc()
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toISOString();

    setFieldValue("pickupDate.PickupDate", currentdate);

    return new Date(
      moment(newDate.toISOString()).utc(newDate.toISOString()).valueOf()
    );
  };

  return show ? (
    <div className="relative pb-10">
      <form className="space-y-8 shadow-md" onSubmit={handleSubmit}>
        <div className="bg-white p-5 rounded-b-md">
          <div className="space-y-6 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5 font-Inter">
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                <label
                  htmlFor="Flag"
                  className="block text-font_dark font-medium"
                >
                  Flag
                </label>

                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {editCnt ? (
                    <SwitchToggle disabled={true} enabled={values?.flag} />
                  ) : (
                    <SwitchToggle
                      enabled={values?.flag}
                      onChange={() => {
                        setFieldValue("flag", !values.flag);
                      }}
                      disabled={isLoading}
                    />
                  )}
                </div>
              </div>

              <FormInputFiled
                disabled={true}
                label={`Merchant Code`}
                editCnt={editCnt}
                value={values?.merchantCode}
                handleOnChange={handleChange}
                // placeholder="Merchant Code"
                id="name"
                name="name"
                type="text"
                onBlur={handleBlur}
                // error={errors.merchantCode}
                errorStatus={
                  touched?.merchantName && Boolean(errors?.pickupDate)
                }
              />

              <FormInputFiled
                disabled={true}
                label={`Merchant Name`}
                editCnt={editCnt}
                value={values?.merchantName}
                handleOnChange={handleChange}
                // placeholder="Merchant Name"
                id="name"
                name="name"
                type="text"
                onBlur={handleBlur}
                error={errors.pickupDate}
                errorStatus={
                  touched?.customerOrderNo && Boolean(errors?.pickupDate)
                }
              />
              <FormInputFiled
                disabled={true}
                label={`Customer Order No.`}
                editCnt={editCnt}
                value={values?.customerOrderNo}
                handleOnChange={handleChange}
                // placeholder="Customer Order No."
                id="customerOrderNo"
                name="customerOrderNo"
                type="text"
                onBlur={handleBlur}
                error={errors.pickupDate}
                errorStatus={touched?.pickupDate && Boolean(errors?.pickupDate)}
              />
              <FormInputFiled
                disabled={true}
                label={`Shipment Reference Number`}
                editCnt={editCnt}
                value={values?.shipmentReferenceNo}
                handleOnChange={handleChange}
                // placeholder="Shipment Reference Number"
                id="Shipment Reference Number"
                name="Shipment Reference Number"
                type="text"
                onBlur={handleBlur}
                error={errors.pickupDate}
                errorStatus={touched?.pickupDate && Boolean(errors?.pickupDate)}
              />
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {editCnt ? "Transportation Mode" : "*Transportation Mode"}
                </label>
                {editCnt ? (
                  <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                    {values?.transportationMode}
                  </span>
                ) : (
                  <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                    <select
                      disabled={editCnt || isLoading}
                      id="transportationMode"
                      name="transportationMode"
                      value={values?.transportationMode}
                      onChange={handleChange}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      {transportationTypeDetails?.values?.map((x: any) => {
                        return <option>{x?.value}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>
              {/* status */}
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Status
                </label>

                <div className="w-full px-3 text-left col-span-3 flex">
                  <div className="mx-auto w-full rounded-2xl bg-white">
                    <Disclosure>
                      {({ open }) => (
                        <div>
                          <div className="flex">
                            <div className="font-Inter flex-1">
                              <h5 className="text-sm font-normal text-font_black">
                                External
                              </h5>
                              <p
                                style={{
                                  color: external[0]?.externalStatus?.color,
                                }}
                                className={`text-sm font-normal pt-4`}
                              >
                                {/* <p className={`text-orange_text text-sm font-normal pt-4`}> */}
                                {external[0]?.externalStatus?.name}
                              </p>
                              <p className="text-xs font-medium text-font_dark font-Nunito_Normal">
                                {external[0]?.externalStatus?.name &&
                                  moment(external[0]?.triggeredAt)
                                    .utc()
                                    .format("DD MMM YYYY, HH:mm")}
                              </p>
                            </div>

                            <div className="font-Inter flex-1 justify-start">
                              <h5 className="text-sm font-normal text-font_black">
                                Internal
                              </h5>
                              <p
                                style={{
                                  color:
                                    (internal.length &&
                                      internal[0].internalStatus?.color) ||
                                    "",
                                }}
                                className={`text-sm font-normal pt-4`}
                              >
                                {internalTracking[0]?.internalStatus?.name}
                              </p>
                              <p className="text-xs font-medium text-font_dark font-Nunito_Normal">
                                {internal[0]?.internalStatus?.name &&
                                  moment(internalTracking[0]?.triggeredAt)
                                    .utc()
                                    .format("DD MMM YYYY, HH:mm")}
                              </p>
                            </div>

                            <Disclosure.Button className="flex  text-blue_primary rounded-lg w-1/5 px-4 py-2 text-left text-sm font-normal focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                              {open ? "Collapse" : "Expand"}
                              <ChevronUpIcon
                                className={`${
                                  !open ? "rotate-180 transform" : ""
                                } mt-[3px] ml-2 h-4 w-4 text-purple-500`}
                              />
                            </Disclosure.Button>
                          </div>
                          <Disclosure.Panel className="flex w-full justify-between items-end mt-10 relative text-sm text-font_dark">
                            <div className="flex-1">
                              <ul className="order-table pl-8 h-full">
                                {externalTracking?.map((data, index) => {
                                  const formattedDate = moment(data.triggeredAt)
                                    .utc()
                                    .format("DD MMM YYYY, HH:mm");
                                  return (
                                    <li
                                      className={`${
                                        index === externalTracking.length - 1 &&
                                        "order-bullet"
                                      } ${
                                        index !== externalTracking.length - 1 &&
                                        "mb-10"
                                      }  relative`}
                                    >
                                      {data.externalStatus?.name ? (
                                        <>
                                          <h1
                                            className={`font-normal mb-1 pt-3`}
                                          >
                                            {data.externalStatus?.name}
                                          </h1>
                                          <p className="font-medium">
                                            {formattedDate}
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <h1
                                            className={`font-normal mb-1 pt-3`}
                                          >
                                            {"-"}
                                          </h1>
                                          <p className="font-medium py-[10.5px]">
                                            {""}
                                          </p>
                                        </>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="flex-1">
                              <ul className="order-table relative pl-8">
                                {internalTracking?.map((data, index) => {
                                  const formattedDate = moment(data.triggeredAt)
                                    .utc()
                                    .format("DD MMM YYYY, HH:mm");
                                  return (
                                    <li
                                      className={`order-bullet ${
                                        index !== internalTracking.length - 1 &&
                                        "mb-10"
                                      }  relative`}
                                    >
                                      <h1 className="font-normal mb-1 pt-3">
                                        {data?.internalStatus?.name}
                                      </h1>
                                      <p className="font-medium">
                                        {formattedDate}
                                      </p>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="w-1/5"></div>
                          </Disclosure.Panel>
                        </div>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>

              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {editCnt ? "Rule Id" : "*Rule Id"}
                </label>
                {editCnt ? (
                  <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                    {values?.ruleId}
                  </span>
                ) : (
                  <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                    <select
                      disabled={editCnt || isLoading}
                      id="ruleId"
                      name="ruleId"
                      value={values?.ruleId}
                      onChange={handleChange}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      {routingRuleDetails?.map((x: any) => {
                        return <option>{x?.code}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>
              <FormInputFiled
                disabled={true}
                label={`Order Created Date`}
                editCnt={editCnt}
                value={moment(values?.orderCreatedAt)
                  .utc()
                  .format("DD/MM/YYYY")}
                handleOnChange={handleChange}
                // placeholder="Order Created Date"
                id="Order Created Date"
                name="Order Created Date"
                type="text"
                onBlur={handleBlur}
              />

              <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {editCnt ? "Pickup Date" : "*Pickup Date"}
                </label>
                <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                  {editCnt ? (
                    <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                      {values?.pickupDate?.PickupDate
                        ? moment(values?.pickupDate?.PickupDate)
                            .utc()
                            .format("DD/MM/YYYY")
                        : "-"}{" "}
                      {values?.pickupDate?.PickupSlot ?? ""}
                    </label>
                  ) : (
                    <div className="text-left flex sm:gap-5 gap-3 w-full ">
                      <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs ">
                        <div className="relative ">
                          <DatePicker
                            disabled={isLoading}
                            startDate={new Date()}
                            onChange={(e: any) => {
                              selectedDate(e);
                            }}
                            className="border rounded-md w-full py-2 px-3 focus:outline-blue_primary border-grey_border focus:text-font_black"
                            placeholderText="Start"
                            value={
                              values?.pickupDate?.PickupDate
                                ? moment(values?.pickupDate?.PickupDate)
                                    .utc()
                                    .format("DD/MM/YYYY")
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
                      <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                        <select
                          disabled={editCnt || isLoading}
                          // value={values?.transportationMode}
                          value={values?.pickupDate?.PickupSlot}
                          onChange={(e: any) => {
                            setFieldValue(
                              "pickupDate.PickupSlot",
                              e?.target?.value
                            );
                          }}
                          className={
                            editCnt
                              ? `block rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                              : `block w-[100px] sm:w-[148px] rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        >
                          {pickUpSlotsDetails?.values?.map((x: any) => {
                            return <option>{x?.value}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  {editCnt ? "Delivery Date" : "*Delivery Date"}
                </label>
                <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                  {editCnt ? (
                    <label
                      className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm"
                      htmlFor="remarks"
                    >
                      {values?.deliveryDate
                        ? moment(values?.deliveryDate)
                            .utc()
                            .format("DD/MM/YYYY HH:mm:ss")
                        : "-"}
                    </label>
                  ) : (
                    <div className="text-left flex sm:gap-5 gap-3 w-full ">
                      <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs ">
                        <div className="relative ">
                          <DatePicker
                            value={
                              values?.deliveryDate
                                ? moment(values?.deliveryDate)
                                    .utc()
                                    .format("DD/MM/YYYY ")
                                : "-"
                            }
                            startDate={new Date()}
                            onChange={(e: any) => {}}
                            className="border rounded-md w-full py-2 px-3 focus:outline-blue_primary border-grey_border focus:text-font_black"
                            placeholderText="Start"
                            selectsStart
                            maxDate={new Date()}
                            disabled={true}
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
                                d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683418 0.292893 0.292893Z"
                                fill="#6B7B80"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 sm:col-span-2 sm:mt-0 w-[100px] sm:w-[148px] ">
                        <div className="relative ">
                          <DatePicker
                            value={
                              values?.deliveryDate
                                ? moment(values?.deliveryDate)
                                    .utc()
                                    .format("HH:mm:ss")
                                : "-"
                            }
                            startDate={new Date()}
                            onChange={(e: any) => {}}
                            className="border rounded-md w-full py-2 px-3 focus:outline-blue_primary border-grey_border focus:text-font_black"
                            placeholderText="Start"
                            selectsStart
                            maxDate={new Date()}
                            disabled={true}
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
                                d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683418 0.292893 0.292893Z"
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
                label={"Chargeable Weight"}
                editCnt={editCnt}
                value={values?.chargeableWeight}
                handleOnChange={handleChange}
                // placeholder="Chargeable Weight"
                id="Chargeable Weight"
                name="Chargeable Weight"
                type="text"
                onBlur={handleBlur}
              />

              <FormInputFiled
                disabled={editCnt || isLoading}
                label={editCnt ? "Actual Gross Weight" : "*Actual Gross Weight"}
                editCnt={editCnt}
                value={values?.actualGrossWeight}
                handleOnChange={handleChange}
                // placeholder="*Actual Gross Weight"
                id="actualGrossWeight"
                name="actualGrossWeight"
                type="number"
                onBlur={handleBlur}
                error={errors.actualGrossWeight}
                errorStatus={
                  touched?.actualGrossWeight &&
                  Boolean(errors?.actualGrossWeight)
                }
              />

              <FormInputFiled
                disabled={editCnt || isLoading}
                label={
                  editCnt ? "Actual Volume Weight" : "*Actual Volume Weight"
                }
                editCnt={editCnt}
                value={values?.actualVolumeWeight}
                handleOnChange={handleChange}
                placeholder=""
                id="actualVolumeWeight"
                name="actualVolumeWeight"
                type="number"
                onBlur={handleBlur}
                error={errors.actualVolumeWeight}
                errorStatus={
                  touched?.actualVolumeWeight &&
                  Boolean(errors?.actualVolumeWeight)
                }
              />
              <div className="sm:border-t border-grey_border_table sm:pt-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4">
                  <label className="block sm:col-span-1 text-font_dark  font-medium">
                    Payment
                  </label>

                  <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg "></div>
                </div>

                <TextInputField
                  title={values?.payment?.packagePaymentMethod}
                  label="Package Payment Method"
                  editCnt={editCnt}
                  disabled={true}
                  errorStatus={
                    touched?.pickupDate && Boolean(errors?.pickupDate)
                  }
                  // error={errors?.pickupDate}
                />
                <TextInputField
                  title={values?.payment?.CODValue}
                  label="COD Value"
                  isAddress={true}
                  editCnt={editCnt}
                  disabled={true}
                  errorStatus={
                    touched?.pickupDate && Boolean(errors?.pickupDate)
                  }
                  // error={errors?.pickupDate}
                />
                <TextInputField
                  title={values?.payment?.CODValueCurrency}
                  label="COD Value Currency"
                  isAddress={true}
                  editCnt={editCnt}
                  disabled={true}
                  errorStatus={
                    touched?.pickupDate && Boolean(errors?.pickupDate)
                  }
                  // error={errors?.pickupDate}
                />
              </div>
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label
                  htmlFor="Product Type"
                  className="block text-font_dark font-medium"
                >
                  {editCnt ? " Product Type" : "* Product Type"}
                </label>
                {editCnt ? (
                  <span className="block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ">
                    {values?.packageType}
                  </span>
                ) : (
                  <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                    <select
                      disabled={editCnt || isLoading}
                      id="packageType"
                      name="packageType"
                      value={values?.packageType}
                      onChange={handleChange}
                      className={
                        editCnt
                          ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                          : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                      }
                    >
                      {productTypeDetails?.values?.map((x: any) => {
                        return <option>{x?.value}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-center sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                <label className="block text-font_dark font-medium">
                  Remarks
                </label>
                {editCnt ? (
                  <div
                    className={`block w-full rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm h-16 ${
                      orderDetailsData?.remarks.length > 0
                        ? "overflow-scroll"
                        : ""
                    } `}
                  >
                    {orderDetailsData?.remarks?.map((x: any) => {
                      return (
                        <p className="whitespace-nowrap">
                          {moment(x?.createdAt)
                            .utc()
                            .format("DD/MM/YYYY HH:mm:ss")}{" "}
                          {x?.createdBy} {x?.remark}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-6 pr-0">
                    <div className="mt-1 sm:col-span-3 sm:mt-0 w-full">
                      <textarea
                        disabled={editCnt || isLoading}
                        value={values?.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="remarks"
                        id="remarks"
                        className={`resize-none block w-full rounded-md font-normal border border-grey_border_table focus:outline-none py-2 px-3 text-sm text-font_black focus:border-blue_primary active:border-blue_primary focus:text-font_black  ${
                          editCnt &&
                          "bg-transparent w-full  border-none appearance-none resize-none"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
              <FormInputFiled
                disabled={true}
                label={`Created By`}
                editCnt={editCnt}
                value={values?.createdBy}
                handleOnChange={handleChange}
                // placeholder="Created By"
                id="Created By"
                name="Created By"
                type="text"
                onBlur={handleBlur}
              />

              <div className="sm:border-t border-grey_border_table sm:pt-5">
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
                      }   py-2 px-4 text-sm font-medium min-w-[130px] text-white focus:outline-none tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
                    >
                      {isLoading ? <ButtonSpinner /> : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none  hover:bg-grey_bg  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
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
}

export interface ErrorsState {
  [id: string]: string;
}
