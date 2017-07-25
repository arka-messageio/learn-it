/*
Interface to the StudyBlue study site.

StudyBlue does not currently expose an API to interact with it, so we rely mainly on screen scraping to get the data we need.
 */


const cheerio = require("cheerio");
const request = require("request");

exports.search = function(query, callback) {
  request({
    method: "GET",
    url: "https://www.studyblue.com/subject/" + query,
  }, function(error, response, body) {
    if (error) {
      console.log("Error when searching StudyBlue: " + error);
      return;
    }
    if (response.statusCode !== 200) {
      console.log("Expected HTTP status code \"200\", got \"" + response.statusCode + "\".");
      return;
    }
    var $ = cheerio.load(body);
    var results = [];
    $(".results").children(".row.deck").each(function() {
      var a = $(this).find(".row-cell.title a");
      results.push({
        label: a.text().trim(),
        url: "https://www.studyblue.com" + a.attr("href")
      })
    });
    callback(results);
  });
}

exports.cards = function(url, callback) {
  request({
    method: "GET",
    url: url
  }, function(error, response, body) {
    if (error) {
      console.log("Error when parsing cards from StudyBlue: " + error);
      return;
    }
    if (response.statusCode !== 200) {
      console.log("Expected HTTP status code \"200\", got \"" + response.statusCode + "\".");
      return;
    }
    var $ = cheerio.load(body);
    var set = [];
    $('div.card').each(function() {
      var $this = $(this);
      
      var q = $this.find('.front').text().trim();
      
      if (q) {
        set.push({
          q: q,
          a: $this.find('.back').text().replace(/ +/gi, " ").trim()
        });
      }
    });
    callback(set);
  });
}
