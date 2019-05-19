require("dotenv").config();

var axios = require("axios");

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var argument = process.argv[2];

var secondArgument = process.argv.slice(3).join(" ");

function mainProgram (argument, secondArgument) {

    switch (argument) {
        case "concert-this":

            searchBands(secondArgument);
            break;

        case "spotify-this-song":
            if (secondArgument) {
                searchSpotify(secondArgument);
                break;
            }

            searchSpotify('Ace of Base');
            break;

        case "movie-this":
            searchMovie(secondArgument);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:

    }
}
mainProgram(argument, secondArgument);



function searchSpotify (song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var jsonData = data.tracks.items[0];

        // * Artist(s)

        console.log("Artists: ")

        for (var i in jsonData.artists){
            console.log("\t" + jsonData.artists[i].name);
        }

            // * The song's name
        console.log("Song: ")
        console.log("\t" + jsonData.name);

            // * A preview link of the song from Spotify

        console.log("Preview link: ")
        console.log("\t" + jsonData.external_urls.spotify);

            // * The album that the song is from

        console.log("Album: ")
        console.log("\t" + jsonData.album.name);
    });
}

function searchBands (band) {
        axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(function (response) {
        var jsonData = response.data;
        

        for (var i in jsonData) {
            // * Name of the venue
            console.log(jsonData[i].venue.name)
            // * Venue location
            console.log(jsonData[i].venue.country + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.city)
            // * Date of the Event(use moment to format this as "MM/DD/YYYY")
            var venueTime = moment(jsonData[i].datetime, moment.ISO_8601);
            console.log(venueTime.format('MM/DD/YYYY'));
            console.log("-----------------------------------")
        }

    });

}

function searchMovie (movie) {

    axios.get("http://www.omdbapi.com/?apikey=f9f7ac8a&t=" + movie).then(function (response) {

    var jsonData = response.data;

    // * Title of the movie.
    console.log("\n" + "Title: " + jsonData.Title);
    // * Year the movie came out.
    console.log("Year: " + jsonData.Year);
    // * IMDB Rating of the movie.
    console.log("IMDB Rating: " + jsonData.imdbRating);
    // * Rotten Tomatoes Rating of the movie.
    for (let rating of jsonData.Ratings){
        if(rating.Source === "Rotten Tomatoes") {
            console.log("Rotten Tomatoes Rating: " + rating.Value)
        }
    }
    // * Country where the movie was produced.
    console.log("Country: " + jsonData.Country);
    // * Language of the movie.
    console.log("Language: " + jsonData.Language);
    // * Plot of the movie.
    console.log("Plot: " + jsonData.Plot);
    // * Actors in the movie.
    console.log("Actors: " + jsonData.Actors);
    });


}

function doWhatItSays() {
    fs.readFile("random.txt", 'utf8', function(err, response) {
        if (err) throw err;
        var array = response.split("\r\n");
        for(let data of array){
            var argument = data.split(",")[0];
            var secondArgument = data.split(",")[1];
            console.log(argument,secondArgument)
            mainProgram(argument, secondArgument);
            console.log("")
        }
    })
}