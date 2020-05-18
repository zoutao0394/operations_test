$(function(){
    $("h5[id='warehouse']").load('/currentwarehouse');
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

});