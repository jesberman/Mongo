//code that activates when user clicks on the "#btn" button
$("#btn").click(function(){
    //ajax call that makes a post request to the "/scrape" route 
    $.ajax({
        //defines the method as "post"
        method: "POST",
        //defines the route as "/scrape"
        url: "/scrape",
        //tells the code to run the following function after the ajax call is made
    }).then(function(response){
        console.log("Response: ");
        console.log(response);
        //tells the code to reload the page
        window.location.reload();
    })
});

//code that activates when user clicks on the "#btn2" button
$("#btn2").click(function(){
    //ajax call that makes a get request to the "/scrape" route 
    $.ajax({
        //defines the method as "get"
        method: "GET",
        //defines the route as "/scrape"
        url: "/scrape",
    }).then(function(response){
        console.log("variable");
        console.log(response);
        var headlineContainer = $("#display");
        // for (var i = 0 ;i<response.length;i++) {
        for (var i = 0 ;i<10;i++) {

            var articleID = response[i];

            console.log("Article ID: ")
            console.log(articleID);
            
            var articleContainer = $("<div>");
            articleContainer.addClass("headline-container");
            var articleTitle = response[i].title;
            var articleHeader = $("<h2>");
            articleHeader.addClass("headline");


            var articleLink = $("<a>");
            articleLink.attr("href",response[i].link);
            articleLink.attr("data-id",response[i]._id);

            articleLink.text(articleTitle);
            articleHeader.append(articleLink);

            var pageBreak = $("<br>");
            var newDiv = $("<div>");

            var postCommentButton = $("<button>");
            postCommentButton.addClass("post-comment");
            postCommentButton.attr("data-id", response[i]._id);
            $(".post-comment").text("Post Comment");

            var seeCommentsButton = $("<button>");
            seeCommentsButton.addClass("see-comments");
            seeCommentsButton.attr("data-id", response[i]._id);
            $(".see-comments").text("See Comments");

            var textBox = $("<textarea>");
            textBox.addClass("textBox");
            textBox.attr("data-id", response[i]._id);

            var commentsBox = $("<div>");
            commentsBox.addClass("comments-box");
            commentsBox.attr("id", response[i]._id);


            var idContainer =$("<p>");
            idContainer.append(articleID);

            articleHeader.append(pageBreak);

            articleHeader.append(postCommentButton);            
            articleHeader.append(seeCommentsButton);
            // articleHeader.append(pageBreak);
            articleHeader.append(textBox);

            articleHeader.append(commentsBox);
            
            articleHeader.append(idContainer);


            articleContainer.append(articleHeader);
            
            headlineContainer.append(articleContainer);
            console.log("Response[i]:");

            console.log(response[i]);
        }
    })
});



$(document).on("click", ".post-comment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/scrape/" + thisId,
      data: {
        // Value taken from note textarea
        body: $(".textBox[data-id="+thisId+"]").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $(".textBox").val("");
  });
  
$(document).on("click", ".see-comments", function(){
    
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/scrape/" + thisId
    })
    .then(function(data){
        $("#"+thisId).text("");
        for (i=0;i<data[0].note.length;i++){
        $("#"+thisId).append(data[0].note[i]);

        $("#"+thisId).css("background-color", "rgb(55, 184, 113)");

        }
    });
})
