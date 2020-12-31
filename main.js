const twilio = require('twilio');
const acc_sid = "XXXXXX";
const auth_token = "XXXXXXX";
const request = require('request')
const fs = require('fs');
const cronJob = require('cron').CronJob;
const twilio_client = new twilio(acc_sid, auth_token);
const options = {
    url : 'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all',
    headers: {
        accept: 'application/json',
        authorization: 'apikey XXXXXX'
    }
};
new cronJob({
    cronTime: '*/3 7-19 * * *',
    onTick: function() {
        request(options, callback)
var messageArray = [];
function callback(error, response, body) {
    var lastRead = fs.readFileSync('lastRead.txt', "utf8");
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var featuresArray = info.features;
        featuresArray.map((val, ind) => {
            console.log(ind);
            if (val.properties.created > lastRead) {
                    fs.writeFileSync('lastRead.txt', info.lastPublished,{encoding:'utf8',flag:'w'});
            if (val.properties.mainCategory == "Accident") {
                if (distance(val.geometry.coordinates[1], val.geometry.coordinates[0]) < 60) {
                    messageArray.push(val.properties.headline);
                }
            }
            }
        })
    };

    if (messageArray.length != 0) {

        twilio_client.messages.create({
            body: messageArray.join('\n'),
            to: '+XXXXXX',
            from: '+XXXXXX'
        })
        .then((message) => {console.log("SID: " + message.sid)}).catch(
            e => { console.error('Got an error:', e.code, e.message); });
    } else {
        console.log("No new hazards detected!");
    }    
}
},
start: true,
timeZone: 'Australia/Sydney'
});
function distance(lat2, lon2) {
    const lat1 = -XXXXXXX;
    const lon1 = XXXXXXX;
    //lat1 is the location of sydney
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
