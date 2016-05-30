
exports.isEmptyObject = function(obj){
	for(key in obj) return false;
	return true;
};

exports.isArray = function(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
};
