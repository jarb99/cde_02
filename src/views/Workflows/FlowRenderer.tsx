import React, { useState, useCallback, useReducer } from "react";
import { Box, Button, Grid, TextField } from "@material-ui/core";

import ReactFlow, {
   removeElements,
   ReactFlowProvider,
   addEdge,
   MiniMap,
   ConnectionLineType,
   Controls,
   updateEdge,
   SmoothStepEdge,
} from "react-flow-renderer";

enum ActionType {
   SETRF = "SETRF",
   CLICKNODE = "CLICKNODE",
   CLICKPANE = "CLICKPANE",
   CLEARLABEL = "CLEARLABEL",
   SETELEMENTS = "SETELEMENTS",
   NODELABELCHANGE = "NODELABELCHANGE"
}

interface Action {
   type: ActionType;
   payload: any;
}

interface State {
   rfInstance: any;
   elements: any[];
   labelValue: string;
   clickedNodeId: string;
}

const reducer = (
   state: State,
   action: Action
): State => {
   const { type, payload } = action;
   switch (type) {
      case ActionType.SETRF:
         return { 
            ...state, 
            rfInstance: payload 
         };
      case ActionType.CLICKNODE:
         return { 
            ...state, 
            labelValue: payload.label,
            clickedNodeId: payload.id 
         };
      case ActionType.CLICKPANE:
         return { 
            ...state, 
            labelValue: '',
            clickedNodeId: '',
         };
      case ActionType.NODELABELCHANGE:
         return { 
            ...state, 
            labelValue: payload.label,
            elements: payload.elements
         };
      case ActionType.SETELEMENTS:
         return { 
            ...state, 
            elements: payload 
         };
      default:
         return state;
   }
};

interface Props {
   flow: any;
   workflowId: string;
   handleSave: (flow: any) => void;
}

const getInitialState = (props: Props): State => {
   return {
      rfInstance: null,
      elements: props.flow.elements,
      labelValue: '',
      clickedNodeId: '',
   }
}

const FlowRenderer = (props: Props) => {

   const [state, dispatch] = useReducer(reducer, getInitialState(props));
   const { rfInstance, elements, labelValue, clickedNodeId } = state;

   const getNodeId = () => `randomnode_${+new Date()}`;

   const handleNodeNameChange = (e: any) => {
      const label = e.target.value;
      const updateElementLabel = () => {
         console.log('clickedNodeId', clickedNodeId);
         if (clickedNodeId.length) {
            return elements.map((el: any) => {
               if (el.id === clickedNodeId) {
                  el.data = {
                     ...el.data,
                     label: label,
                  };
               }
               return el;
            })
         } 
      }
      dispatch({type: ActionType.NODELABELCHANGE, payload: { 
         label: label, 
         elements: updateElementLabel() 
      }})
   }

   const onLoad = (reactFlowInstance: any) => {
      dispatch({type: ActionType.SETRF, payload: reactFlowInstance});
      reactFlowInstance.fitView();
   };

   const onElementsRemove = (elementsToRemove: any) => dispatch({ 
      type: ActionType.SETELEMENTS,
      payload: removeElements(elementsToRemove, elements)
   });

   const onEdgeUpdate = (oldEdge: any, newConnection: any) =>  {
      console.log('');
      dispatch({ 
         type: ActionType.SETELEMENTS,
         payload: updateEdge(oldEdge, newConnection, elements)
      })
   };

   const onConnect = (params: any) => dispatch({ 
      type: ActionType.SETELEMENTS,
      payload: addEdge(params, elements)
   })

   const onSave = useCallback(() => {
      if (rfInstance) {
         const flow = rfInstance?.toObject()!;
         props.handleSave(flow)
         console.log(flow);
      }
   }, [rfInstance]);

   const onElementClick = (event: any, element: any) => {
      element.data && dispatch({ type: ActionType.CLICKNODE, payload: { label: element.data.label, id: element.id }})
   }

   const onPaneClick = (event: any) => {
      dispatch({ type: ActionType.CLICKPANE, payload: {} })
   }

   const onAdd = useCallback(() => {
      const newNode = {
         id: getNodeId(),
         data: { label: "Added node" },
         style: { width: "auto" },
         sourcePosition: "right",
         targetPosition: "left",
         position: {
            x: 150,
            y: 80
         }
      };
      dispatch({ 
         type: ActionType.SETELEMENTS,
         // payload: ((els: object[]) => els.concat(newNode))
         payload: [newNode].concat(elements)
      })
   }, []);

   // console.log('elements', elements);

   return (
      <div style={{ height: 450 }}>
         <ReactFlowProvider>
            <ReactFlow
               elements={elements}
               onElementClick={onElementClick}
               onPaneClick={onPaneClick}
               onLoad={onLoad}
               onElementsRemove={onElementsRemove}
               onConnect={onConnect}
               deleteKeyCode={46} /* 'delete'-key */
               onEdgeUpdate={onEdgeUpdate}
               snapToGrid
               snapGrid={[10, 10]}
               connectionLineType={ConnectionLineType.SmoothStep}
               edgeTypes={{default: SmoothStepEdge}}
            >
               <Controls />
               
            </ReactFlow>
         </ReactFlowProvider>

         <Grid
         container
         direction="row"
         justify="space-between"
         alignItems="center"
         >
            <Grid item xs>
               <Button onClick={onAdd}>add node</Button>
               <Button onClick={onSave}>save workflow</Button>
            </Grid>
            <Grid item xs>
               <TextField 
               value={labelValue} 
               variant="standard" 
               disabled={!(clickedNodeId.length > 0)}
               onChange={handleNodeNameChange}
               />
            </Grid>
         </Grid>
      </div>
   );
};

export default FlowRenderer;
