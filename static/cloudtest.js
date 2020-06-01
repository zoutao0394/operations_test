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

//    $.fn.selectcase = function(){
//        $("#casedetail").empty();
//        $("ul.pagination").empty();
//        var s = $("#selectsystem select").val();
//        var c = $("#selectcasetype select").val();
//        var page = 1;
//        $.post('/showcase',{
//            system:s,
//            casetype:c,
//            current_page:page,
//
//
//        },function(data){
//            $("#casedetail").append(data.detail);
//
//            if(data.maxpage>0){
////                $("ul.pagination").append('<li><a href="#">&laquo;</a></li>');
//                for(var i=0;i<data.maxpage;i++){
//                    if(i==0){
//                        $("ul.pagination").append('<li class="page-number active"><a href="#">'+(i+1)+'</a></li>');
//                    }else{
//                        $("ul.pagination").append('<li class="page-number"><a href="#">'+(i+1)+'</a></li>');
//                    };
//
//
//
//
//            }
////                $("ul.pagination").append('<li><a href="+&raquo;+">&raquo;</a></li>');
//               $("ul.pagination").append('<li><span class="pagination-info">共'+data.maxpage+'页： '+data.count+'条用例 </span></li>');
//            };
//
//
//        });
//    };

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
        allowedFileExtensions: ['jmx'],//接收的文件后缀
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
    $("#file").on("fileuploaded", function (event, data, previewId, index) {
//        $("#file").val("");
//        alert(data.response.result);

        $("#modal2").modal("hide");


//        $(".file-preview-thumbnails clearfix").remove();
//        var data = data.response.success;
//        if (data == 'true') {
////            toastr.error('文件格式类型不正确');
//
//        }


    });
}
    return oFile;
};

    $("button[name='uploadfile']").click(function(){
    //0.初始化fileinput
    var oFileInput = new FileInput();
    oFileInput.Init("file", "/upload");
//    var obj = document.getElementById("file") ;
//    obj.select();
//    document.selection.clear();
});

    $('#modal2').on('hidden.bs.modal',function(){
        $('#file').prop('disabled',false).fileinput('destroy');
    });

    $.get('/showtask',function(data){

        for(var i in data.data){
            var t = "<tr><td><button type='button' class='btn btn-primary' name='starttask'>启动</button>"
            +"<button type='button' class='btn btn-info' name='taskdetail' data-target='#task' data-toggle='modal'>详情</button></td><td>"
            +data.data[i]['taskname']+"</td><td>"+data.data[i]['startmode']+"</td><td></td><td>"+data.data[i]['name']+"</td></tr>";


            $("#taskdetail").append(t);



        };

    });

    $(document).on('click',"button[name='starttask']",function(){
        var task = $(this).parent().next().html();

        $.post('/starttask',{
            taskname:task
        },function(data){
            alert(task);
        });
    });

    $("#createtask1").click(function(){
        $("#taskcasedetail").html("");
        $.get('/taskcasedetail',function(data){
            console.log(data);
            for(var i in data.data){
                var t = '<tr><td><input type="checkbox" name="selectcase" value='+data.data[i]['caseid']+'></td><td>'
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
            var t = "<tr><td><button type='button' class='btn btn-primary' name='starttask'>启动任务</button></td><td>"
            +data.data[i]['taskname']+"</td><td>"+data.data[i]['startmode']+"</td><td></td><td>"+data.data[i]['name']+"</td></tr>";


            $("#taskdetail").append(t);



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
        var taskname = $(this).parent().next().html();
        $.post('/taskcase',{
            taskname:taskname
        },function(data){
            console.log(data);
            for(var i in data.data){
                var t = '<tr><td>'
                +data.data[i]['caseid']+"</td><td>"+data.data[i]['system']+"</td><td>"+data.data[i]['process']+"</td><td>"+data.data[i]['casetitle']+"</td></tr>";


                $("#taskcase").append(t);

                };

        })

        });
});



