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
                            data: widget.quotesTable,
                            columns: [
                                {"title": "Date"}, 
                                {"title": "Customer"},
                                {"title": "Status"},
                                {"title": "TCV"},
                                {"title": "Transaction ID"}
                            ],
                            columnDefs: [
                                {"targets": 0, 
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
                                { "type": "num-fmt", "targets": 3, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                                {"targets": [3,4],"orderable": false}
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
            quotesTable: ko.observable(),

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                
                var tab = widget.tabName();

                widget.tabImage = widgetRepository + "images/master/" + widget.tabName().toLowerCase() + ".png";

                var endpoint;
                var query;
                var authkey;

                var settings = {
                  "async": true,
                  "crossDomain": true,
                  "url": "https://cpq-20114.bigmachines.com/rest/v7/commerceDocumentsOraclecpqo_bmClone_1Transaction?fields=status_t,_id,transactionID_t,totalContractValue_t,_customer_t_company_name,createdDate_t,lastUpdatedDate_t",
                  "method": "GET",
                  "headers": {
                    "Authorization": "Basic ZGF2aW5jaTpkYXZpbmNp",
                    "Accept": "*/*"
                  }
                }

                $.ajax(settings).done(function (response) {
                  var dataSet = [];
                  for (var i=0; i<response.items.length; i++) {
                      var cd = response.items[i].createdDate_t;
                      var c = response.items[i]._customer_t_company_name;
                      var s = response.items[i].status_t.displayValue;
                      var tcv = response.items[i].totalContractValue_t.value;
                      var ti = response.items[i].transactionID_t;
                      dataSet[i] = [cd,c,s,tcv,ti];
                  }
                  widget.quotesTable = dataSet;
                  widget.tabTotal(response.items.length);
                  widget.tabDisplay(tab + ' (' + response.items.length + ')');       
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