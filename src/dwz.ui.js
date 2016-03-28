function initEnv() {
  $("body").append(DWZ.frag["dwzFrag"]);

  if ($.browser.msie && /6.0/.test(navigator.userAgent)) {
    try {
      document.execCommand("BackgroundImageCache", false, true);
    } catch (e) {
    }
  }
  // 清理浏览器内存,只对IE起效
  if ($.browser.msie) {
    window.setInterval("CollectGarbage();", 10000);
  }

  $(window).resize(function () {
    initLayout();
    $(this).trigger(DWZ.eventType.resizeGrid);
  });

  var ajaxbg = $("#background,#progressBar");
  ajaxbg.hide();
  $(document).ajaxStart(function () {
    ajaxbg.show();
  }).ajaxStop(function () {
    ajaxbg.hide();
  });

  $("#leftside").jBar({
    minW: 150,
    maxW: 700
  });

  if ($.taskBar)
    $.taskBar.init();
  navTab.init();
  if ($.fn.switchEnv)
    $("#switchEnvBox").switchEnv();
  if ($.fn.navMenu)
    $("#navMenu").navMenu();

  setTimeout(function () {
    initLayout();
    initUI();

    var jTabsPH = $("div.tabsPageHeader");
    jTabsPH.find(".tabsLeft").hoverClass("tabsLeftHover");
    jTabsPH.find(".tabsRight").hoverClass("tabsRightHover");
    jTabsPH.find(".tabsMore").hoverClass("tabsMoreHover");
  }, 10);
}

function initLayout() {
  var iContentW = $(window).width() - (DWZ.ui.sbar ? $("#sidebar").width() + 10 : 34) - 5;
  var iContentH = $(window).height() - $("#header").height() - 34;

  $("#container").width(iContentW);
  $("#container .tabsPageContent").height(iContentH - 34).find("[layoutH]").layoutH();
  $("#sidebar, #sidebar_s .collapse, #splitBar, #splitBarProxy").height(iContentH - 5);
  $("#taskbar").css({
    top: iContentH + $("#header").height() + 5,
    width: $(window).width()
  });
}

function initUI(_box) {
  var $p = $(_box || document);

  $("div.panel", $p).jPanel();
  $("table.table", $p).jTable();
  $('table.list', $p).cssTable();
  $("div.tabs", $p).each(function () {
    var $this = $(this);
    var options = {};
    options.currentIndex = $this.attr("currentIndex") || 0;
    options.eventType = $this.attr("eventType") || "click";
    $this.tabs(options);
  });
  $("ul.tree", $p).jTree();
  $('div.accordion', $p).each(function () {
    var $this = $(this);
    $this.accordion({
      fillSpace: $this.attr("fillSpace"),
      alwaysOpen: true,
      active: 0
    });
  });
  $(":button.checkboxCtrl, :checkbox.checkboxCtrl", $p).checkboxCtrl($p);
  $("select.combox", $p).combox();
  $("textarea.editor", $p).each(function () {
    var $this = $(this);
    var op = {
      html5Upload: false,
      skin: 'vista',
      tools: $this.attr("tools") || 'full'
    };
    var upAttrs = [
      [
        "upLinkUrl", "upLinkExt", "zip,rar,txt"
      ], [
        "upImgUrl", "upImgExt", "jpg,jpeg,gif,png"
      ], [
        "upFlashUrl", "upFlashExt", "swf"
      ], [
        "upMediaUrl", "upMediaExt", "avi"
      ]
    ];

    $(upAttrs).each(function (i) {
      var urlAttr = upAttrs[i][0];
      var extAttr = upAttrs[i][1];

      if ($this.attr(urlAttr)) {
        op[urlAttr] = $this.attr(urlAttr);
        op[extAttr] = $this.attr(extAttr) || upAttrs[i][2];
      }
    });

    $this.xheditor(op);
  });

  $(":file[uploaderOption]", $p).each(function () {
    var $this = $(this);
    var options = {
      fileObjName: $this.attr("name") || "file",
      auto: true,
      multi: true,
      onUploadError: uploadifyError
    };

    var uploaderOption = DWZ.jsonEval($this.attr("uploaderOption"));
    $.extend(options, uploaderOption);

    DWZ.debug("uploaderOption: " + DWZ.obj2str(uploaderOption));

    $this.uploadify(options);
  });

  $("input[type=text], input[type=password], textarea", $p).addClass("textInput").focusClass("focus");
  $("input[readonly], textarea[readonly]", $p).addClass("readonly");
  $("input[disabled=true], textarea[disabled=true]", $p).addClass("disabled");
  $("input[type=text]", $p).not("div.tabs input[type=text]", $p).filter("[alt]").inputAlert();
  $("div.panelBar li, div.panelBar", $p).hoverClass("hover");
  $("div.button", $p).hoverClass("buttonHover");
  $("div.buttonActive", $p).hoverClass("buttonActiveHover");
  $("div.tabsHeader li, div.tabsPageHeader li, div.accordionHeader, div.accordion", $p).hoverClass("hover");

  $("form.validateForm", $p).each(function () {
    var $form = $(this);
    $form.validate({
      onsubmit: false,
      focusInvalid: false,
      focusCleanup: true,
      errorElement: "span",
      ignore: ".ignore",
      invalidHandler: function (form, validator) {
        var errors = validator.numberOfInvalids();
        if (errors) {
          var message = DWZ.msg("validateFormError", [
            errors
          ]);
          alertMsg.error(message);
        }
      }
    });

    $form.find('input[customvalid]').each(function () {
      var $input = $(this);
      $input.rules("add", {
        customvalid: $input.attr("customvalid")
      })
    });

    if (!$form.attr("onsubmit")) {
      $form.attr("onsubmit", "return validateCallback(this, allAjaxDone)");
    }
    $form.attr("method", "post");
  });

  $("form.pagerForm", $p).each(function () {
    var $form = $(this);

    if (!$form.attr("onsubmit")) {
      $form.attr("onsubmit", "return ajaxSearch(this)");
    }
    $form.attr("method", "post");
  });

  if ($.fn.datepicker) {
    $('input.date', $p).each(function () {
      var $this = $(this);
      var opts = {};
      if ($this.attr("dateFmt"))
        opts.pattern = $this.attr("dateFmt");
      if ($this.attr("minDate"))
        opts.minDate = $this.attr("minDate");
      if ($this.attr("maxDate"))
        opts.maxDate = $this.attr("maxDate");
      if ($this.attr("mmStep"))
        opts.mmStep = $this.attr("mmStep");
      if ($this.attr("ssStep"))
        opts.ssStep = $this.attr("ssStep");
      $this.datepicker(opts);
    });
  }

  $("a[target=navTab]", $p).each(function () {
    $(this).click(function (event) {
      var $this = $(this);
      var title = $this.attr("title") || $this.text();
      var tabid = $this.attr("rel") || "_blank";
      var fresh = eval($this.attr("fresh") || "true");
      var external = eval($this.attr("external") || "false");
      var url = unescape($this.attr("href")).replaceTmById($(event.target).unitBox());
      DWZ.debug(url);
      if (!url.isFinishedTm()) {
        alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
        return false;
      }
      navTab.openTab(tabid, url, {
        title: title,
        fresh: fresh,
        external: external
      });

      event.preventDefault();
    });
  });

  $("a[target=dialog]", $p).each(function () {
    $(this).click(function (event) {
      var $this = $(this);
      var title = $this.attr("title") || $this.text();
      var rel = $this.attr("rel") || "_blank";
      var options = {};
      var w = $this.attr("width") || "M";
      var h = $this.attr("height") || "M";
      options.width = DWZ.dialogWidth[w] || w;
      options.height = DWZ.dialogHeight[h] || h;
      options.max = eval($this.attr("max") || "false");
      options.mask = eval($this.attr("mask") || "true");
      options.maxable = eval($this.attr("maxable") || "false");
      options.minable = eval($this.attr("minable") || "false");
      options.fresh = eval($this.attr("fresh") || "true");
      options.resizable = eval($this.attr("resizable") || "false");
      options.drawable = eval($this.attr("drawable") || "true");
      options.close = eval($this.attr("close") || "");
      options.param = $this.attr("param") || "";

      var url = unescape($this.attr("href")).replaceTmById($(event.target).unitBox());
      DWZ.debug(url);
      if (!url.isFinishedTm()) {
        alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
        return false;
      }
      $.pdialog.open(url, rel, title, options);

      return false;
    });
  });

  $("a[target=ajax]", $p).each(function () {
    $(this).click(function (event) {
      var $this = $(this);
      var rel = $this.attr("rel");
      if (rel) {
        var $rel = $("#" + rel, $this.unitBox());
        $rel.loadUrl($this.attr("href"), {}, function () {
          $rel.find("[layoutH]").layoutH();
        });
      }

      event.preventDefault();
    });
  });

  $("div.pagination", $p).each(function () {
    var $this = $(this);
    $this.pagination({
      totalCount: $this.attr("totalCount"),
      numPerPage: $this.attr("numPerPage"),
      pageNumShown: $this.attr("pageNumShown"),
      currentPage: $this.attr("currentPage")
    });
  });

  $("div.pages select", $p).each(function () {
    $(this).change(function () {
      var form = $(this).getPagerForm().get(0);
      form[DWZ.pageInfo.numPerPage].value = this.value;
      ajaxSearch(form);
    });
  });

  $("div.sortDrag", $p).sortDrag();

  $("a[target=ajaxTodo]", $p).ajaxTodo();
  $("a[target=dwzExport]", $p).dwzExport();

  $("a[lookupGroup]", $p).lookup();
  $("[multLookup]:button", $p).multLookup();
  $("input[suggestFields]", $p).suggest();
  $("table.masterSlave", $p).masterSlave();
  $("a[target=selectedTodo]", $p).selectedTodo();

  // 处理awesome字体图标
  $("[class*=fa-]:not(i)", $p).each(function () {
    var i = $("<i></i>");
    i.css("line-height", "inherit");
    i.addClass("fa");
    var classes = $(this).attr("class").split(" ");
    for (var x in classes) {
      if (classes[x].startsWith("fa-")) {
        i.addClass(classes[x]);
        $(this).removeClass(classes[x]);
      }
    }
    if (!$(this).is(":empty")) {
      $(this).prepend("&nbsp;");
    }
    $(this).prepend(i);
  });

  // 处理图片轮播组件
  $("div.slider").each(function () {
    var $this = $(this);
    var op = {
      width: $this.attr("width") || "100%",
      height: $this.attr("height") || "100%",
      responsive: true,
      nexttext: '<i class="fa fa-arrow-right"></i>',
      prevtext: '<i class="fa fa-arrow-left"></i>'
    };
    $this.bjqs(op);
  });

  if ($.fn.viewSource) {
    $("a.viewsource", $p).viewSource();
  }

  $.each(DWZ.regPlugins, function (index, fn) {
    fn($p);
  });
}
