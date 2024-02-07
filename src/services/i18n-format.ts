function format(value?: any, format?: string, lng?: any) {
  if (format?.startsWith("date")) {
    return formatDate(value, format, lng);
  }

  if (format?.startsWith("number")) {
    return formatNumber(value, format, lng);
  }

  return value;
}

function formatDate(
  value: number | Date | undefined,
  format: string,
  lng: string | string[] | undefined
) {
  const options = toOptions(format, "date");

  return options === null
    ? value
    : new Intl.DateTimeFormat(lng, options).format(value);
}

function formatNumber(
  value: number | bigint,
  format: string,
  lng: string | string[] | undefined
) {
  const options = toOptions(format, "number");

  return options === null
    ? value
    : new Intl.NumberFormat(lng, options).format(value);
}

function toOptions(format: string, specifier: string) {
  if (format.trim() === specifier) {
    return {};
  } else {
    try {
      return JSON.parse(toJsonString(format, specifier));
    } catch (error) {
      return null;
    }
  }
}

function toJsonString(format: string, specifier: string) {
  const inner = format
    .trim()
    .replace(specifier, "")
    .replace("(", "")
    .replace(")", "")
    .split(";")
    .map((param) =>
      param
        .split(":")
        .map((name) => `"${name.trim()}"`)
        .join(":")
    )
    .join(",");

  return "{" + inner + "}";
}

export default format;
