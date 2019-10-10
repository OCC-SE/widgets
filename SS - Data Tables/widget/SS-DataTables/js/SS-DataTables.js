/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://code.jquery.com/jquery-3.3.1.js', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, jq, dataTables) {

        "use strict";
        
        var widget;

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
                                "render": function(data, type, row, meta) {return '<input type="button" value="Reorder">';}
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
                                "render": function(data, type, row, meta) {return '<input type="button" value="Schedule">';}
                                }                                      
                            ],
                            destroy: true
                        });
            } else if (tab == 'Install Base') {
                    table = $('#listing').DataTable({
                            "order": [[ 0, "desc" ]],
                            columns: [{title: "ID"},{title: "Product Name"},{title: "Purchase Date"},{title: "Last Serviced"},{title: "Average Usage (monthly)"},{title: "Recommended Usage (monthly)"},{title: "Status"},{title: "Toner Life"},{title: ""}],
                            "columnDefs": [{
                                "targets": 8,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input type="button" value="Schedule Service">';}
                                }
                            ],                            
                            destroy: true
                        });                
            } else if (tab == 'Orders') {
                        table = $('#listing').DataTable({
                            "order": [[ 0, "desc" ]],
                            columns: [{title: "Date"},{title: "Order #"},{title: "PO #"},{title: "Name"},{title: "Total"},{title: "Status"},{title: ""}],
                            "columnDefs": [{
                                "targets": 6,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input type="button" value="Reorder">';}
                                }
                            ],
                            destroy: true
                        });                
            } else if (tab == 'Invoices') {
                        table = $('#listing').DataTable({
                            "order": [[ 0, "desc" ]],
                            columns: [ {title: "Date"},{title: "Invoice #"},{title: "Order #"},{title: "Total"},{title: "PO #"},{title: "Due Date"},{title: "Status"},{title: "PDF"},{title: ""}],
                            "columnDefs": [{
                                "targets": 6,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href="' + data + '"><u>Details</u></a>';}
                                },
                                {
                                "targets": 7,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<img src="' + widget.assetMappings["/images/pdf.png"]() + '" height="20px" widgth="20px">';}
                                },
                                {
                                "targets": 8,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<input type="button" value="Pay">';}                                    
                                }                                
                            ],
                            destroy: true
                        });                
            } else if (tab == 'Subscriptions') {
                        table = $('#listing').DataTable({
                            "order": [[ 3, "desc" ]],
                            columns: [{title: "ID"},{title: "Product Name"},{title: "Amount"},{title: "Expires"},{title: "Status"}],
                            "columnDefs": [{
                                "targets": 4,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {
                                    var image;
                                    var alt = row[4];
                                    if (row[4] == 'Active') {
                                        image = widget.assetMappings["/images/green_check.png"]();
                                    } else if (row[4] == 'Suspended') {
                                        image = widget.assetMappings["/images/red_x.png"]();
                                    } else {
                                        image = widget.assetMappings["/images/warning.png"]();
                                    }
                                    return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                                }
                            }],
                            destroy: true
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
                            destroy: true
                        });                
            } else {
                console.log('No table config found');
            }
            return table;                
        }

        return {

            widgetId: ko.observable(''),
            widgetName: ko.observable(''),
            buttonClicked: ko.observable(''),
            tabOneImage: ko.observable(''),
            numTables: ko.observable(''),

            onLoad: function(widgetModel) {
                widget = widgetModel;
                widget.widgetName(widget.displayName());
                widget.widgetId(widget.id());
                
                if (widget.useImages()) {
                    var numT = parseInt(widget.numberTables());
                    for (var i = 0; i <= numT; i++) {
                        if (i == 0) {
                            widget.tabOneImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabOne().toLowerCase() + ".png";
                        } else if (i == 1) {
                            widget.tabTwoImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabTwo().toLowerCase() + ".png";
                        } else if (i == 2) {
                            widget.tabThreeImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabThree().toLowerCase() + ".png";
                        } else if (i == 3) {
                            widget.tabFourImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabFour().toLowerCase() + ".png";
                        } else if (i == 4) {
                            widget.tabFiveImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabFive().toLowerCase() + ".png";
                        } else if (i == 5) {
                            widget.tabSixImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + widget.tabSix().toLowerCase() + ".png";
                        }
                    }
                    widget.numTables = numT;
                }
                
                console.log("-- Loading " + widget.widgetName() + "(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                $(document).ready(function() {

                    $('#tabOne').on('click', function() {
                        widget.buttonClicked('tabOne');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink-selected');
                            $("#tabTwo").attr('class', 'tablink');
                            $("#tabThree").attr('class', 'tablink');
                            $("#tabFour").attr('class', 'tablink');
                            $("#tabFive").attr('class', 'tablink');
                            $("#tabSix").attr('class', 'tablink');
                        } else {
                            $("#tabOne").attr('class', 'imglink-selected');
                            $("#tabTwo").attr('class', 'imglink');
                            $("#tabThree").attr('class', 'imglink');
                            $("#tabFour").attr('class', 'imglink');
                            $("#tabFive").attr('class', 'imglink');
                            $("#tabSix").attr('class', 'imglink');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = getConfig(widget.tabOne());
                        table.ajax.url(widget.tabOneURL()).load();
                    });

                    $('#tabTwo').on('click', function() {
                        widget.buttonClicked('tabTwo');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink');
                            $("#tabTwo").attr('class', 'tablink-selected');
                            $("#tabThree").attr('class', 'tablink');
                            $("#tabFour").attr('class', 'tablink');
                            $("#tabFive").attr('class', 'tablink');
                            $("#tabSix").attr('class', 'tablink');
                        } else {
                            $("#tabOne").attr('class', 'imglink');
                            $("#tabTwo").attr('class', 'imglink-selected');
                            $("#tabThree").attr('class', 'imglink');
                            $("#tabFour").attr('class', 'imglink');
                            $("#tabFive").attr('class', 'imglink');
                            $("#tabSix").attr('class', 'imglink');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }
                        var table = getConfig(widget.tabTwo());
                        table.ajax.url(widget.tabTwoURL()).load();
                    });

                    $('#tabThree').on('click', function() {
                        widget.buttonClicked('tabThree');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink');
                            $("#tabTwo").attr('class', 'tablink');
                            $("#tabThree").attr('class', 'tablink-selected');
                            $("#tabFour").attr('class', 'tablink');
                            $("#tabFive").attr('class', 'tablink');
                            $("#tabSix").attr('class', 'tablink');
                        } else {
                            $("#tabOne").attr('class', 'imglink');
                            $("#tabTwo").attr('class', 'imglink');
                            $("#tabThree").attr('class', 'imglink-selected');
                            $("#tabFour").attr('class', 'imglink');
                            $("#tabFive").attr('class', 'imglink');
                            $("#tabSix").attr('class', 'imglink');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = getConfig(widget.tabThree());
                        table.ajax.url(widget.tabThreeURL()).load();
                    });

                    $('#tabFour').on('click', function() {
                        widget.buttonClicked('tabFour');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink');
                            $("#tabTwo").attr('class', 'tablink');
                            $("#tabThree").attr('class', 'tablink');
                            $("#tabFour").attr('class', 'tablink-selected');
                            $("#tabFive").attr('class', 'tablink');
                            $("#tabSix").attr('class', 'tablink');
                        } else {
                            $("#tabOne").attr('class', 'imglink');
                            $("#tabTwo").attr('class', 'imglink');
                            $("#tabThree").attr('class', 'imglink');
                            $("#tabFour").attr('class', 'imglink-selected');
                            $("#tabFive").attr('class', 'imglink');
                            $("#tabSix").attr('class', 'imglink');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = getConfig(widget.tabFour());
                        table.ajax.url(widget.tabFourURL()).load();
                    });
                    
                    $('#tabFive').on('click', function() {
                        widget.buttonClicked('tabFive');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink');
                            $("#tabTwo").attr('class', 'tablink');
                            $("#tabThree").attr('class', 'tablink');
                            $("#tabFour").attr('class', 'tablink');
                            $("#tabFive").attr('class', 'tablink-selected');
                            $("#tabSix").attr('class', 'tablink');
                        } else {
                            $("#tabOne").attr('class', 'imglink');
                            $("#tabTwo").attr('class', 'imglink');
                            $("#tabThree").attr('class', 'imglink');
                            $("#tabFour").attr('class', 'imglink');
                            $("#tabFive").attr('class', 'imglink-selected');
                            $("#tabSix").attr('class', 'imglink');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = getConfig(widget.tabFive());
                        table.ajax.url(widget.tabFiveURL()).load();
                    });     
                    
                     $('#tabSix').on('click', function() {
                        widget.buttonClicked('tabSix');
                        if (!widget.useImages()) {
                            $("#tabOne").attr('class', 'tablink');
                            $("#tabTwo").attr('class', 'tablink');
                            $("#tabThree").attr('class', 'tablink');
                            $("#tabFour").attr('class', 'tablink');
                            $("#tabFive").attr('class', 'tablink');
                            $("#tabSix").attr('class', 'tablink-selected');
                        } else {
                            $("#tabOne").attr('class', 'imglink');
                            $("#tabTwo").attr('class', 'imglink');
                            $("#tabThree").attr('class', 'imglink');
                            $("#tabFour").attr('class', 'imglink');
                            $("#tabFive").attr('class', 'imglink');
                            $("#tabSix").attr('class', 'imglink-selected');
                        }

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = getConfig(widget.tabSix());
                        table.ajax.url(widget.tabSixURL()).load();
                    });
                });
                
                console.log("-- Ending " + widget.widgetName() + "(" + widget.id() + ")");
            }
        };
    }
);