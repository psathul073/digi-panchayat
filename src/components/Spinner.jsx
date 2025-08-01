
const Spinner = () => {
    return (
        <div className="flex flex-row justify-center items-center gap-2">
            <div className="relative inline-block w-6 h-6 border-[2px] border-zinc-900 dark:border-zinc-50 rounded-full
        animate-rotation box-border
        after:content-[''] after:absolute after:w-2 after:h-2
        after:bg-zinc-900 dark:after:bg-zinc-50 after:rounded-full
        after:left-3.5 after:top-0
        after:-translate-x-1/2 after:translate-y-1/2 after:transform
        after:box-border"></div>
            <span>Just a sec...</span>
        </div>
    )
}

export default Spinner