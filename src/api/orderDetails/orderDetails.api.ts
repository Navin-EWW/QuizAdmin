import { request } from "../../config/request";

const prifix = "/admin";

export const OrderDetails = async (body: any) => {
  const { id } = body;
  const response = await request({
    url: `${prifix}/orders/${id}`,
    method: "GET",
  });

  return response;
};

export const SystemVariablesDetails = async () => {
  const response = await request({
    url: `${prifix}/orders/system-variables`,
    method: "GET",
  });

  return response;
};

export const CountriesDetails = async () => {
  const response = await request({
    url: `/countries`,
    method: "GET",
  });

  return response;
};

export const StatesDetails = async (body: string) => {
  const response = await request({
    url: `/provinces/${body}`,
    method: "GET",
  });

  return response;
};

export const CitiesDetails = async (body: string) => {
  const response = await request({
    url: `/cities/${body}`,
    method: "GET",
  });

  return response;
};

export const UpdateOrderDetails = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/${body?.id}`,
    method: "PUT",
    body,
  });

  return response;
};

export const RoutingRuleDetails = async () => {
  const response = await request({
    url: `${prifix}/orders/routing-rule`,
    method: "GET",
  });

  return response;
};

export const UpdateSenderDetails = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/${body?.senderId}/sender`,
    method: "PUT",
    body,
  });

  return response;
};

export const UpdateReceiverDetails = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/${body?.receiverId}/receiver`,
    method: "PUT",
    body,
  });

  return response;
};

export const UpdatePackageDetails = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/${body?.id}/package`,
    method: "PUT",
    body,
  });

  return response;
};

export const DeletePackageAPI = async (id: string) => {
  const response = await request({
    url: `${prifix}/orders/delete-product/${id}`,
    method: "PUT",
  });

  return response;
};

export const SupplierStatusApi = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/supplier-status?customerOrderId=${body?.customerOrderId}&mile=${body?.mile}&serviceSupplierId=${body?.serviceSupplierId}`,
    method: "GET",
    body,
  });

  return response;
};

export const UpdateMilesApi = async (body: any) => {
  const response = await request({
    url: `${prifix}/orders/${body?.trackingId}/tracking`,
    method: "PUT",
    body,
  });

  return response;
};

export interface SupplierStatusList {
  id: string;
  name: string;
  mile: string;
  internalStatusId: string;
  serviceSupplierId: string;
  createdAt: string;
  updatedAt: string;
  internalStatus: InternalStatus;
}

export interface InternalStatus {
  id: string;
  mile: string;
  name: string;
  priority: number;
  repeatable: boolean;
  endingStatus: boolean;
  externalStatusId: string;
  createdAt: string;
  updatedAt: string;
}
