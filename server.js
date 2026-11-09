require("dotenv").config();
const express=require("express"),path=require("path");
const app=express();app.use(express.json({limit:"30kb"}));app.use(express.static(path.join(__dirname,"public")));
const txt=(v,max=900)=>String(v??"").trim().slice(0,max)||"—";
app.post("/api/report",async(req,res)=>{
 const d=req.body||{},hook=process.env.DISCORD_WEBHOOK_URL;
 if(!hook||hook.includes("REMPLACE_MOI"))return res.status(500).json({error:"Webhook Discord non configuré dans le fichier .env"});
 if(!d.date||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d.date))return res.status(400).json({error:"Date invalide."});
 const elo=Number(d.eloNow),daily=Number(d.eloDaily),previous=Number(d.eloPrevious||0);
 if(!Number.isFinite(elo)||elo<0||!Number.isFinite(daily))return res.status(400).json({error:"Vérifie les champs Elo."});
 const delta=elo-previous,pct=previous>0?delta/previous*100:null;
 const fmt=n=>(n>0?"+":"")+n.toLocaleString("fr-FR");
 const embed={username:"Beyrival • Rapport quotidien",embeds:[{title:"📋 Compte rendu Beyrival",description:"Rapport de journée — Roblox Beyrival",color:delta>0?0x57F287:delta<0?0xED4245:0x777BFF,fields:[
 {name:"📅 Date",value:txt(d.date),inline:true},{name:"👤 Responsable",value:txt(d.author),inline:true},
 {name:"🏆 Elo actuel du club",value:elo.toLocaleString("fr-FR"),inline:true},
 {name:"📈 Elo gagné/perdu aujourd’hui",value:fmt(daily),inline:true},
 {name:"📊 Évolution depuis le rapport précédent",value:`${delta>0?"🟢 Gain":delta<0?"🔴 Perte":"⚪ Stable"} : ${fmt(delta)} Elo${pct===null?"":" ("+fmt(pct.toFixed(2))+"%)"}`,inline:false},
 {name:"🗓️ Jour de référence 1",value:txt(d.ref1),inline:true},{name:"🗓️ Jour de référence 2",value:txt(d.ref2),inline:true},
 {name:"🌪️ Événements",value:txt(d.events),inline:false},{name:"🧾 Contrôles DLC",value:txt(d.dlc),inline:false},
 {name:"⚖️ Conditions de rush",value:`CA — H : ${txt(d.caH)} | 1/4 H : ${txt(d.caQuarter)} | Canal : ${txt(d.caCanal)}\nGC — H : ${txt(d.gcH)} | 1/4 H : ${txt(d.gcQuarter)} | Canal : ${txt(d.gcCanal)}`,inline:false},
 {name:"⏰ Pic",value:txt(d.pic),inline:true},{name:"🔢 Nombre de niveaux",value:txt(d.levels),inline:true},{name:"📋 Nombre de lignes",value:txt(d.lines),inline:true},
 {name:"👨‍🍳 Staffing",value:txt(d.staffing),inline:true},{name:"👥 Recrutements",value:txt(d.recruits),inline:true}
 ],timestamp:new Date().toISOString(),footer:{text:"Beyrival • Rapport automatique"}}]};
 try{const r=await fetch(hook,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(embed)});if(!r.ok)return res.status(502).json({error:"Discord a refusé le rapport. Vérifie le webhook."});res.json({success:true,message:"Compte rendu envoyé dans Discord !"});}
 catch(e){res.status(502).json({error:"Impossible de contacter Discord."});}
});
app.listen(process.env.PORT||3000,()=>console.log("Site Beyrival lancé sur http://localhost:3000"));