
window.onload = function()
{
    //获取DOM，定义变量等
    var codeBtn = document.getElementById('codeButton'),
        canvas = document.getElementById('curves'),
        ctx = canvas.getContext('2d'),
        para = document.getElementById('para'),
        time = document.getElementById('time'),
        duration = document.getElementById('duration'),
        testBtn = document.getElementsByClassName('testButton'),
        box = document.getElementById('box'),
        seg = document.getElementById('segment'),
        code = document.getElementById('codePart'),
        timeVal = 1000,
        draggingBtn;

//--------------------------------------------------------------------------

    //构造画边框的函数
    function Graph( x, y, a, b) {
        this.x = x;
        this.y = y;      //开始的位置
        this.height = a;
        this.width = b;   //方框的宽高
    }
   //Graph函数的继承属性
    Graph.prototype = {

        plot : function() {
            ctx.save();//保存当前环境的状态
            ctx.fillStyle = 'rgba(225,225,225,0)';//背景色不要，透明
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#76818D';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x + 1.5, this.y - 1.5, this.width , this.height );//为了让3px的边框全部显示出来
            ctx.restore();//返回之前保存过的路径状态和属性
        }
    };

    var graph = new Graph( 0, 140, 250, 250);

    //--------------------------------------------------------------------------

    // 构造画拖块的函数
    function DragBtn(x, y, r) {
        this.x = x;
        this.y = y;
        this.radius = r;

    }
    //DragBtn函数的继承属性
    DragBtn.prototype = {

        plot : function() {

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
            ctx.strokeStyle='rgba(255,255,255,0.5)';
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    };

    var dragbtn = [
        new DragBtn( 40, 205, 10),
        new DragBtn( 210, 305, 10)
    ];

//--------------------------------------------------------------------------

    //获取相对于有position的父级的左边距
    function getOffSet(obj) {
        var nowleft = nowtop = 0;
        if (obj.offsetParent) {
            do {
                nowleft += obj.offsetLeft;
                nowtop += obj.offsetTop;
            }
            while (obj = obj.offsetParent);

            return {
                left: nowleft,
                top: nowtop
            };
        }
    }
    // 获取相对位置值（鼠标位置的值-目标事物的左边距）
    function getPos(event) {
        var x1 = event.pageX - getOffSet(event.target).left,
            y1 = event.pageY - getOffSet(event.target).top;
        return {
            x: x1,
            y: y1
        };
    }
//--------------------------------------------------------------------------

    function onPress(event) {

       event.preventDefault();//阻止默认事件
       event.stopPropagation();//阻止派发事件

       var x = getPos(event).x,
           y = getPos(event).y;

       //查看是否点击在滑块上
       for (var i=0; i < dragbtn.length; i++) {
           var dragnow = dragbtn[i],
               //这里滑块只是一个圆心点，以下计算整个拖快区域
               curLeft = dragnow.x-dragnow.radius,
               curRight =dragnow.x +dragnow.radius,
               curTop = dragnow.y-dragnow.radius,
               curBottom = dragnow.y+dragnow.radius;

           if (x >= curLeft && x <= curRight && y >= curTop && y <= curBottom) {
               draggingBtn = dragnow;
               document.addEventListener('mouseup', onRelease, false);
               document.addEventListener('mousemove', onMove, false);
               document.body.style.cursor = canvas.style.cursor = 'move';
           }
       }
    }

   function onMove(event) {

       var x = event.pageX - getOffSet(canvas).left,
           y = event.pageY - getOffSet(canvas).top;
       //这里有3px边框的问题，所以范围加3px
       if (x > graph.width+3) {x = graph.width+3;}
       if (x < 0) {x = 0;}
       if (y > canvas.height) {y = canvas.height;}
       if (y < 0) {y = 0;}

       draggingBtn.x = x;
       draggingBtn.y = y;

       update();

   }

   function onRelease(event) {

       canvas.style.cursor = 'pointer';
       document.body.style.cursor = 'default';
       document.removeEventListener('mousemove', onMove, false);
       document.removeEventListener('mouseup', onRelease, false);

   }

   canvas.addEventListener('mousedown', onPress, false);
//--------------------------------------------------------------------------
    function update() {
        // 每次画布内有变化都要将上一次绘画清除掉，不然会出现轨迹
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // 画边框框
        graph.plot();

        var d1 = dragbtn[0],
            d2 = dragbtn[1];


        // 根据起始位置和两个拖块的位置画贝塞尔曲线
        ctx.save();
        ctx.strokeStyle = '#76818D';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(graph.x, graph.y + graph.height);
        ctx.bezierCurveTo(d1.x, d1.y, d2.x, d2.y, graph.width+1.5, graph.y);
        ctx.stroke();
        ctx.restore();

        // 画拖块的线
        ctx.strokeStyle = 'rgba(118,129,141,0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(graph.x, graph.y + graph.height);
        ctx.lineTo(d1.x, d1.y);
        ctx.moveTo(graph.width+3, graph.y);//边框的3px
        ctx.lineTo(d2.x, d2.y);
        ctx.stroke();

        // 最后画拖块，否则拖块的线会在其上面
        d1.plot(ctx.fillStyle = '#FF0088');
        d2.plot(ctx.fillStyle = '#00AABB');


        // 贝塞尔参数计算
        var x1 = (d1.x / graph.width).toFixed(3),
            y1 = ( (graph.height + graph.y - d1.y) / graph.height ).toFixed(3),
            x2 = (d2.x / canvas.width).toFixed(3),
            y2 = ( (graph.height + graph.y - d2.y) / graph.height ).toFixed(3),
            points = '(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ')',
            pointsp='(<span id="p1x">'+x1+'</span>, <span id="p1y">' + y1 + '</span>, <span id="p2x">' + x2 + '</span>, <span id="p2y">' + y2 + '</span>)',
            bezier = 'cubic-bezier' + points;

        timeVal = time.value*1000;

        //Preview里面的参数
        para.innerHTML = pointsp;

        duration.innerHTML = timeVal+ 'ms';
        box.style.transition = 'all ' + timeVal + 'ms cubic-bezier' + points;
        // 输出代码块
        code.innerHTML =
            '<p>#box{' +
            '-webkit-transition: all ' + timeVal + 'ms ' + bezier  +
            '; <br>&#12288;&#12288;&#12288;&#12288;&nbsp;-moz-transition: all ' + timeVal + 'ms ' + bezier +
            '; <br>&#12288;&#12288;&#12288;&#12288;&#12288; -o-transition: all ' + timeVal + 'ms ' + bezier +
            '; <br>&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;transition: all ' + timeVal + 'ms ' + bezier +
            ';  ' + '<br>} </p>';
    }
//--------------------------------------------------------------------------

    function hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    function addClass(ele,cls) {
        if (!hasClass(ele,cls)) ele.className += " "+cls;
    }

    function removeClass(ele,cls) {
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }
    function toggleClass(ele,cls){
        if(hasClass(ele,cls)){
            removeClass(ele, cls);
        }else{
            addClass(ele, cls);
        }
    }
    //点击测试按钮时执行
    for(var i=0;i<testBtn.length;i++) {
        testBtn[i].onclick = function () {
            toggleClass(box,this.value);
            toggleClass(this,'box-shadow');
        }
    }
    //点击生成代码按钮时执行
    codeBtn.onclick = function(){
        toggleClass(codeBtn,'box-shadow');
        toggleClass(seg,'display');
    };
    //拖动时间条时执行
    time.oninput = function(){
        update();
    };
    //初始化
    update();
};