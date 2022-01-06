const db = require('../database/dbwrapper');

(async function(){
    console.time('t');
    let config = await db.getConfig();
    console.timeLog('t', 'Read');
    db.handleConfigUpdate(config)
    console.timeLog('t', 'Write');
    process.exit();
})();