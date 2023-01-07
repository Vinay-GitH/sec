Highcharts.SVGRenderer.prototype.symbols.download = function (x, y, w, h) {
	var path = [
	            // Arrow stem
	            'M', x + w * 0.5, y,
	            'L', x + w * 0.5, y + h * 0.7,
	            // Arrow head
	            'M', x + w * 0.3, y + h * 0.5,
	            'L', x + w * 0.5, y + h * 0.7,
	            'L', x + w * 0.7, y + h * 0.5,
	            // Box
	            'M', x, y + h * 0.9,
	            'L', x, y + h,
	            'L', x + w, y + h,
	            'L', x + w, y + h * 0.9
	            ];
	return path;
};


function exportCsv(data) {
	var ws = XLSX.utils.json_to_sheet(data)
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Compben Dashboard');
	XLSX.writeFile(wb, "compben_dashboard_profit_revenue_cost_all_fte.xlsx");
}


/**
 * Create a global getSVG method that takes an array of charts as an
 * argument
 */
Highcharts.getSVG = function (charts) {
	var svgArr = [],
	top = 0,
	width = 0;

	Highcharts.each(charts, function (chart) {
		var svg = chart.getSVG(),
		// Get width/height of SVG for export
		svgWidth = +svg.match(
				/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
		)[1],
		svgHeight = +svg.match(
				/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
		)[1];

		svg = svg.replace(
				'<svg',
				'<g transform="translate(0,' + top + ')" '
		);
		svg = svg.replace('</svg>', '</g>');

		top += svgHeight;
		width = Math.max(width, svgWidth);

		svgArr.push(svg);
	});

	return '<svg height="' + top + '" width="' + width +
	'" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
	svgArr.join('') + '</svg>';
};

/**
 * Create a global exportCharts method that takes an array of charts as an
 * argument, and exporting options as the second argument
 */
Highcharts.exportCharts = function (charts, options) {

	// Merge the options
	options = Highcharts.merge(Highcharts.getOptions().exporting, options);

	// Post to export server
	Highcharts.post(options.url, {
		filename: options.filename || 'chart',
		type: options.type,
		width: options.width,
		svg: Highcharts.getSVG(charts)
	});
};


function buildHighCharts(params , heading , minValueForY, maxValueForY, tickInt, allChartsOnThePage, filterDiv, exportToPDFBtn, exportToExcelBtn, exportToPptsBtn)
{
	chartIds = [];
	filters = {};


	hasSameDemographic = function (newDemographic, currentDemographic, demography) {
		return newDemographic['name'] === currentDemographic[demography];
	}

	renderFilters = function () {
		filterElement = $(filterDiv)[0];
		var baseTag='';
		if (filters['country'] !== undefined) {
			baseTag += createbaseTag('country');
		}
		if (filters['city'] !== undefined) {
			baseTag +=  createbaseTag('city');
		}

		if (filters['businessunit'] !== undefined) {
			baseTag +=  createbaseTag('businessunit');
		}
		filterElement.innerHTML = baseTag;
	}
	createbaseTag = function(key){
		return '<div class="filter-item" title="'+key+': '
		+ filters[key] + '">' + filters[key] + '<span onclick="removeFilter(\''+key+'\')" class="cross">x</span></div>';
	}
	removeFilter = function(key){ 
		delete filters[key];
		initCharts(chartIds);

	}
	isFiltered = function (data) {
		filtered = true;
		if (filters['country'] !== undefined) {
			filtered = filtered && (data.country == filters['country']);
		}
		if (filters['city'] !== undefined) {
			filtered = filtered && (data.city == filters['city']);
		}
		if (filters['businessunit'] !== undefined) {
			filtered = filtered && (data['business_level_3'] == filters['businessunit']);
		}
		return filtered;
	}

	formNewDemographic = function (data, keys) {
		newDemographicValues = [];
		keys.forEach(function (key) {
			newDemographicValues[key] = data[key];
		});
		return newDemographicValues
	}

	//**
	countDemographics = function (existingDemographic, count, keys) {
		newDemographicValues = [];
		newDemographicValues['name'] = existingDemographic['name'];
		keys.forEach(function (key) {
			newDemographicValues[key] = count;
		});
		return newDemographicValues
	}

	sumDemographics = function (existingDemographic, additionalDemographic, keys) {
		newDemographicValues = [];
		newDemographicValues['name'] = existingDemographic['name'];
		keys.forEach(function (key) {
			newDemographicValues[key] = existingDemographic[key] + additionalDemographic[key];
		});
		return newDemographicValues
	}

	avgDemographic = function (existingDemographic, count, keys) {
		newDemographicValues = [];
		newDemographicValues['name'] = existingDemographic['name'];
		keys.forEach(function (key) {
			newDemographicValues[key] = existingDemographic[key] / count;
		});
		return newDemographicValues
	}


	formDemographicData = function (data, demography) {
		demographies = [];
		remainingData = data;
		while (remainingData.length > 0) {
			remaining = [];
			count = 1;
			if (!isFiltered(remainingData[0])) {
				remainingData = remainingData.slice(1);
				continue;
			}
			newDemographic = formNewDemographic(remainingData[0], params);
			newDemographic['name'] = remainingData[0][demography];
			for (i = 1; i < remainingData.length; i++) {
				currentDemographic = remainingData[i];
				if (!isFiltered(currentDemographic)) {
					continue;
				}
				if (!hasSameDemographic(newDemographic, currentDemographic, demography)) {
					remaining.push(currentDemographic);
					continue;
				}
				count++;
				additionalDemographic = formNewDemographic(currentDemographic, params);
				additionalDemographic['name'] = currentDemographic[demography];
				newDemographic = sumDemographics(newDemographic, additionalDemographic, params);
			}
			demographies.push(newDemographic);
			remainingData = remaining;
		}
		return demographies.sort(function(a, b) {
            if (a.name < b.name)
                return -1;
              if (a.name > b.name)
                return 1;
              return 0;
            });
	}

	getCategories = function (data) {
		categories = [];
		data.forEach(demography => {
			categories.push(demography.name);
		});
		return categories;
	}

	extractSeries = function (data, keys) {
		allowances = [];
		keys.forEach(function (key) {
			newAllowance = {
					name: key,
					data: []
			};
			
			allowances.push(newAllowance);
		});
		data.forEach(demography => {
			allowances.forEach(function (allowance) {
				allowance.data.push(Math.round(demography[allowance.name]));
			});
		});
		//console.log('allowances' ,allowances);
		
		return allowances;
	}

	countryData = function () {
		return formDemographicData(_DATA, 'country');
	}
	cityData = function () {
		return formDemographicData(_DATA, 'city');
	}

	buData = function () {
		return formDemographicData(_DATA, 'business_level_3');
	}

	handleFilter = function (key, value) {
		if (filters[key] === undefined) {
			filters[key] = value;
		} else {
			delete filters[key];
		}
	}

	togglePopup = function (id) {
		exists = document.getElementById(id).getAttribute("style");
		if (exists.indexOf("display: block") >= 0) {
			document.getElementById(id).setAttribute("style", "display: none");
			document.getElementById("lg-popup").setAttribute("style", "display: none");
		} else {
			document.getElementById("lg-popup").setAttribute("style", "display: block");
			document.getElementById(id).setAttribute("style", "display: block");
		}
	}


	initChart = function (id, data, demography, filter, expandId) {
		Highcharts.chart(id, {
			chart: {
		  type: 'bar',
		  polar: true,
//		  backgroundColor : {
//	           linearGradient : [0,0, 0, 300],
//	           stops: [
//	                    [0, 'rgb(255, 255, 255)'],
//	                    [1, 'rgb(200, 200, 255)']
//	                ]
//	          },
		 style: {
            fontFamily: 'Century Gothic Regular'
            }
		 
		},

		legend: {
                  itemStyle: {
                        color: '#000',
                        fontWeight: 'bold'
                    }
                },

	    title: {
			text: demography,
			style:{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold'
        }  
		},
		xAxis: {
			categories: getCategories(data),
			labels: {
                style: { 
			             color: "#000",
                         fontSize:'14px',
                         fontWeight: 'bold'
                       }
                    }
		       },
		yAxis: {
			gridLineWidth: 0,
            minorGridLineWidth: 0,
			labels: {
            style: {	
			color: "#000",
             fontSize:'14px',
             fontWeight: 'bold'
         }
     },
			min: 0,
			max: null,
			tickInterval: tickInt,
			title: {
			text: heading
		}
		},


		tooltip: {
			//pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.2f}%)<br/>',
			//pointFormat: '<span style="color:{series.color}"></span><b>{point.y}</b><br/>',
			//shared: true
		},
		plotOptions: {
			column: {
			
			//depth: 25

		},
		 series: {
            shadow: true
        },
		series: {
        	colorByPoint: false,
        	 borderWidth: 0,
			 dataLabels: {
            enabled: true,
            style: {
				fontSize:'11px',
				color: "#000",
                    textOutline: false ,
                    textShadow: false 
              
			},
        allowOverlap: false,
		},
			events: {
			click: function (event) {
			filter(event.point.category);
			initCharts(chartIds);
		}
		}
		}
		},
		exporting: {
			buttons: {
			contextButton: {
			symbol: 'download',
			menuItems: ['printChart', 'downloadPDF',]
		},
		maximizeButton: {
			symbol: 'circle',
			symbolFill: '#B5C9DF',
			_titleKey: 'printButtonTitle',
			onclick: function () {
			togglePopup(expandId);
		}
		}
		}
		},
		
		series:  extractSeries(data, params),
		colors: [  '#ADD8E6',
			         '#6495ED',
			          '#4682B4',
			          '#4169E1',
			          '#191970',
			          '#87CEFA',
			          '#87CEEB',
			          '#00BFFF',
			          '#B0C4DE',
			          '#1E90FF',]
		});
	}
	countryFilter = function (value) {
		handleFilter('country', value);
	}

	cityFilter = function (value) {
		handleFilter('city', value);
	}


	buFilter = function (value) {
		handleFilter('businessunit', value);
	}

	initCountryChart = function (id, expandId) {
		initChart(id, countryData(), 'Country', countryFilter, expandId);
	}

	initCityChart = function (id, expandId) {
		initChart(id, cityData(), 'City', cityFilter, expandId);
	}


	initBuChart = function (id, expandId) {
		initChart(id, buData(), 'Business Unit', buFilter, expandId);
	}

	initCharts = function (ids) {
		chartIds = ids;
		initCityChart(ids.city, ids.cityExpanded);
		initCountryChart(ids.country, ids.countryExpanded);
		initBuChart(ids.businessUnit, ids.businessUnitExpanded);
		initCityChart(ids.cityExpanded, ids.cityExpanded);
		initCountryChart(ids.countryExpanded, ids.countryExpanded);
		initBuChart(ids.businessUnitExpanded, ids.businessUnitExpanded);
		
		renderFilters();

	}

	initCharts({
		country: "country-container",
		city: "city-container",
		businessUnit: "businessunit-container",
		countryExpanded: "country-container-lg",
		cityExpanded: "city-container-lg",
		businessUnitExpanded: "businessunit-container-lg"
	});
	

	
	exportToPDFBtn.click(function () {
		var allChartsOnThePageAsHighCharts = [];
		for(var i=0; i<allChartsOnThePage.length; i++) {
			allChartsOnThePageAsHighCharts.push($(allChartsOnThePage[i]).highcharts());
		}
		Highcharts.exportCharts(allChartsOnThePageAsHighCharts, {
			filename : 'compben_charts_profit_revenue_cost_all_fte',
			type: 'application/pdf'
		});
	});

	exportToExcelBtn.click(function () {
		exportCsv(data);
	});

	exportToPptsBtn.click(function () {
		exportPpts();
	});

}

initialize = function (url, nodejs_api_helper, allChartsOnThePage, filterDiv, exportToPDFBtn, exportToExcelBtn, exportToPptsBtn) {
	_DATA = [];
	$('#rpt_loading').show();
	getData = function (url, nodejs_api_helper) {
		
		var parts = url.split('/');
		var lastSegment = parts.pop() || parts.pop();
		$.ajax(nodejs_api_helper.getAjaxCommonSettings(url))
		.done(function (response) {

			$('#rpt_loading').hide();
			var appresponse = JSON.parse(response);

			data = appresponse.data;
			_DATA = appresponse.data;
             
			//NEW_KEY_WORD = 'Calculated_';
			key_word_1 = 'Revenue';
			key_word_2 = 'Avg';
			key_word_3= 'Profit';
			
			 getKeys = function (data) {
					
					keys = Object.keys(data[0]);
					all_keys = [];
					keys.forEach(function (key) {
						if (key.indexOf(key_word_1) === 0) {
							
							all_keys.push(key);
						}
	if (key.indexOf(key_word_2) === 0) {
							
							all_keys.push(key);
						}
	if (key.indexOf(key_word_3) === 0) {
		
		all_keys.push(key);
	}
					});
					return all_keys;
				}
			 if(nodejs_api_helper.isEmpty(data)) {
				  NEW_KEY_WORD = [0];
				} else {
					NEW_KEY_WORD = getKeys(data); 
				}
				buildHighCharts(NEW_KEY_WORD, '', 0, null, null, allChartsOnThePage, filterDiv, exportToPDFBtn, exportToExcelBtn, exportToPptsBtn); //as per clients requirement


		})
		.fail(function()  {
			custom_alert_popup("Sorry. Server unavailable. ");
			$('#rpt_loading').hide();
		});
	}
	getData(url, nodejs_api_helper);
}


getFinancialYear = function(nodejs_api_helper) {
	var url = nodejs_api_helper.base_url+'/financial_year';
	$.ajax(nodejs_api_helper.getAjaxCommonSettings(url))
	.done(function (response) {

		$('#rpt_loading').hide();

		var dropdown = $("#financial_year"); 
		//var dropdown2 = $("#financial_year_add"); 

		var years = JSON.parse(response).data;

		for (var i = 0; i < years.length; i++) {
			var option = "<option value='"+years[i].id+"'>"
			+ years[i].name
			+"</option>";
			//console.log(option);
			dropdown.append(option);
			//dropdown2.append(option);
		}

	})
	.fail(function()  {
		custom_alert_popup("Sorry. Server unavailable. ");
		$('#rpt_loading').hide();
	});
}

//for export in ppt
function exportPpts() {
	$('#loading').show()
	var pptx = new PptxGenJS();
	var chartArray = ["country-container", "city-container", "businessunit-container"];
	var i = 0;

	$( chartArray ).each(function( index, val ) {

		setTimeout(function() {
		  node = $('#'+val);
		  var w = getInch(node.width());
		  var h = getInch(node.height());
		  domtoimage.toPng(node[0])
		    .then(function (dataUrl) {
			var slide = pptx.addNewSlide();
			slide.back  = 'F1F1F1';
			$.when( slide ).done(function ( slide ) {
			    slide.addImage({ data:dataUrl, x:0.5, y:1.25, w:w, h:h});
			    i++;
			});

			if(i == chartArray.length) {
			    pptx.save('compben_charts_profit_revenue_cost_all_fte');
			    $('#loading').hide()
			}

	 	   });
		}, 1000 * index);

	});

}

function getInch(px) {
	return Math.round(px / 150);
}
