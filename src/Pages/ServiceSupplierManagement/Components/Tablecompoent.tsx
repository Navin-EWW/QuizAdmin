import React, { useState } from "react";
type Table_Props = {
  rowSpan: number;
  rowSpan2col?: number;
  index?: number;
  firstcol?: string;
  secountcol?: string;
  thirthcol: string;
  fourthcol: string;
};

export default function Tablecompoent({
  rowSpan,
  rowSpan2col,
  index,
  firstcol,
  secountcol,
  thirthcol,
  fourthcol,
}: Table_Props) {
  return (
    <tr
      className={`${!secountcol ? "" : "border-t border-grey_border_table"} `}
    >
      {firstcol && (
        <td
          rowSpan={rowSpan}
          className="whitespace-nowrap py-4 pl-4 pr-3 align-top border-t border-grey_border_table"
        >
          {firstcol}
        </td>
      )}

      {/* {secountcol && ( */}
      <td
        rowSpan={rowSpan2col}
        className={`whitespace-nowrap px-6 py-4 lg:table-cell ${
          secountcol
            ? "border-b border-grey_border_table"
            : "bg-background_grey border-t-0"
        }`}
      >
        {secountcol}
      </td>
      {/* )} */}

      <td className="whitespace-nowrap px-6 py-4 sm:table-cell border-t border-grey_border_table">
        {thirthcol}
      </td>
      <td className="whitespace-nowrap px-6 py-4 sm:table-cell border-t border-grey_border_table">
        {fourthcol}
      </td>
    </tr>
  );
}
