function Log(s: string): void { out(s) }

function LogWarn(s: string): void
{
    if(PrintWarning) PrintWarning(`${s}\n`); else out(`WARNING ${s}`)
}

function LogError(s: string): void
{
    const traceback = debug.traceback("", 2).toString()
    LogWarn(`${traceback} \n`)
    PrintError ? PrintError(s) : out(`ERROR ${s}`)
}