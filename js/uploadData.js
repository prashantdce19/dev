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
                  //if chart is not been called called for first time
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
				       var csv = evt.target.result;    
               //conver the data from file to json format by call funtion with data as argument
				       var json = CSV2JSON(csv);
               //call chart with json data to render for user
              if(json[0].min_temp === undefined && json[0].max_temp === undefined || json[0].ppt === undefined){
                  d3.select(".pieHeaderButton").style("display","none");
              };
              if(json[0].min_temp === undefined && json[0].max_temp === undefined && json[0].ppt === undefined && json[0].time === undefined){
                  alert("We don't understand data")
              }else{
                if(json[0].time === undefined){
                  alert('What date you entered for?');
                }else{
                  if(json[0].min_temp === undefined && json[0].max_temp === undefined && json[0].ppt === undefined){
                    alert("We don't understand data");
                  }else{
                    makechart(json);
                  }
                }
              };
              var barButton = document.getElementById('linkToPieChart');
              if(hasClass(barButton,"hide"))
              {
                toggleClass(barButton,"show","hide");
              };
			    };
  		 	}
		    var blob = file.slice(start, stop + 1); 
		    reader.readAsBinaryString(blob);
	    };
      //convert file format data to json format
      function CSV2JSON(csv) { 
            //convert csv format to array format           
            var array = CSVToArray(csv)
                ,keyWord = [
                        ['min','Min','min.','Min.','MIN','minimum','Minimum','MINIMUM','tmin','tMin','Tmin','TMin','TMIN','mintemp',
                          'minTemp','Mintemp','MinTemp','minimumtemp','minimumTemp','Minimumtemp','MinimumTemp',
                          'mintemperature','minTemperature','Mintemperature','MinTemperature','minimumtemperature',
                          'minimumTemperature','Minimumtemperature','MinimumTemperature'],
                        ['max','Max','max.','Max.','MAX','maximum','Maximum','MAXIMUM','tmax','tMax','Tmax','TMax','TMAX','maxtemp',
                        'maxTemp','Maxtemp','MaxTemp','maximumtemp','maximumTemp','Maximumtemp','MaximumTemp',
                        'maxtemperature','maxTemperature','Maxtemperature','MaxTemperature','maximumtemperature',
                        'maximumTemperature','Maximumtemperature','MaximumTemperature'],
                        ['Percipitation','percipitation','Ppt','ppt'],
                        ['Date','date','Time','time']
                      ]
                ,originalHeader = ['min_temp','max_temp','ppt','time']
                ,headerKey =[]
                ,heads=array[0];
            for (var headIterator = 0; headIterator < heads.length; headIterator++) {                  
                var key = heads[headIterator];
                tmp:for(var keyWordIterator = 0;keyWordIterator< keyWord.length;keyWordIterator++){
                    for(var keyWordSubIterator = 0; keyWordSubIterator< keyWord[keyWordIterator].length; keyWordSubIterator++){
                        if(key.indexOf(keyWord[keyWordIterator][keyWordSubIterator]) !== -1){
                          headerKey[headIterator]=originalHeader[keyWordIterator];
                          break tmp;
                        };
                    }
                }
            };
            var json=_.map(array,function(array_item,array_index){
              if(array_index!==0)
                return _.object(headerKey, array_item);
            });            
            return _.rest(json);
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