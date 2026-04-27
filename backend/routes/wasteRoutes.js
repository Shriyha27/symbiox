const router = require("express").Router();
const Waste = require("../models/Waste");

function distance(a,b,c,d){
  return Math.sqrt((a-c)**2 + (b-d)**2)*111;
}

router.post("/add", async(req,res)=>{
  const w = new Waste(req.body);
  await w.save();
  res.json(w);
});

router.post("/match", async(req,res)=>{
  const {type,lat,lng} = req.body;

  const data = await Waste.find({wasteType:type});

  const result = data.map(w=>{
    const d = distance(lat,lng,w.location.lat,w.location.lng);
    return {
      ...w._doc,
      distance:d.toFixed(2),
      matchScore: Math.max(50,100-d)
    };
  });

  res.json(result);
});

module.exports = router;