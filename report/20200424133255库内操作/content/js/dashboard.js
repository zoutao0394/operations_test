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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9428571428571428, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "登陆-1"], "isController": false}, {"data": [1.0, 500, 1500, "登陆-0"], "isController": false}, {"data": [1.0, 500, 1500, "下架"], "isController": false}, {"data": [0.5, 500, 1500, "确认补货"], "isController": false}, {"data": [1.0, 500, 1500, "释放登陆账号"], "isController": false}, {"data": [0.0, 500, 1500, "获取库位商品信息"], "isController": false}, {"data": [1.0, 500, 1500, "缺货补货查询"], "isController": false}, {"data": [1.0, 500, 1500, "来源库位"], "isController": false}, {"data": [1.0, 500, 1500, "获取master配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "目标库位"], "isController": false}, {"data": [1.0, 500, 1500, "上架信息"], "isController": false}, {"data": [1.0, 500, 1500, "生成补货单"], "isController": false}, {"data": [1.0, 500, 1500, "获取可下架信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取仓库及会员信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取os配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取移库单号"], "isController": false}, {"data": [1.0, 500, 1500, "完成移库"], "isController": false}, {"data": [1.0, 500, 1500, "登陆"], "isController": false}, {"data": [1.0, 500, 1500, "查询仓库库位信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取wi配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "生成主动补货单"], "isController": false}, {"data": [1.0, 500, 1500, "查询补货单信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取op配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "锁定账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取opr配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "解锁"], "isController": false}, {"data": [0.5, 500, 1500, "打印"], "isController": false}, {"data": [1.0, 500, 1500, "获取basic配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取opw配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "查询库位信息"], "isController": false}, {"data": [1.0, 500, 1500, "确认移库结果"], "isController": false}, {"data": [1.0, 500, 1500, "获取账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取oms配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "上锁"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35, 0, 0.0, 206.28571428571428, 1, 3014, 519.5999999999995, 1461.1999999999916, 3014.0, 1.4851905287278282, 18.109959130739202, 1.0470510348595434], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["登陆-1", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 23.809523809523807, 2372.0470610119046, 20.298549107142858], "isController": false}, {"data": ["登陆-0", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 11.999371408045977, 8.508441091954024], "isController": false}, {"data": ["下架", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 3.105590062111801, 1.9895186335403727, 4.255022321428571], "isController": false}, {"data": ["确认补货", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 1.366120218579235, 0.8751707650273224, 1.8837517076502732], "isController": false}, {"data": ["释放登陆账号", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 1.46484375, 0.0], "isController": false}, {"data": ["获取库位商品信息", 1, 0, 0.0, 3014.0, 3014, 3014, 3014.0, 3014.0, 3014.0, 0.33178500331785005, 59.74786931818182, 0.35640967153284675], "isController": false}, {"data": ["缺货补货查询", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 9.847005208333334, 23.396809895833332], "isController": false}, {"data": ["来源库位", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 10.0, 7.5, 9.873046875], "isController": false}, {"data": ["获取master配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["目标库位", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 7.894736842105263, 10.125411184210526], "isController": false}, {"data": ["上架信息", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 6.5359477124183005, 6.344464869281046, 6.3827614379084965], "isController": false}, {"data": ["生成补货单", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 7.042253521126761, 4.669619278169015, 8.403939260563382], "isController": false}, {"data": ["获取可下架信息", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 10.752688172043012, 10.73168682795699, 10.45866935483871], "isController": false}, {"data": ["获取仓库及会员信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 63.96484375, 0.0], "isController": false}, {"data": ["获取os配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取移库单号", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 15.877016129032258, 28.603830645161292], "isController": false}, {"data": ["完成移库", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 9.345794392523365, 5.905008761682243, 14.922240070093459], "isController": false}, {"data": ["登陆", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 7.352941176470588, 740.2200137867646, 11.711569393382351], "isController": false}, {"data": ["查询仓库库位信息", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 6.25, 118.12744140625, 8.245849609375], "isController": false}, {"data": ["获取wi配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["生成主动补货单", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 5.347593582887701, 16.820897393048128, 6.553935494652406], "isController": false}, {"data": ["查询补货单信息", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 38.36945564516129, 38.841985887096776], "isController": false}, {"data": ["获取op配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["锁定账号", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 0.9765625000000001, 0.0], "isController": false}, {"data": ["获取opr配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["解锁", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 45.200892857142854, 67.59207589285714], "isController": false}, {"data": ["打印", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 1.293285472972973, 0.8800894105312209], "isController": false}, {"data": ["获取basic配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取opw配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2677.734375, 0.0], "isController": false}, {"data": ["查询库位信息", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 5.1020408163265305, 36.307198660714285, 6.252989477040816], "isController": false}, {"data": ["确认移库结果", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 85.72048611111111, 42.86024305555556], "isController": false}, {"data": ["获取账号", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 2.6455026455026456, 0.03616898148148148, 0.0], "isController": false}, {"data": ["获取oms配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 13.18359375, 0.0], "isController": false}, {"data": ["上锁", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 24.609375, 37.8125], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
