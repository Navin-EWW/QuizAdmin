import { request } from "../../config/request";
import { subjectDataType } from "../../types/quiz";

const prifix = "/";

export const AddSubject = async (body: subjectDataType) => {
    const response = await request({
      url: `${prifix}subject`,
      method: "POST",
      body:body,
    });
  
    return response;
  };