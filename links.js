let https = require('https');
    
function getLinks(room, startDate, endDate ,callback) {
    let data = '';
    https.get('https://yipl.hipchat.com/v2/room/Yipl/history?auth_token=IgQ3KjDDnc4fuUYC6x8KMxpQ7yN9JbhZ0p2m2ssj', res => {
        res.on('data' , d => {
            data += d;
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
                    link: card.url,
                    author: card.author,
                    description: card.description,
                };
                links.push(obj);
            }
        });
    //    console.log(Array.from(links).join('\n'));
        callback(null, links);
    }
}


function getUnique(data, key){
   return data.filter((d, i, v) => v.indexOf(d)==i);
}
