import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { number, object, string } from "yup";
import { MerchantListDropDown } from "../../../api/merchant/user";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { DialogBox } from "../../../Components/DialogBox/DialogBox";
import { useCallbackPrompt } from "../../../hooks/useCallbackPrompt";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { capitalizeFirst } from "../../../utils/Capitalization";
import FormInputFiled from "../../ClientManagement/UserDetails/FormInputFiled";
import DropBox from "../CreateBankCharges/DropBox";

export function BankTransferChargesEdit() {
  const navigate = useNavigate();
  const [addReduce, setAddReduce] = useState<string>("Add");

  const [merchantTypeD_D, setMerchantTypeD_D] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [apiErrors, setapiErrors] = useState<any>("");
  // const [editCnt, seteditCnt] = useState(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog);

  useQuery(["MerchantListDropDown"], () => MerchantListDropDown(), {
    keepPreviousData: true,
    onSuccess(data) {
      if (data.status) {
        setMerchantTypeD_D(data.data);
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  const ChargesSchema = object().shape({
    merchantId: string().required("Required Field").trim("Required Field"),
    currentBalance: string().required("Required Field").trim("Required Field"),
    balanceAfterAdjustment: string()
      .required("Required Field")
      .trim("Required Field"),
    event: string().required("Required Field").trim("Required Field"),
    uploadFile: string().required("Required Field").trim("Required Field"),
    addamount: number().required("Required Field"),
    remark: string(),
  });

  const {
    handleSubmit,
    handleBlur,
    values,
    handleChange,
    errors,
    touched,
    dirty,
    setErrors,
    setFieldValue,
  } = useFormik({
    validationSchema: ChargesSchema,

    initialValues: {
      merchantId: "",
      currentBalance: "HK$29,416.00",
      balanceAfterAdjustment: "HK$29,416.00",
      event: "",
      uploadFile: "June2023.pdf",
      addamount: 0,
      remark: "",
    },
    onSubmit: async (values, { resetForm }) => {
      event?.preventDefault();
      console.log(values);
      resetForm();
    },

    // onReset: () => {},
  });

  const successNavigate = useCallback(
    debounce(() => navigate("/bank-transfer/list"), 200),
    []
  );

  useMemo(() => {
    if (dirty) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [dirty]);

  const onCancel = () => {
    navigate("/bank-transfer/list");
  };

  useEffect(() => {
    if (!apiErrors.status) {
      setTimeout(() => {
        setapiErrors("");
      }, 7000);
    }
  }, [apiErrors]);

  const isLoading = false;

  return (
    <>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <div className="px-4 sm:px-6 lg:px-8 bg-background_grey">
        <div className="flex justify-between items-center py-5 ">
          <h1 className="text-2xl font-semibold text-font_black">Charges</h1>
        </div>
        <div className="">
          <form className="space-y-5 pb-20" onSubmit={handleSubmit}>
            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5">
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  border-grey_border_table">
                  <label className="block text-font_dark font-medium">
                    Merchant
                  </label>

                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <select
                        disabled={isLoading}
                        id="type"
                        name="merchantId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.merchantId}
                        className={`block w-full max-w-lg rounded-md font-normal border ${
                          touched?.merchantId && Boolean(errors?.merchantId)
                            ? "border-error_red text-error_text"
                            : "border-grey_border_table focus:border-blue_primary"
                        } sm:max-w-xs focus:outline-none py-2 px-3 text-sm   active:border-blue_primary focus:text-font_black`}
                      >
                        <option value="">Merchant</option>
                        {merchantTypeD_D.map((item, index) => (
                          <option key={index} value={item.merchantCode}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-21 text-sm text-error_red">
                      {touched?.merchantId && Boolean(errors?.merchantId)
                        ? errors.merchantId
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-md shadow-md">
              <div className="space-y-6 sm:space-y-5 font-Inter">
                <FormInputFiled
                  firstElement={true}
                  disabled={true}
                  error={errors?.currentBalance}
                  errorStatus={
                    touched?.currentBalance && Boolean(errors?.currentBalance)
                  }
                  label={"Current Balance"}
                  editCnt={false}
                  value={capitalizeFirst(values.currentBalance).trimStart()}
                  handleOnChange={handleChange}
                  onBlur={handleBlur}
                  id="chargesId"
                  name="chargesId"
                  type="text"
                />

                <FormInputFiled
                  // firstElement={true}
                  disabled={true}
                  error={errors?.balanceAfterAdjustment}
                  errorStatus={
                    touched?.balanceAfterAdjustment &&
                    Boolean(errors?.balanceAfterAdjustment)
                  }
                  label={"Balance after Adjustment"}
                  editCnt={false}
                  value={capitalizeFirst(
                    values.balanceAfterAdjustment
                  ).trimStart()}
                  handleOnChange={handleChange}
                  onBlur={handleBlur}
                  id="chargesId"
                  name="chargesId"
                  type="text"
                />
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-baseline items-start sm:gap-4 sm:pt-5  sm:border-t border-grey_border_table">
                  <label className="block text-font_dark font-medium">
                    Event
                  </label>

                  <div className="mt-1 sm:col-span-3 sm:mt-0">
                    <div>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          disabled={isLoading}
                          id="event"
                          name="event"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.event}
                          className={`block w-full max-w-lg rounded-md font-normal border ${
                            touched?.event && Boolean(errors?.event)
                              ? "border-error_red text-error_text"
                              : "border-grey_border_table focus:border-blue_primary"
                          } sm:max-w-xs focus:outline-none py-2 px-3 text-sm   active:border-blue_primary focus:text-font_black`}
                        >
                          <option value="">Event</option>
                          <option value="Event1">Event1</option>
                          <option value="Event2">Event2</option>

                          {/* {merchantTypeD_D.map((item, index) => (
                              <option key={index} value={item.merchantCode}>
                                {item.name}
                              </option>
                            ))} */}
                        </select>
                      </div>
                      <p className="mt-21 text-sm text-error_red">
                        {touched?.event && Boolean(errors?.event)
                          ? errors.event
                          : ""}
                      </p>
                    </div>
                    <div className="text-sm text-table_head_color py-2 pr-3">
                      <DropBox />
                    </div>
                  </div>
                </div>
                <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Amount (HK$)
                  </label>
                  <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                    <div className="text-left flex sm:gap-5 gap-3 w-full ">
                      <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-[148px] ">
                        <select
                          disabled={isLoading}
                          id="amount"
                          name="amount"
                          onChange={(e) => setAddReduce(e.target.value)}
                          value={addReduce}
                          className={`block w-full max-w-lg rounded-md font-normal border border-grey_border_table focus:border-blue_primary sm:max-w-[148px] focus:outline-none py-2 px-3 text-sm  active:border-blue_primary focus:text-font_black`}
                        >
                          <option value="Add">Add</option>
                          <option value="Reduce">Reduce</option>
                        </select>
                      </div>
                      <div className={`mt-1 sm:col-span-2 sm:mt-0 sm:max-w-xs`}>
                        <div className="relative">
                          <input
                            disabled={isLoading}
                            type="number"
                            id="addamount"
                            name="addamount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.addamount}
                            className={`block w-full max-w-lg rounded-md font-normal border ${
                              touched?.addamount && Boolean(errors?.addamount)
                                ? "border-error_red text-error_text"
                                : "border-grey_border_table focus:border-blue_primary"
                            } sm:max-w-[148px] focus:outline-none py-2 pl-6 pr-3 text-sm active:border-blue_primary focus:text-font_black`}
                          />
                          {touched?.addamount && Boolean(errors?.addamount) && (
                            <div className="pointer-events-none absolute top-[9px]  flex items-center right-3 bg-white">
                              <svg
                                className="h-5 w-5 fill-error_red ml-3"
                                x-description="Heroicon name: mini/exclamation-circle"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          )}
                          <div className="pointer-events-none absolute top-[9px]  flex items-center left-3 bg-white">
                            {addReduce == "Add" ? "+ " : "- "}
                          </div>
                          {touched?.addamount && Boolean(errors?.addamount) && (
                            <p
                              className="mt-21 text-sm text-error_red"
                              id="email-error"
                            >
                              {String(errors?.addamount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-center sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                  <label className="block text-font_dark font-medium">
                    Remarks
                  </label>
                  <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-6 pr-0">
                    <div className="mt-1 sm:col-span-3 sm:mt-0 w-full">
                      <textarea
                        disabled={isLoading}
                        placeholder={"Remarks"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.remark}
                        name="remark"
                        id="remark"
                        className={`resize-none block w-full rounded-md font-normal border border-grey_border_table focus:outline-none py-2 px-3 text-sm text-font_black focus:border-blue_primary active:border-blue_primary focus:text-font_black`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap justify-end">
                  <button
                    type="submit"
                    disabled={!dirty || isLoading}
                    className={`rounded-md ${
                      // dirty?
                      "bg-blue_primary hover:bg-hoverChange"
                      // : " bg-grey_border_table_disable"
                    }  py-2 px-4 text-sm font-medium text-white min-w-[33px] focus:outline-none`}
                  >
                    {isLoading ? <ButtonSpinner /> : "Update Balance"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-grey_border_table bg-transparent hover:bg-grey_bg py-2 px-4 text-sm font-medium text-font_dark focus:outline-none  tracking-[0.5px] hover:transition-all transition-all hover:duration-300 hover:ease-in"
                    // onClick={cancelClicked}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
