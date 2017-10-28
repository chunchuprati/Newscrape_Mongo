// Grab the articles as a json
// $.getJSON("/articles", function (data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#article").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

$('#btnScrapeNewArticles').on("click", function () {
  $.getJSON("././scrape", function (data) {
    for (var i = 0; i < data.length; i++) {
      $('.scrapedArticles').append(renderArticle(data[i]));
    }
    $('.modal .modal-dialog .modal-content .modal-body h3').text("Added " + data.length + " new articles!");
    $('.modal').modal('show');
  })
})

// Function to render the Article div for the scrapped articles. Ideally this should be replaced with express handlebars
function renderArticle(data) {
  var articleData = '<div class="card"><h3 class="card-header primary-color lighten-2  white-text h3.responsive"><a id="article" class="white-text" href="' +
    data.link + '">' + data.heading + '</a>' +
    '<a class="btn btn-success float-right save" data-value = "' +
    data.heading + "|" + data.summary + "|" + data.imageURL + "|" + data.by + "|" + data.link +
    '">SAVE ARTICLE</a></h3>' +
    '<div class="card-body"><p class="card-text black-text">' +
    data.summary + '</p></div></div>';

  return articleData;
}

// Event handler for "Save Article"
$(document).on("click", ".save", function (event) {
  var articleToSave = $(this).closest("a").data("value");
  $.post("././savearticle", {
      data: articleToSave
    },
    function (data, success) {
      // console.log(data);
      $('.scrapedArticles').empty();
      for (var i = 0; i < data.length; i++) {
        $('.scrapedArticles').append(renderArticle(data[i]));
      }
    })
});

// Event handler when the "Saved Articles" page is opened
$("#lnkSavedArticles").on("click", function () {
  console.log("Saved Articles Linked clicked!")
  $.getJSON('/articles', function (data) {
    $('.scrapedArticles').empty();
    for (var i = 0; i < data.length; i++) {
      $('.scrapedArticles').append(renderSavedArticle(data[i]));
    }
  })
});

// Function to render the saved articles. Ideally this should be replaced with express handlebars
function renderSavedArticle(data) {
  var articleData = '<div class="card"><h3 class="card-header primary-color lighten-2  white-text h3.responsive">' + 
                      '<a id="article" class="white-text" href="' +
                      data.link + '">' + data.heading + '</a>' +
                      '<a class="btn btn-success float-right note">ARTICLE NOTES</a>' +
                      '<a class = "btn btn-danger float-right delete" id="' +
                      data._id + '"> DELETE FROM SAVED </a>' + 
                      '</h3>' +
                      '<div class="card-body"><p class="card-text black-text">' +
                      data.summary + '</p></div></div>';

  return articleData;
}

// Event handler for "Detele Article"
$(document).on("click", ".delete", function (event) {
  var articleToDelete = $(this).attr('id');
  // console.log(articleToDelete);
  
});

// Event handler for Saving Note
$('#btnSaveNote').on('click', function () {

});

// Event handler for Deleting Note
$('#btnDeleteNote').on('click', function () {

});

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .done(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});