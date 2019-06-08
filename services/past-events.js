const db = require('./db');
const moment = require('moment');
const PastEventService = {};
module.exports = PastEventService;

PastEventService.createEvents = (arr) =>{
    
    console.log('the array is...', arr);
    let sql = `
        INSERT INTO past_events
        (user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity)
        VALUES
    `;
    const rowValStrings = [];

    const rowKeys = ['user_id', 'name_', 'description_', 'category', 'url_', 'starts', 'ends', 'price', 'logo', 'venue', 'lat', 'long', 'capacity']
    
    if(!arr.length){
        
        return Promise.resolve();

    } else {

        for(let i = 0; i < arr.length; i++){
            const rowVals = rowKeys.map(key => {
                if (key === 'starts' || key === 'ends'){
                    arr[i][key] = moment(arr[i][key]).format('YYYY-MM-DD') + ' ' + moment(arr[i][key]).format('HH:MM:SS')
                }
                return typeof arr[i][key] === 'number' ? arr[i][key] : `'${arr[i][key]}'`;
            })
            const rowValStr = '(' + rowVals.join(',') + ')';
            rowValStrings.push(rowValStr);
        }

        sql = sql + rowValStrings.join(' ,')

        return db.none(sql);
    }
}