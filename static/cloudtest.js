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

//        alert(system+type+casetitle+casedetail);
        $.post('/createcase',{
            system:s,
            type:t,
            casetitle:ct,
            detail:cd,
            createby:1
        },function(data){
            alert(data)
            $("#createcase").modal('hide');
            $('#casetitle').val("");
            $('#detail').val("");
            $("#casedetail").load('/showcase');

        });
    });

    $("button[name='deletecase']").click(function(){
        var check = '';
        $("input[name='selectcase']:checked").each(function(){
            check +=($(this).attr('value'));
            check += ";";

        });

//         alert(check.slice(0,-1));
        $.post('/deletecase',{
            caseid:check.slice(0,-1)
        },
        function(data){
            alert(data);
        }
        );
    });

//    $("button[name='testcase']").click(function(){
//        $.get('/testcase',function(result){
////            console.log(result.data);
////            alert(result[0]);
//            var tabledetail = result.data;
//            $.each(tabledetail,function(index){
//                console.log(tabledetail[index].createdate);
//
//            });
//        });
//    });

//    $("#selectcase").click(function(){
//        var s = $("#selectsystem select").val();
//        var c = $("#selectcasetype select").val();
//        $("#casedetail").load('/showcase',{
//            system:s,
//            casetype:c
//        },function(){
//            $("ul.pagination").append('<li><a href="#">3</a></li>');
//        });
//    });



    $("#selectcase").click(function(){
        $("#casedetail").empty();
        $("ul.pagination").empty();
        var s = $("#selectsystem select").val();
        var c = $("#selectcasetype select").val();
        var page = 1;
        $.post('/showcase',{
            system:s,
            casetype:c,
            current_page:page

        },function(data){
            $("#casedetail").append(data.detail);

            if(data.maxpage>0){
//                $("ul.pagination").append('<li><a href="#">&laquo;</a></li>');
                for(var i=0;i<data.maxpage;i++){

                $("ul.pagination").append('<li class="page-number"><a href="#">'+(i+1)+'</a></li>');



            }
//                $("ul.pagination").append('<li><a href="+&raquo;+">&raquo;</a></li>');
            };


        });
    });


    $(document).on('click',".page-number a[href='#']",function(){
        var value = $(this).text();
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

                $("ul.pagination").append('<li class="page-number"><a href="#">'+(i+1)+'</a></li>');



            }
//                $("ul.pagination").append('<li><a href="+&raquo;+">&raquo;</a></li>');
            };


        });
//        console.log(value);
    });

});

