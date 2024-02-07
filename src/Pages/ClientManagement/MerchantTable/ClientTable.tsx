import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../utils/Pagination.css";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Outlet, useNavigate } from "react-router-dom";
import Merchant from "../MarchantNav/Merchant";
import { useQuery } from "@tanstack/react-query";
import { MerchantList, MerchantType } from "../../../api/merchant/merchant";
import Pagination from "../../../utils/Pagination";
import { debounce } from "lodash";
import Spinner from "../../../utils/Spinner";
import ToggleModel from "../ToggleModel/ToggleModel";
import { flagArray } from "../../../Components/Flags";
import moment from "moment";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import DateRangePicker from "../../../utils/DateRangePicker";

export function ClientTable() {
  const wrapperRef = useRef(null);
  const [Mar, setMar] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [hidden, setHidden] = useState(true);
  const [filterDate, setFilterDate] = useState("Filter");
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [statusid, setStatusid] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [creditPeriod, setCreditPeriod] = useState<any[]>([]);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isStatusSort, setIsStatusSort] = useState(false);
  const [merchantType, setMerchantType] = useState<any[]>([]);
  const [createdBy, setCreatedBy] = useState<any[]>([]);
  const [isCreatedBySort, setIsCreatedBySort] = useState(false);
  const [createdAtfromDate, setCreatedAtfromDate] = useState<
    Date | null | undefined | any
  >();
  const [createdAttoDate, setCreatedAttoDate] = useState<
    Date | null | undefined | any
  >();
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState<any>({
    name: "",
    merchantCode: "",
    type: "",
    country: "",
    preferredServiceLane: "",
    createdBy: "",
    creditPeriod: "",
    status: "ALL",
  });

  const pageFilter = (e: any) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    reFetchData();
  };

  useEffect(() => {
    setcurrent_page(1);
  }, [filterData]);

  useEffect(() => {
    refechData();
  }, [createdAtfromDate && createdAttoDate]);

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, false);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, false);
  //   };
  // }, []);

  const handleClickOutside = (event: any) => {
    if (event.target.closest("#dateDiv, #dateArea, .react-datepicker")) return;
    else {
      setHidden(true);
    }
  };
  const per_page = 10;

  const {
    dataUpdatedAt,
    error,
    isError,
    isLoading,
    isFetched,
    isFetching,
    refetch,
  } = useQuery(
    ["getMerchant"],
    () =>
      MerchantList({
        name: filterData.name,
        merchantCode: filterData.merchantCode,
        type: filterData.type,
        country: filterData.country,
        // preferredServiceLane: filterData.preferredServiceLane,
        createdBy: filterData.createdBy,
        creditPeriod: String(filterData.creditPeriod) || "",
        fromDate: createdAtfromDate
          ? new Date(
              moment(createdAtfromDate).utc(createdAtfromDate).valueOf()
            ).toISOString()
          : "",
        toDate: createdAttoDate
          ? new Date(
              moment(createdAttoDate).utc(createdAttoDate).valueOf()
            ).toISOString()
          : "",
        status: filterData.status,
        current_page: current_page,
        per_page: per_page,
        sortBy: sortBy,
        sortType: sortType,
      }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          setTableData(data?.data);
          setperPageCount(data.data.length);

          settotal(data.pagination.total);
          setlast_page(data.pagination.last_page);
          setcurrent_page(data.pagination.current_page);
        }
      },
    }
  );

  const {
    data,
    isError: Iserror_Merchant,
    isLoading: loading_Merchant,
    isFetching: fetch_Merchant,
    refetch: Merchant_Type,
  } = useQuery(["MerchantType"], () => MerchantType(), {
    keepPreviousData: true,
    onSuccess(data: any) {
      if (data.status) {
        setMerchantType(data?.data.types);
        setCreatedBy(data?.data.createdBy);
        setCreditPeriod(data?.data.creditPeriod);
      }
    },
  });

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const refechData = useCallback(
    debounce(() => refetch(), 100),
    []
  );

  const reFetchData = useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const StatusHandle = (data: any) => {
    setStatusid(data.id);
    data.status === "ACTIVE" ? setStatus("INACTIVE") : setStatus("ACTIVE");
    setOpen(!open);
  };

  const viewClicked = (item: any) => {
    navigate(`/merchant/list/${item.id}`, { state: item });
  };

  return (
    <>
      <div
        className={`px-4 sm:px-6 lg:px-8 pb-[90px] bg-background_grey z-0 ${
          isFetched && "animate-blinking"
        }`}
      >
        <div className="flex justify-between items-center py-5 ">
          <h1 className={`text-2xl font-semibold text-font_black`}>Merchant</h1>
          <a
            onClick={() => navigate("/merchant/add")}
            className={`text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary ${
              isFetching && "animate-blinking"
            }`}
          >
            + New Merchant
          </a>
        </div>

        {!Mar && (!isFetching || isFetched) && (
          <div className="border-table_border border-1 md:rounded-lg shadow-lg">
            <div className="relative overflow-auto bg-white sm:min-h-[65vh] 2xl:min-h-[15vh]">
              {/* {!isFetching && */}
              <table className="w-full divide-y divide-table_border">
                <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                  <tr>
                    <th
                      scope="col"
                      className="min-w-[100px] w-[100px] py-3.5 pl-4 pr-3 text-left text-xs font-medium"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="company_name"
                          className="font-Inter text-table_head_color"
                        >
                          NAME
                        </label>

                        <span>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("name")}
                          >
                            {sortBy === "name" ? (
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
                          className="w-full text-font_black focus:outline-none bg-transparent"
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
                      className="min-w-[160px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="merchant"
                          className="font-Inter text-table_head_color"
                        >
                          MERCHANT CODE
                        </label>
                        <span>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("merchantCode")}
                          >
                            {sortBy === "merchantCode" ? (
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
                          value={filterData.merchantCode}
                          id="merchantCode"
                          name="merchantCode"
                          placeholder="Search"
                          className="w-full text-font_black focus:outline-none bg-transparent"
                        />
                        {filterData.merchantCode && (
                          <XMarkIcon
                            className="w-4 h-4"
                            onClick={() => clearSearch("merchantCode")}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[140px] w-[150px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="type"
                            className="font-Inter text-table_head_color"
                          >
                            TYPE
                          </label>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("type")}
                            >
                              {sortBy === "type" ? (
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
                            id="type"
                            name="type"
                            onChange={pageFilter}
                            value={filterData.type}
                            className={`bg-transparent border ${
                              filterData.type
                                ? "text-font_black"
                                : "first:text-grey_border"
                            } active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none text-xs`}
                          >
                            <option value={""}>Filter</option>
                            {merchantType.map((type, index) => (
                              <option
                                key={index}
                                className="px-1 f-2"
                                value={`${type}`}
                              >
                                {type === "DirectCustomer"
                                  ? "Direct Customer"
                                  : type}
                              </option>
                            ))}
                          </select>
                          {filterData?.type && (
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3.5 right-5 opacity-0 group-hover:opacity-100"
                              onClick={(x) => (
                                setFilterData({ ...filterData, type: "" }),
                                reFetchData()
                              )}
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
                            }  active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                          >
                            <option value="">Filter</option>
                            {flagArray.map((flag, index) => (
                              <option key={index} value={flag.country}>
                                {flag.country}
                              </option>
                            ))}
                          </select>
                          {filterData?.country && (
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3.5  right-5 opacity-0 group-hover:opacity-100"
                              onClick={(x) => (
                                setFilterData({ ...filterData, country: "" }),
                                reFetchData()
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </th>
                    {/* <th
                      scope="col"
                      className="min-w-[160px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="service_lane"
                            className="font-Inter text-table_head_color"
                          >
                            SERVICE LANE
                          </label>
                          <span>
                            <a
                              onClick={() => onSort("npreferredServiceLaneame")}
                            >
                              {sortBy === "preferredServiceLane" ? (
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
                          </span>
                        </div>
                        <select
                          id="service_lane"
                          name="preferredServiceLane"
                          onChange={pageFilter}
                          // value={filterData.preferredServiceLane}
                          className="bg-transparent border text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none"
                          defaultValue="filter"
                        >
                          <option>Filter</option>
                          <option value="Service lane 1">Service lane 1</option>
                          <option value="Service lane 1">Service lane 2</option>
                        </select>
                      </div>
                    </th> */}
                    {/* <th
                      scope="col"
                      className="min-w-[200px] w-[200px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="last_ship"
                            className="font-Inter text-table_head_color"
                          >
                            LAST SHIPMENT
                          </label>
                          <span>
                            <a>
                              <ChevronUpIcon className="w-2" />
                            </a>
                            <a>
                              <ChevronDownIcon className="w-2" />{" "}
                            </a>
                          </span>
                        </div>
                        <input
                          id="last_ship"
                          name="last shipment"
                          type="text"
                          className="bg-transparent border text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none"
                          ref={lastShipRef}
                        />
                      </div>
                    </th> */}

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
                            CREATED ON
                          </label>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("createdAt")}
                            >
                              {sortBy === "createdAt" ? (
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

                      <DateRangePicker
                        color={"text-font_black"}
                        rangeStart={createdAtfromDate}
                        setRangeStart={setCreatedAtfromDate}
                        rangeEnd={createdAttoDate}
                        setRangeEnd={setCreatedAttoDate}
                        titlePlaceholder={"Filter"}
                        StartPlaceholder={"Start"}
                        EndPlaceholder={"End"}
                        svgicon={true}
                        // position={"-right-40"}
                        ExtraCss={
                          "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black mt-0.5 px-3 py-[7.8px] bg-grey_bg text-base font-medium "
                        }
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[160px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="create_by"
                            className="font-Inter text-table_head_color"
                          >
                            CREATED BY
                          </label>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("createdBy")}
                            >
                              {sortBy === "createdBy" ? (
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
                            id="create_by"
                            name="createdBy"
                            onChange={pageFilter}
                            value={filterData.createdBy}
                            className={`bg-transparent border ${
                              filterData.createdBy
                                ? "text-font_black"
                                : "text-grey_border"
                            } active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                          >
                            <option value={""}>Filter</option>
                            {createdBy.map((createdby, index) => (
                              <option key={index} value={createdby.firstName}>
                                {createdby.firstName}
                              </option>
                            ))}
                          </select>
                          {filterData?.createdBy && (
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3.5 right-5 opacity-0 group-hover:opacity-100"
                              onClick={(x) => (
                                setFilterData({
                                  ...filterData,
                                  createdBy: "",
                                }),
                                reFetchData()
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="min-w-[160px] w-[160px] px-3 py-3.5 text-left text-xs font-medium"
                    >
                      <div>
                        <div className="flex items-center gap-2 pb-2">
                          <label
                            htmlFor="CREDIT TERM"
                            className="font-Inter text-table_head_color"
                          >
                            CREDIT TERM
                          </label>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("creditPeriod")}
                          >
                            {sortBy === "creditPeriod" ? (
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
                        </div>
                        <div className="relative group">
                          <select
                            id="credit"
                            name="creditPeriod"
                            onChange={pageFilter}
                            value={filterData.creditPeriod}
                            className={`bg-transparent border ${
                              filterData.creditPeriod
                                ? "text-font_black"
                                : "text-grey_border"
                            } active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                          >
                            <option value={""}>Filter</option>
                            {creditPeriod.map((data, index) => (
                              <option key={index} value={data}>
                                {data} Days
                              </option>
                            ))}
                          </select>
                          {filterData?.creditPeriod && (
                            <XMarkIcon
                              className="w-4 h-4 absolute top-3.5 right-5 opacity-0 group-hover:opacity-100"
                              onClick={(x) => (
                                setFilterData({
                                  ...filterData,
                                  creditPeriod: "",
                                }),
                                reFetchData()
                              )}
                            />
                          )}
                        </div>
                      </div>
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
                        </div>

                        <select
                          id="Status"
                          name="status"
                          onChange={pageFilter}
                          value={filterData?.status}
                          className={`bg-transparent border ${
                            filterData?.status !== "ALL"
                              ? "text-font_black"
                              : "text-grey_border"
                          } active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none`}
                          // className="bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1 w-full py-2 pl-3 pr-3 focus:outline-none"
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
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 w-full sticky right-[0px] min-w-[100%] max-w-[100%] bg-grey_bg text-end"
                    >
                      <a className="sr-only">view</a>
                    </th>
                  </tr>
                </thead>

                <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                  {tableData.map((tData, index) => {
                    const formatedDate = moment(tData?.createdOn).format(
                      "DD/MM/YYYY HH:mm:ss"
                    );
                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 px-6">
                          {tData.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                          {tData.merchantCode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.type}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.country}
                        </td>
                        {/* <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.preferredServiceLane}
                        </td> */}
                        {/* <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.last_ship}
                        </td> */}
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {formatedDate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.createdBy.firstName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          {tData.creditPeriod} days
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                          <span
                            onClick={(e) => StatusHandle(tData)}
                            className={`${
                              tData?.status === "ACTIVE"
                                ? "text-font_green bg-light_geen"
                                : "text-Incative_red bg-light_red"
                            } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                          >
                            {tData.status === "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* <td className="whitespace-nowrap py-4 px-3 text-right text-blue_primary text-sm font-medium bg-white">
                          <a>
                            {tData.view}
                            <span className="pr-2">{tData.view}</span>
                          </a>
                        </td> */}

                        <td className="whitespace-nowrap text-blue_primary text-sm font-medium text-end sticky right-0 p-0 w-full">
                          <p
                            className="cursor-pointer bg-white py-4 px-6"
                            onClick={() => {
                              viewClicked(tData);
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
              {/* } */}
              {!tableData.length && (
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
      {/* </motion.div> */}

      {/* )} */}
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
