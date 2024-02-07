import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadImg from "/icon/upload.svg";
import uploadcolor from "/icon/uploadcolor.svg";
// @ts-ignore
import Progress from "react-progressbar";
import _ from "lodash";
import {
  ExcelTemplateAPI,
  FileUploadAPI,
  ImportEditFile,
  ImportFile,
} from "../../../api/bulkcustomerorder/bulkcustomerorder";
import UseToast from "../../../hooks/useToast";
// import { DataPopUp } from "./DataPopUp/DataPopUp";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { DataPopUp } from "../CreateOrder/DataPopUp/DataPopUp";
// import excelSVG from "/icon/overviewexcelicon.svg";
import { MediaUpload, TEMPLATE_TYPES } from "../../../enums/order";
import excelSVG from "/icon/overviewexcelicon.svg";
type Props = {
  setReFatch: () => void;
};
// const excelSVG = (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 110.037 107.5"
//   >
//     <path
//       fill="#4B5D63"
//       d="M57.55 0h7.425v10c12.513 0 25.025.025 37.537-.038 2.113.087 4.438-.062 6.275 1.2 1.287 1.85 1.138 4.2 1.225 6.325-.062 21.7-.037 43.388-.024 65.075-.062 3.638.337 7.35-.425 10.938-.5 2.6-3.625 2.662-5.713 2.75-12.95.037-25.912-.025-38.875 0v11.25h-7.763c-19.05-3.463-38.138-6.662-57.212-10V10.013C19.188 6.675 38.375 3.388 57.55 0z"
//     />
//     <path
//       fill="#fff"
//       d="M64.975 13.75h41.25V92.5h-41.25V85h10v-8.75h-10v-5h10V62.5h-10v-5h10v-8.75h-10v-5h10V35h-10v-5h10v-8.75h-10v-7.5z"
//     />
//     <path fill="#4B5D63" d="M79.975 21.25h17.5V30h-17.5v-8.75z" />
//     <path
//       fill="#fff"
//       d="M37.025 32.962c2.825-.2 5.663-.375 8.5-.512a2607.344 2607.344 0 0 1-10.087 20.487c3.438 7 6.949 13.95 10.399 20.95a716.28 716.28 0 0
//       1-9.024-.575c-2.125-5.213-4.713-10.25-6.238-15.7-1.699 5.075-4.125 9.862-6.074 14.838-2.738-.038-5.476-.15-8.213-.263C19.5 65.9 22.6 59.562 25.912 53.312c-2.812-6.438-5.9-12.75-8.8-19.15 2.75-.163 5.5-.325 8.25-.475 1.862 4.888 3.899 9.712 5.438 14.725 1.649-5.312 4.112-10.312 6.225-15.45z"
//     />
//     <path
//       fill="#4B5D63"
//       d="M79.975 35h17.5v8.75h-17.5V35zM79.975 48.75h17.5v8.75h-17.5v-8.75zM79.975 62.5h17.5v8.75h-17.5V62.5zM79.975 76.25h17.5V85h-17.5v-8.75z"
//     />
//   </svg>
// );

const excelTemplateData = [
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
  {
    name: "Standard template.xlsx",
    path: "Standard template.xlsx",
  },
];

const DropBox = ({ setReFatch }: Props) => {
  const CancelToken = axios.CancelToken;
  var source = CancelToken.source();
  const uploadFile = axios.create();
  const [open, setopen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(0);
  const [statUpload, setIsStartUpload] = useState(false);
  const [URL, setURL] = useState("");
  const [cancelRequest, setCancelRequest] = useState(source);
  const [endUpload, setIsEndUpload] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, seterror] = useState<any>();
  const [binaryFile, setbinaryFile] = useState<any>();
  const [Key, setKEY] = useState<string>("");
  const [Id, setId] = useState<string>("");
  const [excelTemplateData, setexcelTemplateData] = useState<any[]>([]);
  const [apiData, setApiData] = useState<any>({});
  const [apimessage, setapimessage] = useState("");

  useQuery(
    ["getExcelTemplate"],
    () => ExcelTemplateAPI({ type: TEMPLATE_TYPES.BULK_EDIT_TEMPLATES }),
    {
      keepPreviousData: true,
      onSuccess(data: any) {
        setexcelTemplateData(data?.data);
      },
    }
  );

  const { mutate } = useMutation(FileUploadAPI, {
    onSuccess: (data: any) => {
      setURL(data?.data?.url);
      setKEY(data?.data?.key);
      setId(data?.data?.id);
    },
    onError: () => {},
  });

  const { mutate: Importfile, isLoading } = useMutation(ImportEditFile, {
    onSuccess: (data: any) => {
      if (data?.status) {
        setApiData(data?.data);
        // UseToast(data?.message);
        setapimessage(data?.message);
        setopen(true);
        setbinaryFile(null);
        setIsEndUpload(false);
        setReFatch();
      }
    },
    onError: (error: any) => {
      setIsEndUpload(false);
      setbinaryFile(null);
      seterror(error);
      // UseToast(error?.message, "error");
    },
  });

  const ImportFilehandler = () => {
    !isLoading && Importfile({ key: Key, fileName: binaryFile?.name, id: Id });
  };

  useEffect(() => {
    if (URL) {
      urlCall(URL);
    }
  }, [URL]);

  const onDrop = useCallback((files: any, rejected: any) => {
    setIsEndUpload(false);
    setProgress(0);
    // Do something with the files
    if (!_.isEmpty(rejected)) {
      setbinaryFile(null);
      seterror(rejected[0]?.file?.path);
    } else {
      seterror("");
      setbinaryFile(files[0]);
      mutate({
        name: files[0]?.path,
        mimeType: "xlsx",
        type: MediaUpload.ADMIN_BULK_EDIT_UPLOAD,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      multiple: false,
      onDrop,
    });

  const urlCall = async (url: string) => {
    uploadFile.put(url, binaryFile, {
      cancelToken: cancelRequest.token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event: AxiosProgressEvent) => {
        const { loaded, total }: any = event;
        let precentage = Math.floor((loaded * 100) / total);
        setProgress(precentage);
        setIsStartUpload(true);
        setIsStartUpload(true);
        setFinished(formatSizeUnits(loaded));
        setTotal(formatSizeUnits(total));
        if (precentage == 100) {
          setTimeout(() => {
            setIsEndUpload(true);
          }, 2000);
        }
      },
    });
  };

  const onCancel = () => {
    if (!isLoading) {
      cancelRequest.cancel("Cancelled By User !");
      setCancelRequest(CancelToken.source());
      setbinaryFile(null);
      setIsEndUpload(false);
    }
  };

  function formatSizeUnits(bytes: any) {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(0) + " KB";
    } else if (bytes > 1) {
      bytes = bytes + " bytes";
    } else if (bytes == 1) {
      bytes = bytes + " byte";
    } else {
      bytes = "0 bytes";
    }
    return bytes;
  }
  return (
    <>
      <div className="px-5 sm:px-6 pt-5 pb-8 rounded-md shadow-md bg-white mt-4">
        <div className="pb-4 mb-4 border-b-[1px]  border-grey_border">
          <p className="text-[18px] font-medium">Overview</p>
        </div>
        <div className="my-6 grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-6 lg:grid-cols-3">
          {excelTemplateData?.map((item, index) => (
            <div key={index} className="">
              <a
                href={item?.path}
                className="flex underline-offset-4 gap-2 gap-y-2 cursor-pointer underline text-sm text-font_black font-Inter"
              >
                {/* {excelSVG} */}
                <img src={excelSVG} className={"mb-[1px]"} />
                {item?.name}
              </a>
            </div>
          ))}
        </div>

        <div
          {...getRootProps({
            className: ``,
          })}
          className={`flex justify-center focus:outline-none outline-none ${
            isDragActive ? "dashLineGreen" : "dashLine"
          } py-8 duration-300 relative`}
        >
          <div className="space-y-1 text-center">
            <div>
              <img
                src={!isDragActive ? uploadImg : uploadcolor}
                alt="upload here"
                className="mx-auto focus:outline-none outline-none"
                draggable="false"
              />
            </div>
            <div>
              <input
                className="input-zone focus:outline-none outline-none"
                {...getInputProps()}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                //   multiple={false}
              />
              <div>
                <p className="md:flex text-sm text-font_dark font-medium ">
                  <span
                    // htmlFor="file-upload"
                    className="relative cursor-pointer text-blue_primary ml-1"
                  >
                    Upload a file
                  </span>
                  <span className="pl-1"> or drag and drop.</span>
                </p>

                <p className="font-medium text-xs text-font_dark">
                  XLSX up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-6 justify-between items-center mt-4">
          {error && (
            <div className="flex gap-2 items-center py-3  text-error_text w-full ">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 12C9 12.5523 8.55229 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55229 11 9 11.4477 9 12ZM8 3C7.44772 3 7 3.44772 7 4V8C7 8.55228 7.44772 9 8 9C8.55229 9 9 8.55228 9 8V4C9 3.44772 8.55229 3 8 3Z"
                  fill="#EF4444"
                />
              </svg>

              <p className="text-sm">
                {`${
                  typeof error === "string"
                    ? `"${error}" has failed to upload. Only file with the following
                 extension is allowed: .xlsx.`
                    : error?.message
                }`}

                {/* {`${error} is failed to upload. Only file with the following
            extension is allowed: .xlsx.`} */}
              </p>
            </div>
          )}

          {binaryFile && (
            <div className="w-full">
              <div className="flex justify-between mb-2 align-bottom">
                <p className="text-sm">{binaryFile?.name}</p>

                <div className="flex items-center gap-4 text-[12px] text-font_dark">
                  <span>
                    {finished} of {total}
                  </span>
                  <button type="button">
                    {/* {!isLoading && ( */}
                    <XMarkIcon className="w-5 h-5" onClick={onCancel} />
                    {/* )} */}
                  </button>
                </div>
              </div>

              <Progress
                color="#00145b"
                height={5}
                className="h-[5px] w-full bg-grey_border_table relative"
                style={{ backgroundColor: "whitesmoke", height: "5px" }}
                completed={Number(progress) || 0}
              />
              {/* <div className="h-[5px] w-full bg-grey_border_table relative">
          <div className={`absolute h-full w-[${progress.toString()}%] bg-blue_primary`}></div>
        </div> */}
            </div>
          )}

          <button
            type="button"
            disabled={!endUpload}
            onClick={ImportFilehandler}
            className={`${
              isLoading
                ? "px-[26.5px] py-[9px] cursor-default"
                : "px-[17px] py-[9px]"
            } text-sm font-Inter font-medium rounded-md text-white import-btn ${
              endUpload
                ? "bg-blue_primary hover:bg-hoverChange"
                : "bg-table_head_color"
            }  ml-auto`}
          >
            {isLoading ? <ButtonSpinner /> : "Import"}
          </button>
        </div>
      </div>
      <DataPopUp
        header={"Update customer order"}
        subHeader={
          apimessage ||
          "Customer order details will be updated after the import. Are you sure to continue?"
        }
        open={open}
        Panelcss={"px-6 py-5 sm:px-10 sm:py-8"}
        Crosscss={"top-8 right-10"}
        Headercss={"text-[18px] font-medium"}
        subHeaderCss={"text-sm text-font_black font-normal"}
        id={apiData?.data?.bulkUploadId}
        error={apiData?.errorStatus === "ERROR" ? "Import Failed." : ""}
        setOpen={setopen}
        buttonlevelblue={
          apiData?.errorStatus === "ERROR" ? "View Details" : "Confirm"
        }
      />
    </>
  );
};

export default DropBox;
