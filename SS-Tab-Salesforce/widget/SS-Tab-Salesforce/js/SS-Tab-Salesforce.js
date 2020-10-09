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

        function buildTable(widget) {
            var table;
            if (widget.tabName() == 'Leads') {
                $('#listing').DataTable({
                    data: widget.tabData().records,
                    order: [[ 0, "desc" ]],
                    columns: [
                        {data: "Name"},
                        {data: "Company"},
                        {data: "Email"},
                        {data: "ProductInterest__c"},
                        {data: "Status"},
                        {data: "LastModifiedDate"},
                        {data: "attributes.url"}
                    ],
                    columnDefs: [
                        {title: "Name", targets: 0, orderable: false},
                        {title: "Company", targets: 1, orderable: false},
                        {title: "Email", targets: 2, orderable: false},
                        {title: "Product Interest", targets: 3, orderable: false},
                        {title: "Status", targets: 4, orderable: false},
                        {title: "Last Modified", targets: 5, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "", targets: 6, orderable: false, render: function(data, type, row, meta) {
                                var link = ss_salesforce + data;
                                var click = "window.open('" + link + "', '_blank'); return false;";
                                return '<input onclick="' + click + '" class="cc-button-primary" type="button" value="Details">';
                            }
                        }
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else if (widget.tabName() == 'Contacts') {
                $('#listing').DataTable({
                    data: widget.tabData().records,
                    order: [[ 0, "desc" ]],
                    columns: [
                        {data: "Name"},
                        {data: "Account.Name"},
                        {data: "Email"},
                        {data: "attributes.url"}
                    ],
                    columnDefs: [
                        {title: "Name", targets: 0, orderable: false},
                        {title: "Account", targets: 1, orderable: false},
                        {title: "Email", targets: 2, orderable: false},
                        {title: "", targets: 3, orderable: false, render: function(data, type, row, meta) {
                                var link = ss_salesforce + data;
                                var click = "window.open('" + link + "', '_blank'); return false;";
                                return '<input onclick="' + click + '" class="cc-button-primary" type="button" value="Details">';
                            }
                        }
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            } else {
                $('#listing').DataTable({
                    data: widget.tabData().records,
                    order: [[ 0, "desc" ]],
                    columns: [
                        {data: "Name"},
                        //    {data: "Account.Name"},//Getting an error when I attempt to access this value
                        {data: "StageName"},
                        {data: "Amount"},
                        {data: "CloseDate"},
                        {data: "attributes.url"}
                    ],
                    columnDefs: [
                        {title: "Name", targets: 0, orderable: false, render: function(data, type, row, meta) {
                                if (data.length > 35) {
                                    return data.substring(0,30) + '...';
                                } else {
                                    return data;
                                }
                            }
                        },
                        //    {title: "Account", targets: 1, orderable: false},
                        {title: "Stage", targets: 1, orderable: false},
                        {title: "Amount", targets: 2, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                        {title: "Close Date", targets: 2, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "", targets: 4, orderable: false, render: function(data, type, row, meta) {
                                var link = ss_salesforce + data;
                                var click = "window.open('" + link + "', '_blank'); return false;";
                                return '<input onclick="' + click + '" class="cc-button-primary" type="button" value="Details">';
                            }
                        }
                    ],
                    language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            }
        }

        var ss_images;
        var ss_salesforce;

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
                ss_images = ss_settings.resourceImages;
                ss_salesforce = ss_settings.salesforceURL;

                if (!widget.tabName()) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }

                var tab = widget.tabName();

                widget.tabImage = ss_images + "tabs/" + tab.toLowerCase() + ".png";

                var assetType;
                if (tab == 'Leads') {
                    assetType = "leads";
                } else if (tab == 'Contacts') {
                    assetType = "contacts";
                } else {
                    assetType = "opps";
                }

                $.ajax({
                    type: "POST",
                    async: true,
                    url: '/ccstorex/custom/v1/' + assetType,
                    dataType: 'json',
                    data: {
                        sfUsername: ss_settings.salesforceUser,
                        sfPassword: ss_settings.salesforcePswd
                    },
                    success: function(result) {
                        widget.tabData(result);
                        widget.tabTotal(result.totalSize);
                        widget.tabDisplay(tab + ' (' + result.totalSize + ')');
                        if (widget.defaultTab()) {
                            $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                            $('#tab-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                            if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }
                            $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                            buildTable(widget);
                        }
                    },
                    error: function(jqXHR, textStatus, error) {
                        widget.tabTotal(0);
                        widget.tabDisplay(widget.tabTitle() + ' (0)');
                        CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabName() + "-" + textStatus + "-" + error);
                    }
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + tab);
            },

            beforeAppear: function(page) {
                var widget = this;
                $('#tab-' + widget.id()).on('click', function() {
                    $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                    $('#tab-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                    if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                        $('#listing').DataTable().clear().destroy();
                        $('#listing').empty();
                    }
                    $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                    buildTable(widget);
                });
            }
        };

        function formatDate(value) {
            if (value === null) return "";

            function addZero(i) {if (i < 10) {i = "0" + i;}return i;}

            var mydate = new Date(value);
            var yyyy = mydate.getFullYear().toString();
            var mm = addZero((mydate.getMonth() + 1).toString()); // getMonth() is zero-based
            var dd = addZero(mydate.getDate().toString());
            var h = mydate.getHours();
            var ap = "AM";
            if (h > 12) {
                h -= 12;
                ap = "PM";
            } else if (h === 0) {
                h = 12;
            }
            var m = mydate.getMinutes();
            var parts;
            if (m <= 0) {
                parts = mm + '/' + dd + '/' + yyyy;
            } else {
                parts = mm + '/' + dd + '/' + yyyy + ' ' + addZero(h) + ':' + addZero(m) + ' ' + ap;
            }
            var mydatestr = new Date(parts);
            return parts;
        }
    }
);