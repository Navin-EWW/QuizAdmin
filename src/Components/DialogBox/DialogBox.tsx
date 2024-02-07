import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DialogBoxProps {
  showDialog: boolean;
  cancelNavigation: any;
  confirmNavigation: any;
  message?: string;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  showDialog,
  cancelNavigation,
  message,
  confirmNavigation,
}) => {
  const msg =
    "You have unsaved changes that will be lost if you decide to continue. Are you sure you want to leave this page?";
  return (
    <>
      <Transition.Root show={showDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={cancelNavigation}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-font_black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative md rounded transform overflow-hidden bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:px-[40px] sm:py-[32px]">
                  <div className="absolute top-0 right-0  pt-8 pr-9 block">
                    <button
                      type="button"
                      className="rounded-md bg-white hover:bg-grey_bg text-gray-400 hover:text-gray-500 focus:outline-none stroke-grey_border"
                      onClick={cancelNavigation}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="">
                    <div className="mt-3 sm:mt-0 text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-[18px] font-medium leading-6 text-font_black"
                      >
                        Leave this page
                      </Dialog.Title>
                      <div className="mt-4 border-t border-grey_border py-4">
                        <p className="text-base text-font_black font-normal">
                          {message || msg}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-2 sm:flex gap-3">
                    <button
                      type="button"
                      className="md rounded inline-flex w-full justify-center border border-transparent bg-blue_primary hover:bg-hoverChange px-4 py-2 text-base font-normal text-white shadow-sm focus:outline-none"
                      onClick={confirmNavigation}
                    >
                      Leave this page
                    </button>
                    <button
                      type="button"
                      className="md rounded mt-3 inline-flex w-full justify-center border border-grey_border bg-white hover:bg-grey_bg px-4 py-2 text-base font-normal text-font_dark shadow focus:outline-none sm:mt-0"
                      onClick={cancelNavigation}
                    >
                      Stay on page
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
