import { ArrowLeftIcon, ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../../../utils/Pagination";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import "../../../utils/Pagination.css";
import { useQuery } from "@tanstack/react-query";
import {
  ErrorEditHistory,
  ErrorHistory,
} from "../../../api/bulkcustomerorder/bulkcustomerorder";
import moment from "moment";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Spinner from "../../../utils/Spinner";
import { debounce } from "lodash";
import UseToast from "../../../hooks/useToast";

type Props = {};
type PropsObj = {
  id: string;
  fileName: string;
  status: string;
  errors: number;
  success: number;
  createdAt: string;
};

export const ErrorStatus = (props: Props) => {
  let { id } = useParams();
  const [errorsHistpry, seterrorsHistpry] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  const [paginationData, setpaginationData] = useState<any>({});
  const [errorsDetails, seterrorsDetails] = useState<PropsObj>();
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("referenceNo");
  const navigate = useNavigate();

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, isFetching, refetch } = useQuery(
    ["ErrorEditHistory"],
    () =>
      ErrorEditHistory({ id: id, per_page, current_page, sortBy, sortType }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          seterrorsDetails(data?.details);
          seterrorsHistpry(data?.data);
          setpaginationData(data?.pagination);
        }
      },
      onError(error: any) {
        typeof error !== "string"
          ? UseToast(error?.message, "error")
          : UseToast(error, "error");
        navigate("/order/edit-bulkorder");
      },
    }
  );

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  useEffect(() => {
    if (!id) {
      navigate("/order/edit-bulkorder");
    }
  }, [id]);
  return (
    <>
      {isFetching && <Spinner />}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey">
        <div>
          <Link
            to="/order/edit-bulkorder"
            className="flex gap-2 items-center py-6"
          >
            {/* <ArrowLeftIcon className="w-5 h-5 stroke-font_dark" /> */}
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33332 12.8333L1.5 6.99996M1.5 6.99996L7.33332 1.16663M1.5 6.99996L16.5 6.99996"
                stroke="#6B7B80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-font_dark font-Inter text-sm font-medium">
              Back to all history
            </span>
          </Link>
        </div>

        <div className="bg-white px-6 py-5 shadow-header rounded-md">
          <div className=" border-grey_border_table pb-5">
            <h3 className="text-[18px] font-medium leading-6 text-font_black font-Inter">
              Import Details
            </h3>
          </div>

          <div className="space-y-6 sm:space-y-5 font-Inter">
            <FormInputFiled
              disabled={true}
              label="Import Time"
              editCnt={true}
              // value="20/10/2022 16:02:29"
              value={moment(errorsDetails?.createdAt).format(
                "DD/MM/YYYY HH:mm:ss"
              )}
              id="merchantCode"
              name="merchantCode"
              type="text"
            />
            <FormInputFiled
              disabled={true}
              label="File Name"
              editCnt={true}
              value={errorsDetails?.fileName || ""}
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
            value={`Fail, ${errorsDetails?.errors} customer order has been detected with errors.`}
            id="Status"
            name="Status"
            type="text"
          /> */}

            <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
              <label
                htmlFor="phoneno"
                className="block text-font_dark font-medium"
              >
                Status
              </label>
              <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full">
                <span className="block text-error_red cursor-default w-full rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm ">
                  {`Fail, ${errorsDetails?.errors} customer order has been detected with errors.`}
                </span>
              </div>
            </div>

            <FormInputFiled
              disabled={true}
              label="No. of Success"
              editCnt={true}
              value={
                errorsDetails && errorsDetails?.success > 0
                  ? errorsDetails?.success
                  : "-"
              }
              id="Success"
              name="Success"
              type="text"
            />
            <FormInputFiled
              disabled={true}
              label="No. of Error Customer Order(s)"
              editCnt={true}
              value={errorsDetails?.errors || ""}
              id="Order"
              name="Order"
              type="text"
            />
          </div>
        </div>

        <div className="pb-20">
          <div className="shadow-header mt-5 rounded-md px-6 bg-white">
            <div className="py-5 border-grey_border">
              <p className="text-[18px] font-Inter text-font_black font-medium">
                Error(s)
              </p>
            </div>
            <div className="relative overflow-auto min-h-[400px] bg-white ">
              {errorsDetails?.status ? (
                <table className="w-full divide-y divide-table_border">
                  <thead className=" bg-gray-50 bg-grey_bg border-y-[1px] text-table_head_color">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-6 text-left text-xs font-medium min-w-[165px] w-[165px]"
                      >
                        <div className="flex items-center gap-2 w-[165px]">
                          <div className="uppercase font-Inter text-table_head_color">
                            Order no.
                          </div>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("referenceNo")}
                            >
                              {sortBy === "referenceNo" ? (
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
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-left text-xs font-medium min-w-[120px] w-[120px]"
                      >
                        <div className="flex items-center gap-2  ">
                          <div className="uppercase font-Inter m text-table_head_color">
                            ROW(S)
                          </div>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("row")}
                            >
                              {sortBy === "row" ? (
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
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-center  text-xs font-medium max-w-[150px] w-[150px]"
                      >
                        <div className="flex items-center gap-2 w-[130px]">
                          <div className="uppercase font-Inter text-table_head_color">
                            COLUMN(S)
                          </div>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("column")}
                            >
                              {sortBy === "column" ? (
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
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5  text-xs font-medium min-w-[150px] w-[150px]"
                      >
                        <div className="flex items-center gap-2 w-[130px]">
                          <div className="font-Inter  text-table_head_color">
                            COLUMN NAME
                          </div>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("field")}
                            >
                              {sortBy === "field" ? (
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
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3.5 text-xs font-medium min-w-[200px] w-1/2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-Inter text-table_head_color">
                            REASON
                          </div>
                          <span>
                            <a
                              className="cursor-pointer"
                              onClick={() => onSort("error")}
                            >
                              {sortBy === "error" ? (
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
                      </th>
                    </tr>
                  </thead>

                  <tbody className=" bg-white text-sm font-medium  text-font_black font-Inter">
                    {errorsHistpry?.map((service, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b-[1px] border-table_head_color"
                        >
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            {service?.referenceNo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            {service?.row}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            {service?.column}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 cursor-default">
                            {service?.field}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 cursor-default ">
                            {service?.error}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                ""
              )}

              {!errorsHistpry?.length && (
                <div className="w-full min-h-[400px] h-full bg-white text-sm font-medium flex justify-center items-center font-Inter">
                  <div className="">
                    <p className="text-base font-normal">No past upload</p>
                  </div>
                </div>
              )}
            </div>
            {errorsHistpry?.length > 0 && (
              <div className="py-3 flex items-center justify-between border-t border-grey_border_table">
                <p className="font-normal text-table_head_color  my-3">
                  Showing{" "}
                  {paginationData?.current_page * paginationData?.per_page -
                    paginationData?.per_page +
                    1}{" "}
                  -{" "}
                  {/* {paginationData?.per_page * paginationData?.current_page} */}
                  {paginationData?.per_page * paginationData?.current_page >
                  paginationData?.total
                    ? paginationData?.total
                    : paginationData?.per_page *
                      paginationData?.current_page}{" "}
                  of {paginationData?.total} results
                </p>

                <div className="hidden sm:block">
                  <Pagination
                    last_page={paginationData?.last_page}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {(isLoading || !data) && <Spinner />} */}
      </div>
    </>
  );
};
