/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.921875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "登陆-1"], "isController": false}, {"data": [1.0, 500, 1500, "登陆-0"], "isController": false}, {"data": [1.0, 500, 1500, "获取上架ID"], "isController": false}, {"data": [1.0, 500, 1500, "释放登陆账号"], "isController": false}, {"data": [1.0, 500, 1500, "入库记录"], "isController": false}, {"data": [1.0, 500, 1500, "核对入库单"], "isController": false}, {"data": [1.0, 500, 1500, "登记入库信息"], "isController": false}, {"data": [0.5, 500, 1500, "检查入库商品"], "isController": false}, {"data": [1.0, 500, 1500, "获取master配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "生成入库单"], "isController": false}, {"data": [1.0, 500, 1500, "获取仓库及会员信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取os配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "进入上架单"], "isController": false}, {"data": [1.0, 500, 1500, "登陆"], "isController": false}, {"data": [0.5, 500, 1500, "查询仓库库位信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取wi配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取待入库商品"], "isController": false}, {"data": [1.0, 500, 1500, "创建上架"], "isController": false}, {"data": [1.0, 500, 1500, "获取op配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "锁定账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取opr配置信息"], "isController": false}, {"data": [0.5, 500, 1500, "完成收货"], "isController": false}, {"data": [0.5, 500, 1500, "上架确认"], "isController": false}, {"data": [1.0, 500, 1500, "到货登记"], "isController": false}, {"data": [1.0, 500, 1500, "获取basic配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取opw配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取InID"], "isController": false}, {"data": [1.0, 500, 1500, "获取ProductBatchID"], "isController": false}, {"data": [0.5, 500, 1500, "入库确认"], "isController": false}, {"data": [1.0, 500, 1500, "获取账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取oms配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取入库单号"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 0, 0.0, 223.71875000000003, 1, 1442, 956.7999999999998, 1238.5499999999993, 1442.0, 1.4991801358631998, 9.537737540993207, 1.2258158380182713], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["登陆-1", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 916.8277138157895, 9.025493421052632], "isController": false}, {"data": ["登陆-0", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 9.345794392523365, 10.833455023364486, 6.972838785046729], "isController": false}, {"data": ["获取上架ID", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 23.17356418918919, 25.17947635135135], "isController": false}, {"data": ["释放登陆账号", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 0.23754222972972974, 0.0], "isController": false}, {"data": ["入库记录", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 25.82465277777778, 114.22164351851852], "isController": false}, {"data": ["核对入库单", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 32.861328125, 49.609375], "isController": false}, {"data": ["登记入库信息", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 62.66983695652174, 39.31725543478261], "isController": false}, {"data": ["检查入库商品", 1, 0, 0.0, 1129.0, 1129, 1129, 1129.0, 1129.0, 1129.0, 0.8857395925597874, 1.4540314991142604, 0.8840096324180691], "isController": false}, {"data": ["获取master配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 20.01953125, 0.0], "isController": false}, {"data": ["生成入库单", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 31.25, 17.27294921875, 53.619384765625], "isController": false}, {"data": ["获取仓库及会员信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 59.08203125, 0.0], "isController": false}, {"data": ["获取os配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 19.53125, 0.0], "isController": false}, {"data": ["进入上架单", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 4.716981132075471, 4.624852594339623, 4.698555424528302], "isController": false}, {"data": ["登陆", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 4.830917874396135, 426.36624396135267, 7.746452294685991], "isController": false}, {"data": ["查询仓库库位信息", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 1.7241379310344827, 16.662176724137932, 2.2646147629310347], "isController": false}, {"data": ["获取wi配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 19.53125, 0.0], "isController": false}, {"data": ["获取待入库商品", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 9.25925925925926, 26.11400462962963, 10.579427083333334], "isController": false}, {"data": ["创建上架", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 4.273504273504274, 2.942207532051282, 7.2490985576923075], "isController": false}, {"data": ["获取op配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 19.53125, 0.0], "isController": false}, {"data": ["锁定账号", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 4.694835680751174, 0.04126320422535212, 0.0], "isController": false}, {"data": ["获取opr配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 37.109375, 0.0], "isController": false}, {"data": ["完成收货", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.6438148527992278, 1.997428511100386], "isController": false}, {"data": ["上架确认", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 1.2953367875647668, 0.8475348121761658, 2.115042098445596], "isController": false}, {"data": ["到货登记", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 23.809523809523807, 13.230096726190474, 39.109002976190474], "isController": false}, {"data": ["获取basic配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 35.15625, 0.0], "isController": false}, {"data": ["获取opw配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 18.5546875, 0.0], "isController": false}, {"data": ["获取InID", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 5.9880239520958085, 15.087013473053892, 5.865222679640718], "isController": false}, {"data": ["获取ProductBatchID", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 6.666666666666667, 6.26953125, 6.575520833333334], "isController": false}, {"data": ["入库确认", 1, 0, 0.0, 1442.0, 1442, 1442, 1442.0, 1442.0, 1442.0, 0.6934812760055479, 0.4659327323162275, 0.6867089979195562], "isController": false}, {"data": ["获取账号", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 2.6246719160104988, 0.04613681102362205, 0.0], "isController": false}, {"data": ["获取oms配置信息", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 333.3333333333333, 11.067708333333334, 0.0], "isController": false}, {"data": ["获取入库单号", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 10.989010989010989, 6.642771291208791, 9.701236263736265], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
