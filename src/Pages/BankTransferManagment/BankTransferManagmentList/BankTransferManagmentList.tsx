import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";

import { XMarkIcon } from "@heroicons/react/24/outline";
import DateRangePicker from "../../../utils/DateRangePicker";
import Spinner from "../../../utils/Spinner";

export function BankTransferManagmentList() {
  const navigate = useNavigate();
  const [bankTransferData, setbankTransferData] = useState<any>([
    1, 2, 2, 2, 2, 2, 2, 2,
  ]);

  const defaultEndDate = new Date();
  const [submittedStart, setSubmittedStart] = useState<
    Date | null | undefined | any
  >();
  const [submittedEnd, setSubmittedEnd] = useState<
    Date | null | undefined | any
  >();

  const [approvedStart, setApprovedStart] = useState<
    Date | null | undefined | any
  >();
  const [approvedEnd, setApprovedEnd] = useState<
    Date | null | undefined | any
  >();

  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);

  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");

  const [filterData, setFilterData] = useState({
    merchant: "",
    user: "",
    status: "ALL",
    approvedBy: "",
  });

  const isFetching = false;

  useEffect(() => {
    console.log(approvedEnd, approvedStart, submittedStart, submittedEnd);
  }, [approvedEnd, approvedStart, submittedStart, submittedEnd]);

  //   useEffect(() => {
  //     refechData();
  //   }, [createdAttoDate]);

  console.log(filterData);

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
    setcurrent_page(current_page);
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
        bankTransferData.length && "animate-blinking"
      }`}
    >
      <div className="sm:flex block justify-between items-center py-5 ">
        <h1 className="text-2xl font-semibold text-font_black">
          Bank Transfer
        </h1>
        {/* <Link
          to="/service-supplier/add"
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New supplier
        </Link> */}
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
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="last_action"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          Submitted At
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

                      <DateRangePicker
                        rangeStart={submittedStart}
                        setRangeStart={setSubmittedStart}
                        rangeEnd={submittedEnd}
                        setRangeEnd={setSubmittedEnd}
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
                      />
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-6 text-left text-xs font-medium min-w-[163px] w-[163px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="merchant"
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
                    <div className="flex py-1 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                      <input
                        onChange={pageFilter}
                        value={filterData.merchant}
                        id="merchant"
                        name="merchant"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.merchant && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("merchant")}
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
                        User
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("user")}
                        >
                          {sortBy === "user" ? (
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

                    <div className="flex py-1 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.user}
                        id="user"
                        type="text"
                        name="user"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.user && (
                        <XMarkIcon
                          onClick={() => clearSearch("user")}
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[113px] w-[113px]"
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
                        onChange={(e: any) => pageFilter(e)}
                        id="Status"
                        name="status"
                        className={`bg-transparent border ${
                          filterData?.status !== "ALL"
                            ? "text-font_black"
                            : "text-grey_border"
                        } active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none`}
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
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[158px] w-[158px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="user"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Approved By
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("approvedBy")}
                        >
                          {sortBy === "approvedBy" ? (
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

                    <div className="flex py-1 text-font_black px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.approvedBy}
                        id="approvedBy"
                        type="text"
                        name="approvedBy"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.approvedBy && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={() => clearSearch("approvedBy")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[200px] w-[200px]"
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-2 pb-2">
                        <label
                          htmlFor="last_action"
                          className="font-Inter text-table_head_color uppercase"
                        >
                          Approved At
                        </label>
                        <span>
                          <a
                            className="cursor-pointer "
                            onClick={() => onSort("approvedAt")}
                          >
                            {sortBy === "approvedAt" ? (
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
                        editablePaddingY="py-1"
                        rangeStart={approvedStart}
                        setRangeStart={setApprovedStart}
                        rangeEnd={approvedEnd}
                        setRangeEnd={setApprovedEnd}
                        titlePlaceholder={"Filter"}
                        color="black"
                        StartPlaceholder={`${moment(defaultEndDate)
                          .utc()
                          .format("DD/MM/YYYY")}`}
                        EndPlaceholder={`${moment(defaultEndDate)
                          .utc()
                          .format("DD/MM/YYYY")}`}
                        svgicon={true}
                        position={"-right-40"}
                        ExtraCss={
                          "group w-full border border-grey_border_table text-font_black py-1 px-[13px] bg-grey_bg text-base font-medium "
                        }
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium w-full sticky right-0"
                  >
                    <a className="sr-only">view</a>
                  </th>
                </tr>
              </thead>

              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {bankTransferData.map((service: any, index: number) => {
                  const formatedDate = moment(service?.updatedAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );

                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-6 ">
                        {"20/10/2023 16:02:29"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                        {"Amazon HK"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {"Jerry Lee"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        <span
                          //   onClick={(e) => StatusHandle(service)}
                          className={`font-medium bg-transparent  ${
                            service?.apiCreate === "Success" &&
                            "text-success_text"
                          } ${
                            service?.apiCreate === "Fail" && "text-error_red"
                          }  ${
                            service?.apiCreate === "Not_Applicable" &&
                            "text-orange_text"
                          } text-success_text rounded-full px-6 py-1 text-xs  cursor-pointer`}
                        >
                          {service.status === "Approved"
                            ? "Approved"
                            : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {"Victor Ma"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {"20/10/2023 16:02:29"}
                      </td>
                      <td className="whitespace-nowrap  text-blue_primary text-sm font-medium p-0 text-end sticky right-0 w-full">
                        <p className=" bg-white py-4 px-6">
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              navigate("/bank-transfer/list/asakkas");
                            }}
                          >
                            View
                          </span>
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isFetching && !bankTransferData.length && (
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
            {bankTransferData.length > 0 && (
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
