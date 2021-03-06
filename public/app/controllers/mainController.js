angular.module('mainCtrl',[])

.controller('mainController',function($rootScope,$location,Auth){

    var vm = this;
    
    vm.loggedIn = Auth.isLoggedIn();
    
    $rootScope.$on('$routeChangeStart',function(){
    
     vm.loggedIn = Auth.isLoggedIn();
       
        Auth.getUser().then(function(data){
        
            vm.user = data.data;
        
        });
        
    });
    
    vm.doLogin = function(){
        
        console.log("called from login form");
    
        vm.processing = true;
        
        vm.error = '';
        
        Auth.login(vm.loginData.username,vm.loginData.password)
            .success(function(data){
        
            vm.processing = false;
            
            Auth.getUser().then(function(data){
            vm.user= data.data;
            
            });
            
            if(data.success){
            $location.path('/');
            }else{
              vm.error = data.message;  
                
            }
            
        
        });
        
        
    
    
    };
    
    vm.logout =  function(){
    Auth.logout();
    $location.path('/login')    
    
    };
    



});