import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "../../../utils/Pagination.css";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Outlet, useNavigate } from "react-router-dom";
import Merchant from "../MarchantNav/Merchant";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../../utils/Pagination";
import { UserList } from "../../../api/merchant/user";
import { debounce } from "lodash";
import Spinner from "../../../utils/Spinner";
import "react-datepicker/dist/react-datepicker.css";
import { flagArray } from "../../../Components/Flags";
import moment from "moment";
import ToggleModel from "./ToggleModel/ToggleModel";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import DateRangePicker from "../../../utils/DateRangePicker";
export function UserTable() {
  const [Mar, setMar] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [hidden, setHidden] = useState(true);
  const [filterDate, setFilterDate] = useState("Filter");
  const [rangeStart, setRangeStart] = useState<Date | null | undefined | any>();
  const [rangeEnd, setRangeEnd] = useState<Date | null | undefined | any>();
  const [open, setOpen] = useState<boolean>(false);
  const [filterStartDate, setFilterStartDate] = useState<any>("");
  const [statusid, setStatusid] = useState("");
  const [filterEndDate, setFilterEndDate] = useState<any>("");
  const [status, setStatus] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isStatusSort, setIsStatusSort] = useState(false);
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    name: "",
    country: "",
    status: "ALL",
  });

  useEffect(() => {
    setcurrent_page(1);
  }, [filterData]);

  const pageFilter = (e: any) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    reFetchData();
  };

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };
  const per_page = 10;

  const { isFetching, isFetched, refetch } = useQuery(
    ["getUser"],
    () =>
      UserList({
        ...filterData,
        sortBy,
        sortType,
        current_page,
        per_page,
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
          setTableData(data?.data);
          setperPageCount(data?.data.length);

          settotal(data.pagination.total);
          setlast_page(data.pagination.last_page);
          setcurrent_page(data.pagination.current_page);
        }
      },
    }
  );

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  useEffect(() => {
    refechData();
  }, [rangeStart && rangeEnd]);

  const refechData = useCallback(
    debounce(() => refetch(), 200),
    []
  );

  const reFetchData = useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  // const clearSearchdate = () => {
  //   setFilterDate("Filter");
  //   setFilterEndDate("");
  //   setFilterStartDate("");
  //   setHidden(true);
  //   refechData();
  // };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
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

  const StatusHandle = (data: any) => {
    setStatusid(data.id);
    data.status === "ACTIVE" ? setStatus("INACTIVE") : setStatus("ACTIVE");
    setOpen(!open);
  };

  // const selectEndDate = (d: any) => {
  //   setRangeEnd(d);
  //   let newDate: Date;
  //   newDate = new Date(d);
  //   newDate.setHours(23, 59, 59, 999);
  //   setFilterEndDate(newDate.toISOString());
  //   let startNewDate = new Date();
  //   let FirstDate = filterDate.split("to")[0];

  //   const EndDate =
  //     d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
  //   if (FirstDate === "Filter") {
  //     setFilterStartDate(startNewDate.toISOString());
  //     setFilterDate(
  //       startNewDate.getUTCDate() +
  //         "/" +
  //         (startNewDate.getUTCMonth() + 1) +
  //         "/" +
  //         startNewDate.getUTCFullYear() +
  //         " to " +
  //         EndDate
  //     );
  //   } else {
  //     setFilterDate(FirstDate + " to " + EndDate);
  //   }
  //   refechData();
  // };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  return (
    <>
      <div
        className={`px-4 sm:px-6 lg:px-8 pb-[90px] bg-background_grey ${
          isFetched && "animate-blinking"
        }`}
      >
        <div className="flex justify-between items-center py-5 ">
          <h1 className="text-2xl font-semibold text-font_black">User</h1>
          <a
            onClick={() => navigate("/user/add")}
            className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
          >
            + New User
          </a>
        </div>

        {!Mar && (!isFetching || isFetched) && (
          <div className="border-table_border border-1 md:rounded-lg shadow-lg">
            <div className="relative bg-white overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
              <table className="w-full divide-y divide-table_border">
                <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[160px] w-[160px]"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="first_name"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          MERCHANT
                        </label>
                        <span>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("merchant")}
                          >
                            {sortBy === "merchant" ? (
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
                          value={filterData.name}
                          id="name"
                          name="name"
                          placeholder="Search"
                          className="w-full focus:outline-none bg-transparent"
                        />
                        {filterData.name && (
                          <XMarkIcon
                            className="w-4 h-4"
                            onClick={() => clearSearch("name")}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[160px] w-[160px]"
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
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[160px] w-[160px]"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="first_name"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          LAST NAME
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
                      <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                        <input
                          onChange={pageFilter}
                          value={filterData.lastName}
                          id="lastName"
                          name="lastName"
                          placeholder="Search"
                          className="w-full focus:outline-none bg-transparent"
                        />
                        {filterData.lastName && (
                          <XMarkIcon
                            className="w-4 h-4"
                            onClick={() => clearSearch("lastName")}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[120px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="email"
                            className="font-Inter text-table_head_color"
                          >
                            EMAIL
                          </label>
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
                      </div>
                      <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                        <input
                          onChange={pageFilter}
                          value={filterData.email}
                          id="email"
                          name="email"
                          placeholder="Search"
                          className="w-full focus:outline-none bg-transparent"
                        />
                        {filterData.email && (
                          <XMarkIcon
                            className="w-4 h-4"
                            onClick={() => clearSearch("email")}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[160px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="service_lane"
                            className="font-Inter text-table_head_color"
                          >
                            PHONE
                          </label>
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
                        <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                          <input
                            onChange={pageFilter}
                            value={filterData.phone}
                            id="phone"
                            name="phone"
                            placeholder="Search"
                            className="w-full focus:outline-none bg-transparent"
                          />
                          {filterData.phone && (
                            <XMarkIcon
                              className="w-4 h-4"
                              onClick={() => clearSearch("phone")}
                            />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[120px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="country"
                            className="font-Inter text-table_head_color"
                          >
                            COUNTRY
                          </label>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("country")}
                            >
                              {sortBy === "country" ? (
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
                        <div className="relative group">
                          <select
                            id="country"
                            name="country"
                            onChange={pageFilter}
                            value={filterData.country}
                            className={`bg-transparent border ${
                              filterData.country
                                ? "text-font_black"
                                : "text-grey_border"
                            } active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                          >
                            <option value="">Filter</option>
                            {flagArray.map((flag, index) => (
                              <option value={flag.country}>
                                {flag.country}
                              </option>
                            ))}
                          </select>
                          {filterData?.country && (
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3.5 right-4 opacity-0 group-hover:opacity-100"
                              onClick={(x) => (
                                setFilterData({ ...filterData, country: "" }),
                                reFetchData()
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[160px] w-[180px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="create_date"
                            className="font-Inter text-table_head_color"
                          >
                            LAST LOGIN
                          </label>
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
                      </div>
                      {/* <div className="flex justify-between bg-transparent border text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none"> */}

                      {/* <div
                        className="flex justify-between bg-transparent border text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary
                       rounded-md border-grey_border_table mt-1 py-2 pl-3 pr-3 focus:outline-none relative w-[130px] whitespace-nowrap"
                      >
                        <svg
                          width="8"
                          height="6"
                          viewBox="0 0 8 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => setHidden(!hidden)}
                          className="w-[14px] cursor-pointer absolute right-2 top-[13px] stroke-2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.234314 0.833924C0.546733 0.521505 1.05326 0.521505 1.36568 0.833924L3.99999 3.46824L6.6343 0.833924C6.94672 0.521505 7.45325 0.521505 7.76567 0.833924C8.07809 1.14634 8.07809 1.65288 7.76567 1.96529L4.56568 5.16529C4.25326 5.47771 3.74673 5.47771 3.43431 5.16529L0.234314 1.96529C-0.0781048 1.65288 -0.0781048 1.14634 0.234314 0.833924Z"
                            fill="#6B7B80"
                          />
                        </svg>

                        <div
                          onClick={() => setHidden(!hidden)}
                          className={`w-full h-full inline-block overflow-hidden text-ellipsis ${
                            filterDate == "Filter" ? "" : "text-font_black"
                          }`}
                        >
                          {filterDate}
                        </div>

                        {!(filterDate === "Filter") && (
                          <XMarkIcon
                            className="w-4 h-4"
                            onClick={clearSearchdate}
                          />
                        )}
                      </div> */}

                      {/* <div
                        className={` flex gap-4 bg-white rounded-md absolute p-4 z-10 calender_class shadow-md ${
                          hidden && "hidden"
                        }`}
                      >
                        <DatePicker
                          selectsStart
                          selected={rangeStart}
                          startDate={rangeStart}
                          endDate={rangeEnd}
                          maxDate={rangeEnd}
                          onChange={(e) => selectStartDate(e)}
                        />

                        <span className="flex items-center">to</span>
                        <DatePicker
                          selectsEnd
                          selected={rangeEnd}
                          startDate={rangeStart}
                          endDate={rangeEnd}
                          minDate={rangeStart}
                          maxDate={new Date()}
                          onChange={(e) => (
                            setHidden(!hidden), selectEndDate(e)
                          )}
                        />
                      </div> */}
                      <DateRangePicker
                        color={"text-font_black"}
                        rangeStart={rangeStart}
                        setRangeStart={setRangeStart}
                        rangeEnd={rangeEnd}
                        setRangeEnd={setRangeEnd}
                        titlePlaceholder={"Filter"}
                        StartPlaceholder={"Start"}
                        EndPlaceholder={"End"}
                        svgicon={true}
                        position={"-right-80"}
                        ExtraCss={
                          "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black mt-0.5 px-3 py-[7.8px] bg-grey_bg text-base font-medium "
                        }
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[120px] w-[140px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div className="relative">
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="Status"
                            className="font-Inter text-table_head_color"
                          >
                            STATUS
                          </label>
                          <a
                            onClick={() => (
                              setIsStatusSort(!isStatusSort), onSort("status")
                            )}
                          >
                            {isStatusSort ? (
                              <ChevronUpIcon className="w-3 cursor-pointer" />
                            ) : (
                              <ChevronDownIcon className="w-3 cursor-pointer" />
                            )}
                          </a>
                        </div>
                        <select
                          id="Status"
                          name="status"
                          onChange={pageFilter}
                          className={`bg-transparent border ${
                            filterData?.status !== "ALL"
                              ? "text-font_black"
                              : "text-grey_border"
                          } active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                        >
                          {/* <option>Filter</option> */}
                          <option value="ALL">Filter</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>

                        {filterData?.status !== "ALL" && (
                          <XMarkIcon
                            className="w-4 h-4 absolute top-10 right-5 group-hover:opacity-100"
                            onClick={(x) => (
                              setFilterData({
                                ...filterData,
                                status: "ALL",
                              }),
                              reFetchData()
                            )}
                          />
                        )}

                        {/* {filterData?.status && (
                          <XMarkIcon
                            className="w-4 h-4 absolute top-3.5 right-4 opacity-0 group-hover:opacity-100"
                            onClick={(x) => (
                              setFilterData({ ...filterData, status: "ALL" }),
                              reFetchData()
                            )}
                          />
                        )} */}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 w-full sticky right-[0px] min-w-[100%] bg-grey_bg max-w-[100%]"
                    >
                      <a className="sr-only">view</a>
                    </th>
                  </tr>
                </thead>

                <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                  {tableData.map((tData, index) => {
                    const formatedDate = tData.lastLogin
                      ? moment(tData?.lastLogin).format("DD/MM/YYYY HH:mm:ss")
                      : null;
                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-6 text-ellipsis overflow-hidden max-w-[250px]">
                          {tData?.merchant.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 lg:table-cell text-ellipsis overflow-hidden max-w-[250px]">
                          {tData?.firstName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell text-ellipsis overflow-hidden max-w-[250px]">
                          {tData?.lastName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell text-ellipsis overflow-hidden max-w-[250px]">
                          {tData?.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {` +${tData?.phoneCode} ${tData?.phoneNo}`}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData?.merchant.country}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {formatedDate}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          <span
                            onClick={(e) => StatusHandle(tData)}
                            className={`${
                              tData?.status === "ACTIVE"
                                ? "text-font_green bg-light_geen"
                                : "text-Incative_red bg-light_red"
                            } rounded-full px-3 py-1 text-xs font-medium cursor-pointer`}
                          >
                            {tData?.status === "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* <td className="whitespace-nowrap py-4 px-3 text-right text-blue_primary text-sm font-medium bg-white">
                          <a>
                            {tData?.view}
                            <span className="sr-only">, {tData?.view}</span>
                          </a>
                        </td> */}

                        <td className="whitespace-nowrap  text-blue_primary text-sm font-medium  text-end sticky right-0 p-0 w-full">
                          <p
                            className="cursor-pointer py-4 px-6 bg-white"
                            onClick={() => {
                              navigate(`/user/list/${tData.id}`, {
                                state: tData,
                              });
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

              {!isFetching && !tableData.length && (
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
              {tableData.length > 0 && (
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

        {Mar && <Merchant />}
      </div>
      {isFetching && <Spinner />}
      <Outlet />
      <ToggleModel
        open={open}
        setOpen={setOpen}
        status={status}
        id={statusid}
        refetch={refetch}
        setMerchantData={setTableData}
        merchantData={tableData}
      />
    </>
  );
}
