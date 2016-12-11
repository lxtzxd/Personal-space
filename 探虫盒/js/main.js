/**
 * Created by cmri on 2016/4/2.
 */
$(document).ready(function(e) {
    var index=0;
    if(index==0){
        $('.chart').easyPieChart({
            easing: 'easeOut',
            barColor:'#00CE9B',
            lineWidth:'5',
            size:'58',
            trackColor:'#E76A76',
            onStep: function(from, to, percent) {
                $(this).find('.percent').text(Math.round(percent));
            }
        });
    }
    index++;

});

