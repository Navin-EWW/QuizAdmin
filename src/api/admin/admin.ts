import { request } from "../../config/request";

const prifix = "/admin";

export const AdminList = async ({
  firstName,
  lastName,
  role,
  status,
  current_page = 1,
  per_page = 10,
  sortBy,
  sortType,
  fromDate,
  toDate,
}: AdminListType) => {
  const response = await request({
    url: `${prifix}/admin-user?per_page=${per_page}&page=${current_page}&status=${status}&firstName=${firstName}&lastName=${lastName}&role=${role}&sortBy=${sortBy}&sortType=${sortType}&fromDate=${fromDate}&toDate=${toDate}`,
    method: "GET",
  });
  return response;
};

export const AdminLogList = async ({
  AdminId,
  current_page = 1,
  per_page = 10,
  sortType,
  sortBy,
}: any) => {
  const response = await request({
    url: `${prifix}/admin-user/get-logs/${AdminId}?page=${current_page}&per_page=${per_page}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });
  return response;
};

export const AdminListStatus = async ({ status, id }: any) => {
  const response = await request({
    url: `${prifix}/admin-user/${id}/change/status`,
    method: "PUT",
    body: { status },
  });

  return response;
};

export const AdminUser = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `${prifix}/admin-user/${id}`,
    method: "GET",
    body,
  });

  return response;
};

export const AdminRoles = async (body: any) => {
  const response = await request({
    url: `${prifix}/admin-user/admin-role`,
    method: "GET",
    body,
  });

  return response;
};

export const AddAdmin = async (body: any) => {
  const response = await request({
    url: `${prifix}/admin-user`,
    method: "POST",
    body,
  });

  return response;
};

export const UpdateAdmin = async (body: any) => {
  const response = await request({
    url: `${prifix}/admin-user/${body?.adminId}`,
    method: "PUT",
    body,
  });

  return response;
};

export const AdminResetPassword = async (body: any) => {
  const response = await request({
    url: `${prifix}/admin-user/reset-password/${body?.id}`,
    method: "PUT",
    body: body?.values,
  });

  return response;
};

interface AdminListType {
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  current_page: number;
  per_page: number;
  sortBy: string;
  sortType: string;
  fromDate: string;
  toDate: string;
}
