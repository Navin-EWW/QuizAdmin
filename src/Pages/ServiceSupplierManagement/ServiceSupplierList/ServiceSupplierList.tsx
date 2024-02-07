import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { SupplierOrderFilter } from "../../../api/bulkSupplierOrder/bulkSupplierOrder";
import { ServiceSupplierapiList } from "../../../api/serviceSupplier/serviceSupplier";
import { ServiceSupplierType } from "../../../types/order";
import DateRangePicker from "../../../utils/DateRangePicker";
import Spinner from "../../../utils/Spinner";
import { TypeTableData, filterType } from "../../../types/routingRule";
import { useQuery } from "@tanstack/react-query";

export function ServiceSupplierList() {
  const navigate = useNavigate();
  const [serviceSupplierData, setserviceSupplierData] = useState<
    TypeTableData[]
  >([]);

  const [createdAtfromDate, setCreatedAtfromDate] = useState<
    Date | null | undefined | any
  >();
  const [createdAttoDate, setCreatedAttoDate] = useState<
    Date | null | undefined | any
  >();

  const [serviceSupplierFilter, setserviceSupplierFilter] =
    useState<ServiceSupplierType[]>();

  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);

  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");

  const [filterData, setFilterData] = useState<filterType>({
    name: "",
    apiEnable: "",
    firstMile: "",
    internationalMile: "",
    lastMile: "",
    createdAt: "",
    operatingRegions: "",
  });

  const { error, isFetching, isError, isFetched, isLoading, refetch } =
    useQuery(
      ["ServiceSupplierapi"],
      () =>
        ServiceSupplierapiList({
          page: current_page,
          per_page: perPageCount,
          sortBy: sortBy,
          sortType: sortType,
          ...filterData,
          toDate: createdAttoDate
            ? new Date(
                moment(createdAttoDate).utc(createdAttoDate).valueOf()
              ).toISOString()
            : "",
          fromDate: createdAtfromDate
            ? new Date(
                moment(createdAtfromDate).utc(createdAtfromDate).valueOf()
              ).toISOString()
            : "",
        }),
      {
        keepPreviousData: true,
        onSuccess(data) {
          if (data?.status) {
            setserviceSupplierData(data.data);
            settotal(data.pagination?.total);
            setlast_page(data.pagination?.last_page);
          }
        },
      }
    );

  useQuery(["SupplierOrderFilter"], () => SupplierOrderFilter(), {
    keepPreviousData: true,
    onSuccess(data) {
      if (data.status) {
        setserviceSupplierFilter(data.data.serviceSupplier);
      }
    },
  });

  useEffect(() => {
    refechData();
  }, [createdAttoDate]);

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  useEffect(() => {
    setcurrent_page(1);
  }, [filterData]);

  const pageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    refechData();
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
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

  const viewClicked = (item: any) => {
    // navigate(`/admin/list/${item.id}`, { state: item });
    navigate(`/service-supplier/list/${item.id}`, { state: "" });
  };

  return (
    <div
      className={`px-4 sm:px-6 pb-[90px] lg:px-8 bg-background_grey ${
        serviceSupplierData.length && "animate-blinking"
      }`}
    >
      <div className="sm:flex block justify-between items-center py-5 ">
        <h1 className="text-2xl font-semibold text-font_black">
          Service supplier
        </h1>
        <Link
          to="/service-supplier/add"
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New supplier
        </Link>
      </div>
      {(!isFetching || isFetched) && (
        <div className="border-table_border border-2 md:rounded-lg shadow-header">
          <div className="relative overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
            <table className="w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium w-1/4 min-w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2 min-w-[138px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Service Supplier
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
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        id="name"
                        name="name"
                        value={
                          filterData?.name?.trim()?.length > 40
                            ? ` ${filterData?.name?.trim().slice(0, 40)}...`
                            : filterData?.name?.trim()
                        }
                        className={`bg-transparent border ${
                          filterData?.name !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="">Filter</option>
                        {serviceSupplierFilter?.map((item: any, index) => {
                          let name =
                            item?.name?.trim()?.length > 40
                              ? `${item?.name?.trim().slice(0, 40)}...`
                              : item?.name?.trim();
                          return <option value={item.id}>{name}</option>;
                        })}
                      </select>
                      {filterData.name !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("name")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium w-1/4 min-w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2 min-w-[112px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Intergation
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("apiEnable")}
                        >
                          {sortBy === "apiEnable" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        id="apiEnable"
                        name="apiEnable"
                        value={filterData.apiEnable}
                        className={`bg-transparent border ${
                          filterData?.apiEnable !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="">Filter</option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                      {filterData.apiEnable !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("apiEnable")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium w-1/4 min-w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2 min-w-[96px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        first mile
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("firstMile")}
                        >
                          {sortBy === "firstMile" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        value={filterData.firstMile}
                        id="firstMile"
                        name="firstMile"
                        className={`bg-transparent border ${
                          filterData?.firstMile !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="">Filter</option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                      {filterData.firstMile !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("firstMile")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium w-1/4 min-w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2 min-w-[128px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        International
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("internationalMile")}
                        >
                          {sortBy === "internationalMile" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        id="International"
                        value={filterData?.internationalMile}
                        name="internationalMile"
                        className={`bg-transparent border ${
                          filterData?.internationalMile !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="ALL">Filter</option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                      {filterData.internationalMile !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("internationalMile")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium w-1/4 min-w-[180px]"
                  >
                    <div className="flex items-center gap-2 pb-2 min-w-[93px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Last mile
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("lastMile")}
                        >
                          {sortBy === "lastMile" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        id="LastMile"
                        name="lastMile"
                        value={filterData.lastMile}
                        className={`bg-transparent border w-full hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none ${
                          filterData?.lastMile !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black `}
                        // defaultValue="filter"
                      >
                        <option value="">Filter</option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                      {filterData.lastMile !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("lastMile")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium 2xl:w-1/4 w-[150px] min-w-[150px]"
                  >
                    <div className="flex items-center gap-2 pb-2 2xl:min-w-[152px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        created on
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
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span>
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
                      position={"-right-60"}
                      ExtraCss={
                        "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black mt-0.5 px-3 py-[7.8px] bg-grey_bg text-base font-medium "
                      }
                    />
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 align-top text-left text-xs font-medium 2xl:w-1/4 w-[200px] min-w-[200px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Operating Regions
                      </label>
                      {/* <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("operatingRegions")}
                        >
                          {sortBy === "operatingRegions" ? (
                            sortType === "asc" ? (
                              <img src={DownArrow} />
                            ) : (
                              <img src={UpArrow} className={"mb-[2px]"} />
                            )
                          ) : (
                            <>
                              <img src={UpArrow} className={"mb-[2px]"} />

                              <img src={DownArrow} />
                            </>
                          )}
                        </a>
                      </span> */}
                    </div>
                    {/* <div className="relative">
                      <select
                        onChange={(e: any) => pageFilter(e)}
                        id="operatingRegions"
                        name="operatingRegions"
                        className={`bg-transparent border ${
                          filterData?.operatingRegions !== ""
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                        // defaultValue="filter"
                      >
                        <option value="ALL">Filter</option>
                        <option value={"ACTIVE"}>100</option>
                        <option value={"INACTIVE"}>500</option>
                        <option value={"INACTIVE"}>1000</option>
                      </select>
                      {filterData.operatingRegions !== "" && (
                        <XMarkIcon
                          className="absolute right-5 top-3.5 w-4 h-4"
                          onClick={() => clearSearch("operatingRegions")}
                        />
                      )}
                    </div> */}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3.5 bg-grey_bg text-left text-xs font-medium w-full sticky right-0  min-w-[90px] max-w-[90px]"
                  >
                    <a href="#" className="sr-only">
                      view
                    </a>
                  </th>
                </tr>
              </thead>

              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {serviceSupplierData.map((service, index) => {
                  let propercreatedOn = moment(service?.createdOn)
                    .utc()
                    .format("DD/MM/YYYY HH:mm:ss");

                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-6 text-ellipsis overflow-hidden max-w-[350px] ">
                        {service?.name}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                        <span
                          className={`${
                            service.integration
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {service.integration ? "True" : "False"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          className={`${
                            service?.firstMile
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {service?.firstMile ? "True" : "False"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          className={`${
                            service?.internationalMile
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {service?.internationalMile ? "True" : "False"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          className={`${
                            service?.lastMile
                              ? "text-font_green bg-light_geen"
                              : "text-Incative_red bg-light_red"
                          } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                        >
                          {service.lastMile ? "True" : "False"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {propercreatedOn}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {service?.operatingRegions}
                      </td>

                      <td className="whitespace-nowrap text-blue_primary text-sm font-medium p-0 text-end sticky right-0 w-full">
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

            {!isFetching && !serviceSupplierData?.length && (
              <div className="min-h-[55vh] flex items-center justify-center">
                <p className="">No Result Found</p>
              </div>
            )}
          </div>
          {serviceSupplierData?.length > 0 && (
            <div className="flex gap-4 items-center flex-wrap justify-center bg-white px-4 py-3 md:rounded-b-lg shadow-header border-t border-grey_border_table font-Inter">
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
              <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-table_head_color font-normal">
                    Showing
                    <span className=""> {current_page * 10 - 10 + 1} </span>
                    to{" "}
                    <span className="">
                      {" "}
                      {total < 10
                        ? total
                        : current_page * 10 + perPageCount - 10}{" "}
                      {/* {current_page * 10 + perPageCount - 10}{" "} */}
                    </span>{" "}
                    of
                    <span className=""> {total} </span> results
                  </p>
                </div>
                <div className="hidden sm:block">
                  {serviceSupplierData?.length > 0 && (
                    <Pagination
                      last_page={last_page}
                      onPageChange={onPageChange}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isFetching && <Spinner />}
    </div>
  );
}
