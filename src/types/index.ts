import { AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
export type Pagination = {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number
}
type ErrorDetails = {
    id: string,
    name: string,
    status: string,
    errors: number,
    success: number,
    merchantCode: string,
    createdAt: string
}
export type AxiosResponse<T = any, D = any> = {
    data: T;
    message: string;
    status: number;
    pagination: Pagination;
    link_expired?: boolean;
    details?:ErrorDetails;
    accessToken?: string | null;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
}