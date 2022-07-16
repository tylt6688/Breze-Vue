<template>
	<div id="app">
		<router-view v-if="isRouterAlive"></router-view>
	</div>
</template>


<script>
	export default {
		name: "App",
		provide() {
			return {
				reload: this.reload
			}
		},
		//TODO 监听tab栏变化
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
			return {
				isRouterAlive: true
			}
		},
		methods: {
			// 方便后期注射刷新使用，暂时没用
			reload() {
				this.isRouterAlive = false
				this.$nextTick(() => this.isRouterAlive = true)
			}
		},
	}
</script>


<style>
	#app {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
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
</style>