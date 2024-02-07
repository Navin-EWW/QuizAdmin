import { Fragment, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import LogOutModel from "../LogOutModel/LogOutModel";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const users = {
  name: "Chelsea Hagon",
  email: "chelsea.hagon@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "Your Profile", href: "#", current: true },
  { name: "Settings", href: "#", current: false },
  { name: "TeaSign outms", href: "#", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function AppHeader() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [logOutOpen, setlogOutOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const logOutCalled = (close: any) => {
    close();
    setlogOutOpen(true);
  };

  return (
    <>
      <LogOutModel open={logOutOpen} setOpen={setlogOutOpen} />
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "bg-white shadow-header lg:overflow-y-visible w-full sticky top-0 left-64 right-0 z-10"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between lg:gap-8 z-0">
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 py-4 min-h-[64px] ">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                    {/* <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            className="h-5 w-5 fill-search_icon"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block w-full rounded-md bg-white py-2 pl-10 pr-3 text-sm text-grey_icon placeholder-grey_icon focus:placeholder-grey_icon focus:outline-none font-normal font-Inter"
                          placeholder="Search"
                          type="search"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="flex items-center">
                  <a className="ml-5 flex-shrink-0 rounded-full bg-white p-1 focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    {/* <BellIcon
                      className="h-6 w-6 stroke-grey_icon"
                      aria-hidden="true"
                    /> */}
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15H17L15.5951 13.5951C15.2141 13.2141 15 12.6973 15 12.1585V9C15 6.38757 13.3304 4.16509 11 3.34142V3C11 1.89543 10.1046 1 9 1C7.89543 1 7 1.89543 7 3V3.34142C4.66962 4.16509 3 6.38757 3 9V12.1585C3 12.6973 2.78595 13.2141 2.40493 13.5951L1 15H6M12 15V16C12 17.6569 10.6569 19 9 19C7.34315 19 6 17.6569 6 16V15M12 15H6"
                        stroke="#6B7B80"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-5 flex-shrink-0">
                    <div>
                      <Menu.Button className=" flex rounded-full bg-white focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-10 w-10 rounded-full bg-blue_primary uppercase flex items-center justify-center text-[#fff] font-semibold">
                          {(user?.firstName &&
                            user?.lastName &&
                            user?.firstName.charAt(0) +
                              user?.lastName.charAt(0)) ||
                            "JP"}
                        </div>
                        {/* <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        /> */}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
                        <Menu.Item>
                          {({ close }) => (
                            <>
                              <p
                                className={classNames(
                                  "block py-2 px-4 text-sm text-font_black font-Inter font-normal cursor-pointer"
                                )}
                                onClick={() => (close(), navigate("/account"))}
                              >
                                Profile
                              </p>
                              <p
                                onClick={() => (close(), navigate("/setting"))}
                                className={classNames(
                                  "block py-2 px-4 text-sm text-font_black font-Inter font-normal cursor-pointer"
                                )}
                              >
                                Settings
                              </p>
                              <p
                                className={classNames(
                                  "block py-2 px-4 text-sm text-font_black font-Inter font-normal cursor-pointer"
                                )}
                                onClick={() => (logOutCalled(close), close())}
                              >
                                Sign out
                              </p>
                            </>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-50",
                      "block rounded-md py-2 px-3 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    /> */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="48" height="48" rx="6" fill="#00145b" />
                      <path
                        d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24 26C20.134 26 17 29.134 17 33H31C31 29.134 27.866 26 24 26Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    {/* <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div> */}
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white hover:bg-grey_bg  p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                  <p
                    onClick={() => (close(), navigate("/account"))}
                    className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    Your Profile
                  </p>
                  <p
                    onClick={() => (close(), navigate("/setting"))}
                    className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900  cursor-pointer"
                  >
                    Settings
                  </p>
                  <p
                    onClick={() => (logOutCalled(close), close())}
                    className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900  cursor-pointer"
                  >
                    Sign out
                  </p>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
}
