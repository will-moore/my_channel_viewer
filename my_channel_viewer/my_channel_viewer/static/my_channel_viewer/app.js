
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
          <input type="color" value="#${ channel.color }">
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

      // Add an <img> for each channel with an id we can use
      // later for updating the src of each with the rendering settings
      let imagesHtml = data.channels.map((channel, index) => {
        return `<img id="channel_image_${index}" src="#" />`;
      });
      $('#split_channel_images').html(imagesHtml.join(""));

      // Also render the split channels
      applyChosenSettings();
    });
  }

  // When any channel input changes (slider stops or color picked etc),
  // apply all the input settings to the images
  $("#channels").on("change", "input", function () {
    applyChosenSettings();
  });


  function applyChosenSettings() {
    // for the min, max and color inputs, put the value from each in a list
    // Use the values to set rendering settings on the 'display images' and
    // the 'split channel images'
    let minValues = [];
    let maxValues = [];
    let colors = [];
    $("input[name='channel_min']").each(function () { minValues.push(this.value); });
    $("input[name='channel_max']").each(function () { maxValues.push(this.value); });
    // color value is '#ff0000', we want to remove the '#'
    $("input[type='color']").each(function () { colors.push(this.value.replace("#", '')); });

    render_displayed_images(minValues, maxValues, colors);
    render_split_channels(minValues, maxValues, colors);
  };


  function render_displayed_images(minValues, maxValues, colors) {
    // Use the imageData, with the min/max values to apply rendering settings
    // for ALL channels to each of the displayed images
    let query = imageData.channels.map((channel,index) => {
      let active = channel.active ? '' : '-';
      let color = colors[index];
      return `${active}${index + 1}|${minValues[index]}:${maxValues[index]}$${color}`
    });
    query = '?c=' + query.join(',');

    // Apply the same settings to all images
    $(".displayed_image").each(function($img) {
      let $image = $(this);
      let src = $image.data('src') + query;
      $image.attr('src', src);
    })
  };

  function render_split_channels(minValues, maxValues, colors) {
    // Use the imageData, with the min/max values to show each channel of
    // the selected image

    // for each channel, we update the src of the channel image
    imageData.channels.forEach((channel, index) => {

      let chStart = minValues[index];
      let chEnd = maxValues[index];
      let color = colors[index];
      let active = channel.active ? '' : '-';
      let renderQuery = `${active}${index + 1}|${chStart}:${chEnd}$${color}`
      let imgSrc = window.PARAMS.WEBGATEWAY_BASE_URL + 'render_image/' + imageData.id + '/';
      imgSrc = imgSrc + '?c=' + renderQuery;

      let imgId = `#channel_image_${index}`;
      $(imgId).attr('src', imgSrc);
    });
  };

  // Load first image directly...
  let firstImageId = $("#selected_images_dropdown option:nth-child(2)").attr('value');
  loadImage(firstImageId);
})
