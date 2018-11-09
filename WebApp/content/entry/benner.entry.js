// ---------------------------------------------- //
//                      Style                     //
// ---------------------------------------------- //

import 'font-awesome/css/font-awesome.min.css';
import 'codemirror/lib/codemirror.css';
import 'summernote/dist/summernote.css';
import 'toastr/build/toastr.min.css';
import 'fancybox/dist/css/jquery.fancybox.css';
import 'fancybox/dist/helpers/css/jquery.fancybox-thumbs.css';
import '~/content/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css';
import '~/content/assets/global/plugins/bootstrap/css/bootstrap.min.css';
import '~/content/assets/plugins/jquery.minicolors/jquery.minicolors.css';
import '~/content/assets/global/plugins/simple-line-icons/simple-line-icons.min.css';
import '~/content/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css';
import '~/content/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css';
import '~/content/assets/global/plugins/select2/css/select2.min.css';
import '~/content/assets/global/plugins/select2/css/select2-bootstrap.min.css';
import '~/content/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css';
import '~/content/assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css';
import '~/content/assets/global/plugins/jquery-tags-input/jquery.tagsinput.css';
import '~/content/assets/global/plugins/typeahead/typeahead.css';
import '~/content/assets/plugins/amcharts/plugins/export/export.css';
import '~/content/assets/plugins/bootstrap-tour/css/bootstrap-tour.min.css';
import '~/content/assets/plugins/dx-pivotgrid/css/dx.common.css';
import '~/content/assets/plugins/dx-pivotgrid/css/dx.light.css';
import '~/content/assets/global/css/components.min.css';
import '~/content/assets/global/css/plugins.min.css';
import '~/content/assets/layouts/layout/css/layout.min.css';

import '~/content/css/flaticon.css';
import '~/content/css/flaticonExcel.css';
import '~/content/css/fonts.css';
import '~/content/css/wes.css';
import '~/content/css/forms.css';
import '~/content/css/grids.css';
import '~/content/css/notifications.css';
import '~/content/css/viewEditors.css';
import '~/content/css/searcher.css';
import '~/content/css/pivottable.css';
import "~/content/css/chatbot.css";

// ---------------------------------------------- //
//                   JavaScript                   //
// ---------------------------------------------- //

import 'babel-polyfill';

import 'jquery-slimscroll';
import 'bootstrap';
import 'bootstrap-hover-dropdown';
import '~/content/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker';
import '~/content/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.pt-BR.min';
import 'summernote';
import 'summernote/dist/lang/summernote-pt-BR.min.js';
import 'autonumeric';
import 'headjs/dist/1.0.0/head';
import '~/content/assets/global/plugins/counterup/jquery.waypoints.min.js';
import '~/content/assets/global/plugins/counterup/jquery.counterup.min.js';
import '~/content/assets/global/plugins/select2/js/select2.full.js';
import '~/content/assets/global/plugins/select2/js/i18n/pt-BR.js';

import '~/content/assets/plugins/amcharts/amcharts';
import 'amcharts3/amcharts/funnel';
import 'amcharts3/amcharts/gantt';
import 'amcharts3/amcharts/gauge';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/radar';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/xy';
import 'amcharts3/amcharts/lang/pt';
import 'amcharts3/amcharts/plugins/export/export';
import 'amcharts3/amcharts/plugins/export/lang/pt';
import 'amcharts3/amcharts/plugins/dataloader/dataloader';
import 'amcharts3/amcharts/themes/black';
import 'amcharts3/amcharts/themes/chalk';
import 'amcharts3/amcharts/themes/dark';
import 'amcharts3/amcharts/themes/light';
import 'amcharts3/amcharts/themes/patterns';

import '~/content/assets/plugins/bootstrap-tour/js/bootstrap-tour.min.js';
import '~/content/assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js';
import '~/content/assets/global/plugins/jquery-tags-input/jquery.tagsinput.js';

import '~/content/assets/global/plugins/typeahead/handlebars.min.js';
import '~/content/assets/global/plugins/typeahead/typeahead.bundle.js';
import '~/content/assets/global/plugins/jquery-easypiechart/jquery.easypiechart.min.js';
import '~/content/assets/global/plugins/jquery.sparkline.min.js';
import '~/content/assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.js';
import '~/content/assets/global/plugins/bootstrap-contextmenu/bootstrap-contextmenu.js';

import 'async';

import Layout from '~/content/assets/layouts/layout/scripts/layout.js';
window.Layout = Layout;

import Benner from '~/content/js/Page.js';
window.Benner = Benner;

import BennerForm from '~/content/js/Form.js';
window.Benner.Form = BennerForm;

import BennerHorizontalMenu from '~/content/js/BennerHorizontalMenu.js';
window.Benner.HorizontalMenu = BennerHorizontalMenu;

import BennerDate from '~/content/js/Date.js';
window.Benner.Date = BennerDate;

import BennerModalPage from '~/content/js/ModalPage.js';
window.Benner.ModalPage = BennerModalPage;

import BennerModalMessage from '~/content/js/ModalMessage.js';
window.Benner.ModalMessage = BennerModalMessage;

import BennerMessagePanel from '~/content/js/MessagePanel.js';
window.Benner.MessagePanel = BennerMessagePanel;

import BennerFormWidget from '~/content/js/FormWidget.js';
window.Benner.FormWidget = BennerFormWidget;

import BennerSearch from '~/content/js/BennerSearch.js';
window.Benner.Search = BennerSearch;

import BennerAsyncProcesses from '~/content/js/AsyncProcesses.js';
window.Benner.AsyncProcesses = BennerAsyncProcesses;

import BennerControl from '~/content/js/Control.js';
window.Benner.Control = BennerControl;

import BennerSidebar from '~/content/js/BennerSidebar.js';
window.Benner.Sidebar = BennerSidebar;

import BennerWidgetCommandsBar from '~/content/js/BennerWidgetCommandsBar.js';
window.Benner.WidgetCommandsBar = BennerWidgetCommandsBar;

import BennerDevelopment from '~/content/js/BennerDevelopment.js';
window.Benner.Development = BennerDevelopment;

import BennerAutoComplete from '~/content/js/BennerAutoComplete.js';
window.Benner.AutoComplete = BennerAutoComplete;

import BennerCustomLookup from '~/content/js/CustomLookup.js';
window.Benner.CustomLookup = BennerCustomLookup;

import BennerEditableGrid from '~/content/js/EditableGrid.js';
window.Benner.EditableGrid = BennerEditableGrid;

import BennerAmChartsWidget from '~/content/js/AmChartsWidget.js';
window.Benner.AmChartsWidget = BennerAmChartsWidget;

import BennerAmChartsAttributes from '~/content/js/AmChartsAttributes.js';
window.Benner.AmChartsAttributes = BennerAmChartsAttributes;

import BennerSourceEditor from '~/content/js/SourceEditor.js';
window.Benner.SourceEditor = BennerSourceEditor;

import BennerDataSourceEditor from '~/content/js/DataSourceEditor.js';
window.Benner.DataSourceEditor = BennerDataSourceEditor;

import BennerPivotTable from '~/content/js/PivotTable.js';
window.Benner.PivotTable = BennerPivotTable;

import BennerCollapsiblePanel from '~/content/js/CollapsiblePanel.js';
window.Benner.CollapsiblePanel = BennerCollapsiblePanel;

import BennerTextEditor from '~/content/js/TextEditor.js';
window.Benner.TextEditor = BennerTextEditor;

import BennerTile from '~/content/js/BennerTile.js';
window.Benner.Tile = BennerTile;

import BennerReportViewer from '~/content/js/ReportViewer.js';
window.Benner.ReportViewer = BennerReportViewer;

import BennerServices from '~/content/js/Services.js';
window.Benner.Services = BennerServices;

import BennerEditCustomField from '~/content/js/EditCustomField.js';
window.Benner.EditCustomField = BennerEditCustomField;

import BennerGrid from '~/content/js/Grid.js';
window.Benner.Grid = BennerGrid;

import BennerTabMenu from '~/content/js/TabMenu.js';
window.Benner.TabMenu = BennerTabMenu;

import BennerCommandsPanel from '~/content/js/CommandsPanel.js';
window.Benner.CommandsPanel = BennerCommandsPanel;

import BennerWebTour from '~/content/js/WebTour.js';
window.WebTour = BennerWebTour;

import BennerSilverlight from '~/content/js/SilverlightScript.js';
window.Benner.Silverlight = BennerSilverlight;

import BennerMap from '~/content/js/BennerMap.js';
window.Benner.Map = BennerMap;

import BennerChatBot from '~/content/js/ChatBot.js';
window.Benner.ChatBot = BennerChatBot;

import BennerSearcher from '~/content/js/Searcher.js';
window.BennerSearcher = BennerSearcher;

import BennerArtifactsDiff from '~/content/js/ArtifactsDiff.js';
window.BennerArtifactsDiff = BennerArtifactsDiff;

import BennerLogin from '~/content/js/Login.js';
window.BennerLogin = BennerLogin;

import '~/content/js/Extensions.js';
import '~/content/js/Hack.js';

import Bloodhound from 'bloodhound-js';
window.Bloodhound = Bloodhound;

import CodeMirror from 'codemirror';
window.CodeMirror = CodeMirror;

import Toastr from 'toastr';
window.toastr = Toastr;

import $ from 'jquery';
window.$ = window.jQuery = $;

require('fancybox')($);

import _ from 'lodash'
window._ = _;

import 'blockui-npm';
import 'inputmask/dist/min/jquery.inputmask.bundle.min.js';

import App from '~/content/assets/global/scripts/app.js';
window.App = App;

import Bootbox from 'bootbox';
window.bootbox = Bootbox;

require('webpack-jquery-ui/sortable');
require('~/content/assets/global/plugins/bootstrap-tabdrop/js/bootstrap-tabdrop.js');