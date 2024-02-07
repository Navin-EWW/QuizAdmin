import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type DataProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  header: string;
  subHeader: string;
  error?: string | null;
  buttonlevelblue?: string | null;
  buttonlevelwhite?: string | null;
};

export const DataPopUp = (prop: DataProps) => {
  const {
    open,
    setOpen,
    header,
    subHeader,
    error,
    buttonlevelblue,
    buttonlevelwhite,
  } = prop;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={setOpen}>
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
              <Dialog.Panel className="relative rounded-md  transform overflow-hidden bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[480px] px-8 sm:px-10  py-8 sm:py-8">
                <div className="absolute top-0 right-0  pt-8 pr-10 block">
                  <button
                    type="button"
                    className="rounded-md bg-white hover:bg-grey_bg text-gray-400 hover:text-gray-500 focus:outline-none stroke-grey_border"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="">
                  <div className=" sm:mt-0 text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-[18px] font-Inter font-medium  text-font_black"
                    >
                      {header}
                    </Dialog.Title>
                    {subHeader && (
                      <div className="mt-4 border-t border-grey_border py-4">
                        <p className="text-sm font-Inter text-font_black font-normal">
                          {error && (
                            <span className="text-error_red">{error} </span>
                          )}

                          {subHeader}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:mt-2 sm:flex gap-3 gap-y-2">
                  {buttonlevelblue && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center border border-transparent bg-blue_primary hover:bg-hoverChange px-4 py-2 text-sm font-Inter font-normal text-white shadow-sm focus:outline-none"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      {buttonlevelblue}
                      {/* {t("LogOut.OK")} */}
                    </button>
                  )}

                  {buttonlevelwhite && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center border  border-grey_border bg-white hover:bg-grey_bg px-4 py-2 text-sm font-Inter font-normal text-font_dark shadow focus:outline-none sm:mt-0"
                      onClick={() => setOpen(false)}
                    >
                      {buttonlevelwhite}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
