/* Nav Scope */{
  var hideMenu= true;

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
  var currentSection= 0;
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

  
  
  document.addEventListener("DOMContentLoaded", (e)=>{
    if(localStorage.getItem("theme")== null){
      localStorage.setItem("theme", "2")
    }

    else if(localStorage.getItem("theme")==0){
      ChangeThemeMode(0, false)
    }
    else if(localStorage.getItem("theme")==1){
      ChangeThemeMode(1)
    }
    else{
      ChangeThemeMode(2)
    }
  })
  
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

  function ChangeThemeMode(themeMode, isManualTheme= true){
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

  window.onload = function(){
    if(localStorage.getItem("themeColors")!=null){
      let customColors= (localStorage.getItem("themeColors")).split(",")

      for (let i= 0; i < $colors.length; i++) {
        $colors[i].value= customColors[i]
      }
    }
  };

  $themeBtns[0].onclick= function(){ChangeThemeMode(0)}
  $themeBtns[1].onclick= function(){ChangeThemeMode(1)}
  $themeBtns[2].onclick= function(){ChangeThemeMode(2)}
  $themeBtns[3].onclick= function(){TemporalThemeMode()}
}


/* Order history data manager */{
  let $input= document.querySelector(".excelInput");
  var orderHistory=[];

  function GetOrderHistoryData(excelData){
    for(let i=2; i<excelData.length; i++){
      let operation=[
        /* Adapted only for BingX order history file */
        excelData[i][2], /* category */
        excelData[i][3], /* marginType */
        excelData[i][4], /* margin */
        excelData[i][5], /* leverage */
        excelData[i][6], /* openPrice */
        excelData[i][7], /* closePrice */
        excelData[i][8], /* direction */
        ConvertToUTC(excelData[i][12]), //open time
        ConvertToUTC(excelData[i][13]), //close time
        excelData[i][14], /* fundingFee */
        excelData[i][15], /* fees */
        excelData[i][16] /* Realized PNL */
      ];

      orderHistory.push(operation);
    }
    
    console.log("Final array:")
    orderHistory.forEach(element=>{
      console.log(element)
    });
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





  $input.addEventListener("change", async function(){
    try {
      const excelFile= await readXlsxFile($input.files[0]);
      GetOrderHistoryData(excelFile)
    } catch{
      alert("Action not completed! \n\tTry again or Select other one.")
    }
  })
}

/* Charts Scope */{
  let $charts= document.querySelectorAll(".chart")
  //chartsData on Order history data manager

  function GenerateCharts(){}
}