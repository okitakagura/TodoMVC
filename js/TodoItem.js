var $ = function(sel) {
    return document.querySelector(sel);
};

function  getUrlParam(name) {
    //Construct a regular expression object with target parameters
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //Match target parameter
    var r = window.location.search.substr(1).match(reg);
    //Return parameter value
    if (r != null) return unescape(r[2]); return null;
}

window.onload = function() {
    var data = window.localStorage.getItem(model.TOKEN);
    model.data = data;
    if (data) data = JSON.parse(data);
    var index = getUrlParam('index');
    console.log('index:'+index);
    console.log(data);

    var newTodo = $('.item-todo');
    var newDate = $('.item-data');
    var newDetail = $('.item-detail');
    var submitButton = $('.submitbutton');

    newTodo.value = data.items[index].msg;
    var datetime = data.items[index].year+"-"+data.items[index].month+"-"+data.items[index].day;
    newDate.value = datetime;
    if(data.items[index].detail == undefined){
        newDetail.value = "";
    }
    else {
        newDetail.value = data.items[index].detail;
    }
    var newtype = document.getElementById("new-type");
    newtype.value = data.items[index].type;
    var type = newtype.value;
    switch (type) {
        case "impurg":
            document.getElementById("new-type").style.color = "#ccc1ff";
            break;
        case "impnurg":
            document.getElementById("new-type").style.color = "#89a3b2";
            break;
        case "nimpurg":
            document.getElementById("new-type").style.color = "#ff9776";
            break;
        case "nimpnurg":
            document.getElementById("new-type").style.color = "#e2bebe";
            break;
    }
    newtype.addEventListener('change', function () {
        var type = newtype.value;
        switch (type) {
            case "impurg":
                document.getElementById("new-type").style.color = "#ccc1ff";
                break;
            case "impnurg":
                document.getElementById("new-type").style.color = "#89a3b2";
                break;
            case "nimpurg":
                document.getElementById("new-type").style.color = "#ff9776";
                break;
            case "nimpnurg":
                document.getElementById("new-type").style.color = "#e2bebe";
                break;
        }
    });

    submitButton.addEventListener('click',function () {
        data.msg = newTodo.value;
        data.detail = newDetail.value;
        data.type = document.getElementById("new-type").value;
        data.year = newDate.value.split("-")[0];
        data.month = newDate.value.split("-")[1];
        data.day = newDate.value.split("-")[2];

        if (data.msg == '') {
            alert('input message is empty!');
            return;
        }

        data.items[index].msg = data.msg;
        data.items[index].detail = data.detail;
        data.items[index].type = data.type;
        data.items[index].year = data.year;
        data.items[index].month = data.month;
        data.items[index].day = data.day;

        model.data = data;

        data.msg = '';
        data.detail = '';
        data.type = '';
        data.year = '';
        data.month = '';
        data.day = '';
        model.flush();

        window.location.href = "index.html";
    },false);
};