const CLightning = require('./container/rpcCalls');


const client = new CLightning()

exports.createPayment = (req, res, next) => {
    client.pay(req.body.bolt11).then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
    }).catch(error=>{
        res.status(500).send({
            success : 1,
            error : error
        })
    })
    // create invoice in the nework

}
exports.getAllPayment = (req, res, next) => {
    // listPayments
    client.listPayments().then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
    }).catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
    
}
exports.getPaymentStatus = (req, res, next) =>{
    client.getPayment(req.params.bolt11).then(data=>{
        res.status(200).send({
            success:1,
            data:data
        })
    }).catch(error=>{
        res.status(500).send({
            success:0,
            error:error
        })
    })
}
