/*jslint white: true nomen: true plusplus: true */
/*global mx, mxui, mendix, require, console, define, module */
/**

	SetFocusOnErrorWidget
	========================

	@file      : SetFocusOnErrorWidget.js
	@version   : 1.0
	@author    : Marcel Groeneweg
	@date      : 18-11-2014
	@copyright : Synobsys
	@license   : Apache License, Version 2.0, January 2004

	Documentation
    ========================
	Set focus on first input element with error.

*/

(function() {
    'use strict';

    require([

        'mxui/widget/_WidgetBase', 'dijit/_Widget', 'dojo/_base/declare', 
        'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-class', 'dojo/on', 'dojo/window',
        'dojo/domReady!'

    ], function (_WidgetBase, _Widget, declare, domMx, dom, domQuery, domClass, on, win) {

        // Declare widget.
        return declare('SetFocusOnErrorWidget.widget.SetFocusOnErrorWidget', [ _WidgetBase, _Widget ], {

            /**
             * Internal variables.
             * ======================
             */
            _contextGuid: null,
            _contextObj: null,
            _validationHandle: null,

            /**
             * Mendix Widget methods.
             * ======================
             */

            // DOJO.WidgetBase -> PostCreate is fired after the properties of the widget are set.
            postCreate: function () {

                // postCreate
                console.log('SetFocusOnErrorWidget - postCreate');

                // Load CSS ... automaticly from ui directory

                // Setup widgets
                this._setupWidget();

            },

            // DOJO.WidgetBase -> Startup is fired after the properties of the widget are set.
            startup: function () {

            },

            /**
             * What to do when data is loaded?
             */

            update: function (obj, callback) {
                // startup
                console.log('WidgetName - update');

                // Release handle on previous object, if any.
                if (this._validationHandle) {
                    mx.data.unsubscribe(this._validationHandle);
                }

                this._contextObj = obj;

                if (obj === null) {
                    // Sorry no data no show!
                    console.log('SetFocusOnErrorWidget  - update - We did not get any context object!');
                } else {

                    // Subscribe to validation updates.
                    this._validationHandle = mx.data.subscribe({
                        guid     : obj.getGuid(),
                        val      : true,
                        callback : dojo.hitch(this, function(validations) {
                            console.log('SetFocusOnErrorWidget  - validation callback');
                            this._setFocus();
                        })
                    });
                }

                // Execute callback.
                if(callback !== 'undefined'){
                    callback();
                }
            },

            uninitialize: function () {
                if (this._validationHandle) {
                    mx.data.unsubscribe(this._validationHandle);
                }
            },

            /**
             * Extra setup widget methods.
             * ======================
             */
            _setupWidget: function () {

            },


            /**
             * Interaction widget methods.
             * ======================
             */
            _setFocus: function () {
                var 
                    delay,
                    inputNodeList,
                    node,
                    parentElement,
                    tdNodeList;
                    
                parentElement = this.domNode.parentElement;
                delay = this.delay;
                setTimeout(function () {
                    tdNodeList = domQuery('div.has-error', parentElement);
                    // If there a validation error was found, take the first one.
                    if (tdNodeList.length > 0) {
                        // We got the div with the error message but we need the parent. 
                        node = tdNodeList[0];                    
                        // Find all collapsed groupboxes, expand the groupbox if the node is a descendant of the groupbox.
                        domQuery('.mx-groupbox.mx-groupbox-collapsible.collapsed', parentElement).forEach(function (groupboxElement) {
                            if (dom.isDescendant(node, groupboxElement)) {
                                domQuery('h2.mx-groupbox-header', groupboxElement).forEach(function (headerElement) {
                                    headerElement.click();
                                });
                            }
                        });
                        // Scroll element into view
                        win.scrollIntoView(node);
                        // Find any input or select elements in the node and set the focus if found.
                        // (Note that an error could be displayed on a read only element.)
                        inputNodeList = domQuery('input, select', node);
                        if (inputNodeList.length > 0) {
                            inputNodeList[0].focus();
                        }
                    }
                }, delay);
            }
        });
    });

}());


