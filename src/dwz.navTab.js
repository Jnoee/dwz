/**
 * @author ZhangHuihua@msn.com
 *
 */
var navTab = {
  componentBox: null, // tab component. contain tabBox, prevBut, nextBut, panelBox
  _tabBox: null,
  _prevBut: null,
  _nextBut: null,
  _panelBox: null,
  _moreBut: null,
  _moreBox: null,
  _currentIndex: 0,

  _op: {
    id: "navTab",
    stTabBox: ".navTab-tab",
    stPanelBox: ".navTab-panel",
    mainTabId: "main",
    close$: "a.close",
    prevClass: "tabsLeft",
    nextClass: "tabsRight",
    stMore: ".tabsMore",
    stMoreLi: "ul.tabsMoreList"
  },

  init: function (options) {
    if ($.History)
      $.History.init("#container");
    var $this = this;
    $.extend(this._op, options);

    this.componentBox = $("#" + this._op.id);
    this._tabBox = this.componentBox.find(this._op.stTabBox);
    this._panelBox = this.componentBox.find(this._op.stPanelBox);
    this._prevBut = this.componentBox.find("." + this._op.prevClass);
    this._nextBut = this.componentBox.find("." + this._op.nextClass);
    this._moreBut = this.componentBox.find(this._op.stMore);
    this._moreBox = this.componentBox.find(this._op.stMoreLi);

    this._prevBut.click(function () {
      $this._scrollPrev()
    });
    this._nextBut.click(function () {
      $this._scrollNext()
    });
    this._moreBut.click(function () {
      $this._moreBox.show();
      return false;
    });
    $(document).click(function () {
      $this._moreBox.hide()
    });

    this._contextmenu(this._tabBox);
    this._contextmenu(this._getTabs());

    this._init();
    this._ctrlScrollBut();
  },
  _init: function () {
    var $this = this;
    this._getTabs().each(function (iTabIndex) {
      $(this).unbind("click").click(function () {
        $this._switchTab(iTabIndex);
      });
      $(this).find(navTab._op.close$).unbind("click").click(function () {
        $this._closeTab(iTabIndex);
      });
    });
    this._getMoreLi().each(function (iTabIndex) {
      $(this).find(">a").unbind("click").click(function () {
        $this._switchTab(iTabIndex);
      });
    });

    this._switchTab(this._currentIndex);
  },
  _contextmenu: function ($obj) { // navTab右键菜单
    var $this = this;
    $obj.contextMenu('navTabCM', {
      bindings: {
        reload: function (t) {
          t.data("flag", 1);
          $this._reload(t, true);
        },
        closeCurrent: function (t) {
          var tabId = t.attr("tabid");
          if (tabId)
            $this.closeTab(tabId);
          else
            $this.closeCurrentTab();
        },
        closeOther: function (t) {
          var index = $this._indexTabId(t.attr("tabid"));
          $this._closeOtherTab(index > 0 ? index : $this._currentIndex);
        },
        closeAll: function () {
          $this.closeAllTab();
        }
      },
      ctrSub: function (t, m) {
        var mReload = m.find("[rel='reload']");
        var mCur = m.find("[rel='closeCurrent']");
        var mOther = m.find("[rel='closeOther']");
        var mAll = m.find("[rel='closeAll']");
        var $tabLi = $this._getTabs();
        if ($tabLi.size() < 2) {
          mCur.addClass("disabled");
          mOther.addClass("disabled");
          mAll.addClass("disabled");
        }
        if ($this._currentIndex == 0 || t.attr("tabid") == $this._op.mainTabId) {
          mCur.addClass("disabled");
          mReload.addClass("disabled");
        } else if ($tabLi.size() == 2) {
          mOther.addClass("disabled");
        }

      }
    });
  },

  _getTabs: function () {
    return this._tabBox.find("> li");
  },
  _getPanels: function () {
    return this._panelBox.find("> div");
  },
  _getMoreLi: function () {
    return this._moreBox.find("> li");
  },
  _getTab: function (tabid) {
    var index = this._indexTabId(tabid);
    if (index >= 0)
      return this._getTabs().eq(index);
  },
  getPanel: function (tabid) {
    var index = this._indexTabId(tabid);
    if (index >= 0)
      return this._getPanels().eq(index);
  },
  _getTabsW: function (iStart, iEnd) {
    return this._tabsW(this._getTabs().slice(iStart, iEnd));
  },
  _tabsW: function ($tabs) {
    var iW = 0;
    $tabs.each(function () {
      iW += $(this).outerWidth(true);
    });
    return iW;
  },
  _indexTabId: function (tabid) {
    if (!tabid)
      return -1;
    var iOpenIndex = -1;
    this._getTabs().each(function (index) {
      if ($(this).attr("tabid") == tabid) {
        iOpenIndex = index;
        return;
      }
    });
    return iOpenIndex;
  },
  _getLeft: function () {
    return this._tabBox.position().left;
  },
  _getScrollBarW: function () {
    return this.componentBox.width() - 55;
  },

  _visibleStart: function () {
    var iLeft = this._getLeft(), iW = 0;
    var $tabs = this._getTabs();
    for (var i = 0; i < $tabs.size(); i++) {
      if (iW + iLeft >= 0)
        return i;
      iW += $tabs.eq(i).outerWidth(true);
    }
    return 0;
  },
  _visibleEnd: function () {
    var iLeft = this._getLeft(), iW = 0;
    var $tabs = this._getTabs();
    for (var i = 0; i < $tabs.size(); i++) {
      iW += $tabs.eq(i).outerWidth(true);
      if (iW + iLeft > this._getScrollBarW())
        return i;
    }
    return $tabs.size();
  },
  _scrollPrev: function () {
    var iStart = this._visibleStart();
    if (iStart > 0) {
      this._scrollTab(-this._getTabsW(0, iStart - 1));
    }
  },
  _scrollNext: function () {
    var iEnd = this._visibleEnd();
    if (iEnd < this._getTabs().size()) {
      this._scrollTab(-this._getTabsW(0, iEnd + 1) + this._getScrollBarW());
    }
  },
  _scrollTab: function (iLeft) {
    var $this = this;
    this._tabBox.animate({
      left: iLeft + 'px'
    }, 200, function () {
      $this._ctrlScrollBut();
    });
  },
  _scrollCurrent: function () { // auto scroll current tab
    var iW = this._tabsW(this._getTabs());
    if (iW <= this._getScrollBarW()) {
      this._scrollTab(0);
    } else if (this._getLeft() < this._getScrollBarW() - iW) {
      this._scrollTab(this._getScrollBarW() - iW);
    } else if (this._currentIndex < this._visibleStart()) {
      this._scrollTab(-this._getTabsW(0, this._currentIndex));
    } else if (this._currentIndex >= this._visibleEnd()) {
      this._scrollTab(this._getScrollBarW() - this._getTabs().eq(this._currentIndex).outerWidth(true) - this._getTabsW(0, this._currentIndex));
    }
  },
  _ctrlScrollBut: function () {
    var iW = this._tabsW(this._getTabs());
    if (this._getScrollBarW() > iW) {
      this._prevBut.hide();
      this._nextBut.hide();
      this._tabBox.parent().removeClass("tabsPageHeaderMargin");
    } else {
      this._prevBut.show().removeClass("tabsLeftDisabled");
      this._nextBut.show().removeClass("tabsRightDisabled");
      this._tabBox.parent().addClass("tabsPageHeaderMargin");
      if (this._getLeft() >= 0) {
        this._prevBut.addClass("tabsLeftDisabled");
      } else if (this._getLeft() <= this._getScrollBarW() - iW) {
        this._nextBut.addClass("tabsRightDisabled");
      }
    }
  },

  _switchTab: function (iTabIndex) {
    var $tab = this._getTabs().removeClass("selected").eq(iTabIndex).addClass("selected");

    if (DWZ.ui.hideMode == 'offsets') {
      this._getPanels().css({
        position: 'absolute',
        top: '-100000px',
        left: '-100000px'
      }).eq(iTabIndex).css({
        position: '',
        top: '',
        left: ''
      });
    } else {
      this._getPanels().hide().eq(iTabIndex).show();
    }

    this._getMoreLi().removeClass("selected").eq(iTabIndex).addClass("selected");
    this._currentIndex = iTabIndex;

    this._scrollCurrent();
    this._reload($tab);
  },

  _closeTab: function (index, openTabid) {

    this._getTabs().eq(index).remove();
    this._getPanels().eq(index).trigger(DWZ.eventType.pageClear).remove();
    this._getMoreLi().eq(index).remove();
    if (this._currentIndex >= index)
      this._currentIndex--;

    if (openTabid) {
      var openIndex = this._indexTabId(openTabid);
      if (openIndex > 0)
        this._currentIndex = openIndex;
    }

    this._init();
    this._scrollCurrent();
    this._reload(this._getTabs().eq(this._currentIndex));
  },
  closeTab: function (tabid) {
    var index = this._indexTabId(tabid);
    if (index > 0) {
      this._closeTab(index);
    }
  },
  closeCurrentTab: function (openTabid) { // openTabid 可以为空，默认关闭当前tab后，打开最后一个tab
    if (this._currentIndex > 0) {
      this._closeTab(this._currentIndex, openTabid);
    }
  },
  closeAllTab: function () {
    this._getTabs().filter(":gt(0)").remove();
    this._getPanels().filter(":gt(0)").trigger(DWZ.eventType.pageClear).remove();
    this._getMoreLi().filter(":gt(0)").remove();
    this._currentIndex = 0;
    this._init();
    this._scrollCurrent();
  },
  _closeOtherTab: function (index) {
    index = index || this._currentIndex;
    if (index > 0) {
      var str$ = ":eq(" + index + ")";
      this._getTabs().not(str$).filter(":gt(0)").remove();
      this._getPanels().not(str$).filter(":gt(0)").trigger(DWZ.eventType.pageClear).remove();
      this._getMoreLi().not(str$).filter(":gt(0)").remove();
      this._currentIndex = 1;
      this._init();
      this._scrollCurrent();
    } else {
      this.closeAllTab();
    }
  },

  _loadUrlCallback: function ($panel) {
    $panel.find("[layoutH]").layoutH();
    $panel.find(":button.close").click(function () {
      navTab.closeCurrentTab();
    });
  },
  _reload: function ($tab) {
    var op = {
      url: $tab.attr("url"),
      data: $tab.data("data") || {},
      callback: $tab.data("callback"),
      flag: $tab.data("flag")
    };

    var $panel = this.getPanel($tab.attr("tabid"));
    if (op.flag && op.url && $panel) {
      $tab.data("flag", null);

      if ($tab.hasClass("external")) {
        navTab.openExternal(op.url, $panel);
      } else {
        var $pagerForm = $panel.getPagerForm();
        if ($pagerForm) {
          $.extend(op.data, $pagerForm.serializeJson());
        }
        $.extend(op.data, op.url.getParams());

        $panel.ajaxUrl({
          type: "POST",
          url: op.url.cleanParams(),
          data: op.data,
          callback: function (response) {
            navTab._loadUrlCallback($panel);
            if ($.isFunction(op.callback))
              op.callback(response);
          }
        });
      }
    }
  },
  reload: function (options) {
    var op = $.extend({
      id: "",
      url: "",
      data: {},
      callback: null
    }, options);
    var $tab = op.id ? this._getTab(op.id) : this._getTabs().eq(this._currentIndex);
    if (op.url) {
      $tab.attr("url", op.url);
    } else {
      op.url = $tab.attr("url");
    }
    if ($.isEmptyObject(op.data)) {
      op.data = $tab.data("data") || {};
    } else {
      $tab.data("data", op.data);
    }
    $tab.data("callback", op.callback);
    $tab.data("flag", 1);
    if (!op.id) this._reload($tab);
  },
  getCurrentPanel: function () {
    return this._getPanels().eq(this._currentIndex);
  },
  checkTimeout: function () {
    var json = DWZ.jsonEval(this.getCurrentPanel().html());
    if (json && json[DWZ.keys.statusCode] == DWZ.statusCode.timeout)
      this.closeCurrentTab();
  },
  openExternal: function (url, $panel) {
    var ih = navTab._panelBox.height();
    $panel.html(DWZ.frag["externalFrag"].replaceAll("{url}", url).replaceAll("{height}", ih + "px"));
  },
  openTab: function (tabid, url, options) { // if found tabid replace tab, else create a new tab.
    var op = $.extend({
      title: "New Tab",
      type: "GET",
      data: {},
      fresh: true,
      external: false
    }, options);

    var iOpenIndex = this._indexTabId(tabid);

    if (iOpenIndex >= 0) {
      var $tab = this._getTabs().eq(iOpenIndex);
      var span$ = $tab.attr("tabid") == this._op.mainTabId ? "> span > span" : "> span";
      $tab.find(">a").attr("title", op.title).find(span$).html(op.title);
      var $panel = this._getPanels().eq(iOpenIndex);
      if (op.fresh || $tab.attr("url") != url) {
        $tab.attr("url", url);
        if (op.external || url.isExternalUrl()) {
          $tab.addClass("external");
          navTab.openExternal(url, $panel);
        } else {
          $tab.removeClass("external");
          $panel.ajaxUrl({
            type: op.type,
            url: url,
            data: op.data,
            callback: function () {
              navTab._loadUrlCallback($panel);
            }
          });
        }
      }
      this._currentIndex = iOpenIndex;
    } else {
      var tabFrag = '<li tabid="#tabid#"><a href="javascript:" title="#title#" class="#tabid#"><span>#title#</span></a><a href="javascript:;" class="close">close</a></li>';
      this._tabBox.append(tabFrag.replaceAll("#tabid#", tabid).replaceAll("#title#", op.title));
      this._panelBox.append('<div class="page unitBox"></div>');
      this._moreBox.append('<li><a href="javascript:" title="#title#">#title#</a></li>'.replaceAll("#title#", op.title));

      var $tabs = this._getTabs();
      var $tab = $tabs.filter(":last");
      var $panel = this._getPanels().filter(":last");

      if (op.external || url.isExternalUrl()) {
        $tab.addClass("external");
        navTab.openExternal(url, $panel);
      } else {
        $tab.removeClass("external");
        $panel.ajaxUrl({
          type: op.type,
          url: url,
          data: op.data,
          callback: function () {
            navTab._loadUrlCallback($panel);
          }
        });
      }

      if ($.History) {
        setTimeout(function () {
          $.History.addHistory(tabid, function (tabid) {
            var i = navTab._indexTabId(tabid);
            if (i >= 0)
              navTab._switchTab(i);
          }, tabid);
        }, 10);
      }

      this._currentIndex = $tabs.size() - 1;
      this._contextmenu($tabs.filter(":last").hoverClass("hover"));
    }

    this._init();
    this._scrollCurrent();

    this._getTabs().eq(this._currentIndex).attr("url", url);
  }
};