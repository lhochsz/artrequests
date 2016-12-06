angular.module('productsApp')
.component('navbar', {
  template: `
    <nav class="navbar navbar-fixed-top navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <p class="navbar-brand orderUp">Order Up</p>
        </div>
      </div>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav">
            <li ng-class="{ active: $ctrl.$state.includes('home') }" ><a ui-sref="home">Home</a></li>
            <li ng-class="{ active: $ctrl.$state.includes('about') }" ><a ui-sref="about">About</a></li>
            <li ng-show="$ctrl.Auth.isLoggedIn()" ng-class="{ active: $ctrl.$state.includes('restaurants') }" ><a ui-sref="restaurants">Restaurants</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li ng-hide="$ctrl.Auth.isLoggedIn()" ng-class="{ active: $ctrl.$state.includes('login')  }" ><a ui-sref="login">Login</a></li>
            <li ng-hide="$ctrl.Auth.isLoggedIn()" ng-class="{ active: $ctrl.$state.includes('signup') }" ><a ui-sref="signup">Sign Up</a></li>
            <p ng-show="$ctrl.Auth.isLoggedIn()" class="navbar-text">Hello, {{ $ctrl.Auth.getCurrentUserSync().name }}!</p>
            <button ng-show="$ctrl.Auth.isLoggedIn()" type="button" class="btn btn-default navbar-btn" ng-click="$ctrl.logout()">Logout</button>
          </ul>
        </div>
      </div>
    </nav>
  `,
  controller: function(Auth, $state) {
    // this.Auth = Auth;
    // this.$state = $state;

    // console.log(Auth.getCurrentUserSync());


    // this.logout = function() {
    //   this.Auth.logout()
    //   .then( res => {
    //     this.$state.go('login');
    //   });
    // };
  }
});