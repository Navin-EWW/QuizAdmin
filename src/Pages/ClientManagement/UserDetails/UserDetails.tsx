import { ArrowLeftIcon, HomeModernIcon } from "@heroicons/react/24/outline";
// import { current } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MerchantListDropDown, UserDetails } from "../../../api/merchant/user";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { flagArray } from "../../../Components/Flags";
import UseToast from "../../../hooks/useToast";
import { language } from "../../../utils/language";
import Spinner from "../../../utils/Spinner";
import UserLog from "../UserLog/UserLog";
import UserAbout from "./UserAbout";

const tab = [
  { name: "About", href: "#", current: true },
  { name: "Log", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function UserDetail() {
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, setEditCnt] = useState(true);
  const [userData, setuserData] = useState<any>();
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [merchantList, setmerchantList] = useState<any[]>([]);
  const [languageArray, setlanguageArray] = useState<any[]>([]);
  const [selectedFlag, setselectedFlag] = useState<any>();
  const [defaultFlag, setdefaultFlag] = useState<any>();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);

  const location: any = useLocation();
  const navigate = useNavigate();
  const state = location?.state;
  let { id } = useParams();

  const { refetch: profileRefetch, isLoading } = useQuery(
    ["fetchProfile"],
    () => UserDetails({ id }),
    {
      onSuccess(data: any) {
        setuserData((prev: any) => {
          return {
            ...prev,
            ...data?.data,
            merchantId: data?.data?.merchant?.id,
          };
        });

        const findLanguage = language.find(
          (x) => x?.code === data?.data?.language
        );
        const filterLanguage = language.filter(
          (x) => x?.code !== data?.data?.language
        );
        setlanguageArray([findLanguage, ...filterLanguage]);
        const findFlag = flagArray.find(
          (x) => x.dialCode === `+${data?.data?.phoneCode}`
        );

        setselectedFlag(findFlag);
        setdefaultFlag(findFlag);

        refetch();
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/user/list");
      },
    }
  );

  // const { refetch: profileRefetch, isLoading: profileRefetchLoading } =
  //   useQuery(["fetchProfileAgain"], () => UserDetails({ id }), {
  //     onSuccess(data: any) {
  //       setuserData((prev: any) => {
  //         return {
  //           ...prev,
  //           ...data?.data,
  //           merchantId: data?.data?.merchant?.id,
  //         };
  //       });

  //       const findLanguage = language.find(
  //         (x) => x?.code === data?.data?.language
  //       );
  //       const filterLanguage = language.filter(
  //         (x) => x?.code !== data?.data?.language
  //       );
  //       setlanguageArray([findLanguage, ...filterLanguage]);
  //       const findFlag = flagArray.find(
  //         (x) => x.dialCode === `+${data?.data?.phoneCode}`
  //       );
  //       setselectedFlag(findFlag);
  //       setdefaultFlag(findFlag);
  //     },
  //     onError(error: any) {},

  //     enabled: false,
  //   });

  const { refetch, isLoading: roleLoading } = useQuery(
    ["fetchRole"],
    () => MerchantListDropDown(),
    {
      onSuccess(responseData: { data: any }) {
        const findRole = responseData?.data?.find(
          (x: any) => x?.id === userData?.merchant?.id
        );
        const filterRole = responseData?.data?.filter(
          (x: any) => x?.id !== userData?.merchant?.id
        );
        setmerchantList([findRole, ...filterRole]);
      },
      onError(error: any) {},

      enabled: false,
    }
  );

  useEffect(() => {
    if (!id) {
      navigate("/user/list");
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
      }
    }
  };

  const confirmBack = () => {
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

    settabRedirect(!tabRedirect);
    setEditCnt(true);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  const backClicked = () => {
    if (state?.isMerchant) {
      navigate(-1);
    } else {
      navigate("/user/list");
    }
  };
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey">
        <div>
          <p
            onClick={backClicked}
            className="flex gap-2 items-end py-4 cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to user listing
          </p>
        </div>

        <div className="flex justify-between items-center py-5 ">
          <h1 className="text-2xl font-semibold text-font_black">
            User Details
          </h1>

          {tabs[1].current && (
            <a
              onClick={() => navigate("/user/add")}
              className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
            >
              + New User
            </a>
          )}
        </div>

        {!isLoading && !roleLoading && (
          <>
            <div className="flex gap-4 items-start   sm:items-center p-5 bg-white rounded-lg shadow-md mb-4">
              <div className="w-12">
                {tabs[1].current ? (
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
                ) : (
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="48" height="48" rx="6" fill="#00145b" />
                    <path
                      d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 26C20.134 26 17 29.134 17 33H31C31 29.134 27.866 26 24 26Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm text-font_dark">Master User</span>
                <p className="text-2xl font-semibold break-all">{`${userData?.firstName} ${userData?.lastName}`}</p>
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
                  {editCnt && tabs[0].current && (
                    <button
                      type="button"
                      onClick={() => setEditCnt(!editCnt)}
                      className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm"
                    >
                      Edit User Info
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

                <div>
                  {editCnt && tabs[0].current && (
                    <button
                      type="button"
                      onClick={() => setEditCnt(!editCnt)}
                      className="rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
                    >
                      Edit User Info
                    </button>
                  )}
                </div>
              </div>
              <DialogBox
                showDialog={cancelModel}
                confirmNavigation={confirmBack}
                cancelNavigation={cancelBack}
              />
            </div>

            <UserAbout
              profileRefetch={profileRefetch}
              languageArray={languageArray}
              compareToggle={compareToggle}
              setcompareToggle={setcompareToggle}
              editCnt={editCnt}
              merchantList={merchantList}
              tabRedirect={tabRedirect}
              defaultFlag={defaultFlag}
              userData={userData}
              setuserData={setuserData}
              setEditCnt={setEditCnt}
              state={state}
              setselectedFlag={setselectedFlag}
              selectedFlag={selectedFlag}
              show={tabs[0].current}
            />

            {tabs[1].current && <UserLog state={state} />}
          </>
        )}

        {(isLoading || roleLoading) && <Spinner />}
      </div>
    </>
  );
}
