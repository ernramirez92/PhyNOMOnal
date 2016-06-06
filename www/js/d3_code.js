$(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
});
//////////////////////////////////////////////////////////////////////////////////////////////
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

//////////////////////////////////////////////////////////////////////////////////////////////

var pinA0value = 0, pinA1value = 0, pinA2value = 0;

var width = 700,height = 550;
var svg = d3.select("body").select("#svg_col").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("align","center")
  .attr("id","svg");
var line0 = svg.append("line").attr("id","line0");
//var line0 = svg.append("line").attr("id","line1");

var pinA0 = d3.select("body").select("#PA0")
var pinA1 = d3.select("body").select("#PA1")
var pinA2 = d3.select("body").select("#PA2")

NomoColumn = d3.select("#NomoProperties").append("button").text("Add Nomogram!").on("click",AddNomoButton)
d3.select("#NomoColumn").append("h4").text("Remove Nomogram:")
d3.select("#NomoColumn").append("button").attr("id","RemoveNomoButton").text("Nomogram "+"0").attr("value",0).on("click",RemoveNomogramButton)

var y_shift = 40;
var y_range = 400;

var a_min = 1;
var a_max = 10;
var b_min = 1;
var b_max = 10;

var NomoDisplayType = 1;

//var NomoAxisArray = [[0,"A+B=C",1,11,2,12],[1,"A+B=C",3,13,4,14],[2,"A+B=C",4,14,5,15]]
var NomoAxisArray = [[0,"A+B=C",1,11,2,12]]
var CircleLockedArray = [[0,0,0]]
CirclePositionArray = [[MapArdPinToSVG(1023),MapArdPinToSVG(1023),MapArdPinToSVG(1023)]]
var CurrnetAxis = 0

var mouse_down_x = 0,mouse_down_y=0, mouse_up_x = 0, mouse_up_y = 0, mouse_down_section = 0,mouse_up_section = 0;


// d3.select("#nomoselect").on("change",NomoDropFunction);
//
// d3.select("#a_min_value").on("input", function() {a_min = this.value;NomoDropFunction();});
// d3.select("#a_max_value").on("input", function() {a_max = this.value;NomoDropFunction();});
// d3.select("#b_min_value").on("input", function() {b_min = this.value;NomoDropFunction();});
// d3.select("#b_max_value").on("input", function() {b_max = this.value;NomoDropFunction();});

d3.select("#nomoselect").on("change",function(){NomoAxisArray[CurrnetAxis][1]=this.value;UpdateAxes();});
d3.select("svg").on("mouseup",MouseUpFunction);
d3.select("svg").on("mousedown",MouseDownFunction);
d3.select("svg").on("dblclick",DoubleClickFunction);

d3.select("#a_min_value").on("input", function() {NomoAxisArray[CurrnetAxis][2] = this.value;UpdateAxes();});
d3.select("#a_max_value").on("input", function() {NomoAxisArray[CurrnetAxis][3]= this.value;UpdateAxes();});
d3.select("#b_min_value").on("input", function() {NomoAxisArray[CurrnetAxis][4] = this.value;UpdateAxes();});
d3.select("#b_max_value").on("input", function() {NomoAxisArray[CurrnetAxis][5] = this.value;UpdateAxes();});

//pinA0listener = pinA0.on("change",function(){console.log(document.getElementById("PA0").textContent)});
//setInterval(function(){ console.log(document.getElementById("PA0").textContent); }, 100);

//last one that worked
//setInterval(function(){ pinA0value = document.getElementById("PA0").textContent; pinA1value = document.getElementById("PA1").textContent; pinA2value = document.getElementById("PA2").textContent;pa0circle.attr("cy",MapArdPinToSVG(pinA0value));pa1circle.attr("cy",MapArdPinToSVG(pinA1value));pa2circle.attr("cy",MapArdPinToSVG(pinA2value));visualizecurrentline(); }, 50);

//setInterval(function(){ UpdateCurrentCircles();visualizecurrentline(); updatelines();}, 50);
setInterval(function(){ UpdateCurrentCircles();updatelines();UpdateAxes();}, 10);
function AddNomoButton(){
  d3.selectAll("#RemoveNomoButton").remove()
  d3.select("#NomoColumn").selectAll("br").remove()
  NomoAxisArray.push([NomoAxisArray.length,"A+B=C",1,10,1,10])
  CurrnetAxis = NomoAxisArray.length-1
  var element = document.getElementById('nomoselect');
  element.value = "A+B=C";
  svg.append("line").attr("id","line"+CurrnetAxis);
  for(i=0;i<NomoAxisArray.length;i++){
    d3.select("#NomoColumn").append("button").attr("id","RemoveNomoButton").text("Nomogram "+i).attr("value",i).on("click",RemoveNomogramButton)
    d3.select("#NomoColumn").append("br")
  }
  for(i=0;i<3;i++){
    svg.append("circle").attr("fill","steelblue").attr("cx",width/NomoAxisArray.length+(i+1)*width/NomoAxisArray.length/4+"px").attr("r","8px").attr("id","circle"+CurrnetAxis+""+i).attr("cy",MapArdPinToSVG(1023)+"px")
  }
  CircleLockedArray.push([0,0,0])
  CirclePositionArray.push([MapArdPinToSVG(1023),MapArdPinToSVG(1023),MapArdPinToSVG(1023)])

  UpdateAxes();
  updatelines()
}

function RemoveNomogramButton(){
  button_pressed = this.getAttribute("value");
  for (i=0;i<3;i++){
    d3.select("#circle"+button_pressed+i).remove()
  }
  for(i=button_pressed;i<NomoAxisArray.length;i++){
    d3.select("#circle"+i+0).attr("id","circle"+(i-1)+""+0)
    d3.select("#circle"+i+1).attr("id","circle"+(i-1)+""+1)
    d3.select("#circle"+i+2).attr("id","circle"+(i-1)+""+2)
  }

  //d3.select("#line"+button_pressed).remove()
  svg.selectAll("line").remove()
  d3.selectAll("button").filter("[value='"+ button_pressed+"']").remove()


  NomoAxisArray.splice(button_pressed, 1);
  CircleLockedArray.splice(button_pressed, 1);
  CirclePositionArray.splice(button_pressed, 1);
  for (i=0;i<NomoAxisArray.length;i++){
    NomoAxisArray[i][0]=i;
  }

  d3.selectAll("#RemoveNomoButton").remove()
  d3.select("#NomoColumn").selectAll("br").remove()
  for(i=0;i<NomoAxisArray.length;i++){
    d3.select("#NomoColumn").append("button").attr("id","RemoveNomoButton").text("Nomogram "+i).attr("value",i).on("click",RemoveNomogramButton)
    d3.select("#NomoColumn").append("br")
    svg.append("line").attr("id","line"+i)
  }
  if (button_pressed==CurrnetAxis){
    CurrnetAxis--
  }
  else if(CurrnetAxis>=NomoAxisArray.length){
    CurrnetAxis=NomoAxisArray.length-1
  }

  UpdateAxes();
  updatelines();
  UpdateCurrentCircles();
}

function DoubleClickFunction(){
  var coordinates = [0,0]
  coordinates = d3.mouse(this);
  x = coordinates[0];
  y = coordinates[1];
  for (i=0;i<NomoAxisArray.length;i++){
    for(j=0;j<3;j++){
      circle = document.getElementById("circle"+i+""+j)
      //console.log(circle);
      var circ_cx = circle.getAttribute("cx");
      //console.log(circ_cx);
      circ_cy = circle.getAttribute("cy");
      //console.log(circ_cy);
      if (Math.sqrt(Math.pow(Number(x)-Number(circ_cx),2)+Math.pow(Number(y)-Number(circ_cy),2))<=14){
        //console.log("Near Circle!!!!")
        CircleLockedArray[i][j] = 1 - CircleLockedArray[i][j];
        if(CircleLockedArray[i][j] == 1){
          circle.setAttribute("fill","red");
        }
        else{
          circle.setAttribute("fill","steelblue");
        }
      }
    }
  }
}

function MouseDownFunction(){
  var coordinates = [0,0]
  coordinates = d3.mouse(this);
  mouse_down_x = coordinates[0];
  mouse_down_y = coordinates[1];
  mouse_down_section = Math.floor(mouse_down_x/(width/NomoAxisArray.length))
  //console.log(mouse_down_section)
}

function MouseUpFunction(){
  var coordinates = [0,0]
  coordinates = d3.mouse(this);
  mouse_up_x = coordinates[0];
  mouse_up_y = coordinates[1];
  mouse_up_section = Math.floor(mouse_up_x/(width/NomoAxisArray.length))
  circle_counter =0
  for (i=0;i<NomoAxisArray.length;i++){
    for(j=0;j<3;j++){
      circle = document.getElementById("circle"+i+""+j)
      var circ_cx = circle.getAttribute("cx");
      circ_cy = circle.getAttribute("cy");
      if (Math.sqrt(Math.pow(Number(mouse_up_x)-Number(circ_cx),2)+Math.pow(Number(mouse_up_y)-Number(circ_cy),2))<=14){
        circle_counter++
        circle_up=i+""+j
      }
      if (Math.sqrt(Math.pow(Number(mouse_down_x)-Number(circ_cx),2)+Math.pow(Number(mouse_down_y)-Number(circ_cy),2))<=14){
        circle_counter++
        circle_down=i+""+j
        }
      }
    }
  if(circle_counter==2){
    console.log("linked two circles")

  }
  else if(mouse_down_section==mouse_up_section){
    CurrnetAxis = mouse_up_section
    UpdateCurrentCircles()
    d3.select("#a_min_value").property("value",NomoAxisArray[CurrnetAxis][2])
    d3.select("#a_max_value").property("value",NomoAxisArray[CurrnetAxis][3])
    d3.select("#b_min_value").property("value",NomoAxisArray[CurrnetAxis][4])
    d3.select("#b_max_value").property("value",NomoAxisArray[CurrnetAxis][5])
    var element = document.getElementById('nomoselect');
    element.value = NomoAxisArray[CurrnetAxis][1];
    //console.log(NomoAxisArray[CurrnetAxis][3])
  }
  else{
    CircleLockedArray.move(mouse_down_section,mouse_up_section);
    CirclePositionArray.move(mouse_down_section,mouse_up_section);
    CurrnetAxis = mouse_up_section
    if(mouse_up_section<mouse_down_section){
      //console.log("moved left");
      for(i=mouse_up_section;i<=mouse_down_section;i++){
        NomoAxisArray[i][0]++
      }
      NomoAxisArray[mouse_down_section][0]=mouse_up_section;
      NomoAxisArray.sort(function(a,b){
        return a[0]-b[0]
      })
    }
    else{
      //console.log("moved right");
      for(i=mouse_down_section+1;i<=mouse_up_section;i++){
        NomoAxisArray[i][0]--
      }
      NomoAxisArray[mouse_down_section][0]=mouse_up_section;
      NomoAxisArray.sort(function(a,b){
        return a[0]-b[0]
      })
    }
    //console.log(NomoAxisArray)
    UpdateAxes();
  }
  //console.log(mouse_up_section)
}
function UpdateCurrentCircles(){
  //console.log(CurrnetAxis)
  //console.log(CircleLockedArray)
  //console.log(CircleLockedArray[CurrnetAxis])
  //console.log(NomoAxisArray)
  if(CircleLockedArray[CurrnetAxis][0]==0){
    CirclePositionArray[CurrnetAxis][0] = document.getElementById("PA0").textContent;
    pinA0value = document.getElementById("PA0").textContent;
  }
  if(CircleLockedArray[CurrnetAxis][1]==0){
    CirclePositionArray[CurrnetAxis][1] = document.getElementById("PA1").textContent;
    pinA1value = document.getElementById("PA1").textContent;
  }
  if(CircleLockedArray[CurrnetAxis][2]==0){
    CirclePositionArray[CurrnetAxis][2] = document.getElementById("PA2").textContent;
    pinA2value = document.getElementById("PA2").textContent;
  }
  for (i=0;i<NomoAxisArray.length;i++){
    for(j=0;j<3;j++){
      listlength=NomoAxisArray.length;
      place = NomoAxisArray[i][0];
      section = place*width/listlength;
      if(i==CurrnetAxis && CircleLockedArray[i][j] != 1){
        d3.select("#circle"+CurrnetAxis+""+j).attr("cy",MapArdPinToSVG(CirclePositionArray[CurrnetAxis][j])).attr("cx",section+(j+1)*width/listlength/4).attr("fill","steelblue");
        //d3.select("#circle"+CurrnetAxis+"1").attr("cy",MapArdPinToSVG(CirclePositionArray[CurrnetAxis][1])).attr("cx",section+2*width/listlength/4).attr("fill","steelblue");
        //d3.select("#circle"+CurrnetAxis+"2").attr("cy",MapArdPinToSVG(CirclePositionArray[CurrnetAxis][2])).attr("cx",section+3*width/listlength/4).attr("fill","steelblue");
      }
      if(i==CurrnetAxis && CircleLockedArray[i][j] == 1){
        d3.select("#circle"+i+""+j).attr("cy",MapArdPinToSVG(CirclePositionArray[CurrnetAxis][j])).attr("cx",section+(j+1)*width/listlength/4).attr("fill","red");
      }
      d3.select("#circle"+i+""+j).attr("cx",section+width/listlength/4);
      d3.select("#circle"+i+"1").attr("cx",section+2*width/listlength/4);
      d3.select("#circle"+i+"2").attr("cx",section+3*width/listlength/4);
    }
  }

}


function UpdateAxes(){
  //d3.selectAll("g").remove()
  d3.selectAll("#Axis").remove()
  d3.selectAll("#Text").remove()
  svg.select("rect").remove()
  svg.select("#underline").remove()
  listlength = NomoAxisArray.length;
  for (i=0;i<listlength;i++){

    place = NomoAxisArray[i][0];
    type = NomoAxisArray[i][1];
    temp_a_min = NomoAxisArray[i][2];
    temp_a_max = NomoAxisArray[i][3];
    temp_b_min = NomoAxisArray[i][4];
    temp_b_max = NomoAxisArray[i][5];

    section = place*width/listlength;

    if (type == "A+B=C" )
    {
      NomoDisplayType = 1;
    }
    else if (type == "A-B=C" )
    {
      NomoDisplayType = 2;
    }
    else if (type == "A*B=C" )
    {
      NomoDisplayType = 3;
    }
    else if (type == "A/B=C" )
    {
      NomoDisplayType = 4;
    }

    if (i==CurrnetAxis){
      //<rect x="0" y="0" width="50" height="50" fill="green" />
      svg.append("line").attr("x1",section+width/listlength/2-50).attr("y1",520).attr("x2",section+width/listlength/2+50).attr("y2",520).attr("stroke-width", 2).attr("stroke", "grey").attr("id","underline");
      //svg.append("rect").attr("x",section+width/listlength/8).attr("y",30).attr("width",3*width/listlength/4).attr("height",420).attr("fill","AliceBlue").style("opacity","0.5")
    }
    var text_y = 20;
    var opperand_y = 470;
    fontsize_val = "20px"
    svg.append("text").attr("x",section+2*width/listlength/4).attr("y",opperand_y+40).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("Nomograph "+i)
    if (this.value == "A+B=C" || NomoDisplayType == 1)
    {

      DrawAxis("linear",temp_a_min,temp_a_max,section+width/listlength/4,"Axis")
      svg.append("text").attr("x",section+width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("A")
      DrawAxis("linear",Number(temp_a_min)+Number(temp_b_min),Number(temp_a_max)+Number(temp_b_max),section+2*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("C")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",opperand_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("+")
      DrawAxis("linear",temp_b_min,temp_b_max,section+3*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+3*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("B")
      NomoDisplayType = 1;

    }
    if (this.value == "A-B=C" || NomoDisplayType == 2)
    {
      DrawAxis("linear",temp_b_min,temp_b_max,section+width/listlength/4,"Axis")
      svg.append("text").attr("x",section+width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("B")
      DrawAxis("linear",temp_a_min,temp_a_max,section+2*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("A")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",opperand_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("-")
      DrawAxis("linear",Number(temp_a_min)-Number(temp_b_min),Number(temp_a_max)-Number(temp_b_max),section+3*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+3*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("C")
      NomoDisplayType = 2;
    }
    if (this.value == "A*B=C" || NomoDisplayType == 3)
    {
      DrawAxis("log",temp_a_min,temp_a_max,section+width/listlength/4,"Axis")
      svg.append("text").attr("x",section+width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("A")
      DrawAxis("log",Number(temp_a_min)*Number(temp_b_min),Number(temp_a_max)*Number(temp_b_max),section+2*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("C")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",opperand_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("x")
      DrawAxis("log",temp_b_min,temp_b_max,section+3*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+3*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("B")
      NomoDisplayType = 3;
    }
    if (this.value == "A/B=C" || NomoDisplayType == 4)
    {
      DrawAxis("log",temp_b_min,temp_b_max,section+width/listlength/4,"Axis")
      svg.append("text").attr("x",section+width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("B")
      DrawAxis("log",temp_a_min,temp_a_max,section+2*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("A")
      svg.append("text").attr("x",section+2*width/listlength/4).attr("y",opperand_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("÷")
      DrawAxis("log",Number(temp_a_min)/Number(temp_b_min),Number(temp_a_max)/Number(temp_b_max),section+3*width/listlength/4,"Axis")
      svg.append("text").attr("x",section+3*width/listlength/4).attr("y",text_y).attr("text-anchor","middle").attr("font-size",fontsize_val).attr("id","Text").text("C")
      NomoDisplayType = 4;
    }
  }
}


function NomoDropFunction(){
  d3.select("#CurrentAxisLeft").remove()
  d3.select("#CurrentAxisCenter").remove()
  d3.select("#CurrentAxisRight").remove()
  if (this.value == "A+B=C" )
  {
    NomoDisplayType = 1;
  }
  if (this.value == "A-B=C" )
  {
    NomoDisplayType = 2;
  }
  if (this.value == "A*B=C" )
  {
    NomoDisplayType = 3;
  }
  if (this.value == "A/B=C" )
  {
    NomoDisplayType = 4;
  }

  if (this.value == "A+B=C" || NomoDisplayType == 1)
  {
    DrawAxis("linear",a_min,a_max,Axis00x,"CurrentAxisLeft")
    DrawAxis("linear",Number(a_min)+Number(b_min),Number(a_max)+Number(b_max),Axis01x,"CurrentAxisCenter")
    DrawAxis("linear",b_min,b_max,Axis02x,"CurrentAxisRight")
    NomoDisplayType = 1;

  }
  if (this.value == "A-B=C" || NomoDisplayType == 2)
  {
    DrawAxis("linear",a_min,a_max,Axis00x,"CurrentAxisLeft")
    DrawAxis("linear",Number(a_min)+Number(b_min),Number(a_max)+Number(b_max),Axis01x,"CurrentAxisCenter")
    DrawAxis("linear",b_min,b_max,Axis02x,"CurrentAxisRight")
    NomoDisplayType = 2;
  }
  if (this.value == "A*B=C" || NomoDisplayType == 3)
  {
    DrawAxis("log",a_min,a_max,Axis00x,"CurrentAxisLeft")
    DrawAxis("log",Number(a_min)*Number(b_min),Number(a_max)*Number(b_max),Axis01x,"CurrentAxisCenter")
    DrawAxis("log",b_min,b_max,Axis02x,"CurrentAxisRight")
    NomoDisplayType = 3;
  }
  if (this.value == "A/B=C" || NomoDisplayType == 4)
  {
    DrawAxis("log",a_min,a_max,Axis00x,"CurrentAxisLeft")
    DrawAxis("log",Number(a_min)*Number(b_min),Number(a_max)*Number(b_max),Axis01x,"CurrentAxisCenter")
    DrawAxis("log",b_min,b_max,Axis02x,"CurrentAxisRight")
    NomoDisplayType = 4;
  }
}

function MapArdPinToSVG(value){
  y_shift = 40;
  y_range = 400;
  return Math.round(y_shift +value*y_range/1023.0)
}

//AXES
function DrawAxis(type,min,max,location,id){
  if (type == 'log'){
    //Define Y axis
    var yScale = d3.scale.log()
    			 .domain([min, max])
    			 .range([y_range+ y_shift,y_shift]);


    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    //Create Y axis
    svg.append("g").attr("id",id+"")
        .attr("class", "axis")
        .attr("transform", "translate(" + location + ",0)")
        .call(yAxis);
  }

  if (type == 'linear'){
    //Define Y axis
    var yScale = d3.scale.linear()
    			 .domain([min, max])
    			 .range([y_range+ y_shift,y_shift]);


    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    //Create Y axis
    svg.append("g").attr("id",id+"")
        .attr("class", "axis")
        .attr("transform", "translate(" + location + ",0)")
        .call(yAxis);
  }
}

var Axis00x =width/4,Axis01x =2*width/4,Axis02x =3*width/4;
//
// DrawAxis("linear",1,10,Axis00x,"CurrentAxisLeft")
// DrawAxis("linear",2,20,Axis01x,"CurrentAxisCenter")
// DrawAxis("linear",1,10,Axis02x,"CurrentAxisRight")

UpdateAxes();
var pa0circle = svg.append("circle").attr("fill","steelblue").attr("cx",width/4/2+"px").attr("r","8px").attr("id","circle"+CurrnetAxis+"0")
var pa1circle = svg.append("circle").attr("fill","steelblue").attr("cx",2*width/4/2+"px").attr("r","8px").attr("id","circle"+CurrnetAxis+"1")
var pa2circle = svg.append("circle").attr("fill","steelblue").attr("cx",3*width/4/2+"px").attr("r","8px").attr("id","circle"+CurrnetAxis+"2")

UpdateAxes();
// svg.append("circle").attr("fill","steelblue").attr("cx",width/NomoAxisArray.length+width/4/2+"px").attr("r","8px").attr("id","circle"+1+"0").attr("cy",MapArdPinToSVG(1023)+"px")
// svg.append("circle").attr("fill","steelblue").attr("cx",width/NomoAxisArray.length+2*width/4/2+"px").attr("r","8px").attr("id","circle"+1+"1").attr("cy",MapArdPinToSVG(1023)+"px")
// svg.append("circle").attr("fill","steelblue").attr("cx",width/NomoAxisArray.length+3*width/4/2+"px").attr("r","8px").attr("id","circle"+1+"2").attr("cy",MapArdPinToSVG(1023)+"px")



function visualizecurrentline(){
  listlength = NomoAxisArray.length
  //console.log(CurrnetAxis)
  //console.log(listlength)
  //console.log(NomoAxisArray[CurrnetAxis])
  section = NomoAxisArray[CurrnetAxis][0]*width/listlength
  x1 = Number(section+width/listlength/4)
  y1 = Number(MapArdPinToSVG(pinA0value))
  x2 = Number(section+2*width/listlength/4)
  y2 = Number(MapArdPinToSVG(pinA1value))
  x3 = Number(section+3*width/listlength/4)
  y3 = Number(MapArdPinToSVG(pinA2value))

  xbar = (x1+x2+x3)/3
  ybar = (y1+y2+y3)/3
  xybar = (x1*y1+x2*y2+x3*y3)/3
  m = ((x1-xbar)*(y1-ybar)+(x2-xbar)*(y2-ybar)+(x3-xbar)*(y3-ybar))/(Math.pow((x1-xbar),2)+Math.pow((x2-xbar),2)+Math.pow((x3-xbar),2))
  b = ybar-m*xbar
  rsquared = 1 -(Math.pow(m*x1+b-y1,2)+Math.pow(m*x2+b-y2,2)+Math.pow(m*x3+b-y3,2))/(Math.pow(y1-ybar,2)+Math.pow(y2-ybar,2)+Math.pow(y3-ybar,2)) //Math.pow((xybar-xbar*ybar)/Math.sqrt(+),2)
  //a = (3*(x1*y1+x2*y2+x3*y3)-(x1+x2+x3)*(y1+y2+y3))/(3.0*(x1^2+x2^2+x3^2)-(x1+x2+x3)^2)
  //b = 1/3.0*((y1+y2+y3)+a*(x1+x2+x3))
  //console.log("r^2= "+rsquared)
  d3.select("#line"+CurrnetAxis).attr("x1",x1).attr("y1",m*x1+b).attr("x2",x3).attr("y2",m*x3+b).attr("stroke-width", 2).attr("stroke", "black");
  // if(rsquared>=0.9)
  // {
  //   pa0circle.attr("fill","steelblue");
  //   pa1circle.attr("fill","steelblue");
  //   pa2circle.attr("fill","steelblue");
  // }
  // else{
  //   pa0circle.attr("fill","red");
  //   pa1circle.attr("fill","red");
  //   pa2circle.attr("fill","red");
  // }
}

function updatelines(){
  for (i=0;i<NomoAxisArray.length;i++){
    listlength = NomoAxisArray.length
    //console.log(CurrnetAxis)
    //console.log(listlength)
    //console.log(NomoAxisArray[CurrnetAxis])
    section = NomoAxisArray[i][0]*width/listlength
    x1 = Number(section+width/listlength/4)
    x2 = Number(section+2*width/listlength/4)
    x3 = Number(section+3*width/listlength/4)
    // if(i == CurrnetAxis){
    //   y1 = Number(MapArdPinToSVG(pinA0value))
    //   y2 = Number(MapArdPinToSVG(pinA1value))
    //   y3 = Number(MapArdPinToSVG(pinA2value))
    //   xbar = (x1+x2+x3)/3
    //   ybar = (y1+y2+y3)/3
    //   xybar = (x1*y1+x2*y2+x3*y3)/3
    //   m = ((x1-xbar)*(y1-ybar)+(x2-xbar)*(y2-ybar)+(x3-xbar)*(y3-ybar))/(Math.pow((x1-xbar),2)+Math.pow((x2-xbar),2)+Math.pow((x3-xbar),2))
    //   b = ybar-m*xbar
    //   rsquared = 1 -(Math.pow(m*x1+b-y1,2)+Math.pow(m*x2+b-y2,2)+Math.pow(m*x3+b-y3,2))/(Math.pow(y1-ybar,2)+Math.pow(y2-ybar,2)+Math.pow(y3-ybar,2)) //Math.pow((xybar-xbar*ybar)/Math.sqrt(+),2)
    //   //a = (3*(x1*y1+x2*y2+x3*y3)-(x1+x2+x3)*(y1+y2+y3))/(3.0*(x1^2+x2^2+x3^2)-(x1+x2+x3)^2)
    //   //b = 1/3.0*((y1+y2+y3)+a*(x1+x2+x3))
    //   //console.log("r^2= "+rsquared)
    //   d3.select("#line"+i).attr("x1",x1).attr("y1",m*x1+b).attr("x2",x3).attr("y2",m*x3+b).attr("stroke-width", 2).attr("stroke", "black");
    // }
    //else{
      y1 = MapArdPinToSVG(CirclePositionArray[i][0])
      y2 = MapArdPinToSVG(CirclePositionArray[i][1])
      y3 = MapArdPinToSVG(CirclePositionArray[i][2])
  // /  }

    xbar = (x1+x2+x3)/3
    ybar = (Number(y1)+Number(y2)+Number(y3))/3
    xybar = (x1*y1+x2*y2+x3*y3)/3
    m = ((x1-xbar)*(y1-ybar)+(x2-xbar)*(y2-ybar)+(x3-xbar)*(y3-ybar))/(Math.pow((x1-xbar),2)+Math.pow((x2-xbar),2)+Math.pow((x3-xbar),2))
    b = ybar-m*xbar
    rsquared = 1 -(Math.pow(m*x1+b-y1,2)+Math.pow(m*x2+b-y2,2)+Math.pow(m*x3+b-y3,2))/(Math.pow(y1-ybar,2)+Math.pow(y2-ybar,2)+Math.pow(y3-ybar,2)) //Math.pow((xybar-xbar*ybar)/Math.sqrt(+),2)
    //a = (3*(x1*y1+x2*y2+x3*y3)-(x1+x2+x3)*(y1+y2+y3))/(3.0*(x1^2+x2^2+x3^2)-(x1+x2+x3)^2)
    //b = 1/3.0*((y1+y2+y3)+a*(x1+x2+x3))
    //console.log("r^2= "+rsquared)
    d3.select("#line"+i).attr("x1",x1).attr("y1",m*x1+b).attr("x2",x3).attr("y2",m*x3+b).attr("stroke-width", 2).attr("stroke", "black");
    // if(rsquared>=0.9)
    // {
    //   pa0circle.attr("fill","steelblue");
    //   pa1circle.attr("fill","steelblue");
    //   pa2circle.attr("fill","steelblue");
    // }
    // else{
    //   pa0circle.attr("fill","red");
    //   pa1circle.attr("fill","red");
    //   pa2circle.attr("fill","red");
    // }
  }
}

function visualizeline(){
  x1 = Number(Axis00x)
  y1 = Number(MapArdPinToSVG(pinA0value))
  x2 = Number(Axis01x)
  y2 = Number(MapArdPinToSVG(pinA1value))
  x3 = Number(Axis02x)
  y3 = Number(MapArdPinToSVG(pinA2value))

  xbar = (x1+x2+x3)/3
  ybar = (y1+y2+y3)/3
  xybar = (x1*y1+x2*y2+x3*y3)/3
  m = ((x1-xbar)*(y1-ybar)+(x2-xbar)*(y2-ybar)+(x3-xbar)*(y3-ybar))/(Math.pow((x1-xbar),2)+Math.pow((x2-xbar),2)+Math.pow((x3-xbar),2))
  b = ybar-m*xbar
  rsquared = 1 -(Math.pow(m*x1+b-y1,2)+Math.pow(m*x2+b-y2,2)+Math.pow(m*x3+b-y3,2))/(Math.pow(y1-ybar,2)+Math.pow(y2-ybar,2)+Math.pow(y3-ybar,2)) //Math.pow((xybar-xbar*ybar)/Math.sqrt(+),2)
  //a = (3*(x1*y1+x2*y2+x3*y3)-(x1+x2+x3)*(y1+y2+y3))/(3.0*(x1^2+x2^2+x3^2)-(x1+x2+x3)^2)
  //b = 1/3.0*((y1+y2+y3)+a*(x1+x2+x3))
  //console.log("r^2= "+rsquared)
  line0.attr("x1",x1).attr("y1",m*x1+b).attr("x2",x3).attr("y2",m*x3+b).attr("stroke-width", 2).attr("stroke", "black");
  // if(rsquared>=0.9)
  // {
  //   pa0circle.attr("fill","steelblue");
  //   pa1circle.attr("fill","steelblue");
  //   pa2circle.attr("fill","steelblue");
  // }
  // else{
  //   pa0circle.attr("fill","red");
  //   pa1circle.attr("fill","red");
  //   pa2circle.attr("fill","red");
  // }
}
