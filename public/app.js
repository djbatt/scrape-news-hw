
$.ajax({
    method: "GET",
    url: "/articles"
}).then(function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append(`<span data-id="${data[i]._id}"> <br> ${data[i].link} <br> ${data[i].title} <br> ${data[i].summary} </span> <hr>`)
    }
})
  