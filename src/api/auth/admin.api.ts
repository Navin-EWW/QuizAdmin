import { request } from "../../config/request";


const prifix = "/admin/auth";

export const AdminSignInAPI = async (body: any) => {
  const response = await request({
    url: `/login`,
    method: "POST",
    body,
  });

  return response;
};

export const AdminForgotPasswordAPI = async (body: any) => {
  const response = await request({
    url: `/admin-auth/forgot-password`,
    method: "POST",
    body,
  });

  return response;
};

export const AdminResetPasswordAPI = async (data: any) => {
  const { body, params } = data;
  const response = await request({
    url: `/admin-auth/reset-password?userType=ADMIN&&token=${params?.token}`,
    method: "POST",
    body,
  });

  return response;
};

export const LogoutAPI = async () => {
  const response = await request({
    url: "/admin-auth/logout",
    method: "GET",
  });

  return response;
};

export const AdminResetPasswordCheckInAPI = async (data: any) => {
  const response = await request({
    url: `/admin-auth/reset-password?userType=ADMIN&&token=${data?.token}`,
    method: "GET",
  });

  return response;
};
