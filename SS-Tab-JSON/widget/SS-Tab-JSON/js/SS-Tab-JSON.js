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

        var ss_images;
        var ss_data;

        return {

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
                var tabTitle = widget.tabTitle();
                var tabImage = widget.tabImage();

                widget.tabName(tab);
                widget.tabImage = ss_images + "/tabs/" + tabImage;

                $.ajax({
                    url: ss_data + widget.jsonURL(),
                    dataType: 'json',
                    success: function(result) {
                        widget.tabData(result);
                        for (var i = 0; i < result.items.length; i++) {
                            if (result.items[i].Alert == 'true') { //Any alert column set to true
                                $('#alert-' + widget.id()).attr('src', ss_images + 'tables/alert.png');
                                $('#alertimage').attr('src', ss_images + 'resources/alert_one.png');
                                $('#alertimage').attr('alt', 'Attention needed');
                            }
                        }
                        widget.tabTotal(result.items.length);
                        widget.tabDisplay(tabTitle + ' (' + result.items.length + ')');
                    },
                    error: function(jqXHR, textStatus, error) {
                        widget.tabTotal(0);
                        widget.tabDisplay(tabTitle + ' (0)');
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + tab + "-" + textStatus + "-" + error);
                    }
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + tab);
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabName();
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
        };

        //-------------------------------------------------------------------
        // HELPER FUNCTIONS
        //-------------------------------------------------------------------
        function buildTable(tab,widget) {
            var table;
            if (tab == 'CUSTOM1') {
                CCLogger.warn('No table config found - ' + tab); //Warning to customize
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    columns: [],
                    columnDefs: [],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else if (tab == 'CUSTOM2') {
                CCLogger.warn('No table config found - ' + tab); //Warning to customize
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    columns: [],
                    columnDefs: [],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else if (tab == 'CUSTOM3') {
                CCLogger.warn('No table config found - ' + tab); //Warning to customize
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    columns: [],
                    columnDefs: [],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else if (tab == 'Repeat') {
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 7, "desc" ]],
                    columns: [
                        {data: "id"},
                        {data: "image"},
                        {data: "displayName"},
                        {data: "orderId"},
                        {data: "customer"},
                        {data: "type"},
                        {data: "quantity"},
                        {data: "dateOrdered"},
                        {data: "dateReturned"}
                    ],
                    columnDefs: [
                        {title: "Part Number#", targets: 0, orderable: false},
                        {title: "", targets: 1, orderable: false,
                            render: function(data, type, row, meta) {
                                return '<img width="60px" height="60px" src="/ccstore/v1/images/?source=/file/products/' + data + '">';
                            }
                        },
                        {title: "Name", targets: 2, orderable: false},
                        {title: "Web Order #", targets: 3, orderable: false},
                        {title: "Customer", targets: 4, orderable: false},
                        {title: "Type", targets: 5, orderable: false},
                        {title: "Quantity", targets: 6, orderable: false},
                        {title: "Date Ordered", targets: 7, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "Date Returned", targets: 8, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "", targets: 9, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Check Shipping">';}}
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (tab == 'IoT') {
                table = $('#listing').DataTable( {
                    data: widget.tabData().items,
                    order: [[ 3, "desc" ]],
                    columns: [
                        {data: "Status"},
                        {data: "Image"},
                        {data: "Name"},
                        {data: "PurchaseDate"},
                        {data: "LastServiced"},
                        {data: "UsageMonthAvg"},
                        {data: "UsageTotal"},
                        {data: "Temperature"},
                        {data: "CushionPressure"}
                    ],
                    columnDefs: [
                        {title: "Status", targets: 0, orderable: false, render: function(data, type, row, meta) {
                                return '<img src="' + ss_images + '/tables/' + data + '.png" height="20px" widgth="20px">';
                            }
                        },
                        {title: " ", targets: 1, orderable: false,
                            render: function(data, type, row, meta) {
                                return '<img width="60px" height="60px" src="/ccstore/v1/images/?source=/file/products/' + data + '">';
                            }
                        },
                        {title: "Name", targets: 2, orderable: false},
                        {title: "Purchased", targets: 3, orderable: true},
                        {title: "Serviced", targets: 4, orderable: true},
                        {title: "Monthly (Hours)", targets: 5, orderable: false},
                        {title: "Total (Hours)", targets: 6, orderable: false},
                        {title: "Temperature", targets: 7, orderable: false},
                        {title: "Cushion Pressure", targets: 8, orderable: false},
                        {title: " ", targets: 9, orderable: false, render: function(data, type, row, meta) {return '<a href="https://goo.gl/maps/WbtxQfnhNSTcLJPR8" target="_blank"><img src="' + ss_images + "/tables/geolocation.png" + '" height="30px" widgth="30px"></a>';}},
                        {title: " ", targets: 10, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Schedule">';}
                        }
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (tab == 'Orders') {
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 1, "desc" ]],
                    columns: [
                        {data: "WebOrder"},
                        {data: "Invoice"},
                        {data: "Customer"},
                        {data: "Master"},
                        {data: "PO"},
                        {data: "Date"},
                        {data: "Items"},
                        {data: "POTotal"},
                        {data: "Status"}
                    ],
                    columnDefs: [
                        {title: "Web Order #", targets: 0, orderable: false},
                        {title: "Invoice #", targets: 1, orderable: false},
                        {title: "Customer", targets: 2, orderable: false},
                        {title: "Master", targets: 3, orderable: false},
                        {title: "PO", targets: 4, orderable: false},
                        {title: "Order Date", targets: 5, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "Items", targets: 6, orderable: false},
                        {title: "PO Total", targets: 7, orderable: false},
                        {title: "Status", targets: 8, orderable: false},
                        {title: "", targets: 10, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}},
                        {title: "", targets: 11, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}},
                        {title: "Invoice", targets: 9, orderable: false, render: function(data, type, row, meta) {return '<img src="' + ss_images + "/tables/pdf.png" + '" height="20px" widgth="20px">';}
                        },
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (tab == 'Invoices') {
                table = $('#listing').DataTable({
                    //data: widget.invoicesTable.data,
                    data: widget.tabData().items,
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
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true
                    //scrollX: true
                    //scrollCollapse: true
                });
            } else if (tab == 'Subscriptions') {
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 2, "desc" ]],
                    columns: [
                        {data: "Alert"},
                        {data: "WebOrder"},
                        {data: "Invoice"},
                        {data: "Date"},
                        {data: "Items"},
                        {data: "POTotal"},
                        {data: "DeliveryDate"},
                        {data: "Status"}
                    ],
                    columnDefs: [
                        {title: "", targets: 0, orderable: false,
                            render: function(data, type, row, meta) {
                                if (data == 'true') {
                                    return '<img alt="Critical" src="' + ss_images + '/tables/alert.png">';
                                } else {
                                    return '';
                                }
                            }
                        },
                        {title: "Web Order #", targets: 1, orderable: false},
                        {title: "Invoice #", targets: 2, orderable: false},
                        {title: "Order Date", targets: 3, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "Items", targets: 4, orderable: false},
                        {title: "PO Total", targets: 5, orderable: false},
                        {title: "Estimated Delivery", targets: 6, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "Status", targets: 7, orderable: false},
                        {title: "", targets: 8, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}
                        },
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (tab == 'Quotes') {
                table = $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 7, "desc" ]],
                    columns: [
                        {data: "transactionID_t"},
                        //{data: "version_number_versionTransaction_t"},
                        {data: "transactionName_t"},
                        {data: "status_t.displayValue"},
                        {data: "totalContractValue_t.value"},
                        {data: "owner_t"},
                        {data: "_customer_t_company_name"},
                        {data: "createdDate_t"},
                        {data: "lastUpdatedDate_t"},
                        {data: "status_t.displayValue"}
                    ],
                    columnDefs: [
                        {title: "Transaction", targets: 0, orderable: false, render: function(data, type, row, meta) {return '<a href=""><u>' + data + '</u></a>'}},
                        // {title: "Version", targets: 1, orderable: false},
                        {title: "Description", targets: 1, orderable: false},
                        {title: "Status", targets: 2, orderable: false},
                        {title: "Amount", targets: 3, orderable: false},
                        {title: "Prepared By", targets: 4, orderable: false},
                        {title: "Account", targets: 5, orderable: false},
                        {title: "Created", targets: 6, orderable: true},
                        {title: "Updated", targets: 7, orderable: true},
                        {title: "", targets: 8, orderable: false, render: function(data, type, row, meta) {
                                var buttons;
                                if (data == 'Created') {
                                    buttons = '<input class="cc-button-primary" type="button" value="Cancel">';
                                } else if (data == 'Quoted') {
                                    buttons = '<input class="cc-button-primary" type="button" value="Accept">&nbsp;<input class="cc-button-primary" type="button" value="Reject">';
                                }
                                return buttons;
                            }}
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (tab == 'Service') {
                table = $('#listing').DataTable( {
                    data: widget.tabData().items,
                    order: [[ 6, "desc" ]],
                    columns: [
                        {data: "Alert"},
                        {data: "SeverityCdMeaning"},
                        {data: "SeverityRank"},
                        {data: "SrNumber"},
                        {data: "Title"},
                        {data: "ChannelTypeCdMeaning"},
                        {data: "LastUpdateDate"},
                        {data: "AccountPartyName"},
                        {data: "StatusCdMeaning"}
                    ],
                    columnDefs: [
                        {title: " ", targets: 0, orderable: false, render: function(data, type, row, meta) {
                                var image = '';
                                if (data === true) {
                                    image = '<img alt="Critical" src="' + ss_images + '/tables/alert.png">';
                                }
                                return image;
                            }
                        },
                        {title: "Severity", targets: 1, orderable: false},
                        {title: "Rank", targets: 2, orderable: false},
                        {title: "Number", targets: 3, orderable: false},
                        {title: "Title", targets: 4, orderable: false},
                        {title: "Channel", targets: 5, orderable: false, render: function(data, type, row, meta) {return  '<img alt="'+data+'" src="' + ss_images + '/tables/' + data.toLowerCase() + '.png">&nbsp;' + data;}},
                        {title: "Last Updated", targets: 6, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}, type: "date"},
                        {title: "Account", targets: 7, orderable: false},
                        {title: "Status", targets: 8, orderable: false},
                        {title: "", targets: 9, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Chat">';}
                        }
                    ],
                    language: {
                        emptyTable: 'No ' + tab + ' found'
                    },
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else {
                CCLogger.warn('No table config found - ' + tab);
            }
            return table;
        }

        function formatDate(value) {
            if (value === null) return "";
            if (value === "") return "";
            var mydate = new Date(value);
            var yyyy = mydate.getFullYear().toString();
            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = mydate.getDate().toString();
            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
            var mydatestr = new Date(parts);
            return mydatestr.toLocaleDateString();
        }
    });