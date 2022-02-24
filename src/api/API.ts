import axios, { AxiosResponse, CancelToken } from "axios";
import Configuration from "../configuration/configuration";
import dateValueResponseTransform from "./transforms/DateValueResponseTransform";

import "./mockDB"; // MOCK DATABASE

const api = axios.create({
  baseURL: "/api/",
  responseType: "json",
  transformResponse: dateValueResponseTransform
});
 
export async function getConfiguration(cancelToken?: CancelToken): Promise<AxiosResponse<Configuration>> {
  return api.get<Configuration>('configuration', {cancelToken});
}



//////////////////////////////////////////////////
//          MY CODE
//////////////////////////////////////////////////


export const fetchDocuments = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("/documents", {})
      .then(function (response) {
        resolve({
          status: response.status,
          documents: response.data.docs
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const updateDocument = async (
  id: string,
  payload: object
): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios
      .post("/updateDocument", {
        id: id,
        payload: payload
      })
      .then(function (response) {
        resolve(response.data.row);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

