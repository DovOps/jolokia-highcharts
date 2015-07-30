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
var jolokia = new Jolokia(url);

return new Highcharts.Chart({
 chart: {
  renderTo: renderTo,
  defaultSeriesType: seriesType,
  events: {
   load: function() {
	var series = this.series[0];
	setInterval(function() {
	 var x = (new Date()).getTime();
	 var attribute = jolokia.getAttribute(mbean, attrName, path);
	 series.addPoint({
	  x: new Date().getTime(), //x Axis
	  y: parseInt(attribute)  //y Axis
	 }, true, series.data.length >= seriesLength);
	}, interval);
   }
  }
 },
 title: {
  text: attrName
 },
 xAxis: {
  type: 'datetime'
 },
 yAxis: {
  title: { text: attrName }
 },
 series: [{
  data: [],
  name: attrName + ":" + path
 }]
});
}
