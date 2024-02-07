export type ExcelTemplateResponseType = {
  name: string;
  path: string;
};

export type UserBookingUploadResponseType = {
  key: string;
  url: string;
};

export type ImportBookingResponseType = {
  bulkUploadId: string;
};

export type BookingHistoryResponseType = {
  refetchStatus?: string;
  id: string;
  name: string;
  status: string;
  errors: number;
  success: number;
  merchantCode: string;
  createdAt: string;
};

export type BookingShipmentLabelDownloadResponseType = {
  url: string;
};

export type ErrorHistoryResponseType = {
  id: string;
  referenceNo: string;
  row: number;
  column: string;
  field: string;
  error: string;
};

export type CustomerBookingListPerponseType = {
  id: string;
  merchantCode: string;
  customerOrderNo: string;
  transportationMode: "Sea" | "Land" | "Air";
  origin: string;
  destination: string;
  internalShipmentStatus: string;
  routingRuleId: string;
  firstMile: string | null;
  firstMileOrderNo: string | null;
  internationalMile: string | null;
  internationalMileOrderNo: string | null;
  externalShipmentStatus: string | null;
  lastMile: string | null;
  flag: boolean;
  lastMileOrderNo: string | null;
  createdAt: string;
  deliveryDate: string | null;
};

export type routingRuleType = {
  id: string;
  routingRuleId: string;
  transportationMode: string;
  productType: string;
  pickup: boolean | null;
  backupRule: backUpRuleTypes[];
  firstMileServiceSupplier: string;
  master: boolean;
  internationalMileServiceSupplier: string;
  exportCustomerClearenceSupplier: string;
  importCustomerClearenceSupplier: string;
  lastMileServiceSupplier: string;
};
export interface backUpRuleTypes {
  id: string;
  code: string;
}

export type routingRuleFilterType = {
  routingRuleId: string;
  transportationMode: string;
  productType: string;
  pickup: boolean;
  firstMileServiceSupplier: string;
  internationalMileServiceSupplier: string;
  exportCustomerClearenceSupplier: string;
  importCustomerClearenceSupplier: string;
  lastMileServiceSupplier: string;
};

export type BookingCustomerOrder = {
  current_page?: number;
  per_page?: number;
  flag?: string;
  merchantCode?: string;
  customerOrderNo?: string;
  transportationMode?: string;
  origin?: string;
  destination?: string;
  internalShipmentStatus?: string;
  externalShipmentStatus?: string;
  routingRuleId?: string;
  firstMile?: string;
  firstMileOrderNo?: string;
  internationalMile?: string;
  internationalMileOrderNo?: string;
  lastMile?: string;
  lastMileOrderNo?: string;
  createdAttoDate?: string;
  createdAtfromDate?: string;
  deliveryfromDate?: string;
  deliverytoDate?: string;
  exportCustom?: string;
  importCustom?: string;
};

export type ExportBookingListResponseType = {
  data: any[];
  type: string;
};

export type SupplierBookingListPerponseType = {
  id: string;
  merchantCode: string;
  customerOrderNo: string;
  apiCreate?: string;
  customerOrderId: string;
  ruleId: string;
  mile: string;
  supplierName: string;
  supplierOrderNo: string;
  supplierOrderStatus: string | null;
  supplierTrackingNo: string | null;
  flag: string;
  createdAt: string;
  deliveryDate: string | null;
};

export type BookingSupplierOrder = {
  apiCreate?: string;
  current_page?: number;
  per_page?: number;
  flag?: string;
  id?: string;
  merchantCode?: string;
  customerOrderNo?: string;
  ruleId?: string;
  supplierName?: string;
  mile?: string;
  supplierOrderNo?: string;
  supplierOrderStatus?: string;
  supplierTrackingNo?: string;
  createdAttoDate?: string;
  createdAtfromDate?: string;
  createdAt?: string;
  deliveryDate?: string | null;
};

export type CustomerStatusType = {
  createdAt?: string;
  endingStatus?: boolean;
  externalStatusId?: string;
  id?: string;
  mile?: string;
  name?: string;
  priority?: number;
  repeatable?: boolean;
  updatedAt?: string;
};
export type ExternalStatusType = {
  createdAt?: string;
  id?: string;
  mile?: string;
  name?: string;
  planeStatus?: string;
  updatedAt?: string;
};
export type ServiceSupplierType = {
  createdAt?: string;
  firstMile?: boolean;
  id?: string;
  international?: boolean;
  lastMile?: boolean;
  account?: string;
  apiEnable?: string;
  name?: string;
  updatedAt?: string;
};

export type StageType = {
  name?: string;
  key?: string;
};

export type TransportationModeValueType = {
  createdAt?: string;
  en_translation?: string;
  id?: string;
  systemVariableId?: string;
  updatedAt?: string;
  value?: string;
  zh_cht_translation?: string;
  zh_translation?: string;
};
export type TransportationModeType = {
  value: string | undefined;
  createdAt?: string;
  id?: string;
  name?: string;
  updatedAt?: string;
  values?: TransportationModeValueType[];
};

export type CustomerOrderFilterResponseType = {
  customerStatus: CustomerStatusType[];
  externalStatus: ExternalStatusType[];
  serviceSupplier: ServiceSupplierType[];
  transportationMode: TransportationModeType;
};

export type SystemVariableRoutingRuleType = {
  packageType: PackageType;
  serviceSupplier: ServiceSupplierType[];
  transportationMode: TransportationModeType;
};
export type PackageType = {
  createdAt?: string;
  id?: string;
  name?: string;
  updatedAt?: string;
  values?: PackageResponseType[];
};

export type PackageResponseType = {
  id: string;
  systemVariableId: string;
  value: string;
  en_translation: string;
  zh_translation: string;
  zh_cht_translation: string;
  createdAt: string;
  updatedAt: string;
};

type SupplierStatusType = {
  id?: string;
  name?: string;
  mile?: string;
  internalStatusId?: string;
  serviceSupplierId?: string;
  createdAt?: string;
};

export type SupplierOrderFilterResponseType = {
  serviceSupplier: ServiceSupplierType[];
  supplierStatus: SupplierStatusType[];
};

export type OrderLogsResponseType = {
  id: string;
  createdAt: string;
  logType: string;
  description: string;
  updatedAt: string;
  admin: string;
  // admin: {
  //   firstName: string;
  //   lastName: string;
  // };
};

export type InternalTrackingResponseType = {
  triggeredAt: string;
  internalStatus: {
    id: string;
    mile: string;
    name: string;
    color: string;
    priority: number;
    repeatable: boolean;
    endingStatus: boolean;
    externalStatusId: string;
    createdAt: string;
    updatedAt: string;
    externalStatus: {
      id: string;
      name: string;
      color: string;
      mile: string;
      planeStatus: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type ExternalTrackingResponseType = {
  triggeredAt: string;
  externalStatus: {
    id: string;
    name: string;
    color: string;
    mile: string;
    planeStatus: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type DataHistrory = {
  id: string;
  fileName: string;
  status: string;
  errors: number;
  success: number;
  createdAt: string;
  refetchStatus?: string;
};

export interface ReTriggerAPIResponse {
  id: string;
  orderNo: string;
  merchantId: string;
  userId?: null;
  adminId?: null;
  apiClientId: string;
  bulkUploadId?: null;
  referenceNo: string;
  shipmentLabelId: string;
  transportationModeId: string;
  customerFlagged: boolean;
  adminFlagged: boolean;
  pickUp: boolean;
  pickUpBags: string;
  pickUpDate: string;
  pickUpSlotId: string;
  senderName: string;
  senderCompany: string;
  senderAddress: string;
  senderDistrict: string;
  senderCityId: string;
  senderProvinceId: string;
  senderCountryId: string;
  senderPostCode: string;
  senderPhone: string;
  senderEmail?: null;
  senderTaxNo?: null;
  senderTaxTypeId?: null;
  senderIdNo?: null;
  senderIdTypeId?: null;
  IOSSNo?: null;
  IOSSCountryId?: null;
  receiverName: string;
  receiverCompany: string;
  receiverAddress: string;
  receiverDistrict: string;
  receiverCityId: string;
  receiverProvinceId: string;
  receiverCountryId: string;
  receiverPostCode: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverTaxNo?: null;
  receiverTaxTypeId?: null;
  receiverIdNo: string;
  receiverIdTypeId: string;
  packageValue: string;
  packageCurrency: string;
  paymentMethodId: string;
  cod?: null;
  codCurrency?: null;
  packageHeight: string;
  packageLength: string;
  packageWidth: string;
  packageVolumeWeight: string;
  packageGrossWeight: string;
  shipmentTermId: string;
  productTypeId: string;
  packageAmount: string;
  cargoValue: string;
  freightShippingFee: string;
  insuranceFee?: null;
  insuranceCurrency: string;
  insuranceType: string;
  routingRuleId: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: null;
  actualVolumeWeight?: null;
  actualGrossWeight?: null;
  chargeableWeight: string;
  supplierOrders?: SupplierOrdersEntity[] | null;
}
export interface SupplierOrdersEntity {
  id: string;
  orderNo: string;
  mile: string;
  trackingNo: string;
  serviceSupplierId: string;
  customerOrderId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
  supplierOrigin: string;
  supplierDestination: string;
  remarks?: null;
  adminFlagged: boolean;
  apiCreate: string;
  serviceSupplier: ServiceSupplier;
}
export interface ServiceSupplier {
  id: string;
  name: string;
  firstMile: boolean;
  international: boolean;
  lastMile: boolean;
  apiEnable: boolean;
  account?: null;
  password?: null;
  token: string;
  createdAt: string;
  updatedAt: string;
}
