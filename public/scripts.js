const searchUsersButton = document.getElementById('searchUsers')
searchUsersButton.addEventListener('input', searchUsersFunc)

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
    document.getElementById("nav").style.top = "0px";
  } else {
    document.getElementById("nav").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}
