import { useQuery } from "@tanstack/react-query";
import _, { debounce } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState, useRef } from "react";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import { CountriesDetails } from "../../../api/orderDetails/orderDetails.api";
import Spinner from "../../../utils/Spinner";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import { XMarkIcon } from "@heroicons/react/24/outline";
type Props = {
  operatingRegionid: string | undefined;
  editCnt?: boolean;
};

const MerchantBalanceLog = ({ operatingRegionid, editCnt }: Props) => {
  const firstUpdate = useRef(true);
  const [merchantBalanceLogData, setmerchantBalanceLogData] = useState([
    1, 1, 1, 1, 1, 1,
  ]);

  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("originCountry");
  const [originCountryToggle, setoriginCountryToggle] =
    useState<boolean>(false);
  const [destinationCountryToggle, setdestinationCountryToggle] =
    useState<boolean>(false);
  const [selectedoriginCountry, setselectedoriginCountry] =
    useState<string>("");
  const [countriesDetails, setcountriesDetails] = useState<any[]>([]);
  const [selectedDestinationCountry, setselectedDestinationCountry] =
    useState<string>("");

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const [filterData, setFilterData] = useState({
    event: "ALL",
    remarks: "",
  });

  const isFetching = false;

  //   const { error, isFetching, isError, isLoading, refetch } = useQuery(
  //     ["merchantBalanceLogList"],
  //     () =>
  //       merchantBalanceLogList({
  //         id: operatingRegionid,
  //         current_page: current_page,
  //         per_page: per_page,
  //         sortBy: sortBy,
  //         sortType: sortType,
  //         originCountry: operatingCountryId?.originCountry,
  //         destinationCountry: operatingCountryId?.destinationCountry,

  //         // originCountry: selectedoriginCountry
  //         //   ? countriesDetails.find(
  //         //       (item, index) => item.iso2 === selectedoriginCountry
  //         //     ).id
  //         //   : "",
  //         // destinationCountry: selectedoriginCountry
  //         //   ? countriesDetails.find(
  //         //       (item, index) => item.iso2 === selectedDestinationCountry
  //         //     ).id
  //         //   : "",
  //       }),
  //     {
  //       keepPreviousData: true,
  //       onSuccess(data) {
  //         if (data.status) {
  //           setmerchantBalanceLogData(data.data);
  //           settotal(data.pagination?.total);
  //           setlast_page(data.pagination?.last_page);
  //         }
  //       },
  //     }
  //   );

  const refechData = useCallback(
    debounce(
      () =>
        // refetch()
        console.log(""),
      500
    ),
    []
  );
  // useEffect(() => {
  //   setOperatingcountryId({
  //     originCountry: selectedoriginCountry
  //       ? countriesDetails.find(
  //           (item, index) => item.name === selectedoriginCountry
  //         ).id
  //       : "",
  //     destinationCountry: selectedDestinationCountry
  //       ? countriesDetails.find(
  //           (item, index) => item.name === selectedDestinationCountry
  //         ).id
  //       : "",
  //   });
  //   refechData();
  // }, [selectedoriginCountry, selectedDestinationCountry]);

  //   useDidMountEffect(() => {
  //     // react please run me if 'key' changes, but not on initial render
  //     setOperatingcountryId({
  //       originCountry: selectedoriginCountry
  //         ? countriesDetails.find(
  //             (item, index) => item.name === selectedoriginCountry
  //           ).id
  //         : "",
  //       destinationCountry: selectedDestinationCountry
  //         ? countriesDetails.find(
  //             (item, index) => item.name === selectedDestinationCountry
  //           ).id
  //         : "",
  //     });
  //     refechData();
  //   }, [selectedoriginCountry, selectedDestinationCountry]);

  const changeCountry = (name: string, isDestination?: boolean) => {
    const findIdCountry: any = countriesDetails?.find(
      (x: any) => x?.name === name
    );
    if (!isDestination) {
      setselectedoriginCountry(name);
      setoriginCountryToggle(false);
    } else {
      setselectedDestinationCountry(name);
      setdestinationCountryToggle(false);
    }
  };

  const ClearOriginValue = () => {
    setselectedoriginCountry("");
  };
  const pageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    //   refechData();
  };

  const ClearDestinationValue = () => {
    setselectedDestinationCountry("");
  };
  const onSort = (sortBy: string) => {
    console.log("first");
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    //   refechData();
  };

  return (
    <div className="mt-2">
      <div
        className={`relative sm:min-h-[65vh] 2xl:min-h-[15vh] ${
          editCnt ? "bg-white" : "bg-grey_bg"
        } overflow-auto`}
      >
        <table className={`w-full divide-y divide-table_border`}>
          <thead className="overflow-auto bg-grey_bg text-table_head_color">
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
                        onClick={() => editCnt && onSort("updatedAt")}
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
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-xs font-medium min-w-[100px] w-[100px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color"
                    >
                      Event
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => editCnt && onSort("event")}
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
                    disabled={!editCnt}
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
                    htmlFor="first_name"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    Remarks
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => editCnt && onSort("remarks")}
                    >
                      {sortBy === "remarks" ? (
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
                    disabled={!editCnt}
                    value={filterData.remarks}
                    onChange={pageFilter}
                    id="remarks"
                    name="remarks"
                    placeholder="Search"
                    className="w-full focus:outline-none bg-transparent"
                  />
                  {filterData.remarks && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("remarks")}
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
                      Original Balance
                    </label>
                    <span>
                      <a
                        className="cursor-pointer "
                        onClick={() => editCnt && onSort("originalBalance")}
                      >
                        {sortBy === "originalBalance" ? (
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
                      New Balance
                    </label>
                    <span>
                      <a
                        className="cursor-pointer "
                        onClick={() => editCnt && onSort("newBalance")}
                      >
                        {sortBy === "newBalance" ? (
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
                    Difference
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => editCnt && onSort("difference")}
                    >
                      {sortBy === "difference" ? (
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
            </tr>
          </thead>

          <tbody className="divide-y divide-grey_border_table  text-sm font-medium text-font_black font-Inter">
            {merchantBalanceLogData?.map((item: any, index) => {
              // const formatedDate = moment(service?.updatedAt).format(
              //   "DD/MM/YYYY HH:mm:ss"
              // );
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {"20/10/2022 16:02:29"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{"Refund"}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {"JP092374032"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {"HK$29,416.00"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {"+HK$100.00"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span
                      //   onClick={(e) => StatusHandle(service)}
                      className={`font-medium bg-transparent  text-success_text rounded-full text-xs  cursor-pointer`}
                    >
                      {"+HK$100.00"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!isFetching && !merchantBalanceLogData.length && (
          <div className="w-full bg-white text-sm sm:min-h-[45vh] 2xl:min-h-[15vh] font-medium flex justify-center items-center font-Inter">
            <p className="flex justify-center">No past action</p>
          </div>
        )}
      </div>
      {merchantBalanceLogData.length > 0 && (
        <div className="flex gap-4 items-center flex-wrap justify-center bg-white py-1 border-t border-grey_border_table font-Inter">
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
            <p className="text-sm text-table_head_color font-normal">
              Showing
              <span className=""> {current_page * 10 - 10 + 1} </span>
              to{" "}
              <span className="">
                {" "}
                {/* {current_page * 10 +  - 10}{" "} */}
                {total < 10 ? total : current_page * 10 + per_page - 10}{" "}
              </span>{" "}
              of
              <span className=""> {total} </span> results
            </p>

            <div className="hidden sm:block">
              {merchantBalanceLogData?.length > 0 && (
                <Pagination last_page={last_page} onPageChange={onPageChange} />
              )}
            </div>
          </div>
        </div>
      )}
      {isFetching && <Spinner />}
    </div>
  );
};

export default MerchantBalanceLog;
