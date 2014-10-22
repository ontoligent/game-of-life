<!DOCTYPE html>
<head>
<title>Conway's Game of Life in PHP</title>
<style type="text/css">

#game {
  text-align: center;
}

#title {
  padding:1em;
  margin:1em;
  font-family:sans-serif;
  text-align:center;
  margin-left:auto;
  margin-right:auto;
}

a {
  text-decoration:none;
}

#grid {
  text-align:center;
  margin-left:auto;
  margin-right:auto;
}

#grid td {
  width: 20px;
  height:25px;
  text-align: center;
  margin: 0px;
  padding: 0px;
  _ border:1px solid gray;
}

</style>
</head>
<body>
<div id="game">
<a href="life.html">Here is a better version ...</a><br />
<?php

session_start();

$gen = $_GET['gen'];
if (!$gen) $gen = 0;
$nextGen = $gen + 1;

echo "<div id='title'>\n";
echo "<b><a href='http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'>Conway's Game of Life</a></b><br/>\n";
echo "GENERATION $gen | \n";
echo "<a href='?gen=$nextGen'>EVOLVE</a> | \n";
echo "<a href='?gen=0'>RESTART</a><br/>\n";
echo "<div style='font-size:80%;'>Click on EVOLVE to see the next generation ...</div>\n";
echo "</div>\n";

if ($gen == 0) init(15,25);
else evolve();

function init ($h,$w) {
  $g = createGrid($h,$w);
  $g = seedGrid($g);
  $_SESSION['grid'] = $g;
  print printGrid($g);
}

function evolve () {
  $g = $_SESSION['grid'];
  $g2 = array();
  for ($i = 0; $i < count($g); $i++) {
    $g2[$i] = array();  
    for ($j = 0; $j < count($g[$i]); $j++) {
      
      // START LIFE TEST
      
      $n = 0; // neighbors
      $c = $g[$i][$j]; // current cell value
      for ($x = -1; $x <= 1; $x++) {
        for ($y = -1; $y <= 1; $y++) {
          if ($x == 0 && $y == 0) {} // do nothing
          else $n += $g[$i+$y][$j+$x];
        }
      }
      if ($c == 0 && $n == 3) $g2[$i][$j] = 1; // BIRTH
      elseif ($c == 1 && ($n == 2 || $n == 3)) $g2[$i][$j] = 1; // SURVIVAL  
      else $g2[$i][$j] = 0; // DEATH (OVERCROWDING or LONELINESS)
      
      // END LIFE TEST
    
    }
  }
  $_SESSION['grid'] = $g2;
  print printGrid($g2);
}

function createGrid ($h,$w) {
  $grid = array();
  for ($i = 0; $i < $h; $i++) {
    $grid[$i] = array();
    for ($j = 0; $j < $w; $j++) {
      $grid[$i][$j] = 0;
    }
  }
  return $grid;
}

function seedGrid ($grid) {
  for ($i = 0; $i < count($grid); $i++) {
    for ($j = 0; $j < count($grid[$i]); $j++) {
      $grid[$i][$j] = rand(0,1);
    }
  }
  return $grid;
}

function printGrid ($grid) {
  $table = "<table id='grid'>\n";
  foreach ($grid as $row) {
    $table .= "\t<tr>\n";
    foreach ($row as $cell) {
      $image = "<img src='icon_circle_blue_2.gif' />";
      //$image ='*';
      if (!$cell) $image = '&nbsp;'; 
      $table .= "<td>$image</td>";
    }
    $table .= "\t</tr>\n";
  }
  $table .= "</table>\n";
  return $table;
}

?>
</div>
</body>
</html>
