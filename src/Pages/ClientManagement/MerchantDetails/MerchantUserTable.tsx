import {
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import moment from "moment";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MerchantUserList } from "../../../api/merchant/merchant";
import Pagination from "../../../utils/Pagination";
import Spinner from "../../../utils/Spinner";
import ToggleModel from "./ToggleModel/ToggleModel";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
export default function ClientTable({ state: id }: any) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [statusid, setStatusid] = useState("");
  const [status, setStatus] = useState("");
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState<string>("desc");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const per_page = 10;

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(
      ["merchantUserDetails"],
      () =>
        MerchantUserList({
          id,
          current_page,
          per_page,
          sortBy,
          sortType,
        }),
      {
        keepPreviousData: true,
        onSuccess(data: any) {
          if (data.status) {
            setUserData(data.data);
            setperPageCount(data.data.length);

            settotal(data.pagination.total);
            setlast_page(data.pagination.last_page);
            setcurrent_page(data.pagination.current_page);
          }
        },
      }
    );
  const StatusHandle = (data: any) => {
    setStatusid(data?.id);
    data.status === "ACTIVE" ? setStatus("INACTIVE") : setStatus("ACTIVE");
    setOpen(!open);
  };

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );
  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const viewClicked = (item: any) => {
    navigate(`/user/list/${item.id}`, { state: { ...item, isMerchant: true } });
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };
  return (
    <>
      <div className="pb-20">
        <div className="px-5 bg-white shadow-md rounded-b-md">
          <div className="relative overflow-auto">
            <table className="w-max xl:w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 w-[160px] min-w-[160px] px-6 text-left text-xs font-medium "
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        FIRST NAME
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("firstName")}
                        >
                          {sortBy === "firstName" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        LAST NAME
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("lastName")}
                        >
                          {sortBy === "lastName" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        EMAIL
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("email")}
                        >
                          {sortBy === "email" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        PHONE
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("phoneNo")}
                        >
                          {sortBy === "phoneNo" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        COUNTRY
                      </div>
                      {/* <span>
                      <a className="cursor-pointer" onClick={() => onSort("country")}>
                        {sortBy === "country" ? (
                          sortType === "asc" ? (
                            <img src={DownArrow} />
                          ) : (
                            <img src={UpArrow} className={'mb-[1px]'} />
                          )
                        ) : (
                          <>
                            <img src={UpArrow} className={'mb-[1px]'} />

                            <img src={DownArrow} />
                          </>
                        )}
                      </a>
                    </span> */}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        LAST LOGIN
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("lastLoginAt")}
                        >
                          {sortBy === "lastLoginAt" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 w-[160px] min-w-[160px] py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        STATUS
                      </div>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("status")}
                        >
                          {sortBy === "status" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[1px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[1px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5  bg-background_grey sticky right-[0px] min-w-[100%] max-w-[100%]"
                  >
                    <a href="#" className="sr-only">
                      view
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {userData?.map((user, index) => {
                  const formatedDate = moment(user?.createdOn).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );
                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {user.firstName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.lastName}
                      </td>
                      <td
                        title={user.email}
                        className="whitespace-nowrap px-6 py-4 xl:max-w-[100px] 2xl:max-w-none overflow-x-hidden text-ellipsis"
                      >
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 xl:max-w-[100px] 2xl:max-w-none overflow-x-hidden text-ellipsis">
                        +{user.phoneCode}
                        {user.phoneNo}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.merchant?.country}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatedDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          onClick={(e) => StatusHandle(user)}
                          className={`${
                            user?.status === "ACTIVE"
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {user.status === "ACTIVE" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap  text-blue_primary text-sm font-medium  text-end sticky  right-0 p-0 w-full">
                        <p
                          className="cursor-pointer bg-white py-4 px-6"
                          onClick={() => {
                            viewClicked(user);
                          }}
                        >
                          View
                          {/* <span className="sr-only">View</span> */}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!userData.length && (
              <p className="flex justify-center">No Result Found</p>
            )}
          </div>
          <div className="flex items-center justify-between bg-white py-3 border-t border-grey_border_table font-Inter">
            <div className="flex flex-1 justify-between sm:hidden">
              <a
                onClick={() => onPageCall(current_page - 1)}
                // href="#"
                className="relative inline-flex items-center rounded-md border border-grey_border_table bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                onClick={() => onPageCall(current_page + 1)}
                // href="#"
                className="relative ml-3 inline-flex items-center rounded-md border border-grey_border_table bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-table_head_color font-normal">
                  Showing
                  <span className="">
                    {" "}
                    {current_page * 10 - 10 + 1}
                  </span> to{" "}
                  <span className="">
                    {" "}
                    {current_page * 10 + perPageCount - 10}{" "}
                  </span>{" "}
                  of
                  <span className=""> {total} </span> results
                </p>
              </div>
              <div>
                {userData.length > 0 && (
                  <Pagination
                    last_page={last_page}
                    onPageChange={onPageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToggleModel
        open={open}
        setOpen={setOpen}
        status={status}
        id={statusid}
        refetch={refetch}
        setMerchantData={setUserData}
        merchantData={userData}
      />
      {isFetching && <Spinner />}
    </>
  );
}
