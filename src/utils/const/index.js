export default {
 
    install(Vue,options){
 
        Vue.prototype.dashboard = {
            title:'仪表盘',
            name:'DashBoard',
            path: '/dashboard'
            
        };
        
    }
 
 }