import { FocusEventHandler, useEffect, useState } from "react";

type Props = {
  onChange: (e: string) => void;
  name: string;
  defaultValue: any;
  formatType?: string;
  errorStatus?: boolean;
  label: string;
  error?: string;
  editCnt?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  placeholder?: string;
  disabled: boolean;
  id: string;
};

export const TextFormatInput = ({
  onChange,
  name,
  defaultValue,
  formatType = "### ### ###",
  errorStatus,
  label,
  error,
  editCnt,
  onBlur,
  placeholder,
  disabled,
  id,
}: Props) => {
  let maxLength = formatType.length;
  let formatLength = formatType.split(" ")[0].length;

  function format() {
    let val: any = defaultValue?.split(" ")?.join("");
    if (val.length > 0) {
      val = val?.match(new RegExp(`.{1,${formatLength}}`, "g")).join(" ");
    }
    return val;
  }

  return (
    <>
      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label className="block text-font_dark font-medium">{label}</label>
        <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md sm:max-w-xs max-w-lg w-full">
          <input
            placeholder={placeholder}
            id={id}
            disabled={disabled}
            onBlur={onBlur}
            defaultValue={format()}
            value={format()}
            name={name}
            maxLength={maxLength}
            onChange={(e) => {
              onChange(e.target.value.split(" ").join(""));
            }}
            className={
              editCnt
                ? `block w-full max-w-lg  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
                : `block w-full max-w-lg rounded-md border font-normal ${
                    errorStatus
                      ? "border-error_red text-error_text "
                      : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                  } focus:text-font_black pr-10 focus:outline-none sm:max-w-xs py-2 px-3 text-sm`
            }
            type="text"
          />
          {errorStatus && (
            <div className="pointer-events-none absolute top-[9px] flex items-center right-3">
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
          {errorStatus && (
            <p className="mt-21 text-sm text-error_red">{error}</p>
          )}
        </div>
      </div>
    </>
  );
};
