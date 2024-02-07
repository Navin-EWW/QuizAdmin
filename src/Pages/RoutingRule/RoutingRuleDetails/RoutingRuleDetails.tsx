import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// import { current } from "@reduxjs/toolkit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parsePhoneNumber } from "libphonenumber-js";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import UseToast from "../../../hooks/useToast";
import Spinner from "../../../utils/Spinner";
import ClearanceSupplier from "./ClearanceSupplier";
import RouteAbout from "./RouteAbout";
import RouteLog from "./RouteLog";
import ServiceSuppiler from "./ServiceSupplier";
import { RoutingRuleDetailsAPI } from "../../../api/routingRule/routingRule";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const RoutingRuleDetails = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const state: string = location?.state?.state;
  const tab = [
    {
      name: "About",
      href: "#",
      current: true,
      isEditable: false,
    },
    { name: "Service Supplier", href: "#", current: false, isEditable: true },
    { name: "Clearance Supplier", href: "#", current: false, isEditable: true },
    { name: "Log", href: "#", current: false, isEditable: false },
  ];
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, setEditCnt] = useState(true);
  const [tabChangeModal, settabChangeModal] = useState<boolean>(false);
  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState<boolean>(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);
  const [cancelModal, setcancelModal] = useState<boolean>(false);
  const [aboutData, setaboutData] = useState<AboutTypes>();
  const [clearanceSupplierData, setclearanceSupplierData] = useState();
  const [serviceSupplierData, setserviceSupplierData] =
    useState<serviceSupplierTypes>();
  const [code, setcode] = useState("");

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const params = useParams();
  const id: string | undefined = params?.id;

  const { refetch, isLoading, isFetching } = useQuery(
    ["RoutingRuleDetailsAPI"],
    () => RoutingRuleDetailsAPI(id),
    {
      onSuccess(data: any) {
        setclearanceSupplierData(data?.data?.clearanceSupplier);
        setserviceSupplierData(data?.data?.serviceSupplier);
        setaboutData(data?.data?.about);
        setcode(data?.data?.code);
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/routing-rule/list");
      },
    }
  );
  useEffect(() => {
    if (!id) {
      navigate("/routing-rule/list");
    }
  }, [id]);

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

  return !isLoading ? (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey ${
        ""
        // !tabs[2]?.current && "min-h-screen"
      } 
       ${"isFetched" && "animate-blinking"}`}
    >
      <div>
        <Link
          to="/routing-rule/list"
          className="flex gap-2 w-fit font-medium text-font_dark items-end pt-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Routing rules
        </Link>
      </div>

      <div className="flex justify-between items-center pt-2.5 pb-4 ">
        <h2 className="text-2xl font-semibold text-font_black">
          Routing rule details
        </h2>
      </div>

      {/* {!isLoading && data && ( */}
      {!isLoading && (
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
                  {/* {orderDetails?.origin} {">"} {orderDetails?.destination} */}
                  Rule ID
                  {/* {data?.role?.name} */}
                </span>

                <p className="text-2xl font-semibold font-Inter">
                  {/* {orderDetails?.cutomerOrderNo} */}
                  {code}
                </p>
              </div>
            </div>

            {/* <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className=" rounded-md bg-blue_primary hover:bg-hoverChange py-[8.5px] px-[23px] text-sm font-medium text-white focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
              >
                Edit Rule Details
              </button>
            </div> */}
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
          {!isLoading ? (
            <>
              <RouteAbout
                show={tabs[0].current}
                // refetch={refetch}
                tabRedirect={tabRedirect}
                aboutData={aboutData}
                compareToggle={compareToggle}
                cancelModal={cancelModal}
                setcompareToggle={setcompareToggle}
                setcancelModal={setcancelModal}
                state={id}
                editCnt={editCnt}
                setEditCnt={setEditCnt}
              />
              {tabs[1].current && (
                <ServiceSuppiler
                  id={id}
                  refetch={refetch}
                  tabRedirect={tabRedirect}
                  compareToggle={compareToggle}
                  cancelModal={cancelModal}
                  setcompareToggle={setcompareToggle}
                  setcancelModal={setcancelModal}
                  state={id}
                  editCnt={editCnt}
                  serviceSupplierData={serviceSupplierData}
                  setEditCnt={setEditCnt}
                />
              )}
              {tabs[2].current && (
                <ClearanceSupplier
                  id={id}
                  clearanceSupplierData={clearanceSupplierData}
                  refetch={refetch}
                  tabRedirect={tabRedirect}
                  compareToggle={compareToggle}
                  cancelModal={cancelModal}
                  setcompareToggle={setcompareToggle}
                  setcancelModal={setcancelModal}
                  state={id}
                  editCnt={editCnt}
                  setEditCnt={setEditCnt}
                />
              )}
              {tabs[3].current && <RouteLog state={id} />}
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

export interface AboutTypes {
  originCountry: NCountry;
  originProvince: null;
  originCity: null;
  destinationCountry: NCountry;
  destinationProvince: null;
  destinationCity: null;
  transportationMode: ProductType;
  productType: ProductType;
  pickup: boolean;
}

export interface NCountry {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  numericCode: string;
  phoneCode: string;
  capital: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  native: string;
  region: string;
  subregion: string;
  latitude: string;
  longitude: string;
}

export interface ProductType {
  id: string;
  systemVariableId: string;
  value: string;
  en_translation: string;
  zh_translation: string;
  zh_cht_translation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface serviceSupplierTypes {
  firstMile: FirstMile;
  internationalMile: InternationalMile;
  lastMile: LastMile;
}

export interface FirstMile {
  firstMileServiceSupplier: string | null;
  firstMileDestinationContactName: string | null;
  firstMileDestinationContactPhone: string | null;
  firstMileDestinationAddress: string | null;
  firstMileDestinationFloor: string | null;
  firstMileDestinationRoom: string | null;
}

export interface InternationalMile {
  internationalMileServiceSupplier: string | null;
  internationalSenderName: string | null;
  internationalSenderPhone: string | null;
  internationalSenderCompany: string | null;
  internationalSenderCity: string | null;
  internationalSenderAdress: string | null;
  internationalSenderPostCode: string | null;
  internationalDestinationAddress: string | null;
}

export interface LastMile {
  lastMileServiceSupplier: string | null;
  lastMileReturnAddress: string | null;
  lastMileReturnCity: string | null;
  lastMileReturnCountry: string | null;
  lastMileReturnName: string | null;
  lastMileReturnPhone: string | null;
  lastMileReturnPostcode: string | null;
  lastMileSenderAddress: string | null;
  lastMileSenderCity: string | null;
  lastMileSenderCountry: string | null;
  lastMileSenderName: string | null;
  lastMileSenderPhone: string | null;
  lastMileSenderPostcode: string | null;
}
