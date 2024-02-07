import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { MerchantUserStatus } from "../../../../api/merchant/merchant";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: string;
  id: string;
  refetch: () => void;
  setMerchantData: React.Dispatch<React.SetStateAction<any[]>>;
  merchantData: any[];
};

const ToggleModel = ({
  open,
  setOpen,
  status,
  id,
  setMerchantData,
  merchantData,
  refetch,
}: Props) => {
  const { mutate } = useMutation(MerchantUserStatus, {
    onSuccess: (data: any) => {
      const toggleArray = merchantData.map((x: any) => {
        if (x?.id === id) {
          return {
            ...x,
            status: status,
          };
        }
        return x;
      });
      setMerchantData(toggleArray);
      setOpen(false);
    },
    onError: (data) => {
      setOpen(false);
    },
  });

  const StatusChange = () => {
    mutate({ status, id });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
          <div className="flex min-h-full items-center justify-center p-4  sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative font-Nunito transform overflow-hidden rounded-md bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0  pt-5 pr-5 block">
                  <button
                    type="button"
                    className="rounded-md bg-white hover:bg-grey_bg text-gray-400 hover:text-gray-500 focus:outline-none stroke-grey_border"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="">
                  <div className="mt-3 sm:mt-0 text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-sm font-bold leading-6 text-font_black uppercase"
                    >
                      Change The Status
                    </Dialog.Title>
                    <div className="mt-2 border-t border-grey_border py-4">
                      <p className="text-base text-font_black font-normal">
                        Do You Want To Change The Status ?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex gap-3">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center border border-transparent ${
                      status === "ACTIVE"
                        ? "bg-blue_primary hover:bg-hoverChange"
                        : "bg-error_red"
                    } px-4 py-2 text-base rounded-md font-normal text-white shadow-sm focus:outline-none `}
                    onClick={StatusChange}
                  >
                    {status === "ACTIVE" ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    className="mt-3  rounded-md inline-flex w-full justify-center border border-grey_border bg-white hover:bg-grey_bg px-4 py-2 text-base font-normal text-font_dark shadow focus:outline-none sm:mt-0"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ToggleModel;
