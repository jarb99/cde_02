import React, { useEffect } from "react";
import { Box, Container, makeStyles, useTheme } from "@material-ui/core";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { fetchDocuments, updateDocument } from "../../api/API";
import statusType from "../../models/StatusType";

let table: any;

const doUpdateStatus = (cell: any, status: string) => {
  updateDocument(cell._cell.row.data.id, { status: status }).then((row) => {
    table.updateData([{ id: row.id, status: row.status }]);
  });
};

const cellContextMenu: any = (cell: any, e: Event) => {
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
        backgroundColor: `${theme.palette.grey[700]} !important`
      }
    }
  });
  useStyles();

  console.log("starting data call");

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
          headerSort: false,
          width: 50
        },
        { title: "Discipline", field: "Discipline", width: 100 },
        { title: "Drawing No.", field: "num", width: 180 },
        { title: "Revision", field: "Revision", hozAlign: "center", width: 90 },
        { title: "Drawing Title", field: "Drawing Title", widthGrow: 2 },
        {
          title: "Status",
          field: "status",
          contextMenu: cellContextMenu,
          formatter: (cell, formatterParams, onRendered) => {
            let val: string  = cell.getValue();
            const color = getColor(val);
            return val
              ? `<span class="dot" style="background-color: ${color}"></span>${statusType[val as keyof typeof statusType]}`
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
  }

  // interface Iresult {
  //     status: number,
  //     data: any
  // }

  useEffect(() => {
    if (el) {
      fetchDocuments().then((result) => {
        if (result.status === 200) {
          console.log(result);
          createTable(result.documents);
        } else {
          console.log("load table data error: ", result);
        }
      });
    }
  }, [el]);

  //   useEffect(() => {
  //     fetchDocuments().then((result) => {
  //       if (result.status === 200) {
  //         console.log("el", el, typeof el);
  //         setTimeout(
  //           () => {
  //             console.log("el", el, typeof el);
  //             createTable(result.documents);
  //           },
  //           el ? 0 : 1500
  //         );
  //       } else {
  //         console.log("load table data error: ", result);
  //       }
  //     });
  //   }, []);

  return (
    <>
      <Box
        style={{
          backgroundColor: "#ffffff",
          height: "100%",
          width: "100%"
        }}
        //   className={"panelBorder"}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%"
          }}
        >
          <div ref={(refEl) => (el = refEl)} />
        </div>
      </Box>
    </>
  );
};

export default Table;
