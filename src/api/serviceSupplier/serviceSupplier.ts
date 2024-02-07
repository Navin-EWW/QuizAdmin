import { ServiceSupplierAboutTypes } from "../../Pages/ServiceSupplierManagement/SeviceSupplierDetails/ServiceSupplierAbout";
import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import {
  ServiceSupplierLogType,
  TypeTableData,
  operatingRegionsTable,
  statusmapping,
} from "../../types/routingRule";

export const ServiceSupplierapiList = async (data: any) => {
  let query = `/admin/service-supplier?`;
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  let URL = query.substring(0, query.length - 1);

  const response: AxiosResponse<TypeTableData[]> = await request({
    url: URL,
    method: "GET",
  });
  return response;
};

export const serviceSupplierAboutAPI = async (id: string | undefined) => {
  const response: AxiosResponse<ServiceSupplierAboutTypes> = await request({
    url: `/admin/service-supplier/about/${id}`,
    method: "GET",
  });
  return response;
};

export const SupplierStatusMapping = async (body: any) => {
  const { id, ...data } = body;
  let query = `/admin/service-supplier/status/${id}?`;
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  let URL = query.substring(0, query.length - 1);

  const response: AxiosResponse<statusmapping[]> = await request({
    url: URL,
    method: "GET",
  });
  return response;
};

export const operatingRegionsList = async (body: any) => {
  const { id, ...data } = body;
  let query = `/admin/service-supplier/operating-regions/${id}?`;
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  let URL = query.substring(0, query.length - 1);

  const response: AxiosResponse<operatingRegionsTable[]> = await request({
    url: URL,
    method: "GET",
  });
  return response;
};

export const EditSupplierAboutAPI = async (body: any) => {
  const { id, ...data } = body;
  const response = await request({
    url: `/admin/service-supplier/edit/about/${id}`,
    method: "PUT",
    body,
  });
  return response;
};

export const SupplierStatusListAPI = async () => {
  const response = await request({
    url: `/admin/service-supplier/status`,
    method: "GET",
  });
  return response;
};

export const CreateServiceSupplier = async (body: any) => {
  const response = await request({
    url: `/admin/service-supplier/create`,
    method: "POST",
    body,
  });

  return response;
};

export const ServiceSupplierapiLog = async (body: any) => {
  const { id, ...data } = body;
  let query = `/admin/service-supplier/get-logs/${id}?`;
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  let URL = query.substring(0, query.length - 1);

  const response: AxiosResponse<ServiceSupplierLogType[]> = await request({
    url: URL,
    method: "GET",
  });
  return response;
};

export const UpdateServiceSupplier = async (body: any) => {
  const { id, ...data } = body;
  const response = await request({
    url: `/admin/service-supplier/edit/status/${id}`,
    method: "POST",
    body: data,
  });

  return response;
};
