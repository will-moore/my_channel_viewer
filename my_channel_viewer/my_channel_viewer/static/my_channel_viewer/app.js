
// When the page loads, listen for changes to the selected_images_dropdown...
$(function () {
  $("#selected_images_dropdown").on('change', function (event) {
    let imageId = event.target.value;
    console.log('selected', imageId);
    loadImage(imageId);
  });

  // Store the imgData JSON
  let imageData;

  function loadImage(imageId) {
    // load imgData
    let url = window.PARAMS.WEBGATEWAY_BASE_URL + 'imgData/' + imageId + '/';
    $.getJSON(url, function (data) {
      imageData = data;
      let html = data.channels.map(channel => {
        let chMin = channel.window.min;
        let chMax = channel.window.max;
        let chStart = channel.window.start;
        let chEnd = channel.window.end;

        return `
          <div>
            <div class="rangeslider">
              <input class="min" name="channel_min" type="range" min="${chMin}" max="${chMax}" value="${chStart}" />
              <input class="max" name="channel_max" type="range" min="${chMin}" max="${chMax}" value="${chEnd}" />
              <span class="range_min light left">${chStart}</span>
              <span class="range_max light right">${chEnd}</span>
            </div>
          </div>
          `
      });
      $('#channels').html(html.join(""));
    });
  }

  // When a slider changes (stop sliding), re-render images
  $("#channels").on("change", ".rangeslider input", function () {
    // for each slider, get 
    let minValues = [];
    let maxValues = [];
    $("input[name='channel_min']").each(function () { minValues.push(this.value); });
    $("input[name='channel_max']").each(function () { maxValues.push(this.value); });

    let query = imageData.channels.map((channel,index) => {
      let act = channel.active ? '' : '-';
      return `${act}${index + 1}|${minValues[index]}:${maxValues[index]}$${channel.color}`
    });
    query = '?c=' + query.join(',');

    // Apply the same settings to all images
    $(".displayed_image").each(function($img) {
      let $image = $(this);
      let src = $image.data('src') + query;
      $image.attr('src', src);
    })
  });

  // Load first image directly...
  let firstImageId = $("#selected_images_dropdown option:nth-child(2)").attr('value');
  loadImage(firstImageId);
})
