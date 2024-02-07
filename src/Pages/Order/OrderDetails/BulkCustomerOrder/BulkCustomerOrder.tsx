import { useEffect, useState } from "react";
import { List } from "rsuite";

type Props = {};

export function BulkCustomerOrder({}: Props) {
  const [external, setExternal] = useState([
    {
      status: "Succesful Export Customs Clearance 1 ",
      date: "08/10/2022",
      time: "18:30:00",
    },
    {
      status: "Succesful Export Customs Clearance 2",
      date: "09/10/2022",
      time: "18:30:00",
    },
    {
      status: "Succesful Export Customs Clearance 3",
      date: "01/10/2022",
      time: "18:30:00",
    },
    {
      status: "Succesful Export Customs Clearance 4",
      date: "08/10/2022",
      time: "18:30:00",
    },
  ]);

  const handleSortEnd = ({ oldIndex, newIndex }: any) => {
    return setExternal((prvData: any) => {
      const moveData = prvData.splice(oldIndex, 1);
      const newData = [...prvData];
      newData.splice(newIndex, 0, moveData[0]);
      return newData;
    });
  };

  return (
    <div className="align-middle">
      <div className="text-sm sm:grid sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 items-start sm:gap-4 sm:border-t border-grey_border_table sm:pt-5">
        <label htmlFor="remarks" className="block text-font_dark font-medium">
          Status
        </label>
        <div className="w-full sm:col-span-2 xl:col-span-3">
          <p className="block text-font_dark font-medium mb-4">External</p>
          <div className="mb-4 max-w-[660px]">
            <a
              onClick={() => {
                const arr = [...external];
                arr.push({
                  status: "Succesful Export Customs Clearance 3",
                  date: "01/10/2022",
                  time: "18:30:00",
                });
                return setExternal(arr);
              }}
              className="custom-border cursor-pointer block px-3 py-2"
            >
              + New Status
            </a>
          </div>
          <List sortable onSort={handleSortEnd}>
            {external?.map((item, index) => (
              <List.Item key={index} index={index}>
                <div className="text-left flex sm:gap-5 gap-3 w-full mb-4">
                  <div className="mt-1 sm:mt-0 w-full sm:max-w-xs">
                    <select
                      name="shipment Details"
                      className="sm:max-w-xs block w-full rounded-md font-normal border border-grey_border_table focus:outline-none py-2 px-3 text-sm text-table_head_color focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                    >
                      <option>{item.status}</option>
                    </select>
                  </div>

                  <div className="mt-1 sm:mt-0 w-full sm:max-w-xs flex gap-5">
                    <div className="w-full">
                      <select
                        name="shipment date"
                        className="block w-full rounded-md font-normal border border-grey_border_table sm:max-w-xs focus:outline-none py-2 px-3 text-table_head_color focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                      >
                        <option>{item.date}</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <select
                        name="shipment date"
                        className="block w-full rounded-md font-normal border border-grey_border_table sm:max-w-xs focus:outline-none py-2 px-3 text-table_head_color focus:border-blue_primary active:border-blue_primary focus:text-font_black"
                      >
                        <option>{item.time}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      const arr = [...external];
                      arr.splice(index, 1);
                      return setExternal(arr);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 13L13 1M1 1L13 13"
                        stroke="#6B7B80"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}
