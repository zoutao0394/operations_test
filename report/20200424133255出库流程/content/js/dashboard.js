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

    var data = {"OkPercent": 81.25, "KoPercent": 18.75};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "登陆-1"], "isController": false}, {"data": [1.0, 500, 1500, "登陆-0"], "isController": false}, {"data": [0.0, 500, 1500, "完成质检"], "isController": false}, {"data": [1.0, 500, 1500, "进入下架页面"], "isController": false}, {"data": [0.0, 500, 1500, "下架完成"], "isController": false}, {"data": [1.0, 500, 1500, "释放登陆账号"], "isController": false}, {"data": [0.0, 500, 1500, "创建下架保存"], "isController": false}, {"data": [1.0, 500, 1500, "获取系统推荐批次"], "isController": false}, {"data": [1.0, 500, 1500, "创建下架3"], "isController": false}, {"data": [0.0, 500, 1500, "查看出库单内下架信息"], "isController": false}, {"data": [1.0, 500, 1500, "查询出库单信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取封箱信息"], "isController": false}, {"data": [0.0, 500, 1500, "新增出库单"], "isController": false}, {"data": [1.0, 500, 1500, "确认封箱"], "isController": false}, {"data": [1.0, 500, 1500, "获取master配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取仓库及会员信息"], "isController": false}, {"data": [1.0, 500, 1500, "确认出库"], "isController": false}, {"data": [1.0, 500, 1500, "获取os配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "登陆-2"], "isController": false}, {"data": [1.0, 500, 1500, "登陆"], "isController": false}, {"data": [1.0, 500, 1500, "自动审核"], "isController": false}, {"data": [1.0, 500, 1500, "获取wi配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取op配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取出库单号"], "isController": false}, {"data": [1.0, 500, 1500, "锁定账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取opr配置信息"], "isController": false}, {"data": [0.0, 500, 1500, "出库完成"], "isController": false}, {"data": [1.0, 500, 1500, "获取basic配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取opw配置信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取商品信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取账号"], "isController": false}, {"data": [1.0, 500, 1500, "获取oms配置信息"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 6, 18.75, 25.59375, 0, 327, 65.69999999999997, 195.04999999999956, 327.0, 0.3766168041710311, 0.4273258294396648, 0.2398564479444961], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["登陆-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 16.796875, 28.41796875], "isController": false}, {"data": ["登陆-0", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 12.82051282051282, 13.383914262820513, 9.490184294871796], "isController": false}, {"data": ["完成质检", 1, 1, 100.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 13.460726351351353, 25.17947635135135], "isController": false}, {"data": ["进入下架页面", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 35.574776785714285, 68.15011160714286], "isController": false}, {"data": ["下架完成", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 49.8046875, 100.48828125], "isController": false}, {"data": ["释放登陆账号", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 2.197265625, 0.0], "isController": false}, {"data": ["创建下架保存", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 41.50390625, 83.82161458333333], "isController": false}, {"data": ["获取系统推荐批次", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 49.8046875, 103.515625], "isController": false}, {"data": ["创建下架3", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 38.31129807692308, 72.56610576923077], "isController": false}, {"data": ["查看出库单内下架信息", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["查询出库单信息", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 38.31129807692308, 94.20072115384616], "isController": false}, {"data": ["获取封箱信息", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 23.716517857142854, 44.363839285714285], "isController": false}, {"data": ["新增出库单", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 35.574776785714285, 101.35323660714286], "isController": false}, {"data": ["确认封箱", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 23.716517857142854, 42.68973214285714], "isController": false}, {"data": ["获取master配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取仓库及会员信息", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 500.0, 63.96484375, 0.0], "isController": false}, {"data": ["确认出库", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 45.27698863636364, 89.13352272727273], "isController": false}, {"data": ["获取os配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["登陆-2", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 1340.6032986111113, 98.52430555555556], "isController": false}, {"data": ["登陆", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 8.064516129032258, 109.78452620967742, 19.995904737903224], "isController": false}, {"data": ["自动审核", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 38.31129807692308, 72.64122596153847], "isController": false}, {"data": ["获取wi配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取op配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取出库单号", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 45.27698863636364, 82.9190340909091], "isController": false}, {"data": ["锁定账号", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 0.6760817307692308, 0.0], "isController": false}, {"data": ["获取opr配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["出库完成", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 49.8046875, 96.77734375], "isController": false}, {"data": ["获取basic配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取opw配置信息", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 26.3671875, 0.0], "isController": false}, {"data": ["获取商品信息", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 41.50390625, 105.79427083333333], "isController": false}, {"data": ["获取账号", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 3.058103975535168, 0.04181001529051988, 0.0], "isController": false}, {"data": ["获取oms配置信息", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 333.3333333333333, 8.7890625, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: http:\/\/172.16.20.6:8015\/OutWareHouse\/SoldOutManage\/GetShelfInfoByOutId?outId=${OutID}&amp;wareHouseId=26519&amp;sort=&amp;order=asc", 1, 16.666666666666668, 3.125], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u4FDD\u5B58\u6210\u529F\uFF01&quot;],\/", 2, 33.333333333333336, 6.25], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u786E\u8BA4\u6210\u529F\uFF01&quot;],&quot;\/", 1, 16.666666666666668, 3.125], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u5B8C\u6210\u8D28\u68C0\u6210\u529F\uFF01&quot;],\/", 1, 16.666666666666668, 3.125], "isController": false}, {"data": ["Test failed: text expected to contain \/&quot;Success&quot;:true,\/", 1, 16.666666666666668, 3.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 6, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u4FDD\u5B58\u6210\u529F\uFF01&quot;],\/", 2, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: http:\/\/172.16.20.6:8015\/OutWareHouse\/SoldOutManage\/GetShelfInfoByOutId?outId=${OutID}&amp;wareHouseId=26519&amp;sort=&amp;order=asc", 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u786E\u8BA4\u6210\u529F\uFF01&quot;],&quot;\/", 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u5B8C\u6210\u8D28\u68C0\u6210\u529F\uFF01&quot;],\/", 1, "Test failed: text expected to contain \/&quot;Success&quot;:true,\/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["完成质检", 1, 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u5B8C\u6210\u8D28\u68C0\u6210\u529F\uFF01&quot;],\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["下架完成", 1, 1, "Test failed: text expected to contain \/&quot;Success&quot;:true,\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["创建下架保存", 1, 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u4FDD\u5B58\u6210\u529F\uFF01&quot;],\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["查看出库单内下架信息", 1, 1, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 78: http:\/\/172.16.20.6:8015\/OutWareHouse\/SoldOutManage\/GetShelfInfoByOutId?outId=${OutID}&amp;wareHouseId=26519&amp;sort=&amp;order=asc", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["新增出库单", 1, 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u4FDD\u5B58\u6210\u529F\uFF01&quot;],\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["出库完成", 1, 1, "Test failed: text expected to contain \/&quot;errorMsg&quot;:[&quot;\u786E\u8BA4\u6210\u529F\uFF01&quot;],&quot;\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
