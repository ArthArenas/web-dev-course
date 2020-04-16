$(document).ready(function(){
    setupAddForm();
    setupQueryForm();
    setupDeleteForm();
    setupUpdateForm();
    refreshData();
})

function refreshData() {
    clearResults();
    queryAllPosts()
    .then(() => {
        populateOptions();
    })
}

function setupQueryForm() {
    $(".form-query > button").on("click", (e) => {
        e.preventDefault();
        queryPostsByAuthor($(".form-query > .input-author").val());
    })
}

function setupAddForm() {
    $(".form-add > button").on("click", (e) => {
        e.preventDefault();
        console.log("clicked");
        var newPost = {
            title: $(".form-add > .input-title").val(),
            author: $(".form-add > .input-author").val(),
            content: $(".form-add > textarea").val(),
            publishDate: Date.now().toString(),
        };
        postNewPost(newPost).then(refreshData);
    })
}

function setupDeleteForm() {
    var deleteSelect = $(".form-delete > select");
    $(".form-delete > button").on("click", (e) => {
        e.preventDefault();
        deletePost($(".form-delete > select").val()).then(refreshData);
    })
}

function setupUpdateForm() {
    var updateSelect = $(".form-update > select");
    $(".form-update > button").on("click", (e) => {
        e.preventDefault();
        var post = {
            id: $(".form-update > select").val(),
            title: $(".form-update > .input-title").val(),
            author: $(".form-update > .input-author").val(),
            content: $(".form-update > textarea").val(),
            publishDate: Date.now().toString()
        }
        updatePost(post).then(refreshData);
    })
}

function updatePost(post){
    return $.ajax({
        url: "http://localhost:8080/blog-posts/" + post.id,
        type: "put",
        data: post,
        success: null,
        error: function(err) {
            console.log("ERROR: " + err);
        }
    });
}

function populateOptions() {
    var deleteSelect = $(".form-delete > select");
    var updateSelect = $(".form-update > select");
    $(deleteSelect).empty();
    $(updateSelect).empty();
    var ids = $("ul > li");
    var titles = $("ul > li > h3");
    for (let i = 0; i < $("ul > li").length; i++) {
        var newOption1 = $("<option></option>").val($(ids[i]).attr("id")).text($(titles[i]).text());        
        var newOption2 = $("<option></option>").val($(ids[i]).attr("id")).text($(titles[i]).text());        
        $(deleteSelect).append(newOption1);
        $(updateSelect).append(newOption2);
    }
}

function queryAllPosts() {
    return $.ajax({
        url: "http://localhost:8080/blog-posts",
        type: "get",
        success: showPosts,
        error: function(err) {
            console.log("ERROR: " + err);
        }
    });
}

function queryPostsByAuthor(author) {
    return $.ajax({
        url: "http://localhost:8080/blog-post" + "?author=" + author,
        type: "get",
        success: showPosts,
        error: function(err) {
            console.log("ERROR: " + err);
        }
    });
}

function postNewPost(post) {
    return $.ajax({
        url: "http://localhost:8080/blog-posts",
        type: "post",
        data: post,
        success: null,
        error: function(err) {
            console.log("ERROR: " + err);
        }
    });
}

function deletePost(id) {
    return $.ajax({
        url: "http://localhost:8080/blog-posts/" + id,
        type: "delete",
        data: {
            id: id
        },
        success: null,
        error: function(err) {
            console.log("ERROR: " + err);
        }
    });
}

function showPosts(res) {
    console.log("showing posts");
    if(Array.isArray(res)){
        res.forEach(post => {
            appendPost(post);
        });
    }
}

function appendPost(post) {
    var li = $("<li></li>").attr("id", post.id) ;
    var title = $("<h3></h3>").text(post.title);
    var content = $("<p></p>").attr("class", "content").text(post.content);
    var author = $("<b></b>").attr("class", "author").text("by " + post.author);
    var date = $("<p></p>").attr("class", "date").text("Publish date: " + Date(post.publishDate).toString() );

    var curList = $("ul")[0];

    li.append(title[0], content[0], author[0], date[0]);
    curList.append(li[0]);
}

function clearResults() {
    $("ul").empty();
}