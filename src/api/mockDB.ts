import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockDocuments } from "./mockDBdocuments";
import { v4 as uuidv4 } from "uuid";
import Idocuments from "../models/Documents";
import statusType from "../models/StatusType";

let documents: Idocuments[] = mockDocuments.map((r) => {
  var rand = Math.floor(Math.random() * Object.keys(statusType).length);
  var randomStatus = Object.keys(statusType)[rand];
  return { ...r, id: uuidv4(), status: randomStatus };
});

var mock = new MockAdapter(axios);
mock.onGet("/documents").reply(200, {
  docs: documents
});

mock.onPost("/updateDocument").reply((config) => {
  const id = JSON.parse(config.data).id;
  const payload = JSON.parse(config.data).payload;
  let row: Idocuments = documents.filter((r) => r.id === id)[0];
  if (payload.status) row.status = payload.status;
  return [200, { row: row }];
});

mock.onGet("/users").reply(200, {
  users: [{ name: "john", id: "1" }]
});

export default mock;
