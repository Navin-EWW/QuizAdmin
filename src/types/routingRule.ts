export type originDestionType = {
  originCountry: string;
  originProvince: string;
  originCity: string;
  destinationCountry: string;
  destinationProvince: string;
  destinationCity: string;
};

export type TypeTableData = {
  name: string;
  integration: string;
  firstMile: string;
  internationalMile: string;
  lastMile: string;
  createdOn: string;
  operatingRegions: string;
};

export type filterType = {
  name: string;
  apiEnable: string;
  firstMile: string;
  internationalMile: string;
  lastMile: string;
  createdAt: string;
  operatingRegions: string;
};

export type operatingRegionsTable = {
  originCountry: string;
  destinationCountry: string;
  defaultRouteCount: number;
  backupRouteCount: number;
};
export type ServiceSupplierLogType = {
  createdAt: string;
  description: string;
  id: string;
  logType: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
};
export type statusmapping = {
  externalStatus: string;
  internalStatus: supplierStatus;
  mile: string;
  supplierStatus: supplierStatus;
};
export type statusEditmapping = {
  mile: string;
  internalStatusId: string;
  supplierStatusId: string;
  supplierStatusName: string;
};

export type statusmappingFilter = {
  customerStatus: string;
  internalStatus: string;
  mile: string;
  supplierStatus: string;
};
export interface supplierStatus {
  id: string;
  name: string;
}

export interface supplierStatusFilterdata extends supplierStatus {
  internalStatusId: string;
  mile: string;
}
export enum MileEnum {
  FIRST_MILE = "FIRST_MILE",
  LAST_MILE = "LAST_MILE",
  INTERNATIONAL_MILE = "INTERNATIONAL_MILE",
  ALL = "ALL",
}
