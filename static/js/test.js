

function lick()
{
    x = document.getElementById("a1");
    x.innerHTML = "uat";

}
function changeimage()
{
    element = document.getElementById("image1")
    if (element.src.match("yeshen"))
    {
        element.src = "../static/rp.png";
    }
    else
    {
         element.src = "../static/yeshen.png";
    }
}

function changecolor()
{
    element = document.getElementById("demo")
    element.style.color = 'red';
}


function sumvalue()
{
    var x = 5 + 6;
    var y = x * 10;

    element = document.getElementById("s1");
    element.innerHTML= y;

}

function dickvalue()
{
    var x = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
//    var y = x * 10;

    element = document.getElementById("s1");
    element.innerHTML= x['lastName'];

}


function listvalue()
{
    var x = [40, 100, 1, 5, 25, 10];
//    var y = x * 10;

    element = document.getElementById("s1");
    return x

}

function getvalue()
{
    document.getElementById("s1").innerHTML=listvalue();
}

function displayDate(){
	document.getElementById("nowtime").innerHTML=Date();
}



function listfor(){
    var a = [1,2,3,4,5,6,7];
    for(var i=0;i<a.length;i++){
        document.write(a[i]+'<br>')
    }

}


function validateform(){
    var x = document.forms["myForm"]["fname"].value;
    if (x == null || x == "") {
        alert("需要输入名字");
        return false;
    }
}

//
//
//document.getElementById("myBtn").onclick=function(){displayDate()};
//function displayDate(){
//
//     document.getElementById('s3').innerHTML=(Date());
//
//}

//
//function createelement(){
//    var a = document.createElement("p");
//    var b = document.createTextNode("测试")；
//    a.appendChild(b);
//    var c = document.getElementById("div1");
////    var child = document.getElementById("p1");
//    c.appendChild(a);
//}

function appelement(){
    var para = document.createElement("p");
    var node = document.createTextNode("这是一个新的段落。");
    para.appendChild(node);

    var element = document.getElementById("div1");
    element.appendChild(para);
}

function insertelement(){
    var para = document.createElement("p");
    var node = document.createTextNode("这是一个新的段落。");
    para.appendChild(node);

    var element = document.getElementById("div1");
    var chaild = document.getElementById("p1");
    element.insertBefore(para,chaild);
}

function removeelement(){
    var element = document.getElementById("div1");
    var chaild = document.getElementsByTagName("p");
    element.removeChild(chaild[0]);
}

function changetagname(){
    var element = document.getElementsByTagName("p");
    for(var i=0;i<element.length;i++){
        element[i].style.color="red";
    }
}

