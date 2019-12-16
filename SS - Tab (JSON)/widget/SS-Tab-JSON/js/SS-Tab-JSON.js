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
            if (tab == 'Repeat') {
                    table = $('#listing').DataTable({
                        //data: widget.repeatTable.data,
                        data: widget.tabData().data,
                        order: [[ 0, "desc" ]],
                        columns: [{title: "ID"},{title: "Product Name"},{title: "Quantity"},{title: "Price"},{title: "Last Ordered"},{title: "New Quantity"},{title: ""},{title: ""}],
                        columnDefs: [{
                                targets: 7,
                                orderable: false,
                                data: "download_link",
                                render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}
                                },
                                {
                                targets: 5,
                                orderable: false,
                                data: "download_link",
                                render: function(data, type, row, meta) {return '<input type="text" size="5">';}
                                },     
                                {
                                targets: 6,
                                orderable: false,
                                data: "download_link",
                                render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Schedule">';}
                                }                                      
                            ],
                            language: {
                                emptyTable: "No orders found"
                            },                            
                            destroy: true
                            //scrollX: true,
                            //scrollCollapse: true                            
                        });
            } else if (tab == 'Installed') {
                        table = $('#listing').DataTable({
                            //data: widget.installTable.data,
                            data: widget.tabData().data,
                            order: [[ 2, "desc" ]],
                            columns: [{title: "Status"},{title: ""},{title: "Year"},{title: "Product"},{title: "Purchased"},{title: "Last Serviced"},{title: "Mileage"},{title: "Avg. Runtime"},{title: "Oil Life"},{title: ""},{title: "Action(s)"}],
                            columnDefs: [
                                {
                                    targets: 0,
                                    orderable: false,
                                    render: function(data, type, row, meta) {
                                        var image;
                                        var alt = row[0];
                                        if (row[0] == 'Online') {
                                            image = ss_images + "/tables/online.png";
                                        } else {
                                            image = ss_images + "/tables/offline.png";
                                        } 
                                        return '<img src="' + image + '" height="20px" widgth="20px">';
                                    }
                                },     
                                {
                                    targets: 1,
                                    orderable: false,
                                    render: function(data, type, row, meta) {
                                        var alt = row[1];
                                        var image = ss_images + "/tables/" + alt;
                                        return '<img alt="' + alt + '" src="' + image + '" height="60px" widgth="60px">';
                                    }
                                },                                 
                                {targets: 9, render: function(data, type, row, meta) {
                                                return '<a href="https://goo.gl/maps/WbtxQfnhNSTcLJPR8" target="_blank"><img src="' + ss_images + "/tables/geolocation.png" + '" height="30px" widgth="30px"></a>';
                                            }
                                },
                                {targets: 10, render: function(data, type, row, meta) {
                                                        return '<script>function openWin(){window.open("https://marvelapp.com/4jijdae/screen/63940559");}</script><input class="cc-button-primary" type="button" value="Schedule">&nbsp;<input onclick="openWin()" class="cc-button-primary" type="button" value="Details">';
                                                    }
                                },
                                {targets: [6,7,8,9,10],orderable: false},  
                            ],
                            language: {
                                emptyTable: "No equipment found"
                            },                            
                            destroy: true,
                            //scrollX: true,
                            //scrollCollapse: true                            
                        });                
            } else if (tab == 'Orders') {
                        table = $('#listing').DataTable({
                            //data: widget.ordersTable.data,
                            data: widget.tabData().data,
                            columns: [
                                {title: "Date"},
                                {title: "Order #"},
                                {title: "Invoice #"},
                                {title: "Total"},
                                {title: "Status"},
                                {title: ""},
                                {title: ""}
                            ],
                            columnDefs: [
                                {targets: 0, type: "date", render: function (value) {
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
                                targets: 5,
                                render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}
                                },  
                                {
                                targets: 6,
                                render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}
                                },                                 
                                {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                                {targets: [3,4,5,6],"orderable": false},  
                            ],
                            language: {
                                emptyTable: "No orders found"
                            },                            
                            destroy: true,
                            //scrollX: true,
                            //scrollCollapse: true                            
                        });
            } else if (tab == 'Invoices') {
                    table = $('#listing').DataTable({
                        //data: widget.invoicesTable.data,
                        data: widget.tabData().data,
                        order: [[ 0, "desc" ]],
                        columns: [ {title: "Date"},{title: "Invoice #"},{title: "Order #"},{title: "Total"},{title: "PO #"},{title: "Due Date"},{title: "Status"},{title: "PDF"},{title: ""}],
                        columnDefs: [{
                            targets: 6,
                            orderable: false,
                            data: "download_link",
                            render: function(data, type, row, meta) {return '<a href="' + data + '"><u>Details</u></a>';}
                            },
                            {
                            targets: 7,
                            orderable: false,
                            data: "download_link",
                            render: function(data, type, row, meta) {return '<img src="' + ss_images + "/tables/pdf.png" + '" height="20px" widgth="20px">';}
                            },
                            {
                            targets: 8,
                            orderable: false,
                            data: "download_link",
                            render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Pay">';}                                    
                            }                                
                        ],
                        language: {
                            emptyTable: "No invoices found"
                        },                          
                        destroy: true
                        //scrollX: true
                        //scrollCollapse: true
                    });      
            } else if (tab == 'Subscriptions') {
                    table = $('#listing').DataTable({
                            //data: widget.subscriptionsTable.data,
                            data: widget.tabData().data,
                            order: [[ 3, "desc" ]],
                            columns: [{title: "ID"},{title: "Product Name"},{title: "Amount"},{title: "Expires"},{title: "Status"}],
                            columnDefs: [{
                                targets: 4,
                                orderable: false,
                                data: "download_link",
                                render: function(data, type, row, meta) {
                                    var image;
                                    var alt = row[4];
                                    if (row[4] == 'Active') {
                                        image = ss_images + "/tables/green_check.png";
                                    } else if (row[4] == 'Suspended') {
                                        image = ss_images + "/tables/red_x.png";
                                    } else {
                                        image = ss_images + "/tables/warning.png";
                                    }
                                    return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                                }
                            }],
                            language: {
                                emptyTable: "No subscriptions found"
                            },                            
                            destroy: true
                            //scrollX: true,
                            //scrollCollapse: true                            
                        });                
            } else if (tab == 'Quotes') {
                    table = $('#listing').DataTable({
                        //data: widget.quotesTable.data,
                        data: widget.tabData().data,
                        order: [[ 9, "desc" ]],
                        //columns: [{title: ""},{title: "Lock"},{title: "Transaction"},{title: "Version"},{title: "Account"},{title: "Description"},{title: "Status"},{title: "TCV"},{title: "Prepared By"},{title: "Created"},{title: "Updated"},{title: "ACV"}],
                        //columns: [{title: ""},{title: "Lock"},{title: "Transaction"},{title: "Version"},{title: "Description"},{title: "Status"},{title: "TCV"},{title: "Prepared By"},{title: "Created"},{title: "Updated"},{title: "ACV"}],
                        columns: [{title: ""},{title: "Lock"},{title: "Transaction"},{title: "Version"},{title: "Description"},{title: "Status"},{title: "TCV"},{title: "Prepared By"},{title: "Created"},{title: "Updated"}],
                        columnDefs: [{
                            targets: [0,3,5],
                            orderable: false
                        },                                
                        {
                            targets: 0,
                            orderable: false,
                            data: "download_link",
                            render: function(data, type, row, meta) {return '<input type="checkbox" name="cpq_select" value="cpq_select">';}
                        },
                        {
                            targets: 2,
                            data: "download_link",
                            render: function(data, type, row, meta) {return '<a href=""><u>' + row[2] + '</u></a>';}
                        }],
                        language: {
                            emptyTable: "No quotes found"
                        },                            
                        destroy: true,
                        //scrollX: true,
                        //scrollCollapse: true                            
                    });  
            } else {
                CCLogger.warn('No table config found - ' + tab);
            }
            return table;                
        }

        var tabUsed = [];
        //var apiCalled = [];
        //var ss_settings;
        var ss_images;
        var ss_data;

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
                ss_data = ss_settings.resourceData;
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

                for (var i = 0; i < tabUsed.length; i++) {
                  //if (tabUsed.includes(tab) && !apiCalled.includes(tab)) { //Only retrieve JSON for tabs that are being used and haven't been requested yet
                  if (tabUsed.includes(tab)) { //Only retrieve JSON for tabs that are being used and haven't been requested yet
                    $.ajax({
                      url: ss_data + widget.jsonURL(),
                      dataType: 'json',
                      success: function(result) {
                        widget.tabData(result);
                        widget.tabTotal(result.data.length);
                        widget.tabDisplay(tab + ' (' + result.data.length + ')');
                      },
                      error: function(jqXHR, textStatus, error) {
                        widget.tabTotal(0);
                        widget.tabDisplay(tab + ' (0)');
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + tab + "-" + error);
                      }
                    });
                    //apiCalled.push(tab);
                  }
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
