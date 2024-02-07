import { ArrowLeftIcon, ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropBox from "./DropBox";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import { DataPopUp } from "../../../Components/DialogBox/DataPopUp";
import {
  BulkEditRefetchStatus,
  BulkOrderHistory,
} from "../../../api/bulkcustomerorder/bulkcustomerorder";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Spinner from "../../../utils/Spinner";
import { debounce } from "lodash";
import { DataHistrory } from "../../../types/order";
import UseToast from "../../../hooks/useToast";

type Props = {};
const excelSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 110.037 107.5"
  >
    <path
      fill="#4B5D63"
      d="M57.55 0h7.425v10c12.513 0 25.025.025 37.537-.038 2.113.087 4.438-.062 6.275 1.2 1.287 1.85 1.138 4.2 1.225 6.325-.062 21.7-.037 43.388-.024 65.075-.062 3.638.337 7.35-.425 10.938-.5 2.6-3.625 2.662-5.713 2.75-12.95.037-25.912-.025-38.875 0v11.25h-7.763c-19.05-3.463-38.138-6.662-57.212-10V10.013C19.188 6.675 38.375 3.388 57.55 0z"
    />
    <path
      fill="#fff"
      d="M64.975 13.75h41.25V92.5h-41.25V85h10v-8.75h-10v-5h10V62.5h-10v-5h10v-8.75h-10v-5h10V35h-10v-5h10v-8.75h-10v-7.5z"
    />
    <path fill="#4B5D63" d="M79.975 21.25h17.5V30h-17.5v-8.75z" />
    <path
      fill="#fff"
      d="M37.025 32.962c2.825-.2 5.663-.375 8.5-.512a2607.344 2607.344 0 0 1-10.087 20.487c3.438 7 6.949 13.95 10.399 20.95a716.28 716.28 0 0 
      1-9.024-.575c-2.125-5.213-4.713-10.25-6.238-15.7-1.699 5.075-4.125 9.862-6.074 14.838-2.738-.038-5.476-.15-8.213-.263C19.5 65.9 22.6 59.562 25.912 53.312c-2.812-6.438-5.9-12.75-8.8-19.15 2.75-.163 5.5-.325 8.25-.475 1.862 4.888 3.899 9.712 5.438 14.725 1.649-5.312 4.112-10.312 6.225-15.45z"
    />
    <path
      fill="#4B5D63"
      d="M79.975 35h17.5v8.75h-17.5V35zM79.975 48.75h17.5v8.75h-17.5v-8.75zM79.975 62.5h17.5v8.75h-17.5V62.5zM79.975 76.25h17.5V85h-17.5v-8.75z"
    />
  </svg>
);

export function EditBulkOrder({}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [excelTemplateData, setexcelTemplateData] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  // const [last_page, setlast_page] = useState<number>(10);
  const [paginationData, setpaginationData] = useState<any>({});
  const [total, settotal] = useState<number>(0);
  const [historyData, setHistoryData] = useState<DataHistrory[]>([
    // {
    //   id: "63c51b97aebfea44d0288059",
    //   name: "Standard template.xlsx",
    //   marchantcode: "AMAZHK0001",
    //   status: "Success",
    //   errors: 0,
    //   success: 100,
    //   createdAt: "2023-01-16T09:40:37.410Z",
    // },
    // {
    //   id: "63c51b97aebfea44d0289059",
    //   name: "Standard template.xlsx",
    //   marchantcode: "AMAZHK0002",
    //   status: "Fail",
    //   errors: 7,
    //   success: 93,
    //   createdAt: "2023-05-11T09:40:37.410Z",
    // },
    // {
    //   id: "63c51b97aebfea34d0289059",
    //   name: "Standard template.xlsx",
    //   marchantcode: "AMAZHK0003",
    //   status: "Fail",
    //   errors: 8,
    //   success: 92,
    //   createdAt: "2023-09-13T09:40:37.410Z",
    // },
  ]);

  const { error, isError, isLoading, isFetching, refetch } = useQuery(
    ["OrderHistory"],
    () => BulkOrderHistory({ per_page, current_page, sortBy, sortType }),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          setHistoryData(data?.data);

          setpaginationData(data?.pagination);
        }
      },
    }
  );

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );

  const { mutate: refetchStatus } = useMutation(BulkEditRefetchStatus, {
    onSuccess: (data) => {
      if (data?.status) {
        let { id, status, errors, success } = data?.data;
        const index = historyData.findIndex((x) => x.id == id);
        // historyData[index].refetchStatus = "";
        historyData[index].status = status;
        historyData[index].errors = errors;
        historyData[index].success = success;
      }
    },
    onError: (error: any) => {
      UseToast("Something went wrong !", "error");
    },
  });

  const ReFetchStatusData = (data: any) => {
    const index = historyData.findIndex((x) => x.id == data.id);
    historyData[index].refetchStatus = "FETCHING";
    // if (historyData[index].refetchStatus !== "FETCHING") {
    refetchStatus(data.id);
    // }
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  useEffect(() => {
    refechData();
  }, [sortBy, sortType]);

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

  return (
    <>
      <div>
        {isFetching && <Spinner />}
        <section className="bg-grey_color">
          <div className="mx-auto px-8">
            <div className="font-Nunito pb-20">
              <div className="pt-6">
                <Link
                  to="/order/list"
                  className="flex gap-3 items-center text-sm font-bold text-font_dark"
                >
                  {/* <ArrowLeftIcon className="w-5 h-5" /> */}
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
                  <span>Back to order management</span>
                </Link>
              </div>

              <div className="text-center mb-4 sm:text-left">
                <h1 className="text-xl sm:text-2xl font-semibold pt-[10px]">
                  Bulk edit customer order
                </h1>
              </div>

              <DropBox setReFatch={refechData} />

              {/* <BookingTable /> */}

              <div className="shadow-md mt-5 bg-white rounded-md">
                <div className="py-4 px-6 bg-white rounded-t-md border-grey_border">
                  <p className="text-[18px] font-medium">History</p>
                </div>

                <div className="relative overflow-auto min-h-[400px] bg-white mx-6">
                  <table className="w-full divide-y divide-table_border">
                    <thead className="bg-gray-50 bg-grey_bg border-y-[1px] text-bulkedit_table_head">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-3 text-left text-xs font-medium min-w-[150px] w-[150px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="uppercase font-Nunito font-bold text-bulkedit_table_head">
                              IMPORT FILE
                            </div>
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
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium min-w-[140px] w-[140px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="uppercase font-Nunito font-bold text-bulkedit_table_head">
                              filename
                            </div>
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
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-xs font-medium max-w-[120px] w-[120px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="uppercase font-Nunito font-bold text-bulkedit_table_head">
                              STATUS
                            </div>
                            <span>
                              <a
                                className="cursor-pointer"
                                onClick={() => onSort("status")}
                              >
                                {sortBy === "status" ? (
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
                          className="px-3 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="font-Nunito font-bold uppercase text-bulkedit_table_head">
                              SUCCESS
                            </div>
                            <span>
                              <a
                                className="cursor-pointer"
                                onClick={() => onSort("success")}
                              >
                                {sortBy === "success" ? (
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
                          className="px-3 py-3.5  text-xs font-medium min-w-[100px] w-[100px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="uppercase font-Nunito font-bold text-bulkedit_table_head">
                              error(s)
                            </div>
                            <span>
                              <a
                                className="cursor-pointer"
                                onClick={() => onSort("errors")}
                              >
                                {sortBy === "errors" ? (
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
                          className="px-3 py-3.5  text-xs font-medium max-w-[80px] w-[80px] sticky right-0"
                        >
                          <div className="flex items-center bg-grey_bg gap-2">
                            <div className="uppercase font-Nunito font-bold text-bulkedit_table_head">
                              ACTION
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
                      {historyData?.map((service, index) => {
                        let orderdate = moment(service?.createdAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        );
                        return (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-3 py-4 cursor-default">
                              {orderdate}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 cursor-default">
                              {service?.fileName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 cursor-default">
                              {/* <span
                                className={`${
                                  service?.status === "Success"
                                    ? "text-success_text"
                                    : "text-fail_error"
                                }  rounded-full py-1 text-sm font-medium`}
                              >
                                {service?.status === "Success"
                                  ? " Success"
                                  : "Fail"}
                              </span> */}
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
                            <td className="whitespace-nowrap px-3 py-4 cursor-default">
                              {service?.success > 0 ? service?.success : "-"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 cursor-default">
                              {service?.errors > 0 ? service?.errors : "-"}
                            </td>

                            <td className="whitespace-nowrap sticky right-0 ">
                              <span className="px-3 py-4 bg-white">
                                <button
                                  disabled={Boolean(!service?.errors)}
                                  onClick={() => {
                                    service?.errors
                                      ? navigate(`/order/error/${service?.id}`)
                                      : navigate(`/order/error/${service?.id}`);
                                  }}
                                  type="button"
                                  className={`inline-flex rounded-md text-sm font-medium border justify-center focus:outline-none px-[17px] py-[7.5px] ${
                                    service?.status === "ERROR"
                                      ? "bg-white hover:bg-grey_bg text-font_dark"
                                      : "bg-grey_border text-white"
                                  }  border-grey_border`}
                                >
                                  View
                                </button>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {!historyData.length && (
                    <div className="w-full min-h-[400px] bg-white text-sm font-medium flex justify-center items-center font-Inter">
                      <div className="">
                        <p className="text-base font-normal">No past upload</p>
                      </div>
                    </div>
                  )}
                </div>

                {historyData?.length > 0 && (
                  <div className="py-3 px-6 flex items-center justify-between border-t border-grey_border_table">
                    <p className="font-medium font-Inter text-sm text-table_head_color my-3">
                      Showing{" "}
                      {paginationData?.current_page * paginationData?.per_page -
                        paginationData?.per_page +
                        1}{" "}
                      to{" "}
                      {paginationData?.per_page * paginationData?.current_page}{" "}
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
          </div>
        </section>
        {/* <DataPopUp
          header="Update customer order"
          subHeader="Customer order details will be updated after the import. Are you sure to continue?"
          open={open}
          // error={"Import Failed."}
          setOpen={setOpen}
          buttonlevelblue="Confirm"
          // buttonlevelwhite="Cancel"
        /> */}
      </div>
    </>
  );
}
