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

        return {

            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),
            tabName: ko.observable(''),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;
                var ss_images = ss_settings.resourceImages;

                if (!widget.tabTitle()) {
                    CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }

                widget.tabImage = ss_images + "tabs/" + widget.tabImage().toLowerCase();
                widget.tabName(widget.tabTitle());

                var qUrl = widget.cpqURL();
                var qQuery = widget.cpqQuery();
                var qParams = widget.cpqParams();
                var url = qUrl + qQuery + qParams;
                //var qOwner = '?q={"owner_t": "Natalie Thompson"}'; //needs to be set
                //var qFields = '&fields=status_t,owner_t,_id,transactionID_t,_customer_t_company_name,totalAnnualValue_t,totalContractValue_t,transactionName_t,createdDate_t,lastUpdatedDate_t,version_number_versionTransaction_t';

                $.ajax({
                    url: url,
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    dataType: 'json',
                    headers: {
                        "Authorization": "Basic ZGF2aW5jaTpkYXZpbmNp",
                        "Accept": "*/*"
                    },
                    success: function(result) {
                        widget.tabData(result);
                        widget.tabTotal(result.items.length);
                        widget.tabDisplay(widget.tabTitle() + ' (' + result.items.length + ')');
                        for (var i = 0; i < result.items.length; i++) {
                            if (result.items[i].Alert == 'true') { //Any alert column set to true
                                $('#alert-' + widget.id()).attr('src', ss_images + 'tables/alert.png');
                                $('#alertimage').attr('src', ss_images + 'resources/alert_one.png');
                                $('#alertimage').attr('alt', 'Attention needed');
                            }
                        }
                        if (widget.defaultTab()) {
                            $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                            $('#tab-' + widget.tabName() + '-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                            if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }
                            $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                            buildTable(widget);
                        }
                    },
                    error: function(xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText;
                        var logMessage = "Widget: " + widget.displayName() + "-(" + widget.id() + ") - " +  widget.tabName() + "-" + errorMessage;
                        widget.tabTotal(0);
                        widget.tabDisplay(widget.tabTitle() + ' (0)');
                        CCLogger.error(logMessage);
                        //$('#SS-WidgetError').append(logMessage);
                    }
                });

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

                    $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                    buildTable(widget);
                });
            }
        };

        function formatDate(value) {
            if (value === null) return "";
            var mydate = new Date(value);
            var yyyy = mydate.getFullYear().toString();
            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = mydate.getDate().toString();
            var hh = mydate.getHours().toString();
            var mins = mydate.getMinutes().toString();
            var secs = mydate.getSeconds().toString();
            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy + ', ' + hh + ':' + mins + ':' + secs;
            var mydatestr = new Date(parts);
            return mydatestr.toLocaleString();
        }

        function buildTable(widget) {
            $('#listing').DataTable( {
                data: widget.tabData().items,
                order: [[ 1, "desc" ]],
                columns: [
                    {data: "_id"},
                    {data: "transactionID_t"},
                    {data: "_date_added"},
                    {data: "owner_t"}
                ],
                columnDefs: [
                    {title: "_id", targets: 0, orderable: true},
                    {title: "transactionID_t", targets: 1, orderable: true},
                    {title: "_data_added", targets: 2, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                    {title: "owner_t", targets: 3, orderable: false}
                ],
                language: {emptyTable: 'No ' + widget.tabName() + ' found'},
                lengthChange: false,
                pageLength: 10,
                destroy: true
            });
        }
    }
);