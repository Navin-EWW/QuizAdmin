import { XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CustomerStatusType,
  ExternalStatusType,
  ServiceSupplierType,
  SystemVariableRoutingRuleType,
  TransportationModeValueType,
  routingRuleType,
} from "../../../../types/order";
import Pagination from "../../../../utils/Pagination";
import Spinner from "../../../../utils/Spinner";
import DownArrow from "/icon/downarrow.svg";
import UpArrow from "/icon/uparrow.svg";

import {
  RoutingRuleList,
  RoutingRuleSystemFilter,
} from "../../../../api/routingRule/routingRule";
import { originDestionType } from "../../../../types/routingRule";
import FirstMileSelector from "../../../Order/Order_list/Component/FirstMileSelector";
import InternationalMileSelector from "../../../Order/Order_list/Component/InternationalMileSelector";
import LastMileSelector from "../../../Order/Order_list/Component/LastMileSelector";
import ModeSelecter from "../../../Order/Order_list/Component/ModeSelecter";

interface props {
  editCnt: boolean;
  refechstate: boolean;
  seteditCnt: React.Dispatch<boolean>;
  filterOriginDestiion: originDestionType | undefined;
  // refechData: (value:any)=>void;
}

function CustomRoutes({
  editCnt,
  seteditCnt,
  filterOriginDestiion,
  refechstate,
}: props) {
  const navigate = useNavigate();
  const [current_page, setcurrent_page] = useState<number>(1);
  const [perPageCount, setperPageCount] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState("asc");
  const [sortBy, setSortBy] = useState("code");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [CustomerModeOpen, setCustomerModeOpen] = useState<boolean>(false);
  const [selectedCustomerMode, setSelectedCustomerMode] = useState<
    TransportationModeValueType[]
  >([]);

  const [selectedCustomerExternal, setSelectedCustomerExternal] = useState<
    ExternalStatusType[]
  >([]);

  const [selectedCustomerInternal, setSelectedCustomerInternal] = useState<
    CustomerStatusType[]
  >([]);

  const [CustomerFirst_MileOpen, setCustomerFirst_MileOpen] =
    useState<boolean>(false);
  const [selectedCustomerFirst_Mile, setSelectedCustomerFirst_Mile] = useState<
    ServiceSupplierType[]
  >([]);

  const [CustomerInt_MileOpen, setCustomerInt_MileOpen] =
    useState<boolean>(false);
  const [selectedCustomerInt_Mile, setSelectedCustomerInt_Mile] = useState<
    ServiceSupplierType[]
  >([]);

  const [CustomerLast_MileOpen, setCustomerLast_MileOpen] =
    useState<boolean>(false);
  const [selectedCustomerLast_Mile, setSelectedCustomerLast_Mile] = useState<
    ServiceSupplierType[]
  >([]);

  const [CustomerExport_CustomOpen, setCustomerExport_CustomOpen] =
    useState<boolean>(false);
  const [selectedCustomerExport_Custom, setSelectedCustomerExport_Custom] =
    useState<ServiceSupplierType[]>([]);

  const [CustomerImport_CustomOpen, setCustomerImport_CustomOpen] =
    useState<boolean>(false);
  const [selectedCustomerImport_Custom, setSelectedCustomerImport_Custom] =
    useState<ServiceSupplierType[]>([]);

  const [filterData, setFilterData] = useState<any>({});

  const [customerOrderFilterData, setCustomerOrderFilterData] =
    useState<SystemVariableRoutingRuleType>();

  const [customerBookingListData, setCustomerBookingListData] = useState<
    routingRuleType[]
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

  const pageFilter = (e: any) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
    setcurrent_page(1);
    refechData();
  };

  const { error, isFetching, isError, isLoading, refetch } = useQuery(
    ["RoutingRuleList"],
    () =>
      RoutingRuleList({
        page: current_page,
        per_page: perPageCount,
        sortBy: sortBy,
        defaultRule: "false",
        sortType: sortType,
        routingRuleId: filterData?.routingRuleId,
        transportationMode: filterData?.transportationMode,
        productType: filterData?.productType,
        pickup: filterData?.pickup,
        firstMileServiceSupplier: filterData?.firstMileServiceSupplier,
        internationalMileServiceSupplier:
          filterData?.internationalMileServiceSupplier || "",
        exportCustomerClearenceSupplier:
          filterData.exportCustomerClearenceSupplier || "",
        importCustomerClearenceSupplier:
          filterData?.importCustomerClearenceSupplier || "",
        lastMileServiceSupplier: filterData.lastMileServiceSupplier || "",
        ...filterOriginDestiion,
      }),
    {
      keepPreviousData: true,
      onSuccess(data) {
        if (data.status) {
          setCustomerBookingListData(data.data);
          settotal(data.pagination?.total);
          setlast_page(data.pagination?.last_page);
        }
      },
    }
  );

  useQuery(["RoutingRuleSystemFilter"], () => RoutingRuleSystemFilter(), {
    keepPreviousData: true,
    onSuccess(data) {
      if (data.status) {
        setCustomerOrderFilterData(data?.data);
      }
    },
  });

  // const { mutate, isLoading: isExcelLoading } = useMutation(ExportBookingList, {
  //   onSuccess: (data) => {
  //     if (data?.status) {
  //     }
  //   },
  //   onError: (data) => {},
  // });

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

  useEffect(() => {
    refechData();
  }, [refechstate]);

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
        firstMileServiceSupplier: selectedPersonsUpdated
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
      firstMileServiceSupplier: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerFirst_Mile(selectedPersonsUpdated);
    setCustomerFirst_MileOpen(true);
  }
  const clearFirst_Mile = () => {
    setFilterData({
      ...filterData,
      firstMileServiceSupplier: "",
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
        internationalMileServiceSupplier: selectedPersonsUpdated
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
      internationalMileServiceSupplier: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });

    setCustomerInt_MileOpen(true);
  }
  const clearInt_Mile = () => {
    setFilterData({
      ...filterData,
      internationalMileServiceSupplier: "",
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
        lastMileServiceSupplier: selectedPersonsUpdated
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
      lastMileServiceSupplier: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerLast_Mile(selectedPersonsUpdated);
    setCustomerLast_MileOpen(true);
  }

  const clearLast_Mile = () => {
    setFilterData({
      ...filterData,
      lastMileServiceSupplier: "",
    });
    setSelectedCustomerLast_Mile([]);
  };

  // EXPORT CUSTOM

  function isSelectedExport_Custom(value: string | undefined) {
    return selectedCustomerExport_Custom.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectExport_Custom = (value: any) => {
    if (!isSelectedExport_Custom(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerExport_Custom,
        customerOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerExport_Custom(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        exportCustomerClearenceSupplier: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleExport_CustomDeselect(value);
    }
    setCustomerExport_CustomOpen(true);
    setcurrent_page(1);
  };

  function handleExport_CustomDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerExport_Custom.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      exportCustomerClearenceSupplier: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerExport_Custom(selectedPersonsUpdated);
    setCustomerExport_CustomOpen(true);
  }

  const clearExport_Custom = () => {
    setFilterData({
      ...filterData,
      exportCustomerClearenceSupplier: "",
    });
    setSelectedCustomerExport_Custom([]);
  };

  // IMPORT CUSTOM

  function isSelectedImport_Custom(value: string | undefined) {
    return selectedCustomerImport_Custom.find((el) => el.name === value)
      ? true
      : false;
  }

  const handleSelectImport_Custom = (value: any) => {
    if (!isSelectedImport_Custom(value)) {
      const selectedPersonsUpdated: any = [
        ...selectedCustomerImport_Custom,
        customerOrderFilterData?.serviceSupplier?.find(
          (el) => el.name === value
        ),
      ];
      setSelectedCustomerImport_Custom(selectedPersonsUpdated);
      setFilterData({
        ...filterData,
        importCustomerClearenceSupplier: selectedPersonsUpdated
          .map((item: { id: any }) => item?.id)
          .join(","),
      });
    } else {
      handleImport_CustomDeselect(value);
    }
    setCustomerImport_CustomOpen(true);
    setcurrent_page(1);
  };

  function handleImport_CustomDeselect(value: any) {
    const selectedPersonsUpdated: any = selectedCustomerImport_Custom.filter(
      (el: any) => el.name !== value
    );
    setFilterData({
      ...filterData,
      importCustomerClearenceSupplier: selectedPersonsUpdated
        .map((item: { id: any }) => item?.id)
        .join(","),
    });
    setSelectedCustomerImport_Custom(selectedPersonsUpdated);
    setCustomerImport_CustomOpen(true);
  }

  const clearImport_Custom = () => {
    setFilterData({
      ...filterData,
      importCustomerClearenceSupplier: "",
    });
    setSelectedCustomerImport_Custom([]);
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
    selectedCustomerImport_Custom,
    selectedCustomerExport_Custom,
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
      <div className="relative overflow-auto sm:min-h-[65vh] 2xl:min-h-[15vh]">
        {
          <table className="w-full divide-y divide-table_border">
            <thead className="bg-gray-50 overflow-auto bg-grey_bg text-table_head_color">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium min-w-[130px] w-[130px]"
                >
                  <div>
                    <div className="flex items-center gap-2 pb-[37px]">
                      <label
                        htmlFor="flag"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        No.
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("code")}
                        >
                          {sortBy === "code" ? (
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
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium  min-w-[190px] w-[190px]"
                >
                  <div className="flex items-center gap-2 min-w-[99px] w-[99px] pb-2">
                    <label
                      htmlFor="routingRuleId"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      Rule ID
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("code")}
                      >
                        {sortBy === "code" ? (
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

                  <div className="flex py-1 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
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
                        onClick={() => clearSearch("routingRuleId")}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium min-w-[180px] w-[180px]"
                >
                  <div className="flex items-center gap-2 min-w-[142px] w-[142px] pb-2">
                    <label
                      htmlFor="role"
                      className="font-Inter text-table_head_color uppercase"
                    >
                      Transportation
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
                    extraCss="py-1"
                    setSelectedValue={setSelectedCustomerMode}
                    isOpen={CustomerModeOpen}
                    setIsOpen={setCustomerModeOpen}
                    isSelected={isSelectedMode}
                    handleSelect={handleSelectMode}
                    Clear={clearMode}
                    Label="Mode"
                  />
                </th>

                <th
                  scope="col"
                  className="py-1 px-6 text-left text-xs font-medium min-w-[160px] w-[160px]"
                >
                  <div>
                    <div className="flex items-center gap-2 min-w-[125px] w-[125px] pb-2">
                      <label
                        htmlFor="Status"
                        className="font-Inter text-table_head_color uppercase"
                      >
                        Product Type
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("productType")}
                        >
                          {sortBy === "productType" ? (
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
                        value={filterData?.productType}
                        onChange={(e: any) => onStatus(e)}
                        id="productType"
                        name="productType"
                        className={`bg-transparent border focus:text-font_black active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table w-full py-1 pl-3 pr-3 focus:outline-none ${
                          !filterData?.productType
                            ? "text-grey_border"
                            : "text-font_black"
                        }`}
                      >
                        <option
                          selected={!Boolean(filterData?.productType)}
                          value=""
                        >
                          Filter
                        </option>
                        {customerOrderFilterData?.packageType.values?.map(
                          (item, index) => (
                            <option value={item.id}>{item.value}</option>
                          )
                        )}
                      </select>
                      {filterData?.productType && (
                        <XMarkIcon
                          className="w-4 h-4 absolute top-1.5 right-5 opacity-0 group-hover:opacity-100"
                          onClick={() => clearSearch("productType")}
                        />
                      )}
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-medium min-w-[130px] w-[130px]"
                >
                  <div>
                    <div className="flex items-center gap-2 pb-2">
                      <label
                        htmlFor="Status"
                        className="font-Inter text-table_head_color"
                      >
                        PICKUP
                      </label>
                      <span>
                        <a
                          className="cursor-pointer"
                          onClick={() => onSort("pickup")}
                        >
                          {sortBy === "pickup" ? (
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
                    <div className="relative group">
                      <select
                        onChange={(e: any) => onStatus(e)}
                        value={filterData?.pickup}
                        id="pickup"
                        name="pickup"
                        className={`bg-transparent border ${
                          !filterData?.pickup
                            ? "text-grey_border"
                            : "text-font_black"
                        } active:text-font_black hover:border-blue_primary active:border-blue_primary  rounded-md border-grey_border_table  w-full py-1 pl-3 pr-3 focus:outline-none`}
                      >
                        <option value="">Filter</option>
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
                      </select>
                      {filterData?.pickup && (
                        <XMarkIcon
                          className="w-4 h-4 absolute top-1.5 right-5 opacity-0 group-hover:opacity-100"
                          onClick={() => clearSearch("pickup")}
                        />
                      )}
                    </div>
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
                      FIRST MILE
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("firstMileServiceSupplier")}
                      >
                        {sortBy === "firstMileServiceSupplier" ? (
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
                    extraCss="py-1"
                  />
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
                      INTERNATIONAL
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSort("internationalMileServiceSupplier")
                        }
                      >
                        {sortBy === "internationalMileServiceSupplier" ? (
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
                    extraCss="py-1"
                  />
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
                      LAST MILE
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() => onSort("lastMileServiceSupplier")}
                      >
                        {sortBy === "lastMileServiceSupplier" ? (
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
                    divOnClick={() => {
                      setCustomerImport_CustomOpen(false);
                      setCustomerExport_CustomOpen(false);
                    }}
                    AllData={customerOrderFilterData?.serviceSupplier}
                    selectedValue={selectedCustomerLast_Mile}
                    setSelectedValue={setSelectedCustomerLast_Mile}
                    isOpen={CustomerLast_MileOpen}
                    setIsOpen={setCustomerLast_MileOpen}
                    isSelected={isSelectedLast_Mile}
                    handleSelect={handleSelectLast_Mile}
                    Clear={clearLast_Mile}
                    Label="Last Mile"
                    extraCss="py-1"
                  />
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
                      EXPORT CUSTOM
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSort("exportCustomerClearenceSupplier")
                        }
                      >
                        {sortBy === "exportCustomerClearenceSupplier" ? (
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
                    divOnClick={() => {
                      setCustomerImport_CustomOpen(false);
                      setCustomerLast_MileOpen(false);
                    }}
                    AllData={customerOrderFilterData?.serviceSupplier}
                    selectedValue={selectedCustomerExport_Custom}
                    setSelectedValue={setSelectedCustomerExport_Custom}
                    isOpen={CustomerExport_CustomOpen}
                    setIsOpen={setCustomerExport_CustomOpen}
                    isSelected={isSelectedExport_Custom}
                    handleSelect={handleSelectExport_Custom}
                    Clear={clearExport_Custom}
                    Label="Export Custom"
                    extraCss="py-1"
                  />
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
                      IMPORT CUSTOM
                    </label>
                    <span>
                      <a
                        className="cursor-pointer"
                        onClick={() =>
                          onSort("importCustomerClearenceSupplier")
                        }
                      >
                        {sortBy === "importCustomerClearenceSupplier" ? (
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
                    divOnClick={() => {
                      setCustomerExport_CustomOpen(false);
                      setCustomerLast_MileOpen(false);
                    }}
                    AllData={customerOrderFilterData?.serviceSupplier}
                    selectedValue={selectedCustomerImport_Custom}
                    setSelectedValue={setSelectedCustomerImport_Custom}
                    isOpen={CustomerImport_CustomOpen}
                    
                    setIsOpen={setCustomerImport_CustomOpen}
                    isSelected={isSelectedImport_Custom}
                    handleSelect={handleSelectImport_Custom}
                    Clear={clearImport_Custom}
                    Label="Import Custom"
                    extraCss="py-1"
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
              {customerBookingListData?.map((order, index) => {
                const pagesValue =
                  current_page * 10 > total ? total : current_page * 10;
                return (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 px-6">
                      {/* {sortType !== "desc"
                        ? current_page * 10 - 10 + index + 1
                        : pagesValue - index} */}
                      {current_page * 10 - 10 + index + 1}
                    </td>
                    <td className="whitespace-nowrap py-4 px-6">
                      {order.routingRuleId}
                    </td>
                    {/* {!editCnt ? (
                      <td className="whitespace-nowrap py-4 px-6">
                        {order.routingRuleId}
                      </td>
                    ) : (
                      <td className="whitespace-nowrap px-6 py-3 lg:table-cell">
                        <div className="flex py-1.5 px-[13px] focus:outline-none border rounded-md border-grey_border_table focus:bg-transparent bg-transparent">
                          <input
                            value={order.routingRuleId}
                            id="routingRuleId"
                            name="routingRuleId"
                            type="text"
                            className={`w-full font-Nunito focus:outline-none bg-transparent text-font_black`}
                          />
                        </div>
                      </td>
                    )} */}

                    <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                      {order.transportationMode}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      {order.productType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      <span
                        className={`${
                          order.pickup
                            ? "text-font_green bg-light_geen"
                            : "text-Incative_red bg-light_red"
                        } rounded-full px-6 py-1 text-xs font-medium cursor-pointer`}
                      >
                        {order.pickup ? "True" : "False"}{" "}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      {order?.firstMileServiceSupplier
                        ? order.firstMileServiceSupplier
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      {order?.internationalMileServiceSupplier
                        ? order.internationalMileServiceSupplier
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 lg:table-cell">
                      {order.lastMileServiceSupplier
                        ? order.lastMileServiceSupplier
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      {order?.exportCustomerClearenceSupplier
                        ? order.exportCustomerClearenceSupplier
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 sm:table-cell">
                      {order?.importCustomerClearenceSupplier
                        ? order.importCustomerClearenceSupplier
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap  text-blue_primary text-sm font-medium text-left sticky right-0 p-0 min-w-[100%] max-w-[100%]">
                      <p
                        className="cursor-pointer py-4 px-6 bg-white"
                        onClick={() => {
                          navigate(`/routing-rule/list/${order?.id}`, {
                            state: { state: order?.id },
                          });
                        }}
                      >
                        View
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
        {/* {editCnt && (
          <div className="m-3">
            <a
              onClick={() => navigate("/order/add")}
              className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
            >
              + New Rule
            </a>
          </div>
        )} */}

        {isFetching && <Spinner />}

        {!isFetching && !customerBookingListData?.length && (
          <div className="w-full min-h-[55vh] bg-white text-sm  font-medium flex justify-center items-center font-Inter">
            <p className="flex justify-center">No Result Found</p>
          </div>
        )}
      </div>

      {!editCnt && (
        <div className="flex gap-4 items-center flex-wrap justify-center bg-white py-3 md:rounded-b-lg border-t border-grey_border_table font-Inter">
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
          {customerBookingListData?.length > 0 && (
            <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-table_head_color font-normal">
                  Showing
                  <span className=""> {current_page * 10 - 10 + 1} </span>
                  to{" "}
                  <span className="">
                    {" "}
                    {total < 10
                      ? total
                      : current_page * 10 + perPageCount - 10}{" "}
                  </span>{" "}
                  of
                  <span className=""> {total} </span> results
                </p>
              </div>
              <div className="hidden sm:block">
                <Pagination last_page={last_page} onPageChange={onPageChange} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CustomRoutes;
