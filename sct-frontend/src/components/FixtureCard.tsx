import type { FixtureStatus } from "../types/fixture";

         export interface FixtureCardProps{
           time: string;
  venue: string;
  status: FixtureStatus;
  liveScore?: string;
  homeAbbr: string;
  homeName: string;
  homeScore?: number;
  awayAbbr: string;
  awayName: string;
  awayScore?: number;
          }
interface TeamRowProps{
 abbr: string;
  name: string;
  label: string;
  score?: number;
}

interface StatusBadgeProps {
  status: FixtureStatus;
  liveScore?: string;
  homeScore?: number;
  awayScore?: number;
}
function TeamRow({abbr, name, label, score} : TeamRowProps){
  return(
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[0.6rem] font-bold text-zinc-400">{abbr}</span>

      <div>
      <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-zinc-600">{label}</p>
    </div>
    </div>
    {score !== undefined && (
        <span className="text-2xl font-semibold tabular-nums">{score}</span>
      )}
      </div>
  );
}
function StatusBadge({status, liveScore, homeScore, awayScore} : StatusBadgeProps){
  if(status === "ft"){
    const finalScore =
    homeScore !== undefined && awayScore !== undefined
    ? `${homeScore}-${awayScore}`
    : "";
    return(
      <span className="text-zinc-500 bg-zinc-950/60 border border-zinc-800
      px-2 py-0.5 rounded font-mono text-[0.7rem]">FT * {finalScore}</span>
    )
  
}
if(status === "live"){
  return (
      <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded font-mono text-[0.7rem]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE · {liveScore}
      </span>
    );
}
  return (
    <span className="text-amber-400 bg-amber-400/5 border border-amber-400/30 px-2 py-0.5 rounded text-[0.7rem]">
      Upcoming
    </span>
  );
}
export default function FixtureCard(props: FixtureCardProps){
    const {
    time,
    venue,
    status,
    liveScore,
    homeAbbr,
    homeName,
    homeScore,
    awayAbbr,
    awayName,
    awayScore,
  } = props;
  return(
     <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-100 font-medium">{time}</span>
          <span className="text-zinc-500">{venue}</span>
        </div>
        <StatusBadge
          status={status}
          liveScore={liveScore}
          homeScore={homeScore}
          awayScore={awayScore}
        />
      </div>
       <TeamRow abbr={homeAbbr} name={homeName} label="Home" score={homeScore} />

      <div className="border-t border-zinc-800/60 my-2" />

      <TeamRow abbr={awayAbbr} name={awayName} label="Away" score={awayScore} />
    </div>
  )
}
