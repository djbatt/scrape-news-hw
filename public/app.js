
$.ajax({
    method: "GET",
    url: "/articles"
}).then(function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append(`<span data-id="${data[i]._id}"> <br> ${data[i].link} <br> ${data[i].title} <br> ${data[i].summary} </span> <hr>`)
    }
})


$(document).on("click", "span", function() {
    $("#comments").empty();

    var articleId = $(this).attr("data-id");
    console.log(articleId)

    $.ajax({
        method: "GET",
        url: `/articles/${articleId}`
    })
    .then(function(data) {
        console.log(data);

        $("#comments").append(`<h2>${data.title}</h2>`);
        $("#comments").append(`<textarea id="bodyInput" name="body" style="width: 300px; height: 200px; margin: 10px"></textarea>`);
        $("#comments").append(`<button data-id="${data._id}" id="savecomment">Save your comment!</button>`);

        if (data.comment) {
            $("#bodyInput").val(data.comment.body);
        }
    });
})

$(document).on("click", "#savecomment", function() {

    var articleId = $(this).attr("data-id");
    
    $.ajax({
        method: "POST",
        url: `/articles/${articleId}`,
        data: {
            body: $("#bodyInput").val()
        }
    }).then(function(data){
        console.log(data);
        $("#comments").empty();
    })

    $("#bodyInput").val("");
})