import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import {
  BookingCustomerOrder,
  CustomerBookingListPerponseType,
  CustomerOrderFilterResponseType,
  OrderLogsResponseType,
  SupplierBookingListPerponseType,
} from "../../types/order";

// yet user api here

export const ExcelTemplateAPI = async (body: any) => {
  const { type } = body;
  const response = await request({
    // url: `/admin/orders/get-templates`,
    url: `/admin/templates?type=${type}`,
    method: "GET",
    body,
  });

  return response;
};

export const OrderHistory = async (body: any) => {
  const { sortBy, sortType, per_page, current_page } = body;
  const response = await request({
    url: `/admin/orders/bulk/new?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
    body,
  });

  return response;
};

export const BulkOrderHistory = async (body: any) => {
  const { sortBy, sortType, per_page, current_page } = body;
  const response = await request({
    url: `/admin/orders/bulk/edit?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
    body,
  });

  return response;
};

export const ErrorHistory = async (body: any) => {
  const { id, current_page, per_page, sortBy, sortType } = body;
  const response = await request({
    url: `/admin/orders/bulk/new/${id}/errors?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
    body,
  });

  return response;
};

export const ErrorEditHistory = async (body: any) => {
  const { id, current_page, per_page, sortBy, sortType } = body;
  const response = await request({
    url: `/admin/orders/bulk/edit/${id}/errors?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
    body,
  });

  return response;
};

export const BulkErrorHistory = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `/admin/orders/bulk/new/${id}/errors`,
    method: "GET",
    body,
  });      

  return response;
};

export const FileUploadAPI = async (body: any) => {
  const response = await request({
    url: `/admin/media/upload`,
    method: "POST",
    body,
  });

  return response;
};

export const ImportFile = async (body: any) => {
  const response = await request({
    url: `/admin/orders/bulk/new`,
    method: "POST",
    body,
  });

  return response;
};

export const ImportEditFile = async (body: any) => {
  const response = await request({
    url: `/admin/orders/bulk/edit`,
    method: "POST",
    body,
  });

  return response;
};

export const OrderBookingdownload = async (body: any) => {
  const { id } = body;
  const response = await request({
    method: "GET",
    url: `/admin/orders/bulk/new/${id}/download/shipment-label`,
    body,
  });
  return response;
};

export const OrderTrackingnodownload = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `/admin/orders/bulk/new/${id}/download/tracking-no`,
    method: "GET",
    body,
  });
  return response;
};

export const RefetchStatus = async (id: string) => {
  const response = await request({
    url: `/admin/orders/bulk/new/${id}/status`,
    method: "GET",
  });
  return response;
};

export const BulkEditRefetchStatus = async (id: string) => {
  const response = await request({
    url: `/admin/orders/bulk/edit/${id}`,
    method: "GET",
  });

  return response;
};

export const CustomerBookingList = async (data: any) => {
  let query = "";
  for (const val in data) {
    query += `${val}=${data[val]}&`;
  }
  query.slice(0, -1);

  const response: AxiosResponse<CustomerBookingListPerponseType[]> =
    await request({
      url: `/admin/orders/customer-orders?${query}`,
      method: "GET",
    });

  return response;
};

export const CustomerOrderFilter = async () => {
  const response: AxiosResponse<CustomerOrderFilterResponseType> =
    await request({
      url: `/admin/orders/customer-orders-filter`,
      method: "GET",
    });
  response;
  return response;
};

export const ExportBookingList = async (data: any) => {
  let query = "";
  for (const val in data) {
    query += `${val}=${data[val]}&`;
  }
  query.substring(0, query.length - 1);
  const response: AxiosResponse = await request({
    url: `/admin/orders/customer-orders-export?${query}`,
    method: "GET",
    responseType: "arraybuffer",
  });

  return response;
};

export const UpdateCustomerFlag = async (data: any) => {
  const { id, status } = data;
  const response: AxiosResponse = await request({
    url: `/admin/orders/${id}/flag`,
    method: "PUT",
    body: { flag: status },
  });
  return response;
};

export const DeleteCustomerOrder = async (data: any) => {
  const { id } = data;
  const response: AxiosResponse = await request({
    url: `/admin/orders/delete/${id}`,
    method: "PUT",
  });
  return response;
};

export const UpdateSupplierFlag = async (data: any) => {
  const { id, status } = data;
  const response: AxiosResponse = await request({
    url: `/admin/orders/${id}/supplier-flag`,
    method: "PUT",
    body: { flag: status },
  });
  return response;
};

export const OrderLogs = async (data: any) => {
  const { id } = data;
  let tempQuery = "";
  for (const val in data) {
    if (data[val] && val !== "id") {
      tempQuery += `${val}=${data[val]}&`;
    }
  }
  const query = tempQuery.substring(0, tempQuery.length - 1);
  const response: AxiosResponse<OrderLogsResponseType[]> = await request({
    url: `/admin/orders/get-logs/${id}?${query}`,
    method: "GET",
  });
  return response;
};

export const DownloadShipmentLabel = async (data: any) => {
  const { id } = data;

  const response: AxiosResponse = await request({
    url: `/admin/orders/${id}/shipment-label`,
    method: "GET",
  });
  return response;
};
