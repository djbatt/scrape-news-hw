
$.ajax({
    method: "GET",
    url: "/articles"
}).then(function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append(`<span data-id="${data[i]._id}"> <br> ${data[i].link} <br> ${data[i].title} <br> ${data[i].summary} </span> <hr>`)
    }
})


$(document).on("click", "span", function() {
    $("#notes").empty();

    var articleId = $(this).attr("data-id");
    console.log(articleId)

    $.ajax({
        method: "GET",
        url: `/articles/${articleId}`
    })
    .then(function(data) {
        console.log(data);

        $("#notes").append(`<h2>${data.title}</h2>`);
        $("#notes").append(`<textarea id="bodyInput" name="body"></textarea>`);
        $("#notes").append(`<button data-id="${data._id}" id="savenote">Save your note!</button>`);

        if (data.note) {
            $("#bodyInput").val(data.note.body);
        }
    });
})