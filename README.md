# zti

#Windows

Link do bazy danych
https://www.mongodb.com/try/download/community

Aby sie zalogować z rolą admina należy utworzyć użytkownika w users z mailem 
admin@gmail.com


Aby to zrobic należy pobrać baze z powyższego linka, zainstalować mongodb, w folderze instalacyjnym odpalić shella mongo, przykładowa ścieżka
C:\MongoDB\Server\5.0\bin\mongo
wpisać kolejno 

use ztiDB
db.users.insertOne({"email":"admin@gmail.com", "role":"ADMIN", "password":"haslo"})

w przypadku użycia git pull
npm install
npm run dev

#Linux

Wirtualka powinna być ready-to-go
haslo systemu operacyjnego
login: debian
haslo: temppwd

trzeba wpisać  w terminalu
cd program
node server.js

w drugim terminalu
sudo modbusslave/diagslave/x86_64-linux-gnu/diagslave

z poziomu hosta znaleźć IP serwera i wpisać go w przeglądarke, należy potwierdzić certyfikat SSL.
