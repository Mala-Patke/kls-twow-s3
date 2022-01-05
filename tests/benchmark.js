const db = require('../database/dbwrapper');

(async function(){
    let startdate = Date.now();
    let config = await db.getConfig();
    console.log(`Read: ${Date.now() - startdate}ms`);
    startdate = Date.now()
    db.handleConfigUpdate(config)
    console.log(`Write: ${Date.now() - startdate}ms`);
    process.exit();
})();