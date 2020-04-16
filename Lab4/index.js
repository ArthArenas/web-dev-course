function newSearchYouTube(queryText){
    $("#moreResults").css("visibility", "visible");
    nextPageToken = null;
    currentSearch = queryText;
    console.log(currentSearch);
    clearResults();
    queryYouTubeByPage();
}

function addSearchYouTube(){
    queryYouTubeByPage();
}

function queryYouTubeByPage(){
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search",
        type: "get",
        data: { 
          part: "snippet", 
          maxResults: 10, 
          order: "relevance",
          q: currentSearch,
          type: "video",
          key: "[YOUR_API_KEY]",
          regionCode: "US",
          pageToken: nextPageToken
        },
        success: handleResults,
        error: function(xhr) {
          console.log("there's been an error: " + xhr);
        }
    });
}

var nextPageToken = null;
var currentSearch = null;

function handleResults(res){
    nextPageToken = res.nextPageToken;
    res.items.forEach(result => {
        addVideo({
            title: result.snippet.title,
            thumbnail: result.snippet.thumbnails.default.url,
            url: "https://www.youtube.com/watch?v=" + result.id.videoId,
            channel: "Channel: " + result.snippet.channelTitle,
            description: "Decription: " + result.snippet.description
        });
    });
}

$(document).ready(function(){
    $("#go").on("click", e => {
        e.preventDefault();
        newSearchYouTube($("#searchQueryTxt").val());
    });

    $("#moreResults").on("click", e => {
        e.preventDefault();
        addSearchYouTube();
    });
});

function addVideo(video){
    var newLi = $("<li></li>");
    var newImg = $("<img/>").attr("alt", "No default thumbnail available").attr("src", video.thumbnail);
    var newDiv = $("<div></div>").attr("class", "videoInfo");
    var newChannelP = $("<p></p>").text(video.channel);
    var newDescriptionP = $("<p></p>").text(video.description);
    var newH3 = $("<h3></h3>").text(video.title);

    $(newImg).on("click", null, video, function(e) {
        e.preventDefault();
        openNewTabWithVideo(e.data.url);
    });

    $(newH3).on("click", null, video, function(e) {
        e.preventDefault();
        openNewTabWithVideo(e.data.url);
    });

    newDiv.append(newH3, newChannelP, newDescriptionP);
    newLi.append(newImg, newDiv[0]);
    $("ul")[0].append(newLi[0]);
}

function openNewTabWithVideo(url){
    window.open(url);
}

function clearResults(){
    $("li").remove();
}