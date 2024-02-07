import { request } from "../../config/request";

const prifix = "/admin";

export const MerchantList = async ({
  name,
  merchantCode,
  type,
  country,
  fromDate,
  toDate,
  preferredServiceLane,
  createdBy,
  creditPeriod = "",
  status,
  current_page = 1,
  per_page = 10,
  sortBy,
  sortType,
}: MarchentListType) => {
  const response = await request({
    url: `${prifix}/merchant?per_page=${per_page}&page=${current_page}&status=${status}&createdBy=${createdBy}&creditPeriod=${creditPeriod}&fromDate=${fromDate}&toDate=${toDate}&name=${name}&merchantCode=${merchantCode}&type=${type}&country=${country}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });
  return response;
};

export const MerchantDetail = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `${prifix}/merchant/${id}`,
    method: "GET",
  });

  return response;
};

export const MerchantType = async () => {
  const response = await request({
    url: `${prifix}/merchant/merchant-type/list`,
    method: "GET",
  });
  return response;
};

export const MerchantListStatus = async ({ status, id }: any) => {
  const response = await request({
    url: `${prifix}/merchant/${id}/change/status`,
    method: "PUT",
    body: { status },
  });

  return response;
};

export const MerchantLogsList = async ({
  id,
  per_page,
  current_page,
  sortBy,
  sortType,
}: MerchantLogListType) => {
  const response = await request({
    url: `${prifix}/merchant/get-logs/${id}?per_page=${per_page}&page=${current_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });

  return response;
};

export const MerchantUserList = async ({
  id,
  per_page,
  current_page,
  sortBy,
  sortType,
}: MerchantUserListType) => {
  const response = await request({
    url: `${prifix}/merchant/merchant-users/${id}?per_page=${per_page}&page=${current_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });

  return response;
};

export const CreateMerchantApI = async (body: any) => {
  const response = await request({
    url: `${prifix}/merchant`,
    method: "POST",
    body,
  });

  return response;
};

export const MerchantUserStatus = async ({
  id,
  status,
}: MerchantUserStatus) => {
  const response = await request({
    url: `${prifix}/merchant-user/${id}/change/status`,
    method: "PUT",
    body: { status },
  });

  return response;
};

export const UpdateMerchant = async (body: any) => {
  const response = await request({
    url: `${prifix}/merchant/${body?.merchantId}`,
    method: "PUT",
    body,
  });

  return response;
};

interface MarchentListType {
  name?: string;
  merchantCode?: string;
  type?: string;
  country?: string;
  preferredServiceLane?: string;
  createdBy?: string;
  creditPeriod?: string;
  status?: string;
  current_page?: number;
  per_page: number;
  sortBy: string;
  sortType: string;
  fromDate: string | Date;
  toDate: string | Date;
}

interface MerchantDetailType {
  id: string;
}

interface MerchantLogListType {
  id: string;
  per_page: number;
  current_page: number;
  sortBy: string;
  sortType: string;
}

interface MerchantUserListType {
  id: string;
  per_page: number;
  current_page: number;
  sortBy: string;
  sortType: string;
}

interface MerchantUserStatus {
  id: string;
  status: string;
}
