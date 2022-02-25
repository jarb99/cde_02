import React, { useCallback } from "react";
import useApiFetch from "../../api/ApiFetch";
import { getWorkflowLatest } from "../../api/API";
import IWorkflow from "../../models/Workflow";
import { CancelToken } from "axios";
import FlowRenderer from "./FlowRenderer";

interface CustomerOrdersRecentProps {
  workflowId: number;
}

const Workflow: React.FC<CustomerOrdersRecentProps> = (props: CustomerOrdersRecentProps) => {
  const {workflowId} = props;
  const fetchWorkflow = useCallback((cancelToken?: CancelToken) => getWorkflowLatest(workflowId, cancelToken), [workflowId]);
  const [fetchState, refetch] = useApiFetch<IWorkflow>(fetchWorkflow);

  console.log('making workflow', fetchState);

  return (
    <FlowRenderer   workflowId={workflowId}
                    title="Recent Orders"
                    items={fetchState.data ?? []}
                    isFetching={fetchState.isFetching}
                    fetchErrored={fetchState.hasErrored}
                    fetchErroredWithNotFound={fetchState.hasErroredWithNotFound}
                    fetchError={fetchState.error}
                    refetch={refetch}/>
  );
};

export default Workflow;