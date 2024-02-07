import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type props = {
  rangeStart: Date | null | undefined;
  setRangeStart: React.Dispatch<React.SetStateAction<Date | null | undefined>>;
  rangeEnd: Date | null | undefined;
  setRangeEnd: React.Dispatch<React.SetStateAction<Date | null | undefined>>;
  titlePlaceholder?: string;
  StartPlaceholder?: string;
  EndPlaceholder?: string;
  ExtraCss?: string;
  position?: string;
  color?: string;
  editablePaddingY?: string;
  svgicon?: boolean;
};

export default function DateRangePicker(data: props) {
  const {
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    titlePlaceholder,
    editablePaddingY,
    StartPlaceholder,
    EndPlaceholder,
    ExtraCss,
    position = "",
    color,
    svgicon,
  } = data;
  const [filterDate, setFilterDate] = useState(titlePlaceholder || "Filter");

  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");

  const selectEndDate = (d: any) => {
    let newDate: Date;
    newDate = new Date(d);
    newDate.setHours(23, 59, 59, 999);
    setRangeEnd(newDate);
    setFilterDate;
    setFilterEndDate(newDate.toISOString());
    let startNewDate = new Date();
    let FirstDate = filterDate.split("to")[0];
    // const EndDate =
    //   d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
    if (FirstDate === "Filter") {
      setFilterStartDate(startNewDate.toISOString());
      // setFilterDate(
      //   startNewDate.getUTCDate() +
      //     "/" +
      //     (startNewDate.getUTCMonth() + 1) +
      //     "/" +
      //     startNewDate.getUTCFullYear() +
      //     " to " +
      //     EndDate
      // );
    } else {
      setFilterDate(FirstDate + " to " + moment(newDate).format("DD/MM/YYYY"));
    }

    close();
  };

  const selectStartDate = (d: any) => {
    let newDate: Date;
    newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);
    setFilterStartDate(newDate.toISOString());
    setRangeStart(d);
    const StartDate = moment(d).format("DD/MM/YYYY");
    setFilterDate(StartDate + " to ");
  };

  const clearSearchOrder = (e: any) => {
    e.preventDefault();
    setRangeStart(null);
    setRangeEnd(null);
    setFilterEndDate("");
    setFilterStartDate("");
    setFilterDate("Filter");
  };

  return (
    <Popover className="relative ">
      {({ open }) => (
        <>
          <Popover.Button
            className={`${
              ExtraCss
                ? ExtraCss
                : `w-[160px] min-w-[160px] border-1 focus-visible:border-blue_primary text-font_black px-1 ${
                    editablePaddingY ? editablePaddingY : "py-2"
                  }`
            } inline-flex items-center rounded-md focus:border-blue_primary focus-visible:border-blue_primary hover:border-blue_primary pr-3 active:border-blue_primary outline-none`}
          >
            {/* <div className=" inline-flex items-center rounded-md hover:border-blue_primary active:border-blue_primary border-grey_border_table w-[220px] min-w-[220px] border-1 text-font_black px-1 py-2 "> */}
            <span
              className={`text-xs ${
                color && filterDate !== "Filter" ? color : "text-grey_border"
              }  inline-block overflow-hidden text-ellipsis`}
            >
              {filterDate.length > 20
                ? filterDate?.substring(0, 15) + "..."
                : filterDate}
            </span>

            {rangeStart && rangeEnd && (
              <XMarkIcon
                className="w-4 h-4 absolute  right-6 "
                onClick={clearSearchOrder}
              />
            )}
            {svgicon ? (
              <span className="absolute inset-y-0 right-0 flex items-center pr-[13px] pointer-events-none">
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
                    d="M0.234314 0.83429C0.546733 0.521871 1.05326 0.521871 1.36568 0.83429L3.99999 3.4686L6.6343 0.83429C6.94672 0.521871 7.45325 0.521871 7.76567 0.83429C8.07809 1.14671 8.07809 1.65324 7.76567 1.96566L4.56568 5.16566C4.25326 5.47808 3.74673 5.47808 3.43431 5.16566L0.234314 1.96566C-0.0781048 1.65324 -0.0781048 1.14671 0.234314 0.83429Z"
                    fill="#6B7B80"
                  />
                </svg>
              </span>
            ) : (
              <ChevronDownIcon
                className={`${
                  open
                    ? ""
                    : `text-opacity-70  ${color ? color : "text-font_black"}`
                }
            
              absolute right-2  h-5 w-5  transition duration-150 ease-in-out group-hover:text-opacity-80 ${
                color ? color : "text-table_head_color"
              }`}
                aria-hidden="true"
              />
            )}
            {/* </div> */}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={`absolute left-1/5 z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md`}
            >
              <div
                id="dateArea"
                className={`flex gap-4 bg-white rounded-md absolute p-4 z-3 calender_class shadow-md ${position}`}
              >
                <DatePicker
                  selectsStart
                  placeholderText={StartPlaceholder ? StartPlaceholder : ""}
                  selected={rangeStart}
                  startDate={rangeStart}
                  endDate={rangeEnd}
                  // maxDate={rangeEnd}
                  onChange={(e) => selectStartDate(e)}
                />

                <span className="flex items-center">to</span>
                <DatePicker
                  placeholderText={EndPlaceholder ? EndPlaceholder : ""}
                  selectsEnd
                  selected={rangeEnd}
                  startDate={rangeStart}
                  endDate={rangeEnd}
                  // minDate={rangeStart}
                  // maxDate={new Date()}
                  onChange={(e) => selectEndDate(e)}
                />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
