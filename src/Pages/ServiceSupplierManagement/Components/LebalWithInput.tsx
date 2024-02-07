import React from "react";
import DeleteIcon from "/icon/delete.svg";
import _ from "lodash";
import { TextArrayType } from "../ServiceSupplierCreate/ServiceSupplierCreate";
import { disabled } from "glamor";

type Props = {
  mile?: string | undefined;
  customerStatus: string;
  internalStatus: string;
  Isbutton: boolean;
  indexOfData: number;
  firstElement?: boolean;
  textArray?: TextArrayType[];
  disabled: boolean;
  // onChangeValue?: (
  //   index: number,
  //   indexOfData: number,
  //   e: string | undefined
  // ) => void | undefined;
  onChangeValue: any;
  deleteButtonClicked: (index: number, indexOfData: number) => void;
  addedButtonClicked: (index: number, indexOfData: number) => void;
};

function LebalWithInput({
  mile,
  customerStatus,
  deleteButtonClicked,
  internalStatus,
  textArray,
  onChangeValue,
  disabled,
  indexOfData,
  addedButtonClicked,
  firstElement,
  Isbutton,
}: Props) {
  return (
    <>
      <div
        className={`text-sm py-5 border-t border-grey_border_table
         grid md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-7 gap-x-3 gap-y-1 `}
      >
        <div className="md:col-span-7 lg:col-span-1 font-Inter font-medium text-font_black text-sm">
          {mile}
        </div>
        <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_black text-sm">
          {customerStatus || "-"}
        </div>
        <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_black text-sm">
          {internalStatus || "-"}
        </div>
        <div className="md:col-span-2 lg:col-span-2 font-Inter font-medium text-font_black text-sm">
          {textArray?.map((x, index) => (
            <div className={`flex gap-3 2xl:gap-5 ${index !== 0 && "mt-5"} `}>
              <input
                onChange={(e: any) => {
                  onChangeValue(index, indexOfData, e?.target?.value);
                }}
                type="text"
                value={x?.text || ""}
                disabled={disabled}
                maxLength={60}
                placeholder={"Enter status"}
                className={`block rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none max-w-xs w-[80%] py-2 px-3 text-sm `}
              />
              <div className="flex sm:gap-1 xl:gap-3 2xl:gap-5 cursor-pointer w-[40px]">
                {Isbutton && (
                  <button
                    disabled={_.isEmpty(x?.text?.trim())}
                    onClick={(e: any) => {
                      e.preventDefault(),
                        addedButtonClicked(index, indexOfData);
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 7V10M10 10V13M10 10H13M10 10H7M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                        stroke={
                          _.isEmpty(x?.text?.trim()) ? "#D1D9DB" : "#4B5D63"
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {index !== 0 && (
                  <img
                    src={DeleteIcon}
                    onClick={(e: any) => {
                      e.preventDefault(),
                        !disabled && deleteButtonClicked(index, indexOfData);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LebalWithInput;
