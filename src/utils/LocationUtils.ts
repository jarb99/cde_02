import { LocationDescriptor, LocationState, Hash, LocationKey } from "history";
import SearchUtils from "./SearchUtils";

export default class LocationUtils {
  static getLocationDescriptor<S = LocationState>(
    pathname: string,
    searchTerm?: string,
    pageNo?: number,
    pageSize?: number,
    defaultPageSize?: number,
    state?: S,
    hash?: Hash,
    key?: LocationKey
  ): LocationDescriptor<S> {
    const result: LocationDescriptor<S> = {
      pathname: pathname,
    }
    
    const searchParams = SearchUtils.getSearchUrlQuery(searchTerm, 1, pageSize, defaultPageSize);
    if (searchParams) {
      result.search = searchParams;
    }

    if (state) {
      result.state = state;
    }

    if (hash) {
      result.hash = hash;
    }

    if (key) {
      result.key = key;
    }

    return result;
  }
}