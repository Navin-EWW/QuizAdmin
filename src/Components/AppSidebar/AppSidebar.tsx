import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { isArray } from "lodash";
import logoIcon from "/logo.svg";

import HomeIcon from "/icon/home.svg";
import BookingIcon from "/icon/order.svg";
import ClientIcon from "/icon/client.svg";
import AdminIcon from "/icon/admin.svg";
import ProviderIcon from "/icon/provider.svg";
import AccountIcon from "/icon/account.svg";
import VariableIcon from "/icon/variable.svg";
import routingRule from "/icon/routingRule.svg";

const navigation = [
  // {
  //   name: "Dashboard",
  //   icon: HomeIcon,
  //   current: false,
  //   children: [
  //     { name: "Overview", to: "/overview" },
  //     { name: "Members", to: "/member" },
  //     { name: "Calendar", to: "/calender" },
  //     { name: "Settings", to: "/settings" },
  //   ],
  // },
  {
    name: "Exam Management",
    icon: ClientIcon,
    current: false,
    children: [
      { name: "Examination", to: "/merchant/list" },
      { name: "+ New Examination", to: "/merchant/add" },
    ],
  },
  {
    name: "Test Management",
    icon: BookingIcon,
    current: false,
    children: [
      { name: "List View", to: "/order/list" },
      { name: "+ New Test", to: "/order/add" },
    
      // { name: "Bulk Edit Supplier Order", to: "/404" },
    ],
  },
  {
    name: "Subject Management",
    
    icon: ProviderIcon,
    current: false,
    children: [
      { name: "Subject", to: "/subject/list" },
      { name: "+ New Subject", to: "/subject/add" },
      { name: "Question", to: "/question/list" },
      { name: "+ New Question", to: "/question/add" },
    ],
  },
 
  {
    name: "User Magement",
    icon: AdminIcon,
    current: false,
    children: [
      { name: "List View", to: "service-supplier/list" },
      { name: "+ New Supplier", to: "service-supplier/add" },
    ],
  },
  {
    name: "Wallet",
    icon: ProviderIcon,
    current: false,
    children: [
      { name: "Bank Transfer", to: "bank-transfer/list" },
      { name: "Charges", to: "charges/list" },
      { name: "+ New Charges", to: "charges/add" },
    ],
  },
  // {
  //   name: "System variable",
  //   icon: VariableIcon,
  //   current: false,
  //   children: [
  //     { name: "List", to: "/overview" },
  //     { name: "Members", to: "/members" },
  //     { name: "Calendar", to: "/calendar" },
  //     { name: "Settings", to: "/settings" },
  //   ],
  // },
  {
    name: "My Account",
    icon: AccountIcon,
    current: false,
    to: "/account",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sideNavigation = navigation?.map((item) => {
    let isSelected: any =
      isArray(item?.children) &&
      item?.children?.map((childItem) => {
        const baseNav = childItem?.to;
        if (baseNav === location?.pathname) {
          return true;
        } else {
          return false;
        }
      });

    return (
      <>
        {!item.children ? (
          <div key={item.name}>
            <NavLink
              to={item?.to}
              onClick={() => setSidebarOpen(false)}
              className={(props) => {
                return classNames(
                  props?.isActive && "bg-grey_bg",
                  "group w-full flex items-center pl-2 pr-1 py-3 font-Inter text-font_black text-left text-sm font-medium rounded-md focus:outline-none focus:bg-grey_bg active:bg-grey_bg hover:bg-grey_bg"
                );
              }}
            >
              <img
                src={item.icon}
                className={classNames(
                  item.current ? "" : "",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />

              {item.name}
            </NavLink>
          </div>
        ) : (
          <Disclosure
            as="div"
            key={item.name}
            className="space-y-1"
            defaultOpen={
              isSelected.includes(true) || isSelected === true ? true : false
            }
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`group w-full flex items-center pl-2 pr-1 py-3 font-Inter text-font_black text-left ${
                    (isSelected.includes(true) || isSelected === true
                      ? true
                      : false) && "bg-grey_bg"
                  } text-sm font-medium rounded-md focus:outline-none focus:bg-grey_bg active:bg-grey_bg hover:bg-grey_bg`}
                >
                  <img
                    src={item.icon}
                    className="mr-3 h-6 w-6 flex-shrink-0 text-font_black group-hover:text-font_black"
                    aria-hidden="true"
                  />
                  <span className="flex-1 ">{item.name}</span>
                  <svg
                    className={classNames(
                      open ? "rotate-90" : "",
                      "ml-3 h-5 w-5 flex-shrink-0 transform transition-colors text-font_black duration-150 ease-in-out group-hover:text-font_black"
                    )}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6L14 10L6 14V6Z"
                      fill="currentColor"
                      className="fill-grey_icon"
                    />
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel as="ul" className="space-y-1">
                  {item.children.map((subItem) => {
                    return (
                      <NavLink
                        key={subItem.name}
                        to={subItem.to}
                        onClick={() => setSidebarOpen(false)}
                        className={(props) => {
                          return classNames(
                            props?.isActive && "bg-grey_bg",
                            " hover:bg-grey_bg  group flex w-full font-Inter items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium cursor-pointer"
                          );
                        }}
                      >
                        <li
                        // onClick={()=>setSidebarOpen(false)}
                        >
                          {subItem.name}
                        </li>
                      </NavLink>
                    );
                  })}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )}
      </>
    );
  });

  return (
    <>
      <div>
        <button
          type="button"
          className="shadow px-4 py-5 focus:outline-none fixed left-0 top-0 md:hidden z-40"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-table_head_color bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-black"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex flex-shrink-0 items-center px-4">
                    <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
                    <img className="w-20 h-20" src={logoIcon} alt="logo"/>
                      {/* <svg
                        width="161"
                        height="32"
                        viewBox="0 0 161 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_589_3310)">
                          <path
                            d="M15.9662 32.0015C24.7841 32.0015 31.9325 24.8377 31.9325 16.0008C31.9325 7.16378 24.7841 0 15.9662 0C7.14832 0 0 7.16378 0 16.0008C0 24.8377 7.14832 32.0015 15.9662 32.0015Z"
                            fill="#00145b"
                          />
                          <path
                            d="M37.5848 25.82C37.4102 25.7751 37.2575 25.6783 37.1514 25.5437C37.0505 25.4103 36.9975 25.2509 37.0001 25.0892C37.0014 24.8885 37.0906 24.6961 37.2485 24.5556C37.4011 24.4033 37.6172 24.3171 37.8435 24.3194L38.1023 24.3584H38.167C38.2743 24.3726 38.383 24.3797 38.4917 24.3785C38.9677 24.3785 39.3028 24.2994 39.4981 24.1424C39.6934 23.9853 39.7905 23.6819 39.7905 23.2345V11.9987C39.7879 11.7543 39.8927 11.5193 40.0828 11.347C40.2639 11.1675 40.5201 11.0672 40.7866 11.0707C41.3377 11.0613 41.793 11.4603 41.8034 11.9633C41.8034 11.9751 41.8034 11.9869 41.8034 11.9987V23.2746C41.8034 24.1565 41.5615 24.8306 41.0789 25.2982C40.5964 25.7657 39.8849 25.9994 38.947 25.9994C38.4852 26.0065 38.0259 25.9463 37.5848 25.82V25.82ZM39.9548 8.82639C39.7387 8.63868 39.6171 8.37776 39.6197 8.10622V8.02712C39.6313 7.46398 40.1281 7.01063 40.7452 7H40.8745C41.4916 7.01063 41.9884 7.46398 42 8.02712V8.11095C41.9884 8.67409 41.4916 9.12745 40.8745 9.13807H40.7452C40.4463 9.13925 40.1604 9.0271 39.9548 8.82875V8.82639Z"
                            fill="black"
                          />
                          <path
                            d="M45.8346 20.5049C45.2484 20.1726 44.7798 19.7065 44.4809 19.1576C44.1545 18.5656 43.99 17.9169 44.0005 17.2603V11.8733C43.9966 11.6397 44.1075 11.4151 44.3059 11.2563C44.4965 11.0896 44.7563 10.9978 45.0265 11C45.58 11.0012 46.0291 11.3913 46.0304 11.8722V17.0697C46.0304 18.5996 46.8241 19.3652 48.4102 19.3652C49.0772 19.3731 49.7325 19.2166 50.2991 18.9115C50.9374 18.5452 51.5027 18.0904 51.97 17.5642V11.8733C51.9661 11.6397 52.0771 11.4151 52.2755 11.2563C52.4661 11.0896 52.7259 10.9978 52.9961 11C53.5496 11.0012 53.9986 11.3913 54 11.8722V20.0105C54.0026 20.2452 53.8968 20.4709 53.7049 20.6365C53.5222 20.8077 53.2637 20.9041 52.9948 20.9019C52.4321 20.8939 51.9779 20.4993 51.9687 20.0105V19.2914C51.4374 19.8041 50.8095 20.2339 50.1124 20.5628C49.4362 20.861 48.6869 21.0107 47.9285 20.9994C47.1909 21.0096 46.4651 20.8384 45.8346 20.5049V20.5049Z"
                            fill="black"
                          />
                          <path
                            d="M71.6388 12.878C71.8807 13.4429 72.0045 14.0498 71.9999 14.6612V20.1254C72.0022 20.3591 71.9029 20.5837 71.7264 20.7425C71.5558 20.9081 71.3232 21.0011 71.0813 20.9988C70.5858 20.9977 70.1838 20.6075 70.1826 20.1265V15.0038C70.1826 14.1564 70.0295 13.5496 69.7233 13.182C69.4171 12.8145 68.9111 12.6307 68.204 12.6319C67.6384 12.6137 67.081 12.7771 66.6205 13.097C66.1355 13.4668 65.7241 13.9205 65.4086 14.4344V20.1265C65.4109 20.3602 65.3116 20.5848 65.1351 20.7436C64.9645 20.9092 64.7319 21.0022 64.49 21C63.9945 20.9988 63.5925 20.6086 63.5913 20.1276V15.0038C63.5913 14.1564 63.4382 13.5496 63.132 13.182C62.8258 12.8145 62.3198 12.6307 61.6128 12.6319C61.0471 12.6137 60.4897 12.7771 60.0292 13.097C59.5442 13.4668 59.1329 13.9205 58.8173 14.4344V20.1265C58.8197 20.3602 58.7203 20.5848 58.5439 20.7436C58.3732 20.9092 58.1407 21.0022 57.8987 21C57.4032 20.9988 57.0012 20.6086 57 20.1276V11.9864C56.9977 11.7516 57.0935 11.5259 57.2642 11.3603C57.4278 11.189 57.6592 11.0926 57.8999 11.0948C58.4036 11.1028 58.8103 11.4975 58.8185 11.9864V12.6943C59.189 12.1906 59.6611 11.7664 60.2069 11.4465C60.7281 11.1493 61.3662 11.0007 62.1223 11.0007C62.7814 10.9871 63.4277 11.1765 63.97 11.5418C64.4842 11.8866 64.8827 12.3721 65.1129 12.9359C65.9205 11.6461 67.1195 11.0007 68.7101 11.0007C69.4662 11.0007 70.0844 11.1776 70.5671 11.5316C71.0427 11.8787 71.4132 12.3438 71.6388 12.878V12.878Z"
                            fill="black"
                          />
                          <path
                            d="M75.2672 25.724C75.0946 25.5511 74.9977 25.3153 75 25.0701V12.0116C75.0012 11.5094 75.4079 11.1019 75.909 11.1007C76.1537 11.0983 76.389 11.1955 76.5615 11.3684C76.74 11.5343 76.8405 11.7688 76.8381 12.0128V12.4866C77.7838 11.4952 78.9044 11 80.1999 11C81.9304 10.9953 83.5215 11.9477 84.3371 13.4769C84.7886 14.3381 85.0168 15.2988 84.999 16.2713C84.999 17.3551 84.7744 18.2862 84.3265 19.0656C83.9104 19.8249 83.2981 20.4575 82.5534 20.8981C81.8382 21.3234 81.0214 21.5461 80.1893 21.5425C78.8973 21.5425 77.7767 21.0474 76.8275 20.0559V25.0689C76.837 25.5736 76.4374 25.9905 75.9339 26C75.922 26 75.9102 26 75.8984 26C75.6584 26 75.4303 25.9005 75.2672 25.724V25.724ZM82.3063 18.8785C82.8796 18.2518 83.1669 17.3824 83.1669 16.2725C83.1669 15.1625 82.8796 14.2931 82.3063 13.6664C81.733 13.0398 80.9458 12.7259 79.9422 12.7259C79.3606 12.7259 78.7873 12.8633 78.2684 13.1263C77.7306 13.3928 77.2448 13.7541 76.8346 14.1924V18.3537C77.2448 18.7932 77.7306 19.1533 78.2684 19.4198C78.7873 19.6804 79.3583 19.8166 79.9387 19.8166C80.941 19.8178 81.7283 19.5051 82.3016 18.8773H82.3063V18.8785Z"
                            fill="black"
                          />
                          <path
                            d="M87.267 25.724C87.0945 25.551 86.9977 25.3153 87 25.0701V12.0116C87.0012 11.507 87.4099 11.0995 87.9131 11.1007C87.9131 11.1007 87.9143 11.1007 87.9155 11.1007C88.16 11.0983 88.3951 11.1955 88.5675 11.3684C88.7459 11.5342 88.8463 11.7688 88.8439 12.0128V12.4866C89.7889 11.4952 90.9087 11 92.2033 11C93.9326 10.9953 95.5225 11.9477 96.3376 13.4769C96.7888 14.3381 97.0168 15.2987 96.999 16.2713C96.999 17.3551 96.7746 18.2862 96.3269 19.0656C95.9111 19.8249 95.2993 20.4575 94.5551 20.8981C93.8405 21.3234 93.0242 21.5461 92.1927 21.5425C90.9016 21.5425 89.7818 21.0474 88.8333 20.0559V25.0689C88.8427 25.5735 88.4435 25.9905 87.9403 26C87.9285 26 87.9167 26 87.9049 26C87.6627 26.0023 87.4312 25.9016 87.267 25.724V25.724ZM94.3011 18.8785C94.874 18.2518 95.1611 17.3824 95.1611 16.2724C95.1611 15.1625 94.874 14.2931 94.3011 13.6664C93.7283 13.0398 92.9416 12.7259 91.9387 12.7259C91.3587 12.7271 90.7882 12.8645 90.2708 13.1263C89.7334 13.3928 89.2479 13.7541 88.838 14.1924V18.3537C89.2479 18.7932 89.7334 19.1533 90.2708 19.4198C90.7894 19.6804 91.3599 19.8166 91.9399 19.8166C92.9404 19.8178 93.7283 19.5051 94.3011 18.8773V18.8785Z"
                            fill="black"
                          />
                          <path
                            d="M101.369 20.3789C100.623 19.9565 100.016 19.3373 99.6231 18.5935C98.7923 16.9507 98.7923 15.0304 99.6231 13.3877C100.018 12.6449 100.631 12.0303 101.385 11.6213C102.187 11.1977 103.09 10.9831 104.003 11.001C104.912 10.9831 105.809 11.1966 106.605 11.6202C107.36 12.0359 107.975 12.6528 108.376 13.3966C108.803 14.2012 109.016 15.0956 108.999 16.0001C109.018 16.9013 108.803 17.7923 108.376 18.5935C107.975 19.3429 107.356 19.9643 106.595 20.3789C105.8 20.8014 104.904 21.0149 103.996 20.9992C102.999 20.9992 102.123 20.7924 101.369 20.3789V20.3789ZM105.535 19.0441C106.049 18.7856 106.47 18.3822 106.741 17.8878C107.04 17.3676 107.189 16.7316 107.189 15.9776C107.189 15.2237 107.035 14.5495 106.724 14.0607C106.456 13.6023 106.062 13.2247 105.585 12.9708C105.098 12.7168 104.551 12.5876 103.999 12.5944C103.467 12.5944 102.941 12.709 102.461 12.9315C101.947 13.1888 101.526 13.591 101.252 14.0832C100.953 14.5967 100.804 15.2293 100.804 15.981C100.804 16.7833 100.959 17.4283 101.27 17.917C101.533 18.3834 101.927 18.7688 102.409 19.0261C102.895 19.28 103.442 19.4092 103.995 19.4025C104.532 19.4025 105.06 19.2789 105.537 19.0441H105.535Z"
                            fill="black"
                          />
                          <path
                            d="M112.282 8.78092C112.1 8.59788 111.998 8.34346 112 8.07868V8.00155C112.01 7.45242 112.427 7.01036 112.946 7H113.054C113.573 7.01036 113.99 7.45242 114 8.00155V8.08098C113.99 8.63011 113.573 9.07217 113.054 9.08253H112.946C112.695 9.08369 112.454 8.97432 112.282 8.78092ZM112.39 20.7397C112.23 20.5762 112.141 20.3494 112.145 20.1134V11.8523C112.142 11.614 112.232 11.3849 112.39 11.2169C112.542 11.043 112.758 10.9452 112.982 10.9475C113.445 10.9383 113.827 11.3274 113.836 11.8178C113.836 11.8293 113.836 11.8408 113.836 11.8523V20.1134C113.838 20.3506 113.746 20.5785 113.582 20.7397C113.423 20.9077 113.207 21.0021 112.982 20.9998C112.76 21.0044 112.546 20.9123 112.39 20.7443V20.7397Z"
                            fill="black"
                          />
                          <path
                            d="M117.266 20.7482C117.093 20.5871 116.997 20.3637 117 20.1311V11.9874C116.998 11.7526 117.094 11.5269 117.266 11.3613C117.43 11.1901 117.662 11.0936 117.904 11.0959C118.411 11.1039 118.819 11.4986 118.827 11.9874V12.7088C119.305 12.1961 119.87 11.7662 120.497 11.4373C121.106 11.139 121.78 10.9893 122.462 11.0006C123.133 10.9882 123.794 11.1583 124.368 11.494C124.893 11.8252 125.313 12.2914 125.577 12.8415C125.865 13.4347 126.009 14.0835 126 14.739V20.1266C126.002 20.3603 125.902 20.5848 125.725 20.7436C125.553 20.9092 125.32 21.0022 125.076 21C124.579 20.9988 124.175 20.6087 124.173 20.1277V14.9285C124.173 13.3984 123.459 12.6328 122.032 12.6328C121.432 12.6248 120.843 12.7814 120.333 13.0865C119.759 13.4517 119.25 13.9077 118.83 14.4339V20.1255C118.832 20.3591 118.732 20.5837 118.555 20.7425C118.384 20.9081 118.15 21.0011 117.907 20.9988C117.666 21.0045 117.435 20.9138 117.266 20.7482V20.7482Z"
                            fill="black"
                          />
                          <path
                            d="M133.778 19.4912C133.92 19.6201 134.001 19.7975 134 19.9828C134 20.2733 133.839 20.4993 133.516 20.6609C132.99 20.8869 132.417 21.0033 131.838 20.9999C129.857 20.9999 128.865 20.1614 128.865 18.4854V12.7479H127.855C127.409 12.7705 127.027 12.4507 127.001 12.0337C126.977 11.6167 127.319 11.2596 127.765 11.2358C127.794 11.2347 127.825 11.2347 127.854 11.2358H128.858V9.88875C128.84 9.64465 128.932 9.40506 129.111 9.22764C129.302 9.06942 129.553 8.98806 129.808 9.00162C130.064 8.98693 130.313 9.07281 130.496 9.23781C130.666 9.41637 130.753 9.65143 130.738 9.88988V11.2324H133.003C133.441 11.2245 133.803 11.5511 133.811 11.9614C133.811 11.9704 133.811 11.9794 133.811 11.9885C133.813 12.1862 133.729 12.3772 133.579 12.5174C133.431 12.6654 133.22 12.7479 133.003 12.7434H130.738V18.3385C130.738 18.7804 130.846 19.0765 131.062 19.2268C131.279 19.3771 131.6 19.4528 132.029 19.4528C132.304 19.4539 132.576 19.4155 132.838 19.3398C132.86 19.3409 132.882 19.3342 132.899 19.3206C133.011 19.298 133.127 19.2856 133.242 19.2833C133.443 19.2799 133.637 19.3556 133.776 19.4912H133.778Z"
                            fill="black"
                          />
                          <path
                            d="M10.0013 15.051C10.0013 14.2306 10.0013 13.4102 10.0013 12.5911C9.99748 9.34654 12.339 6.57301 15.5 6.07897C19.0261 5.52734 22.2954 7.92202 22.9072 11.5019C23.4686 14.7912 21.428 18.0613 18.272 18.9291C18.1688 18.9573 18.0631 18.988 17.9573 18.9969C17.5683 19.0302 17.2246 18.7896 17.129 18.4248C17.0257 18.0332 17.2032 17.6351 17.5696 17.4713C17.7408 17.3945 17.9258 17.351 18.1033 17.2883C20.227 16.5447 21.5728 14.4392 21.3852 12.1508C21.2014 9.90713 19.4717 8.02441 17.2649 7.6686C14.3091 7.19248 11.6189 9.51676 11.6101 12.5591C11.6051 14.2818 11.6101 16.0045 11.6076 17.726C11.6076 17.8757 11.6088 18.0293 11.5799 18.174C11.4943 18.6078 11.1632 18.8574 10.7364 18.8293C10.3273 18.8011 10.0176 18.4863 10.0113 18.0447C9.99874 17.1564 10.0076 16.2682 10.0063 15.3787C10.0063 15.2699 10.0063 15.1598 10.0063 15.051C10.0038 15.051 10.0025 15.051 10 15.051H10.0013Z"
                            fill="white"
                          />
                          <path
                            d="M15.2937 14.0269C15.2264 14.1867 15.2549 14.3388 15.2549 14.487C15.2523 16.5204 15.2575 18.5537 15.2523 20.5871C15.2471 22.7086 13.7333 24.5183 11.6256 24.9286C11.341 24.9835 11.0498 25.0104 10.7587 24.9963C10.3123 24.9746 10.016 24.6883 10.0005 24.2844C9.98629 23.8819 10.2658 23.57 10.7031 23.5163C10.936 23.4869 11.1715 23.4985 11.4031 23.4448C12.8173 23.1163 13.7359 21.9597 13.7437 20.458C13.7501 19.134 13.7359 17.8112 13.7294 16.4871C13.723 14.9177 13.7152 13.3483 13.7061 11.7801C13.6997 10.5021 14.4152 9.48222 15.5732 9.12054C16.6199 8.79464 17.7572 9.14354 18.4365 9.99855C19.1235 10.8638 19.1882 12.0562 18.5982 12.9892C18.0147 13.9119 16.924 14.3771 15.8462 14.1598C15.6599 14.1215 15.4748 14.0717 15.2898 14.0269H15.2937Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_589_3310">
                            <rect width="160.667" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg> */}
                    </Link>
                  </div>

                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    {sideNavigation}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* responsive */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-white border-r border-table_border shadow-lg">
          <div className="flex flex-grow flex-col overflow-y-auto pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
              <img className="w-20 h-20" src={logoIcon} alt="logo"/>
                {/* <svg
                  width="161"
                  height="32"
                  viewBox="0 0 161 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_589_3310)">
                    <path
                      d="M15.9662 32.0015C24.7841 32.0015 31.9325 24.8377 31.9325 16.0008C31.9325 7.16378 24.7841 0 15.9662 0C7.14832 0 0 7.16378 0 16.0008C0 24.8377 7.14832 32.0015 15.9662 32.0015Z"
                      fill="#00145b"
                    />
                    <path
                      d="M37.5848 25.82C37.4102 25.7751 37.2575 25.6783 37.1514 25.5437C37.0505 25.4103 36.9975 25.2509 37.0001 25.0892C37.0014 24.8885 37.0906 24.6961 37.2485 24.5556C37.4011 24.4033 37.6172 24.3171 37.8435 24.3194L38.1023 24.3584H38.167C38.2743 24.3726 38.383 24.3797 38.4917 24.3785C38.9677 24.3785 39.3028 24.2994 39.4981 24.1424C39.6934 23.9853 39.7905 23.6819 39.7905 23.2345V11.9987C39.7879 11.7543 39.8927 11.5193 40.0828 11.347C40.2639 11.1675 40.5201 11.0672 40.7866 11.0707C41.3377 11.0613 41.793 11.4603 41.8034 11.9633C41.8034 11.9751 41.8034 11.9869 41.8034 11.9987V23.2746C41.8034 24.1565 41.5615 24.8306 41.0789 25.2982C40.5964 25.7657 39.8849 25.9994 38.947 25.9994C38.4852 26.0065 38.0259 25.9463 37.5848 25.82V25.82ZM39.9548 8.82639C39.7387 8.63868 39.6171 8.37776 39.6197 8.10622V8.02712C39.6313 7.46398 40.1281 7.01063 40.7452 7H40.8745C41.4916 7.01063 41.9884 7.46398 42 8.02712V8.11095C41.9884 8.67409 41.4916 9.12745 40.8745 9.13807H40.7452C40.4463 9.13925 40.1604 9.0271 39.9548 8.82875V8.82639Z"
                      fill="black"
                    />
                    <path
                      d="M45.8346 20.5049C45.2484 20.1726 44.7798 19.7065 44.4809 19.1576C44.1545 18.5656 43.99 17.9169 44.0005 17.2603V11.8733C43.9966 11.6397 44.1075 11.4151 44.3059 11.2563C44.4965 11.0896 44.7563 10.9978 45.0265 11C45.58 11.0012 46.0291 11.3913 46.0304 11.8722V17.0697C46.0304 18.5996 46.8241 19.3652 48.4102 19.3652C49.0772 19.3731 49.7325 19.2166 50.2991 18.9115C50.9374 18.5452 51.5027 18.0904 51.97 17.5642V11.8733C51.9661 11.6397 52.0771 11.4151 52.2755 11.2563C52.4661 11.0896 52.7259 10.9978 52.9961 11C53.5496 11.0012 53.9986 11.3913 54 11.8722V20.0105C54.0026 20.2452 53.8968 20.4709 53.7049 20.6365C53.5222 20.8077 53.2637 20.9041 52.9948 20.9019C52.4321 20.8939 51.9779 20.4993 51.9687 20.0105V19.2914C51.4374 19.8041 50.8095 20.2339 50.1124 20.5628C49.4362 20.861 48.6869 21.0107 47.9285 20.9994C47.1909 21.0096 46.4651 20.8384 45.8346 20.5049V20.5049Z"
                      fill="black"
                    />
                    <path
                      d="M71.6388 12.878C71.8807 13.4429 72.0045 14.0498 71.9999 14.6612V20.1254C72.0022 20.3591 71.9029 20.5837 71.7264 20.7425C71.5558 20.9081 71.3232 21.0011 71.0813 20.9988C70.5858 20.9977 70.1838 20.6075 70.1826 20.1265V15.0038C70.1826 14.1564 70.0295 13.5496 69.7233 13.182C69.4171 12.8145 68.9111 12.6307 68.204 12.6319C67.6384 12.6137 67.081 12.7771 66.6205 13.097C66.1355 13.4668 65.7241 13.9205 65.4086 14.4344V20.1265C65.4109 20.3602 65.3116 20.5848 65.1351 20.7436C64.9645 20.9092 64.7319 21.0022 64.49 21C63.9945 20.9988 63.5925 20.6086 63.5913 20.1276V15.0038C63.5913 14.1564 63.4382 13.5496 63.132 13.182C62.8258 12.8145 62.3198 12.6307 61.6128 12.6319C61.0471 12.6137 60.4897 12.7771 60.0292 13.097C59.5442 13.4668 59.1329 13.9205 58.8173 14.4344V20.1265C58.8197 20.3602 58.7203 20.5848 58.5439 20.7436C58.3732 20.9092 58.1407 21.0022 57.8987 21C57.4032 20.9988 57.0012 20.6086 57 20.1276V11.9864C56.9977 11.7516 57.0935 11.5259 57.2642 11.3603C57.4278 11.189 57.6592 11.0926 57.8999 11.0948C58.4036 11.1028 58.8103 11.4975 58.8185 11.9864V12.6943C59.189 12.1906 59.6611 11.7664 60.2069 11.4465C60.7281 11.1493 61.3662 11.0007 62.1223 11.0007C62.7814 10.9871 63.4277 11.1765 63.97 11.5418C64.4842 11.8866 64.8827 12.3721 65.1129 12.9359C65.9205 11.6461 67.1195 11.0007 68.7101 11.0007C69.4662 11.0007 70.0844 11.1776 70.5671 11.5316C71.0427 11.8787 71.4132 12.3438 71.6388 12.878V12.878Z"
                      fill="black"
                    />
                    <path
                      d="M75.2672 25.724C75.0946 25.5511 74.9977 25.3153 75 25.0701V12.0116C75.0012 11.5094 75.4079 11.1019 75.909 11.1007C76.1537 11.0983 76.389 11.1955 76.5615 11.3684C76.74 11.5343 76.8405 11.7688 76.8381 12.0128V12.4866C77.7838 11.4952 78.9044 11 80.1999 11C81.9304 10.9953 83.5215 11.9477 84.3371 13.4769C84.7886 14.3381 85.0168 15.2988 84.999 16.2713C84.999 17.3551 84.7744 18.2862 84.3265 19.0656C83.9104 19.8249 83.2981 20.4575 82.5534 20.8981C81.8382 21.3234 81.0214 21.5461 80.1893 21.5425C78.8973 21.5425 77.7767 21.0474 76.8275 20.0559V25.0689C76.837 25.5736 76.4374 25.9905 75.9339 26C75.922 26 75.9102 26 75.8984 26C75.6584 26 75.4303 25.9005 75.2672 25.724V25.724ZM82.3063 18.8785C82.8796 18.2518 83.1669 17.3824 83.1669 16.2725C83.1669 15.1625 82.8796 14.2931 82.3063 13.6664C81.733 13.0398 80.9458 12.7259 79.9422 12.7259C79.3606 12.7259 78.7873 12.8633 78.2684 13.1263C77.7306 13.3928 77.2448 13.7541 76.8346 14.1924V18.3537C77.2448 18.7932 77.7306 19.1533 78.2684 19.4198C78.7873 19.6804 79.3583 19.8166 79.9387 19.8166C80.941 19.8178 81.7283 19.5051 82.3016 18.8773H82.3063V18.8785Z"
                      fill="black"
                    />
                    <path
                      d="M87.267 25.724C87.0945 25.551 86.9977 25.3153 87 25.0701V12.0116C87.0012 11.507 87.4099 11.0995 87.9131 11.1007C87.9131 11.1007 87.9143 11.1007 87.9155 11.1007C88.16 11.0983 88.3951 11.1955 88.5675 11.3684C88.7459 11.5342 88.8463 11.7688 88.8439 12.0128V12.4866C89.7889 11.4952 90.9087 11 92.2033 11C93.9326 10.9953 95.5225 11.9477 96.3376 13.4769C96.7888 14.3381 97.0168 15.2987 96.999 16.2713C96.999 17.3551 96.7746 18.2862 96.3269 19.0656C95.9111 19.8249 95.2993 20.4575 94.5551 20.8981C93.8405 21.3234 93.0242 21.5461 92.1927 21.5425C90.9016 21.5425 89.7818 21.0474 88.8333 20.0559V25.0689C88.8427 25.5735 88.4435 25.9905 87.9403 26C87.9285 26 87.9167 26 87.9049 26C87.6627 26.0023 87.4312 25.9016 87.267 25.724V25.724ZM94.3011 18.8785C94.874 18.2518 95.1611 17.3824 95.1611 16.2724C95.1611 15.1625 94.874 14.2931 94.3011 13.6664C93.7283 13.0398 92.9416 12.7259 91.9387 12.7259C91.3587 12.7271 90.7882 12.8645 90.2708 13.1263C89.7334 13.3928 89.2479 13.7541 88.838 14.1924V18.3537C89.2479 18.7932 89.7334 19.1533 90.2708 19.4198C90.7894 19.6804 91.3599 19.8166 91.9399 19.8166C92.9404 19.8178 93.7283 19.5051 94.3011 18.8773V18.8785Z"
                      fill="black"
                    />
                    <path
                      d="M101.369 20.3789C100.623 19.9565 100.016 19.3373 99.6231 18.5935C98.7923 16.9507 98.7923 15.0304 99.6231 13.3877C100.018 12.6449 100.631 12.0303 101.385 11.6213C102.187 11.1977 103.09 10.9831 104.003 11.001C104.912 10.9831 105.809 11.1966 106.605 11.6202C107.36 12.0359 107.975 12.6528 108.376 13.3966C108.803 14.2012 109.016 15.0956 108.999 16.0001C109.018 16.9013 108.803 17.7923 108.376 18.5935C107.975 19.3429 107.356 19.9643 106.595 20.3789C105.8 20.8014 104.904 21.0149 103.996 20.9992C102.999 20.9992 102.123 20.7924 101.369 20.3789V20.3789ZM105.535 19.0441C106.049 18.7856 106.47 18.3822 106.741 17.8878C107.04 17.3676 107.189 16.7316 107.189 15.9776C107.189 15.2237 107.035 14.5495 106.724 14.0607C106.456 13.6023 106.062 13.2247 105.585 12.9708C105.098 12.7168 104.551 12.5876 103.999 12.5944C103.467 12.5944 102.941 12.709 102.461 12.9315C101.947 13.1888 101.526 13.591 101.252 14.0832C100.953 14.5967 100.804 15.2293 100.804 15.981C100.804 16.7833 100.959 17.4283 101.27 17.917C101.533 18.3834 101.927 18.7688 102.409 19.0261C102.895 19.28 103.442 19.4092 103.995 19.4025C104.532 19.4025 105.06 19.2789 105.537 19.0441H105.535Z"
                      fill="black"
                    />
                    <path
                      d="M112.282 8.78092C112.1 8.59788 111.998 8.34346 112 8.07868V8.00155C112.01 7.45242 112.427 7.01036 112.946 7H113.054C113.573 7.01036 113.99 7.45242 114 8.00155V8.08098C113.99 8.63011 113.573 9.07217 113.054 9.08253H112.946C112.695 9.08369 112.454 8.97432 112.282 8.78092ZM112.39 20.7397C112.23 20.5762 112.141 20.3494 112.145 20.1134V11.8523C112.142 11.614 112.232 11.3849 112.39 11.2169C112.542 11.043 112.758 10.9452 112.982 10.9475C113.445 10.9383 113.827 11.3274 113.836 11.8178C113.836 11.8293 113.836 11.8408 113.836 11.8523V20.1134C113.838 20.3506 113.746 20.5785 113.582 20.7397C113.423 20.9077 113.207 21.0021 112.982 20.9998C112.76 21.0044 112.546 20.9123 112.39 20.7443V20.7397Z"
                      fill="black"
                    />
                    <path
                      d="M117.266 20.7482C117.093 20.5871 116.997 20.3637 117 20.1311V11.9874C116.998 11.7526 117.094 11.5269 117.266 11.3613C117.43 11.1901 117.662 11.0936 117.904 11.0959C118.411 11.1039 118.819 11.4986 118.827 11.9874V12.7088C119.305 12.1961 119.87 11.7662 120.497 11.4373C121.106 11.139 121.78 10.9893 122.462 11.0006C123.133 10.9882 123.794 11.1583 124.368 11.494C124.893 11.8252 125.313 12.2914 125.577 12.8415C125.865 13.4347 126.009 14.0835 126 14.739V20.1266C126.002 20.3603 125.902 20.5848 125.725 20.7436C125.553 20.9092 125.32 21.0022 125.076 21C124.579 20.9988 124.175 20.6087 124.173 20.1277V14.9285C124.173 13.3984 123.459 12.6328 122.032 12.6328C121.432 12.6248 120.843 12.7814 120.333 13.0865C119.759 13.4517 119.25 13.9077 118.83 14.4339V20.1255C118.832 20.3591 118.732 20.5837 118.555 20.7425C118.384 20.9081 118.15 21.0011 117.907 20.9988C117.666 21.0045 117.435 20.9138 117.266 20.7482V20.7482Z"
                      fill="black"
                    />
                    <path
                      d="M133.778 19.4912C133.92 19.6201 134.001 19.7975 134 19.9828C134 20.2733 133.839 20.4993 133.516 20.6609C132.99 20.8869 132.417 21.0033 131.838 20.9999C129.857 20.9999 128.865 20.1614 128.865 18.4854V12.7479H127.855C127.409 12.7705 127.027 12.4507 127.001 12.0337C126.977 11.6167 127.319 11.2596 127.765 11.2358C127.794 11.2347 127.825 11.2347 127.854 11.2358H128.858V9.88875C128.84 9.64465 128.932 9.40506 129.111 9.22764C129.302 9.06942 129.553 8.98806 129.808 9.00162C130.064 8.98693 130.313 9.07281 130.496 9.23781C130.666 9.41637 130.753 9.65143 130.738 9.88988V11.2324H133.003C133.441 11.2245 133.803 11.5511 133.811 11.9614C133.811 11.9704 133.811 11.9794 133.811 11.9885C133.813 12.1862 133.729 12.3772 133.579 12.5174C133.431 12.6654 133.22 12.7479 133.003 12.7434H130.738V18.3385C130.738 18.7804 130.846 19.0765 131.062 19.2268C131.279 19.3771 131.6 19.4528 132.029 19.4528C132.304 19.4539 132.576 19.4155 132.838 19.3398C132.86 19.3409 132.882 19.3342 132.899 19.3206C133.011 19.298 133.127 19.2856 133.242 19.2833C133.443 19.2799 133.637 19.3556 133.776 19.4912H133.778Z"
                      fill="black"
                    />
                    <path
                      d="M10.0013 15.051C10.0013 14.2306 10.0013 13.4102 10.0013 12.5911C9.99748 9.34654 12.339 6.57301 15.5 6.07897C19.0261 5.52734 22.2954 7.92202 22.9072 11.5019C23.4686 14.7912 21.428 18.0613 18.272 18.9291C18.1688 18.9573 18.0631 18.988 17.9573 18.9969C17.5683 19.0302 17.2246 18.7896 17.129 18.4248C17.0257 18.0332 17.2032 17.6351 17.5696 17.4713C17.7408 17.3945 17.9258 17.351 18.1033 17.2883C20.227 16.5447 21.5728 14.4392 21.3852 12.1508C21.2014 9.90713 19.4717 8.02441 17.2649 7.6686C14.3091 7.19248 11.6189 9.51676 11.6101 12.5591C11.6051 14.2818 11.6101 16.0045 11.6076 17.726C11.6076 17.8757 11.6088 18.0293 11.5799 18.174C11.4943 18.6078 11.1632 18.8574 10.7364 18.8293C10.3273 18.8011 10.0176 18.4863 10.0113 18.0447C9.99874 17.1564 10.0076 16.2682 10.0063 15.3787C10.0063 15.2699 10.0063 15.1598 10.0063 15.051C10.0038 15.051 10.0025 15.051 10 15.051H10.0013Z"
                      fill="white"
                    />
                    <path
                      d="M15.2937 14.0269C15.2264 14.1867 15.2549 14.3388 15.2549 14.487C15.2523 16.5204 15.2575 18.5537 15.2523 20.5871C15.2471 22.7086 13.7333 24.5183 11.6256 24.9286C11.341 24.9835 11.0498 25.0104 10.7587 24.9963C10.3123 24.9746 10.016 24.6883 10.0005 24.2844C9.98629 23.8819 10.2658 23.57 10.7031 23.5163C10.936 23.4869 11.1715 23.4985 11.4031 23.4448C12.8173 23.1163 13.7359 21.9597 13.7437 20.458C13.7501 19.134 13.7359 17.8112 13.7294 16.4871C13.723 14.9177 13.7152 13.3483 13.7061 11.7801C13.6997 10.5021 14.4152 9.48222 15.5732 9.12054C16.6199 8.79464 17.7572 9.14354 18.4365 9.99855C19.1235 10.8638 19.1882 12.0562 18.5982 12.9892C18.0147 13.9119 16.924 14.3771 15.8462 14.1598C15.6599 14.1215 15.4748 14.0717 15.2898 14.0269H15.2937Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_589_3310">
                      <rect width="160.667" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg> */}
              </Link>
            </div>

            <div className="mt-5 flex flex-grow flex-col ">
              <nav
                className="flex-1 space-y-1 overflow-y-auto bg-white px-2"
                aria-label="Sidebar"
              >
                {sideNavigation}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
