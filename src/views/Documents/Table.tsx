import React, { useEffect } from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { fetchDocuments, updateDocument } from "../../api/API";



let table: any;

const doUpdateStatus = (cell: any, status: string) => {
    updateDocument(cell._cell.row.data.id, { status: status }).then((row) => {
      table.updateData([{ id: row.id, status: row.status }]);
    });
  };
  
  const cellContextMenu = (cell: any, e: Event) => {
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
    console.log("menu", menu);
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

const Table = () => {
    const theme = useTheme();
    let el: any = React.createRef();
 
    const useStyles = makeStyles({
       "@global": {
          "*.tabulator-col,.tabulator-headers": {
             backgroundColor: `${theme.palette.grey[700]} !important`,
          },
       },
    });
    useStyles();
 
    console.log('starting data call');
 
    function createTable(data: any): void {
       table = new Tabulator(el, {
          height: "100%",
          data: data,
          groupToggleElement: "header",
          persistenceMode: "cookie", //store persistence information in a cookie
          columns: [
             {
                title: "",
                formatter: "rowSelection",
                titleFormatter: "rowSelection",
                hozAlign: "center",
                width: 20,
                headerSort: false,
                cellClick: function (e, cell) {
                   cell.getRow().toggleSelect();
                },
             },
             { title: "DISCIPLINE", field: "Discipline", vertAlign: "middle" },
             { title: "DOCUMENT NUMBER", field: "num", vertAlign: "middle" },
             {
                title: "TITLE/DESCRIPTION",
                field: "Drawing Title",
                widthGrow: 3,
                vertAlign: "middle",
                headerClick: function (e, column) {
                   console.log(table.getData());
                   //e - the tap event object
                   //column - column component
                },
             },
             {
                title: "REVISION",
                field: "Revision",
                hozAlign: "center",
                vertAlign: "middle",
             },
          ],
          layout: "fitColumns",
          groupBy: "Discipline",
          maxHeight: "100%",
          history: true,
          keybindings: {
             navUp: false,
             navDown: false,
             scrollToStart: false,
             scrollToEnd: false,
          },
          movableColumns: true,
       });
    }

    // interface Iresult {
    //     status: number,
    //     data: any
    // }
 
    useEffect(() => {
        fetchDocuments().then((result) => {
          if (result.status === 200) {
            createTable(result.documents);
          } else {
            console.log("load table data error: ", result);
          }
        });
    }, []);
 
    return (
       <>
          <Box
             style={{
                backgroundColor: "#ffffff",
                height: "100%",
                width: "100%",
             }}
          //   className={"panelBorder"}
          >
             <div
                style={{
                   width: "100%",
                   height: "100%",
                   maxWidth: "100%",
                }}
             >
                <div ref={(refEl) => (el = refEl)} />
             </div>
          </Box>
       </>
    );
 };

 export default Table;