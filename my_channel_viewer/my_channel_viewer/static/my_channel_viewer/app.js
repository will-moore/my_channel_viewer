function createTuningSliders(image, context, globalValues, tuningSlidersFragment){
  var globalMinMaxPixelValues = getMinMaxPixelValues(globalValues);
  $.each(globalValues, function(index, value) {
    var tuningSlidersHTMLstring = '';
    var sliderIdentifier = "#slider-range"+index.toString();
    var valueVisualizerIdentifier = "#minmaxPixelValues"+index.toString();
    tuningSlidersHTMLstring = tuningSlidersHTMLstring+'<p><label for="minmaxPixelValues'+index+'">Channel '+index+':</label><input type="text" id="minmaxPixelValues'+index+'" readonly style="border:0; color:#f6931f; font-weight:bold;"></p><span id="slider-range'+index+'" class="ui-slider-range ui-corner-all ui-widget-header" style="left: 7.5%; width: 50%;"></span>'
    tuningSlidersFragment.append(tuningSlidersHTMLstring);
    jQuery(document).ready(function ($) {
      $( sliderIdentifier ).slider({
          range: true,
          min: 0,
          max: 255,
          values: [globalMinMaxPixelValues[index][0], globalMinMaxPixelValues[index][1]],
          slide: function( event, ui ) {
            //console.log(event);
            //console.log(ui.values) //Faire le setPixelValue() ici
            $( valueVisualizerIdentifier ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] )
            //globalMinMaxPixelValues[index][0] = ui.values[ 0 ];
            //globalMinMaxPixelValues[index][1] = ui.values[ 1 ];
            //console.log(globalMinMaxPixelValues);
          },
          change: function( event, ui ) {
            //console.log(event);
            //console.log(ui.values) //Faire le setPixelValue() ici
            $( valueVisualizerIdentifier ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] )
            globalMinMaxPixelValues[index][0] = ui.values[ 0 ];
            globalMinMaxPixelValues[index][1] = ui.values[ 1 ];
            //console.log(globalMinMaxPixelValues);
            processingPipelineIteration(image, context, globalMinMaxPixelValues)
          }
      });
      $( valueVisualizerIdentifier ).val($( sliderIdentifier ).slider("values", 0)+" - "+$( sliderIdentifier ).slider("values", 1))
    });
  });
}

// Construct the API projects URL
var projectsUrl = PARAMS.API_BASE_URL + 'm/projects/';

// Filter projects by Owner to only show 'your' projects
projectsUrl += '?owner=' + PARAMS.EXP_ID;

fetch(projectsUrl).then(rsp => rsp.json())
    .then(data => {
        let projectCount = data.meta.totalCount;
        let projects = data.data;
        console.log(projects);
        // Render html...
        let html = '<div>Total: ' + projectCount + ' projects</div>';

        html += '<ul>';
        html += projects.map(p => {
            return '<li>' + p.Name + ' (ID: ' + p['@id'] + ')</li>';
        }).join("");
        html += '</ul>';

        document.getElementById('projects').innerHTML = html;
    });
