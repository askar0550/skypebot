$y = Get-ChildItem "..\Query\DBinit" -Filter *.sql
$env:PGPASSWORD = 'admin';

$db_name = $args[0]


$y | Foreach-Object {
    $x = $_.FullName.replace("\", "/")
    $z = $_.Name
    $namearr = $_.Name.split(" ")
    $actionName =  $namearr[2]

    if ($z -eq "001 create DB .sql") {
        psql -U postgres -f $x -v db_name=$db_name
        echo ""
    }
    else {
        psql -U postgres -d $db_name -f $_.FullName
        echo "$actionName happened" ""

    }
}
