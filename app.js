const express = require("express");
const bodyParser = require ("body-parser");
const request = require ("request");
const https = require ("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const userFirstName = req.body.firstName;
  const userLastName = req.body.lastName;
  const userEMail = req.body.eMail;

  const userName = userFirstName + " " + userLastName;
  const data ={
    members:[{
      email_address:userEMail,
      status: "subscribed",
      merge_fields: {
        FNAME: userFirstName,
        LNAME:userLastName,
      }
    }
  ]
};

const jsonData = JSON.stringify(data);
const url = "https://us14.api.mailchimp.com/3.0/lists/9e7ca818f6";
const options = {
  method:"POST",
  auth: "aldo1:2f74036441c341675ba9488e28f261dd-us14"

};

const request = https.request(url , options, function(response){
  response.on("data", function(data){
    console.log(JSON.parse(data));

    if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  });
});

  request.write(jsonData);


  request.end();



});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (req,res){
  console.log("Server is running on port 3000");
});
