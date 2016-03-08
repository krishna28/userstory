angular.module('userCtrl',['userService'])

.controller('UserController',function(User){

var vm = this;
    
User.all()
.success(function(){
vm.users = data;

})


})

