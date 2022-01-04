function decimround(num){
    return Math.round(num*100)/100;
}

function avg(arr) {
    return decimround(arr.reduce((p, c) => p + c)/arr.length)
}

function stdev(arr){
    return decimround(
        Math.sqrt(
            avg(
                arr.map(e => (e-avg(arr))*(e-avg(arr)))
            )
        )
    )
}

function percentile(lim, pos){
    return decimround((100/(lim-1) * (lim-pos)));
}

/**
 * Note: This is how he told me to do it. I'm not doing it this way.
 * find every vote containing the specific response ID
 * figure out it's score within the vote
 * average all scores and turn into percent form
 * standard deviation of the set to taste
 */
function calculate(votes){
    let prct = {};
    for(let vote of Object.values(votes)){
        let splitvotes = vote.split(" ").map(e => e.split(","));
        for(let table of splitvotes){
            for(let item of table){
                if(!prct[item]) prct[item] = [percentile(table.length, table.indexOf(item)+1)];
                else prct[item].push(percentile(table.length, table.indexOf(item) + 1))
            }
        }
    }
    let ret = {}; 
    for(let entry of Object.entries(prct)){
        ret[entry[0]] = {
            entry: entry[1],
            avg: avg(entry[1]),
            stdev: stdev(entry[1])
        }
    }
    return ret;
}

//calculate().then(console.log).then(process.exit)
module.exports = calculate;