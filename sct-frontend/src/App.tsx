export default function App(){
  return(
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
     <aside className="w-56 border-r border-zinc-800 p-5 shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="font-semibold">Matchday</span>
      </div>
      <p className="text-[0.65rem] uppercase tracking-widest text-zinc-600 font-medium mb-3">Leagues</p>

      <nav className="flex flex-col gap-1">

        <button className="text-left px-3 py-2.5 rounded-md bg-zinc-900 border-l-2 border-amber-400">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-sm font-medium">NBA</span>
            <span className="text-[0.6rem] uppercase tracking-wider text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">Default

            </span>
          </div>

           <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Basketball</span>
        <span>4</span>
      </div>
        </button>


    <button className="text-left px-3 py-2.5 rounded-md border-l-2 border-transparent hover:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">NFL</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Football</span>
        <span>3</span>
      </div>
    </button>

     <button className="text-left px-3 py-2.5 rounded-md border-l-2 border-transparent hover:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">MLB</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Baseball</span>
        <span>3</span>
      </div>
    </button>

    <button className="text-left px-3 py-2.5 rounded-md border-l-2 border-transparent hover:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-medium">EPL</span>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Soccer</span>
        <span>4</span>
      </div>
    </button>
  </nav>
</aside> 

        
  
      <main className="flex-1 p-8">
        <p className="text-sm text-zinc-500">Main content</p>
        </main>
        </div>
  )
}