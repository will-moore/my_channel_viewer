
function makeChannelImage(currentImageDataJSON, index){
  //baseImageRenderingURL, imageID, channelIndex, channelActiveOrNot, channelColor, channelMinimalValue, channelMaximalValue, channelLabel

  /*
  A rendering URL looks like that:
    http://idr.openmicroscopy.org/webgateway/render_image/9844369/0/0/?c=1%7C7:4095%2400FFFF,2%7C11:4095%2400FF00,3%7C12:2156%240000FF ("%7C" is "|", "%24" is "$")
    After "render_image": the tunings are:
    - "9844369": Image id
    - "0": Time
    - "0": Z-depth
    - "?c=": URL Channels marker
    - "1%7C7:4095%2400FFFF": Informations for a channel. In order: Channel index | Min_pixel_value : Max_pixel_value $ Color
    - The Channel Index is preceded with "-" if deactivated.

  See:
    https://docs.openmicroscopy.org/omero/5.0.0/developers/Web/WebGateway.html
    https://docs.openmicroscopy.org/omero/5.4.9/developers/Web/WebGateway.html
  for more options.

  */

  var imageID = currentImageDataJSON.id;
  var pixelMinRange = currentImageDataJSON.pixel_range[0];
  var pixelMaxRange = currentImageDataJSON.pixel_range[1];
  let channelIndex = index+1;
  let channelColor = currentImageDataJSON.channels[index].color;
  let channelLabel = currentImageDataJSON.channels[index].label;
  let channelMinimalValue = currentImageDataJSON.channels[index].window.min;
  let channelMaximalValue = currentImageDataJSON.channels[index].window.max;

  console.log('index', "#checkbox_" + index, $("#checkbox_" + index).length, currentImageDataJSON.channels[index].active);
  if ($("#checkbox_"+index).is(':checked')){
    currentImageDataJSON.channels[index].active = true;
  }
  else{
    currentImageDataJSON.channels[index].active = false;
  }

  //Check if channel active or not
  var channelActiveOrNotCharacter = "";
  console.log('active', currentImageDataJSON.channels[index].active == false)
  if (currentImageDataJSON.channels[index].active == false){
    channelActiveOrNotCharacter = "-";
  }

  //Assemble the URL
  var channelTuningsURLchunk = ""+channelActiveOrNotCharacter+channelIndex+"|"+channelMinimalValue+":"+channelMaximalValue+"$"+channelColor+""
  return channelTuningsURLchunk
}

function updateChannelColor(currentImageDataJSON, index){
  let channelLabel = currentImageDataJSON.channels[index].label
  var colorChooserIdentifier = "color_"+index;
  // color value is '#ff0000', we want to remove the '#'
  var lutChooserIdentifier = "lut_" + index;
  if(document.getElementById(lutChooserIdentifier).value != ""){
    var newColor = document.getElementById(lutChooserIdentifier).value.replace("#", '');
  }
  else{
    var newColor = document.getElementById(colorChooserIdentifier).value.replace("#", '');
  }
  currentImageDataJSON.channels[index].color = newColor
}

function updateColorChanger(currentImageDataJSON, index){
  var colorChangerIdentifier = "#color_"+currentImageDataJSON.channels[index].label
    $(colorChangerIdentifier).on("change", "input", function () { //Not working?
      //updateChannelAndResultImage(currentImageDataJSON, index)
      updateAllChannelsAndResultImage(currentImageDataJSON)
    });
}

function updateLUTChanger(currentImageDataJSON, index){
  // var lutChangerIdentifier = "#lut_"+currentImageDataJSON.channels[index].label
  //   $(lutChangerIdentifier).on("change", "select", function () { //Not working?
  //     //updateChannelAndResultImage(currentImageDataJSON, index)
  //     updateAllChannelsAndResultImage(currentImageDataJSON)
  //   });
}

function makeThumbnails(){
  jQuery(document).ready(function ($) {
    $( "#TuningItems" ).tabs()
  });
}

function updateZDepthTuningSlider(currentImageDataJSON){
  var sliderIdentifier = "#zdepth-slider_"+currentImageDataJSON.id;
  var valueVisualizerIdentifier = "#ZdepthValue_"+currentImageDataJSON.rdefs.defaultZ;
  jQuery(document).ready(function ($) {
    $( sliderIdentifier ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: (currentImageDataJSON.size.z)-1,
      value: currentImageDataJSON.rdefs.defaultZ,
      slide: function( event, ui ) {
        $( valueVisualizerIdentifier ).val( ui.value );
      },
      change: function( event, ui ) {
        //console.log(event);
        //console.log(ui.values) //Faire le setPixelValue() ici
        $( valueVisualizerIdentifier ).val( ui.value );
        currentImageDataJSON.rdefs.defaultZ = ui.value;
        updateAllChannelsAndResultImage(currentImageDataJSON)
      }
    });
    $( valueVisualizerIdentifier ).val( $( sliderIdentifier ).slider( "value" ) );
  });
}

function updateTTimeTuningSlider(currentImageDataJSON){
  var sliderIdentifier = "#ttime-slider_"+currentImageDataJSON.id;
  var valueVisualizerIdentifier = "#TtimeValue_"+currentImageDataJSON.rdefs.defaultT;
  // jQuery(document).ready(function ($) {
    $( sliderIdentifier ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: (currentImageDataJSON.size.t)-1,
      value: currentImageDataJSON.rdefs.defaultT,
      slide: function( event, ui ) {
        $( valueVisualizerIdentifier ).val( ui.value );
      },
      change: function( event, ui ) {
        //console.log(event);
        //console.log(ui.values) //Faire le setPixelValue() ici
        $( valueVisualizerIdentifier ).val( ui.value );
        currentImageDataJSON.rdefs.defaultT = ui.value;
        updateAllChannelsAndResultImage(currentImageDataJSON)
      }
    });
    $( valueVisualizerIdentifier ).val( $( sliderIdentifier ).slider( "value" ) );
  // });
}

function updateChannelTuningSlider(currentImageDataJSON, index){
  var sliderIdentifier = "#slider-range_"+index;
  var valueVisualizerIdentifier = "#minmaxPixelValues_"+index;
  //currentImageDataJSON.pixel_range[1] = document.getElementById("RealDynamicRange").value;
  jQuery(document).ready(function ($) {
    $( sliderIdentifier ).slider({
        orientation: "horizontal",
        range: true,
        min: currentImageDataJSON.pixel_range[0],
        max: currentImageDataJSON.pixel_range[1],
        values: [currentImageDataJSON.channels[index].window.min, currentImageDataJSON.channels[index].window.max],
        slide: function( event, ui ) {
          //console.log(event);
          //console.log(ui.values) //Faire le setPixelValue() ici
          $( valueVisualizerIdentifier ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] )
        },
        change: function( event, ui ) {
          //console.log(event);
          //console.log(ui.values) //Faire le setPixelValue() ici
          $( valueVisualizerIdentifier ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] )
          currentImageDataJSON.channels[index].window.min = ui.values[ 0 ];
          currentImageDataJSON.channels[index].window.max = ui.values[ 1 ];
          currentImageDataJSON.pixel_range[1] = document.getElementById("RealDynamicRange").value
          $( sliderIdentifier ).slider( "option", "max", currentImageDataJSON.pixel_range[1] );
          updateAllChannelsAndResultImage(currentImageDataJSON)
        }
    });
    //var max = $( sliderIdentifier ).slider( "option", "max" );

    $( valueVisualizerIdentifier ).val($( sliderIdentifier ).slider("values", 0)+" - "+$( sliderIdentifier ).slider("values", 1))
  });
}

function updateAllChangers(currentImageDataJSON, index){
  console.log('updateAllChangers', currentImageDataJSON, index)
    updateColorChanger(currentImageDataJSON, index);
    updateLUTChanger(currentImageDataJSON, index);
    updateChannelTuningSlider(currentImageDataJSON, index)
}

function generateTuningThumbnailHTMLlist(currentImageDataJSON){
  var tuningThumbnailsHTMLlist = `
    <ul id="ThumbnailsList">
      <li><a href="#tuner_result">Result image</a></li>

  `
  for(var index=0; index<currentImageDataJSON.channels.length; index++){
    var channelThumbnailListItem = `
      <li><a href="#tuner_+${currentImageDataJSON.channels[index].label}">${currentImageDataJSON.channels[index].label}</a></li>
    `
    tuningThumbnailsHTMLlist = tuningThumbnailsHTMLlist+channelThumbnailListItem;
  }
  tuningThumbnailsHTMLlist = tuningThumbnailsHTMLlist+"</ul>"
  return tuningThumbnailsHTMLlist;
}

function generateChannelTuningHTML(currentImageDataJSON, currentLUTsJSON, index){

  //Adding luts

  var lutItems = currentLUTsJSON.luts;
  //console.log(lutData)
  let lutsHtml = lutItems.map(lut => {
    let lut_name = lut.name.replace('.lut', '');
    return `<option value="${lut.name}">${lut_name}</option>`;
  }).join("");

  // We need to the channel checkboxes, and other html elements to get the image src
  // So we can't get this before we build the html
  var channelRenderingURL = "";

  var channelRenderingHTMLstring = `
    <div style="position:relative;" class="ChannelTuner" id="tuner_+${currentImageDataJSON.channels[index].label}">
      <img class="ChannelImage" id="channel_image_${index}" src="${channelRenderingURL}"/>
      <p>
        <label for="minmaxPixelValues_${index}">Channel ${currentImageDataJSON.channels[index].label}:</label>
        <input type="text" id="minmaxPixelValues_${index}" readonly style="border:0; color:#${currentImageDataJSON.channels[index].color}; font-weight:bold;">
      </p>
      <span id="slider-range_${index}" class="ui-slider-range" style="left: 0%; width: 40%;">
      </span>
      <p>
        <label for="checkbox_${index}">Enable/Disable Channel:
        <input name="active-or-not_${index}" type="checkbox" id="checkbox_${index}" checked>
      </p>
      <input name="color_${index}" class="ColorChanger" type="color" id="color_${index}" value="#${currentImageDataJSON.channels[index].color}">
      <select class="lut" name="lut_${index}" id="lut_${index}"><option value=''>No custom LUT</option>${lutsHtml}</select>
    </div>
    `
    return channelRenderingHTMLstring;
}

function generateAllChannelsTuningHTML(currentImageDataJSON, currentLUTsJSON){
  var allChannelsHTMLstring = "";
  for(var index=0; index<currentImageDataJSON.channels.length; index++){
    var channelHTMLstring = generateChannelTuningHTML(currentImageDataJSON, currentLUTsJSON, index);
    allChannelsHTMLstring = allChannelsHTMLstring + channelHTMLstring
  }
  return allChannelsHTMLstring;
}

function generateResultImageHTML(currentImageDataJSON){


  var resultImageURL = "" // updateResultImageURL(currentImageDataJSON);

  var resultRenderingHTMLstring = `
    <div style="position:relative;" class="ResultTuner" id="tuner_result">
      <img class="ResultImage" id="${currentImageDataJSON.id}" src="${resultImageURL}"/>
      <p>
        <label for="ZdepthValue_${currentImageDataJSON.rdefs.defaultZ}">Profondeur Z: </label>
        <input type="text" id="ZdepthValue_${currentImageDataJSON.rdefs.defaultZ}" readonly style="border:0; color:#000000; font-weight:bold;">
      </p>
      <span id="zdepth-slider_${currentImageDataJSON.id}" class="ui-slider-horizontal ui-corner-all ui-widget-header" style="left: 0%; width: 40%;">
      </span>
      <p>
        <label for="TtimeValue_${currentImageDataJSON.rdefs.defaultT}">Temps T: </label>
        <input type="text" id="TtimeValue_${currentImageDataJSON.rdefs.defaultT}" readonly style="border:0; color:#000000; font-weight:bold;">
      </p>
      <span id="ttime-slider_${currentImageDataJSON.id}" class="ui-slider-horizontal ui-corner-all ui-widget-header" style="left: 0%; width: 40%;">
      </span>
      <p>
        <label for"RealDynamicRange"> Select the real maximum dynamic range of your images: </label>
        <select name="RealDynamicRange" id="RealDynamicRange">
          <option value="255"> 8-bits (256 values) </option>
          <option value="4095"> 12-bits (4096 values) </option>
          <option value="65535"> 16-bits (65536 values) </option>
          <option value="16777215"> 24-bits (16777216 values) </option>
          <option value="4294967295"> 32-bits (4294967296 values) </option>
        </select>
      </p>
    </div>
  `
  return resultRenderingHTMLstring;
}

function generateChannelButtons(currentImageDataJSON){
  //console.log(currentImageDataJSON);

  //Il est impossible de passer facilement du JSON à une fonction contenue dans un onclick donc on extrait les variables.
  var numberOfChannels = currentImageDataJSON.channels.length;
  var tunerLabels = [];
  for(var index=0; index<numberOfChannels; index++){
    var channelLabel = currentImageDataJSON.channels[index].label;
    tunerLabels.push(channelLabel);
  }
  tunerLabels.push(currentImageDataJSON.id);
  console.log(tunerLabels);

  //Passer des fonctions via onclick est vraiment merdique.
  //voir: https://github.com/riot/riot/issues/1001

  var allChannelsButtonsHTMLstring = "";
  for(var index=0; index<currentImageDataJSON.channels.length; index++){
    var channelLabel = currentImageDataJSON.channels[index].label
    var channelButtonHTMLstring = `
      <button id="button_${currentImageDataJSON.channels[index].label}" onclick="">${currentImageDataJSON.channels[index].label}</button>
    `
    //hideShowTuningContent("${currentImageDataJSON.channels[index].label}")
    //hideShowTuningContent(\''+tunerLabels+'\', channelLabel)
    allChannelsButtonsHTMLstring = allChannelsButtonsHTMLstring + channelButtonHTMLstring;
  }

  var resultLabel = currentImageDataJSON.id;
  var resultButtonString = `
    <button id="button_result" onclick="">Result image</button>
  `
  //hideShowTuningContent("result")
  //hideShowTuningContent(\'' + tunerLabels + '\', resultLabel)
  allChannelsButtonsHTMLstring = allChannelsButtonsHTMLstring + resultButtonString;
  console.log(allChannelsButtonsHTMLstring);
  return allChannelsButtonsHTMLstring;
}


function hideShowTuningContent(tunerLabels, channelIDstring){
  //console.log(channelIDstring);
  //console.log(currentImageDataJSON);
  console.log(tunerLabels);
  console.log(channelIDstring);
  var filteredTunerLabels = tunerLabels.filter(function(value, index, arr){ //https://love2dev.com/blog/javascript-remove-from-array/
    return value != channelIDstring;
  });
  var toShowDiv = document.getElementById("tuner_"+channelIDstring);
  toShowDiv.style.display = "block";
  for(var itemIndex=0; itemIndex<filteredTunerLabels.length; itemIndex++){
    var toHideDiv = "tuner_"+filteredTunerLabels[itemIndex];
    toHideDiv.style.display = "none";
  }
}


function updateResultImageURL(currentImageDataJSON){
  //Assemble the result image URL
  var baseImageRenderingURL = window.PARAMS.WEBGATEWAY_BASE_URL + 'render_image/' + currentImageDataJSON.id + '/';
  let channelZDepth = currentImageDataJSON.rdefs.defaultZ;
  let channelTtime = currentImageDataJSON.rdefs.defaultT;

  resultImageURL = baseImageRenderingURL+channelZDepth+"/"+channelTtime+"/?c=";
  for(var index=0; index<currentImageDataJSON.channels.length; index++){
    var channelTuningsURLchunk = makeChannelImage(currentImageDataJSON, index)
    resultImageURL+=channelTuningsURLchunk+",";
  }
  resultImageURL = resultImageURL.substring(0, resultImageURL.length-1);
  //console.log("UPDATE_RESULT_IMAGE");
  return resultImageURL;

}

function updateChannelImageURL(currentImageDataJSON, index){
  var baseImageRenderingURL = window.PARAMS.WEBGATEWAY_BASE_URL + 'render_image/' + currentImageDataJSON.id + '/';
  let channelZDepth = currentImageDataJSON.rdefs.defaultZ;
  let channelTtime = currentImageDataJSON.rdefs.defaultT;

  var channelTuningsURLchunk = makeChannelImage(currentImageDataJSON, index)
  var channelRenderingURL = baseImageRenderingURL+channelZDepth+"/"+channelTtime+"/?c="+channelTuningsURLchunk;
  return channelRenderingURL;
}

function updateChannelImage(currentImageDataJSON, index){
  console.log('updateChannelImage...', index);
  updateChannelColor(currentImageDataJSON, index)
  var channelRenderingURL = updateChannelImageURL(currentImageDataJSON, index)
  var imageIdentifier = "#channel_image_"+index;
  var minmaxIdentifier = "#minmaxPixelValues_"+index;
  var lutChooserIdentifier = "lut_" + index
  $(imageIdentifier).attr('src', channelRenderingURL);
  console.log('$(imageIdentifier)', imageIdentifier, $(imageIdentifier).length);
  if(document.getElementById(lutChooserIdentifier).value == ""){
    $(minmaxIdentifier).attr('style', "border:0; color: #"+currentImageDataJSON.channels[index].color+"; font-weight:bold;")
  }
  if(document.getElementById(lutChooserIdentifier).value != ""){
    $(minmaxIdentifier).attr('style', "border:0; color: #000000; font-weight:bold;")
  }


}

function updateAllChannelsAndResultImage(currentImageDataJSON){
  for(var index=0; index<currentImageDataJSON.channels.length; index++){
    updateChannelImage(currentImageDataJSON, index)
  }
  var resultImageURL = updateResultImageURL(currentImageDataJSON)
  //Write the image in HTML
  $(".ResultImage").attr('src', resultImageURL);
}

//Synchronous, useful for tests

function getJSONcontent(wantedURL){ //https://stackoverflow.com/questions/4200641/how-to-return-a-value-from-a-function-that-calls-getjson; synchronous only
   var value= $.ajax({
      url: wantedURL,
      async: false
   }).responseText;
   return JSON.parse(value);
}

function loadImage(imageId) {
  var imageDataURL = window.PARAMS.WEBGATEWAY_BASE_URL + 'imgData/' + imageId + '/';
  var currentImageDataJSON = getJSONcontent(imageDataURL)
  //console.log(currentImageDataJSON);
  return currentImageDataJSON;
} //Fin de loadImage

function loadLUTs(){
  let lutsUrl = window.PARAMS.WEBGATEWAY_BASE_URL + 'luts/';
  var currentLUTsJSON = getJSONcontent(lutsUrl)
  //console.log(currentLUTsJSON);
  return currentLUTsJSON;
}



//------Start------

//https://stackoverflow.com/questions/56552131/include-jquery-from-js-file-if-it-is-not-present?noredirect=1&lq=1
// This will check if jQuery has loaded. If not, it will add to <head>
window.onload = function() {
  if (!window.jQuery) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://code.jquery.com/jquery-latest.min.js';
    head.appendChild(script);
  }
}

// Construct the API projects URL
var projectsUrl = PARAMS.API_BASE_URL + 'm/projects/';

// Filter projects by Owner to only show 'your' projects
projectsUrl += '?owner=' + PARAMS.EXP_ID;

// When the page loads, listen for changes to the selected_images_dropdown...
$(function () {
  // The currentImageDataJSON will be available anywhere inside this function...
  let currentImageDataJSON;

  $("#Selected_images_dropdown").on('change', function (event) {
    let imageId = event.target.value;
    console.log('selected', imageId);

    /* //Synchrone
    var currentImageDataJSON = loadImage(imageId);
    var currentLUTsJSON = loadLUTs();
    jQuery(document).ready(function ($) { //Important pour affichage correct au chargement
      var allChannelsButtonsHTMLstring = generateChannelButtons(currentImageDataJSON);
      var resultRenderingHTMLstring = generateResultImageHTML(currentImageDataJSON);
      var allChannelsHTMLstring = generateAllChannelsTuningHTML(currentImageDataJSON, currentLUTsJSON);
      $("#ChannelsShowButtons").html(allChannelsButtonsHTMLstring);
      $("#TuningItems").html(resultRenderingHTMLstring);
      $("#TuningItems").html(allChannelsHTMLstring);
      updateAllHTML(currentImageDataJSON)
      console.log(currentImageDataJSON)
    });
    */
    let imageDataURL = window.PARAMS.WEBGATEWAY_BASE_URL + 'imgData/' + imageId + '/';
    let lutsUrl = window.PARAMS.WEBGATEWAY_BASE_URL + 'luts/';
    $.getJSON(lutsUrl, function (currentLUTsJSON) {
      $.getJSON(imageDataURL, function (data) {
        currentImageDataJSON = data;

          var tuningThumbnailsHTMLlist = generateTuningThumbnailHTMLlist(currentImageDataJSON)
          var resultRenderingHTMLstring = generateResultImageHTML(currentImageDataJSON);
          var allChannelsHTMLstring = generateAllChannelsTuningHTML(currentImageDataJSON, currentLUTsJSON);
          var fullHTMLstring = tuningThumbnailsHTMLlist+resultRenderingHTMLstring+allChannelsHTMLstring;
          //$("#TuningItems").html(tuningThumbnailsHTMLlist);
          //$("#TuningItems").html(resultRenderingHTMLstring);
          //$("#TuningItems").html(allChannelsHTMLstring);
          $("#TuningItems").html(fullHTMLstring);
          console.log('setting ALL html...')
          makeThumbnails();
          updateZDepthTuningSlider(currentImageDataJSON);
          updateTTimeTuningSlider(currentImageDataJSON)
          for(var index=0; index<currentImageDataJSON.channels.length; index++){
            updateAllChangers(currentImageDataJSON, index)
            //updateChannelTuningSlider(currentImageDataJSON, index)
          }
        console.log('currentImageDataJSON', currentImageDataJSON);
        // Immediately show the initial state...
        updateAllChannelsAndResultImage(currentImageDataJSON)

      }); //Fin du getJSON LUT
    }); //Fin du getJSON imageData
  });


  // setup listeners on any <select class='lut'> choosers that we may create later
  // We bind ONE event listener to the #TuningItems element when the page loads.
  // This will capture any events coming from LUT choosers
  $("#TuningItems").on("change", "select.lut", function () {
    console.log('select LUT...', currentImageDataJSON);
    updateAllChannelsAndResultImage(currentImageDataJSON)
  });
});


/*
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
*/

//Penser à https://jqueryui.com/tabs/ à la place des boutons pour les canaux.
//Ajouter cases à cocher pour dire si channel visible ou pas.
