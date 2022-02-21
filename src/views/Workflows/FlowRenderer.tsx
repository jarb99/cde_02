import React, { useState, useCallback } from "react";
import { Box, Button, Container, createStyles, makeStyles, TableCell, Theme } from "@material-ui/core";

import ReactFlow, {
   removeElements,
   ReactFlowProvider,
   addEdge,
   MiniMap,
   Controls,
   updateEdge
} from "react-flow-renderer";

const onChange = () => {
   console.log("did change");
};

const initialElements: any =
   [
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
         data: { label: <div>TEAM REVIEW</div> },
         position: { x: 70, y: 150 },
         style: { width: "auto" },
         sourcePosition: "right",
         targetPosition: "left"
      },
      {
         id: "2",
         // you can also pass a React component as a label
         data: { label: <div>LEAD REVIEW</div> },
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
      { id: "e1-1b", source: "1", target: "1b", type: "smoothstep" },
      { id: "e1b-2", source: "1b", target: "2", type: "smoothstep" },
      { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
      { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
      { id: "e2-5", source: "2", target: "5", type: "smoothstep" },
      { id: "e2-6", source: "3", target: "6", type: "smoothstep" },
      { id: "e2-7", source: "4", target: "6", type: "smoothstep" },
      { id: "e2-8", source: "6", target: "7", type: "smoothstep" }
   ];

interface Props { }

const FlowRenderer = (props: Props) => {
   const [rfInstance, setRfInstance] = useState<any>(null);
   const [elements, setElements] = useState(initialElements);

   const getNodeId = () => `randomnode_${+new Date()}`;

   const onLoad = (reactFlowInstance: any) => {
      setRfInstance(reactFlowInstance);
      console.log(typeof reactFlowInstance);
      reactFlowInstance.fitView();
   };
   const onElementsRemove = (elementsToRemove: any) =>
      setElements((els: any) => removeElements(elementsToRemove, els));
   const onEdgeUpdate = (oldEdge: any, newConnection: any) =>
      setElements((els: any) => updateEdge(oldEdge, newConnection, els));
   const onConnect = (params: any) => setElements((els: any) => addEdge(params, els));

   const onSave = useCallback(() => {
      console.log("did click");
      if (rfInstance) {
         const flow = rfInstance?.toObject()!;
         console.log(flow);
      }
   }, [rfInstance]);

   const onAdd = useCallback(() => {
      const newNode = {
         id: getNodeId(),
         data: { label: "Added node" },
         sourcePosition: "right",
         targetPosition: "left",
         position: {
            x: 150,
            y: 80
         }
      };
      setElements((els: object[]) => els.concat(newNode));
   }, [setElements]);

   return (
      <div style={{ height: 450 }}>
         <ReactFlowProvider>
            <ReactFlow
               elements={elements}
               onLoad={onLoad}
               onElementsRemove={onElementsRemove}
               onConnect={onConnect}
               deleteKeyCode={46} /* 'delete'-key */
               onEdgeUpdate={onEdgeUpdate}
               snapToGrid
               snapGrid={[10, 10]}
            >
               <Controls />
            </ReactFlow>
         </ReactFlowProvider>
         <Button onClick={onAdd}>add node</Button>
      </div>
   );
};

export default FlowRenderer;
