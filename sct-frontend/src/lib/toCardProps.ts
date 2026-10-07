import type {ScoredFixture} from "../types/fixture";
import type {FixtureCardProps} from "../components/FixtureCard";


export function toCardProps(item: ScoredFixture) : FixtureCardProps{
  const kickoff = new Date(item.fixture.kickoff);


  return{
    time:kickoff.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }),
    //backend has no venue field,currently shows as the home team name
    venue: item.fixture.homeTeam.name,
    //no status field currently on the backend-every fixture now renders as upcoming,to do later
    status: "upcoming",
    //slice(0,3) is wrong for various different names, i.e New York Knicks, would render as NEW instead of NYK
      homeAbbr: item.fixture.homeTeam.name.slice(0, 3).toUpperCase(),
    homeName: item.fixture.homeTeam.name,
    awayAbbr: item.fixture.awayTeam.name.slice(0, 3).toUpperCase(),
    awayName: item.fixture.awayTeam.name,
  }
}