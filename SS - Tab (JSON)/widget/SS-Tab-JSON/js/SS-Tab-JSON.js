/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables) {

        "use strict";
        
        function getConfig(tab) {
            var table;
            if (tab == 'Repeat') {
                    table = $('#listing').DataTable({
                        "order": [[ 0, "desc" ]],
                        columns: [{title: "ID"},{title: "Product Name"},{title: "Quantity"},{title: "Price"},{title: "Last Ordered"},{title: "New Quantity"},{title: ""},{title: ""}],
                        "columnDefs": [{
                                "targets": 7,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}
                                },
                                {
                                "targets": 5,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input type="text" size="5">';}
                                },     
                                {
                                "targets": 6,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Schedule">';}
                                }                                      
                            ],
                            "language": {
                                "emptyTable": "No orders found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                            
                        });
            } else if (tab == 'InstallBase') {
                    table = $('#listing').DataTable({
                            "order": [[ 0, "desc" ]],
                            columns: [{title: "ID"},{title: "Product Name"},{title: "Purchase Date"},{title: "Last Serviced"},{title: "Average Usage (monthly)"},{title: "Recommended Usage (monthly)"},{title: "Status"},{title: "Toner Life"},{title: ""}],
                            "columnDefs": [{
                                "targets": 8,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input class="cc-button-primary" style="white-space: nowrap" type="button" value="Schedule Service">';}
                                },
                                {"targets": [4,5,6,7,8],"orderable": false},  
                            ],
                            "language": {
                                "emptyTable": "No equipment found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                            
                        });                
            } else if (tab == 'Orders') {
                    table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.ordersDataset,
                            "columns": [
                                {"title": "Date", "data": "creationDate"}, { "title": "Order #", "data": "orderId"}, {"title": "Total", "data" : "total"}, {"title": "Status", "data" : "status" },
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}},
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}}
                            ],
                            "columnDefs": [
                               { "targets": 0, "type": "date", "render": function (value) {
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
                                { "type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                                {"targets": [3,4,5],"orderable": false},  
                            ],
                            "language": {
                                "emptyTable": "No orders found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                            
                        });
            } else if (tab == 'Invoices') {
                        table = $('#listing').DataTable({
                            "order": [[ 0, "desc" ]],
                            columns: [ {title: "Date"},{title: "Invoice #"},{title: "Order #"},{title: "Total"},{title: "PO #"},{title: "Due Date"},{title: "Status"},{title: "PDF"},{title: ""}],
                            "columnDefs": [{
                                "targets": 6,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href="' + data + '"><u>Details</u></a>';}
                                },
                                {
                                "targets": 7,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<img src="' + widgetRepository + "images/master/pdf.png" + '" height="20px" widgth="20px">';}
                                },
                                {
                                "targets": 8,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Pay">';}                                    
                                }                                
                            ],
                            "language": {
                                "emptyTable": "No invoices found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true
                            //paging: false,
                            //bSort: false,
                            //bFilter: false,
                            //bInfo: false,
                            //fixedColumns:   {
                            //    leftColumns: 0,1,2,3,4,5
                            //}                            
                        });                
                        
            
                        
                        
            } else if (tab == 'Subscriptions') {
                        table = $('#listing').DataTable({
                            "order": [[ 3, "desc" ]],
                            columns: [{title: "ID"},{title: "Product Name"},{title: "Amount"},{title: "Expires"},{title: "Status"}],
                            "columnDefs": [{
                                "targets": 4,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {
                                    var image;
                                    var alt = row[4];
                                    if (row[4] == 'Active') {
                                        image = widgetRepository + "images/master/green_check.png";
                                    } else if (row[4] == 'Suspended') {
                                        image = widgetRepository + "images/master/red_x.png";
                                    } else {
                                        image = widgetRepository + "images/master/warning.png";
                                    }
                                    return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                                }
                            }],
                            "language": {
                                "emptyTable": "No subscriptions found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true
                        });                
            } else if (tab == 'Quotes') {
                        table = $('#listing').DataTable({
                            "order": [[ 9, "desc" ]],
                            columns: [{title: ""},{title: "Lock"},{title: "Transaction"},{title: "Version"},{title: "Account"},{title: "Description"},{title: "Status"},{title: "TCV"},{title: "Prepared By"},{title: "Created"},{title: "Updated"},{title: "ACV"}],
                            "columnDefs": [{
                                "targets": [0,3,5],
                                "orderable": false
                            },                                
                            {
                                "targets": 0,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input type="checkbox" name="cpq_select" value="cpq_select">';}
                            },
                            {
                                "targets": 2,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href=""><u>' + row[2] + '</u></a>';}
                            }],
                            "language": {
                                "emptyTable": "No quotes found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                            
                        });  
            } else if (tab == 'Leads') {
                    table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.leadsDataset,
                            "columns": [
                                {"title": "Name"}, 
                                {"title": "Company"},
                                {"title": "Title"},
                                {"title": "Product Interest"},
                                {"title": "Status"},
                                {"title": "Email"},
                                {"title": "Phone"},
                                {"title": "Last Modified"},
                            ],
                            /*
                            "columnDefs": [
                                //{ "targets": 0, "render": function(d) {return moment(d).format("DD:MM:YYYY HH:mm:ss");}},
                                //{ "type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                                {"targets": [3,4,5],"orderable": false},  
                            ],*/
                            "language": {
                                "emptyTable": "No leads found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                            
                        });            
            } else {
                console.log('No table config found');
            }
            return table;                
        }

        var widget;
        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Customers','Opportunities','Install Base','Quotes'];
        var tabUsed = [];
        var tabJSON = [];

        return {

            tabClicked: ko.observable(''),
            tabNameTrim: ko.observable(''),

            onLoad: function(widgetModel) {
                widget = widgetModel;
                
                widget.tabNameTrim(widget.tabName().replace(' ',''));
                //if (widget.useImages()) {
                widget.tabImage = widgetRepository + "images/master/" + widget.tabNameTrim().toLowerCase() + ".png";
                //}
                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                $(document).ready(function() {
                    var tab = widget.tabName().replace(' ','');
                    var url = widget.jsonURL();
                    if (!tabUsed.includes(tab)) {
                        $('#tab-'+ tab).on('click', function() {
                            //if (!widget.useImages()) {
                            //    $("#tab-"+tab).attr('class', 'tablink-selected');
                            //    for (var b=0; b<tabTypes.length; b++) {
                            //        if (tabTypes[b]!=tab) {
                            //            $("#tab-"+tabTypes[b]).attr('class', 'tablink');
                            //        }
                            //    }
                            //} else {
                                $("#tab-"+tab).attr('class', 'imglink-selected');
                                for (var i=0; i<tabTypes.length; i++) {
                                    if (tabTypes[i]!=tab) {
                                        $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                    }
                                }
                            //}
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }      
                            var table = getConfig(tab);
                            table.ajax.url(url).load();
                        });
                        tabUsed.push(tab);
                    }
                });
            }
            
        };
    }
);