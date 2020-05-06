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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9545454545454546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "登陆-1"], "isController": false}, {"data": [1.0, 500, 1500, "登陆-0"], "isController": false}, {"data": [1.0, 500, 1500, "获取上架ID"], "isController": false}, {"data": [1.0, 500, 1500, "释放登陆账号"], "isController": false}, {"data": [1.0, 500, 1500, "入库记录"], "isController": false}, {"data": [1.0, 500, 1500, "核对入库单"], "isController": false}, {"data": [1.0, 500, 1500, "登记入库信息"], "isController": false}, {"data": [1.0, 500, 1500, "检查入库商品"], "isController": false}, {"data": [0.5, 500, 1500, "反馈测试结果"], "isController": false}, {"data": [1.0, 500, 1500, "获取master配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "生成入库单"], "isController": false}, {"data": [1.0, 500, 1500, "获取仓库及会员信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取os配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "进入上架单"], "isController": false}, {"data": [1.0, 500, 1500, "登陆"], "isController": false}, {"data": [1.0, 500, 1500, "查询仓库库位信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取wi配置信息"], "isController": false}, {"data": [0.5, 500, 1500, "获取待入库商品"], "isController": false}, {"data": [1.0, 500, 1500, "创建上架"], "isController": false}, {"data": [1.0, 500, 1500, "获取op配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "锁定账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取opr配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "完成收货"], "isController": false}, {"data": [0.5, 500, 1500, "上架确认"], "isController": false}, {"data": [1.0, 500, 1500, "到货登记"], "isController": false}, {"data": [1.0, 500, 1500, "获取basic配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取opw配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取InID"], "isController": false}, {"data": [1.0, 500, 1500, "获取ProductBatchID"], "isController": false}, {"data": [1.0, 500, 1500, "入库确认"], "isController": false}, {"data": [1.0, 500, 1500, "获取账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取oms配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取入库单号"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 33, 0, 0.0, 162.4545454545455, 1, 1250, 790.0000000000011, 1187.6999999999998, 1250.0, 1.669449081803005, 14.036671757221633, 2.497504126195174], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["登陆-1", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 2554.512219551282, 21.85997596153846], "isController": false}, {"data": ["登陆-0", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 12.987012987012989, 13.557731331168831, 9.613433441558442], "isController": false}, {"data": ["获取上架ID", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 63.25120192307693, 70.91346153846155], "isController": false}, {"data": ["释放登陆账号", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 0.9765625000000001, 0.0], "isController": false}, {"data": ["入库记录", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 28.617527173913043, 132.98233695652175], "isController": false}, {"data": ["核对入库单", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 56.19673295454546, 89.31107954545455], "isController": false}, {"data": ["登记入库信息", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 100.93470982142857, 63.895089285714285], "isController": false}, {"data": ["检查入库商品", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 155.99459134615384, 15.204326923076923], "isController": false}, {"data": ["反馈测试结果", 1, 0, 0.0, 1104.0, 1104, 1104, 1104.0, 1104.0, 1104.0, 0.9057971014492754, 0.2777541893115942, 0.42724609374999994], "isController": false}, {"data": ["获取master配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["生成入库单", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 17.122395833333336, 221.22395833333334], "isController": false}, {"data": ["获取仓库及会员信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 63.96484375, 0.0], "isController": false}, {"data": ["获取os配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["进入上架单", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 8.928571428571429, 44.363839285714285, 8.806501116071429], "isController": false}, {"data": ["登陆", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 7.936507936507936, 798.9676339285714, 12.641059027777779], "isController": false}, {"data": ["查询仓库库位信息", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 6.666666666666667, 126.00260416666667, 8.795572916666668], "isController": false}, {"data": ["获取wi配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 13.18359375, 0.0], "isController": false}, {"data": ["获取待入库商品", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 18.484872954349697, 1.0346010981912144], "isController": false}, {"data": ["创建上架", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 6.756756756756757, 4.38793285472973, 54.87885346283784], "isController": false}, {"data": ["获取op配置信息", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 333.3333333333333, 8.7890625, 0.0], "isController": false}, {"data": ["锁定账号", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 2.197265625, 0.0], "isController": false}, {"data": ["获取opr配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["完成收货", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 3.2679738562091503, 2.0520578022875817, 25.151271446078432], "isController": false}, {"data": ["上架确认", 1, 0, 0.0, 1250.0, 1250, 1250, 1250.0, 1250.0, 1250.0, 0.8, 0.4921875, 5.9375], "isController": false}, {"data": ["到货登记", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 28.700086805555557, 90.8203125], "isController": false}, {"data": ["获取basic配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取opw配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取InID", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 102.30777138157895, 12.785259046052632], "isController": false}, {"data": ["获取ProductBatchID", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 210.9375, 44.38920454545455], "isController": false}, {"data": ["入库确认", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 4.149377593360996, 2.6257780082987554, 4.068335062240664], "isController": false}, {"data": ["获取账号", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 3.134796238244514, 0.04285854231974921, 0.0], "isController": false}, {"data": ["获取oms配置信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 13.18359375, 0.0], "isController": false}, {"data": ["获取入库单号", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 17.005657327586206, 31.654094827586206], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 33, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
