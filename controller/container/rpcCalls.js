const net = require('net')
const homedir = require('os').homedir()



//Main Class
class CLightningRPC {
    constructor(rpcID = homedir + '/.lightning/lightning-rpc') {
        this.rpcID = rpcID
    }

    rpcRequest(command, params) {
        return new Promise((resolve, reject) => {
            var result = Buffer.alloc(0)
            const client = net.createConnection({path: this.rpcID})
            client.on("connect", () => {
                const request = {
                    method: command,
                    params: params,
                    id: 0
                }
                client.write(JSON.stringify(request))
            })

            client.on("data", data => {
                result = Buffer.concat([result, data])
                    try {
                        const resObj = JSON.parse(result.toString())
                        client.end()
                        if (resObj.error) {
                            reject(resObj.error)
                        }
                        else {
                            resolve(resObj.result)
                        }                   
                    }
                    catch (err) {
                        reject(err)
                    }
            })

            client.on("error", err => {
                client.end()
                reject(err)
            })
        })
    }

    listNodes() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listnodes', {})
            .then(data => {
                resolve(data.nodes)
            })
            .catch(reject)
        })
    }

    getNode(id) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listnodes', {id: id})
            .then(data => {
                resolve(data.nodes[0])
            })
            .catch(reject)
        })
    }

    connectToPeer(id, host, port = 9735) {
        if (id.includes('@')) {
            const addr = id.split('@')
            id = addr[0]
            host = addr[1]
        }
        if (host.includes(':')) {
            port = parseInt(host.split(':')[1])
        }
        return new Promise((resolve,reject) => {
            this.rpcRequest('connect', {
                id: id,
                host: host,
                port: port
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }

    listPeers() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listpeers', {})
            .then(data => {
                resolve(data.peers)
            })
            .catch(reject)
        })
    }

    getPeer(id) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listpeers', {
                id: id,
                level: null
            })
            .then(data => {
                resolve(data.peers[0])
            })
            .catch(reject)
        })
    }

    listChannels() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listchannels', {})
            .then(data => {
                resolve(data.channels)
            })
            .catch(reject)
        })
    }

    getChannel(id) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listchannels', {
                short_channel_id: id
            })
            .then(data => {
                resolve(data.channels[0])
            })
            .catch(reject)
        })
    }

    createInvoice(msatoshi, label, description, expiry = null, fallbacks = null, preimage = null) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('invoice', {
                msatoshi: msatoshi,
                label: label,
                description: description,
                expiry: 604800,
                fallbacks: [],
                // preimage: preimage
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }

    listInvoices() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listinvoices', { })
            .then(data => {
                resolve(data.invoices)
            })
            .catch(reject)
        })
    }

    getInvoice(label) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listinvoices', {
                label: label
            })
            .then(data => {
                resolve(data.invoices[0])
            })
            .catch(reject)
        })
    }

    deleteInvoice(label, status = 'unpaid') {
        return new Promise((resolve, reject) => {
            this.rpcRequest('delinvoice', {
                label: label,
                status: status
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }


    decodePay(bolt11, description = null) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('decodepay', {
                bolt11: bolt11,
                description: description
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }


    getInfo() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('getinfo', {})
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }


    pay(bolt11, msatoshi = null, description = null, riskfactor = null, maxfeepercent = null, retry_for = null, maxdelay = null) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('pay', {
                bolt11: bolt11,
                // msatoshi: msatoshi,
                // description: description,
                // riskfactor: riskfactor,
                // maxfeepercent: maxfeepercent,
                // retry_for: retry_for,
                // maxdelay: maxdelay
            })
            .then(data => {
                resolve(data)
            })
            .catch(error=>{
                reject(error)
            })
        })
    }

    payStatus(bolt11){
        return new Promise((resolve,reject)=>{
            this.rpcRequest('paystatus',{
                bolt11: bolt11
            }).then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }
    fundChannel(id, satoshi) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('fundchannel', {
                id: id,
                satoshi: satoshi
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }


    newAddress(addresstype = null) {
        return new Promise((resolve, reject) => {
            this.rpcRequest('newaddr', {
                addresstype: addresstype
            })
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }
    
    listFunds() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listfunds', {})
            .then(data => {
                resolve(data)
            })
            .catch(reject)
        })
    }
    waitinvoice(label){
        return new Promise((resolve,reject)=>{
            this.rpcRequest('waitinvoice',{
                label
            })
            .then(data=>{
                resolve(data)
            })
            .catch(reject)
        })
    }


    getPayment(bolt11){
        return new Promise((resolve, reject) => {
            this.rpcRequest('listpayments', {bolt11:bolt11})
            .then(data => {
                resolve(data.payments)
            })
            .catch(reject)
        })
    }

    listPayments() {
        return new Promise((resolve, reject) => {
            this.rpcRequest('listpayments', {})
            .then(data => {
                resolve(data.payments)
            })
            .catch(reject)
        })
    }


}



module.exports = CLightningRPC
