import {request} from "../../config/request";

const prifix = "/admin";

export const AdminAccount = async (body: any) => {
  const response = await request({
    url: `${prifix}/account`,
    method: "GET",
    body,
  });

  return response;
};

export const ResetPassword = async (body: any) => {
  const response = await request({
    url: `${prifix}/account/reset-password`,
    method: "PUT",
    body,
  });

  return response;
};
