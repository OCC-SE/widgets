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
        
        function getConfig(tab,widget) {
            var table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.dataTable,
                            columns: [
                                {"title": "Subscription Number"}, 
                                {"title": "Customer"},
                                {"title": "Total Contract Value"},
                                {"title": "Start Date"},
                                {"title": "End Date"},
                                {"title": "Status"},
                                {"title": "Term"}
                            ],
                            columnDefs: [
                                {"targets": [3,4], 
                                "type": "date", 
                                "render": function (value) {
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
                                { "type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                                {"targets": 5,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {
                                            var image;
                                            var alt = row[5];
                                            if (row[5] == 'ORA_ACTIVE') {
                                                image = widgetRepository + "images/master/green_check.png";
                                            } else if (row[5] == 'ORA_CLOSED') {
                                                image = widgetRepository + "images/master/red_x.png";
                                            } else {
                                                image = widgetRepository + "images/master/warning.png";
                                            }
                                        return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                                    }
                                },
                                {
                                "targets": 7,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {
                                            var dispValue;
                                            if (row[5] == 'ORA_ACTIVE') {
                                                dispValue = '<input class="cc-button-primary" type="button" value="Details">';
                                            } else  {
                                                dispValue = '<input class="cc-button-primary" type="button" value="Renew">';
                                            }                                 
                                            return dispValue;
                                    }                                    
                                }                                  
                            ],
                            language: {
                                "emptyTable": "No " + tab.toLowerCase() + " found"
                            },                            
                            destroy: true
                        });         
            return table;                
        }

        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Customers','Opportunities','Install Base','Quotes'];
        var tabUsed = [];
        var queryRun = [];

        return {

            tabTotal: ko.observable(),
            tabDisplay: ko.observable(''),
            dataTable: ko.observable(),

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                
                var tab = widget.tabName();

                widget.tabImage = widgetRepository + "images/master/" + widget.tabName().toLowerCase() + ".png";
                
                //serverURL

                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Basic bGlzYS5qb25lczpUV0M3ODY3Mw==",
                        "Accept": "*/*"
                    },                        
                    url: "https://ucf1-zhpe-fa-ext.oracledemos.com/crmRestApi/resources/latest/subscriptions/?q=PrimaryPartyId=100000000395811",
                    success: function(response) {
                        var dataSet = [];
                        for (var i=0; i<response.items.length; i++) {
                            var a = response.items[i].SubscriptionNumber;
                            var b = response.items[i].PrimaryPartyName;
                            var c = response.items[i].TotalContractValue;
                            var d = response.items[i].StartDate;
                            var e = response.items[i].EndDate;
                            var f = response.items[i].Status;
                            var g = response.items[i].Duration;
                            var h = response.items[i].Period;
                          dataSet[i] = [a,b,c,d,e,f,g + ' ' + h];
                        }                   
                        widget.dataTable = dataSet;
                        widget.tabTotal(response.items.length);
                        widget.tabDisplay(tab + ' (' + response.items.length + ')');                       
                    },
                    error: function(jqXHR, textStatus, error) {
                        console.log('ERROR: ' + widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                        widget.tabTotal(0);
                        widget.tabDisplay(tab + ' (0)');
                    }
                });
                
                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                var widget = this;
                $(document).ready(function() {
                    var tab = widget.tabName();
                    if (!tabUsed.includes(tab)) {
                        $('#tab-'+ tab).on('click', function() {
                            $("#tab-"+tab).attr('class', 'imglink-selected');
                            for (var i=0; i<tabTypes.length; i++) {
                                if (tabTypes[i]!=tab) {
                                    $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                }
                            }
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }                            
                            getConfig(tab,widget);
                        });
                        tabUsed.push(tab);
                    }
                });
            }
            
        };
    }
);