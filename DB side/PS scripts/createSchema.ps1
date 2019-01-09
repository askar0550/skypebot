$y = Get-ChildItem "..\..\DB side\Query\NewSchema" -Filter *.sql
$env:PGPASSWORD = 'admin';

$db_name = $args[0]
$schema_name = $args[1]

$y | Foreach-Object {
    $x = $_.FullName.replace("\", "/")
    $z = $_.Name
    $namearr = $_.Name.split(" ")
    $actionName =  $namearr[2]
    
    if ($z -ne "001 create DB .sql") {
        psql -U postgres -d $db_name -f $_.FullName -v schema_name=$schema_name
        echo "$actionName happened" ""
    }
}
