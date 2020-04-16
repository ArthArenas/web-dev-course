$(document).ready(function(){
    $("#addItemBtn").on("click", function(event){
        event.preventDefault();

        var userInput = $("#newItemName").val();

        var newLi = $("<li></li>");
        var newItemName = $("<p></p>").attr("class", "unchecked_p").text(userInput);
        var newCheckBtn = $("<button></button>").attr("type", "submit").text("check").attr("class", "checkBtn");
        var newDeleteBtn = $("<button></button>").attr("type", "submit").text("delete").attr("class", "deleteBtn");

        console.log(newLi);
        newLi.append(newItemName, newCheckBtn, newDeleteBtn);
        console.log(newLi);
        $("ul")[0].append(newLi[0]);

        $("#newItemName").val("");
    });

    $("#itemsList").on("click", ".checkBtn", function(event){
        event.preventDefault();
        var newClass = $(this).prev().attr("class") === "unchecked_p" ? "checked_p" : "unchecked_p";
        $(this).prev().attr("class", newClass);
    });

    $("#itemsList").on("click", ".deleteBtn", function(event){
        event.preventDefault();
        $(this).parent().remove();
    });
});