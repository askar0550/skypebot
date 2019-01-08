$y = Get-ChildItem "..\..\DB side\Query" -Filter *.sql
$env:PGPASSWORD = 'admin';

$schema_name = $args[0]


$y | Foreach-Object {
    $x = $_.FullName.replace("\", "/")
    $z = $_.Name
    
    if ($z -ne "001 create db.sql") {
        psql -U postgres -d "db5" -f $_.FullName -v schema_name=$schema_name
        echo "things had happened"
    }
}
