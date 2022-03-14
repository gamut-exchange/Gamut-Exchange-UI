


<script>
let text = "";
let i = 0;

let amountIn = 200;
let x = 1000;

if (x < 0) {
y = x + 100;
cN = 1/(y/100)*100;
changeP = cN;
} else{
changeP = x + 100;
}

let pbA = amountIn/2;							//pool balance A
let pbB = pbA;									//pool balance B
let k = pbA * pbB								//K of Pool

let spbA = pbA 									//start value pool balance A
let spbB = pbB									//start value pool balance B

let wA = 0.5000000000000000;
let wB = 0.5000000000000000;

let priceA = 1;


while (priceA < 1*changeP/100) {

  //AAMM Swap
  bIn = pbB*0.005;
  exp = (wB-wB*(1-pbB/(pbB+bIn))/(1+pbB/(pbB+bIn)))/(wB+wB*(1-pbB/(pbB+bIn))/(1+pbB/(pbB+bIn)));
  bOut = pbA * (1-(pbB/(pbB+bIn))**exp);
  //Weight Adjustment
  wB = wB - ((pbA/(pbA-bOut)-1)*(1-wA))/(1+wA/wB);
  wA = 1-wB;
  // Pool Balance Adjustment
  pbA -= bOut;
  pbB += bIn;
  // calc price
  priceA = (pbB/wB)/(pbA/wA);
  priceB = 1;

 
  amm_bA = Math.sqrt(k)/Math.sqrt(priceA);
  amm_bB = Math.sqrt(k)*Math.sqrt(priceA);
  
  if(x>0){
  amm_Value = amm_bA * priceA *2;
  hodl_Value = spbA * priceA +spbB;
   aamm_Value = (pbA*priceA + pbB*priceB);
  aamm_edge = (1/amm_Value*aamm_Value-1)*100;
  } else{
  amm_Value = amm_bA * priceB *2;
  hodl_Value = spbA *(1/priceA) + spbB;
   aamm_Value = (pbA*priceB + pbB*(1/priceA));
  aamm_edge = (1/amm_Value*aamm_Value-1)*100;
  }


  text += "<br>AMM:" + amm_Value.toFixed(2) +  "   AAMM:" + aamm_Value.toFixed(2) + "   price;" + priceA.toFixed(2) + "   Gamut Edge:" +aamm_edge.toFixed(4)+"%";
  i++;
}
document.getElementById("demo").innerHTML = text;
</script>

