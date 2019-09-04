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

        return {

            widgetId: ko.observable(''),
            widgetName: ko.observable(''),
            buttonClicked: ko.observable(''),

            onLoad: function(widgetModel) {
                widget = widgetModel;
                widget.widgetName(widget.displayName());
                widget.widgetId(widget.id());

                console.log("-- Loading" + widget.widgetName() + "(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                $(document).ready(function() {

                    $('#orders').on('click', function() {

                        widget.buttonClicked('orders');
                        $("#freqPurchase").attr('class', 'tablink');
                        $("#orders").attr('class', 'tablink-selected');
                        $("#invoices").attr('class', 'tablink');
                        $("#subscriptions").attr('class', 'tablink');
                        $("#purchaseLists").attr('class', 'tablink');
                        $("#equipment").attr('class', 'tablink');

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = $('#listing').DataTable({
                            "order": [
                                [0, "asc"]
                            ],
                            columns: [ //Columns need to be based on listing type
                                {
                                    title: "Date"
                                },
                                {
                                    title: "Order #"
                                },
                                {
                                    title: "PO #"
                                },
                                {
                                    title: "Name"
                                },
                                {
                                    title: "Total"
                                },
                                {
                                    title: "Status"
                                },
                                {
                                    title: "blank"
                                }
                            ],
                            "columnDefs": [{
                                "targets": 6,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {
                                    return '<a href="' + data + '">Details</a>' + ' | ' + '<a href="' + data + '">Reorder</a>';
                                }
                            }],
                            destroy: true
                        });
                        //table.ajax.url("https://raw.githubusercontent.com/occ-janning/widgets/master/orders.txt").load();
                        var jsonUrl = widget.ordersJsonUrl();
                        table.ajax.url(jsonUrl).load();
                    });

                    $('#invoices').on('click', function() {

                        widget.buttonClicked('invoices');
                        $("#freqPurchase").attr('class', 'tablink');
                        $("#orders").attr('class', 'tablink');
                        $("#invoices").attr('class', 'tablink-selected');
                        $("#subscriptions").attr('class', 'tablink');
                        $("#purchaseLists").attr('class', 'tablink');
                        $("#equipment").attr('class', 'tablink');

                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }

                        var table = $('#listing').DataTable({
                            "order": [
                                [0, "asc"]
                            ],
                            columns: [ //Columns need to be based on table type
                                {
                                    title: "Date"
                                },
                                {
                                    title: "Document #"
                                },
                                {
                                    title: "Order #"
                                },
                                {
                                    title: "Total"
                                },
                                {
                                    title: "PO #"
                                },
                                {
                                    title: "Due Date"
                                },
                                {
                                    title: "Status"
                                },
                                {
                                    title: "PDF"
                                },
                                {
                                    title: ""
                                }
                            ],
                            "columnDefs": [{
                                    "targets": 6,
                                    "data": "download_link",
                                    "render": function(data, type, row, meta) {
                                        return '<a href="' + data + '">Details</a>' + ' | ' + '<a href="' + data + '">Reorder</a>';
                                    }
                                },
                                {
                                    "targets": 7,
                                    "data": "download_link",
                                    "render": function(data, type, row, meta) {
                                        return '<img src="https://image.flaticon.com/icons/svg/337/337946.svg" height="20px" widgth="20px">';
                                    }
                                }
                            ],
                            destroy: true
                        });
                        var jsonUrl = widget.invoicesJsonUrl();
                        //table.ajax.url("https://raw.githubusercontent.com/occ-janning/widgets/master/invoices.txt").load();
                        table.ajax.url(jsonUrl).load();
                    });
                });
                console.log("-- Ending " + widget.widgetName() + "(" + widget.id() + ")");
            }
        };
    }
);