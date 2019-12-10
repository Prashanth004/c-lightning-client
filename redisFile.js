const express = require("express");
const bodyParser = require("body-parser");
var redis = require("redis"),


    client = redis.createClient();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/api/createData", (req, res) => {
    var { key, value } = req.body;
    client.set(key, value, (data) => {

        res.status(201).send({
            success: 1,
            data: data
        })
    });
})





app.get("/api/:key", (req, res) => {

    const { key } = req.params;

    client.get(key, function (err, reply) {


        if (err) {

            return res.status(500).send({
                success: 0,
                error: err
            })
        }

        console.log(reply.toString());

        if (reply.toString) {
            res.status(200).send({
                success: 1,
                data: reply
            })

        }

    });

});

const port = 6666;
server = app.listen(port, () => console.log(`Server running on port ${port}`));