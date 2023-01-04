/* Global */{
  var currentSection= 0,
  hideMenu= true;
  chartsRef= [],
  orderHistory= null,
  oldestBalance= null

  // Setting persisted themeMode
  document.addEventListener("DOMContentLoaded", ()=>{
    let theme= localStorage.getItem("theme")

    if(theme==0) ChangeThemeMode(0, false)

    else if(theme==1) ChangeThemeMode(1, false)

    else localStorage.setItem("theme", 2)
  })
  
  // Setting persisted data
  window.onload = function(){
    // values to html color elements
    if(localStorage.getItem("themeColors")!=null){
      let customColors= (localStorage.getItem("themeColors")).split(","),
      $colors= document.querySelectorAll(".customColor")
      
      for (let i= 0; i < $colors.length; i++) {
        $colors[i].value= customColors[i]
      }
    }

    // order history && generating charts
    if(localStorage.getItem("orderH")!= null){
      orderHistory= []
      
      JSON.parse(localStorage.getItem("orderH")).forEach(operation=>{
        orderHistory.push(operation)
      })
      
      GenerateChartsData()
    }
  };

  function RoundNumber(number, decimals=2){
    return Number(number.toFixed(decimals))
  }
}

/* Nav Scope */{
  function HideMenu(booleanValue){
    if(booleanValue){
      document.querySelector(".nav__body").classList.add("display--n");
    }
    else{
      document.querySelector(".nav__body").classList.remove("display--n");
    }
  }

  document.querySelector(".navToggler").onclick= function(){
    document.querySelector(".nav__body").classList.toggle("display--n");
  };
}


/* Sections scope */{
  let $sections= document.querySelectorAll(".section"),
  $navItems= document.querySelectorAll(".nav__item"),
  $sectionCards= document.querySelectorAll(".btn--section");
  

  function ToggleSection(index){
    let showedLangs= document.querySelector(".lang")

    /* If operation data container is showed hide it */
    let $opDataContainer= document.querySelector(".newOpContainer").classList
    if(!$opDataContainer.contains("display--n")) $opDataContainer.toggle("display--n")


    /* Toggle section functionality */
    if(currentSection== index){
      alert("Current section!");
      return;
    }
    else{
      $sections[index].classList.toggle("display--n")
      $sections[currentSection].classList.toggle("display--n")
    }
    currentSection= index

    if(hideMenu) HideMenu(true)
    if(showedLangs.hasAttribute("open")) showedLangs.removeAttribute("open")
  }


  for (let i = 0; i < $navItems.length; i++) {
    if (i<4) {
      $navItems[i].onclick= function(){
        ToggleSection(i);
      }
    }
    else if(i==4){
      continue;
    }
    else{
      $navItems[i].onclick= function(){
        ToggleSection(i-1);
      }
    }
  }

  for (let i = 0; i < $sectionCards.length; i++) {
    $sectionCards[i].onclick= function(){
      ToggleSection(i+1);
    }
  }
}


/* Responsive scope */{
}


/* Theme mode scope */{
  let $root= document.querySelector(":root"),
  $colors= document.querySelectorAll(".customColor"),
  $defaultColors= getComputedStyle($root),
  $themeBtns= document.querySelectorAll(".btn--theme");
 
  
  function TemporalThemeMode(){
    $themeBtns.forEach(e=>{e.disabled= true})

    // variables
    let $currentColors=[
      getComputedStyle($root).getPropertyValue("--mainColor"),
      getComputedStyle($root).getPropertyValue("--secondColor"),
      getComputedStyle($root).getPropertyValue("--color1"),
      getComputedStyle($root).getPropertyValue("--color2")
    ]
    

    // set new values
    $root.style.setProperty("--mainColor", $colors[0].value);
    $root.style.setProperty("--secondColor", $colors[1].value);
    $root.style.setProperty("--color1", $colors[2].value);
    $root.style.setProperty("--color2", $colors[3].value);
    

    // countdown to restore colors
    setTimeout(function(){
      $root.style.setProperty("--mainColor", $currentColors[0]);
      $root.style.setProperty("--secondColor", $currentColors[1]);
      $root.style.setProperty("--color1", $currentColors[2]);
      $root.style.setProperty("--color2", $currentColors[3]);

      $themeBtns.forEach(e=>{e.removeAttribute("disabled")})
    }, 4000);
  }

  function ChangeThemeMode(themeMode, isManualTheme= true, isImportedColor= false){
    // CustomMode= 0, DarkMode= 1, LightMode=2
    localStorage.setItem("theme", themeMode)


    if( themeMode== 0){
      if(isManualTheme){
        document.querySelector(".customThemeContainer").classList.toggle("display--n")

        $root.style.setProperty("--mainColor", $colors[0].value);
        $root.style.setProperty("--secondColor", $colors[1].value);
        $root.style.setProperty("--color1", $colors[2].value);
        $root.style.setProperty("--color2", $colors[3].value);
        
        /* saving custom colors */
        localStorage.setItem("themeColors", [$colors[0].value, $colors[1].value, $colors[2].value, $colors[3].value]);

        if(orderHistory!= null) GenerateCharts()
      }
      else{
        let customColors= (localStorage.getItem("themeColors")).split(",")
        
        
        if(isImportedColor){
          for (let i= 0; i < $colors.length; i++) {
            $colors[i].value= customColors[i]
          }
        }
        
        
        $root.style.setProperty("--mainColor", customColors[0]);
        $root.style.setProperty("--secondColor", customColors[1]);
        $root.style.setProperty("--color1", customColors[2]);
        $root.style.setProperty("--color2", customColors[3]);
      }
    }

    else{
      if(themeMode== 1){
        $root.style.setProperty("--mainColor", $defaultColors.getPropertyValue("--themeColor2"));
        $root.style.setProperty("--secondColor", $defaultColors.getPropertyValue("--themeColor1"));
      }
      else{
        $root.style.setProperty("--mainColor", $defaultColors.getPropertyValue("--themeColor1"));
        $root.style.setProperty("--secondColor", $defaultColors.getPropertyValue("--themeColor2"));
      }
      
      $root.style.setProperty("--color1", $defaultColors.getPropertyValue("--themeColor3"));
      $root.style.setProperty("--color2", $defaultColors.getPropertyValue("--themeColor4"));
      
      if(isManualTheme && orderHistory!= null) GenerateCharts()
    }
  }
  
  $themeBtns.forEach(item=>{
    if(item.dataset.mode=="temp") item.onclick=()=>TemporalThemeMode()
    else if(item.dataset.mode=="custom") item.onclick=()=>document.querySelector(".customThemeContainer").classList.toggle("display--n")
    else item.onclick=()=> ChangeThemeMode(parseInt(item.dataset.mode))
  })
}


/* Data manager scope */{
  let $importFile= document.querySelector(".excelInput"),
  $format= document.querySelector(".dataFormat")
  $exportBtn= document.querySelector(".btn--exportData"),
  $dataExport= document.querySelector(".dataExport"),
  $newOpBtns= document.querySelectorAll(".btn--newContainer"),
  $opDataBtns= document.querySelectorAll(".btn--opData");


  function SaveOperationData(){
    let opData= [], formatedOp=[],
    addOperation= true,
    $newOpItems= document.querySelectorAll(".newOp__item"),
    $pnlType= document.querySelector(".newOp__item--pnl")

    // Temporal operation data
    $newOpItems.forEach((e,i) =>{
      if(e.value!=""){
        if(i!=6){ // not date input
          if(i!=7){ // not time input
            // $PnL or $PnL
            if(i==5){
              if($pnlType.value=="%") opData[i]= RoundNumber(Number(e.value)/100)

              else if($pnlType.value=="$") opData[i]= RoundNumber(Number(e.value) /(opData[2]*opData[3]))

              else{
                opData[i]= RoundNumber(Number(e.value))
                addOperation= false
              }
            }
            else if(e.dataset.type=="number") opData[i]= RoundNumber(Number(e.value))
            else opData[i]= e.value
          }
        }
        
        else{ // create dateTime value
          try {
            let d1, dateString= `${e.value} ${$newOpItems[i+1].value}:00Z`
            
            d1= new Date(dateString)
            d1= new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours()+(d1.getTimezoneOffset()/60), d1.getMinutes(), 0))
            
            d1= d1.toJSON().replace("T"," ").replace(".000Z","")
            opData[i]= d1
          }
          catch{ addOperation= false }
        }
      }
      
      else addOperation= false
      // TODO if some browser dont save correctly the tempOp data, add opData[]= null
    })

    if(opData.includes(null) || !(opData[3]>0)) addOperation= false

    formatedOp=[
      opData[0], // category
      opData[1], // marginType
      opData[2], // leverage
      opData[3], // margin
      opData[4], // direction
      opData[5], // realized PnL
      opData[6], // closeDateTime
      opData[8], // funding fees
    ]
    
    if(formatedOp[4]=="true") formatedOp[4]= true
    else if(formatedOp[4]=="false") formatedOp[4]= false
    else formatedOp[4]==null

    if(addOperation){
      AddNewOperations([JSON.stringify(formatedOp),])
      localStorage.removeItem("tempOp")
      ClearOpInputs()
      document.querySelector(".newOpContainer").classList.toggle("display--n")
    }

    else{
      localStorage.setItem("tempOp", JSON.stringify(formatedOp))
      alert("Data saved!\n\tFill in the missing data to graph the operation")
    }
  }

  async function ImportData(){
    let importedData= []
    
    try {
      /* BingX order history file */
      if($format.value== "bingx"){
        /* bingX orderH data order +indexes
        2 category
        3 marginType
        4 margin
        5 leverage
        6 openPrice
        7 closePrice
        8 direction
        // ...
        12 openDateTime
        13 closeDateTime
        14 fundingFee
        // ...
        16 realized pnl
        */

        let fileData= await readXlsxFile($importFile.files[0]);
        for(let i=2; i<fileData.length; i++){
          // bingX orderH op to TOHSG orderH op
          let fileOp=[
            fileData[i][2], // 0 category
            fileData[i][3], // 1 marginType
            fileData[i][5], // 2 leverage
            fileData[i][4], // 3 margin
            fileData[i][8], // 4 direction
            fileData[i][16], // 5 realized PnL
            ConvertDate(fileData[i][13]), // 6
            fileData[i][14], // 7 fudingFee
          ]

          if(fileOp[4]=="long") fileOp[4]= true
          else fileOp[4]= false

          // $PnL to %PnL
          fileOp[5]= RoundNumber(fileOp[5]/(fileOp[2]*fileOp[3]))
          
          importedData.push(JSON.stringify(fileOp))
        }

        AddNewOperations(importedData)
      }
      
      /* TradingOHSG file */
      else if($format.value== "tohsg"){
        let fileData = $importFile.files[0],
        
        fileReader = new FileReader();
        fileReader.readAsText(fileData); 
        
        fileReader.onload = function() {
          try {
            if(fileData["name"].includes("theme")){
              localStorage.setItem("themeColors", fileReader.result);
              ChangeThemeMode(0, false, true)
              
              if(orderHistory!= null) GenerateCharts()
            }
  
            else{
              JSON.parse(fileReader.result).forEach(operation => {
                importedData.push(JSON.stringify(operation))
              });
  
              AddNewOperations(importedData)
            }
          }
          catch(e){
            console.log("TOHSG error\n",e)
            alert("Action not completed! \n\tTry again or Select another file.")
          }
        };
      }
    }
    
    catch(e){
      console.log("BingX error\n",e)
      alert("Action not completed! \n\tTry again or Select another file.")
    }
  }

  function AddNewOperations(importedData){
    let tempOH=[]

    if(orderHistory== null) orderHistory= []
    
    /* Adding not repeated operations to OrderHistory */
    orderHistory.forEach(operation => {
      tempOH.push(JSON.stringify(operation))  
    });
    
    importedData.forEach(operation =>{
      if(!(tempOH.includes(operation))){
        tempOH.push(operation)
        orderHistory.push(JSON.parse(operation))
      }
    })
    
    // Persisting data
    localStorage.setItem("orderH", JSON.stringify(orderHistory))


    GenerateChartsData()
    
    alert("Action success!\n\tOperation/s added without errors")
  }

  function ConvertDate(timeString, isToUTC0=true){
    let finalDate
    timeString= timeString.toJSON()
    
    if(isToUTC0){
      let year= timeString.slice(0, 4),
      month= Number(timeString.slice(5, 7)),
      day= timeString.slice(8, 10),
      hour= timeString.slice(11, 13),
      minute= timeString.slice(14, 16),
      second= timeString.slice(17, 19)
      /* Diference value comes from reference
        utc+x= x  &&  utc-x= -x */
      utcDiference= 8;

      finalDate= (new Date(Date.UTC(year, month-1, day, hour-(utcDiference), minute, second))).toJSON();
    }
    else{
      /* TODO
      else dont used */
      finalDate= (new Date(timeString)).toJSON()
    }
    
    finalDate= finalDate.slice(0, -5).replace("T", " ")
    return finalDate
  }

  function ExportData(){
    let content, fileName, date, exportFile= false

    if($dataExport.value=="theme"){
      if(localStorage.getItem("theme")== 0){
        exportFile= true
        fileName= "themeMode"
        content= localStorage.getItem("themeColors")
      }
      else{
        alert("Action not completed!\n\tThere is currently no custom theme selected.")
      }
    }
    
    else if($dataExport.value=="tohsg"){
      if(orderHistory!=null){
        fileName= "data"
        exportFile= true
        content= JSON.stringify(orderHistory)
      }
      else{
        alert("Action not completed!\n\tThere is currently no existing data to export.")
      }
    }
    
    if(exportFile){
      date= new Date()
      date= `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`

      let link= document.createElement("a"),
      /* content= customValue, */
      blob= new Blob([content],{type: "octect/stream"}),
      url= window.URL.createObjectURL(blob);
  
      link.href= url
      // link.download= `TOHSG_${uid}.${fileName}_${date}.txt`
      link.download= `TOHSG_${fileName}_${date}.txt`
      link.click()
      window.URL.revokeObjectURL(url);
    }
  }

  function ClearOpInputs(){
    let $inputs= document.querySelectorAll(".newOp__item")
    
    $inputs.forEach(e=> {
      if(!e.disabled) e.value=""
    })

    document.querySelector(".newOp__item--pnl").value= ""
  }

  function SetOpInputsData(opData){
    let $inputs= document.querySelectorAll(".newOp__item")
    opData= JSON.parse(opData)

    /* setting inputs values */
    opData.forEach((e,i)=>{
      if(e!=null){
        if(i!=7){ // not time imput
          if(i==6){ //dateTime
            $inputs[i].value= e.slice(0,10)
            $inputs[i+1].value= e.slice(11, 16)
          }
          else $inputs[i].value= e
        }
        else $inputs[i+1].value= e
      }
    })
  }
  

  // Import data "button"
  $importFile.addEventListener("change", function(){
    if($format.value!="none") ImportData()
    
    else{
      alert("No format selected!\n\tA format is required to perform data import.")
    }
    
    this.value= ""
  })
  
  // Export data button
  $exportBtn.addEventListener("click", function(){
    if($dataExport.value!="none"){
      ExportData()
    }
    else{
      alert("Action not completed!\n\tSelect some data to export.")
    }
  })

  
  /* Operation container toggler buttons */
  $newOpBtns[0].onclick= ()=> {
    if(localStorage.getItem("tempOp")!= null) SetOpInputsData(localStorage.getItem("tempOp"))

    document.querySelector(".newOpContainer").classList.toggle("display--n")
  }
  $newOpBtns[1].onclick= ()=> {
    document.querySelector(".newOpContainer").classList.toggle("display--n")
  }

  /* Operation container action buttons */
  $opDataBtns[0].onclick= ()=> SaveOperationData()
  $opDataBtns[1].onclick= ()=> ClearOpInputs()

  /* Delete data */
  document.querySelector(".btn--deleteData").onclick= ()=>{
    if(localStorage.getItem("orderH")!=null){
      if(confirm("DATA DELETION!\n\tAre you sure to want to proceed with the action?")){
        orderHistory= null
        localStorage.removeItem("orderH")
        localStorage.removeItem("tempOp")
        localStorage.removeItem("oldestBalance")

        chartsRef.forEach(chart=>{
          if(chart!=undefined) chart.destroy()
        })

        document.querySelector(".opsTable__body").innerHTML=""
  
        alert("Action success!\n\tAll information has been completely removed")
      }
    }
    else alert("Action not completed!\n\tNo existing data to delete")
  }
}

/* Charts Scope */{
  let $charts= document.querySelectorAll(".chart"),
  chartsData= {}

  function GenerateChartsData(){
    // operation profit evolution
    let opProfit, opDate, opsProfitsEvolution, 

    // operations average
    opOnePercent,
    oHLength= orderHistory.length,
    tpOps=0, slOps=0, beOps=0,
    tpProfits=0, slProfits=0, beProfits=0,

    // directional average
    longOps= 0, shortOps= 0,
    longOpsProfit= 0, shortOpsProfit= 0,

    // directional
    tpLongOps= 0, slLongOps= 0, beLongOps= 0,
    tpLongOpsProfit= 0, slLongOpsProfit= 0, beLongOpsProfit= 0,
    
    tpShortOps= 0, slShortOps= 0, beShortOps= 0,
    tpShortOpsProfit= 0, slShortOpsProfit= 0/* , beShortOpsProfit= 0 */


    /* cleaning charts data */
    chartsData["profitsEvolution"]=[[],[]]
    chartsData["efectivity"]= [["TP %", "SL %", "BE %"],[]]
    chartsData["profitAverage"]= [["TP $", "SL $", "BE $"],[]]
    chartsData["directionalAverage"]= [["Long %","Short %"],[]]
    chartsData["directionalProfits"]= [["Longs $","Shorts $"], []]
    chartsData["longsAverage"]= [["TP %", "SL %", "BE %"],[]]
    chartsData["shortsAverage"]= [["TP %", "SL %", "BE %"],[]]
    chartsData["longsAverageProfits"]= [["TP $", "SL $", "BE $"],[]]
    chartsData["shortsAverageProfits"]= [["TP $", "SL $"],[]]


    
    /* Oldest balance */{
      if(localStorage.getItem("oldestBalance")!=null) oldestBalance= Number(localStorage.getItem("oldestBalance"))

      else while(true){
        oldestBalance= RoundNumber(parseFloat(prompt("Insert your current account balance:")))

        if(!isNaN(oldestBalance)){
          if(oldestBalance>0){
            if(confirm(`Confirming the balance!\n\tIs this the correct value?: $${oldestBalance}`)) break
          }
          else alert("Action not completed! \n\tBalance must be a value greater than zero.")
        }
        else alert("Action not completed! \n\tBalance must be a numeric value.")
      }
    }

    /* Data generation */
    orderHistory.forEach((op, index)=>{
      /* Operations profits evolution */{
        opProfit= RoundNumber((op[2]*op[3]*op[5]) +((op[2]*op[3]*0.0045*-1) +op[7]))

        opDate= new Date(op[7]+"z")
        opDate= `${opDate.getMonth()+1}.${opDate.getDate()}`

        // New acumulated profit
        opsProfitsEvolution= opProfit
        if(index!=0) opsProfitsEvolution= RoundNumber(opsProfitsEvolution +chartsData["profitsEvolution"][1][chartsData["profitsEvolution"][1].length -1])
        
        else if(localStorage.getItem("oldestBalance")!=null) opsProfitsEvolution= RoundNumber(opsProfitsEvolution +oldestBalance)
        
        /* setting chart data  */
        chartsData["profitsEvolution"][0].push(opDate)
        chartsData["profitsEvolution"][1].push(opsProfitsEvolution)
      }
      
      /* Operations efectivity average */{
        opOnePercent= (op[2]*op[3])/100
         
        if(opProfit> opOnePercent) tpOps++
        else if(opProfit< 0) slOps++
        else beOps++
        
        if(index+1== oHLength){
          chartsData["efectivity"][1].push(RoundNumber((tpOps*100)/oHLength))
          
          chartsData["efectivity"][1].push(RoundNumber((slOps*100)/oHLength))
          
          chartsData["efectivity"][1].push(RoundNumber((beOps*100)/oHLength))
        }
      }
      
      /* Operations profits average */{
        if(opProfit> opOnePercent) tpProfits+= opProfit
        else if(opProfit< 0) slProfits+= opProfit
        else beProfits+= opProfit
        
        if(index+1== oHLength){
          chartsData["profitAverage"][1].push(RoundNumber(tpProfits/tpOps))
          chartsData["profitAverage"][1].push(RoundNumber(slProfits/slOps))
          chartsData["profitAverage"][1].push(RoundNumber(beProfits/beOps))
        }
      }

      /* Directional average stats */{
        if(op[4]){ //is long op?
          longOps++
          longOpsProfit+= opProfit
        }

        else{
          shortOps++
          shortOpsProfit+= opProfit
        }

        /* setting chart data */
        if(index+1== oHLength){
          chartsData["directionalAverage"][1].push(RoundNumber((longOps/oHLength)*100))
          chartsData["directionalAverage"][1].push(RoundNumber((shortOps/oHLength)*100))


          chartsData["directionalProfits"][1].push(RoundNumber(longOpsProfit/longOps))
          chartsData["directionalProfits"][1].push(RoundNumber(shortOpsProfit/shortOps))
        }
      }

      /* Longs && shorts average stats */{
        if(op[4]){ // is long op?
          if(opProfit> opOnePercent){
            tpLongOps++
            tpLongOpsProfit+= opProfit
          }
          else if(opProfit<0){
            slLongOps++
            slLongOpsProfit+= opProfit
          }
          else{
            beLongOps++
            beLongOpsProfit+= opProfit
          }
        }
        
        else{
          if(opProfit> opOnePercent){
            tpShortOps++
            tpShortOpsProfit+= opProfit
          }
          else if(opProfit<0){
            slShortOps++
            slShortOpsProfit+= opProfit
          }
          else{
            beShortOps++
            // beShortOpsProfit+= opProfit
          }
        }

        /* setting chart data */
        if(index+1== oHLength){
          /* % */
          chartsData["longsAverage"][1].push(RoundNumber((tpLongOps/longOps)*100))
          chartsData["longsAverage"][1].push(RoundNumber((slLongOps/longOps)*100))
          chartsData["longsAverage"][1].push(RoundNumber((beLongOps/longOps)*100))
          
          chartsData["shortsAverage"][1].push(RoundNumber((tpShortOps/shortOps)*100))
          chartsData["shortsAverage"][1].push(RoundNumber((slShortOps/shortOps)*100))
          chartsData["shortsAverage"][1].push(RoundNumber((beShortOps/shortOps)*100))
          
          
          /* $ */
          chartsData["longsAverageProfits"][1].push(RoundNumber(tpLongOpsProfit/tpLongOps))
          chartsData["longsAverageProfits"][1].push(RoundNumber(slLongOpsProfit/slLongOps))
          chartsData["longsAverageProfits"][1].push(RoundNumber(beLongOpsProfit/beLongOps))
          
          chartsData["shortsAverageProfits"][1].push(RoundNumber(tpShortOpsProfit/tpShortOps))
          chartsData["shortsAverageProfits"][1].push(RoundNumber(slShortOpsProfit/slShortOps))
          // chartsData["shortsAverageProfits"][1].push(RoundNumber(beShortOpsProfit/beShortOps))
        }
      }
    })

    // Checking oldest balance value
    if(localStorage.getItem("oldestBalance")==null){
      oldestBalance-= chartsData["profitsEvolution"][1][chartsData["profitsEvolution"][1].length -1]

      localStorage.setItem("oldestBalance", RoundNumber(oldestBalance))

      chartsData["profitsEvolution"][1].forEach((e,i)=>{
        chartsData["profitsEvolution"][1][i]= RoundNumber(e+oldestBalance)
      })
    }
    
    GenerateTable(chartsData["profitsEvolution"][1])
    GenerateCharts()
  }

  function GenerateCharts(){
    let $colors= []
    
    
    if(localStorage.getItem("theme")!=0){
      let $root= document.querySelector(":root")

      $colors= [
        getComputedStyle($root).getPropertyValue("--secondColor"),
        getComputedStyle($root).getPropertyValue("--color1"),
        getComputedStyle($root).getPropertyValue("--color2")
      ]
    }
    else{
      $colors= localStorage.getItem("themeColors").split(",")
      $colors.shift()
    }

    /* Generating charts */
    $charts.forEach(($chart, i)=>{
      let name= $chart.dataset.name,
      data= chartsData[name]

      if(chartsRef[i]!=undefined) chartsRef[i].destroy()

      if($chart.dataset.type=="line"){
        chartsRef[i]= new Chart($chart, {
          type: 'line',
          
          data: {
            labels: data[0], 
            datasets: [{
              // label: 'Dataset sample label',
              data: data[1],
              
              pointBackgroundColor: $colors[0],
              
              borderColor: $colors[0],
              fill: {
                target: {value:oldestBalance},
                above: $colors[1],
                below: $colors[2]
              },
            }]
          },

          options: {
            scales: {
              
              x: {
                grid: {
                  display: false,
                },
                ticks:{
                  color: $colors[0],
                }
              },

              y: {
                grid:{
                  color: $colors[0],
                },
                ticks:{
                  color: $colors[0],
                }
              },
            },
            
            plugins:{
              legend: {
                display: false,
                // labels:{
                //   color: $colors[0],
                // }
              },
            }
          },
        });
      }
      
      else if($chart.dataset.type=="circle"){
        chartsRef[i]= new Chart($chart, {
          type: 'doughnut',
          
          data: {
            labels: data[0],
            
            datasets: [{
              
              // label: '%',
              data: data[1],
              
              hoverOffset: 4,
              borderWidth: 2,
              borderColor: $colors[0],
              
              backgroundColor:[
                $colors[1],
                $colors[2],
                $colors[0],
              ]
            }]
          },
          
          options: {
            layout:{
              padding: 4,
            },

            plugins:{
              legend: {
                display: false
              },
            }
          },
        });
      }
      
      else if($chart.dataset.type=="semiCircle"){
        chartsRef[i]= new Chart($chart, {
          type: 'doughnut',
          
          data: {
            labels: data[0],
            
            datasets: [{
              
              // label: '%',
              data: data[1],
              circumference: 180,
              rotation: -90,
              
              hoverOffset: 4,
              borderWidth: 2,
              borderColor: $colors[0],
              
              backgroundColor:[
                $colors[1],
                $colors[2],
                $colors[0],
              ]
            }]
          },
          
          options: {
            layout:{
              padding: 4,
            },

            plugins:{
              legend: {
                display: false
              },
            }
          },
        });
      }

      else if($chart.dataset.type=="bar"){
        chartsRef[i]= new Chart($chart, {
          type: 'bar',
          
          data: {
            labels: data[0], 
            datasets: [{
              // axis: "y",
              // label: 'Dataset sample label',
              data: data[1],

              borderWidth: 2,
              borderColor: $colors[0],
              backgroundColor:[
                $colors[1],
                $colors[2],
                $colors[0],
              ]
            }]
          },

          options: {
            // indexAxis: "y",
            
            scales: {
              y: {
                grid:{
                  color: $colors[0]
                },
                ticks:{
                  color: $colors[0],
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks:{
                  color: $colors[0],
                }
              }
            },
   
            plugins:{
              legend: {
                display: false
              },
            }
          },
        });
      }
    })
  }
}

/* Ops table scope */{
  
  function GenerateTable(acumulated){
    let $tBody= document.querySelector(".opsTable__body"),
    tBody= document.createElement("tbody")

    orderHistory.forEach((op,i)=>{
      let /* opBtn= document.createElement("button"), */
      tRow= document.createElement("tr"),
      opDate= new Date(op[6]),

      tRowData= [
        `${opDate.getFullYear()} `, /* closeDate */
        RoundNumber(op[2]*op[3]*op[5]), /* PnL */
        RoundNumber((op[2]*op[3]*0.0045*-1) +op[7]), /* total fees */
        null, /* result */
        acumulated[i] /* acumulated */,
      ]

      if(opDate.getMonth()+1 >9)
        tRowData[0]+= `${opDate.getMonth()+1}`
      else tRowData[0]+= `0${opDate.getMonth()+1}`
      if(opDate.getDate() >9)
        tRowData[0]+=`.${opDate.getDate()}`
      else tRowData[0]+= `.0${opDate.getDate()}`

      tRowData[3]= RoundNumber(tRowData[1]+tRowData[2])

      tRowData.forEach((item, i)=>{
        let tCell= document.createElement("td"),
        tCellData= document.createTextNode(item)
        tCell.classList.add("td")

        if(i!=tRowData.length-1) tCell.appendChild(tCellData)
        else{
          b= document.createElement("b")
          b.appendChild(tCellData)
          tCell.appendChild(b)
        }
        tRow.appendChild(tCell)
      })

      // TODO creating operation detail button
      tRow.classList.add("tr")
      tBody.appendChild(tRow)
    })

    $tBody.innerHTML= ""
    $tBody.innerHTML+= tBody.innerHTML

    // TODO Operation details button (onclick)
  }

  document.querySelector(".btn--opsTable").onclick= ()=>{
    document.querySelector(".tableContainer").classList.toggle("display--n")
  }
}