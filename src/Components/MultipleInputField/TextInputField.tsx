import { disabled } from "glamor";
import React from "react";

type Props = {
  editCnt: boolean;
  label: string;
  errorStatus?: boolean | undefined;
  error?: string | undefined | any;
  title?: string;
  isAddress?: boolean;
  disabled?: boolean;
  onChange?: any;
  id?: string;
  onlyForPackage?: boolean;
  name?: string;
  onBlur?: any;
  onKeyDown?: (e: any) => void;
  type?: string;
  min?: number;
  maxLength?: number;
};

const TextInputField = ({
  isAddress,
  editCnt,
  onBlur,
  label,
  type,
  onChange,
  onlyForPackage,
  disabled,
  title,
  id,
  name,
  maxLength,
  min,
  onKeyDown,
  errorStatus,
  error,
}: Props) => {
  return (
    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4  sm:pt-4">
      <label className="block text-font_dark pb-1 font-medium">{label}</label>
      {editCnt ? (
        <div
          className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md w-full sm:max-w-xs max-w-lg px-3`}
        >
          <span>{title}</span>
        </div>
      ) : (
        <div
          className={` ${isAddress ? "max-w-full" : "sm:max-w-xs max-w-lg"}  ${
            onlyForPackage && "relative"
          } mt-1 sm:col-span-2 sm:mt-0 pb-1 rounded-md w-full`}
        >
          <input
            disabled={disabled || editCnt}
            type={type}
            onKeyDown={onKeyDown}
            value={title}
            onChange={onChange}
            name={name}
            maxLength={maxLength}
            id={id}
            min={min}
            onBlur={onBlur}
            className={
              !editCnt
                ? `block w-full ${
                    isAddress ? "" : "max-w-lg sm:max-w-xs"
                  } rounded-md font-normal border ${
                    errorStatus
                      ? "border-error_red text-error_text"
                      : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                  } focus:outline-none py-2 px-3 text-sm  focus:text-font_black`
                : "block w-full  sm:max-w-xs max-w-lg rounded-md font-normal pr-10 bg-transparent focus:text-font_black focus:outline-none py-2 px-3 text-sm "
            }
          />

          {errorStatus && (
            <div className=" pointer-events-none absolute top-[9px]  flex items-center right-3 ">
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

          <p className="mt-21 text-sm text-error_red" id="email-error">
            {errorStatus ? error : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInputField;
