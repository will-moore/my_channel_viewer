//https://css-tricks.com/manipulating-pixels-using-canvas/

function drawImage(image, canvas){
  canvas.width = image.width;
  canvas.height = image.height;
  var context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
}

function processingPipelineIteration(image, context, globalMinMaxPixelValues){
  var imageData = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
  //console.log(imageData)
  var globalValues = fillingGlobalValuesTable(imageData, context, globalMinMaxPixelValues)
  var channelsSumImageData = createChannelsSum(context, imageData, globalValues);
  drawChannelsAndSumInCanvas(image, context, globalValues, channelsSumImageData)
  return globalValues;
}

function drawChannelsAndSumInCanvas(image, context, globalValues, channelsSumImageData){
  var redImageData = globalValues[0][0];
  context.putImageData(redImageData, image.width, 0, 0, 0, image.width, image.height);
  var greenImageData = globalValues[1][0];
  context.putImageData(greenImageData, 2*image.width, 0, 0, 0, image.width, image.height);
  var blueImageData = globalValues[2][0];
  context.putImageData(blueImageData, 0, image.height, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
  var alphaImageData = globalValues[3][0];
  context.putImageData(alphaImageData, image.width, image.height, 0, 0, image.width, image.height);

  context.putImageData(channelsSumImageData, 2*image.width, image.height, 0, 0, image.naturalWidth, image.naturalWidth);
}

function createChannelsSum(context, imageData, globalValues){
  var redImagePixelValues = globalValues[0][1];
  var greenImagePixelValues = globalValues[1][1];
  var blueImagePixelValues = globalValues[2][1];
  var alphaImagePixelValues = globalValues[3][1];

  var channelsSumImageData = context.createImageData(imageData);
  for(var i = 0; i < imageData.data.length; i+=4){
    channelsSumImageData.data[i] = redImagePixelValues[i];
    channelsSumImageData.data[i+1] = greenImagePixelValues[i];
    channelsSumImageData.data[i+2] = blueImagePixelValues[i];
    channelsSumImageData.data[i+3] = alphaImagePixelValues[i];
  }
  console.log(channelsSumImageData);
  return channelsSumImageData;
}

function fillingGlobalValuesTable(imageData, context, globalMinMaxPixelValues){
  var globalValues = [];

  var minRedPixelValue = globalMinMaxPixelValues[0][0];
  var maxRedPixelValue = globalMinMaxPixelValues[0][1];
  var redImageGlobalChannelContent = getRedChannelData(context, imageData, minRedPixelValue, maxRedPixelValue);
  globalValues.push(redImageGlobalChannelContent)

  var minGreenPixelValue = globalMinMaxPixelValues[1][0];
  var maxGreenPixelValue = globalMinMaxPixelValues[1][1];
  var greenImageGlobalChannelContent  = getGreenChannelData(context, imageData, minGreenPixelValue, maxGreenPixelValue);
  globalValues.push(greenImageGlobalChannelContent)

  var minBluePixelValue = globalMinMaxPixelValues[2][0];
  var maxBluePixelValue = globalMinMaxPixelValues[2][1];
  var blueImageGlobalChannelContent  = getBlueChannelData(context, imageData, minBluePixelValue, maxBluePixelValue);
  globalValues.push(blueImageGlobalChannelContent)

  var minAlphaPixelValue = globalMinMaxPixelValues[3][0];
  var maxAlphaPixelValue = globalMinMaxPixelValues[3][1];
  var alphaImageGlobalChannelContent  = getAlphaChannelData(context, imageData, minAlphaPixelValue, maxAlphaPixelValue);
  globalValues.push(alphaImageGlobalChannelContent)

  return globalValues;
}

//https://www.w3schools.com/tags/canvas_getimagedata.asp
function getRedChannelData(context, imageData, minPixelValue, maxPixelValue){
  globalChannelContent = [];
  channelPixelValues = [];
  var redImageData = context.createImageData(imageData);
  for(var i = 0; i < imageData.data.length; i+=4){
    var tunedPixelValue = setTunedPixelValue(minPixelValue, maxPixelValue, imageData.data[i])
    redImageData.data[i] = tunedPixelValue;
    redImageData.data[i+1] = 0;
    redImageData.data[i+2] = 0;
    redImageData.data[i+3] = 255; //La mettre à 255 sinon l'image est transparente donc invisible
    channelPixelValues.push(redImageData.data[i]);
  }
  //console.log(redImageData);
  globalChannelContent.push(redImageData);
  globalChannelContent.push(channelPixelValues);
  return globalChannelContent;
}

function getGreenChannelData(context, imageData, minPixelValue, maxPixelValue){
  globalChannelContent = [];
  channelPixelValues = []
  var greenImageData = context.createImageData(imageData);
  for(var i = 0; i < imageData.data.length; i+=4){
    var tunedPixelValue = setTunedPixelValue(minPixelValue, maxPixelValue, imageData.data[i+1])
    greenImageData.data[i] = 0;
    greenImageData.data[i+1] = tunedPixelValue;
    greenImageData.data[i+2] = 0;
    greenImageData.data[i+3] = 255;
    channelPixelValues.push(greenImageData.data[i+1]);
  }
  //console.log(greenImageData);
  globalChannelContent.push(greenImageData);
  globalChannelContent.push(channelPixelValues);
  return globalChannelContent;
}

function getBlueChannelData(context, imageData, minPixelValue, maxPixelValue){
  globalChannelContent = [];
  channelPixelValues = []
  var blueImageData = context.createImageData(imageData);
  for(var i = 0; i < imageData.data.length; i+=4){
    var tunedPixelValue = setTunedPixelValue(minPixelValue, maxPixelValue, imageData.data[i+2]);
    blueImageData.data[i] = 0;
    blueImageData.data[i+1] = 0;
    blueImageData.data[i+2] = tunedPixelValue;
    blueImageData.data[i+3] = 255;
    channelPixelValues.push(blueImageData.data[i+2]);
  }
  //console.log(blueImageData);
  globalChannelContent.push(blueImageData);
  globalChannelContent.push(channelPixelValues);
  return globalChannelContent;
}

function getAlphaChannelData(context, imageData, minPixelValue, maxPixelValue){
  globalChannelContent = [];
  channelPixelValues = []
  var alphaImageData = context.createImageData(imageData);
  for(var i = 0; i < imageData.data.length; i+=4){
    var tunedPixelValue = setTunedPixelValue(minPixelValue, maxPixelValue, imageData.data[i+3]);
    alphaImageData.data[i] = 0;
    alphaImageData.data[i+1] = 0;
    alphaImageData.data[i+2] = 0;
    alphaImageData.data[i+3] = tunedPixelValue;
    channelPixelValues.push(alphaImageData.data[i+3]);
  }
  //console.log(alphaImageData);
  globalChannelContent.push(alphaImageData);
  globalChannelContent.push(channelPixelValues);
  return globalChannelContent;
}

function setTunedPixelValue(minPixelValue, maxPixelValue, inputPixelValue){
  var definitePixelValue;
  if(inputPixelValue < minPixelValue){
    definitePixelValue = 0;
  }
  if(inputPixelValue > maxPixelValue){
    definitePixelValue = 255;
  }
  else{
    var coefDir = (maxPixelValue-minPixelValue)/(255-0);
    definitePixelValue = Math.round(coefDir*inputPixelValue);
  }
  return definitePixelValue;
}

function getMinMaxPixelValues(globalValues){
  var globalMinMaxPixelValues = [];
  $.each(globalValues, function(index, value) {
    var channelMinMaxPixelValues = [];
    var channelFeatures = value;
    var channelPixelValues = value[1]
    var minPixelValue = Math.min.apply(null, channelPixelValues);
    channelMinMaxPixelValues.push(minPixelValue);
    var maxPixelValue = Math.max.apply(null, channelPixelValues);
    channelMinMaxPixelValues.push(maxPixelValue);
    globalMinMaxPixelValues.push(channelMinMaxPixelValues);
  });
  return globalMinMaxPixelValues;
}

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

function initialize(){

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

  var startingGlobalMinMaxPixelValues = [[0, 255], [0,255], [0,255], [0, 255]]
  var canvas = document.getElementById("Canvas");
  var context = canvas.getContext("2d");
  var paintButton = document.getElementById("PaintButton");
  //var image = document.getElementById("SourceImage");
  var image = new Image();
  var tuningSlidersFragment = $(document.createDocumentFragment());
  //image.src = './clown.jpg' //Pour des raisons obscures (sécurité) ne charge pas d'images depuis le disque dur
  //image.src = 'file:///home/mmongy-bicel/Bureau/mock_up_channels/clown.jpg'
  image.src = "https://i.chzbgr.com/maxW500/1691290368/h07F7F378/"
  image.crossOrigin = "anonymous"; //https://developpaper.com/explain-how-to-solve-the-cross-domain-problem-of-canvas-image-getimagedata-todataurl/
  //console.log(image);

  image.onload = function(){
    canvas.width = 3*image.width;
    canvas.height = 2*image.height;
    //console.log(image.src);
    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    var startingGlobalValues = processingPipelineIteration(image, context, startingGlobalMinMaxPixelValues);
    //console.log(startingGlobalValues);
    jQuery(document).ready(function ($) {
      createTuningSliders(image, context, startingGlobalValues, tuningSlidersFragment);
      //console.log(tuningSlidersFragment);
      $('#TuningSliders').append(tuningSlidersFragment);
    });
  };
}


$(document).ready(function() {
  //window.addEventListener("load", initialize);
  initialize();

});


// voir ici pour les setPixel: http://jsfiddle.net/thirtydot/ms3Jd/5/
