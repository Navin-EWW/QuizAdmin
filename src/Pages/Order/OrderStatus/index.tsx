import { ArrowLeftIcon, ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../utils/Pagination";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import "../../../utils/Pagination.css";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BulkErrorHistory } from "../../../api/bulkcustomerorder/bulkcustomerorder";
import Spinner from "../../../utils/Spinner";

type Props = {};

type PropsObj = {
  id: string;
  name: string;
  status: string;
  errors: number;
  success: number;
  createdAt: string;
};

export const OrderStatus = (props: Props) => {
  const [Error, setError] = useState(false);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  const [errorsHistpry, seterrorsHistpry] = useState<any[]>([
    {
      id: "63c51b97aebfea44d0289059",
      Order_no: "2344445322",
      row: "12",
      column: "A",
      column_name: "Merchant ID",
      reason: "Invalid city in the corresponding state or province",
      createdAt: "2023-05-11T09:40:37.410Z",
    },
    {
      id: "63c51b97aebfea64d0289059",
      Order_no: "2344445323",
      row: "11",
      column: "C",
      column_name: "Merchant ID",
      reason: "Invalid city in the corresponding state or province",
      createdAt: "2023-05-11T09:40:37.410Z",
    },
    {
      id: "63c51b97aebfea42d0289059",
      Order_no: "2344445324",
      row: "10",
      column: "B",
      column_name: "Merchant ID",
      reason: "Invalid city in the corresponding state or province",
      createdAt: "2023-05-11T09:40:37.410Z",
    },
  ]);
  const [errorsDetails, seterrorsDetails] = useState<PropsObj>({
    id: "63c5376359d4bc9851a834c1",
    name: "Standard template.xlsx",
    status: "ERROR",
    errors: 6,
    success: 0,
    createdAt: "2023-01-16T09:40:37.410Z",
  });
  const location: any = useLocation();

  const { error, isError, isLoading, isFetching, refetch } = useQuery(
    ["BulkErrorHistory"],
    () => BulkErrorHistory({ id: location.state.id, current_page, per_page }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          seterrorsDetails(data?.details);
          seterrorsHistpry(data?.data);
        }
      },
      onError(error: any) {},
    }
  );

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refetch();
  };
  return (
    <>
      {isFetching && <Spinner />}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 mb-40px bg-background_grey min-h-screen">
        <div>
          <Link to="/order/add" className="flex gap-2 items-end py-4">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to all history
          </Link>
        </div>

        <div className="bg-white px-6 py-5 rounded-b-lg rounded-lg">
          <div className=" border-grey_border_table pb-5">
            <h3 className="text-lg font-bold leading-6 text-font_black font-Inter">
              Import Details
            </h3>
          </div>

          <div className="space-y-6 sm:space-y-5 font-Inter">
            <FormInputFiled
              disabled={true}
              label="Import Time"
              editCnt={true}
              value="20/10/2022 16:02:29"
              id="merchantCode"
              name="merchantCode"
              type="text"
            />
            <FormInputFiled
              disabled={true}
              label="File Name"
              editCnt={true}
              value="Standard template.xlsx"
              id="merchantCode"
              name="merchantCode"
              type="text"
            />
            {/* <FormInputFiled
            errorText={true}
            // successText={true}
            disabled={true}
            label="Status"
            editCnt={true}
            value="Fail, 3 customer order has been detected with errors."
            id="merchantCode"
            name="merchantCode"
            type="text"
          /> */}
            <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
              <label
                htmlFor="status"
                className="block text-font_dark font-medium"
              >
                Status
              </label>
              <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full">
                {location.state.error !== "Success" ? (
                  <span className="block text-error_red cursor-default w-full rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm ">
                    {`Fail, ${errorsDetails?.errors} customer order has been detected with errors.`}
                  </span>
                ) : (
                  <span className="block text-success_text cursor-default w-full rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm ">
                    {`Success, 4 customer orders has been successfully updated.`}
                  </span>
                )}
              </div>
            </div>
            <FormInputFiled
              disabled={true}
              label="No. of Success"
              editCnt={true}
              value=""
              id="merchantCode"
              name="merchantCode"
              type="text"
            />
            <FormInputFiled
              disabled={true}
              label="Customer Order(s)"
              editCnt={true}
              value="3"
              id="merchantCode"
              name="merchantCode"
              type="text"
            />
          </div>
        </div>
        <div className="pb-20">
          <div className="shadow-md mt-5 rounded-b-md  px-6 bg-white">
            <div className="py-5 border-grey_border">
              <p className="text-[18px] font-medium">
                {location.state.error !== "Success" ? "Error(s)" : "Update(s)"}
              </p>
            </div>
            <div className="relative overflow-auto bg-white ">
              {location.state.error !== "Success" ? (
                <table className="w-full divide-y divide-table_border">
                  <thead className=" bg-gray-50 bg-grey_bg border-y-[1px] text-table_head_color">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[150px] w-[150px]"
                      >
                        <div className="flex items-center gap-2 w-[160px]">
                          <div className="uppercase font-Inter text-table_head_color">
                            CUSTOMER ORDER NO.
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-medium min-w-[140px] w-[140px]"
                      >
                        <div className="flex tems-start gap-2">
                          <div className="uppercase font-Inter m text-table_head_color">
                            ROW(S)
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-center  text-xs font-medium max-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="uppercase font-Inter text-table_head_color">
                            COLUMN(S)
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2 w-[130px]">
                          <div className="font-Inter text-table_head_color">
                            COLUMN NAME
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="uppercase font-Inter text-table_head_color">
                            Reason
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
                    {[1, 2, 2, 2, 2, 2, 2, 6, 6, 6]?.map((service, index) => {
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            JP0390218{" "}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            2
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            <span
                              className={`${"text-font_green"} rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                            >
                              A
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            Merchant ID
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            Invalid city in the corresponding state or province
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full divide-y divide-table_border">
                  <thead className="align-top bg-gray-50 bg-grey_bg border-y-[1px] text-table_head_color">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[150px] w-[150px]"
                      >
                        <div className="flex items-center gap-2 w-[160px]">
                          <div className="uppercase font-Inter text-table_head_color">
                            CUSTOMER ORDER NO.
                          </div>
                          <span
                            className="cursor-pointer"
                            // onClick={() => setsortAction(!sortAction)}
                          >
                            <a
                            // onClick={() => SortLog("createdAt")}
                            >
                              <img src={UpArrow} className={"mb-[2px]"} />
                              <img src={DownArrow} />
                            </a>
                          </span>
                        </div>
                        <div className="flex py-1 px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                          <input
                            // onChange={pageFilter}
                            // value={filterData.role}
                            id="customerorder"
                            type="text"
                            name="customerorder"
                            placeholder="Search"
                            className="w-full focus:outline-none bg-transparent"
                          />
                          {/* {filterData.role && (
                       <XMarkIcon
                         className="w-4 h-4"
                         onClick={() => clearSearch("role")}
                       />
                     )} */}
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-medium min-w-[140px] w-[140px]"
                      >
                        <div className="flex tems-start gap-2">
                          <div className="uppercase font-Inter m text-table_head_color">
                            ROW(S)
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-center  text-xs font-medium max-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="uppercase font-Inter text-table_head_color">
                            COLUMN(S)
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2 w-[130px]">
                          <div className="font-Inter text-table_head_color">
                            COLUMN NAME
                          </div>
                          <span
                            className="cursor-pointer"
                            // onClick={() => setsortAction(!sortAction)}
                          >
                            <a
                            // onClick={() => SortLog("createdAt")}
                            >
                              <img src={UpArrow} className={"mb-[2px]"} />
                              <img src={DownArrow} />
                            </a>
                          </span>
                        </div>
                        <div className="flex py-1 px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                          <input
                            // onChange={pageFilter}
                            // value={filterData.role}
                            id="columnname"
                            type="text"
                            name="columnname"
                            placeholder="Search"
                            className="w-full focus:outline-none bg-transparent"
                          />
                          {/* {filterData.role && (
                       <XMarkIcon
                         className="w-4 h-4"
                         onClick={() => clearSearch("role")}
                       />
                     )} */}
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-Inter text-table_head_color">
                            OLD
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium max-w-[100px] w-[100px]  bg-grey_bg"
                      >
                        <div className="flex items-center gap-2">
                          <div className=" uppercase font-Inter text-table_head_color">
                            new
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
                    {[1, 2, 2, 2, 2, 2, 2, 6, 6, 6]?.map((service, index) => {
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            JP0390218{" "}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            2
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            <span
                              className={`${"text-font_green"} rounded-full py-1 text-xs font-medium `}
                            >
                              A
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            MAS09209
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            4
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 cursor-default ">
                            Invalid city in the corresponding state or province
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {!errorsHistpry?.length && (
                <div className="w-full min-h-[400px] h-full bg-white text-sm font-medium flex justify-center items-center font-Inter">
                  <div className="">
                    <p className="text-base font-normal">No past upload</p>
                  </div>
                </div>
              )}
            </div>
            <div className="py-3 flex items-center justify-between border-t border-grey_border_table">
              <p className="font-normal  my-3">
                {/* Showing
              <span className="">
                {current_page * per_page - per_page + 1}{" "}
              </span>{" "}
              to <span className=""> {per_page * current_page} </span> of{" "}
              <span className=""> {total} </span> results */}
                Showing results 1- 100 of 50
              </p>
              <div className="hidden sm:block">
                {/* {/ {services.length > 0 && ( /} */}
                <Pagination last_page={3} onPageChange={onPageChange} />
                {/* {/ )} /} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
