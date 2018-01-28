"use strict";

class FacebookSync {

    constructor(app_id = false){
        if(!app_id) throw "Error App ID!!";

        return new Promise((Resolve, Reject) => {

            window.fbAsyncInit = function() {
              FB.init({
                appId      : app_id,
                cookie     : true,
                xfbml      : true,
                version    : 'v2.11'
              });
              const application = {
                'status': function(){
                    return new Promise((Resolve, Reject) => {
                      FB.getLoginStatus(function(res){
                        Resolve(res);
                      })
                    }); 
                 },
                'login': function(){
                    return new Promise((Resolve, Reject) => {
                      FB.login(function(res){
                        Resolve(res);
                      }, {scope: 'email'});
                    }); 
                 },
                 'getInfo': function(fields = 'first_name,last_name,name,id'){
                    var def = false;
                    var image = function(id){
                      return {
                        large: `https://graph.facebook.com/${id}/picture?type=large`,
                        normal: `https://graph.facebook.com/${id}/picture?type=normal`,
                        small: `https://graph.facebook.com/${id}/picture?type=small`,
                        square: `https://graph.facebook.com/${id}/picture?type=square`
                      } 
                    };
                    if(fields === 'first_name,last_name,name,id'){
                      def = true;
                    }
                    return new Promise((Resolve, Reject) => {
                      FB.api('/me', 'GET', {fields: fields}, function(res) {
                        if(def && res.id) res = {...res,images: image(res.id)};
                        Resolve(res);
                      });
                    }); 
                 }
              };
              Resolve(application);
            };
    
            (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        });
    }

}