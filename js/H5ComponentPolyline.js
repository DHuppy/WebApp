/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-11-23 16:19:18
 * @version $Id$
 */
/*折线图组件对象*/
var H5ComponentPolyline = function( name,cfg ){
	var component = new H5ComponentBase( name,cfg );
	
	//加入画布-背景层
	var w = cfg.width;
	var h = cfg.height;
	// 加入一个画布（网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	var step = 10;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#AAAAAA";
	
	//水平网格线  10份
	window.ctx = ctx;
	for (var i = 0; i < step+1; i++) {
		var y = (h/step) * i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}

	//  垂直网格线，根据项目的个数去分
	step = cfg.data.length+1;
	var text_w = w/step >> 0;
	for (var i = 0; i < step+1; i++) {
		var x = (w/step) * i;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);


		if( cfg.data[i] ){
		var text = $('<div class="text">');
		text.text( cfg.data[i][0] );
		//实际显示的宽高都为设置的一半
		text.css('width',text_w/2).css('left',x/2+text_w/4);

		component.append(text);
		}
	}

	ctx.stroke();

	//加入画布-数据层  (分成两个层是因为一个要做生长动画，一个做背景。)
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);


	var draw = function( per ){
	//清空画布
	ctx.clearRect(0,0,w,h);
	//绘制折线数据
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#ff8878";

	var x = 0;
	var y = 0;
	var row_w = ( w/(cfg.data.length+1) );
	//画点
	for(i in cfg.data){
		var item = cfg.data[i];
		x = row_w * i + row_w;  //row_w*(i+1) 的写法不行 
		y = h - h*item[1]*per;
		ctx.moveTo(x,y);
		ctx.arc(x,y,5,0,2*Math.PI);
	}

	//连线(把画笔停在第一个数据点的位置)
	ctx.moveTo( row_w, h - (h*cfg.data[0][1]*per) );
	for( i in cfg.data ){
		var item = cfg.data[i];
		x = row_w * i + row_w;  //row_w*(i+1) 的写法不行 
		y = h - h*item[1]*per;
		ctx.lineTo(x,y);
	}
	ctx.stroke();

	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(255,136,120,0)';
	//绘制阴影
	ctx.lineTo(x,h);
	ctx.lineTo(row_w,h);
	ctx.fillStyle ='rgba(255,136,120,0.2)';  //先设好style再fill
	ctx.fill();


	//写数据
	for(i in cfg.data){
		var item = cfg.data[i];
		x = row_w * i + row_w;  //row_w*(i+1) 的写法不行 
		y = h - h*item[1]*per;
		ctx.moveTo(x,y);
		ctx.fillStyle = item[2] ? item[2] : '#595959' ;
		ctx.fillText( ( (item[1]*100)>>0 )+'%', x-10, y-20 ); //变成百分比，并把乘于100后得到的小数位去掉
	}

	ctx.stroke();
	}// 把绘线部分做成一个函数

	component.on('onLoad',function(){
		//折线图生长动画
		var s = 0;
		for( i=0;i<100;i++ ){
			setTimeout(function(){
				s+=0.01;
				draw(s);
			},i*10+500)   //0~1000ms   10,20,30……
		}
	});

	component.on('onLeave',function(){
		//折线图退场动画
		var s = 0;
		for( i=0;i<100;i++ ){
			setTimeout(function(){
				s-=0.01;
				draw(s);
			},i*10)
		}
	});

	return component;
}
