import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import _, { debounce, isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import ServiceSupplierEditMileComponent from "../../../Components/ServiceSupplierEditMileComponent/ServiceSupplierEditMileComponent";
import {
  SupplierStatusListAPI,
  SupplierStatusMapping,
  UpdateServiceSupplier,
} from "../../../api/serviceSupplier/serviceSupplier";
import UseToast from "../../../hooks/useToast";
import {
  MileEnum,
  statusmapping,
  statusmappingFilter,
  supplierStatusFilterdata,
} from "../../../types/routingRule";
import Spinner from "../../../utils/Spinner";
import Tablecompoent from "../Components/Tablecompoent";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";
import ButtonSpinner from "../../../utils/ButtonSpinner";

type Props = {
  editCnt: boolean;
  setEditCnt: React.Dispatch<boolean>;
  id: string | undefined;
  cancelModal: boolean;
  compareToggle: boolean;
  setcompareToggle: React.Dispatch<boolean>;
  setcancelModal: React.Dispatch<boolean>;
};

function ServiceSupplierStatusMapping({
  editCnt,
  setEditCnt,
  id,
  compareToggle,
  setcancelModal,
  setcompareToggle,
  cancelModal,
}: Props) {
  const navigate = useNavigate();
  const [StatusDatamap, setStatusDatamap] = useState<statusmapping[]>([]);
  const [StatusDataDirty, setStatusDataDirty] = useState<
    supplierStatusFilterdata[]
  >([]);
  const [allSupplierData, setallSupplierData] = useState<
    supplierStatusFilterdata[]
  >([]);
  const [deletedId, setDeletedId] = useState<string[]>([]);
  const [sortType, setSortType] = useState("asc");
  const [sortBy, setSortBy] = useState("mile");

  const [firstMileData, setfirstMileData] = useState<statusmapping[]>([]);
  const [internationalMileData, setinternationalMileData] = useState<
    statusmapping[]
  >([]);
  const [thirdMileData, setthirdMileData] = useState<statusmapping[]>([]);
  const [allMileData, setAllMileData] = useState<statusmapping[]>([]);

  const [apiErrors, setapiErrors] = useState<any>("");

  const [filterData, setFilterData] = useState<statusmappingFilter>({
    mile: "",
    customerStatus: "",
    internalStatus: "",
    supplierStatus: "",
  });

  const { error, isFetching, isError, isFetched, isLoading, refetch } =
    useQuery(
      ["SupplierStatusMapping"],
      () =>
        SupplierStatusMapping({
          id: id,
          sortBy: sortBy,
          sortType: sortType,
          ...filterData,
        }),
      {
        keepPreviousData: true,
        async onSuccess(data) {
          if (data?.status) {
            setStatusDatamap(data.data);
            setallSupplierData(
              data.data.map((filterdata) => ({
                ...filterdata.supplierStatus,
                internalStatusId: filterdata.internalStatus.id,
                mile: filterdata.mile,
              }))
            );

            setStatusDataDirty(
              data.data.map((filterdata) => ({
                ...filterdata.supplierStatus,
                internalStatusId: filterdata.internalStatus.id,
                mile: filterdata.mile,
              }))
            );

            const firstMData = data.data.filter(
              (item) => item.mile === MileEnum.FIRST_MILE
            );
            setfirstMileData(firstMData);
            const internationalData = data.data.filter(
              (item) => item.mile === MileEnum.INTERNATIONAL_MILE
            );
            setinternationalMileData(internationalData);
            const lastMData = data.data.filter(
              (item) => item.mile === MileEnum.LAST_MILE
            );
            setthirdMileData(lastMData);

            const AllMData = data.data.filter(
              (item) => item.mile == MileEnum.ALL
            );

            setAllMileData(AllMData);
          }
        },
      }
    );

  useEffect(() => {
    return () => {
      setcompareToggle(false);
    };
  }, []);

  useEffect(() => {
    refechData();
  }, [filterData]);

  const refechData = React.useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  useEffect(() => {
    if (apiErrors) {
      setTimeout(() => {
        setapiErrors("");
      }, 7000);
    }
  }, [apiErrors]);

  const cancelClicked = () => {
    if (JSON.stringify(allSupplierData) == JSON.stringify(StatusDataDirty)) {
      setEditCnt(!editCnt);
      refechData();
    } else {
      setcancelModal(true);
    }
    const temparr = StatusDataDirty;
    setallSupplierData(temparr);
  };

  useMemo(() => {
    if (!_.isEmpty(allSupplierData)) {
      if (JSON.stringify(allSupplierData) == JSON.stringify(StatusDataDirty)) {
        setcompareToggle(false);
      } else {
        setcompareToggle(true);
      }
    }
  }, [allSupplierData]);

  const { mutate, isLoading: mutateIsLoading } = useMutation(
    UpdateServiceSupplier,
    {
      onSuccess: (data: any) => {
        refechData();
        UseToast(data?.message);
        setEditCnt(!editCnt);
      },
      onError: (data: any) => {
        if (data?.message) {
          setapiErrors(data?.message);
        } else {
          setapiErrors(data);
        }
        setEditCnt(!editCnt);
      },
    }
  );

  const EditHandler = () => {
    // let arrSubmit = [
    //   ...allSupplierData?.map((item) => {
    //     if (item.name) {
    //       return {
    //         mile: item.mile,
    //         internalStatusId: item.internalStatusId,
    //         supplierStatusId: item.id,
    //         supplierStatusName: item.name,
    //       };
    //     } else {
    //       return;
    //     }
    //   }),
    // ];

    let arrSubmit: any[] = [];

    allSupplierData?.map((item) => {
      if (!_.isEmpty(item?.name)) {
        arrSubmit.push({
          mile: item.mile,
          internalStatusId: item.internalStatusId,
          supplierStatusId: item.id,
          supplierStatusName: item.name,
        });
      } else if (item.id) {
        deletedId.push(item.id);
      }
    }),
      mutate({
        id: id,
        status: arrSubmit,
        deletedStatus: deletedId
          ? [...new Set(deletedId)].filter((value) => value.trim() !== "")
          : [],
      });
  };

  return (
    <div className="relative pb-20">
      {/* <form className="space-y-8 pb-20"> */}

      <div className="bg-white px-5 rounded-b-md shadow-md">
        <div className="space-y-6 sm:space-y-5 full-table overflow-auto">
          <table className="w-full divide-y divide-table_border">
            <thead className="bg-gray-50  bg-grey_bg text-table_head_color relative">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-6 text-left text-xs font-medium min-w-[131px] w-[131px]"
                >
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="filter"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      mile
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => false && onSort("mile")}
                      >
                        {/* {sortBy === "mile" ? (
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
                        )} */}
                      </a>
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="filter"
                      name="location"
                      disabled={!editCnt}
                      value={filterData.mile}
                      onChange={(e: any) =>
                        setFilterData({ ...filterData, mile: e.target.value })
                      }
                      className={`bg-transparent border focus:text-font_black  active:text-font_black hover:border-blue_primary active:border-blue_primary rounded-md border-grey_border_table w-full py-2 pl-3 pr-3 focus:outline-none text-xs ${
                        filterData.mile ? "text-font_black" : ""
                      }`}
                    >
                      <option value={""}>Filter</option>
                      <option value={MileEnum.FIRST_MILE}>First Mile</option>
                      <option value={MileEnum.INTERNATIONAL_MILE}>
                        International Mile
                      </option>
                      <option value={MileEnum.LAST_MILE}>Last Mile</option>
                      <option value={MileEnum.ALL}>All Mile</option>
                    </select>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium min-w-[301px] w-[301px]"
                >
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="customer_status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      Customer Status
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => editCnt && onSort("customerStatus")}
                      >
                        {sortBy === "customerStatus" ? (
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
                  <div className="relative">
                    <input
                      id="customer_status"
                      disabled={!editCnt}
                      placeholder="Search"
                      value={filterData.customerStatus}
                      onChange={(e) =>
                        setFilterData({
                          ...filterData,
                          customerStatus: e.target.value,
                        })
                      }
                      className={`w-full py-2 pl-3 pr-8 focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary border rounded-md border-grey_border_table focus:bg-transparent bg-transparent placeholder:text-xs focus:outline-none ${
                        filterData.customerStatus ? "text-font_black" : ""
                      }`}
                    />
                    {filterData.customerStatus !== "" && (
                      <XMarkIcon
                        className="absolute cursor-pointer right-5 top-2.5 w-4 h-4"
                        onClick={() => editCnt && clearSearch("customerStatus")}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium min-w-[321px] w-[321px]"
                >
                  <div>
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="internal_status"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Internal Status
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => editCnt && onSort("internalStatus")}
                        >
                          {sortBy === "internalStatus" ? (
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
                    <div className="relative">
                      <input
                        id="internal_status"
                        disabled={!editCnt}
                        placeholder="Search"
                        value={filterData.internalStatus}
                        onChange={(e) =>
                          setFilterData({
                            ...filterData,
                            internalStatus: e.target.value,
                          })
                        }
                        className={`w-full py-2 px-3 focus:text-font_black active:text-font_black focus:outline-none hover:border-blue_primary active:border-blue_primary border rounded-md border-grey_border_table focus:bg-transparent bg-transparent placeholder:text-xs ${
                          filterData.internalStatus ? "text-font_black" : ""
                        }`}
                      />
                      {filterData.internalStatus !== "" && (
                        <XMarkIcon
                          className="absolute cursor-pointer right-5 top-2.5 w-4 h-4"
                          onClick={() =>
                            editCnt && clearSearch("internalStatus")
                          }
                        />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium min-w-[318px] w-[318px]"
                >
                  <div>
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="supplier_status"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        supplier Status
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => editCnt && onSort("supplierStatus")}
                        >
                          {sortBy === "supplierStatus" ? (
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
                    <div className="relative">
                      <input
                        id="supplier_status"
                        disabled={!editCnt}
                        value={filterData.supplierStatus}
                        onChange={(e) =>
                          setFilterData({
                            ...filterData,
                            supplierStatus: e.target.value,
                          })
                        }
                        placeholder="Search"
                        className={`w-full py-2 px-3 focus:text-font_black active:text-font_black focus:outline-none hover:border-blue_primary active:border-blue_primary border rounded-md border-grey_border_table focus:bg-transparent bg-transparent placeholder:text-xs ${
                          filterData.supplierStatus ? "text-font_black" : ""
                        }`}
                      />
                      {filterData.supplierStatus !== "" && (
                        <XMarkIcon
                          className="absolute cursor-pointer right-5 top-2.5 w-4 h-4"
                          onClick={() =>
                            editCnt && clearSearch("supplierStatus")
                          }
                        />
                      )}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            {/* <tbody className="divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter relative"> */}
            <tbody>
              {editCnt ? (
                <>
                  {firstMileData.map((data, index) => {
                    return (
                      <Tablecompoent
                        rowSpan={firstMileData.length}
                        firstcol={index === 0 ? "First Mile" : ""}
                        secountcol={
                          data.externalStatus ? data.externalStatus : ""
                        }
                        index={index}
                        thirthcol={
                          data.internalStatus.name
                            ? data.internalStatus.name
                            : ""
                        }
                        fourthcol={
                          data.supplierStatus.name
                            ? data.supplierStatus.name
                            : ""
                        }
                      />
                    );
                  })}
                </>
              ) : (
                <>
                  <ServiceSupplierEditMileComponent
                    setallSupplierData={setallSupplierData}
                    allSupplierData={allSupplierData}
                    setDeletedId={setDeletedId}
                    deletedId={deletedId}
                    title="First Mile"
                    data={_.uniqBy(firstMileData, (e) => e.internalStatus.id)}
                  />
                </>
              )}

              {editCnt ? (
                <>
                  {internationalMileData.map((data, index) => {
                    return (
                      <Tablecompoent
                        rowSpan={internationalMileData.length}
                        firstcol={index === 0 ? "International Mile" : ""}
                        index={index}
                        // secountcol={index >= 2 ? data.customerStatus : ""}
                        secountcol={
                          data.externalStatus ? data.externalStatus : ""
                        }
                        thirthcol={
                          data.internalStatus.name
                            ? data.internalStatus.name
                            : ""
                        }
                        fourthcol={
                          data.supplierStatus.name
                            ? data.supplierStatus.name
                            : ""
                        }
                      />
                    );
                  })}
                </>
              ) : (
                <ServiceSupplierEditMileComponent
                  setallSupplierData={setallSupplierData}
                  allSupplierData={allSupplierData}
                  setDeletedId={setDeletedId}
                  deletedId={deletedId}
                  title="International Mile"
                  data={_.uniqBy(
                    internationalMileData,
                    (e) => e.internalStatus.id
                  )}
                />
              )}

              {editCnt ? (
                <>
                  {thirdMileData.map((data, index) => {
                    return (
                      <Tablecompoent
                        rowSpan={thirdMileData.length}
                        firstcol={index === 0 ? "Last Mile" : ""}
                        index={index}
                        secountcol={
                          data.externalStatus ? data.externalStatus : ""
                        }
                        thirthcol={
                          data.internalStatus.name
                            ? data.internalStatus.name
                            : ""
                        }
                        fourthcol={data.supplierStatus.name}
                      />
                    );
                  })}
                </>
              ) : (
                <ServiceSupplierEditMileComponent
                  setallSupplierData={setallSupplierData}
                  allSupplierData={allSupplierData}
                  setDeletedId={setDeletedId}
                  deletedId={deletedId}
                  title="Last Mile"
                  data={_.uniqBy(thirdMileData, (e) => e.internalStatus.id)}
                />
              )}

              {editCnt ? (
                <>
                  {allMileData.map((data, index) => {
                    return (
                      <Tablecompoent
                        rowSpan={allMileData.length}
                        firstcol={index === 0 ? "All Mile" : ""}
                        index={index}
                        secountcol={
                          data.externalStatus ? data.externalStatus : ""
                        }
                        thirthcol={
                          data.internalStatus.name
                            ? data.internalStatus.name
                            : ""
                        }
                        fourthcol={data.supplierStatus.name}
                      />
                    );
                  })}
                </>
              ) : (
                <ServiceSupplierEditMileComponent
                  setallSupplierData={setallSupplierData}
                  allSupplierData={allSupplierData}
                  setDeletedId={setDeletedId}
                  deletedId={deletedId}
                  title="ALL Mile"
                  data={_.uniqBy(allMileData, (e) => e.internalStatus.id)}
                />
              )}
            </tbody>
          </table>
          {!(StatusDatamap?.length > 0) && (
            <div className="min-h-[35vh] flex items-center justify-center">
              <p className="">No Result Found</p>
            </div>
          )}
        </div>
        {!editCnt && (
          <div className="flex gap-3 flex-wrap mt-5 py-5 justify-end">
            <button
              type="submit"
              onClick={EditHandler}
              disabled={!compareToggle}
              className={`rounded-md ${
                compareToggle
                  ? "bg-blue_primary hover:bg-hoverChange"
                  : "bg-grey_border_table_disable"
              }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none`}
            >
              {mutateIsLoading ? <ButtonSpinner /> : "Save Changes"}
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none hover:bg-grey_bg tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
              onClick={cancelClicked}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* </form> */}
      {isFetching && <Spinner />}
    </div>
  );
}

export default ServiceSupplierStatusMapping;
