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
console.log(dataArray  )
        myjson = JSON.parse(JSON.stringify(dataArray));

    }
    catch (e) {
        console.log('connection error')
    }
    finally {
        client.close();
    }
}

module.exports.readRegisters = readRegisters