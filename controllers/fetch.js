
////////////////////////////////////////////////////////
////////Route to get articles from NPR Archives/////////
////////////////////////////////////////////////////////

// Scrape data from NPR website and save to mongodb
router.get("/scrape", function(req, res) {
  // Grab the body of the html with request
  request("http://www.npr.org/sections/news/archive", function(error, response, html) {
    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);

    // Grab every part of the html that contains a separate article
    $("div.archivelist > article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Get the title and description of every article, and save them as properties of the result object
      // result.title saves entire <a> tag as it appears on NPR website
      result.title = $(element).children("div.item-info").children("h2.title").html();

      // result.description saves text description
			result.description = $(element).children("div.item-info").children("p.teaser").children("a").text();

      // Using our Article model, create a new entry
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {

        // Log any errors
        if (err) {
          console.log(err);
        }

        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });

    // Reload the page so that newly scraped articles will be shown on the page
    res.redirect("/");
  });
});

////////////////////////////////////////////////////////
////////Route to get articles from DB///////////////////
////////////////////////////////////////////////////////


// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the comments associated with it
  .populate("comments")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
