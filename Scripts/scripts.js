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