var comb = comb || {};

comb.add = function(conns,value,dont_keep_old){
	var delta = 0;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		var weight = tup[1];
		delta += o_point.value*weight;
	}
	if(dont_keep_old){
		return delta;
	}else{
		//console.log("New value="+(value+delta));
		return value + delta;
	}
};

comb.onecomp = function(conns,value,comb_func){
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	comb_func(f_point,f_weight,s_point,s_weight);
};

comb.no_input = function(conns,value){
	return value;
};

comb.mult = function(conns,value){
	var delta = 1;
	for(var i = 0; i < conns.length;i += 1){
		var tup = conns[i];
		var o_point = tup[0];
		var weight = tup[1];
		delta *= o_point.value*weight;
	}
	return delta;
};

comb.sub =function(conns,value){
	var f_point=conns[0][0];
	var f_weight=conns[0][1];
	var s_point=conns[1][0];
	var s_weight=conns[1][1];
	return ((f_point.value*f_weight)-(s_point.value*s_weight));
};	

define(comb);