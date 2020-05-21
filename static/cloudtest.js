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


    $("#casedetail").load('/showcase');

    $("#selectsyetem").load('/selectsyetem');
    $("#selectcasetype").load('/selectcasetype');




});