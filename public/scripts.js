let myWindow;
let toggleVar = 0;
function toggleWin() {

    
    toggleVar = !toggleVar

        if (toggleVar) {
                myWindow = window.open("http://127.0.0.1:3000/wetty", "myWindow")
        }

        if(!toggleVar) {
            myWindow.close()
        }
}

function searchUsers() {

    let input = document.getElementById("searchUsers");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("tabUser");
    let tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        let txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

let prevScrollpos = window.pageYOffset;

window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("nav").style.top = "0px";
  } else {
    document.getElementById("nav").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}