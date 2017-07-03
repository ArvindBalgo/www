/*
* Fancy Product Designer Plus
* An Add-On for Fancy Product Designer.
* Copyright 2016, Rafael Dery
*
* Only for the sale at the envato marketplaces
*/

var FancyProductDesignerPlus = {

	version: '1.0.3',
	setup: function($elem, fpdInstance) {

		// @@include('../envato/evilDomain.js')

		if(fpdInstance.mainOptions.colorSelectionPlacement && fpdInstance.mainOptions.colorSelectionPlacement !== '') {

			new FPDColorSelection(fpdInstance);

		}

		$elem.on('langJSONLoad', function() {

			if(fpdInstance.mainOptions.bulkVariationsPlacement && fpdInstance.mainOptions.bulkVariations) {

				var bulkVariations = new FPDBulkVariations(fpdInstance);
				fpdInstance.bulkVariations = bulkVariations;

			}

		});

		if(fpdInstance.mainOptions.mainBarModules.indexOf('names-numbers') != -1) {

			$elem.on('viewCreate', function(evt, viewInstance) {

				if(viewInstance.names_numbers && viewInstance.names_numbers.length > 1) {
					viewInstance.changePrice((viewInstance.names_numbers.length-1) * viewInstance.options.namesNumbersEntryPrice, '+');
				}

			});

		}

	}

};

FancyProductDesignerPlus.availableModules = [
	'names-numbers',
	'drawing'
];

var FPDNamesNumbersModule = {

	setup: function(fpdInstance, $module) {

		var $lastSelectedRow = null;

		$module.off().find('.fpd-list').empty();

		var _setPlaceholderText = function(number, name) {

			if(fpdInstance.currentViewInstance.numberPlaceholder && typeof number == 'string') {
				fpdInstance.currentViewInstance.setElementParameters({text: number}, fpdInstance.currentViewInstance.numberPlaceholder);
			}

			if(fpdInstance.currentViewInstance.textPlaceholder && typeof name == 'string') {
				fpdInstance.currentViewInstance.setElementParameters({text: name}, fpdInstance.currentViewInstance.textPlaceholder);
			}

			fpdInstance.currentViewInstance.stage.renderAll();

		};

		var _addRow = function(number, name, selectVal) {

			number = typeof number === 'undefined' ? '' : number;
			name = typeof name === 'undefined' ? '' : name;

			var rowHtml = '<div class="fpd-row">';

			if(fpdInstance.currentViewInstance.numberPlaceholder) {

				var minMaxHtml = '';
				if(Array.isArray(fpdInstance.currentViewInstance.numberPlaceholder.numberPlaceholder)) {
					minMaxHtml = 'min="'+fpdInstance.currentViewInstance.numberPlaceholder.numberPlaceholder[0]+'" max="'+fpdInstance.currentViewInstance.numberPlaceholder.numberPlaceholder[1]+'" ';
				}

				rowHtml += '<div class="fpd-number-col"><input type="number" placeholder="'+fpdInstance.currentViewInstance.numberPlaceholder.originParams.text+'" class="fpd-number" value="'+number+'" '+minMaxHtml+' /></div>';
			}

			if(fpdInstance.currentViewInstance.textPlaceholder) {
				rowHtml += '<div class="fpd-name-col"><div><input type="text" placeholder="'+fpdInstance.currentViewInstance.textPlaceholder.originParams.text+'" value="'+name+'" /></div></div>';
			}

			if((fpdInstance.mainOptions.namesNumbersDropdown && fpdInstance.mainOptions.namesNumbersDropdown.length > 0) || selectVal) {

				var selectValArr = new Array(selectVal),
					dropdownProps = fpdInstance.mainOptions.namesNumbersDropdown.length > 0 ? fpdInstance.mainOptions.namesNumbersDropdown : selectValArr,
					optionsHtml = '';

				for(var i=0; i<dropdownProps.length; ++i) {
					selected = selectVal === dropdownProps[i] ? 'selected="selected"' : '';
					optionsHtml += '<option value="'+dropdownProps[i]+'" '+selected+'>'+dropdownProps[i]+'</option>';
				}

				rowHtml += '<div class="fpd-select-col"><label><select>'+optionsHtml+'</select></label></div>';

			}

			rowHtml += '<div class="fpd-remove-col"><span><span class="fpd-icon-remove"></span></span></div></div></div>';

			$module.find('.fpd-list').append(rowHtml);

			FPDUtil.createScrollbar($module.find('.fpd-scroll-area'));

			return $module.find('.fpd-list .fpd-row:last');

		};

		if(fpdInstance.currentViewInstance.textPlaceholder || fpdInstance.currentViewInstance.numberPlaceholder) {

			$module.children('.fpd-names-numbers-panel').toggleClass('fpd-disabled', false);

			if(fpdInstance.currentViewInstance.names_numbers && Array.isArray(fpdInstance.currentViewInstance.names_numbers)) {

				for(var i=0; i<fpdInstance.currentViewInstance.names_numbers.length; ++i) {

					var nnRow = fpdInstance.currentViewInstance.names_numbers[i];
					_addRow(nnRow.number, nnRow.name, nnRow.select);

				}

			}
			else {
				_addRow();
			}

		}
		else {
			$module.children('.fpd-names-numbers-panel').toggleClass('fpd-disabled', true);
		}

		$module.on('click', '.fpd-remove-col', function() {

			var $thisRow = $(this).parents('.fpd-row:first');

			if($thisRow.siblings('.fpd-row').length > 0) {
				$thisRow.remove();

				//if the selected row is deleted, update placeholders to first inputs
				if($lastSelectedRow && $lastSelectedRow.get(0) === $thisRow.get(0)) {
					$module.find('.fpd-row:first input:first').mouseup();
				}

				fpdInstance.currentViewInstance.names_numbers = FPDNamesNumbersModule.getViewNamesNumbers($module);
				fpdInstance.currentViewInstance.changePrice(fpdInstance.currentViewInstance.options.namesNumbersEntryPrice, '-');
			}

		});

		$module.on('mouseup keyup', '.fpd-row input', function() {

			var $this = $(this);

			if($lastSelectedRow && $lastSelectedRow.get(0) !== $this.parents('.fpd-row:first').get(0)) { //set placeholders to new selected row inputs

				var $row = $this.parents('.fpd-row:first');
				_setPlaceholderText($row.find('.fpd-number').val(), $row.find('.fpd-name-col input').val())

			}
			else {

				var targetMaxLength = $this.hasClass('fpd-number') ? fpdInstance.currentViewInstance.numberPlaceholder.maxLength : fpdInstance.currentViewInstance.textPlaceholder.maxLength;

				if(targetMaxLength != 0 && this.value.length > targetMaxLength) {
					this.value = this.value.substr(0, targetMaxLength);
				}

				if($this.hasClass('fpd-number')) {

					//check if min/max limits are set and apply
					if($this.attr('min') !== undefined && this.value !== '') {

						if( this.value > Number($this.attr('max')) ) {
							this.value = Number($this.attr('max'));
						}

						if( this.value < Number($this.attr('min')) ) {
							this.value = Number($this.attr('min'));
						}

					}



					_setPlaceholderText(this.value);

				}
				else {
					_setPlaceholderText(false, this.value);
				}

			}

			$lastSelectedRow = $this.parents('.fpd-row:first');

		});

		$module.on('click', '.fpd-btn', function() {

			var $row = _addRow();
			$module.find('.fpd-list .fpd-row:last input:first').focus();

			_setPlaceholderText($row.find('.fpd-number').attr('placeholder'), $row.find('.fpd-name-col input').attr('placeholder'));

			fpdInstance.currentViewInstance.names_numbers = FPDNamesNumbersModule.getViewNamesNumbers($module);
			fpdInstance.currentViewInstance.changePrice(fpdInstance.currentViewInstance.options.namesNumbersEntryPrice, '+');

			$lastSelectedRow = $row;

		});

		$module.on('change', 'input, select', function() {

			fpdInstance.currentViewInstance.names_numbers = FPDNamesNumbersModule.getViewNamesNumbers($module);

		});

	},

	getViewNamesNumbers : function($module) {

		var nnArr = [];

		$module.find('.fpd-list .fpd-row').each(function(i, row) {

			var $row = $(row),
				rowObj = {};

			if($row.children('.fpd-number-col').length > 0) {
				rowObj.number = $row.find('.fpd-number').val();
			}

			if($row.children('.fpd-name-col').length > 0) {
				rowObj.name = $row.find('.fpd-name-col input').val();
			}

			if($row.children('.fpd-select-col').length > 0) {
				rowObj.select = $row.find('.fpd-select-col select').val();
			}

			nnArr.push(rowObj);

		});

		return nnArr;

	},

};

var FPDDrawingModule = function(fpdInstance, $module) {

	var drawCanvas = null,
		currentLineColor = '#000000';

	var _getCustomBrush = function(canvas, type) {

		if(type === 'vLine') {

			var vLinePatternBrush = new fabric.PatternBrush(canvas);
		    vLinePatternBrush.getPatternSrc = function() {

		      var patternCanvas = fabric.document.createElement('canvas');
		      patternCanvas.width = patternCanvas.height = 10;
		      var ctx = patternCanvas.getContext('2d');

		      ctx.strokeStyle = this.color;
		      ctx.lineWidth = 5;
		      ctx.beginPath();
		      ctx.moveTo(0, 5);
		      ctx.lineTo(10, 5);
		      ctx.closePath();
		      ctx.stroke();

		      return patternCanvas;
		    };

			return vLinePatternBrush;
		}
		else if(type === 'hLine') {

			var hLinePatternBrush = new fabric.PatternBrush(canvas);
		    hLinePatternBrush.getPatternSrc = function() {

		      var patternCanvas = fabric.document.createElement('canvas');
		      patternCanvas.width = patternCanvas.height = 10;
		      var ctx = patternCanvas.getContext('2d');

		      ctx.strokeStyle = this.color;
		      ctx.lineWidth = 5;
		      ctx.beginPath();
		      ctx.moveTo(5, 0);
		      ctx.lineTo(5, 10);
		      ctx.closePath();
		      ctx.stroke();

		      return patternCanvas;
		    };

		    return hLinePatternBrush;

		}

	};

	var _initialize = function() {

		var drawCanvasWidth = $module.parents('.fpd-draggable-dialog:first').length > 0 ? $module.parents('.fpd-draggable-dialog:first').width() : $module.parent('.fpd-content').width();
		drawCanvasWidth -= (parseInt($module.css('paddingLeft')) * 2);
		drawCanvas = new fabric.Canvas($module.find('.fpd-drawing-canvas').get(0), {
			containerClass: 'fpd-drawing-container',
			isDrawingMode: true,
			width: drawCanvasWidth,
			height: 150
	  	});

		$module.find('.fpd-drawing-brush-type .fpd-item').click(function(evt) {

			evt.stopPropagation();

			var $this = $(this),
				$current = $this.parent().prevAll('.fpd-dropdown-current:first'),
				value = $this.data('value');

			$current.html($this.clone()).data('value', value);

			if(value === 'hline') {
			    drawCanvas.freeDrawingBrush = _getCustomBrush(drawCanvas, 'hLine');
		    }
		    else if(value === 'vline') {
		      	drawCanvas.freeDrawingBrush = _getCustomBrush(drawCanvas, 'vLine');
		    }
		    else {
			    drawCanvas.freeDrawingBrush = new fabric[value + 'Brush'](drawCanvas);
		    }

			if (drawCanvas.freeDrawingBrush) {
			    drawCanvas.freeDrawingBrush.color = currentLineColor;
				drawCanvas.freeDrawingBrush.width = $module.find('.fpd-drawing-line-width').val();
		    }

		    $this.parents('.fpd-dropdown:first').removeClass('fpd-active');

		});

		$module.find('.fpd-drawing-line-color').spectrum({
			color: currentLineColor,
			showButtons: false,
			preferredFormat: "hex",
			showInput: true,
			showInitial: true,
			showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
			palette: fpdInstance.mainOptions.colorPickerPalette,
			move: function(color) {

				currentLineColor = color.toHexString();
				if(drawCanvas) {
					drawCanvas.freeDrawingBrush.color = currentLineColor;
				}

			},
			change: function(color) {

				currentLineColor = color.toHexString();
				if(drawCanvas) {
					drawCanvas.freeDrawingBrush.color = currentLineColor;
				}

			}
		});

		$module.find('.fpd-slider-range').rangeslider({
			polyfill: false,
			rangeClass: 'fpd-range-slider',
			disabledClass: 'fpd-range-slider--disabled',
			horizontalClass: 'fpd-range-slider--horizontal',
		    verticalClass: 'fpd-range-slider--vertical',
		    fillClass: 'fpd-range-slider__fill',
		    handleClass: 'fpd-range-slider__handle',
		    onSlide: function(pos, value) {
			    this.$element.parent().prev('.fpd-slider-number').val(value).change();
		    }
		});

		$module.find('.fpd-slider-number').change(function() {

			var $this = $(this);

			if( this.value > Number($this.attr('max')) ) {
				this.value = Number($this.attr('max'));
			}

			if( this.value < Number($this.attr('min')) ) {
				this.value = Number($this.attr('min'));
			}

			$this.next('.fpd-range-wrapper').children('input').val(this.value)
			.rangeslider('update', true, false);

			if($this.hasClass('fpd-drawing-line-width') && drawCanvas) {
				drawCanvas.freeDrawingBrush.width = this.value;
			}

		});

		$module.find('.fpd-clear-drawing').click(function() {
			drawCanvas.clear();
		});

		$module.find('.fpd-add-drawing').click(function() {

			fpdInstance.addElement('image', drawCanvas.toSVG(), new Date().getTime(), {
				autoCenter: true,
				draggable: true,
				resizable: true,
				removable: true,
				rotatable: true,
				autoSelect: true,
				colors: false,
				patterns: false
			});

			drawCanvas.clear();

		});

	};

	_initialize();

};

var FPDColorSelection = function(fpdInstance) {

	var $colorSelectionElem = null,
		colorDragging = false,
		target = fpdInstance.mainOptions.colorSelectionPlacement;

	var _colorSwatch = function(color) {

		var tooltipTitle = fpdInstance.mainOptions.hexNames[color.replace('#', '')];
		tooltipTitle = tooltipTitle ? tooltipTitle : color;

		var titleAttr = fpdInstance.mainOptions.colorSelectionTooltip ? 'title="'+tooltipTitle+'"' : '';

		return '<div style="background-color: '+color+'" class="fpd-item fpd-tooltip" '+titleAttr+'><div class="fpd-label">'+color+'</div></div>';

	};

	var _initialize = function() {

		//update color selection when product is created
		fpdInstance.$container.on('productCreate', function() {

			//check if instance has views and a first a main element to get the colors from
			if(fpdInstance.currentViews.length > 0 && fpdInstance.currentViews[0].mainElement) {

				//create cs wrapper on first product creation
				if($colorSelectionElem == null) {

					//position inside
					if(target.indexOf('inside-') !== -1) {

						$colorSelectionElem = fpdInstance.$mainWrapper.append('<div class="fpd-color-selection fpd-clearfix fpd-'+target+'"></div>').children('.fpd-color-selection');
					}
					//position outside
					else {
						$colorSelectionElem = $(target).addClass('fpd-color-selection fpd-clearfix fpd-custom-pos');

					}

					//click handler for color selection items
					$colorSelectionElem.on('click','.fpd-item', function() {

						var color = tinycolor($(this).css('backgroundColor'));

						fpdInstance.deselectElement();
						fpdInstance.currentViewInstance.currentUploadZone = null;

						fpdInstance.viewInstances[0].setElementParameters(
							{fill: color.toHexString()},
							fpdInstance.currentViews[0].mainElement
						);

					});

				}

				//clear all
				$colorSelectionElem.find('input').spectrum('destroy');
				$colorSelectionElem.empty();

				 //get fabric element from main element
				var mainElement = fpdInstance.viewInstances[0].getElementByTitle(fpdInstance.currentViews[0].mainElement);
				if(mainElement && Array.isArray(mainElement.colors) && mainElement.colors.length > 0) {

					if(mainElement.colors.length === 1) { //color picker

						$colorSelectionElem.append('<input type="text" value="'+mainElement.colors[0]+'" />');
						$colorSelectionElem.children('input').spectrum({
								showButtons: false,
								preferredFormat: "hex",
								showInput: true,
								showInitial: true,
								showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
								palette: fpdInstance.mainOptions.colorPickerPalette,
								show: function(color) {
									mainElement._tempFill = color.toHexString();
								},
								move: function(color) {

									//only non-png images are chaning while dragging
									if(colorDragging === false || FPDUtil.elementIsColorizable(mainElement) !== 'png') {
										fpdInstance.viewInstances[0].changeColor(mainElement, color.toHexString());
									}

								},
								change: function(color) {

									$(document).unbind("click.spectrum");
									fpdInstance.viewInstances[0].setElementParameters(
										{fill: color.toHexString()},
										mainElement
									);

								}
							})
							.on('dragstart.spectrum', function() {
								colorDragging = true;
							})
							.on('dragstop.spectrum', function(evt, color) {
								colorDragging = false;
								fpdInstance.viewInstances[0].changeColor(mainElement, color.toHexString());
							});

					}
					else {

						for(var i=0; i<mainElement.colors.length; ++i) {

							$colorSelectionElem.append(_colorSwatch(mainElement.colors[i]));
						}

						if(fpdInstance.mainOptions.colorSelectionTooltip) {
							FPDUtil.updateTooltip($colorSelectionElem);
						}

					}

				}

				$colorSelectionElem.show();

			}
			else if($colorSelectionElem) {
				$colorSelectionElem.hide();
			}

		});

	};

	_initialize();
};

/**
 * The class to create the Bulk Variations that is related to FancyProductDesigner class.
 *
 * @class FPDBulkVariations
 * @constructor
 * @param {FancyProductDesigner} fpdInstance - An instance of FancyProductDesigner class.
 */
var FPDBulkVariations = function(fpdInstance) {

	var instance = this,
		$container = $(fpdInstance.mainOptions.bulkVariationsPlacement).addClass('fpd-bulk-variations fpd-container'),
		variations = fpdInstance.mainOptions.bulkVariations,
		variationRowHtml = '';


	/**
	 * Gets the variation(s) from the UI.
	 *
	 * @method getOrderVariations
	 * @return {Array|Boolean} An array containing objects with variation and quantity properties. If a variation in the UI is not set, it will return false.
	 */
	this.getOrderVariations = function() {

		var variations = [];
		$container.find('.fpd-row').each(function(i, row) {

			var $row = $(row);

			var variation = {};
			$row.children('.fpd-select-col').each(function(i, selectCol) {

				var $select = $(selectCol).children('select');

				if($select.val() == null) {
					variations = false;
					$select.addClass('fpd-error');
				}

				variation[$select.attr('name')] = $select.val();

			});

			if(variations !== false) {
				variations.push({variation: variation, quantity: parseInt($row.find('.fpd-quantity').val()) });
			}


		});

		return variations;
	};

	/**
	 * Loads variation(s) in the UI.
	 *
	 * @method setup
	 * @param {Array} variations An array containing objects with variation and quantity properties.
	 */
	this.setup = function(variations) {

		if(typeof variations === 'object') {

			$container.children('.fpd-variations-list').empty();
			variations.forEach(function(variationItem) {

				$container.children('.fpd-variations-list').append(variationRowHtml);

				var $lastRow = $container.children('.fpd-variations-list').children('.fpd-row:last');

				//Set value of select dropdowns
				Object.keys(variationItem.variation).forEach(function(attribute) {
					$lastRow.find('select[name="'+attribute+'"]').val(variationItem.variation[attribute]);
				});

				$lastRow.find('.fpd-quantity').val(variationItem.quantity);

			});

		}

		_setTotalQuantity();

	};

	var _setTotalQuantity = function() {

		var totalQuantity = 0;
		$container.find('.fpd-quantity').each(function() {
			totalQuantity += Number(this.value);
		});

		fpdInstance.setOrderQuantity(Number(totalQuantity));

	};

	var _initialize = function() {

		//when getOrder is called, add bulk variations
		fpdInstance.$container.on('getOrder', function() {

			fpdInstance._order.bulkVariations = instance.getOrderVariations();

		});

		if(typeof variations === 'object') {

			var keys = Object.keys(variations);

			variationRowHtml += '<div class="fpd-row">';
			for(var i=0; i<keys.length; ++i) {

				var key = keys[i],
					variationAttrs = variations[key];

				variationRowHtml += '<div class="fpd-select-col"><select name="'+key+'"><option value="" disabled selected>'+key+'</option>';

				for(var j=0; j<variationAttrs.length; ++j) {
					variationRowHtml += '<option value="'+variationAttrs[j]+'">'+variationAttrs[j]+'</option>';
				}

				variationRowHtml += '</select></div>';

			}

			variationRowHtml += '<div><input type="number" class="fpd-quantity" step="1" min="1" value="1" /></div>';
			variationRowHtml += '<div class="fpd-remove-row"><span class="fpd-icon-close"></span></div>';
			variationRowHtml += '</div>';

		}

		$container.append('<div class="fpd-variations-list">'+variationRowHtml+'</div>')
		.prepend('<div class="fpd-clearfix"><span class="fpd-title fpd-left">'+fpdInstance.getTranslation('plus', 'bulk_add_variations_title')+'</span><span class="fpd-add-row fpd-btn fpd-right">'+fpdInstance.getTranslation('plus', 'bulk_add_variations_add')+'</span></div>');

		$container.on('click', '.fpd-add-row', function() {
			$container.children('.fpd-variations-list').append(variationRowHtml);
			_setTotalQuantity();
		});

		$container.on('click', '.fpd-remove-row', function() {

			var $thisRow = $(this).parents('.fpd-row:first');
			if($thisRow.siblings('.fpd-row').length > 0) {
				$thisRow.remove();
				_setTotalQuantity();
			}

		});

		$container.on('change', 'select', function() {

			var $this = $(this);

			$this.removeClass('fpd-error');

		});

		$container.on('change', '.fpd-quantity', function() {

			var $this = $(this);

			if( this.value < Number($this.attr('min')) ) {
				this.value = Number($this.attr('min'));
			}
			if(this.value == '') {
				this.value = 1;
			}

			_setTotalQuantity();

		});

		_setTotalQuantity();

	};

	_initialize();

};

