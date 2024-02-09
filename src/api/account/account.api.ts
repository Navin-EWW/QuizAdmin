import {request} from "../../config/request";
import { AxiosResponse } from "../../types";
import { subjectResponseType } from "../../types/quiz";

const prifix = "/";

export const UserProfile = async () => {
  const response: AxiosResponse<subjectResponseType> = await request({
    url: `${prifix}/profile`,
    method: "GET",
  });

  return response;
};

export const ResetPassword = async (body: {
  password:string,
  confirm_password:string
}) => {
  const response :AxiosResponse<any> = await request({
    url: `${prifix}/change-password`,
    method: "PUT",
    body,
  });

  return response;
};
