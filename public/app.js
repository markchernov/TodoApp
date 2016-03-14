


onload = function() {
	console.log("LOADED");
    
    
	document.getElementById('btn')
		.addEventListener('click', function(){
			getData('/todos', /*function(data) {
				document.getElementById('content')
					.innerHTML = data;*/
			displayList);
		});
    
    
    
    
	document.myForm.submit.addEventListener('click', postData);  // add event listener



}



    var postData = function(e) {
 			e.preventDefault();
        
      
        
        
        
        
        var myDescription = document.getElementById('myForm').description.value;
        
        var myPriority = document.getElementById('myForm').priority.value;
        
        
        var todoObject = { description: myDescription, priority: myPriority };
        
        console.log("This is my todoObject:    " + todoObject.description + " " + todoObject.priority);
        
        
       // var jsonString = JSON.stringify(todoObject);
        
        verbData('POST', '/todos', displayList, todoObject);
        
        
                     
                     
                     
    }
                
      






var displayList = function(List) {
    
    
    clearTableFunction();           // clear previous table
    

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
			var keys = [];                                  //  empty block
			for ( var k in eventsList[i]) {
				var thead = document.createElement('th');
				rowOne.appendChild(thead);
				thead.innerHTML = k;
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

        
        var button = document.createElement('button');   //  to create a delete button
            button.setAttribute("id", eventsList[i].id );
            button.innerHTML = "Delete";
            row.appendChild(button);
            
            var todoId = eventsList[i].id;
        
            //var todoObject = {id: todoId};
        
            document.getElementById(todoId).addEventListener('click', function(e) {   
                                                             
                                                             
                                                             
                                                             deleteData(e.target.id)
                                                            
                                                            
            }
                                                            
                                                            );
        
            
	}

};  






       var deleteData = function(todoId)   {

           
       console.log(' In deleteData Function  ');
           
       var todoObject = {id: todoId};   
           
           
       verbData('DELETE', '/delete' , displayList, todoObject);



       };




function getData(url, callback) {                                     //get
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);

	xhr.onreadystatechange = function() {
		if (xhr.status < 400 && xhr.readyState == 4) {
			console.log(xhr.responseText);
			/*callback(JSON.parse(xhr.responseText).data);*/
            callback(JSON.parse(xhr.responseText).data);
		}
	};

	xhr.send(null);
}

function verbData(method, url, callback, obj) {                        //put, post, delete
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);

	if (obj) {
		xhr.setRequestHeader('Content-Type', 'application/json');
	}

	xhr.onreadystatechange = function() {
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

        }};