import React, {
  DetailedHTMLProps,
  FocusEventHandler,
  HTMLAttributes,
} from "react";
import { PatternFormat } from "react-number-format";

type Props = {
  editCnt: boolean;
  error?: undefined | any;
  value: string | number;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  format: string;
  id: string;
  type: "text" | "tel" | "password" | undefined;
  label: string;
  disabled: boolean;
  placeholder?: string;
  errorStatus?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
};

const NumberFormatInput = ({
  onBlur,
  errorStatus,
  label,
  type,
  placeholder,
  disabled,
  id,
  name,
  format,
  editCnt,
  error,
  value,
  handleOnChange,
}: Props) => {
  return (
    <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
      <label className="block text-font_dark font-medium">{label}</label>
      <div className="relative mt-1 sm:col-span-2 sm:mt-0 rounded-md sm:max-w-xs max-w-lg w-full">
        <PatternFormat
          format={format}
          // onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
          onChange={handleOnChange}
          disabled={disabled}
          type={type}
          onBlur={onBlur}
          value={value}
          name={name}
          placeholder={placeholder}
          id={id}
          className={
            editCnt
              ? `block w-full max-w-lg  rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm `
              : `block w-full max-w-lg rounded-md border font-normal ${
                  errorStatus
                    ? "border-error_red text-error_text "
                    : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                } focus:text-font_black pr-10 focus:outline-none sm:max-w-xs py-2 px-3 text-sm`
          }
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
        {errorStatus && <p className="mt-21 text-sm text-error_red">{error}</p>}
      </div>
    </div>
  );
};

export default NumberFormatInput;
