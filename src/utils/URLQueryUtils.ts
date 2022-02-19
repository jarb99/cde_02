export default class URLQueryUtils {
  static getInt(
    name: string,
    params: URLSearchParams,
    defaultValue: number | null = null,
    validator?: (value: number) => boolean
  ): number | null {
    const queryValue = params.get(name);
    if (queryValue !== null && queryValue !== undefined) {
      const result = parseInt(queryValue);
      if (!validator || (result && validator(result))) {
        return result;
      }
    }
    return defaultValue;
  }

  static getQuery(params: { [key: string]: string }): string | undefined {
    const keys = Object.keys(params);
    if (keys.length > 0) {
      return "?" + keys.reduce((value, key) => value + (value.length > 0 ? "&" : "") + `${key}=${params[key]}`, "");
    }
    return undefined;
  }
}
