import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// import { current } from "@reduxjs/toolkit";
import { useMutation, useQuery } from "@tanstack/react-query";
import parsePhoneNumber from "libphonenumber-js";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DownloadShipmentLabel } from "../../../api/bulkcustomerorder/bulkcustomerorder";
import {
  CitiesDetails,
  CountriesDetails,
  OrderDetails,
  StatesDetails,
  SystemVariablesDetails,
} from "../../../api/orderDetails/orderDetails.api";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import UseToast from "../../../hooks/useToast";
import Spinner from "../../../utils/Spinner";
import OrderAbout from "./OrderAbout";
import OrderLog from "./OrderLog";
import OrderTracking from "./OrderTracking";
import PackageDetails from "./PackageDetails";
import ReceiverDetails from "./ReceiverDetails";
import SenderDetails from "./SenderDetails";
import {
  ExternalTrackingResponseType,
  InternalTrackingResponseType,
} from "../../../types/order";

type externalStatusType = {
  externalStatus: externalStatusSubType;
  triggeredAt: string;
};

type externalStatusSubType = {
  id: string;
  name: string;
  color: string;
  mile: string;
  planeStatus: string;
  updatedAt: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const sortByPriority = (data: any[]) => {
  return data.sort((a: any, b: any) => {
    if (
      a?.supplierStatus?.internalStatus?.priority >
      b.supplierStatus?.internalStatus?.priority
    ) {
      return 1;
    } else if (
      a.supplierStatus?.internalStatus?.priority <
      b.supplierStatus?.internalStatus?.priority
    ) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const OrderDetail = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const state: string = location?.state?.state;
  const isCustomerOrder = location?.state?.isCustomerOrder;
  const tab = [
    {
      name: "About",
      href: "#",
      current: isCustomerOrder ? true : false,
      isEditable: true,
    },
    { name: "Sender", href: "#", current: false, isEditable: true },
    { name: "Receiver", href: "#", current: false, isEditable: true },
    { name: "Package", href: "#", current: false, isEditable: true },
    {
      name: "Tracking",
      href: "#",
      current: isCustomerOrder ? false : true,
      isEditable: false,
    },
    { name: "Log", href: "#", current: false, isEditable: false },
  ];
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, setEditCnt] = useState(true);
  const [tabChangeModal, settabChangeModal] = useState<boolean>(false);
  const [orderAboutData, setorderAboutData] = useState();
  const [senderDetails, setsenderDetails] = useState();
  const [trackingDetails, settrackingDetails] = useState<any>();
  const [packageDetails, setpackageDetails] = useState();
  const [receiverDetailsData, setreceiverDetailsData] = useState();
  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState<boolean>(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);
  const [countriesDetails, setcountriesDetails] = useState<any[]>([]);
  const [taxTypes, settaxTypes] = useState<any>();
  const [idTypesDetails, setidTypesDetails] = useState();
  const [transportationTypeDetails, settransportationTypeDetails] = useState();
  const [productTypeDetails, setproductTypeDetails] = useState();
  const [pickUpSlotsDetails, setpickUpSlotsDetails] = useState();
  const [shipmentTermList, setshipmentTermList] = useState([]);
  const [cancelModal, setcancelModal] = useState<boolean>(false);
  const [internalTracking, setInternalTracking] = useState<
    InternalTrackingResponseType[]
  >([]);
  const [externalTracking, setExternalTracking] = useState<
    ExternalTrackingResponseType[]
  >([]);
  const [orderDetails, setOrderDetails] = useState<any>();

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const params = useParams();
  const id: string | undefined = params?.id;

  const { refetch, isLoading, isFetching } = useQuery(
    ["fetchProfile"],
    () => OrderDetails({ id }),
    {
      onSuccess(data: any) {
        setOrderDetails({
          cutomerOrderNo: data?.data?.cutomerOrderNo,
          destination: data?.data?.destination,
          origin: data?.data?.origin,
        });

        setInternalTracking(
          data.data?.about?.status?.internalStatus?.map((data: any) => {
            return {
              ...data,
              triggeredAt: new Date(data.triggeredAt),
            };
          })
        );
        setExternalTracking(
          data.data?.about?.status?.externalStatus?.map((data: any) => {
            return {
              ...data,
              triggeredAt: new Date(data.triggeredAt),
            };
          })
        );

        setorderAboutData(data?.data?.about);
        const phoneNumber = parsePhoneNumber(
          `${data?.data?.sender?.senderPhone}`
        );
        if (phoneNumber) {
          const senderPhone = phoneNumber.formatNational();
          const senderCountryCode = phoneNumber
            .formatInternational()
            .split(" ")[0];
          setsenderDetails({
            ...data?.data?.sender,
            senderPhone,
            senderCountryCode,
          });
        } else {
          setsenderDetails({
            ...data?.data?.sender,
            senderPhone: data?.data?.sender?.senderPhone,
            senderCountryCode: '',
          });
        }
        const receiverPhoneNumber = parsePhoneNumber(
          `${data?.data?.receiver?.receiverPhone}`
        );
        if (receiverPhoneNumber) {
          const receiverPhone = receiverPhoneNumber.formatNational();
          const receiverCountryCode = receiverPhoneNumber
            .formatInternational()
            .split(" ")[0];
          setreceiverDetailsData({
            ...data?.data?.receiver,
            receiverPhone,
            receiverCountryCode,
          });
        } else {
          setreceiverDetailsData({
            ...data?.data?.receiver,
            senderPhone: data?.data?.receiver?.receiverPhone,
            senderCountryCode: '',
          });
        }
        let firstMile = {};
        let secondMile = {};
        let thirdMile = {};

        for (let a of data?.data?.tracking?.miles) {
          let status = [];

          for (let b of a.status) {
            if (b?.supplierStatus?.id) {
              let triggerDate = moment(b?.triggeredAt)
                .utc()
                .format("MM/DD/YYYY");
              let triggerTime = moment(b?.triggeredAt).utc().format("HH:mm:ss");
              status.push({
                ...b,
                supplierStatus: {
                  ...b?.supplierStatus,
                  internalStatus: b?.internalStatus,
                },
                triggerDate: triggerDate,
                triggerTime: triggerTime,
              });
            }
          }

          const filterByPriority = sortByPriority(status);

          let mainObj = { ...a, status: filterByPriority };

          if (mainObj?.mile === "FIRST_MILE") {
            firstMile = mainObj;
          } else if (mainObj?.mile === "INTERNATIONAL_MILE") {
            secondMile = mainObj;
          } else if (mainObj?.mile === "LAST_MILE") {
            thirdMile = mainObj;
          }
        }

        settrackingDetails({ miles: [firstMile, secondMile, thirdMile] });

        setpackageDetails(data?.data?.package);
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/order/list");
      },
    }
  );

  useEffect(() => {
    if (!id) {
      navigate("/order/list");
    }
  }, [id]);

  useQuery(["fetchSystemVariables"], () => SystemVariablesDetails(), {
    onSuccess(data: any) {
      data?.data?.map((x: any) => {
        if (x?.name === "tax_type") {
          settaxTypes(x);
        }
        if (x?.name === "id_type") {
          setidTypesDetails(x);
        }
        if (x?.name === "transportation_type") {
          settransportationTypeDetails(x);
        }
        if (x?.name === "package_type") {
          setproductTypeDetails(x);
        }
        if (x?.name === "pick_up_slot") {
          setpickUpSlotsDetails(x);
        }
        if (x?.name?.trim() === "shipment_term") {
          setshipmentTermList(x);
        }
      });
    },
    onError(error: any) {},
  });

  useQuery(["fetchCountryVariables"], () => CountriesDetails(), {
    onSuccess(data: any) {
      setcountriesDetails(data?.data);
    },
    onError(error: any) {},
  });

  useEffect(() => {
    tabs?.map((x) => {
      if (x?.current) {
        setselectedTabName(x?.name);
      }
    });
  }, [tabs]);

  const tabCalled = (tab: any) => {
    if (compareToggle) {
      settabChangeModal(true);
      settabToggle(tab);
    } else {
      if (tab?.target?.value) {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.target?.value
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          setTabname(!Tabname);
        setEditCnt(true);
      } else {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.name
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          setTabname(!Tabname);
        setEditCnt(true);
      }
    }
  };

  const confirmBack = () => {
    settabRedirect(!tabRedirect);
    setEditCnt(true);
    settabChangeModal(false);

    setTimeout(() => {
      if (tabToggle?.target?.value) {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tabToggle?.target?.value
              ? {
                  ...object,
                  current: false,
                }
              : {
                  ...object,
                  current: true,
                }
          )
        ),
          setTabname(!Tabname);
        setEditCnt(true);
      } else {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tabToggle?.name
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          setTabname(!Tabname);
      }
    }, 500);
  };

  const cancelBack = () => {
    settabChangeModal(false);
    setcancelModal(false);
  };

  const confirmBackCancelModal = () => {
    settabRedirect(!tabRedirect);
    setcancelModal(false);
    setEditCnt(true);
  };

  let isEditableTab = false;
  tabs.map((x) => {
    if (x?.current) {
      if (x.isEditable) {
        isEditableTab = true;
      }
    }
  });

  const { mutate } = useMutation(DownloadShipmentLabel, {
    onSuccess: (data: any) => {
      const link = document.createElement("a");
      link.href = data.data.url;
      link.setAttribute("download", `OrderDetails-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      UseToast("Shipment Label Downloaded", "success");
    },
    onError: (data: any) => {
      UseToast("Something went wrong !", "error");
    },
  });

  const onDownloadShipmentLabel = () => {
    mutate({ id });
  };
  return !isLoading ? (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey min-h-screen ${
        "isFetched" && "animate-blinking"
      }`}
    >
      <div>
        <Link
          to="/order/list"
          className="flex gap-2 w-fit font-medium text-font_dark items-end pt-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to order management
        </Link>
      </div>

      <div className="flex justify-between items-center pt-2.5 pb-4 ">
        <h2 className="text-2xl font-semibold text-font_black">
          Order details
        </h2>
      </div>

      {/* {!isLoading && data && ( */}
      {!isLoading && orderDetails && (
        <>
          <div className="sm:flex block justify-between items-center p-5 bg-white rounded-lg shadow-md mb-4">
            <div className="flex  gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect width="48" height="48" rx="6" fill="#00145b" />
                <path
                  d="M32 19L24 15L16 19M32 19L24 23M32 19V29L24 33M24 23L16 19M24 23V33M16 19V29L24 33"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              <div>
                <span className="text-sm text-table_head_color font-Inter">
                  {orderDetails?.origin} {">"} {orderDetails?.destination}
                  {/* {data?.role?.name} */}
                </span>

                <p className="text-2xl font-semibold font-Inter">
                  {orderDetails?.cutomerOrderNo}
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              <button
                onClick={onDownloadShipmentLabel}
                type="button"
                className=" rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[23px] text-sm font-medium text-white focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
              >
                Download Shipment Label
              </button>
            </div>
          </div>

          <div className="bg-white px-5 rounded-t-md shadow-md">
            <div className="flex gap-2 flex-wrap justify-between lg:hidden py-4">
              <div>
                <select
                  id="tabs"
                  name="tabs"
                  className="py-2 pl-3 pr-10 focus:outline-none border-grey_border_table border rounded-md"
                  onChange={(tab) => tabCalled(tab)}
                  value={selectedTabName}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>

              <div>
                {editCnt && isEditableTab && (
                  <button
                    type="button"
                    onClick={() => setEditCnt(!editCnt)}
                    className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm"
                  >
                    Edit Order Info
                  </button>
                )}
              </div>
            </div>

            <div className="hidden lg:flex justify-between items-center border-b  border-grey_border_table">
              <div className="">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab: any) => (
                    <p
                      key={tab.name}
                      onClick={() => tabCalled(tab)}
                      className={classNames(
                        tab.current
                          ? "border-blue_primary text-blue_primary"
                          : "border-transparent text-font_dark",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium  cursor-pointer"
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </p>
                  ))}
                </nav>
              </div>

              <div>
                {editCnt && isEditableTab && (
                  <button
                    type="button"
                    onClick={() => setEditCnt(!editCnt)}
                    className="rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[21px] text-sm font-medium text-white focus:outline-none font-Inter"
                  >
                    Edit Order Details
                  </button>
                )}
              </div>
            </div>
            <DialogBox
              showDialog={tabChangeModal}
              confirmNavigation={confirmBack}
              cancelNavigation={cancelBack}
            />
          </div>
          {!isLoading && !_.isEmpty(trackingDetails?.miles) ? (
            <>
              <OrderAbout
                // internalTracking={internalTracking}
                internalTracking={_.uniqBy(internalTracking, (e) =>
                  e.internalStatus ? e.internalStatus.name : e
                )}
                // externalTracking={externalTracking}
                externalTracking={_.uniqBy(externalTracking, (e) =>
                  e.externalStatus ? e.externalStatus.name : e
                )}
                refetch={refetch}
                setcancelModal={setcancelModal}
                cancelModal={cancelModal}
                pickUpSlotsDetails={pickUpSlotsDetails}
                productTypeDetails={productTypeDetails}
                transportationTypeDetails={transportationTypeDetails}
                show={tabs[0].current}
                tabRedirect={tabRedirect}
                compareToggle={compareToggle}
                setcompareToggle={setcompareToggle}
                orderDetailsData={orderAboutData}
                editCnt={editCnt}
                setEditCnt={setEditCnt}
                province={id}
              />
              <SenderDetails
                show={tabs[1].current}
                refetch={refetch}
                tabRedirect={tabRedirect}
                compareToggle={compareToggle}
                cancelModal={cancelModal}
                setcompareToggle={setcompareToggle}
                setcancelModal={setcancelModal}
                province={id}
                taxTypes={taxTypes}
                countriesDetails={countriesDetails}
                editCnt={editCnt}
                setEditCnt={setEditCnt}
                idTypesDetails={idTypesDetails}
                senderDetails={senderDetails}
              />
              <ReceiverDetails
                show={tabs[2].current}
                refetch={refetch}
                tabRedirect={tabRedirect}
                compareToggle={compareToggle}
                setcompareToggle={setcompareToggle}
                cancelModal={cancelModal}
                setcancelModal={setcancelModal}
                province={id}
                taxTypes={taxTypes}
                countriesDetails={countriesDetails}
                editCnt={editCnt}
                setEditCnt={setEditCnt}
                idTypesDetails={idTypesDetails}
                receiverDetails={receiverDetailsData}
              />

              <PackageDetails
                shipmentTermList={shipmentTermList}
                setcancelModal={setcancelModal}
                packageDetails={packageDetails}
                editCnt={editCnt}
                countriesDetails={countriesDetails}
                state={id}
                tabRedirect={tabRedirect}
                setEditCnt={setEditCnt}
                compareToggle={compareToggle}
                setcompareToggle={setcompareToggle}
                show={tabs[3].current}
                refetch={refetch}
              />

              <OrderTracking
                isLoading={isFetching}
                tabRedirect={tabRedirect}
                compareToggle={compareToggle}
                setcompareToggle={setcompareToggle}
                stateId={id}
                refetch={refetch}
                trackingDetails={trackingDetails}
                show={tabs[4].current}
              />
              {tabs[5].current && <OrderLog state={id} />}
            </>
          ) : (
            <Spinner />
          )}
        </>
      )}

      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      {/* <DialogBox
        showDialog={tabChangeModal}
        confirmNavigation={confirmBack}
        cancelNavigation={cancelBack}
      /> */}
      <DialogBox
        showDialog={cancelModal}
        confirmNavigation={confirmBackCancelModal}
        cancelNavigation={cancelBack}
      />
    </div>
  ) : (
    <Spinner />
  );
};
