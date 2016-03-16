onload = function () {
    console.log("LOADED");


    document.getElementById('btn')
        .addEventListener('click', function () {
            getData('/todos',
                /*function(data) {
				document.getElementById('content')
					.innerHTML = data;*/
                displayList);
        });


    document.myForm.submit.addEventListener('click', postData); // add event listener


    document.loginForm.submit.addEventListener('click', logInFunction); // add event listener

    document.getElementById("logout").addEventListener('click', logOutFunction); // add event listener

};



var postData = function (e) {
    e.preventDefault();






    var myDescription = document.getElementById('myForm').description.value;

    var myPriority = document.getElementById('myForm').priority.value;


    var todoObject = {
        description: myDescription,
        priority: myPriority
    };

    console.log("This is my todoObject:    " + todoObject.description + " " + todoObject.priority);


    // var jsonString = JSON.stringify(todoObject);

    verbData('POST', '/todos', displayList, todoObject);





};


var logInFunction = function (e) {
    e.preventDefault();

    var myusername = document.getElementById('loginForm').username.value;

    var mypassword = document.getElementById('loginForm').password.value;


    var userObject = {
        username: myusername,
        password: mypassword
    };

    console.log("This is my userObject:    " + userObject.username + " " + userObject.password);


    // var jsonString = JSON.stringify(todoObject);

    verbData('POST', '/user', displayUser, userObject);

};

var logOutFunction = function (e) {
    
    
    
    e.preventDefault();

    console.log("in log out function");
    
    
   
    
    
     getData('/logout', displayUser);

};




var displayList = function (List) {


    clearTableFunction(); // clear previous table


    var eventsList = List;

    var body = document.getElementById('body');
    var table = document.createElement('table');
    table.setAttribute('id', 'tableList');
    var tbody = document.createElement('tbody');

    var header = document.getElementById("content");
    header.appendChild(table);

    // document.body.appendChild(table);
    table.appendChild(tbody);
    for (var i = 0; i < eventsList.length; i++) {
        if (i === 0) {
            var rowOne = document.createElement('tr');
            tbody.appendChild(rowOne);
            var keys = []; //  empty block
            for (var k in eventsList[i]) {
                var thead = document.createElement('th');
                rowOne.appendChild(thead);
                thead.innerHTML = k.toUpperCase();
                keys.push(k);
            }
        }

        var row = document.createElement('tr');
        tbody.appendChild(row);


        for (var j = 0; j < keys.length; j++) {
            var tdata = document.createElement('td');
            row.appendChild(tdata);

            tdata.innerHTML = eventsList[i][keys[j]];




        }

        // ---- create delete button in a loop

        var button = document.createElement('button'); //  to create a delete button
        button.setAttribute("id", eventsList[i].id);
        button.innerHTML = "Delete";
        row.appendChild(button);

        var todoId = eventsList[i].id;

        // ---- create update form in a loop

        /*var form = document.createElement('form');

        form.setAttribute("formId", todoId);
        form.setAttribute("name", todoId);*/

        var inputDescription = document.createElement('input');

        inputDescription.setAttribute("type", "text");
        inputDescription.setAttribute("name", "description");
        inputDescription.setAttribute("todoid", eventsList[i].id);
        inputDescription.setAttribute("value", eventsList[i].description);

        var inputPriority = document.createElement('input');

        inputPriority.setAttribute("type", "text");
        inputPriority.setAttribute("name", "priority");
        inputPriority.setAttribute("todoid", eventsList[i].id);
        inputPriority.setAttribute("value", eventsList[i].priority);

        var inputType = document.createElement('input');

        inputType.setAttribute("type", "submit");
        inputType.setAttribute("todoid", eventsList[i].id);
        inputType.setAttribute("value", "UPDATE TODO");
        inputType.setAttribute("name", "updateButton");



        /*form.appendChild(inputDescription);
        form.appendChild(inputPriority);
        form.appendChild(inputType);*/

        row.appendChild(inputDescription);
        row.appendChild(inputPriority);
        row.appendChild(inputType);

        //row.appendChild(form);





        //console.log(form);

        /* <form name="myForm" id= "myForm">
         Description:<br>
		<input type="text" name="description" value="Work"/>
         <br>Priority:<br>
        <input type="text" name="priority" value="1"/>
        <br>
		<input type="submit" name="submit" value="SAVE TODO" />
	     </form>
        */




        document.getElementById(todoId).addEventListener('click', function (e) {
            deleteData(e.target.todoid)
        });


       



    };

    assignListenersToUpdate();
    
    

}; // end display




// ----------------------------  assigne listeners to update  buttons




var assignListenersToUpdate = function() {

    var updateButtons = document.getElementsByName("updateButton");

    for (var m = 0; m < updateButtons.length; m++) {


        updateButtons[m].addEventListener('click', function (e) {

            updateData(e.target.getAttribute("todoid"));
            console.log(e.target.getAttribute("todoid"));


        });



    }


};


 var displayUser = function(list) {
 console.log(list); 
        
  var user = document.createElement('h2');

  user.setAttribute("id", "user");
     
    if(list[0])  {
     
   

  user.innerHTML = list[0].username + " " + list[0].confirmation.toUpperCase();   
  document.body.appendChild(user);
         
   }
     
     
    else  {user.innerHTML = "Log out was successful";   
    document.body.appendChild(user);}
   


};





var deleteData = function (todoId) {


    console.log(' In deleteData Function  ');

    var todoObject = {
        id: todoId
    };


    verbData('DELETE', '/delete', displayList, todoObject);



};


var updateData = function (id) {


    var todoid = id;
    
    
    var todoObject = {
        id: todoid,
    };




    var descriptions = document.getElementsByName("description");

    for (var m = 0; m < descriptions.length; m++) {

        if (descriptions[m].getAttribute("todoid") === todoid) {
            todoObject.description = descriptions[m].value
        }


    }


    var priorities = document.getElementsByName("priority");

    for (var s = 0; s < descriptions.length; s++) {

        if (priorities[s].getAttribute("todoid") === todoid) {
            todoObject.priority = priorities[s].value
        }


    }








    console.log(' In updateData Function  ');
    console.log(' todoID argument:  ' + todoid);
    








    console.log("My PUT Object: " + todoObject.id, todoObject.description, todoObject.priority);

    verbData('PUT', '/update', displayList, todoObject);



};




// -------------------------------------  GET




function getData(url, callback) { //get
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onreadystatechange = function () {
        if (xhr.status < 400 && xhr.readyState == 4) {
            console.log(xhr.responseText);
            /*callback(JSON.parse(xhr.responseText).data);*/
            callback(JSON.parse(xhr.responseText).data);
        }
    };

    xhr.send(null);
}

// ---------------------------------- POST PUT DELETE


function verbData(method, url, callback, obj) { //put, post, delete
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    if (obj) {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onreadystatechange = function () {
        if (xhr.status < 400 && xhr.readyState == 4) {
            console.log(xhr.responseText);
            if (callback) {
                callback(JSON.parse(xhr.responseText).data);
                getData('/todos', displayList);
            }
        }
    };

    if (obj) {
        xhr.send(JSON.stringify(obj));
    } else {
        xhr.send(null);
    }
}




var clearTableFunction = function () {

    console.log("in clear table function");

    if (document.getElementById("tableList")) {

        var myTable = document.getElementById("tableList");

        myTable.parentNode.removeChild(myTable);

    }
};
