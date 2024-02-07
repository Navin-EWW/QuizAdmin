import React from "react";
import DeleteIcon from "/icon/delete.svg";

import {
  statusmapping,
  supplierStatusFilterdata,
} from "../../types/routingRule";
import _ from "lodash";

type Props = {
  title: string;
  deletedId: string[];
  setDeletedId: React.Dispatch<string[]>;
  allSupplierData: supplierStatusFilterdata[];
  setallSupplierData: React.Dispatch<supplierStatusFilterdata[]>;
  data: statusmapping[];
};

function ServiceSupplierEditMileComponent({
  allSupplierData,
  deletedId,
  setDeletedId,
  setallSupplierData,
  title,
  data,
}: Props) {
  const addedButtonClicked = (data: {
    mile: string;
    internalStatusId: string;
    supplierStatusId: string;
    supplierStatusName: string;
    index: number;
  }) => {
    const arrData = [...allSupplierData];
    arrData?.splice(data.index + 1, 0, {
      id: "",
      name: "",
      internalStatusId: data?.internalStatusId,
      mile: data.mile,
    });
    setallSupplierData(arrData);
  };

  const onChangeValue = (
    ind: number,
    e: string | undefined | any,
    internalStatusId: string,
    mile: string
  ) => {
    const arrData = [...allSupplierData];
    const dataitem = arrData.find((item, index) => index === ind);

    arrData?.splice(ind, 1, {
      id: dataitem?.id ? dataitem?.id : "",
      name: e.target.value,
      internalStatusId: internalStatusId,
      mile,
    });
    setallSupplierData(arrData);
  };

  const deleteButtonClicked = (ind: number, delsupplierStatusId: string) => {
    const arrData = [...allSupplierData];
    arrData?.splice(ind, 1);

    setallSupplierData(arrData);
    const deletedstatusId = deletedId;
    delsupplierStatusId && deletedstatusId?.push(delsupplierStatusId);
    setDeletedId(deletedstatusId);
  };

  return (
    <>
      {data?.map((item, index) => {
        let count = 0;
        return (
          <tr className="border-t border-grey_border_table">
            <td className="whitespace-nowrap px-6 py-4 align-top">
              {index === 0 ? title : "-"}
            </td>

            {
              <td className="whitespace-nowrap py-4 px-6 align-top">
                {item.externalStatus || "-"}
              </td>
            }

            <td className="whitespace-nowrap px-6 py-4 align-top">
              {item.internalStatus.name || "-"}
            </td>

            <td className="whitespace-nowrap px-6 py-4 align-top">
              {allSupplierData?.map((inputdata, ind) => {
                if (inputdata.internalStatusId === item.internalStatus.id) {
                  count++;
                  return (
                    <div
                      className={`flex gap-3 2xl:gap-5 ${
                        count == 1 ? "" : "mt-5"
                      }`}
                    >
                      <input
                        onChange={(e: any) => {
                          onChangeValue(
                            ind,
                            e,
                            item.internalStatus.id,
                            item.mile
                          );
                        }}
                        type="text"
                        value={inputdata?.name}
                        maxLength={60}
                        placeholder={"Enter status"}
                        className={`block rounded-md border font-normal border-grey_border_table focus:border-blue_primary active:border-blue_primary focus:text-font_black focus:outline-none max-w-lg sm:max-w-xs w-full py-2 px-3 text-sm `}
                      />
                      <div className="flex gap-3 w-[40px] cursor-pointer">
                        <button
                          disabled={inputdata?.name ? false : true}
                          onClick={(e: any) => {
                            e.preventDefault(),
                              addedButtonClicked({
                                mile: item.mile,
                                internalStatusId: item.internalStatus.id,
                                supplierStatusId: item.supplierStatus.id,
                                supplierStatusName: item.supplierStatus.name,
                                index: ind,
                              });
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill={"none"}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 7V10M10 10V13M10 10H13M10 10H7M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                              stroke={
                                _.isEmpty(inputdata?.name?.trim())
                                  ? "#D1D9DB"
                                  : "#4B5D63"
                              }
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {!(count == 1) && (
                          <img
                            src={DeleteIcon}
                            onClick={(e: any) => {
                              deleteButtonClicked(ind, inputdata.id);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default ServiceSupplierEditMileComponent;
