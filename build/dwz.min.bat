cd %cd%

type ..\src\dwz.util.js > dwz.min.js
type ..\src\dwz.util.string.js >> dwz.min.js
type ..\src\dwz.util.date.js >> dwz.min.js
type ..\src\dwz.util.number.js >> dwz.min.js

type ..\src\dwz.core.js >> dwz.min.js
type ..\src\dwz.validate.method.js >> dwz.min.js
type ..\src\dwz.barDrag.js >> dwz.min.js
type ..\src\dwz.drag.js >> dwz.min.js
type ..\src\dwz.tree.js >> dwz.min.js
type ..\src\dwz.accordion.js >> dwz.min.js
type ..\src\dwz.ui.js >> dwz.min.js
type ..\src\dwz.theme.js >> dwz.min.js
type ..\src\dwz.switchEnv.js >> dwz.min.js

type ..\src\dwz.alertMsg.js >> dwz.min.js
type ..\src\dwz.contextmenu.js >> dwz.min.js
type ..\src\dwz.navTab.js >> dwz.min.js
type ..\src\dwz.tab.js >> dwz.min.js
type ..\src\dwz.resize.js >> dwz.min.js
type ..\src\dwz.dialog.js >> dwz.min.js
type ..\src\dwz.dialogDrag.js >> dwz.min.js
type ..\src\dwz.sortDrag.js >> dwz.min.js
type ..\src\dwz.cssTable.js >> dwz.min.js
type ..\src\dwz.stable.js >> dwz.min.js
type ..\src\dwz.taskBar.js >> dwz.min.js
type ..\src\dwz.ajax.js >> dwz.min.js
type ..\src\dwz.pagination.js >> dwz.min.js
type ..\src\dwz.lookup.js >> dwz.min.js
type ..\src\dwz.suggest.js >> dwz.min.js
type ..\src\dwz.masterSlave.js >> dwz.min.js
type ..\src\dwz.datepicker.js >> dwz.min.js
type ..\src\dwz.effects.js >> dwz.min.js
type ..\src\dwz.panel.js >> dwz.min.js
type ..\src\dwz.checkbox.js >> dwz.min.js
type ..\src\dwz.combox.js >> dwz.min.js
type ..\src\dwz.history.js >> dwz.min.js
type ..\src\dwz.print.js >> dwz.min.js
type ..\src\dwz.regional.zh.js >> dwz.min.js

rem uglifyjs dwz.min.js -o dwz.min.js -c -m