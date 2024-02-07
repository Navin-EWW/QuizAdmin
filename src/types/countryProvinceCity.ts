export type CountriesResponseType = {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  numericCode: string;
  phoneCode: string;
  capital: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  native: string;
  region: string;
  subregion: string;
  latitude: string;
  longitude: string;
};

export type ProvincesResponseType = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  provinceCode: string;
  countryId: string;
};

export type CitiesResponseType = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  provinceId: string;
};
