import { useState } from "react";

type PageState = { pageNo: number, pageSize: number };

const usePageState = (initialState: PageState): [PageState, (pageNo: number) => void, (pageSize: number) => void] => {
  const [{pageNo, pageSize}, setPageState] = useState(initialState);

  const setPageNumber = (nextPageNo: number) => {
    setPageState({pageNo: nextPageNo, pageSize});
  };

  const setPageSize = (nextPageSize: number) => {
    const nextPageNo = Math.floor(((pageNo - 1) * pageSize) / nextPageSize) + 1;

    setPageState({pageNo: nextPageNo, pageSize: nextPageSize});
  };

  return [{pageNo, pageSize}, setPageNumber, setPageSize]
};

export { usePageState }; 