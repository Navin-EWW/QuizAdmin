import { useFormik } from "formik";
import React, { useState, useEffect, useMemo } from "react";
import { List } from "rsuite";
import DatePicker from "react-datepicker";
import "./Time.css";
import FormInputFiled from "../../Pages/ClientManagement/UserDetails/FormInputFiled";
import moment from "moment";
import { array, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../hooks/useToast";
import {
  SupplierStatusList,
  UpdateMilesApi,
} from "../../api/orderDetails/orderDetails.api";
import _, { isArray } from "lodash";
import ButtonSpinner from "../../utils/ButtonSpinner";

type Props = {
  editCnt: boolean;
  trackingDetails: any;
  compareToggle: boolean;
  firstMileDisable?: boolean;
  secondMileDisable?: boolean;
  index: number;
  supplierStatus: SupplierStatusList[];
  settrackingData: any;
  toDefaultValue: boolean;
  minimumDateTime: string;
  show: boolean;
  thirdMileDisable?: boolean;
  tabRedirect: boolean;
  trackingData: any[];
  refetch: () => void;
  stateId: string | undefined;
  cancelClicked: (e: number) => void;
  setDirtyValue: React.Dispatch<boolean>;
};

const sortByPriority = (supplierStatus: SupplierStatusList[]) => {
  return supplierStatus.sort((a, b) => {
    if (a?.internalStatus?.priority > b?.internalStatus?.priority) {
      return 1;
    } else if (a?.internalStatus?.priority < b?.internalStatus?.priority) {
      return -1;
    } else {
      return 0;
    }
  });
};

const sortByPriorityStatus = (data: any[]) => {
  return data.sort((a: any, b: any) => {
    if (
      a?.supplierStatus?.internalStatus?.priority >
      b.supplierStatus?.internalStatus?.priority
    ) {
      return 1;
    } else if (
      a.supplierStatus?.internalStatus?.priority <
      b.supplierStatus?.internalStatus?.priority
    ) {
      return -1;
    } else {
      return 0;
    }
  });
};

const MileComponent = ({
  editCnt,
  trackingDetails,
  index,
  compareToggle,
  setDirtyValue,
  secondMileDisable,
  firstMileDisable,
  tabRedirect,
  toDefaultValue,
  minimumDateTime,
  stateId,
  settrackingData,
  thirdMileDisable,
  show,
  trackingData,
  supplierStatus,
  cancelClicked,
  refetch,
}: Props) => {
  const [startDate, setStartDate] = useState<Date | null>();
  const [supplierStatusData, setSupplierStatusData] =
    useState<SupplierStatusList[]>(supplierStatus);
  const [apiError, setApiError] = useState<string>("");
  const [dateTimeErrors, setDateTimeErrors] = useState<number[]>([]);
  const [minTimeErrors, setminTimeErrors] = useState<any[]>([]);

  // Update Miles Api
  const { mutate, isLoading: loading } = useMutation(UpdateMilesApi, {
    onSuccess: (data: any) => {
      refetch();
      UseToast(data?.message);
      settrackingData(
        trackingData?.map((x: any, i: number) => {
          return {
            ...x,
            editCnt: true,
          };
        })
      );
    },
    onError: (data: any) => {
      if (data?.message) {
        setApiError(data?.message);
      } else {
        setApiError(data);
      }
    },
  });

  const onChangeStatus = (status: string) => {
    const findStatus = supplierStatus?.find(
      (x: any) =>
        x?.name?.toLowerCase()?.trim() === status?.toLowerCase()?.trim()
    );

    const filteredStatues = filterStatusByPriority([
      ...values?.status,
      {
        supplierStatus: findStatus,
        triggeredAt: "",
        triggerTime: "",
        triggerDate: "",
      },
    ]);
    const timeWiseSorting = timeWisePriority(filteredStatues);

    setFieldValue("status", timeWiseSorting);

    if (!findStatus?.internalStatus?.repeatable) {
      const updatedStatuses = supplierStatusData?.filter(
        (x) => x?.name?.toLowerCase()?.trim() !== status?.toLowerCase()?.trim()
      );

      setSupplierStatusData(updatedStatuses);
    }
  };

  const MileSchema = object().shape({
    // trackingNo: string().required("Required Field").nullable(),
    // destination: string().required("Required Field").nullable(),
    // origin: string().required("Required Field").nullable(),
    status: array().of(
      object().shape({
        triggerDate: string().required("Required Field"),
        triggerTime: string().required("Required Field"),
      })
    ),
  });

  const getTimeToISO = (date: string, time: string) => {
    // let str: any = time?.split(":");
    // let currentdate = moment(
    //   new Date(new Date(date).setHours(str[0], str[1], str[2]))
    // ).utc();
    // return currentdate;
    let str: any = time?.split(":");

    let currentdate = moment(date)
      .endOf("date")
      // .utc()
      .set({
        hours: str[0],
        minutes: str[1],
        seconds: str[2],
        milliseconds: 0,
      })
      .toISOString();

    return currentdate;
  };

  const getTimeToUTCISO = (date: string, time: string) => {
    // let str: any = time?.split(":");
    // let currentdate = moment(
    //   new Date(new Date(date).setHours(str[0], str[1], str[2]))
    // ).utc();
    // return currentdate;
    let str: any = time?.split(":");

    let currentdate = moment(date)
      .endOf("date")
      .utc()
      .set({
        hours: str[0],
        minutes: str[1],
        seconds: str[2],
        milliseconds: 0,
      })
      .toISOString();

    return currentdate;
  };

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    setTouched,
    dirty,
    setFieldValue,
  } = useFormik({
    validationSchema: MileSchema,
    enableReinitialize: true,
    initialValues: {
      trackingNo: trackingDetails?.trackingNo,
      destination: trackingDetails?.destination,
      origin: trackingDetails?.origin,
      status: trackingDetails?.status,
    },

    onSubmit: async (values, { resetForm }) => {
      const mainStatus = [];

      for (let a of values?.status) {
        let serviceSupplierStatusid = a?.supplierStatus?.id;
        let triggeredAt: any = getTimeToUTCISO(a?.triggerDate, a?.triggerTime);
        let str: any = a?.triggerTime?.split(":");
        mainStatus.push({
          serviceSupplierStatusid,
          triggeredAt: triggeredAt,
        });
      }
      const timeErrors = validateTime(values?.status);
      setDateTimeErrors(timeErrors);
      const minimumTimeErrors = validateMinTime(values?.status);
      setminTimeErrors(minimumTimeErrors);
      if (_.isEmpty(timeErrors) && _.isEmpty(minimumTimeErrors)) {
        mutate({
          mile: trackingDetails?.mile,
          miles: thirdMileDisable
            ? [trackingDetails?.mile, "LAST_MILE"]
            : [trackingDetails?.mile],
          trackingNo: values?.trackingNo,
          destination: values?.destination,
          origin: values?.origin,
          status: mainStatus,
          trackingId: stateId,
          supplierOrderId: trackingDetails?.supplierOrderNo,
        });
      }
    },
  });

  const timeWisePriority = (data: any[]) => {
    const timeWiseStatues = data.sort(function (x: any, y: any) {
      return getTimeToISO(x?.triggerDate, x?.triggerTime) <
        getTimeToISO(y?.triggerDate, y?.triggerTime)
        ? -1
        : getTimeToISO(x?.triggerDate, x?.triggerTime) >
          getTimeToISO(y?.triggerDate, y?.triggerTime)
        ? 1
        : 0;
    });
    return timeWiseStatues;
  };

  let priorityConsoleArray: any[] = [];
  useEffect(() => {
    if (!_.isEmpty(values?.status)) {
      for (let a of values?.status) {
        priorityConsoleArray.push(a?.supplierStatus?.internalStatus?.priority);
      }

      if (_.isEmpty(errors?.status)) {
        const timeErrors = validateTime(values?.status);
        setDateTimeErrors(timeErrors);
        const minTimeError = validateMinTime(values?.status);
        setminTimeErrors(minTimeError);
        if (_.isEmpty(timeErrors) && _.isEmpty(minTimeError)) {
          const timeWiseSorting = timeWisePriority(values?.status);
          setFieldValue("status", timeWiseSorting);
        }
      }
    }
  }, [values?.status, errors?.status]);

  const validateTime = (data: any) => {
    let timeErrors: any[] = [];

    data?.map((x: any, i: number) => {
      let objTime = getTimeToISO(x?.triggerDate, x?.triggerTime);
      for (let a of data) {
        let valTime = getTimeToISO(a?.triggerDate, a?.triggerTime);
        if (
          a?.supplierStatus?.id !== x?.supplierStatus?.id &&
          x?.supplierStatus?.internalStatus?.priority !== null
        ) {
          if (
            x?.supplierStatus?.internalStatus?.priority <
              a?.supplierStatus?.internalStatus?.priority &&
            a?.supplierStatus?.internalStatus?.priority !== null
          ) {
            if (moment(valTime).isBefore(moment(objTime))) {
              if (!timeErrors.includes(i)) {
                timeErrors.push(i);
              }
            }
          }
        }
      }
    });

    return timeErrors;
  };

  const validateMinTime = (data: any) => {
    let timeErrors: any[] = [];
    data?.map((x: any, i: number) => {
      let objTime = getTimeToISO(x?.triggerDate, x?.triggerTime);
      for (let a of data) {
        let valTime = getTimeToISO(a?.triggerDate, a?.triggerTime);
        let properMinTime = moment(minimumDateTime)
          // .utc()
          .format("DD/MM/YYYY HH:mm:ss");

        if (
          moment(objTime).utc(true).isBefore(
            moment(minimumDateTime).utc(false)
            // .set({ millisecond: 1 })
          ) &&
          x?.supplierStatus?.internalStatus?.priority !== null
        ) {
          if (!timeErrors.includes(i)) {
            timeErrors.push({
              index: i,
              error: `Minimum time for all status in this mile must be greater than ${moment(
                minimumDateTime
              )
                .utc(false)
                .format("DD/MM/YYYY HH:mm:ss")}`,
            });
          }
        }
      }
    });

    return timeErrors.filter(
      (v, i, a) => a.findIndex((v2) => v2.index === v.index) === i
    );
  };

  useMemo(() => {
    if (apiError) {
      setTimeout(() => {
        setApiError("");
      }, 11000);
    }
  }, [apiError]);

  const crossButtonClicked = (item: any, index: number) => {
    const array = values?.status.filter((x: any, i: number) => i !== index);

    const toAddSupplierStatus = supplierStatus.filter(
      (x) => x.id === item?.supplierStatus?.id
    )[0];

    const newUpdatedStatuses = sortByPriority([
      toAddSupplierStatus,
      ...supplierStatusData,
    ]);

    setFieldValue("status", array);
    const priorityWiseSuppierStatus =
      filterSuppilerStatusByPriority(newUpdatedStatuses);
    setSupplierStatusData(priorityWiseSuppierStatus);
  };

  const defaultValues = () => {
    setFieldValue("trackingNo", trackingDetails?.trackingNo);
    setFieldValue("destination", trackingDetails?.destination);
    setFieldValue("origin", trackingDetails?.origin);
    setFieldValue("status", trackingDetails?.status);
    setTouched({});
    setApiError("");
  };

  const changeDate = (e: any, item: any, index: number) => {
    let arr = [];
    for (let [i, a] of values?.status.entries()) {
      let obj = a;
      if (i === index) {
        obj = { ...a, triggerDate: moment(e).format("MM/DD/YYYY") };
      }
      arr.push(obj);
    }
    setFieldValue("status", arr);
  };

  useMemo(() => {
    if (dirty) {
      setDirtyValue(true);
    } else {
      setDirtyValue(false);
    }
  }, [dirty]);

  const filterSuppilerStatusByPriority = (array: SupplierStatusList[]) => {
    const filterTheSuppierStatusArray = array?.filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
    );
    const filterNullableStatues = filterTheSuppierStatusArray?.filter(
      (data) => {
        return data?.internalStatus?.priority === null;
      }
    );

    const filterNotNullableStatues = filterTheSuppierStatusArray?.filter(
      (data) => {
        return data?.internalStatus?.priority !== null;
      }
    );

    const sortedByPriority = sortByPriority(filterNotNullableStatues);
    return [...sortedByPriority, ...filterNullableStatues];
  };

  const filterStatusByPriority = (array: any[]) => {
    const filterNullableStatues = array?.filter((data) => {
      return data?.supplierStatus?.internalStatus?.priority === null;
    });

    const filterNotNullableStatues = array?.filter((data) => {
      return data?.supplierStatus?.internalStatus?.priority !== null;
    });

    const filterByPriority = sortByPriorityStatus(filterNotNullableStatues);

    return [...filterByPriority, ...filterNullableStatues];
  };

  useMemo(() => {
    // const alreadyExistingSupplierStatusIds = values?.status?.map(
    //   (status: any) => {
    //     return status?.supplierStatus.id;
    //   }
    // );
    const alreadyExistingSupplierStatusNames = values?.status?.map(
      (status: any) => {
        return status?.supplierStatus?.name.trim();
      }
    );

    let toFilterSupplierStatus = [];

    // for (let a of supplierStatus) {
    //   if (a?.internalStatus?.repeatable) {
    //     toFilterSupplierStatus?.push(a);
    //   } else if (!alreadyExistingSupplierStatusIds?.includes(a?.id)) {
    //     toFilterSupplierStatus?.push(a);
    //   }
    // }
    for (let a of supplierStatus) {
      if (a?.internalStatus?.repeatable) {
        toFilterSupplierStatus?.push(a);
      } else if (
        !alreadyExistingSupplierStatusNames?.includes(a?.name?.trim())
      ) {
        toFilterSupplierStatus?.push(a);
      }
    }

    const priorityWiseSuppierStatus = filterSuppilerStatusByPriority(
      toFilterSupplierStatus
    );

    setSupplierStatusData(priorityWiseSuppierStatus);
  }, [supplierStatus]);

  useEffect(() => {
    defaultValues();
    if (!compareToggle) {
      settrackingData([
        { editCnt: true },
        { editCnt: true },
        { editCnt: true },
      ]);
    }
  }, [toDefaultValue, tabRedirect]);

  const changeTime = (e: any, item: any, index: number) => {
    let arr = [];
    for (let [i, a] of values?.status?.entries()) {
      let obj = a;
      if (i === index) {
        obj = { ...a, triggerTime: moment(e).format("HH:mm:ss") };
      }
      arr.push(obj);
    }
    setFieldValue("status", arr);
  };

  return show ? (
    <div className="space-y-6 sm:space-y-5 font-Inter">
      <FormInputFiled
        disabled={true}
        label="Supplier Order No."
        editCnt={editCnt}
        value={trackingDetails?.supplierOrderNo}
        id="legalEntityName"
        name="legalEntityName"
        type="text"
      />

      <FormInputFiled
        disabled={true}
        label="Supplier"
        editCnt={editCnt}
        value={trackingDetails?.supplier}
        id="merchantCode"
        name="merchantCode"
        type="text"
      />

      <FormInputFiled
        disabled={editCnt || loading}
        label="Tracking No."
        value={values?.trackingNo}
        editCnt={editCnt}
        onBlur={handleBlur}
        handleOnChange={handleChange}
        placeholder="Tracking No."
        id="trackingNo"
        maxLength={35}
        type="text"
        name="trackingNo"
        errorStatus={touched.trackingNo && Boolean(errors.trackingNo)}
        error={errors.trackingNo}
      />

      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label htmlFor="origin" className="block text-font_dark font-medium">
          *Origin
        </label>
        <div className="relative mt-1 rounded-md sm:col-span-2 lg:col-span-2 xl:col-span-3 pr-0 xl:pr-6 sm:mt-0 w-full">
          <input
            type="text"
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={editCnt || loading}
            value={values?.origin}
            name="origin"
            id="origin"
            // maxLength={120}
            className={`block w-full rounded-md font-normal border ${
              touched.origin && Boolean(errors.origin)
                ? "border-error_red text-error_text"
                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
            } focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
          />

          {touched?.origin && Boolean(errors?.origin) && (
            <p className="mt-21 text-sm text-error_red">
              {String(errors.origin)}
            </p>
          )}
        </div>
      </div>
      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label className="block text-font_dark font-medium">*Destination</label>

        <div className="relative mt-1 rounded-md sm:col-span-2 lg:col-span-2 xl:col-span-3 pr-0 xl:pr-6 sm:mt-0 w-full">
          <input
            type="text"
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={editCnt || loading}
            value={values?.destination}
            name="destination"
            id="destination"
            // maxLength={120}
            className={`block w-full rounded-md font-normal border ${
              touched.destination && Boolean(errors.destination)
                ? "border-error_red text-error_text"
                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
            } focus:outline-none py-2 px-3 text-sm pr-10  focus:text-font_black`}
          />

          {touched?.destination && Boolean(errors?.destination) && (
            <p className="mt-21 text-sm text-error_red" id="email-error">
              {String(errors?.destination)}
            </p>
          )}
        </div>
      </div>
      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label htmlFor="remarks" className="block text-font_dark font-medium">
          Status
        </label>
        <div className="w-full sm:col-span-2 xl:col-span-3">
          <div className="mb-4 custom-border px-3 py-2 mr-16">
            <select
              disabled={loading}
              value="+New Status"
              onChange={(e) => {
                onChangeStatus(e?.target?.value);
              }}
              className="w-full outline-none bg-transparent cursor-pointer block"
            >
              <option> + New Status</option>
              {supplierStatusData?.map((x) => (
                <option>{x?.name}</option>
              ))}
            </select>
          </div>
          <List

          // onSort={handleSortEnd}
          >
            {values?.status?.map((item: any, index: number) => {
              // let str: any = item?.triggerTime?.split(":");

              // let triggerAt = moment(item?.triggerDate)
              //   .endOf("date")
              //   // .utc()
              //   .set({
              //     hours: str[0],
              //     minutes: str[1],
              //     seconds: str[2],
              //     milliseconds: 0,
              //   })
              //   .toISOString();

              // let utcTriggerDate = moment(triggerAt)
              //   // .utc()
              //   .format("MM/DD/YYYY");
              // let utcTriggerTimee = moment(triggerAt)
              //   // .utc()
              //   .format("HH:mm:ss");

              return (
                <List.Item
                  key={index}
                  index={index}
                  className="w-full mr-inherit"
                >
                  <div className="flex w-full gap-5 pr-8 mb-4">
                    <div className="w-full inline-block sm:flex gap-5">
                      <div className="mt-1 sm:mt-0 w-full sm:w-1/2 ">
                        <span className="block w-full rounded-md font-normal break-words border border-grey_border_table focus:outline-none py-[9px] px-3 text-sm text-font_black focus:border-blue_primary active:border-blue_primary focus:text-font_black">
                          {item.supplierStatus?.name}
                        </span>
                        {_.isEmpty(minTimeErrors) ? (
                          <>
                            {dateTimeErrors?.map((x: any) => {
                              if (x === index) {
                                return (
                                  <p className="mt-21 text-sm text-error_red  mb-4">
                                    Current time must be less than all the
                                    statuses shown below
                                  </p>
                                );
                              }
                            })}
                          </>
                        ) : (
                          <>
                            {minTimeErrors?.map((x: any) => {
                              if (x?.index === index) {
                                return (
                                  <p className="mt-21 text-sm text-error_red  mb-4">
                                    {x?.error}
                                  </p>
                                );
                              }
                            })}
                          </>
                        )}
                      </div>

                      <div className="mt-1 sm:mt-0 w-full sm:w-1/2 flex gap-5">
                        <div className="relative cursor-pointer w-full rounded-md">
                          <DatePicker
                            className="border w-full cursor-pointer py-2 rounded-md px-3 focus:outline-blue_primary border-grey_border focus:text-font_black"
                            placeholderText="Start"
                            selectsStart
                            value={
                              item?.triggerDate
                                ? moment(item?.triggerDate)
                                    // .utc()
                                    .format("MM/DD/YYYY")
                                : "-"
                            }
                            onChange={(e) => changeDate(e, item, index)}
                          />
                          <div className="absolute bg-white right-2 top-4">
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
                          </div>

                          {touched?.status &&
                            isArray(errors?.status) &&
                            errors?.status?.map((x: any, i: number) => {
                              if (i === index) {
                                return (
                                  <p className="mt-21 text-sm text-error_red  mb-4">
                                    {x?.triggerDate}
                                  </p>
                                );
                              }
                            })}
                        </div>

                        <div className="date-picker-area relative w-full rounded-md">
                          <DatePicker
                            className="border w-full cursor-pointer py-2 rounded-md px-3 focus:outline-blue_primary border-grey_border focus:text-font_black"
                            selected={startDate}
                            onChange={(date) => changeTime(date, item, index)}
                            showTimeSelect
                            showTimeSelectOnly
                            value={
                              item?.triggerTime
                                ? item?.triggerTime
                                : // .utc()
                                  // .format("HH:mm:ss")
                                  "-"
                            }
                            timeIntervals={1}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                          <div className="absolute right-2 bg-white top-4">
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
                          </div>
                          {touched?.status &&
                            isArray(errors?.status) &&
                            errors?.status?.map((x: any, i: number) => {
                              if (i === index) {
                                return (
                                  <p className="mt-21 text-sm text-error_red  mb-4">
                                    {x?.triggerTime}
                                  </p>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </div>

                    <button
                      className="flex pt-2"
                      onClick={(e) => {
                        e?.preventDefault(), crossButtonClicked(item, index);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 13L13 1M1 1L13 13"
                          stroke="#6B7B80"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </List.Item>
              );
            })}
          </List>
        </div>
      </div>
      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label className="block text-font_dark font-medium">API Create</label>
        <div className="mt-1 sm:col-span-2 xl:col-span-3 sm:mt-0">
          <span
            className={`block w-full max-w-lg rounded-md font-normal bg-transparent
             ${
               trackingDetails?.apiCreate === "Success" && "text-success_text"
             } ${trackingDetails?.apiCreate === "Fail" && "text-error_red"}  ${
              trackingDetails?.apiCreate === "Not_Applicable" &&
              "text-orange_text"
            } 
            focus:outline-none sm:max-w-xs py-2 px-3 text-sm`}
          >
            {trackingDetails?.apiCreate?.trim() === "Not_Applicable"
              ? "Inapplicable"
              : trackingDetails?.apiCreate?.trim()}
          </span>
        </div>
      </div>

      <div className="flex justify-between  sm:border-t border-grey_border_table sm:pt-5">
        {apiError && (
          <p className="mt-21 w-full text-sm text-error_red" id="email-error">
            {apiError}
          </p>
        )}
        <div className="flex sm:gap-4 gap-3 w-full flex-wrap justify-end">
          <button
            disabled={!dirty || loading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className={`rounded-md ${
              dirty ? "bg-blue_primary" : "bg-grey_border_table_disable"
            }   py-2 px-4   text-sm font-medium min-w-[130px]  text-white focus:outline-none`}
          >
            {loading ? <ButtonSpinner /> : " Save Changes"}
          </button>
          <button
            onClick={() => cancelClicked(index)}
            type="button"
            className="inline-flex justify-center rounded-md border border-grey_border_table py-2 px-4 text-sm font-medium text-font_dark focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default MileComponent;
