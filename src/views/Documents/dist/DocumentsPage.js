"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var Box_1 = require("@material-ui/core/Box");
var tabulator_tables_1 = require("tabulator-tables");
// import Properties from "./Properties"; //
// import Subscriptions from "./Subscriptions";
var data = require("./tempData.json");
var Header = function () {
    return (react_1["default"].createElement(Box_1["default"], { style: { height: "50px", width: "100%" } }, "10068: JUBILIE PLACE"));
};
var Table = function () {
    var el = react_1["default"].createRef();
    var table;
    function createTable() {
        console.log("data:", Object.values(data));
        table = new tabulator_tables_1.TabulatorFull(el, {
            height: "100%",
            data: Object.values(data),
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
                    }
                },
                { title: "DISCIPLINE", field: "Discipline", vertAlign: "middle" },
                { title: "DOCUMENT NUMBER", field: "num", vertAlign: "middle" },
                {
                    title: "TITLE/DESCRIPTION",
                    field: "Drawing Title",
                    widthGrow: 3,
                    vertAlign: "middle"
                },
                {
                    title: "REVISION",
                    field: "Revision",
                    hozAlign: "center",
                    vertAlign: "middle"
                },
            ],
            layout: "fitColumns",
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
    react_1.useEffect(function () {
        setTimeout(function () {
            createTable();
        }, 200);
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Box_1["default"], { style: {
                backgroundColor: "#ffffff",
                height: "100%",
                width: "100%"
            } },
            react_1["default"].createElement("div", { style: {
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%"
                } },
                react_1["default"].createElement("div", { ref: function (refEl) { return (el = refEl); } })))));
};
var actionKind;
(function (actionKind) {
    actionKind["SETDATA"] = "SETDATA";
    actionKind["SETCOLUMNS"] = "SETCOLUMNS";
})(actionKind || (actionKind = {}));
var documentsReducer = function (state, action) {
    var type = action.type, payload = action.payload;
    switch (type) {
        case actionKind.SETDATA:
            return __assign(__assign({}, state), { data: payload });
        case actionKind.SETCOLUMNS:
            return __assign(__assign({}, state), { columns: payload });
    }
    console.log("reducer output: ", type, payload);
};
var DocumentsPage = function () {
    //   const [state, dispatch] = useReducer(documentsReducer, {
    //     data: null,
    //     columns: null,
    //   });
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Box_1["default"], { style: {
                width: "100%",
                display: display,
                flexDirection: flexDirection,
                height: "calc(100% - 15px)"
            } }),
        "Header />",
        react_1["default"].createElement(Box_1["default"], { display: "flex", flexDirection: "row", style: {
                flexGrow: 1,
                width: "100%",
                maxWidth: "100%"
            } },
            react_1["default"].createElement(Box_1["default"], null),
            react_1["default"].createElement(Box_1["default"], { style: {
                    flexGrow: 1,
                    maxHeight: "100%",
                    width: "500px",
                    height: "100%",
                    marginLeft: "10px;",
                    marginRight: "10px;"
                }, className: "panelBorder" },
                react_1["default"].createElement(Box_1["default"], { style: { height: "100%", width: "100%" } },
                    react_1["default"].createElement(Table, null))),
            react_1["default"].createElement(Box_1["default"], null))));
};
exports["default"] = DocumentsPage;
