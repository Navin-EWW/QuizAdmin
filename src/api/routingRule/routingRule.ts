import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import {
  CustomerOrderFilterResponseType,
  SystemVariableRoutingRuleType,
  routingRuleType,
} from "../../types/order";
import { ServiceSupplierLogType } from "../../types/routingRule";

export const RoutingRuleList = async (data: any) => {
  let query = `/admin/routing-rule?`;
  for (const val in data) {
    if (data[val] || data[val] === 0) query += `${val}=${data[val]}&`;
  }
  let URL = query.substring(0, query.length - 1);

  const response: AxiosResponse<routingRuleType[]> = await request({
    url: URL,
    method: "GET",
  });
  response;
  return response;
};

export const RoutingRuleSystemVariable = async () => {
  const response: AxiosResponse<SystemVariableRoutingRuleType> = await request({
    url: `/admin/system-variables`,
    method: "GET",
  });
  response;
  return response;
};

export const RoutingRuleSystemFilter = async () => {
  const response: AxiosResponse<SystemVariableRoutingRuleType> = await request({
    url: `/admin/routing-rule/filter`,
    method: "GET",
  });
  response;
  return response;
};

export const RoutingRuleDetailsAPI = async (id: string | undefined) => {
  const response = await request({
    url: `/admin/routing-rule/details/${id}`,
    method: "GET",
  });

  return response;
};

export const UpdateServiceSupplier = async (body: any) => {
  const response = await request({
    url: `/admin/routing-rule/update-rule/${body?.id}`,
    method: "PUT",
    body,
  });

  return response;
};

export const RoutingRulebulkEdit = async (body: any) => {
  const response: AxiosResponse<SystemVariableRoutingRuleType> = await request({
    url: `/admin/routing-rule/bulk-rule`,
    method: "PUT",
    body,
  });
  response;
  return response;
};

export const RouteapiLog = async (body: any) => {
  const { id, ...data } = body;
  let query = `/admin/routing-rule/get-logs/${id}?`;
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

export const UpdateClearanceList = async (body: any) => {
  const response = await request({
    url: `/admin/routing-rule/update-clearance/${body?.id}`,
    method: "PUT",
    body,
  });

  return response;
};

export const ClearanceList = async () => {
  const response = await request({
    url: `/admin/routing-rule/supplier`,
    method: "GET",
  });

  return response;
};

export const RoutingRuleLogList = async ({
  id,
  per_page,
  current_page,
  sortBy,
  sortType,
}: RoutingRuleLogListType) => {
  const response = await request({
    url: `/admin/routing-rule/get-logs/${id}?per_page=${per_page}&page=${current_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });

  return response;
};

interface RoutingRuleLogListType {
  id: string;
  per_page: number;
  current_page: number;
  sortBy: string;
  sortType: string;
}
