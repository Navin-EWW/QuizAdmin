import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../../utils/Pagination";
import "../../../utils/Pagination.css";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";

import {
  XMarkIcon
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { SubjectList } from "../../../api/quiz/quizApi";
import { subjectResponseType } from "../../../types/quiz";
import Spinner from "../../../utils/Spinner";
import ToggleModel from "../ToggleModel/ToggleModel";

export function SubjectTable() {
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState<subjectResponseType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("updatedAt");

  const per_page = 10;

  const [filterData, setFilterData] = useState<subjectResponseType>({
   name:"",
   discription:"",
   userId:""
  });

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  useEffect(() => {
    setcurrent_page(1);
  }, [filterData]);

  const pageFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    filterFefechData();
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
  const filterFefechData = React.useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const viewClicked = (item: any) => {
    navigate(`/subject/list/${item.id}`, { state: item });
  };

  const {
    isLoading,
    isFetched,
    isFetching,
    refetch,
  } = useQuery(
    ["SubjectList"],
    () =>
      SubjectList({
        name: "",
        discription: "",
        current_page,
        per_page,
        sortBy,
        sortType,
      }),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          console.log(data);
          setSubjectData(data.data)
        }
      },
    }
  );



  return (
    <div
      className={`px-4 sm:px-6 pb-[90px] lg:px-8 bg-background_grey ${
        subjectData.length && "animate-blinking"
      }`}
    >
      <div className="sm:flex block justify-between items-center py-5 ">
        <h1 className="text-2xl font-semibold text-font_black">
          Subject Management
        </h1>
        <Link
          to="/subject/add"
          className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
        >
          + New Subject
        </Link>
      </div>
      {(!isFetching || isFetched) && (
        <div className="border-table_border border-2 md:rounded-lg shadow-lg">
          <div className="relative bg-white overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
            <table className="w-full divide-y divide-table_border">
              <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-6 text-left text-xs font-medium min-w-[160px] w-[160px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="userId"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        user Id
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("userId")}
                        >
                          {sortBy === "userId" ? (
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
                    <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary placeholder:text-xs">
                      <input
                        onChange={pageFilter}
                        value={filterData.userId}
                        id="userId"
                        name="userId"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData?.userId && (
                        <XMarkIcon
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => clearSearch("userId")}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium  min-w-[160px] w-[160px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="name"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Subject Name
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

                    <div className="flex py-2 px-3 text-font_black focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.name}
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.name && (
                        <XMarkIcon
                          onClick={() => clearSearch("name")}
                           className="w-4 h-4 cursor-pointer"
                        />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium min-w-[280px] w-[280px]"
                  >
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="discription"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Discription
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("discription")}
                        >
                          {sortBy === "discription" ? (
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

                    <div className="flex py-2 text-font_black px-3 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent hover:border-blue_primary active:border-blue_primary focus:border-blue_primary">
                      <input
                        onChange={pageFilter}
                        value={filterData.discription}
                        id="discription"
                        type="text"
                        name="discription"
                        placeholder="Search"
                        className="w-full focus:outline-none bg-transparent"
                      />
                      {filterData.discription && (
                        <XMarkIcon
                           className="w-4 h-4 cursor-pointer"
                          onClick={() => clearSearch("discription")}
                        />
                      )}
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-medium w-full sticky right-0"
                  >
                    <a href="#" className="sr-only">
                      view
                    </a>
                  </th>
                </tr>
              </thead>

              <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
                {subjectData.map((service, index) => {
                  const formatedDate = moment(service?.updatedAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  );

                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 px-6 ">
                        {service?.userId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                        {service?.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                        {service?.discription}
                      </td>

                      <td className="whitespace-nowrap  text-blue_primary text-sm font-medium p-0 text-end sticky right-0 w-full">
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

            {!isFetching && !subjectData.length && (
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
            {subjectData.length > 0 && (
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
      <ToggleModel
        open={open}
        setOpen={setOpen}
        status={""}
        id={""}
        refetch={refetch}
        setadminData={setSubjectData}
        adminData={subjectData}
      />
    </div>
  );
}
