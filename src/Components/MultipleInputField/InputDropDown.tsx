import React, { useState, useEffect, FocusEventHandler } from "react";
import { Listbox, Transition } from "@headlessui/react";
import _ from "lodash";
import { disabled } from "glamor";

type Props = {
  array: any[];
  value?: string;
  id?: string;
  name?: string;
  text?: string;
  isRoutingRule?: boolean;
  divOnClick?: React.MouseEventHandler<HTMLElement>;
  noValueHere?: boolean;
  onchangeValue: any;
  isCountryDropdown?: boolean;
  max_w_xs?: boolean;
  disabled?: boolean;
  countrydisabled?: boolean;
  isOpen: boolean;
  valueIsISO2?: boolean;
  errorStatus?: boolean;
  error?: string | undefined | any;
  setIsOpen: React.Dispatch<boolean>;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  iconsvg?: any;
  ClearValue?: any;
};

const InputDropDown = ({
  array,
  isOpen,
  isRoutingRule,
  value,
  text,
  isCountryDropdown,
  max_w_xs,
  noValueHere,
  errorStatus,
  onBlur,
  error,
  countrydisabled,
  valueIsISO2,
  setIsOpen,
  disabled,
  divOnClick,
  id,
  onchangeValue,
  name,
  iconsvg,
  ClearValue,
}: Props) => {
  const [query, setQuery] = useState("");

  function isSelected(x: any) {
    let selectedNameValue = value === x?.name;
    let selectedIso2Value = value === x?.iso2;

    return valueIsISO2 ? selectedIso2Value : selectedNameValue;
  }

  const filteredArray = array.filter((x) =>
    isCountryDropdown
      ? x?.name
          ?.toLowerCase()
          // .replace(/\s+/g, "")
          ?.includes(query?.toLowerCase()?.replace(/\s+/g, "")) ||
        x?.iso2
          ?.toLowerCase()
          // .replace(/\s+/g, "")
          ?.includes(query?.toLowerCase()?.replace(/\s+/g, ""))
      : x?.name
          ?.toLowerCase()
          .replace(/\s+/g, "")
          ?.includes(query?.toLowerCase()?.replace(/\s+/g, ""))
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);

    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (event.target.closest("#list-box, #list_btn")) {
      // setQuery("");
      return;
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={divOnClick}
        className={`relative block w-full ${
          max_w_xs ? "" : "sm:max-w-xs"
        } max-w-lg rounded-md font-normal border ${
          errorStatus
            ? "border-error_red text-error_text"
            : "border-grey_border_table focus:border-blue_primary active:border-blue_primary"
        }  focus:outline-none  py-2 px-3 text-sm text-table_head_color ${
          countrydisabled ? "bg-disable_grey" : ""
        } focus:text-font_black`}
      >
        <Listbox
          as="div"
          value={value || text}
          disabled={disabled}
          id={id}
          name={name}
          onChange={onchangeValue}
          onBlur={onBlur}
          // open={isOpen}
        >
          {() => (
            <div className="">
              <span className="inline-block w-full rounded-md" id="list_btn">
                <Listbox.Button
                  className="cursor-default relative w-full bg-transparent text-left focus:outline-none outline-none transition ease-in-out duration-150 text-sm"
                  onClick={() => setIsOpen(!isOpen)}
                  onBlur={() => setQuery("")}
                  //   open={isOpen}
                >
                  <span
                    className={`block truncate ${
                      _.isEmpty(value)
                        ? "text-table_head_color"
                        : "text-font_black"
                    }`}
                  >
                    {value || text}
                  </span>
                  <span className="absolute  inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {iconsvg ? (
                      iconsvg
                    ) : (
                      <svg
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.99992 4.50033L0.833252 0.354492L9.16658 0.354492L4.99992 4.50033Z"
                          fill="#6B7B80"
                        />
                      </svg>
                    )}
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                unmount={false}
                show={isOpen}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg left-0 right-0"
              >
                <div id="list-box" className="border border-grey_border_table">
                  <div className="flex w-full py-2 pl-6 pr-4 border-b border-grey_border_table">
                    <input
                      type="text"
                      placeholder="Search here"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      className="w-full focus:outline-transparent focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <Listbox.Options
                    static
                    className="max-h-60 rounded-md py-1 text-sm text-font_black overflow-auto focus:outline-none"
                  >
                    {noValueHere && !isRoutingRule && (
                      <Listbox.Option className="font-normal" value={text}>
                        {() => (
                          <div
                            className={`cursor-default select-none relative border-b border-grey_border_table py-2 mx-6`}
                          >
                            <span className="font-normal block truncate cursor-pointer">
                              {/* {item?.name} */}
                              {text}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    )}
                    {filteredArray.map((item, index) => {
                      const selected = isSelected(item);
                      return (
                        <Listbox.Option
                          key={index}
                          value={item?.name}
                          className={`${
                            selected
                              ? "font-bold text-blue_primary bg-light_geen"
                              : "font-normal"
                          }  `}
                        >
                          {() => (
                            <div
                              className={`cursor-default select-none relative ${
                                array.length - 1 === index
                                  ? "border-0"
                                  : "border-b"
                              } border-grey_border_table py-2 mx-6`}
                            >
                              <span
                                className={`${
                                  selected
                                    ? "font-bold text-blue_primary bg-light_geen"
                                    : "font-normal"
                                } block truncate cursor-pointer`}
                              >
                                {isCountryDropdown
                                  ? `${item?.iso2} - ${item?.name}`
                                  : item?.name}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                  {_.isEmpty(array) && (
                    <div className="">
                      <p className="py-3 px-6 block text-grey_border text-sm font-bold underline underline-grey_border_table">
                        No Data Found
                      </p>
                    </div>
                  )}
                  {!_.isEmpty(array) && ClearValue && (
                    <div className="">
                      <p
                        onClick={ClearValue}
                        className="py-3 px-6 block text-grey_border text-sm font-bold cursor-pointer underline underline-grey_border_table"
                      >
                        Clear
                      </p>
                    </div>
                  )}
                </div>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
      {errorStatus && (
        <p className="mt-21 text-sm text-error_red" id="email-error">
          {error}
        </p>
      )}
    </>
  );
};

export default InputDropDown;
