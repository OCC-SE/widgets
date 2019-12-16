/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger, dataTables) {

        "use strict";

        function buildTable(tab,widget) {
            var table;
            if (tab == 'Leads') {
                table = $('#listing').DataTable( {
                    processing: true,
                    data: widget.tabData(),
                    columns: [{title: "Name"},{title: "Company"},{title: "Title"},{title: "Product Interest"},{title: "Status"},{title: "Email"},{title: "Phone"},{title: "Last Modified"},{title: ""}],
                    columnDefs: [{
                        targets: 8,
                        orderable: false,
                        data: "download_link",
                        render: function(data, type, row, meta) {
                            //return '<a href="' + widget.sfURL() + row[8] + '"><u>Details</u></a>';
                            return '<input class="cc-button-primary" type="button" value="Details">';
                        }
                    },
                        {targets: 7,
                            type: "date",
                            render: function (value) {
                                if (value === null) return "";
                                var mydate = new Date(value);
                                var yyyy = mydate.getFullYear().toString();
                                var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
                                var dd = mydate.getDate().toString();
                                var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                var mydatestr = new Date(parts);
                                return mydatestr.toLocaleDateString();
                            }
                        },
                        {
                            targets: [3,4,5,6,8],
                            orderable: false
                        },
                    ],
                    language: {
                        emptyTable: "No " + tab.toLowerCase() + " found"
                    },
                    destroy: true,
                    scrollX: true,
                    scrollCollapse: true
                });
            }
            else if (tab == 'Contacts') {
                table = $('#listing').DataTable( {
                    processing: true,
                    data: widget.tabData(),
                    columns: [{title: "Name"},{title: "Title"},{title: "Account"},{title: "Phone"},{title: "Email"},{title: ""}],
                    columnDefs: [{
                        targets: 5,
                        orderable: false,
                        data: "download_link",
                        render: function(data, type, row, meta) {
                            //return '<a href="' + widget.sfURL() + row[8] + '"><u>Details</u></a>';
                            return '<input class="cc-button-primary" type="button" value="Details">';
                        }
                    },
                        {
                            targets: [3,4],
                            orderable: false
                        },
                    ],
                    language: {
                        emptyTable: "No " + tab.toLowerCase() + " found"
                    },
                    destroy: true
                });
            }
            else {
                table = $('#listing').DataTable( {
                    processing: true,
                    data: widget.tabData(),
                    columns: [{title: "Name"},{title: "Account"},{title: "Amount"},{title: "Stage"},{title: "Close Date"},{title: ""}],
                    columnDefs: [{
                        targets: 5,
                        orderable: false,
                        data: "download_link",
                        render: function(data, type, row, meta) {
                            //return '<a href="' + widget.sfURL() + row[8] + '"><u>Details</u></a>';
                            return '<input class="cc-button-primary" type="button" value="Details">';
                        }
                    },
                        {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                        {targets: 4,
                            type: "date",
                            render: function (value) {
                                if (value === null) return "";
                                var mydate = new Date(value);
                                var yyyy = mydate.getFullYear().toString();
                                var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
                                var dd = mydate.getDate().toString();
                                var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                var mydatestr = new Date(parts);
                                return mydatestr.toLocaleDateString();
                            }
                        },
                    ],
                    language: {
                        emptyTable: "No " + tab.toLowerCase() + " found"
                    },
                    destroy: true
                });
            }
            return table;
        }

        var tabUsed = [];
        var apiCalled = [];
        var ss_images;

        return {

            tabNameTrim: ko.observable('Loading'),
            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),

            onLoad: function(widgetModel) {
                
                var widget = widgetModel;
                
                if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
                ss_images = ss_settings.resourceImages;

                if (!widget.tabName()) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }                

                var tab = widget.tabName();
                var tabTrim = tab; //widget.tabName().replace(' ','');

                widget.tabNameTrim(tabTrim);
                widget.tabImage = ss_images + "/tabs/" + tabTrim.toLowerCase() + ".png";
                                
                //Create the tab collection
                tabUsed.push(tab);
                
                if (!apiCalled.includes(tab)) {
                    var assetType;
                    if (tab == 'Leads') {
                        assetType = "leads";
                    } else if (tab == 'Contacts') {
                        assetType = "contacts2";
                    } else {
                        assetType = "opps";
                    }

                    $.ajax({
                        type: "GET",
                        async: true,
                        url: '/ccstorex/custom/v1/' + assetType,
                        dataType: 'json',
                        success: function(response) {
                            var dataSet = [];
                            if (tab == 'Leads') {
                                for (var i=0; i<response.totalSize; i++) {
                                    dataSet[i] = [
                                        response.records[i].Name,
                                        response.records[i].Company,
                                        response.records[i].Title,
                                        response.records[i].ProductInterest__c,
                                        response.records[i].Status,
                                        response.records[i].Email,
                                        response.records[i].Phone,
                                        response.records[i].LastModifiedDate,
                                        response.records[i].attributes.url
                                    ];
                                }
                                widget.tabData(dataSet);
                            } else if (tab == 'Contacts') {
                                for (var c=0; c<response.totalSize; c++) {
                                    dataSet[c] = [
                                        response.records[c].Name,
                                        response.records[c].Title,
                                        response.records[c].Account.Name,
                                        response.records[c].Phone,
                                        response.records[c].Email,
                                        response.records[c].attributes.url
                                    ];
                                }
                                widget.tabData(dataSet);
                            } else {
                                for (var g=0; g<response.totalSize; g++) {
                                    dataSet[g] = [
                                        response.records[g].Name,
                                        response.records[g].Account.Name,
                                        response.records[g].Amount,
                                        response.records[g].StageName,
                                        response.records[g].CloseDate,
                                        response.records[g].attributes.url
                                    ];
                                }
                                widget.tabData(dataSet);
                            }
                            widget.tabTotal(response.totalSize);
                            widget.tabDisplay(tab + ' (' + response.totalSize + ')');
                        },
                        error: function(jqXHR, textStatus, error) {
                            widget.tabTotal(0);
                            widget.tabDisplay(tab + ' (0)');
                            CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + tab + "-" + error);
                        }
                    });
                    apiCalled.push(tab);
                }

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + tab);
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabName();
                if (tabUsed.includes(tab)) {
                    $('#tab-' + tab + '-' + widget.id()).on('click', function() {
                        $('[id^=tab-]').attr('class', 'imglink');
                        $('#tab-' + tab + '-' + widget.id()).attr('class', 'imglink-selected');
                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }      
                        buildTable(tab,widget);
                    });
                }
            }
        };
    }
);