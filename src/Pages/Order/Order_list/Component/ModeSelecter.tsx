import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ServiceSupplierType } from "../../../../types/order";

type Props = {
  selectedValue?: ServiceSupplierType[];
  AllData?: ServiceSupplierType[];
  isOpen?: boolean;
  handleSelect?: (value?: any) => void;
  isSelected: (value: string) => void;
  setSelectedValue: (value: []) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  Label?: string | null;
  Clear?: (value?: any) => void;
  extraCss?: string;
};

export default function ModeSelecter(prop: Props) {
  const {
    selectedValue = [],
    AllData = [],
    isOpen,
    handleSelect,
    isSelected,
    setSelectedValue,
    setIsOpen,
    extraCss,
    Label,
    Clear,
  } = prop;

  const [FilterStatusData, setfilterStatusData] = useState("");
  const [update, setUpdateOnClick] = useState(false);
  let labelid;
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const filteredPeople = AllData.filter((person: any) =>
    person?.value
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(FilterStatusData.toLowerCase().replace(/\s+/g, ""))
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [update]);

  // const handleClickOutside = (event: any) => {
  //   labelid = Label?.split(" ")[0];
  //   setUpdateOnClick(!update);
  //   if (event.target.closest(`#${labelid}`)) {
  //   } else {
  //     setIsOpen(false);
  //   }

  //   if (event.target.closest(`#${labelid}1`)) {
  //     setIsOpen(!isOpen);
  //   }
  // };

  const handleClickOutside = (event: any) => {
    if (event.target.closest("#list-box-mode, #list_btn-mode")) return;
    else {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Listbox
        as="div"
        className="relative inline-block text-left font-Nunito w-full"
        value={selectedValue}
        onChange={handleSelect}
        //   open={isOpen}
      >
        {() => (
          <>
            <span className="inline-block w-full" id="list_btn-mode">
              <Listbox.Button
                className={`inline-flex  w-full justify-between items-center border border-grey_border_table bg-gray-50 rounded-md px-[13px]  text-sm font-medium text-grey_border outline-none transition ease-in-out duration-150 ${
                  extraCss ? extraCss : "py-1.5"
                }`}
                //   className="cursor-default relative w-full border border-grey_border bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                onClick={() => setIsOpen(!isOpen)}
                // open={isOpen}
              >
                {selectedValue.length < 1 ? (
                  <span className="block text-xs capitalize truncate">
                    Filter
                  </span>
                ) : (
                  <span className="block text-xs capitalize text-font_black truncate">
                    {Label} {selectedValue.length}
                  </span>
                )}

                <span className="absolute inset-y-0 right-0 flex items-center pr-[13px] pointer-events-none">
                  {/* <svg
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
                  </svg> */}
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.234345 0.83429C0.546764 0.521871 1.05329 0.521871 1.36571 0.83429L4.00002 3.4686L6.63434 0.83429C6.94675 0.521871 7.45329 0.521871 7.7657 0.83429C8.07812 1.14671 8.07812 1.65324 7.7657 1.96566L4.56571 5.16566C4.25329 5.47808 3.74676 5.47808 3.43434 5.16566L0.234345 1.96566C-0.0780742 1.65324 -0.0780742 1.14671 0.234345 0.83429Z"
                      fill="#6B7B80"
                    />
                  </svg>
                </span>
              </Listbox.Button>
            </span>

            <Transition
              unmount={false}
              show={isOpen}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="absolute mt-1 min-w-full bg-white shadow-lg z-10"
            >
              <div id="list-box-mode" className="border-grey_border">
                {/* <div className="flex w-full py-1 pl-6 pr-4 border-b border-grey_border">
                  <input
                    type="text"
                    placeholder="Search here"
                    value={FilterStatusData}
                    onChange={(e) => {
                      setfilterStatusData(e.target.value);
                    }}
                    className="w-full focus:outline-none"
                  />
                  <button onClick={() => setfilterStatusData("")} type="button">
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
                </div> */}
                <Listbox.Options
                  static
                  className="max-h-60  py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                >
                  {filteredPeople.map((person: any, index) => {
                    const selected: any = isSelected(person?.value);
                    return (
                      <>
                        {/*  ? "font-bold text-blue_primary bg-light_geen" */}
                        <Listbox.Option
                          key={person?.value}
                          value={person?.value}
                          className={`${
                            selected
                              ? "font-bold text-blue_primary bg-button_color"
                              : "font-normal"
                          }  `}
                        >
                          {({ active }) => (
                            <div
                              className={`${
                                active ? "text-font_black " : "text-font_black"
                              } cursor-default select-none relative ${
                                AllData.length - 1 === index
                                  ? "border-0"
                                  : "border-b"
                              } border-grey_border_table py-2 mx-6`}
                            >
                              <span
                                className={`${
                                  selected
                                    ? "font-bold text-blue_primary"
                                    : "font-normal"
                                } block truncate cursor-pointer`}
                              >
                                {person?.value}
                              </span>
                            </div>
                          )}
                        </Listbox.Option>
                      </>
                    );
                  })}
                </Listbox.Options>

                <div className="border-t border-grey_border">
                  <button
                    type="button"
                    // onClick={() => {
                    //   setSelectedValue([]);
                    // }}
                    onClick={Clear}
                    className="py-3 px-6 block text-grey_border text-sm font-bold underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}
