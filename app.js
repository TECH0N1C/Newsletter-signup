const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const url = "https://us11.api.mailchimp.com/3.0/lists/514ffbfe09"
    const apiKey = "99341ada46b6436c8d69694e453c907c-us11"; 
    const listId = "514ffbfe09";
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email
    var data ={
       members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                EMAIL: email
            }
        }
       ]
    };
    var jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "anything:99341ada46b6436c8d69694e453c907c-us11"
    }
    
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        let data = "";

        response.on("data", function(chunk){
            data += chunk;
        });

        response.on("end", function(){
            console.log(JSON.parse(data));
        });

    });

    // request.write(jsonData);
    request.end();

    // console.log( "Firstname: " + firstName + ", Lastname: " + lastName + ", Email: " + email); 
    // console.log(jsonData);
});

app.post("/failure.html", function(req, res){
    res.redirect("/");
})

app.listen(port, function(){
    console.log("Server is running on port https://localhost:" + port );
});