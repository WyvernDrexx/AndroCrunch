const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers");

router.post("/subscribe", (req, res) => {
    let response = new Object();
    response.status = true;
    let email = req.body.email;
    email = email.toLowerCase();
    console.log("email: " + email);
    if (!email) {
        response.status = false;
        response.message = "Field cannot be empty!"
        res.send(response);
        return;
    }
    Subscriber.findOne({
        email
    })
        .then((data) => {
            console.log(data);
            if (Boolean(data)) {
                response.status = false;
                response.message = "You have already subscribed!"
                res.send(response);
                return;
            } else {
                Subscriber.create({
                    email
                }, (err, data) => {
                    if (err) {
                        response.status = false;
                        response.message = "There was an error subscribing to the newsletter. Try again!";
                        res.send(response);
                    } else {
                        response.message = "Thank you for subscribing!"
                        res.send(response);
                    }
                });
            }
        }).catch((err) => {
            response.status = false;
            response.message = "Unable to subscribe at the moment! Please try again!";
            res.send(response);
        });
});