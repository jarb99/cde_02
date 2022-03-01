import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockDocuments } from "./mockDBdocuments";
import { v4 as uuidv4 } from "uuid";
import Document from "../models/Document";
import statusType from "../models/StatusType";
import IWorkflow from "../models/Workflow";

let documents: Document[] = mockDocuments.map((r) => {
  var rand = Math.floor(Math.random() * Object.keys(statusType).length);
  var randomStatus = Object.keys(statusType)[rand];
  return { ...r, id: uuidv4(), status: randomStatus };
});

var mock = new MockAdapter(axios);

mock.onGet("/documents").reply(200, documents);

mock.onPost("/updateDocument").reply((config) => {
  console.log(config);
  const document = JSON.parse(config.data).document;
  const documentChange: {status: string} = JSON.parse(config.data).documentChange;
  console.log(JSON.parse(config.data));
  const index = documents.findIndex((r) => r.id === document.id);

  ///// HARDWIRED
  document.status = documentChange.status

  return [200, document];
});

mock.onGet(RegExp(`/api/workflows/latest/*`)).reply((config) => {
  let workflowId: number = Number(config.url?.split("/")[3]);
  const storedFlow = window.localStorage.getItem(`workflow_${workflowId}`);
  const wf: IWorkflow = {
    id: workflowId,
    flow: storedFlow
  };
  return [200, wf];
});

mock.onPost("/api/workflows/save").reply((config) => {
  const workflowId = JSON.parse(config.data).workflowId;
  const flow = JSON.parse(config.data).flow;
  window.localStorage.setItem(`workflow_${workflowId}`, flow);
  return [200, { status: "empty" }];
});

mock.onGet("/users").reply(200, {
  users: [{ name: "john", id: "1" }]
});

export default mock;
