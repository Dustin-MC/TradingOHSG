/* Global */{
  var currentSection= 2,
  hideMenu= true;
  chartsRef= [],
  orderHistory= null,

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

    if(hideMenu){ HideMenu(true) }
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
    $themeBtns[3].disabled= true;

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
      $themeBtns[3].removeAttribute("disabled")
    }, 4000);
  }

  function ChangeThemeMode(themeMode, isManualTheme= true, isImportedColor= false){
    // CustomMode= 0, DarkMode= 1, LightMode=2
    localStorage.setItem("theme", themeMode)


    if( themeMode== 0){
      if(isManualTheme){
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
  

  $themeBtns[0].onclick= function(){ChangeThemeMode(0)}
  $themeBtns[1].onclick= function(){ChangeThemeMode(1)}
  $themeBtns[2].onclick= function(){ChangeThemeMode(2)}
  $themeBtns[3].onclick= function(){TemporalThemeMode()}
}


/* Data manager scope */{
  let $excelInput= document.querySelector(".excelInput"),
  $format= document.querySelector(".dataFormat")
  $exportBtn= document.querySelector(".btn--exportData"),
  $dataExport= document.querySelector(".dataExport");


  async function ImportData(){
    let importedData= []

    try {
      /* BingX order history file */
      if($format.value== "bingx"){
        let fileData= await readXlsxFile($excelInput.files[0]);

        for(let i=2; i<fileData.length; i++){
          let operation=[
            fileData[i][2], /* category */
            fileData[i][3], /* marginType */
            fileData[i][4], /* margin */
            fileData[i][5], /* leverage */
            fileData[i][6], /* openPrice */
            fileData[i][7], /* closePrice */
            null, /* direction assigned later with an if */
            ConvertDate(fileData[i][12]), // open time
            ConvertDate(fileData[i][13]), // close time
            fileData[i][14], /* fundingFee */
            // fileData[i][15], /* fees */
            // fileData[i][16] /* Realized PNL */
          ];

          if(fileData[i][8]=="long") operation[6]= true
          else operation[6]= false // short
          
          importedData.push(JSON.stringify(operation))
        }

        AddNewOperations(importedData)
      }
      
      /* TradingOHSG file */
      else if($format.value== "tohsg"){
        let fileData = $excelInput.files[0],
        
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
    
    alert("Action success!\n\tOrder history data imported")
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
        alert("Action bloqued!\n\tThere is currently no custom theme selected.")
      }
    }
    
    else if($dataExport.value=="tohsg"){
      if(orderHistory!=null){
        fileName= "data"
        exportFile= true
        content= JSON.stringify(orderHistory)
      }
      else{
        alert("Action blocked!\n\tThere is currently no existing data to export.")
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
  
  // Import data "button"
  $excelInput.addEventListener("change", function(){
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
      alert("Action bloqued!\n\tSelect some data to export.")
    }
  })
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


    /* Data generation */
    orderHistory.forEach((op, index)=>{
      /* Operations profits evolution */{
        
        // xProfit= profit multiplier decimal value
        let xProfit= (op[5]/op[4]) -1
        
        // Multipliler for short operation
        if(op[6]!= true) xProfit*= -1

        
        opProfit= RoundNumber(xProfit*(op[2]*op[3]))

        opDate= new Date(op[7]+"z")
        opDate= `${opDate.getMonth()+1}.${opDate.getDate()}`

        // New acumulated profit
        opsProfitsEvolution= opProfit
        if(index!=0){
          opsProfitsEvolution+= chartsData["profitsEvolution"][1][chartsData["profitsEvolution"][1].length -1]
        }

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
        if(op[6]){
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
        if(op[6]){
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
                target: 'origin',
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