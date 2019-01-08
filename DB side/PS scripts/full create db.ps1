$y = Get-ChildItem "..\Query" -Filter *.sql
$env:PGPASSWORD = 'admin';

$db_name = $args[0]
$schema_name = $args[1]


$y | Foreach-Object {
    $x = $_.FullName.replace("\", "/")
    $z = $_.Name
    
    if ($z -eq "001 create db.sql") {
        psql -U postgres -f $x -v db_name=$db_name
        echo "db has been created!"
    }
    else {
        psql -U postgres -d $db_name -f $_.FullName -v schema_name=$schema_name
        echo "things had happened"
    }
}
