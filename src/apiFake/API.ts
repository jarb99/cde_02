import axios from "axios";
import "./mockDB"; // MOCK DATABASE

export const fetchDocuments = async () => {
  try {
    const response = await axios.get("/documents", {
      params: {
        id: "123"
      }
    });
    return response;
  } catch (error) {
    console.error(error);
  }
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
