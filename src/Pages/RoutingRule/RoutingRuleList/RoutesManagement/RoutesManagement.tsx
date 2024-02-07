import { useMutation, useQuery } from "@tanstack/react-query";
import _, { every, isEmpty, isUndefined } from "lodash";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { DialogBox } from "../../../../Components/DialogBox/DialogBox";
import InputDropDown from "../../../../Components/MultipleInputField/InputDropDown";
import {
  CitiesDetails,
  CountriesDetails,
  StatesDetails,
} from "../../../../api/orderDetails/orderDetails.api";
import { RoutingRulebulkEdit } from "../../../../api/routingRule/routingRule";
import { useCallbackPrompt } from "../../../../hooks/useCallbackPrompt";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import { useRoutingStore } from "../../../../store/routingRuleFilter";
import { routingRuleType } from "../../../../types/order";
import { originDestionType } from "../../../../types/routingRule";
import "../../../../utils/Pagination.css";
import { DataPopUp } from "../../../Order/CreateOrder/DataPopUp/DataPopUp";
import CustomRoutes from "./CustomRoutes";
import DefaultRoutes from "./DefaultRoutes";

const tab = [
  { name: "Default Routes", href: "#", current: true },
  { name: "Custom Routes", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function RoutesManagement() {
  const { filterAllData, setDataAllFilter, removeAll } = useRoutingStore();
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  const [editCnt, seteditCnt] = useState<boolean>(false);
  const [refechstate, setrefechstate] = useState<boolean>(false);
  const [originCountryToggle, setoriginCountryToggle] =
    useState<boolean>(false);
  const [originProvinceToggle, setoriginProvinceToggle] =
    useState<boolean>(false);
  const [originCityToggle, setoriginCityToggle] = useState<boolean>(false);
  const [destinationCountryToggle, setdestinationCountryToggle] =
    useState<boolean>(false);
  const [destinationProvinceToggle, setdestinationProvinceToggle] =
    useState<boolean>(false);
  const [destinationCityToggle, setdestinationCityToggle] =
    useState<boolean>(false);
  const [selectedoriginCountry, setselectedoriginCountry] = useState<string>(
    filterAllData.originCountry ? filterAllData.originCountry : ""
  );
  const [selectedoriginProvince, setselectedoriginProvince] = useState<string>(
    filterAllData.originProvince ? filterAllData.originProvince : ""
  );
  const [selectedoriginCity, setselectedoriginCity] = useState<string>(
    filterAllData.originCity ? filterAllData.originCity : ""
  );
  const [selectedDestinationCountry, setselectedDestinationCountry] =
    useState<string>(
      filterAllData.destinationCountry ? filterAllData.destinationCountry : ""
    );
  const [selectedDestinationProvince, setselectedDestinationProvince] =
    useState<string>(
      filterAllData.destinationProvince ? filterAllData.destinationProvince : ""
    );
  const [selectedDestinationCity, setselectedDestinationCity] =
    useState<string>(
      filterAllData.destinationCity ? filterAllData.destinationCity : ""
    );
  const [customerBookingListData, setCustomerBookingListData] = useState<
    routingRuleType[]
  >([]);
  const [oldCustomerBookingListData, setOldCustomerBookingListData] = useState<
    routingRuleType[]
  >([]);
  const [refetchTheDefaultRoutesData, setrefetchTheDefaultRoutesData] =
    useState(false);

  let compareToggle = !_.isEqual(
    customerBookingListData,
    oldCustomerBookingListData
  );
  const [cancelModel, setcancelModel] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(compareToggle);
  const [countriesDetails, setcountriesDetails] = useState<any[]>([]);
  const [stateDetails, setstateDetails] = useState<any[]>([]);
  const [cityDetails, setcityDetails] = useState<any[]>([]);
  const [destinationStateDetails, setdestinationStateDetails] = useState<any[]>(
    []
  );
  const [tabRedirect, settabRedirect] = useState<boolean>(false);
  const [tabToggle, settabToggle] = useState<any>();
  const [destinationCityDetails, setdestinationCityDetails] = useState<any[]>(
    []
  );
  const [routingRuleUpdatePopUp, setroutingRuleUpdatePopUp] = useState(false);

  const [filterOriginDestiion, setfilterOriginDestiion] =
    useState<originDestionType>();
  let originProvince: boolean = true;
  let originCity: boolean = true;

  const navigate = useNavigate();

  let bulkEditArray: any = [];

  for (let [i, a] of customerBookingListData.entries()) {
    if (a?.id !== oldCustomerBookingListData[i]?.id) {
      bulkEditArray.push({
        defaultRuleId: oldCustomerBookingListData[i]?.id,
        backupRuleId: a?.id,
      });
    }
  }

  useQuery(["fetchCountryVariables"], () => CountriesDetails(), {
    onSuccess(data: any) {
      setcountriesDetails(data?.data);
      const findIdCountry: any = data?.data?.find(
        (x: any) => x?.iso2 === selectedoriginCountry
      );
      stateMutate(findIdCountry?.id);
    },
    onError(error: any) {},
  });

  const { mutate: stateMutate } = useMutation(StatesDetails, {
    onSuccess: (data: any) => {
      if (data?.status) {
        if (originProvince) {
          setstateDetails(data?.data);
          setcityDetails([]);
        } else {
          setdestinationStateDetails(data?.data);
          setdestinationCityDetails([]);
        }
      }
    },
    onError: (data) => {},
  });

  const { mutate: cityMutate } = useMutation(CitiesDetails, {
    onSuccess: (data: any) => {
      if (data?.status) {
        if (originCity) {
          setcityDetails(data?.data);
        } else {
          setdestinationCityDetails(data?.data);
        }
      }
    },
    onError: (data) => {},
  });

  const { mutate: bulkEditMutate } = useMutation(RoutingRulebulkEdit, {
    onSuccess: (data: any) => {
      setrefetchTheDefaultRoutesData(!refetchTheDefaultRoutesData);
      seteditCnt(false);
    },
    onError: (data) => {},
  });

  const changeCountry = (iso2: string, isDestination?: boolean) => {
    const findIdCountry: any = countriesDetails?.find(
      (x: any) => x?.iso2 === iso2
    );
    if (!isDestination) {
      originProvince = true;
      stateMutate(findIdCountry?.id);
      setselectedoriginCountry(iso2);
      setselectedoriginProvince("");
      setselectedoriginCity("");
      setoriginCountryToggle(false);
    } else {
      originProvince = false;
      stateMutate(findIdCountry?.id);
      setselectedDestinationCountry(iso2);
      setselectedDestinationCity("");
      setdestinationCountryToggle(false);
      setselectedDestinationProvince("");
    }
  };

  const changeProvince = (province: string, isDestination?: boolean) => {
    if (!isDestination) {
      const findOriginStateID = stateDetails?.find(
        (x: any) => x?.name.trim() === province.trim()
      );
      originCity = true;
      setselectedoriginCity("");
      cityMutate(findOriginStateID?.id);
      setoriginProvinceToggle(false);
      setselectedoriginProvince(province);
    } else {
      const findDestinationStateID = destinationStateDetails?.find(
        (x: any) => x?.name.trim() === province.trim()
      );
      originCity = false;
      setselectedDestinationProvince(province);
      setselectedDestinationCity("");
      setdestinationProvinceToggle(false);
      cityMutate(findDestinationStateID?.id);
    }
  };

  useDidMountEffect(() => {
    // react please run me if 'key' changes, but not on initial render
    const areAllValuesBlank = every(filterAllData, (value) => isEmpty(value));
    if (isUndefined(filterAllData) || areAllValuesBlank) {
      // Object is empty or undefined
    } else {
      filterOriginAndDestination();
    }
  }, [countriesDetails]);

  const filterOriginAndDestination = () => {
    const originCountryId = countriesDetails.find(
      (item: any) =>
        item?.iso2?.toLowerCase()?.trim() ===
        selectedoriginCountry.toLowerCase()?.trim()
    );

    const originProvinceId = stateDetails.find((item: any) => {
      if (
        item.name?.toLowerCase()?.trim() ===
        selectedoriginProvince.toLowerCase()?.trim()
      ) {
        return item;
      }
    });

    const originCityId = cityDetails.find((item: any) => {
      if (
        item.name?.toLowerCase()?.trim() ===
        selectedoriginCity.toLowerCase()?.trim()
      ) {
        return item;
      }
    });

    const DestinationCountryId = countriesDetails.find(
      (item: any) =>
        item?.iso2?.toLowerCase()?.trim() ===
        selectedDestinationCountry.toLowerCase()?.trim()
    );

    const DestinationProvinceId = destinationStateDetails.find((item: any) => {
      if (
        item.name?.toLowerCase()?.trim() ===
        selectedDestinationProvince.toLowerCase()?.trim()
      ) {
        return item;
      }
    });

    const DestinationCityId = destinationCityDetails.find((item: any) => {
      if (
        item?.name?.toLowerCase()?.trim() ===
        selectedDestinationCity?.toLowerCase()?.trim()
      ) {
        return item;
      }
    });

    setfilterOriginDestiion({
      originCountry: originCountryId ? originCountryId.id : "",
      originProvince: originProvinceId ? originProvinceId.id : "",
      originCity: originCityId ? originCityId.id : "",
      destinationCountry: DestinationCountryId ? DestinationCountryId.id : "",
      destinationProvince: DestinationProvinceId
        ? DestinationProvinceId.id
        : "",
      destinationCity: DestinationCityId ? DestinationCityId.id : "",
    });

    setDataAllFilter({
      originCountry: selectedoriginCountry ? selectedoriginCountry : "",
      originProvince: selectedoriginProvince ? selectedoriginProvince : "",
      originCity: selectedoriginCity ? selectedoriginCity : "",
      destinationCountry: selectedDestinationCountry
        ? selectedDestinationCountry
        : "",
      destinationProvince: selectedDestinationProvince
        ? selectedDestinationProvince
        : "",
      destinationCity: selectedDestinationCity ? selectedDestinationCity : "",
    });

    setrefechstate(!refechstate);
  };

  const ClearAllValue = () => {
    // if (!(isUndefined(filterOriginDestiion) || isEmpty(filterOriginDestiion))) {
    // if (!_.isEmpty(filterOriginDestiion)) {

    setselectedoriginCountry(""), setstateDetails([]);
    setcityDetails([]);
    setselectedoriginCity("");
    setselectedoriginProvince("");
    setselectedDestinationCountry("");
    setselectedDestinationProvince("");
    setselectedDestinationCity("");
    setdestinationStateDetails([]);
    setdestinationCityDetails([]);
    setfilterOriginDestiion({
      originCountry: "",
      originProvince: "",
      originCity: "",
      destinationCountry: "",
      destinationProvince: "",
      destinationCity: "",
    });
    setrefechstate(!refechstate);
    // }
    removeAll();
  };

  const tabCalled = (tab: any) => {
    if (compareToggle) {
      setcancelModel(true);
      settabToggle(tab);
    } else {
      if (tab?.target?.value) {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.target?.value
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          seteditCnt(false);
        setTabname(!Tabname);
      } else {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.name
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          seteditCnt(false);
        setTabname(!Tabname);
      }
    }
  };

  const cancelBack = () => {
    setcancelModel(false);
    settabToggle(undefined);
  };

  const confirmBack = () => {
    setcancelModel(false);
    settabRedirect(!tabRedirect);
    seteditCnt(false);

    if (!_.isEmpty(tabToggle)) {
      setTimeout(() => {
        if (tabToggle?.target?.value) {
          setTabs(
            [...tabs].map((object) =>
              object?.name === tabToggle?.target?.value
                ? {
                    ...object,
                    current: false,
                  }
                : {
                    ...object,
                    current: true,
                  }
            )
          ),
            settabToggle(undefined);
          setTabname(!Tabname);
        } else {
          setTabs(
            [...tabs].map((object) =>
              object?.name === tabToggle?.name
                ? {
                    ...object,
                    current: true,
                  }
                : {
                    ...object,
                    current: false,
                  }
            )
          ),
            setTabname(!Tabname);
          settabToggle(undefined);
        }
      }, 500);
    }
  };

  const ClearOriginValue = () => {
    setselectedoriginCountry("");
    setstateDetails([]);
    setcityDetails([]);
    setselectedoriginCity("");
    setselectedoriginProvince("");
  };

  const ClearProvinceValue = () => {
    setcityDetails([]);
    setselectedoriginCity("");
    setselectedoriginProvince("");
  };

  const ClearCityValue = () => {
    setselectedoriginCity("");
  };

  const ClearDestinationValue = () => {
    setselectedDestinationCountry("");
    setselectedDestinationProvince("");
    setselectedDestinationCity("");
    setdestinationStateDetails([]);
    setdestinationCityDetails([]);
  };
  const ClearDestinationProvinceValue = () => {
    setselectedDestinationProvince("");
    setselectedDestinationCity("");
    setdestinationCityDetails([]);
  };
  const ClearDestinationCityValue = () => {
    setselectedDestinationCity("");
  };

  const defaultRoutesClicked = () => {
    setroutingRuleUpdatePopUp(false);
    bulkEditMutate({ rules: bulkEditArray });
  };

  const cancelClicked = () => {
    if (compareToggle) {
      setcancelModel(true);
    } else {
      seteditCnt(false);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 md:rounded-lg py-4 sm:py-0 bg-background_grey min-h-screen">
        <div className="flex justify-between items-center pt-5 pb-3 ">
          <h2 className="pb-2 text-2xl font-semibold text-font_black">
            Routing rule
          </h2>

          <p
            // onClick={() => navigate("/routing-rule/add")}
            className=" text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary "
          >
            + New Rule
          </p>
        </div>
        {/* {!editCnt && ( */}
        <div className="bg-white px-5 pb-5 mb-5 rounded-t-md shadow-md">
          <div className="flex justify-between items-center border-b  border-grey_border_table">
            <div className="">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <p
                  // className={classNames(
                  //   "border-transparent text-font_dark",
                  //   "whitespace-nowrap py-4 px-1 border-b-2 font-medium  cursor-pointer"
                  // )}
                  className=" text-2xl font-medium text-font_black text-center py-2"
                >
                  Location
                </p>
              </nav>
            </div>
          </div>
          <div className="w-full">
            <div className="grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 pt-5 justify-between sm:gap-x-6 2xl:gap-x-10 sm:gap-y-4">
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Origin Country
                </label>
                <InputDropDown
                  isRoutingRule={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedoriginCountry)}
                  divOnClick={() => {
                    setoriginProvinceToggle(false),
                      setoriginCityToggle(false),
                      setdestinationProvinceToggle(false),
                      setdestinationCountryToggle(false),
                      setdestinationCityToggle(false);
                  }}
                  isCountryDropdown={true}
                  max_w_xs={true}
                  valueIsISO2={true}
                  isOpen={originCountryToggle}
                  setIsOpen={setoriginCountryToggle}
                  array={countriesDetails}
                  value={selectedoriginCountry}
                  text="All"
                  id="originCountryToggle"
                  name="originCountryToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    changeCountry(
                      countriesDetails?.find((x) => x?.name === e)?.iso2
                    );
                  }}
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
                  ClearValue={ClearOriginValue}
                />
              </div>
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Origin Province
                </label>
                <InputDropDown
                  max_w_xs={true}
                  isRoutingRule={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedoriginProvince)}
                  divOnClick={() => {
                    setoriginCityToggle(false),
                      setdestinationProvinceToggle(false),
                      setdestinationCountryToggle(false),
                      setdestinationCityToggle(false),
                      setoriginCountryToggle(false);
                  }}
                  isOpen={originProvinceToggle}
                  setIsOpen={setoriginProvinceToggle}
                  array={stateDetails}
                  value={selectedoriginProvince}
                  ClearValue={ClearProvinceValue}
                  text="All"
                  id="originProvinceToggle"
                  name="originProvinceToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    // onChangeState(e, "Select a proper Details");
                    changeProvince(e);
                  }}
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
              </div>
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full ">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Origin City
                </label>
                <InputDropDown
                  max_w_xs={true}
                  isRoutingRule={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedoriginCity)}
                  divOnClick={() => {
                    setoriginProvinceToggle(false),
                      setdestinationProvinceToggle(false),
                      setdestinationCountryToggle(false),
                      setdestinationCityToggle(false),
                      setoriginCountryToggle(false);
                  }}
                  isOpen={originCityToggle}
                  setIsOpen={setoriginCityToggle}
                  array={cityDetails}
                  value={selectedoriginCity}
                  ClearValue={ClearCityValue}
                  text="All"
                  id="originCityToggle"
                  name="originCityToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    setselectedoriginCity(e);
                    setoriginCityToggle(false);
                  }}
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
              </div>
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Destination Country
                </label>
                <InputDropDown
                  isRoutingRule={true}
                  isCountryDropdown={true}
                  max_w_xs={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedDestinationCountry)}
                  divOnClick={() => {
                    setoriginProvinceToggle(false),
                      setdestinationProvinceToggle(false),
                      setoriginCityToggle(false),
                      setdestinationCityToggle(false),
                      setoriginCountryToggle(false);
                  }}
                  valueIsISO2={true}
                  isOpen={destinationCountryToggle}
                  ClearValue={ClearDestinationValue}
                  setIsOpen={setdestinationCountryToggle}
                  array={countriesDetails}
                  value={selectedDestinationCountry}
                  text="All"
                  id="destinationCountryToggle"
                  name="destinationCountryToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement>,
                    text: string
                  ) => {
                    changeCountry(
                      countriesDetails.find((x, index) => x?.name === e)?.iso2,
                      true
                    );
                  }}
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
              </div>
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Destination Province
                </label>
                <InputDropDown
                  max_w_xs={true}
                  isRoutingRule={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedDestinationProvince)}
                  divOnClick={() => {
                    setoriginProvinceToggle(false),
                      setdestinationCountryToggle(false),
                      setoriginCityToggle(false),
                      setdestinationCityToggle(false),
                      setoriginCountryToggle(false);
                  }}
                  isOpen={destinationProvinceToggle}
                  setIsOpen={setdestinationProvinceToggle}
                  array={destinationStateDetails}
                  value={selectedDestinationProvince}
                  ClearValue={ClearDestinationProvinceValue}
                  text="All"
                  id="destinationProvinceToggle"
                  name="destinationProvinceToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    changeProvince(e, true);
                  }}
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
              </div>
              <div className="mt-1 sm:col-span-1 sm:mt-0 rounded-md w-full ">
                <label className="block sm:col-span-1 pb-1 text-font_dark  font-medium">
                  Destination City
                </label>
                <InputDropDown
                  max_w_xs={true}
                  isRoutingRule={true}
                  disabled={editCnt}
                  countrydisabled={editCnt ? true : false}
                  noValueHere={_.isEmpty(selectedDestinationCity)}
                  divOnClick={() => {
                    setoriginProvinceToggle(false),
                      setdestinationCountryToggle(false),
                      setoriginCityToggle(false),
                      setdestinationProvinceToggle(false),
                      setoriginCountryToggle(false);
                  }}
                  isOpen={destinationCityToggle}
                  setIsOpen={setdestinationCityToggle}
                  array={destinationCityDetails}
                  value={selectedDestinationCity}
                  ClearValue={ClearDestinationCityValue}
                  text="All"
                  id="destinationCityToggle"
                  name="destinationCityToggle"
                  onchangeValue={(
                    e: React.ChangeEvent<HTMLInputElement> | any,
                    text: string
                  ) => {
                    setselectedDestinationCity(e);
                    setdestinationCityToggle(false);
                  }}
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
              </div>
            </div>
            <div className="flex mt-5 justify-end">
              <div className="flex gap-5">
                <button
                  type="button"
                  disabled={editCnt}
                  onClick={ClearAllValue}
                  className="rounded-md border border-grey_border bg-white hover:bg-grey_bg py-[7px] px-[20px] text-sm font-medium text-font_black focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                >
                  Clear All
                </button>

                <button
                  type="button"
                  disabled={editCnt}
                  onClick={filterOriginAndDestination}
                  className={`rounded-md ${
                    !editCnt
                      ? "bg-blue_primary hover:bg-hoverChange"
                      : "bg-table_head_color"
                  } py-[7px] px-[20px] text-sm font-medium text-white focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* )} */}

        <div className="bg-white px-6 rounded-md shadow-XOYO">
          <div className="flex gap-2 flex-wrap justify-between sm:hidden py-4">
            <div className="px-1">
              <select
                id="tabs"
                name="tabs"
                className="py-2 pl-3 pr-10 focus:outline-none border-grey_border_table border rounded-md"
                onChange={(tab) => tabCalled(tab)}
                // value={selectedTabName}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:flex justify-between items-center border-grey_border_table">
            <div className="hidden sm:flex ">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab: any) => (
                  <p
                    key={tab.name}
                    onClick={() => tabCalled(tab)}
                    className={classNames(
                      tab.current
                        ? "border-blue_primary text-blue_primary"
                        : "border-transparent text-font_dark",
                      "whitespace-nowrap text-sm font-Inter py-3 px-1 border-b-2 font-medium cursor-pointer"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </p>
                ))}
              </nav>
            </div>
            {tabs[0]?.current && (
              <div className="pt-4 sm:pt-0 pb-4 sm:pb-0 pl-1 sm:pl-0">
                {!editCnt ? (
                  <button
                    type="button"
                    disabled={customerBookingListData.length > 0 ? false : true}
                    onClick={() => seteditCnt(true)}
                    className={`rounded-md ${
                      customerBookingListData.length > 0
                        ? "bg-blue_primary hover:bg-hoverChange"
                        : "bg-table_head_color"
                    } py-[7px] px-[20px] text-sm font-medium text-white focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
                  >
                    Replace Default Rules
                  </button>
                ) : (
                  <div className="flex gap-3 flex-wrap justify-end">
                    <button
                      onClick={() => {
                        setroutingRuleUpdatePopUp(true);
                      }}
                      disabled={!compareToggle}
                      className={` rounded-md ${
                        compareToggle
                          ? "bg-blue_primary hover:bg-hoverChange "
                          : "bg-table_head_color"
                      } py-[7px] px-[20px] text-sm font-medium text-white focus:outline-none font-Inter tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in`}
                    >
                      Save Changes
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
            )}
          </div>
        </div>

        <div className="border-table_border pb-20">
          <div className="px-6 rounded-b-md bg-white ">
            <div className="border-table_border">
              {tabs[0]?.current && (
                <DefaultRoutes
                  refetchTheDefaultRoutesData={refetchTheDefaultRoutesData}
                  tabRedirect={tabRedirect}
                  oldCustomerBookingListData={oldCustomerBookingListData}
                  setOldCustomerBookingListData={setOldCustomerBookingListData}
                  setCustomerBookingListData={setCustomerBookingListData}
                  customerBookingListData={customerBookingListData}
                  editCnt={editCnt}
                  seteditCnt={seteditCnt}
                  filterOriginDestiion={filterOriginDestiion}
                  refechstate={refechstate}
                />
              )}
              {tabs[1]?.current && (
                <CustomRoutes
                  editCnt={editCnt}
                  seteditCnt={seteditCnt}
                  filterOriginDestiion={filterOriginDestiion}
                  refechstate={refechstate}
                />
              )}
              <DialogBox
                showDialog={cancelModel}
                confirmNavigation={confirmBack}
                cancelNavigation={cancelBack}
              />
              <DialogBox
                // @ts-ignore
                showDialog={showPrompt}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
              />
              <DataPopUp
                header={"Update routing rule"}
                subHeader={`Are you sure to replace ${bulkEditArray?.length} existing default rules? `}
                Panelcss="sm:my-8 sm:max-w-[448px] sm:px-10 sm:pt-8 sm:pb-12"
                Headercss="text-[18px] font-medium font-Inter"
                subHeaderCss="text-sm text-font_black font-normqal font-Inter font-normal"
                open={routingRuleUpdatePopUp}
                confirmClicked={defaultRoutesClicked}
                // error={apiData?.errorStatus === "ERROR" ? "Import Failed." : ""}
                setOpen={setroutingRuleUpdatePopUp}
                buttonlevelblue={"Confirm"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
