<?php

    include('database.php');

    $search = $_POST['search'];

    if(!empty($search)){
        $query = "SELECT * FROM task WHERE name LIKE '$search%' ";
        $result = mysqli_query($connection, $query);

        if (!$result) {
            die('Error de consulta' .  mysqli_error($connection));
        }

        $json = array();
        while($row = mysqli_fetch_array($result)){
            // Recorrer el resultado de la consulta y alamacenarla en un json
            $json[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
            );
        } 

        $jsonstring = json_encode($json);

        echo $jsonstring;
    }

?>