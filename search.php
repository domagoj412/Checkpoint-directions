<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Domagoj
 * Date: 09.06.12.
 * Time: 10:17
 * To change this template use File | Settings | File Templates.
 */
$input = $_GET["input"];
$input = urlencode($input);
echo file_get_contents("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=$input&sensor=true&key=AIzaSyB8Z9WaSzmXchSrRlOyZWtgTBll1UYKcYk");