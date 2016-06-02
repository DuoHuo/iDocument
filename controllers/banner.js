var Banner = require('../services/banner');

exports.addnew = function(data) {
	var banner = {
		bannerName: data.bannerName,
		bannerIndex: data.bannerIndex,
		bannerPic: data.bannerPic,
		bannerLink: data.bannerLink
	};

	return Banner.add(banner);
};

exports.delBanner = function(id){
	return Banner.remove(id);
}

exports.fetchBanners = function(){
	return Banner.fetch();
};