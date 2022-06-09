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

document.getElementById('postReadRegisters').style.display='none'
document.getElementById('postReadCoils').style.display='none'
document.getElementById('postWriteHoldingRegisters').style.display='none'
document.getElementById('postWriteCoils').style.display='none'


$('#chooseFunction').change(function(event){
  const selectedFunction = $(this).children("option:selected").val()
  sessionStorage.setItem("itemName",selectedFunction)
});

$('select').find('option[value='+sessionStorage.getItem('itemName')+']').attr('selected','selected')

$(document).ready(function() {
  const selectedSessionFunction = $('select').val()
  

  switch(selectedSessionFunction){
    case "readHoldingRegisters":
      document.getElementById('postReadRegisters').style.display=''
    break
    case "readCoils":
      document.getElementById('postReadCoils').style.display=''
    break
    case "writeCoils":
      document.getElementById('postWriteCoils').style.display=''
    break
    case "writeHoldingRegister":
      document.getElementById('postWriteHoldingRegisters').style.display=''
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
        document.getElementById('postWriteCoils').style.display='none'
        document.getElementById('postWriteHoldingRegisters').style.display='none'
      break;  
      case "readCoils":
        document.getElementById('postReadRegisters').style.display='none'
        document.getElementById('postReadCoils').style.display=''
        document.getElementById('postWriteCoils').style.display='none'
        document.getElementById('postWriteHoldingRegisters').style.display='none'
      break
      case "writeCoils":
        document.getElementById('postReadRegisters').style.display='none'
        document.getElementById('postReadCoils').style.display='none'
        document.getElementById('postWriteCoils').style.display=''
        document.getElementById('postWriteHoldingRegisters').style.display='none'
      break
      case "writeHoldingRegister":
        document.getElementById('postReadRegisters').style.display='none'
        document.getElementById('postReadCoils').style.display='none'
        document.getElementById('postWriteCoils').style.display='none'
        document.getElementById('postWriteHoldingRegisters').style.display=''
      break
    }
    
  })
})

document.getElementById('quantitySimulatorWriteCoils').addEventListener('keyup', addFields)
   
function addFields() {
    let number = document.getElementById("quantitySimulatorWriteCoils").value
    let container = document.getElementById("numberOfCoils")
    let addressNumber = document.getElementById("addressSimulatorWiteCoils").value
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }
    for (i = 0; i < number; i++) {

        let label = document.createElement('label')
        label.style.display="inline-block"
        label.style.width="220px"
        label.appendChild(document.createTextNode("Address " + (parseInt(addressNumber) + i + 1)))
        container.appendChild(label)
        let input = document.createElement("input")
        input.type = "checkbox"
        input.style.width="50px"
        input.name = 'WriteCoilsSimulator' + (i + 1)
        console.log(input.name)
        container.appendChild(input)
    }
}

document.getElementById('quantitySimulatorWriteHoldingRegisters').addEventListener('keyup', addInputs)
   
function addInputs() {
    let number = document.getElementById("quantitySimulatorWriteHoldingRegisters").value
    let container = document.getElementById("numberOfHoldingRegisters")
    let addressNumber = document.getElementById("addressSimulatorWiteRegisters").value
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }
    for (i = 0; i < number; i++) {

        let label = document.createElement('label')
        label.style.display="inline-block"
        label.style.width="190px"
        label.appendChild(document.createTextNode("Address " + (parseInt(addressNumber) + 400000 + i + 1)))
        container.appendChild(label)
        let input = document.createElement("input")
        input.type = "number"
        input.style.width="80px"
        input.name = 'WriteHoldingRegistersSimulator' + (i + 1)
        console.log(input.name)
        container.appendChild(input)
    }
}
