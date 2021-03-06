var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('requestCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.weather = {
        show: false
    }

    $scope.getWeather = function() {
        var apiKey = '9fca76e1d5da510dd428e99748818087';

        if(!$scope.city_id) return;

        $scope.weather.show = false;

        $http.get('http://api.openweathermap.org/data/2.5/weather?id='+$scope.city_id+'&units=metric&lang=ru&APPID='+apiKey).
            success(function(data, status, headers, config) {
                var wind;

                switch(true) {
                    case data.wind.deg>348.75 && data.wind.deg<=11.25:
                        wind = 'Северный';
                        break;
                    case data.wind.deg>11.25 && data.wind.deg<=78.75:
                        wind = 'Северо-восточный';
                        break;
                    case data.wind.deg>78.75 && data.wind.deg<=123.75:
                        wind = 'Восточный';
                        break;
                    case data.wind.deg>123.75 && data.wind.deg<=168.75:
                        wind = 'Юго-восточный';
                        break;
                    case data.wind.deg>168.75 && data.wind.deg<=213.75:
                        wind = 'Южный';
                        break;
                    case data.wind.deg>213.75 && data.wind.deg<=258.75:
                        wind = 'Юго-западный';
                        break;
                    case data.wind.deg>258.75 && data.wind.deg<=303.75:
                        wind = 'Западный';
                        break;
                    case data.wind.deg>303.75 && data.wind.deg<=348.75:
                        wind = 'Северо-западный';
                        break;
                }

                $scope.weather.icon = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
                $scope.weather.info = data.weather[0].description;
                $scope.weather.temp = (data.main.temp>0 ? '+' : null)+Math.round(data.main.temp)+' C°';
                $scope.weather.wind = (wind!==undefined ? wind+', ' : null)+data.wind.speed+'м/с';
                $scope.weather.humidity = data.main.humidity+'%';

                $scope.weather.show = true;
            }).
            error(function(data, status, headers, config) {
                alert('Произошла ошибка, попробуйте позднее');
            });
    }
}]);

weatherApp.directive('search', function($http, $compile, $timeout) {
    return {
        templateUrl: 'search.tpl.html',
        link: function ($scope, element, attrs, controller) {
            var timer, prevVal;

            $scope.items = [];
            $scope.showResults = false;

            $scope.selectCity = function($index) {
                var city = $scope.items[$index];

                $scope.items = [];

                $scope.city = city.name;
                $scope.city_id = city.id;
            }

            $scope.$watch('items.length', function(length) {
                $scope.showResults = (length>0);
            });

            element[0].getElementsByClassName('search__field')[0].onkeyup = function(e) {
                var val = e.target.value;

                if(prevVal==val) return;

                $scope.city_id = '';
                $scope.items = [];

                if(val.length<3) return;

                $timeout.cancel(timer);
                timer = $timeout(function() {
                    $http.get('http://teplenin.ru/weather.php?mode=1&city='+val).
                        success(function(data, status, headers, config) {
                            $scope.items = data;
                        });
                }, 300);

                prevVal = val;
            }

            var search_items = $compile('<div class="search__items" ng-show="showResults"><div class="search__item" ng-repeat="item in items" ng-click="selectCity($index)">{{item.name}}</div></div>')($scope);
            angular.element(element[0]).append(search_items);
        }
    }
});