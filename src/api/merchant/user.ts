import { request } from "../../config/request";

const prifix = "/admin";

export const MerchantListDropDown = async () => {
  const response = await request({
    url: `${prifix}/merchant-user/merchant-list`,
    method: "GET",
  });

  return response;
};

export const CreateUserApI = async (body: any) => {
  const response = await request({
    url: `${prifix}//merchant-user`,
    method: "POST",
    body,
  });

  return response;
};

export const UserList = async ({
  firstName,
  lastName,
  phone,
  email,
  name,
  country,
  status,
  current_page = 1,
  per_page = 10,
  sortBy,
  sortType,
  fromDate,
  toDate,
}: UserListType) => {
  const response = await request({
    url: `${prifix}/merchant-user?per_page=${per_page}&page=${current_page}&status=${status}&firstName=${firstName}&fromDate=${fromDate}&toDate=${toDate}&lastName=${lastName}&email=${email}&merchant=${name}&country=${country}&phone=${phone}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });

  return response;
};

export const UserListStatus = async ({ id, status }: UserListStatusType) => {
  const response = await request({
    url: `${prifix}/merchant-user/${id}/change/status`,
    method: "PUT",
    body: { status },
  });
  return response;
};

export const UserDetails = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `${prifix}/merchant-user/${id}`,
    method: "GET",
  });

  return response;
};

export const UpdateUser = async (body: any) => {
  const response = await request({
    url: `${prifix}/merchant-user/${body?.userId}`,
    method: "PUT",
    body,
  });

  return response;
};

export const UserLogList = async ({
  per_page,
  userId,
  current_page,
  sortBy,
  sortType,
}: UserLogType) => {
  const response = await request({
    url: `${prifix}/merchant-user/get-logs/${userId}?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });

  return response;
};

export const UserResetPassword = async (body: any) => {
  const response = await request({
    url: `${prifix}/merchant-user/reset-password/${body?.id}`,
    method: "PUT",
    body: body?.values,
  });
  return response;
};

interface UserListType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  name: string;
  country: string;
  status: string;
  current_page: number;
  per_page: number;
  sortBy: string;
  sortType: string;
  fromDate: string;
  toDate: string;
}

interface UserListStatusType {
  id: string;
  status: string;
}

interface UserLogType {
  userId: string;
  per_page: number;
  current_page: number;
  sortBy: string;
  sortType: string;
}

