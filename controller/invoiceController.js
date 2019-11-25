const CLightning = require('./container/rpcCalls');
var randomstring = require("randomstring");
const config = require('../config/keys')


const client = new CLightning();

const deleteAllInvLoop = (data) => {
    return new Promise((resolve, reject) => {
        data.forEach(element => {
            client.deleteInvoice(element.label).then(data => {


            }).catch(error => {
                reject(error)
            })
        });
        resolve()
    })
}
const createWait = (label) => {
    return new Promise((resolve, reject) => {

        client.waitinvoice(label)
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })

    })

}

exports.createInvoice = (req, res, next) => {
    // create invoice in the nework
    var label = randomstring.generate({
        length: 12,
        charset: 'alphabetic'
    });
    var description = randomstring.generate({
        length: 20,
        charset: 'alphabetic'
    });
    client.createInvoice(req.body.amountInSatoshi, label, description)
        .then(data => {

            createWait(label).then(data2 => {
                res.io.emit(config.PAYMENT_DONE, {
                    label: label,
                    data: data2
                })


            }).catch(error => {
                console.log("error : ", error)
            })
            client.getInvoice(label).then(data3 => {
                res.status(201).send({
                    sucess: 1,
                    data: data3
                })
            })
                .catch(error => {
                    res.status(201).send({
                        sucess: 1,
                        data: data
                    })
                })


        }).catch(error => {
            console.log("error : ", error)
            res.status(500).send({
                success: 0,
                error: error
            })
        })


}
exports.getAllInvoice = (req, res, next) => {

    //listInvoices
    client.listInvoices().then(data => {
        res.status(200).send({
            success: 1,
            data: data
        })

    }).catch(error => {
        res.status(500).send({
            success: 0,
            error: error
        })
    })

}
exports.deleteAllInvoices = (req, res, next) => {
    client.listInvoices().then(async data => {

        try {
            await deleteAllInvLoop(data);
            res.status(200).send({
                success: 1,
                data: data
            })
        } catch (error) {
            res.status(500).send({
                success: 0,
                error: error
            })
        }


    }).catch(error => {
        res.status(500).send({
            success: 0,
            error: error
        })
    })
}
exports.decodeInvoice = (req, res, next) => {
    //decodePay
    client.decodeinvoice(req.body.bot11).then(data => {
        res.status(200).send({
            success: 1,
            data: data
        })
    }).catch(error => {
        res.status(500).send({
            success: 0,
            error: error
        })
    })
}
exports.getInvoiceStatus = (req, res, next) => {
    client.getInvoice(req.params.label).then(data => {
        res.status(200).send({
            success: 1,
            data: data
        })
    }).catch(error => {
        res.status(500).send({
            success: 0,
            error: error
        })
    })

    //getInvoice
}
exports.deleteInvoice = (req, res, next) => {
    //deleteInvoice
    client.deleteInvoice(req.params.label).then(data => {
        res.status(200).send({
            success: 1,
            data: data
        })
    }).catch(error => {
        res.status(500).send({
            success: 0,
            error: error
        })
    })
}