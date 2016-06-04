var Link = require('../services/link');

exports.addnew = function(data) {
	var newlink = {
		title: data.title,
		link: data.link,
		category: data.category
	};

	return Link.add(newlink);
};

exports.delLink = function(id){
	return Link.remove(id);
}

exports.fetchLinks = function(limit, offset){
	return Link.fetch(limit, offset);
};

exports.fetchAll = function(){
	return Link.fetchAll();
};
