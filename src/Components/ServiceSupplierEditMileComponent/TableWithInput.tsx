import React from "react";
import DeleteIcon from "/icon/delete.svg";
import _ from "lodash";

import { disabled } from "glamor";
import { TextArrayType } from "../../Pages/ServiceSupplierManagement/ServiceSupplierCreate/ServiceSupplierCreate";

type Props = {
  mile?: string | undefined;
  customerStatus?: string;
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

function TableWithInput({
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
      <tr className="border-t border-grey_border_table">
        <td className="whitespace-nowrap pl-4 pr-3 align-top">{mile}</td>

        <td className="whitespace-nowrap  pl-4 pr-3 align-top">
          {customerStatus || "-"}
        </td>

        <td className="whitespace-nowrap  pl-4 pr-3 align-top">
          {internalStatus || "-"}
        </td>

        <td className="whitespace-nowrap  pl-4 pr-3 align-top">
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
                className={`block rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm `}
              />
              <div className="flex gap-3 w-[40px] cursor-pointer">
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
                        stroke="#4B5D63"
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
        </td>
      </tr>
    </>
  );
}

export default TableWithInput;
