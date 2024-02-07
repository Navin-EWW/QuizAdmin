import { disabled } from "glamor";
import React, { SelectHTMLAttributes } from "react";

type Props = {
  editCnt: boolean;
  label: string;
  defaltText?: string;
  title?: string;
  array?: any[] | undefined;
  isSystemVariable?: boolean;
  disabled?: boolean;
  isSelectType?: boolean;
  isCountry?: boolean;
  error?: string | undefined | any;
  errorStatus?: boolean;
  // onChangeCountry?: (
  //   e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  // ) => void | undefined;
  onChangeCountry?: any;
  onBlur?: any;
  id?: string;
  name?: string;
};

const DropDownField = ({
  onChangeCountry,
  editCnt,
  title,
  isSystemVariable,
  array,
  errorStatus,
  id,
  name,
  error,
  disabled,
  isSelectType,
  onBlur,
  isCountry,
  label,
  defaltText,
}: Props) => {
  return (
    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-4">
      <label className="block text-font_dark pb-1 font-medium">{label}</label>
      {editCnt ? (
        <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  w-full sm:max-w-xs max-w-lg px-3">
          <span>{title || ""}</span>
        </div>
      ) : (
        <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
          <select
            value={title}
            id={id}
            name={name}
            onChange={onChangeCountry}
            disabled={disabled || editCnt}
            onBlur={onBlur}
            className={`block w-full max-w-lg rounded-md font-normal border ${
              errorStatus
                ? "border-error_red text-error_text"
                : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
            } focus:outline-none sm:max-w-xs py-2 px-3 text-sm focus:text-font_black`}
          >
            {isSelectType && (
              <option value="">
                {defaltText ? defaltText : "Select a type"}
              </option>
            )}
            {array?.map((x: any) => {
              return (
                <option className="">
                  {isCountry
                    ? `${x?.iso2} - ${x?.name}`
                    : isSystemVariable
                    ? x?.value
                    : x?.name.length > 35
                    ? x?.name.substr(0, 35) + "..."
                    : x?.name}
                </option>
              );
            })}
          </select>
          <p className="mt-21 text-sm text-error_red" id="email-error">
            {errorStatus ? error : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default DropDownField;
