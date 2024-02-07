import * as React from "react";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../utils/Pagination.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AdminList } from "../../../api/admin/admin";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";

import {
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ToggleModel from "../ToggleModel/ToggleModel";
import { cloneDeep, debounce, range } from "lodash";
import Spinner from "../../../utils/Spinner";
import DateRangePicker from "../../../utils/DateRangePicker";

export function SubjectTable() {
  const navigate = useNavigate();
  const [adminData, setadminData] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [statusid, setStatusid] = useState("");
  const [filterDate, setFilterDate] = useState("Filter");
  const [rangeStart, setRangeStart] = useState<Date | null | undefined | any>();
  const defaultEndDate = new Date();
  // defaultEndDate.setDate(defaultEndDate.getDate() + 1);
  const [rangeEnd, setRangeEnd] = useState<Date | null | undefined | any>();
  const [open, setOpen] = useState<boolean>(false);
  const [filterStartDate, setFilterStartDate] = useState<any>("");
  const [filterEndDate, setFilterEndDate] = useState<any>("");

  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [IsLastNameSort, setIsLastNameSort] = useState<boolean>(false);

  const [IsLastActionSort, setIsLastActionSort] = useState<boolean>(false);
  const [IsStatusSort, setIsStatusSort] = useState<boolean>(false);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("updatedAt");

  const per_page = 10;

  const [filterData, setFilterData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    status: "ALL",
  });

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  useEffect(() => {
    setcurrent_page(1);
  }, [filterData]);

  const clearSearchdate = () => {
    setFilterDate("Filter");
    setFilterEndDate("");
    setFilterStartDate("");
    refechData();
  };

  const dateConverter = {
    startDate: () => {
      return filterStartDate
        ? new Date(
            moment(filterStartDate).utc(filterStartDate).valueOf()
          ).toISOString()
        : "";
    },
    endDate: () => {
      return filterEndDate
        ? new Date(
            moment(filterEndDate).utc(filterEndDate).valueOf()
          ).toISOString()
        : "";
    },
  };

  const selectEndDate = (d: any) => {
    setRangeEnd(d);
    let newDate: Date;
    newDate = new Date(d);
    newDate.setHours(23, 59, 59, 999);
    setFilterEndDate(newDate.toISOString());
    let startNewDate = new Date();
    let FirstDate = filterDate.split("to")[0];
    FirstDate === "Filter" ? "" : FirstDate;
    const EndDate =
      d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();

    if (FirstDate === "Filter") {
      setFilterStartDate(startNewDate.toISOString());
      setFilterDate(
        startNewDate.getUTCDate() +
          "/" +
          (startNewDate.getUTCMonth() + 1) +
          "/" +
          startNewDate.getUTCFullYear() +
          " to " +
          EndDate
      );
    } else {
      setFilterDate(FirstDate + " to " + EndDate);
    }

    refechData();
  };

  // const selectStartDate = (d: any) => {
  //   let newDate: Date;
  //   newDate = new Date(d);
  //   newDate.setHours(0, 0, 0, 0);
  //   setFilterStartDate(newDate.toISOString());
  //   setRangeStart(d);
  //   const StartDate =
  //     d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
  //   setFilterDate(StartDate + " to ");
  // };

  const pageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    filterFefechData();
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  // const DateFilter = () => {
  //   setSortType(sortType === "asc" ? "desc" : "asc");
  //   setSortBy("updatedAt");
  //   setIsLastActionSort(!IsLastActionSort);
  //   refechData();
  // };

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const onStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const refechData = React.useCallback(
    debounce(() => refetch(), 200),
    []
  );
  const filterFefechData = React.useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const StatusHandle = (data: any) => {
    setStatusid(data.id);
    data.status === "ACTIVE" ? setStatus("INACTIVE") : setStatus("ACTIVE");
    setOpen(!open);
  };

  const viewClicked = (item: any) => {
    navigate(`/admin/list/${item.id}`, { state: item });
  };

  const {
    dataUpdatedAt,
    error,
    isError,
    isLoading,
    isFetched,
    isFetching,
    refetch,
  } = useQuery(
    ["getAdmin"],
    () =>
      AdminList({
        firstName: filterData.firstName,
        lastName: filterData.lastName,
        role: filterData.role,
        status: filterData.status,
        current_page,
        per_page,
        sortBy,
        sortType,
        fromDate: rangeStart
          ? new Date(moment(rangeStart).utc(rangeStart).valueOf()).toISOString()
          : "",
        toDate: rangeEnd
          ? new Date(moment(rangeEnd).utc(rangeEnd).valueOf()).toISOString()
          : "",
      }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          setadminData(data?.data);
          setperPageCount(data?.data.length);

          settotal(data.pagination.total);
          setlast_page(data.pagination.last_page);
          setcurrent_page(data.pagination.current_page);
        }
      },
    }
  );
  
  useEffect(() => {
    refechData();
  }, [rangeEnd]);

  return (
    <div
      className={`px-4 sm:px-6 pb-[90px] lg:px-8 bg-background_grey ${
        adminData.length && "animate-blinking"
      }`}
    >
      <div className="sm:flex block justify-between items-center py-5 ">
        <h1 className="text-2xl font-semibold text-font_black">
          Admin Management
        </h1>
        <Link
          to="/admin/add"
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New Admin
        </Link>
      </div>
      {(!isFetching || isFetched) && (
        <div className="border-table_border border-2 md:rounded-lg shadow-lg">
          <div className="relative bg-white overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
            <table className="w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-6 text-left text-xs font-medium min-w-[160px] w-[160px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="first_name"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        first Name
                      </label>
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
                    <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                      <input
                        onChange={pageFilter}
                        value={filterData.firstName}
                        id="first_name"
                        name="firstName"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.firstName && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("firstName")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium  min-w-[160px] w-[160px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="last_name"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        last Name
                      </label>
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

                    <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.lastName}
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.lastName && (
                        <XMarkIcon
                          onClick={() => clearSearch("lastName")}
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        role
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("role")}
                        >
                          {sortBy === "role" ? (
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

                    <div className="flex py-2 text-font_black px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.role}
                        id="role"
                        type="text"
                        name="role"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.role && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("role")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[220px] w-[220px]"
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="last_action"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          last action time
                        </label>
                        <span>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("updatedAt")}
                          >
                            {sortBy === "updatedAt" ? (
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

                      <DateRangePicker
                        rangeStart={rangeStart}
                        setRangeStart={setRangeStart}
                        rangeEnd={rangeEnd}
                        setRangeEnd={setRangeEnd}
                        titlePlaceholder={"Filter"}
                        color="black"
                        StartPlaceholder={`${moment(defaultEndDate)
                          .utc()
                          .format("DD/MM/YYYY")}`}
                        EndPlaceholder={`${moment(defaultEndDate)
                          .utc()
                          .format("DD/MM/YYYY")}`}
                        svgicon={true}
                        // position={"-right-40"}
                        ExtraCss={
                          "group w-full border border-grey_border_table text-font_black py-2 px-[13px] bg-grey_bg text-base font-medium "
                        }
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[130px] w-[130px]"
                  >
                    <div>
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="Status"
                          className="font-Inter text-table_head_color"
                        >
                          STATUS
                        </label>
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
                      <select
                        onChange={(e: any) => onStatus(e)}
                        id="Status"
                        name="status"
                        className={`bg-transparent border ${
                          filterData?.status !== "ALL"
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="ALL">Filter</option>
                        <option value={"ACTIVE"}>Active</option>
                        <option value={"INACTIVE"}>Inactive</option>
                      </select>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium w-full sticky right-0"
                  >
                    <a href="#" className="sr-only">
                      view
                    </a>
                  </th>
                </tr>
              </thead>

              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {adminData.map((service, index) => {
                  const formatedDate = moment(service?.updatedAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );

                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-6 ">
                        {service?.firstName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                        {service?.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {service?.role?.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {formatedDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          onClick={(e) => StatusHandle(service)}
                          className={`${
                            service?.status === "ACTIVE"
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {service.status === "ACTIVE" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap  text-blue_primary text-sm font-medium p-0 text-end sticky right-0 w-full">
                        <p
                          className="cursor-pointer bg-white py-4 px-6"
                          onClick={() => {
                            viewClicked(service);
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

            {!isFetching && !adminData.length && (
              <div className="flex justify-center items-center min-h-[50vh]">
                <p className="flex justify-center">No Result Found</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center flex-wrap justify-center bg-white px-4 py-3 md:rounded-b-lg shadow-lg border-t border-grey_border_table font-Inter">
            <div className="justify-between sm:hidden">
              <a
                onClick={() => onPageCall(current_page - 1)}
                className="relative cursor-pointer inline-flex items-center rounded-md border border-grey_border_table bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                onClick={() => onPageCall(current_page + 1)}
                className="relative cursor-pointer ml-3 inline-flex items-center rounded-md border border-grey_border_table bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            {adminData.length > 0 && (
              <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-table_head_color font-normal">
                    Showing
                    <span className=""> {current_page * 10 - 10 + 1} </span>
                    to{" "}
                    <span className="">
                      {" "}
                      {current_page * 10 + perPageCount - 10}{" "}
                    </span>{" "}
                    of
                    <span className=""> {total} </span> results
                  </p>
                </div>
                <div className="hidden sm:block">
                  <Pagination
                    last_page={last_page}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isFetching && <Spinner />}
      <ToggleModel
        open={open}
        setOpen={setOpen}
        status={status}
        id={statusid}
        refetch={refetch}
        setadminData={setadminData}
        adminData={adminData}
      />
    </div>
  );
}
