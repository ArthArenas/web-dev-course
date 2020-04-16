function setAll(itemsArr, state) {
    itemsArr.childNodes.forEach(element => {
        element.firstChild.checked = state;
    });
}

function watchForm() {
    var postToDo = document.getElementsByClassName("submitButton")[0];
    var newToDo = document.getElementsByClassName("newTodo form-control")[0];
    var todoList = document.getElementById("todoList");
    postToDo.addEventListener("click", function(e){
        var errorSpan = document.getElementById("errorSpan");
        e.preventDefault();
        if(newToDo.value == ""){
            errorSpan.textContent = "You must enter something here";
        }
        else{
            errorSpan.textContent = "";
            var listElement = document.createElement("li");
            
            var checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            var spanText = document.createElement("span");
            spanText.setAttribute("class", "itemText");
            spanText.textContent = newToDo.value;
            listElement.appendChild(checkbox);
            listElement.appendChild(spanText);

            todoList.appendChild(listElement);
        }
    })

    var clearBtn = document.getElementsByClassName("clearButton btn-info")[0];
    clearBtn.addEventListener("click", function(e){
        e.preventDefault();
        setAll(todoList, false);
    });
    var markAllBtn = document.getElementsByClassName("markAllButton btn-success")[0];
    markAllBtn.addEventListener("click", function(e){
        e.preventDefault();
        setAll(todoList, true);
    });
    var deleteBtn = document.getElementsByClassName("deleteButton btn-danger")[0];    
    deleteBtn.addEventListener("click", function(e){
        e.preventDefault();
        while(todoList.childNodes.length > 0){
            todoList.removeChild(todoList.firstChild);
        }
    });
}

watchForm();