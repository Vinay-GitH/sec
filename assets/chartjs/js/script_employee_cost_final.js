var MyCounter = 0;
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
    XLSX.writeFile(wb, "compben_dashboard_employee_cost.xlsx");
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


function buildHighCharts(params, heading, minValueForY, maxValueForY, tickInt, allChartsOnThePage, filterDiv, exportToPDFBtn, exportToExcelBtn, exportToPptsBtn) {
    chartIds = [];
    filters = {};
    hasSameDemographic = function (newDemographic, currentDemographic, demography) {
        return newDemographic['name'] === currentDemographic[demography];
    }

    renderFilters = function () {
        filterElement = $(filterDiv)[0];
        var baseTag = '';
        if (filters['country'] !== undefined) {
            baseTag += createbaseTag('country');
        }
        if (filters['city'] !== undefined) {
            baseTag += createbaseTag('city');
        }

        if (filters['businessunit'] !== undefined) {
            baseTag += createbaseTag('businessunit');
        }

        if (filters['grade'] !== undefined) {
            baseTag += createbaseTag('grade');
        }
        if (filters['level'] !== undefined) {
            baseTag += createbaseTag('level');
        }

        if (filters['function'] !== undefined) {
            baseTag += createbaseTag('function');
        }
        if (filters['gender'] !== undefined) {
            baseTag += createbaseTag('gender');
        }

        if (filters['businessunit'] !== undefined) {
            baseTag += createbaseTag('businessunit');
        }

        if (filters['performance_rating'] !== undefined) {
            baseTag += createbaseTag('performance_rating');
        }


        filterElement.innerHTML = baseTag;
    }
    createbaseTag = function (key) {
        return '<div class="filter-item" title="' + key + ': ' +
            filters[key] + '">' + filters[key] + '<span onclick="removeFilter(\'' + key + '\')" class="cross">x</span></div>';
    }
    removeFilter = function (key) {
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

        if (filters['gender'] !== undefined) {
            filtered = filtered && (data['gender'] == filters['gender']);
        }
        if (filters['level'] !== undefined) {
            filtered = filtered && (data['level'] == filters['level']);
        }
        if (filters['function'] !== undefined) {
            filtered = filtered && (data['function'] == filters['function']);
        }
        if (filters['grade'] !== undefined) {
            filtered = filtered && (data['grade'] == filters['grade']);
        }
        if (filters['performance_rating'] !== undefined) {
            filtered = filtered && (data['performance_rating'] == filters['performance_rating']);
        }
        return filtered;
    }

    formNewDemographic = function (data, keys) {
        newDemographicValues = [];
        keys.forEach(function (key) {
            newDemographicValues[key] = data[key];
        });
        newDemographicValues["hc"]=data["hc"];
        return newDemographicValues
    }

    //**
    countDemographics = function (existingDemographic, count, keys) {
        newDemographicValues = [];
        newDemographicValues['name'] = existingDemographic['name'];
        keys.forEach(function (key) {
            newDemographicValues[key] = count;
        });
        return newDemographicValues;
    }

    sumDemographics = function (existingDemographic, additionalDemographic, newDemographicValues, key) {
        newDemographicValues[key] = existingDemographic[key] + additionalDemographic[key];
        return newDemographicValues;
    }
    maxDemographics = function (existingDemographic, additionalDemographic, newDemographicValues, key) {
        if (existingDemographic[key] > additionalDemographic[key]) {
            newDemographicValues[key] = existingDemographic[key];
        } else {
            newDemographicValues[key] = additionalDemographic[key];
        }
        return newDemographicValues;
    }

    minDemographics = function (existingDemographic, additionalDemographic, newDemographicValues, key) {
    	if (existingDemographic[key] < additionalDemographic[key]) {
            newDemographicValues[key] = existingDemographic[key];
        } else {
            newDemographicValues[key] = additionalDemographic[key];
        }
    	  
        return newDemographicValues;
    }
    avgDemographics = function (existingDemographic, additionalDemographic, newDemographicValues, key) {
    	newDemographicValues[key] = ((existingDemographic[key]*existingDemographic["hc"]) + (additionalDemographic[key]*additionalDemographic["hc"])) / (existingDemographic["hc"]+additionalDemographic["hc"]);
    	newDemographicValues["hc"]=existingDemographic["hc"]+additionalDemographic["hc"];
    	return newDemographicValues;
    }
    
    medianDemographics = function(existingDemographic, additionalDemographic, newDemographicValues, key){
        // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    	newDemographicValues[key] = 0, 
        numsLen = (existingDemographic["hc"]+additionalDemographic["hc"]);
        existingDemographic.sort();
       if (
            numsLen % 2 === 0 // is even
        ) {
            // average of two middle numbers
    	   newDemographicValues[key] = (existingDemographic[numsLen / 2 - 1] + existingDemographic[numsLen / 2]) / 2;
        } else { // is odd
            // middle number only
        	newDemographicValues[key] = existingDemographic[(numsLen - 1) / 2];
        }
     return newDemographicValues;
    }
    setDemographics = function (existingDemographic, additionalDemographic, keys, count) {
        newDemographicValues = [];
        newDemographicValues['name'] = existingDemographic['name'];
        keys.forEach(function (key) {
            if (key.includes("Sum")) {
                sumDemographics(existingDemographic, additionalDemographic, newDemographicValues, key);
            } else
            if (key.includes("Max")) {
                maxDemographics(existingDemographic, additionalDemographic, newDemographicValues, key);
            } else
            if (key.includes("Min")) {
                minDemographics(existingDemographic, additionalDemographic, newDemographicValues, key);

            } else
            if (key.includes("Average")) {
                avgDemographics(existingDemographic, additionalDemographic, newDemographicValues, key);

            } else
            	  if (key.includes("Median")) {
                      avgDemographics(existingDemographic, additionalDemographic, newDemographicValues, key);

                  }

        });
        return newDemographicValues;
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
                    //console.log(currentDemographic);
                    remaining.push(currentDemographic);
                    continue;
                }
                count++;
                additionalDemographic = formNewDemographic(currentDemographic, params);
                //console.log(currentDemographic[demography]);
                additionalDemographic['name'] = currentDemographic[demography];
                newDemographic = setDemographics(newDemographic, additionalDemographic, params, count);

            }
            demographies.push(newDemographic);
            remainingData = remaining;
        }
        return demographies.sort(function (a, b) {
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
            if (key.includes("Sum")) {
                newAllowance = {
                    name: key,
                    data: [],
                    colorByPoint: true
                };
            } else {
                newAllowance = {
                    name: key,
                    data: [],
                    colorByPoint: false
                };
            }

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
    gradeData = function () {
        return formDemographicData(_DATA, 'grade');
    }
    levelData = function () {
        return formDemographicData(_DATA, 'level');
    }
    functionData = function () {
        return formDemographicData(_DATA, 'function');
    }
    genderData = function () {
        return formDemographicData(_DATA, 'gender');
    }
    performanceRatingData = function () {
        return formDemographicData(_DATA, 'performance_rating');
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


    initChart = function (id, data, demography, filter, expandId, type) {
        if (type == 'pie') {
            Highcharts.setOptions({
                pie: {
                    innerSize: '40%',
                    depth: 25,
                    showInLegend: true
                },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                filter(event.point.category);
                                initCharts(chartIds);
                            }
                        }
                    },
                    animation: {
                        duration: 500
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.series.yData[this.colorIndex];
                            // return Math.round(this.percentage * 100) / 100 + '%';
                        },
                        style: {
                            textOutline: 'none'
                        }
                    }
                }
            });

        } else {
            Highcharts.setOptions({

                plotOptions: {

                    series: {

                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '11px',
                                fontFamily: 'Century Gothic',

                            },
                        
                            allowOverlap: false,
                        },
                        //colorByPoint: true,
                        events: {
                            click: function (event) {
                                filter(event.point.category);
                                initCharts(chartIds);
                            }
                        }
                    }
                }

            });
        }


        Highcharts.chart(id, {
            chart: {

                type: type,

                //			backgroundColor : {
                //			linearGradient : [0,0, 0, 300],
                //			stops: [
                //			[0, 'rgb(255, 255, 255)'],
                //			[1, 'rgb(200, 200, 255)']
                //			]
                //			},
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
                style: {
                    color: '#000',
                    fontSize: '20px',
                    fontWeight:'600'

                }
            },
            xAxis: {
                categories: getCategories(data),
                 labels: {
                    style: {
                        color:"#000",
                        cursor:"default",
                        fontSize:"11px",
                        fontWeight:'600'
                    }
                 }
            },
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                min: 0,
                max: null,
                tickInterval: tickInt,
                 labels: {
                    style: {
                        color:"#000",
                        cursor:"default",
                        fontSize:"11px",
                        fontWeight:'600'
                    }
                  },
                title: {
                    text: heading
                }
            },
            //		legend: {

            //		itemStyle: {

            //		fontSize:'15px',
            //		font: 'Century Gothic',
            //		color: '#000'
            //		},
            //		itemHoverStyle: {
            //		color: '#A0A0A0'
            //		},
            //		itemHiddenStyle: {
            //		color: '#444'
            //		}

            //		},
            tooltip: {
                //pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.2f}%)<br/>',
                //pointFormat: '<span style="color:{series.color}"></span><b>{point.y}</b><br/>',
                //shared: false
            },
            plotOptions: {
                column: {
            	 // stacking: 'normal',
                    //depth: 25

                },
                series: {
                    shadow: true
                },
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '11px',
                            color: "#000",
                            fontFamily: 'Century Gothic Regular',
                            textOutline: false,
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
                        menuItems: ['printChart', 'downloadPDF', ]
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

            series: extractSeries(data, params),
            colors: ['#ADD8E6',
                '#6495ED',
                '#4682B4',
                '#4169E1',
                '#191970',
                '#87CEFA',
                '#87CEEB',
                '#00BFFF',
                '#B0C4DE',
                '#1E90FF',
            ],


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

    gradeFilter = function (value) {
        handleFilter('grade', value);
    }

    functionFilter = function (value) {
        handleFilter('function', value);
    }

    levelFilter = function (value) {
        handleFilter('level', value);
    }
    genderFilter = function (value) {
        handleFilter('gender', value);
    }

    performanceRatingFilter = function (value) {
        handleFilter('performance_rating', value);
    }
    initCountryChart = function (id, expandId) {
        initChart(id, countryData(), 'Country', countryFilter, expandId, 'column');
    }

    initCityChart = function (id, expandId) {
        initChart(id, cityData(), 'City', cityFilter, expandId, 'column');
    }


    initBuChart = function (id, expandId) {
        initChart(id, buData(), 'Business Unit', buFilter, expandId, 'column');
    }

    initGradeChart = function (id, expandId) {
        initChart(id, gradeData(), 'Grade', gradeFilter, expandId, 'column');
    }

    initFunctionChart = function (id, expandId) {
        initChart(id, functionData(), 'Function', functionFilter, expandId, 'column');
    }

    initLevelChart = function (id, expandId) {
        initChart(id, levelData(), 'Level', levelFilter, expandId, 'column');
    }
    initPerformanceChart = function (id, expandId) {
        initChart(id, performanceRatingData(), 'Performance Rating', performanceRatingFilter, expandId, 'column');
    }


    initGenderChart = function (id, expandId) {
        initChart(id, genderData(), 'Gender', genderFilter, expandId, 'column');
    }
    initCharts = function (ids) {
        chartIds = ids;
        initCityChart(ids.city, ids.cityExpanded);
        initCountryChart(ids.country, ids.countryExpanded);
        initBuChart(ids.businessUnit, ids.businessUnitExpanded);
        initGradeChart(ids.grade, ids.gradeExpanded);
        initFunctionChart(ids.function, ids.functionExpanded);
        initLevelChart(ids.level, ids.levelExpanded);
        initGenderChart(ids.gender, ids.genderExpanded);
        initPerformanceChart(ids.performance_rating, ids.performance_ratingExpanded);
        initCityChart(ids.cityExpanded, ids.cityExpanded);
        initCountryChart(ids.countryExpanded, ids.countryExpanded);
        initBuChart(ids.businessUnitExpanded, ids.businessUnitExpanded);
        initGradeChart(ids.gradeExpanded, ids.gradeExpanded);
        initFunctionChart(ids.functionExpanded, ids.functionExpanded);
        initLevelChart(ids.levelExpanded, ids.levelExpanded);
        initGenderChart(ids.genderExpanded, ids.genderExpanded);
        initPerformanceChart(ids.performance_ratingExpanded, ids.performance_ratingExpanded);

        renderFilters();

    }

    initCharts({
        country: "country-container",
        city: "city-container",
        grade: "grade-container",
        level: "level-container",
        function: "function-container",
        businessUnit: "businessunit-container",
        gender: "gender-container",
        performance_rating: "performance_rating-container",
        countryExpanded: "country-container-lg",
        cityExpanded: "city-container-lg",
        gradeExpanded: "grade-container-lg",
        levelExpanded: "level-container-lg",
        functionExpanded: "function-container-lg",
        businessUnitExpanded: "businessunit-container-lg",
        genderExpanded: "gender-container-lg",
        performance_ratingExpanded: "performance_rating-container-lg"

    });

    exportToPDFBtn.click(function () {
        var allChartsOnThePageAsHighCharts = [];
        for (var i = 0; i < allChartsOnThePage.length; i++) {
            allChartsOnThePageAsHighCharts.push($(allChartsOnThePage[i]).highcharts());
        }
        Highcharts.exportCharts(allChartsOnThePageAsHighCharts, {
            filename: 'compben_charts_employee_cost',
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
                //NEW_KEY_WORD_MEDIAN = 'Median';

                if (lastSegment === '1') {
                    NEW_KEY_WORD = 'Sum of Employee Cost';

                } else {
                    NEW_KEY_WORD = 'Employee Cost';
                }

                getKeys = function (data) {

                    keys = Object.keys(data[0]);
                    all_keys = [];
                    keys.forEach(function (key) {
                        if (key.indexOf(NEW_KEY_WORD) === 0) {
                            all_keys.push(key);
                        }

                    });
                    return all_keys;
                }
                if (nodejs_api_helper.isEmpty(data)) {
                    NEW_KEY_WORD = [0];
                } else {
                    NEW_KEY_WORD = getKeys(data);
                }
                buildHighCharts(NEW_KEY_WORD, '', 0, null, null, allChartsOnThePage, filterDiv, exportToPDFBtn, exportToExcelBtn, exportToPptsBtn); //as per clients requirement


            })
            .fail(function () {
                custom_alert_popup("Sorry. Server unavailable. ");
                $('#rpt_loading').hide();
            });
    }
    getData(url, nodejs_api_helper);
}


getSalaryType = function (nodejs_api_helper) {
    var url = nodejs_api_helper.base_url + '/salary_elements';
    $.ajax(nodejs_api_helper.getAjaxCommonSettings(url))
        .done(function (response) {

            $('#rpt_loading').hide();

            var dropdown = $("#salary_type");

            var salary_type = JSON.parse(response).data;

            for (var i = 0; i < salary_type.length; i++) {
                var option = "<option value='" + salary_type[i].ba_name + "'>" +
                    salary_type[i].display_name +
                    "</option>";
                //console.log(option);
                dropdown.append(option);
            }

        })
        .fail(function () {
            custom_alert_popup("Sorry. Server unavailable. ");
            $('#rpt_loading').hide();
        });
}

getCountry = function (nodejs_api_helper) {
    var url = nodejs_api_helper.base_url + '/currency';
    $.ajax(nodejs_api_helper.getAjaxCommonSettings(url))
        .done(function (response) {

            $('#rpt_loading').hide();

            var dropdown = $("#country_id");

            var country_id = JSON.parse(response).data;

            var default_currency = "<option value='0'>default</option>";
            dropdown.append(default_currency);
            for (var i = 0; i < country_id.length; i++) {
                var option = "<option value='" + country_id[i].id + "'>" +
                    country_id[i].name +
                    "</option>";
                //console.log(option);
                dropdown.append(option);
            }

        })
        .fail(function () {
            custom_alert_popup("Sorry. Server unavailable. ");
            $('#rpt_loading').hide();
        });
}

//for export in ppt
function exportPpts() {
	$('#loading').show()
	var pptx = new PptxGenJS();
	var chartArray = ["country-container", "city-container", "businessunit-container", "grade-container", "level-container", "function-container", "performance_rating-container", "gender-container"];
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
			    slide.addImage({ data:dataUrl, x:1.5, y:0.75, w:w, h:h});
			    i++;
			});

			if(i == chartArray.length) {
			    pptx.save('compben_charts_employee_cost');
			    $('#loading').hide()
			}

	 	   });
		}, 1000 * index);

	});

}

function getInch(px) {
    return Math.round(px / 95.999999998601);
}
