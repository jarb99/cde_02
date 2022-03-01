import React, { useCallback } from "react";
import { useApiFetch } from "../../api/ApiFetch";
import { useApiSend } from "../../api/ApiSend";
import { getWorkflowLatest, saveWorkflow } from "../../api/API";
import IWorkflow from "../../models/Workflow";
import { CancelToken } from "axios";
import FlowRenderer from "./FlowRenderer";
import { Button } from "@material-ui/core";

interface WorkflowProps {
  workflowId: string;
}

const initialElements: any = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "ISSUE" },
    position: { x: 0, y: 150 },
    sourcePosition: "right",
    style: { width: "auto" }
  },
  {
    id: "1b",
    // you can also pass a React component as a label
    data: { label: "TEAM REVIEW" },
    position: { x: 70, y: 150 },
    style: { width: "auto" },
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: "LEAD REVIEW" },
    position: { x: 200, y: 150 },
    style: { width: "auto" },
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "3",
    type: "default", // output node
    data: { label: "STATUS A" },
    position: { x: 350, y: 90 },
    style: { width: "auto" },
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "4",
    type: "default", // output node
    data: { label: "STATUS B" },
    position: { x: 350, y: 150 },
    style: { width: "auto" },
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "5",
    type: "output", // output node
    data: { label: "STATUS C" },
    position: { x: 350, y: 210 },
    style: { width: "auto" },
    targetPosition: "left"
  },
  {
    id: "6",
    type: "default", // output node
    data: { label: "CLIENT REVIEW" },
    position: { x: 460, y: 120 },
    style: { width: "auto" },
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "7",
    type: "output", // output node
    data: { label: "FIN" },
    position: { x: 580, y: 120 },
    style: { width: "auto" },
    targetPosition: "left"
  },
  // animated edge
  {
    id: "e1-1b",
    source: "1",
    target: "1b",
    type: "smoothstep",
    animated: "true"
  },
  { id: "e1b-2", source: "1b", target: "2", type: "smoothstep" },
  { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
  { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
  { id: "e2-5", source: "2", target: "5", type: "smoothstep" },
  { id: "e2-6", source: "3", target: "6", type: "smoothstep" },
  { id: "e2-7", source: "4", target: "6", type: "smoothstep" },
  { id: "e2-8", source: "6", target: "7", type: "smoothstep" }
];

const Workflow: React.FC<WorkflowProps> = (props: WorkflowProps) => {
  const { workflowId } = props;
  const fetchWorkflow = useCallback(
    (cancelToken?: CancelToken) => getWorkflowLatest(workflowId, cancelToken),
    [workflowId]
  );
  const [fetchState] = useApiFetch<IWorkflow>(fetchWorkflow);
  const [saveState, save] = useApiSend(saveWorkflow);
  
  //   console.log('making workflow', fetchState);
  let fetchedFlow = null;
  fetchState.data &&
    fetchState.data.flow &&
    (fetchedFlow = JSON.parse(fetchState?.data?.flow));
  fetchState.data &&
    fetchState.data.id &&
    !fetchState.data.flow &&
    (fetchedFlow = { elements: initialElements });
  fetchState.error && (fetchedFlow = { elements: initialElements });

  const handleSave = async (flow: any) => {
    save({
      workflowId: workflowId,
      flow: flow
    });
  };

  console.log("FETCH STATE:", fetchState);

  return (
    <>
      {fetchedFlow && (
        <FlowRenderer
          workflowId={workflowId}
          flow={fetchedFlow ?? []}
          handleSave={handleSave}
        />
      )}
    </>
  );
};

export default Workflow;
