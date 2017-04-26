/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-11-23 16:19:18
 * @version $Id$
 */
/*饼图组件对象*/
var H5ComponentPie = function( name,cfg ){
	var component = new H5ComponentBase( name,cfg );
	
	//加入画布-背景层
	var w = cfg.width;
	var h = cfg.height;

	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',1);
	component.append(cns);

	var r = w/2;
	//绘制一个底图层
	ctx.beginPath();
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.lineWidth = 1;
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();

	//绘制一个数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',2);
	component.append(cns);

	var colors = ['pink','purple','blue','gray','orange'];  //备用颜色
	var sAngel = 1.5*Math.PI;  //起始角度设为12点钟方向
	var eAngel = 0;
	var aAngel = 2*Math.PI; //整个圆的角度

	var step = cfg.data.length;
	for(var i=0;i<step;i++){
		var item = cfg.data[i];
		var color = item[2] || ( item[2]=colors.pop() );
		eAngel = sAngel + aAngel * item[1];
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngel,eAngel);
		ctx.fill();
		ctx.stroke();
		sAngel=eAngel;

		//输出项目文本
		var text = $('<div class="text">');
		text.text(item[0]);
		var per = $('<div class="per">');
		per.text(item[1]*100 +'%');

		text.append(per);
		var x = r + Math.sin(0.5*Math.PI-sAngel)*r;
		var y = r + Math.cos(0.5*Math.PI-sAngel)*r;
		if(x>w/2){
			text.css('left',x/2+5);
		}else{
			text.css('right',(w-x)/2+5);
		}
		if(y>h/2){
			text.css('top',y/2+5);
		}else{
			text.css('bottom',(h-y)/2+5);
		}
		if(item[2]){
			text.css('color',item[2]);
		}
		text.css('opacity',0);
		component.append(text);

	}

	//加入蒙版层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',3);
	component.append(cns);
	
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.lineWidth = 1;
	

	//饼图生长动画
	var draw = function( per ){
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		ctx.moveTo(r,r);
		if(per>=1){
			component.find('.text').css('opacity',1);
		}
		if(per<=0){
			component.find('.text').css('opacity',0);
			ctx.arc(r,r,r,0,2*Math.PI);
		}else{
			ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);	
		}

		ctx.fill();
		ctx.stroke();

	}// 把绘线部分做成一个函数
	draw(0);

	component.on('onLoad',function(){
		//饼图生长动画
		var s = 0;
		for( i=0;i<100;i++ ){
			setTimeout(function(){
				s+=0.01;
				draw(s);
			},i*10+500)   //0~1000ms   10,20,30……
		}
	});

	component.on('onLeave',function(){
		//饼图退场动画
		var s = 1;
		for( i=0;i<100;i++ ){
			setTimeout(function(){
				s-=0.01;
				draw(s);
			},i*10)
		}
	});

	return component;
}
