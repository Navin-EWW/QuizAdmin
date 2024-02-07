import { useQuery } from "@tanstack/react-query";
import _, { debounce } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState, useRef } from "react";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import { CountriesDetails } from "../../../api/orderDetails/orderDetails.api";
import { operatingRegionsList } from "../../../api/serviceSupplier/serviceSupplier";
import Spinner from "../../../utils/Spinner";
import { operatingRegionsTable } from "../../../types/routingRule";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
type Props = {
  operatingRegionid: string | undefined;
};

const OperatingRegionsTable = ({ operatingRegionid }: Props) => {
  const firstUpdate = useRef(true);
  const [operatingRegionsData, setOperatingRegionsData] = useState<
    operatingRegionsTable[]
  >([]);
  const [operatingCountryId, setOperatingcountryId] = useState<{
    originCountry: string;
    destinationCountry: string;
  }>();
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

  useQuery(["fetchCountryDetails"], () => CountriesDetails(), {
    onSuccess(data: any) {
      setcountriesDetails(data?.data);
    },
    onError(error: any) {},
  });

  const { error, isFetching, isError, isLoading, refetch } = useQuery(
    ["OperatingRegionsList"],
    () =>
      operatingRegionsList({
        id: operatingRegionid,
        current_page: current_page,
        per_page: per_page,
        sortBy: sortBy,
        sortType: sortType,
        originCountry: operatingCountryId?.originCountry,
        destinationCountry: operatingCountryId?.destinationCountry,

        // originCountry: selectedoriginCountry
        //   ? countriesDetails.find(
        //       (item, index) => item.iso2 === selectedoriginCountry
        //     ).id
        //   : "",
        // destinationCountry: selectedoriginCountry
        //   ? countriesDetails.find(
        //       (item, index) => item.iso2 === selectedDestinationCountry
        //     ).id
        //   : "",
      }),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          setOperatingRegionsData(data.data);
          settotal(data.pagination?.total);
          setlast_page(data.pagination?.last_page);
        }
      },
    }
  );

  const refechData = useCallback(
    debounce(() => refetch(), 500),
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

  useDidMountEffect(() => {
    // react please run me if 'key' changes, but not on initial render
    setOperatingcountryId({
      originCountry: selectedoriginCountry
        ? countriesDetails.find(
            (item, index) => item.name === selectedoriginCountry
          ).id
        : "",
      destinationCountry: selectedDestinationCountry
        ? countriesDetails.find(
            (item, index) => item.name === selectedDestinationCountry
          ).id
        : "",
    });
    refechData();
  }, [selectedoriginCountry, selectedDestinationCountry]);

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

  const ClearDestinationValue = () => {
    setselectedDestinationCountry("");
  };
  const onSort = (sortBy: string) => {
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

  return (
    <div className="mt-2 ">
      <div className="relative sm:min-h-[65vh] 2xl:min-h-[15vh]  overflow-auto">
        <table className="w-full divide-y divide-table_border">
          <thead className="bg-gray-50 uppercase overflow-auto bg-grey_bg text-table_head_color">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3  text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <div className="font-Inter text-table_head_color">
                    Origin Country
                  </div>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("originCountry")}
                    >
                      {sortBy === "originCountry" ? (
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
                {/* <select
                  //   onChange={(e: any) => onStatus(e)}
                  id="Status"
                  name="status"
                  className={`bg-transparent border ${
                    // filterData?.status !== "ALL"
                    //   ? "text-font_black":
                    "text-grey_border"
                  } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                  // defaultValue="filter"
                >
                  <option value="ALL">Filter</option>
                  <option value={"ACTIVE"}>Active</option>
                  <option value={"INACTIVE"}>Inactive</option>
                </select> */}
                <InputDropDown
                  isRoutingRule={true}
                  // disabled={isLoading}
                  noValueHere={_.isEmpty(selectedoriginCountry)}
                  divOnClick={() => setdestinationCountryToggle(false)}
                  // valueIsISO2={true}
                  isOpen={originCountryToggle}
                  setIsOpen={setoriginCountryToggle}
                  array={countriesDetails}
                  value={selectedoriginCountry}
                  text="Filter"
                  id="originCountryToggle"
                  name="originCountryToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    changeCountry(
                      countriesDetails?.find((x) => x?.name === e)?.name
                    );
                  }}
                  ClearValue={ClearOriginValue}
                  iconsvg={
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                        fill="#6B7B80"
                      />
                    </svg>
                  }
                />
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3  text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <div className="font-Inter text-table_head_color">
                    Destination Country
                  </div>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("destinationCountry")}
                    >
                      {sortBy === "destinationCountry" ? (
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
                {/* <select
                  //   onChange={(e: any) => onStatus(e)}
                  id="Status"
                  name="status"
                  className={`bg-transparent border ${
                    // filterData?.status !== "ALL"
                    //   ? "text-font_black":
                    "text-grey_border"
                  } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                  // defaultValue="filter"
                >
                  <option value="ALL">Filter</option>
                  <option value={"ACTIVE"}>Active</option>
                  <option value={"INACTIVE"}>Inactive</option>
                </select> */}
                <InputDropDown
                  isRoutingRule={true}
                  // disabled={isLoading}
                  noValueHere={_.isEmpty(selectedDestinationCountry)}
                  divOnClick={() => {
                    setoriginCountryToggle(false);
                  }}
                  // valueIsISO2={true}
                  isOpen={destinationCountryToggle}
                  setIsOpen={setdestinationCountryToggle}
                  array={countriesDetails}
                  value={selectedDestinationCountry}
                  text="Filter"
                  id="destinationCountryToggle"
                  name="destinationCountryToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement>,
                    text: string
                  ) => {
                    changeCountry(
                      countriesDetails.find((x, index) => x?.name === e)?.name,
                      true
                    );
                  }}
                  ClearValue={ClearDestinationValue}
                  iconsvg={
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
                        fill="#6B7B80"
                      />
                    </svg>
                  }
                />
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 align-top text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <div className="font-Inter text-table_head_color">
                    Default Rules number
                  </div>
                  {/* <span>
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
                  </span> */}
                </div>
                {/* <select
                  //   onChange={(e: any) => onStatus(e)}
                  id="Status"
                  name="status"
                  className={`bg-transparent border ${
                    // filterData?.status !== "ALL"
                    //   ? "text-font_black":
                    "text-grey_border"
                  } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                  // defaultValue="filter"
                >
                  <option value="ALL">Filter</option>
                  <option value={"ACTIVE"}>Active</option>
                  <option value={"INACTIVE"}>Inactive</option>
                </select> */}
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 align-top text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <div className="font-Inter text-table_head_color">
                    Backup Rules number
                  </div>
                  {/* <span>
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
                  </span> */}
                </div>
                {/* <select
                  //   onChange={(e: any) => onStatus(e)}
                  id="Status"
                  name="status"
                  className={`bg-transparent border ${
                    // filterData?.status !== "ALL"
                    //   ? "text-font_black":
                    "text-grey_border"
                  } active:text-font_black w-full hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table mt-1  py-2 pl-3 pr-3 focus:outline-none`}
                  // defaultValue="filter"
                >
                  <option value="ALL">Filter</option>
                  <option value={"ACTIVE"}>Active</option>
                  <option value={"INACTIVE"}>Inactive</option>
                </select> */}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
            {operatingRegionsData?.map((item, index) => {
              // const formatedDate = moment(service?.updatedAt).format(
              //   "DD/MM/YYYY HH:mm:ss"
              // );
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item?.originCountry}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item?.destinationCountry}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.defaultRouteCount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {item.backupRouteCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!isFetching && !operatingRegionsData.length && (
          <div className="w-full bg-white text-sm sm:min-h-[45vh] 2xl:min-h-[15vh]  font-medium flex justify-center items-center font-Inter">
            <p className="flex justify-center">No Result Found</p>
          </div>
        )}
      </div>
      {operatingRegionsData.length > 0 && (
        <div className="flex gap-4 items-center flex-wrap justify-center bg-white py-1 md:rounded-b-lg border-t border-grey_border_table font-Inter">
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
                  {/* {current_page * 10 +  - 10}{" "} */}
                  {total < 10 ? total : current_page * 10 + per_page - 10}{" "}
                </span>{" "}
                of
                <span className=""> {total} </span> results
              </p>
            </div>
            <div className="hidden sm:block">
              {operatingRegionsData?.length > 0 && (
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

export default OperatingRegionsTable;
