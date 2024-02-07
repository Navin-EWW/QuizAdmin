import React from "react";
import LebalWithInput from "../Components/LebalWithInput";
import { MileStatuesTypes } from "./ServiceSupplierCreate";
import { disabled } from "glamor";

type Props = {
  title: string;
  setFieldValue: any;
  setMainDataValue: () => void;
  data: MileStatuesTypes[];
  mileName: string;
  disabled: boolean;
};

function FirstMile({
  title,
  setMainDataValue,
  setFieldValue,
  disabled,
  mileName,
  data,
}: Props) {
  const addedButtonClicked = (index: number, indexOfData: number) => {
    let mainArray = [];
    for (let [i, a] of data.entries()) {
      let obj = a;
      if (i === indexOfData) {
        obj = {
          ...a,
          textArray: [
            ...a?.textArray.slice(0, index + 1),
            { text: "" },
            ...a?.textArray.slice(index + 1),
          ],
        };
      }
      mainArray.push(obj);
    }
    setFieldValue(mileName, mainArray);
    setMainDataValue();
  };

  const onChangeValue = (
    index: number,
    indexOfData: number,
    e: string | undefined | any
  ) => {
    let mainArray = [];
    for (let [i, a] of data.entries()) {
      let obj = a;
      if (i === indexOfData) {
        obj = {
          ...a,
          textArray: [
            ...a?.textArray.slice(0, index),
            { text: e },
            ...a?.textArray.slice(index + 1),
          ],
        };
      }
      mainArray.push(obj);
    }
    setFieldValue(mileName, mainArray);
    setMainDataValue();
  };

  const deleteButtonClicked = (index: number, indexOfData: number) => {
    let mainArray = [];
    for (let [i, a] of data.entries()) {
      let obj = a;
      if (i === indexOfData) {
        obj = {
          ...a,
          textArray: [
            ...a?.textArray.slice(0, index),
            ...a?.textArray.slice(index + 1),
          ],
        };
      }
      mainArray.push(obj);
    }
    setFieldValue(mileName, mainArray);
    setMainDataValue();
  };

  return (
    <>
      {data?.map((x, index) => {
        return (
          <LebalWithInput
            disabled={disabled}
            deleteButtonClicked={deleteButtonClicked}
            onChangeValue={onChangeValue}
            indexOfData={index}
            addedButtonClicked={addedButtonClicked}
            textArray={x?.textArray}
            mile={index == 0 ? title : ""}
            customerStatus={x?.externalStatus?.name}
            internalStatus={x?.internalStatus?.name}
            Isbutton={true}
          />
        );
      })}
    </>
  );
}

export default FirstMile;
