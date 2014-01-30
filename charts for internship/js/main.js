function clickcount(count){
  count++;
  return count;
  alert(count);
}
function chart(colors){   
   var csv; var json; 
      
      document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
      if (evt.target.tagName.toLowerCase() == 'button') 
         readBlob(); 
    }, false); 


    function readBlob() {

		    var files = document.getElementById('files').files;
		    if (!files.length) {
		      alert('Please select a file!');
		      return;
		    }
		    var file = files[0];
		    var start =  0;
		    var stop = file.size - 1;
		    var reader = new FileReader();

		    reader.onloadend= function(evt) {
		      if (evt.target.readyState == FileReader.DONE) { 
		       // DONE == 2
				       csv = evt.target.result;    
				       var json = CSV2JSON(csv);
				      if (($('#graph').length==0)) {
				       makechart(json);
				      }
				      else{
					        $("#graph").remove();
					        $("#axis").remove();
					        $("#y-axis-right").remove();
					        $("#x-axis").remove();
					        $(".chart").append("<div id='graph' class='aGraph'  style='background: -webkit-linear-gradient(top, #ffffff 12%,#ffffff 12%,#dbdbdb 13%,#dbdbdb 88%,#ffffff 88%,#ffffff 100%);'></div>");
					        $(".chart").append("<div id='axis'></div>");
					        $(".chart").append("<div id='y-axis-right'></div>");
					        $(".labelschart").append("<div id='x-axis'>Months of the year</div>");
						    $("#graph").on("click",function(e){
							    if (($('#pieppt').length== 0)&&($('#pietemp').length!= 0)){
							      $(".switch-handle").parent().css({position: 'relative'});
							      $(".switch-handle").css({left:0, position:'absolute'});
							    }
					    		else if (($('#pietemp').length== 0)&&($('#pieppt').length!= 0)){
											    $(".switch-handle").parent().css({position: 'relative'});
											    $(".switch-handle").css({left:120, position:'absolute'});
								}
						 	})
				         	makechart(json);
			 			}
			    };
  		 	}
  		    var blob = file.slice(start, stop + 1); 
  		    reader.readAsBinaryString(blob);
  
	     }

    function CSV2JSON(csv) { 
    var array = CSVToArray(csv);
    var objArray = [];
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
  
    function CSVToArray(strData, strDelimiter) {
      
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp((
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    var arrData = [[]];
    var arrMatches = null;
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
    }

  function makechart(data,colors){
      var time=[];
      if(average_ppt.length!=0){
              average_ppt.length==0;
             }
      
      for(i=0;i<data.length;i++){
      	time[i]=data[i].time;
      }
       var parseDate = d3.time.format("%m/%d/%Y").parse;
      for(i=0;i<data.length;i++){
      	data[i].time=parseDate(data[i].time);

      }

      d3.chart("internsBarChart", {

            initialize: function() {
              // create a base scale we will use later.
              var chart = this;
            
              //Get height and width of chart and covert it into values
              chart.w = +chart.base.attr('width');
              chart.h = +chart.base.attr('height');

              // chart margins to account for labels.
              // we may want to have setters for this
              // if we were letting the users customize this too
              chart.margins = {
                left : 80,
                top : 40,
                right : 40,
                bottom : 90,
                padding : 10
              };

              chart.formatTime = d3.time.format("%m/%d/%Y");

              chart.w = chart.w-3*chart.margins.left;
              chart.h = chart.h-3*chart.margins.top;
console.log(chart.w,chart.h)
              chart.div1= d3.select("body").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0);

               chart.div2= d3.select("body").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0);

              chart.x = d3.scale.linear().range([0, chart.w]);

              chart.y0 = d3.scale.linear().range([chart.h, 0]);
              chart.y1 = d3.scale.linear().range([chart.h, 0]);

              chart.line = d3.svg.line()
                                .x(function(d,i){console.log(d);return chart.x(i+1.25);})
                                .y(function(d) {return chart.y1(d.ppt);})

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
              }

              chart.base
                .classed('Barchart', true);
              chart.base = chart.base.append("svg:g")
                          .attr("transform", "translate(0," + 1.5*chart.margins.top+ ")");

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

              this.areas = {};

              chart.areas.ylabelsLeft = d3.select("#axis").append("svg:svg")
                .attr('width', chart.margins.left-10)
                .attr('height', chart.h+2*chart.margins.top+5)
                .append("svg:g")
                .attr('transform', 'translate(0,'+(1.5*chart.margins.top)+')');

              chart.areas.xlabels = chart.base.append('g')
                .classed('x axis', true)
                .attr('width', chart.w-2)
                .attr('height', chart.h+2*chart.margins.top+5)
                .attr('transform', 'translate(0,'+(chart.h)+')')
                .attr("stroke","#848484")
                .attr("stroke-width","0.5");

              chart.areas.bars1 = chart.base.append('g')
                .classed('bars', true)
                .attr('width', chart.w-2)
                .attr('height', chart.h+2*chart.margins.top+5)
                // .append("svg:g")
                // .attr('transform', 'translate(0,'+(1.5*chart.margins.top)+')');

              chart.areas.bars2 = chart.base.append('g')
                .classed('bars', true)
                .attr('width', chart.w-2)
                .attr('height', chart.h+2*chart.margins.top+5)
                // .attr('transform', 'translate(0,'+(1.5*chart.margins.top)+')');

              chart.areas.lines = chart.base.append('g')
                .classed('lines', true)
                .attr('width', chart.w-2)
                .attr('height', chart.h+2*chart.margins.top+5)
                .attr('transform', 'translate(0,'+(1.5*chart.margins.top)+')');

              chart.areas.ylabelsRight = d3.select("#y-axis-right").append("svg:svg")                
                .attr('width',  chart.margins.left-10)
                .attr('height', chart.h+2*chart.margins.top+5)
                .append("svg:g")
                .attr('transform', 'translate(0,'+(1.5*chart.margins.top)+')')
                .append("svg:g")
                .classed('y axis right', true);

              chart.areas.y0Text = chart.areas.ylabelsLeft.append("text")
                .classed('y text 1', true)
                .attr("transform", "rotate(-90)")
                .attr("y", 0.2*chart.margins.left)
                .attr("x", 0-(chart.h/2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("float","left")
                .text("Maximum Temperature")
                .style("font-family", "Tahoma")
                .style("font-weight","bold")
                .style("font-size", "20px" )
                .style("fill","#34495e");

              chart.areas.yText = chart.areas.ylabelsRight.append("text")
                .classed('y text 2', true)
                .attr("transform", "rotate(90)")
                .attr("y", -60)
                .attr("x", (chart.h/2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("float","left")
                .text("Average Precipitation")
                .style("font-family", "Tahoma")
                .style("font-weight","bold")
                .style("font-size", "20px" )
                .style("fill","#34495e");

              function topRoundedRect(x, y, width, height, radius) {
                return "M" + (x + radius) + "," + y
                     + "h" + (width - (radius * 2))
                     + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                     + "v" + (height - radius)
                     + "h" + (0-width)
                     + "v" + (0-(height-radius))
                     + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
                     + "z";
              } 
              chart.layer('bars1', chart.areas.bars1, {
                dataBind: function(data) {

                      // update the domain of the x,y0 and y1 Scales since it depends on the data
                      
                      chart.x.domain([0.5,data.length]);
                      chart.y0.domain([0,d3.max(data.map(function(datum){return +datum.max_temp;}))]);
                      chart.y1.domain([0,d3.max(data.map(function(datum){return +datum.ppt;}))]);

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

                      chart.areas.xlabels.call(xAxis);

                      var yAxisLeft = d3.svg.axis().scale(chart.y0).ticks(10).orient("left");
                      chart.areas.ylabelsLeft
                                .append("svg:g")
                                .classed('y axis', true)
                                .attr("stroke","#848484")
                                .attr("stroke-width","0.5")
                                .attr("transform", "translate(" + (chart.margins.left-10) + ",0)")
                                .call(yAxisLeft);

                      var yAxisRight = d3.svg.axis().scale(chart.y1).ticks(10).orient("right");
                      chart.areas.ylabelsRight
                                .attr("stroke","#848484")
                                .attr("stroke-width","0.5")
                                .call(yAxisRight);

                      function rectinfo1(){   
                            var x0 = chart.x.invert(d3.mouse(this)[0]).toFixed(0);
                            for(var i=0;i<data.length-1;i++){
                              if(x0==i+1){
                                var y=parseFloat(data[i].max_temp);
                                var x1=data[i].time;
                              }
                            }   
                            var circle1 = chart.areas.bars.selectAll("circle2")
                              .data([x1,y])
                              .enter()
                              .append("circle")
                              .style("fill", "transparent")
                              .attr("r", 8)
                              .style("stroke-width",3)     
                              .style("opacity","0")
                              .attr("cy", chart.h-chart.y0(y))
                              .attr("cx", chart.x(x0))
                            chart.div2.style("opacity", .9);
                            chart.div2 .html("Max temp: "+ y + "<br/>" + "Day: "+ chart.formatTime(x1)) 
                                .style("left", (d3.event.pageX)+"px" )  
                                .style("top", (d3.event.pageY-60)+"px");
                          }
                      // chart.areas.bars
                      //           .on("mouseover", rectinfo1)
                      //           .on("mouseout",function() {
                      //                         chart.div2.transition()    
                      //                                   .duration(500)    
                      //                                   .style("opacity", 0);
                      //             })
                      //           .on("click",tempchart);

                      return this.selectAll("rect1")
                             .data(data);        
                },
                insert: function() {
                    var barWidth = 5;
                    var barpadding = 2;
                    return this.append("path")
                      .classed('bar', true)
                      .attr("fill", "#1ABC9C")
                      .attr("d", function(datum, index) { 
                                return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.max_temp),(chart.w / data.length- barpadding),chart.h-chart.y0(datum.max_temp),5);
                        });
                },
                // setup an enter event for the data as it comes in:

              });
              chart.layer('bars2', chart.areas.bars2, {
                dataBind: function(data) {
                      function rectinfo2(){   
                              var x0 = chart.x.invert(d3.mouse(this)[0]).toFixed(0);                  
                              for(var i=0;i<data.length;i++){
                                if(x0==i+1){
                                  var y=parseFloat(data[i].min_temp);  var x1=data[i].time;}
                              } 
                              var circle1 = chart.areas.bars.selectAll("circle2")
                                      .data([x1,y])
                                      .enter()
                                      .append("circle")
                                      .style("fill", "transparent")
                                      .attr("r", 8)
                                      .style("stroke-width",3)     
                                      .style("opacity","0")
                                      .attr("cy", chart.h-chart.y0(y))
                                      .attr("cx", chart.x(x0))
                              chart.div2.style("opacity", .9);
                              chart.div2 .html("Min temp: "+ chart.y + "<br/>" + "Day: "+ chart.formatTime(x1))
                                      .style("left", (d3.event.pageX)+"px" )  
                                      .style("top", (d3.event.pageY-60)+"px");  
                          };
                    // chart.areas.bars
                    //             .on("mouseover", rectinfo2)
                    //             .on("mouseout",function() {
                    //                           chart.div2.transition()    
                    //                                     .duration(500)    
                    //                                     .style("opacity", 0);
                    //               })
                    //             .on("click",tempchart);
                    console.log(data);
                    return this.selectAll("rect2")
                             .data(data);
                },
                insert: function() {
                      var barWidth = 5;
                      var barpadding = 2;
                      return this.append("path")
                              .classed('bar', true)
                              .attr("fill", "#34495e")
                              .attr("d", function(datum, index) { 
                                        return topRoundedRect(chart.x(index+1)-barWidth/2, chart.y0(datum.min_temp),(chart.w / data.length- barpadding),chart.h-chart.y0(datum.min_temp),5);
                                });
                }
              });

              chart.layer("lines", chart.areas.lines, {
                      dataBind: function(data) {
                          return this.selectAll("path").data([data]);
                      },
                      insert: function() {
                         return this.append("path")
                                  .datum(data);
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
       
      var getInternShipChart = d3.select('#graph')
      .append('svg')
      .attr('height', 500)
      .attr('width', 4500)
      .chart('internsBarChart');

      getInternShipChart.draw(data);

     
  
      // var circle = svgContainer.selectAll("circle1")
      //   .data(data)
      //   .enter()
      //   .append("circle")
      //   .style("fill", "transparent")
      //   .attr("r", 8)
      //   .attr("cy", function(d){return (y1(d.ppt));})
      //   .attr("cx", function(d,i){return x(i+1.25);})
      //   .on("mouseover",function(d){
      //   div1.style("opacity", .9);
      //   div1 .html("Avg Ppt: "+ d.ppt + "<br/>" + "Day: " + formatTime(d.time))  
      //   .style("left", (d3.event.pageX) + "px")   
      //   .style("top", (d3.event.pageY-60) + "px");  
      // });
      
      // circle.on("mouseout", function(d){ 
      //   div1.transition()    
      //   .duration(100)    
      //   .style("opacity", 0);});

         //   var avgppt=[0,0,0,0,0,0,0,0,0,0,0,0];
         //    var avgtemp=[0,0,0,0,0,0,0,0,0,0,0,0];
         //   for(i=0;i<data.length;i++){
         //    if(i<31)
         //    { 
         //      avgppt[0]= parseFloat(data[i].ppt)+avgppt[0];
         //      avgtemp[0]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[0];
         //      avg_ppt[0]=avgppt[0]/31; 
         //      avg_temp[0]=avgtemp[0]/(31*2);   }
         //   else if((30<i)&&(i<59))
         //    { 
         //      avgppt[1]= parseFloat(data[i].ppt)+avgppt[1];
         //      avgtemp[1]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[1];
         //      avg_ppt[1]=(avgppt[1])/28;
         //      avg_temp[1]=(avgtemp[1]/2)/28;   }
         //    else if((58<i)&&(i<90))
         //    { 
         //      avgppt[2]= parseFloat(data[i].ppt)+avgppt[2];
         //      avgtemp[2]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[2];
         //      avg_ppt[2]=(avgppt[2])/31;  
         //      avg_temp[2]=(avgtemp[2]/2)/31; }
         //    else if((89<i)&&(i<120))
         //    { 
         //      avgppt[3]= parseFloat(data[i].ppt)+avgppt[3];
         //      avgtemp[3]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[3];
         //      avg_ppt[3]=(avgppt[3])/30;
         //      avg_temp[3]=(avgtemp[3]/2)/30;   }
         //    else if((119<i)&&(i<151))
         //    { 
         //      avgppt[4]= parseFloat(data[i].ppt)+avgppt[4];
         //      avgtemp[4]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[4];
         //      avg_ppt[4]=(avgppt[4])/31;
         //      avg_temp[4]=(avgtemp[4]/2)/31;   }
         //    else if((150<i)&&(i<181))
         //    { 
         //      avgppt[5]= parseFloat(data[i].ppt)+avgppt[5];
         //      avgtemp[5]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[5];
         //      avg_ppt[5]=avgppt[5]/30;
         //      avg_temp[5]=avgtemp[5]/(30*2);   }
         //    else if((180<i)&&(i<212))
         //    { 
         //      avgppt[6]= parseFloat(data[i].ppt)+avgppt[6];
         //      avgtemp[6]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[6];
         //      avg_ppt[6]=(avgppt[6])/31;
         //      avg_temp[6]=(avgtemp[6]/2)/31;   }
         //    else if((211<i)&&(i<243))
         //    { 
         //      avgppt[7]= parseFloat(data[i].ppt)+avgppt[7];
         //      avgtemp[7]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[7];
         //      avg_ppt[7]=(avgppt[7])/31;
         //      avg_temp[7]=(avgtemp[7]/2)/31;   }
         //    else if((242<i)&&(i<273))
         //    { 
         //      avgppt[8]= parseFloat(data[i].ppt)+avgppt[8];
         //      avgtemp[8]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[8];
         //      avg_ppt[8]=(avgppt[8])/30;
         //      avg_temp[8]=(avgtemp[8]/2)/30;   }
         //    else if((272<i)&&(i<304))
         //    { 
         //      avgppt[9]= parseFloat(data[i].ppt)+avgppt[9];
         //      avgtemp[9]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[9];
         //      avg_ppt[9]=(avgppt[9])/31;
         //      avg_temp[9]=(avgtemp[9]/2)/31;   }
         //    else if((303<i)&&(i<344))
         //    { 
         //      avgppt[10]= parseFloat(data[i].ppt)+avgppt[10];
         //      avgtemp[10]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[10];
         //      avg_ppt[10]=(avgppt[10])/30;
         //      avg_temp[10]=(avgtemp[10]/2)/30;   }
         //    else if((343<i)&&(i<365))
         //    { 
         //      avgppt[11]= parseFloat(data[i].ppt)+avgppt[11];
         //      avgtemp[11]= parseFloat(data[i].max_temp)+parseFloat(data[i].min_temp)+avgtemp[11];
         //      avg_ppt[11]=(avgppt[11])/31;
         //      avg_temp[11]=(avgtemp[11])/(31*2);   }

         //  }
         //  var months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]
         // if(average_ppt.length==0){
         //    for (var i = 0; i < 12; i++) {
         //        average_ppt.push({
         //            month: months[i],
         //            value: avg_ppt[i],
         //            temp:avg_temp[i]
         //        });
         //    }
         //  }
         //    for(var i=0;i<12;i++){
              
         //        pie_chart[i][0]=months[i];
         //        pie_chart[i][1]=avg_ppt[i];
         //        pie_chart[i][2]=avg_temp[i];
         //    }
   } 
} 
    function pptchart(){
    $("#pietemp").remove();
    $("#pieppt").remove();
    $("#label").remove();
    $(".pie").append("<div id='pieppt' class='aGraph'></div>");
    $(".labelpie").append("<div id='label'>Average Precipitation</div>");
    //alert(document.getElementsByClassName("pure-u-1-3").clientWidth);
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
        var width=420, height=500;
       
        var chart1 = d3.select("#pieppt")
          .append("svg:svg")             
          .data([average_ppt])                   
          .attr("width", width)           
          .attr("height", height)
          .append("svg:g")
          .attr("class","pieppt")               
          .attr("transform", "translate(" + 1.75*radius + "," + 2*radius+ ")")   
        /*var label1=d3.select("#label")
          .append("svg:svg")
          .attr("width", 400);             

        label1.append("text")
          .attr("x", 1*radius)             
          .attr("y", 18)
          .attr("float", "middle")  
          .text("Average Precipitation").style("font-family", "Tahoma")
          .style("font-weight","bold")
          .style("font-size", "18px" )
          .style("fill","#1ABC9C");*/
     
        var arc = d3.svg.arc()           
          .outerRadius(radius);
     
        var pie = d3.layout.pie().sort(null)            
          .value(function(d) { return d.value; });   
     
        var arcs = chart1.selectAll("g.slice")     
          .data(pie)                         
          .enter()                            
          .append("svg:g")              
          .attr("class", "slice")
          .style("stroke-width",1.5)
          .style("stroke","#ffffff");   

            
        arcs.append("svg:path")
          .attr("fill", function(d, i) { return color[i]; } ) 
          .attr("d", arc);                                   
     
        var pieslice=document.getElementsByClassName("slice")
            
        arcs.append("svg:text")                                     
          .attr("transform", function(d) {                    
          d.innerRadius = 1.5*radius;
          d.outerRadius = radius*2;
          return "translate(" + (arc.centroid(d)) + ")";        
        })
          .attr("text-anchor", "middle")                          
          .text(function(d, i) { return average_ppt[i].month; })
          .style("font-family","Tahoma")
          .style("stroke","#34495e")
          .style("stroke-width",0); 
            
        arcs.append("svg:text")                                     
          .attr("transform", function(d) {                    
          d.innerRadius = radius/2;
          d.outerRadius = radius*2;
          return "translate(" + (arc.centroid(d)) + ")";        
        })
          .attr("text-anchor", "middle")                       
          .text(function(d, i) { return average_ppt[i].value.toFixed(2); })
          .style("font-family","Tahoma")
          .style("fill","#34495e")
          .style("stroke-width",0);     
            //$("p").remove();
    };


 function tempchart(){
  $("#pieppt").remove();
 	$("#pietemp").remove();
  $("#label").remove();
	$(".pie").append("<div id='pietemp' class='aGraph'></div>");
  $(".labelpie").append("<div id='label'>Average Temperature</div>");
	var array=[],color=[];
 	var ppt_chart=[],temp=[];
    
	for (var i=0;i<12;i++){
	 	temp[i]=avg_temp[i];
	 }
	
	for (var i=0;i<12;i++){
		for (var j=i+1;j<12;j++){
			if(avg_temp[i]>avg_temp[j]){
				ppt_chart[i]=avg_temp[i];
			}
			else{
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
    var width=420, height=500;
    
    var chart2 = d3.select("#pietemp")
      .append("svg:svg")             
      .data([average_ppt])                   
      .attr("width", width)           
      .attr("height", height)
      .append("svg:g")
	    .attr("class","pietemp")               
      .attr("transform", "translate(" + 1.75*radius + "," + 2*radius + ")")   ;

    /*var label2=d3.select("#label")
      .append("svg:svg")
      .attr("width", 400);             

    label2.append("text")
      .attr("x", 1*radius)             
      .attr("y", 18)
      .attr("float", "middle")  
      .text("Average Temperature").style("font-family", "tahoma")
      .style("font-weight","bold")
      .style("font-size", "18px" )
      .style("fill","#1ABC9C");*/
 
    var arc2 = d3.svg.arc()           
      .outerRadius(radius);
 
    var pie2 = d3.layout.pie().sort(null)           
      .value(function(d) { return d.temp; });   
 
    var arcs2 = chart2.selectAll("g.slice")     
      .data(pie2)                         
      .enter()                            
      .append("svg:g")              
      .attr("class", "slice2")
      .style("stroke-width",1.5)
      .style("stroke","#ffffff");   

   // $(".slice2").hide();    
    arcs2.append("svg:path")
      .attr("fill", function(d, i) { return color[i]; } ) 
      .attr("d", arc2);                                   
 
    var pieslice=document.getElementsByClassName("slice")
        
    arcs2.append("svg:text")                                     
      .attr("transform", function(d) {                    
      d.innerRadius = 1.5*radius;
      d.outerRadius = radius*2;
      return "translate(" + (arc2.centroid(d)) + ")";        
    })
      .attr("text-anchor", "middle")                          
      .text(function(d, i) { return average_ppt[i].month; })
      .style("font-family","Tahoma, sans-serif")
      .style("stroke","#34495e")
      .style("stroke-width",0); 
        
    arcs2.append("svg:text")                                     
      .attr("transform", function(d) {                    
      d.innerRadius = radius/2;
      d.outerRadius = radius*2;
      return "translate(" + (arc2.centroid(d)) + ")";        
    })
      .attr("text-anchor", "middle")
      .style("color","white")                          
      .text(function(d, i) { return average_ppt[i].temp.toFixed(2); })
      .style("fill","#34495e")
      .style("stroke-width",0);
   
  //$("p").remove();
};

// $(document).ready(function() { 
// $(".switch").on("click",function(){
//     if (($('#pieppt').length== 0)&&($('#pietemp').length== 0)) {
//         pptchart();
//     }
//     else if ($('#pieppt').length== 0){
//       pptchart();
//     }
//     else if ($('#pietemp').length== 0){
//       tempchart();
//     }
//   }); 
//   })  
