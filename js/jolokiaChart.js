/* Function that wraps new chart creation, to make it easier to spin
 * up new charts in the front end 
 * 
 * Parameters
 * @url URL that Jolokia agent is broadcasting on
 * @interval number of milliseconds to poll Jolokia
 * @renderTo CSS selector in which to pin the rendering of the graph to
 * @seriesType Graph type
 * @seriesLength number of graph points to retain
 * @mbean MBean type
 * @attrName MBean attribute name
 * @path MBean attribute path
 * 
 * */
function jolokiaChart(url, interval, renderTo, seriesType, seriesLength, mbean, attrName, path) {
    var request={type: "read", mbean: mbean, attribute:attrName};
    if(path) request.path=path;
    var title=attrName;
    var requests=[request];
    jolokiaMultiSeriesChart(title, url, interval, renderTo, seriesType, seriesLength, requests);
}

/* Function that wraps new chart creation but supports multiple series 
 * in the same chart
 * 
 * @example
 * jolokiaMultiSeriesChart("Memory Level", "/jolokia", 5000, "myChart", "spline", 30, [
 *  { type: "read", mbean: "java.lang:type=Memory", attribute: "HeapMemoryUsage" , path:"used"},
 *  { type: "read", mbean: "java.lang:type=Memory", attribute: "HeapMemoryUsage" , path:"initial" },
 *  { type: "read", mbean: "java.lang:type=Memory", attribute: "HeapMemoryUsage" , path:"committed" }
 *   ], {type: 'logarithmic'} );
 * 
 * Parameters
 * @title Chart title to display
 * @url URL that Jolokia agent is broadcasting on
 * @interval number of milliseconds to poll Jolokia
 * @renderTo CSS selector in which to pin the rendering of the graph to
 * @seriesType Graph type
 * @seriesLength number of graph points to retain
 * @requests Array of Jolokia Requests (See https://jolokia.org/reference/html/clients.html#client-javascript Section 8.2.8.1 on Bulk requests)
 * @yAxisConfig (optional) To override Y axis with things like logrithmic, or minorTickInterval settings
 * 
 * */

function jolokiaMultiSeriesChart(title, url, interval, renderTo, seriesType, seriesLength, requests, yAxisConfig) {
  var jolokia = new Jolokia(url);
  var allSeries=[];
  requests.forEach(function (req){
    allSeries.push(
      {data:[], name:req.attribute + (req.path ?":"+req.path:"")}
    );
  });
	
 var defaultYAxisConfig={title:title};
 if(!yAxisConfig) yAxisConfig=defaultYAxisConfig;

 return new Highcharts.Chart({
  chart: {
   renderTo: renderTo,
   defaultSeriesType: seriesType,
   events: {
    load: function() {
     var seriesArray=this.series;
     setInterval(function(){
       // Send bulk requests 
       var responses=jolokia.request(requests); 
       for(var i=0; i<responses.length;++i){
         var r=responses[i];
         var point={x:r.timestamp,y:r.value};
         seriesArray[i].addPoint(
           point, true, seriesArray[i].data.length >= seriesLength);
         }
      }, interval);
  }
  }
 },
 title: {
  text: title
 },
 xAxis: {
  type: 'datetime'
 },
  yAxis: yAxisConfig,
 series: allSeries
});
}
