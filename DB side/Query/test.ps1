Get-ChildItem "C:\Users\cat\Documents\skype bot\git transition\DB side\Query" -Filter *.sql | 
Foreach-Object {
echo Get-Content $_.FullName.replace("\", "/") 
# psql -d appdata -U postgres -w -f 'C:/Users/cat/Documents/skype bot/git transition/DB side/Query/create fired_answer_table.sql'
}