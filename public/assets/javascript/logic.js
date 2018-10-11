$("#btn").click(function(){
    //alert("The paragraph was clicked.");

    $.ajax({
        method: "POST",
        url: "/scrape",
    }).then(function(response){
        console.log("Response: ");
        console.log(response);
        window.location.reload();
// tell the browser to reload here (window.location.reload() is one option)

    })
});

$("#btn2").click(function(){

    $.ajax({
        method: "GET",
        url: "/scrape",

    }).then(function(response){
        console.log("variable");
        console.log(response);

        var headlineContainer = $("#display");

        for (var i = 0 ;i<response.length;i++) {
            
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

            // articleHeader.text(articleTitle);
            // var pageBreak = ("<br>");

            // var headlines = (("<h2>")+articleTitles+("</h2>")); 
            // var newVar = (headlines)+(pageBreak);
            // $('#display').html(newVar);

            articleContainer.append(articleHeader);
            
            headlineContainer.append(articleContainer);
            console.log("Response[i]:");

            console.log(response[i]);
        }
    })
});

//write an ajax request that will "GET" the information on the
//mongodb, and "then" (after the ajax request) use jquery to
//display the results on the DOM.  After this is done, tell 





