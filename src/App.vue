<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>


<script>
	export default {
		name: "App",

		// TODO 监听tab栏变化
		watch: {
			$route(to, from) {
				console.log("from", from.path, "to", to.path)
				if (to.path != '/login') {
					let obj = {
						name: to.name,
						title: to.meta.title
					}
					this.$store.commit("addTab", obj)
				}
			}
		},
		data() {
			return {}
		},
		methods: {

		},
	}
</script>


<style>
	#app {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑";
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* 使网站整体变灰色，用于特殊纪念日使用 Start */
		/* -webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1); */
		/* 使网站整体变灰色，用于特殊纪念日使用 End */

	}

	html,
	body,
	#app {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
	}


	.gray {}
</style>