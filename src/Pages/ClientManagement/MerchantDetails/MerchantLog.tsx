import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import moment from "moment";
import { useCallback, useState } from "react";
import { MerchantLogsList } from "../../../api/merchant/merchant";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";

import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import Spinner from "../../../utils/Spinner";

export default function MerchantLog({ state: id }: any) {
  const [services, setservices] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState<string>("desc");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const [sortAction, setsortAction] = useState<boolean>(true);
  const [sortEvent, setsortEvent] = useState<boolean>(true);
  const [sortDiscription, setsortDiscription] = useState<boolean>(true);

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };
  const per_page = 10;

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(
      ["merchantlog"],
      () => MerchantLogsList({ id, per_page, current_page, sortBy, sortType }),
      {
        keepPreviousData: true,
        onSuccess(data: any) {
          if (data.status) {
            setservices(data?.data);
            setperPageCount(data.data.length);

            settotal(data.pagination.total);
            setlast_page(data.pagination.last_page);
            setcurrent_page(data.pagination.current_page);
          }
        },
      }
    );

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );

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
            <table className="w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-medium min-w-[200px] w-[200px]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        ACTION TIME
                      </div>
                      {/* <span
                      className="cursor-pointer"
                      onClick={() => setsortAction(!sortAction)}
                    > */}
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
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-6 text-left text-xs font-medium min-w-[200px] w-[200px]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        ACTION BY
                      </div>
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
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        EVENT
                      </div>
                      <span
                        className="cursor-pointer"
                        onClick={() => setsortEvent(!sortEvent)}
                      >
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("logType")}
                        >
                          {sortBy === "logType" ? (
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
                    className="px-6 py-3.5 text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-Inter text-table_head_color">
                        DESCRIPTION
                      </div>

                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("description")}
                      >
                        {sortBy === "description" ? (
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
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
                {services?.map((service, index) => {
                  const formatedDate = moment(service?.updatedAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );
                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatedDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-blue_primary">
                        {service?.user?.firstName} {service?.user?.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {service.logType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {service.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!services.length && (
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
                {services.length > 0 && (
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

      {isFetching && <Spinner />}
    </>
  );
}
