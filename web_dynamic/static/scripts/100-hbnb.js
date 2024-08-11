$(function () {
  function renderPlaces (places) {
    $('.places').empty();
    places.forEach(place => {
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

  function fetchPlace (filters = {}) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (data) {
        renderPlaces(data);
      }
    });
  }

  // Initial fetch to load all places
  fetchPlace();

  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  // Check API status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
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

  // Handle amenity checkbox changes
  $('input[type="checkbox"].amenity').on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if (this.checked) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    const displayAmenities = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(displayAmenities);
  });

  // Handle state checkbox changes
  $('input[type="checkbox"].state').on('change', function () {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');

    if (this.checked) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }

    updateLocations();
  });

  // Handle city checkbox changes
  $('input[type="checkbox"].city').on('change', function () {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');

    if (this.checked) {
      selectedCities[cityId] = cityName;
    } else {
      delete selectedCities[cityId];
    }

    updateLocations();
  });

  function updateLocations () {
    const allSelected = { ...selectedStates, ...selectedCities };
    const displayLocations = Object.values(allSelected).join(', ');
    $('.locations h4').text(displayLocations);
  }

  // Handle search button click
  $('button').click(function () {
    const filters = {
      amenities: Object.keys(selectedAmenities),
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities)
    };
    fetchPlace(filters);
  });
});
