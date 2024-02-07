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
import ServiceSupplierAbout from "./ServiceSupplierAbout";
import ServiceSupplierLog from "./ServiceSupplierLog";
import ServiceSupplierStatusMapping from "./ServiceSupplierStatusMapping";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ServiceSupplierDetails = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const state: string = location?.state?.state;
  type tabtype = {
    name: string;
    href: string;
    current: boolean;
    isEditable: boolean;
  };
  const tab = [
    {
      name: "About",
      href: "#",
      current: true,
      isEditable: true,
    },
    { name: "Status mapping", href: "#", current: false, isEditable: true },
    { name: "Log", href: "#", current: false, isEditable: false },
  ];
  const [tabs, setTabs] = useState<tabtype[]>(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, setEditCnt] = useState(true);
  const [tabChangeModal, settabChangeModal] = useState<boolean>(false);

  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState<boolean>(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);

  const [cancelModal, setcancelModal] = useState<boolean>(false);
  const [nameS, setnameS] = useState<string | undefined>("");

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);

  const params = useParams();
  const id: string | undefined = params?.id;

  useEffect(() => {
    if (!id) {
      navigate("/service-supplier/list");
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

  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey min-h-screen ${
        "isFetched" && "animate-blinking"
      }`}
    >
      <div>
        <Link
          to="/service-supplier/list"
          className="flex gap-2 w-fit font-medium text-font_dark items-end pt-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to service supplier
        </Link>
      </div>

      <div className="flex justify-between items-center pt-2.5 pb-4 ">
        <h2 className="text-2xl font-semibold text-font_black">
          Service supplier details
        </h2>
      </div>

      {/* {!isLoading && data && ( */}
      <>
        <div className="sm:flex block justify-between items-center p-5 bg-white rounded-lg shadow-md mb-4">
          <div className="flex  gap-4 items-center">
            <div>
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
            </div>
            <div>
              <span className="text-sm text-table_head_color font-Inter">
                Supplier
              </span>

              <p className="text-2xl font-semibold font-Inter">
                {nameS ? nameS : ""}
              </p>
            </div>
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
                  Edit Supplier Info
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
        <>
          <ServiceSupplierAbout
            setnameS={setnameS}
            show={tabs[0].current}
            tabRedirect={tabRedirect}
            compareToggle={compareToggle}
            cancelModal={cancelModal}
            setcompareToggle={setcompareToggle}
            setcancelModal={setcancelModal}
            state={id}
            editCnt={editCnt}
            setEditCnt={setEditCnt}
          />
          {tabs[1].current && (
            <ServiceSupplierStatusMapping
              compareToggle={compareToggle}
              editCnt={editCnt}
              setcancelModal={setcancelModal}
              setcompareToggle={setcompareToggle}
              cancelModal={cancelModal}
              setEditCnt={setEditCnt}
              id={id}
            />
          )}
          {tabs[2].current && <ServiceSupplierLog state={id} />}
        </>
      </>

      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />

      <DialogBox
        showDialog={cancelModal}
        confirmNavigation={confirmBackCancelModal}
        cancelNavigation={cancelBack}
      />
    </div>
  );
};
