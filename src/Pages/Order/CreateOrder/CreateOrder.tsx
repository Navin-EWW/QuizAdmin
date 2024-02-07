import { useState, useEffect, useCallback } from "react";
import DropBox from "./DropBox";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  OrderBookingdownload,
  OrderHistory,
  OrderTrackingnodownload,
  RefetchStatus,
} from "../../../api/bulkcustomerorder/bulkcustomerorder";
import moment from "moment";
import Spinner from "../../../utils/Spinner";
import { debounce } from "lodash";
import UseToast from "../../../hooks/useToast";

type Props = {};

export function CreateOrder({}: Props) {
  const navigate = useNavigate();
  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  const [reFatch, setReFatch] = useState(false);
  const [sortAction, setsortAction] = useState<boolean>(true);
  const [sortType, setSortType] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [reFetchStatus, setReFetchStatus] = useState("");
  const [paginationData, setpaginationData] = useState<any>({});
  const [historyData, setHistoryData] = useState<any[]>([]);

  const {
    isLoading: Queryloading,
    isFetching,
    refetch,
  } = useQuery(
    ["OrderHistory"],
    () => OrderHistory({ per_page, current_page, sortBy, sortType }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        if (data.status) {
          setHistoryData(data?.data);
          setpaginationData(data?.pagination);
        }
      },
    }
  );

  const { mutate: refetchStatus } = useMutation(RefetchStatus, {
    onSuccess: (data: any) => {
      if (data?.status) {
        let { id, status, errors, success } = data?.data;
        const index = historyData.findIndex((x) => x.id == id);
        historyData[index].refetchStatus = "";
        historyData[index].status = status;
        historyData[index].errors = errors;
        historyData[index].success = success;
      }
    },
    onError: (error: any) => {
      UseToast("Something went wrong !", "error");
    },
  });

  useEffect(() => {
    refetch();
  }, [reFatch]);

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );

  const { mutate: BookingDownload, isLoading } = useMutation(
    OrderBookingdownload,
    {
      onSuccess: (data: any) => {
        if (data?.status) {
          if (data?.data?.url) {
            const link = document.createElement("a");
            link?.setAttribute("href", data?.data?.url);
            link?.setAttribute("id", "okay");
            link?.setAttribute("download", "data.pdf");
            document.body.appendChild(link);
            link?.click();
            UseToast("Download Sucessfully");
            link.remove();
          } else {
            UseToast("Something went wrong", "error");
          }
        }
      },
      onError: (error: any) => {
        UseToast("Something went wrong !", "error");
      },
    }
  );

  const OrderBookingDownload = (id: string | any) => {
    BookingDownload({ id: id });
  };

  const { mutate: TrackingnoDownload } = useMutation(OrderTrackingnodownload, {
    onSuccess: (data: any) => {
      if (data?.status) {
        if (data?.data?.url) {
          const link = document.createElement("a");
          link.setAttribute("href", data?.data?.url);
          link.setAttribute("download", "data.xlsx");
          document.body.appendChild(link);
          link?.click();
          UseToast("Download Sucessfully");
          link.remove();
        } else {
          UseToast("Something went wrong", "error");
        }
      }
    },
    onError: (error: any) => {
      UseToast("Something went wrong !", "error");
    },
  });

  const OrderTrackingnoDownload = (id: string) => {
    TrackingnoDownload({ id: id });
  };

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const onPageCall = (page: number) => {
    if (paginationData?.last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  const ReFetchStatusData = (data: any) => {
    setReFetchStatus(data?.id);
    const index = historyData.findIndex((x) => x.id == data.id);
    historyData[index].refetchStatus = "FETCHING";
    // if (historyData[index].refetchStatus !== "FETCHING") {
    refetchStatus(data.id);
    // }
  };

  const SortTable = (data: string) => {
    setSortBy(data);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  return (
    <>
      {isFetching && <Spinner />}
      <section className="bg-grey_color pb-20">
        <div className="mx-auto px-6 ">
          <div className="text-center mb-4 sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold pt-[20px]">
              + New Order
            </h1>
          </div>

          <div className="bg-white px-6 py-5 rounded-md shadow-md">
            <div className="pb-5 border-b-[1px]  border-grey_border">
              <p className="text-[18px] font-medium">Shipment Type</p>
            </div>
            <div className=" mt-4 gap-6 flex">
              <button
                type="button"
                className="inline-flex font-Inter rounded-md text-sm font-normal border justify-center focus:outline-none px-8 py-[15.5px] w-full bg-white hover:bg-grey_bg text-font_black border-grey_border"
              >
                Single Shipment{" "}
              </button>
              <button
                type="button"
                className="inline-flex font-Inter rounded-md text-sm font-normal w-full  border-[2px] justify-center focus:outline-none px-8 py-[15.5px] bg-button_color text-font_black border-blue_primary"
              >
                Bulk Shipment{" "}
              </button>
            </div>
          </div>
          {/*  */}
          <DropBox setReFatch={refechData} />

          {/* <BookingTable /> */}

          <div className="shadow-md mt-5 bg-white rounded-md">
            <div className="py-4 px-6 bg-white rounded-md border-grey_border">
              <p className="text-[18px] font-medium">History</p>
            </div>

            <div className="relative min-h-[400px] overflow-auto bg-white mx-6">
              <table className="w-full divide-y divide-table_border">
                <thead className="bg-gray-50 bg-grey_bg border-y-[1px] border- text-table_head_color">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-6 text-left text-xs font-medium min-w-[150px] w-[150px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="uppercase font-Nunito font-bold text-table_head_color">
                          IMPORT TIME
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("createdAt")}>
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
                        </span> */}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium  min-w-[140px] w-[140px] 2xl:w-1/3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="uppercase font-Nunito font-bold text-table_head_color">
                          filename
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("name")}>
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
                        </span> */}
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3.5 text-center text-xs font-medium max-w-[160px] w-[160px]"
                    >
                      <div className="flex items-center gap-2 w-[120px]">
                        <div className="uppercase font-Nunito font-bold text-table_head_color">
                          merchant code
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("merchantCode")}>
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
                        </span> */}
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3.5 text-center text-xs font-medium min-w-[130px] w-[130px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="uppercase font-Nunito font-bold text-table_head_color">
                          STATUS
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("status")}>
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
                        </span> */}
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3.5 text-xs font-medium min-w-[140px] w-[140px]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-Nunito font-bold uppercase text-table_head_color">
                          SUCCESS
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("success")}>
                            {sortBy === "success" ? (
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
                    </th>

                    <th
                      scope="col"
                      className="text-xs font-medium min-w-[140px] w-[140px]"
                    >
                      <div className="flex px-6 py-3.5 items-center gap-2">
                        <div className="uppercase font-Nunito font-bold text-table_head_color">
                          ERROR(S)
                        </div>
                        {/* <span
                          className="cursor-pointer"
                          onClick={() => setsortAction(!sortAction)}
                        >
                          <a onClick={() => SortTable("errors")}>
                            {sortBy === "errors" ? (
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
                    </th>

                    <th
                      scope="col"
                      className={`text-xs font-medium min-w-[80px] p-0 w-[80px ] ${
                        historyData?.length && "md:sticky md:right-[255.5px]"
                      } bg-grey_bg`}
                    >
                      <div className="flex px-4 py-3.5 items-center gap-2">
                        <div className=" uppercase font-Nunito font-bold text-table_head_color">
                          ACTION
                        </div>
                      </div>
                    </th>

                    <th
                      scope="col"
                      className={`text-xs ${
                        historyData?.length && "md:sticky right-[120.5px]"
                      } font-medium min-w-[135px] w-[135px] bg-grey_bg`}
                    >
                      <div className="flex px-2 py-3.5 items-center gap-2">
                        <div className="font-Nunito font-bold uppercase text-table_head_color">
                          shipment label
                        </div>
                      </div>
                    </th>

                    <th
                      scope="col"
                      className={`text-xs p-0  font-medium min-w-[120px] w-[120px] ${
                        historyData?.length && "md:sticky right-[1px]"
                      } bg-grey_bg`}
                    >
                      {/* <div className="flex  items-center gap-2"> */}
                      <div className="uppercase text-left px-2 py-3.5 font-Nunito font-bold text-table_head_color">
                        tracking no.
                        {/* </div> */}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white text-sm font-medium text-font_black font-Inter">
                  {historyData?.map((service, index) => {
                    let orderdate = moment(service?.createdAt).format(
                      "DD/MM/YYYY HH:mm:ss"
                    );
                    return (
                      <tr
                        key={index}
                        className={`${
                          index === 9
                            ? ""
                            : "border-y-[1px] border-grey_border_table"
                        }`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          {orderdate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          {service?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          {service?.merchantCode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          <div className="flex gap-2 items-center">
                            <span
                              className={`${
                                service?.status === "SUCCESS"
                                  ? "text-success_text"
                                  : service?.status === "IN_PROGRESS"
                                  ? "text-inprogress_text"
                                  : "text-fail_error"
                              }  py-1 text-sm  font-medium`}
                            >
                              {service?.status === "SUCCESS"
                                ? "Success"
                                : service?.status === "IN_PROGRESS"
                                ? "In progress"
                                : "Fail"}
                            </span>
                            {service?.status === "IN_PROGRESS" && (
                              <i
                                onClick={() => {
                                  ReFetchStatusData(service);
                                }}
                                className="cursor-pointer"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type={
                                      service?.refetchStatus === "FETCHING"
                                        ? "rotate"
                                        : ""
                                    }
                                    dur="1s"
                                    from="0 0 0"
                                    to="360 0 0"
                                    repeatCount="indefinite"
                                  />
                                  <path
                                    d="M6.99999 13.6668C5.15277 13.6668 3.57986 13.0175 2.28124 11.7189C0.982634 10.4203 0.333328 8.84738 0.333328 7.00016C0.333328 5.15294 0.982634 3.58002 2.28124 2.28141C3.57986 0.982802 5.15277 0.333496 6.99999 0.333496C8.18055 0.333496 9.21527 0.57308 10.1042 1.05225C10.9931 1.53141 11.7639 2.18766 12.4167 3.021V0.333496H13.6667V5.62516H8.37499V4.37516H11.875C11.3472 3.54183 10.6736 2.86822 9.85416 2.35433C9.03472 1.84044 8.08333 1.5835 6.99999 1.5835C5.48611 1.5835 4.20486 2.1078 3.15624 3.15641C2.10763 4.20502 1.58333 5.48627 1.58333 7.00016C1.58333 8.51405 2.10763 9.7953 3.15624 10.8439C4.20486 11.8925 5.48611 12.4168 6.99999 12.4168C8.15277 12.4168 9.20833 12.087 10.1667 11.4272C11.125 10.7675 11.7917 9.896 12.1667 8.81266H13.4583C13.0556 10.271 12.2569 11.4446 11.0625 12.3335C9.86805 13.2224 8.51388 13.6668 6.99999 13.6668Z"
                                    fill="#6B7B80"
                                  />
                                </svg>
                              </i>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          {service?.success > 0 ? service?.success : "-"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 cursor-default">
                          {service?.errors > 0 ? service?.errors : "-"}
                        </td>

                        <td
                          className={`whitespace-nowrap p-0 ${
                            historyData?.length &&
                            "md:sticky md:right-[255.5px]"
                          }`}
                        >
                          <div className="px-2 py-4 bg-white">
                            {service?.status !== "SUCCESS" ? (
                              <button
                                onClick={() =>
                                  navigate(`/order/errors/${service?.id}`, {
                                    state: {
                                      id: service?.id,
                                    },
                                  })
                                }
                                disabled={service?.status !== "ERROR"}
                                type="button"
                                className={`inline-flex rounded-md text-sm font-normal ${
                                  service?.status === "ERROR"
                                    ? "bg-white hover:bg-grey_bg text-font_dark"
                                    : "bg-grey_border cursor-default text-white"
                                } border justify-center focus:outline-none px-[17px] py-[7.5px]  border-grey_border`}
                              >
                                View
                              </button>
                            ) : (
                              <p className="cursor-default">-</p>
                            )}
                          </div>
                        </td>

                        <td
                          className={`whitespace-nowrap p-0  ${
                            historyData?.length && "md:sticky right-[120.5px]"
                          }`}
                        >
                          <div className="px-2 py-4 bg-white">
                            <button
                              type="button"
                              disabled={!(service?.status === "SUCCESS")}
                              onClick={() => OrderBookingDownload(service?.id)}
                              className={`inline-flex rounded-md text-sm font-normal border justify-center focus:outline-none px-[17px] py-[7.5px] ${
                                service?.status === "SUCCESS"
                                  ? "bg-white hover:bg-grey_bg text-font_dark"
                                  : "bg-grey_border cursor-default text-white"
                              }  border-grey_border`}
                            >
                              Download{" "}
                            </button>
                          </div>
                        </td>

                        <td
                          className={`whitespace-nowrap p-0 ${
                            historyData?.length && "md:sticky right-[1px]"
                          }`}
                        >
                          <div className="px-2 py-4 bg-white">
                            <button
                              type="button"
                              disabled={!(service?.status === "SUCCESS")}
                              onClick={() =>
                                OrderTrackingnoDownload(service?.id)
                              }
                              className={`inline-flex rounded-md text-sm font-normal  border justify-center focus:outline-none px-[17px] py-[7.5px] ${
                                service?.status === "SUCCESS"
                                  ? "bg-white hover:bg-grey_bg text-font_dark"
                                  : "bg-grey_border cursor-default text-white"
                              } border-grey_border`}
                            >
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!historyData?.length && (
                <div className="w-full min-h-[400px] bg-white text-sm text-font_dark font-medium flex justify-center items-center font-Inter">
                  <div className="">
                    <p className="">No past upload</p>
                  </div>
                </div>
              )}
            </div>
            {historyData?.length > 0 && (
              <div className="px-6 py-3 text-grey_border flex items-center justify-between border-t border-grey_border_table">
                <p className="font-normal text-table_head_color text-sm my-3">
                  Showing{" "}
                  {paginationData?.current_page * paginationData?.per_page -
                    paginationData?.per_page +
                    1}{" "}
                  to {paginationData?.per_page * paginationData?.current_page}{" "}
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
      </section>
    </>
  );
}
