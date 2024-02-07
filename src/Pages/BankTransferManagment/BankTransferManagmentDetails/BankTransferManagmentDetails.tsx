import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../utils/Spinner";
import ImagePopUp from "./ImagePopUp";
import pcimage from "/icon/pcimage.png";

type bankdataType = {
  submittedAt: string;
  merchantBalance: string;
  user: string;
  status: string;
  approvedBy: string;
  approvedAt: string;
  bankTransferProof: string;
};

export function BankTransferManagmentDetails() {
  const [editCnt, setEditCnt] = useState(true);
  const [data, setdata] = useState<any>([2, 2, 2, 2]);
  const [bankdata, setBankdata] = useState<bankdataType>({
    submittedAt: "20/10/2023 16:02:29",
    merchantBalance: "HK$69,999.00",
    user: "Jerry Lee",
    status: "pending",
    approvedBy: "Victor Ma",
    approvedAt: "20/10/2023 16:02:29",
    bankTransferProof: "",
  });

  const [imagePopUpToggle, setimagePopUpToggle] = useState(false);

  function closeModal() {
    setimagePopUpToggle(false);
  }

  const location: any = useLocation();
  const navigate = useNavigate();
  const state = location?.state;
  let { id } = useParams();
  const isLoading = false;
  const isFetched = true;

  //   const {
  //     isLoading,
  //     isFetched,
  //     refetch: profileRefetch,
  //   } = useQuery(["fetchProfile"], () => AdminUser({ id }), {
  //     onSuccess(data: { data: { role: { id: any } } }) {
  //       setdata({
  //         ...data?.data,
  //         roleId: data?.data?.role?.id,
  //       });

  //       //   refetch();
  //     },
  //     onError(error: any) {
  //       //   typeof error !== "string"
  //       //     ? UseToast(error?.message, "error")
  //       //     : UseToast(error, "error");
  //       //   navigate("/bank-transfer/list");
  //     },
  //   });

  useEffect(() => {
    if (!id) {
      navigate("/bank-transfer/list");
    }
  }, [id]);

  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-0 bg-background_grey ${
        isFetched && "animate-blinking"
      }`}
    >
      <div>
        <Link to="/bank-transfer/list" className="flex gap-2 items-end py-4">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to bank transfer
        </Link>
      </div>

      <div className="flex justify-between items-center pb-5 ">
        <h2 className="pb-4 text-2xl font-semibold text-font_black">
          Bank transfer details
        </h2>
      </div>

      {!isLoading && data && (
        <>
          <div className="flex gap-4 items-center p-5 bg-white rounded-lg shadow-md mb-4">
            <svg
              width="48"
              height="48"
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
            <div>
              <span className="text-sm text-font_dark">
                Merchant
                {/* {data?.role?.name} */}
              </span>
              <p className="text-2xl font-semibold">Amazon HK</p>
            </div>
          </div>

          <div className="bg-white px-5 pt-5 rounded-t-md rounded-lg shadow-md ">
            <div className="relative pb-20">
              {isFetched ? (
                <form className="space-y-8">
                  <div className="space-y-6 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5 font-Inter">
                      <div className="text-sm items-center sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
                        <label className="block text-font_dark font-medium">
                          Submitted At
                        </label>
                        <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                          <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                            {bankdata.submittedAt}
                          </label>
                        </div>
                      </div>
                      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                        <label className="block text-font_dark font-medium">
                          Merchant Balance
                        </label>
                        <div className="">
                          <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                            <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                              {bankdata.merchantBalance}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                        <label className="block text-font_dark font-medium">
                          User
                        </label>
                        <div className="">
                          <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                            <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                              {bankdata.user}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                        <label className="block text-font_dark font-medium">
                          Status
                        </label>

                        <div className="w-full sm:col-span-2 xl:col-span-3 pl-3 sm:pr-16 pr-6">
                          {bankdata.status !== "pending" ? (
                            <span
                              className={`${
                                bankdata.status === "approve"
                                  ? "text-font_green bg-light_geen"
                                  : "text-Incative_red bg-light_red"
                              } rounded-full px-6 py-1 text-xs font-medium capitalize cursor-pointer`}
                            >
                              {bankdata.status}
                            </span>
                          ) : (
                            <div className="flex gap-4 items-center">
                              <span
                                className={`text-orange_text font-Inter bg-transparent text-xs pr-5 font-medium capitalize`}
                              >
                                {bankdata.status}
                              </span>
                              <button
                                type="button"
                                className={`bg-transparent hover:bg-grey_bg border border-grey_border rounded-[6px] px-5 py-2 cursor-pointer`}
                                onClick={() =>
                                  setBankdata({
                                    ...bankdata,
                                    status: "approve",
                                  })
                                }
                              >
                                <span className="flex gap-2 items-center">
                                  <span>
                                    <svg
                                      width="14"
                                      height="12"
                                      viewBox="0 0 14 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.16675 6.8335L4.50008 10.1668L12.8334 1.8335"
                                        stroke="#4FB500"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </span>
                                  <span className="text-[#4FB500] text-xs font-medium capitalize">
                                    {bankdata.status ? "approve" : ""}
                                  </span>
                                </span>
                              </button>

                              <button
                                type="button"
                                className={`bg-transparent border hover:bg-grey_bg border-grey_border rounded-[6px] px-5 py-2 cursor-pointer`}
                                onClick={() =>
                                  setBankdata({
                                    ...bankdata,
                                    status: "reject",
                                  })
                                }
                              >
                                <span className="flex gap-2 items-center">
                                  <span>
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1 11L11 1M1 1L11 11"
                                        stroke="#EB5236"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </span>
                                  <span className="text-error_red text-xs font-medium capitalize">
                                    {bankdata.status ? "reject" : ""}
                                  </span>
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                        <label className="block text-font_dark font-medium">
                          Approved By
                        </label>

                        <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                          <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                            {bankdata.approvedBy}
                          </label>
                        </div>
                      </div>
                      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:items-center items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
                        <label className="block text-font_dark font-medium">
                          Approved At
                        </label>

                        <div className="w-full sm:col-span-2 xl:col-span-3 sm:pr-16 pr-6">
                          <label className="block pr-10 w-full max-w-lg rounded-md font-normal bg-transparent focus:text-font_black focus:outline-none sm:max-w-xs py-2 px-3 text-sm">
                            {bankdata.approvedAt}
                          </label>
                        </div>
                      </div>

                      <div className="text-sm sm:border-t border-grey_border_table sm:pt-5">
                        <p className="block text-font_dark font-medium mb-5">
                          Bank Transfer Proof
                        </p>
                        <div className="mt-1 sm:col-span-2 sm:mt-0 p-5 border rounded-lg border-grey_border">
                          <figure
                            onClick={() => setimagePopUpToggle(true)}
                            className="w-fit cursor-pointer overflow-hidden"
                          >
                            <img
                              src={pcimage}
                              alt="transfer proof"
                              className="block hover:scale-110 duration-100"
                            />
                          </figure>
                        </div>
                      </div>
                      <ImagePopUp
                        isOpen={imagePopUpToggle}
                        closeModal={closeModal}
                        image={pcimage}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </>
      )}

      {(isLoading || !data) && <Spinner />}
    </div>
  );
}
