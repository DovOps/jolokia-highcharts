# jolokia-highcharts
Jolokia JS + Highcharts mashup

##HowTo
1. Download Jolokia WAR-Agent: https://jolokia.org/download.html  
2. Drop the Jolokia war into your web server and start it up  
3. Confirm you get a REST response at http://{host}:{port}/{jolokia-war}/read/java.lang:type=Memory/  
4. Pull this repo if you have not done so already  
5. Put the correct URLs into index.htm  
6. Load index.htm in your browser
