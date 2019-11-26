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
        
        function buildTable(tab,widget) {
            var table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.dataTable,
                            columns: [
                                {title: "Transaction"}, 
                                {title: "Version"},
                                {title: "Account Name"},
                                {title: "Description"},
                                {title: "Status"},
                                {title: "TCV"},
                                {title: "Created"},
                                {title: "Updated"},
                                {title: "ACV"}
                            ],
                            order: [[ 7, "desc" ]],                            
                            columnDefs: [
                                {targets: [6,7], 
                                type: "date", 
                                render: function (value) {
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
                                {type: "num-fmt", targets: [5,8], render: $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                                {targets: [1,3,4],orderable: false}
                            ],
                            language: {
                                emptyTable: "No " + tab.toLowerCase() + " found"
                            },                            
                            destroy: true
                        });         
            return table;                
        }

        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Contacts','Opportunities','Installed','Quotes','Service'];
        var tabUsed = [];
        var queryRun = [];

        return {

            tabTotal: ko.observable(),
            tabDisplay: ko.observable(''),
            dataTable: ko.observable(),

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                
                var tab = widget.tabName();

                widget.tabImage = widgetRepository + "images/master/tabs/" + widget.tabName().toLowerCase() + ".png";
                
                //NEED DEMO URL, OWNER and possibly Authorization
                var qUrl = 'https://cpq-20238.bigmachines.com/rest/v8/commerceDocumentsOraclecpqoTransaction'; //needs to be set
                var qOwner = '?q={"owner_t": "Natalie Thompson"}'; //needs to be set
                var qFields = '&fields=status_t,owner_t,_id,transactionID_t,_customer_t_company_name,totalAnnualValue_t,totalContractValue_t,transactionName_t,createdDate_t,lastUpdatedDate_t,version_number_versionTransaction_t';

                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Basic ZGF2aW5jaTpkYXZpbmNp",
                        "Accept": "*/*"
                    },                        
                    //url: "https://cpq-20114.bigmachines.com/rest/v7/commerceDocumentsOraclecpqo_bmClone_1Transaction?fields=status_t,_id,transactionID_t,totalContractValue_t,_customer_t_company_name,createdDate_t,lastUpdatedDate_t",
                    url: qUrl + qOwner + qFields,
                    success: function(response) {
                        var dataSet = [];
                        for (var i=0; i<response.items.length; i++) {
                          var ti = response.items[i].transactionID_t;
                          var v = response.items[i].version_number_versionTransaction_t;
                          var c = response.items[i]._customer_t_company_name;
                          var tn = response.items[i].transactionName_t;
                          var s = response.items[i].status_t.displayValue;
                          var tcv = response.items[i].totalContractValue_t.value;
                          var cd = response.items[i].createdDate_t;
                          var ld = response.items[i].lastUpdatedDate_t;
                          var ta = response.items[i].totalAnnualValue_t.value;
                          dataSet[i] = [ti,v,c,tn,s,tcv,cd,ld,ta];
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
                    //var tabTrim = widget.tabName().replace(' ','');
                    if (!tabUsed.includes(tab)) {
                        //$('#tab-'+ tabTrim).on('click', function() {
                        $('#tab-'+ tab).on('click', function() {                            
                            //$("#tab-"+tabTrim).attr('class', 'imglink-selected');
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
                            buildTable(tab,widget);
                        });
                        tabUsed.push(tab);
                    }
                });
            }
        };
    }
);