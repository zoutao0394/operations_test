$(function(){
    $("h5[id='warehouse']").load('/currentwarehouse');
    $("h5[id='user']").load('/currentuser');
//    加载当前选择的仓库会员；

    $("button[name='allrun']").click(
    function(){
        var scriptname = $(this).parent().next().html();

        $.post("/scriptrun",{
            name:scriptname
        },
        function(data){
            alert(data);
        }
        );
    }
);


    $("#changewarehouse").click(function(){
        window.open("/configmanage");
    });

    $("button[name='selectwarehouse']").click(function(){
        var ID = $(this).attr("value");

        $.post("/changeconfig",{
            value:ID
        },
        function(data){
            alert(data);
            $("h5[id='warehouse']").load('/currentwarehouse');
        }

        );

    });

    $("button[name='insertwarehouse']").click(function(){
//        var wID = $('#warehouseID').val();
//        var wname = $('#warehousename').val();
//        var mID = $('#memberID').val();
//        var mname = $('#membername').val();
//        var mno = $('#memberno').val();
//        var et = $('#environment').val();
//        var u = $('#username').val();

        $.post('/createwarehouse',{
            warehouseID:$('#warehouseID').val(),
            warehousename:$('#warehousename').val(),
            memberID:$('#memberID').val(),
            membername:$('#membername').val(),
            memberno:$('#memberno').val(),
            environment:$('#environment').val(),
            username:$('#username').val()
        },
        function(data){
            alert(data);
            $("#createwarehouse").modal('hide');
            $('#warehouseID').val("");
            $('#warehousename').val("");
            $('#memberID').val("");
            $('#membername').val("");
            $('#memberno').val("");
            $('#environment').val("");
            $('#username').val("");
        }
        );
    });

    $("button[name='selectrun']").click(function(){
        var scriptname = $(this).parent().next().html();
//        var a = $(this).html();

        $.post('/selectrun',{
            script:scriptname
        },function(data){
            alert(data);
        });


    });

    $("button[name='saveorder']").click(function(){
            var order = $("#order").val();
            var scriptname = $("#scriptname").val();

            $.post('/saveorder',{
                orders:order,
                scriptname:scriptname
            },function(data){
                alert(data);
                $("#insertorder").modal('hide');
                $('#order').val("");
                $('#scriptname').val("");
            });

        });


//    $("#casedetail").load('/showcase');

    $("select[name='selectsyetem']").load('/selectsyetem');
    $("select[name='selectcasetype']").load('/selectcasetype');

    $("button[name='createcase']").click(function(){
        var s = $("#system1").val();
        var t = $("#casetype1").val();
        var ct = $("#casetitle").val();
        var cd = $("#detail").val();
        var p = $("#process").val();

//        alert(system+type+casetitle+casedetail);
        $.post('/createcase',{
            system:s,
            type:t,
            casetitle:ct,
            detail:cd,
            createby:1,
            process:p
        },function(data){
            alert(data)
            $("#createcase").modal('hide');
            $('#casetitle').val("");
            $('#detail').val("");
            $("#process").val("");
//            $("#casedetail").load('/showcase');
            $("#selectcase").click();

        });
    });

    $("button[name='deletecase']").click(function(){
        var check = '';
        $("input[name='selectcase']:checked").each(function(){
            check +=($(this).attr('value'));
            check += ";";


        }
//        $("#selectcase").click();
        );

//         alert(check.slice(0,-1));
        $.post('/deletecase',{
            caseid:check.slice(0,-1)
        },
        function(data){
            alert(data);
            $("#selectcase").click();
        }
        );
    });



    $("#selectcase").click(function(){
        $("#casedetail").empty();
        $("ul.pagination").empty();
        var s = $("#selectsystem select").val();
        var c = $("#selectcasetype select").val();
        var page = 1;
        $.post('/showcase',{
            system:s,
            casetype:c,
            current_page:page,


        },function(data){
            $("#casedetail").append(data.detail);

            if(data.maxpage>0){
//                $("ul.pagination").append('<li><a href="#">&laquo;</a></li>');
                for(var i=0;i<data.maxpage;i++){
                    if(i==0){
                        $("ul.pagination").append('<li class="page-number active"><a href="#">'+(i+1)+'</a></li>');
                    }else{
                        $("ul.pagination").append('<li class="page-number"><a href="#">'+(i+1)+'</a></li>');
                    };




            }
//                $("ul.pagination").append('<li><a href="+&raquo;+">&raquo;</a></li>');
               $("ul.pagination").append('<li><span class="pagination-info">共'+data.maxpage+'页： '+data.count+'条用例 </span></li>');
            };


        });
    });
    $("#selectcase").click();


    $(document).on('click',".page-number a[href='#']",function(){
        var value = $(this).text();
//        var x = $(this).parent();
//        console.log(x.attr('class'));
//        x.attr('class','page-number active');
//        console.log(x.attr('class'));


        $("#casedetail").empty();
        $("ul.pagination").empty();
        var s = $("#selectsystem select").val();
        var c = $("#selectcasetype select").val();
        var page = value;
        $.post('/showcase',{
            system:s,
            casetype:c,
            current_page:page

        },function(data){
            $("#casedetail").append(data.detail);

            if(data.maxpage>0){
//                $("ul.pagination").append('<li><a href="#">&laquo;</a></li>');
                for(var i=0;i<data.maxpage;i++){

                if(i+1 == value){
                    $("ul.pagination").append('<li class="page-number active"><a href="#">'+(i+1)+'</a></li>');
                }
                else{
                    $("ul.pagination").append('<li class="page-number"><a href="#">'+(i+1)+'</a></li>');
                };




            }
               $("ul.pagination").append('<li><span class="pagination-info">共'+data.maxpage+'页： '+data.count+'条用例 </span></li>');
            };


        });
//        console.log(value);
    });

    var FileInput = function () {
    var oFile = new Object();

    //初始化fileinput控件（第一次初始化）
    oFile.Init = function(ctrlName, uploadUrl) {
    var control = $('#' + ctrlName);

    //初始化上传控件的样式
    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions: ['jmx','xls','xlsx'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        //dropZoneEnabled: false,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        //minFileCount: 0,
        maxFileCount: 1, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
    });

    //导入文件上传完成之后的事件
    $("#"+ ctrlName).on("fileuploaded", function (event, data, previewId, index) {
        $("#modal2").modal("hide");
//        console.log(data);
//        alert(data.response.result);

    });
}
    return oFile;
};

    $("button[name='uploadfile']").click(function(){
    //0.初始化fileinput
    var oFileInput = new FileInput();
    oFileInput.Init("file", "/upload");

});

    $('#modal2').on('hidden.bs.modal',function(){
        $('#file').prop('disabled',false).fileinput('destroy');
    });

    $.get('/showtask',function(data){
        console.log(data);
//        $("#taskdetail").html("");
        for(var i in data.data){
                 var t = "<tr onclick='checkTr(this);'><td><input onclick='checkInput(this);' type='checkbox' id='task"+data.data[i]['taskid']+"' value="+data.data[i]['taskid']+"></td>"
            +"<td>"
            +data.data[i]['taskname']+"</td><td>"+data.data[i]['startmode']+"</td><td>"+data.data[i]['name']
            +"</td><td>"+data.data[i]['runtime']+"</td></tr>";


            $("#taskdetail").append(t);


        };

    });

    $(document).on('click',"button[name='starttask']",function(){
//        var task = $(this).parent().next().html();
//

//         $("#taskcase").html("");
        var i = $("input[type='checkbox']:checked").length;

        if(i == 0){
        alert('请选择一条任务');

        }else if(i >1){
        alert('只能选择一条');
        }else{
        alert('任务已启动');

             var taskid = $("input[type='checkbox']:checked").val();
                    $.post('/starttask',{
            taskid:taskid
        },function(data){

            $("#taskdetail").html("");
            $.get('/showtask',function(data){

        console.log(data);
        for(var i in data.data){
                 var t = "<tr onclick='checkTr(this);'><td><input onclick='checkInput(this);' type='checkbox' id='task"+data.data[i]['taskid']+"' value="+data.data[i]['taskid']+"></td>"
            +"<td>"
            +data.data[i]['taskname']+"</td><td>"+data.data[i]['startmode']+"</td><td>"+data.data[i]['name']
            +"</td><td>"+data.data[i]['runtime']+"</td></tr>";


            $("#taskdetail").append(t);


        };

    });

        });
        };
    });

    $("#createtask1").click(function(){
        $("#taskcasedetail").html("");
        $.get('/taskcasedetail',function(data){
            console.log(data);
            for(var i in data.data){
                var t = '<tr onclick="checkTr(this);"><td><input type="checkbox" onclick="checkInput(this);" name="selectcase" value='+data.data[i]['caseid']+'></td><td>'
                +data.data[i]['caseid']+"</td><td>"+data.data[i]['system']+"</td><td>"+data.data[i]['process']+"</td><td>"+data.data[i]['casetitle']+"</td></tr>";


                $("#taskcasedetail").append(t);

                };


        });
    });

    $("button[name='createtask']").click(function(){
        var taskname = $("#tasktittle").val();
        var startmode = $("#startmode").val();
        var list = $("input[name='selectcase']");
        var caseid = [];
        console.log(caseid);
        for(var i in list){
            if(list[i].checked){
//            console.log(list[i].value);
            caseid.push(list[i].value);
            };


        };
        console.log(caseid);
        if(caseid.length>0){
            $.post('/createtask',{
                taskname:taskname,
                startmode:startmode,
                caseids:JSON.stringify(caseid)
            },function(data){
                alert(data);
                $("#createtask").modal("hide");
                $.get('/showtask',function(data){
                $("#taskdetail").html("");
        for(var i in data.data){
                       var t = "<tr onclick='checkTr(this);'><td><input onclick='checkInput(this);' type='checkbox' id='task"+data.data[i]['taskid']+"' value="+data.data[i]['taskid']+"></td>"
            +"<td>"
            +data.data[i]['taskname']+"</td><td>"+data.data[i]['startmode']+"</td><td>"+data.data[i]['name']
            +"</td><td>"+data.data[i]['runtime']+"</td><td></td></tr>";


            $("#taskdetail").append(t);
             $("#taskcasedetail").html("");



        };

    });

            });
        }
        else{
            alert('请选择用例');
        };




        });


    $(document).on('click',"button[name='taskdetail']",function(){
        $("#taskcase").html("");
        var i = $("input[type='checkbox']:checked").length;

        if(i == 0){
        alert('请选择一条任务');

        }else if(i >1){
        alert('只能选择一条');
        }else{
             var taskid = $("input[type='checkbox']:checked").val();
            $.post('/taskcase',{
            taskid:taskid
            },function(data){
            console.log(data);
            for(var i in data.data){
            var t = '<tr><td>'
            +data.data[i]['caseid']+"</td><td>"+data.data[i]['system']+"</td><td>"+data.data[i]['process']+"</td><td>"+data.data[i]['casetitle']+"</td></tr>";


            $("#taskcase").append(t);

            };

            })
            $('#task').modal("show");
        };


        });


    $("button[name='report']").click(function(){
        var i = $("input[type='checkbox']:checked").length;

        if(i == 0){
        alert('请选择一条任务');
        }else if(i >1){
        alert('只能选择一条');
        }else{
        var taskid = $("input[type='checkbox']:checked").val();
        $("#taskreportdetail").html("");
        $("#taskreportdetail").load('/showreport',{taskid: taskid},function(data){
            if(data=="当前任务未执行完毕"){
                alert(data);
            }else{
                $('#taskreport').modal("show");
            }
        });
        }



//        $.get('/showreport',function(data){
//            console.log(data);
//            $("#taskreportdetail").html("");
//        for(var i in data){
//
//            if(data[i]['success']=='false'){
//                var t = "<tr bgcolor='red'><td>"
//                +data[i]['threadName']+"</td><td>"+data[i]['label']+"</td><td>"+data[i]['success']
//                +"</td><td>"+data[i]['URL']+"</td><td>"+data[i]['failureMessage']+"</td></tr>";
//                console.log(data[i]);
//
//                $("#taskreportdetail").append(t);
//            }else{
//                 var t = "<tr><td>"
//                +data[i]['threadName']+"</td><td>"+data[i]['label']+"</td><td>"+data[i]['success']
//                +"</td><td>"+data[i]['URL']+"</td><td>"+data[i]['failureMessage']+"</td></tr>";
//                console.log(data[i]);
//
//                $("#taskreportdetail").append(t);
//            }
//
////             $("#taskcasedetail").html("");
//
//
//
//        };
//
//        });
    });

    $('button[name="downloadcase"]').click(function(){
       var i = $("input[type='checkbox']:checked").length;
       $('#downloadcase').attr('href','#');

        if(i == 0){
        alert('请选择一条任务');
        }else if(i >1){
        alert('只能选择一条');
        }else{
//
        var caseid = $("input[type='checkbox']:checked").val();
//        alert(caseid)
        $('#downloadcase').attr('href','/downloadcase?caseid='+caseid+'');
        $('#downloadcase').click();
        alert('下载成功')
        }
//        alert(filename)
    });
//


    $("button[name='uploadreport']").click(function(){
    //0.初始化fileinput
    var report = new FileInput();
    report.Init("report", "/uploadreport");

});

    $('#modal2').on('hidden.bs.modal',function(){
        $('#report').prop('disabled',false).fileinput('destroy');
    });


    $.get('/reportlist',function(data){

//        $("#taskdetail").html("");
        for(var i in data.data){
                 var t = "<tr onclick='checkTr(this);'><td><input onclick='checkInput(this);' type='checkbox' id='report"+data.data[i]['reportid']+"' value="+data.data[i]['reportid']+" name='checkreport'></td>"
            +"<td>"
            +data.data[i]['reportid']+"</td><td>"+data.data[i]['systemname']+"</td><td>"+data.data[i]['reportname']
            +"</td><td>"+data.data[i]['createdate']+"</td></tr>";


            $("#reportlist").append(t);
//
//
        };

    });

    $('#selectreport').click(function(){

         $("#reportlist").empty();
        $("ul.pagination").empty();
        var s = $("#selectsystem select").val();
        console.log(s)
        $.post('/reportlist',{
            systemname:s,
        },function(data){
            for(var i in data.data){
                var t = "<tr onclick='checkTr(this);'><td><input onclick='checkInput(this);' type='checkbox' id='report"+data.data[i]['reportid']+"' value="+data.data[i]['reportid']+" name='checkreport'></td>"
            +"<td>"
            +data.data[i]['reportid']+"</td><td>"+data.data[i]['systemname']+"</td><td>"+data.data[i]['reportname']
            +"</td><td>"+data.data[i]['createdate']+"</td></tr>";


            $("#reportlist").append(t);


          }
        });
    });


    $('button[name="downloadreport"]').click(function(){
       var i = $("input[type='checkbox']:checked").length;
       $('#downloadreport').attr('href','#');

        if(i == 0){
        alert('请选择一条任务');
        }else if(i >1){
        alert('只能选择一条');
        }else{
//
        var reportid = $("input[type='checkbox']:checked").val();
//        alert(caseid)
        $('#downloadreport').attr('href','/downloadreport?reportid='+reportid+'');
        $('#downloadreport').click();
        alert('下载成功')
        }
//        alert(filename)
    });


    $("button[name='deletereport']").click(function(){
        var check = '';
        $("input[name='checkreport']:checked").each(function(){
            check +=($(this).attr('value'));
            check += ";";


        }
//        $("#selectcase").click();
        );

//         alert(check.slice(0,-1));
        $.post('/deletereport',{
            reportid:check.slice(0,-1)
        },
        function(data){
            alert(data);
            $("#selectreport").click();
        }
        );
    });


});

function checkTr(tr) {
var tds = tr.childNodes;
for(var j = 0; j < tds.length; j++) {
    var inputs = tds[j].childNodes;
    for(var i = 0; i < inputs.length; i++) // 遍历页面上所有的 input
    {
        if(inputs[i].type == "checkbox") {
            inputs[i].checked = !inputs[i].checked;
            tr.style.backgroundColor = inputs[i].checked ? "#f3fbff" : "";
        }

    }
}
}

function checkInput(input){
    input.checked=!input.checked;
}




