!function(a,b,c,d){var e={init:function(){console.log("dummy.js :5","settings up"),this.bindEvents()},bindEvents:function(){var b=a(".add-social-link"),c=a("#settings-form");$socialsContainer=a(".social-link-container"),$socialLink=a(".social-link"),getLinks=[],a(".remove-sopcial-link").click(function(b){b.preventDefault(),a(this).parent().remove()}),b.click(function(a){$socialsContainer.append('<div class="form-group"><label for="text" contenteditable>Edit this label to the social name</label><input type="text" class="form-control social-link" placeholder="Social Link"></div>')}),c.submit(e.settingUpdate),a("#custom-css-form").submit(e.customCss),a("#themes-form").submit(e.chooseTheme)},settingUpdate:function(b){b.preventDefault(),$socialsContainer.find(".social-link").each(function(b){var c={website:a(this).prev().text().trim(),link:a(this).val().trim()};getLinks.push(c)});var c={siteTitle:a("#site-title").val().trim(),subtitle:a("#site-subtitle").val().trim(),home:a("#homepage").val(),links:getLinks,analytics:a("#code-editor").val().replace(new RegExp("<?.script>","g"),"").trim()};console.log("backend.js :279",c),console.log("backend.js",c),a.post("/api/configuration",c,function(a,b){console.log("backend.js",a),getLinks=[],"success"===a&&toastr.success("Configurations Changed!")})},customCss:function(b){a(".custom-css");b.preventDefault();var c=CODE_EDITOR,d={css:c.getValue()};a.post("/api/custom-css",d,function(a,b){"success"===a&&toastr.success("Custom CSS updated!")})},chooseTheme:function(b){b.preventDefault();var c={theme:a("#avaible-themes").val()};a.post("/api/themes",c,function(a){"success"===a&&(toastr.success("Reload!","Theme changed"),pageReload())})}};return a(c).ready(function(){e.init()}),e}(jQuery,this,document);