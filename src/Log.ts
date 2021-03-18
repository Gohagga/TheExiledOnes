export const enum Level {
    All,
    Info,
    Warning,
    Error,
    None
}

export const enum LogColor {
    Info        = '|cffafaf0',
    Error       = '|cff05050'

}

export class Log {

    public static Level = Level.Error;

    public static info(...msg: any[]) {
        if (Number(this.Level) > Number(Level.Info)) return;
        print(...msg);
    }

    public static error(...msg: any[]) {
        if (Number(this.Level) > Number(Level.Error)) return;
        msg[0] = LogColor.Error + msg[0];
        print(...msg);
    }
}
