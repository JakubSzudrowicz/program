const router = require('express').Router()
const res = require('express/lib/response');
const ModbusRTU = require("modbus-serial");
const { simulatorValidator } = require('../utils/validators')
const client = new ModbusRTU();
const { body, validationResult } = require('express-validator');


router.get('/', async (req, res, next) => {
    res.render('modbusMaster')
})

router.post('/simulatorReadHoldingRegisters',
simulatorValidator,
 async(req,res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('modbusMaster', {
                deviceIPsimulator: req.body.deviceIPsimulator,
                deviceIDsimulator:req.body.deviceIDsimulator,
                devicePORTsimulator:req.body.devicePORTsimulator,
                messages: req.flash()})
            return
        }
        await readRegisters(
            req.body.deviceIPsimulator,
            req.body.deviceIDsimulator,
            req.body.devicePORTsimulator,
            req.body.addressSimulator,
            req.body.quantitySimulator
        )

        res.render('modbusMaster', {
            myjson,
            deviceIPsimulator: req.body.deviceIPsimulator,
            deviceIDsimulator:req.body.deviceIDsimulator,
            devicePORTsimulator:req.body.devicePORTsimulator,
        })
        delete myjson
    } catch (error) {
        next(error)
    }
})

router.post('/simulatorReadCoils',
simulatorValidator,
 async(req,res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('modbusMaster', {
                deviceIPsimulator: req.body.deviceIPsimulator,
                deviceIDsimulator:req.body.deviceIDsimulator,
                devicePORTsimulator:req.body.devicePORTsimulator,
                messages: req.flash()
            })
            return
        }
        await readCoils(
            req.body.deviceIPsimulator,
            req.body.deviceIDsimulator,
            req.body.devicePORTsimulator,
            req.body.addressSimulator,
            req.body.quantitySimulator
        )

        res.render('modbusMaster', {
            myjson,
            deviceIPsimulator: req.body.deviceIPsimulator,
            deviceIDsimulator:req.body.deviceIDsimulator,
            devicePORTsimulator:req.body.devicePORTsimulator,
        })
        delete myjson
    } catch (error) {
        next(error)
    }
})

router.post('/simulatorWriteCoils',
simulatorValidator,
 async(req,res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('modbusMaster', {
                deviceIPsimulator: req.body.deviceIPsimulator,
                deviceIDsimulator:req.body.deviceIDsimulator,
                devicePORTsimulator:req.body.devicePORTsimulator,
                messages: req.flash()
            })
            return
        }
        dataArray = []
        for( let i = 0; i < req.body.quantitySimulator; i++) {
            iterator = i + 1 
            req.body['WriteCoilsSimulator'+ iterator] = Boolean(req.body['WriteCoilsSimulator'+ iterator])
            dataArray.push(req.body['WriteCoilsSimulator'+ iterator])
        }
        console.log(dataArray)

        await writeCoils(
            req.body.deviceIPsimulator,
            req.body.deviceIDsimulator,
            req.body.devicePORTsimulator,
            req.body.addressSimulator,
            dataArray
        )

        res.render('modbusMaster', {
            // myjson,
            deviceIPsimulator: req.body.deviceIPsimulator,
            deviceIDsimulator:req.body.deviceIDsimulator,
            devicePORTsimulator:req.body.devicePORTsimulator,
        })
        // delete myjson
    } catch (error) {
        next(error)
    }
})

router.post('/simulatorWriteHoldingRegisters',
simulatorValidator,
 async(req,res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('modbusMaster', {
                deviceIPsimulator: req.body.deviceIPsimulator,
                deviceIDsimulator:req.body.deviceIDsimulator,
                devicePORTsimulator:req.body.devicePORTsimulator,
                messages: req.flash()
            })
            return
        }
        dataArray = []
        for( let i = 0; i < req.body.quantitySimulator; i++) {
            iterator = i + 1 
            dataArray.push(req.body['WriteHoldingRegistersSimulator'+ iterator])
        }
        console.log(dataArray)

        await writeHoldingRegisters(
            req.body.deviceIPsimulator,
            req.body.deviceIDsimulator,
            req.body.devicePORTsimulator,
            req.body.addressSimulator,
            dataArray
        )

        res.render('modbusMaster', {
            // myjson,
            deviceIPsimulator: req.body.deviceIPsimulator,
            deviceIDsimulator:req.body.deviceIDsimulator,
            devicePORTsimulator:req.body.devicePORTsimulator,
        })
        // delete myjson
    } catch (error) {
        next(error)
    }
})



async function readCoils(ip, id, port,  registerAddress, numberOfRegisters) {
    dataArray = []
    try {
        client.setID(id);
        await client.connectTCP(ip, {port: port})
        console.log(`Connection established at ${ip}` )
        let regs =  await client.readCoils(registerAddress, numberOfRegisters);
        
        for (let i = 0; i < numberOfRegisters  ; i++) {
            const data= {
                "address":  1 + i + parseInt(registerAddress),
                "value":regs.data[i]
            }
            dataArray.push(data)
        }
        myjson = JSON.parse(JSON.stringify(dataArray));

    }
    catch (e) { 
        console.log('connection error')
    }
    finally {
        client.close();
    }
}

async function readRegisters(ip, id, port,  registerAddress, numberOfRegisters) {
    dataArray = []
    try {
        client.setID(id);
        await client.connectTCP(ip, {port: port})
        console.log(`Connection established at ${ip}` )
        let regs =  await client.readHoldingRegisters(registerAddress, numberOfRegisters);
        
        for (let i = 0; i < numberOfRegisters  ; i++) {
            const data= {
                "address": 400000 + 1 + i + parseInt(registerAddress),
                "value":regs.data[i]
            }
            dataArray.push(data)
        }
        myjson = JSON.parse(JSON.stringify(dataArray));

    }
    catch (e) { 
        console.log('connection error')
    }
    finally {
        client.close();
    }
}

async function writeCoils(ip, id, port,  registerAddress, dataArray) {
    try {
        client.setID(id);
        await client.connectTCP(ip, {port: port})
        console.log(`Connection established at ${ip}` )
        await client.writeCoils(registerAddress, dataArray );

    }
    catch (e) { 
        console.log('connection error')
    }
    finally {
        client.close();
    }
}

async function writeHoldingRegisters(ip, id, port,  registerAddress, dataArray) {
    try {
        client.setID(id);
        await client.connectTCP(ip, {port: port})
        console.log(`Connection established at ${ip}` )
        await client.writeRegisters(registerAddress, dataArray );

    }
    catch (e) { 
        console.log('connection error')
    }
    finally {
        client.close();
    }
}

module.exports = router