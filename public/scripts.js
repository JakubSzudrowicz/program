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
    let input = document.getElementById('searchUsers').value
    input = input.toLowerCase();
    let tr = document.getElementsByTagName('tr');
      
    for (i = 0; i < tr.length; i++) { 
        if (!tr[i].innerHTML.toLowerCase().includes(input)) {
            tr[i].style.display="none";
        }
        else {
            tr[i].style.display="list-item";                 
        }
    }
}