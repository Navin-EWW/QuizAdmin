import { request } from "../../config/request";
import { AxiosResponse } from "../../types";
import { CitiesResponseType, CountriesResponseType, ProvincesResponseType } from "../../types/countryProvinceCity";



export const Countries = async () => {
    const response: AxiosResponse<CountriesResponseType[]> = await request({
        url: `/countries`,
        method: "GET",
    });

    return response;
};

export const Provinces = async ({ id }: { id: string }) => {
    const response: AxiosResponse<ProvincesResponseType[]> = await request({
        url: `/provinces/${id}`,
        method: "GET",
    });

    return response;
};

export const Cities = async ({ id }: { id: string }) => {
    const response: AxiosResponse<CitiesResponseType[]> = await request({
        url: `/cities/${id}`,
        method: "GET",
    });

    return response;
};