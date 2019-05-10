const express = require("express"),
    router = express.Router(),
    Subscriber = require("../models/subscribers");

router.post("/subscribe", (req, res) => {
    let validEmailClients = ["gmail.com", "ymail.com", "outlook.com", "mail.com", "aol.com", "business.com", "contarctor.com", "admin.com"];
    let response = new Object();
    let email = req.body.email;
    let checkEmail = "";
    let checkDomain = "";

    response.status = true;
    email = email.toLowerCase();
    //Check email field for emptiness
    if (!email) {
        response.status = false;
        response.message = "Field cannot be empty!"
        res.send(response);
        return;
    }
    // Check for correct format for email
    checkEmail = email.split("@");
    checkDomain = checkEmail[1];
    if (checkEmail.length > 2 || checkEmail.length === 1 || checkDomain.length < 2) {
        response.status = false;
        response.message = "Invalid email format!"
        res.send(response);
        return;
    }
    validEmailClients.forEach((domain) => {
        if (domain === checkDomain) {
            checkEmail = false;
            return;
        }
    });
    if (checkEmail) {
        response.status = false;
        response.message = `${checkDomain} not supported!`
        res.send(response);
        return;
    } else {
        Subscriber.findOne({
            email
        })
            .then((data) => {
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
    }
});

module.exports = router;