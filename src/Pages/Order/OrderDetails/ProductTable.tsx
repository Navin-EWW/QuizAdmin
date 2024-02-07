import { useMutation, useQuery } from "@tanstack/react-query";
import _, { debounce } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import UpArrow from "/icon/uparrow.svg";
import DownArrow from "/icon/downarrow.svg";
import Pagination from "../../../utils/Pagination";
import InputDropDown from "../../../Components/MultipleInputField/InputDropDown";
import EditIcon from "../../../../public/icon/editIcon.svg";
import DeleteIcon from "/icon/delete.svg";
import { DataPopUp } from "../../../utils/Popup";
import UseToast from "../../../hooks/useToast";
import { DeletePackageAPI } from "../../../api/orderDetails/orderDetails.api";

type Props = {
  productsData: any[];
  editCnt: boolean;
  setFieldValue: any;
  refetch: () => void;
  realProductsData: any[];
  currencyArray: any[];
  errorsArray: any;
  tabRedirect: boolean;
  editableFields: any[];
  seteditableFields: any;
};

const productBatteryTypeArray = [
  "PI965 - Lithium ion Batteries",
  "PI966 - Lithium ion batteries packed with equipment",
  "PI967 - Lithium ion batteries contained in equipment",
  "PI968 - lithium metal batteries",
  "PI969 - Lithium metal batteries packed with equipment",
  "PI970 - lithium metal batteries contained in equipment",
];

const ProductTable = ({
  productsData,
  realProductsData,
  editCnt,
  errorsArray,
  seteditableFields,
  editableFields,
  refetch,
  tabRedirect,
  setFieldValue,
  currencyArray,
}: Props) => {
  const [currencyDropDown, setcurrencyDropDown] = useState(false);
  const [services, setservices] = useState<any[]>([]);
  const [current_page, setcurrent_page] = useState<number>(1);
  const [per_page, setper_page] = useState<number>(10);
  const [last_page, setlast_page] = useState<number>(0);
  const [total, settotal] = useState<number>(0);
  const [sortType, setSortType] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  const [sortAction, setsortAction] = useState<boolean>(true);
  const [sortEvent, setsortEvent] = useState<boolean>(true);
  const [sortDiscription, setsortDiscription] = useState<boolean>(true);
  const [editable, seteditable] = useState(false);
  const [deleteId, setdeleteId] = useState("");

  const { mutate: deleteMutate, isLoading: deleteIsLoading } = useMutation(
    DeletePackageAPI,
    {
      onSuccess: (data: any) => {
        if (data?.status) {
          UseToast(data.message, "success");
          refetch();
          setIsOpenDelete(false);
        }
      },
      onError: (data: any) => {
        UseToast(data.message, "error");
        setIsOpenDelete(false);
      },
    }
  );

  const onPageChange = (current_page: number) => {
    setcurrent_page(current_page);
    refechData();
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortType(sortType === "asc" ? "desc" : "asc");
    refechData();
  };

  const refechData = useCallback(
    debounce(() => () => {}, 0),
    []
  );

  const onPageCall = (page: number) => {
    if (last_page >= page && page !== 0) {
      setcurrent_page(page);
      refechData();
    }
  };

  const DeleteOderWithId = () => {
    deleteMutate(deleteId);
  };

  const onChangeValue = (e: any, index: number) => {
    let array = [];

    for (let [i, a] of productsData.entries()) {
      let obj = a;
      let id = e?.id;
      let value = e?.value?.toString();
      if (i === index) {
        obj = { ...a, [id]: value };
      }
      array.push(obj);
    }
    setFieldValue("products", array);
  };

  const editClicked = (index: number, cancel?: boolean) => {
    if (!cancel) {
      let array = [];
      for (let [i, a] of editableFields.entries()) {
        let obj = a;
        if (index === i) {
          obj = { edit: true };
        }
        array.push(obj);
      }
      seteditableFields(array);
    } else {
      const perticularIndexData = realProductsData.find((x, i) => i === index);
      let mainArray = [];
      for (let [i, a] of productsData.entries()) {
        let obj = a;
        if (i === index) {
          obj = perticularIndexData;
        }
        mainArray.push(obj);
      }
      setFieldValue("products", mainArray);

      let editableFieldArray = [];
      for (let [i, a] of editableFields.entries()) {
        let obj = a;
        if (index === i) {
          obj = { edit: false };
        }
        editableFieldArray.push(obj);
      }
      seteditableFields(editableFieldArray);
    }
  };

  const deleteClicked = (index: number, id: string) => {
    setdeleteId(id);
    setIsOpenDelete(true);
  };

  return (
    <div className="mt-2 ">
      <div className="relative overflow-auto">
        <table className="w-full divide-y divide-table_border">
          <thead className="bg-gray-50 uppercase overflow-auto bg-grey_bg text-table_head_color">
            <tr>
              <th
                scope="col"
                className="py-3.5 px-6  text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Descr in Eng
                  </div>
                  {/* <span
                      className="cursor-pointer"
                      onClick={() => setsortAction(!sortAction)}
                    > */}
                  {/* <a
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
                  </a> */}
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-6  text-left text-xs font-medium min-w-[200px] w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Descr in HK
                  </div>
                  {/* <a
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
                  </a> */}
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Descr in TH
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Category
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Unit Price
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Currency
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    quantity
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    HS CODE
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">BRAND</div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6  py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Sale Platform URL
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    Battery Type
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-medium min-w-[220px] w-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="font-Inter text-table_head_color">
                    no. of Battery
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setsortEvent(!sortEvent)}
                  >
                    {/* <a
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
                    </a> */}
                  </span>
                </div>
              </th>
              <th className="sticky right-0 bg-grey_bg">
                <p className="sr-only">view</p>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-grey_border_table bg-white text-sm font-medium text-font_black font-Inter">
            {productsData?.map((item, index) => {
              // const formatedDate = moment(service?.updatedAt).format(
              //   "DD/MM/YYYY HH:mm:ss"
              // );
              return (
                <>
                  {!editableFields[index].edit ? (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productDescriptioninEnglish}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productDescriptionInOriginLanguage}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productDescriptioninDestinationLanguage}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productCategory}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productUnitPrice}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productUnitPriceCurrency}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productQuantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productHSCode}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productBrand}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.salePlatformURL}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productBatteryType}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item?.productNumberofBatteries}
                      </td>
                      {!editCnt ? (
                        <td className="whitespace-nowrap bg-white  px-6 py-4 sticky right-0">
                          <div
                            className="cursor-pointer"
                            onClick={() => editClicked(index)}
                          >
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 45 44"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.75"
                                width="44"
                                height="44"
                                rx="8"
                                fill="#E9ECEF"
                              />
                              <g clip-path="url(#clip0_496_6790)">
                                <path
                                  d="M15.25 26.375V29.5H18.375L27.5917 20.2833L24.4667 17.1583L15.25 26.375ZM30.0083 17.8667C30.3333 17.5417 30.3333 17.0167 30.0083 16.6917L28.0583 14.7417C27.7333 14.4167 27.2083 14.4167 26.8833 14.7417L25.3583 16.2667L28.4833 19.3917L30.0083 17.8667Z"
                                  fill="#969696"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_496_6790">
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="white"
                                    transform="translate(12.75 12)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </td>
                      ) : (
                        <td className="whitespace-nowrap bg-white  px-6 py-4 sticky right-0">
                          <div
                            className="cursor-pointer"
                            onClick={() => deleteClicked(index, item?.id)}
                          >
                            <svg
                              width="18"
                              height="20"
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 5L15.1327 17.1425C15.0579 18.1891 14.187 19 13.1378 19H4.86224C3.81296 19 2.94208 18.1891 2.86732 17.1425L2 5M7 9V15M11 9V15M12 5V2C12 1.44772 11.5523 1 11 1H7C6.44772 1 6 1.44772 6 2V5M1 5H17"
                                stroke="#6B7B80"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr key={index}>
                      <InputEditableBox
                        value={item?.productDescriptioninEnglish}
                        id="productDescriptioninEnglish"
                        name="productDescriptioninEnglish"
                        type="text"
                        maxLength={128}
                        error={errorsArray[index]?.productDescriptioninEnglish}
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        maxLength={128}
                        value={item?.productDescriptionInOriginLanguage}
                        id="productDescriptionInOriginLanguage"
                        name="productDescriptionInOriginLanguage"
                        type="text"
                        error={
                          errorsArray[index]?.productDescriptionInOriginLanguage
                        }
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        maxLength={128}
                        value={item?.productDescriptioninDestinationLanguage}
                        id="productDescriptioninDestinationLanguage"
                        name="productDescriptioninDestinationLanguage"
                        type="text"
                        error={
                          errorsArray[index]
                            ?.productDescriptioninDestinationLanguage
                        }
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        value={item?.productCategory}
                        maxLength={32}
                        id="productCategory"
                        name="productCategory"
                        type="text"
                        error={errorsArray[index]?.productCategory}
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        value={item?.productUnitPrice}
                        id="productUnitPrice"
                        name="productUnitPrice"
                        min={0}
                        type="number"
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-"].includes(e.key) &&
                          e.preventDefault()
                        }
                        error={errorsArray[index]?.productUnitPrice}
                        onChange={(e: any) =>
                          e?.target?.value?.length <= 128 &&
                          onChangeValue(e?.target, index)
                        }
                      />

                      <td className="whitespace-nowrap py-4 px-6">
                        {/* <InputDropDown
                          // disabled={isLoading}
                          noValueHere={_.isEmpty(
                            item?.productUnitPriceCurrency
                          )}
                          text="Select a Currency"
                          onchangeValue={(
                            e: React.ChangeEvent<HTMLInputElement>,
                            text: string
                          ) => {
                            // setFieldValue("insurance.insuranceCurrency", e);
                            // setinsuranceCurrencyDropdown(false);
                          }}
                          divOnClick={() => {
                            // setcurrencyDropdown(false);
                          }}
                          isOpen={currencyDropDown}
                          setIsOpen={setcurrencyDropDown}
                          array={currencyArray}
                          value={item?.productUnitPriceCurrency}
                          id="declaredValue"
                          name="declaredValue"
                          // onchangeValue={onChangeState}
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
                        /> */}
                        <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                          <select
                            // disabled={editCnt || isLoading}

                            id="productUnitPriceCurrency"
                            name="productUnitPriceCurrency"
                            value={item?.productUnitPriceCurrency}
                            onChange={(e: any) =>
                              onChangeValue(e?.target, index)
                            }
                            // onBlur={handleBlur}
                            className={
                              editCnt
                                ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                                : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                            }
                          >
                            {currencyArray?.map((x: any) => {
                              return <option>{x?.name}</option>;
                            })}
                          </select>
                        </div>
                      </td>

                      <InputEditableBox
                        value={item?.productQuantity}
                        id="productQuantity"
                        name="productQuantity"
                        type="number"
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-"].includes(e.key) &&
                          e.preventDefault()
                        }
                        min={0}
                        error={errorsArray[index]?.productQuantity}
                        onChange={(e: any) =>
                          e?.target?.value?.length <= 128 &&
                          onChangeValue(e?.target, index)
                        }
                      />

                      <InputEditableBox
                        value={item?.productHSCode}
                        id="productHSCode"
                        name="productHSCode"
                        type="text"
                        maxLength={16}
                        error={errorsArray[index]?.productHSCode}
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        value={item?.productBrand}
                        id="productBrand"
                        name="productBrand"
                        maxLength={32}
                        type="text"
                        error={errorsArray[index]?.productBrand}
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />

                      <InputEditableBox
                        value={item?.salePlatformURL}
                        id="salePlatformURL"
                        name="salePlatformURL"
                        type="text"
                        maxLength={1024}
                        error={errorsArray[index]?.salePlatformURL}
                        onChange={(e: any) => onChangeValue(e?.target, index)}
                      />
                      <td className="whitespace-nowrap py-4 px-6">
                        <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                          <select
                            // disabled={editCnt || isLoading}

                            id="productBatteryType"
                            name="productBatteryType"
                            value={item?.productBatteryType}
                            onChange={(e: any) =>
                              onChangeValue(e?.target, index)
                            }
                            // onBlur={handleBlur}
                            className={
                              editCnt
                                ? `block w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm  appearance-none`
                                : `block w-full max-w-lg rounded-md border font-normal border-grey_border_table  focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                            }
                          >
                            {productBatteryTypeArray?.map((x: any) => {
                              return <option>{x}</option>;
                            })}
                          </select>
                        </div>
                      </td>

                      <InputEditableBox
                        value={item?.productNumberofBatteries}
                        id="productNumberofBatteries"
                        name="productNumberofBatteries"
                        type="number"
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-"].includes(e.key) &&
                          e.preventDefault()
                        }
                        min={0}
                        error={errorsArray[index]?.productNumberofBatteries}
                        onChange={(e: any) =>
                          e?.target?.value?.length <= 128 &&
                          onChangeValue(e?.target, index)
                        }
                      />
                      {!editCnt && (
                        <td className="whitespace-nowrap bg-white px-3 py-4 sticky right-0">
                          <span className="flex gap-5">
                            <p
                              className="cursor-pointer"
                              onClick={() => {
                                editClicked(index, true);
                              }}
                            >
                              Cancel
                            </p>
                          </span>
                        </td>
                      )}
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          <DataPopUp
            isLoading={deleteIsLoading}
            header={"Delete Order"}
            subHeader={"Are you sure to delete ?"}
            deleteId={"true"}
            open={isOpenDelete}
            error={""}
            onSubmit={DeleteOderWithId}
            setOpen={setIsOpenDelete}
            buttonlevelblue={"Delete"}
            buttonlevelwhite={"Cancel"}
          />
        </table>

        {/* {!services.length && (
            <p className="flex justify-center">No Result Found</p>
          )} */}
      </div>
    </div>
  );
};

export default ProductTable;

type InputEditableBoxProps = {
  value: string;
  id: string;
  name: string;
  type: string;
  onChange?: (e: any) => void;
  error?: string;
  maxLength?: number;
  extraCss?: string;
  min?: number;
  onKeyDown?: (e: any) => void;
};

const InputEditableBox = ({
  value,
  id,
  name,
  maxLength,
  error,
  type,
  extraCss,
  min,
  onKeyDown,
  onChange,
}: InputEditableBoxProps) => {
  return (
    <td
      className={`whitespace-nowrap py-4 relative ${
        extraCss ? extraCss : "px-6"
      }`} 
    >
      <div
        className={`flex py-1.5 px-[13px] focus:outline-none border rounded-md ${
          error ? "border-error_red" : "border-grey_border_table"
        }   focus:bg-transparent bg-transparent`}
      >
        <input
          value={value}
          onChange={onChange}
          id={id}
          name={name}
          min={min}
          maxLength={maxLength}
          type={type}
          onKeyDown={onKeyDown}
          className={`w-full font-Nunito focus:outline-none bg-transparent text-font_black  
                          `}
        />
      </div>
      {error && (
        <span className=" text-sm text-error_red absolute ">{error}</span>
      )}
    </td>
  );
};
