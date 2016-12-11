$(function() {

    $("input").focus(function(){
        if($(this).val() ==this.defaultValue){
            $(this).val("");
        }
    }).blur(function(){
        if ($(this).val() == '') {
            $(this).val(this.defaultValue);
        }
    });


});






