var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    var arUsuario = angular.fromJson(localStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;

	$scope.modalidades = modalidade;

	console.log($scope.modalidades);

	$scope.muda = function(){
		setTimeout(function(){  $('select').formSelect() }, 200)
	}

    $scope.proxima = function (stModalidade) {
    	if($scope.servico){    	
      		//window.location = "empresa.listarAutorizadas.html?modalidade="+$scope.servico;
      		gestorCarregarDadosAutorizadas($scope.servico, 'MODALIDADE');
  	 	}
    };

    
    document.body.style.backgroundColor = "white";

})

//aplicção do filtro da área 
app.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
	   return function(collection, keyname) {
	      // we define our output and keys array;
	      var output = [], 
	          keys = [];
	      
	      // we utilize angular's foreach function
	      // this takes in our original collection and an iterator function
	      angular.forEach(collection, function(item) {
	          // we check to see whether our object exists
	          var key = item[keyname];
	          // if it's not already part of our keys array
	          if(keys.indexOf(key) === -1) {
	              // add it to our keys array
	              keys.push(key); 
	              // push this item to our final output array
	              output.push(item);
	          }
	      });
	      // return our array which should be devoid of
	      // any duplicates
	      return output;
	   };
	});



