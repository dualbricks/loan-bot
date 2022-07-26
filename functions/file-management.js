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
        var diff = (time - new Date(xpFile[gearName].date)?.getTime()) / 1000
        var days = Math.floor(diff/86400)
        diff -= days*86400
        var hours = Math.floor(diff / 3600) % 24
        diff -= hours * 3600
        var mins = Math.floor(diff / 60) % 60
        return days + " Days " + hours +" Hours " + mins + " Mins"
    
    }
    let text = ""
    if(gearName==="ALLGEAR") {
        keys.forEach((gear)=>{
            const waitList = xpFile[gear].waitList
            if(waitList !== []) {
                var count = 1;
                var owner = isEmptyObject(xpFile[gear].current) ? 'No One Holding': `${xpFile[gear].current?.nickname}`  
                text += `${xpFile[gear].name}: Current User: ${owner} (Time loaned: ${timeLoaned(gear)})\nWaitList:\n `
                waitList.forEach((obj)=>{
                    text += `${count}. ${obj.nickname} \n`
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
        var owner = isEmptyObject(xpFile[gearName].current) ?  'No One Holding' : `${xpFile[gearName].current?.nickname}`
        text += `${xpFile[gearName].name}:\nCurrent User: ${owner} (Time loaned: ${timeLoaned(gearName)})\n WaitList:\n `
        waitList.forEach((obj)=>{
            text += `${count}. ${obj.nickname} \n`
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
    waitList = waitList.filter((obj)=>obj.id!==user)
    xpFile[gearName].waitList = waitList
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
}

const UpdateCurrentHolder = (path, user, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    var placeholder = xpFile[gearName].current
    var preOwner = !isEmptyObject(xpFile[gearName].current) ? xpFile[gearName].current.nickname : "No previous Owner"
    console.log(preOwner)
    xpFile[gearName].current = user
    xpFile[gearName].date = new Date()
    xpFile[gearName].current['prev'] = preOwner
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
    removeWaitList(path, user.id, gearName)
    return preOwner
}

const addGear = (path,gearName, value, obj) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    xpFile.push({"name": gearName, "value": value})
    fs.writeFileSync(path, JSON.stringify(xpFile,null,2))
    var xp1 = fs.readFileSync('./gear.json')
    var xp1File = JSON.parse(xp1)
    xp1[`${value}`] = obj
    fs.writeFileSync('./gear.json', JSON.stringify(xp1File,null,2))
}

const getGear = (path, gearName) => {
    var xpRead = fs.readFileSync(path);
    var xpFile = JSON.parse(xpRead)
    return xpFile[gearName]
}

const incrementor = (path) => {
    var xpRead = fs.readFileSync(path)
    var xpFile = JSON.parse(xpRead)
    var value  = xpFile["value"]
    xpFile["value"] += 1;
    return value 
}

module.exports = {
    read,
    readWaitList,
    removeWaitList,
    writeWaitList,
    UpdateCurrentHolder,
    addGear,
    getGear,
  isEmptyObject
}
