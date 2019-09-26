/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
let totalCharacters = 4000;
let totalUploadSizeLimit = 20971520;
let remainingUploadSize = totalUploadSizeLimit;
let dz_uploader;
let documentReferenceID;


const getPDF = (id)=>{
  $.ajax({
    url:`/*@echo ROOT_ENV*//downloads('')`
  }).then(response=>{
    var res = JSON.parse(response.body);
    let filename = `claimlein-form12__${documentReferenceID}.pdf`;
    
    if(res){

      
      // Tempory workaround for cases when backend sends a response.body wrapped in an array
      if (!res.BIN_ID) {
        if (Array.isArray(res) && res[0]) {
          res = res[0];
        } else {
          console.log('ERROR');
          document.getElementById('loading-download').remove();
          $(evt.target).attr('data-downloading','false');
          return false;
        }
      }


      $.ajax({
        url:  `/*@echo ROOT_ENV*//c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`,
        method: "GET",
        type:"GET",
        headers:{
          'Content-Type':'application/json',
          "Content-Disposition": `attachment; filename=${filename}`,
          "captchaResponseToken":token,
          "cot_recaptcha_config":"3e8c0acc-770f-4606-84f1-71b4c9170cc6"
        },
        error(data) {
          console.log('ERROR', data);
        },
        fail(data) {
          console.log('ERROR', data);
        },
        success(data) {
          let finalData = data; //file data here
          //let filename = `claimlein-form12__${referenceID}.pdf`;
          
            let blob = new Blob([finalData],{
                type: 'application/pdf;charset=utf-8;'
            });
        
            if(window.navigator.msSaveOrOpenBlob) {
                console.log('edge');
                navigator.msSaveOrOpenBlob(blob, filename + '.pdf');
            } else {
                let linkEXPORT = document.createElement("a");
                linkEXPORT.style.display = 'none';
                document.body.appendChild(linkEXPORT);
                if(linkEXPORT.download !== undefined) {
                    console.log('html5');
                    //linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
                    linkEXPORT.setAttribute('href', `/*@echo ROOT_ENV*//c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`);
                    linkEXPORT.setAttribute('download', filename);
                    linkEXPORT.click();
                } else {
                    console.log('html4');
                    pdf = 'data:application/pdf;charset=utf-8,' + finalData;
                    window.open(encodeURI(pdf));
                }
                document.body.removeChild(linkEXPORT);
            }
        }
      })




    } else {
      document.getElementById('loading-download').remove();
      $(evt.target).attr('data-downloading','false')
    }

  });
}




const getSubmissionSections = (form_id, data) => {

  let section, model, registerFormEvents, registerOnSaveEvents, registerPostSaveEvents,totalCharacters;
  totalCharacters = 4000;
  switch (form_id) {
    case 'Media':
      var editor = void 0;
      section = [{
        "id": "adminSection",
        "title": "Reference Data",
        "rows": [{
          fields: [{id: "id", bindTo: "id", title: "File Name", disabled: true, required: true}, {
            id: "__ContentType",
            bindTo: "__ContentType",
            title: "Content Type",
            disabled: true,
            required: true
          }, {
            id: "updateMedia", type: "button", title: "Update",
            onclick: function onclick() {
              updateMedia();
            }
          }]
        }, {
          fields: [{
            "id": "ace_editor",
            "type": "html",
            "html": "<div style=\"height:1500px;top: 0;right: 0;bottom: 0;left: 0;\" id=\"myAceEditor\"></div>"
          }]
        }]
      }];
      model = new CotModel({"id": "", "__ContentType": ""});

       
      registerFormEvents = (data) => {

        editor = ace.edit("myAceEditor");
        editor.setTheme("ace/theme/monokai");
        var dataType = "text";
        if (data.__ContentType === "application/javascript") {
          dataType = "text";
        } else {
        }

        $.ajax({
          "type": "GET",
          "dataType": dataType,
          "headers": {
            "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
            "Cache-Control": "no-cache"
          },
          "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/Media('" + data.id + "')/$value"
        }).success(function (result, status, xhr) {

          var mode = "";

          switch (xhr.getResponseHeader("content-type").split(",")[0]) {
            case "application/javascript":
              mode = "ace/mode/javascript";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "application/json":
              mode = "ace/mode/json";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/css":
              mode = "ace/mode/css";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/html":
              mode = "ace/mode/html";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/plain":
              mode = "ace/mode/text";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
          }
          if (mode != "") {
          } else {
          }
        }).error(function (e) {
          console.warn("error", e);
        });
      };

      const updateMedia = () => {

        var entitySet = "Media";
        var name = data.id;
        var contentType = data.__ContentType;
        var media = editor.getValue();
        var sid = Cookies.get(config.default_repo + ".sid");
        var base = config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/";

        // ADD MEDIA
        function step3(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          contentType = contentType !== 'application/json' ? contentType : 'text/plain';

          var ajaxSetting = {
            contentType: contentType,
            data: media,
            method: 'PUT',
            url: base + entitySet + '(\'' + name + '\')/$value'
          };
          if (sid) {
            ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
          }

          $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
            defer.resolve(data, textStatus, jqXHR);
          }, function (jqXHR, textStatus, errorThrown) {
            defer.reject(jqXHR, textStatus, errorThrown);
          });

          return defer.promise();
        }

        // CLEAN UP IF NEEDED
        function step4(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          if (contentType === 'application/json') {
            var ajaxSetting = {
              contentType: contentType,
              data: JSON.stringify({
                '@odata.mediaContentType': contentType,
                __ContentType: contentType,
                id: name
              }),
              method: 'PUT',
              url: base + entitySet + '(\'' + name + '\')'
            };
            if (sid) {
              ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
            }

            $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
              defer.resolve(data, textStatus, jqXHR);
            }, function (jqXHR, textStatus, errorThrown) {
              defer.reject(jqXHR, textStatus, errorThrown);
            });
          } else {
            defer.resolve();
          }

          return defer.promise();
        }

        var defer = $.Deferred();
        step3(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

          step4(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

            defer.resolve(data, textStatus, jqXHR);
            hasher.setHash(entitySet + "/" + name + "/?ts=" + new Date().getTime());
          });
        });
      };

      break;
      case 'contacts':
        section = [
          {
            id: "submitter_information",
            title: "Contact Information",
            className: 'contact-form-section panel-default',
            rows: [
              {
                fields: [
                  {
                    id: 'fullName',
                    title: 'Full Name',
                    type: 'text',
                    required: true,
                    htmlAttr: {maxLength: 100},
                    bindTo: 'fullName'
                  },
                  {
                    id: 'email',
                    title: 'Email',
                    type: 'email',
                    required: true,
                    infohelp: 'Ex: you@me.com',
                    htmlAttr: {maxLength: 254},
                    bindTo: 'email'
                  }
                ]
              }
            ]
          }
        ];
        model = new CotModel({
          "fullName": "",
          "email": ""
        });
  
        registerPostSaveEvents = (data) => {
          let configName = "contacts.js";
          let dataURL = config.httpHost.app[httpHost] + config.api.get + config.default_repo + "/contacts?$format=application/json;odata.metadata=none&$select=fullName,email&$skip=0&$top=1000&$orderby=id desc&unwrap=true";
          let configURL = config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/Media";
          let appName = config.default_repo;
          let config_content = {};
          let doc_id = data.id;
          $.ajax(
            {
              "url": dataURL,
              "type": "GET",
              "dataType": "json",
              "headers": {
                "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
                "Content-Type": "application/json; charset=utf-8;",
                "Cache-Control": "no-cache"
              }
            }
          ).success(function (data) {
            let ContactEmails = [];
            $.each(data, function (i, Contact) {
              ContactEmails.push(Contact.email);
            });
            config_content.contacts = data;
            config_content.contactDistributionList = ContactEmails;
  
            updateConfig(configURL, configName, "application/javascript", "var sys_config = " + JSON.stringify(config_content)+ "", Cookies.get(config.default_repo + ".sid"))
              .then(function(){
                router.navigate('contacts/' + doc_id + '/?alert=success&msg=save.done&ts=' + new Date().getTime(), {trigger: true, replace: true});
              })
          });
  
       };
  
        break;
    case 'submissions':
      section = [
        {
          cols: "2",
          id: null,
          rows: [{
                  fields: [{
                          id: "name_of_lien_claimant",
                          type: "textarea",
                          title: "Name of lien claimant (Required)",
                          className: "col-xs-12",
                          bindTo: "name_of_lien_claimant",
                          disbled: false,
                          rows: 4,
                          htmlAttr: {
                              length: totalCharacters
                          }, 
                          required: true,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: "(In the case of a claim on behalf of a worker by a workers' trust fund, the name of the trustee)",
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "address_for_service",
                          type: "textarea",
                          title: "Address for service",
                          className: "col-xs-12",
                          bindTo: "address_for_service",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "name_of_owner",
                          type: "textarea",
                          title: "Name of owner",
                          className: "col-xs-12",
                          bindTo: "name_of_owner",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "owner_address",
                          type: "textarea",
                          title: "Address",
                          className: "col-xs-12",
                          bindTo: "owner_address",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "claimant_supplied",
                          type: "textarea",
                          title: "Name of person to whom lien claimant supplied services or materials",
                          className: "col-xs-12",
                          bindTo: "claimant_supplied",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "claimant_supplied_address",
                          type: "textarea",
                          title: "Address",
                          className: "col-xs-12",
                          bindTo: "claimant_supplied_address",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                    html: "<b>Time within which services or materials were supplied</b>",
                    className: "col-sm-12",
                    type:'html'
                  },{
                          id: "supplied_from",
                          type: "datetimepicker",
                          title: "From",
                          className: "col-sm-6",
                          bindTo: "supplied_from",
                          disbled: false,
                          maxlength:10,
                          options: {
                            format: 'YYYY-MM-DD',
                            maxDate: new moment().format("YYYY-MM-DD"),
                            keepInvalid: true,
                            useStrict: true
                          },
                          rows: 4,
htmlAttr: {
  length: totalCharacters,
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: "(date supply commenced)",
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                          id: "supplied_to",
                          type: "datetimepicker",
                          title: "To",
                          className: "col-sm-6",
                          bindTo: "supplied_to",
                          disbled: false,
                          
                          options: {
                            format: 'YYYY-MM-DD',
                            maxDate: new moment().format("YYYY-MM-DD"),
                            keepInvalid: true,
                            useStrict: true
                          },
                          rows: 4,
htmlAttr: {
  length: totalCharacters,
  maxlength:10
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: "(date of most recent supply)",
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [
                      {
                          id: "short_description",
                          type: "textarea",
                          title: "Short description of services or materials that have been supplied",
                          className: "col-xs-12",
                          bindTo: "short_description",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                          id: "contract_price",
                          type: "textarea",
                          title: "Contract price or subcontract price",
                          className: "col-xs-12",
                          bindTo: "contract_price",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "amount_claimed",
                          type: "textarea",
                          title: "Amount claimed as owing in respect of services or materials that have been supplied",
                          className: "col-xs-12",
                          bindTo: "amount_claimed",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "claim_type",
                          type: "checkbox",
                          title: "(Use A where the lien attaches to the premises; use B where the lien does not attach to the premises)",
                          className: "col-xs-12",
                          bindTo: "claim_type",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          // infohelp: 'Use A where the lien attaches to the premises; use B where the lien does not attach to the premises',
                          posthelptext: null,
                          choices: [{
                                  value: "A",
                                  text: "A. The lien claimant (if claimant is personal representative or assignee, this must be stated) claims a lien against the interest of every person identified above as an owner of the premises described in Schedule A to this claim for lien."
                              },
                              {
                                  value: "B",
                                  text: "B. The lien claimant (if claimant is personal representative or assignee, this must be stated) claims a charge against the holdbacks required to be retained under the Act and any additional amount owed by a payer to the contractor or any subcontractor whose contract or subcontract was in whole or in part performed by the services or materials that have been supplied by the lien claimant in relation to the premises at:"
                              }
                          ],
                          value: " ",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [{
                          id: "location_premises",
                          type: "textarea",
                          title: "Address or other identification of the location of the premises",
                          className: "col-xs-12",
                          bindTo: "location_premises",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {},
                          posthelptext: '(Address or other identification of the location of the premises)'
                      }
                  ]
              },
              {
                  fields: [{
                          id: "date",
                          type: "datetimepicker",
                          title: "Date",
                          className: "col-sm-6 js-claimDate",
                          bindTo: "date",
                          options: {
                            format: 'YYYY-MM-DD',
                            maxDate: new moment().format("YYYY-MM-DD"),
                            keepInvalid: true,
                            useStrict: true
                          },
                          disbled: false,
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                          id: "signature",
                          type: "textarea",
                          title: "Signature",
                          className: "col-sm-6",
                          bindTo: "signature",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: '(signature of claimant or agent)',
                          placeholder: null,
                          value: "",
                          validators: {}
                      }
                  ]
              },
              {
                  fields: [
                      {
                        id: 'scheduleTitleHTML',
                        type: 'html',
                        class: "col-xs-12 col-sm-12 col-md-12 text-center",
                        html: '<h3>SCHEDULE A</h3>'
                      },
                      {
                          id: "to_the_claim_for_lien_of",
                          type: "textarea",
                          title: "To the claim for lien of",
                          className: "col-xs-12",
                          bindTo: "to_the_claim_for_lien_of",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                          id: "description_of_premises",
                          type: "textarea",
                          title: "Description of premises",
                          className: "col-xs-12",
                          bindTo: "description_of_premises",
                          disbled: false,
                          rows: 10,
htmlAttr: {
  length: 64000 //totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: "(Where the lien attaches to the premises, provide a description of the premises and address sufficient for registration under the Land Titles Act or the Registry Act, as the case may be. Where the lien does not attach to the premises, the address or other identification of the premises)",
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                        id: "formTextID",
                        type: "html",
                        html: "CA-12-E(2018/04)"
                      }
                  ]
              }
          ],
          title: "Claim for Lien Under Section 34 of the Act - Form 12"
          }, 

          {
              cols: "2",
              id: null,
              rows: [{
                fields:
                [
                  // {
                  //   id: 'uploadInfoText',
                  //   type: 'html',
                  //   class: 'col-xs-12',
                  //   html: `this.uploadInfoText()`,
                  // },
                  {
                    id: "supportingDocuments",
                    title: 'Choose Files',
                    type: 'dropzone',
                    class: 'col-xs-12',
                    bindTo: 'supportingDocuments',
                    required: false,

                    htmlAttr: {
                      length: totalCharacters
                  },

                    //posthelptext: 'post help text',
                    //prehelptext: 'pre help text',

                    use_recaptcha: true,
                    recaptcha_sitekey: '/* @echo RECAPTCHA_SITEKEY */',
                    uploadCondition: function() {
                      // console.log('UPLOAD CONDITION');

                      if(cannotSubmit){
                        return false;
                      }
              
                      if(currentStep<=4){
                        return false;
                      }

                      if($('#claimforlien_container').data('formValidation').$invalidFields.length>0){
                        return false;
                      }

                      // console.log('TRUE');
                      return true;
                    },

                    
                    options: {
                      url:'/*@echo ROOT_ENV*//c3api_upload/upload/claimforlienP/attachments',
                      acceptedFiles: 'application/pdf',
                      maxFiles: 3,
                      maxFilesize: 20,
                      // autoProcessQueue: false,
                      selector: '#cotDropzoneClass2',

                      init(){
                        remainingUploadSize = totalUploadSizeLimit;
                        dz_uploader = this;

                       
                        //console.debug('remainingUploadSize',remainingUploadSize)

                        this.on("addedfile", function(file) { 
                          console.log(file);


                          var $textDescription = $(file.previewElement).find('textarea')[0]
                          var $textDescriptionID = $($textDescription).attr('id')

                          $($textDescription).attr('length',totalCharacters);
                          // $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_'+$($textDescription).attr('id')+'">'+totalCharacters+'</span> chars remaining</div>');
                          $($textDescription).after('<div class="label label-default totalCharacters"><span class="charactercount_'+$($textDescription).attr('id')+'">'+totalCharacters+'</span> characters remaining</div>');
                          $($textDescription).on("keyup",function(event){
                            checkTextAreaMaxLength(this,event);
                          });

                          remainingUploadSize -= file.size;
                        });

                        this.on("removedfile", function(file) {
                          remainingUploadSize += file.size;

                          this.getRejectedFiles().map(file=>{
                            if(remainingUploadSize < totalUploadSizeLimit && !file.isExcess){
                              var $previewElement = file.previewElement.querySelector('[data-dz-errormessage]')
                              if($previewElement){
                                $previewElement.remove();
                                file.status = 'added'
                                delete file.errorMessage
                              }
                            }
                          })

                        });

                        this.on("error", function(file) {
                          //remainingUploadSize += file.size;
                        });
                      },
                      accept: function(file, done) {
                        //console.debug('totalSizeLimit', totalUploadSizeLimit)
                        //console.debug('remainingUploadSize', remainingUploadSize)

                        if (remainingUploadSize <= 0) {
                          file.status = Dropzone.CANCELED;
                          this._errorProcessing([file],  "You have exceeded the attachment size limit of 20MB. Please remove one or more files.", null);
                        }else { 
                          done();
                        }
                      },
                      chunksUploaded:function(file,done){
                        uploadedFiles.push({filenane: file.name , status: true}) 
                      },
                      fields: [
                      /*
                        {
                          name: 'text01',
                          title: 'Text Field',
                          type: 'text',
                          prehelptext: 'Help text',
                          posthelptext: 'Help text'
                        },
                      */
                        {
                          name: 'fileDescription',
                          title: 'File Description',
                          type: 'textarea',
                          //prehelptext: 'Help text',
                          //posthelptext: 'Help text'
                        }
                      ]
                    }
                  }
                ]
              }],
              title: "PDF Attachments"
          },

          {
              cols: "2",
              id: null,
              rows: [{
                  fields: [
                    {
                      id: "optionalinfotext",
                      type: "html",
                      className: "col-xs-12",
                      html: "This optional additional information will help the City determine who is administering the contract."
                    },{
                          id: "contract_number",
                          type: "textarea",
                          title: "Owner's Contract Number",
                          className: "col-xs-12",
                          bindTo: "contract_number",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      },
                      {
                          id: "contact_person",
                          type: "textarea",
                          title: "Owner's Contact Person - Staff First and Last Name",
                          className: "col-xs-12",
                          bindTo: "contact_person",
                          disbled: false,
                          rows: 4,
htmlAttr: {
  length: totalCharacters
}, 
                          required: false,
                          readOnly: false,
                          infohelp: null,
                          posthelptext: null,
                          placeholder: null,
                          value: "",
                          validators: {}
                      },{
                        id: null,
                        type: "html",
                        className: "col-xs-12",
                        html: "07-0205 2019-07"
                      },
                      
                  ]
              }
          ],
          //title: "Contact Information"
          title: "City of Toronto Information"
          },


          // {
          //   id: "summaryBox",
          //   title: "Review Submission Information",
          //   className: 'panel-default',
          //   rows: [
          //     {
          //       fields: [
          //         {
          //           id: 'reviewHTML',
          //           type: 'html',
          //           html: this.summaryHTML()
          //         }
          //       ]
          //     }
          //   ]
          // }


          /*
          {
            id: "submitBox",
            title: "Ready to submit?",
            className: 'submitBOX panel-default',
            rows: [
              {
                fields: [
                  {
                    id: 'submit_button',
                    type: 'button',
                    btnClass: 'primary btn-lg', //optional, only applies when type=button, defaults to 'success', determines the bootstrap btn-x class used to style the button, valid values are here: http://getbootstrap.com/css/#buttons-options
                    // glyphicon: 'glyphicon-thumbs-up',
                    title: 'Submit',
                    onclick: function(){ //optional, when type=button this specifies an onclick function
                      $(formHtmlIdHash).data('formValidation').validate(); //attempt form submission, if validation is successful, the success event is called
                      return false;
                    }
                  }
                ]
              }
            ]
          }
          */

    ];


      model = new CotModel({
        "name_of_lien_claimant": "",
        
        "address_for_service": "",
        "name_of_owner": "",
        "owner_address":"",
        "claimant_supplied":"",
        "claimant_supplied_address":"",
        "supplied_from":"",
        "supplied_to":"",
        "short_description":"",
        "contract_price":"",
        "amount_claimed":"",
        "claim_type":"",
        "location_premises":"",
        "date":"",
        "signature":"",
        "to_the_claim_for_lien_of":"",
        "description_of_premises":"",
        "contract_number":"",
        "contact_person":"",
        
      });

      registerFormEvents = (data) => {
        console.log("registerFormEvents: Do something like add in addition form elements, hide elements ect",data);
        $('.optional').remove();
        $('#location_premisesElement label').addClass('sr-only');
        $('#supportingDocuments .control-label').hide();
        documentReferenceID = data.referenceID;




        // $('#js-download-button').click(evt=>{
        //   console.log('Get File');
          
          

          
        //   // grecaptcha.ready(function() {
        //   //   grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function(token) {

        //   //     $.ajax({
        //   //       //url: `/*@echo PDF_API*/`,
        //   //       url: '/*@echo ROOT_ENV*//c3api_data/v2/DataAccess.svc/cot_dts_recaptcha/app_config/ca.toronto.api.dataaccess.odata4.verify',
        //   //       method: "POST",
        //   //       type:"POST",
        //   //       headers:{
        //   //         'Content-Type':'application/json',
        //   //         "captchaResponseToken":token,
        //   //         "cot_recaptcha_config":"3e8c0acc-770f-4606-84f1-71b4c9170cc6"
        //   //       },
        //   //       data:JSON.stringify({
        //   //         "id":successID
        //   //       })
        //   //     }).then(response=>{
        //   //       var res = JSON.parse(response.body);
        //   //       let filename = `claimlein-form12__${referenceID}.pdf`;
                
        //   //       if(res){

                  
        //   //         // Tempory workaround for cases when backend sends a response.body wrapped in an array
        //   //         if (!res.BIN_ID) {
        //   //           if (Array.isArray(res) && res[0]) {
        //   //             res = res[0];
        //   //           } else {
        //   //             console.log('ERROR');
        //   //             document.getElementById('loading-download').remove();
        //   //             $(evt.target).attr('data-downloading','false');
        //   //             return false;
        //   //           }
        //   //         }


        //   //         $.ajax({
        //   //           url:  `/*@echo ROOT_ENV*//c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`,
        //   //           method: "GET",
        //   //           type:"GET",
        //   //           headers:{
        //   //             'Content-Type':'application/json',
        //   //             "Content-Disposition": `attachment; filename=${filename}`,
        //   //             "captchaResponseToken":token,
        //   //             "cot_recaptcha_config":"3e8c0acc-770f-4606-84f1-71b4c9170cc6"
        //   //           },
        //   //           error(data) {
        //   //             console.log('ERROR', data);
        //   //           },
        //   //           fail(data) {
        //   //             console.log('ERROR', data);
        //   //           },
        //   //           success(data) {
        //   //             let finalData = data; //file data here
        //   //             //let filename = `claimlein-form12__${referenceID}.pdf`;
                      
        //   //               let blob = new Blob([finalData],{
        //   //                   type: 'application/pdf;charset=utf-8;'
        //   //               });
                    
        //   //               if(window.navigator.msSaveOrOpenBlob) {
        //   //                   console.log('edge');
        //   //                   navigator.msSaveOrOpenBlob(blob, filename + '.pdf');
        //   //               } else {
        //   //                   let linkEXPORT = document.createElement("a");
        //   //                   linkEXPORT.style.display = 'none';
        //   //                   document.body.appendChild(linkEXPORT);
        //   //                   if(linkEXPORT.download !== undefined) {
        //   //                       console.log('html5');
        //   //                       //linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
        //   //                       linkEXPORT.setAttribute('href', `/*@echo ROOT_ENV*//c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`);
        //   //                       linkEXPORT.setAttribute('download', filename);
        //   //                       linkEXPORT.click();
        //   //                   } else {
        //   //                       console.log('html4');
        //   //                       pdf = 'data:application/pdf;charset=utf-8,' + finalData;
        //   //                       window.open(encodeURI(pdf));
        //   //                   }
        //   //                   document.body.removeChild(linkEXPORT);
        //   //               }
        //   //           }
        //   //         })




        //   //       } else {
        //   //         document.getElementById('loading-download').remove();
        //   //         $(evt.target).attr('data-downloading','false')
        //   //       }

        //   //     }).then(res=>{
        //   //       document.getElementById('loading-download').remove();
        //   //       $(evt.target).attr('data-downloading','false')
        //   //     })


        //   //  })
        //   // })

        // })





        





















        $('[data-dz-remove]').remove();
        $('.btn-addFiles').remove();
        $('#js-download-button').click(evt=>{

          //getPDF(id);
          console.log(model.id, documentReferenceID);

          let referenceID = model.referenceID;
          let filename = `claimlein-form12__${documentReferenceID}.pdf`;
          $.ajax({
            url: `/c3api_data/v2/DataAccess.svc/claimforlien_admin/download('${model.id}')`,
            method: "GET",
            headers:{
              'Authorization': `AuthSession ${Cookies.get('claimforlien_admin.sid')}`,
              'Content-Type':'application/json',
            }
          }).then(res=>{
            
            let linkEXPORT = document.createElement("a");
            //linkEXPORT.style.display = 'none';
            document.body.appendChild(linkEXPORT);
            if(linkEXPORT.download !== undefined) {
                
                //linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
                linkEXPORT.setAttribute('href', `/c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`);
                linkEXPORT.setAttribute('download', filename);
                linkEXPORT.click();
                console.log('html5',linkEXPORT);
            } else {
                console.log('html4');
                pdf = 'data:application/pdf;charset=utf-8,' + finalData;
                window.open(encodeURI(pdf));
            }
            document.body.removeChild(linkEXPORT);
            

            // $.ajax({
            //   url:  `/c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`,
            //   method: "GET",
            //   type:"GET",
            //   dataType:'text',
            //   headers:{
            //     'Content-Type':'application/pdf',
            //     //"Content-Disposition": `attachment; filename=${filename}`,
            //   },
            //   error(data,a,c) {
            //     console.log('ERROR', data,a,c);
            //   },
            //   fail(data) {
            //     console.log('ERROR', data);
            //   },
            //   success(data) {
               
                      
                
                
                
            //     let finalData = data; //file data here
            //     //let filename = `claimlein-form12__${referenceID}.pdf`;
                
            //       let blob = new Blob([finalData],{
            //           type: 'application/pdf;charset=utf-8;'
            //       });
              
            //       if(window.navigator.msSaveOrOpenBlob) {
            //           console.log('edge');
            //           navigator.msSaveOrOpenBlob(blob, filename + '.pdf');
            //       } else {
            //           let linkEXPORT = document.createElement("a");
            //           linkEXPORT.style.display = 'none';
            //           document.body.appendChild(linkEXPORT);
            //           if(linkEXPORT.download !== undefined) {
            //               console.log('html5');
            //               //linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
            //               linkEXPORT.setAttribute('href', `/c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].file_name}`);
            //               linkEXPORT.setAttribute('download', filename);
            //               linkEXPORT.click();
            //           } else {
            //               console.log('html4');
            //               pdf = 'data:application/pdf;charset=utf-8,' + finalData;
            //               window.open(encodeURI(pdf));
            //           }
            //           document.body.removeChild(linkEXPORT);
            //       }
            //   }
            // })

          }).fail(res=>{

          })

          // var a = document.createElement('a');
          // var url = `/*@echo ROOT_ENV*//c3api_upload/retrieve/claimforlien/${res.BIN_ID[0].bin_id}`;
          // a.href = url;
          // a.download = `claimlein-form12__${referenceID}.pdf`;
          // document.body.append(a);
          // a.click();
          // a.remove();



          // // export pdf
          // let finalData = ""; //file data here
          // let filename = "filename";
          
          //   let blob = new Blob([finalData],{
          //       type: 'application/pdf;charset=utf-8;'
          //   });

          //   if(window.navigator.msSaveOrOpenBlob) {
          //       console.log('edge');
          //       navigator.msSaveOrOpenBlob(blob, filename + '.pdf');
          //   } else {
          //       let linkEXPORT = document.createElement("a");
          //       linkEXPORT.style.display = 'none';
          //       document.body.appendChild(linkEXPORT);
          //       if(linkEXPORT.download !== undefined) {
          //           console.log('html5');
          //           linkEXPORT.setAttribute('href', URL.createObjectURL(blob));
          //           linkEXPORT.setAttribute('download', filename + '.pdf');
          //           linkEXPORT.click();
          //       } else {
          //           console.log('html4');
          //           pdf = 'data:application/pdf;charset=utf-8,' + finalData;
          //           window.open(encodeURI(pdf));
          //       }
          //       document.body.removeChild(linkEXPORT);
          //   }





        });



        
        $('#js-supportingDocuments_filesElement').find('button').addClass('hide')
        
        $('textarea').replaceWith(function(){
          return '<span class="form-control fxinput '+this.id+'">'+$('#'+this.id).val().replace(/\n/gi,'<br>')+'</span>'
       });
       
   
   
   
   




        registerOnSaveEvents = (data) => {
          console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.");
        }};
      registerPostSaveEvents = (data) => {
        console.log("registerPostSaveEvents: Do something post save like change the route or display additional date. Note: If registerPostSaveEvents is implemented, you need to manage the state change after");
        // if this method is not implemented, then the framework will simply reload the new data from the server.
        router.navigate(form_id + '/' + data.id + '/?alert=success&msg=save.done&ts=' + new Date().getTime(), {trigger: true, replace: true});
      };

      break;
  }
  return [section, model, registerFormEvents, registerOnSaveEvents, registerPostSaveEvents];

};
/**
 *
 * @param formName
 * @param filter
 * @returns {[null,null,null]}
 */
const getColumnDefinitions = (formName, filter) => {
  let columnDefs, view, view_config = {};
  view_config.lengthMenu = [100, 10, 50];

  

  switch (formName) {
    case 'Media':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label='" + desc + "'class='btn btn-sm btn-default view_btn'>Open</button>";
            return view_button;
          }
        },
        {"data": "id", "title": "Name", "filter": false},
        {
          "data": "__ContentType",
          "title": "Content Type",
          "filter": false
        }
      ];
      view = 'Media';
      break;
    case 'contacts':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label=\"" + desc + "\" class=\"btn btn-sm btn-default view_btn\">Open</button>";
            return view_button;
          }
        },
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        },
        {"data": "fullName", "title": "Full Name", "filter": true, "type": "text"},
        {"data": "email", "title": "Email", "filter": true, "type": "text"}
      ];
      view = "contacts";
      break;
    case 'submissions':
      columnDefs = [
        {
          title: "Lien ID",
          data: "referenceID",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = `<button aria-label="${desc}" class="btn btn-sm btn-default view_btn">${data}</button>`;
            return view_button;
          }
        },
        {
          data: "name_of_lien_claimant",
          title: "Name of Lien Claimant", 
          filter: true, 
          type: "text",
          render: function(data,type,row,meta){
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = data;//`<button aria-label="${desc}" class="btn btn-sm btn-link view_btn">${data}</button>`;
            return view_button;
          }
        },
        {"data": "name_of_owner", "title": "Name of Owner", "filter": true, "type": "text"},
        {"data": "amount_claimed", "title": "Amount Claimed", "filter": true, "type": "text"},
        {"data": "location_premises", "title": "Premises Address", "filter": true, "type": "text"},
        {"data": "short_description", "title": "Short Description", "filter": true, "type": "text"},
        {"data": "contract_number", "title": "Contract Number", "filter": true, "type": "text"},
        {
          "data": "__CreatedOn",
          "title": "Created Date",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "restrict": filter["status"],
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        },
        
      ];
      view = "submissions";
      break;
    default:
      break;
  }
  return [columnDefs, view, view_config];
};
/**
 *
 */
const registerEvents = () => {
  console.log("reg events");
  $.ajaxSetup({cache: false});

  

  let cur_user = getCookie(config.default_repo + '.cot_uname') && getCookie(config.default_repo + '.cot_uname') !== "" ? getCookie(config.default_repo + '.cot_uname') : "not set"
  $("<span id=\"user_name_display\" style=\"margin-left:4px;\">" + cur_user + "</span>").insertAfter($("#user_auth_title"));


  

  $("#maincontent").off("click", ".view_btn").on("click", ".view_btn", function (e) {
    e.preventDefault();
    let row = $(this).closest('tr');
    row.addClass('selected');
    router.navigate(row.attr('data-formName') + '/' + row.attr('data-id') + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});
  });
  $("#maincontent").off('click', '#tabExportCSV').on('click', '#tabExportCSV', function () {
    $(".dt-button.buttons-csv.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportEXCEL').on('click', '#tabExportEXCEL', function () {
    $(".dt-button.buttons-excel.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportPDF').on('click', '#tabExportPDF', function () {
    $(".dt-button.buttons-pdf.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportCopy').on('click', '#tabExportCopy', function () {
    $(".dt-button.buttons-copy.buttons-html5").click();
  });

  // Create New Entry button
  $("#maincontent").off('click', '.btn-createReport').on('click', '.btn-createReport', function () {
    router.navigate($(this).attr('data-id') + '/new/?ts=' + new Date().getTime(), {trigger: true, replace: true});
  });

  // Navigation tab links by report status
  $("#maincontent").off('click', '.tablink').on('click', '.tablink', function () {

    let newRoute = $(this).attr('data-id') + '/?ts=' + new Date().getTime() + '&status=' + $(this).attr('data-status') + '&filter=' + $(this).attr('data-filter');
    console.log("tablink click", newRoute );
    router.navigate(newRoute , {trigger: true, replace: true});
  });
  // GLOBAL SEARCH
  $("#maincontent").off('click', '.form-control-clear').on('click', '.form-control-clear', function () {
    $(this).prev('input').val('').focus();
    $(this).hide();
    myDataTable.dt.search("").draw();
  });
  $("#maincontent").off("click", "#btn_global_search").on("click", "#btn_global_search", function () {
    myDataTable.dt.search($("#admin_search").val().trim()).draw();
  });
  $("#maincontent").off("keyup", "#admin_search").on("keyup", "#admin_search", function (event) {
    $(this).next('span').toggle(Boolean($(this).val()));
    if (event.keyCode === 13) {
      $("#btn_global_search").click();
    }
  });
  $("#maincontent").off("focus", "#admin_search").on("focus", "#admin_search", function (e) {
    $("#custom-search-input").addClass("searchfocus");
  });
  $("#maincontent").off("blur", "#admin_search").on("blur", "#admin_search", function (e) {
    $("#custom-search-input").removeClass("searchfocus");
  });

  $(".form-control-clear").hide($(this).prev('input').val());

};

/**
 * Optional. Called when dashboard route is used. Render your custom application dashboard here.
 */
const welcomePage = () => {
  console.log('welcome');
  $('.forForm, .forView, #form_pane, #view_pane').hide();
  $('#custom-search-input, #export-menu').hide();
  $('#dashboard_pane, .forDashboard').show();
  if ($('#viewtitle').html() != config.dashboard_title) {
    $("#viewtitle").html($("<span>" + config.dashboard_title + "</span>"));
  }
  let welcome_template = config.dashboard_template;
  tpl('#dashboard_pane', welcome_template, function () {});


};

/**
 *  Optional - If implemented, allows you to override and define your own routes.
 *  @returns: backbone router object
 */
/*
const getRoutes = () => {
  console.log('custom getRoutes implemented');
  return {
    routes: {
      '': 'homePage',
      'noaccess(/)': 'noaccess',
      'dashboard(/)': 'dashboard',
      ':formName(/)': 'frontPage',
      ':formName/new(/)': 'newPage',
      ':formName/:id(/)': 'viewEditPage',
      '*default': 'defautRoute'
    },

    defautRoute: function () {
      if (this.lastFragment !== null) {
        this.navigate(this.lastFragment, {trigger: false});
      } else {
        this.navigate('', {trigger: true});
      }
    },

    route: function (route, name, callback) {
      const oldCallback = callback || (typeof name === 'function') ? name : this[name];
      if (oldCallback !== config.defautRoute) {
        const newCallback = (...args) => {
          config.lastFragment = Backbone.history.fragment;
          oldCallback.call(this, ...args);
        };

        if (callback) {
          callback = newCallback;
        } else if (typeof name === 'function') {
          name = newCallback;
        } else {
          this[name] = newCallback;
        }
      }

      return Backbone.Router.prototype.route.call(this, route, name, callback);
    },
    noaccess: function () {
      noaccess()
    },
    homePage: function () {
      homePage();
    },
    frontPage: function (formName, query) {
      frontPage(formName, query);
    },
    newPage: function (formName, query) {
      newPage(formName, query);
    },
    viewEditPage: function (formName, id, query) {
      viewEditPage(formName, id, query)
    }

  };
};
*/
/**
 * optional - called every time the auth method is called and promise is resolved. Returns a promise.
 * @param oLogin
 * @return jQuery promise
 */

/*
const registerAuthEvents = (oLogin) =>{
  let deferred = new $.Deferred();
  console.log('registerAuthEvents', oLogin);
  deferred.resolve();
  return deferred.promise();
};
*/
/**
 *  optional - called every time OpenView is called to open an entity collection in the datatable. Returns null. Can be used to hook into events on the datatable or other as need for your usecase.
 */

const appInitialize = () =>{
  console.debug('appInitialize')


  var BasicSearchDefinition=()=>{
    let formId = 'js-basic--search';
    return {
      id: formId, //required, a unique ID for this form
      //title: '', //optional, a title to display at the top of the form
      rootPath: '/*@echo SRC_PATH*//', //optional, only required for forms using validationtype=Phone fields
      success: (evt) => {
        console.log("Search",evt,evt.target)
        myDataTable.dt.search("").draw();

        var filters=[];
        // Basic Search
        var fromBasic = $('#js-search-date--from').val();
        var toBasic = $('#js-search-date--to').val();
        var query = $('#search-term-search').val();


        var filterStr = ''
        

          myDataTable.dt.search(query).draw();
          if(fromBasic) filters.push(`__CreatedOn ge ${moment(fromBasic).format(myDataTable.dateFormat)}`);
          if(toBasic) filters.push(`__CreatedOn le ${moment(fromBasic).format(myDataTable.dateFormat)}`);
          filterStr = filters.map(filter=>{return filter}).join(' and ')
          window.location.href = `/*@echo SRC_PATH*//#submissions/?&status=&filter=${filterStr}`;
       

        evt.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
        return false;
      },
      useBinding: true,
      sections: [        
        {
          id: "js-basic-search",
          title: "Basic Search",
          className: 'panel-default',
          rows: [{
            fields:[{
              id: 'search-term-search', 
              className:'col-md-5',
              title: 'Search Term',
              type: 'text',
              value: ""
            },{
              type: 'datetimepicker',
              id: 'js-search-date--from',
              className:'col-md-4',
              title: 'Date From',
              required: false,
              posthelptext: '',
              options: {
                format: 'YYYY-MM-DD',
                maxDate: new Date()
              },
              bindTo: 'js-search-date--from'
            },{
              type: 'datetimepicker',
              id: 'js-search-date--to',
              title: 'Date To',
              className:'col-md-3',
              required: false,
              posthelptext: '',
              options: {
                format: 'YYYY-MM-DD',
                maxDate: new Date()
              },
              bindTo: 'js-search-date--to'
            },{
              type:'html',
              html:`<button class="btn btn-primary btn-lg">Search</button>`
            }]
          }]
        }
      ]
    }
  };


  var AdvancedSearchDefinition=()=>{
    let formId = 'js-search--advanced';
    return {
      id: formId, //required, a unique ID for this form
      //title: '', //optional, a title to display at the top of the form
      rootPath: '/*@echo SRC_PATH*//', //optional, only required for forms using validationtype=Phone fields
      success: (evt) => {
        console.log("Advanced Search",evt,evt.target)
        var filters=[];
        
        var fromBasic = $('#js-search-date--from').val();
        var toBasic = $('#js-search-date--to').val();
        var query = $('#search-term-search').val();


        if(query){
          if(fromBasic) filters.push(`__CreatedOn ge ${fromBasic}`);
          if(toBasic) filters.push(`__CreatedOn le ${toBasic}`);
          filter = filters.map(filter=>{return 'filter'}).join(' and ')
            window.location.href = `/*@echo SRC_PATH*//#submissions/?&status=&filter=${filter}`;
        }


        evt.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
        return false;
      },
      useBinding: true,
      sections: [{
          id: "js-advanced-search",
          title: "Advanced Search",
          className: 'panel-default',
          rows: [{
            repeatControl: {
              id: 'adv_search',
              title: 'Search Options',
              className: '',
              rows: [{
                  fields: [{
                      id: 'field_name',
                      title: 'Field Name',
                      type: 'dropdown',
                      choices: [

                        {text: 'Lien ID', value: 'id--text'},
                        {text: 'Name of Lien Claimant', value: 'name_of_lien_claimant--text'},
                        {text: 'Name of Person Supplied', value: 'claimant_supplied--text'},
                        {text: 'Premises Address', value: 'location_premises--text'},
                        {text: 'Premises Description', value: 'description_of_premises--text'},
                        {text: 'Address for Service', value: 'address_for_service--text'},
                        {text: 'Name of Owner', value: 'name_of_owner--text'},
                        {text: 'Address of Owner', value: 'owner_address--text'},
                        {text: 'Address of Person Supplied', value: 'claimant_supplied_address--text'},
                        {text: 'Supplied Date From', value: 'supplied_from--date'},
                        {text: 'Supplied Date To', value: 'supplied_to--date'},
                        {text: 'Short Description', value: 'short_description--text'},
                        {text: 'Contract Price', value: 'contract_price--text'},
                        {text: 'Amount Claimed', value: 'amount_claimed--text'},
                        {text: 'To the Claim of', value: 'to_the_claim_for_lien_of--text'},
                        {text: 'Contract Number', value: 'contract_number--text'},
                        {text: 'Owner Contact', value: 'contact_person--text'},
                        {text: 'Signature Date', value: 'date--date'},
                      ]
                  }, {
                      id: 'filter_by',
                      title: 'Filter By',
                      type: 'dropdown',
                      choices: [
                        {text: 'Equals To', value: ''},
                        {text: 'Contains', value: ''},
                        {text: 'Does Not Equal To', value: ''}
                      ]
                  }, {
                    id: 'search_term',
                    title: 'Search Term',
                    type: 'text'
                }]
              }]
           },
          }]
        }
      ]
    }
  };

  
  // $('#submissions_view_wrapper').prepend(`
  //   <div id="js-customsearch">
  //     <form id="js-search--options">
  //       <label><input type="radio" name="js-search-type" value="basic" checked> Basic search</label>
  //       <label><input type="radio" name="js-search-type" value="advanced"> Advanced Search</label>
  //       <label><input type="radio" name="js-search-type" value="displayall"> Display All Records</label>
  //     </form>
  //     <div id="advancedseach"></div>
  //   </div>
  // `);

  // var searchModel = null;
  // var CustomSearchForm;  
  // var $searchForm = $('#js-search--options');  

  // $('#advancedseach').html('')
  // CustomSearchForm = new CotForm(BasicSearchDefinition())
  // CustomSearchForm.render({target: '#advancedseach'});

  // $searchForm.change(evt=>{
  //   $('#advancedseach').html('')
  //   if(evt.target.value == 'basic'){
  //     CustomSearchForm = new CotForm(BasicSearchDefinition())
  //     CustomSearchForm.render({target: '#advancedseach'});
  //   }

  //   if(evt.target.value =="advanced"){
  //     CustomSearchForm = new CotForm(AdvancedSearchDefinition())
  //     CustomSearchForm.render({target: '#advancedseach'});
  //   }

  //   if(evt.target.value == "displayall"){
  //     $('#advancedseach').html('')
  //   }
  // })

};

/**
 * Optional. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs). Called in the toggleView method that switches between form, dashboard and datatable views.
 */
/*
const loadUserView = () => {};
*/

/**
 * Optional. If implemented, you can provide your own logic to manage unauthorized access to data or interface. Default, the framework calls noaccess().
 */

/*
const implement_noaccess = () => {};
*/

const  updateConfig = (entitySet, name, contentType, media, sid) =>{

  // CREATE ENTITYSET IF MISSING
  function step1(entitySet, name, contentType, media, sid) {
    let defer = $.Deferred();

    let ajaxSetting1 = {
      method: 'GET',
      url: entitySet + '?$skip=0&$top=1',
    };
    if (sid) {
      ajaxSetting1.headers = {'Authorization': 'AuthSession ' + sid}
    }

    $.ajax(ajaxSetting1).then(function (data, textStatus, jqXHR) {
      defer.resolve(data, textStatus, jqXHR);
    }, function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 404) {
        let ajaxSetting2 = {
          contentType: 'text/plain',
          data: '',
          method: 'POST',
          url: entitySet
        };
        if (sid) {
          ajaxSetting2.headers = {'Authorization': 'AuthSession ' + sid}
        }

        $.ajax(ajaxSetting2).then(function (data, textStatus, jqXHR) {
          defer.resolve(data, textStatus, jqXHR);
        }, function (jqXHR, textStatus, errorThrown) {
          defer.reject(jqXHR, textStatus, errorThrown);
        });
      } else {
        defer.reject(jqXHR, textStatus, errorThrown);
      }
    });

    return defer.promise();
  }

  // CREATE ENTITY IF MISSING
  function step2(entitySet, name, contentType, media, sid) {
    let defer = $.Deferred();

    let ajaxSetting1 = {
      method: 'GET',
      url: entitySet + '(\'' + name + '\')'
    };
    if (sid) {
      ajaxSetting1.headers = {'Authorization': 'AuthSession ' + sid}
    }

    $.ajax(ajaxSetting1).then(function (data, textStatus, jqXHR) {
      defer.resolve(data, textStatus, jqXHR);
    }, function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 404) {
        let ajaxSetting2 = {
          contentType: 'application/json',
          data: JSON.stringify({id: name}),
          method: 'POST',
          url: entitySet,
        };
        if (sid) {
          ajaxSetting2.headers = {'Authorization': 'AuthSession ' + sid}
        }

        $.ajax(ajaxSetting2).then(function (data, textStatus, jqXHR) {
          defer.resolve(data, textStatus, jqXHR);
        }, function (jqXHR, textStatus, errorThrown) {
          defer.reject(jqXHR, textStatus, errorThrown);
        });
      } else {
        defer.reject(jqXHR, textStatus, errorThrown);
      }
    });

    return defer.promise();
  }

  // ADD MEDIA
  function step3(entitySet, name, contentType, media, sid) {
    let defer = $.Deferred();

    contentType = contentType !== 'application/json' ? contentType : 'text/plain';

    let ajaxSetting = {
      contentType: contentType,
      data: media,
      method: 'PUT',
      url: entitySet + '(\'' + name + '\')/$value',
    };
    if (sid) {
      ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid}
    }

    $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
      defer.resolve(data, textStatus, jqXHR);
    }, function (jqXHR, textStatus, errorThrown) {
      defer.reject(jqXHR, textStatus, errorThrown);
    });

    return defer.promise();
  }

  // CLEAN UP IF NEEDED
  function step4(entitySet, name, contentType, media, sid) {
    let defer = $.Deferred();

    if (contentType === 'application/json') {
      let ajaxSetting = {
        contentType: contentType,
        data: JSON.stringify({
          '@odata.mediaContentType': contentType,
          __ContentType: contentType,
          id: name
        }),
        method: 'PUT',
        url: entitySet + '(\'' + name + '\')'
      };
      if (sid) {
        ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid}
      }

      $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
        defer.resolve(data, textStatus, jqXHR);
      }, function (jqXHR, textStatus, errorThrown) {
        defer.reject(jqXHR, textStatus, errorThrown);
      });
    } else {
      defer.resolve();
    }

    return defer.promise();
  }

  let defer = $.Deferred();

  step1(entitySet, name, contentType, media, sid)
    .then(function (data, textStatus, jqXHR) {
      step2(entitySet, name, contentType, media, sid)
        .then(function (data, textStatus, jqXHR) {
          step3(entitySet, name, contentType, media, sid)
            .then(function (data, textStatus, jqXHR) {
              step4(entitySet, name, contentType, media, sid)
                .then(function (data, textStatus, jqXHR) {
                  defer.resolve(data, textStatus, jqXHR);
                }, function (jqXHR, textStatus, errorThrown) {
                  defer.reject(jqXHR, textStatus, errorThrown);
                });
            }, function (jqXHR, textStatus, errorThrown) {
              defer.reject(jqXHR, textStatus, errorThrown);
            });
        }, function (jqXHR, textStatus, errorThrown) {
          defer.reject(jqXHR, textStatus, errorThrown);
        });
    }, function (jqXHR, textStatus, errorThrown) {
      defer.reject(jqXHR, textStatus, errorThrown);
    });

  return defer.promise();
};

const patchConfig = (dataURL, configURL, appName, configName, targetObject, successCallBack, processor) =>{
  let deferred = new $.Deferred();

  $.when(
    $.ajax({
      "url": dataURL,
      "type": "GET",
      "dataType": "json",
      "headers": {
        "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
        "Content-Type": "application/json; charset=utf-8;",
        "Cache-Control": "no-cache"
      }
    }),
    $.ajax({
      "url": configURL + "('" + configName + "')/$value",
      //"url": configURL + "/ConfigContent",
      "type": "GET",
      "dataType": "json",
      "headers": {
        "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
        "Content-Type": "application/json; charset=utf-8;",
        "Cache-Control": "no-cache"
      }
    }))
    .done(function (first, second) {
      let data = first[0];
      let conf = second[0];

      if (typeof processor === "function") {
        conf[targetObject] = processor(conf, data);
      }
      else {
        conf[targetObject] = data;
      }
      /** Set the global scope variable config with the new value so the user has it in memory*/
      config[targetObject] = conf[targetObject];
      let payload = JSON.stringify(conf);
      updateConfig(configURL, "system_variables.js", "application/javascript", "var sys_config = " + payload + "", Cookies.get(config.default_repo + ".sid")).then(function () {
      });
      updateConfig(configURL, "site_variables.json", "application/json", payload, Cookies.get(config.default_repo + ".sid")).then(
        function () {
          if (typeof successCallBack === "function") {
            successCallBack(conf)
          }
          deferred.resolve(conf);
        }
      );
      /*
      $.ajax({
        "url": configURL,
        "type": "PATCH",
        "data": JSON.stringify(payload),
        "dataType": "json",
        "headers": {
          "Authorization": "AuthSession " + getCookie(appName + '.sid'),
          "Content-Type": "application/json; charset=utf-8;",
          "Cache-Control": "no-cache"
        }
      })
        .success(function (data, textStatus, jqXHR) {
          typeof successCallBack === "function" ? successCallBack(data) : "";
          deferred.resolve(data);
        }).error(function (jqXHR, textStatus, errorThrown) {
        deferred.resolve(jqXHR)
      });
      */
    });

  return deferred.promise();
};