function Log(...s: string[]): void
{
    if(DEBUG) print(s);
    else
    {
        s.forEach(element => {
            out(element)
        })
    }
}

function LogWarn(s: string): void
{
    if(PrintWarning) PrintWarning(`${s}\n`); else out(`WARNING ${s}`)
}