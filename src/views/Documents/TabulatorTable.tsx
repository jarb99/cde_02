import React, { useEffect, useContext, useState } from 'react';
import { DispatchContext, StateContext } from './Documents';
import { ActionType } from '../../api/globalReducer';
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { updateDocument } from "../../api/API";
import { apiSend } from "../../api/ApiSend";
import statusType from "../../models/StatusType";
import Document from "../../models/Document";

let table: any = undefined;

interface Props {
   documents: Document[]
   handleUpdateDocument: (obj: any) => void
}
 
const TabulatorTable = (props: Props) => {

   let el: any = React.createRef();
   const { dispatch } = useContext(DispatchContext);
   const { state } = useContext(StateContext);
   const [built, setBuilt] = useState(false);

   useEffect(() => {
      if (el && props.documents.length !== 0 && table === undefined) createTable(el);
   }, [el, props.documents])

   useEffect(() => {
      return  () => { 
         console.log('CLEARING TABULATOR TABLE');
         table = undefined; 
      }
   }, [])

   useEffect(() => {
      if (built) {
         console.log('detected change to state.documents, table:', table);
         let docs = props.documents.map(r => { return {...r}});
         console.log('docs', docs);
         table && table.setData(docs);
      }
   }, [props.documents])

   const doUpdateStatus = (cell: any, status: string) => {
      apiSend<Document, any>(() => updateDocument({
         document: cell._cell.row.data,
         documentChange: { status: status }
      })).then(data => {
         props.handleUpdateDocument({
            type: ActionType.updateDocument,
            payload: { document: data.data }
         })
      });
   };

   const cellContextMenu: any = (cell: any, e: Event) => {
      console.log("cell", cell, "e", e);
      let menu = [];
      console.log(cell);
      if (cell.getValue().toLowerCase().includes("review")) {
         menu.push({
            label: "Approve Status A",
            action: (e: Event, cell: any) => doUpdateStatus(cell, "A")
         });
         menu.push({
            label: "Approve Status B with comments",
            action: (e: Event, cell: any) => doUpdateStatus(cell, "B")
         });
         menu.push({
            label: "Reject Status C with comments",
            action: (e: Event, cell: any) => doUpdateStatus(cell, "C")
         });
      }
      return menu;
   };

   const getColor = (val: string): string => {
      let color: string = "";
      switch (val) {
         case "A":
            color = "green";
            break;
         case "B":
            color = "orange";
            break;
         case "C":
            color = "red";
            break;
      }
      if (val.toLowerCase().includes("review")) color = "blue";
      return color;
   };

   function createTable( el: any): void {
      console.log("TABLE BEING INITIALISED", table);
      table = new Tabulator(el, {
         height: "100%",
         data: props.documents,
         // debugEventsInternal: true, //console log internal events
         // reactiveData: true,
         groupToggleElement: "header",
         persistenceMode: "cookie", //store persistence information in a cookie
         columns: [
            {
               title: "",
               formatter: "rowSelection",
               titleFormatter: "rowSelection",
               headerSort: false,
               width: 50
            },
            { title: "Discipline", field: "Discipline", width: 100 },
            { title: "Drawing Title", field: "Drawing Title", widthGrow: 2 },
            { title: "Drawing No.", field: "num", width: 180 },
            { title: "Revision", field: "Revision", hozAlign: "center", width: 90 },
            {
               title: "Status",
               field: "status",
               contextMenu: cellContextMenu,
               formatter: (cell, formatterParams, onRendered) => {
                  let val: string = cell.getValue();
                  const color = getColor(val);
                  return val
                     ? `<span class="dot" style="background-color: ${color}"></span>${statusType[val as keyof typeof statusType]
                     }`
                     : "";
               }
            }
         ],
         layout: "fitColumns",
         groupBy: "Discipline",
         maxHeight: "100%",
         history: true,
         keybindings: {
            navUp: false,
            navDown: false,
            scrollToStart: false,
            scrollToEnd: false
         },
         movableColumns: true
      });
      table.on("tableBuilt", () => { setBuilt(true) });
   }

   console.log('TabulatorTable.tsx RENDER', props.documents);

   return <div ref={(refEl) => (el = refEl)} />;
}

export { table };
export default TabulatorTable;