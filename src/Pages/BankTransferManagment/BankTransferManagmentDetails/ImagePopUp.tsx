import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type Props = {
  image: string;
  closeModal: () => void;
  isOpen: boolean;
};

const ImagePopUp = ({ image, closeModal, isOpen }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div className="fixed inset-0 overflow-y-auto bg-background_grey">
          <div className="flex min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full  transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <button type="button" onClick={closeModal} className="px-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 17L17 1M1 1L17 17"
                        stroke="#6B7B80"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex gap-3 items-center py-2 px-5 bg-white border border-grey_border rounded-lg"
                  >
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.33331 11.3334L1.33331 12.1667C1.33331 13.5475 2.4526 14.6667 3.83331 14.6667L12.1666 14.6667C13.5474 14.6667 14.6666 13.5475 14.6666 12.1667L14.6666 11.3334M11.3333 8.00008L7.99998 11.3334M7.99998 11.3334L4.66665 8.00008M7.99998 11.3334L7.99998 1.33342"
                          stroke="#4B5D63"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Download</span>
                  </button>
                </div>
                <div className="grid place-content-center min-h-full">
                  <figure className="w-fit mx-auto">
                    <img src={image} alt="transfer proof" className="" />
                  </figure>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImagePopUp;
