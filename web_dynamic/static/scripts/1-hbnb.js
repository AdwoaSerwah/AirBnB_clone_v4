$(function () {
  const myDict = {};

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
});
