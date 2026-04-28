import { useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import "../styles/global.css";

export default function Market(){
  const [data,setData]=useState([]);

  const search=()=>{
    navigator.geolocation.getCurrentPosition(async pos=>{
      const res=await API.post("/waste/match",{
        type:"plastic",
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      });
      setData(res.data);
    });
  };

  return(
    <div className="container">
      <h2>Marketplace</h2>

      <button className="button stagger-1" onClick={search}>
        Find Matches
      </button>

      {data.map((x,i)=>(
        <div key={i} className={`card stagger-${(i % 5) + 2}`}>
          <h3>{x.wasteType}</h3>
          <p>{x.quantity}</p>
          <p>{x.distance} km</p>

          <div style={{background:"#333",height:"8px"}}>
            <div style={{
              width:x.matchScore+"%",
              height:"100%",
              background:"#22c55e"
            }} />
          </div>

          <p>{x.matchScore}% match</p>
        </div>
      ))}

      <Navbar/>
    </div>
  );
}