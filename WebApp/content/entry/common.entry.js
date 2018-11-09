// ---------------------------------------------- //
//                      Style                     //
// ---------------------------------------------- //
import '~/content/assets/global/plugins/bootstrap/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '~/content/assets/global/plugins/simple-line-icons/simple-line-icons.min.css';
import '~/content/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css';
import '~/content/assets/global/css/components.css';
import '~/content/assets/global/css/plugins.min.css';
import '~/content/assets/layouts/layout/css/layout.min.css';
import '@claviska/jquery-minicolors/jquery.minicolors.css';
import '~/content/css/fonts.css';

// ---------------------------------------------- //
//                   JavaScript                   //
// ---------------------------------------------- //

import 'babel-polyfill';
import 'bootstrap';
import '@claviska/jquery-minicolors';

import Layout from '~/content/assets/layouts/layout/scripts/layout.js';
window.Layout = Layout;

import $ from 'jquery';
window.$ = window.jQuery = $;

import _ from 'lodash'
window._ = _;
