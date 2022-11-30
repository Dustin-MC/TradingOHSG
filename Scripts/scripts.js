/* Nav Scope */{
  var hideMenu= true;

  function ToggleNav(){
    document.querySelector(".nav__body").classList.toggle("display--n");
  }

  document.querySelector(".navToggler").addEventListener("click", ToggleNav);
}


/* Sections scope */{
  var currentSection= 0;
  let $sections= document.querySelectorAll(".section"),
  $navItems= document.querySelectorAll(".nav__item");
  

  function ToggleSection(index){
    if(currentSection== index){
      if( confirm("Current section! \n\tDo you want to close the menu?")){
        ToggleNav();
      }
      return;
    }
    else{
      $sections[index].classList.toggle("display--n")
      $sections[currentSection].classList.toggle("display--n")
    }
    currentSection= index

    if(hideMenu){ ToggleNav() }
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
}