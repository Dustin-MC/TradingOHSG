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

  function ChangeThemeMode(isDarkTheme=null){
    //DarkMode=true, LightMode=false, CustomMode= null
    if( isDarkTheme== null){
      $root.style.setProperty("--mainColor", $colors[0].value);
      $root.style.setProperty("--secondColor", $colors[1].value);
      $root.style.setProperty("--color1", $colors[2].value);
      $root.style.setProperty("--color2", $colors[3].value);
    }
    else{
  
      if(isDarkTheme== true){
        $root.style.setProperty("--mainColor", $defaultColors.getPropertyValue("--themeColor2"));
        $root.style.setProperty("--secondColor", $defaultColors.getPropertyValue("--themeColor1"));
      }
      else if (isDarkTheme== false){
        $root.style.setProperty("--mainColor", $defaultColors.getPropertyValue("--themeColor1"));
        $root.style.setProperty("--secondColor", $defaultColors.getPropertyValue("--themeColor2"));
      }
      
      $root.style.setProperty("--color1", $defaultColors.getPropertyValue("--themeColor3"));
      $root.style.setProperty("--color2", $defaultColors.getPropertyValue("--themeColor4"));
    }
  }

  $themeBtns[0].onclick= function(){ChangeThemeMode()}
  $themeBtns[1].onclick= function(){ChangeThemeMode(true)}
  $themeBtns[2].onclick= function(){ChangeThemeMode(false)}
  $themeBtns[3].onclick= function(){TemporalThemeMode()}
}


/* Excel data scope */{
  let $input= document.querySelector(".excelInput");

  $input.addEventListener("change", async function(){
    try {
      const excelFile= await readXlsxFile($input.files[0]);
      excelFile.forEach(row => {
        console.log(row);
      });
    } catch{
      alert("Unvalid file! \n\tAction not completed.")
    }
  })
}