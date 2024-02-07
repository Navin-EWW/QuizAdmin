import React, {
  DetailedHTMLProps,
  FocusEventHandler,
  HTMLAttributes,
} from "react";

type Props = {
  editCnt: boolean;
  error?: undefined | any;
  value: string | number;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type: string;
  id: string;
  label: string;
  min?: number;
  firstElement?: boolean;
  disabled: boolean;
  placeholder?: string;
  successText?: boolean;
  onKeyDown?: (e: any) => void;
  errorStatus?: boolean;
  labelCss?: string;
  extraCss?: string;
  errorText?: boolean;
  maxLength?: number;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
};

const FormInputFiled = ({
  onBlur,
  errorStatus,
  label,
  placeholder,
  firstElement,
  disabled,
  min,
  id,
  name,
  successText,
  type,
  onKeyDown,
  errorText,
  editCnt,
  error,
  maxLength,
  value,
  extraCss,
  labelCss,
  handleOnChange,
}: Props) => {
  return (
    <div
      className={`text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 ${
        firstElement
          ? "sm:pt-5"
          : "sm:border-t border-grey_border_table sm:pt-5"
      }`}
    >
      <label
        className={`"block ${
          labelCss ? labelCss : "text-font_dark"
        } font-Inter font-medium"`}
      >
        {label}
      </label>

      <div
        className={`relative mt-1 sm:col-span-2 sm:mt-0 rounded-md  ${
          extraCss ? extraCss : "w-full sm:max-w-xs max-w-lg"
        }`}
      >
        <input
          onChange={handleOnChange}
          disabled={disabled}
          onBlur={onBlur}
          value={value}
          type={type}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          id={id}
          onKeyDown={onKeyDown}
          min={min}
          className={
            editCnt
              ? `block pr-10 w-full max-w-lg font-Inter rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm ${
                  !disabled ? "text-table_head_color bg-disable_grey" : ""
                } ${errorText && "text-error_red"} ${
                  successText && "text-success_text"
                }`
              : `block rounded-md w-full border font-normal ${
                  errorStatus
                    ? "border-error_red text-error_text "
                    : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
                } focus:text-font_black focus:outline-none ${
                  extraCss ? "w-full" : "max-w-lg sm:max-w-xs w-full "
                } py-2 px-3 text-sm ${
                  disabled ? "text-table_head_color bg-disable_grey" : ""
                }`
          }
        />
        {errorStatus && (
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
        {errorStatus && <p className="mt-21 text-sm text-error_red">{error}</p>}
      </div>
    </div>
  );
};

export default FormInputFiled;
