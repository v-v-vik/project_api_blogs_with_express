import {app} from "./app";
import {SETTINGS} from "./settings";
import {runDB} from "./repositories/db";


const startApp = async () => {
    await runDB();
    app.listen(SETTINGS.PORT, () => {
        console.log(`Server is running on port ${SETTINGS.PORT}`);
    })

}

startApp();