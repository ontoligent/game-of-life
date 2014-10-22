// We create a self-executing "object" JavaScript style
function GOL(div) 
{
  this.div = div;
  this.gridHeight =  25;
  this.gridWidth = 40;
  this.grid1 = [];
  this.gen = 1; // generation
  this.pop = 0; // population
}

// Call this once when the page loads
GOL.prototype.Init = function () 
{
  this.createGrid();
  this.createTable();
  this.showGrid();
}

// Builds a first grid, with random values as a default
GOL.prototype.createGrid = function () 
{
  for (i = 0; i < this.gridHeight; i++) {
    this.grid1[i] = [];
    for (j = 0; j < this.gridWidth; j++) {
      this.grid1[i][j] = Math.floor(Math.random()*2);
      this.pop += this.grid1[i][j];
    }
  }
}

// Sets all grid values to 0
GOL.prototype.clearGrid = function () 
{
  this.pop = 0;
  this.gen = 1;
  for (i = 0; i < this.gridHeight; i++) {
    for (j = 0; j < this.gridWidth; j++) {
      this.grid1[i][j] = 0;
    }
  }  
  this.showGrid();
}

// Set values of grid to andom values (used when RESETting)
GOL.prototype.randomizeGrid = function () 
{
  this.pop = 0;
  this.gen = 1;
  for (i = 0; i < this.gridHeight; i++) {
    for (j = 0; j < this.gridWidth; j++) {
      this.grid1[i][j] = Math.floor(Math.random()*2);;
      this.pop += this.grid1[i][j];
    }
  }  
  this.showGrid();
}

// Creates an HTML table for plotting the grid
// We do this just once in order to bind persistent JQuery events to it
GOL.prototype.createTable = function () 
{
  $(this.div).append("<table id='gridTable'></table>");
  for (i = 0; i < this.gridHeight; i++) {
    var rowID = 'tr-' + i;
    $('#gridTable').append("<tr id='"+rowID+"'></tr>");
    for (j = 0; j < this.gridWidth; j++) {
      var cellID = 'td-' + i + '-' + j;
      $('#'+rowID).append("<td id='"+cellID+"'>&nbsp;</td>");
    }
  }   
}

// Maps the grid onto the html table
// We use CSS to control how 'live' and 'dead' cells look
GOL.prototype.showGrid = function ()
{
  $('#status').html("GENERATION " + this.gen + " POPULATION: " + this.pop);
  for (i = 0; i < this.gridHeight; i++) {
    for (j = 0; j < this.gridWidth; j++) {
      tdID = "#td-"+i+'-'+j;
      if (this.grid1[i][j] == 0) $(tdID).removeClass('on').addClass('off');   
      else $(tdID).removeClass('off').addClass('on');
    }
  } 
}

// 'Evolves' the grid for one generation
GOL.prototype.evolve = function ()
{
  this.gen++;
  this.pop = 0; // Set to zero for convenience; we add them up at the end
  var grid2 = []; // Temporary grid to hold the next gen
  for (i = 0; i < this.gridHeight; i++) {
    grid2[i] = [];
    for (j = 0; j < this.gridWidth; j++) {
      
      // START LIFE TEST
      
      var n = 0; // neighbors
      var c = this.grid1[i][j]; // current cell value
      
      // investigate surrounding cells
      for (x = -1; x <= 1; x++) {
        for (y = -1; y <= 1; y++) {
          if (x == 0 && y == 0) {} // // avoid testing the cell itself
          else if (i+y < 0 || j+x < 0 || i+y >= this.gridHeight || j+x >= this.gridWidth) {} // avoid testing out of grid cells
          else n += this.grid1[i+y][j+x]; // count neighbors
        }
      }
      
      // These are the rules of the game
      if (c == 0 && n == 3) grid2[i][j] = 1; // BIRTH
      else if (c == 1 && (n == 2 || n == 3)) grid2[i][j] = 1; // SURVIVAL  
      else grid2[i][j] = 0; // DEATH (OVERCROWDING or LONELINESS)
      
      // END LIFE TEST    
      
    }
  }

  // Replace the old grid with the new one
  // this.grid1 = grid2; DOES NOT WORK IN JS
  for (i = 0; i < this.gridHeight; i++) {
    for (j = 0; j < this.gridWidth; j++) {
      this.pop += grid2[i][j];
      this.grid1[i][j] = grid2[i][j];  
    }
  }
  this.showGrid();
  
}
