import React, { useState, useMemo, useEffect } from "react";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import { useMutation } from "@tanstack/react-query";
import {
  SupplierStatusApi,
  SupplierStatusList,
} from "../../../api/orderDetails/orderDetails.api";
import MileComponent from "../../../Components/MileComponent/MileComponent";
import _, { isArray, isEmpty } from "lodash";
import { Disclosure } from "@headlessui/react";
import moment from "moment";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { ReTriggerAPI } from "../../../api/bulkSupplierOrder/bulkSupplierOrder";
import { MileEnum } from "../../../types/routingRule";

type Props = {
  trackingDetails: any;
  isLoading: boolean;
  show: boolean;
  stateId: string | undefined;
  refetch: () => void;
  setcompareToggle: React.Dispatch<boolean>;
  compareToggle: boolean;
  tabRedirect: boolean;
};

const getTimeToUTCISO = (date: string) => {
  let triggerDate = moment(date).format("MM/DD/YYYY");
  let triggerTime = moment(date).format("HH:mm:ss");
  let str: any = triggerTime?.split(":");

  let currentdate = moment(triggerDate)
    .endOf("date")
    // .utc()
    .set({
      hours: str[0],
      minutes: str[1],
      seconds: str[2],
      milliseconds: 0,
    })
    .toISOString();

  return currentdate;
};

const OrderTracking = ({
  trackingDetails,
  tabRedirect,
  stateId,
  isLoading,
  setcompareToggle,
  compareToggle,
  refetch,
  show,
}: Props) => {
  const [trackingData, settrackingData] = useState<any>([
    { editCnt: true },
    { editCnt: true },
    { editCnt: true },
  ]);

  const [firstMileDirtyValue, setfirstMileDirtyValue] =
    useState<boolean>(false);
  const [firstMileActive, setfirstMileActive] = useState<boolean>(
    trackingDetails?.miles[0]?.mile === "FIRST_MILE"
  );
  const [secondMileActive, setsecondMileActive] = useState<boolean>(
    trackingDetails?.miles[1]?.mile === "INTERNATIONAL_MILE"
  );
  const [thirdMileActive, setthirdMileActive] = useState<boolean>(
    trackingDetails?.miles[2]?.mile === "LAST_MILE"
  );

  const [firstMileSupplierData, setfirstMileSupplierData] = useState<
    SupplierStatusList[] | undefined
  >();

  const [secondMileSupplierData, setsecondSupplierData] = useState<
    SupplierStatusList[] | undefined
  >();

  const [thirdMileSupplierData, setthirdSupplierData] = useState<
    SupplierStatusList[] | undefined
  >();

  const [firstMileMinTime, setfirstMileMinTime] = useState<string>("");
  const [secondMileMinTime, setsecondMileMinTime] = useState<string>("");
  const [thirdMileMinTime, setthirdMileMinTime] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [secondMileDirtyValue, setsecondMileDirtyValue] =
    useState<boolean>(false);
  const [thirdMileDirtyValue, setthirdMileDirtyValue] =
    useState<boolean>(false);
  const [cancelModal, setcancelModal] = useState<boolean>(false);
  const [toDefaultValue, settoDefaultValue] = useState<boolean>(false);
  const [selectedIndex, setselectedIndex] = useState<number | undefined>(
    undefined
  );

  const { mutate, isLoading: suppelierStatusLoading } = useMutation(
    SupplierStatusApi,
    {
      onSuccess: (data: any) => {
        if (data?.status) {
          setfirstMileSupplierData(data?.data);
          setfirstMileMinTime(getTimeToUTCISO(data?.minimumDateTime));

          if (secondMileActive) {
            secondMileMutate({
              customerOrderId: stateId,
              mile: trackingDetails?.miles[1]?.mile,
              serviceSupplierId: trackingDetails?.miles[1]?.supplierId,
            });
          }
        }
      },
      onError: (data) => {},
    }
  );

  const { mutate: secondMileMutate } = useMutation(SupplierStatusApi, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setsecondMileMinTime(getTimeToUTCISO(data?.minimumDateTime));
        setsecondSupplierData(data?.data);
        {
          thirdMileActive
            ? thirdMileMutate({
                customerOrderId: stateId,
                mile: trackingDetails?.miles[2]?.mile,
                serviceSupplierId: trackingDetails?.miles[2]?.supplierId,
              })
            : thirdMileMutate({
                customerOrderId: stateId,
                mile: "LAST_MILE",
                serviceSupplierId: trackingDetails?.miles[1]?.supplierId,
              });
        }
      }
    },
    onError: (data) => {},
  });

  const { mutate: thirdMileMutate } = useMutation(SupplierStatusApi, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setthirdMileMinTime(getTimeToUTCISO(data?.minimumDateTime));
        setthirdSupplierData(data?.data);
      }
    },
    onError: (data) => {},
  });

  const { mutate: ReTriggerOrder, isLoading: ReTriggerOrderLoading } =
    useMutation(ReTriggerAPI, {
      onSuccess: (data) => {
        if (data?.status) {
          (data.data.supplierOrders || []).forEach((supplierOrder) => {
            switch (supplierOrder.mile) {
              case MileEnum.FIRST_MILE:
                trackingDetails.miles[0].apiCreate = supplierOrder.apiCreate;
                break;
              case MileEnum.INTERNATIONAL_MILE:
                trackingDetails.miles[1].apiCreate = supplierOrder.apiCreate;
                break;
              case MileEnum.LAST_MILE:
                trackingDetails.miles[2].apiCreate = supplierOrder.apiCreate;
                break;
              default:
                throw new Error(`Invalid mile type: ${supplierOrder.mile}`);
            }
          });
        }
      },
      onError: (data) => {},
    });

  const HandleReTrigger = (supplierId: string) => {
    setSupplierId(supplierId);
    ReTriggerOrder({
      customerOrderId: stateId || "",
      supplierId,
    });
  };

  const cancelBack = () => {
    setselectedIndex(undefined);
    setcancelModal(false);
  };

  useEffect(() => {
    settoDefaultValue(!toDefaultValue);
  }, [tabRedirect]);

  const confirmBackCancelModal = () => {
    // defaultValues();
    settoDefaultValue(!toDefaultValue);
    setcancelModal(false);
    const temp = trackingData?.map((x: any, i: number) => {
      if (i === selectedIndex) {
        return {
          ...x,
          editCnt: false,
        };
      } else {
        return {
          ...x,
          editCnt: true,
        };
      }
    });
    setselectedIndex(undefined);
    settrackingData(temp);
  };

  const intialValueTrackingData = () => {
    settrackingData(
      trackingData?.map((x: any, i: number) => {
        return {
          ...x,
          editCnt: true,
        };
      })
    );
  };

  const cancelClicked = (mile: number) => {
    if (firstMileDirtyValue || secondMileDirtyValue || thirdMileDirtyValue) {
      setcancelModal(true);
    } else {
      intialValueTrackingData();
    }
  };
  const editClicked = (num: number) => {
    if (firstMileDirtyValue || secondMileDirtyValue || thirdMileDirtyValue) {
      setcancelModal(true);
      setselectedIndex(num);
    } else {
      const temp = trackingData?.map((x: any, i: number) => {
        if (i === num) {
          return {
            ...x,
            editCnt: false,
          };
        } else {
          return {
            ...x,
            editCnt: true,
          };
        }
      });
      setselectedIndex(undefined);
      settrackingData(temp);
    }
  };
  useMemo(() => {
    if (firstMileDirtyValue || secondMileDirtyValue || thirdMileDirtyValue) {
      setcompareToggle(true);
    } else {
      setcompareToggle(false);
    }
  }, [firstMileDirtyValue, secondMileDirtyValue, thirdMileDirtyValue]);

  useMemo(() => {
    if (show && trackingDetails?.miles) {
      setfirstMileActive(trackingDetails?.miles[0]?.mile === "FIRST_MILE");
      setsecondMileActive(
        trackingDetails?.miles[1]?.mile === "INTERNATIONAL_MILE"
      );
      setthirdMileActive(trackingDetails?.miles[2]?.mile === "LAST_MILE");

      {
        _.isEmpty(trackingDetails?.miles[0])
          ? secondMileMutate({
              customerOrderId: stateId,
              mile: trackingDetails?.miles[1]?.mile,
              serviceSupplierId: trackingDetails?.miles[1]?.supplierId,
            })
          : mutate({
              customerOrderId: stateId,
              mile: trackingDetails?.miles[0]?.mile,
              serviceSupplierId: trackingDetails?.miles[0]?.supplierId,
            });
      }
    }
  }, [show, trackingDetails]);

  var firstMileStatusDetails = trackingDetails?.miles[0]?.status?.filter(
    (data: any) => {
      if (data.supplierStatus) {
        return data;
      }
    }
  );
  var internationalMileStatusDetails =
    trackingDetails?.miles[1]?.status?.filter((data: any) => {
      if (data.supplierStatus) {
        return data;
      }
    });
  var lastMileStatusDetails = trackingDetails?.miles[2]?.status?.filter(
    (data: any) => {
      if (data.supplierStatus) {
        return data;
      }
    }
  );

  firstMileStatusDetails = _.sortBy(
    firstMileStatusDetails,
    "triggeredAt"
  ).reverse();
  internationalMileStatusDetails = _.sortBy(
    internationalMileStatusDetails,
    "triggeredAt"
  ).reverse();
  lastMileStatusDetails = _.sortBy(
    lastMileStatusDetails,
    "triggeredAt"
  ).reverse();

  return show ? (
    <div className="relative pb-10">
      <form
        className="space-y-8 shadow-md rounded-b-lg"
        // onSubmit={handleSubmit}
      >
        <div className="bg-white p-5 rounded-b-lg">
          <div className="space-y-6 sm:space-y-5">
            {firstMileActive && (
              <div className="space-y-6 sm:space-y-5 font-Inter">
                <div className="flex gap-2 flex-wrap justify-between ">
                  <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                    First Mile
                  </h3>
                  {trackingData[0]?.editCnt && (
                    <button
                      type="button"
                      onClick={() => editClicked(0)}
                      className="rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[21px] text-sm font-medium text-white focus:outline-none font-Inter"
                    >
                      Edit Order Details
                    </button>
                  )}
                </div>
                {trackingData[0]?.editCnt && (
                  <div className="space-y-6 sm:space-y-5 font-Inter">
                    <FormInputFiled
                      disabled={true}
                      label="Supplier Order No."
                      editCnt={trackingData[0]?.editCnt}
                      id="legalEntityName"
                      value={trackingDetails?.miles[0]?.supplierOrderNo}
                      name="legalEntityName"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Supplier"
                      editCnt={trackingData[0]?.editCnt}
                      value={trackingDetails?.miles[0]?.supplier}
                      id="merchantCode"
                      name="merchantCode"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Tracking No."
                      value={trackingDetails?.miles[0]?.trackingNo}
                      editCnt={trackingData[0]?.editCnt}
                      // placeholder="Tracking No"
                      id="Tracking No"
                      maxLength={35}
                      name="Tracking No"
                      type="text"
                    />
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Origin
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Origin"
                          style={{
                            resize: trackingData[0]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Origin"
                          value={trackingDetails?.miles[0]?.origin}
                          placeholder=""
                          disabled={trackingData[0]?.editCnt}
                          rows={3}
                          className={
                            trackingData[0]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Destination
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Destination"
                          style={{
                            resize: trackingData[0]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Destination"
                          value={trackingDetails?.miles[0]?.destination}
                          placeholder=""
                          disabled={true}
                          rows={3}
                          className={
                            trackingData[0]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Status
                      </label>
                      {!isLoading ? (
                        <div className="mt-1 w-full justify-between sm:col-span-3 sm:mt-0 px-3">
                          {!trackingData[0]?.editCnt ? (
                            <div className="flex rounded-md font-normal">
                              <input
                                name="Status"
                                id="Status"
                                // placeholder="Status"
                                maxLength={15}
                                value={firstMileStatusDetails?.supplierStatus}
                                disabled={true}
                                className={
                                  trackingData[0]?.editCnt
                                    ? `block w-full max-w-lg rounded-md font-normal bg-transparent text-orange_text focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                    : `block w-full max-w-lg rounded-md border font-normal text-orange_text border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                }
                              />
                            </div>
                          ) : firstMileStatusDetails.length ? (
                            <span className="text-sm text-table_head_color py-2 px-3">
                              {/* {`last updated at ${moment(data?.updatedAt).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}`} */}
                              <div className="w-full text-left col-span-3 flex">
                                <div className="mx-auto w-full rounded-2xl bg-white">
                                  <Disclosure>
                                    {({ open }) => (
                                      <div>
                                        <div className="flex justify-between w-full">
                                          <div className="font-Inter flex-1 justify-start">
                                            <p
                                              style={{
                                                color:
                                                  firstMileStatusDetails[0]
                                                    ?.supplierStatus?.color,
                                              }}
                                              className={`text-sm font-normal`}
                                            >
                                              {
                                                firstMileStatusDetails[0]
                                                  ?.supplierStatus?.name
                                              }
                                            </p>
                                            <p className="text-xs font-medium text-[#B9BFBF] font-Nunito_Normal">
                                              {`(${moment(
                                                firstMileStatusDetails[0]
                                                  ?.triggeredAt
                                              )
                                                .utc()
                                                .format(
                                                  "DD MMM YYYY, HH:mm"
                                                )})`}
                                            </p>
                                          </div>

                                          <Disclosure.Button className="flex justify-end text-blue_primary rounded-lg w-1/5 px-4 py-2 text-left text-sm font-normal focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <span className="flex gap-2">
                                              <span>
                                                {open ? "Collapse" : "Expand"}
                                              </span>
                                              <ChevronUpIcon
                                                className={`${
                                                  open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                } ml-2 h-4 w-4 text-purple-500`}
                                              />
                                            </span>
                                          </Disclosure.Button>
                                        </div>
                                        <Disclosure.Panel className="flex w-full justify-between items-end mt-10 relative text-sm text-font_dark">
                                          <div className="flex-1">
                                            <ul className="order-table relative pl-8">
                                              {firstMileStatusDetails?.map(
                                                (data: any, index: number) => {
                                                  const formattedDate = moment(
                                                    data.triggeredAt
                                                  )
                                                    .utc()
                                                    .format(
                                                      "DD MMM YYYY, HH:mm"
                                                    );
                                                  return (
                                                    <li
                                                      className={`order-bullet ${
                                                        index !==
                                                          firstMileStatusDetails.length -
                                                            1 && "mb-10"
                                                      }  relative`}
                                                    >
                                                      <h1 className="font-normal mb-1 pt-3">
                                                        {
                                                          data.supplierStatus
                                                            ?.name
                                                        }
                                                      </h1>
                                                      <p className="font-medium">
                                                        {formattedDate}
                                                      </p>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                          <div className="w-1/5"></div>
                                        </Disclosure.Panel>
                                      </div>
                                    )}
                                  </Disclosure>
                                </div>
                              </div>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <ButtonSpinner />
                      )}
                    </div>
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="text-font_dark font-medium">
                        API Create
                      </label>

                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <span
                          className={`flex w-full max-w-lg rounded-md font-normal bg-transparent items-center gap-4 
                           ${
                             trackingDetails?.miles[0]?.apiCreate ===
                               "Success" && "text-success_text"
                           } ${
                            trackingDetails?.miles[0]?.apiCreate === "Fail" &&
                            "text-error_red"
                          }  ${
                            trackingDetails?.miles[0]?.apiCreate ===
                              "Not_Applicable" && "text-orange_text"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm`}
                        >
                          {trackingDetails?.miles[0]?.apiCreate?.trim() ===
                          "Not_Applicable"
                            ? "Inapplicable"
                            : trackingDetails?.miles[0]?.apiCreate?.trim()}
                          {trackingDetails.miles[0].apiCreate === "Fail" && (
                            <svg
                              className="cursor-pointer"
                              onClick={() =>
                                HandleReTrigger(
                                  trackingDetails.miles[0].supplierId
                                )
                              }
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <animateTransform
                                attributeName="transform"
                                attributeType="XML"
                                type={
                                  ReTriggerOrderLoading &&
                                  supplierId ===
                                    trackingDetails.miles[0].supplierId
                                    ? "rotate"
                                    : ""
                                }
                                dur="1s"
                                from="0 0 0"
                                to="360 0 0"
                                repeatCount="indefinite"
                              />
                              <path
                                d="M6.99999 13.6668C5.15277 13.6668 3.57986 13.0175 2.28124 11.7189C0.982634 10.4203 0.333328 8.84738 0.333328 7.00016C0.333328 5.15294 0.982634 3.58002 2.28124 2.28141C3.57986 0.982802 5.15277 0.333496 6.99999 0.333496C8.18055 0.333496 9.21527 0.57308 10.1042 1.05225C10.9931 1.53141 11.7639 2.18766 12.4167 3.021V0.333496H13.6667V5.62516H8.37499V4.37516H11.875C11.3472 3.54183 10.6736 2.86822 9.85416 2.35433C9.03472 1.84044 8.08333 1.5835 6.99999 1.5835C5.48611 1.5835 4.20486 2.1078 3.15624 3.15641C2.10763 4.20502 1.58333 5.48627 1.58333 7.00016C1.58333 8.51405 2.10763 9.7953 3.15624 10.8439C4.20486 11.8925 5.48611 12.4168 6.99999 12.4168C8.15277 12.4168 9.20833 12.087 10.1667 11.4272C11.125 10.7675 11.7917 9.896 12.1667 8.81266H13.4583C13.0556 10.271 12.2569 11.4446 11.0625 12.3335C9.86805 13.2224 8.51388 13.6668 6.99999 13.6668Z"
                                fill="#6B7B80"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <MileComponent
                  thirdMileDisable={!thirdMileActive}
                  compareToggle={compareToggle}
                  minimumDateTime={firstMileMinTime}
                  tabRedirect={tabRedirect}
                  show={!trackingData[0]?.editCnt}
                  toDefaultValue={toDefaultValue}
                  cancelClicked={cancelClicked}
                  setDirtyValue={setfirstMileDirtyValue}
                  trackingData={trackingData}
                  settrackingData={settrackingData}
                  stateId={stateId}
                  refetch={refetch}
                  supplierStatus={firstMileSupplierData ?? []}
                  editCnt={trackingData[0]?.editCnt}
                  trackingDetails={trackingDetails?.miles[0]}
                  index={0}
                />
              </div>
            )}
            {secondMileActive && (
              <div className="space-y-6 sm:space-y-5 font-Inter">
                <div
                  className={`${
                    firstMileActive &&
                    "sm:border-t border-grey_border_table sm:pt-5"
                  }`}
                >
                  <div className="flex gap-2 flex-wrap justify-between ">
                    <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                      Middle Mile
                    </h3>
                    {trackingData[1]?.editCnt && (
                      <button
                        type="button"
                        onClick={() => editClicked(1)}
                        className="rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[21px] text-sm font-medium text-white focus:outline-none font-Inter"
                      >
                        Edit Order Details
                      </button>
                    )}
                  </div>
                </div>

                {trackingData[1]?.editCnt && (
                  <div className="space-y-6 sm:space-y-5 font-Inter">
                    <FormInputFiled
                      disabled={true}
                      label="Supplier Order No."
                      editCnt={trackingData[1]?.editCnt}
                      id="legalEntityName"
                      value={trackingDetails?.miles[1]?.supplierOrderNo}
                      name="legalEntityName"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Supplier"
                      editCnt={trackingData[1]?.editCnt}
                      value={trackingDetails?.miles[1]?.supplier}
                      id="merchantCode"
                      name="merchantCode"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Tracking No."
                      value={trackingDetails?.miles[1]?.trackingNo}
                      editCnt={trackingData[1]?.editCnt}
                      // placeholder="Tracking No."
                      id="TrackingNo"
                      maxLength={35}
                      name="TrackingNo"
                      type="text"
                    />
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Origin
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Origin"
                          style={{
                            resize: trackingData[1]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Origin"
                          value={trackingDetails?.miles[1]?.origin}
                          placeholder=""
                          disabled={trackingData[1]?.editCnt}
                          rows={3}
                          className={
                            trackingData[1]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Destination
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Destination"
                          style={{
                            resize: trackingData[1]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Destination"
                          value={trackingDetails?.miles[1]?.destination}
                          placeholder=""
                          disabled={true}
                          rows={3}
                          className={
                            trackingData[1]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Status
                      </label>
                      {!isLoading ? (
                        <div className="mt-1 w-full justify-between sm:col-span-3 sm:mt-0 px-3">
                          {!trackingData[1]?.editCnt ? (
                            <div className="flex rounded-md font-normal ">
                              <input
                                name="Status"
                                id="Status"
                                // placeholder="Status"
                                maxLength={15}
                                value={firstMileStatusDetails?.supplierStatus}
                                disabled={true}
                                className={
                                  trackingData[1]?.editCnt
                                    ? `block w-full max-w-lg rounded-md font-normal bg-transparent text-orange_text focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                    : `block w-full max-w-lg rounded-md border font-normal text-orange_text border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                }
                              />
                            </div>
                          ) : internationalMileStatusDetails.length ? (
                            <span className="text-sm text-table_head_color py-2 px-3">
                              {/* {`last updated at ${moment(data?.updatedAt).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}`} */}
                              <div className="w-full text-left col-span-3 flex">
                                <div className="mx-auto w-full rounded-2xl bg-white">
                                  <Disclosure>
                                    {({ open }) => (
                                      <div>
                                        <div className="flex justify-between w-full">
                                          <div className="font-Inter flex-1 justify-start">
                                            <p
                                              style={{
                                                color:
                                                  internationalMileStatusDetails[0]
                                                    ?.supplierStatus?.color,
                                              }}
                                              className={`text-sm font-normal`}
                                            >
                                              {
                                                internationalMileStatusDetails[0]
                                                  ?.supplierStatus?.name
                                              }
                                            </p>
                                            <p className="text-xs font-medium text-[#B9BFBF] font-Nunito_Normal">
                                              {`(${moment(
                                                internationalMileStatusDetails[0]
                                                  ?.triggeredAt
                                              )
                                                .utc()
                                                .format(
                                                  "DD MMM YYYY, HH:mm"
                                                )})`}
                                            </p>
                                          </div>

                                          <Disclosure.Button className="flex gap-1 justify-end text-blue_primary rounded-lg w-1/4 sm:w-1/5 px-4 py-2 text-left text-sm font-normal focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <span className="flex gap-2">
                                              <span>
                                                {open ? "Collapse" : "Expand"}
                                              </span>
                                              <ChevronUpIcon
                                                className={`${
                                                  open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                } h-4 w-4`}
                                              />
                                            </span>
                                          </Disclosure.Button>
                                        </div>
                                        <Disclosure.Panel className="flex w-full justify-between items-end mt-10 relative text-sm text-font_dark">
                                          <div className="flex-1">
                                            <ul className="order-table relative pl-8">
                                              {internationalMileStatusDetails?.map(
                                                (data: any, index: number) => {
                                                  const formattedDate = moment(
                                                    data.triggeredAt
                                                  )
                                                    .utc()
                                                    .format(
                                                      "DD MMM YYYY, HH:mm"
                                                    );
                                                  return (
                                                    <li
                                                      className={`order-bullet ${
                                                        index !==
                                                          internationalMileStatusDetails.length -
                                                            1 && "mb-10"
                                                      }  relative`}
                                                    >
                                                      <h1 className="font-normal mb-1 pt-3">
                                                        {
                                                          data.supplierStatus
                                                            ?.name
                                                        }
                                                      </h1>
                                                      <p className="font-medium">
                                                        {formattedDate}
                                                      </p>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                          <div className="w-1/5"></div>
                                        </Disclosure.Panel>
                                      </div>
                                    )}
                                  </Disclosure>
                                </div>
                              </div>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <ButtonSpinner />
                      )}
                    </div>
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="text-font_dark font-medium">
                        API Create
                      </label>

                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <span
                          className={`flex w-full max-w-lg rounded-md font-normal bg-transparent items-center gap-2
                           ${
                             trackingDetails?.miles[1]?.apiCreate ===
                               "Success" && "text-success_text"
                           } ${
                            trackingDetails?.miles[1]?.apiCreate === "Fail" &&
                            "text-error_red"
                          }  ${
                            trackingDetails?.miles[1]?.apiCreate ===
                              "Not_Applicable" && "text-orange_text"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm`}
                        >
                          {trackingDetails?.miles[1]?.apiCreate?.trim() ===
                          "Not_Applicable"
                            ? "Inapplicable"
                            : trackingDetails?.miles[1]?.apiCreate?.trim()}
                          {trackingDetails.miles[1].apiCreate === "Fail" && (
                            <svg
                              className="cursor-pointer"
                              onClick={() =>
                                HandleReTrigger(
                                  trackingDetails.miles[1].supplierId
                                )
                              }
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <animateTransform
                                attributeName="transform"
                                attributeType="XML"
                                type={
                                  ReTriggerOrderLoading &&
                                  supplierId ===
                                    trackingDetails.miles[1].supplierId
                                    ? "rotate"
                                    : ""
                                }
                                dur="1s"
                                from="0 0 0"
                                to="360 0 0"
                                repeatCount="indefinite"
                              />
                              <path
                                d="M6.99999 13.6668C5.15277 13.6668 3.57986 13.0175 2.28124 11.7189C0.982634 10.4203 0.333328 8.84738 0.333328 7.00016C0.333328 5.15294 0.982634 3.58002 2.28124 2.28141C3.57986 0.982802 5.15277 0.333496 6.99999 0.333496C8.18055 0.333496 9.21527 0.57308 10.1042 1.05225C10.9931 1.53141 11.7639 2.18766 12.4167 3.021V0.333496H13.6667V5.62516H8.37499V4.37516H11.875C11.3472 3.54183 10.6736 2.86822 9.85416 2.35433C9.03472 1.84044 8.08333 1.5835 6.99999 1.5835C5.48611 1.5835 4.20486 2.1078 3.15624 3.15641C2.10763 4.20502 1.58333 5.48627 1.58333 7.00016C1.58333 8.51405 2.10763 9.7953 3.15624 10.8439C4.20486 11.8925 5.48611 12.4168 6.99999 12.4168C8.15277 12.4168 9.20833 12.087 10.1667 11.4272C11.125 10.7675 11.7917 9.896 12.1667 8.81266H13.4583C13.0556 10.271 12.2569 11.4446 11.0625 12.3335C9.86805 13.2224 8.51388 13.6668 6.99999 13.6668Z"
                                fill="#6B7B80"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <MileComponent
                  compareToggle={compareToggle}
                  minimumDateTime={secondMileMinTime}
                  thirdMileDisable={!thirdMileActive}
                  tabRedirect={tabRedirect}
                  show={!trackingData[1]?.editCnt}
                  toDefaultValue={toDefaultValue}
                  cancelClicked={cancelClicked}
                  setDirtyValue={setsecondMileDirtyValue}
                  trackingData={trackingData}
                  settrackingData={settrackingData}
                  stateId={stateId}
                  refetch={refetch}
                  supplierStatus={
                    thirdMileActive
                      ? secondMileSupplierData ?? []
                      : [
                          ...(secondMileSupplierData ?? []),
                          ...(thirdMileSupplierData ?? []),
                        ].filter(
                          (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                        )
                  }
                  editCnt={trackingData[1]?.editCnt}
                  trackingDetails={trackingDetails?.miles[1]}
                  index={1}
                />
              </div>
            )}
            {thirdMileActive && (
              <div className="space-y-6 sm:space-y-5 font-Inter">
                <div className="sm:border-t border-grey_border_table sm:pt-5">
                  <div className="flex gap-2 flex-wrap justify-between ">
                    <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
                      Last Mile
                    </h3>

                    {trackingData[2]?.editCnt && (
                      <button
                        type="button"
                        onClick={() => editClicked(2)}
                        className="rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[21px] text-sm font-medium text-white focus:outline-none font-Inter"
                      >
                        Edit Order Details
                      </button>
                    )}
                  </div>
                </div>
                {trackingData[2]?.editCnt && (
                  <div className="space-y-6 sm:space-y-5 font-Inter">
                    <FormInputFiled
                      disabled={true}
                      label="Supplier Order No."
                      editCnt={trackingData[2]?.editCnt}
                      id="legalEntityName"
                      value={trackingDetails?.miles[2]?.supplierOrderNo}
                      name="legalEntityName"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Supplier"
                      editCnt={trackingData[2]?.editCnt}
                      value={trackingDetails?.miles[2]?.supplier}
                      id="merchantCode"
                      name="merchantCode"
                      type="text"
                    />

                    <FormInputFiled
                      disabled={true}
                      label="Tracking No."
                      value={trackingDetails?.miles[2]?.trackingNo}
                      editCnt={trackingData[2]?.editCnt}
                      // placeholder="Tracking No."
                      id="TrackingNo"
                      maxLength={35}
                      name="TrackingNo"
                      type="text"
                    />
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Origin
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Origin"
                          style={{
                            resize: trackingData[2]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Origin"
                          value={trackingDetails?.miles[2]?.origin}
                          placeholder=""
                          disabled={trackingData[2]?.editCnt}
                          rows={3}
                          className={
                            trackingData[2]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Destination
                      </label>
                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <textarea
                          name="Destination"
                          style={{
                            resize: trackingData[2]?.editCnt
                              ? "none"
                              : "vertical",
                          }}
                          maxLength={100}
                          id="Destination"
                          value={trackingDetails?.miles[2]?.destination}
                          placeholder=""
                          disabled={true}
                          rows={3}
                          className={
                            trackingData[2]?.editCnt
                              ? `block w-full  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm `
                              : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                          }
                        />
                      </div>
                    </div>

                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="block text-font_dark font-medium">
                        Status
                      </label>

                      {!isLoading ? (
                        <div className="mt-1 w-full justify-between sm:col-span-3 px-3 sm:mt-0">
                          {!trackingData[2]?.editCnt ? (
                            <div className="flex rounded-md font-normal ">
                              <input
                                name="Status"
                                id="Status"
                                // placeholder="Status"
                                maxLength={15}
                                value={
                                  internationalMileStatusDetails?.supplierStatus
                                }
                                disabled={true}
                                className={
                                  trackingData[1]?.editCnt
                                    ? `block w-full max-w-lg rounded-md font-normal bg-transparent text-orange_text focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                    : `block w-full max-w-lg rounded-md border font-normal text-orange_text border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                                }
                              />
                            </div>
                          ) : lastMileStatusDetails.length ? (
                            <span className="text-sm text-table_head_color py-2 px-3">
                              {/* {`last updated at ${moment(data?.updatedAt).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}`} */}
                              <div className="w-full text-left col-span-3 flex">
                                <div className="mx-auto w-full rounded-2xl bg-white">
                                  <Disclosure>
                                    {({ open }) => (
                                      <div>
                                        <div className="flex justify-between w-full">
                                          <div className="font-Inter flex-1 justify-start">
                                            <p
                                              style={{
                                                color:
                                                  lastMileStatusDetails[0]
                                                    ?.supplierStatus?.color,
                                              }}
                                              className={`text-sm font-normal`}
                                            >
                                              {
                                                lastMileStatusDetails[0]
                                                  ?.supplierStatus?.name
                                              }
                                            </p>
                                            <p className="text-xs font-medium text-[#B9BFBF] font-Nunito_Normal">
                                              {`(${moment(
                                                lastMileStatusDetails[0]
                                                  ?.triggeredAt
                                              )
                                                // .utc()
                                                .format(
                                                  "DD MMM YYYY, HH:mm"
                                                )})`}
                                            </p>
                                          </div>

                                          <Disclosure.Button className="flex justify-end text-blue_primary rounded-lg w-1/5 px-4 py-2 text-left text-sm font-normal focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                            <span className="flex gap-2">
                                              <span>
                                                {open ? "Collapse" : "Expand"}
                                              </span>
                                              <ChevronUpIcon
                                                className={`${
                                                  open
                                                    ? "rotate-180 transform"
                                                    : ""
                                                } ml-2 h-4 w-4 text-purple-500`}
                                              />
                                            </span>
                                          </Disclosure.Button>
                                        </div>
                                        <Disclosure.Panel className="flex w-full justify-between items-end mt-10 relative text-sm text-font_dark">
                                          <div className="flex-1">
                                            <ul className="order-table relative pl-8">
                                              {lastMileStatusDetails?.map(
                                                (data: any, index: number) => {
                                                  const formattedDate = moment(
                                                    data.triggeredAt
                                                  )
                                                    .utc()
                                                    .format(
                                                      "DD MMM YYYY, HH:mm"
                                                    );
                                                  return (
                                                    <li
                                                      className={`order-bullet ${
                                                        index !==
                                                          lastMileStatusDetails.length -
                                                            1 && "mb-10"
                                                      }  relative`}
                                                    >
                                                      <h1 className="font-normal mb-1 pt-3">
                                                        {
                                                          data.supplierStatus
                                                            ?.name
                                                        }
                                                      </h1>
                                                      <p className="font-medium">
                                                        {formattedDate}
                                                      </p>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                          <div className="w-1/5"></div>
                                        </Disclosure.Panel>
                                      </div>
                                    )}
                                  </Disclosure>
                                </div>
                              </div>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <ButtonSpinner />
                      )}
                    </div>
                    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                      <label className="text-font_dark font-medium">
                        API Create
                      </label>

                      <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
                        <span
                          className={`flex w-full max-w-lg rounded-md font-normal bg-transparent items-center gap-4
                           ${
                             trackingDetails?.miles[2]?.apiCreate ===
                               "Success" && "text-success_text"
                           } ${
                            trackingDetails?.miles[2]?.apiCreate === "Fail" &&
                            "text-error_red"
                          }  ${
                            trackingDetails?.miles[2]?.apiCreate ===
                              "Not_Applicable" && "text-orange_text"
                          } focus:outline-none sm:max-w-xs py-2 px-3 text-sm`}
                        >
                          {trackingDetails?.miles[2]?.apiCreate?.trim() ===
                          "Not_Applicable"
                            ? "Inapplicable"
                            : trackingDetails?.miles[2]?.apiCreate?.trim()}

                          {trackingDetails.miles[2].apiCreate === "Fail" && (
                            <svg
                              className="cursor-pointer"
                              onClick={() =>
                                HandleReTrigger(
                                  trackingDetails.miles[2].supplierId
                                )
                              }
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <animateTransform
                                attributeName="transform"
                                attributeType="XML"
                                type={
                                  ReTriggerOrderLoading &&
                                  supplierId ===
                                    trackingDetails.miles[2].supplierId
                                    ? "rotate"
                                    : ""
                                }
                                dur="1s"
                                from="0 0 0"
                                to="360 0 0"
                                repeatCount="indefinite"
                              />
                              <path
                                d="M6.99999 13.6668C5.15277 13.6668 3.57986 13.0175 2.28124 11.7189C0.982634 10.4203 0.333328 8.84738 0.333328 7.00016C0.333328 5.15294 0.982634 3.58002 2.28124 2.28141C3.57986 0.982802 5.15277 0.333496 6.99999 0.333496C8.18055 0.333496 9.21527 0.57308 10.1042 1.05225C10.9931 1.53141 11.7639 2.18766 12.4167 3.021V0.333496H13.6667V5.62516H8.37499V4.37516H11.875C11.3472 3.54183 10.6736 2.86822 9.85416 2.35433C9.03472 1.84044 8.08333 1.5835 6.99999 1.5835C5.48611 1.5835 4.20486 2.1078 3.15624 3.15641C2.10763 4.20502 1.58333 5.48627 1.58333 7.00016C1.58333 8.51405 2.10763 9.7953 3.15624 10.8439C4.20486 11.8925 5.48611 12.4168 6.99999 12.4168C8.15277 12.4168 9.20833 12.087 10.1667 11.4272C11.125 10.7675 11.7917 9.896 12.1667 8.81266H13.4583C13.0556 10.271 12.2569 11.4446 11.0625 12.3335C9.86805 13.2224 8.51388 13.6668 6.99999 13.6668Z"
                                fill="#6B7B80"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <MileComponent
                  thirdMileDisable={!thirdMileActive}
                  compareToggle={compareToggle}
                  minimumDateTime={thirdMileMinTime}
                  tabRedirect={tabRedirect}
                  show={!trackingData[2]?.editCnt}
                  toDefaultValue={toDefaultValue}
                  cancelClicked={cancelClicked}
                  setDirtyValue={setthirdMileDirtyValue}
                  trackingData={trackingData}
                  settrackingData={settrackingData}
                  stateId={stateId}
                  refetch={refetch}
                  editCnt={trackingData[2]?.editCnt}
                  supplierStatus={thirdMileSupplierData ?? []}
                  trackingDetails={trackingDetails?.miles[2]}
                  index={2}
                />
              </div>
            )}

            <DialogBox
              showDialog={cancelModal}
              confirmNavigation={confirmBackCancelModal}
              cancelNavigation={cancelBack}
            />
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default OrderTracking;
