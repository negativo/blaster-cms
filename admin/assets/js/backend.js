!function(a,b,c,d){var e={max_filesize:2e6,init:function(){e.setup(),e.plugins.init(),e.bindEvents()},setup:function(){a(c).ajaxError(function(a,b){console.log("You are not authorized to do this action!"),403===b.status?toastr.error("Your are not authorized to do this!","Contact the admin!"):401===b.status?toastr.error("Unsuccessful authentication","Try again!"):toastr.error("There was an error with your request","Contact the admin")});var d=a(b).height();d-=a(".form-container").height(),d/=2,d-=20,a(".form-container").css({"margin-top":d}),a(".form-container").fadeIn()},bindEvents:function(){a("#avatarUploaderForm");a("body").delegate(".upload-file","click",function(){a("#media-upload-form").find("input").trigger("click")}),a("#media-upload-form").submit(function(a){a.preventDefault()}),a(".editor").submit(e.postPageEditor),a("#file-upload").change(e.media_upload),a("body").on("click",".remove-media",e.remove_media)},plugins:{init:function(){$body=a("body"),e.plugins.momentjs(),e.plugins.toastrjs(),$body.find(".editor").length&&e.plugins.editor(),"edit-theme"===$body.attr("class")&&e.plugins.codemirror()},editor:function(){tinymce.PluginManager.load("tinyvision","/components/tinyvision/build/plugin.min.js"),tinymce.init({selector:"#text-editor",height:500,plugins:["advlist autolink lists link image imagetools charmap preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table contextmenu paste -tinyvision "],toolbar:"insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",tinyvision:{source:"/api/file-browser"}})},momentjs:function(){$body=a("body"),a(".date").hide(),a(".date").each(function(b){var c=new Date(a(this).text());a(this).text(moment(c).fromNow(!0)),a(".date").show()})},toastrjs:function(){toastr.options.closeButton=!0},codemirror:function(){var a=c.getElementById("custom-css-area"),d=CodeMirror.fromTextArea(a,{lineNumbers:!0,mode:"css"});b.CODE_EDITOR=d}},media_upload:function(c){c.preventDefault(),c.stopPropagation();var d=new FormData;$button=a("body").find(".upload-file"),$button.html('<i class="fa fa-cog fa-spin"></i>');for(var f=[],f=a("#media-upload-form").find("input")[0].files,g=0;g<f.length;g++)f[g].size<=e.max_filesize?d.append("upload",f[g]):toastr.error("File too big (max "+e.max_filesize+"):<br>"+f[g].name);a.ajax({url:"/api/upload",type:"POST",cache:!1,processData:!1,contentType:!1,data:d,success:function(c){$button.html('<i class="fa fa-upload"></i>'),toastr.success("Media Uploaded"),console.log("backend.js :112",c),a("#media-upload-form")[0].reset(),setTimeout(function(){b.location.reload()},1e3)}})},postPageEditor:function(c){c.preventDefault(),tinyMCE.triggerSave();var d=a(".editor").attr("id"),e=a("#templates-choice").val()||"page-template",f={id:a(".editor").data("id"),title:a(".editor-title").val(),body:a("#text-editor").val(),template:e,tags:[]};""==f.title&&(f.title="My New Content"),"editor-post"===d&&""===f.id&&(f.tags=a(".tags-input").val().split(","),a.post("/api/post",f,function(a,c){console.log(a),"success"===c&&(toastr.success("Post created!"),setTimeout(function(){b.location.replace("/admin/posts")},1e3))})),"editor-post"===d&&""!==f.id&&(f.tags=a(".tags-input").val().split(","),a.post("/api/post/"+f.id,f,function(a,c){console.log(c),"success"===c&&(toastr.success("Post edited!"),setTimeout(function(){b.location.replace("/admin/posts")},1e3))})),"editor-page"===d&&""===f.id&&(f.tags=[],a.post("/api/page",f,function(a,c){console.log(a),"success"===c&&(toastr.success("Page created!"),setTimeout(function(){b.location.replace("/admin/pages")},1e3))})),"editor-page"===d&&""!==f.id&&(f.tags=[],a.post("/api/page/"+f.id,f,function(a,c){console.log(c),"success"===c&&(toastr.success("Page edited!"),setTimeout(function(){b.location.replace("/admin/pages")},1e3))}))},remove_media:function(b){b.preventDefault(),b.stopPropagation();var c=a(this).parent().parent(),d=a(this).next().data("id");swal({title:"Are you sure?",text:"You will not be able to recover this image!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!0},function(){a.ajax({url:"/api/media/"+d,type:"delete",success:function(a){"delete"===a&&c.fadeOut()}})})}};b.pageReload=function(){return setTimeout(function(){b.location.reload()},1500)},a(c).ready(function(){e.init()})}(jQuery,this,document);