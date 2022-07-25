const fs = require("fs");

const read = (path) => {
    const fileContent = fs.readFileSync(path);
    const array = JSON.parse(fileContent);
    return array;
}
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0
}
const readWaitList = (path, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    const keys = Object.keys(xpFile)

    var timeLoaned = (gearName) => {
        if(isEmptyObject(xpFile[gearName].current)) {
            return ''
        }
        const time = new Date().getTime()
        var diff = time - new Date(xpFile[gearName].date)?.getTime()
        var days = Math.floor(diff/1000/60/(60*24))
        var hours = Math.floor(diff / 1000/60/60)
        return days + " Days " + hours +" Hours"
    
    }
    let text = ""
    if(gearName==="ALLGEAR") {
        keys.forEach((gear)=>{
            const waitList = xpFile[gear].waitList
            if(waitList !== []) {
                var count = 1;
                var owner = isEmptyObject(xpFile[gear].current) ? 'No One Holding': `<@${xpFile[gear].current?.id}>`  
                text += `${xpFile[gear].name}: Current User: ${owner} (Time loaned: ${timeLoaned(gear)})\nWaitList: `
                waitList.forEach((name)=>{
                    text += `${count}. <@${name}> \n\t\t`
                    count+=1
                })
            }
            text +='\n\n'
        })
        return text
    }
    
    var waitList = xpFile[gearName].waitList
    console.log('Passed')
    if(waitList !== []) {
        var count = 1;
        var owner = isEmptyObject(xpFile[gearName].current) ?  'No One Holding' : `<@${xpFile[gearName].current?.id}>`
        text += `${xpFile[gearName].name}:\nCurrent User: ${owner} (Time loaned: ${timeLoaned(gearName)})\n WaitList: `
        waitList.forEach((name)=>{
            text += `${count}. <@${name}> \n\t\t`
            count+=1
        })

        return text
    }else {
        return "Nobody queuing leh"
    }

}
const writeWaitList = (path, user, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    var waitList = xpFile[gearName].waitList
    waitList.push(user);
    xpFile[gearName].waitList = waitList
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
}

const removeWaitList = (path, user, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    var waitList = xpFile[gearName].waitList
    waitList = waitList.filter((id)=>id!==user)
    xpFile[gearName].waitList = waitList
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
}

const UpdateCurrentHolder = (path, user, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    var preOwner = !isEmptyObject(xpFile[gearName].current) ? xpFile[gearName].current : "No previous Owner" 
    xpFile[gearName].current = user
    xpFile[gearName].date = new Date()
    removeWaitList(path, user, gearName)
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
    return preOwner
}

const addGear = (path,gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
}

const getGear = (path, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    return xpFile[gearName]
}

module.exports = {
    read,
    readWaitList,
    removeWaitList,
    writeWaitList,
    UpdateCurrentHolder,
    addGear,
    getGear
}