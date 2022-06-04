const router = require('express').Router()
const res = require('express/lib/response');
const ModbusRTU = require("modbus-serial");
const { simulatorValidator } = require('../utils/validators')
const client = new ModbusRTU();
const { body, validationResult } = require('express-validator');
const { readRegisters } = require('../utils/simulatorfunctions')

router.get('/', async (req, res, next) => {
    let myjson
    res.render('modbusMaster',{myjson})
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
                email: req.body.email,
                messages: req.flash()})
            return
        }
        await readRegisters(req.body.deviceIPsimulator,req.body.deviceIDsimulator, req.body.devicePORTsimulator, req.body.addressSimulator,req.body.quantitySimulator)
        res.render('modbusMaster', {myjson})
        delete myjson
    } catch (error) {
        next(error)
    }
})


// async function readRegisters(ip, id, port,  registerAddress, numberOfRegisters) {
//     dataArray = []
//     try {
//         client.setID(id);
//         await client.connectTCP(ip, {port: port})
//         console.log(`Connection established at ${ip}` )
//         let regs =  await client.readHoldingRegisters(registerAddress, numberOfRegisters);
        
//         for (let i = 0; i < numberOfRegisters  ; i++) {
//             const data= {
//                 "address": 400000 + 1 + i + parseInt(registerAddress),
//                 "value":regs.data[i]
//             }
//             dataArray.push(data)
//         }
// console.log(dataArray  )
//         myjson = JSON.parse(JSON.stringify(dataArray));

//     }
//     catch (e) {
//         console.log('connection error')
//     }
//     finally {
//         client.close();
//     }
// }

module.exports = router