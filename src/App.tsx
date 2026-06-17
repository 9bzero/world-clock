import{useState,useEffect}from'react'
  const ZONES=[
    {city:"New York",tz:"America/New_York",flag:"🇺🇸",lat:40.7},
    {city:"London",tz:"Europe/London",flag:"🇬🇧",lat:51.5},
    {city:"Paris",tz:"Europe/Paris",flag:"🇫🇷",lat:48.9},
    {city:"Dubai",tz:"Asia/Dubai",flag:"🇦🇪",lat:25.2},
    {city:"Riyadh",tz:"Asia/Riyadh",flag:"🇸🇦",lat:24.7},
    {city:"Mumbai",tz:"Asia/Kolkata",flag:"🇮🇳",lat:19.1},
    {city:"Singapore",tz:"Asia/Singapore",flag:"🇸🇬",lat:1.3},
    {city:"Tokyo",tz:"Asia/Tokyo",flag:"🇯🇵",lat:35.7},
    {city:"Sydney",tz:"Australia/Sydney",flag:"🇦🇺",lat:-33.9},
    {city:"Los Angeles",tz:"America/Los_Angeles",flag:"🇺🇸",lat:34.1},
  ]
  function getTime(tz:string){return new Date().toLocaleTimeString("en-US",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true})}
  function getDate(tz:string){return new Date().toLocaleDateString("en-US",{timeZone:tz,weekday:"short",month:"short",day:"numeric"})}
  function getOffset(tz:string){const now=new Date();const utc=now.getTime()+now.getTimezoneOffset()*60000;const local=new Date(utc).toLocaleString("en-US",{timeZone:tz});const diff=(new Date(local).getTime()-utc)/3600000;return(diff>=0?"+":"")+diff.toFixed(0)}
  function isDaytime(tz:string){const h=+new Date().toLocaleString("en-US",{timeZone:tz,hour:"numeric",hour12:false});return h>=6&&h<20}
  export default function App(){
    const[times,setTimes]=useState<{[k:string]:string}>({})
    const[dates,setDates]=useState<{[k:string]:string}>({})
    const[search,setSearch]=useState("")
    const[format,setFormat]=useState<"12"|"24">("12")
    useEffect(()=>{
      const update=()=>{
        const t:{[k:string]:string}={},d:{[k:string]:string}={}
        ZONES.forEach(z=>{t[z.tz]=getTime(z.tz);d[z.tz]=getDate(z.tz)})
        setTimes(t);setDates(d)
      }
      update();const id=setInterval(update,1000)
      return()=>clearInterval(id)
    },[format])
    const filtered=ZONES.filter(z=>z.city.toLowerCase().includes(search.toLowerCase()))
    const home="Asia/Riyadh"
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"0.5rem",color:"#f8fafc"}}>🌍 World Clock</h1>
          <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search city..." style={{background:"#111827",border:"1px solid #334155",borderRadius:8,padding:"0.5rem 0.9rem",color:"#e2e8f0",outline:"none",fontSize:"0.88rem",width:200}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
            {filtered.map(z=>{
              const day=isDaytime(z.tz)
              const isHome=z.tz===home
              return(
                <div key={z.tz} style={{background:isHome?"#0c1a2e":"#111827",border:"1px solid "+(isHome?"#1e40af":"#1e293b"),borderRadius:12,padding:"1.25rem",transition:"border-color 0.3s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
                    <div>
                      <div style={{fontWeight:700,color:"#f1f5f9",fontSize:"0.95rem"}}>{z.flag} {z.city}</div>
                      <div style={{color:"#475569",fontSize:"0.75rem",marginTop:"0.15rem"}}>UTC{getOffset(z.tz)}</div>
                    </div>
                    <div style={{fontSize:"0.8rem",background:day?"#0c2010":"#0c0c1e",borderRadius:6,padding:"0.2rem 0.5rem",color:day?"#22c55e":"#6366f1"}}>{day?"☀️ Day":"🌙 Night"}</div>
                  </div>
                  <div style={{fontWeight:800,fontSize:"1.7rem",color:isHome?"#38bdf8":"#f1f5f9",fontFamily:"JetBrains Mono,monospace",letterSpacing:"0.02em"}}>{times[z.tz]||"--:--:--"}</div>
                  <div style={{color:"#475569",fontSize:"0.78rem",marginTop:"0.25rem"}}>{dates[z.tz]||""}</div>
                  {isHome&&<div style={{marginTop:"0.5rem",fontSize:"0.72rem",color:"#3b82f6",fontWeight:600}}>🏠 Local</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }