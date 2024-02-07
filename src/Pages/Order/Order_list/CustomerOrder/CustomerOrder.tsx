import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import {
  CustomerBookingList,
  CustomerOrderFilter,
  DeleteCustomerOrder,
  ExportBookingList,
  UpdateCustomerFlag,
} from "../../../../api/bulkcustomerorder/bulkcustomerorder";

import UseToast from "../../../../hooks/useToast";
import {
  BookingCustomerOrder,
  CustomerBookingListPerponseType,
  CustomerOrderFilterResponseType,
  CustomerStatusType,
  ServiceSupplierType,
  ExternalStatusType,
  TransportationModeValueType,
} from "../../../../types/order";
import Pagination from "../../../../utils/Pagination";
import Spinner from "../../../../utils/Spinner";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";
import Vehicle from "/icon/vehicle.svg";
// import Vehicle from "/icon/gyvehicle.svg";
import Ship from "/icon/ship.svg";
import Plane from "/icon/plane.svg";
import GyPlane from "/icon/gyplane.svg";
import Flag from "/icon/flag.svg";
import ColorFlag from "/icon/colorflag.svg";
import { DataPopUp } from "../../../../utils/Popup";
import ModeSelecter from "../Component/ModeSelecter";
import ExternalStatusSelecter from "../Component/ExternalStatusSelecter";
import InternalStatusSelecter from "../Component/InternalStatusSelecter";
import FirstMileSelector from "../Component/FirstMileSelector";
import InternationalMileSelector from "../Component/InternationalMileSelector";
import LastMileSelector from "../Component/LastMileSelector";
import _ from "lodash";
import ButtonSpinner from "../../../../utils/ButtonSpinner";
import DateRangePicker from "../../../../utils/DateRangePicker";

function CustomerOrder() {
  const navigate = useNavigate();
  const [orderHidden, setOrderHidden] = useState(true);
  const [deliveryHidden, setDeliveryHidden] = useState(true);
  const [orderCreatedFilterDate, setOrderCreatedFilterDate] = useState("Date");
  const [deliveryFilterDate, setDeliveryFilterDate] = useState("Date");
  const [rangeOrderStart, setRangeOrderStart] = useState(new Date());
  const [rangeDeliveryStart, setRangeDeliveryStart] = useState(new Date());
  const [rangeOrderEnd, setRangeOrderEnd] = useState(new Date());
  const [rangeDeliveryEnd, setRangeDeliveryEnd] = useState(new Date());
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [customerIdDelete, setcustomerIdDelete] = useState<string>("");
  const [CustomerModeOpen, setCustomerModeOpen] = useState<boolean>(false);
  const [selectedCustomerMode, setSelectedCustomerMode] = useState<
    TransportationModeValueType[]
  >([]);
  const [CustomerExternalOpen, setCustomerExternalOpen] = useState(false);
  const [selectedCustomerExternal, setSelectedCustomerExternal] = useState<
    ExternalStatusType[]
  >([]);

  const [CustomerInternalOpen, setCustomerInternalOpen] = useState(false);
  const [selectedCustomerInternal, setSelectedCustomerInternal] = useState<
    CustomerStatusType[]
  >([]);

  const [CustomerFirst_MileOpen, setCustomerFirst_MileOpen] = useState(false);
  const [selectedCustomerFirst_Mile, setSelectedCustomerFirst_Mile] = useState<
    ServiceSupplierType[]
  >([]);
  const [CustomerInt_MileOpen, setCustomerInt_MileOpen] = useState(false);
  const [selectedCustomerInt_Mile, setSelectedCustomerInt_Mile] = useState<
    ServiceSupplierType[]
  >([]);

  const [CustomerLast_MileOpen, setCustomerLast_MileOpen] = useState(false);
  const [selectedCustomerLast_Mile, setSelectedCustomerLast_Mile] = useState<
    ServiceSupplierType[]
  >([]);

  const [filterData, setFilterData] = useState<BookingCustomerOrder>();
  const [customerOrderFilterData, setCustomerOrderFilterData] =
    useState<CustomerOrderFilterResponseType>();

  const [customerBookingListData, setCustomerBookingListData] = useState<
    CustomerBookingListPerponseType[]
  >([]);

  const [createdAtfromDate, setCreatedAtfromDate] = useState<
    Date | null | undefined | any
  >();
  const [createdAttoDate, setCreatedAttoDate] = useState<
    Date | null | undefined | any
  >();

  const [deliveryfromDate, setDeliveryfromDate] = useState<
    Date | null | undefined | any
  >();
  const [deliverytoDate, setDeliverytoDate] = useState<
    Date | null | undefined | any
  >();

  const per_page = 10;

  const pageFilter = (e: any) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    setcurrent_page(1);
    filterRefechData();
  };

  const { dataUpdatedAt, error, isError, isLoading, isFetching, refetch } =
    useQuery(
      ["CustomerBookingList"],
      () =>
        CustomerBookingList({
          ...filterData,

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
          deliveryfromDate: deliveryfromDate
            ? new Date(
                moment(deliveryfromDate).utc(deliveryfromDate).valueOf()
              ).toISOString()
            : "",
          deliverytoDate: deliverytoDate
            ? new Date(
                moment(deliverytoDate).utc(deliverytoDate).valueOf()
              ).toISOString()
            : "",
          page: current_page,
          per_page,
          sortBy,
          sortType,
        }),
      {
        keepPreviousData: true,
        onSuccess(data) {
          if (data.status) {
            setCustomerBookingListData(data.data);
            setperPageCount(data.data.length);
            setcurrent_page(data.pagination?.current_page);
            setlast_page(data.pagination.last_page);
            settotal(data.pagination.total);
          }
        },
      }
    );

  const {} = useQuery(["CustomerOrderFilter"], () => CustomerOrderFilter(), {
    keepPreviousData: true,
    onSuccess(data) {
      if (data.status) {
        setCustomerOrderFilterData(data.data);
      }
    },
  });

  const { mutate, isLoading: isExcelLoading } = useMutation(ExportBookingList, {
    onSuccess: (data) => {
      if (data?.status) {
        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `CustomerBookingList-${Date.now()}.xlsx`);
        document.body.appendChild(link);

        link.click();
        setIsOpen(false);
        UseToast("List Exported !", "success");
      }
    },
    onError: (data) => {},
  });

  const { mutate: UpdateFlag } = useMutation(UpdateCustomerFlag, {
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

  const ExportList = () => {
    if (customerBookingListData.length) {
      mutate(filterData);
    }
  };

  const { mutate: DeleteMutate } = useMutation(DeleteCustomerOrder, {
    onSuccess: (data) => {
      if (data?.status) {
        UseToast(data.message, "success");
        refechData();
        setIsOpenDelete(false);
      }
    },
    onError: (data: any) => {
      UseToast(data.message, "error");
      setIsOpenDelete(false);
    },
  });

  const DeleteOderWithId = () => {
    DeleteMutate({ id: customerIdDelete });
  };

  const onStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    refechData();
  };

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  const refechData = useCallback(
    debounce(() => refetch(), 200),
    []
  );

  const filterRefechData = useCallback(
    debounce(() => refetch(), 1000),
    []
  );

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const clearSearch = (key: string) => {
    setFilterData({ ...filterData, [key]: "" });
    refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const onFlagChange = (id: string, status: boolean) => {
    UpdateFlag({ id, status });
  };

  // mode
  function isSelectedMode(value: string | undefined) {
    return selectedCustomerMode.find((el) => el.value === value) ? true : false;
  }

  const handleSelectMode = (value: any) => {
    if (!isSelectedMode(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerMode,
        customerOrderFilterData?.transportationMode?.values?.find(
          (el) => el.value === value
        ),
      ];
      setSelectedCustomerMode(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        transportationMode: selectedPersonsUpdated
          .map((item: { value: any }) => item?.value)
          .join(","),
      });
    } else {
      handleModeDeselect(value);
    }

    setCustomerModeOpen(true);
    setcurrent_page(1);
  };

  function handleModeDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerMode.filter(
      (el: any) => el.value !== value
    );
    setFilterData({
      ...filterData,
      transportationMode: selectedPersonsUpdated
        .map((item: { value: any }) => item?.value)
        .join(","),
    });
    setSelectedCustomerMode(selectedPersonsUpdated);
    setCustomerModeOpen(true);
  }

  const clearMode = () => {
    setFilterData({
      ...filterData,
      transportationMode: "",
    });
    setSelectedCustomerMode([]);
  };
  // external status

  function isSelectedExternal(value: string | undefined) {
    return selectedCustomerExternal.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectExternal = (value: any) => {
    if (!isSelectedExternal(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerExternal,
        customerOrderFilterData?.externalStatus?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerExternal(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        externalShipmentStatus: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleExternalDeselect(value);
    }
    setCustomerExternalOpen(true);
    setcurrent_page(1);
  };

  function handleExternalDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerExternal.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      externalShipmentStatus: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerExternal(selectedPersonsUpdated);
    setCustomerExternalOpen(true);
  }
  const clearExternal = () => {
    setFilterData({
      ...filterData,
      externalShipmentStatus: "",
    });
    setSelectedCustomerExternal([]);
  };

  function isSelectedInternal(value: string | undefined) {
    return selectedCustomerInternal.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectInternal = (value: any) => {
    if (!isSelectedInternal(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerInternal,
        customerOrderFilterData?.customerStatus?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerInternal(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        internalShipmentStatus: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleInternalDeselect(value);
    }
    setCustomerInternalOpen(true);
    setcurrent_page(1);
  };

  function handleInternalDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerInternal.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      internalShipmentStatus: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerInternal(selectedPersonsUpdated);
    setCustomerInternalOpen(true);
  }
  const clearInternal = () => {
    setFilterData({
      ...filterData,
      internalShipmentStatus: "",
    });
    setSelectedCustomerInternal([]);
  };
  // First_Mile

  function isSelectedFirst_Mile(value: string | undefined) {
    return selectedCustomerFirst_Mile.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectFirst_Mile = (value: any) => {
    if (!isSelectedFirst_Mile(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerFirst_Mile,
        customerOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerFirst_Mile(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        firstMile: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleFirst_MileDeselect(value);
    }
    setCustomerFirst_MileOpen(true);
    setcurrent_page(1);
  };

  function handleFirst_MileDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerFirst_Mile.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      firstMile: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerFirst_Mile(selectedPersonsUpdated);
    setCustomerFirst_MileOpen(true);
  }
  const clearFirst_Mile = () => {
    setFilterData({
      ...filterData,
      firstMile: "",
    });
    setSelectedCustomerFirst_Mile([]);
  };

  // International_Mile

  function isSelectedInt_Mile(value: string | undefined) {
    return selectedCustomerInt_Mile.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectInt_Mile = (value: any) => {
    if (!isSelectedInt_Mile(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerInt_Mile,
        customerOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerInt_Mile(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        internationalMile: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleInt_MileDeselect(value);
    }
    setCustomerInt_MileOpen(true);
    setcurrent_page(1);
  };

  function handleInt_MileDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerInt_Mile.filter(
      (el: any) => el.name !== value
    );
    setSelectedCustomerInt_Mile(selectedPersonsUpdated);

    setFilterData({
      ...filterData,
      internationalMile: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });

    setCustomerInt_MileOpen(true);
  }
  const clearInt_Mile = () => {
    setFilterData({
      ...filterData,
      internationalMile: "",
    });
    setSelectedCustomerInt_Mile([]);
  };

  // Last_Mile

  function isSelectedLast_Mile(value: string | undefined) {
    return selectedCustomerLast_Mile.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectLast_Mile = (value: any) => {
    if (!isSelectedLast_Mile(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerLast_Mile,
        customerOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerLast_Mile(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        lastMile: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleLast_MileDeselect(value);
    }
    setCustomerLast_MileOpen(true);
    setcurrent_page(1);
  };

  function handleLast_MileDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerLast_Mile.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      lastMile: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerLast_Mile(selectedPersonsUpdated);
    setCustomerLast_MileOpen(true);
  }

  const clearLast_Mile = () => {
    setFilterData({
      ...filterData,
      lastMile: "",
    });
    setSelectedCustomerLast_Mile([]);
  };

  useEffect(() => {
    refechData();
  }, [
    selectedCustomerMode,
    selectedCustomerExternal,
    selectedCustomerInternal,
    selectedCustomerFirst_Mile,
    selectedCustomerInt_Mile,
    selectedCustomerLast_Mile,
    createdAttoDate,
    createdAtfromDate,
    deliveryfromDate,
    deliverytoDate,
  ]);

  useEffect(() => {
    setcurrent_page(1);
  }, [createdAttoDate, createdAtfromDate, deliverytoDate, deliveryfromDate]);

  return (
    <>
      <div className="border-y-[1px] border-grey_border_table_disable px-2 flex  flex-row-reverse overflow-auto bg-grey_bg text-table_head_color">
        <div className="py-2 px-4 flex gap-2 items-center">
          <button
            type="button"
            disabled={!(total > 0)}
            className={`bg-[#E3F8F6]  px-4 ${
              isExcelLoading ? "py-[8.5px]" : "py-2"
            }  text-blue_primary rounded-md min-w-[117.19px] text-sm ${
              total > 0 ? "cursor-pointer" : "cursor-default"
            }  hover:bg-btnClip_hover tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in `}
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
            className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
          >
            Bulk Edit
          </button>
        </div>
      </div>
      <div className="relative overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
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
                      className={`bg-transparent border font-Nunito focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary border-grey_border_table rounded-md ${
                        !filterData?.flag
                          ? "text-grey_border"
                          : "text-font_black"
                      } w-full px-[13px] py-1.5 focus:outline-none`}
                      value={filterData?.flag}
                    >
                      <option value={""}>Filter</option>
                      <option value={"true"}>Flag</option>
                      <option value={"false"}>Unflag</option>
                    </select>
                    {filterData?.flag && (
                      <XMarkIcon
                        onClick={() => clearSearch("flag")}
                        className="w-4 h-4 absolute top-1.5 right-5 opacity-0 group-hover:opacity-100"
                      />
                    )}
                  </div>
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium  min-w-[160px] w-[160px]"
              >
                <div className="flex items-center gap-2 min-w-[140px] w-[140px] pb-2">
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
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[160px] w-[160px]"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2">
                    <label
                      htmlFor="Status"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      MODE
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("transportationMode")}
                      >
                        {sortBy === "transportationMode" ? (
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
                  <ModeSelecter
                    AllData={
                      customerOrderFilterData?.transportationMode?.values
                    }
                    selectedValue={selectedCustomerMode}
                    setSelectedValue={setSelectedCustomerMode}
                    isOpen={CustomerModeOpen}
                    setIsOpen={setCustomerModeOpen}
                    isSelected={isSelectedMode}
                    handleSelect={handleSelectMode}
                    Clear={clearMode}
                    Label="Mode"
                  />

                  {/* <div className="relative group">
                    <select
                      value={filterData?.transportationMode}
                      onChange={(e: any) => onStatus(e)}
                      id="transportationMode"
                      name="transportationMode"
                      className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                        !filterData?.transportationMode
                          ? "text-grey_border_table"
                          : "text-font_black"
                      }`}
                    >
                      <option
                        selected={!Boolean(filterData?.transportationMode)}
                        value=""
                      >
                        Filter
                      </option>
                      {customerOrderFilterData?.transportationMode.values?.map(
                        (data, index) => (
                          <option key={index} value={data.value}>
                            {data.value}
                          </option>
                        )
                      )}
                    </select>
                    {filterData?.transportationMode && (
                      <XMarkIcon
                        className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                        onClick={() => clearSearch("transportationMode")}
                      />
                    )}
                  </div> */}
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    origin
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("origin")}
                    >
                      {sortBy === "origin" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.origin}
                    id="origin"
                    type="text"
                    name="origin"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.origin
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.origin && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("origin")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    destination
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("destination")}
                    >
                      {sortBy === "destination" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.destination}
                    id="destination"
                    type="text"
                    name="destination"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.destination
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.destination && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("destination")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5   text-left text-xs font-medium min-w-[210px] w-[210px] "
              >
                <div className="flex items-center min-w-[210px] w-[210px] gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    External Shipment Status
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("externalShipmentStatus")}
                    >
                      {sortBy === "externalShipmentStatus" ? (
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

                <ExternalStatusSelecter
                  AllData={customerOrderFilterData?.externalStatus}
                  selectedValue={selectedCustomerExternal}
                  setSelectedValue={setSelectedCustomerExternal}
                  isOpen={CustomerExternalOpen}
                  setIsOpen={setCustomerExternalOpen}
                  isSelected={isSelectedExternal}
                  handleSelect={handleSelectExternal}
                  Clear={clearExternal}
                  Label="External Status"
                />

                {/* <div className="relative group">
                  <select
                    onChange={(e: any) => onStatus(e)}
                    id="externalShipmentStatus"
                    name="externalShipmentStatus"
                    className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                      !filterData?.externalShipmentStatus
                        ? "text-grey_border_table"
                        : "text-font_black"
                    }`}
                    defaultValue=""
                  >
                    <option value="">Filter</option>
                    {customerOrderFilterData?.externalStatus.map(
                      (data, index) => (
                        <option key={index} value={data?.id}>
                          {data.name}
                        </option>
                      )
                    )}
                  </select>
                  {filterData?.externalShipmentStatus && (
                    <XMarkIcon
                      className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                      onClick={() => clearSearch("externalShipmentStatus")}
                    />
                  )}
                </div> */}
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[210px] w-[210px]"
              >
                <div className="flex items-center gap-2 min-w-[210px] w-[210px] pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    Internal Shipment Status
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("internalShipmentStatus")}
                    >
                      {sortBy === "internalShipmentStatus" ? (
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

                <InternalStatusSelecter
                  AllData={customerOrderFilterData?.customerStatus}
                  selectedValue={selectedCustomerInternal}
                  setSelectedValue={setSelectedCustomerInternal}
                  isOpen={CustomerInternalOpen}
                  setIsOpen={setCustomerInternalOpen}
                  isSelected={isSelectedInternal}
                  handleSelect={handleSelectInternal}
                  Clear={clearInternal}
                  Label="Internal Status"
                />

                {/* <div className="relative group">
                  <select
                    onChange={(e: any) => onStatus(e)}
                    id="internalShipmentStatus"
                    name="internalShipmentStatus"
                    className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                      !filterData?.internalShipmentStatus
                        ? "text-grey_border_table"
                        : "text-font_black"
                    }`}
                    defaultValue="filter"
                  >
                    <option
                      selected={!Boolean(filterData?.internalShipmentStatus)}
                      value=""
                    >
                      Filter
                    </option>
                    {customerOrderFilterData?.customerStatus.map(
                      (data, index) => (
                        <option key={index} value={data?.id}>
                          {data.name}
                        </option>
                      )
                    )}
                  </select>
                  {filterData?.internalShipmentStatus && (
                    <XMarkIcon
                      className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                      onClick={() => clearSearch("internalShipmentStatus")}
                    />
                  )}
                </div> */}
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    rule id
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("routingRuleId")}
                    >
                      {sortBy === "routingRuleId" ? (
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

                <div className="flex py-1 px-6 focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.routingRuleId}
                    id="routingRuleId"
                    type="text"
                    name="routingRuleId"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.routingRuleId
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.routingRuleId && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("routingRuleId")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    First mile
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("firstMile")}
                    >
                      {sortBy === "firstMile" ? (
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
                <FirstMileSelector
                  AllData={customerOrderFilterData?.serviceSupplier}
                  selectedValue={selectedCustomerFirst_Mile}
                  setSelectedValue={setSelectedCustomerFirst_Mile}
                  isOpen={CustomerFirst_MileOpen}
                  setIsOpen={setCustomerFirst_MileOpen}
                  isSelected={isSelectedFirst_Mile}
                  handleSelect={handleSelectFirst_Mile}
                  Clear={clearFirst_Mile}
                  Label="First Mile"
                />
                {/* <div className="relative group">
                  <select
                    onChange={(e: any) => onStatus(e)}
                    id="firstMile"
                    name="firstMile"
                    className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                      !filterData?.firstMile
                        ? "text-grey_border_table"
                        : "text-font_black"
                    }`}
                    defaultValue={filterData?.firstMile}
                  >
                    <option selected={!Boolean(filterData?.firstMile)} value="">
                      Filter
                    </option>
                    {customerOrderFilterData?.serviceSupplier.map(
                      (data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      )
                    )}
                  </select>
                  {filterData?.firstMile && (
                    <XMarkIcon
                      className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                      onClick={() => clearSearch("firstMile")}
                    />
                  )}
                </div> */}
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    order no
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("firstMileOrderNo")}
                    >
                      {sortBy === "firstMileOrderNo" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.firstMileOrderNo}
                    id="firstMileOrderNo"
                    type="text"
                    name="firstMileOrderNo"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.firstMileOrderNo
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.firstMileOrderNo && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("firstMileOrderNo")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[220px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    international
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("internationalMile")}
                    >
                      {sortBy === "internationalMile" ? (
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
                <InternationalMileSelector
                  AllData={customerOrderFilterData?.serviceSupplier}
                  selectedValue={selectedCustomerInt_Mile}
                  setSelectedValue={setSelectedCustomerInt_Mile}
                  isOpen={CustomerInt_MileOpen}
                  setIsOpen={setCustomerInt_MileOpen}
                  isSelected={isSelectedInt_Mile}
                  handleSelect={handleSelectInt_Mile}
                  Clear={clearInt_Mile}
                  Label="International Mile"
                />
                {/* <div className="relative group">
                  <select
                    onChange={(e: any) => onStatus(e)}
                    id="internationalMile"
                    name="internationalMile"
                    className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                      !filterData?.internationalMile
                        ? "text-grey_border_table"
                        : "text-font_black"
                    }`}
                    defaultValue="filter"
                  >
                    <option
                      selected={!Boolean(filterData?.internationalMile)}
                      value=""
                    >
                      Filter
                    </option>
                    {customerOrderFilterData?.serviceSupplier.map(
                      (data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      )
                    )}
                  </select>
                  {filterData?.internationalMile && (
                    <XMarkIcon
                      className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                      onClick={() => clearSearch("internationalMile")}
                    />
                  )}
                </div> */}
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    order no
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("internationalMileOrderNo")}
                    >
                      {sortBy === "internationalMileOrderNo" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.internationalMileOrderNo}
                    id="internationalMileOrderNo"
                    type="text"
                    name="internationalMileOrderNo"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.internationalMileOrderNo
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.internationalMileOrderNo && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("internationalMileOrderNo")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    last mile
                  </label>
                  <span>
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
                  </span>
                </div>
                <LastMileSelector
                  AllData={customerOrderFilterData?.serviceSupplier}
                  selectedValue={selectedCustomerLast_Mile}
                  setSelectedValue={setSelectedCustomerLast_Mile}
                  isOpen={CustomerLast_MileOpen}
                  setIsOpen={setCustomerLast_MileOpen}
                  isSelected={isSelectedLast_Mile}
                  handleSelect={handleSelectLast_Mile}
                  Clear={clearLast_Mile}
                  Label="Last Mile"
                />
                {/* <div className="relative group">
                  <select
                    onChange={(e: any) => onStatus(e)}
                    id="lastMile"
                    name="lastMile"
                    className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none ${
                      !filterData?.lastMile
                        ? "text-grey_border_table"
                        : "text-font_black"
                    }`}
                    defaultValue="filter"
                  >
                    <option selected={!Boolean(filterData?.lastMile)} value="">
                      Filter
                    </option>
                    {customerOrderFilterData?.serviceSupplier.map(
                      (data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      )
                    )}
                  </select>
                  {filterData?.lastMile && (
                    <XMarkIcon
                      className="w-4 h-4 absolute top-1.5 right-4 opacity-0 group-hover:opacity-100"
                      onClick={() => clearSearch("lastMile")}
                    />
                  )}
                </div> */}
              </th>

              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    order no
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("lastMileOrderNo")}
                    >
                      {sortBy === "lastMileOrderNo" ? (
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

                <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                  <input
                    onChange={pageFilter}
                    value={filterData?.lastMileOrderNo}
                    id="lastMileOrderNo"
                    type="text"
                    name="lastMileOrderNo"
                    placeholder="Search"
                    className={`w-full font-Nunito focus:outline-none bg-transparent ${
                      !filterData?.lastMileOrderNo
                        ? "text-grey_border"
                        : "text-font_black"
                    }`}
                  />
                  {filterData?.lastMileOrderNo && (
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => clearSearch("lastMileOrderNo")}
                    />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[160px] w-[160px]"
              >
                <div className="flex items-center min-w-[160px] w-[160px] gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    order created date
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

                <DateRangePicker
                  rangeStart={createdAtfromDate}
                  setRangeStart={setCreatedAtfromDate}
                  rangeEnd={createdAttoDate}
                  setRangeEnd={setCreatedAttoDate}
                  titlePlaceholder={"Filter"}
                  StartPlaceholder={"Start"}
                  EndPlaceholder={"End"}
                  svgicon={true}
                  ExtraCss={
                    "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black py-1.5 px-[13px] bg-grey_bg text-base font-medium "
                  }
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left relative text-xs font-medium min-w-[180px] w-[180px]"
              >
                <div className="flex items-center gap-2 pb-2">
                  <label
                    htmlFor="role"
                    className="font-Inter text-table_head_color uppercase"
                  >
                    delivery date
                  </label>
                  <span>
                    <a
                      className="cursor-pointer"
                      onClick={() => onSort("deliveryDate")}
                    >
                      {sortBy === "deliveryDate" ? (
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

                <DateRangePicker
                  rangeStart={deliveryfromDate}
                  setRangeStart={setDeliveryfromDate}
                  rangeEnd={deliverytoDate}
                  setRangeEnd={setDeliverytoDate}
                  titlePlaceholder={"Filter"}
                  StartPlaceholder={"Start"}
                  EndPlaceholder={"End"}
                  position={"-right-40"}
                  svgicon={true}
                  ExtraCss={
                    "group w-[160px] min-w-[160px] border border-grey_border_table text-font_black py-1.5 px-[13px] bg-grey_bg text-base font-medium "
                  }
                />
              </th>
              <th
                scope="col"
                className="px-6 bg-grey_bg py-3.5 text-left text-xs font-medium w-full sticky -right-[1px] min-w-[100%] max-w-[100%]"
              >
                <a className="sr-only">view</a>
              </th>
            </tr>
          </thead>

          <tbody className="tableclass divide-y divide-grey_border_table bg-white text-sm font-normal text-font_black font-Inter">
            {customerBookingListData.map((order, index) => {
              let formatedCreatedAtDate: string = "";
              if (order.createdAt) {
                formatedCreatedAtDate = moment(order?.createdAt).format(
                  "DD/MM/YYYY"
                );
              }

              let formatedDeliveryDate: string = "";
              if (order.deliveryDate) {
                formatedDeliveryDate = moment(order?.deliveryDate).format(
                  "DD/MM/YYYY"
                );
              }

              return (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 px-6">
                    <img
                      className="cursor-pointer"
                      onClick={() => onFlagChange(order.id, !order.flag)}
                      src={order.flag ? Flag : ColorFlag}
                    />
                  </td>

                  <td className="whitespace-nowrap py-4 px-6">
                    {order.merchantCode}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                    {order.customerOrderNo}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    <img
                      src={
                        order.transportationMode === "Air"
                          ? GyPlane
                          : order.transportationMode === "Land"
                          ? Vehicle
                          : Ship
                      }
                    />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {order.origin}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {/* <span
                      onClick={(e) => StatusHandle(service)}
                      className={`${
                        service?.status === "ACTIVE"
                          ? "text-font_green bg-light_geen"
                          : "text-Incative_red bg-light_red"
                      } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                    > */}
                    {order.destination}
                    {/* </span> */}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                    {order.externalShipmentStatus}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {order.internalShipmentStatus}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {order.routingRuleId}
                  </td>

                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    {order.firstMile}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                    {order.firstMileOrderNo}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {order.internationalMile}
                  </td>

                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    {order.internationalMileOrderNo}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                    {order.lastMile}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {order.lastMileOrderNo}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {formatedCreatedAtDate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                    {/* <span
                      onClick={(e) => StatusHandle(service)}
                      className={`${
                        service?.status === "ACTIVE"
                          ? "text-font_green bg-light_geen"
                          : "text-Incative_red bg-light_red"
                      } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                    > */}
                    {formatedDeliveryDate}
                    {/* </span> */}
                  </td>

                  <td className="whitespace-nowrap sticky right-0 p-0 min-w-[100%] max-w-[100%]">
                    <span className="flex gap-6 py-4 px-6 bg-white">
                      <p
                        className="cursor-pointer text-blue_primary text-sm font-medium text-left"
                        onClick={() => {
                          navigate(`/order/list/${order?.id}`, {
                            state: { state: order?.id, isCustomerOrder: true },
                          });
                        }}
                      >
                        View
                      </p>
                      <p
                        className="cursor-pointer text-fail_error text-sm font-medium text-right"
                        onClick={() => {
                          setcustomerIdDelete(order?.id);
                          setIsOpenDelete(true);
                        }}
                      >
                        Delete
                      </p>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {isFetching && <Spinner />}
        {!isFetching && !customerBookingListData.length && (
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
        isLoading={isExcelLoading}
        open={isOpen}
        error={""}
        onSubmit={ExportList}
        setOpen={setIsOpen}
        buttonlevelblue={"Continue to Export"}
        buttonlevelwhite={"Cancel"}
      />

      <DataPopUp
        header={"Delete Order"}
        subHeader={
          "Are you sure to delete the order? Please cancel the corresponding supplier orders before deleting the order"
        }
        deleteId={"true"}
        open={isOpenDelete}
        error={""}
        onSubmit={DeleteOderWithId}
        setOpen={setIsOpenDelete}
        buttonlevelblue={"Delete"}
        buttonlevelwhite={"Cancel"}
      />
    </>
  );
}

export default CustomerOrder;
