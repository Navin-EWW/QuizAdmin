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
import { useQuery } from "@tanstack/react-query";

export function BankTransferManagmentCharges() {
  const navigate = useNavigate();
  const [chargesData, setchargesData] = useState<any>([1, 2, 2, 2, 2, 2, 2, 2]);

  const [createdAtfromDate, setCreatedAtfromDate] = useState<
    Date | null | undefined | any
  >();
  const [createdAttoDate, setCreatedAttoDate] = useState<
    Date | null | undefined | any
  >();

  const [serviceSupplierFilter, setserviceSupplierFilter] = useState<any>();
  const [filterDate, setFilterDate] = useState("Filter");
  const [rangeStart, setRangeStart] = useState<Date | null | undefined | any>();
  const defaultEndDate = new Date();
  // defaultEndDate.setDate(defaultEndDate.getDate() + 1);
  const [rangeEnd, setRangeEnd] = useState<Date | null | undefined | any>();

  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);

  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");

  const [filterData, setFilterData] = useState({
    actionBy: "",
    merchant: "",
    event: "ALL",
    amount: "",
  });

  const isFetching = false;

  //   useEffect(() => {
  //     refechData();
  //   }, [createdAttoDate]);

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    //   refechData();
  };

  //   useEffect(() => {
  //     setcurrent_page(1);
  //   }, [filterData]);

  const pageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    //   refechData();
  };

  const onPageCall = (page: number) => {
    //   if (last_page >= page && page !== 0) {
    //     setcurrent_page(page);
    //     refechData();
    //   }
  };

  const onPageChange = (current_page: number) => {
    //   setcurrent_page(current_page);
    //   refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    //   refechData();
  };

  //   const refechData = React.useCallback(
  //     debounce(() => refetch(), 200),
  //     []
  //   );

  //   const viewClicked = (item: any) => {
  //     // navigate(`/admin/list/${item.id}`, { state: item });
  //     navigate(`/service-supplier/list/${item.id}`, { state: "" });
  //   };

  return (
    <div
      className={`px-4 sm:px-6 pb-[90px] lg:px-8 bg-background_grey ${
        chargesData.length && "animate-blinking"
      }`}
    >
      <div className="sm:flex block justify-between items-center py-5 ">
        <h1 className="text-2xl font-semibold text-font_black">Charges</h1>
        <Link
          to="/charges/add"
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New charges
        </Link>
      </div>
      {!isFetching && (
        <div className="border-table_border border-2 md:rounded-lg shadow-lg">
          <div className="relative bg-white overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
            <table className="w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[200px] w-[200px]"
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-2 pb-[37px]">
                        <label
                          htmlFor="last_action"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          action time
                        </label>
                        <span>
                          <a
                            className="cursor-pointer "
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

                      {/* <DateRangePicker
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
                          "group w-full border border-grey_border_table text-font_black py-1 px-[13px] bg-grey_bg text-base font-medium "
                        }
                      /> */}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-6 text-left text-xs font-medium min-w-[144px] w-[144px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="actionBy"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Action By
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("actionBy")}
                        >
                          {sortBy === "actionBy" ? (
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
                    <div className="flex py-1 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                      <input
                        onChange={pageFilter}
                        value={filterData.actionBy}
                        id="actionBy"
                        name="actionBy"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.actionBy && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("actionBy")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium  min-w-[100px] w-[100px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="last_name"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Merchant
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

                    <div className="flex py-1 px-2 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.merchant}
                        id="merchant"
                        type="text"
                        name="merchant"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.merchant && (
                        <XMarkIcon
                          onClick={() => clearSearch("merchant")}
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[100px] w-[100px]"
                  >
                    <div>
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="event"
                          className="font-Inter text-table_head_color"
                        >
                          Event
                        </label>
                        <span>
                          <a
                            className="cursor-pointer"
                            onClick={() => onSort("event")}
                          >
                            {sortBy === "event" ? (
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
                        onChange={(e: any) => pageFilter(e)}
                        id="event"
                        name="event"
                        className={`bg-transparent border ${
                          filterData?.event !== "ALL"
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 px-2 focus:outline-none`}
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
                    className="py-3.5 pl-6 pr-6 text-left text-xs font-medium min-w-[144px] w-[144px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="amount"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Amount
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("amount")}
                        >
                          {sortBy === "amount" ? (
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
                    <div className="flex py-1 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                      <input
                        onChange={pageFilter}
                        value={filterData.amount}
                        id="amount"
                        name="amount"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.amount && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("amount")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[178px] w-[178px]"
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-2 pb-[37px]">
                        <label
                          htmlFor="last_action"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          Attachment
                        </label>
                        {/* <span>
                          <a
                            className="cursor-pointer "
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
                        </span> */}
                      </div>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[158px] w-[158px]"
                  >
                    <div className="flex items-center gap-2 pb-[37px]">
                      <label
                        htmlFor="role"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Remark
                      </label>
                      {/* <span>
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
                      </span> */}
                    </div>

                    {/* <div className="flex py-1 text-font_black px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
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
                    </div> */}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium w-full sticky right-0 "
                  >
                    <a href="#" className="sr-only">
                      view
                    </a>
                  </th>
                </tr>
              </thead>

              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {chargesData.map((service: any, index: number) => {
                  const formatedDate = moment(service?.updatedAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );

                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-6 ">
                        {"20/10/2023 16:02:29"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 lg:table-cell text-blue_primary">
                        {"Victor Ma"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell text-blue_primary">
                        {"Amazon HK"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {"Monthly Invoice"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          //   onClick={(e) => StatusHandle(service)}
                          className={`font-medium bg-transparent  text-success_text rounded-full text-xs  cursor-pointer`}
                        >
                          {"+HK$100.00"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell text-blue_primary">
                        {"June2023.pdf"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell ">
                        {"Monthly Invoice"}
                      </td>
                      <td className="whitespace-nowrap  text-blue_primary text-sm font-medium p-0 text-end sticky right-0 w-full">
                        <p className="bg-white py-4 px-6">
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              navigate("/charges/list/dasdjsaj");
                            }}
                          >
                            Edit
                          </span>
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isFetching && !chargesData.length && (
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
            {chargesData.length > 0 && (
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
    </div>
  );
}
