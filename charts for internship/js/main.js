function clickcount(count){
      count++;
      return count;
}
function chart(colors){   
      var csv, json;
      //listen to the switch button for click
      var classEl = document.getElementById('one');
      classEl.addEventListener("click",function(e){
      //check for checkbox button been clicked or not
      if(document.getElementById("one").checked){
        //if button been clicked call ppt chart
          pptchart();
      }
      else{
        //if checkbox is not checked call temp chart
        tempchart();
      }
      });
      //add event listener for class readBytesButtons while click
      document.getElementsByClassName('readBytesButtons')[0].addEventListener('click', function(evt) {
              //check whether the chart is already called or not
                if (evt.target.tagName.toLowerCase() == 'button' && d3.select('.grid')[0][0] === null) 
                  //if chart is not been called call it for first time
                   readBlob();         
      }, false);
      //read the data file 
      function readBlob() {

		    var files = document.getElementById('files').files;
		    if (!files.length) {
          //if there is no file ask user to select a file
		      alert('Please select a file!');
		      return;
		    };
		    var file = files[0], 
            start =  0, 
            stop = file.size - 1, 
            reader = new FileReader();
		    reader.onloadend= function(evt) {
          //check the file has data or not
		      if (evt.target.readyState == FileReader.DONE) {
				       csv = evt.target.result;    
               //conver the data from file to json format by call funtion with data as argument
				       var json = CSV2JSON(csv);
               //call chart to with json data to render for user
				       makechart(json);
              var barButton = document.getElementById('linkToPieChart');
              if(hasClass(barButton,"hide"))
              {
                toggleClass(barButton,"show","hide");
              };
			    };
  		 	}
		    var blob = file.slice(start, stop + 1); 
		    reader.readAsBinaryString(blob);
	    }
      //convert file format data to json format
      function CSV2JSON(csv) { 
            //convert csv format to array format
            var array = CSVToArray(csv),objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }
            var json = objArray;
            return json;
      }
      //convert csv format to array format
      function CSVToArray(strData, strDelimiter) {
            strDelimiter = (strDelimiter || ",");
            var objPattern = new RegExp((
                                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                                    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi"),
                arrData = [[]],
                arrMatches = null;
            while (arrMatches = objPattern.exec(strData)) {
                          var strMatchedDelimiter = arrMatches[1];
                          if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                              arrData.push([]);
                          }
                          if (arrMatches[2]) {
                              var strMatchedValue = arrMatches[2].replace(
                              new RegExp("\"\"", "g"), "\"");
                          } else {
                              var strMatchedValue = arrMatches[3];
                          }
                          arrData[arrData.length - 1].push(strMatchedValue);
            }
            return (arrData);
      };
      document.getElementById('linkToPieChart').onclick=function(){
          var chartLeft = document.getElementById('chartBarLeft'),
              chartRight = document.getElementById('chartPieRight');
          if(hasClass(chartLeft,"show"))
          {
            toggleClass(chartLeft,"hide","show");
            toggleClass(chartRight,"show","hide");
          };
          if(document.getElementById("one").checked){
              //if button been clicked call ppt chart
                pptchart();
            }
            else{
              //if checkbox is not checked call temp chart
              tempchart();
            }
      };
      document.getElementById('linkToBarChart').onclick=function(){
          var chartLeft = document.getElementById('chartBarLeft'),
              chartRight = document.getElementById('chartPieRight');
          if(hasClass(chartLeft,"hide"))
          {
            toggleClass(chartRight,"hide","show");
            toggleClass(chartLeft,"show","hide");
          };
      };
      //render chart by call make chart function with data and colors
      function makechart(data,colors){
            var time=[];
            if(average_ppt.length!=0){
                    average_ppt.length==0;
                   }
            
            for(i=0;i<data.length;i++){
            	time[i]=data[i].time;
            }
            //convert the given data's time to date format
            var parseDate = d3.time.format("%m/%d/%Y").parse;
            for(i=0;i<data.length;i++){
            	data[i].time=parseDate(data[i].time);

            }
            var  w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            //use d3.chart function to build charts
            d3.chart("internsBarChart", {
              //initalize variables inside d3.charts function
              initialize: function() {
                // create a base scale we will use later.
                var chart = this;
              
                //Get height and width of chart and covert it into values
                chart.w = +chart.base.attr('width');
                chart.h = +chart.base.attr('height');

                // chart margins to account for labels.
                chart.margins = {
                  left : leftOrigin,//80
                  top : 0.0299*y//20
                };
                //convert the given data's time to date format
                chart.formatTime = d3.time.format("%m/%d/%Y");

                chart.wf = chart.w;
                chart.hf = 0.09445*y;//63;

                chart.h = chart.h-(3*chart.margins.top);

                //select dom element for circle's tooltip
                chart.div1= d3.select("body").append("div") 
                .attr("class", "tooltip")       
                .style("opacity", 0);
                //select dom element for bar's tooltip
                chart.div2= d3.select("body").append("div") 
                .attr("class", "tooltip")       
                .style("opacity", 0);                
                //select dom element for background abd apply linear gradient to it
                d3.select('#graph')
                      .style('background','-webkit-linear-gradient(top,  #ffffff 0%, #ffffff '+gradientValue+'%,#dbdbdb '+gradientValue+'%,#dbdbdb 95%,#ffffff 95%,#ffffff 100%)');
                //construct range for x,y0 and y1
                chart.x = d3.scale.linear().range([0, chart.w]);
                chart.y0 = d3.scale.linear().range([chart.h, 0]);
                chart.y1 = d3.scale.linear().range([chart.h, 0]);

                chart.xf = d3.scale.linear().range([0, chart.wf]);
                chart.y0f = d3.scale.linear().range([chart.hf, 0]);
                chart.y1f = d3.scale.linear().range([chart.hf, 0]);

                chart.brush = d3.svg.brush()
                                  .x(chart.xf)
                                  .on("brush", brushed);
                //construct line function 
                chart.line = d3.svg.line()
                                  .x(function(d,i){return chart.x(i+1);})
                                  .y(function(d) {return chart.y1(d.ppt);})

                chart.lineFull = d3.svg.line()
                                  .x(function(d,i){return chart.xf(i+1);})
                                  .y(function(d) {return chart.y1f(d.ppt);})
                //make x and y axis function for grids
                function make_x_axis() {
                  return d3.svg.axis()
                  .scale(chart.x)
                  .orient("bottom")
                  .ticks(20)
                }

                function make_y_axis() {    
                  return d3.svg.axis()
                  .scale(chart.y0)
                  .orient("left")
                  .ticks(10)
                };
                //make label for x axis 
                  var xAxis = d3.svg.axis().scale(chart.x).tickValues([16,45,75,105,136,166,197,228,258,289,319,350]).orient("bottom").tickFormat(d3.format("d"));
                  xAxis.tickFormat(function(d, i){
                   if(d==16) return ("January")
                   if(d==45)    return ("February")
                   if(d==75)    return ("March")
                   if(d==105)  return ("April")
                   if(d==136)  return ("May")
                   if(d==166)  return ("June")
                   if(d==197)  return ("July")
                   if(d==228)  return ("August")
                   if(d==258)  return ("September")
                   if(d==289)  return ("October")
                   if(d==319)  return ("November")
                   if(d==350)  return ("December")
                  });
                //make width and height for barchart
                chart.base
                  .classed('Barchart', true)
                  .attr('id','BarChartId')
                  .attr('width',chart.w)
                  .attr('height',chart.h+(2*chart.margins.top))
                  .attr('viewBox',"0,0,"+chart.w+","+(chart.h+(2*chart.margins.top)))
                  .attr('preserveAspectRatio',"xMidYMid");

                chart.base = chart.base.append("svg:g")
                            .attr("transform", "translate(0," + chart.margins.top+ ")");
                //construct x and y grids and use transform for x grid
                chart.base.append("g")      
                  .attr("class", "x grid")
                  .attr("transform", "translate(0," + chart.h + ")")
                  .call(make_x_axis()
                        .tickSize(-chart.h, 0, 0)
                        .tickFormat("")
                  )
                chart.base.append("g")     
                  .attr("class", "y grid")
                  .call(make_y_axis()
                        .tickSize(-chart.w, 0, 0)
                        .tickFormat("")
                  )
                //have an empty object to get chart elements
                this.areas = {};
                //make dom element for left y label
                chart.areas.ylabelsLeft = d3.select("#axis").append("svg:svg")
                  .attr("id",'yLeftLabelID')
                  .attr('width', chart.margins.left)
                  .attr('height', chart.h+(2*chart.margins.top))
                  .attr('viewBox',"0,0,"+chart.margins.left+","+(chart.h+(2*chart.margins.top)))
                  .attr('preserveAspectRatio',"xMinYMid");
                chart.areas.ylabelsLeft = chart.areas.ylabelsLeft.append("svg:g")
                  .attr('transform', 'translate(0,'+(chart.margins.top)+')');

                //make dom element for x label
                chart.areas.xlabels = chart.base.append('g')
                  .classed('x axis', true)
                  .attr('width', chart.w)
                  .attr('height', chart.h+(2*chart.margins.top)) // 5 of 667
                  .attr('transform', 'translate(0,'+(chart.h)+')')
                  .attr("stroke","#848484")
                  .attr("stroke-width","0.5");
                //make dom element for min and max temp bars and line
                chart.areas.bars1 = chart.base.append('g')
                chart.areas.bars2 = chart.base.append('g')
                chart.areas.lines = chart.base.append('g')
                                        .classed('lines', true)
                                        .attr('width', chart.w)
                                        .attr('height', chart.h);
                //make dom element for right y label
                chart.areas.ylabelsRight = d3.select("#y-axis-right").append("svg:svg") 
                  .attr('id','yRightLabelID')               
                  .attr('width',  chart.margins.left)
                  .attr('height', chart.h+(2*chart.margins.top))
                  // .attr('viewBox',"0,0,"+chart.margins.left+","+(chart.h+(2*chart.margins.top)))
                  // .attr('preserveAspectRatio',"xMidYMid");

                chart.areas.ylabelsRight = chart.areas.ylabelsRight.append("svg:g")
                  .attr('transform', 'translate(0,'+(chart.margins.top)+')')
                  .append("svg:g")
                  .classed('y axis right', true);
                  console.log(chart.wf,chart.margins.left,chart.w);

                chart.areas.chartFullBar = d3.select("#entire-data-chart").append("svg:svg")
                  .attr('id','fullChartID')               
                  .attr('width',chart.wf+chart.margins.left) 
                  .attr('height', chart.hf+(0.0299*y)) 
                  // .attr('viewBox',"0,0,"+(chart.wf+chart.margins.left)+","+(chart.hf+(0.0299*y)))
                  // .attr('preserveAspectRatio',"xMidYMid");

                chart.areas.chartFullBar = chart.areas.chartFullBar.append("svg:g")
                  .attr('transform', 'translate('+chart.margins.left+',0)')
                  .append('g');
                chart.areas.barClippath = chart.areas.chartFullBar.append('defs')
                chart.areas.barClippath = chart.areas.barClippath.append('clipPath')
                                              .attr('id','clipFull')
                                              .append('rect')
                                              .attr('width',chart.margins.left)
                                              .attr('height',chart.hf)
                                              .attr('x',0);

                function resizePath(d) {
                  var e = +(d == "e"),
                      x = e ? 1 : -1,
                      y = chart.hf / 3;
                  return "M" + (.5 * x) + "," + y
                      + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
                      + "V" + (2 * y - 6)
                      + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
                      + "Z"
                      + "M" + (2.5 * x) + "," + (y + 8)
                      + "V" + (2 * y - 8)
                      + "M" + (4.5 * x) + "," + (y + 8)
                      + "V" + (2 * y - 8);
                }

                function brushed() {
                         var barWidth = (0.00146*x);  // 2 of 1366
                         var barpadding = (0.000146*x); //.2 of 1366
                          chart.x.domain(chart.brush.empty() ? chart.xf.domain() : chart.brush.extent());
                          chart.areas.bars1.selectAll(".bar1")                            
                                        .attr("d", function(datum, index) { 
                                              return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.max_temp),(chart.w / data.length- barpadding+(0.00366*x)),chart.h-chart.y0(datum.max_temp),0.00366*x);
                                        });
                          chart.areas.bars2.selectAll(".bar2").attr("d", function(datum, index) { 
                                            return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.min_temp),(chart.w / data.length- barpadding+(0.00366*x)),chart.h-chart.y0(datum.min_temp),0.00366*x);
                                    });
                          chart.areas.lines.select(".path1").attr("d",chart.line(data));
                          d3.select('.x.axis').remove();
                          chart.areas.xlabels = chart.base.append('g')
                                    .classed('x axis', true)
                                    .attr('width', chart.w) // 2 of 1366
                                    .attr('height', chart.h+(2*chart.margins.top)) //5 of 667
                                    .attr('transform', 'translate(0,'+(chart.h)+')')
                                    .attr("stroke","#848484")
                                    .attr("stroke-width","0.5")
                                    .call(xAxis);
                          chart.areas.circles.selectAll('.circle')
                                            .attr("cx", function(d,i){return chart.x(i+1);});
                          d3.selectAll(".handle").attr("d", resizePath);      
                        };

                chart.areas.xlabelsFull = chart.areas.chartFullBar.append('g')
                  .classed('x axis', true)
                  .attr('width', chart.wf)
                  .attr('height', chart.hf)
                  .attr('transform', 'translate(0,'+(chart.hf)+')')
                  .attr("stroke","#848484")
                  .attr("stroke-width","0.5");

                chart.areas.chartFullBar1 =chart.areas.chartFullBar.append('g');
                chart.areas.chartFullBar2 =chart.areas.chartFullBar.append('g');
                chart.areas.chartFullLine =chart.areas.chartFullBar.append('g')
                                                 .classed('lines', true);

                chart.areas.barBrush = chart.areas.chartFullBar.append('g')
                                              .attr("class", "x brush");
                     
                //make left y axis label
                chart.areas.y0Text = chart.areas.ylabelsLeft.append("text")
                  .classed('y text 1', true)
                  .attr("transform", "rotate(-90)")
                  .attr("y", ((0.2*chart.margins.left)-leftyAxis))
                  .attr("x", -(chart.h/2))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .style("float","left")
                  .text("Maximum Temperature")
                  .style("font-family", "Tahoma")
                  .style("font-weight","bold")
                  .style("font-size", "20px" )
                  .style("fill","#34495e");
                //make right y axis label
                chart.areas.yText = chart.areas.ylabelsRight.append("text")
                  .classed('y text 2', true)
                  .attr("transform", "rotate(90)")
                  .attr("y", (-(0.0439*x)-rightyAxis))//60 of 667
                  .attr("x", (chart.h/2))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .style("float","left")
                  .text("Average Precipitation")
                  .style("font-family", "Tahoma")
                  .style("font-weight","bold")
                  .style("font-size", "20px" )
                  .style("fill","#34495e");
                //make x axis label
                d3.select(".labelschart")
                      .append('div')
                      .attr('id','x-axis').text('Months of the year');
                //make dom element for cirle
                chart.areas.circles = chart.base.append("g")
                //make each bar rounded edge
                function topRoundedRect(x, y, width, height, radius) {
                  return "M" + (x + radius) + "," + y
                       + "h" + (width - (radius * 2))
                       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                       + "v" + (height - radius)
                       + "h" + (0-width)
                       + "v" + (0-(height-radius))
                       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
                       + "z";
                };
                function barPath(groups) {
                    var barWidth = 2;
                    var barpadding = .2;
                    var path = [],
                        i = -1,
                        n = groups.length,
                        d;
                    while (++i < n) {
                      d = groups[i];
                      path.push(topRoundedRect(chart.x(i+1)-barWidth/2, chart.y0(d),(chart.w / groups.length- barpadding+(0.00366*x)),chart.h-chart.y0(d),2));
                    };
                    return path.join("");
                  };
                function barPathFull(groups) {
                      var barWidth = .1;
                      var barpadding = .2;
                    var path = [],
                        i = -1,
                        n = groups.length,
                        d;
                    while (++i < n) {
                      d = groups[i];
                      path.push(topRoundedRect(chart.xf(i+1)-barWidth/2, chart.y0f(d),(chart.wf / groups.length- barpadding),chart.hf-chart.y0f(d),1));
                    }
                    return path.join("");
                  };

                //have first layer for max temperature bars
                chart.layer('bars1', chart.areas.bars1, {
                  dataBind: function(data) {

                        // update the domain of the x,y0 and y1 Scales since it depends on the data
                        chart.x.domain([0.5,data.length]);
                        chart.y0.domain([0,d3.max(data.map(function(datum){return +datum.max_temp;}))]);
                        chart.y1.domain([0,d3.max(data.map(function(datum){return +datum.ppt;}))]);
                        //call x axis 
                        chart.areas.xlabels.call(xAxis);
                        //call left y axis and render it in chart
                        var yAxisLeft = d3.svg.axis().scale(chart.y0).ticks(10).orient("left");
                        chart.areas.ylabelsLeft
                                  .append("svg:g")
                                  .classed('y axis', true)
                                  .attr("stroke","#848484")
                                  .attr("stroke-width","0.5")
                                  .attr("transform", "translate(" + (chart.margins.left) + ",0)")
                                  .call(yAxisLeft);
                        //call right y axis and render it in chart
                        var yAxisRight = d3.svg.axis().scale(chart.y1).ticks(10).orient("right");
                        chart.areas.ylabelsRight
                                  .attr("stroke","#848484")
                                  .attr("stroke-width","0.5")
                                  .call(yAxisRight);
                        //select dom element to construct bars
                        var datai = _.pluck(data,'max_temp')
                        for(var i=0;i<datai.length;i++){
                          datai[i] = +datai[i];
                        };
                        return this.selectAll("rect1")
                               .data(data);        
                  },
                  insert: function() {
                      //append tag element for bars
                      return this.append("path")
                        .classed('bar1', true)
                  },

                });
                //on data enter make the line for bars
                var onEnterBar1 = function(){
                      var barWidth = (0.00146*x);
                      var barpadding = (0.000146*x);
                      return this
                            .attr("fill", "#1ABC9C")
                            .attr("d", function(datum, index) { 
                                      return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.max_temp),(chart.w / data.length- barpadding+(0.00366*x)),chart.h-chart.y0(datum.max_temp),0.00366*x);
                              })
                            .on('mousemove',mouseoverOnBar) //call mouseoverOnBar function while mouseover on bar
                            .on('mouseout',del)// call del function while mouseout of the bar
                            .on("click",mouseClickOnBar); //call mouseClickOnBar function while mousemove of the bar
                };
                var mouseClickOnBar = function(){
                  tempchart();//call tempchart function while mouse click on the bar
                  document.getElementById('one').checked = false;//make checkbox false while mouse click on the bar
                 };
                var mouseoverOnBar = function(d,i){

                      var x0 = chart.x.invert(d3.mouse(this)[0]).toFixed(0);
                      if(this.className.baseVal === 'bar1'){
                          var y=parseFloat(data[x0-1].max_temp);
                          var tempVar = 'Max temp';
                      }else{
                          var y=parseFloat(data[x0-1].min_temp);
                          var tempVar = 'Min temp';
                      }
                      var x1=data[x0-1].time;
                      var monthsId=["January","February","March","April","May","June","July","August","September","October","November","December"];
                      for(var iterator1=0;iterator1<monthsId.length;iterator1++)
                      {
                        if(iterator1 !== d.time.getMonth()){
                            d3.select('#sliceId'+monthsId[iterator1])
                                .style('opacity',0.3);
                                // .style('stroke-width',3)
                                // .style('stroke','gray');
                            d3.select('#pieTextValue'+monthsId[iterator1])
                                .style("display",'none');

                            d3.select('#pieLine'+monthsId[iterator1])
                                .style("display",'none');
                          }
                          else{
                            d3.select('#pieTextValue'+monthsId[iterator1])
                              .style("display",'block');

                            d3.select('#pieLine'+monthsId[iterator1])
                              .style("display",'block');
                          }
                      }
                      //make tooltip when mouseover on bar
                      console.log(d3.event.pageX);
                      chart.div2 .html(tempVar+": "+ y + "<br/>" + "Day: "+ chart.formatTime(x1)) 
                              .style("left", x<=768?((d3.event.pageX>x/2)?(d3.event.pageX-(0.3*x)):d3.event.pageX):d3.event.pageX+"px" )  
                              .style("top", (d3.event.pageY-(0.0899*y))+"px")
                              .style("opacity", 0.9); 
                };
                //delete tooltip when mouseout of the bar
                var del =function(d){

                      var monthsId=["January","February","March","April","May","June","July","August","September","October","November","December"];
                      for(var iterator2=0;iterator2<monthsId.length;iterator2++)
                      {
                        d3.select('#sliceId'+monthsId[iterator2])
                            .style('opacity',1)
                            // .style('stroke-width',1.5)
                            // .style('stroke','#ffffff');
                        d3.select('#pieTextValue'+monthsId[iterator2])
                            .style("display",'none');

                        d3.select('#pieLine'+monthsId[iterator2])
                            .style("display",'none');
                      }
                      chart.div2.transition()    
                          .duration(500)    
                          .style("opacity", 0);
                };

                chart.layer('bars1').on('enter', onEnterBar1);
                chart.layer('bars1').on('update', onEnterBar1);
                //have second layer for min temperature bars
                chart.layer('bars2', chart.areas.bars2, {
                            dataBind: function(data) {
                                var datai = _.pluck(data,'min_temp');
                                for(var i=0;i<datai.length;i++){
                                  datai[i] = +datai[i];
                                };
                                return this.selectAll("rect2")
                                         .data(data);
                            },
                            insert: function() {
                                  return this.append("path")
                                          .classed('bar2', true)
                            }
                });
                //on data enter make the line for bars
                var onEnterBar2 = function(){
                      var barWidth = (0.00366*x);
                      var barpadding = (0.00146*x);
                      return this.attr("fill", "#34495e")
                                    .attr("d", function(datum, index) { 
                                            return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.min_temp),(chart.w / data.length- barpadding+(0.00366*x)),chart.h-chart.y0(datum.min_temp),0.00366*x);
                                    })                         
                                    .on('mousemove',mouseoverOnBar)//call mouseoverOnBar function while mouseover on bar
                                    .on('mouseout',del)// call del function while mouseout of the bar
                                    .on("click",mouseClickOnBar);//call mouseClickOnBar function while mouse click on the bar
                };
                chart.layer('bars2').on('enter', onEnterBar2);
                chart.layer('bars2').on('update', onEnterBar2);
                //have third layer for line
                chart.layer("lines", chart.areas.lines, {

                        dataBind: function(data) {
                            //select dom element to make line
                            return this.selectAll("path").data([data]);
                        },
                        insert: function() {
                           return this.append("path")
                                    .datum(data)
                                    .attr('class','path1')
                                    .attr("d", chart.line(data)) //call line function to make line with data
                                    .on("click",mouseClickOnLine)//call mouseClickOnLine function while mouse click on the line
                        }
                      });
                 //on dmouse click on the line call pptchart
                var mouseClickOnLine = function(){
                  pptchart();
                  document.getElementById('one').checked = true;//make checkbox true while mouse click on the line
                 };
                //have fourth layer for cirlces on line when mouver mouse move on each points of line
                chart.layer("circles", chart.areas.circles, {

                        dataBind: function(data) {
                            //select dom element to make cirles
                            return this.selectAll("circle")
                                      .data(data);
                        },
                        insert: function() {
                           return this.append("circle")
                                    .classed('circle',true)
                        },
                        events: {
                                //on data enter make the circles
                                enter: function() {

                                  var chart = this.chart();
                                  return this.attr("cy", function(d){return chart.y1(d.ppt);})
                                            .attr("cx", function(d,i){return chart.x(i+1);})
                                            .style("fill", "transparent")
                                            .attr("r", 8)
                                            .style("stroke-width",3)
                                            .on("mousemove",function(d){
                                                  chart.div2 .html("Avg Ppt: "+ d.ppt + "<br/>" + "Day: " + chart.formatTime(d.time))  
                                                                  .style("left", x<=768?((d3.event.pageX>x/2)?(d3.event.pageX-(0.3*x)):d3.event.pageX):d3.event.pageX+"px" )//place tooltip based on mouse's x current point
                                                                  .style("top", (d3.event.pageY-(0.0899*y))+"px")//place tooltip based on mouse's y current point
                                                                  .style("opacity", 0.9);
                                                })
                                            .on("mouseout", function(d){ 
                                                    chart.div2.transition()
                                                    .duration(500)    
                                                    .style("opacity", 0);
                                               })
                                            .on("click",mouseClickOnLine);
                                }}
                      });
                chart.layer('fullChartBar1', chart.areas.chartFullBar1, {
                            dataBind: function(data) {
                                chart.xf.domain([0.5,data.length]);
                                chart.y0f.domain([0,d3.max(data.map(function(datum){return +datum.max_temp;}))]);
                                chart.y1f.domain([0,d3.max(data.map(function(datum){return +datum.ppt;}))]);
                                var xAxis = d3.svg.axis().scale(chart.xf).tickValues([16,45,75,105,136,166,197,228,258,289,319,350]).orient("bottom").tickFormat(d3.format("d"));
                                xAxis.tickFormat(function(d, i){
                                       if(d==16)  return ("January")
                                       if(d==45)  return ("February")
                                       if(d==75)  return ("March")
                                       if(d==105)  return ("April")
                                       if(d==136)  return ("May")
                                       if(d==166)  return ("June")
                                       if(d==197)  return ("July")
                                       if(d==228)  return ("August")
                                       if(d==258)  return ("September")
                                       if(d==289)  return ("October")
                                       if(d==319)  return ("November")
                                       if(d==350)  return ("December")
                                });
                                //call x axis 
                                chart.areas.xlabelsFull.call(xAxis);

                                chart.areas.barBrush
                                          .call(chart.brush)
                                        .selectAll("rect")
                                        .attr("y", -(0.00899*y))
                                        .attr("height", chart.hf + (0.01049*y));
                                chart.areas.barBrush.selectAll('.resize')
                                        .append('path')
                                        .classed('handle',true);
                                var datai = _.pluck(data,'max_temp');
                                for(var i=0;i<datai.length;i++){
                                  datai[i] = +datai[i];
                                };
                                return this.selectAll("rect3")
                                         .data([datai]);
                            },
                            insert: function() {
                                  return this.append("path")
                                          .classed('barFull1', true)
                            }
                });
                var onEnterBar1Full = function(){
                      return this.attr("fill", "#1ABC9C")
                                    .attr("d", barPathFull)
                                    // .on('mousemove',mouseoverOnBar)//call mouseoverOnBar function while mouseover on bar
                                    // .on('mouseout',del)// call del function while mouseout of the bar
                                    // .on("click",mouseClickOnBar);//call mouseClickOnBar function while mouse click on the bar
                };
                chart.layer('fullChartBar1').on('enter', onEnterBar1Full);
                chart.layer('fullChartBar1').on('update', onEnterBar1Full);

                chart.layer('fullChartBar2', chart.areas.chartFullBar2, {
                            dataBind: function(data) {
                                chart.areas.barBrush
                                          .call(chart.brush)
                                        .selectAll("rect")
                                        .attr("y", -(0.00899*y))
                                        .attr("height", chart.hf + (0.01049*y));
                                var datai = _.pluck(data,'min_temp');
                                for(var i=0;i<datai.length;i++){
                                  datai[i] = +datai[i];
                                };
                                return this.selectAll("rect4")
                                         .data([datai]);
                            },
                            insert: function() {
                                  return this.append("path")
                                          .classed('barFull2', true)
                                          .attr("fill", "#34495e")
                            }
                });
                var onEnterBar2Full = function(){
                      return this.attr("fill", "#34495e")
                                    .attr("d", barPathFull)
                                    // .on('mousemove',mouseoverOnBar)//call mouseoverOnBar function while mouseover on bar
                                    // .on('mouseout',del)// call del function while mouseout of the bar
                                    // .on("click",mouseClickOnBar);//call mouseClickOnBar function while mouse click on the bar
                };
                chart.layer('fullChartBar2').on('enter', onEnterBar2Full);
                chart.layer('fullChartBar2').on('update', onEnterBar2Full);

                                //have third layer for line
                chart.layer("linesFull", chart.areas.chartFullLine, {

                        dataBind: function(data) {
                            //select dom element to make line
                            return this.selectAll("path").data([data]);
                        },
                        insert: function() {
                           return this.append("path")
                                    .datum(data)
                                    .attr('class','pathFull')
                                    .attr("d", chart.lineFull(data)) //call line function to make line with data
                                   // .on("click",mouseClickOnLine)//call mouseClickOnLine function while mouse click on the line
                        }
                      });

              },
            
              // configures the width of the chart.
              // when called without arguments, returns the
              // current width.
              width: function(newWidth) {
                if (arguments.length === 0) {
                  return this.w;
                }
                this.w = newWidth;
                return this;
              },
              
              // configures the height of the chart.
              // when called without arguments, returns the
              // current height.
                height: function(newHeight) {
                  if (arguments.length === 0) {
                    return this.h;
                  }
                  this.h = newHeight;
                  return this;
                },

        });
       var xWidth = 0.5124,
          yHeight = 0.7046,
          leftOrigin = 0.0585*x,
          leftyAxis = 0,
          rightyAxis = 0,
          gradientValue = 5;
       if(550 <= x && x <= 768)
       {
          xWidth = 0.855;
          yHeight = 0.60;
          leftOrigin = 0.0667*x;
          leftyAxis = 0.00667*x;
          rightyAxis = 0.01667*x;
       };
       if(440 <= x && x < 550)
       {
          xWidth = 0.80;
          yHeight = 0.60;
          leftOrigin = 0.09*x;
          leftyAxis = 0.009*x;
          rightyAxis = 0.042*x;
          gradientValue = 6;
       };
       if(320 <= x && x < 440)
       {
          xWidth = 0.755;
          yHeight = 0.55;
          leftOrigin = 0.118*x;
          leftyAxis = 0.0115*x;
          rightyAxis = 0.07*x;
          gradientValue = 6;
       };
        var getInternShipChart = d3.select('#graph')
                    .append('svg')
                    .attr('height', (yHeight*y)) //470 of 667
                    .attr('width', (xWidth*x)) //700 of 1366
                    .chart('internsBarChart');
                    data.pop();
        //call d3.chart function with data
        getInternShipChart.draw(data);
        function reSizeSvg(chartID){
          var chart1 = $(chartID),
            aspect = chart1.width() / chart1.height(),
            container = chart1.parent();
            $(window).on("resize", function() {

                var targetWidth = container.width();
                chart1.attr("width", targetWidth);
                chart1.attr("height", Math.round(targetWidth / aspect));
            }).trigger("resize");
        }

          // reSizeSvg("#yLeftLabelID");
          // reSizeSvg("#BarChartId");
         // reSizeSvg("#yRightLabelID");
         // reSizeSvg("#fullChartID");  
        //calculate avg ppt and avg temp from entier data
        var avgppt=[0,0,0,0,0,0,0,0,0,0,0,0],
            avgtemp=[0,0,0,0,0,0,0,0,0,0,0,0];
         for(i=0;i<data.length;i++){
              if(i<31)
              { 
                avgppt[0]= parseFloat(data[i].ppt)+avgppt[0];
                avgtemp[0]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[0];
                avg_ppt[0]=avgppt[0]/31; 
                avg_temp[0]=avgtemp[0]/(31*2);   }
             else if((30<i)&&(i<59))
              { 
                avgppt[1]= parseFloat(data[i].ppt)+avgppt[1];
                avgtemp[1]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[1];
                avg_ppt[1]=(avgppt[1])/28;
                avg_temp[1]=(avgtemp[1]/2)/28;   }
              else if((58<i)&&(i<90))
              { 
                avgppt[2]= parseFloat(data[i].ppt)+avgppt[2];
                avgtemp[2]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[2];
                avg_ppt[2]=(avgppt[2])/31;  
                avg_temp[2]=(avgtemp[2]/2)/31; }
              else if((89<i)&&(i<120))
              { 
                avgppt[3]= parseFloat(data[i].ppt)+avgppt[3];
                avgtemp[3]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[3];
                avg_ppt[3]=(avgppt[3])/30;
                avg_temp[3]=(avgtemp[3]/2)/30;   }
              else if((119<i)&&(i<151))
              { 
                avgppt[4]= parseFloat(data[i].ppt)+avgppt[4];
                avgtemp[4]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[4];
                avg_ppt[4]=(avgppt[4])/31;
                avg_temp[4]=(avgtemp[4]/2)/31;   }
              else if((150<i)&&(i<181))
              { 
                avgppt[5]= parseFloat(data[i].ppt)+avgppt[5];
                avgtemp[5]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[5];
                avg_ppt[5]=avgppt[5]/30;
                avg_temp[5]=avgtemp[5]/(30*2);   }
              else if((180<i)&&(i<212))
              { 
                avgppt[6]= parseFloat(data[i].ppt)+avgppt[6];
                avgtemp[6]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[6];
                avg_ppt[6]=(avgppt[6])/31;
                avg_temp[6]=(avgtemp[6]/2)/31;   }
              else if((211<i)&&(i<243))
              { 
                avgppt[7]= parseFloat(data[i].ppt)+avgppt[7];
                avgtemp[7]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[7];
                avg_ppt[7]=(avgppt[7])/31;
                avg_temp[7]=(avgtemp[7]/2)/31;   }
              else if((242<i)&&(i<273))
              { 
                avgppt[8]= parseFloat(data[i].ppt)+avgppt[8];
                avgtemp[8]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[8];
                avg_ppt[8]=(avgppt[8])/30;
                avg_temp[8]=(avgtemp[8]/2)/30;   }
              else if((272<i)&&(i<304))
              { 
                avgppt[9]= parseFloat(data[i].ppt)+avgppt[9];
                avgtemp[9]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[9];
                avg_ppt[9]=(avgppt[9])/31;
                avg_temp[9]=(avgtemp[9]/2)/31;   }
              else if((303<i)&&(i<344))
              { 
                avgppt[10]= parseFloat(data[i].ppt)+avgppt[10];
                avgtemp[10]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[10];
                avg_ppt[10]=(avgppt[10])/30;
                avg_temp[10]=(avgtemp[10]/2)/30;   }
              else if((343<i)&&(i<365))
              { 
                avgppt[11]= parseFloat(data[i].ppt)+avgppt[11];
                avgtemp[11]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[11];
                avg_ppt[11]=(avgppt[11])/31;
                avg_temp[11]=(avgtemp[11])/(31*2);   }
          }
          var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
          if(average_ppt.length==0){
              for (var i = 0; i < 12; i++) {
                  average_ppt.push({
                      month: months[i],
                      value: avg_ppt[i],
                      temp:avg_temp[i]
                  });
              }
          }
          var pie_chart=new Array(12);
          for (var i = 0; i < 12; i++) {
            pie_chart[i] = new Array(3);
          };
          for(var i=0;i<12;i++){
              pie_chart[i][0]=months[i];
              pie_chart[i][1]=avg_ppt[i];
              pie_chart[i][2]=avg_temp[i];
          }
          //call tempchart initially to display pie chart 
          tempchart();
    } 
} 
//ppt pie chart function
function pptchart(){
        //remove early created piechart dom element
        d3.select(".pieChartSvg").remove();
        //change lable text
        d3.select('#label').text('Average Precipitation');
        //calculate avg ppt for pie chart
        var color=[],ppt_chart=[],ppt=[],array=[];
    		for (var i=0;i<12;i++){
    			 	ppt[i]=avg_ppt[i];
    		}
    		for (var i=0;i<12;i++){
    			for (var j=i+1;j<12;j++){
    				if(avg_ppt[i]>avg_ppt[j]){
    					   ppt_chart[i]=avg_ppt[i];
    				}
    				else{
    					ppt_chart[i]=avg_ppt[j];
    					avg_ppt[j]=avg_ppt[i];
    					avg_ppt[i]=ppt_chart[i];
    				}
    			}
    			if(i==11)
      				ppt_chart[i]=avg_ppt[i];
    		}
    		for (var i=0;i<12;i++){
    			for (var j=0;j<12;j++){
    				if(ppt_chart[i]==ppt[j]){
      					array[i]=j;
    				}
    			}
    		}
    		for(i=0;i<12;i++){
      			color[array[i]]=colors[i];
            avg_ppt[i]=ppt[i];
        }
      //d3 chart for Precipitation pie chart
      d3.chart('piePptChart',{
        initialize: function(){
              var chart = this;
              //calulate width and height for Precipitation pie chart
              chart.w = +chart.base.attr('width') || 200;
              chart.h = +chart.base.attr('height') || 150;

              var offSetRadi = Math.sqrt((x*x)+(y*y));
              var textOffset = ((textOffsetSmall/1520.14) * offSetRadi);

              chart.arc = d3.svg.arc().outerRadius(radius);
              var monthsId=["January","February","March","April","May","June","July","August","September","October","November","December"];
              //have empty areas object to put Precipitation pie chart elements
              this.areas = {};
              chart.areas.piechartppt = chart.base.append('svg')
                                    .classed('pieChartSvg',true)
                                    .attr('id','piePptChartID')
                                    .attr("width", chart.w)
                                    .attr("height", chart.h)
                                    .attr('viewBox',"0 0 "+chart.w+" "+chart.h+"")
                                    .attr('preserveAspectRatio',"xMidYMid");

               //make a layer for Precipitation pie chart elements
               chart.layer('pie1Layer', chart.areas.piechartppt,{
                  dataBind: function(data) {
                    //make pie element for pie chart
                    var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });
                    var chat = chart.areas.piechartppt.data([data]) 
                                .append('g')
                                .attr("class","pieppt")
                                .attr("transform", "translate(" + circleXTranslate*radius + "," + circleTranslate*radius+ ")")
                    //select slice class element to make pie chart
                    return chat.selectAll(".slice")
                              .data(pie);
                  },
                  insert: function(){ 
                    //make g element as many as pie elements based on data
                    return this.append("g");
                  },
                  events:{
                      //enter event for pie chart while data enter into the early created element
                      enter:function(){
                        var arcs = this.attr("class", "slice")
                                        .attr('id',function(d,i){return 'sliceId'+monthsId[i];})
                                        .style("stroke-width",1.5)
                                        .style("stroke","#ffffff");
                            //make line path for each pie element
                            arcs.append("svg:path")
                                        .attr("fill", function(d, i) { return color[i]; }) 
                                        .attr("d", chart.arc)
                                        .on('mouseover',mouseoverOnPie)
                                        .on('mouseout',mouseoutOfPie);
                            //make text element and text for each pie element
                            var monthLabels = arcs.append("svg:text")                                     
                                        .attr("transform", function(d) {
                                                d.innerRadius = 1.5*radius;
                                                d.outerRadius = radius*2;
                                                return "translate(" + (chart.arc.centroid(d)) + ")";        
                                        })
                                        .attr("text-anchor", "middle")
                                        .text(function(d, i) { return d.data.month; })
                                        .style("font-family","Tahoma")
                                        .style("stroke","#34495e")
                                        .style("stroke-width",0); 
                            var prev;
                            function callLabel(d,i,this1){
                                if(i > 0) {
                                    var thisbb = this1.getBoundingClientRect(),
                                        prevbb = prev.getBoundingClientRect();
                                    // move if they overlap
                                    if(!(thisbb.right < prevbb.left || 
                                            thisbb.left > prevbb.right || 
                                            thisbb.bottom < prevbb.top || 
                                            thisbb.top > prevbb.bottom)) {
                                        var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
                                            cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
                                            cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
                                            cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
                                            off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
                                        d3.select(this1).attr("transform",
                                            "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (radius + textOffset + off) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (radius + textOffset + off) + ")");
                                    }
                                }
                                prev = this1;
                            };
                            monthLabels.each(function(d,i){callLabel(d,i,this);});
                            monthLabels.each(function(d,i){callLabel(d,i,this);});
                              //make number in the form of text for each pie element
                              // arcs.append("svg:text")   
                              //           .attr('id',function(d,i) { return 'pieTextValue'+monthsId[i]; })                                
                              //           .attr("transform", function(d) {                    
                              //                   d.innerRadius = radius;
                              //                   d.outerRadius = radius;
                              //                 return "translate(" + (chart.arc.centroid(d)) + ")";        
                              //           })
                              //           .attr("text-anchor", "middle")                       
                              //           .text(function(d, i) { return d.data.value.toFixed(2); })
                              //           .style("font-family","Tahoma")
                              //           .style("fill","#34495e")
                              //           .style("stroke-width",0)
                              //           .style("display","none");

                              arcs.append("svg:text")   
                                        .attr('id',function(d,i) { return 'pieTextValue'+monthsId[i]; })                                         
                                        .attr("x", function(d) {
                                          var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                                          d.cx = Math.cos(a) * (radius/2+((radius/2)/2));
                                          return d.x = /*(Math.cos(a) * (radius + 60))*/chart.arc.centroid(d)[0]>0?chart.arc.centroid(d)[0]+10:chart.arc.centroid(d)[0]-9;
                                        })
                                        .attr("y", function(d) {
                                          var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                                          d.cy = Math.sin(a) * (radius/2+((radius/2)/2));
                                          return d.y = /*(Math.sin(a) * (radius + 80))*/chart.arc.centroid(d)[1]+25;
                                        })
                                        .text(function(d) {
                                          return d.data.value.toFixed(2); 
                                        })
                                        .each(function(d) {
                                          var bbox = this.getBBox();
                                          d.sx = d.x - bbox.width/2 - 2;
                                          d.ox = d.x + bbox.width/2 + 2;
                                          d.sy = d.oy = d.y + 5;
                                        })
                                        .style("font-family","Tahoma")
                                        .style("fill","#34495e")
                                        .style("stroke-width",0)
                                        .style("display","none")
                                        .attr("text-anchor", "middle");

                              arcs.append("path")
                                        .attr('id',function(d,i) { return 'pieLine'+monthsId[i]; })
                                        .attr("class", "pointer")
                                        .style("fill", "none")
                                        .style("stroke", "black")
                                       // .attr("marker-end", "url(#circ)")
                                        .attr("d", function(d) {
                                              if(d.cx > d.ox) {
                                                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                                              } else {
                                                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                                              }
                                            })
                                        .style("display",'none');
                              return arcs;
                      }
                  }
                });
                function mouseoverOnPie(d,i){
                  for(var iterator5=0;iterator5<monthsId.length;iterator5++)
                  {
                    if(monthsId[iterator5] !== d.data.month){
                        d3.select('#sliceId'+monthsId[iterator5])
                            .style('opacity',0.3);
                            // .style('stroke-width',3)
                            // .style('stroke','gray');
                        d3.select('#pieTextValue'+monthsId[iterator5])
                            .style("display",'none');

                        d3.select('#pieLine'+monthsId[iterator5])
                            .style("display",'none');
                      }
                      else{
                        d3.select('#pieTextValue'+monthsId[iterator5])
                          .style("display",'block');

                        d3.select('#pieLine'+monthsId[iterator5])
                          .style("display",'block');
                      }
                  };
                };
                function mouseoutOfPie(d,i){
                  for(var iterator6=0;iterator6<monthsId.length;iterator6++)
                  {
                    d3.select('#sliceId'+monthsId[iterator6])
                        .style('opacity',1)
                        // .style('stroke-width',1.5)
                        // .style('stroke','#ffffff');
                    d3.select('#pieTextValue'+monthsId[iterator6])
                        .style("display",'none');

                    d3.select('#pieLine'+monthsId[iterator6])
                        .style("display",'none');
                  };
                };
        }
      });
        var  w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        //call temp chart 
        var xWidth = 0.3221,
            yHeight = 0.7496,
            circleTranslate = 2,
            textOffsetSmall =65,
            circleXTranslate = 1.6;
            if(640 <= x && x <= 768)
            {
                xWidth = 0.855;
                yHeight = 0.7496;
                circleTranslate = 1.8;
                textOffsetSmall = 80;
                circleXTranslate = 1.9;
            };
            if(550 <= x && x < 640)
            {
                xWidth = 0.855;
                yHeight = 0.7496;
                circleTranslate = 1.8;
                textOffsetSmall = 80;
                circleXTranslate = 1.50;
            };
            if(440 <= x && x < 550)
             {
                xWidth = 0.855;
                yHeight = 0.7496;
                textOffsetSmall = 90;
                circleTranslate = 1.8;
                circleXTranslate = 1.5;
             };
             if(320 <= x && x < 440)
             {
                xWidth = 0.855;
                yHeight = 0.67;
                textOffsetSmall = 120;
                circleTranslate = 2;
                circleXTranslate = 1.45;
             };
      //call ppt chart 
      var chart1 = d3.select("#piechart")
                      .attr('height', (yHeight*y)) //500 of 667
                      .attr('width', (xWidth*x)) //440 of 1366
                      .chart('piePptChart');
      chart1.draw(average_ppt);
      function reSizeSvg(chartID){
          var chart1 = $(chartID),
            aspect = chart1.width() / chart1.height(),
            container = chart1.parent();
            $(window).on("resize", function() {

                var targetWidth = container.width();
                chart1.attr("width", targetWidth);
                chart1.attr("height", Math.round(targetWidth / aspect));
            }).trigger("resize");
        }
       // reSizeSvg("#piePptChartID");
    };

//function for temp chart 
function tempchart(){
          //remove early created piechart dom element
          d3.select(".pieChartSvg").remove();
          //change lable text
          d3.select('#label').text('Average Temperature');
        	var array=[],
              color=[],
         	    ppt_chart=[],
              temp=[];
          //calculate avg temp for pie chart
        	for (var i=0;i<12;i++){
        	 	temp[i]=avg_temp[i];
        	}
      	 	for (var i=0;i<12;i++){
          		for (var j=i+1;j<12;j++){
          			if(avg_temp[i]>avg_temp[j]){
          				  ppt_chart[i]=avg_temp[i];
            		}else{
            				ppt_chart[i]=avg_temp[j];
            				avg_temp[j]=avg_temp[i];
            				avg_temp[i]=ppt_chart[i];
      			    }
      		    } 
          		if(i==11)
          			ppt_chart[i]=avg_temp[i];
	        }
        	for (var i=0;i<12;i++){
        		for (var j=0;j<12;j++){
        			if(ppt_chart[i]==temp[j]){
        				    array[i]=j;
        			}
        		}
        	}
          for(i=0;i<12;i++){
          	color[array[i]]=colors1[i];
            avg_temp[i]=temp[i];
          }
          //make a layer for temperature pie chart elements
          d3.chart('pieTempChart',{
                  initialize: function(){
                        var chart = this;
            
                        chart.w = +chart.base.attr('width');
                        chart.h = +chart.base.attr('height');
                        chart.arc = d3.svg.arc().outerRadius(radius);
                        var monthsId=["January","February","March","April","May","June","July","August","September","October","November","December"];
                        
                        this.areas = {};
                        chart.areas.piecharttemp = chart.base.append('svg')
                                              .classed('pieChartSvg',true)
                                              .attr('id','pieTempChartID')
                                              .attr("width", chart.w)
                                              .attr("height", chart.h)
                                              // .attr('viewBox',"0 0 "+chart.w+" "+chart.h+"")
                                              // .attr('preserveAspectRatio',"xMidYMid");
                         chart.layer('pie2Layer', chart.areas.piecharttemp,{
                            dataBind: function(data) {
                              //make pie element for pie chart
                              var pie = d3.layout.pie().sort(null).value(function(d) { return d.temp; });                              
                              var chat = chart.areas.piecharttemp.data([data]) 
                                          .append('g')
                                          .attr("class","pietemp")
                                          .attr("transform", "translate(" + circleXTranslate*radius + "," + circleTranslate*radius+ ")")
                              //select slice class element to make pie chart  
                              return chat.selectAll(".slice")
                                        .data(pie);
                            },
                            insert: function(){ 
                              //make g element as many as pie elements based on data
                              return this.append("g");
                            },
                            events:{
                                //enter event for pie chart while data enter into the early created element
                                enter:function(){
                                  var arcs = this.attr("class", "slice2")
                                              .attr('id',function(d,i){return 'sliceId'+monthsId[i];})
                                              .style("stroke-width",1.5)
                                              .style("stroke","#ffffff")
                                      //make line path for each pie element
                                      arcs.append("svg:path")
                                              .attr("fill", function(d, i) { return color[i]; } ) 
                                              .attr("d", chart.arc)
                                              .on('mouseover',mouseoverOnPie)
                                              .on('mouseout',mouseoutOfPie);
                                    //make text element and text for each pie element
                                      arcs.append("svg:text")                                     
                                            .attr("transform", function(d) {                    
                                            d.innerRadius = 1.7*radius;
                                            d.outerRadius = radius*2;
                                            return "translate(" + (chart.arc.centroid(d)) + ")";        
                                          })
                                            .attr("text-anchor", "middle")                          
                                            .text(function(d, i) { return d.data.month; })
                                            .style("font-family","Tahoma")
                                            .style("stroke","#34495e")
                                            .style("stroke-width",0); 
                                      //make number in the form of text for each pie element
                                      arcs.append("svg:text")   
                                            .attr('id',function(d,i) { return 'pieTextValue'+monthsId[i]; })                                         
                                            .attr("x", function(d) {
                                              var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                                              d.cx = Math.cos(a) * (radius/2+((radius/2)/2));
                                              return d.x = /*(Math.cos(a) * (radius + 60))*/chart.arc.centroid(d)[0]-5;
                                            })
                                            .attr("y", function(d) {
                                              var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                                              d.cy = Math.sin(a) * (radius/2+((radius/2)/2));
                                              return d.y = /*(Math.sin(a) * (radius + 70))*/chart.arc.centroid(d)[1]+25;
                                            })
                                            .text(function(d) {
                                              return d.data.value.toFixed(2); 
                                            })
                                            .each(function(d) {
                                              var bbox = this.getBBox();
                                              d.sx = d.x - bbox.width/2 - 2;
                                              d.ox = d.x + bbox.width/2 + 2;
                                              d.sy = d.oy = d.y + 5;
                                            })
                                            .style("font-family","Tahoma")
                                            .style("fill","#34495e")
                                            .style("stroke-width",0)
                                            .style("display","none")
                                            .attr("text-anchor", "middle");

                                    arcs.append("path")
                                            .attr('id',function(d,i) { return 'pieLine'+monthsId[i]; })
                                            .attr("class", "pointer")
                                            .style("fill", "none")
                                            .style("stroke", "black")
                                           // .attr("marker-end", "url(#circ)")
                                            .attr("d", function(d,i) {
                                                  if(d.cx > d.ox) {
                                                   // console.log('pieLine'+monthsId[i],"M" , d.sx, ",", d.sy ,"L", d.ox, "," ,d.oy, " " ,d.cx, ",", d.cy);
                                                    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                                                  } else {
                                                    return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                                                  }
                                                })
                                            .style("display",'none');
                                  return arcs;
                                }
                            }
                         });
                        function mouseoverOnPie(d,i){
                          for(var iterator3=0;iterator3<monthsId.length;iterator3++)
                          {
                            if(monthsId[iterator3] !== d.data.month){
                                d3.select('#sliceId'+monthsId[iterator3])
                                    .style('opacity',0.3);
                                    // .style('stroke-width',3)
                                    // .style('stroke','gray');
                                d3.select('#pieTextValue'+monthsId[iterator3])
                                    .style("display",'none');

                                d3.select('#pieLine'+monthsId[iterator3])
                                    .style("display",'none');
                              }
                              else{
                                d3.select('#pieTextValue'+monthsId[iterator3])
                                  .style("display",'block');

                                d3.select('#pieLine'+monthsId[iterator3])
                                  .style("display",'block');
                              }
                          };
                        };
                        function mouseoutOfPie(d,i){
                          for(var iterator4=0;iterator4<monthsId.length;iterator4++)
                          {
                            d3.select('#sliceId'+monthsId[iterator4])
                                .style('opacity',1)
                                // .style('stroke-width',1.5)
                                // .style('stroke','#ffffff');
                            d3.select('#pieTextValue'+monthsId[iterator4])
                                .style("display",'none');

                            d3.select('#pieLine'+monthsId[iterator4])
                                .style("display",'none');
                          };
                        };
                  }
                });
        var  w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        //call temp chart 
        var xWidth = 0.3221,
            yHeight = 0.7496,
            circleTranslate = 2;
            circleXTranslate = 1.65;
        if(640 <= x && x <= 768)
       {
          xWidth = 0.855;
          yHeight = 0.7496;
          circleTranslate = 1.7;
          circleXTranslate = 1.8;
       }
       if(550 <= x && x < 640)
       {
          xWidth = 0.855;
          yHeight = 0.7496;
          circleTranslate = 1.7;
          circleXTranslate = 1.5;
       }
       if(340 <= x && x < 550)
       {
          xWidth = 0.855;
          yHeight = 0.7496;
          circleTranslate = 1.7;
          circleXTranslate = 1.5;
       };
       if(320 <= x && x < 340)
       {
          xWidth = 0.875;
          yHeight = 0.67;
          circleTranslate = 2;
          circleXTranslate = 1.65;
       };

        var chart2 = d3.select("#piechart")
                      .attr('height', (yHeight*y)) //500 of 667
                      .attr('width', (xWidth*x)) //440 of 1366
                      .chart('pieTempChart');
        chart2.draw(average_ppt);

        function reSizeSvg(chartID){
          var chart1 = $(chartID),
            aspect = chart1.width() / chart1.height(),
            container = chart1.parent();
            $(window).on("resize", function() {

                var targetWidth = container.width();
                chart1.attr("width", targetWidth);
                chart1.attr("height", Math.round(targetWidth / aspect));
            }).trigger("resize");
        }
        //reSizeSvg("#pieTempChartID");
};