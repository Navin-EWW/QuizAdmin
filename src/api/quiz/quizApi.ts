import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import { subjectRequestType, subjectResponseType } from "../../types/quiz";

const prifix = "/";

export const AddSubject = async (body: subjectRequestType) => {
  const response: AxiosResponse<subjectResponseType> = await request({
    url: `${prifix}subject`,
    method: "POST",
    body: body,
  });

  return response;
};
export const UpdateSubject = async (body: subjectRequestType) => {
  const response: AxiosResponse<subjectResponseType> = await request({
    url: `${prifix}subject/${body.id}`,
    method: "PUT",
    body: body,
  });

  return response;
};

export const SubjectList = async ({
  name,
  discription,
  userId,
  current_page,
  per_page,
  sortBy,
  sortType,
}: subjectRequestType) => {
  const response: AxiosResponse<subjectResponseType[]> = await request({
    url: `${prifix}/subject?per_page=${per_page}&page=${current_page}&status=${status}&name=${name}&discription=${discription}&userId=${userId}&sortBy=${sortBy}&sortType=${sortType}`,
    method: "GET",
  });
  return response;
};
export const SubjectListById = async ({ id }: { id: string }) => {
  const response: AxiosResponse<subjectResponseType> = await request({
    url: `${prifix}/subject/${id}`,
    method: "GET",
  });
  return response;
};
