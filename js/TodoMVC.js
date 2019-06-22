var $ = function(sel) {
  return document.querySelector(sel);
};
var $All = function(sel) {
  return document.querySelectorAll(sel);
};
var makeArray = function(likeArray) {
  var array = [];
  for (var i = 0; i < likeArray.length; ++i) {
    array.push(likeArray[i]);
  }
  return array;
};
var guid = 0;
var CL_COMPLETED = 'completed';
var CL_SELECTED = 'selected';
var recorditem = [];
var showFlag = 1;
function update() {
  model.flush();
  var data = model.data;
  
  var activeAmount = 0;
  var timelist = document.getElementById("list");
  timelist.innerHTML = '';
  var impurglist = document.getElementById("ImpUrglist");
  impurglist.innerHTML = '';
  var impNurglist = document.getElementById("ImpNurglist");
  impNurglist.innerHTML = '';
  var Nimpurglist = document.getElementById("NimpUrglist");
  Nimpurglist.innerHTML = '';
  var NimpNurglist = document.getElementById("NimpNurglist");
  NimpNurglist.innerHTML = '';

  recorditem = [];
  data.items.forEach(function(itemData, index) {
    recorditem.push(itemData);
    if (!itemData.completed) activeAmount++;
    if (
      data.filter == 'All'
      || (data.filter == 'Active' && !itemData.completed)
      || (data.filter == 'Completed' && itemData.completed)
    ) {
      var item = document.createElement('li');
      var id = 'item' + guid++;

      if(showFlag == 0){
        item.setAttribute('id', id);
        if (itemData.completed) item.classList.add(CL_COMPLETED);
        var itemview = document.createElement('div');
        itemview.className = 'view';
        var itemcontent = document.createElement('div');
          itemcontent.innerHTML = [
            '<label class="todo-label">' + itemData.msg + '</label>',
          ].join('');


        itemview.appendChild(itemcontent);
        item.style.margin = "25px 15px 25px 15px";
        item.appendChild(itemview);
      }
      else{
        item.setAttribute('id', id);
        if (itemData.completed) item.classList.add(CL_COMPLETED);
        var itemview = document.createElement('div');
        itemview.className = 'view';
        var itemtoggle = document.createElement('input');
        itemtoggle.className = 'toggle';
        itemtoggle.type = 'checkbox';
        var itemcontent = document.createElement('div');
        itemcontent.innerHTML = [
          '<b></b>',
          '<span>' + itemData.year+'-'+itemData.month+'-'+itemData.day+'</span>',
          '<label class="todo-label">' + itemData.msg + '</label>',
        ].join('');

        var itemdelete = document.createElement('button');
        itemdelete.className = 'destroy';
        itemview.appendChild(itemtoggle);
        itemview.appendChild(itemcontent);
        itemview.appendChild(itemdelete);
        item.appendChild(itemview);

        var itemToggle = item.querySelector('.toggle');
        itemToggle.checked = itemData.completed;
        itemToggle.addEventListener('change', function() {
          itemData.completed = !itemData.completed;
          update();
        }, false);

        item.querySelector('.destroy').addEventListener('click', function() {
          var myconfirm = confirm("Are you sure to delete it?");
          if(myconfirm == true){
            data.items.splice(index, 1);
            update();
          }
          else return;
        }, false);
      }


      var label = itemcontent.querySelector('.todo-label');
      switch (itemData.type) {
        case "impurg": label.style.backgroundColor = "#ccc1ff";
          break;
        case "impnurg": label.style.backgroundColor = "#89a3b2";
          break;
        case "nimpurg": label.style.backgroundColor = "#ff9776";
          break;
        case "nimpnurg": label.style.backgroundColor = "#e2bebe";
          break;
      }


      longPress(label,function () {
        window.location.href = "TodoItem.html?index="+index;
      }, function () {
        console.log('touch');
      });



      var startX,startY,moveEndX,moveEndY,X,Y;
      label.addEventListener("touchstart",function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      label.addEventListener("touchmove",function (e) {
        moveEndX = e.touches[0].clientX;
        moveEndY = e.touches[0].clientY;
        X = moveEndX - startX;
        Y = moveEndY - startY;

        if(Math.abs(X) > Math.abs(Y) && X >0){
          var myconfirm = confirm("Are you sure to delete it?");
          if(myconfirm == true){
            data.items.splice(index, 1);
            update();
          }
          else return;
        }
        else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
          itemData.completed = !itemData.completed;
          update();
        }
      });
      if(showFlag == 0){
        var list;
        switch (itemData.type) {
          case "impurg":list = impurglist;
            break;
          case "impnurg":list = impNurglist;
            break;
          case "nimpurg":list = Nimpurglist;
            break;
          case "nimpnurg":list = NimpNurglist;
            break;
        }
        list.insertBefore(item, list.firstChild);
      }

      else {
        var list = timelist;
        var i;
        var itemflag = 0;
        // Sort by time
        for(i = 0; i < recorditem.length - 1;){
          if(itemData.year < recorditem[i].year){
            i++;
          }
          else if(itemData.year == recorditem[i].year){
            if(itemData.month < recorditem[i].month){
              i++;
            }
            else if(itemData.month == recorditem[i].month){
              if(itemData.day < recorditem[i].day){
                i++;
              }
              else{
                list.insertBefore(item, list.children[i]);
                itemflag = 1;
                break;
              }
            }
            else{
              list.insertBefore(item, list.children[i]);
              itemflag = 1;
              break;
            }
          }
          else{
            list.insertBefore(item, list.children[i]);
            itemflag = 1;
            break;
          }
        }

        if(itemflag == 0){
          list.insertBefore(item, list.children[i]);
        }
      }


    }
  });

  var newTodo = $('.new-todo');
  newTodo.value = data.msg;


  var completedCount = data.items.length - activeAmount;
  var count = $('.todo-count');
  count.innerHTML = (activeAmount || 'No') + (activeAmount > 1 ? ' items' : ' item') + ' left';

  var clearCompleted = $('.clear-completed');
  clearCompleted.style.visibility = completedCount > 0 ? 'visible' : 'hidden';

  var toggleAll = $('.toggle-all');
  toggleAll.style.visibility = data.items.length > 0 ? 'visible' : 'hidden';
  toggleAll.checked = data.items.length == completedCount;

  var filters = makeArray($All('.filters li a'));
  filters.forEach(function(filter) {
    if (data.filter == filter.innerHTML) filter.classList.add(CL_SELECTED);
    else filter.classList.remove(CL_SELECTED);
  });
}

window.onload = function() {
  model.init(function(){
    var data = model.data;
    
    var newTodo = $('.new-todo');
    var newData = $('.new-data');
    var addButton = $('.addbutton');


    var newtype = document.getElementById("new-type");
    document.getElementById("new-type").style.color = "#ccc1ff";
    newtype.addEventListener('change',function () {
      var type = newtype.value;
      switch (type) {
        case "impurg":document.getElementById("new-type").style.color = "#ccc1ff";
          break;
        case "impnurg":document.getElementById("new-type").style.color = "#89a3b2";
          break;
        case "nimpurg":document.getElementById("new-type").style.color = "#ff9776";
          break;
        case "nimpnurg":document.getElementById("new-type").style.color = "#e2bebe";
          break;
      }
    });

    var showtype = document.getElementById("show-type");
    if(showtype.value == "bytype"){
      showFlag = 0;
      $('.container').style.display = "table";
    }
    else {
      showFlag = 1;
      $('.container').style.display = "none";
    }
    showtype.addEventListener('change',function () {
      if(showtype.value == "bytype"){
        showFlag = 0;
        $('.container').style.display = "table";

      }
      else{
        showFlag = 1;
        $('.container').style.display = "none";
      }
      update();
    });
    addButton.addEventListener('click', function() {
      data.msg = newTodo.value;
      data.type = document.getElementById("new-type").value;
      data.year = newData.value.split("-")[0];
      data.month = newData.value.split("-")[1];
      data.day = newData.value.split("-")[2];


      if (data.msg == '') {
        alert('input message is empty!');
        return;
      }

      var i;
      var flag = 0;
      // Sort by time
      for(i = 0; i < data.items.length;){
        if(data.year < data.items[i].year){
          i++;
        }
        else if(data.year == data.items[i].year){
          if(data.month < data.items[i].month){
            i++;
          }
          else if(data.month == data.items[i].month){
            if(data.day < data.items[i].day){
              i++;
            }
            else{
              flag = 1;
              data.items.splice(i,0,{msg: data.msg, detail:"", type:data.type, completed: false, year:data.year, month:data.month, day:data.day});
              break;
            }
          }
          else{
            flag = 1;
            data.items.splice(i,0,{msg: data.msg, detail:"", type:data.type, completed: false, year:data.year, month:data.month, day:data.day});
            break
          }
        }
        else{
          flag = 1;
          data.items.splice(i,0,{msg: data.msg, detail:"", type:data.type, completed: false, year:data.year, month:data.month, day:data.day});
          break;
        }
      }

      if(flag == 0){
        data.items.splice(i,0,{msg: data.msg, detail:"", type:data.type, completed: false, year:data.year, month:data.month, day:data.day});
      }

      //data.items.push({msg: data.msg, completed: false, year:data.year, month:data.month, day:data.day});
      data.msg = '';
      data.type = '';
      data.year = '';
      data.month = '';
      data.day = '';
      update();
    }, false);
    newTodo.addEventListener('change', function() {
      model.flush();
    });
    newData.addEventListener('change', function() {
      model.flush();
    });


    var clearCompleted = $('.clear-completed');
    clearCompleted.addEventListener('click', function() {
      data.items.forEach(function(itemData, index) {
        if (itemData.completed) data.items.splice(index, 1);
      });
      update();
    }, false);

    var toggleAll = $('.toggle-all');
    toggleAll.addEventListener('change', function() {
      var completed = toggleAll.checked;
      data.items.forEach(function(itemData) {
        itemData.completed = completed;
      });
      update();
    }, false);

    var filters = makeArray($All('.filters li a'));
    filters.forEach(function(filter) {
      filter.addEventListener('click', function() {
        data.filter = filter.innerHTML;
        filters.forEach(function(filter) {
          filter.classList.remove(CL_SELECTED);
        });
        filter.classList.add(CL_SELECTED);
        update();
      }, false);
    });

    update();
  });
};

var longPress = function (dom, longPressCallBack, touchCallBack) {
  var timer = undefined;
  var isLongPress = false;

  var setEvent = function (e) {
    e.addEventListener('touchstart', function(event) {
      timer = setTimeout(function () {
        isLongPress = true;
        longPressCallBack && longPressCallBack(e);
      }, 500);
    }, false);

    e.addEventListener('touchmove', function(event) {
      clearTimeout(timer);
    }, false);

    e.addEventListener('touchend', function(event) {
      if (!isLongPress) touchCallBack && touchCallBack()
      clearTimeout(timer);
      isLongPress = false;
    }, false);
  };

  if (dom.length) {
    for (var i = 0; i < dom.length; i++) {
      setEvent(dom[i])
    }
  } else {
    setEvent(dom)
  }
};