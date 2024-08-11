$(function () {
  function fetchPlace () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        $('.places').empty();

        data.forEach(place => {
          const articleHTML = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description || ''}
              </div>
            </article>
          `;

          $('.places').append(articleHTML);
        });
      }
    });
  }

  fetchPlace();

  const myDict = {};
  const url1 = 'http://0.0.0.0:5001/api/v1/status/';

  $.get(url1, function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $('.filters h4').css({
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
    'overflow-x': 'clip',
    'max-width': '285px'
  });

  $('input[type="checkbox"]').on('change', function () {
    const amenName = $(this).data('name');
    const amenId = $(this).data('id');

    if (this.checked) {
      myDict[amenId] = amenName;
    } else {
      delete myDict[amenId];
    }

    const userFilter = Object.values(myDict);
    const toDisplay = userFilter.join(', ');

    $('.amenities h4').text(toDisplay);
  });

  $('button').click(function () {
    const selectedAmenities = {};
    selectedAmenities.amenities = [];

    $('input[type="checkbox"]:checked').each(function () {
      selectedAmenities.amenities.push($(this).data('id'));
    });

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(selectedAmenities),
      success: function (data) {
      // Clear existing places
        $('.places').empty();

        // Add filtered places
        data.forEach(function (place) {
          $('.places').append(`
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>
          `);
        });
      }
    });
  });
});
