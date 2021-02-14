$(document).ready(function() {
    $('.login_tab').click(function() {
      $('.for_login').show("");
      $('.for_register').hide("");
      $('.login_tab').addClass("active_login");
      $('.register_tab').removeClass("active_login");
    });


    $('.register_tab').click(function() {
        $('.for_login').hide("");
        $('.for_register').show("");
        $('.login_tab').removeClass("active_login");
      $('.register_tab').addClass("active_login");
    });

});