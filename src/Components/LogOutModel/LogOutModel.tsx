import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../hooks/useToast";
import { LogoutAPI } from "../../api/auth/admin.api";
import { useAuthStore } from "../../store/auth";
import ButtonSpinner from "../../utils/ButtonSpinner";

type Props = {
  open: boolean;
  setOpen: React.MouseEventHandler<HTMLElement>;
};

function LogOutModel({ open, setOpen }: any) {
  const { removeAll } = useAuthStore();
  let navigate = useNavigate();
  // const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useMutation(LogoutAPI, {
    onSuccess: (data: any) => {
      if (data?.status) {
        goToLogin();
        UseToast(data.message);
        setOpen(false);
        navigate("/login");
      }
    },
    onError: (data) => {
      goToLogin();
    },
  });

  const goToLogin = () => {
    removeAll();
    navigate("/login");
  };

  useEffect(() => {}, [open]);

  const logOutCalled = () => {
    mutate();
  };

  return (
    <>
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
                <Dialog.Panel className="relative rounded-md font-Nunito transform overflow-hidden bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0  pt-5 pr-5 block">
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
                    <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-sm font-bold leading-6 text-font_black uppercase"
                      >
                        Sign out?
                      </Dialog.Title>
                      <div className="mt-2 border-t border-grey_border py-4">
                        <p className="text-base text-font_black font-normal">
                          Are you sure you want to Sign out
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex gap-3">
                    <button
                      type="button"
                      className="inline-flex rounded-md w-full justify-center border border-transparent bg-blue_primary hover:bg-hoverChange px-4 py-2 text-base font-normal text-white shadow-sm focus:outline-none sm:ml-3"
                      onClick={logOutCalled}
                    >
                      {isLoading ? <ButtonSpinner /> : "Ok"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 rounded-md inline-flex w-full justify-center border border-grey_border bg-white hover:bg-grey_bg px-4 py-2 text-base font-normal text-font_dark shadow focus:outline-none sm:mt-0"
                      onClick={() => setOpen(!open)}
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
    </>
  );
}

export default LogOutModel;
