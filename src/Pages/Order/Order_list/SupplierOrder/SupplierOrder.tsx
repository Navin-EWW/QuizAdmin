import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useState, useMemo } from "react";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BookingSupplierOrder,
  ServiceSupplierType,
  StageType,
  SupplierBookingListPerponseType,
  SupplierOrderFilterResponseType,
} from "../../../../types/order";
import _, { debounce } from "lodash";
import moment from "moment";
import Spinner from "../../../../utils/Spinner";
import Pagination from "../../../../utils/Pagination";
import UseToast from "../../../../hooks/useToast";

import Flag from "/icon/flag.svg";
import ColorFlag from "/icon/colorflag.svg";
import { DataPopUp } from "../../../../utils/Popup";
import SupplierSelecter from "../Component/SupplierSelecter";
import { calcLength, useUnmountEffect } from "framer-motion";
import ButtonSpinner from "../../../../utils/ButtonSpinner";
import {
  ExportBookingList,
  SupplierBookingList,
  SupplierOrderFilter,
} from "../../../../api/bulkSupplierOrder/bulkSupplierOrder";
import { UpdateSupplierFlag } from "../../../../api/bulkcustomerorder/bulkcustomerorder";
import DateRangePicker from "../../../../utils/DateRangePicker";
import ShipmentStage from "../Component/ShipmentStage";

type Props = {};

function SupplierOrder({}: Props) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);
  const [filterDate, setFilterDate] = useState("Date");
  const [rangeStart, setRangeStart] = useState(new Date());
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedsupplierName, setselectedSupplierName] = useState<
    ServiceSupplierType[]
  >([]);
  const [supplierNameOpen, setsupplierNameOpen] = useState(false);

  const [supplierBookingListData, setSupplierBookingListData] = useState<
    SupplierBookingListPerponseType[]
  >([]);

  const [filterData, setFilterData] = useState<BookingSupplierOrder>();

  const [shipmentStage, setShipmentStage] = useState<StageType[]>([
    { name: "First Mile", key: "FIRST_MILE" },
    { name: "International Mile", key: "INTERNATIONAL_MILE" },
    { name: "Last Mile", key: "LAST_MILE" },
  ]);
  const [stageOpen, setStageOpen] = useState(false);
  const [selectedstage, setselectedStage] = useState<StageType[]>([]);

  const [SupplierOrderFilterData, setSupplierOrderFilterData] =
    useState<SupplierOrderFilterResponseType>();
  const [createdAtfromDate, setCreatedAtfromDate] = useState<
    Date | null | undefined | any
  >();

  const [createdAttoDate, setCreatedAttoDate] = useState<
    Date | null | undefined | any
  >();

  const [rangeEnd, setRangeEnd] = useState(new Date());

  const pageFilter = (e: any) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    setcurrent_page(1);
    filterRefechData();
  };

  const filterRefechData = useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const onStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    refechData();
  };

  const { mutate, isLoading: isExcelLoading } = useMutation(ExportBookingList, {
    onSuccess: (data) => {
      if (data?.status) {
        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `SupplierBookingList-${Date.now()}.xlsx`);
        document.body.appendChild(link);

        link.click();
        setIsOpen(false);
        UseToast("List Exported !", "success");
      }
    },
    onError: (data) => {},
  });

  const ExportList = () => {
    if (supplierBookingListData.length) {
      mutate(filterData);
    }
  };
  const per_page = 10;

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(
      ["SupplierBookingList"],
      () =>
        SupplierBookingList({
          ...filterData,
          page: current_page,
          createdAtfromDate: createdAtfromDate
            ? new Date(
                moment(createdAtfromDate).utc(createdAtfromDate).valueOf()
              ).toISOString()
            : "",
          createdAttoDate: createdAttoDate
            ? new Date(
                moment(createdAttoDate).utc(createdAttoDate).valueOf()
              ).toISOString()
            : "",
          per_page,
          sortBy,
          sortType,
        }),
      {
        keepPreviousData: true,
        onSuccess(data) {
          if (data.status) {
            setSupplierBookingListData(data?.data);
            setperPageCount(data?.data.length);
            setcurrent_page(data.pagination?.current_page);
            setlast_page(data.pagination.last_page);
            settotal(data.pagination.total);
          }
        },
      }
    );
  const {} = useQuery(["SupplierOrderFilter"], () => SupplierOrderFilter(), {
    keepPreviousData: true,
    onSuccess(data) {
      if (data.status) {
        setSupplierOrderFilterData(data.data);
      }
    },
  });

  const refechData = useCallback(
    debounce(() => refetch(), 0),
    []
  );
  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };
  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };
  const { mutate: UpdateFlag } = useMutation(UpdateSupplierFlag, {
    onSuccess: (data) => {
      if (data?.status) {
        UseToast(data.message, "success");
        refechData();
      }
    },
    onError: (data: any) => {
      UseToast(data.message, "error");
    },
  });

  const onFlagChange = (id: string, status: boolean) => {
    UpdateFlag({ id, status });
  };

  function isSelectedSupplier(value: string | undefined) {
    return selectedsupplierName.find((el) => el.name === value) ? true : false;
  }

  const handleSelectSupplier = (value: any) => {
    if (!isSelectedSupplier(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedsupplierName,
        SupplierOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setselectedSupplierName(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        supplierName: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handlenameDeselect(value);
    }

    setsupplierNameOpen(true);
    setcurrent_page(1);
    refechData();
  };

  function handlenameDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedsupplierName.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      supplierName: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setselectedSupplierName(selectedPersonsUpdated);
    setsupplierNameOpen(true);
    refechData();
  }

  // stage
  function isSelectedStage(value: string | undefined) {
    return selectedstage.find((el) => el.name === value) ? true : false;
  }

  const handleSelectStage = (value: any) => {
    if (!isSelectedStage(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedstage,
        shipmentStage?.find((el) => el.name === value),
      ];
      setselectedStage(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        mile: selectedPersonsUpdated
          .map((item: { key: any }) => item?.key)
          .join(","),
      });
    } else {
      handleStageDeselect(value);
    }

    setStageOpen(true);
    setcurrent_page(1);
    refechData();
  };

  function handleStageDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedstage.filter(
      (el: any) => el.name !== value
    );

    setFilterData({
      ...filterData,
      mile: selectedPersonsUpdated
        .map((item: { key: any }) => item?.key)
        .join(","),
    });
    setselectedStage(selectedPersonsUpdated);
    setStageOpen(true);
    refechData();
  }

  const clearName = () => {
    setFilterData({
      ...filterData,

      supplierName: "",
      // mile:""
    });
    setselectedSupplierName([]);
  };

  const clearmile = () => {
    setFilterData({
      ...filterData,
      mile: "",
    });
    setselectedStage([]);
  };

  useMemo(() => {
    setcurrent_page(1);
    refechData();
  }, [
    selectedsupplierName,
    selectedstage,
    createdAtfromDate && createdAttoDate,
  ]);
  return (
    <>
      <div className="border-y-[1px] px-2 flex border-grey_border_table_disable  flex-row-reverse overflow-auto bg-grey_bg text-table_head_color">
        <div className="py-2 px-4 flex gap-2 items-center">
          <button
            type="button"
            disabled={!(total > 0)}
            className={`bg-[#E3F8F6] px-4 ${
              isExcelLoading ? "py-[8.5px]" : "py-2"
            }  text-blue_primary rounded-md min-w-[117.19px] text-sm ${
              total > 0 ? "cursor-pointer" : "cursor-default"
            }  hover:bg-btnClip_hover  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
            onClick={() => (total > 1000 ? setIsOpen(true) : ExportList())}
          >
            {isExcelLoading ? (
              <ButtonSpinner color="#00145b" />
            ) : (
              "Export Orders"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/order/edit-bulkorder")}
            className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm"
          >
            Bulk Edit
          </button>
        </div>
      </div>
      <div className="relative overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh] ">
        <table className="w-full divide-y divide-table_border">
          <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[130px] w-[130px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="flag"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      flag
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("flag")}
                      >
                        {sortBy === "flag" ? (
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
                  <div className="relative group">
                    <select
                      onChange={(e: any) => onStatus(e)}
                      id="flag"
                      name="flag"
                      className={`bg-transparent border font-Nunito focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1.5 px-[13px] focus:outline-none ${
                        !filterData?.flag
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                      defaultValue="filter"
                    >
                      <option value={""}>Filter</option>
                      <option value={"true"}>Flag</option>
                      <option value={"false"}>Unflag</option>
                    </select>
                    {filterData?.flag && (
                      <XMarkIcon
                        onClick={() => clearSearch("flag")}
                        className="w-4 cursor-pointer h-4 absolute top-1.5 right-5 opacity-0 group-hover:opacity-100"
                      />
                    )}
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium  min-w-[160px] w-[160px]"
              >
                <div className="flex items-center gap-2 min-w-[160px] w-[160px] pb-2">
                  <label
                    htmlFor="last_name"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    merchant code
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("merchantCode")}
                    >
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
                  </span>
                </div>

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.merchantCode}
                    id="merchantCode"
                    type="text"
                    name="merchantCode"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.merchantCode
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.merchantCode && (
                    <XMarkIcon
                      onClick={() => clearSearch("merchantCode")}
                      className="w-4 h-4"
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 min-w-[160px] w-[160px] pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    Customer Order No.
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("customerOrderNo")}
                    >
                      {sortBy === "customerOrderNo" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.customerOrderNo}
                    id="customerOrderNo"
                    type="text"
                    name="customerOrderNo"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.customerOrderNo
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.customerOrderNo && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("customerOrderNo")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[130px] w-[130px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      rule id
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("ruleId")}
                      >
                        {sortBy === "ruleId" ? (
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
                  <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                    <input
                      onChange={pageFilter}
                      value={filterData?.ruleId}
                      id="ruleId"
                      type="text"
                      name="ruleId"
                      placeholder="Search"
                      className={`w-full font-Nunito  focus:outline-none bg-transparent ${
                        !filterData?.ruleId
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    />
                    {filterData?.ruleId && (
                      <XMarkIcon
                        onClick={() => clearSearch("ruleId")}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[220px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      shipment stage
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("mile")}
                      >
                        {sortBy === "mile" ? (
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

                  <ShipmentStage
                    selectedValue={selectedstage}
                    AllData={shipmentStage}
                    isOpen={stageOpen}
                    handleSelect={handleSelectStage}
                    isSelected={isSelectedStage}
                    setSelectedValue={setselectedStage}
                    setIsOpen={setStageOpen}
                    Clear={clearmile}
                    Label="Stage"
                  />
                  {/* <div className="relative group">
                    <select
                      value={filterData?.supplierName}
                      onChange={(e: any) => onStatus(e)}
                      id="supplierName"
                      name="supplierName"
                      className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                        !filterData?.supplierName
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    >
                      <option
                        selected={!Boolean(filterData?.supplierName)}
                        value={""}
                      >
                        Filter
                      </option>
                      {SupplierOrderFilterData?.serviceSupplier?.map(
                        (data, index) => (
                          <option key={index} value={data?.id}>
                            {data.name}
                          </option>
                        )
                      )}
                    </select>
                    {filterData?.supplierName && (
                      <XMarkIcon
                        className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                        onClick={() => clearSearch("supplierName")}
                      />
                    )}
                  </div> */}
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3.5  text-left text-xs font-medium min-w-[170px] w-[170px]"
              >
                <div>
                  <div className="flex items-center w-[170px] gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      Supplier ORDER No.
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("supplierOrderNo")}
                      >
                        {sortBy === "supplierOrderNo" ? (
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
                  <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                    <input
                      onChange={pageFilter}
                      value={filterData?.supplierOrderNo}
                      id="supplierOrderNo"
                      type="text"
                      name="supplierOrderNo"
                      placeholder="Search"
                      className={`w-full font-Nunito focus:outline-none bg-transparent ${
                        !filterData?.supplierOrderNo
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    />
                    {filterData?.supplierOrderNo && (
                      <XMarkIcon
                        onClick={() => clearSearch("supplierOrderNo")}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[220px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      supplier name
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("supplierName")}
                      >
                        {sortBy === "supplierName" ? (
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

                  <SupplierSelecter
                    selectedValue={selectedsupplierName}
                    AllData={SupplierOrderFilterData?.serviceSupplier}
                    isOpen={supplierNameOpen}
                    handleSelect={handleSelectSupplier}
                    isSelected={isSelectedSupplier}
                    setSelectedValue={setselectedSupplierName}
                    setIsOpen={setsupplierNameOpen}
                    clearOnClick={clearName}
                    Label="Supplier Name"
                  />
                  {/* <div className="relative group">
                    <select
                      value={filterData?.supplierName}
                      onChange={(e: any) => onStatus(e)}
                      id="supplierName"
                      name="supplierName"
                      className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                        !filterData?.supplierName
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    >
                      <option
                        selected={!Boolean(filterData?.supplierName)}
                        value={""}
                      >
                        Filter
                      </option>
                      {SupplierOrderFilterData?.serviceSupplier?.map(
                        (data, index) => (
                          <option key={index} value={data?.id}>
                            {data.name}
                          </option>
                        )
                      )}
                    </select>
                    {filterData?.supplierName && (
                      <XMarkIcon
                        className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                        onClick={() => clearSearch("supplierName")}
                      />
                    )}
                  </div> */}
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3.5 min-w-[210px] w-[210px] text-left text-xs font-medium "
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    supplier tracking NO{" "}
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("supplierTrackingNo")}
                    >
                      {sortBy === "supplierTrackingNo" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.supplierTrackingNo}
                    id="supplierTrackingNo"
                    type="text"
                    name="supplierTrackingNo"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.supplierTrackingNo
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.supplierTrackingNo && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("supplierTrackingNo")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 min-w-[210px] w-[210px] text-left text-xs font-medium "
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    Order created date
                  </label>
                  <span>
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
                  </span>
                </div>

                <DateRangePicker
                  rangeStart={createdAtfromDate}
                  setRangeStart={setCreatedAtfromDate}
                  rangeEnd={createdAttoDate}
                  setRangeEnd={setCreatedAttoDate}
                  titlePlaceholder={"Filter"}
                  StartPlaceholder={"Start"}
                  EndPlaceholder={"End"}
                  svgicon={true}
                  // position={"-right-40"}
                  ExtraCss={
                    "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black py-1.5 px-[13px] bg-grey_bg text-base font-medium "
                  }
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[200px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      Supplier Order Status
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("supplierOrderStatus")}
                      >
                        {sortBy === "supplierOrderStatus" ? (
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
                  <div className="relative group">
                    <select
                      value={filterData?.supplierOrderStatus}
                      onChange={(e: any) => onStatus(e)}
                      id="supplierOrderStatus"
                      name="supplierOrderStatus"
                      className={`bg-transparent font-Nunito border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1.5 px-[13px] focus:outline-none ${
                        !filterData?.supplierOrderStatus
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    >
                      <option
                        selected={!Boolean(filterData?.supplierOrderStatus)}
                        value={""}
                      >
                        Filter
                      </option>
                      {SupplierOrderFilterData?.supplierStatus?.map(
                        (data, index) => (
                          <option key={index} value={data.name}>
                            {data.name}
                          </option>
                        )
                      )}
                    </select>
                    {filterData?.supplierOrderStatus && (
                      <XMarkIcon
                        className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                        onClick={() => clearSearch("supplierOrderStatus")}
                      />
                    )}
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[200px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      API Create
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("apiCreate")}
                      >
                        {sortBy === "apiCreate" ? (
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
                  <div className="relative group">
                    <select
                      value={filterData?.apiCreate}
                      onChange={(e: any) => onStatus(e)}
                      id="apiCreate"
                      name="apiCreate"
                      className={`bg-transparent font-Nunito border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1.5 px-[13px] focus:outline-none ${
                        !filterData?.apiCreate
                          ? "text-grey_border"
                          : "text-font_black"
                      }`}
                    >
                      <option
                        selected={!Boolean(filterData?.apiCreate)}
                        value={""}
                      >
                        Filter
                      </option>
                      <option value={"Success"}>Success</option>
                      <option value={"Fail"}>Fail</option>
                      <option value={"Not_Applicable"}>Inapplicable</option>
                      {/* {SupplierOrderFilterData?.supplierStatus?.map(
                        (data, index) => (
                          <option key={index} value={data.name}>
                            {data.name}
                          </option>
                        )
                      )} */}
                    </select>
                    {filterData?.supplierOrderStatus && (
                      <XMarkIcon
                        className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                        onClick={() => clearSearch("supplierOrderStatus")}
                      />
                    )}
                  </div>
                </div>
              </th>

              <th
                scope="col"
                className="px-6 bg-grey_bg py-3.5 text-left text-xs font-medium w-full sticky -right-[1px] min-w-[100%] max-w-[100%]"
              >
                <a href="#" className="sr-only">
                  view
                </a>
              </th>
            </tr>
          </thead>

          <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
            {supplierBookingListData.map((data, index) => {
              const formatedDate = moment(data?.createdAt).format("DD/MM/YYYY");
              const mile = _.startCase(
                data.mile.split("_").join(" ").toLowerCase()
              );
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 px-6">
                    <img
                      className="cursor-pointer"
                      onClick={() => onFlagChange(data.id, !data.flag)}
                      src={data.flag ? Flag : ColorFlag}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                    {data?.merchantCode}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.customerOrderNo}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.ruleId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {mile}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.supplierOrderNo}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.supplierName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.supplierTrackingNo}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {formatedDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {data?.supplierOrderStatus}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    <span
                      className={`block w-full max-w-lg rounded-md font-normal bg-transparent
                       ${
                         data?.apiCreate === "Success" && "text-success_text"
                       } ${data?.apiCreate === "Fail" && "text-error_red"}  ${
                        data?.apiCreate === "Not_Applicable" &&
                        "text-orange_text"
                      } focus:outline-none sm:max-w-xs px-3 text-sm`}
                    >
                      {data?.apiCreate?.trim() === "Not_Applicable"
                        ? "Inapplicable"
                        : data?.apiCreate?.trim()}
                    </span>
                  </td>

                  <td className="whitespace-nowrap sticky right-0 p-0 min-w-[100%] max-w-[100%]">
                    {/* <span className="flex gap-6 py-4 px-6 bg-white"> */}
                    <p
                      className="cursor-pointer py-4 px-6 bg-white text-blue_primary text-sm font-medium text-left"
                      onClick={() => {
                        navigate(`/order/list/${data?.customerOrderId}`, {
                          state: data?.customerOrderId,
                        });
                      }}
                    >
                      View
                    </p>
                    {/* <p
                        className="cursor-pointer text-fail_error text-sm font-medium text-right"
                        onClick={() => {
                        }}
                      >
                        Delete
                      </p>
                    </span> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetching && <Spinner />}
        {!isFetching && !supplierBookingListData.length && (
          <div className="w-full min-h-[55vh] bg-white text-sm  font-medium flex justify-center items-center font-Inter">
            <p className="flex justify-center">No Result Found</p>
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-between bg-white  py-3 md:rounded-b-lg border-t border-grey_border_table font-Inter">
        <div className="sm:flex sm:flex-1 sm:items-center justify-end sm:justify-between">
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
            {/* {adminData.length > 0 && ( */}
            <Pagination last_page={last_page} onPageChange={onPageChange} />
            {/* )} */}
          </div>
        </div>
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
      </div>
      <DataPopUp
        header={"export order"}
        subHeader={
          "You are exporting 1000+ orders. If you wish to narrow down the result, please use the filter or search function above."
        }
        open={isOpen}
        isLoading={isExcelLoading}
        error={""}
        onSubmit={ExportList}
        setOpen={setIsOpen}
        buttonlevelblue={"Continue to Export"}
        buttonlevelwhite={"Cancel"}
      />
    </>
  );
}

export default SupplierOrder;
