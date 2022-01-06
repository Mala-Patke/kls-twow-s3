const db = require('../database/dbwrapper');

(async function(){
    console.time('Read');
    let config = await db.getConfig();
    console.timeLog('Read');

    console.time('Write')
    db.handleConfigUpdate(config)
    console.timeLog('Write');
    
    process.exit();
})();