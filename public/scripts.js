if(document.getElementById('searchUsers'))
document.getElementById('searchUsers').addEventListener('input', searchUsersFunc)

function searchUsersFunc() {

    let input = document.getElementById("searchUsers")
    let filter = input.value.toUpperCase()
    let table = document.getElementById("tabUser")
    let tr = table.getElementsByTagName("tr")
    let tr_length = tr.length

    for (let i = 0; i < tr_length; i++) {
      let td = tr[i].getElementsByTagName("td")[1]
      if (td) {
        let txtValue = td.textContent || td.innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = ""
        } else {
          tr[i].style.display = "none"
        }
      }       
    }
  }


let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("nav").style.top = "0px"
  } else {
    document.getElementById("nav").style.top = "-100px"
  }
  prevScrollpos = currentScrollPos;
}


// let toggler = document.getElementsByClassName("caret")
// let i =0
// let toggler_length = toggler.length
// for (i = 0; i < toggler_length; i++) {
//   toggler[i].addEventListener("click", function() {
//     this.parentElement.querySelector(".nested").classList.toggle("active")
//     this.classList.toggle("caret-down")
//   });
// }

$('#chooseFunction').change(function(event){
  const selectedFunction = $(this).children("option:selected").val()
  sessionStorage.setItem("itemName",selectedFunction)
});

$('select').find('option[value='+sessionStorage.getItem('itemName')+']').attr('selected','selected')

$(document).ready(function() {
  const selectedSessionFunction = $('select').val()
  document.getElementById('postReadRegisters').style.display='none'
  document.getElementById('postReadCoils').style.display='none'

  switch(selectedSessionFunction){
    case "readHoldingRegisters":
      document.getElementById('postReadRegisters').style.display=''
    break;  
    case "readCoils":
      document.getElementById('postReadCoils').style.display=''
    break
  }
});

let selector = document.getElementById("chooseFunction"); 
selector.addEventListener("click", () => {
  selector.addEventListener("change", () => {    
    switch (selector.value) {
      case "readHoldingRegisters":
        document.getElementById('postReadRegisters').style.display=''
        document.getElementById('postReadCoils').style.display='none'
      break;  
      case "readCoils":
        document.getElementById('postReadRegisters').style.display='none'
        document.getElementById('postReadCoils').style.display=''
      break

    }
    
  })
})