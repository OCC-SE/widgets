/**
 * @fileoverview Navigation tab to display external JSON in DataTables
 *
 * @author Chris Janning >
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

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                if (!widget.tabName()) {
                    CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }

                widget.tabImage = ss_images + "tabs/" + widget.tabImage();

                if (widget.dataDisplayType() == 'Table') {
                    $.ajax({
                        url: ss_data + widget.jsonURL(),
                        dataType: 'json',
                        success: function(result) {
                            widget.tabData(result);
                            widget.tabTotal(result.items.length);
                            widget.tabDisplay(widget.tabTitle() + ' (' + result.items.length + ')');
                            if (widget.defaultTab()) {
                                $('[id^=tab-]').attr('class', 'imglink'); //in case another tab is set to default
                                $('#tab-' + widget.tabName() + '-' + widget.id()).attr('class', 'imglink-selected');
                                if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                                    $('#listing').DataTable().clear().destroy();
                                    $('#listing').empty();
                                }
                                if (widget.dataDisplayType() == 'Table') {
                                    $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                                    buildTable(widget);
                                } else if (widget.dataDisplayType() == 'iFrame') {
                                    var url = widget.iFrameURL();
                                    $('#SS-DataTables').html('<iframe id="iframe" src="'+url+'" style="width:100%;height:1000px;border:0px;margin-bottom:15px;"></iframe>');
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, error) {
                            widget.tabTotal(0);
                            widget.tabDisplay(widget.tabTitle() + ' (0)');
                            CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName() + "-" + textStatus + "-" + error);
                        }
                    });
                } else if (widget.dataDisplayType() == 'iFrame') {
                    widget.tabDisplay(widget.tabTitle());
                }

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName());
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabName();
                $('#tab-' + tab + '-' + widget.id()).on('click', function() {
                    $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                    $('#tab-' + tab + '-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS

                    if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                        $('#listing').DataTable().clear().destroy();
                        $('#listing').empty();
                    }

                    if (widget.dataDisplayType() == 'Table') {
                        $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                        buildTable(widget);
                    } else if (widget.dataDisplayType() == 'Map') {
                        //TODO
                    } else if (widget.dataDisplayType() == 'iFrame') {
                        var url = widget.iFrameURL();
                        $('#SS-DataTables').html('<iframe id="iframe" src="'+url+'" style="width:100%;height:1000px;border:0px;margin-bottom:15px;"></iframe>');
                    }
                });
            }
        };

        function formatDate(value) {
            if (value === null) return "";
            var mydate = new Date(value);
            var yyyy = mydate.getFullYear().toString();
            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = mydate.getDate().toString();
            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
            var mydatestr = new Date(parts);
            return mydatestr.toLocaleDateString();
        }

        function buildTable(widget) {
            if (widget.tabName() == 'CUSTOM1') {
                table = $('#listing').DataTable({
                    data: widget.tabData().items, //Do not touch
                    order: [[ 0, "desc" ]], //Default column to sort
                    columns: [ //One row for each key found in the JSON
                        {data: "key1"}, //Key
                        {data: "key2"}, //Key
                        {data: "key3"} //Key
                    ],
                    columnDefs: [ //Column heading and data type of each key/value pair. "title" is the column header
                        {title: "title1", targets: 0, orderable: false}, //Basic text display
                        {title: "title2", targets: 1, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )}, //Currency format
                        {title: "title3", targets: 2, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}}, //Date format
                        {title: "", targets: 3, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Button example">';}} //Custom HTML (buttons)
                        //{title: "", targets: 1, orderable: false, render: function(data, type, row, meta) {return '<img width="60px" height="60px" src="/ccstore/v1/images/?source=/file/products/' + data + '">';}}, //Display an image
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'}, //Do not touch
                    lengthChange: false, //Do not touch
                    pageLength: 5, //Number of results per page
                    destroy: true, //Do not touch
                });
                //CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName() + "- Table configuration needed"); //Remove after configuration is added
            } else if (widget.tabName() == 'CUSTOM2') {
                //TODO: Copy starter structure from CUSTOM1
                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName() + "- Table configuration needed"); //Remove after configuration is added
            } else if (widget.tabName() == 'CUSTOM3') {
                //TODO: Copy starter structure from CUSTOM1
                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName() + "- Table configuration needed"); //Remove after configuration is added
            } else if (widget.tabName() == 'Repeat') {
                $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 6, "desc" ]],
                    columns: [
                        {data: "id"},
                        {data: "image"},
                        {data: "displayName"},
                        {data: "brand"},
                        {data: "quantity"},
                        {data: "total"},
                        {data: "lastOrdered"}
                    ],
                    columnDefs: [
                        {title: "Product ID", targets: 0, orderable: false},
                        {title: "", targets: 1, orderable: false,
                            render: function(data, type, row, meta) {
                                return '<img width="60px" height="60px" src="/ccstore/v1/images/?source=/file/products/' + data + '">';
                            }
                        },
                        {title: "Name", targets: 2, orderable: false},
                        {title: "Brand", targets: 3, orderable: false},
                        {title: "Quantity", targets: 4, orderable: false},
                        {title: "Price", targets: 5, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                        {title: "Last Ordered", targets: 6, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "New Quantity", targets: 7, orderable: false, render: function(data, type, row, meta) {return '<input type="text" size="5">';}},
                        {title: "", targets: 8, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Add to Cart">&nbsp;<input class="cc-button-primary" type="button" value="Schedule">';}}
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (widget.tabName() == 'IoT') {
                $('#listing').DataTable( {
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
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (widget.tabName() == 'Orders') {
                $('#listing').DataTable({
                    data: widget.tabData().items,
                    order: [[ 5, "desc" ]],
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
                        {title: "Date", targets: 5, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "Items", targets: 6, orderable: false},
                        {title: "POTotal", targets: 7, orderable: false},
                        {title: "Status", targets: 8, orderable: false},
                        {title: "", targets: 9, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">&nbsp;<input class="cc-button-primary" type="button" value="Reorder">';}}
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else if (widget.tabName() == 'Invoices') {
                $('#listing').DataTable({
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
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true
                    //scrollX: true
                    //scrollCollapse: true
                });
            } else if (widget.tabName() == 'Subscriptions') {
                $('#listing').DataTable( {
                    data: widget.tabData().items,
                    order: [[ 4, "desc" ]],
                    columns: [
                        {data: "SubscriptionNumber"},
                        {data: "PrimaryPartyName"},
                        {data: "TotalContractValue"},
                        {data: "StartDate"},
                        {data: "EndDate"},
                        {data: "Status"},
                        {data: "Duration"},
                        {data: "Period"},
                        {data: "Status"}
                    ],
                    columnDefs: [
                        {title: "Number", targets: 0, orderable: false},
                        {title: "Customer", targets: 1, orderable: false},
                        {title: "Total Contract Value", targets: 2, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                        {title: "Start Date", targets: 3, orderable: true},
                        {title: "End Date", targets: 4, orderable: true},
                        {title: "Status", targets: 5, orderable: false,
                            render: function(data, type, row, meta) {
                                var image;
                                if (data == 'ORA_ACTIVE') {
                                    image = ss_images + "/tables/green_check.png";
                                } else if (data == 'ORA_CLOSED') {
                                    image = ss_images + "/tables/red_x.png";
                                } else {
                                    image = ss_images + "/tables/warning.png";
                                }
                                return '<img alt="' + data + '" src="' + image + '" height="20px" widgth="20px"> ' + data;
                            }
                        },
                        {title: "Term", targets: 6, orderable: false},
                        {title: "Period", targets: 7, orderable: false},
                        {title: "", targets: 8, orderable: false,
                            render: function(data, type, row, meta) {
                                var buttons;
                                if (data == 'ORA_ACTIVE') {
                                    buttons = '<input class="cc-button-primary" type="button" value="Cancel">'
                                } else if (data == 'ORA_CLOSED') {
                                    buttons = '<input class="cc-button-primary" type="button" value="Renew">&nbsp;<input class="cc-button-primary" type="button" value="Cancel">';
                                } else {
                                    buttons = '<input class="cc-button-primary" type="button" value="Renew">&nbsp;<input class="cc-button-primary" type="button" value="Cancel">';
                                }
                                return buttons;
                            }
                        }
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else if (widget.tabName() == 'Quotes') {
                $('#listing').DataTable({
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
            } else if (widget.tabName() == 'Service') {
                $('#listing').DataTable( {
                    data: widget.tabData().items,
                    order: [[ 6, "desc" ]],
                    columns: [
                        {data: "CriticalFlag"},
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
                        emptyTable: 'No ' + widget.tabName() + ' found'
                    },
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                    //scrollX: true,
                    //scrollCollapse: true
                });
            } else {
                CCLogger.warn('No table config found - ' + widget.tabName());
            }
        }
    }
);
