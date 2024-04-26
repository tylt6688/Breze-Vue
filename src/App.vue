<template>
	<div :id=id>
		<router-view></router-view>
	</div>
</template>


<script>
	export default {
		name: "App",
		data() {
			return {
				id: "app"
			}
		},
		// TODO 监听Tab栏变化
		watch: {
			$route(to, from) {
				console.log("|--from -->", from.path, "|--to -->", to.path, "|--title -->", to.meta.title, "|--name -->",
					to.name)
				if (to.path != '/login') {
					let obj = {
						name: to.name,
						title: to.meta.title
					}
					this.$store.commit("addTab", obj)
				}
			}
		}
	}
</script>


<style>
	#app {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑";
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* 使网站整体变灰色，用于特殊纪念日使用 */
	#app-gloomy {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑";
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);

	}

	html,
	body,
	#app,
	#app-gloomy {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}

	a {
		text-decoration: none;
	}
</style>