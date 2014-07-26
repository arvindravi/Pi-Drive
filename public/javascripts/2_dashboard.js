$(document).ready(function(){
  $('select').select2({
    minimumResultsForSearch: -1
  });
});

var fbase = new Firebase('https://piobd.firebaseio.com/');
  var micraRef = new Firebase('https://piobd.firebaseio.com/micra/')
  var data;
  var selectedParam = $('#param').val();

  function getDataAndDraw(data, pa) {
    var d = [], t = [];
    fbase.on('value', function(micra) {
      micra.forEach(function(dataObject) {
        dataObject.forEach(function(entry) {
          // console.log(entry.child(data).val());
          d.push(entry.child(data).val().value);
          t.push(new Date(entry.child('time').val()));
        });
      });
      data = {data: d, time: t};

      draw(data);
      return data;
    });
  }

  getDataAndDraw('rpm');


  function checkDuplicates(array) {
    if (array.slice(0,3)[0] == array.slice(0,3)[1]) {
      if (array.slice(0,3)[1] == array.slice(0,3)[2]) {
        return true;
      }
    }
  }

  function draw(data) {



    // Margins and stuff
    var margin = {top: 20, right: 20, bottom: 20, left: 40};
    var width = 600 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    // X and Y axis' data
    var xAxisData = data.time;
    var yAxisData = data.data;

    // Some parsing shit
    var dateFormat = d3.time.format("%x");

    if(checkDuplicates(yAxisData)) {
      yAxisData = [0, yAxisData[2], yAxisData[2]+50];
    }

    // Scales
    var x = d3.time.scale().domain(d3.extent(xAxisData.slice(Math.max(this.length - 10)))).range([0, width]);
    // var x = d3.scale.linear().domain([100, 500]).range([0, width]);
    var y = d3.scale.linear().domain(d3.extent(yAxisData)).range([height, 0]);


    //Axes
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");


    //Base Layer
    var svgContainer = d3.select('#graph').append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Draw Axes
    svgContainer.append("g").attr("class","axis bottom").attr("transform", "translate(0," + height + ")").call(xAxis);
    svgContainer.append("g").attr("class","axis left").call(yAxis);

    // Line function
    var line = d3.svg.line()
        .x(function(d,i) { return x(d.time); })
        .y(function(d,i) { return y(d.data); })
        .interpolate("basis");

    var lineData = data.time.map(function (_, idx) {
              return { data: data.data[idx], time: data.time[idx] };
            });




      micraRef.on('child_added', function(newChild) {
        tick(newChild);
      });

      var clip = svgContainer.append("defs").append("svg:clipPath")
                      .attr("id", "clip")
                      .append("svg:rect")
                      .attr("id", "clip-rect")
                      .attr("x", "0")
                      .attr("y", "0")
                      .attr("width", width + 60)
                      .attr("height", height);

      var path = svgContainer
                  .append("g").attr("clip-path", "url(#clip)")
                  .append("path")
                  .datum(lineData)
                  .attr("class", "line")
                  .style("stroke", "red")
                  .attr("d", line);


      function pushToLeft(param) {
        data.data.push(param);
      }

      function tick(d) {

          var currentValue = d.child(selectedParam).val().value;
          var currentValueField = $('#stats').find('table tbody tr td:nth-child(2)');
          var ub = $('#stats').find('table tbody tr td:nth-child(3)').text();
          var noticeField = $('div#notice p');

          data.time.push(new Date(d.child('time').val()));
          data.time.shift();
          // svgContainer.select(".axis.bottom")
          //           .transition()
          //           .ease("linear")
          //           .duration(500)
          //           .call(xAxis);

          x.domain(d3.extent(data.time.slice(Math.max(this.length - 10))));
          // console.log(d3.extent(data.data.slice(Math.max(this.length - 10))), data.data.slice(Math.max(this.length)));
          // console.log(d3.extent(data.data.slice(Math.max(this.length))));
          // console.log(selectedParam);
          // console.log(d.child(selectedParam).val().value);

          currentValueField.text(currentValue);
          console.log(ub);
          if(currentValue > 1400) {
            noticeField.text("The user has been notified!");
          }
          else {
            noticeField.text("");
          }

          data.data.push(currentValue);
          y.domain(d3.extent(data.data));

          var lineData = data.time.map(function (_, idx) {
                  return { data: data.data[idx], time: data.time[idx] };
                });


          svgContainer.select(".axis.bottom")
                    .transition()
                    .ease("linear")
                    .call(xAxis);

          svgContainer.select(".axis.left")
                    .transition()
                    .ease("linear")
                    .call(yAxis);



          path.datum(lineData)
              .attr("d", line)
              .attr("transform", null)
              .style("stroke", "red")
            .transition()
              .duration(500)
              .ease("linear");

          data.data.shift();

      }

  }

  $('#param').on('change', function(){
    selectedParam = $(this).val();
    d3.select("svg").remove();
    getDataAndDraw(selectedParam);

    var lb = $('#stats').find('table tbody tr td:nth-child(1)');
    var ub = $('#stats').find('table tbody tr td:nth-child(3)');
    if(selectedParam == 'vss') {
      lb.text("0");
      ub.text("220");
    }
    else if(selectedParam == 'temp') {
      lb.text("0");
      ub.text("140");
    }
    else if(selectedParam == 'load_pct') {
      lb.text("0");
      ub.text("100");
    }
    else if(selectedParam == 'rpm') {
      lb.text("600");
      up.text("2200");
    }
  });
