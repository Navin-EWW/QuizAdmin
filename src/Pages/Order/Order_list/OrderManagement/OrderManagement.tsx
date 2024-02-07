import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../utils/Pagination.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../utils/Pagination";
import CustomerOrder from "../CustomerOrder/CustomerOrder";
import SupplierOrder from "../SupplierOrder/SupplierOrder";
import MultiSelect from "../Component/SupplierSelecter";
import DateRangePicker from "../../../../utils/DateRangePicker";
const tab = [
  { name: "Customer Order", href: "#", current: true },
  { name: "Supplier Order", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function OrderManagement() {
  const [tabs, setTabs] = useState(tab);
  const [Tabname, setTabname] = useState(true);
  // cp
  // const [IsOpen, setIsOpen] = useState(false);

  const [compareToggle, setcompareToggle] = useState(false);
  const navigate = useNavigate();
  const tabCalled = (tab: any) => {
    if (compareToggle) {
      //   setcancelModel(true);
      //   settabToggle(tab);
    } else {
      if (tab?.target?.value) {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.target?.value
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          setTabname(!Tabname);
      } else {
        setTabs(
          [...tabs].map((object) =>
            object?.name === tab?.name
              ? {
                  ...object,
                  current: true,
                }
              : {
                  ...object,
                  current: false,
                }
          )
        ),
          setTabname(!Tabname);
      }
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 md:rounded-lg py-4 sm:py-0 bg-background_grey min-h-screen">
        <div className="flex justify-between items-center pt-5 pb-3 ">
          <h2 className="pb-4 text-2xl font-semibold text-font_black">
            Order Management
          </h2>

          <a
            onClick={() => navigate("/order/add")}
            className="text-sm text-blue_primary font-semibold cursor-pointer border-b-2 border-blue_primary"
          >
            + New order
          </a>
        </div>

        <div className="bg-white px-6 rounded-t-md shadow-XOYO">
          <div className="flex gap-2 flex-wrap justify-between sm:hidden py-4">
            <div className="px-1">
              <select
                id="tabs"
                name="tabs"
                className="py-2 pl-3 pr-10 focus:outline-none border-grey_border_table border rounded-md"
                onChange={(tab) => tabCalled(tab)}
                // value={selectedTabName}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden sm:flex justify-between items-center border-grey_border_table">
            <div className="">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab: any) => (
                  <p
                    key={tab.name}
                    onClick={() => tabCalled(tab)}
                    className={classNames(
                      tab.current
                        ? "border-blue_primary text-blue_primary"
                        : "border-transparent text-font_dark",
                      "whitespace-nowrap py-3 px-1 border-b-2 font-medium  cursor-pointer"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </p>
                ))}
              </nav>
            </div>
          </div>

          {/* <DialogBox
            showDialog={cancelModel}
            confirmNavigation={confirmBack}
            cancelNavigation={cancelBack}
          /> */}
        </div>

        {/* {(!isFetching || isFetched) && ( */}

        <div className="border-table_border pb-20">
          <div className="px-6 rounded-b-md bg-white ">
            <div className="border-table_border">
              {/* main Content */}
              {tabs[0]?.current ? <CustomerOrder /> : <SupplierOrder />}
              {/* pagination */}
            </div>
          </div>

          {/* )} */}
        </div>
      </div>
    </>
  );
}
