'use strict';

// The main javascript file for claimforlien_admin.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/webapps/claimforlien_admin/img/sample.jpg';


$(function () {
  if (window['cot_app']) {
    //the code in this 'if' block should be deleted for embedded apps
    var app = new cot_app("claimforlien_admin", {
      hasContentTop: false,
      hasContentBottom: false,
      hasContentRight: false,
      hasContentLeft: false,
      searchcontext: 'INTRA'
    });

    app.setBreadcrumb([{ "name": "claimforlien_admin", "link": "#" }]).render();
  }
  var container = $('#claimforlien_admin_container');
});