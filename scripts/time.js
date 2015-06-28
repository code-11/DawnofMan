var time = time || {};

time.Time=function(initial_value){
	this.value=initial_value;
}
time.Time.prototype.getTime=function(){
	return this.value;
}
time.Time.prototype.setTime=function(new_val){
	this.value=new_val;
}
time.Time.prototype.tick=function(){
	this.value+=1;
}
define(time);