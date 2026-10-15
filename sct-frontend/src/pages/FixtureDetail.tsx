import {useParams} from "react-router";
import {useState, useEffect} from "react";
import {API_URL} from "../api/config"
import type {ScoredFixture} from "../types/fixture"

 
export default function FixtureDetail() {
    const {id} = useParams();
          const [loading, setLoading] = useState(true);
          const [error,setError] = useState<string | null>(null);
          const [fixture,setFixture] = useState<ScoredFixture | null>(null);

          useEffect(() => {
              console.log("EFFECT FIRED, id =", id);
            let cancelled = false;
            setLoading(true);
            setError(null);
             console.log("ABOUT TO FETCH:", `${API_URL}/api/fixtures/scored/${id}`);
            fetch(`${API_URL}/api/fixtures/scored/${id}`)
            .then((res) =>{
                   console.log("GOT RESPONSE:", res.status);
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                   console.log("GOT DATA:", data);
                if(cancelled) return;
                setFixture(data)
                setLoading(false)
            })
            .catch((err) => {
                      console.log("FETCH ERROR:", err);

                if(cancelled) return;
                setError(err.message)
                setLoading(false)
            })
            return () => {
                cancelled = true;
            }
        }, [id])
          
    return(
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex 
        items-center justify-center">
            <h1 className="text-2xl font-semibold">Fixture Detail</h1>
        </div>
         
    )
}