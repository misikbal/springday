$('#flagstrap3').flagStrap({
    inputName: 'country',
    buttonSize: "btn-lg",
    buttonType: "btn-default",
    labelMargin: "20px",
    scrollableHeight: "350px",
    onSelect: function(value, element) {
        console.log(value)
    },
    placeholder: {
        value: "",
        text: "Please select a country"
    }
});
$(".flagstrap").find("select").change(function(){ $("i[name=selecticon]").removeClass().addClass("flag-icon flag-icon-"+$(this).val().toLowerCase())})
$(".flagstrap").find("select").change(function(){ $('input[name=value]').val($(this).val().toLowerCase())})
$(".flagstrap").find("select").change(function(){ $("input[name=imageUrl]").val("flag-icon flag-icon-"+$(this).val().toLowerCase())})
