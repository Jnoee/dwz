/**
 * Theme Plugins
 * 
 * @author ZhangHuihua@msn.com
 */
(function($) {
  $.fn.extend({
    theme: function(options) {
      var op = $.extend({
        themeBase: "themes"
      }, options);
      var _themeHref = op.themeBase + "/#theme#/";
      return this.each(function() {
        var jThemeLi = $(this).find(">li[theme]");
        var setTheme = function(themeName) {
          $("head").find("link[href^='" + op.themeBase + "']").each(function() {
            var href = $(this).attr("href");
            var css = href.substring(href.lastIndexOf("/"));
            $(this).attr("href", op.themeBase + "/" + themeName + css);
          });
          jThemeLi.find(">div").removeClass("selected");
          jThemeLi.filter("[theme=" + themeName + "]").find(">div").addClass("selected");

          if ($.isFunction($.cookie)) $.cookie("dwz_theme", themeName);
        }

        jThemeLi.each(function(index) {
          var $this = $(this);
          var themeName = $this.attr("theme");
          $this.addClass(themeName).click(function() {
            setTheme(themeName);
          });
        });

        if ($.isFunction($.cookie)) {
          var themeName = $.cookie("dwz_theme");
          if (themeName) {
            setTheme(themeName);
          }
        }
      });
    }
  });
})(jQuery);
