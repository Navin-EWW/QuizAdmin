import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import {
  ReTriggerAPIResponse,
  SupplierBookingListPerponseType,
  SupplierOrderFilterResponseType,
} from "../../types/order";

// yet user api here

export const SupplierBookingList = async (data: any) => {
  let query = "";
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  query.slice(0, -1);

  const response: AxiosResponse<SupplierBookingListPerponseType[]> =
    await request({
      url: `/admin/orders/supplier-orders?${query}`,
      method: "GET",
    });

  return response;
};

export const SupplierOrderFilter = async () => {
  const response: AxiosResponse<SupplierOrderFilterResponseType> =
    await request({
      url: `/admin/orders/supplier-orders-filter`,
      method: "GET",
    });
  response;
  return response;
};

export const ExportBookingList = async (data: any) => {
  let query = "";
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  query.slice(0, -1);
  const response: AxiosResponse = await request({
    url: `/admin/orders/supplier-orders-export?${query}`,
    method: "GET",
    responseType: "arraybuffer",
  });

  return response;
};



export const ReTriggerAPI = async (body: { customerOrderId: string, supplierId: string }) => {
  try {
  
  const { customerOrderId, supplierId } = body;

  const response: AxiosResponse<ReTriggerAPIResponse> = await request({
    method: "POST",
    url: `/admin/orders/retrigger-supplier-order`,
    body: { customerOrderId, supplierId },
  });
  return response;
  } catch (error) {
    
  }
}