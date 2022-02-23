import axios from "axios";
import "./mockDB"; // MOCK DATABASE

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
