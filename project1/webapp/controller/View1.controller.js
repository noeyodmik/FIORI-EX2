sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                var oModel = new JSONModel({
                    ValueHelpData: [
                        { Name: "test 1", Desc: "desc 1" },
                        { Name: "test 2", Desc: "desc 2" },
                        { Name: "test 3", Desc: "desc 3" }
                    ],
                    value   : null,
                    integer : null,
                    date    : new Date()
                });

                this.getView().setModel(oModel, "view");
            },

            onInputChange: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                MessageToast.show(sValue)
            },

            onSubmit: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                MessageToast.show(sValue)
            },

            onLiveChange: function (oEvent) {
                var sValue      = oEvent.getParameter("value"),
                    bEsc        = oEvent.getParameter("escPressed"),
                    sPrevious   = oEvent.getParameter("previousValue");

                var sModelValue = this.getView().getModel("view").getProperty("/value")

                MessageToast.show(sValue + "\n" + bEsc + "\n" + sPrevious + "\n" + sModelValue)
            },

            onLiveChange2: function (oEvent) {
                // 입력한 비밀번호 길이가 10자리 미만일 경우 MessageToast로 알려주기
                var sValue = oEvent.getParameter("value"),
                    iLength = sValue.length; // 입력한 문자열의 길이

                var oInput = oEvent.getSource();

                if (iLength < 10) {
                    // MessageToast.show("10자리 이상의 암호를 입력해주세요");
                    oInput.setValueState("Error");
                    oInput.setValueStateText("10자리 이상의 암호를 입력해주세요");
                } else {
                    oInput.setValueState("Information");
                    oInput.setValueStateText("정상적으로 입력되었습니다");
                }

            },

            handleValueHelp: function (oEvent) {
                var oView = this.getView();
                // this._sInputId = oEvent.getSource().getId();
                this._oInput = oEvent.getSource();
                var sValue = oEvent.getSource().getValue();

                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id:         oView.getId(),
                        name:       "project1.view.Dialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                    oValueHelpDialog._searchField.setValue(sValue); // 입력창에 들어있는 값을 검색창에 복사
                });
            },

            _handleValueHelpSearch : function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    "Name",
                    FilterOperator.Contains, sValue
                );
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
        
            _handleValueHelpClose : function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this._oInput;
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onSuggest : function (oEvent) {
                var sTerm    = oEvent.getParameter("suggestValue");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Name", FilterOperator.StartsWith, sTerm));
                } 

                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            }
        });
    });
