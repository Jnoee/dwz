cd %cd%

type ..\js\dwz.util.js > dwz.min.js
type ..\js\dwz.util.string.js >> dwz.min.js
type ..\js\dwz.util.date.js >> dwz.min.js
type ..\js\dwz.util.number.js >> dwz.min.js

type ..\js\dwz.core.js >> dwz.min.js
type ..\js\dwz.validate.method.js >> dwz.min.js
type ..\js\dwz.barDrag.js >> dwz.min.js
type ..\js\dwz.drag.js >> dwz.min.js
type ..\js\dwz.tree.js >> dwz.min.js
type ..\js\dwz.accordion.js >> dwz.min.js
type ..\js\dwz.ui.js >> dwz.min.js
type ..\js\dwz.theme.js >> dwz.min.js
type ..\js\dwz.switchEnv.js >> dwz.min.js

type ..\js\dwz.alertMsg.js >> dwz.min.js
type ..\js\dwz.contextmenu.js >> dwz.min.js
type ..\js\dwz.navTab.js >> dwz.min.js
type ..\js\dwz.tab.js >> dwz.min.js
type ..\js\dwz.resize.js >> dwz.min.js
type ..\js\dwz.dialog.js >> dwz.min.js
type ..\js\dwz.dialogDrag.js >> dwz.min.js
type ..\js\dwz.sortDrag.js >> dwz.min.js
type ..\js\dwz.cssTable.js >> dwz.min.js
type ..\js\dwz.stable.js >> dwz.min.js
type ..\js\dwz.taskBar.js >> dwz.min.js
type ..\js\dwz.ajax.js >> dwz.min.js
type ..\js\dwz.pagination.js >> dwz.min.js
type ..\js\dwz.lookup.js >> dwz.min.js
type ..\js\dwz.suggest.js >> dwz.min.js
type ..\js\dwz.masterSlave.js >> dwz.min.js
type ..\js\dwz.datepicker.js >> dwz.min.js
type ..\js\dwz.effects.js >> dwz.min.js
type ..\js\dwz.panel.js >> dwz.min.js
type ..\js\dwz.checkbox.js >> dwz.min.js
type ..\js\dwz.combox.js >> dwz.min.js
type ..\js\dwz.history.js >> dwz.min.js
type ..\js\dwz.print.js >> dwz.min.js
type ..\js\dwz.regional.zh.js >> dwz.min.js

uglifyjs dwz.min.js -o dwz.min.js -c -m