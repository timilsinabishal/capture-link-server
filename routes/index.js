var express = require('express');
var router = express.Router();
var https = require('https');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.param);
    getLinks('Yipl', req.query.startDate, req.query.endDate, function(err, data){
        res.json(data);
    });
});

function getLinks(room, startDate, endDate ,callback) {
    let data = '';
    room =  room || 'Yipl';
    startDate = startDate || moment().startOf('week').isoWeekday(1).format('YYYY-MM-DD');
    endDate = endDate || moment().startOf('week').isoWeekday(6).format('YYYY-MM-DD');

    let url = `https://yipl.hipchat.com/v2/room/${room}/history?auth_token=IgQ3KjDDnc4fuUYC6x8KMxpQ7yN9JbhZ0p2m2ssj&end-date=${startDate}&date=${endDate}&max-results=1000`;

    console.log(url);

    https.get(url, res => {
        res.on('data' , d => {
            data += d;
        });

        res.on('error', err=> {
            console.log(err)
        });

        res.on('end',() => {
            extract(data, callback);
        });
    });

    function extract(data, callback){
        let messages = JSON.parse(data);
        let items = messages.items;
        let links = [];
        items.forEach((item, index) => {
            if(item.attach_to){
                let card = JSON.parse(item.card);
                let obj = {
                    title: card.title,
                    link: card.url,
                    author: items[index-1].from.name,
                    description: card.description,
                    date: new Date(item.date).toDateString()
                };
                links.push(obj);
            }
        });
    //    console.log(Array.from(links).join('\n'));
        callback(null, links);
    }
}

module.exports = router;
