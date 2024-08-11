$(function() {
    let my_list = {};

    $('input[type="checkbox"]').on('change', function() {
        const amen_name = $(this).data('name');
        const amen_id = $(this).data('id');

        if (this.checked) {
            my_list[amen_id] = amen_name;
        } else {
            delete my_list[amen_id];
        }

        $('h4').text(Object.values(my_list).join(', ') || 'Amenities');
    });
});
