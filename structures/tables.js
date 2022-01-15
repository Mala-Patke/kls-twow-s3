//Ripped from stackoverflow lmao
function random(seed) {
    let x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
} 

//Not ripped from stackoverflow lmao
function shuffle(arr, seed){
    let ret = [];
    while(arr.length){
        let randelem = arr[Math.floor(random(seed++) * arr.length)];
        arr = arr.filter(e => e!==randelem);
        ret.push(randelem);
    }
    return ret;
}

module.exports = function(resps, round, id, resp_per_tables){
    //Create seed from user and round ids.
    let seed = parseInt(id.replace(/[^0-9]/gi, '')) * parseInt(round.replace(/[^0-9]/gi, ''));

    //Seeded Shuffle Array so each user gets the same random order.
    let responses = shuffle(Object.entries(resps), seed);

    //Create appropriate number of tables
    let tables = [];
    for(let i = 0; i < Math.round(responses.length/resp_per_tables-0.001); i++) {
        tables.push([]);
    }

    //Sort responses into table.
    let iter = 0;
    while(responses.length){
        let resp = responses.pop();
        if(!tables[iter]) iter = 0;
        tables[iter].push(`${resp} (${resp.split(" ").length})`);
        iter++;
    }

    return tables;
}