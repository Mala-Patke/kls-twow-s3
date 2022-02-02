function decimround(num){
    return Math.round(num*10000)/10000;
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
function calculate(votes, users, responses){
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
        let user = users[entry[0]];
        if(user) ret[`${user.username.split(" ")[0]} ${user.username.split(" ")[1].slice(0,1)}.`] = {
            response: responses[entry[0]],
            avg: `${avg(entry[1])}%`,
            stdev: `${stdev(entry[1])}%`
        }
    }
    return ret;
}

//calculate().then(console.log).then(process.exit)
module.exports = calculate;