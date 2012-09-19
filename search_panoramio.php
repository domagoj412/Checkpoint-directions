<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Domagoj
 * Date: 09.06.12.
 * Time: 10:17
 * To change this template use File | Settings | File Templates.
 */
$minx =  urlencode($_GET["minx"]);
$miny =  urlencode($_GET["miny"]);
$maxx =  urlencode($_GET["maxx"]);
$maxy =  urlencode($_GET["maxy"]);
echo file_get_contents("http://www.panoramio.com/map/get_panoramas.php?order=popularity&set=public&from=0&to=10&minx=$minx&miny=$miny&maxx=$maxx&maxy=$maxy&size=medium");