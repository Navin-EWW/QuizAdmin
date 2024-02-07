import { ArrowLeftIcon, HomeModernIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AdminRoles, AdminUser } from "../../../api/admin/admin";
import { MerchantDetail } from "../../../api/merchant/merchant";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import Spinner from "../../../utils/Spinner";
import MerchantAbout from "./MerchantAbout";
import MerchantLog from "./MerchantLog";
import ClientTable from "./MerchantUserTable";
import buildingIcon from "./../../../../public/icon/building.svg";
import UseToast from "../../../hooks/useToast";
import MerchantBalance from "./MerchantBalance";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const tab = [
  {
    name: "About",
    href: "#",
    current: true,
  },
  {
    name: "User Info.",
    href: "#",
    current: false,
  },
  {
    name: "Balance",
    href: "#",
    current: false,
  },
  {
    name: "Log",
    href: "#",
    current: false,
  },
];
export function MerchantDetails() {
  const navigate = useNavigate();
  const [editCnt, setEditCnt] = useState(true);
  const [data, setdata] = useState<MerchantData>();
  const location: any = useLocation();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [tabs, setTabs] = useState(tab);

  const state = location?.state?.id;
  let { id } = useParams();

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(["merchantDetails"], () => MerchantDetail({ id }), {
      keepPreviousData: true,
      onSuccess(data: { data: { role: { id: any } } }) {
        setdata((prev: any) => {
          return {
            ...prev,
            ...data?.data,
          };
        });

        // refetch();
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/merchant/list");
      },
    });

  useEffect(() => {
    if (!id) {
      navigate("/merchant/list");
    }
  }, [id]);

  useEffect(() => {
    tabs?.map((x) => {
      if (x.current) {
        setselectedTabName(x?.name);
      }
    });
  }, [tabs]);

  const tabCalled = (tab: any) => {
    if (compareToggle) {
      setcancelModel(true);
      if (tab?.target?.value) {
        settabToggle(tab?.target?.value);
      } else {
        settabToggle(tab?.name);
      }
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
        );
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
        );
      }
    }
  };

  const confirmBack = () => {
    setTabs(
      [...tabs].map((object) =>
        object?.name === tabToggle
          ? {
              ...object,
              current: true,
            }
          : {
              ...object,
              current: false,
            }
      )
    );

    setEditCnt(true);
    settabRedirect(!tabRedirect);
    // seteditData(data);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey">
        <Link to="/merchant/list" className="flex gap-2 items-end py-4">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to merchant listing
        </Link>
        <div className="flex justify-between items-center py-5 ">
          <h2 className="pb-4 text-2xl font-semibold text-font_black">
            Merchant Details
          </h2>
          {!tabs[0].current && (
            <a
              onClick={() => navigate("/merchant/add")}
              className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
            >
              + New Merchant
            </a>
          )}
        </div>
        {/* {!isLoading && data && ( */}
        <>
          {!isLoading && (
            <>
              <div className="flex gap-4 items-center p-5 bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="6" fill="#00145b" />
                  <path
                    d="M31 33V17C31 15.8954 30.1046 15 29 15H19C17.8954 15 17 15.8954 17 17V33M31 33L33 33M31 33H26M17 33L15 33M17 33H22M21 19H22M21 23H22M26 19H27M26 23H27M22 33V28C22 27.4477 22.4477 27 23 27H25C25.5523 27 26 27.4477 26 28V33M22 33H26"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div>
                  <span className="text-sm text-font_dark">Merchant</span>
                  {/* <p className="text-2xl font-semibold">{data?.name}</p> */}
                  <p className="text-2xl font-semibold">{data?.name}</p>
                </div>
              </div>
              <div className="bg-white px-5 pt-5 rounded-t-md shadow-md">
                <div className="flex gap-2 flex-wrap justify-between sm:hidden py-4">
                  <div className="px-1">
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
                    {editCnt && (tabs[0]?.current || tabs[2]?.current) && (
                      <button
                        type="button"
                        onClick={() => setEditCnt(!editCnt)}
                        className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm"
                      >
                        Edit Merchant Info
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex justify-between items-center border-b border-grey_border_table">
                  <div className="">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {tabs.map((tab: any) => (
                        <p
                          key={tab.name}
                          onClick={() => tabCalled(tab)}
                          className={classNames(
                            tab.current
                              ? "border-blue_primary text-font_black"
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
                  <DialogBox
                    showDialog={cancelModel}
                    confirmNavigation={confirmBack}
                    cancelNavigation={cancelBack}
                  />

                  <div>
                    {editCnt && (tabs[0]?.current || tabs[2]?.current) && (
                      <button
                        type="button"
                        onClick={() => setEditCnt(!editCnt)}
                        className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
                      >
                        Edit Merchant Info
                      </button>
                    )}
                  </div>
                </div>
                {/* <DialogBox
                  showDialog={cancelModel}
                  confirmNavigation={confirmBack}
                  cancelNavigation={cancelBack}
                /> */}
              </div>
            </>
          )}
          <MerchantAbout
            show={tabs[0].current}
            setcompareToggle={setcompareToggle}
            compareToggle={compareToggle}
            tabRedirect={tabRedirect}
            editCnt={editCnt}
            setEditCnt={setEditCnt}
            state={id}
          />

          {tabs[1].current && <ClientTable state={id} />}
          {tabs[2].current && (
            <MerchantBalance
              show={tabs[2].current}
              tabRedirect={tabRedirect}
              compareToggle={compareToggle}
              cancelModal={cancelModel}
              setcompareToggle={setcompareToggle}
              setcancelModal={setcancelModel}
              state={id}
              editCnt={editCnt}
              setEditCnt={setEditCnt}
            />
          )}

          {tabs[3].current && <MerchantLog state={id} />}
        </>
        {/* )} */}
        {(isLoading || !data) && <Spinner />}
      </div>
    </>
  );
  interface MerchantData {
    address: string;
    businessRegistration: number;
    country: string;
    createdBy: { firstName: string; lastName: string };
    createdOn: string;
    creditPeriod: 20;
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
}
