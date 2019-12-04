module.exports = {
	devServer: {
	  disableHostCheck: true
	},
	css: {
		loaderOptions: {
		  scss: {
			prependData: `
			  @import "~@/style/_variables.scss";
			  @import "~@/style/_mixin.scss";
			`
		  }
		}
	}
}