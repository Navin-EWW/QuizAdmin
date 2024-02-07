// import AboutPage from '../About_page/AboutPage'
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";
// import Log from '../Log/Log'
const tabs = [
  { name: "About", href: "#", current: true },
  { name: "User Info", href: "#", current: false },
  { name: "Log", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Merchant() {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey min-h-screen">
        <div>
          <a
            href="#"
            className="flex gap-2 items-end py-4 text-sm font-medium text-font_dark"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Back to merchant listing
          </a>
        </div>
        <h2 className="pb-4 text-2xl font-semibold text-font_black">
          Merchant details
        </h2>
        <div className="flex gap-4 items-center p-5 bg-white rounded-lg mb-4 shadow-md">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" rx="6" fill="#00145b" />
            <path
              d="M31 33V17C31 15.8954 30.1046 15 29 15H19C17.8954 15 17 15.8954 17 17V33M31 33L33 33M31 33H26M17 33L15 33M17 33H22M21 19H22M21 23H22M26 19H27M26 23H27M22 33V28C22 27.4477 22.4477 27 23 27H25C25.5523 27 26 27.4477 26 28V33M22 33H26"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span className="text-sm text-table_head_color font-medium font-Inter">
              Merchant
            </span>
            <p className="text-2xl font-semibold text-font_black">Zirkol</p>
          </div>
        </div>
        <div className="sm:bg-white sm:px-5 rounded-t-lg shadow-md">
          <div className="flex gap-2 flex-wrap justify-between sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="py-2 pl-3 pr-10 focus:outline-none"
              // defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
            <div>
              <button
                type="button"
                className="bg-blue_primary hover:bg-hoverChange px-4 py-2 text-white rounded-md text-sm"
              >
                Edit Merchant Info
              </button>
            </div>
          </div>

          <div className="hidden sm:flex justify-between items-center border-b border-grey_border_table font-Inter">
            <div className="">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "border-blue_primary text-font_black"
                        : "border-transparent text-font_dark",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-font_dark"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <button
                type="button"
                className="font-Inter rounded-md bg-blue_primary hover:bg-hoverChange py-2 px-4 text-sm font-medium text-white focus:outline-none"
              >
                Edit Merchant Info
              </button>
            </div>
          </div>
        </div>
        {/* <AboutPage />  */}
        {/* <Log/>  */}
      </div>

      <Outlet />
    </>
  );
}
