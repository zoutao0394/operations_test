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