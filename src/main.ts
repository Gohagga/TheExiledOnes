import { InitializeRework } from "BootstrapperRework";
import { Log } from "Log";
import { Timer, Unit } from "w3ts";
// import { Players } from "w3ts/globals";
import { addScriptHook, W3TS_HOOK } from "w3ts/hooks";

// const BUILD_DATE = compiletime(() => new Date().toUTCString());
// const TS_VERSION = compiletime(() => require("typescript").version);
// const TSTL_VERSION = compiletime(() => require("typescript-to-lua").version);

function tsMain() {
    try {

        InitializeRework();
    } catch (ex: any) {
        Log.Error(ex);
    }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);