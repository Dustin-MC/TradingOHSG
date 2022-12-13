/* Global */{
  var orderHistory= null,
  currentSection= 0,
  hideMenu= true

  // Getting persisted data
  document.addEventListener("DOMContentLoaded", ()=>{
    // theme mode
    if(localStorage.getItem("theme")== null) localStorage.setItem("theme", "2")
    else if(localStorage.getItem("theme")==0) ChangeThemeMode(0, false)
    else ChangeThemeMode(localStorage.getItem("theme"))
    

    // order history
    if(localStorage.getItem("orderH")!= null){
      orderHistory= []

      JSON.parse(localStorage.getItem("orderH")).forEach(operation=>{
        orderHistory.push(operation)
      })
      
      // TODO create and uncomment function
        // GenerateChartsData()
    }
  })

  window.onload = function(){
    if(localStorage.getItem("themeColors")!=null){
      let customColors= (localStorage.getItem("themeColors")).split(","),
      $colors= document.querySelectorAll(".customColor")

      for (let i= 0; i < $colors.length; i++) {
        $colors[i].value= customColors[i]
      }
    }
  };
}

/* Nav Scope */{
  function HideMenu(ask){
    if(ask){
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
    //CustomMode= 0, DarkMode= 1, LightMode=2
    localStorage.setItem("theme", themeMode)


    if( themeMode== 0){
      if(isManualTheme){
        $root.style.setProperty("--mainColor", $colors[0].value);
        $root.style.setProperty("--secondColor", $colors[1].value);
        $root.style.setProperty("--color1", $colors[2].value);
        $root.style.setProperty("--color2", $colors[3].value);
        
        /* saving custom colors */
        localStorage.setItem("themeColors", [$colors[0].value, $colors[1].value, $colors[2].value, $colors[3].value]);
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
    }
  }

  

  $themeBtns[0].onclick= function(){ChangeThemeMode(0)}
  $themeBtns[1].onclick= function(){ChangeThemeMode(1)}
  $themeBtns[2].onclick= function(){ChangeThemeMode(2)}
  $themeBtns[3].onclick= function(){TemporalThemeMode()}
}


/* Order history data manager */{
  let $excelInput= document.querySelector(".excelInput"),
  $format= document.querySelector(".dataFormat")
  $exportBtn= document.querySelector(".btn--exportData"),
  $dataExport= document.querySelector(".dataExport");


  async function ImportData(){
    let importedData= []

    try {
      if (orderHistory== null) orderHistory= []
      
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
            fileData[i][8], /* direction */
            ConvertToUTC(fileData[i][12]), //open time
            ConvertToUTC(fileData[i][13]), //close time
            fileData[i][14], /* fundingFee */
            fileData[i][15], /* fees */
            fileData[i][16] /* Realized PNL */
          ];
          
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
            }
  
            else{
              JSON.parse(fileReader.result).forEach(operation => {
                importedData.push(JSON.stringify(operation))
              });
  
              AddNewOperations(importedData)
            }
          }
          catch{
            alert("Action not completed! \n\tTry again or Select another file.")
          }
        };
      }
    }
    
    catch{
      alert("Action not completed! \n\tTry again or Select another file.")
    }
  }

  function AddNewOperations(importedData){
    let tempOH=[]

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

    // TODO create and uncomment function
      // GenerateChartsData()
    
    alert("Action success!\n\tOrder history data imported")
  }

  function ConvertToUTC(timeString, isToUTC0=true){
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
      finalDate= (new Date(timeString)).toJSON()
    }
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
      console.log("orderHistory: ",orderHistory)
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
  
  
  $excelInput.addEventListener("change", function(){
    if($format.value!="none") ImportData()
    
    else{
      alert("No format selected!\n\tA format is required to perform data import.")
    }
    
    this.value= ""
  })

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
  let $charts= document.querySelectorAll(".chart")
  //chartsData on Order history data manager

  function GenerateCharts(){}
}