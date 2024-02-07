import { ArrowLeftIcon, HomeModernIcon } from "@heroicons/react/24/outline";
// import { current } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import { AdminRoles, AdminUser } from "../../../api/admin/admin";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import Spinner from "../../../utils/Spinner";

import UseToast from "../../../hooks/useToast";
import SubjectAbout from "./SubjectAbout";
import Subjectlog from "./SubjectLog";

const tab = [
  { name: "About", href: "#", current: true },
  { name: "Log", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function SubjectDetail() {
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, setEditCnt] = useState(true);
  const [adminRoles, setadminRoles] = useState<any[]>([]);
  const [data, setdata] = useState<any>();
  const [editData, seteditData] = useState<any>();
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [tabToggle, settabToggle] = useState<any>();
  const [compareToggle, setcompareToggle] = useState(false);
  const [selectedTabName, setselectedTabName] = useState<string>();
  const [tabRedirect, settabRedirect] = useState<boolean>(false);

  const location: any = useLocation();
  const navigate = useNavigate();
  const state = location?.state;
  let { id } = useParams();

  const {
    isLoading,
    isFetched,
    refetch: profileRefetch,
  } = useQuery(["fetchProfile"], () => AdminUser({ id }), {
    onSuccess(data: { data: { role: { id: any } } }) {
      setdata({
        ...data?.data,
        roleId: data?.data?.role?.id,
      });

      refetch();
    },
    onError(error: any) {
      // typeof error !== "string"
      //   ? UseToast(error?.message, "error")
      //   : UseToast(error, "error");
      // navigate("/admin/list");
    },
  });
  // const { refetch: profileRefetch } = useQuery(
  //   ["fetchProfileAgain"],
  //   () => AdminUser({ id }),
  //   {
  //     onSuccess(data: { data: { role: { id: any } } }) {
  //       setdata({
  //         ...data?.data,
  //         roleId: data?.data?.role?.id,
  //       });
  //     },
  //     onError(error: any) {
  //       typeof error !== "string"
  //         ? UseToast(error?.message, "error")
  //         : UseToast(error, "error");
  //       navigate("/admin/list");
  //     },

  //     enabled: false,
  //   }
  // );

  useEffect(() => {
    if (!id) {
      navigate("/admin/list");
    }
  }, [id]);

  const { refetch } = useQuery(["fetchRole"], () => AdminRoles({}), {
    onSuccess(responseData: { data: any[] }) {
      const findRole = responseData?.data?.find(
        (x: any) => x?.id === data?.role?.id
      );
      const filterRole = responseData?.data?.filter(
        (x: any) => x?.id !== data?.role?.id
      );
      setadminRoles([findRole, ...filterRole]);
    },
    onError(error: any) {},

    enabled: false,
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
    // seteditData(data);
    settabRedirect(!tabRedirect);
    setEditCnt(true);
    setcancelModel(false);
  };

  const cancelBack = () => {
    setcancelModel(false);
  };

  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey ${
        isFetched && "animate-blinking"
      }`}
    >
      <div>
        <Link to="/admin/list" className="flex gap-2 items-end py-4">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to admin listing
        </Link>
      </div>

      <div className="flex justify-between items-center py-5 ">
        <h2 className="pb-4 text-2xl font-semibold text-font_black">
          Admin Details
        </h2>
        {tabs[1].current && (
          <a
            onClick={() => navigate("/admin/add")}
            className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
          >
            + New Admin
          </a>
        )}
      </div>

      {!isLoading && (
        <>
          <div className="flex gap-4 items-center p-5 bg-white rounded-lg shadow-md mb-4">
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
            <div>
              <span className="text-sm text-font_dark">
                {/* Project Manager */}
                {data?.role?.name}
              </span>
              <p className="text-2xl font-semibold">{`${data?.firstName} ${data?.lastName}`}</p>
            </div>
          </div>

          <div className="bg-white px-5 pt-5 rounded-t-md shadow-md ">
            <div className="flex gap-2 flex-wrap justify-between sm:hidden py-4">
              <div className="px-1">
                <select
                  id="tabs"
                  name="tabs"
                  className="py-2 pl-3 pr-10 focus:outline-none border-grey_border_table border rounded-md"
                  onChange={(tab) => tabCalled(tab)}
                  value={selectedTabName}
                >
                  {tabs?.map((tab) => (
                    <option key={tab?.name}>{tab?.name}</option>
                  ))}
                </select>
              </div>

              <div>
                {editCnt && tabs[0].current && (
                  <button
                    type="button"
                    onClick={() => setEditCnt(!editCnt)}
                    className="bg-blue_primary px-4 py-2 text-white hover:bg-grey_bg rounded-md text-sm"
                  >
                    Edit Admin Info
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
                    Edit Admin Info
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

          <SubjectAbout
            show={tabs[0].current}
            tabRedirect={tabRedirect}
            compareToggle={compareToggle}
            setcompareToggle={setcompareToggle}
            profileRefetch={profileRefetch}
            editCnt={editCnt}
            adminRoles={adminRoles}
            setadminRoles={setadminRoles}
            data={data}
            setdata={setdata}
            setEditCnt={setEditCnt}
            state={id}
          />
          {tabs[1].current && <Subjectlog state={id} />}
        </>
      )}

      {(isLoading || !data) && <Spinner />}
    </div>
  );
}
