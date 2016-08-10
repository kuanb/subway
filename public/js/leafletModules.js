var BSpline = function(points,degree,copy){
    if(copy){
        this.points = []
        for(var i = 0;i<points.length;i++){
            this.points.push(points[i]);
        }
    }else{
        this.points = points;
    }
    this.degree = degree;
    this.dimension = points[0].length;
    if(degree == 2){
        this.baseFunc = this.basisDeg2;
        this.baseFuncRangeInt = 2;
    }else if(degree == 3){
        this.baseFunc = this.basisDeg3;
        this.baseFuncRangeInt = 2;
    }else if(degree == 4){
        this.baseFunc = this.basisDeg4;
        this.baseFuncRangeInt = 3;
    }else if(degree == 5){
        this.baseFunc = this.basisDeg5;
        this.baseFuncRangeInt = 3;
    } 
};

BSpline.prototype.seqAt = function(dim){
    var points = this.points;
    var margin = this.degree + 1;
    return function(n){
        if(n < margin){
            return points[0][dim];
        }else if(points.length + margin <= n){
            return points[points.length-1][dim];
        }else{
            return points[n-margin][dim];
        }
    };
};

BSpline.prototype.basisDeg2 = function(x){
    if(-0.5 <= x && x < 0.5){
        return 0.75 - x*x;
    }else if(0.5 <= x && x <= 1.5){
        return 1.125 + (-1.5 + x/2.0)*x;
    }else if(-1.5 <= x && x < -0.5){
        return 1.125 + (1.5 + x/2.0)*x;
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg3 = function(x){
    if(-1 <= x && x < 0){
        return 2.0/3.0 + (-1.0 - x/2.0)*x*x;
    }else if(1 <= x && x <= 2){
        return 4.0/3.0 + x*(-2.0 + (1.0 - x/6.0)*x);
    }else if(-2 <= x && x < -1){
        return 4.0/3.0 + x*(2.0 + (1.0 + x/6.0)*x);
    }else if(0 <= x && x < 1){
        return 2.0/3.0 + (-1.0 + x/2.0)*x*x;
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg4 = function(x){
    if(-1.5 <= x && x < -0.5){
        return 55.0/96.0 + x*(-(5.0/24.0) + x*(-(5.0/4.0) + (-(5.0/6.0) - x/6.0)*x));
    }else if(0.5 <= x && x < 1.5){
        return 55.0/96.0 + x*(5.0/24.0 + x*(-(5.0/4.0) + (5.0/6.0 - x/6.0)*x));
    }else if(1.5 <= x && x <= 2.5){
        return 625.0/384.0 + x*(-(125.0/48.0) + x*(25.0/16.0 + (-(5.0/12.0) + x/24.0)*x));
    }else if(-2.5 <= x && x <= -1.5){
        return 625.0/384.0 + x*(125.0/48.0 + x*(25.0/16.0 + (5.0/12.0 + x/24.0)*x));
    }else if(-1.5 <= x && x < 1.5){
        return 115.0/192.0 + x*x*(-(5.0/8.0) + x*x/4.0);
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg5 = function(x){
    if(-2 <= x && x < -1){
        return 17.0/40.0 + x*(-(5.0/8.0) + x*(-(7.0/4.0) + x*(-(5.0/4.0) + (-(3.0/8.0) - x/24.0)*x)));
    }else if(0 <= x && x < 1){
        return 11.0/20.0 + x*x*(-(1.0/2.0) + (1.0/4.0 - x/12.0)*x*x);
    }else if(2 <= x && x <= 3){
        return 81.0/40.0 + x*(-(27.0/8.0) + x*(9.0/4.0 + x*(-(3.0/4.0) + (1.0/8.0 - x/120.0)*x)));
    }else if(-3 <= x && x < -2){
        return 81.0/40.0 + x*(27.0/8.0 + x*(9.0/4.0 + x*(3.0/4.0 + (1.0/8.0 + x/120.0)*x)));
    }else if(1 <= x && x < 2){
        return 17.0/40.0 + x*(5.0/8.0 + x*(-(7.0/4.0) + x*(5.0/4.0 + (-(3.0/8.0) + x/24.0)*x)));
    }else if(-1 <= x && x < 0){
        return 11.0/20.0 + x*x*(-(1.0/2.0) + (1.0/4.0 + x/12.0)*x*x);
    }else{
        return 0;
    }
};

BSpline.prototype.getInterpol = function(seq,t){
    var f = this.baseFunc;
    var rangeInt = this.baseFuncRangeInt;
    var tInt = Math.floor(t);
    var result = 0;
    for(var i = tInt - rangeInt;i <= tInt + rangeInt;i++){
        result += seq(i)*f(t-i);
    }
    return result;
};

BSpline.prototype.calcAt = function(t){
    t = t*((this.degree+1)*2+this.points.length);//t must be in [0,1]
    if(this.dimension == 2){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t)];
    }else if(this.dimension == 3){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t),this.getInterpol(this.seqAt(2),t)];
    }else{
        var res = [];
        for(var i = 0;i<this.dimension;i++){
            res.push(this.getInterpol(this.seqAt(i),t));
        }
        return res;
    }
};

L.Tooltip = L.Layer.extend({

  options: {
    pane: 'popupPane',
    nonBubblingEvents: ['mouseover', 'mousemove'],
    position: 'left',
    className: 'tooltip',
    arrowClass: 'tooltip-arrow',
    contentClass: 'tooltip-inner',
    subtextClass: 'tooltip-subtext',
    showClass: 'in',
    noWrap: false,
    wrapScreen: true,
    offset: [10, 5]
  },

  statics: {

    /**
     * @enum {String}
     */
    POSITIONS: {
      TOP:    'top',
      LEFT:   'left',
      BOTTOM: 'bottom',
      RIGHT:  'right'
    }
  },


  /**
   * @class L.Tooltip
   * @constructor
   * @param  {Object} options
   * @param  {*=}     source
   */
  initialize: function(options, source) {

    /**
     * @type {Element}
     */
    this._container   = null;


    /**
     * @type {Element}
     */
    this._arrow       = null;


    /**
     * @type {Element}
     */
    this._contentNode = null;


    /**
     * @type {Element}
     */
    this._subtext     = null;


    L.Util.setOptions(this, options);


    /**
     * @type {L.Layer}
     */
    this._source      = source;
  },


  /**
   * Creates elements
   */
  _initLayout: function() {
    var options = this.options;
    if (options.noWrap) {
      options.className += ' nowrap';
    }
    this._container   = L.DomUtil.create('div',
                          options.className + ' ' + options.position +
                          ' ' + options.showClass);
    this._arrow       = L.DomUtil.create('div',
                          options.arrowClass, this._container);
    this._contentNode = L.DomUtil.create('div',
                          options.contentClass, this._container);
    this._subtext     = L.DomUtil.create('div',
                          options.subtextClass, this._container);
  },


  /**
   * @param  {L.Map} map
   * @return {L.Tooltip}
   */
  onAdd: function(map) {
    this._map = map;
    this._initLayout();
    if (this.options.content) {
      this.setContent(this.options.content);
    }
    this.getPane().appendChild(this._container);
    return this;
  },


  /**
   * @return {L.Tooltip}
   */
  show: function() {
    L.DomUtil.removeClass(this._container, "tooltip-hide");
    return this;
  },


  /**
   * @return {L.Tooltip}
   */
  hide: function() {
    L.DomUtil.addClass(this._container, "tooltip-hide");
    return this;
  },


  /**
   * @param  {L.Map} map
   * @return {L.Tooltip}
   */
  onRemove: function(map) {
    L.Util.cancelAnimFrame(this._updateTimer);
    this.getPane().removeChild(this._container);
    this._map = null;
    return this;
  },


  /**
   * @param {String} content
   * @return {L.LatLng}
   */
  setContent: function(content) {
    this._contentNode.innerHTML = content;
    this.updatePosition();
    return this;
  },


  /**
   * @param {String} text
   * @return {L.Tooltip}
   */
  setSubtext: function(text) {
    this._subtext.innerHTML = text;
    this.updatePosition();
    return this;
  },


  /**
   * @param {L.LatLng} latlng
   * @return {L.Tooltip}
   */
  setLatLng: function(latlng) {
    this._latlng = latlng;
    this.updatePosition();
    return this;
  },


  /**
   * @param  {L.Point} point Position
   * @param  {String} position
   */
  _getOffset: function(point, position) {
    var container  = this._container;
    var options    = this.options;
    var width      = container.offsetWidth;
    var height     = container.offsetHeight;
    var POSITIONS  = L.Tooltip.POSITIONS;

    if (this.options.wrapScreen) {
      var mapSize = this._map.getSize();
      point = this._map.layerPointToContainerPoint(point);
      if (point.x + width / 2  > mapSize.x) {
        position = POSITIONS.LEFT;
      }
      if (point.x - width < 0) {
        position = POSITIONS.RIGHT;
      }

      if (point.y - height < 0) {
        position = POSITIONS.BOTTOM;
      }

      if (point.y + height > mapSize.y) {
        position = POSITIONS.TOP;
      }
    }

    this._container.className = (options.className + ' ' + position +
      ' ' + options.showClass);

    var offset = options.offset;
    if (position        === POSITIONS.LEFT) {
      return new L.Point(-width - offset[0], -height / 2)._floor();
    } else if (position === POSITIONS.RIGHT) {
      return new L.Point(0 + offset[0], -height / 2)._floor();
    } else if (position === POSITIONS.TOP) {
      return new L.Point(-width / 2, -height - offset[1])._floor();
    } else if (position === POSITIONS.BOTTOM) {
      return new L.Point(-width / 2, 0 + offset[1])._floor();
    }
  },


  /**
   * @param  {L.Point=} point
   */
  updatePosition: function(point) {
    this._updateTimer = L.Util.requestAnimFrame(function() {
      if (this._map) {
        point = point || this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._container, point.add(
          this._getOffset(point, this.options.position)));
      }
    }, this);
  }

});

L.tooltip = function(options, source) {
  return new L.Tooltip(options, source);
};

L.Tooltip=L.Layer.extend({options:{pane:"popupPane",nonBubblingEvents:["mouseover","mousemove"],position:"left",className:"tooltip",arrowClass:"tooltip-arrow",contentClass:"tooltip-inner",subtextClass:"tooltip-subtext",showClass:"in",noWrap:false,wrapScreen:true,offset:[10,5]},statics:{POSITIONS:{TOP:"top",LEFT:"left",BOTTOM:"bottom",RIGHT:"right"}},initialize:function(t,i){this._container=null;this._arrow=null;this._contentNode=null;this._subtext=null;L.Util.setOptions(this,t);this._source=i},_initLayout:function(){var t=this.options;if(t.noWrap){t.className+=" nowrap"}this._container=L.DomUtil.create("div",t.className+" "+t.position+" "+t.showClass);this._arrow=L.DomUtil.create("div",t.arrowClass,this._container);this._contentNode=L.DomUtil.create("div",t.contentClass,this._container);this._subtext=L.DomUtil.create("div",t.subtextClass,this._container)},onAdd:function(t){this._map=t;this._initLayout();if(this.options.content){this.setContent(this.options.content)}this.getPane().appendChild(this._container);return this},show:function(){L.DomUtil.addClass(this._container,this.options.showClass);return this},hide:function(){L.DomUtil.addClass(this._container,this.options.showClass);return this},onRemove:function(t){L.Util.cancelAnimFrame(this._updateTimer);this.getPane().removeChild(this._container);this._map=null;return this},setContent:function(t){this._contentNode.innerHTML=t;this.updatePosition();return this},setSubtext:function(t){this._subtext.innerHTML=t;this.updatePosition();return this},setLatLng:function(t){this._latlng=t;this.updatePosition();return this},_getOffset:function(t,i){var n=this._container;var o=this.options;var s=n.offsetWidth;var e=n.offsetHeight;var a=L.Tooltip.POSITIONS;if(this.options.wrapScreen){var r=this._map.getSize();t=this._map.layerPointToContainerPoint(t);if(t.x+s/2>r.x){i=a.LEFT}if(t.x-s<0){i=a.RIGHT}if(t.y-e<0){i=a.BOTTOM}if(t.y+e>r.y){i=a.TOP}}this._container.className=o.className+" "+i+" "+o.showClass;var h=o.offset;if(i===a.LEFT){return new L.Point(-s-h[0],-e/2)._floor()}else if(i===a.RIGHT){return new L.Point(0+h[0],-e/2)._floor()}else if(i===a.TOP){return new L.Point(-s/2,-e-h[1])._floor()}else if(i===a.BOTTOM){return new L.Point(-s/2,0+h[1])._floor()}},updatePosition:function(t){this._updateTimer=L.Util.requestAnimFrame(function(){if(this._map){t=t||this._map.latLngToLayerPoint(this._latlng);L.DomUtil.setPosition(this._container,t.add(this._getOffset(t,this.options.position)))}},this)}});L.tooltip=function(t,i){return new L.Tooltip(t,i)};

L.Map.include({

	getLayerAtLatLng: function(latlng, lng) {
		latlng = L.latLng(latlng, lng);

		return this.layerAt(latLngToContainerPoint(latlng));
	},

	getLayerAt: function(point, y) {
		point = L.point(point, y);

		// Ignore points outside the map
		if (!this.getSize().contains(point)) {
			return;
		}

		var mapPos = this._container.getBoundingClientRect();

		var viewportPoint = L.point(mapPos.left, mapPos.top).add(point);

		var el = document.elementFromPoint(viewportPoint.x, viewportPoint.y);

		return this._getLayerFromDOMElement(el);
	},

	_getLayerFromDOMElement: function(el) {
		if (el === this._container) {
			return;
		}

		var id = L.stamp(el);
		if (id in this._targets) {

			/// TODO: Extra logic for canvas, maybe another call to getLayerAt

			return this._targets[id];
		}

		return this._getLayerFromDOMElement(el.parentElement);
	}

});

L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topleft',
        title: {
            'false': 'View Fullscreen',
            'true': 'Exit Fullscreen'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        this.link.href = '#';

        this._map = map;
        this._map.on('fullscreenchange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isFullscreen()];
    }
});

L.Map.include({
    isFullscreen: function () {
        return this._isFullscreen || false;
    },

    toggleFullscreen: function (options) {
        var container = this.getContainer();
        if (this.isFullscreen()) {
            if (options && options.pseudoFullscreen) {
                this._disablePseudoFullscreen(container);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this._disablePseudoFullscreen(container);
            }
        } else {
            if (options && options.pseudoFullscreen) {
                this._enablePseudoFullscreen(container);
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else {
                this._enablePseudoFullscreen(container);
            }
        }

    },

    _enablePseudoFullscreen: function (container) {
        L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(true);
        this.invalidateSize();
        this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
        L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(false);
        this.invalidateSize();
        this.fire('fullscreenchange');
    },

    _setFullscreen: function(fullscreen) {
        this._isFullscreen = fullscreen;
        var container = this.getContainer();
        if (fullscreen) {
            L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
        } else {
            L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
        }
    },

    _onFullscreenChange: function (e) {
        var fullscreenElement =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
            this._setFullscreen(true);
            this.fire('fullscreenchange');
        } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
            this._setFullscreen(false);
            this.fire('fullscreenchange');
        }
    }
});

L.Map.mergeOptions({
    fullscreenControl: false
});

L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
        this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this);

        this.whenReady(function () {
            L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
        });

        this.on('unload', function () {
            L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
        });
    }
});

L.control.fullscreen = function (options) {
    return new L.Control.Fullscreen(options);
};

/**
 * BezierSpline 
 * http://leszekr.github.com/
 *
 * @copyright
 * Copyright (C) 2012 Leszek Rybicki.
 *
 * @license
 * This file is part of BezierSpline
 * 
 * BezierSpline is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * BezierSpline is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with BezierSpline.  If not, see <http://www.gnu.org/copyleft/lesser.html>.
 */


/*
Usage:

	var spline = new Spline({
		points: array_of_control_points,
		duration: time_in_miliseconds,
		sharpness: how_curvy,
		stepLength: distance_between_points_to_cache
	});

*/
Spline = function(options){
	this.points = options.points || [];
	this.duration = options.duration || 10000;
	this.sharpness = options.sharpness || 0.85;
	this.centers = [];
	this.controls = [];
	this.stepLength = options.stepLength || 60;
	this.length = this.points.length;
	this.delay = 0;
	// this is to ensure compatibility with the 2d version
	for(var i=0; i<this.length; i++) this.points[i].z = this.points[i].z || 0;
	for(var i=0; i<this.length-1; i++){
		var p1 = this.points[i];
		var p2 = this.points[i+1];
		this.centers.push({x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2, z:(p1.z+p2.z)/2});
	}
	this.controls.push([this.points[0],this.points[0]]);
	for(var i=0; i<this.centers.length-1; i++){
		var p1 = this.centers[i];
		var p2 = this.centers[i+1];
		var dx = this.points[i+1].x-(this.centers[i].x+this.centers[i+1].x)/2;
		var dy = this.points[i+1].y-(this.centers[i].y+this.centers[i+1].y)/2;
		var dz = this.points[i+1].z-(this.centers[i].y+this.centers[i+1].z)/2;
		this.controls.push([{
			x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i].x+dx),
			y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i].y+dy),
			z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i].z+dz)},
		{
			x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i+1].x+dx),
			y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i+1].y+dy),
			z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i+1].z+dz)}]);
	}
	this.controls.push([this.points[this.length-1],this.points[this.length-1]]);
	this.steps = this.cacheSteps(this.stepLength);
	return this;
}

/*
	Caches an array of equidistant (more or less) points on the curve.
*/
Spline.prototype.cacheSteps = function(mindist){
	var steps = [];
	var laststep = this.pos(0);
	steps.push(0);
	for(var t=0; t<this.duration; t+=10){
		var step = this.pos(t);
		var dist = Math.sqrt((step.x-laststep.x)*(step.x-laststep.x)+(step.y-laststep.y)*(step.y-laststep.y)+(step.z-laststep.z)*(step.z-laststep.z));
		if(dist>mindist){
			steps.push(t);
			laststep = step;
		}
	}
	return steps;
}

/*
	returns angle and speed in the given point in the curve
*/
Spline.prototype.vector = function(t){
	var p1 = this.pos(t+10);
	var p2 = this.pos(t-10);
	return {
		angle:180*Math.atan2(p1.y-p2.y, p1.x-p2.x)/3.14,
		speed:Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z))
	}
}

/*
	Draws the control points
*/
Spline.prototype.drawControlPoints = function(ctx, color){
	ctx.fillStyle = color||"#f60";
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 2; 
	for(var i=0; i<this.length; i++){
		var p = this.points[i];
		var c1 = this.controls[i][0];
		var c2 = this.controls[i][1];

		ctx.beginPath();
		ctx.moveTo(c1.x,c1.y);
		ctx.lineTo(p.x,p.y);
		ctx.lineTo(c2.x,c2.y);
		ctx.stroke();
					
		ctx.beginPath();
		ctx.arc(c1.x, c1.y, 3, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		
		/*ctx.beginPath();
		ctx.arc(this.centers[i].x, this.centers[i].y, 5, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();*/
		
		ctx.beginPath();
		ctx.arc(c2.x, c2.y, 3, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		

		ctx.beginPath();
		ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
	}
	return this;
}

/*
	Gets the position of the point, given time.

	WARNING: The speed is not constant. The time it takes between control points is constant.

	For constant speed, use Spline.steps[i];
*/
Spline.prototype.pos = function(time){

	function bezier(t, p1, c1, c2, p2){
		var B = function(t) { 
			var t2=t*t, t3=t2*t;
			return [(t3),(3*t2*(1-t)),(3*t*(1-t)*(1-t)),((1-t)*(1-t)*(1-t))]
		}
		var b = B(t)
		var pos = {
			x : p2.x * b[0] + c2.x * b[1] +c1.x * b[2] + p1.x * b[3],
			y : p2.y * b[0] + c2.y * b[1] +c1.y * b[2] + p1.y * b[3],
			z : p2.z * b[0] + c2.z * b[1] +c1.z * b[2] + p1.z * b[3]
		}
		return pos; 
	}
	var t = time-this.delay;
	if(t<0) t=0;
	if(t>this.duration) t=this.duration-1;
	//t = t-this.delay;
	var t2 = (t)/this.duration;
	if(t2>=1) return this.points[this.length-1];

	var n = Math.floor((this.points.length-1)*t2);
	var t1 = (this.length-1)*t2-n;
	return bezier(t1,this.points[n],this.controls[n][1],this.controls[n+1][0],this.points[n+1]);
}

/*
	Draws the line
*/
Spline.prototype.draw = function(ctx,color){
	ctx.strokeStyle = color || "#7e5e38"; // line color
	ctx.lineWidth = 14;
	ctx.beginPath();
	var pos;
	for(var i=0; i<this.duration; i+=10){
		pos = this.pos(i); //bezier(i/max,p1, c1, c2, p2);
		if(Math.floor(i/100)%2==0) ctx.lineTo(pos.x, pos.y);
		else ctx.moveTo(pos.x, pos.y);
	}
	ctx.stroke();
	return this;
}

var Bezier=function(t){function n(i){if(r[i])return r[i].exports;var e=r[i]={exports:{},id:i,loaded:!1};return t[i].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){"use strict";t.exports=r(1)},function(t,n,r){"use strict";var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};!function(){function n(t,n,r,i,e){"undefined"==typeof e&&(e=.5);var o=h.projectionratio(e,t),s=1-o,u={x:o*n.x+s*i.x,y:o*n.y+s*i.y},a=h.abcratio(e,t),f={x:r.x+(r.x-u.x)/a,y:r.y+(r.y-u.y)/a};return{A:f,B:r,C:u}}var e=Math.abs,o=Math.min,s=Math.max,u=Math.acos,a=Math.sqrt,f=Math.PI,c={x:0,y:0,z:0},h=r(2),x=r(3),y=function(t){var n=t&&t.forEach?t:[].slice.call(arguments),r=!1;if("object"===i(n[0])){r=n.length;var o=[];n.forEach(function(t){["x","y","z"].forEach(function(n){"undefined"!=typeof t[n]&&o.push(t[n])})}),n=o}var s=!1,u=n.length;if(r){if(r>4){if(1!==arguments.length)throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");s=!0}}else if(6!==u&&8!==u&&9!==u&&12!==u&&1!==arguments.length)throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");var a=!s&&(9===u||12===u)||t&&t[0]&&"undefined"!=typeof t[0].z;this._3d=a;for(var f=[],c=0,x=a?3:2;u>c;c+=x){var y={x:n[c],y:n[c+1]};a&&(y.z=n[c+2]),f.push(y)}this.order=f.length-1,this.points=f;var p=["x","y"];a&&p.push("z"),this.dims=p,this.dimlen=p.length,function(t){for(var n=t.order,r=t.points,i=h.align(r,{p1:r[0],p2:r[n]}),o=0;o<i.length;o++)if(e(i[o].y)>1e-4)return void(t._linear=!1);t._linear=!0}(this),this._t1=0,this._t2=1,this.update()};y.fromSVG=function(t){var n=t.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(parseFloat),r=/[cq]/.test(t);return r?(n=n.map(function(t,r){return 2>r?t:t+n[r%2]}),new y(n)):new y(n)},y.quadraticFromPoints=function(t,r,i,e){if("undefined"==typeof e&&(e=.5),0===e)return new y(r,r,i);if(1===e)return new y(t,r,r);var o=n(2,t,r,i,e);return new y(t,o.A,i)},y.cubicFromPoints=function(t,r,i,e,o){"undefined"==typeof e&&(e=.5);var s=n(3,t,r,i,e);"undefined"==typeof o&&(o=h.dist(r,s.C));var u=o*(1-e)/e,a=h.dist(t,i),f=(i.x-t.x)/a,c=(i.y-t.y)/a,x=o*f,p=o*c,l=u*f,v=u*c,d={x:r.x-x,y:r.y-p},m={x:r.x+l,y:r.y+v},g=s.A,z={x:g.x+(d.x-g.x)/(1-e),y:g.y+(d.y-g.y)/(1-e)},b={x:g.x+(m.x-g.x)/e,y:g.y+(m.y-g.y)/e},_={x:t.x+(z.x-t.x)/e,y:t.y+(z.y-t.y)/e},w={x:i.x+(b.x-i.x)/(1-e),y:i.y+(b.y-i.y)/(1-e)};return new y(t,_,w,i)};var p=function(){return h};y.getUtils=p,y.prototype={getUtils:p,valueOf:function(){return this.toString()},toString:function(){return h.pointsToString(this.points)},toSVG:function(t){if(this._3d)return!1;for(var n=this.points,r=n[0].x,i=n[0].y,e=["M",r,i,2===this.order?"Q":"C"],o=1,s=n.length;s>o;o++)e.push(n[o].x),e.push(n[o].y);return e.join(" ")},update:function(){this.dpoints=[];for(var t=this.points,n=t.length,r=n-1;n>1;n--,r--){for(var i,e=[],o=0;r>o;o++)i={x:r*(t[o+1].x-t[o].x),y:r*(t[o+1].y-t[o].y)},this._3d&&(i.z=r*(t[o+1].z-t[o].z)),e.push(i);this.dpoints.push(e),t=e}this.computedirection()},computedirection:function(){var t=this.points,n=h.angle(t[0],t[this.order],t[1]);this.clockwise=n>0},length:function(){return h.length(this.derivative.bind(this))},_lut:[],getLUT:function(t){if(t=t||100,this._lut.length===t)return this._lut;this._lut=[];for(var n=0;t>=n;n++)this._lut.push(this.compute(n/t));return this._lut},on:function(t,n){n=n||5;for(var r,i=this.getLUT(),e=[],o=0,s=0;s<i.length;s++)r=i[s],h.dist(r,t)<n&&(e.push(r),o+=s/i.length);return e.length?o/=e.length:!1},project:function(t){var n=this.getLUT(),r=n.length-1,i=h.closest(n,t),e=i.mdist,o=i.mpos;if(0===o||o===r){var s=o/r,u=this.compute(s);return u.t=s,u.d=e,u}var a,s,f,c,x=(o-1)/r,y=(o+1)/r,p=.1/r;for(e+=1,s=x,a=s;y+p>s;s+=p)f=this.compute(s),c=h.dist(t,f),e>c&&(e=c,a=s);return f=this.compute(a),f.t=a,f.d=e,f},get:function(t){return this.compute(t)},point:function(t){return this.points[t]},compute:function(t){if(0===t)return this.points[0];if(1===t)return this.points[this.order];var n=this.points,r=1-t;if(1===this.order)return f={x:r*n[0].x+t*n[1].x,y:r*n[0].y+t*n[1].y},this._3d&&(f.z=r*n[0].z+t*n[1].z),f;if(this.order<4){var i,e,o,s=r*r,u=t*t,a=0;2===this.order?(n=[n[0],n[1],n[2],c],i=s,e=r*t*2,o=u):3===this.order&&(i=s*r,e=s*t*3,o=r*u*3,a=t*u);var f={x:i*n[0].x+e*n[1].x+o*n[2].x+a*n[3].x,y:i*n[0].y+e*n[1].y+o*n[2].y+a*n[3].y};return this._3d&&(f.z=i*n[0].z+e*n[1].z+o*n[2].z+a*n[3].z),f}for(var h=JSON.parse(JSON.stringify(this.points));h.length>1;){for(var x=0;x<h.length-1;x++)h[x]={x:h[x].x+(h[x+1].x-h[x].x)*t,y:h[x].y+(h[x+1].y-h[x].y)*t},"undefined"!=typeof h[x].z&&(h[x]=h[x].z+(h[x+1].z-h[x].z)*t);h.splice(h.length-1,1)}return h[0]},raise:function(){for(var t,n,r,i=this.points,e=[i[0]],o=i.length,t=1;o>t;t++)n=i[t],r=i[t-1],e[t]={x:(o-t)/o*n.x+t/o*r.x,y:(o-t)/o*n.y+t/o*r.y};return e[o]=i[o-1],new y(e)},derivative:function(t){var n,r,i=1-t,e=0,o=this.dpoints[0];2===this.order&&(o=[o[0],o[1],c],n=i,r=t),3===this.order&&(n=i*i,r=i*t*2,e=t*t);var s={x:n*o[0].x+r*o[1].x+e*o[2].x,y:n*o[0].y+r*o[1].y+e*o[2].y};return this._3d&&(s.z=n*o[0].z+r*o[1].z+e*o[2].z),s},inflections:function(){return h.inflections(this.points)},normal:function(t){return this._3d?this.__normal3(t):this.__normal2(t)},__normal2:function(t){var n=this.derivative(t),r=a(n.x*n.x+n.y*n.y);return{x:-n.y/r,y:n.x/r}},__normal3:function(t){var n=this.derivative(t),r=this.derivative(t+.01),i=a(n.x*n.x+n.y*n.y+n.z*n.z),e=a(r.x*r.x+r.y*r.y+r.z*r.z);n.x/=i,n.y/=i,n.z/=i,r.x/=e,r.y/=e,r.z/=e;var o={x:r.y*n.z-r.z*n.y,y:r.z*n.x-r.x*n.z,z:r.x*n.y-r.y*n.x},s=a(o.x*o.x+o.y*o.y+o.z*o.z);o.x/=s,o.y/=s,o.z/=s;var u=[o.x*o.x,o.x*o.y-o.z,o.x*o.z+o.y,o.x*o.y+o.z,o.y*o.y,o.y*o.z-o.x,o.x*o.z-o.y,o.y*o.z+o.x,o.z*o.z],f={x:u[0]*n.x+u[1]*n.y+u[2]*n.z,y:u[3]*n.x+u[4]*n.y+u[5]*n.z,z:u[6]*n.x+u[7]*n.y+u[8]*n.z};return f},hull:function(t){var n,r=this.points,i=[],e=[],o=0,s=0,u=0;for(e[o++]=r[0],e[o++]=r[1],e[o++]=r[2],3===this.order&&(e[o++]=r[3]);r.length>1;){for(i=[],s=0,u=r.length-1;u>s;s++)n=h.lerp(t,r[s],r[s+1]),e[o++]=n,i.push(n);r=i}return e},split:function(t,n){if(0===t&&n)return this.split(n).left;if(1===n)return this.split(t).right;var r=this.hull(t),i={left:new y(2===this.order?[r[0],r[3],r[5]]:[r[0],r[4],r[7],r[9]]),right:new y(2===this.order?[r[5],r[4],r[2]]:[r[9],r[8],r[6],r[3]]),span:r};if(i.left._t1=h.map(0,0,1,this._t1,this._t2),i.left._t2=h.map(t,0,1,this._t1,this._t2),i.right._t1=h.map(t,0,1,this._t1,this._t2),i.right._t2=h.map(1,0,1,this._t1,this._t2),!n)return i;n=h.map(n,t,1,0,1);var e=i.right.split(n);return e.left},extrema:function(){var t,n,r=this.dims,i={},e=[];return r.forEach(function(r){n=function(t){return t[r]},t=this.dpoints[0].map(n),i[r]=h.droots(t),3===this.order&&(t=this.dpoints[1].map(n),i[r]=i[r].concat(h.droots(t))),i[r]=i[r].filter(function(t){return t>=0&&1>=t}),e=e.concat(i[r].sort())}.bind(this)),e=e.sort().filter(function(t,n){return e.indexOf(t)===n}),i.values=e,i},bbox:function(){var t=this.extrema(),n={};return this.dims.forEach(function(r){n[r]=h.getminmax(this,r,t[r])}.bind(this)),n},overlaps:function(t){var n=this.bbox(),r=t.bbox();return h.bboxoverlap(n,r)},offset:function(t,n){if("undefined"!=typeof n){var r=this.get(t),i=this.normal(t),e={c:r,n:i,x:r.x+i.x*n,y:r.y+i.y*n};return this._3d&&(e.z=r.z+i.z*n),e}if(this._linear){var o=this.normal(0),s=this.points.map(function(n){var r={x:n.x+t*o.x,y:n.y+t*o.y};return n.z&&i.z&&(r.z=n.z+t*o.z),r});return[new y(s)]}var u=this.reduce();return u.map(function(n){return n.scale(t)})},simple:function(){if(3===this.order){var t=h.angle(this.points[0],this.points[3],this.points[1]),n=h.angle(this.points[0],this.points[3],this.points[2]);if(t>0&&0>n||0>t&&n>0)return!1}var r=this.normal(0),i=this.normal(1),o=r.x*i.x+r.y*i.y;this._3d&&(o+=r.z*i.z);var s=e(u(o));return f/3>s},reduce:function(){var t,n,r=0,i=0,o=.01,s=[],u=[],a=this.extrema().values;for(-1===a.indexOf(0)&&(a=[0].concat(a)),-1===a.indexOf(1)&&a.push(1),r=a[0],t=1;t<a.length;t++)i=a[t],n=this.split(r,i),n._t1=r,n._t2=i,s.push(n),r=i;return s.forEach(function(t){for(r=0,i=0;1>=i;)for(i=r+o;1+o>=i;i+=o)if(n=t.split(r,i),!n.simple()){if(i-=o,e(r-i)<o)return[];n=t.split(r,i),n._t1=h.map(r,0,1,t._t1,t._t2),n._t2=h.map(i,0,1,t._t1,t._t2),u.push(n),r=i;break}1>r&&(n=t.split(r,1),n._t1=h.map(r,0,1,t._t1,t._t2),n._t2=t._t2,u.push(n))}),u},scale:function(t){var n=this.order,r=!1;if("function"==typeof t&&(r=t),r&&2===n)return this.raise().scale(r);var i=this.clockwise,e=r?r(0):t,o=r?r(1):t,s=[this.offset(0,10),this.offset(1,10)],u=h.lli4(s[0],s[0].c,s[1],s[1].c);if(!u)throw new Error("cannot scale this curve. Try reducing it first.");var f=this.points,c=[];return[0,1].forEach(function(t){var r=c[t*n]=h.copy(f[t*n]);r.x+=(t?o:e)*s[t].n.x,r.y+=(t?o:e)*s[t].n.y}.bind(this)),r?([0,1].forEach(function(e){if(2!==this.order||!e){var o=f[e+1],s={x:o.x-u.x,y:o.y-u.y},h=r?r((e+1)/n):t;r&&!i&&(h=-h);var x=a(s.x*s.x+s.y*s.y);s.x/=x,s.y/=x,c[e+1]={x:o.x+h*s.x,y:o.y+h*s.y}}}.bind(this)),new y(c)):([0,1].forEach(function(t){if(2!==this.order||!t){var r=c[t*n],i=this.derivative(t),e={x:r.x+i.x,y:r.y+i.y};c[t+1]=h.lli4(r,e,u,f[t+1])}}.bind(this)),new y(c))},outline:function(t,n,r,i){function e(t,n,r,i,e){return function(o){var s=i/r,u=(i+e)/r,a=n-t;return h.map(o,0,1,t+s*a,t+u*a)}}n="undefined"==typeof n?t:n;var o,s=this.reduce(),u=s.length,a=[],f=[],c=0,y=this.length(),p="undefined"!=typeof r&&"undefined"!=typeof i;s.forEach(function(o){_=o.length(),p?(a.push(o.scale(e(t,r,y,c,_))),f.push(o.scale(e(-n,-i,y,c,_)))):(a.push(o.scale(t)),f.push(o.scale(-n))),c+=_}),f=f.map(function(t){return o=t.points,o[3]?t.points=[o[3],o[2],o[1],o[0]]:t.points=[o[2],o[1],o[0]],t}).reverse();var l=a[0].points[0],v=a[u-1].points[a[u-1].points.length-1],d=f[u-1].points[f[u-1].points.length-1],m=f[0].points[0],g=h.makeline(d,l),z=h.makeline(v,m),b=[g].concat(a).concat([z]).concat(f),_=b.length;return new x(b)},outlineshapes:function(t,n,r){n=n||t;for(var i=this.outline(t,n).curves,e=[],o=1,s=i.length;s/2>o;o++){var u=h.makeshape(i[o],i[s-o],r);u.startcap.virtual=o>1,u.endcap.virtual=s/2-1>o,e.push(u)}return e},intersects:function(t,n){return t?t.p1&&t.p2?this.lineIntersects(t):(t instanceof y&&(t=t.reduce()),this.curveintersects(this.reduce(),t,n)):this.selfintersects(n)},lineIntersects:function(t){var n=o(t.p1.x,t.p2.x),r=o(t.p1.y,t.p2.y),i=s(t.p1.x,t.p2.x),e=s(t.p1.y,t.p2.y),u=this;return h.roots(this.points,t).filter(function(t){var o=u.get(t);return h.between(o.x,n,i)&&h.between(o.y,r,e)})},selfintersects:function(t){var n,r,i,e,o=this.reduce(),s=o.length-2,u=[];for(n=0;s>n;n++)i=o.slice(n,n+1),e=o.slice(n+2),r=this.curveintersects(i,e,t),u=u.concat(r);return u},curveintersects:function(t,n,r){var i=[];t.forEach(function(t){n.forEach(function(n){t.overlaps(n)&&i.push({left:t,right:n})})});var e=[];return i.forEach(function(t){var n=h.pairiteration(t.left,t.right,r);n.length>0&&(e=e.concat(n))}),e},arcs:function(t){t=t||.5;var n=[];return this._iterate(t,n)},_error:function(t,n,r,i){var o=(i-r)/4,s=this.get(r+o),u=this.get(i-o),a=h.dist(t,n),f=h.dist(t,s),c=h.dist(t,u);return e(f-a)+e(c-a)},_iterate:function(t,n){var r,i=0,e=1;do{r=0,e=1;var o,s,u,a,f,c=this.get(i),x=!1,y=!1,p=e,l=1,v=0;do{y=x,a=u,p=(i+e)/2,v++,o=this.get(p),s=this.get(e),u=h.getccenter(c,o,s);var d=this._error(u,c,i,e);if(x=t>=d,f=y&&!x,f||(l=e),x){if(e>=1){l=1,a=u;break}e+=(e-i)/2}else e=p}while(!f&&r++<100);if(r>=100){console.error("arc abstraction somehow failed...");break}a=a?a:u,n.push(a),i=l}while(1>e);return n}},t.exports=y}()},function(t,n,r){"use strict";!function(){var n=Math.abs,i=Math.cos,e=Math.sin,o=Math.acos,s=Math.atan2,u=Math.sqrt,a=Math.pow,f=function(t){return 0>t?-a(-t,1/3):a(t,1/3)},c=Math.PI,h=2*c,x=c/2,y=1e-6,p={Tvalues:[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213],Cvalues:[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872],arcfn:function(t,n){var r=n(t),i=r.x*r.x+r.y*r.y;return"undefined"!=typeof r.z&&(i+=r.z*r.z),u(i)},between:function(t,n,r){return t>=n&&r>=t||p.approximately(t,n)||p.approximately(t,r)},approximately:function(t,r,i){return n(t-r)<=(i||y)},length:function(t){var n,r,i=.5,e=0,o=p.Tvalues.length;for(n=0;o>n;n++)r=i*p.Tvalues[n]+i,e+=p.Cvalues[n]*p.arcfn(r,t);return i*e},map:function(t,n,r,i,e){var o=r-n,s=e-i,u=t-n,a=u/o;return i+s*a},lerp:function(t,n,r){var i={x:n.x+t*(r.x-n.x),y:n.y+t*(r.y-n.y)};return n.z&&r.z&&(i.z=n.z+t*(r.z-n.z)),i},pointToString:function(t){var n=t.x+"/"+t.y;return"undefined"!=typeof t.z&&(n+="/"+t.z),n},pointsToString:function(t){return"["+t.map(p.pointToString).join(", ")+"]"},copy:function(t){return JSON.parse(JSON.stringify(t))},angle:function(t,n,r){var i,e=n.x-t.x,o=n.y-t.y,a=r.x-t.x,f=r.y-t.y,c=e*f-o*a,h=u(e*e+o*o),x=u(a*a+f*f);return e/=h,o/=h,a/=x,f/=x,i=e*a+o*f,s(c,i)},round:function(t,n){var r=""+t,i=r.indexOf(".");return parseFloat(r.substring(0,i+1+n))},dist:function(t,n){var r=t.x-n.x,i=t.y-n.y;return u(r*r+i*i)},closest:function(t,n){var r,i,e=a(2,63);return t.forEach(function(t,o){i=p.dist(n,t),e>i&&(e=i,r=o)}),{mdist:e,mpos:r}},abcratio:function(t,r){if(2!==r&&3!==r)return!1;if("undefined"==typeof t)t=.5;else if(0===t||1===t)return t;var i=a(t,r)+a(1-t,r),e=i-1;return n(e/i)},projectionratio:function(t,n){if(2!==n&&3!==n)return!1;if("undefined"==typeof t)t=.5;else if(0===t||1===t)return t;var r=a(1-t,n),i=a(t,n)+r;return r/i},lli8:function(t,n,r,i,e,o,s,u){var a=(t*i-n*r)*(e-s)-(t-r)*(e*u-o*s),f=(t*i-n*r)*(o-u)-(n-i)*(e*u-o*s),c=(t-r)*(o-u)-(n-i)*(e-s);return 0==c?!1:{x:a/c,y:f/c}},lli4:function(t,n,r,i){var e=t.x,o=t.y,s=n.x,u=n.y,a=r.x,f=r.y,c=i.x,h=i.y;return p.lli8(e,o,s,u,a,f,c,h)},lli:function(t,n){return p.lli4(t,t.c,n,n.c)},makeline:function(t,n){var i=r(1),e=t.x,o=t.y,s=n.x,u=n.y,a=(s-e)/3,f=(u-o)/3;return new i(e,o,e+a,o+f,e+2*a,o+2*f,s,u)},findbbox:function(t){var n=99999999,r=n,i=-n,e=i;return t.forEach(function(t){var o=t.bbox();n>o.x.min&&(n=o.x.min),r>o.y.min&&(r=o.y.min),i<o.x.max&&(i=o.x.max),e<o.y.max&&(e=o.y.max)}),{x:{min:n,mid:(n+i)/2,max:i,size:i-n},y:{min:r,mid:(r+e)/2,max:e,size:e-r}}},shapeintersections:function(t,n,r,i,e){if(!p.bboxoverlap(n,i))return[];var o=[],s=[t.startcap,t.forward,t.back,t.endcap],u=[r.startcap,r.forward,r.back,r.endcap];return s.forEach(function(n){n.virtual||u.forEach(function(i){if(!i.virtual){var s=n.intersects(i,e);s.length>0&&(s.c1=n,s.c2=i,s.s1=t,s.s2=r,o.push(s))}})}),o},makeshape:function(t,n,r){var i=n.points.length,e=t.points.length,o=p.makeline(n.points[i-1],t.points[0]),s=p.makeline(t.points[e-1],n.points[0]),u={startcap:o,forward:t,back:n,endcap:s,bbox:p.findbbox([o,t,n,s])},a=p;return u.intersections=function(t){return a.shapeintersections(u,u.bbox,t,t.bbox,r)},u},getminmax:function(t,n,r){if(!r)return{min:0,max:0};var i,e,o=0x10000000000000000,s=-o;-1===r.indexOf(0)&&(r=[0].concat(r)),-1===r.indexOf(1)&&r.push(1);for(var u=0,a=r.length;a>u;u++)i=r[u],e=t.get(i),e[n]<o&&(o=e[n]),e[n]>s&&(s=e[n]);return{min:o,mid:(o+s)/2,max:s,size:s-o}},align:function(t,n){var r=n.p1.x,o=n.p1.y,u=-s(n.p2.y-o,n.p2.x-r),a=function(t){return{x:(t.x-r)*i(u)-(t.y-o)*e(u),y:(t.x-r)*e(u)+(t.y-o)*i(u)}};return t.map(a)},roots:function(t,n){n=n||{p1:{x:0,y:0},p2:{x:1,y:0}};var r=t.length-1,e=p.align(t,n),s=function(t){return t>=0&&1>=t};if(2===r){var a=e[0].y,c=e[1].y,x=e[2].y,y=a-2*c+x;if(0!==y){var l=-u(c*c-a*x),v=-a+c,d=-(l+v)/y,m=-(-l+v)/y;return[d,m].filter(s)}return c!==x&&0===y?[(2*c-x)/2*(c-x)].filter(s):[]}var g,d,z,b,_,w=e[0].y,E=e[1].y,S=e[2].y,M=e[3].y,y=-w+3*E-3*S+M,a=(3*w-6*E+3*S)/y,c=(-3*w+3*E)/y,x=w/y,e=(3*c-a*a)/3,k=e/3,O=(2*a*a*a-9*a*c+27*x)/27,T=O/2,j=T*T+k*k*k;if(0>j){var C=-e/3,q=C*C*C,U=u(q),B=-O/(2*U),F=-1>B?-1:B>1?1:B,I=o(F),J=f(U),N=2*J;return z=N*i(I/3)-a/3,b=N*i((I+h)/3)-a/3,_=N*i((I+2*h)/3)-a/3,[z,b,_].filter(s)}if(0===j)return g=0>T?f(-T):-f(T),z=2*g-a/3,b=-g-a/3,[z,b].filter(s);var P=u(j);return g=f(-T+P),d=f(T+P),[g-d-a/3].filter(s)},droots:function(t){if(3===t.length){var n=t[0],r=t[1],i=t[2],e=n-2*r+i;if(0!==e){var o=-u(r*r-n*i),s=-n+r,a=-(o+s)/e,f=-(-o+s)/e;return[a,f]}return r!==i&&0===e?[(2*r-i)/(2*(r-i))]:[]}if(2===t.length){var n=t[0],r=t[1];return n!==r?[n/(n-r)]:[]}},inflections:function(t){if(t.length<4)return[];var n=p.align(t,{p1:t[0],p2:t.slice(-1)[0]}),r=n[2].x*n[1].y,i=n[3].x*n[1].y,e=n[1].x*n[2].y,o=n[3].x*n[2].y,s=18*(-3*r+2*i+3*e-o),u=18*(3*r-i-3*e),a=18*(e-r);if(p.approximately(s,0))return[];var f=u*u-4*s*a,c=Math.sqrt(f),o=2*s;return p.approximately(o,0)?[]:[(c-u)/o,-(u+c)/o].filter(function(t){return t>=0&&1>=t})},bboxoverlap:function(t,r){var i,e,o,s,u,a=["x","y"],f=a.length;for(i=0;f>i;i++)if(e=a[i],o=t[e].mid,s=r[e].mid,u=(t[e].size+r[e].size)/2,n(o-s)>=u)return!1;return!0},expandbox:function(t,n){n.x.min<t.x.min&&(t.x.min=n.x.min),n.y.min<t.y.min&&(t.y.min=n.y.min),n.z&&n.z.min<t.z.min&&(t.z.min=n.z.min),n.x.max>t.x.max&&(t.x.max=n.x.max),n.y.max>t.y.max&&(t.y.max=n.y.max),n.z&&n.z.max>t.z.max&&(t.z.max=n.z.max),t.x.mid=(t.x.min+t.x.max)/2,t.y.mid=(t.y.min+t.y.max)/2,t.z&&(t.z.mid=(t.z.min+t.z.max)/2),t.x.size=t.x.max-t.x.min,t.y.size=t.y.max-t.y.min,t.z&&(t.z.size=t.z.max-t.z.min)},pairiteration:function(t,n,r){var i=t.bbox(),e=n.bbox(),o=1e5,s=r||.5;if(i.x.size+i.y.size<s&&e.x.size+e.y.size<s)return[(o*(t._t1+t._t2)/2|0)/o+"/"+(o*(n._t1+n._t2)/2|0)/o];var u=t.split(.5),a=n.split(.5),f=[{left:u.left,right:a.left},{left:u.left,right:a.right},{left:u.right,right:a.right},{left:u.right,right:a.left}];f=f.filter(function(t){return p.bboxoverlap(t.left.bbox(),t.right.bbox())});var c=[];return 0===f.length?c:(f.forEach(function(t){c=c.concat(p.pairiteration(t.left,t.right,s))}),c=c.filter(function(t,n){return c.indexOf(t)===n}))},getccenter:function(t,n,r){var o,u=n.x-t.x,a=n.y-t.y,f=r.x-n.x,c=r.y-n.y,y=u*i(x)-a*e(x),l=u*e(x)+a*i(x),v=f*i(x)-c*e(x),d=f*e(x)+c*i(x),m=(t.x+n.x)/2,g=(t.y+n.y)/2,z=(n.x+r.x)/2,b=(n.y+r.y)/2,_=m+y,w=g+l,E=z+v,S=b+d,M=p.lli8(m,g,_,w,z,b,E,S),k=p.dist(M,t),O=s(t.y-M.y,t.x-M.x),T=s(n.y-M.y,n.x-M.x),j=s(r.y-M.y,r.x-M.x);return j>O?((O>T||T>j)&&(O+=h),O>j&&(o=j,j=O,O=o)):T>j&&O>T?(o=j,j=O,O=o):j+=h,M.s=O,M.e=j,M.r=k,M}};t.exports=p}()},function(t,n,r){"use strict";!function(){var n=r(2),i=function(t){this.curves=[],this._3d=!1,t&&(this.curves=t,this._3d=this.curves[0]._3d)};i.prototype={valueOf:function(){return this.toString()},toString:function(){return n.pointsToString(this.points)},addCurve:function(t){this.curves.push(t),this._3d=this._3d||t._3d},length:function(){return this.curves.map(function(t){return t.length()}).reduce(function(t,n){return t+n})},curve:function(t){return this.curves[t]},bbox:function e(){for(var t=this.curves,e=t[0].bbox(),r=1;r<t.length;r++)n.expandbox(e,t[r].bbox());return e},offset:function o(t){var o=[];return this.curves.forEach(function(n){o=o.concat(n.offset(t))}),new i(o)}},t.exports=i}()}]);
var CubicSpline,MonotonicCubicSpline; MonotonicCubicSpline=function(){function p(f,d){var e,k,h,j,b,l,i,a,g,c,m;i=f.length;h=[];l=[];e=[];k=[];j=[];a=[];b=0;for(g=i-1;0<=g?b<g:b>g;0<=g?b+=1:b-=1){h[b]=(d[b+1]-d[b])/(f[b+1]-f[b]);if(b>0)l[b]=(h[b-1]+h[b])/2}l[0]=h[0];l[i-1]=h[i-2];g=[];b=0;for(c=i-1;0<=c?b<c:b>c;0<=c?b+=1:b-=1)h[b]===0&&g.push(b);c=0;for(m=g.length;c<m;c++){b=g[c];l[b]=l[b+1]=0}b=0;for(g=i-1;0<=g?b<g:b>g;0<=g?b+=1:b-=1){e[b]=l[b]/h[b];k[b]=l[b+1]/h[b];j[b]=Math.pow(e[b],2)+Math.pow(k[b],2);a[b]=3/Math.sqrt(j[b])}g=[]; b=0;for(c=i-1;0<=c?b<c:b>c;0<=c?b+=1:b-=1)j[b]>9&&g.push(b);j=0;for(c=g.length;j<c;j++){b=g[j];l[b]=a[b]*e[b]*h[b];l[b+1]=a[b]*k[b]*h[b]}this.x=f.slice(0,i);this.y=d.slice(0,i);this.m=l}p.prototype.interpolate=function(f){var d,e,k,h;for(e=d=this.x.length-2;d<=0?e<=0:e>=0;d<=0?e+=1:e-=1)if(this.x[e]<=f)break;d=this.x[e+1]-this.x[e];f=(f-this.x[e])/d;k=Math.pow(f,2);h=Math.pow(f,3);return(2*h-3*k+1)*this.y[e]+(h-2*k+f)*d*this.m[e]+(-2*h+3*k)*this.y[e+1]+(h-k)*d*this.m[e+1]};return p}(); CubicSpline=function(){function p(f,d,e,k){var h,j,b,l,i,a,g,c,m,o,n;if(f!=null&&d!=null){b=e!=null&&k!=null;c=f.length-1;i=[];o=[];g=[];m=[];n=[];j=[];h=[];l=[];for(a=0;0<=c?a<c:a>c;0<=c?a+=1:a-=1)i[a]=f[a+1]-f[a];if(b){o[0]=3*(d[1]-d[0])/i[0]-3*e;o[c]=3*k-3*(d[c]-d[c-1])/i[c-1]}for(a=1;1<=c?a<c:a>c;1<=c?a+=1:a-=1)o[a]=3/i[a]*(d[a+1]-d[a])-3/i[a-1]*(d[a]-d[a-1]);if(b){g[0]=2*i[0];m[0]=0.5;n[0]=o[0]/g[0]}else{g[0]=1;m[0]=0;n[0]=0}for(a=1;1<=c?a<c:a>c;1<=c?a+=1:a-=1){g[a]=2*(f[a+1]-f[a-1])-i[a-1]* m[a-1];m[a]=i[a]/g[a];n[a]=(o[a]-i[a-1]*n[a-1])/g[a]}if(b){g[c]=i[c-1]*(2-m[c-1]);n[c]=(o[c]-i[c-1]*n[c-1])/g[c];j[c]=n[c]}else{g[c]=1;n[c]=0;j[c]=0}for(a=e=c-1;e<=0?a<=0:a>=0;e<=0?a+=1:a-=1){j[a]=n[a]-m[a]*j[a+1];h[a]=(d[a+1]-d[a])/i[a]-i[a]*(j[a+1]+2*j[a])/3;l[a]=(j[a+1]-j[a])/(3*i[a])}this.x=f.slice(0,c+1);this.a=d.slice(0,c);this.b=h;this.c=j.slice(0,c);this.d=l}}p.prototype.derivative=function(){var f,d,e,k,h;d=new this.constructor;d.x=this.x.slice(0,this.x.length);d.a=this.b.slice(0,this.b.length); h=this.c;e=0;for(k=h.length;e<k;e++){f=h[e];d.b=2*f}h=this.d;e=0;for(k=h.length;e<k;e++){f=h[e];d.c=3*f}f=0;for(e=this.d.length;0<=e?f<e:f>e;0<=e?f+=1:f-=1)d.d=0;return d};p.prototype.interpolate=function(f){var d,e;for(d=e=this.x.length-1;e<=0?d<=0:d>=0;e<=0?d+=1:d-=1)if(this.x[d]<=f)break;f=f-this.x[d];return this.a[d]+this.b[d]*f+this.c[d]*Math.pow(f,2)+this.d[d]*Math.pow(f,3)};return p}();
/*	Curve calc function for canvas 2.3.4
 *	(c) Epistemex 2013-2016
 *	www.epistemex.com
 *	License: MIT
 */
function getCurvePoints(h,t,f,c){t=(typeof t==="number")?t:0.5;f=(typeof f==="number")?f:25;var j,d=1,e=h.length,n=0,m=(e-2)*f+2+(c?2*f:0),k=new Float32Array(m),a=new Float32Array((f+2)*4),b=4;j=h.slice(0);if(c){j.unshift(h[e-1]);j.unshift(h[e-2]);j.push(h[0],h[1])}else{j.unshift(h[1]);j.unshift(h[0]);j.push(h[e-2],h[e-1])}a[0]=1;for(;d<f;d++){var o=d/f,p=o*o,r=p*o,q=r*2,s=p*3;a[b++]=q-s+1;a[b++]=s-q;a[b++]=r-2*p+o;a[b++]=r-p}a[++b]=1;g(j,a,e,t);if(c){j=[];j.push(h[e-4],h[e-3],h[e-2],h[e-1],h[0],h[1],h[2],h[3]);g(j,a,4,t)}function g(G,z,B,M){for(var A=2,H;A<B;A+=2){var C=G[A],D=G[A+1],E=G[A+2],F=G[A+3],I=(E-G[A-2])*M,J=(F-G[A-1])*M,K=(G[A+4]-C)*M,L=(G[A+5]-D)*M,u=0,v,w,x,y;for(H=0;H<f;H++){v=z[u++];w=z[u++];x=z[u++];y=z[u++];k[n++]=v*C+w*E+x*I+y*K;k[n++]=v*D+w*F+x*J+y*L}}}e=c?0:h.length-2;k[n++]=h[e++];k[n]=h[e];return k}if(typeof exports!=="undefined"){exports.getCurvePoints=getCurvePoints};
/*****************************************************************************************
*
* Project Name:		jsDraw2DX (SVG/VML based Graphics Library for JavaScript, HTML5 Ready)
* Version:		Alpha 1.0.7 (16-Nov-2012) (Compressed)
* Project Homepage:	http://jsdraw2dx.jsfiction.com
* Author:			Sameer Burle
* Copyright 2012:		jsFiction.com (http://www.jsfiction.com)
* Licensed Under:		LGPL
*
* This program (library) is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*****************************************************************************************/
function jsDraw2DX(){}jsDraw2DX._RefID=0;jsDraw2DX._isVML=false;jsDraw2DX.checkIE=function(){if(navigator.appName=="Microsoft Internet Explorer"){var a=9;if(navigator.appVersion.indexOf("MSIE")!=-1){a=parseFloat(navigator.appVersion.split("MSIE")[1])}if(a<9){jsDraw2DX._isVML=true}}};jsDraw2DX.fact=function(c){var b=1;for(var a=1;a<=c;a++){b=b*a}return b};jsDraw2DX.init=function(){jsDraw2DX.checkIE();if(jsDraw2DX._isVML){document.namespaces.add("v","urn:schemas-microsoft-com:vml","#default#VML");var c=["fill","stroke","path","textpath"];for(var b=0,a=c.length;b<a;b++){document.createStyleSheet().addRule("v\\:"+c[b],"behavior: url(#default#VML);")}}};jsDraw2DX.init();function jxGraphics(r){this.origin=new jxPoint(0,0);this.scale=1;this.coordinateSystem="default";var a=new Array();var m,p,e,n;if(r){m=r;m.style.overflow="hidden"}else{m=document.body}if(!jsDraw2DX._isVML){p=document.createElementNS("http://www.w3.org/2000/svg","svg");m.appendChild(p);n=document.createElementNS("http://www.w3.org/2000/svg","defs");p.appendChild(n);p.style.position="absolute";p.style.top="0px";p.style.left="0px";p.style.width=m.style.width;p.style.height=m.style.height}else{e=document.createElement("v:group");e.style.position="absolute";e.style.top="0px";e.style.left="0px";m.appendChild(e)}this.getDefs=l;function l(){return n}this.addShape=b;function b(v){var w=this.indexOfShape(v);if(w<0){a.push(v)}}this.removeShape=d;function d(v){var w=this.indexOfShape(v);if(w>=0){a.splice(w,1)}}this.getType=o;function o(){return"jxGraphics"}this.getDiv=c;function c(){return m}this.getSVG=s;function s(){return p}this.getVML=g;function g(){return e}this.logicalToPhysicalPoint=j;function j(v){if(this.coordinateSystem.toLowerCase()=="cartecian"){return new jxPoint(Math.round(v.x*this.scale+this.origin.x),Math.round(this.origin.y-v.y*this.scale))}else{return new jxPoint(Math.round(v.x*this.scale+this.origin.x),Math.round(v.y*this.scale+this.origin.y))}}this.draw=h;function h(v){return v.draw(this)}this.remove=u;function u(v){return v.remove(this)}this.redrawAll=q;function q(){for(ind in a){a[ind].draw(this)}}this.getShapesCount=t;function t(){return a.length}this.getShape=k;function k(v){return a[v]}this.indexOfShape=f;function f(v){var A=-1,z=a.length;for(var w=0;w<z;w++){if(v==a[w]){A=w}}return A}}function jxColor(){var e="#000000";switch(arguments.length){case 1:e=arguments[0];break;case 3:var d=arguments[0];var c=arguments[1];var a=arguments[2];e=jxColor.rgbToHex(d,c,a);break}this.getType=f;function f(){return"jxColor"}this.getValue=b;function b(){return e}}jxColor.rgbToHex=function(a,c,b){if(a<0||a>255||c<0||c>255||b<0||b>255){return false}var d=Math.round(b)+256*Math.round(c)+65536*Math.round(a);return"#"+e(d.toString(16),6);function e(h,f){var g=h+"";while(g.length<f){g="0"+g}return g}};jxColor.hexToRgb=function(d){var a,c,b;if(d.charAt(0)=="#"){d=d.substring(1,7)}a=parseInt(d.substring(0,2),16);c=parseInt(d.substring(2,4),16);b=parseInt(d.substring(4,6),16);if(a<0||a>255||c<0||c>255||b<0||b>255){return false}return new Array(a,c,b)};function jxFont(e,b,d,g,a){this.family=null;this.size=null;this.style=null;this.weight=null;this.variant=null;if(e){this.family=e}if(g){this.weight=g}if(b){this.size=b}if(d){this.style=d}if(a){this.variant=a}this.updateSVG=f;function f(j){if(this.family){j.setAttribute("font-family",this.family)}else{j.setAttribute("font-family","")}if(this.weight){j.setAttribute("font-weight",this.weight)}else{j.setAttribute("font-weight","")}if(this.size){j.setAttribute("font-size",this.size)}else{j.setAttribute("font-size","")}if(this.style){j.setAttribute("font-style",this.style)}else{j.setAttribute("font-style","")}if(this.variant){j.setAttribute("font-variant",this.variant)}else{j.setAttribute("font-variant","")}}this.updateVML=c;function c(j){if(this.family){j.style.fontFamily="'"+this.family+"'"}else{j.style.fontFamily=""}if(this.weight){j.style.fontWeight=this.weight}else{j.style.fontWeight=""}if(this.size){j.style.fontSize=this.size}else{j.style.fontSize=""}if(this.style){j.style.fontStyle=this.style}else{j.style.fontStyle=""}if(this.variant){j.style.fontVariant=this.variant}else{j.style.fontVariant=""}}this.getType=h;function h(){return"jxFont"}}jxFont.updateSVG=function(a){a.setAttribute("font-family","");a.setAttribute("font-weight","");a.setAttribute("font-size","");a.setAttribute("font-style","");a.setAttribute("font-variant","")};jxFont.updateVML=function(a){a.style.fontFamily="";a.style.fontWeight="";a.style.fontSize="";a.style.fontStyle="";a.style.fontVariant=""};function jxPen(a,c,e){this.color=null;this.width=null;this.dashStyle=null;if(a){this.color=a}else{this.color=new jxColor("#000000")}if(c){this.width=c}else{this.width="1px"}if(e){this.dashStyle=e}this.updateSVG=d;function d(h){h.setAttribute("stroke",this.color.getValue());h.setAttribute("stroke-width",this.width);if(this.dashStyle){var g=parseInt(this.width);switch(this.dashStyle.toLowerCase()){case"shortdash":h.setAttribute("stroke-dasharray",g*3+" "+g);break;case"shortdot":h.setAttribute("stroke-dasharray",g+" "+g);break;case"shortdashdot":h.setAttribute("stroke-dasharray",g*3+" "+g+" "+g+" "+g);break;case"shortdashdotdot":h.setAttribute("stroke-dasharray",g*3+" "+g+" "+g+" "+g+" "+g+" "+g);break;case"dot":h.setAttribute("stroke-dasharray",g+" "+g*3);break;case"dash":h.setAttribute("stroke-dasharray",g*4+" "+g*3);break;case"longdash":h.setAttribute("stroke-dasharray",g*8+" "+g*3);break;case"dashdot":h.setAttribute("stroke-dasharray",g*4+" "+g*3+" "+g+" "+g*3);break;case"longdashdot":h.setAttribute("stroke-dasharray",g*8+" "+g*3+" "+g+" "+g*3);break;case"longdashdotdot":h.setAttribute("stroke-dasharray",g*8+" "+g*3+" "+g+" "+g*3+" "+g+" "+g*3);break;default:h.setAttribute("stroke-dasharray",this.dashStyle);break}}}this.updateVML=b;function b(g){g.Stroke.JoinStyle="miter";g.Stroke.MiterLimit="5";g.StrokeColor=this.color.getValue();g.StrokeWeight=this.width;if(this.dashStyle){g.Stroke.DashStyle=this.dashStyle}if(parseInt(this.width)==0){g.Stroked="False"}}this.getType=f;function f(){return"jxPen"}}function jxBrush(a,e){this.color=null;this.fillType=null;this.color2=null;this.angle=null;if(a){this.color=a}else{this.color=new jxColor("#000000")}if(e){this.fillType=e}else{this.fillType="solid"}this.color2=new jxColor("#FFFFFF");this.updateSVG=c;function c(h,f){var m=null,l;m=h.getAttribute("fill");if(m){if(m.substr(0,5)=="url(#"){m=m.substr(5,m.length-6);l=document.getElementById(m)}else{m=null}}if(this.fillType=="linear-gradient"||this.fillType=="lin-grad"){var g=document.createElementNS("http://www.w3.org/2000/svg","linearGradient");if(m){f.replaceChild(g,l)}else{f.appendChild(g)}var k=document.createElementNS("http://www.w3.org/2000/svg","stop");g.appendChild(k);var j=document.createElementNS("http://www.w3.org/2000/svg","stop");g.appendChild(j);jsDraw2DX._RefID++;g.setAttribute("id","jsDraw2DX_RefID_"+jsDraw2DX._RefID);if(this.angle!=null){g.setAttribute("gradientTransform","rotate("+this.angle+" 0.5 0.5)")}else{g.setAttribute("gradientTransform","rotate(0 0.5 0.5)")}k.setAttribute("offset","0%");k.setAttribute("style","stop-color:"+this.color.getValue()+";stop-opacity:1");j.setAttribute("offset","100%");j.setAttribute("style","stop-color:"+this.color2.getValue()+";stop-opacity:1");g.appendChild(k);g.appendChild(j);h.setAttribute("fill","url(#jsDraw2DX_RefID_"+jsDraw2DX._RefID+")")}else{h.setAttribute("fill",this.color.getValue())}}this.updateVML=b;function b(f){f.On="true";if(this.fillType=="solid"){f.Type="solid";f.Color=this.color.getValue();f.Color2="";f.Angle=270}else{f.Type="gradient";if(this.angle!=null){f.Angle=270-this.angle}else{f.Angle=270}f.Color=this.color.getValue();f.Color2=this.color2.getValue()}}this.getType=d;function d(){return"jxBrush"}}function jxPoint(a,c){this.x=a;this.y=c;this.getType=b;function b(){return"jxPoint"}}function jxLine(a,h,d){this.fromPoint=a;this.toPoint=h;this.pen=null;var f,g=true;var m;if(d){this.pen=d}if(!jsDraw2DX._isVML){f=document.createElementNS("http://www.w3.org/2000/svg","line")}else{f=document.createElement("v:line")}this.getType=j;function j(){return"jxLine"}this.addEventListener=b;function b(o,p){if(f.addEventListener){f.addEventListener(o,q,false)}else{if(f.attachEvent){f.attachEvent("on"+o,q)}}var n=this;function q(r){p(r,n)}}this.draw=k;function k(z){var o,v;o=z.logicalToPhysicalPoint(this.fromPoint);v=z.logicalToPhysicalPoint(this.toPoint);var q,t,s=false;q=this.pen.color.getValue();t=this.pen.width;var r,A,p,w;r=o.x;A=o.y;p=v.x;w=v.y;f.style.display="none";if(!jsDraw2DX._isVML){var u=z.getSVG();if(g){u.appendChild(f);g=false}if(!this.pen){f.setAttribute("stroke","none")}else{this.pen.updateSVG(f)}f.setAttribute("x1",r);f.setAttribute("y1",A);f.setAttribute("x2",p);f.setAttribute("y2",w)}else{var n=z.getVML();if(g){n.appendChild(f);g=false}if(!this.pen){f.Stroked="False"}else{this.pen.updateVML(f)}f.style.position="absolute";f.From=r+","+A;f.To=p+","+w}f.style.display="";if(m&&z!=m){m.removeShape(this)}m=z;m.addShape(this)}this.remove=c;function c(){if(m){if(!jsDraw2DX._isVML){var o=m.getSVG();o.removeChild(f)}else{var n=m.getVML();n.removeChild(f)}m.removeShape(this);m=null;g=true}}this.show=l;function l(){f.style.display=""}this.hide=e;function e(){f.style.display="none"}}function jxRect(n,a,o,d,h){this.point=n;this.width=a;this.height=o;this.pen=null;this.brush=null;var f,g=true;var m;if(d){this.pen=d}if(h){this.brush=h}if(!jsDraw2DX._isVML){f=document.createElementNS("http://www.w3.org/2000/svg","rect")}else{f=document.createElement("v:rect")}this.getType=j;function j(){return"jxRect"}this.addEventListener=b;function b(q,r){if(f.addEventListener){f.addEventListener(q,s,false)}else{if(f.attachEvent){f.attachEvent("on"+q,s)}}var p=this;function s(t){r(t,p)}}this.draw=k;function k(t){var r,w;r=t.logicalToPhysicalPoint(this.point);w=t.scale;var u,v;u=r.x;v=r.y;f.style.display="none";if(!jsDraw2DX._isVML){var s=t.getSVG();if(g){s.appendChild(f);g=false}if(!this.pen){f.setAttribute("stroke","none")}else{this.pen.updateSVG(f)}if(!this.brush){f.setAttribute("fill","none")}else{this.brush.updateSVG(f,t.getDefs())}f.setAttribute("x",u);f.setAttribute("y",v);f.setAttribute("width",w*this.width);f.setAttribute("height",w*this.height);f.style.position="absolute"}else{var q=t.getVML(),p;if(g){q.appendChild(f);g=false}if(!this.pen){f.Stroked="False"}else{this.pen.updateVML(f)}p=f.fill;if(!this.brush){p.On="false"}else{this.brush.updateVML(p)}f.style.width=w*this.width;f.style.height=w*this.height;f.style.position="absolute";f.style.top=v;f.style.left=u}f.style.display="";if(m&&t!=m){m.removeShape(this)}m=t;m.addShape(this)}this.remove=c;function c(){if(m){if(!jsDraw2DX._isVML){var q=m.getSVG();q.removeChild(f)}else{var p=m.getVML();p.removeChild(f)}m.removeShape(this);m=null;g=true}}this.show=l;function l(){f.style.display=""}this.hide=e;function e(){f.style.display="none"}}function jxPolyline(m,c,g){this.points=m;this.pen=null;this.brush=null;var e,f=true;var l;if(c){this.pen=c}if(g){this.brush=g}if(!jsDraw2DX._isVML){e=document.createElementNS("http://www.w3.org/2000/svg","polyline")}else{e=document.createElement("v:polyline")}this.getType=h;function h(){return"jxPolyline"}this.addEventListener=a;function a(o,p){if(e.addEventListener){e.addEventListener(o,q,false)}else{if(e.attachEvent){e.attachEvent("on"+o,q)}}var n=this;function q(r){p(r,n)}}this.draw=j;function j(q){var r=new Array(),s="";for(ind in this.points){r[ind]=q.logicalToPhysicalPoint(this.points[ind])}for(ind in r){s=s+r[ind].x+","+r[ind].y+" "}e.style.display="none";if(!jsDraw2DX._isVML){var p=q.getSVG();if(f){p.appendChild(e);f=false}if(!this.pen){e.setAttribute("stroke","none")}else{this.pen.updateSVG(e)}if(!this.brush){e.setAttribute("fill","none")}else{this.brush.updateSVG(e,q.getDefs())}e.style.position="absolute";e.setAttribute("points",s)}else{var o=q.getVML(),n;if(f){o.appendChild(e);f=false}if(!this.pen){e.Stroked="False"}else{this.pen.updateVML(e)}n=e.fill;if(!this.brush){n.On="false"}else{this.brush.updateVML(n)}e.style.position="absolute";e.Points.Value=s}e.style.display="";if(l&&q!=l){l.removeShape(this)}l=q;l.addShape(this)}this.remove=b;function b(){if(l){if(!jsDraw2DX._isVML){var o=l.getSVG();o.removeChild(e)}else{var n=l.getVML();n.removeChild(e)}l.removeShape(this);l=null;f=true}}this.show=k;function k(){e.style.display=""}this.hide=d;function d(){e.style.display="none"}}function jxPolygon(m,c,g){this.points=m;this.pen=null;this.brush=null;var e,f=true;var l;if(c){this.pen=c}if(g){this.brush=g}if(!jsDraw2DX._isVML){e=document.createElementNS("http://www.w3.org/2000/svg","polygon")}else{e=document.createElement("v:polyline")}this.getType=h;function h(){return"jxPolygon"}this.addEventListener=a;function a(o,p){if(e.addEventListener){e.addEventListener(o,q,false)}else{if(e.attachEvent){e.attachEvent("on"+o,q)}}var n=this;function q(r){p(r,n)}}this.draw=j;function j(q){var r=new Array(),s="";for(ind in this.points){r[ind]=q.logicalToPhysicalPoint(this.points[ind])}for(ind in r){s=s+r[ind].x+","+r[ind].y+" "}e.style.display="none";if(!jsDraw2DX._isVML){var p=q.getSVG();if(f){p.appendChild(e);f=false}if(!this.pen){e.setAttribute("stroke","none")}else{this.pen.updateSVG(e)}if(!this.brush){e.setAttribute("fill","none")}else{this.brush.updateSVG(e,q.getDefs())}e.style.position="absolute";e.setAttribute("points",s)}else{s=s+r[0].x+","+r[0].y;var o=q.getVML(),n;if(f){o.appendChild(e);f=false}if(!this.pen){e.Stroked="False"}else{this.pen.updateVML(e)}n=e.fill;if(!this.brush){n.On="false"}else{this.brush.updateVML(n)}e.style.position="absolute";e.Points.Value=s}e.style.display="";if(l&&q!=l){l.removeShape(this)}l=q;l.addShape(this)}this.remove=b;function b(){if(l){if(!jsDraw2DX._isVML){var o=l.getSVG();o.removeChild(e)}else{var n=l.getVML();n.removeChild(e)}l.removeShape(this);l=null;f=true}}this.show=k;function k(){e.style.display=""}this.hide=d;function d(){e.style.display="none"}}function jxCircle(a,h,d,j){this.center=a;this.radius=h;this.pen=null;this.brush=null;var f,g=true;var n;if(d){this.pen=d}if(j){this.brush=j}if(!jsDraw2DX._isVML){f=document.createElementNS("http://www.w3.org/2000/svg","circle")}else{f=document.createElement("v:oval")}this.getType=k;function k(){return"jxCircle"}this.addEventListener=b;function b(p,q){if(f.addEventListener){f.addEventListener(p,r,false)}else{if(f.attachEvent){f.attachEvent("on"+p,r)}}var o=this;function r(s){q(s,o)}}this.draw=l;function l(t){var r,u;r=t.logicalToPhysicalPoint(this.center);u=t.scale;var q,v;q=r.x;v=r.y;f.style.display="none";if(!jsDraw2DX._isVML){var s=t.getSVG();if(g){s.appendChild(f);g=false}if(!this.pen){f.setAttribute("stroke","none")}else{this.pen.updateSVG(f)}if(!this.brush){f.setAttribute("fill","none")}else{this.brush.updateSVG(f,t.getDefs())}f.setAttribute("cx",q);f.setAttribute("cy",v);f.setAttribute("r",u*this.radius);f.style.position="absolute"}else{var p=t.getVML(),o;if(g){p.appendChild(f);g=false}if(!this.pen){f.Stroked="False"}else{this.pen.updateVML(f)}o=f.fill;if(!this.brush){o.On="false"}else{this.brush.updateVML(o)}f.style.width=u*this.radius*2;f.style.height=u*this.radius*2;f.style.position="absolute";f.style.top=v-u*this.radius;f.style.left=q-u*this.radius}f.style.display="";if(n&&t!=n){n.removeShape(this)}n=t;n.addShape(this)}this.remove=c;function c(){if(n){if(!jsDraw2DX._isVML){var p=n.getSVG();p.removeChild(f)}else{var o=n.getVML();o.removeChild(f)}n.removeShape(this);n=null;g=true}}this.show=m;function m(){f.style.display=""}this.hide=e;function e(){f.style.display="none"}}function jxEllipse(a,b,o,e,j){this.center=a;this.width=b;this.height=o;this.pen=null;this.brush=null;var g,h=true;var n;if(e){this.pen=e}if(j){this.brush=j}if(!jsDraw2DX._isVML){g=document.createElementNS("http://www.w3.org/2000/svg","ellipse")}else{g=document.createElement("v:oval")}this.getType=k;function k(){return"jxEllipse"}this.addEventListener=c;function c(q,r){if(g.addEventListener){g.addEventListener(q,s,false)}else{if(g.attachEvent){g.attachEvent("on"+q,s)}}var p=this;function s(t){r(t,p)}}this.draw=l;function l(u){var s,v;s=u.logicalToPhysicalPoint(this.center);v=u.scale;var r,w;r=s.x;w=s.y;g.style.display="none";if(!jsDraw2DX._isVML){var t=u.getSVG();if(h){t.appendChild(g);h=false}if(!this.pen){g.setAttribute("stroke","none")}else{this.pen.updateSVG(g)}if(!this.brush){g.setAttribute("fill","none")}else{this.brush.updateSVG(g,u.getDefs())}g.setAttribute("cx",r);g.setAttribute("cy",w);g.setAttribute("rx",v*this.width/2);g.setAttribute("ry",v*this.height/2);g.style.position="absolute"}else{var q=u.getVML(),p;if(h){q.appendChild(g);h=false}if(!this.pen){g.Stroked="False"}else{this.pen.updateVML(g)}p=g.fill;if(!this.brush){p.On="false"}else{this.brush.updateVML(p)}g.style.width=v*this.width;g.style.height=v*this.height;g.style.position="absolute";g.style.top=w-v*this.height/2;g.style.left=r-v*this.width/2}g.style.display="";if(n&&u!=n){n.removeShape(this)}n=u;n.addShape(this)}this.remove=d;function d(){if(n){if(!jsDraw2DX._isVML){var q=n.getSVG();q.removeChild(g)}else{var p=n.getVML();p.removeChild(g)}n.removeShape(this);n=null;h=true}}this.show=m;function m(){g.style.display=""}this.hide=f;function f(){g.style.display="none"}}function jxArc(a,b,p,j,q,e,k){this.center=a;this.width=b;this.height=p;this.startAngle=j;this.arcAngle=q;this.pen=null;this.brush=null;var g,h=true;var o;if(e){this.pen=e}if(k){this.brush=k}if(!jsDraw2DX._isVML){g=document.createElementNS("http://www.w3.org/2000/svg","path")}else{g=document.createElement("v:arc")}this.getType=l;function l(){return"jxArc"}this.addEventListener=c;function c(s,t){if(g.addEventListener){g.addEventListener(s,u,false)}else{if(g.attachEvent){g.attachEvent("on"+s,u)}}var r=this;function u(v){t(v,r)}}this.draw=m;function m(I){var L,N;L=I.logicalToPhysicalPoint(I);N=I.scale;var w,u;w=this.center.x;u=this.center.y;g.style.display="none";if(!jsDraw2DX._isVML){var M,K,F,E,H,G,v,t,r,A;M=N*this.width/2;K=N*this.height/2;r=this.startAngle*Math.PI/180;F=M*K/Math.sqrt(K*K*Math.cos(r)*Math.cos(r)+M*M*Math.sin(r)*Math.sin(r));H=F*Math.cos(r);v=F*Math.sin(r);H=w+H;v=u+v;A=(j+q)*Math.PI/180;E=M*K/Math.sqrt(K*K*Math.cos(A)*Math.cos(A)+M*M*Math.sin(A)*Math.sin(A));G=E*Math.cos(A);t=E*Math.sin(A);G=w+G;t=u+t;var C=I.getSVG();if(h){C.appendChild(g);h=false}if(!this.pen){g.setAttribute("stroke","none")}else{this.pen.updateSVG(g)}if(!this.brush){g.setAttribute("fill","none")}else{this.brush.updateSVG(g,I.getDefs())}if(q>180){g.setAttribute("d","M"+H+" "+v+" A"+M+" "+K+" 0 1 1 "+G+" "+t)}else{g.setAttribute("d","M"+H+" "+v+" A"+M+" "+K+" 0 0 1 "+G+" "+t)}}else{var s=I.getVML(),J;if(h){s.appendChild(g);h=false}var M,K,F,E,r,A,z,B,D;D=this.startAngle+this.arcAngle;j=this.startAngle%360;D=D%360;M=N*this.width/2;K=N*this.height/2;r=this.startAngle*Math.PI/180;F=M*K/Math.sqrt(K*K*Math.cos(r)*Math.cos(r)+M*M*Math.sin(r)*Math.sin(r));z=Math.asin(F*Math.sin(r)/K)*180/Math.PI;if(this.startAngle>270){z=360+z}else{if(this.startAngle>90){z=180-z}}A=D*Math.PI/180;E=M*K/Math.sqrt(K*K*Math.cos(A)*Math.cos(A)+M*M*Math.sin(A)*Math.sin(A));B=Math.asin(E*Math.sin(A)/K)*180/Math.PI;if(D>270){B=360+B}else{if(D>90){B=180-B}}if(!this.pen){g.Stroked="False"}else{this.pen.updateVML(g)}J=g.fill;if(!this.brush){J.On="false"}else{this.brush.updateVML(J)}g.style.position="absolute";g.style.width=N*this.width;g.style.height=N*this.height;g.style.position="absolute";g.style.left=w-N*this.width/2;g.style.top=u-N*this.height/2;z=z+90;if(z>360){g.StartAngle=z%360}else{g.StartAngle=z}B=B+90;if(B>360){if(z<=360){g.StartAngle=z-360}g.EndAngle=B%360}else{g.EndAngle=B}}g.style.display="";if(o&&I!=o){o.removeShape(this)}o=I;o.addShape(this)}this.remove=d;function d(){if(o){if(!jsDraw2DX._isVML){var s=o.getSVG();s.removeChild(g)}else{var r=o.getVML();r.removeChild(g)}o.removeShape(this);o=null;h=true}}this.show=n;function n(){g.style.display=""}this.hide=f;function f(){g.style.display="none"}}function jxArcSector(a,b,p,j,q,e,k){this.center=a;this.width=b;this.height=p;this.startAngle=j;this.arcAngle=q;this.pen=null;this.brush=null;var g,h=true;var o;if(e){this.pen=e}if(k){this.brush=k}if(!jsDraw2DX._isVML){g=document.createElementNS("http://www.w3.org/2000/svg","path")}else{g=document.createElement("v:shape")}this.getType=l;function l(){return"jxArcSector"}this.addEventListener=c;function c(s,t){if(g.addEventListener){g.addEventListener(s,u,false)}else{if(g.attachEvent){g.attachEvent("on"+s,u)}}var r=this;function u(v){t(v,r)}}this.draw=m;function m(L){var O,Q;O=L.logicalToPhysicalPoint(this.center);Q=L.scale;var A,v;A=O.x;v=O.y;var P,N,H,G,K,J,z,u,r,B;P=Q*this.width/2;N=Q*this.height/2;r=this.startAngle*Math.PI/180;H=P*N/Math.sqrt(N*N*Math.cos(r)*Math.cos(r)+P*P*Math.sin(r)*Math.sin(r));K=H*Math.cos(r);z=H*Math.sin(r);K=A+K;z=v+z;B=(this.startAngle+this.arcAngle)*Math.PI/180;G=P*N/Math.sqrt(N*N*Math.cos(B)*Math.cos(B)+P*P*Math.sin(B)*Math.sin(B));J=G*Math.cos(B);u=G*Math.sin(B);J=A+J;u=v+u;g.style.display="none";if(!jsDraw2DX._isVML){var E=L.getSVG();if(h){E.appendChild(g);h=false}if(!this.pen){g.setAttribute("stroke","none")}else{this.pen.updateSVG(g)}if(!this.brush){g.setAttribute("fill","none")}else{this.brush.updateSVG(g,L.getDefs())}if(q>180){g.setAttribute("d","M"+A+" "+v+" L"+K+" "+z+" A"+P+" "+N+" 0 1 1 "+J+" "+u+" Z")}else{g.setAttribute("d","M"+A+" "+v+" L"+K+" "+z+" A"+P+" "+N+" 0 0 1 "+J+" "+u+" Z")}}else{var s=L.getVML(),M;if(h){s.appendChild(g);h=false}var D,F,I,C;D=Math.min(u,Math.min(v,z));F=Math.min(J,Math.min(A,K));I=Math.max(u,Math.max(v,z))-D;C=Math.max(J,Math.max(A,K))-F;if(!this.pen){g.Stroked="False"}else{this.pen.updateVML(g)}M=g.fill;if(!this.brush){M.On="false"}else{this.brush.updateVML(M)}g.style.position="absolute";g.style.height=1;g.style.width=1;g.CoordSize=1+" "+1;g.Path="M"+A+","+v+" AT"+(A-P)+","+(v-N)+","+(A+P)+","+(v+N)+","+Math.round(J)+","+Math.round(u)+","+Math.round(K)+","+Math.round(z)+" X E"}g.style.display="";if(o&&L!=o){o.removeShape(this)}o=L;o.addShape(this)}this.remove=d;function d(){if(o){if(!jsDraw2DX._isVML){var s=o.getSVG();s.removeChild(g)}else{var r=o.getVML();r.removeChild(g)}o.removeShape(this);o=null;h=true}}this.show=n;function n(){g.style.display=""}this.hide=f;function f(){g.style.display="none"}}function jxCurve(n,c,g,l){this.points=n;this.pen=null;this.brush=null;this.tension=1;var e,f=true;var m;if(c){this.pen=c}if(g){this.brush=g}if(l!=null){this.tension=l}if(!jsDraw2DX._isVML){e=document.createElementNS("http://www.w3.org/2000/svg","path")}else{e=document.createElement("v:shape")}this.getType=h;function h(){return"jxCurve"}this.addEventListener=a;function a(p,q){if(e.addEventListener){e.addEventListener(p,r,false)}else{if(e.attachEvent){e.attachEvent("on"+p,r)}}var o=this;function r(s){q(s,o)}}this.draw=j;function j(u){var v=new Array();for(ind in this.points){v[ind]=u.logicalToPhysicalPoint(this.points[ind])}var z,p=this.tension,t=new Array(),w=new Array(),q=new Array();for(i in v){i=parseInt(i);if(i==0){t[i]=new jxPoint(p*(v[1].x-v[0].x)/2,p*(v[1].y-v[0].y)/2)}else{if(i==v.length-1){t[i]=new jxPoint(p*(v[i].x-v[i-1].x)/2,p*(v[i].y-v[i-1].y)/2)}else{t[i]=new jxPoint(p*(v[i+1].x-v[i-1].x)/2,p*(v[i+1].y-v[i-1].y)/2)}}}for(i in v){i=parseInt(i);if(i==v.length-1){w[i]=new jxPoint(v[i].x+t[i].x/3,v[i].y+t[i].y/3);q[i]=new jxPoint(v[i].x-t[i].x/3,v[i].y-t[i].y/3)}else{w[i]=new jxPoint(v[i].x+t[i].x/3,v[i].y+t[i].y/3);q[i]=new jxPoint(v[i+1].x-t[i+1].x/3,v[i+1].y-t[i+1].y/3)}}for(i in v){i=parseInt(i);if(i==0){z="M"+v[i].x+","+v[i].y}if(i<v.length-1){z=z+" C"+Math.round(w[i].x)+","+Math.round(w[i].y)+","+Math.round(q[i].x)+","+Math.round(q[i].y)+","+Math.round(v[i+1].x)+","+Math.round(v[i+1].y)}}e.style.display="none";if(!jsDraw2DX._isVML){var s=u.getSVG();if(f){s.appendChild(e);f=false}if(!this.pen){e.setAttribute("stroke","none")}else{this.pen.updateSVG(e)}if(!this.brush){e.setAttribute("fill","none")}else{this.brush.updateSVG(e,u.getDefs())}e.setAttribute("d",z)}else{var o=u.getVML(),r;if(f){o.appendChild(e);f=false}if(!this.pen){e.Stroked="False"}else{this.pen.updateVML(e)}r=e.fill;if(!this.brush){r.On="false"}else{this.brush.updateVML(r)}z=z+" E";e.style.position="absolute";e.style.width=1;e.style.height=1;e.CoordSize=1+" "+1;e.Path=z}e.style.display="";if(m&&u!=m){m.removeShape(this)}m=u;m.addShape(this)}this.remove=b;function b(){if(m){if(!jsDraw2DX._isVML){var p=m.getSVG();p.removeChild(e)}else{var o=m.getVML();o.removeChild(e)}m.removeShape(this);m=null;f=true}}this.show=k;function k(){e.style.display=""}this.hide=d;function d(){e.style.display="none"}}function jxClosedCurve(n,c,g,l){this.points=n;this.pen=null;this.brush=null;this.tension=1;var e,f=true;var m;var e=null;if(c){this.pen=c}if(g){this.brush=g}if(l!=null){this.tension=l}if(!jsDraw2DX._isVML){e=document.createElementNS("http://www.w3.org/2000/svg","path")}else{e=document.createElement("v:shape")}this.getType=h;function h(){return"jxClosedCurve"}this.addEventListener=a;function a(p,q){if(e.addEventListener){e.addEventListener(p,r,false)}else{if(e.attachEvent){e.attachEvent("on"+p,r)}}var o=this;function r(s){q(s,o)}}this.draw=j;function j(v){var w=new Array();for(ind in this.points){w[ind]=v.logicalToPhysicalPoint(this.points[ind])}var A,p=w.length-1,q=this.tension,u=new Array(),z=new Array(),r=new Array();for(i in w){i=parseInt(i);if(i==0){u[i]=new jxPoint(q*(w[1].x-w[p].x)/2,q*(w[1].y-w[p].y)/2)}else{if(i==w.length-1){u[i]=new jxPoint(q*(w[0].x-w[i-1].x)/2,q*(w[0].y-w[i-1].y)/2)}else{u[i]=new jxPoint(q*(w[i+1].x-w[i-1].x)/2,q*(w[i+1].y-w[i-1].y)/2)}}}for(i in w){i=parseInt(i);if(i==w.length-1){z[i]=new jxPoint(w[i].x+u[i].x/3,w[i].y+u[i].y/3);r[i]=new jxPoint(w[0].x-u[0].x/3,w[0].y-u[0].y/3)}else{z[i]=new jxPoint(w[i].x+u[i].x/3,w[i].y+u[i].y/3);r[i]=new jxPoint(w[i+1].x-u[i+1].x/3,w[i+1].y-u[i+1].y/3)}}for(i in w){i=parseInt(i);if(i==0){A="M"+w[i].x+","+w[i].y}if(i<w.length-1){A=A+" C"+Math.round(z[i].x)+","+Math.round(z[i].y)+","+Math.round(r[i].x)+","+Math.round(r[i].y)+","+Math.round(w[i+1].x)+","+Math.round(w[i+1].y)}if(i==w.length-1){A=A+" C"+Math.round(z[i].x)+","+Math.round(z[i].y)+","+Math.round(r[i].x)+","+Math.round(r[i].y)+","+Math.round(w[0].x)+","+Math.round(w[0].y)}}e.style.display="none";if(!jsDraw2DX._isVML){var t=v.getSVG();if(f){t.appendChild(e);f=false}if(!this.pen){e.setAttribute("stroke","none")}else{this.pen.updateSVG(e)}if(!this.brush){e.setAttribute("fill","none")}else{this.brush.updateSVG(e,v.getDefs())}e.setAttribute("d",A)}else{var o=v.getVML(),s;if(f){o.appendChild(e);f=false}A=A+" E";if(!this.pen){e.Stroked="False"}else{this.pen.updateVML(e)}s=e.fill;if(!this.brush){s.On="false"}else{this.brush.updateVML(s)}e.style.position="absolute";e.style.width=1;e.style.height=1;e.CoordSize=1+" "+1;e.Path=A}e.style.display="";if(m&&v!=m){m.removeShape(this)}m=v;m.addShape(this)}this.remove=b;function b(){if(m){if(!jsDraw2DX._isVML){var p=m.getSVG();p.removeChild(e)}else{var o=m.getVML();o.removeChild(e)}m.removeShape(this);m=null;f=true}}this.show=k;function k(){e.style.display=""}this.hide=d;function d(){e.style.display="none"}}function jxBezier(m,c,g){this.points=m;this.pen=null;this.brush=null;var e,f=true;var l;if(c){this.pen=c}if(g){this.brush=g}if(!jsDraw2DX._isVML){e=document.createElementNS("http://www.w3.org/2000/svg","path")}else{e=document.createElement("v:shape")}this.getType=h;function h(){return"jxBezier"}this.addEventListener=a;function a(o,p){if(e.addEventListener){e.addEventListener(o,q,false)}else{if(e.attachEvent){e.attachEvent("on"+o,q)}}var n=this;function q(r){p(r,n)}}this.draw=j;function j(H){var B=new Array();for(ind in this.points){B[ind]=H.logicalToPhysicalPoint(this.points[ind])}var w;if(B.length>4){var G=new Array();var u=new Array();var r=new Array();var E=new Array();var A=B.length-1;var F,D,C,z,s,J=10*Math.min(1/Math.abs(B[A].x-B[0].x),1/Math.abs(B[A].y-B[0].y));z=0;for(s=0;s<1;s+=J){x=0;y=0;for(C=0;C<=A;C++){F=Math.pow(s,C)*Math.pow((1-s),A-C)*B[C].x;if(C!=0||C!=A){F=F*jsDraw2DX.fact(A)/jsDraw2DX.fact(C)/jsDraw2DX.fact(A-C)}x=x+F;D=Math.pow(s,C)*Math.pow((1-s),A-C)*B[C].y;if(C!=0||C!=A){D=D*jsDraw2DX.fact(A)/jsDraw2DX.fact(C)/jsDraw2DX.fact(A-C)}y=y+D}E[z]=new jxPoint(x,y);z++}E[z]=new jxPoint(B[A].x,B[A].y);B=E;tension=1;for(C in B){C=parseInt(C);if(C==0){G[C]=new jxPoint(tension*(B[1].x-B[0].x)/2,tension*(B[1].y-B[0].y)/2)}else{if(C==B.length-1){G[C]=new jxPoint(tension*(B[C].x-B[C-1].x)/2,tension*(B[C].y-B[C-1].y)/2)}else{G[C]=new jxPoint(tension*(B[C+1].x-B[C-1].x)/2,tension*(B[C+1].y-B[C-1].y)/2)}}}for(C in B){C=parseInt(C);if(C==0){u[C]=new jxPoint(B[0].x+G[0].x/3,B[0].y+G[0].y/3);r[C]=new jxPoint(B[1].x-G[1].x/3,B[1].y-G[1].y/3)}else{if(C==B.length-1){u[C]=new jxPoint(B[C].x+G[C].x/3,B[C].y+G[C].y/3);r[C]=new jxPoint(B[C].x-G[C].x/3,B[C].y-G[C].y/3)}else{u[C]=new jxPoint(B[C].x+G[C].x/3,B[C].y+G[C].y/3);r[C]=new jxPoint(B[C+1].x-G[C+1].x/3,B[C+1].y-G[C+1].y/3)}}}for(C in B){C=parseInt(C);if(C==0){w="M"+B[C].x+","+B[C].y}if(C<B.length-1){w=w+" C"+Math.round(u[C].x)+","+Math.round(u[C].y)+","+Math.round(r[C].x)+","+Math.round(r[C].y)+","+Math.round(B[C+1].x)+","+Math.round(B[C+1].y)}}}else{if(B.length==4){w=" M"+B[0].x+","+B[0].y+" C"+B[1].x+","+B[1].y+" "+B[2].x+","+B[2].y+" "+B[3].x+","+B[3].y}else{if(B.length==3){if(!jsDraw2DX._isVML){w=" M"+B[0].x+","+B[0].y+" Q"+B[1].x+","+B[1].y+" "+B[2].x+","+B[2].y}else{var o=new jxPoint(2/3*B[1].x+1/3*B[0].x,2/3*B[1].y+1/3*B[0].y);var q=new jxPoint(2/3*B[1].x+1/3*B[2].x,2/3*B[1].y+1/3*B[2].y);w=" M"+B[0].x+","+B[0].y+" C"+Math.round(o.x)+","+Math.round(o.y)+" "+Math.round(q.x)+","+Math.round(q.y)+" "+B[2].x+","+B[2].y}}}}e.style.display="none";if(!jsDraw2DX._isVML){var v=H.getSVG();if(f){v.appendChild(e);f=false}if(!this.pen){e.setAttribute("stroke","none")}else{this.pen.updateSVG(e)}if(!this.brush){e.setAttribute("fill","none")}else{this.brush.updateSVG(e,H.getDefs())}e.setAttribute("d",w)}else{var p=H.getVML(),I;if(f){p.appendChild(e);f=false}w=w+" E";if(!this.pen){e.Stroked="False"}else{this.pen.updateVML(e)}I=e.fill;if(!this.brush){I.On="false"}else{this.brush.updateVML(I)}e.style.position="absolute";e.style.width=1;e.style.height=1;e.CoordSize=1+" "+1;e.Path=w}e.style.display="";if(l&&H!=l){l.removeShape(this)}l=H;l.addShape(this)}this.remove=b;function b(){if(l){if(!jsDraw2DX._isVML){var o=l.getSVG();o.removeChild(e)}else{var n=l.getVML();n.removeChild(e)}l.removeShape(this);l=null;f=true}}this.show=k;function k(){e.style.display=""}this.hide=d;function d(){e.style.display="none"}}function jxFunctionGraph(fn,xMin,xMax,pen,brush){this.fn=fn;this.xMin=xMin;this.xMax=xMax;this.pen=null;this.brush=null;var _svgvmlObj,_isFirst=true;var _graphics;if(pen){this.pen=pen}if(brush){this.brush=brush}if(!jsDraw2DX._isVML){_svgvmlObj=document.createElementNS("http://www.w3.org/2000/svg","path")}else{_svgvmlObj=document.createElement("v:shape")}this.getType=getType;function getType(){return"jxFunctionGraph"}this.addEventListener=addEventListener;function addEventListener(eventName,handler){if(_svgvmlObj.addEventListener){_svgvmlObj.addEventListener(eventName,handlerWrapper,false)}else{if(_svgvmlObj.attachEvent){_svgvmlObj.attachEvent("on"+eventName,handlerWrapper)}}var currentObj=this;function handlerWrapper(evt){handler(evt,currentObj)}}this.validate=validate;function validate(fn){fn=fn.replace(/x/g,1);with(Math){try{eval(fn);return true}catch(ex){return false}}}this.draw=draw;function draw(graphics){var points=new Array();var path,pDpoints;var pDpoints=new Array();var b1points=new Array();var b2points=new Array();if(!this.validate(fn)){return}var x,y,ic=0;for(x=xMin;x<xMax;x++){with(Math){y=eval(fn.replace(/x/g,x))}points[ic]=graphics.logicalToPhysicalPoint(new jxPoint(x,y));ic++}with(Math){y=eval(fn.replace(/x/g,xMax))}points[ic]=graphics.logicalToPhysicalPoint(new jxPoint(x,y));ic++;tension=1;for(i in points){i=parseInt(i);if(i==0){pDpoints[i]=new jxPoint(tension*(points[1].x-points[0].x)/2,tension*(points[1].y-points[0].y)/2)}else{if(i==points.length-1){pDpoints[i]=new jxPoint(tension*(points[i].x-points[i-1].x)/2,tension*(points[i].y-points[i-1].y)/2)}else{pDpoints[i]=new jxPoint(tension*(points[i+1].x-points[i-1].x)/2,tension*(points[i+1].y-points[i-1].y)/2)}}}for(i in points){i=parseInt(i);if(i==0){b1points[i]=new jxPoint(points[0].x+pDpoints[0].x/3,points[0].y+pDpoints[0].y/3);b2points[i]=new jxPoint(points[1].x-pDpoints[1].x/3,points[1].y-pDpoints[1].y/3)}else{if(i==points.length-1){b1points[i]=new jxPoint(points[i].x+pDpoints[i].x/3,points[i].y+pDpoints[i].y/3);b2points[i]=new jxPoint(points[i].x-pDpoints[i].x/3,points[i].y-pDpoints[i].y/3)}else{b1points[i]=new jxPoint(points[i].x+pDpoints[i].x/3,points[i].y+pDpoints[i].y/3);b2points[i]=new jxPoint(points[i+1].x-pDpoints[i+1].x/3,points[i+1].y-pDpoints[i+1].y/3)}}}for(i in points){i=parseInt(i);if(i==0){path="M"+points[i].x+","+points[i].y}if(i<points.length-1){path=path+" C"+Math.round(b1points[i].x)+","+Math.round(b1points[i].y)+","+Math.round(b2points[i].x)+","+Math.round(b2points[i].y)+","+Math.round(points[i+1].x)+","+Math.round(points[i+1].y)}}_svgvmlObj.style.display="none";if(!jsDraw2DX._isVML){var svg=graphics.getSVG();if(_isFirst){svg.appendChild(_svgvmlObj);_isFirst=false}if(!this.pen){_svgvmlObj.setAttribute("stroke","none")}else{this.pen.updateSVG(_svgvmlObj)}if(!this.brush){_svgvmlObj.setAttribute("fill","none")}else{this.brush.updateSVG(_svgvmlObj,graphics.getDefs())}_svgvmlObj.setAttribute("d",path)}else{var vml=graphics.getVML(),vmlFill;if(_isFirst){vml.appendChild(_svgvmlObj);_isFirst=false}path=path+" E";if(!this.pen){_svgvmlObj.Stroked="False"}else{this.pen.updateVML(_svgvmlObj)}vmlFill=_svgvmlObj.fill;if(!this.brush){vmlFill.On="false"}else{this.brush.updateVML(vmlFill)}_svgvmlObj.style.position="absolute";_svgvmlObj.style.width=1;_svgvmlObj.style.height=1;_svgvmlObj.CoordSize=1+" "+1;_svgvmlObj.Path=path}_svgvmlObj.style.display="";if(_graphics&&graphics!=_graphics){_graphics.removeShape(this)}_graphics=graphics;_graphics.addShape(this)}this.remove=remove;function remove(){if(_graphics){if(!jsDraw2DX._isVML){var svg=_graphics.getSVG();svg.removeChild(_svgvmlObj)}else{var vml=_graphics.getVML();vml.removeChild(_svgvmlObj)}_graphics.removeShape(this);_graphics=null;_isFirst=true}}this.show=show;function show(){_svgvmlObj.style.display=""}this.hide=hide;function hide(){_svgvmlObj.style.display="none"}}function jxText(o,p,a,e,j,b){this.point=o;this.text=p;this.font=null;this.pen=null;this.brush=null;this.angle=0;var g,h=true;var n;if(a){this.font=a}if(e){this.pen=e}if(j){this.brush=j}if(b){this.angle=b}if(!jsDraw2DX._isVML){g=document.createElementNS("http://www.w3.org/2000/svg","text")}else{g=document.createElement("v:shape")}this.getType=k;function k(){return"jxText"}this.addEventListener=c;function c(r,s){if(g.addEventListener){g.addEventListener(r,t,false)}else{if(g.attachEvent){g.attachEvent("on"+r,t)}}var q=this;function t(u){s(u,q)}}this.draw=l;function l(B){var F;F=B.logicalToPhysicalPoint(this.point);var E,A;E=F.x;A=F.y;g.style.display="none";if(!jsDraw2DX._isVML){var w=B.getSVG();if(h){w.appendChild(g);h=false}if(!this.pen){g.setAttribute("stroke","none")}else{this.pen.updateSVG(g)}if(!this.brush){g.setAttribute("fill","none")}else{this.brush.updateSVG(g,B.getDefs())}if(this.font){this.font.updateSVG(g)}else{jxFont.updateSVG(g)}g.setAttribute("x",E);g.setAttribute("y",A);g.setAttribute("transform","rotate("+this.angle+" "+E+","+A+")");g.textContent=this.text}else{var s=B.getVML(),v,z,u;if(h){u=document.createElement("v:textpath");u.On="True";u.style["v-text-align"]="left";g.appendChild(u);s.appendChild(g);h=false}v=g.fill;u=g.firstChild;if(!this.pen){g.Stroked="False"}else{this.pen.updateVML(g)}v=g.fill;if(!this.brush){v.On="false"}else{this.brush.updateVML(v)}g.style.position="absolute";g.style.height=1;g.CoordSize=1+" "+1;z=g.Path;z.TextPathOk="true";z.v="M"+E+","+A+" L"+(E+100)+","+A+" E";u.String=this.text;if(this.font){this.font.updateVML(u)}else{jxFont.updateVML(u)}g.style.display="";var t,D,q,C;q=(g.clientHeight/2*0.8);C=this.angle;E=Math.round(E+q*Math.sin(C*Math.PI/180));A=Math.round(A-q*Math.cos(C*Math.PI/180));t=Math.round(E+Math.cos(C*Math.PI/180)*100);D=Math.round(A+Math.sin(C*Math.PI/180)*100);g.Path="M"+E+","+A+" L"+t+","+D+" E";g.style.width=1}g.style.display="";if(n&&B!=n){n.removeShape(this)}n=B;n.addShape(this)}this.remove=d;function d(){if(n){if(!jsDraw2DX._isVML){var r=n.getSVG();r.removeChild(g)}else{var q=n.getVML();q.removeChild(g)}n.removeShape(this);n=null;h=true}}this.show=m;function m(){g.style.display=""}this.hide=f;function f(){g.style.display="none"}}function jxImage(point,url,width,height,angle){this.point=point;this.url=url;this.width=width;this.height=height;this.angle=0;var _svgvmlObj,_isFirst=true;var _graphics;if(angle){this.angle=angle}if(!jsDraw2DX._isVML){_svgvmlObj=document.createElementNS("http://www.w3.org/2000/svg","image")}else{_svgvmlObj=document.createElement("v:image")}this.getType=getType;function getType(){return"jxImage"}this.addEventListener=addEventListener;function addEventListener(eventName,handler){if(_svgvmlObj.addEventListener){_svgvmlObj.addEventListener(eventName,handlerWrapper,false)}else{if(_svgvmlObj.attachEvent){_svgvmlObj.attachEvent("on"+eventName,handlerWrapper)}}var currentObj=this;function handlerWrapper(evt){handler(evt,currentObj)}}this.draw=draw;function draw(graphics){var point,scale;point=graphics.logicalToPhysicalPoint(this.point);scale=graphics.scale;var x,y;x=point.x;y=point.y;_svgvmlObj.style.display="none";if(!jsDraw2DX._isVML){var svg=graphics.getSVG();if(_isFirst){svg.appendChild(_svgvmlObj);_isFirst=false}_svgvmlObj.setAttribute("x",x);_svgvmlObj.setAttribute("y",y);_svgvmlObj.setAttribute("height",scale*this.height);_svgvmlObj.setAttribute("width",scale*this.width);_svgvmlObj.setAttribute("preserveAspectRatio","none");_svgvmlObj.setAttributeNS("http://www.w3.org/1999/xlink","href",this.url);_svgvmlObj.setAttribute("transform","rotate("+this.angle+" "+x+","+y+")")}else{with(Math){var x1,y1,ang=this.angle,a=this.angle*PI/180,w,h,m1,m2,m3,m4;w=scale*this.width;h=scale*this.height;x1=x;y1=y;if(abs(ang)>360){ang=ang%360}if(ang<0){ang=360+ang}if(ang>=0&&ang<90){y1=y;x1=x-(h*sin(a))}else{if(ang>=90&&ang<180){y1=y-h*sin(a-PI/2);x1=x-(w*sin(a-PI/2)+h*cos(a-PI/2))}else{if(ang>=180&&ang<270){y1=y-(w*sin(a-PI)+h*cos(a-PI));x1=x-w*cos(a-PI)}else{if(ang>=270&&ang<=360){x1=x;y1=y-w*cos(a-1.5*PI)}}}}m1=cos(a);m2=-sin(a);m3=sin(a);m4=cos(a)}var vml=graphics.getVML(),vmlFill;if(_isFirst){vml.appendChild(_svgvmlObj);_isFirst=false}_svgvmlObj.style.width=w;_svgvmlObj.style.height=h;_svgvmlObj.style.position="absolute";_svgvmlObj.style.top=y1;_svgvmlObj.style.left=x1;_svgvmlObj.style.filter="progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11="+m1+",M12="+m2+",M21="+m3+",M22="+m4+") filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"', sizingMethod='scale');"}_svgvmlObj.style.display="";if(_graphics&&graphics!=_graphics){_graphics.removeShape(this)}_graphics=graphics;_graphics.addShape(this)}this.remove=remove;function remove(){if(_graphics){if(!jsDraw2DX._isVML){var svg=_graphics.getSVG();svg.removeChild(_svgvmlObj)}else{var vml=_graphics.getVML();vml.removeChild(_svgvmlObj)}_graphics.removeShape(this);_graphics=null;_isFirst=true}}this.show=show;function show(){_svgvmlObj.style.display=""}this.hide=hide;function hide(){_svgvmlObj.style.display="none"}};
/*****************************************************************************************
*
* Project Name:		jsDraw2DX (SVG/VML based Graphics Library for JavaScript, HTML5 Ready)
* Version:		Alpha 1.0.7 (16-Nov-2012) (Uncompressed)
* Project Homepage:	http://jsdraw2dx.jsfiction.com
* Author:			Sameer Burle
* Copyright 2012:		jsFiction.com (http://www.jsfiction.com)
* Licensed Under:		LGPL
*
* This program (library) is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*****************************************************************************************/
//Global Variables and functions
function jsDraw2DX() {
    //Holder for global variables/functions
}
jsDraw2DX._RefID = 0; //Reference IDs used for <defs> in SVG
jsDraw2DX._isVML = false; //_isVML is true if SVG is not supported and only VML is supported

//Global Functions
//Check browser for IE
jsDraw2DX.checkIE = function() {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var version = 9;
        if (navigator.appVersion.indexOf('MSIE') != -1)
            version = parseFloat(navigator.appVersion.split('MSIE')[1]);

        if (version < 9) { //SVG support provided for IE9 & onwards
            jsDraw2DX._isVML = true;
        }
    }
}

//Internal global utility factorial function
jsDraw2DX.fact = function(n) {
    var res = 1;
    for (var i = 1; i <= n; i++) {
        res = res * i;
    }
    return res;
}

//Initialization of the library
jsDraw2DX.init = function() {
    jsDraw2DX.checkIE();
    if (jsDraw2DX._isVML) {
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
        var vmlElements = ['fill', 'stroke', 'path', 'textpath'];
        for (var i = 0, l = vmlElements.length; i < l; i++) {
            document.createStyleSheet().addRule('v\\:' + vmlElements[i], 'behavior: url(#default#VML);');
        }
    }
}

//Global Startup
jsDraw2DX.init();

//jxGraphics class holds basic drawing parameters like origin, scale, co-ordinate system.
//It also holds drawing div, svg/vml root elements and array of the drawn shapes.
function jxGraphics(graphicsDivElement) {

    //Private member variables
    this.origin = new jxPoint(0, 0);
    this.scale = 1;
    this.coordinateSystem = 'default'; //Possible values 'default' or 'cartecian'

    //Private member variables
    var _shapes = new Array(); //Array of shapes drawn with the graphics 
    var _graphicsDiv, _svg, _vml, _defs;

    if (graphicsDivElement) {
        _graphicsDiv = graphicsDivElement;
        _graphicsDiv.style.overflow = 'hidden';
    }
    else
        _graphicsDiv = document.body;  //Document will be used directly for drawing

    //SVG, VML Initialization
    if (!jsDraw2DX._isVML) {
        _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        _graphicsDiv.appendChild(_svg);
        _defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        _svg.appendChild(_defs);
        _svg.style.position = 'absolute';
        _svg.style.top = '0px';
        _svg.style.left = '0px';
        _svg.style.width = _graphicsDiv.style.width;
        _svg.style.height = _graphicsDiv.style.height;
    }
    else {
        _vml = document.createElement('v:group');
        _vml.style.position = 'absolute';
        _vml.style.top = '0px';
        _vml.style.left = '0px';
        _graphicsDiv.appendChild(_vml);
    }

    //Internal utility methods
    //Defs (for SVG only)
    this.getDefs = getDefs;
    function getDefs() {
        return _defs;
    }

    //Adds shape to the _shapes array
    this.addShape = addShape;
    function addShape(shape) {
        var ind = this.indexOfShape(shape);
        if (ind < 0)
            _shapes.push(shape);
    }

    //Removes shape from the _shapes array
    this.removeShape = removeShape;
    function removeShape(shape) {
        var ind = this.indexOfShape(shape);
        if (ind >= 0)
            _shapes.splice(ind, 1);
    }
    
    //Public Methods
    //Get the type
    this.getType = getType;
    function getType() {
        return 'jxGraphics';
    }
    
    //Graphics Div
    this.getDiv = getDiv;
    function getDiv() {
        return _graphicsDiv;
    }

    //SVG
    this.getSVG = getSVG;
    function getSVG() {
        return _svg;
    }

    //VML
    this.getVML = getVML;
    function getVML() {
        return _vml;
    }

    //Conversion of logical point to physical point based on coordinate system, origin and scale.
    this.logicalToPhysicalPoint = logicalToPhysicalPoint;
    function logicalToPhysicalPoint(point) {
        if (this.coordinateSystem.toLowerCase() == 'cartecian') {
            return new jxPoint(Math.round(point.x * this.scale + this.origin.x), Math.round(this.origin.y - point.y * this.scale))
        }
        else {
            return new jxPoint(Math.round(point.x * this.scale + this.origin.x), Math.round(point.y * this.scale + this.origin.y))
        }
    }

    //Draws a specified shape
    this.draw = draw;
    function draw(shape) {
        return shape.draw(this);
    }

    //Removes a specified shape
    this.remove = remove;
    function remove(shape) {
        return shape.remove(this);
    }

    //Redraws all the shapes
    this.redrawAll = redrawAll;
    function redrawAll() {
        for (ind in _shapes) {
            _shapes[ind].draw(this);
        }
    }

    //Gets the count of the shape drawn on the graphics
    this.getShapesCount = getShapesCount;
    function getShapesCount() {
        return _shapes.length;
    }

    //Gets the shape object drawn on the graphics at specific index
    this.getShape = getShape;
    function getShape(index) {
        return _shapes[index]; 
    }

    //Gets the index of the shape
    this.indexOfShape = indexOfShape;
    function indexOfShape(shape) {
        var ind=-1, length = _shapes.length;
        for (var i = 0; i < length; i++) {
            if (shape == _shapes[i]) {
                ind = i;
            }
        }
        return ind;
    }
}

//jxColor class holds the color information and provides some color related basic functions.
function jxColor() {
    //Member variables
    var _color = '#000000';

    switch (arguments.length) {
        //Color Hex or Named or rgb()
        case 1:
            _color=arguments[0];
            break;
        //RGB Color 
        case 3:
            var red = arguments[0];
            var green = arguments[1];
            var blue = arguments[2];
            _color = jxColor.rgbToHex(red, green, blue);
            break;
    }

    //Public Methods
    //Get the type
    this.getType = getType;
    function getType() {
        return 'jxColor';
    }
    
    //Get the hexa-decimal or named color value of the object
    this.getValue = getValue;
    function getValue() {
        return _color;
    }
}
//Static-Shared Utility Methods of jxColor
//Convert RGB color to Hex color
jxColor.rgbToHex = function(redValue, greenValue, blueValue) {
    //Check argument values
    if (redValue < 0 || redValue > 255 || greenValue < 0 || greenValue > 255 || blueValue < 0 || blueValue > 255) {
        return false;
    }

    var colorDec = Math.round(blueValue) + 256 * Math.round(greenValue) + 65536 * Math.round(redValue);
    return '#' + zeroPad(colorDec.toString(16), 6);

    //Internal method, add zero padding to the left. Used for building hexa-decimal string.	
    function zeroPad(val, count) {
        var valZeropad = val + '';
        while (valZeropad.length < count) {
            valZeropad = '0' + valZeropad;
        }
        return valZeropad;
    }
}

//Convert Hex color to RGB color
jxColor.hexToRgb = function(hexValue) {
    var redValue, greenValue, blueValue;
    if (hexValue.charAt(0) == '#') {
        hexValue = hexValue.substring(1, 7);
    }

    redValue = parseInt(hexValue.substring(0, 2), 16);
    greenValue = parseInt(hexValue.substring(2, 4), 16);
    blueValue = parseInt(hexValue.substring(4, 6), 16);

    //Check argument values
    if (redValue < 0 || redValue > 255 || greenValue < 0 || greenValue > 255 || blueValue < 0 || blueValue > 255) {
        return false;
    }

    return new Array(redValue, greenValue, blueValue);
}

//jxFont class holds the font information which can be used by other objects in object oriented way.
function jxFont(family, size, style, weight, variant) {
    //Public Properties with default value null
    this.family = null;
    this.size = null;
    this.style = null;
    this.weight = null;
    this.variant = null;

    //Object Construction
    if (family)
        this.family = family;

    if (weight)
        this.weight = weight;

    if (size)
        this.size = size;

    if (style)
        this.style = style;

    if (variant)
        this.variant = variant;

    //Internal utility methods
    //Apply font settings to SVG text
    this.updateSVG = updateSVG;
    function updateSVG(_svgvmlObj) {
        if (this.family)
            _svgvmlObj.setAttribute('font-family', this.family)
        else
            _svgvmlObj.setAttribute('font-family', '')
        if (this.weight)
            _svgvmlObj.setAttribute('font-weight', this.weight)
        else
            _svgvmlObj.setAttribute('font-weight', '')
        if (this.size)
            _svgvmlObj.setAttribute('font-size', this.size)
        else
            _svgvmlObj.setAttribute('font-size', '')
        if (this.style)
            _svgvmlObj.setAttribute('font-style', this.style)
        else
            _svgvmlObj.setAttribute('font-style', '')
        if (this.variant)
            _svgvmlObj.setAttribute('font-variant', this.variant)
        else
            _svgvmlObj.setAttribute('font-variant', '')
    }

    //Apply font settings to VML textpath
    this.updateVML = updateVML;
    function updateVML(vmlTextPath) {
        if (this.family)
            vmlTextPath.style.fontFamily = "'" + this.family + "'";
        else
            vmlTextPath.style.fontFamily = '';
        if (this.weight)
            vmlTextPath.style.fontWeight = this.weight;
        else
            vmlTextPath.style.fontWeight = '';
        if (this.size)
            vmlTextPath.style.fontSize = this.size;
        else
            vmlTextPath.style.fontSize = '';
        if (this.style)
            vmlTextPath.style.fontStyle = this.style;
        else
            vmlTextPath.style.fontStyle = '';
        if (this.variant)
            vmlTextPath.style.fontVariant = this.variant;
        else
            vmlTextPath.style.fontVariant = '';
    }
    
    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxFont';
    }    
}

//Internal Static/Shared Methods of jxFont
//To remove font setting of SVG text (font=null)
jxFont.updateSVG = function(_svgvmlObj) {
    _svgvmlObj.setAttribute('font-family', '')
    _svgvmlObj.setAttribute('font-weight', '')
    _svgvmlObj.setAttribute('font-size', '')
    _svgvmlObj.setAttribute('font-style', '')
    _svgvmlObj.setAttribute('font-variant', '')
}

//Remove font settings of VML textpath (font=null)
jxFont.updateVML = function(vmlTextPath) {
    vmlTextPath.style.fontFamily = '';
    vmlTextPath.style.fontWeight = '';
    vmlTextPath.style.fontSize = '';
    vmlTextPath.style.fontStyle = '';
    vmlTextPath.style.fontVariant = '';
}

//jxPen class holds the drawing pen/stroke information. 
//Mainly it holds the color and width values to be used for 2D drawing. 
//Acts like a pen for drawing.
function jxPen(color, width, dashStyle) {
    //Public Properties
    this.color = null;  //color proprty of jxColor type
    this.width = null;  //width property
    this.dashStyle = null; //for dotted and dashed line
    //Object construction
    if (color) 
        this.color = color;
    else
        this.color = new jxColor('#000000'); //default black color
        
    if (width)
        this.width = width;
    else
        this.width = '1px'; //1px default value

    if (dashStyle)
        this.dashStyle = dashStyle;   

    //Internal utility methods
    //Update the svg to apply pen settings
    this.updateSVG = updateSVG;
    function updateSVG(_svgvmlObj) {
        _svgvmlObj.setAttribute('stroke', this.color.getValue());
        _svgvmlObj.setAttribute('stroke-width', this.width);
        if (this.dashStyle) {
            var w = parseInt(this.width);
            switch (this.dashStyle.toLowerCase()) {
                case 'shortdash':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 3 + ' ' + w);
                    break;
                case 'shortdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w + ' ' + w);
                    break;
                case 'shortdashdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 3 + ' ' + w + ' ' + w + ' ' + w);
                    break;
                case 'shortdashdotdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 3 + ' ' + w + ' ' + w + ' ' + w + ' ' + w + ' ' + w);
                    break;
                case 'dot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w + ' ' + w * 3);
                    break;
                case 'dash':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 4 + ' ' + w * 3);
                    break;
                case 'longdash':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 8 + ' ' + w * 3);
                    break;
                case 'dashdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 4 + ' ' + w * 3 + ' ' + w + ' ' + w * 3);
                    break;
                case 'longdashdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 8 + ' ' + w * 3 + ' ' + w + ' ' + w * 3);
                    break;
                case 'longdashdotdot':
                    _svgvmlObj.setAttribute('stroke-dasharray', w * 8 + ' ' + w * 3 + ' ' + w + ' ' + w * 3 + ' ' + w + ' ' + w * 3);
                    break;
                default:
                    _svgvmlObj.setAttribute('stroke-dasharray', this.dashStyle);
                    break;
            }
        }
    }
    
    //Update the vml to apply pen settings
    this.updateVML = updateVML;
    function updateVML(_svgvmlObj) {
        _svgvmlObj.Stroke.JoinStyle = 'miter';
        _svgvmlObj.Stroke.MiterLimit = '5';
        _svgvmlObj.StrokeColor = this.color.getValue();
        _svgvmlObj.StrokeWeight = this.width;
        if (this.dashStyle)
            _svgvmlObj.Stroke.DashStyle = this.dashStyle;
        if (parseInt(this.width) == 0)
            _svgvmlObj.Stroked = 'False';
    }

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxPen';
    }
}

//jxBrush class holds the drawing fill information. 
//Mainly it holds the fill color values and fill type to be used for filling 2D drawing. 
//Acts like a brush for drawing.
function jxBrush(color, fillType) {

    //Public Properties
    this.color = null;  //color proprty of jxColor type
    this.fillType = null; //fillType property 'solid','lin_grad'='linear_gradient',proposed:'rad_grad'='radial_gradiant' or 'pattern'
    this.color2 = null; //second color for gradient fill type
    this.angle = null;
    
    //Construction of the object
    if (color) 
        this.color = color;
    else
        this.color = new jxColor('#000000');  //Default black color

    if (fillType)
        this.fillType = fillType;
    else
        this.fillType = 'solid'; //Default fillType other values 'linear-gradient'='lin-grad' (more to come)

    //Set rest of defaults
    this.color2 = new jxColor('#FFFFFF'); //Default color2 

    //Internal utility functions
    //Update the svg to apply brush settings
    this.updateSVG = updateSVG;
    function updateSVG(_svgvmlObj,defs) {
        var fillId=null, oldChild;
        fillId = _svgvmlObj.getAttribute('fill');
        if (fillId) {
            if (fillId.substr(0, 5) == 'url(#') {
                fillId = fillId.substr(5, fillId.length - 6);
                oldChild = document.getElementById(fillId);
            }
            else
                fillId = null;
        }

        if (this.fillType == 'linear-gradient' || this.fillType == 'lin-grad') {
            var linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            if (fillId)
                defs.replaceChild(linearGradient, oldChild);
            else
                defs.appendChild(linearGradient);
            var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            linearGradient.appendChild(stop1);
            var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            linearGradient.appendChild(stop2);
            jsDraw2DX._RefID++;
            linearGradient.setAttribute('id', 'jsDraw2DX_RefID_' + jsDraw2DX._RefID);
            if (this.angle != null)
                linearGradient.setAttribute('gradientTransform', 'rotate(' + this.angle + ' 0.5 0.5)');
            else
                linearGradient.setAttribute('gradientTransform', 'rotate(0 0.5 0.5)');
            stop1.setAttribute('offset','0%');
            stop1.setAttribute('style','stop-color:' + this.color.getValue() + ';stop-opacity:1');
            stop2.setAttribute('offset','100%');
            stop2.setAttribute('style', 'stop-color:' + this.color2.getValue() + ';stop-opacity:1');
            linearGradient.appendChild(stop1);
            linearGradient.appendChild(stop2);
            _svgvmlObj.setAttribute('fill', 'url(#' + 'jsDraw2DX_RefID_' + jsDraw2DX._RefID + ')');
        }
        else
            _svgvmlObj.setAttribute('fill', this.color.getValue());
    }

    //Update the vml to apply brush settings
    this.updateVML = updateVML;
    function updateVML(vmlFill) {
        vmlFill.On = 'true';
        if (this.fillType == 'solid') {
            vmlFill.Type = 'solid';
            vmlFill.Color = this.color.getValue();
            vmlFill.Color2 = '';
            vmlFill.Angle = 270;
        }
        else {
            vmlFill.Type = 'gradient';
            if (this.angle != null)
                vmlFill.Angle = 270 - this.angle;
            else
                vmlFill.Angle = 270;
            vmlFill.Color = this.color.getValue();
            vmlFill.Color2 = this.color2.getValue();
        }
    }

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxBrush';
    }
}

//jxPoint class holds the 2D drawing point information. 
//It holds values of x and y coordinates of the point.
function jxPoint(x, y) {

    //Public Properties
    this.x = x;
    this.y = y;
    
    //Public Methods
    //Get the type
    this.getType = getType;
    function getType() {
        return 'jxPoint';
    }
}

//Class to hold information and draw line shape
function jxLine(fromPoint, toPoint, pen) {

    //Public Properties
    this.fromPoint = fromPoint;
    this.toPoint = toPoint;
    this.pen = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;
    
    //Object Construction
    if(pen)
        this.pen = pen;
        
    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    else
        _svgvmlObj = document.createElement('v:line');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxLine';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj); 
        }   
    }

    //Draw line shape on the jxGraphics    
    this.draw = draw;
    function draw(graphics) {
        var fromPoint, toPoint;
        fromPoint = graphics.logicalToPhysicalPoint(this.fromPoint);
        toPoint = graphics.logicalToPhysicalPoint(this.toPoint);

        var colorValue, penWidth, isFirst = false;
        colorValue = this.pen.color.getValue();
        penWidth = this.pen.width;
        
        var x1, y1, x2, y2;
        x1 = fromPoint.x;
        y1 = fromPoint.y;
        x2 = toPoint.x;
        y2 = toPoint.y;
        
        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst)
            {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }
           
            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            _svgvmlObj.setAttribute('x1', x1);
            _svgvmlObj.setAttribute('y1', y1);
            _svgvmlObj.setAttribute('x2', x2);
            _svgvmlObj.setAttribute('y2', y2);
        }
        else {
            var vml = graphics.getVML();
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);
                
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.From = x1 + ',' + y1;
            _svgvmlObj.To = x2 + ',' + y2;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true; 
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw rectangle shape
function jxRect(point, width, height, pen, brush) {
    
    //Public Properties
    this.point = point;
    this.width = width;
    this.height = height;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;
            
    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    else
        _svgvmlObj = document.createElement('v:rect');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxRect';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw rectangle shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var point, scale;
        point = graphics.logicalToPhysicalPoint(this.point);
        scale = graphics.scale; 

        var x1, y1;
        x1 = point.x;
        y1 = point.y;

        _svgvmlObj.style.display = 'none';
        
        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Settings
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }
            _svgvmlObj.setAttribute('x', x1);
            _svgvmlObj.setAttribute('y', y1);
            _svgvmlObj.setAttribute('width', scale * this.width);
            _svgvmlObj.setAttribute('height', scale * this.height);
            _svgvmlObj.style.position = 'absolute'
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.width = scale * this.width;
            _svgvmlObj.style.height = scale * this.height;
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.top = y1;
            _svgvmlObj.style.left = x1;
        }

        _svgvmlObj.style.display = '';
        
        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw polyline shape
function jxPolyline(points, pen, brush) {

    //Public Properties
    this.points = points;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;
    
    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    else
        _svgvmlObj = document.createElement('v:polyline');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxPolyline';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw polyline shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points=new Array(),pointsList='';
        for (ind in this.points) {
            points[ind] = graphics.logicalToPhysicalPoint(this.points[ind]);
        }
        for (ind in points) {
            pointsList = pointsList + points[ind].x + ',' + points[ind].y + ' ';
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Settings
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Settings
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }
            _svgvmlObj.style.position = 'absolute'
            _svgvmlObj.setAttribute('points', pointsList);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.Points.Value = pointsList;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true; 
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw polygon shape
function jxPolygon(points, pen, brush) {

    //Public Properties
    this.points = points;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    else
        _svgvmlObj = document.createElement('v:polyline');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxPolygon';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);    
        }
    }

    //Draw polygon shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points = new Array(), pointsList = '';
        for (ind in this.points) {
            points[ind] = graphics.logicalToPhysicalPoint(this.points[ind]);
        }
        for (ind in points) {
            pointsList = pointsList + points[ind].x + ',' + points[ind].y + ' ';
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Settings
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Settings
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }
            _svgvmlObj.style.position = 'absolute'
            _svgvmlObj.setAttribute('points', pointsList);
        }
        else {
            pointsList = pointsList + points[0].x + ',' + points[0].y;
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.Points.Value = pointsList;
        }
            
        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw circle shape
function jxCircle(center, radius, pen, brush) {

    //Public Properties
    this.center = center;
    this.radius = radius;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    else
        _svgvmlObj = document.createElement('v:oval');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxCircle';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }
    }

    //Draw circle shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var center, scale;
        center = graphics.logicalToPhysicalPoint(this.center);
        scale = graphics.scale;

        var cx, cy;
        cx = center.x;
        cy = center.y;

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            _svgvmlObj.setAttribute('cx', cx);
            _svgvmlObj.setAttribute('cy', cy);
            _svgvmlObj.setAttribute('r', scale * this.radius);
            _svgvmlObj.style.position = 'absolute'
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.width = scale * this.radius * 2;
            _svgvmlObj.style.height = scale * this.radius * 2;
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.top = cy - scale * this.radius;
            _svgvmlObj.style.left = cx - scale * this.radius;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw ellipse shape
function jxEllipse(center, width, height, pen, brush) {

    //Public Properties
    this.center = center;
    this.width = width;
    this.height = height;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    else
        _svgvmlObj = document.createElement('v:oval');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxEllipse';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw ellipse shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var center, scale;
        center = graphics.logicalToPhysicalPoint(this.center);
        scale = graphics.scale;

        var cx, cy;
        cx = center.x;
        cy = center.y;
        
        _svgvmlObj.style.display = 'none';
        
        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Settings
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }
            _svgvmlObj.setAttribute('cx', cx);
            _svgvmlObj.setAttribute('cy', cy);
            _svgvmlObj.setAttribute('rx', scale * this.width / 2);
            _svgvmlObj.setAttribute('ry', scale * this.height / 2);
            _svgvmlObj.style.position = 'absolute'
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.width = scale * this.width;
            _svgvmlObj.style.height = scale * this.height;
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.top = cy - scale * this.height / 2;
            _svgvmlObj.style.left = cx - scale * this.width / 2;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw elliptical arc shape
function jxArc(center, width, height, startAngle, arcAngle, pen, brush) {

    //Public properties
    this.center = center;
    this.width = width;
    this.height = height;
    this.startAngle = startAngle;
    this.arcAngle = arcAngle;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:arc');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxArc';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw arc shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var center, scale;
        center = graphics.logicalToPhysicalPoint(graphics);
        scale = graphics.scale;
        var cx, cy;
        cx = this.center.x;
        cy = this.center.y;

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            //Calculation of coordinates of ellipse based on angle
            var a, b, r1, r2, x1, x2, y1, y2, sa, ea;
            a = scale * this.width / 2;
            b = scale * this.height / 2;
            sa = this.startAngle * Math.PI / 180;
            r1 = a * b / Math.sqrt(b * b * Math.cos(sa) * Math.cos(sa) + a * a * Math.sin(sa) * Math.sin(sa));
            x1 = r1 * Math.cos(sa);
            y1 = r1 * Math.sin(sa);
            x1 = cx + x1;
            y1 = cy + y1;

            ea = (startAngle + arcAngle) * Math.PI / 180;
            r2 = a * b / Math.sqrt(b * b * Math.cos(ea) * Math.cos(ea) + a * a * Math.sin(ea) * Math.sin(ea));
            x2 = r2 * Math.cos(ea);
            y2 = r2 * Math.sin(ea);
            x2 = cx + x2;
            y2 = cy + y2;

            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            if (arcAngle > 180)
                _svgvmlObj.setAttribute('d', 'M' + x1 + ' ' + y1 + ' A' + a + ' ' + b + ' 0 1 1 ' + x2 + ' ' + y2);
            else
                _svgvmlObj.setAttribute('d', 'M' + x1 + ' ' + y1 + ' A' + a + ' ' + b + ' 0 0 1 ' + x2 + ' ' + y2);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            var a, b, r1, r2, sa, ea, sat, eat, endAngle;
            endAngle = this.startAngle + this.arcAngle;
            startAngle = this.startAngle % 360;
            endAngle = endAngle % 360;
            a = scale * this.width / 2;
            b = scale * this.height / 2;
            sa = this.startAngle * Math.PI / 180;
            r1 = a * b / Math.sqrt(b * b * Math.cos(sa) * Math.cos(sa) + a * a * Math.sin(sa) * Math.sin(sa));
            sat = Math.asin(r1 * Math.sin(sa) / b) * 180 / Math.PI;
            if (this.startAngle > 270)
                sat = 360 + sat;
            else if (this.startAngle > 90)
                sat = 180 - sat;

            ea = endAngle * Math.PI / 180;
            r2 = a * b / Math.sqrt(b * b * Math.cos(ea) * Math.cos(ea) + a * a * Math.sin(ea) * Math.sin(ea));
            eat = Math.asin(r2 * Math.sin(ea) / b) * 180 / Math.PI;

            if (endAngle > 270)
                eat = 360 + eat;
            else if (endAngle > 90)
                eat = 180 - eat;

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.width = scale * this.width;
            _svgvmlObj.style.height = scale * this.height;
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.left = cx - scale * this.width / 2;
            _svgvmlObj.style.top = cy - scale * this.height / 2;
            sat = sat + 90;
            if (sat > 360)
                _svgvmlObj.StartAngle = sat % 360;
            else
                _svgvmlObj.StartAngle = sat;
            eat = eat + 90;
            if (eat > 360) {
                if (sat <= 360)
                    _svgvmlObj.StartAngle = sat - 360;
                _svgvmlObj.EndAngle = eat % 360;
            }
            else
                _svgvmlObj.EndAngle = eat;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw elliptical arc sector(pie) shape
function jxArcSector(center, width, height, startAngle, arcAngle, pen, brush) {
    
    //Public Properties
    //Check for 360 arcAngle in chrome
    this.center = center;
    this.width = width;
    this.height = height;
    this.startAngle = startAngle;
    this.arcAngle = arcAngle;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxArcSector';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);    
        }
    }

    //Draw arc sector (pie) shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var center, scale;
        center = graphics.logicalToPhysicalPoint(this.center);
        scale = graphics.scale;

        var cx, cy;
        cx = center.x;
        cy = center.y;

        //Calculation of coordinates of ellipse based on angle
        var a, b, r1, r2, x1, x2, y1, y2, sa, ea;
        a = scale * this.width / 2;
        b = scale * this.height / 2;
        sa = this.startAngle * Math.PI / 180;
        r1 = a * b / Math.sqrt(b * b * Math.cos(sa) * Math.cos(sa) + a * a * Math.sin(sa) * Math.sin(sa));
        x1 = r1 * Math.cos(sa);
        y1 = r1 * Math.sin(sa);
        x1 = cx + x1;
        y1 = cy + y1;

        ea = (this.startAngle + this.arcAngle) * Math.PI / 180;
        r2 = a * b / Math.sqrt(b * b * Math.cos(ea) * Math.cos(ea) + a * a * Math.sin(ea) * Math.sin(ea));
        x2 = r2 * Math.cos(ea);
        y2 = r2 * Math.sin(ea);
        x2 = cx + x2;
        y2 = cy + y2;

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            if (arcAngle > 180)
                _svgvmlObj.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + x1 + ' ' + y1 + ' A' + a + ' ' + b + ' 0 1 1 ' + x2 + ' ' + y2 + ' Z');
            else
                _svgvmlObj.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + x1 + ' ' + y1 + ' A' + a + ' ' + b + ' 0 0 1 ' + x2 + ' ' + y2 + ' Z');
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            var t, l, h, w
            t = Math.min(y2, Math.min(cy, y1));
            l = Math.min(x2, Math.min(cx, x1));
            h = Math.max(y2, Math.max(cy, y1)) - t;
            w = Math.max(x2, Math.max(cx, x1)) - l;

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.height = 1;
            _svgvmlObj.style.width = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            _svgvmlObj.Path = 'M' + cx + ',' + cy + ' AT' + (cx - a) + ',' + (cy - b) + ',' + (cx + a) + ',' + (cy + b) + ',' + Math.round(x2) + ',' + Math.round(y2) + ',' + Math.round(x1) + ',' + Math.round(y1) + ' X E';
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw curve shape
function jxCurve(points, pen, brush, tension) {
    //Public Properties
    this.points = points;
    this.pen = null;
    this.brush = null;
    this.tension = 1;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;
    if (tension!=null)
        this.tension = tension;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxCurve';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw curve shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points=new Array();
        for (ind in this.points) {
            points[ind] = graphics.logicalToPhysicalPoint(this.points[ind]);
        }

        var path, ten = this.tension, pDpoints = new Array(), b1points = new Array(), b2points = new Array();
        
        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                pDpoints[i] = new jxPoint(ten * (points[1].x - points[0].x) / 2, ten * (points[1].y - points[0].y) / 2);
            else if (i == points.length - 1)
                pDpoints[i] = new jxPoint(ten * (points[i].x - points[i - 1].x) / 2, ten * (points[i].y - points[i - 1].y) / 2);
            else
                pDpoints[i] = new jxPoint(ten * (points[i + 1].x - points[i - 1].x) / 2, ten * (points[i + 1].y - points[i - 1].y) / 2);
        }
        for (i in points) {
            i = parseInt(i);
            if (i == points.length - 1) {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[i].x - pDpoints[i].x / 3, points[i].y - pDpoints[i].y / 3);
            }
            else {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[i + 1].x - pDpoints[i + 1].x / 3, points[i + 1].y - pDpoints[i + 1].y / 3);
            }
        }

        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                path = 'M' + points[i].x + ',' + points[i].y;
            if (i < points.length - 1)
                path = path + ' C' + Math.round(b1points[i].x) + ',' + Math.round(b1points[i].y) + ',' + Math.round(b2points[i].x) + ',' + Math.round(b2points[i].y) + ',' + Math.round(points[i + 1].x) + ',' + Math.round(points[i + 1].y);
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            _svgvmlObj.setAttribute('d', path);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            path = path + ' E';

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.width = 1;
            _svgvmlObj.style.height = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            _svgvmlObj.Path = path;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw closed curve shape
function jxClosedCurve(points, pen, brush, tension) {

    //Public Properties
    this.points = points;
    this.pen = null;
    this.brush = null;
    this.tension = 1;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    var _svgvmlObj = null;
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;
    if (tension != null)
        this.tension = tension;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxClosedCurve';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }
    
    //Draw closed curve shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points = new Array();
        for (ind in this.points) {
            points[ind] = graphics.logicalToPhysicalPoint(this.points[ind]);
        }

        var path, n=points.length - 1, ten = this.tension, pDpoints = new Array(), b1points = new Array(), b2points = new Array();

        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                pDpoints[i] = new jxPoint(ten * (points[1].x - points[n].x) / 2, ten * (points[1].y - points[n].y) / 2);
            else if (i == points.length - 1)
                pDpoints[i] = new jxPoint(ten * (points[0].x - points[i - 1].x) / 2, ten * (points[0].y - points[i - 1].y) / 2);
            else
                pDpoints[i] = new jxPoint(ten * (points[i + 1].x - points[i - 1].x) / 2, ten * (points[i + 1].y - points[i - 1].y) / 2);
        }
        for (i in points) {
            i = parseInt(i);
            if (i == points.length - 1) {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[0].x - pDpoints[0].x / 3, points[0].y - pDpoints[0].y / 3);
            }
            else {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[i + 1].x - pDpoints[i + 1].x / 3, points[i + 1].y - pDpoints[i + 1].y / 3);
            }
        }

        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                path = 'M' + points[i].x + ',' + points[i].y;
            if (i < points.length - 1)
                path = path + ' C' + Math.round(b1points[i].x) + ',' + Math.round(b1points[i].y) + ',' + Math.round(b2points[i].x) + ',' + Math.round(b2points[i].y) + ',' + Math.round(points[i + 1].x) + ',' + Math.round(points[i + 1].y);
            if (i == points.length - 1)
                path = path + ' C' + Math.round(b1points[i].x) + ',' + Math.round(b1points[i].y) + ',' + Math.round(b2points[i].x) + ',' + Math.round(b2points[i].y) + ',' + Math.round(points[0].x) + ',' + Math.round(points[0].y);    
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            _svgvmlObj.setAttribute('d', path);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            path = path + ' E';

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.width = 1;
            _svgvmlObj.style.height = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            _svgvmlObj.Path = path;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw bezier shape
function jxBezier(points, pen, brush) {

    //Public Properties
    this.points = points;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxBezier';
    }
    
    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw bezier shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points = new Array();
        for (ind in this.points) {
            points[ind] = graphics.logicalToPhysicalPoint(this.points[ind]);
        }
           
        var path;
        if (points.length > 4) {
            var pDpoints = new Array();
            var b1points = new Array();
            var b2points = new Array();

            //Calculate bezier points
            var res_points = new Array();
            var n = points.length - 1;
            var bx, by, i, ic, t, tstep = 10 * Math.min(1 / Math.abs(points[n].x - points[0].x), 1 / Math.abs(points[n].y - points[0].y));
            ic = 0;
            for (t = 0; t < 1; t += tstep) {
                x = 0; y = 0;
                for (i = 0; i <= n; i++) {
                    bx = Math.pow(t, i) * Math.pow((1 - t), n - i) * points[i].x;
                    if (i != 0 || i != n) {
                        bx = bx * jsDraw2DX.fact(n) / jsDraw2DX.fact(i) / jsDraw2DX.fact(n - i);
                    }
                    x = x + bx;

                    by = Math.pow(t, i) * Math.pow((1 - t), n - i) * points[i].y;
                    if (i != 0 || i != n) {
                        by = by * jsDraw2DX.fact(n) / jsDraw2DX.fact(i) / jsDraw2DX.fact(n - i);
                    }
                    y = y + by;
                }
                res_points[ic] = new jxPoint(x, y);
                ic++;
            }
            res_points[ic] = new jxPoint(points[n].x, points[n].y);
            points = res_points;
            //result points curve
            tension = 1;
            for (i in points) {
                i = parseInt(i);
                if (i == 0)
                    pDpoints[i] = new jxPoint(tension * (points[1].x - points[0].x) / 2, tension * (points[1].y - points[0].y) / 2);
                else if (i == points.length - 1)
                    pDpoints[i] = new jxPoint(tension * (points[i].x - points[i - 1].x) / 2, tension * (points[i].y - points[i - 1].y) / 2);
                else
                    pDpoints[i] = new jxPoint(tension * (points[i + 1].x - points[i - 1].x) / 2, tension * (points[i + 1].y - points[i - 1].y) / 2);
            }
            for (i in points) {
                i = parseInt(i);
                if (i == 0) {
                    b1points[i] = new jxPoint(points[0].x + pDpoints[0].x / 3, points[0].y + pDpoints[0].y / 3);
                    b2points[i] = new jxPoint(points[1].x - pDpoints[1].x / 3, points[1].y - pDpoints[1].y / 3);
                }
                else if (i == points.length - 1) {
                    b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                    b2points[i] = new jxPoint(points[i].x - pDpoints[i].x / 3, points[i].y - pDpoints[i].y / 3);
                }
                else {
                    b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                    b2points[i] = new jxPoint(points[i + 1].x - pDpoints[i + 1].x / 3, points[i + 1].y - pDpoints[i + 1].y / 3);
                }
            }

            for (i in points) {
                i = parseInt(i);
                if (i == 0)
                    path = 'M' + points[i].x + ',' + points[i].y;
                if (i < points.length - 1)
                    path = path + ' C' + Math.round(b1points[i].x) + ',' + Math.round(b1points[i].y) + ',' + Math.round(b2points[i].x) + ',' + Math.round(b2points[i].y) + ',' + Math.round(points[i + 1].x) + ',' + Math.round(points[i + 1].y);
            }
        }
        else {
            if (points.length == 4) {
                path = ' M' + points[0].x + ',' + points[0].y + ' C' + points[1].x + ',' + points[1].y + ' ' + points[2].x + ',' + points[2].y + ' ' + points[3].x + ',' + points[3].y;
            }
            else if (points.length == 3) {
                if (!jsDraw2DX._isVML) {
                    path = ' M' + points[0].x + ',' + points[0].y + ' Q' + points[1].x + ',' + points[1].y + ' ' + points[2].x + ',' + points[2].y;
                }
                else {
                    //Since QB command of VML does not work, converting one contol point to two
                    var c1point = new jxPoint(2 / 3 * points[1].x + 1 / 3 * points[0].x, 2 / 3 * points[1].y + 1 / 3 * points[0].y);
                    var c2point = new jxPoint(2 / 3 * points[1].x + 1 / 3 * points[2].x, 2 / 3 * points[1].y + 1 / 3 * points[2].y);
                    path = ' M' + points[0].x + ',' + points[0].y + ' C' + Math.round(c1point.x) + ',' + Math.round(c1point.y) + ' ' + Math.round(c2point.x) + ',' + Math.round(c2point.y) + ' ' + points[2].x + ',' + points[2].y;
                }
            }
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Setting
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            _svgvmlObj.setAttribute('d', path);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            path = path + ' E'

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.width = 1;
            _svgvmlObj.style.height = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            _svgvmlObj.Path = path;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw function graph shape
function jxFunctionGraph(fn, xMin, xMax, pen, brush) {

    //Public Properties
    this.fn = fn;
    this.xMin = xMin;
    this.xMax = xMax;
    this.pen = null;
    this.brush = null;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxFunctionGraph';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Validate the function equation
    this.validate = validate;
    function validate(fn) {
        fn = fn.replace(/x/g, 1);
        with (Math) {
            try {
                eval(fn);
                return true;
            }
            catch (ex) {
                return false;
            }
        }
    }

    //Draw function graph shape on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var points = new Array();
        var path, pDpoints;
        var pDpoints = new Array();
        var b1points = new Array();
        var b2points = new Array();

        //Validate the function
        if (!this.validate(fn))
            return;

        //Calculate function graph points
        var x,y,ic = 0;
        for (x = xMin; x < xMax; x++) {
            with (Math) {
                y = eval(fn.replace(/x/g, x));
            }
            points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
            ic++;
        }
        with (Math) {
            y = eval(fn.replace(/x/g, xMax));
        }
        points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
        ic++;
        
        //result points curve
        tension = 1;
        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                pDpoints[i] = new jxPoint(tension * (points[1].x - points[0].x) / 2, tension * (points[1].y - points[0].y) / 2);
            else if (i == points.length - 1)
                pDpoints[i] = new jxPoint(tension * (points[i].x - points[i - 1].x) / 2, tension * (points[i].y - points[i - 1].y) / 2);
            else
                pDpoints[i] = new jxPoint(tension * (points[i + 1].x - points[i - 1].x) / 2, tension * (points[i + 1].y - points[i - 1].y) / 2);
        }
        for (i in points) {
            i = parseInt(i);
            if (i == 0) {
                b1points[i] = new jxPoint(points[0].x + pDpoints[0].x / 3, points[0].y + pDpoints[0].y / 3);
                b2points[i] = new jxPoint(points[1].x - pDpoints[1].x / 3, points[1].y - pDpoints[1].y / 3);
            }
            else if (i == points.length - 1) {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[i].x - pDpoints[i].x / 3, points[i].y - pDpoints[i].y / 3);
            }
            else {
                b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
                b2points[i] = new jxPoint(points[i + 1].x - pDpoints[i + 1].x / 3, points[i + 1].y - pDpoints[i + 1].y / 3);
            }
        }

        for (i in points) {
            i = parseInt(i);
            if (i == 0)
                path = 'M' + points[i].x + ',' + points[i].y;
            if (i < points.length - 1)
                path = path + ' C' + Math.round(b1points[i].x) + ',' + Math.round(b1points[i].y) + ',' + Math.round(b2points[i].x) + ',' + Math.round(b2points[i].y) + ',' + Math.round(points[i + 1].x) + ',' + Math.round(points[i + 1].y);
        }

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Settings
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            _svgvmlObj.setAttribute('d', path);
        }
        else {
            var vml = graphics.getVML(), vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }

            path = path + ' E'

            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);

            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.width = 1;
            _svgvmlObj.style.height = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            _svgvmlObj.Path = path;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw text string
function jxText(point, text, font, pen, brush, angle) {
    //Public Properties
    this.point = point;
    this.text = text;
    this.font = null;
    this.pen = null;
    this.brush =  null;
    this.angle = 0;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;

    //Object construction
    if (font)
        this.font = font;
    if (pen)
        this.pen = pen;
    if (brush)
        this.brush = brush;
    if (angle)
        this.angle = angle;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    else
        _svgvmlObj = document.createElement('v:shape');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxText';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;    
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw text string on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var point;
        point = graphics.logicalToPhysicalPoint(this.point);

        var x, y;
        x = point.x;
        y = point.y;

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            //Apply Pen Settings
            if (!this.pen)
                _svgvmlObj.setAttribute('stroke', 'none');
            else
                this.pen.updateSVG(_svgvmlObj);

            //Apply Brush Settings
            if (!this.brush)
                _svgvmlObj.setAttribute('fill', 'none');
            else {
                this.brush.updateSVG(_svgvmlObj, graphics.getDefs());
            }

            //Apply Font Settings
            if (this.font)
                this.font.updateSVG(_svgvmlObj);
            else
                jxFont.updateSVG(_svgvmlObj);
            
            _svgvmlObj.setAttribute('x', x);
            _svgvmlObj.setAttribute('y', y);
            _svgvmlObj.setAttribute('transform', 'rotate(' + this.angle + ' ' + x + ',' + y + ')');
            _svgvmlObj.textContent = this.text;
        }
        else {
            var vml = graphics.getVML(), vmlFill, vmlPath, vmlTextPath;
            if (_isFirst) {
                vmlTextPath = document.createElement('v:textpath');
                vmlTextPath.On = 'True';
                vmlTextPath.style['v-text-align'] = 'left';
                _svgvmlObj.appendChild(vmlTextPath); 
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            vmlFill = _svgvmlObj.fill;
            vmlTextPath = _svgvmlObj.firstChild; 
            
            //Apply Pen Setting
            if (!this.pen)
                _svgvmlObj.Stroked = 'False';
            else
                this.pen.updateVML(_svgvmlObj);

            //Apply Brush Setting
            vmlFill = _svgvmlObj.fill;
            if (!this.brush)
                vmlFill.On = 'false';
            else
                this.brush.updateVML(vmlFill);


            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.height = 1;
            _svgvmlObj.CoordSize = 1 + ' ' + 1;
            vmlPath = _svgvmlObj.Path;
            vmlPath.TextPathOk = 'true'; 
            vmlPath.v = 'M' + x + ',' + y + ' L' + (x + 100) + ',' + y + ' E';

            vmlTextPath.String = this.text;

            //Apply Font Settings
            if (this.font)
                this.font.updateVML(vmlTextPath);
            else
                jxFont.updateVML(vmlTextPath);


            _svgvmlObj.style.display = '';

            var x1, y1, r, a;
            r = (_svgvmlObj.clientHeight / 2 * 0.8);
            a = this.angle;
            x = Math.round(x + r * Math.sin(a * Math.PI / 180));
            y = Math.round(y - r * Math.cos(a * Math.PI / 180));
            x1 = Math.round(x + Math.cos(a * Math.PI / 180) * 100);
            y1 = Math.round(y + Math.sin(a * Math.PI / 180) * 100);
            _svgvmlObj.Path = 'M' + x + ',' + y + ' L' + x1 + ',' + y1 + ' E';
            _svgvmlObj.style.width = 1;
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

//Class to hold information and draw image
function jxImage(point, url, width, height, angle) {
    //Private memeber variables
    this.point = point;
    this.url = url;
    this.width = width;
    this.height = height;
    this.angle = 0;

    //Private member variables
    var _svgvmlObj, _isFirst = true;
    var _graphics;
    
    //Object construction
    if (angle)
        this.angle = angle;

    if (!jsDraw2DX._isVML)
        _svgvmlObj = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    else
        _svgvmlObj = document.createElement('v:image');

    //Public Methods
    this.getType = getType;
    function getType() {
        return 'jxImage';
    }

    //Events Handling Ability
    this.addEventListener = addEventListener;
    function addEventListener(eventName, handler) {
        if (_svgvmlObj.addEventListener)
            _svgvmlObj.addEventListener(eventName, handlerWrapper, false);
        else if (_svgvmlObj.attachEvent)
            _svgvmlObj.attachEvent('on' + eventName, handlerWrapper);

        var currentObj = this;
        function handlerWrapper(evt) {
            handler(evt, currentObj);
        }    
    }

    //Draw image on the jxGraphics 
    this.draw = draw;
    function draw(graphics) {
        var point, scale;
        point = graphics.logicalToPhysicalPoint(this.point);
        scale = graphics.scale;
        var x, y;
        x = point.x;
        y = point.y;

        _svgvmlObj.style.display = 'none';

        if (!jsDraw2DX._isVML) {
            var svg = graphics.getSVG();
            if (_isFirst) {
                svg.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            _svgvmlObj.setAttribute('x', x);
            _svgvmlObj.setAttribute('y', y);
            _svgvmlObj.setAttribute('height', scale * this.height);
            _svgvmlObj.setAttribute('width', scale * this.width);
            _svgvmlObj.setAttribute('preserveAspectRatio', 'none');
            _svgvmlObj.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.url);
            _svgvmlObj.setAttribute('transform', 'rotate(' + this.angle + ' ' + x + ',' + y + ')');
        }
        else {
            with (Math) {
                var x1, y1, ang = this.angle, a = this.angle * PI / 180, w, h, m1, m2, m3, m4;
                w = scale * this.width;
                h = scale * this.height;
                x1 = x; y1 = y;
                if (abs(ang) > 360)
                    ang = ang % 360;
                if (ang < 0)
                    ang = 360 + ang;
                //Rotation point    
                if (ang >= 0 && ang < 90) {
                    y1 = y;
                    x1 = x - (h * sin(a));
                }
                else if (ang >= 90 && ang < 180) {
                    y1 = y - h * sin(a - PI / 2);
                    x1 = x - (w * sin(a - PI / 2) + h * cos(a - PI / 2));
                }
                else if (ang >= 180 && ang < 270) {
                    y1 = y - (w * sin(a - PI) + h * cos(a - PI));
                    x1 = x - w * cos(a - PI);
                }
                else if (ang >= 270 && ang <=360) {
                    x1 = x;
                    y1 = y - w * cos(a - 1.5 * PI);
                }
                
                //Matrix for rotation            
                m1 = cos(a);
                m2 = -sin(a);
                m3 = sin(a);
                m4 = cos(a);
            }
            var vml = graphics.getVML(),vmlFill;
            if (_isFirst) {
                vml.appendChild(_svgvmlObj);
                _isFirst = false;
            }
            _svgvmlObj.style.width = w;
            _svgvmlObj.style.height = h;
            _svgvmlObj.style.position = 'absolute';
            _svgvmlObj.style.top = y1;
            _svgvmlObj.style.left = x1;
            _svgvmlObj.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" + m1 + ',M12=' + m2 + ',M21=' + m3 + ',M22=' + m4 + ") filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='scale');";
        }

        _svgvmlObj.style.display = '';

        if (_graphics && graphics != _graphics) {
            _graphics.removeShape(this);
        }
        _graphics = graphics;
        _graphics.addShape(this);
    }

    //Removes shape from the graphics drawing
    this.remove = remove;
    function remove() {
        if (_graphics) {
            if (!jsDraw2DX._isVML) {
                var svg = _graphics.getSVG();
                svg.removeChild(_svgvmlObj);
            }
            else {
                var vml = _graphics.getVML();
                vml.removeChild(_svgvmlObj);
            }
            _graphics.removeShape(this);
            _graphics = null;
            _isFirst = true;
        }
    }

    //Show the already drawn shape
    this.show = show;
    function show() {
        _svgvmlObj.style.display = '';
    }

    //Hide the already drawn shape
    this.hide = hide;
    function hide() {
        _svgvmlObj.style.display = 'none';
    }
}

/*
 (c) 2014, Vladimir Agafonkin
 simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
 https://github.com/mourner/simpleheat
*/
!function(){"use strict";function t(i){return this instanceof t?(this._canvas=i="string"==typeof i?document.getElementById(i):i,this._ctx=i.getContext("2d"),this._width=i.width,this._height=i.height,this._max=1,void this.clear()):new t(i)}t.prototype={defaultRadius:25,defaultGradient:{.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"},data:function(t,i){return this._data=t,this},max:function(t){return this._max=t,this},add:function(t){return this._data.push(t),this},clear:function(){return this._data=[],this},radius:function(t,i){i=i||15;var a=this._circle=document.createElement("canvas"),s=a.getContext("2d"),e=this._r=t+i;return a.width=a.height=2*e,s.shadowOffsetX=s.shadowOffsetY=200,s.shadowBlur=i,s.shadowColor="black",s.beginPath(),s.arc(e-200,e-200,t,0,2*Math.PI,!0),s.closePath(),s.fill(),this},gradient:function(t){var i=document.createElement("canvas"),a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,256);i.width=1,i.height=256;for(var e in t)s.addColorStop(e,t[e]);return a.fillStyle=s,a.fillRect(0,0,1,256),this._grad=a.getImageData(0,0,1,256).data,this},draw:function(t){this._circle||this.radius(this.defaultRadius),this._grad||this.gradient(this.defaultGradient);var i=this._ctx;i.clearRect(0,0,this._width,this._height);for(var a,s=0,e=this._data.length;e>s;s++)a=this._data[s],i.globalAlpha=Math.max(a[2]/this._max,t||.05),i.drawImage(this._circle,a[0]-this._r,a[1]-this._r);var n=i.getImageData(0,0,this._width,this._height);return this._colorize(n.data,this._grad),i.putImageData(n,0,0),this},_colorize:function(t,i){for(var a,s=3,e=t.length;e>s;s+=4)a=4*t[s],a&&(t[s-3]=i[a],t[s-2]=i[a+1],t[s-1]=i[a+2])}},window.simpleheat=t}(),/*
 (c) 2014, Vladimir Agafonkin
 Leaflet.heat, a tiny and fast heatmap plugin for Leaflet.
 https://github.com/Leaflet/Leaflet.heat
*/
L.HeatLayer=(L.Layer?L.Layer:L.Class).extend({initialize:function(t,i){this._latlngs=t,L.setOptions(this,i)},setLatLngs:function(t){return this._latlngs=t,this.redraw()},addLatLng:function(t){return this._latlngs.push(t),this.redraw()},setOptions:function(t){return L.setOptions(this,t),this._heat&&this._updateOptions(),this.redraw()},redraw:function(){return!this._heat||this._frame||this._map._animating||(this._frame=L.Util.requestAnimFrame(this._redraw,this)),this},onAdd:function(t){this._map=t,this._canvas||this._initCanvas(),t._panes.overlayPane.appendChild(this._canvas),t.on("moveend",this._reset,this),t.options.zoomAnimation&&L.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._canvas),t.off("moveend",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},_initCanvas:function(){var t=this._canvas=L.DomUtil.create("canvas","leaflet-heatmap-layer leaflet-layer"),i=L.DomUtil.testProp(["transformOrigin","WebkitTransformOrigin","msTransformOrigin"]);t.style[i]="50% 50%";var a=this._map.getSize();t.width=a.x,t.height=a.y;var s=this._map.options.zoomAnimation&&L.Browser.any3d;L.DomUtil.addClass(t,"leaflet-zoom-"+(s?"animated":"hide")),this._heat=simpleheat(t),this._updateOptions()},_updateOptions:function(){this._heat.radius(this.options.radius||this._heat.defaultRadius,this.options.blur),this.options.gradient&&this._heat.gradient(this.options.gradient),this.options.max&&this._heat.max(this.options.max)},_reset:function(){var t=this._map.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(this._canvas,t);var i=this._map.getSize();this._heat._width!==i.x&&(this._canvas.width=this._heat._width=i.x),this._heat._height!==i.y&&(this._canvas.height=this._heat._height=i.y),this._redraw()},_redraw:function(){var t,i,a,s,e,n,h,o,r,d=[],_=this._heat._r,l=this._map.getSize(),m=new L.Bounds(L.point([-_,-_]),l.add([_,_])),c=void 0===this.options.max?1:this.options.max,u=void 0===this.options.maxZoom?this._map.getMaxZoom():this.options.maxZoom,f=1/Math.pow(2,Math.max(0,Math.min(u-this._map.getZoom(),12))),g=_/2,p=[],v=this._map._getMapPanePos(),w=v.x%g,y=v.y%g;for(t=0,i=this._latlngs.length;i>t;t++)if(a=this._map.latLngToContainerPoint(this._latlngs[t]),m.contains(a)){e=Math.floor((a.x-w)/g)+2,n=Math.floor((a.y-y)/g)+2;var x=void 0!==this._latlngs[t].alt?this._latlngs[t].alt:void 0!==this._latlngs[t][2]?+this._latlngs[t][2]:1;r=x*f,p[n]=p[n]||[],s=p[n][e],s?(s[0]=(s[0]*s[2]+a.x*r)/(s[2]+r),s[1]=(s[1]*s[2]+a.y*r)/(s[2]+r),s[2]+=r):p[n][e]=[a.x,a.y,r]}for(t=0,i=p.length;i>t;t++)if(p[t])for(h=0,o=p[t].length;o>h;h++)s=p[t][h],s&&d.push([Math.round(s[0]),Math.round(s[1]),Math.min(s[2],c)]);this._heat.data(d).draw(this.options.minOpacity),this._frame=null},_animateZoom:function(t){var i=this._map.getZoomScale(t.zoom),a=this._map._getCenterOffset(t.center)._multiplyBy(-i).subtract(this._map._getMapPanePos());L.DomUtil.setTransform?L.DomUtil.setTransform(this._canvas,a,i):this._canvas.style[L.DomUtil.TRANSFORM]=L.DomUtil.getTranslateString(a)+" scale("+i+")"}}),L.heatLayer=function(t,i){return new L.HeatLayer(t,i)};
!function(n){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.leafletPip=n()}}(function(){return function n(t,o,e){function r(i,s){if(!o[i]){if(!t[i]){var u="function"==typeof require&&require;if(!s&&u)return u(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var f=o[i]={exports:{}};t[i][0].call(f.exports,function(n){var o=t[i][1][n];return r(o?o:n)},f,f.exports,n,t,o,e)}return o[i].exports}for(var a="function"==typeof require&&require,i=0;i<e.length;i++)r(e[i]);return r}({1:[function(n,t){var o=n("geojson-utils"),e={bassackwards:!1,pointInLayer:function(n,t,r){"use strict";n instanceof L.LatLng?n=[n.lng,n.lat]:e.bassackwards&&(n=n.concat().reverse());var a=[];return t.eachLayer(function(t){r&&a.length||(t instanceof L.MultiPolygon||t instanceof L.Polygon)&&o.pointInPolygon({type:"Point",coordinates:n},t.toGeoJSON().geometry)&&a.push(t)}),a}};t.exports=e},{"geojson-utils":2}],2:[function(n,t){!function(){function n(n){for(var t=[],o=[],e=0;e<n[0].length;e++)t.push(n[0][e][1]),o.push(n[0][e][0]);return t=t.sort(function(n,t){return n-t}),o=o.sort(function(n,t){return n-t}),[[t[0],o[0]],[t[t.length-1],o[o.length-1]]]}function o(n,t,o){for(var e=[[0,0]],r=0;r<o.length;r++){for(var a=0;a<o[r].length;a++)e.push(o[r][a]);e.push(o[r][0]),e.push([0,0])}for(var i=!1,r=0,a=e.length-1;r<e.length;a=r++)e[r][0]>t!=e[a][0]>t&&n<(e[a][1]-e[r][1])*(t-e[r][0])/(e[a][0]-e[r][0])+e[r][1]&&(i=!i);return i}var e=this.gju={};"undefined"!=typeof t&&t.exports&&(t.exports=e),e.lineStringsIntersect=function(n,t){for(var o=[],e=0;e<=n.coordinates.length-2;++e)for(var r=0;r<=t.coordinates.length-2;++r){var a={x:n.coordinates[e][1],y:n.coordinates[e][0]},i={x:n.coordinates[e+1][1],y:n.coordinates[e+1][0]},s={x:t.coordinates[r][1],y:t.coordinates[r][0]},u={x:t.coordinates[r+1][1],y:t.coordinates[r+1][0]},c=(u.x-s.x)*(a.y-s.y)-(u.y-s.y)*(a.x-s.x),f=(i.x-a.x)*(a.y-s.y)-(i.y-a.y)*(a.x-s.x),h=(u.y-s.y)*(i.x-a.x)-(u.x-s.x)*(i.y-a.y);if(0!=h){var d=c/h,l=f/h;d>=0&&1>=d&&l>=0&&1>=l&&o.push({type:"Point",coordinates:[a.x+d*(i.x-a.x),a.y+d*(i.y-a.y)]})}}return 0==o.length&&(o=!1),o},e.pointInBoundingBox=function(n,t){return!(n.coordinates[1]<t[0][0]||n.coordinates[1]>t[1][0]||n.coordinates[0]<t[0][1]||n.coordinates[0]>t[1][1])},e.pointInPolygon=function(t,r){for(var a="Polygon"==r.type?[r.coordinates]:r.coordinates,i=!1,s=0;s<a.length;s++)e.pointInBoundingBox(t,n(a[s]))&&(i=!0);if(!i)return!1;for(var u=!1,s=0;s<a.length;s++)o(t.coordinates[1],t.coordinates[0],a[s])&&(u=!0);return u},e.pointInMultiPolygon=function(t,r){for(var a="MultiPolygon"==r.type?[r.coordinates]:r.coordinates,i=!1,s=!1,u=0;u<a.length;u++){for(var c=a[u],f=0;f<c.length;f++)i||e.pointInBoundingBox(t,n(c[f]))&&(i=!0);if(!i)return!1;for(var f=0;f<c.length;f++)s||o(t.coordinates[1],t.coordinates[0],c[f])&&(s=!0)}return s},e.numberToRadius=function(n){return n*Math.PI/180},e.numberToDegree=function(n){return 180*n/Math.PI},e.drawCircle=function(n,t,o){for(var r=[t.coordinates[1],t.coordinates[0]],a=n/1e3/6371,i=[e.numberToRadius(r[0]),e.numberToRadius(r[1])],o=o||15,s=[[r[0],r[1]]],u=0;o>u;u++){var c=2*Math.PI*u/o,f=Math.asin(Math.sin(i[0])*Math.cos(a)+Math.cos(i[0])*Math.sin(a)*Math.cos(c)),h=i[1]+Math.atan2(Math.sin(c)*Math.sin(a)*Math.cos(i[0]),Math.cos(a)-Math.sin(i[0])*Math.sin(f));s[u]=[],s[u][1]=e.numberToDegree(f),s[u][0]=e.numberToDegree(h)}return{type:"Polygon",coordinates:[s]}},e.rectangleCentroid=function(n){var t=n.coordinates[0],o=t[0][0],e=t[0][1],r=t[2][0],a=t[2][1],i=r-o,s=a-e;return{type:"Point",coordinates:[o+i/2,e+s/2]}},e.pointDistance=function(n,t){var o=n.coordinates[0],r=n.coordinates[1],a=t.coordinates[0],i=t.coordinates[1],s=e.numberToRadius(i-r),u=e.numberToRadius(a-o),c=Math.pow(Math.sin(s/2),2)+Math.cos(e.numberToRadius(r))*Math.cos(e.numberToRadius(i))*Math.pow(Math.sin(u/2),2),f=2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c));return 6371*f*1e3},e.geometryWithinRadius=function(n,t,o){if("Point"==n.type)return e.pointDistance(n,t)<=o;if("LineString"==n.type||"Polygon"==n.type){var r,a={};r="Polygon"==n.type?n.coordinates[0]:n.coordinates;for(var i in r)if(a.coordinates=r[i],e.pointDistance(a,t)>o)return!1}return!0},e.area=function(n){for(var t,o,e=0,r=n.coordinates[0],a=r.length-1,i=0;i<r.length;a=i++){var t={x:r[i][1],y:r[i][0]},o={x:r[a][1],y:r[a][0]};e+=t.x*o.y,e-=t.y*o.x}return e/=2},e.centroid=function(n){for(var t,o,r,a=0,i=0,s=n.coordinates[0],u=s.length-1,c=0;c<s.length;u=c++){var o={x:s[c][1],y:s[c][0]},r={x:s[u][1],y:s[u][0]};t=o.x*r.y-r.x*o.y,a+=(o.x+r.x)*t,i+=(o.y+r.y)*t}return t=6*e.area(n),{type:"Point",coordinates:[i/t,a/t]}},e.simplify=function(n,t){t=t||20,n=n.map(function(n){return{lng:n.coordinates[0],lat:n.coordinates[1]}});var o,e,r,a,i,s,u,c,f,h,d,l,y,g,M,p,x,v,P,b=Math.PI/180*.5,m=new Array,I=new Array,T=new Array;if(n.length<3)return n;for(o=n.length,h=360*t/(2*Math.PI*6378137),h*=h,r=0,I[0]=0,T[0]=o-1,e=1;e>0;)if(a=I[e-1],i=T[e-1],e--,i-a>1){for(d=n[i].lng()-n[a].lng(),l=n[i].lat()-n[a].lat(),Math.abs(d)>180&&(d=360-Math.abs(d)),d*=Math.cos(b*(n[i].lat()+n[a].lat())),y=d*d+l*l,s=a+1,u=a,f=-1;i>s;s++)g=n[s].lng()-n[a].lng(),M=n[s].lat()-n[a].lat(),Math.abs(g)>180&&(g=360-Math.abs(g)),g*=Math.cos(b*(n[s].lat()+n[a].lat())),p=g*g+M*M,x=n[s].lng()-n[i].lng(),v=n[s].lat()-n[i].lat(),Math.abs(x)>180&&(x=360-Math.abs(x)),x*=Math.cos(b*(n[s].lat()+n[i].lat())),P=x*x+v*v,c=p>=y+P?P:P>=y+p?p:(g*l-M*d)*(g*l-M*d)/y,c>f&&(u=s,f=c);h>f?(m[r]=a,r++):(e++,I[e-1]=u,T[e-1]=i,e++,I[e-1]=a,T[e-1]=u)}else m[r]=a,r++;m[r]=o-1,r++;for(var w=new Array,s=0;r>s;s++)w.push(n[m[s]]);return w.map(function(n){return{type:"Point",coordinates:[n.lng,n.lat]}})},e.destinationPoint=function(n,t,o){o/=6371,t=e.numberToRadius(t);var r=e.numberToRadius(n.coordinates[0]),a=e.numberToRadius(n.coordinates[1]),i=Math.asin(Math.sin(a)*Math.cos(o)+Math.cos(a)*Math.sin(o)*Math.cos(t)),s=r+Math.atan2(Math.sin(t)*Math.sin(o)*Math.cos(a),Math.cos(o)-Math.sin(a)*Math.sin(i));return s=(s+3*Math.PI)%(2*Math.PI)-Math.PI,{type:"Point",coordinates:[e.numberToDegree(s),e.numberToDegree(i)]}}}()},{}]},{},[1])(1)});
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['leaflet'], factory);
	} else if (typeof modules === 'object' && module.exports) {
		// define a Common JS module that relies on 'leaflet'
		module.exports = factory(require('leaflet'));
	} else {
		// Assume Leaflet is loaded into global object L already
		factory(L);
	}
}(this, function (L) {
	'use strict';

	L.TileLayer.Provider = L.TileLayer.extend({
		initialize: function (arg, options) {
			var providers = L.TileLayer.Provider.providers;

			var parts = arg.split('.');

			var providerName = parts[0];
			var variantName = parts[1];

			if (!providers[providerName]) {
				throw 'No such provider (' + providerName + ')';
			}

			var provider = {
				url: providers[providerName].url,
				options: providers[providerName].options
			};

			// overwrite values in provider from variant.
			if (variantName && 'variants' in providers[providerName]) {
				if (!(variantName in providers[providerName].variants)) {
					throw 'No such variant of ' + providerName + ' (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				var variantOptions;
				if (typeof variant === 'string') {
					variantOptions = {
						variant: variant
					};
				} else {
					variantOptions = variant.options;
				}
				provider = {
					url: variant.url || provider.url,
					options: L.Util.extend({}, provider.options, variantOptions)
				};
			}

			var forceHTTP = window.location.protocol === 'file:' || provider.options.forceHTTP;
			if (provider.url.indexOf('//') === 0 && forceHTTP) {
				provider.url = 'http:' + provider.url;
			}

			// If retina option is set
			if (provider.options.retina) {
				// Check retina screen
				if (options.detectRetina && L.Browser.retina) {
					// The retina option will be active now
					// But we need to prevent Leaflet retina mode
					options.detectRetina = false;
				} else {
					// No retina, remove option
					provider.options.retina = '';
				}
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function (attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(/\{attribution.(\w*)\}/,
					function (match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */

	L.TileLayer.Provider.providers = {
		OpenStreetMap: {
			url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			},
			variants: {
				Mapnik: {},
				BlackAndWhite: {
					url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18
					}
				},
				DE: {
					url: 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18
					}
				},
				France: {
					url: '//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
					options: {
						attribution: '&copy; Openstreetmap France | {attribution.OpenStreetMap}'
					}
				},
				HOT: {
					url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					options: {
						attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
					}
				}
			}
		},
		OpenSeaMap: {
			url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
			options: {
				attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
			}
		},
		OpenTopoMap: {
			url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 17,
				attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		Thunderforest: {
			url: '//{s}.tile.thunderforest.com/{variant}/{z}/{x}/{y}.png',
			options: {
				attribution:
					'&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, {attribution.OpenStreetMap}',
				variant: 'cycle'
			},
			variants: {
				OpenCycleMap: 'cycle',
				Transport: {
					options: {
						variant: 'transport',
						maxZoom: 19
					}
				},
				TransportDark: {
					options: {
						variant: 'transport-dark',
						maxZoom: 19
					}
				},
				SpinalMap: {
					options: {
						variant: 'spinal-map',
						maxZoom: 11
					}
				},
				Landscape: 'landscape',
				Outdoors: 'outdoors',
				Pioneer: 'pioneer'
			}
		},
		OpenMapSurfer: {
			url: 'http://korona.geog.uni-heidelberg.de/tiles/{variant}/x={x}&y={y}&z={z}',
			options: {
				maxZoom: 20,
				variant: 'roads',
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data {attribution.OpenStreetMap}'
			},
			variants: {
				Roads: 'roads',
				AdminBounds: {
					options: {
						variant: 'adminb',
						maxZoom: 19
					}
				},
				Grayscale: {
					options: {
						variant: 'roadsg',
						maxZoom: 19
					}
				}
			}
		},
		Hydda: {
			url: '//{s}.tile.openstreetmap.se/hydda/{variant}/{z}/{x}/{y}.png',
			options: {
				variant: 'full',
				attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data {attribution.OpenStreetMap}'
			},
			variants: {
				Full: 'full',
				Base: 'base',
				RoadsAndLabels: 'roads_and_labels'
			}
		},
		MapBox: {
			url: '//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
			options: {
				attribution:
					'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: 'abcd'
			}
		},
		Stamen: {
			url: '//stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}',
			options: {
				attribution:
					'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
					'<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 20,
				variant: 'toner',
				ext: 'png'
			},
			variants: {
				Toner: 'toner',
				TonerBackground: 'toner-background',
				TonerHybrid: 'toner-hybrid',
				TonerLines: 'toner-lines',
				TonerLabels: 'toner-labels',
				TonerLite: 'toner-lite',
				Watercolor: {
					options: {
						variant: 'watercolor',
						minZoom: 1,
						maxZoom: 16
					}
				},
				Terrain: {
					options: {
						variant: 'terrain',
						minZoom: 4,
						maxZoom: 18,
						bounds: [[22, -132], [70, -56]]
					}
				},
				TerrainBackground: {
					options: {
						variant: 'terrain-background',
						minZoom: 4,
						maxZoom: 18,
						bounds: [[22, -132], [70, -56]]
					}
				},
				TopOSMRelief: {
					options: {
						variant: 'toposm-color-relief',
						ext: 'jpg',
						bounds: [[22, -132], [51, -56]]
					}
				},
				TopOSMFeatures: {
					options: {
						variant: 'toposm-features',
						bounds: [[22, -132], [51, -56]],
						opacity: 0.9
					}
				}
			}
		},
		Esri: {
			url: '//server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}',
			options: {
				variant: 'World_Street_Map',
				attribution: 'Tiles &copy; Esri'
			},
			variants: {
				WorldStreetMap: {
					options: {
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
					}
				},
				DeLorme: {
					options: {
						variant: 'Specialty/DeLorme_World_Base_Map',
						minZoom: 1,
						maxZoom: 11,
						attribution: '{attribution.Esri} &mdash; Copyright: &copy;2012 DeLorme'
					}
				},
				WorldTopoMap: {
					options: {
						variant: 'World_Topo_Map',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
					}
				},
				WorldImagery: {
					options: {
						variant: 'World_Imagery',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					}
				},
				WorldTerrain: {
					options: {
						variant: 'World_Terrain_Base',
						maxZoom: 13,
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: USGS, Esri, TANA, DeLorme, and NPS'
					}
				},
				WorldShadedRelief: {
					options: {
						variant: 'World_Shaded_Relief',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Source: Esri'
					}
				},
				WorldPhysical: {
					options: {
						variant: 'World_Physical_Map',
						maxZoom: 8,
						attribution: '{attribution.Esri} &mdash; Source: US National Park Service'
					}
				},
				OceanBasemap: {
					options: {
						variant: 'Ocean_Basemap',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					}
				},
				NatGeoWorldMap: {
					options: {
						variant: 'NatGeo_World_Map',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
					}
				},
				WorldGrayCanvas: {
					options: {
						variant: 'Canvas/World_Light_Gray_Base',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ'
					}
				}
			}
		},
		OpenWeatherMap: {
			url: 'http://{s}.tile.openweathermap.org/map/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
				opacity: 0.5
			},
			variants: {
				Clouds: 'clouds',
				CloudsClassic: 'clouds_cls',
				Precipitation: 'precipitation',
				PrecipitationClassic: 'precipitation_cls',
				Rain: 'rain',
				RainClassic: 'rain_cls',
				Pressure: 'pressure',
				PressureContour: 'pressure_cntr',
				Wind: 'wind',
				Temperature: 'temp',
				Snow: 'snow'
			}
		},
		HERE: {
			/*
			 * HERE maps, formerly Nokia maps.
			 * These basemaps are free, but you need an API key. Please sign up at
			 * http://developer.here.com/getting-started
			 *
			 * Note that the base urls contain '.cit' whichs is HERE's
			 * 'Customer Integration Testing' environment. Please remove for production
			 * envirionments.
			 */
			url:
				'//{s}.{base}.maps.cit.api.here.com/maptile/2.1/' +
				'{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?' +
				'app_id={app_id}&app_code={app_code}&lg={language}',
			options: {
				attribution:
					'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
				subdomains: '1234',
				mapID: 'newest',
				'app_id': '<insert your app_id here>',
				'app_code': '<insert your app_code here>',
				base: 'base',
				variant: 'normal.day',
				maxZoom: 20,
				type: 'maptile',
				language: 'eng',
				format: 'png8',
				size: '256'
			},
			variants: {
				normalDay: 'normal.day',
				normalDayCustom: 'normal.day.custom',
				normalDayGrey: 'normal.day.grey',
				normalDayMobile: 'normal.day.mobile',
				normalDayGreyMobile: 'normal.day.grey.mobile',
				normalDayTransit: 'normal.day.transit',
				normalDayTransitMobile: 'normal.day.transit.mobile',
				normalNight: 'normal.night',
				normalNightMobile: 'normal.night.mobile',
				normalNightGrey: 'normal.night.grey',
				normalNightGreyMobile: 'normal.night.grey.mobile',

				basicMap: {
					options: {
						type: 'basetile'
					}
				},
				mapLabels: {
					options: {
						type: 'labeltile',
						format: 'png'
					}
				},
				trafficFlow: {
					options: {
						base: 'traffic',
						type: 'flowtile'
					}
				},
				carnavDayGrey: 'carnav.day.grey',
				hybridDay: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day'
					}
				},
				hybridDayMobile: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.mobile'
					}
				},
				pedestrianDay: 'pedestrian.day',
				pedestrianNight: 'pedestrian.night',
				satelliteDay: {
					options: {
						base: 'aerial',
						variant: 'satellite.day'
					}
				},
				terrainDay: {
					options: {
						base: 'aerial',
						variant: 'terrain.day'
					}
				},
				terrainDayMobile: {
					options: {
						base: 'aerial',
						variant: 'terrain.day.mobile'
					}
				}
			}
		},
		FreeMapSK: {
			url: 'http://t{s}.freemap.sk/T/{z}/{x}/{y}.jpeg',
			options: {
				minZoom: 8,
				maxZoom: 16,
				subdomains: '1234',
				bounds: [[47.204642, 15.996093], [49.830896, 22.576904]],
				attribution:
					'{attribution.OpenStreetMap}, vizualization CC-By-SA 2.0 <a href="http://freemap.sk">Freemap.sk</a>'
			}
		},
		MtbMap: {
			url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
			options: {
				attribution:
					'{attribution.OpenStreetMap} &amp; USGS'
			}
		},
		CartoDB: {
			url: 'http://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}.png',
			options: {
				attribution: '{attribution.OpenStreetMap} &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
				subdomains: 'abcd',
				maxZoom: 19,
				variant: 'light_all'
			},
			variants: {
				Positron: 'light_all',
				PositronNoLabels: 'light_nolabels',
				PositronOnlyLabels: 'light_only_labels',
				DarkMatter: 'dark_all',
				DarkMatterNoLabels: 'dark_nolabels',
				DarkMatterOnlyLabels: 'dark_only_labels'
			}
		},
		HikeBike: {
			url: 'http://{s}.tiles.wmflabs.org/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: '{attribution.OpenStreetMap}',
				variant: 'hikebike'
			},
			variants: {
				HikeBike: {},
				HillShading: {
					options: {
						maxZoom: 15,
						variant: 'hillshading'
					}
				}
			}
		},
		BasemapAT: {
			url: '//maps{s}.wien.gv.at/basemap/{variant}/normal/google3857/{z}/{y}/{x}.{format}',
			options: {
				maxZoom: 19,
				attribution: 'Datenquelle: <a href="www.basemap.at">basemap.at</a>',
				subdomains: ['', '1', '2', '3', '4'],
				format: 'png',
				bounds: [[46.358770, 8.782379], [49.037872, 17.189532]],
				variant: 'geolandbasemap'
			},
			variants: {
				basemap: 'geolandbasemap',
				grau: 'bmapgrau',
				overlay: 'bmapoverlay',
				highdpi: {
					options: {
						variant: 'bmaphidpi',
						format: 'jpeg'
					}
				},
				orthofoto: {
					options: {
						variant: 'bmaporthofoto30cm',
						format: 'jpeg'
					}
				}
			}
		},
		NASAGIBS: {
			url: '//map1.vis.earthdata.nasa.gov/wmts-webmerc/{variant}/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
			options: {
				attribution:
					'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System ' +
					'(<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
				bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
				minZoom: 1,
				maxZoom: 9,
				format: 'jpg',
				time: '',
				tilematrixset: 'GoogleMapsCompatible_Level'
			},
			variants: {
				ModisTerraTrueColorCR: 'MODIS_Terra_CorrectedReflectance_TrueColor',
				ModisTerraBands367CR: 'MODIS_Terra_CorrectedReflectance_Bands367',
				ViirsEarthAtNight2012: {
					options: {
						variant: 'VIIRS_CityLights_2012',
						maxZoom: 8
					}
				},
				ModisTerraLSTDay: {
					options: {
						variant: 'MODIS_Terra_Land_Surface_Temp_Day',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				},
				ModisTerraSnowCover: {
					options: {
						variant: 'MODIS_Terra_Snow_Cover',
						format: 'png',
						maxZoom: 8,
						opacity: 0.75
					}
				},
				ModisTerraAOD: {
					options: {
						variant: 'MODIS_Terra_Aerosol',
						format: 'png',
						maxZoom: 6,
						opacity: 0.75
					}
				},
				ModisTerraChlorophyll: {
					options: {
						variant: 'MODIS_Terra_Chlorophyll_A',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				}
			}
		},
		NLS: {
			// NLS maps are copyright National library of Scotland.
			// http://maps.nls.uk/projects/api/index.html
			// Please contact NLS for anything other than non-commercial low volume usage
			//
			// Map sources: Ordnance Survey 1:1m to 1:63K, 1920s-1940s
			//   z0-9  - 1:1m
			//  z10-11 - quarter inch (1:253440)
			//  z12-18 - one inch (1:63360)
			url: '//nls-{s}.tileserver.com/nls/{z}/{x}/{y}.jpg',
			options: {
				attribution: '<a href="http://geo.nls.uk/maps/">National Library of Scotland Historic Maps</a>',
				bounds: [[49.6, -12], [61.7, 3]],
				minZoom: 1,
				maxZoom: 18,
				subdomains: '0123',
			}
		}
	};

	L.tileLayer.provider = function (provider, options) {
		return new L.TileLayer.Provider(provider, options);
	};

	return L;
}));

/*
 * Leaflet.curve v0.1.0 - a plugin for Leaflet mapping library. https://github.com/elfalem/Leaflet.curve
 * (c) elfalem 2015
 */
/*
 * note that SVG (x, y) corresponds to (long, lat)
 */

L.Curve = L.Path.extend({
	options: {
	},
	
	initialize: function(path, options){
		L.setOptions(this, options);
		this._setPath(path);
	},
	
	getPath: function(){
		return this._coords;
	},
	
	setPath: function(path){
		this._setPath(path);
		return this.redraw();
	},
	
	getBounds: function() {
		return this._bounds;
	},

	_setPath: function(path){
		this._coords = path;
		this._bounds = this._computeBounds();
	},
	
	_computeBounds: function(){
		var bound = new L.LatLngBounds();
		var lastPoint;
		var lastCommand;
		var coord;
		for(var i = 0; i < this._coords.length; i++){
			coord = this._coords[i];
			if(typeof coord == 'string' || coord instanceof String){
				lastCommand = coord;
			}else if(lastCommand == 'H'){
				bound.extend([lastPoint.lat,coord[0]]);
				lastPoint = new L.latLng(lastPoint.lat,coord[0]);
			}else if(lastCommand == 'V'){
				bound.extend([coord[0], lastPoint.lng]);
				lastPoint = new L.latLng(coord[0], lastPoint.lng);
			}else if(lastCommand == 'C'){
				var controlPoint1 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var controlPoint2 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				bound.extend(controlPoint1);
				bound.extend(controlPoint2);
				bound.extend(endPoint);

				endPoint.controlPoint1 = controlPoint1;
				endPoint.controlPoint2 = controlPoint2;
				lastPoint = endPoint;
			}else if(lastCommand == 'S'){
				var controlPoint2 = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				var controlPoint1 = lastPoint;
				if(lastPoint.controlPoint2){
					var diffLat = lastPoint.lat - lastPoint.controlPoint2.lat;
					var diffLng = lastPoint.lng - lastPoint.controlPoint2.lng;
					controlPoint1 = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
				}

				bound.extend(controlPoint1);
				bound.extend(controlPoint2);
				bound.extend(endPoint);

				endPoint.controlPoint1 = controlPoint1;
				endPoint.controlPoint2 = controlPoint2;
				lastPoint = endPoint;
			}else if(lastCommand == 'Q'){
				var controlPoint = new L.latLng(coord[0], coord[1]);
				coord = this._coords[++i];
				var endPoint = new L.latLng(coord[0], coord[1]);

				bound.extend(controlPoint);
				bound.extend(endPoint);

				endPoint.controlPoint = controlPoint;
				lastPoint = endPoint;
			}else if(lastCommand == 'T'){
				var endPoint = new L.latLng(coord[0], coord[1]);

				var controlPoint = lastPoint;
				if(lastPoint.controlPoint){
					var diffLat = lastPoint.lat - lastPoint.controlPoint.lat;
					var diffLng = lastPoint.lng - lastPoint.controlPoint.lng;
					controlPoint = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
				}

				bound.extend(controlPoint);
				bound.extend(endPoint);

				endPoint.controlPoint = controlPoint;
				lastPoint = endPoint;
			}else{
				bound.extend(coord);
				lastPoint = new L.latLng(coord[0], coord[1]);
			}
		}
		return bound;
	},
	
	//TODO: use a centroid algorithm instead
	getCenter: function () {
		return this._bounds.getCenter();
	},
	
	_update: function(){
		if (!this._map) { return; }
		
		this._updatePath();
	},
	
	_updatePath: function() {
		this._renderer._updatecurve(this);
	},
        
        // Stuff copied from PolylineOffset
	translatePoint: function(pt, dist, radians) {
            return L.point(pt.x + dist * Math.cos(radians), pt.y + dist * Math.sin(radians));
        },

        offsetPointLine: function(points, distance) {
            var l = points.length;
            if (l < 2) {
            throw new Error('Line should be defined by at least 2 points');
            }

            var a = points[0], b;
            var offsetAngle, segmentAngle;
            var offsetSegments = [];

            for(var i=1; i < l; i++) {
            b = points[i];
            // angle in (-PI, PI]
            segmentAngle = Math.atan2(a.y - b.y, a.x - b.x);
            // angle in (-1.5 * PI, PI/2]
            offsetAngle = segmentAngle - Math.PI/2;

            // store offset point and other information to avoid recomputing it later
            offsetSegments.push({
                angle: segmentAngle,
                offsetAngle: offsetAngle,
                distance: distance,
                original: [a, b],
                offset: [
                this.translatePoint(a, distance, offsetAngle),
                this.translatePoint(b, distance, offsetAngle)
                ]
            });
            a = b;
            }

            return offsetSegments;
        },

        latLngsToPoints: function(ll, map) {
            var pts = [];
            for(var i=0, l=ll.length; i<l; i++) {
            pts[i] = map.project(ll[i]);
            }
            return pts;
        },

        pointsToLatLngs: function(pts, map) {
            var ll = [];
            for(var i=0, l=pts.length; i<l; i++) {
            ll[i] = map.unproject(pts[i]);
            }
            return ll;
        },

        offsetLatLngs: function(ll, offset, map) {
            var offsetPoints = this.offsetLatLngsToPoints(ll, offset, map);
            return this.pointsToLatLngs(offsetPoints, map);
        },

        offsetLatLngsToPoints: function(ll, offset, map) {
            var origPoints = this.latLngsToPoints(ll, map);
            return this.offsetPoints(origPoints, offset);
        },

        offsetPoints: function(pts, offset) {
            var offsetSegments = this.offsetPointLine(pts, offset);
            return this.joinLineSegments(offsetSegments, offset, 'round');
        },

        /**
        Return the intersection point of two lines defined by two points each
        Return null when there's no unique intersection
        */
        intersection: function(l1a, l1b, l2a, l2b) {
            var line1 = this.lineEquation(l1a, l1b),
                line2 = this.lineEquation(l2a, l2b);

            if (line1 == null || line2 == null) {
            return null;
            }

            if(line1.hasOwnProperty('x')) {
            if(line2.hasOwnProperty('x')) {
                return null;
            }
            return L.point(line1.x, line2.a * line1.x + line2.b);
            }
            if(line2.hasOwnProperty('x')) {
            return L.point(line2.x, line1.a * line2.x + line1.b);
            }

            if (line1.a == line2.a) {
            return null;
            }

            var x = (line2.b - line1.b) / (line1.a - line2.a),
                y = line1.a * x + line1.b;

            return L.point(x, y);
        },

        /**
        Find the coefficients (a,b) of a line of equation y = a.x + b,
        or the constant x for vertical lines
        Return null if there's no equation possible
        */
        lineEquation: function(pt1, pt2) {
            if (pt1.x != pt2.x) {
            var a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
            return {
                a: a,
                b: pt1.y - a * pt1.x
            };
            }

            if (pt1.y != pt2.y) {
            return { x: pt1.x };
            }

            return null;
        },

        /**
        Join 2 line segments defined by 2 points each,
        with a specified methodnormalizeAngle( (default : intersection);
        */
        joinSegments: function(s1, s2, offset, joinStyle) {
            var jointPoints = [];
            switch(joinStyle) {
            case 'round':
                jointPoints = this.circularArc(s1, s2, offset);
                break;
            case 'cut':
                jointPoints = [
                this.intersection(s1.offset[0], s1.offset[1], s2.original[0], s2.original[1]),
                this.intersection(s1.original[0], s1.original[1], s2.offset[0], s2.offset[1])
                ];
                break;
            case 'straight':
                jointPoints = [s1.offset[1], s2.offset[0]];
                break;
            case 'intersection':
            default:
                jointPoints = [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
            }
            // filter out null-results
            return jointPoints.filter(function(v) {return v;});
        },

        joinLineSegments: function(segments, offset, joinStyle) {
            var l = segments.length;
            var joinedPoints = [];
            var s1 = segments[0], s2 = segments[0];
            joinedPoints.push(s1.offset[0]);

            for(var i=1; i<l; i++) {
            s2 = segments[i];
            joinedPoints = joinedPoints.concat(this.joinSegments(s1, s2, offset, joinStyle));
            s1 = s2;
            }
            joinedPoints.push(s2.offset[1]);

            return joinedPoints;
        },

        /**
        Interpolates points between two offset segments in a circular form
        */
        circularArc: function(s1, s2, distance) {
            if (s1.angle == s2.angle)
            return [s1.offset[1]];

            var center = s1.original[1];
            var points = [];

            if (distance < 0) {
            var startAngle = s1.offsetAngle;
            var endAngle = s2.offsetAngle;
            } else {
            // switch start and end angle when going right
            var startAngle = s2.offsetAngle;
            var endAngle = s1.offsetAngle;
            }

            if (endAngle < startAngle) {
            endAngle += Math.PI * 2; // the end angle should be bigger than the start angle
            }

            if (endAngle > startAngle + Math.PI) {
            return [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
            }

            // Step is distance dependent. Bigger distance results in more steps to take
            var step = Math.abs(8/distance);
            for (var a = startAngle; a < endAngle; a += step) {
            points.push(this.translatePoint(center, distance, a));
            }
            points.push(this.translatePoint(center, distance, endAngle));

            if (distance > 0) {
            // reverse all points again when going right
            points.reverse();
            }

            return points;
        },

	_project: function() {
		var coord, lastCoord, curCommand, curPoint, prevPoint;

		this._points = [];
                
                // Hack added by Jason for offsetting
                var first_actual_coord = this._coords[1];
                var last_actual_coord = this._coords[this._coords.length - 1];
                var start_point = this._map.latLngToLayerPoint([first_actual_coord[0], first_actual_coord[1]]);
                var end_point = this._map.latLngToLayerPoint([last_actual_coord[0], last_actual_coord[1]]);
                var angle = Math.atan2(end_point.x - start_point.x, end_point.y - start_point.y);
                angle = angle + (Math.PI / 2.0);
                var x_offset = Math.sin(angle) * this.options.offset;
                var y_offset = Math.cos(angle) * this.options.offset;
		
		for(var i = 0; i < this._coords.length; i++){
			coord = this._coords[i];
			if(typeof coord == 'string' || coord instanceof String){
				this._points.push(coord);
				curCommand = coord;
			}else {
				switch(coord.length){
					case 2:
						curPoint = this._map.latLngToLayerPoint(coord);
						lastCoord = coord;
					break;
					case 1:
						if(curCommand == 'H'){
							curPoint = this._map.latLngToLayerPoint([lastCoord[0], coord[0]]);
							lastCoord = [lastCoord[0], coord[0]];
						}else{
							curPoint = this._map.latLngToLayerPoint([coord[0], lastCoord[1]]);
							lastCoord = [coord[0], lastCoord[1]];
						}
					break;
				}
				
				
				this._points.push(L.point([curPoint.x+x_offset, curPoint.y+y_offset]));
			}
		}
		
	}
});

L.curve = function (path, options){
	return new L.Curve(path, options);
};

L.SVG.include({
	_updatecurve: function(layer){
		this._setPath(layer, this._curvePointsToPath(layer._points));
    	},
 	_curvePointsToPath: function(points){
		var point, curCommand, str = '';
		for(var i = 0; i < points.length; i++){
			point = points[i];
			if(typeof point == 'string' || point instanceof String){
				curCommand = point;
				str += curCommand;
			}else{
				switch(curCommand){
					case 'H':
						str += point.x + ' ';
						break;
					case 'V':
						str += point.y + ' ';
						break;
					default:
						str += point.x + ',' + point.y + ' ';
						break;
				}
			}
		}
		return str || 'M0 0';
	}
});

/*
	Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.label
	http://leafletjs.com
	https://github.com/jacobtoye
*/
(function(t){var e=t.L;e.labelVersion="0.2.2-dev",e.Label=(e.Layer?e.Layer:e.Class).extend({includes:e.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,i){e.setOptions(this,t),this._source=i,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this.options.pane?t._panes[this.options.pane]:this._source instanceof e.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),e.Browser.touch&&!this.options.noHide&&(e.DomEvent.on(this._container,"click",this.close,this),t.on("click",this.close,this))},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=e.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(e.Browser.touch&&!this.options.noHide&&(e.DomEvent.off(this._container,"click",this.close),t.off("click",this.close,this)),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&e.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=e.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),s=i.layerPointToContainerPoint(t),a=this.options.direction,l=this._labelWidth,h=e.point(this.options.offset);"right"===a||"auto"===a&&s.x<o.x?(e.DomUtil.addClass(n,"leaflet-label-right"),e.DomUtil.removeClass(n,"leaflet-label-left"),t=t.add(h)):(e.DomUtil.addClass(n,"leaflet-label-left"),e.DomUtil.removeClass(n,"leaflet-label-right"),t=t.add(e.point(-h.x-l,h.y))),e.DomUtil.setPosition(n,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(t,"leaflet-clickable"),e.DomEvent.on(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.on(t,i[n],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.removeClass(t,"leaflet-clickable"),e.DomEvent.off(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.off(t,i[n],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&e.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&e.DomEvent.preventDefault(t),"mousedown"!==t.type?e.DomEvent.stopPropagation(t):e.DomEvent.preventDefault(t)}}),e.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,i){var n=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,o=e.point(n)||e.point(0,0);return o=o.add(e.Label.prototype.options.offset),i&&i.offset&&(o=o.add(i.offset)),i=e.Util.extend({offset:o},i),this._labelNoHide=i.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new e.Label(i,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),e.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),e.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},e.Icon.Default.mergeOptions({labelAnchor:new e.Point(9,-20)}),e.Marker.mergeOptions({icon:new e.Icon.Default}),e.Marker.include(e.BaseMarkerMethods),e.Marker.include({_originalUpdateZIndex:e.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:e.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:e.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:e.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),e.CircleMarker.mergeOptions({labelAnchor:new e.Point(0,0)}),e.CircleMarker.include(e.BaseMarkerMethods),e.Path.include({bindLabel:function(t,i){return this.label&&this.label.options===i||(this.label=new e.Label(i,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),e.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),e.Map.include({showLabel:function(t){return this.addLayer(t)}}),e.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(window,document);
L.PolylineOffset = {
  translatePoint: function(pt, dist, radians) {
    return L.point(pt.x + dist * Math.cos(radians), pt.y + dist * Math.sin(radians));
  },

  offsetPointLine: function(points, distance) {
    var l = points.length;
    if (l < 2) {
      throw new Error('Line should be defined by at least 2 points');
    }

    var a = points[0], b;
    var offsetAngle, segmentAngle;
    var offsetSegments = [];

    for(var i=1; i < l; i++) {
      b = points[i];
      // angle in (-PI, PI]
      segmentAngle = Math.atan2(a.y - b.y, a.x - b.x);
      // angle in (-1.5 * PI, PI/2]
      offsetAngle = segmentAngle - Math.PI/2;

      // store offset point and other information to avoid recomputing it later
      offsetSegments.push({
        angle: segmentAngle,
        offsetAngle: offsetAngle,
        distance: distance,
        original: [a, b],
        offset: [
          this.translatePoint(a, distance, offsetAngle),
          this.translatePoint(b, distance, offsetAngle)
        ]
      });
      a = b;
    }

    return offsetSegments;
  },

  latLngsToPoints: function(ll, map) {
    var pts = [];
    for(var i=0, l=ll.length; i<l; i++) {
      pts[i] = map.project(ll[i]);
    }
    return pts;
  },

  pointsToLatLngs: function(pts, map) {
    var ll = [];
    for(var i=0, l=pts.length; i<l; i++) {
      ll[i] = map.unproject(pts[i]);
    }
    return ll;
  },

  offsetLatLngs: function(ll, offset, map) {
    var offsetPoints = this.offsetLatLngsToPoints(ll, offset, map);
    return this.pointsToLatLngs(offsetPoints, map);
  },

  offsetLatLngsToPoints: function(ll, offset, map) {
    var origPoints = this.latLngsToPoints(ll, map);
    return this.offsetPoints(origPoints, offset);
  },

  offsetPoints: function(pts, offset) {
    var offsetSegments = this.offsetPointLine(pts, offset);
    return this.joinLineSegments(offsetSegments, offset, 'round');
  },

  /**
  Return the intersection point of two lines defined by two points each
  Return null when there's no unique intersection
  */
  intersection: function(l1a, l1b, l2a, l2b) {
    var line1 = this.lineEquation(l1a, l1b),
        line2 = this.lineEquation(l2a, l2b);

    if (line1 == null || line2 == null) {
      return null;
    }

    if(line1.hasOwnProperty('x')) {
      if(line2.hasOwnProperty('x')) {
        return null;
      }
      return L.point(line1.x, line2.a * line1.x + line2.b);
    }
    if(line2.hasOwnProperty('x')) {
      return L.point(line2.x, line1.a * line2.x + line1.b);
    }

    if (line1.a == line2.a) {
      return null;
    }

    var x = (line2.b - line1.b) / (line1.a - line2.a),
        y = line1.a * x + line1.b;

    return L.point(x, y);
  },

  /**
  Find the coefficients (a,b) of a line of equation y = a.x + b,
  or the constant x for vertical lines
  Return null if there's no equation possible
  */
  lineEquation: function(pt1, pt2) {
    if (pt1.x != pt2.x) {
      var a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
      return {
        a: a,
        b: pt1.y - a * pt1.x
      };
    }

    if (pt1.y != pt2.y) {
      return { x: pt1.x };
    }

    return null;
  },

  /**
  Join 2 line segments defined by 2 points each,
  with a specified methodnormalizeAngle( (default : intersection);
  */
  joinSegments: function(s1, s2, offset, joinStyle) {
    var jointPoints = [];
    switch(joinStyle) {
      case 'round':
        jointPoints = this.circularArc(s1, s2, offset);
        break;
      case 'cut':
        jointPoints = [
          this.intersection(s1.offset[0], s1.offset[1], s2.original[0], s2.original[1]),
          this.intersection(s1.original[0], s1.original[1], s2.offset[0], s2.offset[1])
        ];
        break;
      case 'straight':
        jointPoints = [s1.offset[1], s2.offset[0]];
        break;
      case 'intersection':
      default:
        jointPoints = [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }
    // filter out null-results
    return jointPoints.filter(function(v) {return v;});
  },

  joinLineSegments: function(segments, offset, joinStyle) {
    var l = segments.length;
    var joinedPoints = [];
    var s1 = segments[0], s2 = segments[0];
    joinedPoints.push(s1.offset[0]);

    for(var i=1; i<l; i++) {
      s2 = segments[i];
      joinedPoints = joinedPoints.concat(this.joinSegments(s1, s2, offset, joinStyle));
      s1 = s2;
    }
    joinedPoints.push(s2.offset[1]);

    return joinedPoints;
  },

  /**
  Interpolates points between two offset segments in a circular form
  */
  circularArc: function(s1, s2, distance) {
    if (s1.angle == s2.angle)
      return [s1.offset[1]];

    var center = s1.original[1];
    var points = [];

    if (distance < 0) {
      var startAngle = s1.offsetAngle;
      var endAngle = s2.offsetAngle;
    } else {
      // switch start and end angle when going right
      var startAngle = s2.offsetAngle;
      var endAngle = s1.offsetAngle;
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2; // the end angle should be bigger than the start angle
    }

    if (endAngle > startAngle + Math.PI) {
      return [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }

    // Step is distance dependent. Bigger distance results in more steps to take
    var step = Math.abs(8/distance);
    for (var a = startAngle; a < endAngle; a += step) {
      points.push(this.translatePoint(center, distance, a));
    }
    points.push(this.translatePoint(center, distance, endAngle));

    if (distance > 0) {
      // reverse all points again when going right
      points.reverse();
    }

    return points;
  }
}

// Modify the L.Polyline class by overwriting the projection function,
// to add offset related code
// Versions < 0.8
if(L.version.charAt(0) == '0' && parseInt(L.version.charAt(2)) < 8) {
  L.Polyline.include({
    projectLatlngs: function() {
      this._originalPoints = [];

      for (var i = 0, len = this._latlngs.length; i < len; i++) {
        this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
      }
      // Offset management hack ---
      if(this.options.offset) {
        this._originalPoints = L.PolylineOffset.offsetPoints(this._originalPoints, this.options.offset);
      }
      // Offset management hack END ---
    }
  });
} else {
// Versions >= 0.8
  L.Polyline.include({
    _projectLatlngs: function (latlngs, result, projectedBounds) {
      var flat = latlngs[0] instanceof L.LatLng,
          len = latlngs.length,
          i, ring;

      if (flat) {
        ring = [];
        for (i = 0; i < len; i++) {
          ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
          if (projectedBounds !== undefined) {
            projectedBounds.extend(ring[i]);
          }
        }
        // Offset management hack ---
        if(this.options.offset) {
          ring = L.PolylineOffset.offsetPoints(ring, this.options.offset);
        }
        // Offset management hack END ---
        result.push(ring);
      } else {
        for (i = 0; i < len; i++) {
          if (projectedBounds !== undefined) {
            this._projectLatlngs(latlngs[i], result, projectedBounds);
          } else {
            this._projectLatlngs(latlngs[i], result);
          }
        }
      }
    }
  });
}

L.Polyline.include({
  setOffset: function(offset) {
    this.options.offset = offset;
    this.redraw();
    return this;
  }
});

/*
	Leaflet.tooltip, an HTML tooltip for Leaflet.
	(c) 2013, Adam Ratcliffe, GeoSmart Maps Limited
*/
L.Tooltip=L.Class.extend({options:{width:"auto",minWidth:"",maxWidth:"",padding:"2px 4px",showDelay:500,hideDelay:500,mouseOffset:L.point(0,24),fadeAnimation:true,trackMouse:false},initialize:function(options){L.setOptions(this,options);this._createTip()},_createTip:function(){this._map=this.options.map;if(!this._map){throw new Error("No map configured for tooltip")}this._container=L.DomUtil.create("div","leaflet-tooltip");this._container.style.position="absolute";this._container.style.width=this._isNumeric(this.options.width)?this.options.width+"px":this.options.width;this._container.style.minWidth=this._isNumeric(this.options.minWidth)?this.options.minWidth+"px":this.options.minWidth;this._container.style.maxWidth=this._isNumeric(this.options.maxWidth)?this.options.maxWidth+"px":this.options.maxWidth;this._container.style.padding=this._isNumeric(this.options.padding)?this.options.padding+"px":this.options.padding;if(this.options.html){this.setHtml(this.options.html)}if(this.options.target){this.setTarget(this.options.target)}this._map._tooltipContainer.appendChild(this._container)},isVisible:function(){return this._showing},setTarget:function(target){if(target._icon){target=target._icon}else if(target._container){target=target._container}if(target===this._target){return}if(this._target){this._unbindTarget(this._target)}this._bindTarget(target);this._target=target},_bindTarget:function(target){L.DomEvent.on(target,"mouseover",this._onTargetMouseover,this).on(target,"mouseout",this._onTargetMouseout,this).on(target,"mousemove",this._onTargetMousemove,this)},_unbindTarget:function(target){L.DomEvent.off(target,"mouseover",this._onTargetMouseover,this).off(target,"mouseout",this._onTargetMouseout,this).off(target,"mousemove",this._onTargetMousemove,this)},setHtml:function(html){if(typeof html==="string"){this._container.innerHTML=html}else{while(this._container.hasChildNodes()){this._container.removeChild(this._container.firstChild)}this._container.appendChild(this._content)}this._sizeChanged=true},setPosition:function(point){var mapSize=this._map.getSize(),container=this._container,containerSize=this._getElementSize(this._container);point=point.add(this.options.mouseOffset);if(point.x+containerSize.x>mapSize.x){container.style.left="auto";container.style.right=mapSize.x-point.x+2*this.options.mouseOffset.x+"px"}else{container.style.left=point.x+"px";container.style.right="auto"}if(point.y+containerSize.y>mapSize.y){container.style.top="auto";container.style.bottom=mapSize.y-point.y+2*this.options.mouseOffset.y+"px"}else{container.style.top=point.y+"px";container.style.bottom="auto"}},remove:function(){this._container.parentNode.removeChild(this._container);delete this._container;if(this._target){this._unbindTarget(this._target)}},show:function(point,html){if(L.Tooltip.activeTip&&L.Tooltip.activeTip!=this){L.Tooltip.activeTip._hide()}L.Tooltip.activeTip=this;if(html){this.setHtml(html)}this.setPosition(point);if(this.options.showDelay){this._delay(this._show,this,this.options.showDelay)}else{this._show()}},_show:function(){this._container.style.display="inline-block";if(window.getComputedStyle){window.getComputedStyle(this._container).opacity}L.DomUtil.addClass(this._container,"leaflet-tooltip-fade");this._showing=true},hide:function(){if(this.options.hideDelay){this._delay(this._hide,this,this.options.hideDelay)}else{this._hide()}},_hide:function(){if(this._timeout){clearTimeout(this._timeout)}L.DomUtil.removeClass(this._container,"leaflet-tooltip-fade");this._container.style.display="none";this._showing=false;if(L.Tooltip.activeTip===this){delete L.Tooltip.activeTip}},_delay:function(func,scope,delay){var me=this;if(this._timeout){clearTimeout(this._timeout)}this._timeout=setTimeout(function(){func.call(scope);delete me._timeout},delay)},_isNumeric:function(val){return!isNaN(parseFloat(val))&&isFinite(val)},_getElementSize:function(el){var size=this._size;if(!size||this._sizeChanged){size={};el.style.left="-999999px";el.style.right="auto";el.style.display="inline-block";size.x=el.offsetWidth;size.y=el.offsetHeight;el.style.left="auto";el.style.display="none";this._sizeChanged=false}return size},_onTargetMouseover:function(e){var point=this._map.mouseEventToContainerPoint(e);this.show(point)},_onTargetMousemove:function(e){L.DomEvent.stopPropagation(e);if(this.options.trackMouse){var point=this._map.mouseEventToContainerPoint(e);this.setPosition(point)}},_onTargetMouseout:function(e){this.hide()}});L.Map.addInitHook(function(){this._tooltipContainer=L.DomUtil.create("div","leaflet-tooltip-container",this._container)});L.tooltip=function(options){return new L.Tooltip(options)};!function(){var originalOnAdd=L.Marker.prototype.onAdd,originalOnRemove=L.Marker.prototype.onRemove,originalSetIcon=L.Marker.prototype.setIcon;L.Marker.include({getTooltip:function(){return this._tooltip},onAdd:function(map){originalOnAdd.call(this,map);if(this.options.tooltip){this._tooltip=L.tooltip(L.extend(this.options.tooltip,{target:this,map:map}))}},onRemove:function(map){if(this._tooltip){this._tooltip.remove()}originalOnRemove.call(this,map)},setIcon:function(icon){originalSetIcon.call(this,icon);if(this._tooltip){this._tooltip.setTarget(this._icon)}}})}();
 /**
   * BezierSpline
   * https://github.com/leszekr/bezier-spline-js
   *
   * @copyright
   * Copyright (c) 2013 Leszek Rybicki
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  /*
  Usage:

    var spline = new Spline({
      points: array_of_control_points,
      duration: time_in_miliseconds,
      sharpness: how_curvy,
      stepLength: distance_between_points_to_cache
    });

  */
var BezierSpline = function(options){
    this.points = options.points || [];
    this.duration = options.duration || 10000;
    this.sharpness = options.sharpness || 0.85;
    this.centers = [];
    this.controls = [];
    this.stepLength = options.stepLength || 60;
    this.length = this.points.length;
    this.delay = 0;
    // this is to ensure compatibility with the 2d version
    for(var i=0; i<this.length; i++) this.points[i].z = this.points[i].z || 0;
    for(var i=0; i<this.length-1; i++){
      var p1 = this.points[i];
      var p2 = this.points[i+1];
      this.centers.push({x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2, z:(p1.z+p2.z)/2});
    }
    this.controls.push([this.points[0],this.points[0]]);
    for(var i=0; i<this.centers.length-1; i++){
      var p1 = this.centers[i];
      var p2 = this.centers[i+1];
      var dx = this.points[i+1].x-(this.centers[i].x+this.centers[i+1].x)/2;
      var dy = this.points[i+1].y-(this.centers[i].y+this.centers[i+1].y)/2;
      var dz = this.points[i+1].z-(this.centers[i].y+this.centers[i+1].z)/2;
      this.controls.push([{
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i].z+dz)},
      {
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i+1].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i+1].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i+1].z+dz)}]);
    }
    this.controls.push([this.points[this.length-1],this.points[this.length-1]]);
    this.steps = this.cacheSteps(this.stepLength);
    return this;
  };

  /*
    Caches an array of equidistant (more or less) points on the curve.
  */
  BezierSpline.prototype.cacheSteps = function(mindist){
    var steps = [];
    var laststep = this.pos(0);
    steps.push(0);
    for(var t=0; t<this.duration; t+=10){
      var step = this.pos(t);
      var dist = Math.sqrt((step.x-laststep.x)*(step.x-laststep.x)+(step.y-laststep.y)*(step.y-laststep.y)+(step.z-laststep.z)*(step.z-laststep.z));
      if(dist>mindist){
        steps.push(t);
        laststep = step;
      }
    }
    return steps;
  };

  /*
    returns angle and speed in the given point in the curve
  */
  BezierSpline.prototype.vector = function(t){
    var p1 = this.pos(t+10);
    var p2 = this.pos(t-10);
    return {
      angle:180*Math.atan2(p1.y-p2.y, p1.x-p2.x)/3.14,
      speed:Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z))
    };
  };

  /*
    Gets the position of the point, given time.

    WARNING: The speed is not constant. The time it takes between control points is constant.

    For constant speed, use Spline.steps[i];
  */
  BezierSpline.prototype.pos = function(time){

    function bezier(t, p1, c1, c2, p2){
      var B = function(t) {
        var t2=t*t, t3=t2*t;
        return [(t3),(3*t2*(1-t)),(3*t*(1-t)*(1-t)),((1-t)*(1-t)*(1-t))]
      }
      var b = B(t)
      var pos = {
        x : p2.x * b[0] + c2.x * b[1] +c1.x * b[2] + p1.x * b[3],
        y : p2.y * b[0] + c2.y * b[1] +c1.y * b[2] + p1.y * b[3],
        z : p2.z * b[0] + c2.z * b[1] +c1.z * b[2] + p1.z * b[3]
      }
      return pos;
    }
    var t = time-this.delay;
    if(t<0) t=0;
    if(t>this.duration) t=this.duration-1;
    //t = t-this.delay;
    var t2 = (t)/this.duration;
    if(t2>=1) return this.points[this.length-1];

    var n = Math.floor((this.points.length-1)*t2);
    var t1 = (this.length-1)*t2-n;
    return bezier(t1,this.points[n],this.controls[n][1],this.controls[n+1][0],this.points[n+1]);
  }


function calculate_ridership(latlng) {

    var total_ridership = 0;

    // New method: Voxels

    var voxel_i = Math.round((latlng.lat - LAT_MIN)/VOXELS_RES_LAT);
    var voxel_j = Math.round((latlng.lng - LNG_MIN)/VOXELS_RES_LNG);

    total_ridership += demand[voxel_i][voxel_j+2];

    total_ridership += demand[voxel_i+1][voxel_j+1];
    total_ridership += demand[voxel_i][voxel_j+1];
    total_ridership += demand[voxel_i-1][voxel_j+1];

    total_ridership += demand[voxel_i+2][voxel_j];
    total_ridership += demand[voxel_i+1][voxel_j];
    total_ridership += demand[voxel_i][voxel_j];
    total_ridership += demand[voxel_i-1][voxel_j];
    total_ridership += demand[voxel_i-2][voxel_j];

    total_ridership += demand[voxel_i+1][voxel_j-1];
    total_ridership += demand[voxel_i][voxel_j-1];
    total_ridership += demand[voxel_i-1][voxel_j-1];

    total_ridership += demand[voxel_i][voxel_j-2];

    return total_ridership;
    
}

function calculate_total_ridership() {
    var r = 0;
    for (var i = 0; i < N_stations.length; i++) {
        if (N_stations[i].active)
            r += N_stations[i].riders;
    }
    
    var rs = r * 1.69375;
    var riders_millions = rs / 1000000.0;
    
    $('#system-ridership').text(Number(riders_millions).toFixed(2).toString() + " million");

    var mc_cost = number_of_active_stations()*19859.5063025/r;
    $('#metrocard-cost').text("$"+Number(mc_cost).toFixed(2).toString());
    
    var rating = 41.4634146341 * riders_millions / mc_cost;
    var letter_grade = '';
    
    if (rating >= 97) {
        letter_grade = 'A+';
    } else if (rating >= 93) {
        letter_grade = 'A';
    } else if (rating >= 90) {
        letter_grade = 'A-';
    } else if (rating >= 87) {
        letter_grade = 'B+';
    } else if (rating >= 83) {
        letter_grade = 'B';
    } else if (rating >= 80) {
        letter_grade = 'B-';
    } else if (rating >= 77) {
        letter_grade = 'C+';
    } else if (rating >= 73) {
        letter_grade = 'C';
    } else if (rating >= 70) {
        letter_grade = 'C-';
    } else if (rating >= 67) {
        letter_grade = 'D+';
    } else if (rating >= 63) {
        letter_grade = 'D';
    } else if (rating >= 60) {
        letter_grade = 'D-';
    } else {
        letter_grade = 'F';
    }
    $('#system-rating').text(letter_grade);

    
    //$('#system-rating').text(Number(rating).toFixed(2).toString());
    
}
function handle_files(files) {
    if (!files.length) {
        console.log("No files selected");
    } else {
        console.log(files);
    }

    var f = files[0];

    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            // Render thumbnail.
            var data = JSON.parse(e.target.result);
            load_game_json(data);
        };
    })(f);

    // Read in the image file as a data URL.
    var d = reader.readAsText(f);

}

function handle_server_file(file) {
    $.getJSON(file, function(data) {
        load_game_json(data);
    });
}

function load_game_json(data) {
    initialize_game_state();

    for (var j = 0; j < data["lines"].length; j++) {
        var d = data["lines"][j];
        N_lines[d["id"]].stations = d["stations"];
        N_lines[d["id"]].draw_map = d["draw_map"];
    }

    for (var i = 0; i < data["stations"].length; i++) {
        var d = data["stations"][i];

        var station = new Station(d["lat"], d["lng"], d["name"], d["info"], d["riders"]);
        station.lines = d["lines"];
        //station.drawmaps = d["drawmaps"];
        N_stations[station.id] = station;

        if (!d["active"]) {
            N_stations[station.id].del();
        }

        station.generate_popup();
    }

    // Correct line array in each station in case of corrupted save game
    for (var i = 0; i < N_stations.length; i++) {
        N_stations[i].lines = [];
    }
    for (var j = 0; j < N_lines.length; j++) {
        var line_stations  = N_lines[j].stations;
        for (var k = 0; k < line_stations.length; k++) {
            N_stations[line_stations[k]].lines.push(N_lines[j].id);
        }
    }

    for (var k = 0; k < N_lines.length; k++) {
        N_lines[k].generate_draw_map();
        N_lines[k].generate_control_points();
    }
    for (var k = 0; k < N_lines.length; k++) {
        N_lines[k].draw();
    }

    for (var q = 0; q < data["transfers"].length; q++) {
        var d = data["transfers"][q];
        var t = new Transfer(d["s"], d["e"]);
        t.draw();
        N_transfers.push(t);
    }


    station_layer.bringToFront();

    generate_route_diagram(N_active_line);
    calculate_total_ridership();
}

function save_game_json() {
    var json = {"lines": [], "stations": [], "transfers": []}

    for (var i = 0; i < N_lines.length; i++) {
        json["lines"].push(N_lines[i].to_json());
    }

    for (i = 0; i < N_stations.length; i++) {
        json["stations"].push(N_stations[i].to_json());
    }

    for (i = 0; i < N_transfers.length; i++) {
        json["transfers"].push(N_transfers[i].to_json());
    }

    $("<a />", {
        "download": "bns_saved_game.json",
        "href" : "data:application/json," + encodeURIComponent(JSON.stringify(json))
    }).appendTo("body")
    .click(function() {
        $(this).remove()
    })[0].click()
}
class Geocoder {
    constructor (latlng) {

        this.latlng = latlng;
        this.name = '';
        this.info = '';
        this.done = false;

    }

    geocode(line) {

        var geo = this;

        geocode_service.reverse().distance(500).latlng(this.latlng).run(function(error, result) {
            geo.name = '';
            geo.info = '';

            var geocode_success = true;
            if (error) {
                console.log(error);
                geocode_success = false;
            } else {
                var geocoded_name = result.address.Address;
                if (geocoded_name == null) {
                    geocoded_name = "";
                }

                var city = result.address.City;
                geo.name = clean_address(geocoded_name);

                if (city != "New York") {
                    geo.name = clean_city(city) + ' - ' + geo.name;
                    geo.info += clean_city(city);
                }
            }

            var enc_boroughs = [];
            var enc_neighborhoods = [];

            var enc_landmarks = [];
            var neighborhood_in_station_name = false;

            var neighborhood_layer = leafletPip.pointInLayer([geo.latlng.lng, geo.latlng.lat], neighborhoods, true);
            if (neighborhood_layer.length > 0) {
                enc_boroughs.push(neighborhood_layer[0].feature.properties.borough);
                enc_neighborhoods.push(neighborhood_layer[0].feature.properties.neighborhood);
            }

            if (enc_neighborhoods.length > 0) {
                var enc_borough = enc_boroughs[0];
                var enc_neighborhood = enc_neighborhoods[0];

                if (enc_borough != "Manhattan" && geo.name.match(/\d/g)) {
                    geo.name = enc_neighborhood + ' - ' + geo.name;
                    neighborhood_in_station_name = true;
                }

                for (var i = 0; i < enc_neighborhoods.length; i++) {
                    if ((ENC_NEIGHBORHOODS_ALWAYS_LABEL.indexOf(enc_neighborhoods[i]) != -1) && !neighborhood_in_station_name) {
                        geo.name = enc_neighborhoods[i] + ' - ' + geo.name;
                        neighborhood_in_station_name = true;
                    }
                    if ((ENC_NEIGHBORHOODS_ONLY_LABEL.indexOf(enc_neighborhoods[i]) != -1) && !neighborhood_in_station_name) {
                        geo.name = enc_neighborhoods[i];
                        neighborhood_in_station_name = true;
                    }
                }

                if (!geocode_success) {
                    geo.name = enc_neighborhood;
                }
                geo.info += enc_borough;
                geo.info += '<br />';
                geo.info += enc_neighborhood;
            }
            var landmark_layer = leafletPip.pointInLayer([geo.latlng.lng, geo.latlng.lat], landmarks, true);
            if (landmark_layer.length > 0) {
                enc_landmarks.push(landmark_layer[0].feature.properties.name);
            }
            if (enc_landmarks.length > 0) {
                geo.name = geo.name + ' - ' + enc_landmarks[0];
                if (ENC_LANDMARKS_ONLY_LABEL.indexOf(enc_landmarks[0]) != -1) {
                    geo.name = enc_landmarks[0];
                }
            }

            geocode_to_station(geo, line)
        });
    }
}

var geocode_service = L.esri.Geocoding.geocodeService();

function clean_address(addr) {
    addr = addr.replace(/(\d*-?\d*)\s/g, " ").trim().replace(/^[NWES]\s/g, "");
    addr = addr.replace("Plz", "Plaza");
    addr = addr.trim();
    return addr;
}

function clean_city(city) {
    city = city.replace(" Town of", "");
    city = city.replace(" Twp", "");
    city = city.trim();
    return city;
}
class IdGenerator {
    constructor () {
        this.currentId = 0;
    }

    generate() {
        var givenId = this.currentId;
        this.currentId += 1;
        return givenId;
    }
    
    reset() {
        this.currentId = 0;
    }
    
}

var station_id_generator = new IdGenerator();
var line_id_generator = new IdGenerator();
class Line {
    constructor(name, html, css, color_bg, color_text) {
        this.name = name;
        this.html = html;
        this.css = css;
        this.color_bg = color_bg;
        this.color_text = color_text;
        this.branch = false;

        this.stations = [];
        this.draw_map = [];
        this.tracks = [];
        this.control_points = [];

        this.id = line_id_generator.generate();
    }

    to_json() {
        var json = {
            "name": this.name,
            "html": this.html,
            "css": this.css,
            "color_bg": this.color_bg,
            "color_text": this.color_text,
            "stations": this.stations,
            "draw_map": this.draw_map,
            "id": this.id
        };
        return json;
    }

    has_station(station_id) {
        if (is_in_array(station_id, this.stations)) {
            return true;
        } else {
            return false;
        }
    }

    insert_station(station_id) {

        var line_insertion_pos = 0;
        var line_insertion_best = -1;
        var line_length = this.stations.length;

        if (line_length > 0) {

            var clone = this.stations.slice(0);
            var line_insertion_best = -1;
            var line_insertion_pos = 0;

            for (var q = 0; q <= line_length; q++) {

                clone.splice(q, 0, station_id);

                // Compute total distance
                var total_distance = 0;
                for (var r = 1; r <= line_length; r++) {
                    var st_prev = N_stations[clone[r-1]].marker.getLatLng();
                    var st_next = N_stations[clone[r]].marker.getLatLng();
                    total_distance += Math.pow((Math.pow(st_prev.lat - st_next.lat, 2) + Math.pow(st_prev.lng - st_next.lng, 2)), 0.5);
                }
                if (total_distance < line_insertion_best || line_insertion_best == -1) {
                    line_insertion_pos = q;
                    line_insertion_best = total_distance;
                }
                clone = this.stations.slice(0);
            }
        }

        return this.insert_station_at_pos(station_id, line_insertion_pos);

    }

    insert_station_at_pos(station_id, line_insertion_pos) {

        this.stations.splice(line_insertion_pos, 0, station_id);

        // Add this line to the station's array of lines.
        if (!is_in_array(this.id, N_stations[station_id].lines)) {
            N_stations[station_id].lines.push(this.id);
        }

        // Generate impacted draw maps.
        for (var i = 0; i < N_stations[station_id].lines.length; i++) {
            //N_lines[N_stations[station_id].lines[i]].generate_draw_map();
        }

        return line_insertion_pos;
    }

    remove_station(station_id) {

        if (N_stations[station_id].lines.length == 1) {
            N_stations[station_id].del();
        } else {
            var station_pos = this.stations.indexOf(station_id);
            if (station_pos > -1) {
                this.stations.splice(station_pos, 1);
            }

            var line_pos = N_stations[station_id].lines.indexOf(this.id);
            if (line_pos > -1) {
                N_stations[station_id].lines.splice(line_pos, 1);
            }
        }

    }

    generate_draw_map() {

        // Reset the drawmap for the impacted line.
        this.draw_map = this.stations.slice(0);

        var draw_map_index = 0;

        // Iterate through all stations on this line.
        for (var i = 0; i < this.stations.length - 1; i++) {

            var shared_stretch_found = false;

            if (!is_in_array(this.stations[i], this.draw_map)) {
                this.draw_map.splice(draw_map_index, 0, this.stations[i]);
            }

            // Increment draw_map_index.
            draw_map_index += 1;

            var station_id = this.stations[i];
            var station = N_stations[station_id];


            // Only care if the station is on at least 2 lines.
            if (station.lines.length > 1) {

                // Traverse down each of the other lines and see if we find another station on the current line.
                for (var j = 0; j < station.lines.length; j++) {
                    var relevant_line_id = station.lines[j];
                    var relevant_line = N_lines[relevant_line_id];

                    // Only look at other lines -- not the current one.
                    if (relevant_line_id != this.id) {
                        var start_index = relevant_line.stations.indexOf(station_id);

                        // Check in both directions.
                        for (var dir = -1; dir < 2; dir += 2) {
                            if (dir > 0) {
                                var delta = Math.min(relevant_line.stations.length - 1, start_index + SHARED_STRETCH_THRESHOLD) - start_index;
                            } else {
                                var delta = start_index - Math.max(0, start_index - SHARED_STRETCH_THRESHOLD);
                            }

                            var station_buffer = [];
                            console.log(relevant_line.stations);

                            for (var k = start_index; (k >= (start_index - delta) && k <= (start_index + delta)); k += dir) {

                                station_buffer.push(relevant_line.stations[k]);

                                if (k == -1) {
                                    console.log("Debugme");
                                }

                                var station_is_shared_between_lines = is_in_array(this.id, N_stations[relevant_line.stations[k]].lines);
                                var station_is_close_enough_on_impacted_line = Math.abs(i - this.stations.indexOf(relevant_line.stations[k])) <= SHARED_STRETCH_THRESHOLD;
                                var different_stations = relevant_line.stations[k] != station_id;
                                var more_stations_on_relevant_line = Math.abs(k - start_index) > (this.stations.indexOf(relevant_line.stations[k]) - i);
                                var is_next_station_on_line = relevant_line.stations[k] == this.stations[i + 1];

                                if (station_is_shared_between_lines && station_is_close_enough_on_impacted_line && different_stations && more_stations_on_relevant_line && is_next_station_on_line) {

                                    // Shared stretch found!
                                    // Add all the stations to the drawmap, if not yet present.
                                    // Only allow this to happen once per station, to avoid Canal St N/Q/R bug...
                                    var draw_map_added = 0;

                                    if (!shared_stretch_found) {
                                        for (var m = 0; m < station_buffer.length; m++) {
                                            if (!is_in_array(station_buffer[m], this.draw_map)) {
                                                this.draw_map.splice(draw_map_index, 0, station_buffer[m]);
                                                draw_map_index += 1;
                                                draw_map_added += 1;
                                            }
                                        }
                                        if (draw_map_added > 0) {
                                            shared_stretch_found = true;
                                        }
                                    }

                                }
                            }
                        }


                    }
                }

            }
        }

    }

    generate_control_points () {
        if (USE_CURVED_TRACKS) {
            if (this.draw_map.length > 1) {
                var coordinates = []
                for (var i = 0; i < this.draw_map.length; i++) {
                    coordinates.push({"x": N_stations[this.draw_map[i]].marker.getLatLng().lng, "y": N_stations[this.draw_map[i]].marker.getLatLng().lat});
                }

                var turf_line = {
                    "type": "Feature",
                    "properties": {
                        "stroke": "#f00"
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coordinates
                    }
                };

                var spline = new BezierSpline({points: coordinates, sharpness: BEZIER_SHARPNESS});

                for (i = 1; i < this.draw_map.length; i++) {
                    var bezier_options = ['M', [N_stations[this.draw_map[i-1]].marker.getLatLng().lat, N_stations[this.draw_map[i-1]].marker.getLatLng().lng]];
                    this.control_points[i-1] = [[spline.controls[i-1][1].y, spline.controls[i-1][1].x], [spline.controls[i][0].y, spline.controls[i][0].x]];
                }
            }
        }
    }

    draw() {

        // Remove existing tracks.
        for (var i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            map.removeLayer(track);
        }

        // Clear tracks array.
        this.tracks = [];

        var curve_options = {"color": this.color_bg, "weight": TRACK_WIDTH, "fill": false, "smoothFactor": 1.0, "offset": 0, "clickable": false, "pointer-events": "none", "className": "no-hover"};

        if (USE_CURVED_TRACKS) {

            if (this.draw_map.length > 1) {

                for (i = 1; i < this.draw_map.length; i++) {

                    var bezier_options = ['M', [N_stations[this.draw_map[i-1]].marker.getLatLng().lat, N_stations[this.draw_map[i-1]].marker.getLatLng().lng]];

                    //this.control_points[i-1] = [[spline.controls[i-1][1].y, spline.controls[i-1][1].x], [spline.controls[i][0].y, spline.controls[i][0].x]];

                    var station_prev = N_stations[this.draw_map[i-1]];
                    var station_next = N_stations[this.draw_map[i]];
                    var station_drawmaps = station_prev.drawmaps();

                    // Get the number of colors in the tracks between these stations.
                    var common_tracks = sort_by_group(intersect(station_drawmaps, station_next.drawmaps()));
                    var unique_groups = lines_to_groups(common_tracks).sort();

                    var first_line = N_lines[common_tracks[0]];
                    var parity = first_line.draw_map.indexOf(this.draw_map[i]) > first_line.draw_map.indexOf(this.draw_map[i-1]);

                    var unique_group_index = 0;

                    // Get index of this line within the unique groups.
                    for (var j = 0; j < unique_groups.length; j++) {
                        if (is_in_array(this.id, N_line_groups[unique_groups[j]].lines)) {
                            unique_group_index = j;
                        }
                    }

                    // Offset the line accordingly.
                    var swap_control_points = false;
                    if (unique_groups.length > 1) {
                        var c = unique_group_index - (unique_groups.length - 1)/2.0;
                        if (parity) {
                            curve_options["offset"] = c*TRACK_OFFSET;
                        } else {
                            curve_options["offset"] = c*-1*TRACK_OFFSET;
                            swap_control_points = true;
                        }
                    } else {
                        curve_options["offset"] = 0.0;
                    }


                    var control_point_1 = 0.0;
                    var control_point_2 = 0.0;


                    if (station_drawmaps.length == 1) {
                        // No other lines impact this station.

                        control_point_1 = this.control_points[i-1][0];
                        control_point_2 = this.control_points[i-1][1]

                    } else {
                        // Iterate through this other station's drawmaps.
                        var control_points_to_average = [[this.control_points[i-1][0], this.control_points[i-1][1]]];

                        var station_ids_to_check = [N_stations[this.draw_map[i]].id];


                        if (station_next.id == 282 || station_prev.id == 282) {
                            var debugme = true;
                        }

                        for (var j = 0; j < station_drawmaps.length; j++) {
                            // Only consider different lines.
                            if (station_drawmaps[j] != this.id) {
                                var station_position_in_line = N_lines[station_drawmaps[j]].draw_map.indexOf(station_prev.id);

                                // If there's a "next" station to check...
                                if (station_position_in_line + 1 < N_lines[station_drawmaps[j]].draw_map.length) {
                                    if (is_in_array(N_lines[station_drawmaps[j]].draw_map[station_position_in_line + 1], station_ids_to_check)) {
                                        var cp_to_push = N_lines[station_drawmaps[j]].control_points[station_position_in_line];
                                        if (cp_to_push != null) {
                                            control_points_to_average.push(cp_to_push);
                                        }
                                    }
                                }

                                // If there's a "previous" station to check...
                                if (station_position_in_line - 1 >= 0) {
                                    if (is_in_array(N_lines[station_drawmaps[j]].draw_map[station_position_in_line - 1], station_ids_to_check)) {
                                        var cp_to_push = N_lines[station_drawmaps[j]].control_points[station_position_in_line - 1];
                                        if (cp_to_push != null) {
                                            cp_to_push = cp_to_push.slice(0).reverse();
                                            control_points_to_average.push(cp_to_push);
                                        }
                                    }
                                }

                            }
                        }
                        // Average the control points and push them
                        if (control_points_to_average.length > 1) {
                            var cpa = average_control_points(control_points_to_average);
                            control_point_1 = cpa[0];
                            control_point_2 = cpa[1];

                            /*if (swap_control_points) {
                                var control_point_save = control_point_2;
                                control_point_2 = control_point_1;
                                control_point_1 = control_point_save;
                            }*/

                        } else {
                            control_point_1 = this.control_points[i-1][0];
                            control_point_2 = this.control_points[i-1][1];
                        }



                    }

                    bezier_options.push('C');

                    bezier_options.push(control_point_1);
                    bezier_options.push(control_point_2);
                    bezier_options.push([N_stations[this.draw_map[i]].marker.getLatLng().lat, N_stations[this.draw_map[i]].marker.getLatLng().lng]);

                    // For testing control points
                    if (DEBUG_MODE) {
                        debug_layer.addLayer(L.circle([control_point_1[0], control_point_1[1]], 10, {stroke: false, color: 'blue', fillOpacity: 1.0}));
                        debug_layer.addLayer(L.circle([control_point_2[0], control_point_2[1]], 10, {stroke: false, color: 'red', fillOpacity: 1.0}));
                    }


                    var track = L.curve(bezier_options, curve_options);

                    //var track = L.polyline(latlngs, curve_options);
                    curve_layer.addLayer(track);
                    this.tracks.push(track);

                    // Adjust marker styles.
                    station_prev.set_marker_style();
                }


                // Adjust marker style for the station outside the loop.
                N_stations[this.draw_map[this.draw_map.length-1]].set_marker_style();

            }

        } else {

            for (i = 1; i < this.draw_map.length; i++) {

                var station_prev = N_stations[this.draw_map[i-1]];
                var station_next = N_stations[this.draw_map[i]];

                // Get the number of colors in the tracks between these stations.
                var common_tracks = sort_by_group(intersect(station_prev.drawmaps(), station_next.drawmaps()));
                var unique_groups = lines_to_groups(common_tracks).sort();

                var first_line = N_lines[common_tracks[0]];
                var parity = first_line.draw_map.indexOf(this.draw_map[i]) > first_line.draw_map.indexOf(this.draw_map[i-1]);

                var unique_group_index = 0;

                // Get index of this line within the unique groups.
                for (var j = 0; j < unique_groups.length; j++) {
                    if (is_in_array(this.id, N_line_groups[unique_groups[j]].lines)) {
                        unique_group_index = j;
                    }
                }

                // Offset the line accordingly.
                if (unique_groups.length > 1) {
                    var c = unique_group_index - (unique_groups.length - 1)/2.0;
                    if (parity) {
                        curve_options["offset"] = c*TRACK_OFFSET;
                    } else {
                        curve_options["offset"] = c*-1*TRACK_OFFSET;
                    }
                } else {
                    curve_options["offset"] = 0.0;
                }

                // Set the marker size based on number of tracks.
                if (lines_to_groups(station_prev.drawmaps()).length >= STATION_MARKER_LARGE_THRESHOLD || station_prev.lines.length > 8) {
                    station_prev.marker.setRadius(MARKER_RADIUS_LARGE);
                }

                var track = L.polyline([station_prev.marker.getLatLng(), station_next.marker.getLatLng()], curve_options);

                curve_layer.addLayer(track);
                this.tracks.push(track);

            }
        }

    }

}

class LineGroup {

    constructor(name, lines) {
        this.name = name;
        this.lines = lines;
    }

    add_line(line_id) {
        if (!is_in_array(line_id, this.lines)) {
            this.lines.push(line_id);
        }
    }

    remove_line(line_id) {
        if (is_in_array(line_id, this.lines)) {
            var line_id_index = this.lines.indexOf(line_id);
            this.lines.splice(line_id_index, 1);
        }
    }
}


function find_line_by_name(name) {

    // Loop through all lines, and return the 1st one that matches the name.
    for (var i = 0; i < N_lines.length; i++) {
        if (N_lines[i].name == name) {
            return N_lines[i];
        }
    }

    return null;
}

function find_line_by_html(html) {

    // Loop through all lines, and return the 1st one that matches the html.
    for (var i = 0; i < N_lines.length; i++) {
        if (N_lines[i].html == html) {
            return N_lines[i];
        }
    }

    return null;
}

function lines_to_groups(lines) {

    var groups = [];
    for (var i = 0; i < N_line_groups.length; i++) {
        var group = N_line_groups[i];
        for (var j = 0; j < lines.length; j++) {
            if (is_in_array(lines[j], group.lines) && !is_in_array(i, groups)) {
                groups.push(i);
            }
        }
    }
    return groups;
}

function generate_draw_map(impacted_lines) {

    // Iterate through all impacted lines.

    for (var i = 0; i < impacted_lines.length; i++) {
        var impacted_line_id = impacted_lines[i];
        var impacted_line = N_lines[impacted_line_id];

        // Reset the drawmap for the impacted line.
        // impacted_line.draw_map = impacted_line.stations.slice(0);

        var draw_map_index = 0;

        // Iterate through all stations on this line.
        for (var j = 0; j < impacted_line.stations.length - 1; j++) {


            if (!is_in_array(impacted_line.stations[j], impacted_line.draw_map)) {
                impacted_line.draw_map.splice(draw_map_index, 0, impacted_line.stations[j]);
            }


            // Increment draw_map_index.
            draw_map_index += 1;

            var station_id = impacted_line.stations[j];
            var station = N_stations[station_id];

            // Only care if the station is on at least 2 impacted lines.
            var relevant_lines = intersect(station.lines, impacted_lines);
            if (relevant_lines.length > 1) {

                // Traverse down each of the other relevant lines and see if we find another station on the current line.
                for (var k = 0; k < relevant_lines.length; k++) {
                    var relevant_line_id = relevant_lines[k];
                    var relevant_line = N_lines[relevant_line_id];

                    // Only look at other lines -- not the current one.
                    if (relevant_line_id != impacted_line_id) {
                        var start_index = relevant_line.stations.indexOf(station_id);
                        var end_index = Math.min(relevant_line.stations.length - 1, start_index + SHARED_STRETCH_THRESHOLD);
                        var station_buffer = [];

                        for (var l = start_index; l <= end_index; l++) {
                            station_buffer.push(relevant_line.stations[l]);

                            var station_is_shared_between_lines = is_in_array(impacted_line_id, N_stations[relevant_line.stations[l]].lines);
                            var station_is_close_enough_on_impacted_line = Math.abs(j - impacted_line.stations.indexOf(relevant_line.stations[l].id)) <= SHARED_STRETCH_THRESHOLD;
                            var different_stations = relevant_line.stations[l] != station_id;
                            var more_stations_on_relevant_line = (l - start_index) > (impacted_line.stations.indexOf(relevant_line.stations[l].id) - j);
                            var is_next_station_on_line = relevant_line.stations[l].id == impacted_line.stations[j+1].id;

                            if (station_is_shared_between_lines && station_is_close_enough_on_impacted_line && different_stations && more_stations_on_relevant_line && is_next_station_on_line) {

                                // Shared stretch found!
                                // Add all the stations to the drawmap, if not yet present.

                                if (impacted_line_id == 2) {
                                    var end_of_stretch_station = N_stations[relevant_line.stations[l]];
                                    var breakpoint = 0;
                                }

                                for (var m = 0; m < station_buffer.length; m++) {
                                    if (!is_in_array(station_buffer[m], impacted_line.draw_map)) {
                                        impacted_line.draw_map.splice(draw_map_index, 0, station_buffer[m]);
                                        draw_map_index += 1;
                                    }
                                }

                            }
                        }


                    }
                }

            }


        }

        // Add the last station, which we didn't consider for shared stretches.
        impacted_line.draw_map.splice(draw_map_index, 0, impacted_line.stations[impacted_line.stations.length - 1]);
    }

}

var N_lines;
var N_line_groups;
var N_active_line;
function create_station_marker(id, latlng_orig) {
    var station = L.circleMarker(latlng_orig, {color: "black", opacity: 1.0, fillColor: "white", fillOpacity: 1.0, zIndexOffset: 100}).setRadius(MARKER_RADIUS_DEFAULT);

    station.on('click', function(s_e) {

        // Disable new station creation.
        map.off('click', handle_map_click);

        if (transfer_state == 1) {

            transfer_end = id;
            transfer_state = 0;

            var different_stations = transfer_origin != transfer_end;
            var stations_exist = (N_stations[transfer_origin].active && N_stations[transfer_end]);
            if (different_stations && stations_exist) {
                var transfer = new Transfer(transfer_origin, transfer_end);
                transfer.draw();
                N_transfers.push(transfer);
            }
            generate_route_diagram(N_active_line);

        }

        // Wait a second before you can create a new station.
        setTimeout(function() {
            map.on('click', handle_map_click);
        }, 1000);
    });

    station_layer.addLayer(station);
    return station;
}

function handle_map_click(e) {

    var latlng = e.latlng;

    if (N_active_line != null) {

        var geo = new Geocoder(latlng);
        geo.geocode(N_active_line); // Pass the active line in case it changes. Contains a call back to create the station

    }

}

function delete_station_event(e) {

    var station_id = $(this).attr('id').replace('delete-', '');
    var station = N_stations[station_id];

    var impacted_lines = N_stations[station_id].drawmaps();
    var station_lines = impacted_lines;

    for (var i = 0; i < station_lines.length; i++) {
        var line_id = station_lines[i];
        var line = N_lines[line_id];

        var index = line.stations.indexOf(station_id);

        var start_index = Math.max(0, index - SHARED_STRETCH_THRESHOLD);
        var end_index = Math.min(index + SHARED_STRETCH_THRESHOLD, line.stations.length);

        // Add drawmaps of nearby stations
        for (var j = start_index; j < end_index; j++) {
            var drawmaps = N_stations[line.stations[j]].drawmaps();
            for (var k = 0; k < drawmaps.length; k++) {
                if (!is_in_array(drawmaps[k], impacted_lines)) {
                    impacted_lines.push(drawmaps[k]);
                }
            }
        }

    }

    N_stations[station_id].del();


    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].generate_draw_map();
        N_lines[impacted_lines[i]].generate_control_points();
    }
    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].draw();
    }

    station_layer.bringToFront();
    regenerate_popups();
    generate_route_diagram(N_active_line);
    calculate_total_ridership();

}

function remove_line_from_station_event(e) {

    var event_comps = $(this).attr('id').split(':');
    var station_id_to_remove = parseInt(event_comps[0]);
    var line_id_to_remove = parseInt(event_comps[1]);

    var impacted_lines = N_stations[station_id_to_remove].drawmaps();
    var station_lines = N_stations[station_id_to_remove].lines;

    for (var i = 0; i < station_lines.length; i++) {
        var line_id = station_lines[i];
        var line = N_lines[line_id];

        var new_index = line.stations.indexOf(station_id_to_remove);

        var start_index = Math.max(0, new_index - SHARED_STRETCH_THRESHOLD);
        var end_index = Math.min(new_index + SHARED_STRETCH_THRESHOLD, line.stations.length);

        // Add drawmaps of nearby stations
        for (var j = start_index; j < end_index; j++) {
            var drawmaps = N_stations[line.stations[j]].drawmaps();
            for (var k = 0; k < drawmaps.length; k++) {
                if (!is_in_array(drawmaps[k], impacted_lines))
                    impacted_lines.push(drawmaps[k]);
            }
        }

    }

    N_lines[line_id_to_remove].remove_station(station_id_to_remove);

    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].generate_draw_map();
        N_lines[impacted_lines[i]].generate_control_points();
    }
    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].draw();
    }

    station_layer.bringToFront();

    regenerate_popups();
    generate_route_diagram(N_active_line);

    $(this).remove();


}

function build_to_station_event(e) {


    var station_id = $(this).attr('id').replace('build-', '');
    var impacted_lines = N_stations[station_id].drawmaps();

    var build_classes = $(this).attr('class').split(' ');
    var station_lines = [];
    for (c in build_classes) {
        if (build_classes[c].indexOf('line-') > -1) {
            var line = build_classes[c].replace('line-', '');
            station_lines.push(parseInt(line));
            if (!is_in_array(parseInt(line), impacted_lines))
                impacted_lines.push(parseInt(line));
        }
    }

    for (var i = 0; i < station_lines.length; i++) {
        var line_id = station_lines[i];
        var line = N_lines[line_id];

        $('div.subway-lines').append('<div class="subway-line '+line.css+'"><div class="height_fix"></div><div class="content">'+line.html+'</div></div>');

        var new_index = line.insert_station(parseInt(station_id));

        var start_index = Math.max(0, new_index - SHARED_STRETCH_THRESHOLD);
        var end_index = Math.min(new_index + SHARED_STRETCH_THRESHOLD, line.stations.length);

        // Add drawmaps of nearby stations
        for (var j = start_index; j < end_index; j++) {
            var drawmaps = N_stations[line.stations[j]].drawmaps();
            for (var k = 0; k < drawmaps.length; k++) {
                if (!is_in_array(drawmaps[k], impacted_lines))
                    impacted_lines.push(drawmaps[k]);
            }
        }

    }

    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].generate_draw_map();
        N_lines[impacted_lines[i]].generate_control_points();
    }
    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].draw();
    }

    station_layer.bringToFront();

    regenerate_popups();
    generate_route_diagram(N_active_line);
}

function transfer_station_event(e) {

    var station_id = $(this).attr('id').replace('transfer-', '');
    var station = N_stations[station_id];

    if (transfer_state == 0) {
        transfer_origin = station_id;
        transfer_state = 1;
    }

}

function line_select_click_handler(td) {

    if ($(td).hasClass('subway-selected')) {
        $(td).removeClass('subway-selected');
        active_line = 'None';
        N_active_line = null;
    } else {
        $('.subway-clickable').removeClass('subway-selected');
        $(td).addClass('subway-selected');
        if ($(td).attr('id') == "subway-airtrain-jfk") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("AirTrain JFK", 1);

        } else if ($(td).attr('id') == "subway-airtrain-lga") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("AirTrain LGA", 1);
        } else if ($(td).attr('id') == "subway-airtrain-jfk-howard") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("AirTrain JFK-Howard", 1);
        } else if ($(td).attr('id') == "subway-airtrain-jfk-archer") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("AirTrain JFK-Archer", 1);
        } else if ($(td).attr('id') == "subway-airtrain-jfk-connectors") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("AirTrain JFK-Connectors", 1);
        } else if ($(td).attr('id') == "subway-a-euclid") {
            // Special case for AirTrain.
            N_active_line = find_line_by_name("A-Euclid", 1);

        } else if ($(td).hasClass("subway-shuttle")) {
            active_line = $(td).attr('id');
            N_active_line = find_line_by_name($(td).attr('id'));
            if ($(td).hasClass("subway-shuttle-add")) {
                $(td).children(".content").text("S");
                $(td).removeClass("subway-shuttle-add");
                number_of_shuttles += 1;
                if (number_of_shuttles < 4) {
                    $(td).parent().append(newShuttleTemplate(number_of_shuttles+1));
                }
            }
        } else {
            active_line = $(td).text();
            N_active_line = find_line_by_html($(td).text(), 1);
        }
    }
    regenerate_popups();
    generate_route_diagram(N_active_line);
}
// Drawing parameters
var CURVE_THRESHOLD = 0.005; // Max overshoot from curve momentum.
var MARKER_RADIUS_DEFAULT = 6.0;
var MARKER_RADIUS_LARGE = 8.0;
var MARKER_RADIUS_HUGE = 12.0;
var STATION_MARKER_LARGE_THRESHOLD = 3; // Number of groups needed to force a large station marker
var STATION_MARKER_HUGE_THRESHOLD = 4;
var STATION_MARKER_SCALE_THRESHOLD = 6;
var TRACK_WIDTH = 6.0;
var TRACK_OFFSET = 6.0;
var TRANSFER_WIDTH = 3.0;

var USE_CURVED_TRACKS = true;
var CURVE_OVERSHOOT = 0.5;
var BEZIER_SHARPNESS = 0.6;

var DEBUG_MODE = false;

// Map rendering parameters
var SHARED_STRETCH_THRESHOLD = 8; // Max number of "local" stations in a shared stretch.

// Voxel data paramaters
var GEO_RANGE_LAT = 0.8;
var GEO_RANGE_LNG = 1.0;

var LAT_MIN = 40.713 - GEO_RANGE_LAT/2.0;
var LAT_MAX = 40.713 + GEO_RANGE_LAT/2.0;
var LNG_MIN = -74.006 - GEO_RANGE_LNG/2.0;
var LNG_MAX = -74.006 + GEO_RANGE_LNG/2.0;

var VOXELS_DIM = 500;
var VOXELS_RES_LAT = GEO_RANGE_LAT / VOXELS_DIM;
var VOXELS_RES_LNG = GEO_RANGE_LNG / VOXELS_DIM;
var VOXELS_TOTAL = VOXELS_DIM * VOXELS_DIM;

// Geocoding parameters
var ENC_NEIGHBORHOODS_ALWAYS_LABEL = ['Astoria'];
var ENC_NEIGHBORHOODS_ONLY_LABEL = ['Roosevelt Island', 'Governors Island', 'Randall\'s Island', 'North Brother Island', 'South Brother Island', 'Rikers Island', 'John F. Kennedy International Airport', 'Floyd Bennett Field', 'LaGuardia Airport'];
var ENC_LANDMARKS_ONLY_LABEL = ['Ellis Island', 'Liberty Island', 'Grand Army Plaza', 'Bartel Pritchard Square', 'Mets-Willets Point'];

var TRANSFER_BUTTON_DEFAULT = "Start Transfer"
var TRANSFER_BUTTON_START = "Click a station"
var TRANSFER_BUTTON_END = "Click another station"
class Station {
    constructor(lat, lng, name, info, riders) {
        this.name = name;
        this.info = info;
        this.riders = riders;

        this.lines = []; // Lines that contain this station.
        //this.drawmaps = []; // Lines that contain this station within its draw map.

        this.id = station_id_generator.generate();

        this.marker = create_station_marker(this.id, [lat, lng]);

        this.active = true;
    }

    to_json() {
        var json = {
            "lat": this.marker.getLatLng().lat,
            "lng": this.marker.getLatLng().lng,
            "name": this.name,
            "info": this.info,
            "riders": this.riders,
            "lines": this.lines,
            //"drawmaps": this.drawmaps,
            "id": this.id,
            "active": this.active
        };
        return json;
    }

    generate_popup() {

        var station_popup = L.popup({'className': 'station-popup'});

        var station_content = '<div class="station-name" id="station-'+this.id.toString()+'">'+this.name+'   <i class="fa fa-pencil" style="margin-left: 5px;" aria-hidden="true"></i></div>';
        station_content += '<div class="station-content"><div class="station-info">'+this.info+'<br /><i class="fa fa-user" aria-hidden="true"></i> '+Math.round(this.riders).toString()+'</div>';
        station_content += '<div class="station-info subway-lines">';

        var html_css_combos = [];

        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var html_css_combo = N_lines[line].html + ' ' + N_lines[line].css;
            if (!is_in_array(html_css_combo, html_css_combos)) {
                station_content += '<div id="'+this.id.toString()+":"+line.toString()+'" class="tooltip subway-deletable subway-line '+N_lines[line].css+'"><div class="height_fix"></div><div class="content">'+N_lines[line].html+'</div><span class="tooltiptext">Click to delete</span></div>';
                html_css_combos.push(html_css_combo);
            }
        }
        station_content += ' </div>';


        station_content += '<div class="station-buttons"><div class="station-content-button station-transfer" id="transfer-'+this.id.toString()+'">Transfer</div>';

        if (!is_in_array(N_active_line.id, this.lines)) {
            station_content += '<div class="station-content-button station-build line-'+N_active_line.id.toString()+'" id="build-'+this.id.toString()+'">Build <div class="subway-line-mini '+N_active_line.css+'"><div class="height_fix"></div><div class="content">'+N_active_line.html+'</div></div></div>';
        }

        station_content += '<div class="station-content-button station-delete ';
        for (i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            station_content += 'line-'+N_lines[line].id.toString()+' ';
        }
        station_content += '" id="delete-'+this.id.toString()+'">Delete</div>';
        station_content += '</div><div style="clear: both;"></div>';

        if (DEBUG_MODE) {
            station_content += '<div>'+this.id.toString()+'</div>';
        }

        station_content += '</div>';

        station_popup.setContent(station_content);

        this.marker.unbindPopup();
        this.marker.bindPopup(station_popup);

        return station_popup;
    }

    drawmaps() {
        var drawmaps = [];
        for (var i = 0; i < N_lines.length; i++) {
            if (is_in_array(this.id, N_lines[i].draw_map)) {
                drawmaps.push(N_lines[i].id);
            }
        }
        return drawmaps;
    }

    del() {

        // Remove the marker.
        station_layer.removeLayer(this.marker);

        // Set the station to "inactive".
        this.active = false;

        var impacted_lines = [];

        for (var i = 0; i < N_lines.length; i++) {

            // Remove from station array.
            if (is_in_array(this.id, N_lines[i].stations)) {
                if (!is_in_array(i, impacted_lines)) {
                    impacted_lines.push(i);
                }
                var station_id_index = N_lines[i].stations.indexOf(this.id);
                N_lines[i].stations.splice(station_id_index, 1);
            }

            // Remove from drawmap.
            if (is_in_array(this.id, N_lines[i].draw_map)) {
                if (!is_in_array(i, impacted_lines)) {
                    impacted_lines.push(i);
                }
                var station_id_index = N_lines[i].draw_map.indexOf(this.id);
                N_lines[i].draw_map.splice(station_id_index, 1);
            }

        }

        // Remove transfers
        for (var j = 0; j < N_transfers.length; j++) {
            var transfer = N_transfers[j];
            if (this.id == transfer.origin || this.id == transfer.end) {
                transfer.undraw();
            }
        }

        /*
        // Redraw lines
        for (var j = 0; j < impacted_lines.length; j++) {
            N_lines[impacted_lines[j]].generate_draw_map();
            N_lines[impacted_lines[j]].generate_control_points();
        }
        for (var j = 0; j < impacted_lines.length; j++) {
            N_lines[impacted_lines[j]].draw();
        }

        station_layer.bringToFront();
        */

    }

    set_marker_style() {

        if (lines_to_groups(this.drawmaps()).length >= STATION_MARKER_SCALE_THRESHOLD) {
            this.marker.setRadius(lines_to_groups(this.drawmaps()).length * TRACK_WIDTH / 2.0);
        } else if (lines_to_groups(this.drawmaps()).length >= STATION_MARKER_HUGE_THRESHOLD || this.lines.length > 12) {
            this.marker.setRadius(MARKER_RADIUS_HUGE);
        } else if (lines_to_groups(this.drawmaps()).length >= STATION_MARKER_LARGE_THRESHOLD || this.lines.length > 8) {
            this.marker.setRadius(MARKER_RADIUS_LARGE);
        }
        if (this.drawmaps().length > this.lines.length || this.lines.length == 1) {
            this.marker.setStyle({color: "white", fillColor: "black", weight: 2});
        } else {
            this.marker.setStyle({color: "black", fillColor: "white", weight: 3});
        }
    }
}

function geocode_to_station(geo, line) {

    var ridership = calculate_ridership(geo.latlng);

    var N_station = new Station(geo.latlng.lat, geo.latlng.lng, geo.name, geo.info, ridership);
    N_stations[N_station.id] = N_station;
    var new_index = N_active_line.insert_station(N_station.id);

    N_station.generate_popup();
    N_station.marker.openPopup();

    var impacted_lines = [N_active_line.id];
    // Add drawmaps of nearby stations
    var start_index = Math.max(0, new_index - SHARED_STRETCH_THRESHOLD);
    var end_index = Math.min(new_index + SHARED_STRETCH_THRESHOLD, N_active_line.stations.length);
    for (var j = start_index; j < end_index; j++) {
        for (var k = 0; k < N_stations[N_active_line.stations[j]].drawmaps().length; k++) {
            var drawmaps = N_stations[N_active_line.stations[j]].drawmaps();
            if (!is_in_array(drawmaps[k], impacted_lines)) {
                impacted_lines.push(drawmaps[k]);
            }
        }
    }

    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].generate_draw_map();
        N_lines[impacted_lines[i]].generate_control_points();
    }
    for (var i = 0; i < impacted_lines.length; i++) {
        N_lines[impacted_lines[i]].draw();
    }

    station_layer.bringToFront();
    generate_route_diagram(line);
    calculate_total_ridership();

}

var N_stations = [];
class Transfer {
    constructor(station_origin, station_end) {
        this.origin = station_origin;
        this.end = station_end;
        return this;
    }
    
    to_json() {
        var json = {
            "s": this.origin,
            "e": this.end
        };
        return json;
    }
    
    draw() {
        var track_options = {color: 'black', weight: TRANSFER_WIDTH, fill: false, smoothFactor: 1.0, offset: 0};
        var track = L.polyline([N_stations[this.origin].marker.getLatLng(), N_stations[this.end].marker.getLatLng()], track_options);
        curve_layer.addLayer(track);
        station_layer.bringToFront();
        this.track = track;
    }
    
    undraw() {
        map.removeLayer(this.track);
    }
}
    
    
function is_in_array(value, array) {
  return array.indexOf(value) > -1;
}

function is_in_2d_array(arr, i, j) {
    for (var a = 0; a < arr.length; a++) {
        var p = arr[a];
        if (p.indexOf(i) > -1 && p.indexOf(j) > -1) {
            return true;
        }
    }
    return false;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

function sort_by_group(line_ids) {
    // Takes an array of line IDs, and sorts based on the group they're in.
    // e.g. [B,C] -> [B,C], [A,B,C,D] -> [A,C,B,D]

    return line_ids.sort(function(x,y) {
        var group_x = lines_to_groups([x])[0];
        var group_y = lines_to_groups([y])[0];
        if (group_x == group_y) {
            return N_line_groups[group_x].lines.indexOf(x) > N_line_groups[group_y].lines.indexOf(y);
        } else {
            return group_x > group_y;
        }
    });
}

function debug_stations(station_id_list) {
    for (var i = 0; i < station_id_list.length; i++) {
        console.log(N_stations[station_id_list[i]]);
    }
}

function debug_lines(line_id_list) {
    for (var i = 0; i < line_id_list.length; i++) {
        console.log(N_lines[line_id_list[i]]);
    }
}

function find_stations_by_name(station_name) {
    var stations = [];
    for (var i = 0; i < N_stations.length; i++) {
        if (N_stations[i].name == station_name && N_stations[i].active) {
            stations.push(N_stations[i]);
        }
    }
    return stations;
}

function debug_voxels() {

    for (var lat = LAT_MIN; lat < LAT_MAX; lat += VOXELS_RES_LAT) {
        for (var lng = LNG_MIN; lng < LNG_MAX; lng += VOXELS_RES_LNG) {
            var voxel_i = Math.round((lat - LAT_MIN)/VOXELS_RES_LAT);
            var voxel_j = Math.round((lng - LNG_MIN)/VOXELS_RES_LNG);

            console.log("Adding voxel at "+voxel_i.toString()+","+voxel_j.toString());
            var voxel = L.rectangle([[lat, lng], [lat+VOXELS_RES_LAT, lng+VOXELS_RES_LNG]], {color: "#ff7800", weight: 0, fillOpacity: demand[voxel_i][voxel_j]/1000.0});
            voxel.addTo(map);

        }
    }
}

function debug_control_points(c) {
    for (var i = 0; i < c.length; i++) {
        console.log("Set: ("+c[i][0][0]+","+c[i][0][1]+"), ("+c[i][1][0]+","+c[i][1][1]+")");
    }
}

function redraw_all_lines() {
    for (var i = 0; i < N_lines.length; i++) {
        N_lines[i].draw();
    }

    station_layer.bringToFront();
}

function average_control_points(cpta) {

    // Takes in a 3d array of pairs of control points (each control point being an x,y pair)
    var num_sets = cpta.length;
    var cp_average = [[0.0,0.0],[0.0,0.0]];
    for (var i = 0; i < num_sets; i++) {
        for (var j = 0; j < 2; j++) {
            for (var k = 0; k < 2; k++) {
                cp_average[j][k] += (cpta[i][j][k] * 1.0) / (num_sets * 1.0);
            }
        }
    }
    return cp_average;

}

function number_of_active_stations() {
    var n = 0;
    for (var i = 0; i < N_stations.length; i++) {
        if (N_stations[i].active) {
            n += 1;
        }
    }
    return n;
}

function clear_debug_layer() {

    map.removeLayer(debug_layer);
    debug_layer = L.featureGroup();
    map.addLayer(debug_layer);
}
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.turf=t()}}(function(){var t;return function e(t,n,o){function r(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var p=new Error("Cannot find module '"+s+"'");throw p.code="MODULE_NOT_FOUND",p}var g=n[s]={exports:{}};t[s][0].call(g.exports,function(e){var n=t[s][1][e];return r(n?n:e)},g,g.exports,e,t,n,o)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(t,e){e.exports={isolines:t("turf-isolines"),merge:t("turf-merge"),convex:t("turf-convex"),within:t("turf-within"),concave:t("turf-concave"),count:t("turf-count"),erase:t("turf-erase"),variance:t("turf-variance"),deviation:t("turf-deviation"),median:t("turf-median"),min:t("turf-min"),max:t("turf-max"),aggregate:t("turf-aggregate"),flip:t("turf-flip"),simplify:t("turf-simplify"),sum:t("turf-sum"),average:t("turf-average"),bezier:t("turf-bezier"),tag:t("turf-tag"),size:t("turf-size"),sample:t("turf-sample"),jenks:t("turf-jenks"),quantile:t("turf-quantile"),envelope:t("turf-envelope"),square:t("turf-square"),midpoint:t("turf-midpoint"),buffer:t("turf-buffer"),center:t("turf-center"),centroid:t("turf-centroid"),combine:t("turf-combine"),distance:t("turf-distance"),explode:t("turf-explode"),extent:t("turf-extent"),bboxPolygon:t("turf-bbox-polygon"),featurecollection:t("turf-featurecollection"),filter:t("turf-filter"),inside:t("turf-inside"),intersect:t("turf-intersect"),linestring:t("turf-linestring"),nearest:t("turf-nearest"),planepoint:t("turf-planepoint"),point:t("turf-point"),polygon:t("turf-polygon"),random:t("turf-random"),reclass:t("turf-reclass"),remove:t("turf-remove"),tin:t("turf-tin"),union:t("turf-union"),bearing:t("turf-bearing"),destination:t("turf-destination"),kinks:t("turf-kinks"),pointOnSurface:t("turf-point-on-surface"),area:t("turf-area"),along:t("turf-along"),lineDistance:t("turf-line-distance"),lineSlice:t("turf-line-slice"),pointOnLine:t("turf-point-on-line"),pointGrid:t("turf-point-grid"),squareGrid:t("turf-square-grid"),triangleGrid:t("turf-triangle-grid"),hexGrid:t("turf-hex-grid")}},{"turf-aggregate":6,"turf-along":7,"turf-area":8,"turf-average":11,"turf-bbox-polygon":12,"turf-bearing":13,"turf-bezier":14,"turf-buffer":16,"turf-center":21,"turf-centroid":22,"turf-combine":24,"turf-concave":25,"turf-convex":26,"turf-count":56,"turf-destination":57,"turf-deviation":58,"turf-distance":60,"turf-envelope":62,"turf-erase":63,"turf-explode":68,"turf-extent":70,"turf-featurecollection":72,"turf-filter":73,"turf-flip":74,"turf-hex-grid":75,"turf-inside":76,"turf-intersect":77,"turf-isolines":83,"turf-jenks":85,"turf-kinks":87,"turf-line-distance":88,"turf-line-slice":89,"turf-linestring":90,"turf-max":91,"turf-median":92,"turf-merge":93,"turf-midpoint":95,"turf-min":96,"turf-nearest":97,"turf-planepoint":98,"turf-point":102,"turf-point-grid":99,"turf-point-on-line":100,"turf-point-on-surface":101,"turf-polygon":103,"turf-quantile":104,"turf-random":106,"turf-reclass":108,"turf-remove":109,"turf-sample":110,"turf-simplify":111,"turf-size":113,"turf-square":115,"turf-square-grid":114,"turf-sum":116,"turf-tag":117,"turf-tin":118,"turf-triangle-grid":119,"turf-union":120,"turf-variance":125,"turf-within":127}],2:[function(t,e,n){function o(t,e,n){if(!(this instanceof o))return new o(t,e,n);var r,i=typeof t;if("number"===i)r=+t;else if("string"===i)r=o.byteLength(t,e);else{if("object"!==i||null===t)throw new TypeError("must start with number, buffer, array or string");"Buffer"===t.type&&G(t.data)&&(t=t.data),r=+t.length}if(r>F)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+F.toString(16)+" bytes");0>r?r=0:r>>>=0;var s=this;o.TYPED_ARRAY_SUPPORT?s=o._augment(new Uint8Array(r)):(s.length=r,s._isBuffer=!0);var a;if(o.TYPED_ARRAY_SUPPORT&&"number"==typeof t.byteLength)s._set(t);else if(N(t))if(o.isBuffer(t))for(a=0;r>a;a++)s[a]=t.readUInt8(a);else for(a=0;r>a;a++)s[a]=(t[a]%256+256)%256;else if("string"===i)s.write(t,0,e);else if("number"===i&&!o.TYPED_ARRAY_SUPPORT&&!n)for(a=0;r>a;a++)s[a]=0;return r>0&&r<=o.poolSize&&(s.parent=B),s}function r(t,e,n){if(!(this instanceof r))return new r(t,e,n);var i=new o(t,e,n);return delete i.parent,i}function i(t,e,n,o){n=Number(n)||0;var r=t.length-n;o?(o=Number(o),o>r&&(o=r)):o=r;var i=e.length;if(i%2!==0)throw new Error("Invalid hex string");o>i/2&&(o=i/2);for(var s=0;o>s;s++){var a=parseInt(e.substr(2*s,2),16);if(isNaN(a))throw new Error("Invalid hex string");t[n+s]=a}return s}function s(t,e,n,o){var r=M(P(e,t.length-n),t,n,o);return r}function a(t,e,n,o){var r=M(R(e),t,n,o);return r}function u(t,e,n,o){return a(t,e,n,o)}function p(t,e,n,o){var r=M(O(e),t,n,o);return r}function g(t,e,n,o){var r=M(w(e,t.length-n),t,n,o);return r}function l(t,e,n){return T.fromByteArray(0===e&&n===t.length?t:t.slice(e,n))}function h(t,e,n){var o="",r="";n=Math.min(t.length,n);for(var i=e;n>i;i++)t[i]<=127?(o+=A(r)+String.fromCharCode(t[i]),r=""):r+="%"+t[i].toString(16);return o+A(r)}function d(t,e,n){var o="";n=Math.min(t.length,n);for(var r=e;n>r;r++)o+=String.fromCharCode(127&t[r]);return o}function c(t,e,n){var o="";n=Math.min(t.length,n);for(var r=e;n>r;r++)o+=String.fromCharCode(t[r]);return o}function f(t,e,n){var o=t.length;(!e||0>e)&&(e=0),(!n||0>n||n>o)&&(n=o);for(var r="",i=e;n>i;i++)r+=b(t[i]);return r}function m(t,e,n){for(var o=t.slice(e,n),r="",i=0;i<o.length;i+=2)r+=String.fromCharCode(o[i]+256*o[i+1]);return r}function y(t,e,n){if(t%1!==0||0>t)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function j(t,e,n,r,i,s){if(!o.isBuffer(t))throw new TypeError("buffer must be a Buffer instance");if(e>i||s>e)throw new RangeError("value is out of bounds");if(n+r>t.length)throw new RangeError("index out of range")}function v(t,e,n,o){0>e&&(e=65535+e+1);for(var r=0,i=Math.min(t.length-n,2);i>r;r++)t[n+r]=(e&255<<8*(o?r:1-r))>>>8*(o?r:1-r)}function E(t,e,n,o){0>e&&(e=4294967295+e+1);for(var r=0,i=Math.min(t.length-n,4);i>r;r++)t[n+r]=e>>>8*(o?r:3-r)&255}function x(t,e,n,o,r,i){if(e>r||i>e)throw new RangeError("value is out of bounds");if(n+o>t.length)throw new RangeError("index out of range");if(0>n)throw new RangeError("index out of range")}function I(t,e,n,o,r){return r||x(t,e,n,4,3.4028234663852886e38,-3.4028234663852886e38),D.write(t,e,n,o,23,4),n+4}function S(t,e,n,o,r){return r||x(t,e,n,8,1.7976931348623157e308,-1.7976931348623157e308),D.write(t,e,n,o,52,8),n+8}function L(t){if(t=C(t).replace(_,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function C(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function N(t){return G(t)||o.isBuffer(t)||t&&"object"==typeof t&&"number"==typeof t.length}function b(t){return 16>t?"0"+t.toString(16):t.toString(16)}function P(t,e){e=e||1/0;for(var n,o=t.length,r=null,i=[],s=0;o>s;s++){if(n=t.charCodeAt(s),n>55295&&57344>n){if(!r){if(n>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(s+1===o){(e-=3)>-1&&i.push(239,191,189);continue}r=n;continue}if(56320>n){(e-=3)>-1&&i.push(239,191,189),r=n;continue}n=r-55296<<10|n-56320|65536,r=null}else r&&((e-=3)>-1&&i.push(239,191,189),r=null);if(128>n){if((e-=1)<0)break;i.push(n)}else if(2048>n){if((e-=2)<0)break;i.push(n>>6|192,63&n|128)}else if(65536>n){if((e-=3)<0)break;i.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(2097152>n))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return i}function R(t){for(var e=[],n=0;n<t.length;n++)e.push(255&t.charCodeAt(n));return e}function w(t,e){for(var n,o,r,i=[],s=0;s<t.length&&!((e-=2)<0);s++)n=t.charCodeAt(s),o=n>>8,r=n%256,i.push(r),i.push(o);return i}function O(t){return T.toByteArray(L(t))}function M(t,e,n,o){for(var r=0;o>r&&!(r+n>=e.length||r>=t.length);r++)e[r+n]=t[r];return r}function A(t){try{return decodeURIComponent(t)}catch(e){return String.fromCharCode(65533)}}var T=t("base64-js"),D=t("ieee754"),G=t("is-array");n.Buffer=o,n.SlowBuffer=r,n.INSPECT_MAX_BYTES=50,o.poolSize=8192;var F=1073741823,B={};o.TYPED_ARRAY_SUPPORT=function(){try{var t=new ArrayBuffer(0),e=new Uint8Array(t);return e.foo=function(){return 42},42===e.foo()&&"function"==typeof e.subarray&&0===new Uint8Array(1).subarray(1,1).byteLength}catch(n){return!1}}(),o.isBuffer=function(t){return!(null==t||!t._isBuffer)},o.compare=function(t,e){if(!o.isBuffer(t)||!o.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var n=t.length,r=e.length,i=0,s=Math.min(n,r);s>i&&t[i]===e[i];i++);return i!==s&&(n=t[i],r=e[i]),r>n?-1:n>r?1:0},o.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(t,e){if(!G(t))throw new TypeError("Usage: Buffer.concat(list[, length])");if(0===t.length)return new o(0);if(1===t.length)return t[0];var n;if(void 0===e)for(e=0,n=0;n<t.length;n++)e+=t[n].length;var r=new o(e),i=0;for(n=0;n<t.length;n++){var s=t[n];s.copy(r,i),i+=s.length}return r},o.byteLength=function(t,e){var n;switch(t+="",e||"utf8"){case"ascii":case"binary":case"raw":n=t.length;break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":n=2*t.length;break;case"hex":n=t.length>>>1;break;case"utf8":case"utf-8":n=P(t).length;break;case"base64":n=O(t).length;break;default:n=t.length}return n},o.prototype.length=void 0,o.prototype.parent=void 0,o.prototype.toString=function(t,e,n){var o=!1;if(e>>>=0,n=void 0===n||1/0===n?this.length:n>>>0,t||(t="utf8"),0>e&&(e=0),n>this.length&&(n=this.length),e>=n)return"";for(;;)switch(t){case"hex":return f(this,e,n);case"utf8":case"utf-8":return h(this,e,n);case"ascii":return d(this,e,n);case"binary":return c(this,e,n);case"base64":return l(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return m(this,e,n);default:if(o)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),o=!0}},o.prototype.equals=function(t){if(!o.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?!0:0===o.compare(this,t)},o.prototype.inspect=function(){var t="",e=n.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},o.prototype.compare=function(t){if(!o.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?0:o.compare(this,t)},o.prototype.get=function(t){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(t)},o.prototype.set=function(t,e){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(t,e)},o.prototype.write=function(t,e,n,o){if(isFinite(e))isFinite(n)||(o=n,n=void 0);else{var r=o;o=e,e=n,n=r}if(e=Number(e)||0,0>n||0>e||e>this.length)throw new RangeError("attempt to write outside buffer bounds");var l=this.length-e;n?(n=Number(n),n>l&&(n=l)):n=l,o=String(o||"utf8").toLowerCase();var h;switch(o){case"hex":h=i(this,t,e,n);break;case"utf8":case"utf-8":h=s(this,t,e,n);break;case"ascii":h=a(this,t,e,n);break;case"binary":h=u(this,t,e,n);break;case"base64":h=p(this,t,e,n);break;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":h=g(this,t,e,n);break;default:throw new TypeError("Unknown encoding: "+o)}return h},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},o.prototype.slice=function(t,e){var n=this.length;t=~~t,e=void 0===e?n:~~e,0>t?(t+=n,0>t&&(t=0)):t>n&&(t=n),0>e?(e+=n,0>e&&(e=0)):e>n&&(e=n),t>e&&(e=t);var r;if(o.TYPED_ARRAY_SUPPORT)r=o._augment(this.subarray(t,e));else{var i=e-t;r=new o(i,void 0,!0);for(var s=0;i>s;s++)r[s]=this[s+t]}return r.length&&(r.parent=this.parent||this),r},o.prototype.readUIntLE=function(t,e,n){t>>>=0,e>>>=0,n||y(t,e,this.length);for(var o=this[t],r=1,i=0;++i<e&&(r*=256);)o+=this[t+i]*r;return o},o.prototype.readUIntBE=function(t,e,n){t>>>=0,e>>>=0,n||y(t,e,this.length);for(var o=this[t+--e],r=1;e>0&&(r*=256);)o+=this[t+--e]*r;return o},o.prototype.readUInt8=function(t,e){return e||y(t,1,this.length),this[t]},o.prototype.readUInt16LE=function(t,e){return e||y(t,2,this.length),this[t]|this[t+1]<<8},o.prototype.readUInt16BE=function(t,e){return e||y(t,2,this.length),this[t]<<8|this[t+1]},o.prototype.readUInt32LE=function(t,e){return e||y(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},o.prototype.readUInt32BE=function(t,e){return e||y(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},o.prototype.readIntLE=function(t,e,n){t>>>=0,e>>>=0,n||y(t,e,this.length);for(var o=this[t],r=1,i=0;++i<e&&(r*=256);)o+=this[t+i]*r;return r*=128,o>=r&&(o-=Math.pow(2,8*e)),o},o.prototype.readIntBE=function(t,e,n){t>>>=0,e>>>=0,n||y(t,e,this.length);for(var o=e,r=1,i=this[t+--o];o>0&&(r*=256);)i+=this[t+--o]*r;return r*=128,i>=r&&(i-=Math.pow(2,8*e)),i},o.prototype.readInt8=function(t,e){return e||y(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},o.prototype.readInt16LE=function(t,e){e||y(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt16BE=function(t,e){e||y(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt32LE=function(t,e){return e||y(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},o.prototype.readInt32BE=function(t,e){return e||y(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},o.prototype.readFloatLE=function(t,e){return e||y(t,4,this.length),D.read(this,t,!0,23,4)},o.prototype.readFloatBE=function(t,e){return e||y(t,4,this.length),D.read(this,t,!1,23,4)},o.prototype.readDoubleLE=function(t,e){return e||y(t,8,this.length),D.read(this,t,!0,52,8)},o.prototype.readDoubleBE=function(t,e){return e||y(t,8,this.length),D.read(this,t,!1,52,8)},o.prototype.writeUIntLE=function(t,e,n,o){t=+t,e>>>=0,n>>>=0,o||j(this,t,e,n,Math.pow(2,8*n),0);var r=1,i=0;for(this[e]=255&t;++i<n&&(r*=256);)this[e+i]=t/r>>>0&255;return e+n},o.prototype.writeUIntBE=function(t,e,n,o){t=+t,e>>>=0,n>>>=0,o||j(this,t,e,n,Math.pow(2,8*n),0);var r=n-1,i=1;for(this[e+r]=255&t;--r>=0&&(i*=256);)this[e+r]=t/i>>>0&255;return e+n},o.prototype.writeUInt8=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,1,255,0),o.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=t,e+1},o.prototype.writeUInt16LE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[e]=t,this[e+1]=t>>>8):v(this,t,e,!0),e+2},o.prototype.writeUInt16BE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=t):v(this,t,e,!1),e+2},o.prototype.writeUInt32LE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=t):E(this,t,e,!0),e+4},o.prototype.writeUInt32BE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=t):E(this,t,e,!1),e+4},o.prototype.writeIntLE=function(t,e,n,o){t=+t,e>>>=0,o||j(this,t,e,n,Math.pow(2,8*n-1)-1,-Math.pow(2,8*n-1));var r=0,i=1,s=0>t?1:0;for(this[e]=255&t;++r<n&&(i*=256);)this[e+r]=(t/i>>0)-s&255;return e+n},o.prototype.writeIntBE=function(t,e,n,o){t=+t,e>>>=0,o||j(this,t,e,n,Math.pow(2,8*n-1)-1,-Math.pow(2,8*n-1));var r=n-1,i=1,s=0>t?1:0;for(this[e+r]=255&t;--r>=0&&(i*=256);)this[e+r]=(t/i>>0)-s&255;return e+n},o.prototype.writeInt8=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,1,127,-128),o.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),0>t&&(t=255+t+1),this[e]=t,e+1},o.prototype.writeInt16LE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[e]=t,this[e+1]=t>>>8):v(this,t,e,!0),e+2},o.prototype.writeInt16BE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=t):v(this,t,e,!1),e+2},o.prototype.writeInt32LE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,4,2147483647,-2147483648),o.TYPED_ARRAY_SUPPORT?(this[e]=t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):E(this,t,e,!0),e+4},o.prototype.writeInt32BE=function(t,e,n){return t=+t,e>>>=0,n||j(this,t,e,4,2147483647,-2147483648),0>t&&(t=4294967295+t+1),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=t):E(this,t,e,!1),e+4},o.prototype.writeFloatLE=function(t,e,n){return I(this,t,e,!0,n)},o.prototype.writeFloatBE=function(t,e,n){return I(this,t,e,!1,n)},o.prototype.writeDoubleLE=function(t,e,n){return S(this,t,e,!0,n)},o.prototype.writeDoubleBE=function(t,e,n){return S(this,t,e,!1,n)},o.prototype.copy=function(t,e,n,r){var i=this;if(n||(n=0),r||0===r||(r=this.length),e>=t.length&&(e=t.length),e||(e=0),r>0&&n>r&&(r=n),r===n)return 0;if(0===t.length||0===i.length)return 0;if(0>e)throw new RangeError("targetStart out of bounds");if(0>n||n>=i.length)throw new RangeError("sourceStart out of bounds");if(0>r)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),t.length-e<r-n&&(r=t.length-e+n);var s=r-n;if(1e3>s||!o.TYPED_ARRAY_SUPPORT)for(var a=0;s>a;a++)t[a+e]=this[a+n];else t._set(this.subarray(n,n+s),e);return s},o.prototype.fill=function(t,e,n){if(t||(t=0),e||(e=0),n||(n=this.length),e>n)throw new RangeError("end < start");if(n!==e&&0!==this.length){if(0>e||e>=this.length)throw new RangeError("start out of bounds");if(0>n||n>this.length)throw new RangeError("end out of bounds");var o;if("number"==typeof t)for(o=e;n>o;o++)this[o]=t;else{var r=P(t.toString()),i=r.length;for(o=e;n>o;o++)this[o]=r[o%i]}return this}},o.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(o.TYPED_ARRAY_SUPPORT)return new o(this).buffer;for(var t=new Uint8Array(this.length),e=0,n=t.length;n>e;e+=1)t[e]=this[e];return t.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")};var q=o.prototype;o._augment=function(t){return t.constructor=o,t._isBuffer=!0,t._get=t.get,t._set=t.set,t.get=q.get,t.set=q.set,t.write=q.write,t.toString=q.toString,t.toLocaleString=q.toString,t.toJSON=q.toJSON,t.equals=q.equals,t.compare=q.compare,t.copy=q.copy,t.slice=q.slice,t.readUIntLE=q.readUIntLE,t.readUIntBE=q.readUIntBE,t.readUInt8=q.readUInt8,t.readUInt16LE=q.readUInt16LE,t.readUInt16BE=q.readUInt16BE,t.readUInt32LE=q.readUInt32LE,t.readUInt32BE=q.readUInt32BE,t.readIntLE=q.readIntLE,t.readIntBE=q.readIntBE,t.readInt8=q.readInt8,t.readInt16LE=q.readInt16LE,t.readInt16BE=q.readInt16BE,t.readInt32LE=q.readInt32LE,t.readInt32BE=q.readInt32BE,t.readFloatLE=q.readFloatLE,t.readFloatBE=q.readFloatBE,t.readDoubleLE=q.readDoubleLE,t.readDoubleBE=q.readDoubleBE,t.writeUInt8=q.writeUInt8,t.writeUIntLE=q.writeUIntLE,t.writeUIntBE=q.writeUIntBE,t.writeUInt16LE=q.writeUInt16LE,t.writeUInt16BE=q.writeUInt16BE,t.writeUInt32LE=q.writeUInt32LE,t.writeUInt32BE=q.writeUInt32BE,t.writeIntLE=q.writeIntLE,t.writeIntBE=q.writeIntBE,t.writeInt8=q.writeInt8,t.writeInt16LE=q.writeInt16LE,t.writeInt16BE=q.writeInt16BE,t.writeInt32LE=q.writeInt32LE,t.writeInt32BE=q.writeInt32BE,t.writeFloatLE=q.writeFloatLE,t.writeFloatBE=q.writeFloatBE,t.writeDoubleLE=q.writeDoubleLE,t.writeDoubleBE=q.writeDoubleBE,t.fill=q.fill,t.inspect=q.inspect,t.toArrayBuffer=q.toArrayBuffer,t};var _=/[^+\/0-9A-z\-]/g},{"base64-js":3,ieee754:4,"is-array":5}],3:[function(t,e,n){var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(t){"use strict";function e(t){var e=t.charCodeAt(0);return e===s||e===l?62:e===a||e===h?63:u>e?-1:u+10>e?e-u+26+26:g+26>e?e-g:p+26>e?e-p+26:void 0}function n(t){function n(t){p[l++]=t}var o,r,s,a,u,p;if(t.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var g=t.length;u="="===t.charAt(g-2)?2:"="===t.charAt(g-1)?1:0,p=new i(3*t.length/4-u),s=u>0?t.length-4:t.length;var l=0;for(o=0,r=0;s>o;o+=4,r+=3)a=e(t.charAt(o))<<18|e(t.charAt(o+1))<<12|e(t.charAt(o+2))<<6|e(t.charAt(o+3)),n((16711680&a)>>16),n((65280&a)>>8),n(255&a);return 2===u?(a=e(t.charAt(o))<<2|e(t.charAt(o+1))>>4,n(255&a)):1===u&&(a=e(t.charAt(o))<<10|e(t.charAt(o+1))<<4|e(t.charAt(o+2))>>2,n(a>>8&255),n(255&a)),p}function r(t){function e(t){return o.charAt(t)}function n(t){return e(t>>18&63)+e(t>>12&63)+e(t>>6&63)+e(63&t)}var r,i,s,a=t.length%3,u="";for(r=0,s=t.length-a;s>r;r+=3)i=(t[r]<<16)+(t[r+1]<<8)+t[r+2],u+=n(i);switch(a){case 1:i=t[t.length-1],u+=e(i>>2),u+=e(i<<4&63),u+="==";break;case 2:i=(t[t.length-2]<<8)+t[t.length-1],u+=e(i>>10),u+=e(i>>4&63),u+=e(i<<2&63),u+="="}return u}var i="undefined"!=typeof Uint8Array?Uint8Array:Array,s="+".charCodeAt(0),a="/".charCodeAt(0),u="0".charCodeAt(0),p="a".charCodeAt(0),g="A".charCodeAt(0),l="-".charCodeAt(0),h="_".charCodeAt(0);t.toByteArray=n,t.fromByteArray=r}("undefined"==typeof n?this.base64js={}:n)},{}],4:[function(t,e,n){n.read=function(t,e,n,o,r){var i,s,a=8*r-o-1,u=(1<<a)-1,p=u>>1,g=-7,l=n?r-1:0,h=n?-1:1,d=t[e+l];for(l+=h,i=d&(1<<-g)-1,d>>=-g,g+=a;g>0;i=256*i+t[e+l],l+=h,g-=8);for(s=i&(1<<-g)-1,i>>=-g,g+=o;g>0;s=256*s+t[e+l],l+=h,g-=8);if(0===i)i=1-p;else{if(i===u)return s?0/0:1/0*(d?-1:1);s+=Math.pow(2,o),i-=p}return(d?-1:1)*s*Math.pow(2,i-o)},n.write=function(t,e,n,o,r,i){var s,a,u,p=8*i-r-1,g=(1<<p)-1,l=g>>1,h=23===r?Math.pow(2,-24)-Math.pow(2,-77):0,d=o?0:i-1,c=o?1:-1,f=0>e||0===e&&0>1/e?1:0;for(e=Math.abs(e),isNaN(e)||1/0===e?(a=isNaN(e)?1:0,s=g):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),e+=s+l>=1?h/u:h*Math.pow(2,1-l),e*u>=2&&(s++,u/=2),s+l>=g?(a=0,s=g):s+l>=1?(a=(e*u-1)*Math.pow(2,r),s+=l):(a=e*Math.pow(2,l-1)*Math.pow(2,r),s=0));r>=8;t[n+d]=255&a,d+=c,a/=256,r-=8);for(s=s<<r|a,p+=r;p>0;t[n+d]=255&s,d+=c,s/=256,p-=8);t[n+d-c]|=128*f}},{}],5:[function(t,e){var n=Array.isArray,o=Object.prototype.toString;e.exports=n||function(t){return!!t&&"[object Array]"==o.call(t)}},{}],6:[function(t,e){function n(t){return"average"===t||"sum"===t||"median"===t||"min"===t||"max"===t||"deviation"===t||"variance"===t||"count"===t}var o=t("turf-average"),r=t("turf-sum"),i=t("turf-median"),s=t("turf-min"),a=t("turf-max"),u=t("turf-deviation"),p=t("turf-variance"),g=t("turf-count"),l={};l.average=o,l.sum=r,l.median=i,l.min=s,l.max=a,l.deviation=u,l.variance=p,l.count=g,e.exports=function(t,e,o){for(var r=0,i=o.length;i>r;r++){var s=o[r],a=s.aggregation;if(!n(a))throw new Error('"'+a+'" is not a recognized aggregation operation.');t="count"===a?l[a](t,e,s.outField):l[a](t,e,s.inField,s.outField)}return t}},{"turf-average":11,"turf-count":56,"turf-deviation":58,"turf-max":91,"turf-median":92,"turf-min":96,"turf-sum":116,"turf-variance":125}],7:[function(t,e){var n=t("turf-distance"),o=t("turf-point"),r=t("turf-bearing"),i=t("turf-destination");e.exports=function(t,e,s){var a;if("Feature"===t.type)a=t.geometry.coordinates;else{if("LineString"!==t.type)throw new Error("input must be a LineString Feature or Geometry");a=t.geometry.coordinates}for(var u=0,p=0;p<a.length&&!(e>=u&&p===a.length-1);p++){if(u>=e){var g=e-u;if(g){var l=r(o(a[p]),o(a[p-1]))-180,h=i(o(a[p]),g,l,s);return h}return o(a[p])}u+=n(o(a[p]),o(a[p+1]),s)}return o(a[a.length-1])}},{"turf-bearing":13,"turf-destination":57,"turf-distance":60,"turf-point":102}],8:[function(t,e){var n=t("geojson-area").geometry;e.exports=function(t){if("FeatureCollection"===t.type){for(var e=0,o=0;e<t.features.length;e++)t.features[e].geometry&&(o+=n(t.features[e].geometry));return o}return n("Feature"===t.type?t.geometry:t)}},{"geojson-area":9}],9:[function(t,e){function n(t){var e,r=0;switch(t.type){case"Polygon":return o(t.coordinates);case"MultiPolygon":for(e=0;e<t.coordinates.length;e++)r+=o(t.coordinates[e]);return r;case"Point":case"MultiPoint":case"LineString":case"MultiLineString":return 0;case"GeometryCollection":for(e=0;e<t.geometries.length;e++)r+=n(t.geometries[e]);return r}}function o(t){var e=0;if(t&&t.length>0){e+=Math.abs(r(t[0]));for(var n=1;n<t.length;n++)e-=Math.abs(r(t[n]))}return e}function r(t){var e=0;if(t.length>2){for(var n,o,r=0;r<t.length-1;r++)n=t[r],o=t[r+1],e+=i(o[0]-n[0])*(2+Math.sin(i(n[1]))+Math.sin(i(o[1])));e=e*s.RADIUS*s.RADIUS/2}return e}function i(t){return t*Math.PI/180}var s=t("wgs84");e.exports.geometry=n,e.exports.ring=r},{wgs84:10}],10:[function(t,e){e.exports.RADIUS=6378137,e.exports.FLATTENING=1/298.257223563,e.exports.POLAR_RADIUS=6356752.3142},{}],11:[function(t,e){function n(t){for(var e=0,n=0;n<t.length;n++)e+=t[n];return e/t.length}var o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n(s)}),t}},{"turf-inside":76}],12:[function(t,e){var n=t("turf-polygon");e.exports=function(t){var e=[t[0],t[1]],o=[t[0],t[3]],r=[t[2],t[3]],i=[t[2],t[1]],s=n([[e,i,r,o,e]]);return s}},{"turf-polygon":103}],13:[function(t,e){function n(t){return t*Math.PI/180}function o(t){return 180*t/Math.PI}e.exports=function(t,e){var r=t.geometry.coordinates,i=e.geometry.coordinates,s=n(r[0]),a=n(i[0]),u=n(r[1]),p=n(i[1]),g=Math.sin(a-s)*Math.cos(p),l=Math.cos(u)*Math.sin(p)-Math.sin(u)*Math.cos(p)*Math.cos(a-s),h=o(Math.atan2(g,l));return h}},{}],14:[function(t,e){var n=t("turf-linestring"),o=t("./spline.js");e.exports=function(t,e,r){var i=n([]);i.properties=t.properties;for(var s=t.geometry.coordinates.map(function(t){return{x:t[0],y:t[1]}}),a=new o({points:s,duration:e,sharpness:r}),u=0;u<a.duration;u+=10){var p=a.pos(u);Math.floor(u/100)%2===0&&i.geometry.coordinates.push([p.x,p.y])}return i}},{"./spline.js":15,"turf-linestring":90}],15:[function(t,e){var n=function(t){this.points=t.points||[],this.duration=t.duration||1e4,this.sharpness=t.sharpness||.85,this.centers=[],this.controls=[],this.stepLength=t.stepLength||60,this.length=this.points.length,this.delay=0;for(var e=0;e<this.length;e++)this.points[e].z=this.points[e].z||0;for(var e=0;e<this.length-1;e++){var n=this.points[e],o=this.points[e+1];this.centers.push({x:(n.x+o.x)/2,y:(n.y+o.y)/2,z:(n.z+o.z)/2})}this.controls.push([this.points[0],this.points[0]]);for(var e=0;e<this.centers.length-1;e++){var n=this.centers[e],o=this.centers[e+1],r=this.points[e+1].x-(this.centers[e].x+this.centers[e+1].x)/2,i=this.points[e+1].y-(this.centers[e].y+this.centers[e+1].y)/2,s=this.points[e+1].z-(this.centers[e].y+this.centers[e+1].z)/2;this.controls.push([{x:(1-this.sharpness)*this.points[e+1].x+this.sharpness*(this.centers[e].x+r),y:(1-this.sharpness)*this.points[e+1].y+this.sharpness*(this.centers[e].y+i),z:(1-this.sharpness)*this.points[e+1].z+this.sharpness*(this.centers[e].z+s)},{x:(1-this.sharpness)*this.points[e+1].x+this.sharpness*(this.centers[e+1].x+r),y:(1-this.sharpness)*this.points[e+1].y+this.sharpness*(this.centers[e+1].y+i),z:(1-this.sharpness)*this.points[e+1].z+this.sharpness*(this.centers[e+1].z+s)}])}return this.controls.push([this.points[this.length-1],this.points[this.length-1]]),this.steps=this.cacheSteps(this.stepLength),this};n.prototype.cacheSteps=function(t){var e=[],n=this.pos(0);e.push(0);for(var o=0;o<this.duration;o+=10){var r=this.pos(o),i=Math.sqrt((r.x-n.x)*(r.x-n.x)+(r.y-n.y)*(r.y-n.y)+(r.z-n.z)*(r.z-n.z));i>t&&(e.push(o),n=r)}return e},n.prototype.vector=function(t){var e=this.pos(t+10),n=this.pos(t-10);return{angle:180*Math.atan2(e.y-n.y,e.x-n.x)/3.14,speed:Math.sqrt((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y)+(n.z-e.z)*(n.z-e.z))}},n.prototype.pos=function(t){function e(t,e,n,o,r){var i=function(t){var e=t*t,n=e*t;return[n,3*e*(1-t),3*t*(1-t)*(1-t),(1-t)*(1-t)*(1-t)]},s=i(t),a={x:r.x*s[0]+o.x*s[1]+n.x*s[2]+e.x*s[3],y:r.y*s[0]+o.y*s[1]+n.y*s[2]+e.y*s[3],z:r.z*s[0]+o.z*s[1]+n.z*s[2]+e.z*s[3]};return a}var n=t-this.delay;0>n&&(n=0),n>this.duration&&(n=this.duration-1);var o=n/this.duration;if(o>=1)return this.points[this.length-1];var r=Math.floor((this.points.length-1)*o),i=(this.length-1)*o-r;return e(i,this.points[r],this.controls[r][1],this.controls[r+1][0],this.points[r+1])},e.exports=n},{}],16:[function(t,e){var n=t("turf-featurecollection"),o=t("turf-polygon"),r=t("turf-combine"),i=t("jsts");e.exports=function(t,e,n){var o;switch(n){case"miles":e/=69.047;break;case"feet":e/=364568;break;case"kilometers":e/=111.12;break;case"meters":e/=111120;break;case"degrees":}if("FeatureCollection"===t.type){var i=r(t);return i.properties={},o=s(i,e)}return o=s(t,e)};var s=function(t,e){var r=new i.io.GeoJSONReader,s=r.read(JSON.stringify(t.geometry)),a=s.buffer(e),u=new i.io.GeoJSONParser;return a=u.write(a),"MultiPolygon"===a.type?(a={type:"Feature",geometry:a,properties:{}},a=n([a])):a=n([o(a.coordinates)]),a}},{jsts:17,"turf-combine":24,"turf-featurecollection":72,"turf-polygon":103}],17:[function(t,e){t("javascript.util");var n=t("./lib/jsts");e.exports=n},{"./lib/jsts":18,"javascript.util":20}],18:[function(t,e){jsts={version:"0.15.0",algorithm:{distance:{},locate:{}},error:{},geom:{util:{}},geomgraph:{index:{}},index:{bintree:{},chain:{},kdtree:{},quadtree:{},strtree:{}},io:{},noding:{snapround:{}},operation:{buffer:{},distance:{},overlay:{snap:{}},polygonize:{},predicate:{},relate:{},union:{},valid:{}},planargraph:{},simplify:{},triangulate:{quadedge:{}},util:{}},"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),jsts.abstractFunc=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.error={},jsts.error.IllegalArgumentError=function(t){this.name="IllegalArgumentError",this.message=t},jsts.error.IllegalArgumentError.prototype=new Error,jsts.error.TopologyError=function(t,e){this.name="TopologyError",this.message=e?t+" [ "+e+" ]":t},jsts.error.TopologyError.prototype=new Error,jsts.error.AbstractMethodInvocationError=function(){this.name="AbstractMethodInvocationError",this.message="Abstract method called, should be implemented in subclass."},jsts.error.AbstractMethodInvocationError.prototype=new Error,jsts.error.NotImplementedError=function(){this.name="NotImplementedError",this.message="This method has not yet been implemented."},jsts.error.NotImplementedError.prototype=new Error,jsts.error.NotRepresentableError=function(t){this.name="NotRepresentableError",this.message=t},jsts.error.NotRepresentableError.prototype=new Error,jsts.error.LocateFailureError=function(t){this.name="LocateFailureError",this.message=t},jsts.error.LocateFailureError.prototype=new Error,"undefined"!=typeof e&&(e.exports=jsts),jsts.geom.GeometryFilter=function(){},jsts.geom.GeometryFilter.prototype.filter=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.util.PolygonExtracter=function(t){this.comps=t},jsts.geom.util.PolygonExtracter.prototype=new jsts.geom.GeometryFilter,jsts.geom.util.PolygonExtracter.prototype.comps=null,jsts.geom.util.PolygonExtracter.getPolygons=function(t,e){return void 0===e&&(e=[]),t instanceof jsts.geom.Polygon?e.push(t):t instanceof jsts.geom.GeometryCollection&&t.apply(new jsts.geom.util.PolygonExtracter(e)),e},jsts.geom.util.PolygonExtracter.prototype.filter=function(t){t instanceof jsts.geom.Polygon&&this.comps.push(t)},jsts.io.WKTParser=function(t){this.geometryFactory=t||new jsts.geom.GeometryFactory,this.regExes={typeStr:/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,emptyTypeStr:/^\s*(\w+)\s*EMPTY\s*$/,spaces:/\s+/,parenComma:/\)\s*,\s*\(/,doubleParenComma:/\)\s*\)\s*,\s*\(\s*\(/,trimParens:/^\s*\(?(.*?)\)?\s*$/}},jsts.io.WKTParser.prototype.read=function(t){var e,n,o;t=t.replace(/[\n\r]/g," ");var r=this.regExes.typeStr.exec(t);if(-1!==t.search("EMPTY")&&(r=this.regExes.emptyTypeStr.exec(t),r[2]=void 0),r&&(n=r[1].toLowerCase(),o=r[2],this.parse[n]&&(e=this.parse[n].apply(this,[o]))),void 0===e)throw new Error("Could not parse WKT "+t);return e},jsts.io.WKTParser.prototype.write=function(t){return this.extractGeometry(t)},jsts.io.WKTParser.prototype.extractGeometry=function(t){var e=t.CLASS_NAME.split(".")[2].toLowerCase();
if(!this.extract[e])return null;var n,o=e.toUpperCase();return n=t.isEmpty()?o+" EMPTY":o+"("+this.extract[e].apply(this,[t])+")"},jsts.io.WKTParser.prototype.extract={coordinate:function(t){return t.x+" "+t.y},point:function(t){return t.coordinate.x+" "+t.coordinate.y},multipoint:function(t){for(var e=[],n=0,o=t.geometries.length;o>n;++n)e.push("("+this.extract.point.apply(this,[t.geometries[n]])+")");return e.join(",")},linestring:function(t){for(var e=[],n=0,o=t.points.length;o>n;++n)e.push(this.extract.coordinate.apply(this,[t.points[n]]));return e.join(",")},multilinestring:function(t){for(var e=[],n=0,o=t.geometries.length;o>n;++n)e.push("("+this.extract.linestring.apply(this,[t.geometries[n]])+")");return e.join(",")},polygon:function(t){var e=[];e.push("("+this.extract.linestring.apply(this,[t.shell])+")");for(var n=0,o=t.holes.length;o>n;++n)e.push("("+this.extract.linestring.apply(this,[t.holes[n]])+")");return e.join(",")},multipolygon:function(t){for(var e=[],n=0,o=t.geometries.length;o>n;++n)e.push("("+this.extract.polygon.apply(this,[t.geometries[n]])+")");return e.join(",")},geometrycollection:function(t){for(var e=[],n=0,o=t.geometries.length;o>n;++n)e.push(this.extractGeometry.apply(this,[t.geometries[n]]));return e.join(",")}},jsts.io.WKTParser.prototype.parse={point:function(t){if(void 0===t)return this.geometryFactory.createPoint(null);var e=t.trim().split(this.regExes.spaces);return this.geometryFactory.createPoint(new jsts.geom.Coordinate(e[0],e[1]))},multipoint:function(t){if(void 0===t)return this.geometryFactory.createMultiPoint(null);for(var e,n=t.trim().split(","),o=[],r=0,i=n.length;i>r;++r)e=n[r].replace(this.regExes.trimParens,"$1"),o.push(this.parse.point.apply(this,[e]));return this.geometryFactory.createMultiPoint(o)},linestring:function(t){if(void 0===t)return this.geometryFactory.createLineString(null);for(var e,n=t.trim().split(","),o=[],r=0,i=n.length;i>r;++r)e=n[r].trim().split(this.regExes.spaces),o.push(new jsts.geom.Coordinate(e[0],e[1]));return this.geometryFactory.createLineString(o)},linearring:function(t){if(void 0===t)return this.geometryFactory.createLinearRing(null);for(var e,n=t.trim().split(","),o=[],r=0,i=n.length;i>r;++r)e=n[r].trim().split(this.regExes.spaces),o.push(new jsts.geom.Coordinate(e[0],e[1]));return this.geometryFactory.createLinearRing(o)},multilinestring:function(t){if(void 0===t)return this.geometryFactory.createMultiLineString(null);for(var e,n=t.trim().split(this.regExes.parenComma),o=[],r=0,i=n.length;i>r;++r)e=n[r].replace(this.regExes.trimParens,"$1"),o.push(this.parse.linestring.apply(this,[e]));return this.geometryFactory.createMultiLineString(o)},polygon:function(t){if(void 0===t)return this.geometryFactory.createPolygon(null);for(var e,n,o,r,i=t.trim().split(this.regExes.parenComma),s=[],a=0,u=i.length;u>a;++a)e=i[a].replace(this.regExes.trimParens,"$1"),n=this.parse.linestring.apply(this,[e]),o=this.geometryFactory.createLinearRing(n.points),0===a?r=o:s.push(o);return this.geometryFactory.createPolygon(r,s)},multipolygon:function(t){if(void 0===t)return this.geometryFactory.createMultiPolygon(null);for(var e,n=t.trim().split(this.regExes.doubleParenComma),o=[],r=0,i=n.length;i>r;++r)e=n[r].replace(this.regExes.trimParens,"$1"),o.push(this.parse.polygon.apply(this,[e]));return this.geometryFactory.createMultiPolygon(o)},geometrycollection:function(t){if(void 0===t)return this.geometryFactory.createGeometryCollection(null);t=t.replace(/,\s*([A-Za-z])/g,"|$1");for(var e=t.trim().split("|"),n=[],o=0,r=e.length;r>o;++o)n.push(jsts.io.WKTParser.prototype.read.apply(this,[e[o]]));return this.geometryFactory.createGeometryCollection(n)}},jsts.index.ItemVisitor=function(){},jsts.index.ItemVisitor.prototype.visitItem=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.algorithm.CGAlgorithms=function(){},jsts.algorithm.CGAlgorithms.CLOCKWISE=-1,jsts.algorithm.CGAlgorithms.RIGHT=jsts.algorithm.CGAlgorithms.CLOCKWISE,jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE=1,jsts.algorithm.CGAlgorithms.LEFT=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE,jsts.algorithm.CGAlgorithms.COLLINEAR=0,jsts.algorithm.CGAlgorithms.STRAIGHT=jsts.algorithm.CGAlgorithms.COLLINEAR,jsts.algorithm.CGAlgorithms.orientationIndex=function(t,e,n){var o,r,i,s;return o=e.x-t.x,r=e.y-t.y,i=n.x-e.x,s=n.y-e.y,jsts.algorithm.RobustDeterminant.signOfDet2x2(o,r,i,s)},jsts.algorithm.CGAlgorithms.isPointInRing=function(t,e){return jsts.algorithm.CGAlgorithms.locatePointInRing(t,e)!==jsts.geom.Location.EXTERIOR},jsts.algorithm.CGAlgorithms.locatePointInRing=function(t,e){return jsts.algorithm.RayCrossingCounter.locatePointInRing(t,e)},jsts.algorithm.CGAlgorithms.isOnLine=function(t,e){var n,o,r,i,s;for(n=new jsts.algorithm.RobustLineIntersector,o=1,r=e.length;r>o;o++)if(i=e[o-1],s=e[o],n.computeIntersection(t,i,s),n.hasIntersection())return!0;return!1},jsts.algorithm.CGAlgorithms.isCCW=function(t){var e,n,o,r,i,s,a,u,p,g,l;if(e=t.length-1,3>e)throw new jsts.IllegalArgumentError("Ring has fewer than 3 points, so orientation cannot be determined");for(n=t[0],o=0,p=1;e>=p;p++)r=t[p],r.y>n.y&&(n=r,o=p);i=o;do i-=1,0>i&&(i=e);while(t[i].equals2D(n)&&i!==o);s=o;do s=(s+1)%e;while(t[s].equals2D(n)&&s!==o);return a=t[i],u=t[s],a.equals2D(n)||u.equals2D(n)||a.equals2D(u)?!1:(g=jsts.algorithm.CGAlgorithms.computeOrientation(a,n,u),l=!1,l=0===g?a.x>u.x:g>0)},jsts.algorithm.CGAlgorithms.computeOrientation=function(t,e,n){return jsts.algorithm.CGAlgorithms.orientationIndex(t,e,n)},jsts.algorithm.CGAlgorithms.distancePointLine=function(t,e,n){if(e instanceof jsts.geom.Coordinate||jsts.algorithm.CGAlgorithms.distancePointLine2.apply(this,arguments),e.x===n.x&&e.y===n.y)return t.distance(e);var o,r;return o=((t.x-e.x)*(n.x-e.x)+(t.y-e.y)*(n.y-e.y))/((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y)),0>=o?t.distance(e):o>=1?t.distance(n):(r=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y)),Math.abs(r)*Math.sqrt((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y)))},jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular=function(t,e,n){var o=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y));return Math.abs(o)*Math.sqrt((n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y))},jsts.algorithm.CGAlgorithms.distancePointLine2=function(t,e){var n,o,r,i;if(0===e.length)throw new jsts.error.IllegalArgumentError("Line array must contain at least one vertex");for(n=t.distance(e[0]),o=0,r=e.length-1;r>o;o++)i=jsts.algorithm.CGAlgorithms.distancePointLine(t,e[o],e[o+1]),n>i&&(n=i);return n},jsts.algorithm.CGAlgorithms.distanceLineLine=function(t,e,n,o){if(t.equals(e))return jsts.algorithm.CGAlgorithms.distancePointLine(t,n,o);if(n.equals(o))return jsts.algorithm.CGAlgorithms.distancePointLine(o,t,e);var r,i,s,a,u,p;return r=(t.y-n.y)*(o.x-n.x)-(t.x-n.x)*(o.y-n.y),i=(e.x-t.x)*(o.y-n.y)-(e.y-t.y)*(o.x-n.x),s=(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y),a=(e.x-t.x)*(o.y-n.y)-(e.y-t.y)*(o.x-n.x),0===i||0===a?Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(t,n,o),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(e,n,o),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(n,t,e),jsts.algorithm.CGAlgorithms.distancePointLine(o,t,e)))):(u=s/a,p=r/i,0>p||p>1||0>u||u>1?Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(t,n,o),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(e,n,o),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(n,t,e),jsts.algorithm.CGAlgorithms.distancePointLine(o,t,e)))):0)},jsts.algorithm.CGAlgorithms.signedArea=function(t){if(t.length<3)return 0;var e,n,o,r,i,s,a;for(e=0,n=0,o=t.length-1;o>n;n++)r=t[n].x,i=t[n].y,s=t[n+1].x,a=t[n+1].y,e+=(r+s)*(a-i);return-e/2},jsts.algorithm.CGAlgorithms.signedArea=function(t){var e,n,o,r,i,s,a,u;if(e=t.length,3>e)return 0;for(n=0,o=t[0],r=o.x,i=o.y,s=1;e>s;s++)o=t[s],a=o.x,u=o.y,n+=(r+a)*(u-i),r=a,i=u;return-n/2},jsts.algorithm.CGAlgorithms.computeLength=function(t){var e,n,o,r,i,s,a,u,p,g,l=t.length;if(1>=l)return 0;for(e=0,u=t[0],n=u.x,o=u.y,p=1,g=l,p;l>p;p++)u=t[p],r=u.x,i=u.y,s=r-n,a=i-o,e+=Math.sqrt(s*s+a*a),n=r,o=i;return e},jsts.algorithm.CGAlgorithms.length=function(){},jsts.algorithm.Angle=function(){},jsts.algorithm.Angle.PI_TIMES_2=2*Math.PI,jsts.algorithm.Angle.PI_OVER_2=Math.PI/2,jsts.algorithm.Angle.PI_OVER_4=Math.PI/4,jsts.algorithm.Angle.COUNTERCLOCKWISE=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE,jsts.algorithm.Angle.CLOCKWISE=jsts.algorithm.CGAlgorithms.CLOCKWISE,jsts.algorithm.Angle.NONE=jsts.algorithm.CGAlgorithms.COLLINEAR,jsts.algorithm.Angle.toDegrees=function(t){return 180*t/Math.PI},jsts.algorithm.Angle.toRadians=function(t){return t*Math.PI/180},jsts.algorithm.Angle.angle=function(){return 1===arguments.length?jsts.algorithm.Angle.angleFromOrigo(arguments[0]):jsts.algorithm.Angle.angleBetweenCoords(arguments[0],arguments[1])},jsts.algorithm.Angle.angleBetweenCoords=function(t,e){var n,o;return n=e.x-t.x,o=e.y-t.y,Math.atan2(o,n)},jsts.algorithm.Angle.angleFromOrigo=function(t){return Math.atan2(t.y,t.x)},jsts.algorithm.Angle.isAcute=function(t,e,n){var o,r,i,s,a;return o=t.x-e.x,r=t.y-e.y,i=n.x-e.x,s=n.y-e.y,a=o*i+r*s,a>0},jsts.algorithm.Angle.isObtuse=function(t,e,n){var o,r,i,s,a;return o=t.x-e.x,r=t.y-e.y,i=n.x-e.x,s=n.y-e.y,a=o*i+r*s,0>a},jsts.algorithm.Angle.angleBetween=function(t,e,n){var o,r;return o=jsts.algorithm.Angle.angle(e,t),r=jsts.algorithm.Angle.angle(e,n),jsts.algorithm.Angle.diff(o,r)},jsts.algorithm.Angle.angleBetweenOriented=function(t,e,n){var o,r,i;return o=jsts.algorithm.Angle.angle(e,t),r=jsts.algorithm.Angle.angle(e,n),i=r-o,i<=-Math.PI?i+jsts.algorithm.Angle.PI_TIMES_2:i>Math.PI?i-jsts.algorithm.Angle.PI_TIMES_2:i},jsts.algorithm.Angle.interiorAngle=function(t,e,n){var o,r;return o=jsts.algorithm.Angle.angle(e,t),r=jsts.algorithm.Angle.angle(e,n),Math.abs(r-o)},jsts.algorithm.Angle.getTurn=function(t,e){var n=Math.sin(e-t);return n>0?jsts.algorithm.Angle.COUNTERCLOCKWISE:0>n?jsts.algorithm.Angle.CLOCKWISE:jsts.algorithm.Angle.NONE},jsts.algorithm.Angle.normalize=function(t){for(;t>Math.PI;)t-=jsts.algorithm.Angle.PI_TIMES_2;for(;t<=-Math.PI;)t+=jsts.algorithm.Angle.PI_TIMES_2;return t},jsts.algorithm.Angle.normalizePositive=function(t){if(0>t){for(;0>t;)t+=jsts.algorithm.Angle.PI_TIMES_2;t>=jsts.algorithm.Angle.PI_TIMES_2&&(t=0)}else{for(;t>=jsts.algorithm.Angle.PI_TIMES_2;)t-=jsts.algorithm.Angle.PI_TIMES_2;0>t&&(t=0)}return t},jsts.algorithm.Angle.diff=function(t,e){var n;return n=e>t?e-t:t-e,n>Math.PI&&(n=2*Math.PI-n),n},jsts.geom.GeometryComponentFilter=function(){},jsts.geom.GeometryComponentFilter.prototype.filter=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.util.LinearComponentExtracter=function(t,e){this.lines=t,this.isForcedToLineString=e},jsts.geom.util.LinearComponentExtracter.prototype=new jsts.geom.GeometryComponentFilter,jsts.geom.util.LinearComponentExtracter.prototype.lines=null,jsts.geom.util.LinearComponentExtracter.prototype.isForcedToLineString=!1,jsts.geom.util.LinearComponentExtracter.getLines=function(t,e){if(1==arguments.length)return jsts.geom.util.LinearComponentExtracter.getLines5.apply(this,arguments);if(2==arguments.length&&"boolean"==typeof e)return jsts.geom.util.LinearComponentExtracter.getLines6.apply(this,arguments);if(2==arguments.length&&t instanceof jsts.geom.Geometry)return jsts.geom.util.LinearComponentExtracter.getLines3.apply(this,arguments);if(3==arguments.length&&t instanceof jsts.geom.Geometry)return jsts.geom.util.LinearComponentExtracter.getLines4.apply(this,arguments);if(3==arguments.length)return jsts.geom.util.LinearComponentExtracter.getLines2.apply(this,arguments);for(var n=0;n<t.length;n++){var o=t[n];jsts.geom.util.LinearComponentExtracter.getLines3(o,e)}return e},jsts.geom.util.LinearComponentExtracter.getLines2=function(t,e,n){for(var o=0;o<t.length;o++){var r=t[o];jsts.geom.util.LinearComponentExtracter.getLines4(r,e,n)}return e},jsts.geom.util.LinearComponentExtracter.getLines3=function(t,e){return t instanceof LineString?e.add(t):t.apply(new jsts.geom.util.LinearComponentExtracter(e)),e},jsts.geom.util.LinearComponentExtracter.getLines4=function(t,e,n){return t.apply(new jsts.geom.util.LinearComponentExtracter(e,n)),e},jsts.geom.util.LinearComponentExtracter.getLines5=function(t){return jsts.geom.util.LinearComponentExtracter.getLines6(t,!1)},jsts.geom.util.LinearComponentExtracter.getLines6=function(t,e){var n=[];return t.apply(new jsts.geom.util.LinearComponentExtracter(n,e)),n},jsts.geom.util.LinearComponentExtracter.prototype.setForceToLineString=function(t){this.isForcedToLineString=t},jsts.geom.util.LinearComponentExtracter.prototype.filter=function(t){if(this.isForcedToLineString&&t instanceof jsts.geom.LinearRing){var e=t.getFactory().createLineString(t.getCoordinateSequence());return void this.lines.push(e)}(t instanceof jsts.geom.LineString||t instanceof jsts.geom.LinearRing)&&this.lines.push(t)},jsts.geom.Location=function(){},jsts.geom.Location.INTERIOR=0,jsts.geom.Location.BOUNDARY=1,jsts.geom.Location.EXTERIOR=2,jsts.geom.Location.NONE=-1,jsts.geom.Location.toLocationSymbol=function(t){switch(t){case jsts.geom.Location.EXTERIOR:return"e";case jsts.geom.Location.BOUNDARY:return"b";case jsts.geom.Location.INTERIOR:return"i";case jsts.geom.Location.NONE:return"-"}throw new jsts.IllegalArgumentError("Unknown location value: "+t)},function(){jsts.io.GeoJSONReader=function(t){this.geometryFactory=t||new jsts.geom.GeometryFactory,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new jsts.io.GeoJSONParser(this.geometryFactory)},jsts.io.GeoJSONReader.prototype.read=function(t){var e=this.parser.read(t);return this.precisionModel.getType()===jsts.geom.PrecisionModel.FIXED&&this.reducePrecision(e),e},jsts.io.GeoJSONReader.prototype.reducePrecision=function(t){var e,n;if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(e=0,n=t.points.length;n>e;e++)this.precisionModel.makePrecise(t.points[e]);else if(t.geometries)for(e=0,n=t.geometries.length;n>e;e++)this.reducePrecision(t.geometries[e])}}(),jsts.geom.Geometry=function(t){this.factory=t},jsts.geom.Geometry.prototype.envelope=null,jsts.geom.Geometry.prototype.factory=null,jsts.geom.Geometry.prototype.getGeometryType=function(){return"Geometry"},jsts.geom.Geometry.hasNonEmptyElements=function(t){var e;for(e=0;e<t.length;e++)if(!t[e].isEmpty())return!0;return!1},jsts.geom.Geometry.hasNullElements=function(t){var e;for(e=0;e<t.length;e++)if(null===t[e])return!0;return!1},jsts.geom.Geometry.prototype.getFactory=function(){return(null===this.factory||void 0===this.factory)&&(this.factory=new jsts.geom.GeometryFactory),this.factory},jsts.geom.Geometry.prototype.getNumGeometries=function(){return 1},jsts.geom.Geometry.prototype.getGeometryN=function(){return this},jsts.geom.Geometry.prototype.getPrecisionModel=function(){return this.getFactory().getPrecisionModel()},jsts.geom.Geometry.prototype.getCoordinate=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.getCoordinates=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.getNumPoints=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.isSimple=function(){this.checkNotGeometryCollection(this);var t=new jsts.operation.IsSimpleOp(this);return t.isSimple()},jsts.geom.Geometry.prototype.isValid=function(){var t=new jsts.operation.valid.IsValidOp(this);return t.isValid()},jsts.geom.Geometry.prototype.isEmpty=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.distance=function(t){return jsts.operation.distance.DistanceOp.distance(this,t)},jsts.geom.Geometry.prototype.isWithinDistance=function(t,e){var n=this.getEnvelopeInternal().distance(t.getEnvelopeInternal());return n>e?!1:DistanceOp.isWithinDistance(this,t,e)},jsts.geom.Geometry.prototype.isRectangle=function(){return!1},jsts.geom.Geometry.prototype.getArea=function(){return 0},jsts.geom.Geometry.prototype.getLength=function(){return 0},jsts.geom.Geometry.prototype.getCentroid=function(){if(this.isEmpty())return null;var t,e=null,n=this.getDimension();return 0===n?(t=new jsts.algorithm.CentroidPoint,t.add(this),e=t.getCentroid()):1===n?(t=new jsts.algorithm.CentroidLine,t.add(this),e=t.getCentroid()):(t=new jsts.algorithm.CentroidArea,t.add(this),e=t.getCentroid()),this.createPointFromInternalCoord(e,this)},jsts.geom.Geometry.prototype.getInteriorPoint=function(){var t,e=null,n=this.getDimension();return 0===n?(t=new jsts.algorithm.InteriorPointPoint(this),e=t.getInteriorPoint()):1===n?(t=new jsts.algorithm.InteriorPointLine(this),e=t.getInteriorPoint()):(t=new jsts.algorithm.InteriorPointArea(this),e=t.getInteriorPoint()),this.createPointFromInternalCoord(e,this)},jsts.geom.Geometry.prototype.getDimension=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.getBoundary=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.getBoundaryDimension=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.getEnvelope=function(){return this.getFactory().toGeometry(this.getEnvelopeInternal())},jsts.geom.Geometry.prototype.getEnvelopeInternal=function(){return null===this.envelope&&(this.envelope=this.computeEnvelopeInternal()),this.envelope},jsts.geom.Geometry.prototype.disjoint=function(t){return!this.intersects(t)},jsts.geom.Geometry.prototype.touches=function(t){return this.getEnvelopeInternal().intersects(t.getEnvelopeInternal())?this.relate(t).isTouches(this.getDimension(),t.getDimension()):!1},jsts.geom.Geometry.prototype.intersects=function(t){return this.getEnvelopeInternal().intersects(t.getEnvelopeInternal())?this.isRectangle()?jsts.operation.predicate.RectangleIntersects.intersects(this,t):t.isRectangle()?jsts.operation.predicate.RectangleIntersects.intersects(t,this):this.relate(t).isIntersects():!1},jsts.geom.Geometry.prototype.crosses=function(t){return this.getEnvelopeInternal().intersects(t.getEnvelopeInternal())?this.relate(t).isCrosses(this.getDimension(),t.getDimension()):!1},jsts.geom.Geometry.prototype.within=function(t){return t.contains(this)},jsts.geom.Geometry.prototype.contains=function(t){return this.getEnvelopeInternal().contains(t.getEnvelopeInternal())?this.isRectangle()?jsts.operation.predicate.RectangleContains.contains(this,t):this.relate(t).isContains():!1},jsts.geom.Geometry.prototype.overlaps=function(t){return this.getEnvelopeInternal().intersects(t.getEnvelopeInternal())?this.relate(t).isOverlaps(this.getDimension(),t.getDimension()):!1},jsts.geom.Geometry.prototype.covers=function(t){return this.getEnvelopeInternal().covers(t.getEnvelopeInternal())?this.isRectangle()?!0:this.relate(t).isCovers():!1},jsts.geom.Geometry.prototype.coveredBy=function(t){return t.covers(this)},jsts.geom.Geometry.prototype.relate=function(t,e){return 1===arguments.length?this.relate2.apply(this,arguments):this.relate2(t).matches(e)},jsts.geom.Geometry.prototype.relate2=function(t){return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),jsts.operation.relate.RelateOp.relate(this,t)},jsts.geom.Geometry.prototype.equalsTopo=function(t){return this.getEnvelopeInternal().equals(t.getEnvelopeInternal())?this.relate(t).isEquals(this.getDimension(),t.getDimension()):!1},jsts.geom.Geometry.prototype.equals=function(t){return t instanceof jsts.geom.Geometry||t instanceof jsts.geom.LinearRing||t instanceof jsts.geom.Polygon||t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.MultiPolygon?this.equalsExact(t):!1},jsts.geom.Geometry.prototype.buffer=function(t,e,n){var o=new jsts.operation.buffer.BufferParameters(e,n);return jsts.operation.buffer.BufferOp.bufferOp2(this,t,o)},jsts.geom.Geometry.prototype.convexHull=function(){return new jsts.algorithm.ConvexHull(this).getConvexHull()},jsts.geom.Geometry.prototype.intersection=function(t){if(this.isEmpty())return this.getFactory().createGeometryCollection(null);if(t.isEmpty())return this.getFactory().createGeometryCollection(null);if(this.isGeometryCollection(this));return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,t,jsts.operation.overlay.OverlayOp.INTERSECTION)},jsts.geom.Geometry.prototype.union=function(t){return 0===arguments.length?jsts.operation.union.UnaryUnionOp.union(this):this.isEmpty()?t.clone():t.isEmpty()?this.clone():(this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,t,jsts.operation.overlay.OverlayOp.UNION))},jsts.geom.Geometry.prototype.difference=function(t){return this.isEmpty()?this.getFactory().createGeometryCollection(null):t.isEmpty()?this.clone():(this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,t,jsts.operation.overlay.OverlayOp.DIFFERENCE))},jsts.geom.Geometry.prototype.symDifference=function(t){return this.isEmpty()?t.clone():t.isEmpty()?this.clone():(this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,t,jsts.operation.overlay.OverlayOp.SYMDIFFERENCE))},jsts.geom.Geometry.prototype.equalsExact=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.equalsNorm=function(t){return null===t||void 0===t?!1:this.norm().equalsExact(t.norm())},jsts.geom.Geometry.prototype.apply=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.clone=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.normalize=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.norm=function(){var t=this.clone();return t.normalize(),t},jsts.geom.Geometry.prototype.compareTo=function(t){var e=t;return this.getClassSortIndex()!==e.getClassSortIndex()?this.getClassSortIndex()-e.getClassSortIndex():this.isEmpty()&&e.isEmpty()?0:this.isEmpty()?-1:e.isEmpty()?1:this.compareToSameClass(t)},jsts.geom.Geometry.prototype.isEquivalentClass=function(t){return this instanceof jsts.geom.Point&&t instanceof jsts.geom.Point?!0:this instanceof jsts.geom.LineString&&t instanceof jsts.geom.LineString|t instanceof jsts.geom.LinearRing?!0:this instanceof jsts.geom.LinearRing&&t instanceof jsts.geom.LineString|t instanceof jsts.geom.LinearRing?!0:this instanceof jsts.geom.Polygon&&t instanceof jsts.geom.Polygon?!0:this instanceof jsts.geom.MultiPoint&&t instanceof jsts.geom.MultiPoint?!0:this instanceof jsts.geom.MultiLineString&&t instanceof jsts.geom.MultiLineString?!0:this instanceof jsts.geom.MultiPolygon&&t instanceof jsts.geom.MultiPolygon?!0:this instanceof jsts.geom.GeometryCollection&&t instanceof jsts.geom.GeometryCollection?!0:!1},jsts.geom.Geometry.prototype.checkNotGeometryCollection=function(t){if(t.isGeometryCollectionBase())throw new jsts.error.IllegalArgumentError("This method does not support GeometryCollection")},jsts.geom.Geometry.prototype.isGeometryCollection=function(){return this instanceof jsts.geom.GeometryCollection},jsts.geom.Geometry.prototype.isGeometryCollectionBase=function(){return"jsts.geom.GeometryCollection"===this.CLASS_NAME},jsts.geom.Geometry.prototype.computeEnvelopeInternal=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.compareToSameClass=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.Geometry.prototype.compare=function(t,e){for(var n=t.iterator(),o=e.iterator();n.hasNext()&&o.hasNext();){var r=n.next(),i=o.next(),s=r.compareTo(i);if(0!==s)return s}return n.hasNext()?1:o.hasNext()?-1:0},jsts.geom.Geometry.prototype.equal=function(t,e,n){return void 0===n||null===n||0===n?t.equals(e):t.distance(e)<=n},jsts.geom.Geometry.prototype.getClassSortIndex=function(){for(var t=[jsts.geom.Point,jsts.geom.MultiPoint,jsts.geom.LineString,jsts.geom.LinearRing,jsts.geom.MultiLineString,jsts.geom.Polygon,jsts.geom.MultiPolygon,jsts.geom.GeometryCollection],e=0;e<t.length;e++)if(this instanceof t[e])return e;return jsts.util.Assert.shouldNeverReachHere("Class not supported: "+this),-1},jsts.geom.Geometry.prototype.toString=function(){return(new jsts.io.WKTWriter).write(this)},jsts.geom.Geometry.prototype.createPointFromInternalCoord=function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)},function(){jsts.geom.Coordinate=function(t,e){"number"==typeof t?(this.x=t,this.y=e):t instanceof jsts.geom.Coordinate?(this.x=parseFloat(t.x),this.y=parseFloat(t.y)):void 0===t||null===t?(this.x=0,this.y=0):"string"==typeof t&&(this.x=parseFloat(t),this.y=parseFloat(e))},jsts.geom.Coordinate.prototype.setCoordinate=function(t){this.x=t.x,this.y=t.y},jsts.geom.Coordinate.prototype.clone=function(){return new jsts.geom.Coordinate(this.x,this.y)},jsts.geom.Coordinate.prototype.distance=function(t){var e=this.x-t.x,n=this.y-t.y;return Math.sqrt(e*e+n*n)},jsts.geom.Coordinate.prototype.equals2D=function(t){return this.x!==t.x?!1:this.y!==t.y?!1:!0},jsts.geom.Coordinate.prototype.equals=function(t){return!t instanceof jsts.geom.Coordinate||void 0===t?!1:this.equals2D(t)},jsts.geom.Coordinate.prototype.compareTo=function(t){return this.x<t.x?-1:this.x>t.x?1:this.y<t.y?-1:this.y>t.y?1:0},jsts.geom.Coordinate.prototype.toString=function(){return"("+this.x+", "+this.y+")"}}(),jsts.geom.Envelope=function(){jsts.geom.Envelope.prototype.init.apply(this,arguments)},jsts.geom.Envelope.prototype.minx=null,jsts.geom.Envelope.prototype.maxx=null,jsts.geom.Envelope.prototype.miny=null,jsts.geom.Envelope.prototype.maxy=null,jsts.geom.Envelope.prototype.init=function(){"number"==typeof arguments[0]&&4===arguments.length?this.initFromValues(arguments[0],arguments[1],arguments[2],arguments[3]):arguments[0]instanceof jsts.geom.Coordinate&&1===arguments.length?this.initFromCoordinate(arguments[0]):arguments[0]instanceof jsts.geom.Coordinate&&2===arguments.length?this.initFromCoordinates(arguments[0],arguments[1]):arguments[0]instanceof jsts.geom.Envelope&&1===arguments.length?this.initFromEnvelope(arguments[0]):this.setToNull()},jsts.geom.Envelope.prototype.initFromValues=function(t,e,n,o){e>t?(this.minx=t,this.maxx=e):(this.minx=e,this.maxx=t),o>n?(this.miny=n,this.maxy=o):(this.miny=o,this.maxy=n)},jsts.geom.Envelope.prototype.initFromCoordinates=function(t,e){this.initFromValues(t.x,e.x,t.y,e.y)},jsts.geom.Envelope.prototype.initFromCoordinate=function(t){this.initFromValues(t.x,t.x,t.y,t.y)},jsts.geom.Envelope.prototype.initFromEnvelope=function(t){this.minx=t.minx,this.maxx=t.maxx,this.miny=t.miny,this.maxy=t.maxy},jsts.geom.Envelope.prototype.setToNull=function(){this.minx=0,this.maxx=-1,this.miny=0,this.maxy=-1},jsts.geom.Envelope.prototype.isNull=function(){return this.maxx<this.minx},jsts.geom.Envelope.prototype.getHeight=function(){return this.isNull()?0:this.maxy-this.miny},jsts.geom.Envelope.prototype.getWidth=function(){return this.isNull()?0:this.maxx-this.minx},jsts.geom.Envelope.prototype.getMinX=function(){return this.minx},jsts.geom.Envelope.prototype.getMaxX=function(){return this.maxx},jsts.geom.Envelope.prototype.getMinY=function(){return this.miny},jsts.geom.Envelope.prototype.getMaxY=function(){return this.maxy},jsts.geom.Envelope.prototype.getArea=function(){return this.getWidth()*this.getHeight()},jsts.geom.Envelope.prototype.expandToInclude=function(){arguments[0]instanceof jsts.geom.Coordinate?this.expandToIncludeCoordinate(arguments[0]):arguments[0]instanceof jsts.geom.Envelope?this.expandToIncludeEnvelope(arguments[0]):this.expandToIncludeValues(arguments[0],arguments[1])},jsts.geom.Envelope.prototype.expandToIncludeCoordinate=function(t){this.expandToIncludeValues(t.x,t.y)},jsts.geom.Envelope.prototype.expandToIncludeValues=function(t,e){this.isNull()?(this.minx=t,this.maxx=t,this.miny=e,this.maxy=e):(t<this.minx&&(this.minx=t),t>this.maxx&&(this.maxx=t),e<this.miny&&(this.miny=e),e>this.maxy&&(this.maxy=e))},jsts.geom.Envelope.prototype.expandToIncludeEnvelope=function(t){t.isNull()||(this.isNull()?(this.minx=t.getMinX(),this.maxx=t.getMaxX(),this.miny=t.getMinY(),this.maxy=t.getMaxY()):(t.minx<this.minx&&(this.minx=t.minx),t.maxx>this.maxx&&(this.maxx=t.maxx),t.miny<this.miny&&(this.miny=t.miny),t.maxy>this.maxy&&(this.maxy=t.maxy)))},jsts.geom.Envelope.prototype.expandBy=function(){1===arguments.length?this.expandByDistance(arguments[0]):this.expandByDistances(arguments[0],arguments[1])},jsts.geom.Envelope.prototype.expandByDistance=function(t){this.expandByDistances(t,t)},jsts.geom.Envelope.prototype.expandByDistances=function(t,e){this.isNull()||(this.minx-=t,this.maxx+=t,this.miny-=e,this.maxy+=e,(this.minx>this.maxx||this.miny>this.maxy)&&this.setToNull())},jsts.geom.Envelope.prototype.translate=function(t,e){this.isNull()||this.init(this.minx+t,this.maxx+t,this.miny+e,this.maxy+e)},jsts.geom.Envelope.prototype.centre=function(){return this.isNull()?null:new jsts.geom.Coordinate((this.minx+this.maxx)/2,(this.miny+this.maxy)/2)},jsts.geom.Envelope.prototype.intersection=function(t){if(this.isNull()||t.isNull()||!this.intersects(t))return new jsts.geom.Envelope;var e=this.minx>t.minx?this.minx:t.minx,n=this.miny>t.miny?this.miny:t.miny,o=this.maxx<t.maxx?this.maxx:t.maxx,r=this.maxy<t.maxy?this.maxy:t.maxy;return new jsts.geom.Envelope(e,o,n,r)},jsts.geom.Envelope.prototype.intersects=function(){return arguments[0]instanceof jsts.geom.Envelope?this.intersectsEnvelope(arguments[0]):arguments[0]instanceof jsts.geom.Coordinate?this.intersectsCoordinate(arguments[0]):this.intersectsValues(arguments[0],arguments[1])},jsts.geom.Envelope.prototype.intersectsEnvelope=function(t){if(this.isNull()||t.isNull())return!1;var e=!(t.minx>this.maxx||t.maxx<this.minx||t.miny>this.maxy||t.maxy<this.miny);return e},jsts.geom.Envelope.prototype.intersectsCoordinate=function(t){return this.intersectsValues(t.x,t.y)},jsts.geom.Envelope.prototype.intersectsValues=function(t,e){return this.isNull()?!1:!(t>this.maxx||t<this.minx||e>this.maxy||e<this.miny)},jsts.geom.Envelope.prototype.contains=function(){return arguments[0]instanceof jsts.geom.Envelope?this.containsEnvelope(arguments[0]):arguments[0]instanceof jsts.geom.Coordinate?this.containsCoordinate(arguments[0]):this.containsValues(arguments[0],arguments[1])},jsts.geom.Envelope.prototype.containsEnvelope=function(t){return this.coversEnvelope(t)},jsts.geom.Envelope.prototype.containsCoordinate=function(t){return this.coversCoordinate(t)},jsts.geom.Envelope.prototype.containsValues=function(t,e){return this.coversValues(t,e)},jsts.geom.Envelope.prototype.covers=function(){return arguments[0]instanceof jsts.geom.Envelope?this.coversEnvelope(arguments[0]):arguments[0]instanceof jsts.geom.Coordinate?this.coversCoordinate(arguments[0]):this.coversValues(arguments[0],arguments[1])},jsts.geom.Envelope.prototype.coversValues=function(t,e){return this.isNull()?!1:t>=this.minx&&t<=this.maxx&&e>=this.miny&&e<=this.maxy},jsts.geom.Envelope.prototype.coversCoordinate=function(t){return this.coversValues(t.x,t.y)},jsts.geom.Envelope.prototype.coversEnvelope=function(t){return this.isNull()||t.isNull()?!1:t.minx>=this.minx&&t.maxx<=this.maxx&&t.miny>=this.miny&&t.maxy<=this.maxy},jsts.geom.Envelope.prototype.distance=function(t){if(this.intersects(t))return 0;var e=0;this.maxx<t.minx&&(e=t.minx-this.maxx),this.minx>t.maxx&&(e=this.minx-t.maxx);var n=0;return this.maxy<t.miny&&(n=t.miny-this.maxy),this.miny>t.maxy&&(n=this.miny-t.maxy),0===e?n:0===n?e:Math.sqrt(e*e+n*n)},jsts.geom.Envelope.prototype.equals=function(t){return this.isNull()?t.isNull():this.maxx===t.maxx&&this.maxy===t.maxy&&this.minx===t.minx&&this.miny===t.miny},jsts.geom.Envelope.prototype.toString=function(){return"Env["+this.minx+" : "+this.maxx+", "+this.miny+" : "+this.maxy+"]"
},jsts.geom.Envelope.intersects=function(t,e,n){if(4===arguments.length)return jsts.geom.Envelope.intersectsEnvelope(arguments[0],arguments[1],arguments[2],arguments[3]);var o=t.x<e.x?t.x:e.x,r=t.x>e.x?t.x:e.x,i=t.y<e.y?t.y:e.y,s=t.y>e.y?t.y:e.y;return n.x>=o&&n.x<=r&&n.y>=i&&n.y<=s?!0:!1},jsts.geom.Envelope.intersectsEnvelope=function(t,e,n,o){var r=Math.min(n.x,o.x),i=Math.max(n.x,o.x),s=Math.min(t.x,e.x),a=Math.max(t.x,e.x);return s>i?!1:r>a?!1:(r=Math.min(n.y,o.y),i=Math.max(n.y,o.y),s=Math.min(t.y,e.y),a=Math.max(t.y,e.y),s>i?!1:r>a?!1:!0)},jsts.geom.Envelope.prototype.clone=function(){return new jsts.geom.Envelope(this.minx,this.maxx,this.miny,this.maxy)},jsts.geom.util.GeometryCombiner=function(t){this.geomFactory=jsts.geom.util.GeometryCombiner.extractFactory(t),this.inputGeoms=t},jsts.geom.util.GeometryCombiner.combine=function(t){if(arguments.length>1)return this.combine2.apply(this,arguments);var e=new jsts.geom.util.GeometryCombiner(t);return e.combine()},jsts.geom.util.GeometryCombiner.combine2=function(){var t=new javascript.util.ArrayList;Array.prototype.slice.call(arguments).forEach(function(e){t.add(e)});var e=new jsts.geom.util.GeometryCombiner(t);return e.combine()},jsts.geom.util.GeometryCombiner.prototype.geomFactory=null,jsts.geom.util.GeometryCombiner.prototype.skipEmpty=!1,jsts.geom.util.GeometryCombiner.prototype.inputGeoms,jsts.geom.util.GeometryCombiner.extractFactory=function(t){return t.isEmpty()?null:t.iterator().next().getFactory()},jsts.geom.util.GeometryCombiner.prototype.combine=function(){var t,e=new javascript.util.ArrayList;for(t=this.inputGeoms.iterator();t.hasNext();){var n=t.next();this.extractElements(n,e)}return 0===e.size()?null!==this.geomFactory?this.geomFactory.createGeometryCollection(null):null:this.geomFactory.buildGeometry(e)},jsts.geom.util.GeometryCombiner.prototype.extractElements=function(t,e){if(null!==t)for(var n=0;n<t.getNumGeometries();n++){var o=t.getGeometryN(n);this.skipEmpty&&o.isEmpty()||e.add(o)}},jsts.geom.PrecisionModel=function(t){return"number"==typeof t?(this.modelType=jsts.geom.PrecisionModel.FIXED,void(this.scale=t)):(this.modelType=t||jsts.geom.PrecisionModel.FLOATING,void(this.modelType===jsts.geom.PrecisionModel.FIXED&&(this.scale=1)))},jsts.geom.PrecisionModel.FLOATING="FLOATING",jsts.geom.PrecisionModel.FIXED="FIXED",jsts.geom.PrecisionModel.FLOATING_SINGLE="FLOATING_SINGLE",jsts.geom.PrecisionModel.prototype.scale=null,jsts.geom.PrecisionModel.prototype.modelType=null,jsts.geom.PrecisionModel.prototype.isFloating=function(){return this.modelType===jsts.geom.PrecisionModel.FLOATING||this.modelType===jsts.geom.PrecisionModel.FLOATING_SINLGE},jsts.geom.PrecisionModel.prototype.getScale=function(){return this.scale},jsts.geom.PrecisionModel.prototype.getType=function(){return this.modelType},jsts.geom.PrecisionModel.prototype.equals=function(t){return!0},jsts.geom.PrecisionModel.prototype.makePrecise=function(t){return t instanceof jsts.geom.Coordinate?void this.makePrecise2(t):isNaN(t)?t:this.modelType===jsts.geom.PrecisionModel.FIXED?Math.round(t*this.scale)/this.scale:t},jsts.geom.PrecisionModel.prototype.makePrecise2=function(t){this.modelType!==jsts.geom.PrecisionModel.FLOATING&&(t.x=this.makePrecise(t.x),t.y=this.makePrecise(t.y))},jsts.geom.PrecisionModel.prototype.compareTo=function(t){return 0},jsts.geom.CoordinateFilter=function(){},jsts.geom.CoordinateFilter.prototype.filter=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.simplify.DouglasPeuckerLineSimplifier=function(t){this.pts=t,this.seg=new jsts.geom.LineSegment},jsts.simplify.DouglasPeuckerLineSimplifier.prototype.pts=null,jsts.simplify.DouglasPeuckerLineSimplifier.prototype.usePt=null,jsts.simplify.DouglasPeuckerLineSimplifier.prototype.distanceTolerance=null,jsts.simplify.DouglasPeuckerLineSimplifier.simplify=function(t,e){var n=new jsts.simplify.DouglasPeuckerLineSimplifier(t);return n.setDistanceTolerance(e),n.simplify()},jsts.simplify.DouglasPeuckerLineSimplifier.prototype.setDistanceTolerance=function(t){this.distanceTolerance=t},jsts.simplify.DouglasPeuckerLineSimplifier.prototype.simplify=function(){this.usePt=[];for(var t=0;t<this.pts.length;t++)this.usePt[t]=!0;this.simplifySection(0,this.pts.length-1);for(var e=new jsts.geom.CoordinateList,n=0;n<this.pts.length;n++)this.usePt[n]&&e.add(new jsts.geom.Coordinate(this.pts[n]));return e.toCoordinateArray()},jsts.simplify.DouglasPeuckerLineSimplifier.prototype.seg=null,jsts.simplify.DouglasPeuckerLineSimplifier.prototype.simplifySection=function(t,e){if(t+1!=e){this.seg.p0=this.pts[t],this.seg.p1=this.pts[e];for(var n=-1,o=t,r=t+1;e>r;r++){var i=this.seg.distance(this.pts[r]);i>n&&(n=i,o=r)}if(n<=this.distanceTolerance)for(var s=t+1;e>s;s++)this.usePt[s]=!1;else this.simplifySection(t,o),this.simplifySection(o,e)}},jsts.geomgraph.EdgeIntersection=function(t,e,n){this.coord=new jsts.geom.Coordinate(t),this.segmentIndex=e,this.dist=n},jsts.geomgraph.EdgeIntersection.prototype.coord=null,jsts.geomgraph.EdgeIntersection.prototype.segmentIndex=null,jsts.geomgraph.EdgeIntersection.prototype.dist=null,jsts.geomgraph.EdgeIntersection.prototype.getCoordinate=function(){return this.coord},jsts.geomgraph.EdgeIntersection.prototype.getSegmentIndex=function(){return this.segmentIndex},jsts.geomgraph.EdgeIntersection.prototype.getDistance=function(){return this.dist},jsts.geomgraph.EdgeIntersection.prototype.compareTo=function(t){return this.compare(t.segmentIndex,t.dist)},jsts.geomgraph.EdgeIntersection.prototype.compare=function(t,e){return this.segmentIndex<t?-1:this.segmentIndex>t?1:this.dist<e?-1:this.dist>e?1:0},jsts.geomgraph.EdgeIntersection.prototype.isEndPoint=function(t){return 0===this.segmentIndex&&0===this.dist?!0:this.segmentIndex===t?!0:!1},jsts.geomgraph.EdgeIntersection.prototype.toString=function(){return""+this.segmentIndex+this.dist},function(){var t=jsts.geomgraph.EdgeIntersection,e=javascript.util.TreeMap;jsts.geomgraph.EdgeIntersectionList=function(t){this.nodeMap=new e,this.edge=t},jsts.geomgraph.EdgeIntersectionList.prototype.nodeMap=null,jsts.geomgraph.EdgeIntersectionList.prototype.edge=null,jsts.geomgraph.EdgeIntersectionList.prototype.isIntersection=function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();if(n.coord.equals(t))return!0}return!1},jsts.geomgraph.EdgeIntersectionList.prototype.add=function(e,n,o){var r=new t(e,n,o),i=this.nodeMap.get(r);return null!==i?i:(this.nodeMap.put(r,r),r)},jsts.geomgraph.EdgeIntersectionList.prototype.iterator=function(){return this.nodeMap.values().iterator()},jsts.geomgraph.EdgeIntersectionList.prototype.addEndpoints=function(){var t=this.edge.pts.length-1;this.add(this.edge.pts[0],0,0),this.add(this.edge.pts[t],t,0)},jsts.geomgraph.EdgeIntersectionList.prototype.addSplitEdges=function(t){this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var o=e.next(),r=this.createSplitEdge(n,o);t.add(r),n=o}},jsts.geomgraph.EdgeIntersectionList.prototype.createSplitEdge=function(t,e){var n=e.segmentIndex-t.segmentIndex+2,o=this.edge.pts[e.segmentIndex],r=e.dist>0||!e.coord.equals2D(o);r||n--;var i=[],s=0;i[s++]=new jsts.geom.Coordinate(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)i[s++]=this.edge.pts[a];return r&&(i[s]=e.coord),new jsts.geomgraph.Edge(i,new jsts.geomgraph.Label(this.edge.label))}}(),function(){var t=function(t){this.message=t};t.prototype=new Error,t.prototype.name="AssertionFailedException",jsts.util.AssertionFailedException=t}(),function(){var t=jsts.util.AssertionFailedException;jsts.util.Assert=function(){},jsts.util.Assert.isTrue=function(e,n){if(!e)throw null===n?new t:new t(n)},jsts.util.Assert.equals=function(e,n,o){if(!n.equals(e))throw new t("Expected "+e+" but encountered "+n+(null!=o?": "+o:""))},jsts.util.Assert.shouldNeverReachHere=function(e){throw new t("Should never reach here"+(null!=e?": "+e:""))}}(),function(){var t=jsts.geom.Location,e=jsts.util.Assert,n=javascript.util.ArrayList;jsts.operation.relate.RelateComputer=function(t){this.li=new jsts.algorithm.RobustLineIntersector,this.ptLocator=new jsts.algorithm.PointLocator,this.nodes=new jsts.geomgraph.NodeMap(new jsts.operation.relate.RelateNodeFactory),this.isolatedEdges=new n,this.arg=t},jsts.operation.relate.RelateComputer.prototype.li=null,jsts.operation.relate.RelateComputer.prototype.ptLocator=null,jsts.operation.relate.RelateComputer.prototype.arg=null,jsts.operation.relate.RelateComputer.prototype.nodes=null,jsts.operation.relate.RelateComputer.prototype.im=null,jsts.operation.relate.RelateComputer.prototype.isolatedEdges=null,jsts.operation.relate.RelateComputer.prototype.invalidPoint=null,jsts.operation.relate.RelateComputer.prototype.computeIM=function(){var e=new jsts.geom.IntersectionMatrix;if(e.set(t.EXTERIOR,t.EXTERIOR,2),!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal()))return this.computeDisjointIM(e),e;this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1);var n=this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!1);this.computeIntersectionNodes(0),this.computeIntersectionNodes(1),this.copyNodesAndLabels(0),this.copyNodesAndLabels(1),this.labelIsolatedNodes(),this.computeProperIntersectionIM(n,e);var o=new jsts.operation.relate.EdgeEndBuilder,r=o.computeEdgeEnds(this.arg[0].getEdgeIterator());this.insertEdgeEnds(r);var i=o.computeEdgeEnds(this.arg[1].getEdgeIterator());return this.insertEdgeEnds(i),this.labelNodeEdges(),this.labelIsolatedEdges(0,1),this.labelIsolatedEdges(1,0),this.updateIM(e),e},jsts.operation.relate.RelateComputer.prototype.insertEdgeEnds=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},jsts.operation.relate.RelateComputer.prototype.computeProperIntersectionIM=function(t,e){var n=this.arg[0].getGeometry().getDimension(),o=this.arg[1].getGeometry().getDimension(),r=t.hasProperIntersection(),i=t.hasProperInteriorIntersection();2===n&&2===o?r&&e.setAtLeast("212101212"):2===n&&1===o?(r&&e.setAtLeast("FFF0FFFF2"),i&&e.setAtLeast("1FFFFF1FF")):1===n&&2===o?(r&&e.setAtLeast("F0FFFFFF2"),i&&e.setAtLeast("1F1FFFFFF")):1===n&&1===o&&i&&e.setAtLeast("0FFFFFFFF")},jsts.operation.relate.RelateComputer.prototype.copyNodesAndLabels=function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),o=this.nodes.addNode(n.getCoordinate());o.setLabel(t,n.getLabel().getLocation(t))}},jsts.operation.relate.RelateComputer.prototype.computeIntersectionNodes=function(e){for(var n=this.arg[e].getEdgeIterator();n.hasNext();)for(var o=n.next(),r=o.getLabel().getLocation(e),i=o.getEdgeIntersectionList().iterator();i.hasNext();){var s=i.next(),a=this.nodes.addNode(s.coord);r===t.BOUNDARY?a.setLabelBoundary(e):a.getLabel().isNull(e)&&a.setLabel(e,t.INTERIOR)}},jsts.operation.relate.RelateComputer.prototype.labelIntersectionNodes=function(e){for(var n=this.arg[e].getEdgeIterator();n.hasNext();)for(var o=n.next(),r=o.getLabel().getLocation(e),i=o.getEdgeIntersectionList().iterator();i.hasNext();){var s=i.next(),a=this.nodes.find(s.coord);a.getLabel().isNull(e)&&(r===t.BOUNDARY?a.setLabelBoundary(e):a.setLabel(e,t.INTERIOR))}},jsts.operation.relate.RelateComputer.prototype.computeDisjointIM=function(e){var n=this.arg[0].getGeometry();n.isEmpty()||(e.set(t.INTERIOR,t.EXTERIOR,n.getDimension()),e.set(t.BOUNDARY,t.EXTERIOR,n.getBoundaryDimension()));var o=this.arg[1].getGeometry();o.isEmpty()||(e.set(t.EXTERIOR,t.INTERIOR,o.getDimension()),e.set(t.EXTERIOR,t.BOUNDARY,o.getBoundaryDimension()))},jsts.operation.relate.RelateComputer.prototype.labelNodeEdges=function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}},jsts.operation.relate.RelateComputer.prototype.updateIM=function(t){for(var e=this.isolatedEdges.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}for(var o=this.nodes.iterator();o.hasNext();){var r=o.next();r.updateIM(t),r.updateIMFromEdges(t)}},jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdges=function(t,e){for(var n=this.arg[t].getEdgeIterator();n.hasNext();){var o=n.next();o.isIsolated()&&(this.labelIsolatedEdge(o,e,this.arg[e].getGeometry()),this.isolatedEdges.add(o))}},jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdge=function(e,n,o){if(o.getDimension()>0){var r=this.ptLocator.locate(e.getCoordinate(),o);e.getLabel().setAllLocations(n,r)}else e.getLabel().setAllLocations(n,t.EXTERIOR)},jsts.operation.relate.RelateComputer.prototype.labelIsolatedNodes=function(){for(var t=this.nodes.iterator();t.hasNext();){var n=t.next(),o=n.getLabel();e.isTrue(o.getGeometryCount()>0,"node with empty label found"),n.isIsolated()&&(o.isNull(0)?this.labelIsolatedNode(n,0):this.labelIsolatedNode(n,1))}},jsts.operation.relate.RelateComputer.prototype.labelIsolatedNode=function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setAllLocations(e,n)}}(),function(){var t=jsts.util.Assert;jsts.geomgraph.GraphComponent=function(t){this.label=t},jsts.geomgraph.GraphComponent.prototype.label=null,jsts.geomgraph.GraphComponent.prototype._isInResult=!1,jsts.geomgraph.GraphComponent.prototype._isCovered=!1,jsts.geomgraph.GraphComponent.prototype._isCoveredSet=!1,jsts.geomgraph.GraphComponent.prototype._isVisited=!1,jsts.geomgraph.GraphComponent.prototype.getLabel=function(){return this.label},jsts.geomgraph.GraphComponent.prototype.setLabel=function(t){return 2===arguments.length?void this.setLabel2.apply(this,arguments):void(this.label=t)},jsts.geomgraph.GraphComponent.prototype.setInResult=function(t){this._isInResult=t},jsts.geomgraph.GraphComponent.prototype.isInResult=function(){return this._isInResult},jsts.geomgraph.GraphComponent.prototype.setCovered=function(t){this._isCovered=t,this._isCoveredSet=!0},jsts.geomgraph.GraphComponent.prototype.isCovered=function(){return this._isCovered},jsts.geomgraph.GraphComponent.prototype.isCoveredSet=function(){return this._isCoveredSet},jsts.geomgraph.GraphComponent.prototype.isVisited=function(){return this._isVisited},jsts.geomgraph.GraphComponent.prototype.setVisited=function(t){this._isVisited=t},jsts.geomgraph.GraphComponent.prototype.getCoordinate=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.GraphComponent.prototype.computeIM=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.GraphComponent.prototype.isIsolated=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.GraphComponent.prototype.updateIM=function(e){t.isTrue(this.label.getGeometryCount()>=2,"found partial label"),this.computeIM(e)}}(),jsts.geomgraph.Node=function(t,e){this.coord=t,this.edges=e,this.label=new jsts.geomgraph.Label(0,jsts.geom.Location.NONE)},jsts.geomgraph.Node.prototype=new jsts.geomgraph.GraphComponent,jsts.geomgraph.Node.prototype.coord=null,jsts.geomgraph.Node.prototype.edges=null,jsts.geomgraph.Node.prototype.isIsolated=function(){return 1==this.label.getGeometryCount()},jsts.geomgraph.Node.prototype.setLabel2=function(t,e){null===this.label?this.label=new jsts.geomgraph.Label(t,e):this.label.setLocation(t,e)},jsts.geomgraph.Node.prototype.setLabelBoundary=function(t){var e=jsts.geom.Location.NONE;null!==this.label&&(e=this.label.getLocation(t));var n;switch(e){case jsts.geom.Location.BOUNDARY:n=jsts.geom.Location.INTERIOR;break;case jsts.geom.Location.INTERIOR:n=jsts.geom.Location.BOUNDARY;break;default:n=jsts.geom.Location.BOUNDARY}this.label.setLocation(t,n)},jsts.geomgraph.Node.prototype.add=function(t){this.edges.insert(t),t.setNode(this)},jsts.geomgraph.Node.prototype.getCoordinate=function(){return this.coord},jsts.geomgraph.Node.prototype.getEdges=function(){return this.edges},jsts.geomgraph.Node.prototype.isIncidentEdgeInResult=function(){for(var t=this.getEdges().getEdges().iterator();t.hasNext();){var e=t.next();if(e.getEdge().isInResult())return!0}return!1},jsts.geom.Point=function(t,e){this.factory=e,void 0!==t&&(this.coordinate=t)},jsts.geom.Point.prototype=new jsts.geom.Geometry,jsts.geom.Point.constructor=jsts.geom.Point,jsts.geom.Point.CLASS_NAME="jsts.geom.Point",jsts.geom.Point.prototype.coordinate=null,jsts.geom.Point.prototype.getX=function(){return this.coordinate.x},jsts.geom.Point.prototype.getY=function(){return this.coordinate.y},jsts.geom.Point.prototype.getCoordinate=function(){return this.coordinate},jsts.geom.Point.prototype.getCoordinates=function(){return this.isEmpty()?[]:[this.coordinate]},jsts.geom.Point.prototype.getCoordinateSequence=function(){return this.isEmpty()?[]:[this.coordinate]},jsts.geom.Point.prototype.isEmpty=function(){return null===this.coordinate},jsts.geom.Point.prototype.equalsExact=function(t,e){return this.isEquivalentClass(t)?this.isEmpty()&&t.isEmpty()?!0:this.equal(t.getCoordinate(),this.getCoordinate(),e):!1},jsts.geom.Point.prototype.getNumPoints=function(){return this.isEmpty()?0:1},jsts.geom.Point.prototype.isSimple=function(){return!0},jsts.geom.Point.prototype.getBoundary=function(){return new jsts.geom.GeometryCollection(null)},jsts.geom.Point.prototype.computeEnvelopeInternal=function(){return this.isEmpty()?new jsts.geom.Envelope:new jsts.geom.Envelope(this.coordinate)},jsts.geom.Point.prototype.apply=function(t){if(t instanceof jsts.geom.GeometryFilter||t instanceof jsts.geom.GeometryComponentFilter)t.filter(this);else if(t instanceof jsts.geom.CoordinateFilter){if(this.isEmpty())return;t.filter(this.getCoordinate())}},jsts.geom.Point.prototype.clone=function(){return new jsts.geom.Point(this.coordinate.clone(),this.factory)},jsts.geom.Point.prototype.getDimension=function(){return 0},jsts.geom.Point.prototype.getBoundaryDimension=function(){return jsts.geom.Dimension.FALSE},jsts.geom.Point.prototype.reverse=function(){return this.clone()},jsts.geom.Point.prototype.isValid=function(){return jsts.operation.valid.IsValidOp.isValid(this.getCoordinate())?!0:!1},jsts.geom.Point.prototype.normalize=function(){},jsts.geom.Point.prototype.compareToSameClass=function(t){var e=t;return this.getCoordinate().compareTo(e.getCoordinate())},jsts.geom.Point.prototype.getGeometryType=function(){return"Point"},jsts.geom.Point.prototype.hashCode=function(){return"Point_"+this.coordinate.hashCode()},jsts.geom.Point.prototype.CLASS_NAME="jsts.geom.Point",jsts.geom.Dimension=function(){},jsts.geom.Dimension.P=0,jsts.geom.Dimension.L=1,jsts.geom.Dimension.A=2,jsts.geom.Dimension.FALSE=-1,jsts.geom.Dimension.TRUE=-2,jsts.geom.Dimension.DONTCARE=-3,jsts.geom.Dimension.toDimensionSymbol=function(t){switch(t){case jsts.geom.Dimension.FALSE:return"F";case jsts.geom.Dimension.TRUE:return"T";case jsts.geom.Dimension.DONTCARE:return"*";case jsts.geom.Dimension.P:return"0";case jsts.geom.Dimension.L:return"1";case jsts.geom.Dimension.A:return"2"}throw new jsts.IllegalArgumentError("Unknown dimension value: "+t)},jsts.geom.Dimension.toDimensionValue=function(t){switch(t.toUpperCase()){case"F":return jsts.geom.Dimension.FALSE;case"T":return jsts.geom.Dimension.TRUE;case"*":return jsts.geom.Dimension.DONTCARE;case"0":return jsts.geom.Dimension.P;case"1":return jsts.geom.Dimension.L;case"2":return jsts.geom.Dimension.A}throw new jsts.error.IllegalArgumentError("Unknown dimension symbol: "+t)},function(){var t=jsts.geom.Dimension;jsts.geom.LineString=function(t,e){this.factory=e,this.points=t||[]},jsts.geom.LineString.prototype=new jsts.geom.Geometry,jsts.geom.LineString.constructor=jsts.geom.LineString,jsts.geom.LineString.prototype.points=null,jsts.geom.LineString.prototype.getCoordinates=function(){return this.points},jsts.geom.LineString.prototype.getCoordinateSequence=function(){return this.points},jsts.geom.LineString.prototype.getCoordinateN=function(t){return this.points[t]},jsts.geom.LineString.prototype.getCoordinate=function(){return this.isEmpty()?null:this.getCoordinateN(0)},jsts.geom.LineString.prototype.getDimension=function(){return 1},jsts.geom.LineString.prototype.getBoundaryDimension=function(){return this.isClosed()?t.FALSE:0},jsts.geom.LineString.prototype.isEmpty=function(){return 0===this.points.length},jsts.geom.LineString.prototype.getNumPoints=function(){return this.points.length},jsts.geom.LineString.prototype.getPointN=function(t){return this.getFactory().createPoint(this.points[t])},jsts.geom.LineString.prototype.getStartPoint=function(){return this.isEmpty()?null:this.getPointN(0)},jsts.geom.LineString.prototype.getEndPoint=function(){return this.isEmpty()?null:this.getPointN(this.getNumPoints()-1)},jsts.geom.LineString.prototype.isClosed=function(){return this.isEmpty()?!1:this.getCoordinateN(0).equals2D(this.getCoordinateN(this.points.length-1))},jsts.geom.LineString.prototype.isRing=function(){return this.isClosed()&&this.isSimple()},jsts.geom.LineString.prototype.getGeometryType=function(){return"LineString"},jsts.geom.LineString.prototype.getLength=function(){return jsts.algorithm.CGAlgorithms.computeLength(this.points)},jsts.geom.LineString.prototype.getBoundary=function(){return new jsts.operation.BoundaryOp(this).getBoundary()},jsts.geom.LineString.prototype.computeEnvelopeInternal=function(){if(this.isEmpty())return new jsts.geom.Envelope;var t=new jsts.geom.Envelope;return this.points.forEach(function(e){t.expandToInclude(e)}),t},jsts.geom.LineString.prototype.equalsExact=function(t,e){return this.isEquivalentClass(t)?this.points.length!==t.points.length?!1:this.isEmpty()&&t.isEmpty()?!0:this.points.reduce(function(n,o,r){return n&&jsts.geom.Geometry.prototype.equal(o,t.points[r],e)}):!1},jsts.geom.LineString.prototype.isEquivalentClass=function(t){return t instanceof jsts.geom.LineString},jsts.geom.LineString.prototype.compareToSameClass=function(t){for(var e=t,n=0,o=this.points.length,r=0,i=e.points.length;o>n&&i>r;){var s=this.points[n].compareTo(e.points[r]);if(0!==s)return s;n++,r++}return o>n?1:i>r?-1:0},jsts.geom.LineString.prototype.apply=function(t){if(t instanceof jsts.geom.GeometryFilter||t instanceof jsts.geom.GeometryComponentFilter)t.filter(this);else if(t instanceof jsts.geom.CoordinateFilter)for(var e=0,n=this.points.length;n>e;e++)t.filter(this.points[e]);else t instanceof jsts.geom.CoordinateSequenceFilter&&this.apply2.apply(this,arguments)},jsts.geom.LineString.prototype.apply2=function(t){if(0!==this.points.length){for(var e=0;e<this.points.length&&(t.filter(this.points,e),!t.isDone());e++);t.isGeometryChanged()}},jsts.geom.LineString.prototype.clone=function(){for(var t=[],e=0,n=this.points.length;n>e;e++)t.push(this.points[e].clone());return this.factory.createLineString(t)},jsts.geom.LineString.prototype.normalize=function(){var t,e,n,o,r,i;for(i=this.points.length,e=parseInt(i/2),t=0;e>t;t++)if(n=i-1-t,o=this.points[t],r=this.points[n],!o.equals(r))return void(o.compareTo(r)>0&&this.points.reverse())},jsts.geom.LineString.prototype.CLASS_NAME="jsts.geom.LineString"}(),function(){jsts.geom.Polygon=function(t,e,n){this.shell=t||n.createLinearRing(null),this.holes=e||[],this.factory=n},jsts.geom.Polygon.prototype=new jsts.geom.Geometry,jsts.geom.Polygon.constructor=jsts.geom.Polygon,jsts.geom.Polygon.prototype.getCoordinate=function(){return this.shell.getCoordinate()},jsts.geom.Polygon.prototype.getCoordinates=function(){if(this.isEmpty())return[];for(var t=[],e=-1,n=this.shell.getCoordinates(),o=0;o<n.length;o++)e++,t[e]=n[o];for(var r=0;r<this.holes.length;r++)for(var i=this.holes[r].getCoordinates(),s=0;s<i.length;s++)e++,t[e]=i[s];return t},jsts.geom.Polygon.prototype.getNumPoints=function(){for(var t=this.shell.getNumPoints(),e=0;e<this.holes.length;e++)t+=this.holes[e].getNumPoints();return t},jsts.geom.Polygon.prototype.isEmpty=function(){return this.shell.isEmpty()},jsts.geom.Polygon.prototype.isRectangle=function(){if(0!=this.getNumInteriorRing())return!1;if(null==this.shell)return!1;if(5!=this.shell.getNumPoints())return!1;for(var t=this.shell.getCoordinateSequence(),e=this.getEnvelopeInternal(),n=0;5>n;n++){var o=t[n].x;if(o!=e.getMinX()&&o!=e.getMaxX())return!1;var r=t[n].y;if(r!=e.getMinY()&&r!=e.getMaxY())return!1}for(var i=t[0].x,s=t[0].y,n=1;4>=n;n++){var o=t[n].x,r=t[n].y,a=o!=i,u=r!=s;if(a==u)return!1;i=o,s=r}return!0},jsts.geom.Polygon.prototype.getExteriorRing=function(){return this.shell},jsts.geom.Polygon.prototype.getInteriorRingN=function(t){return this.holes[t]},jsts.geom.Polygon.prototype.getNumInteriorRing=function(){return this.holes.length},jsts.geom.Polygon.prototype.getArea=function(){var t=0;t+=Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.shell.getCoordinateSequence()));for(var e=0;e<this.holes.length;e++)t-=Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.holes[e].getCoordinateSequence()));return t},jsts.geom.Polygon.prototype.getLength=function(){var t=0;t+=this.shell.getLength();for(var e=0;e<this.holes.length;e++)t+=this.holes[e].getLength();return t},jsts.geom.Polygon.prototype.getBoundary=function(){if(this.isEmpty())return this.getFactory().createMultiLineString(null);var t=[];t[0]=this.shell.clone();for(var e=0,n=this.holes.length;n>e;e++)t[e+1]=this.holes[e].clone();return t.length<=1?t[0]:this.getFactory().createMultiLineString(t)},jsts.geom.Polygon.prototype.computeEnvelopeInternal=function(){return this.shell.getEnvelopeInternal()},jsts.geom.Polygon.prototype.getDimension=function(){return 2},jsts.geom.Polygon.prototype.getBoundaryDimension=function(){return 1},jsts.geom.Polygon.prototype.equalsExact=function(t,e){if(!this.isEquivalentClass(t))return!1;if(this.isEmpty()&&t.isEmpty())return!0;if(this.isEmpty()!==t.isEmpty())return!1;if(!this.shell.equalsExact(t.shell,e))return!1;if(this.holes.length!==t.holes.length)return!1;if(this.holes.length!==t.holes.length)return!1;for(var n=0;n<this.holes.length;n++)if(!this.holes[n].equalsExact(t.holes[n],e))return!1;return!0},jsts.geom.Polygon.prototype.compareToSameClass=function(t){return this.shell.compareToSameClass(t.shell)},jsts.geom.Polygon.prototype.apply=function(t){if(t instanceof jsts.geom.GeometryComponentFilter){t.filter(this),this.shell.apply(t);for(var e=0,n=this.holes.length;n>e;e++)this.holes[e].apply(t)}else if(t instanceof jsts.geom.GeometryFilter)t.filter(this);else if(t instanceof jsts.geom.CoordinateFilter){this.shell.apply(t);for(var e=0,n=this.holes.length;n>e;e++)this.holes[e].apply(t)}else t instanceof jsts.geom.CoordinateSequenceFilter&&this.apply2.apply(this,arguments)},jsts.geom.Polygon.prototype.apply2=function(t){if(this.shell.apply(t),!t.isDone())for(var e=0;e<this.holes.length&&(this.holes[e].apply(t),!t.isDone());e++);t.isGeometryChanged()},jsts.geom.Polygon.prototype.clone=function(){for(var t=[],e=0,n=this.holes.length;n>e;e++)t.push(this.holes[e].clone());return this.factory.createPolygon(this.shell.clone(),t)},jsts.geom.Polygon.prototype.normalize=function(){this.normalize2(this.shell,!0);for(var t=0,e=this.holes.length;e>t;t++)this.normalize2(this.holes[t],!1);this.holes.sort()},jsts.geom.Polygon.prototype.normalize2=function(t,e){if(!t.isEmpty()){var n=t.points.slice(0,t.points.length-1),o=jsts.geom.CoordinateArrays.minCoordinate(t.points);jsts.geom.CoordinateArrays.scroll(n,o),t.points=n.concat(),t.points[n.length]=n[0],jsts.algorithm.CGAlgorithms.isCCW(t.points)===e&&t.points.reverse()}},jsts.geom.Polygon.prototype.getGeometryType=function(){return"Polygon"},jsts.geom.Polygon.prototype.CLASS_NAME="jsts.geom.Polygon"}(),function(){var t=jsts.geom.Geometry,e=javascript.util.TreeSet,n=javascript.util.Arrays;jsts.geom.GeometryCollection=function(t,e){this.geometries=t||[],this.factory=e},jsts.geom.GeometryCollection.prototype=new t,jsts.geom.GeometryCollection.constructor=jsts.geom.GeometryCollection,jsts.geom.GeometryCollection.prototype.isEmpty=function(){for(var t=0,e=this.geometries.length;e>t;t++){var n=this.getGeometryN(t);if(!n.isEmpty())return!1}return!0},jsts.geom.GeometryCollection.prototype.getArea=function(){for(var t=0,e=0,n=this.geometries.length;n>e;e++)t+=this.getGeometryN(e).getArea();return t},jsts.geom.GeometryCollection.prototype.getLength=function(){for(var t=0,e=0,n=this.geometries.length;n>e;e++)t+=this.getGeometryN(e).getLength();return t},jsts.geom.GeometryCollection.prototype.getCoordinate=function(){return this.isEmpty()?null:this.getGeometryN(0).getCoordinate()},jsts.geom.GeometryCollection.prototype.getCoordinates=function(){for(var t=[],e=-1,n=0,o=this.geometries.length;o>n;n++)for(var r=this.getGeometryN(n),i=r.getCoordinates(),s=0;s<i.length;s++)e++,t[e]=i[s];return t},jsts.geom.GeometryCollection.prototype.getNumGeometries=function(){return this.geometries.length},jsts.geom.GeometryCollection.prototype.getGeometryN=function(t){var e=this.geometries[t];return e instanceof jsts.geom.Coordinate&&(e=new jsts.geom.Point(e)),e},jsts.geom.GeometryCollection.prototype.getNumPoints=function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getNumPoints();return t},jsts.geom.GeometryCollection.prototype.equalsExact=function(t,e){if(!this.isEquivalentClass(t))return!1;if(this.geometries.length!==t.geometries.length)return!1;for(var n=0,o=this.geometries.length;o>n;n++){var r=this.getGeometryN(n);if(!r.equalsExact(t.getGeometryN(n),e))return!1}return!0},jsts.geom.GeometryCollection.prototype.clone=function(){for(var t=[],e=0,n=this.geometries.length;n>e;e++)t.push(this.geometries[e].clone());return this.factory.createGeometryCollection(t)},jsts.geom.GeometryCollection.prototype.normalize=function(){for(var t=0,e=this.geometries.length;e>t;t++)this.getGeometryN(t).normalize();this.geometries.sort()},jsts.geom.GeometryCollection.prototype.compareToSameClass=function(t){var o=new e(n.asList(this.geometries)),r=new e(n.asList(t.geometries));return this.compare(o,r)},jsts.geom.GeometryCollection.prototype.apply=function(t){if(t instanceof jsts.geom.GeometryFilter||t instanceof jsts.geom.GeometryComponentFilter){t.filter(this);for(var e=0,n=this.geometries.length;n>e;e++)this.getGeometryN(e).apply(t)}else if(t instanceof jsts.geom.CoordinateFilter)for(var e=0,n=this.geometries.length;n>e;e++)this.getGeometryN(e).apply(t);else t instanceof jsts.geom.CoordinateSequenceFilter&&this.apply2.apply(this,arguments)},jsts.geom.GeometryCollection.prototype.apply2=function(t){if(0!=this.geometries.length){for(var e=0;e<this.geometries.length&&(this.geometries[e].apply(t),!t.isDone());e++);t.isGeometryChanged()}},jsts.geom.GeometryCollection.prototype.getDimension=function(){for(var t=jsts.geom.Dimension.FALSE,e=0,n=this.geometries.length;n>e;e++){var o=this.getGeometryN(e);t=Math.max(t,o.getDimension())}return t},jsts.geom.GeometryCollection.prototype.computeEnvelopeInternal=function(){for(var t=new jsts.geom.Envelope,e=0,n=this.geometries.length;n>e;e++){var o=this.getGeometryN(e);t.expandToInclude(o.getEnvelopeInternal())}return t},jsts.geom.GeometryCollection.prototype.CLASS_NAME="jsts.geom.GeometryCollection"}(),jsts.algorithm.Centroid=function(t){this.areaBasePt=null,this.triangleCent3=new jsts.geom.Coordinate,this.areasum2=0,this.cg3=new jsts.geom.Coordinate,this.lineCentSum=new jsts.geom.Coordinate,this.totalLength=0,this.ptCount=0,this.ptCentSum=new jsts.geom.Coordinate,this.add(t)},jsts.algorithm.Centroid.getCentroid=function(t){var e=new jsts.algorithm.Centroid(t);return e.getCentroid()},jsts.algorithm.Centroid.centroid3=function(t,e,n,o){o.x=t.x+e.x+n.x,o.y=t.y+e.y+n.y},jsts.algorithm.Centroid.area2=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(n.x-t.x)*(e.y-t.y)},jsts.algorithm.Centroid.prototype.add=function(t){if(!t.isEmpty())if(t instanceof jsts.geom.Point)this.addPoint(t.getCoordinate());else if(t instanceof jsts.geom.LineString)this.addLineSegments(t.getCoordinates());else if(t instanceof jsts.geom.Polygon)this.addPolygon(t);else if(t instanceof jsts.geom.GeometryCollection)for(var e=0;e<t.getNumGeometries();e++)this.add(t.getGeometryN(e))},jsts.algorithm.Centroid.prototype.getCentroid=function(){var t=new jsts.geom.Coordinate;if(Math.abs(this.areasum2)>0)t.x=this.cg3.x/3/this.areasum2,t.y=this.cg3.y/3/this.areasum2;else if(this.totalLength>0)t.x=this.lineCentSum.x/this.totalLength,t.y=this.lineCentSum.y/this.totalLength;
else{if(!(this.ptCount>0))return null;t.x=this.ptCentSum.x/this.ptCount,t.y=this.ptCentSum.y/this.ptCount}return t},jsts.algorithm.Centroid.prototype.setBasePoint=function(t){null===this.areaBasePt&&(this.areaBasePt=t)},jsts.algorithm.Centroid.prototype.addPolygon=function(t){this.addShell(t.getExteriorRing().getCoordinates());for(var e=0;e<t.getNumInteriorRing();e++)this.addHole(t.getInteriorRingN(e).getCoordinates())},jsts.algorithm.Centroid.prototype.addShell=function(t){t.length>0&&this.setBasePoint(t[0]);for(var e=!jsts.algorithm.CGAlgorithms.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},jsts.algorithm.Centroid.prototype.addHole=function(t){for(var e=jsts.algorithm.CGAlgorithms.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},jsts.algorithm.Centroid.prototype.addTriangle=function(t,e,n,o){var r=o?1:-1;jsts.algorithm.Centroid.centroid3(t,e,n,this.triangleCent3);var i=jsts.algorithm.Centroid.area2(t,e,n);this.cg3.x+=r*i*this.triangleCent3.x,this.cg3.y+=r*i*this.triangleCent3.y,this.areasum2+=r*i},jsts.algorithm.Centroid.prototype.addLineSegments=function(t){for(var e=0,n=0;n<t.length-1;n++){var o=t[n].distance(t[n+1]);if(0!==o){e+=o;var r=(t[n].x+t[n+1].x)/2;this.lineCentSum.x+=o*r;var i=(t[n].y+t[n+1].y)/2;this.lineCentSum.y+=o*i}}this.totalLength+=e,0===e&&t.length>0&&this.addPoint(t[0])},jsts.algorithm.Centroid.prototype.addPoint=function(t){this.ptCount+=1,this.ptCentSum.x+=t.x,this.ptCentSum.y+=t.y},function(){var t=function(t){this.deList=new javascript.util.ArrayList,this.factory=t};t.findEdgeRingContaining=function(t,e){for(var n=t.getRing(),o=n.getEnvelopeInternal(),r=n.getCoordinateN(0),i=null,s=null,a=e.iterator();a.hasNext();){var u=a.next(),p=u.getRing(),g=p.getEnvelopeInternal();null!=i&&(s=i.getRing().getEnvelopeInternal());var l=!1;g.equals(o)||(r=jsts.geom.CoordinateArrays.ptNotInList(n.getCoordinates(),p.getCoordinates()),g.contains(o)&&jsts.algorithm.CGAlgorithms.isPointInRing(r,p.getCoordinates())&&(l=!0),l&&(null==i||s.contains(g))&&(i=u))}return i},t.ptNotInList=function(t,e){for(var n=0;n<t.length;n++){var o=t[n];if(!isInList(o,e))return o}return null},t.isInList=function(t,e){for(var n=0;n<e.length;n++)if(t.equals(e[n]))return!0;return!1},t.prototype.factory=null,t.prototype.deList=null,t.prototype.ring=null,t.prototype.ringPts=null,t.prototype.holes=null,t.prototype.add=function(t){this.deList.add(t)},t.prototype.isHole=function(){var t=this.getRing();return jsts.algorithm.CGAlgorithms.isCCW(t.getCoordinates())},t.prototype.addHole=function(t){null==this.holes&&(this.holes=new javascript.util.ArrayList),this.holes.add(t)},t.prototype.getPolygon=function(){var t=null;if(null!=this.holes){t=[];for(var e=0;e<this.holes.size();e++)t[e]=this.holes.get(e)}var n=this.factory.createPolygon(this.ring,t);return n},t.prototype.isValid=function(){return this.getCoordinates(),this.ringPts.length<=3?!1:(this.getRing(),this.ring.isValid())},t.prototype.getCoordinates=function(){if(null==this.ringPts){for(var e=new jsts.geom.CoordinateList,n=this.deList.iterator();n.hasNext();){var o=n.next(),r=o.getEdge();t.addEdge(r.getLine().getCoordinates(),o.getEdgeDirection(),e)}this.ringPts=e.toCoordinateArray()}return this.ringPts},t.prototype.getLineString=function(){return this.getCoordinates(),this.factory.createLineString(this.ringPts)},t.prototype.getRing=function(){if(null!=this.ring)return this.ring;this.getCoordinates(),this.ringPts.length<3&&console.log(this.ringPts);try{this.ring=this.factory.createLinearRing(this.ringPts)}catch(t){console.log(this.ringPts)}return this.ring},t.addEdge=function(t,e,n){if(e)for(var o=0;o<t.length;o++)n.add(t[o],!1);else for(var o=t.length-1;o>=0;o--)n.add(t[o],!1)},jsts.operation.polygonize.EdgeRing=t}(),function(){var t=function(){};t.setVisited=function(t,e){for(;t.hasNext();){var n=t.next();n.setVisited(e)}},t.setMarked=function(t,e){for(;t.hasNext();){var n=t.next();n.setMarked(e)}},t.getComponentWithVisitedState=function(t,e){for(;t.hasNext();){var n=t.next();if(n.isVisited()==e)return n}return null},t.prototype._isMarked=!1,t.prototype._isVisited=!1,t.prototype.data,t.prototype.isVisited=function(){return this._isVisited},t.prototype.setVisited=function(t){this._isVisited=t},t.prototype.isMarked=function(){return this._isMarked},t.prototype.setMarked=function(t){this._isMarked=t},t.prototype.setContext=function(t){this.data=t},t.prototype.getContext=function(){return data},t.prototype.setData=function(t){this.data=t},t.prototype.getData=function(){return data},t.prototype.isRemoved=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.planargraph.GraphComponent=t}(),function(){var t=jsts.planargraph.GraphComponent,e=function(t,e){void 0!==t&&this.setDirectedEdges(t,e)};e.prototype=new t,e.prototype.dirEdge=null,e.prototype.setDirectedEdges=function(t,e){this.dirEdge=[t,e],t.setEdge(this),e.setEdge(this),t.setSym(e),e.setSym(t),t.getFromNode().addOutEdge(t),e.getFromNode().addOutEdge(e)},e.prototype.getDirEdge=function(t){return t instanceof jsts.planargraph.Node&&this.getDirEdge2(t),this.dirEdge[t]},e.prototype.getDirEdge2=function(t){return this.dirEdge[0].getFromNode()==t?this.dirEdge[0]:this.dirEdge[1].getFromNode()==t?this.dirEdge[1]:null},e.prototype.getOppositeNode=function(t){return this.dirEdge[0].getFromNode()==t?this.dirEdge[0].getToNode():this.dirEdge[1].getFromNode()==t?this.dirEdge[1].getToNode():null},e.prototype.remove=function(){this.dirEdge=null},e.prototype.isRemoved=function(){return null==dirEdge},jsts.planargraph.Edge=e}(),jsts.operation.polygonize.PolygonizeEdge=function(t){this.line=t},jsts.operation.polygonize.PolygonizeEdge.prototype=new jsts.planargraph.Edge,jsts.operation.polygonize.PolygonizeEdge.prototype.line=null,jsts.operation.polygonize.PolygonizeEdge.prototype.getLine=function(){return this.line},function(){var t=javascript.util.ArrayList,e=jsts.planargraph.GraphComponent,n=function(t,e,n,o){if(void 0!==t){this.from=t,this.to=e,this.edgeDirection=o,this.p0=t.getCoordinate(),this.p1=n;var r=this.p1.x-this.p0.x,i=this.p1.y-this.p0.y;this.quadrant=jsts.geomgraph.Quadrant.quadrant(r,i),this.angle=Math.atan2(i,r)}};n.prototype=new e,n.toEdges=function(e){for(var n=new t,o=e.iterator();o.hasNext();)n.add(o.next().parentEdge);return n},n.prototype.parentEdge=null,n.prototype.from=null,n.prototype.to=null,n.prototype.p0=null,n.prototype.p1=null,n.prototype.sym=null,n.prototype.edgeDirection=null,n.prototype.quadrant=null,n.prototype.angle=null,n.prototype.getEdge=function(){return this.parentEdge},n.prototype.setEdge=function(t){this.parentEdge=t},n.prototype.getQuadrant=function(){return this.quadrant},n.prototype.getDirectionPt=function(){return this.p1},n.prototype.getEdgeDirection=function(){return this.edgeDirection},n.prototype.getFromNode=function(){return this.from},n.prototype.getToNode=function(){return this.to},n.prototype.getCoordinate=function(){return this.from.getCoordinate()},n.prototype.getAngle=function(){return this.angle},n.prototype.getSym=function(){return this.sym},n.prototype.setSym=function(t){this.sym=t},n.prototype.remove=function(){this.sym=null,this.parentEdge=null},n.prototype.isRemoved=function(){return null==this.parentEdge},n.prototype.compareTo=function(t){var e=t;return this.compareDirection(e)},n.prototype.compareDirection=function(t){return this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:jsts.algorithm.CGAlgorithms.computeOrientation(t.p0,t.p1,this.p1)},jsts.planargraph.DirectedEdge=n}(),function(){var t=jsts.planargraph.DirectedEdge,e=function(){t.apply(this,arguments)};e.prototype=new t,e.prototype.edgeRing=null,e.prototype.next=null,e.prototype.label=-1,e.prototype.getLabel=function(){return this.label},e.prototype.setLabel=function(t){this.label=t},e.prototype.getNext=function(){return this.next},e.prototype.setNext=function(t){this.next=t},e.prototype.isInRing=function(){return null!=this.edgeRing},e.prototype.setRing=function(t){this.edgeRing=t},jsts.operation.polygonize.PolygonizeDirectedEdge=e}(),function(){var t=javascript.util.ArrayList,e=function(){this.outEdges=new t};e.prototype.outEdges=null,e.prototype.sorted=!1,e.prototype.add=function(t){this.outEdges.add(t),this.sorted=!1},e.prototype.remove=function(t){this.outEdges.remove(t)},e.prototype.iterator=function(){return this.sortEdges(),this.outEdges.iterator()},e.prototype.getDegree=function(){return this.outEdges.size()},e.prototype.getCoordinate=function(){var t=iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},e.prototype.getEdges=function(){return this.sortEdges(),this.outEdges},e.prototype.sortEdges=function(){if(!this.sorted){var t=this.outEdges.toArray();t.sort(function(t,e){return t.compareTo(e)}),this.outEdges=javascript.util.Arrays.asList(t),this.sorted=!0}},e.prototype.getIndex=function(t){if(t instanceof jsts.planargraph.DirectedEdge)return this.getIndex2(t);if("number"==typeof t)return this.getIndex3(t);this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n.getEdge()==t)return e}return-1},e.prototype.getIndex2=function(t){this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n==t)return e}return-1},e.prototype.getIndex3=function(t){var e=toInt(t%this.outEdges.size());return 0>e&&(e+=this.outEdges.size()),e},e.prototype.getNextEdge=function(t){var e=this.getIndex(t);return this.outEdges.get(getIndex(e+1))},e.prototype.getNextCWEdge=function(t){var e=this.getIndex(t);return this.outEdges.get(getIndex(e-1))},jsts.planargraph.DirectedEdgeStar=e}(),function(){var t=jsts.planargraph.GraphComponent,e=jsts.planargraph.DirectedEdgeStar,n=function(t,n){this.pt=t,this.deStar=n||new e};n.prototype=new t,n.getEdgesBetween=function(t,e){var n=DirectedEdge.toEdges(t.getOutEdges().getEdges()),o=new javascript.util.HashSet(n),r=DirectedEdge.toEdges(e.getOutEdges().getEdges());return o.retainAll(r),o},n.prototype.pt=null,n.prototype.deStar=null,n.prototype.getCoordinate=function(){return this.pt},n.prototype.addOutEdge=function(t){this.deStar.add(t)},n.prototype.getOutEdges=function(){return this.deStar},n.prototype.getDegree=function(){return this.deStar.getDegree()},n.prototype.getIndex=function(t){return this.deStar.getIndex(t)},n.prototype.remove=function(t){return void 0===t?this.remove2():void this.deStar.remove(t)},n.prototype.remove2=function(){this.pt=null},n.prototype.isRemoved=function(){return null==this.pt},jsts.planargraph.Node=n}(),function(){var t=function(){this.nodeMap=new javascript.util.TreeMap};t.prototype.nodeMap=null,t.prototype.add=function(t){return this.nodeMap.put(t.getCoordinate(),t),t},t.prototype.remove=function(t){return this.nodeMap.remove(t)},t.prototype.find=function(t){return this.nodeMap.get(t)},t.prototype.iterator=function(){return this.nodeMap.values().iterator()},t.prototype.values=function(){return this.nodeMap.values()},jsts.planargraph.NodeMap=t}(),function(){var t=javascript.util.ArrayList,e=function(){this.edges=new javascript.util.HashSet,this.dirEdges=new javascript.util.HashSet,this.nodeMap=new jsts.planargraph.NodeMap};e.prototype.edges=null,e.prototype.dirEdges=null,e.prototype.nodeMap=null,e.prototype.findNode=function(t){return this.nodeMap.find(t)},e.prototype.add=function(t){return t instanceof jsts.planargraph.Edge?this.add2(t):t instanceof jsts.planargraph.DirectedEdge?this.add3(t):void this.nodeMap.add(t)},e.prototype.add2=function(t){this.edges.add(t),this.add(t.getDirEdge(0)),this.add(t.getDirEdge(1))},e.prototype.add3=function(t){this.dirEdges.add(t)},e.prototype.nodeIterator=function(){return this.nodeMap.iterator()},e.prototype.contains=function(t){return t instanceof jsts.planargraph.DirectedEdge?this.contains2(t):this.edges.contains(t)},e.prototype.contains2=function(t){return this.dirEdges.contains(t)},e.prototype.getNodes=function(){return this.nodeMap.values()},e.prototype.dirEdgeIterator=function(){return this.dirEdges.iterator()},e.prototype.edgeIterator=function(){return this.edges.iterator()},e.prototype.getEdges=function(){return this.edges},e.prototype.remove=function(t){return t instanceof jsts.planargraph.DirectedEdge?this.remove2(t):(this.remove(t.getDirEdge(0)),this.remove(t.getDirEdge(1)),this.edges.remove(t),void this.edge.remove())},e.prototype.remove2=function(t){if(t instanceof jsts.planargraph.Node)return this.remove3(t);var e=t.getSym();null!=e&&e.setSym(null),t.getFromNode().remove(t),t.remove(),this.dirEdges.remove(t)},e.prototype.remove3=function(t){for(var e=t.getOutEdges().getEdges(),n=e.iterator();n.hasNext();){var o=n.next(),r=o.getSym();null!=r&&this.remove(r),this.dirEdges.remove(o);var i=o.getEdge();null!=i&&this.edges.remove(i)}this.nodeMap.remove(t.getCoordinate()),t.remove()},e.prototype.findNodesOfDegree=function(e){for(var n=new t,o=this.nodeIterator();o.hasNext();){var r=o.next();r.getDegree()==e&&n.add(r)}return n},jsts.planargraph.PlanarGraph=e}(),function(){var t=javascript.util.ArrayList,e=javascript.util.Stack,n=javascript.util.HashSet,o=jsts.util.Assert,r=jsts.operation.polygonize.EdgeRing,i=jsts.operation.polygonize.PolygonizeEdge,s=jsts.operation.polygonize.PolygonizeDirectedEdge,a=jsts.planargraph.PlanarGraph,u=jsts.planargraph.Node,p=function(t){a.apply(this),this.factory=t};p.prototype=new a,p.getDegreeNonDeleted=function(t){for(var e=t.getOutEdges().getEdges(),n=0,o=e.iterator();o.hasNext();){var r=o.next();r.isMarked()||n++}return n},p.getDegree=function(t,e){for(var n=t.getOutEdges().getEdges(),o=0,r=n.iterator();r.hasNext();){var i=r.next();i.getLabel()==e&&o++}return o},p.deleteAllEdges=function(t){for(var e=t.getOutEdges().getEdges(),n=e.iterator();n.hasNext();){var o=n.next();o.setMarked(!0);var r=o.getSym();null!=r&&r.setMarked(!0)}},p.prototype.factory=null,p.prototype.addEdge=function(t){if(!t.isEmpty()){var e=jsts.geom.CoordinateArrays.removeRepeatedPoints(t.getCoordinates());if(!(e.length<2)){var n=e[0],o=e[e.length-1],r=this.getNode(n),a=this.getNode(o),u=new s(r,a,e[1],!0),p=new s(a,r,e[e.length-2],!1),g=new i(t);g.setDirectedEdges(u,p),this.add(g)}}},p.prototype.getNode=function(t){var e=this.findNode(t);return null==e&&(e=new u(t),this.add(e)),e},p.prototype.computeNextCWEdges=function(){for(var t=this.nodeIterator();t.hasNext();){var e=t.next();p.computeNextCWEdges(e)}},p.prototype.convertMaximalToMinimalEdgeRings=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),o=n.getLabel(),r=p.findIntersectionNodes(n,o);if(null!=r)for(var i=r.iterator();i.hasNext();){var s=i.next();p.computeNextCCWEdges(s,o)}}},p.findIntersectionNodes=function(e,n){var r=e,i=null;do{var s=r.getFromNode();p.getDegree(s,n)>1&&(null==i&&(i=new t),i.add(s)),r=r.getNext(),o.isTrue(null!=r,"found null DE in ring"),o.isTrue(r==e||!r.isInRing(),"found DE already in ring")}while(r!=e);return i},p.prototype.getEdgeRings=function(){this.computeNextCWEdges(),p.label(this.dirEdges,-1);var e=p.findLabeledEdgeRings(this.dirEdges);this.convertMaximalToMinimalEdgeRings(e);for(var n=new t,o=this.dirEdges.iterator();o.hasNext();){var r=o.next();if(!r.isMarked()&&!r.isInRing()){var i=this.findEdgeRing(r);n.add(i)}}return n},p.findLabeledEdgeRings=function(e){for(var n=new t,o=1,r=e.iterator();r.hasNext();){var i=r.next();if(!(i.isMarked()||i.getLabel()>=0)){n.add(i);var s=p.findDirEdgesInRing(i);p.label(s,o),o++}}return n},p.prototype.deleteCutEdges=function(){this.computeNextCWEdges(),p.findLabeledEdgeRings(this.dirEdges);for(var e=new t,n=this.dirEdges.iterator();n.hasNext();){var o=n.next();if(!o.isMarked()){var r=o.getSym();if(o.getLabel()==r.getLabel()){o.setMarked(!0),r.setMarked(!0);var i=o.getEdge();e.add(i.getLine())}}}return e},p.label=function(t,e){for(var n=t.iterator();n.hasNext();){var o=n.next();o.setLabel(e)}},p.computeNextCWEdges=function(t){for(var e=t.getOutEdges(),n=null,o=null,r=e.getEdges().iterator();r.hasNext();){var i=r.next();if(!i.isMarked()){if(null==n&&(n=i),null!=o){var s=o.getSym();s.setNext(i)}o=i}}if(null!=o){var s=o.getSym();s.setNext(n)}},p.computeNextCCWEdges=function(t,e){for(var n=t.getOutEdges(),r=null,i=null,s=n.getEdges(),a=s.size()-1;a>=0;a--){var u=s.get(a),p=u.getSym(),g=null;u.getLabel()==e&&(g=u);var l=null;p.getLabel()==e&&(l=p),(null!=g||null!=l)&&(null!=l&&(i=l),null!=g&&(null!=i&&(i.setNext(g),i=null),null==r&&(r=g)))}null!=i&&(o.isTrue(null!=r),i.setNext(r))},p.findDirEdgesInRing=function(e){var n=e,r=new t;do r.add(n),n=n.getNext(),o.isTrue(null!=n,"found null DE in ring"),o.isTrue(n==e||!n.isInRing(),"found DE already in ring");while(n!=e);return r},p.prototype.findEdgeRing=function(t){var e=t,n=new r(this.factory);do n.add(e),e.setRing(n),e=e.getNext(),o.isTrue(null!=e,"found null DE in ring"),o.isTrue(e==t||!e.isInRing(),"found DE already in ring");while(e!=t);return n},p.prototype.deleteDangles=function(){for(var t=this.findNodesOfDegree(1),o=new n,r=new e,i=t.iterator();i.hasNext();)r.push(i.next());for(;!r.isEmpty();){var s=r.pop();p.deleteAllEdges(s);for(var a=s.getOutEdges().getEdges(),i=a.iterator();i.hasNext();){var u=i.next();u.setMarked(!0);var g=u.getSym();null!=g&&g.setMarked(!0);var l=u.getEdge();o.add(l.getLine());var h=u.getToNode();1==p.getDegreeNonDeleted(h)&&r.push(h)}}return o},p.prototype.computeDepthParity=function(){for(;;){var t=null;if(null==t)return;this.computeDepthParity(t)}},p.prototype.computeDepthParity=function(){},jsts.operation.polygonize.PolygonizeGraph=p}(),jsts.index.strtree.Interval=function(){var t;return 1===arguments.length?(t=arguments[0],jsts.index.strtree.Interval(t.min,t.max)):void(2===arguments.length&&(jsts.util.Assert.isTrue(this.min<=this.max),this.min=arguments[0],this.max=arguments[1]))},jsts.index.strtree.Interval.prototype.min=null,jsts.index.strtree.Interval.prototype.max=null,jsts.index.strtree.Interval.prototype.getCentre=function(){return(this.min+this.max)/2},jsts.index.strtree.Interval.prototype.expandToInclude=function(t){return this.max=Math.max(this.max,t.max),this.min=Math.min(this.min,t.min),this},jsts.index.strtree.Interval.prototype.intersects=function(t){return!(t.min>this.max||t.max<this.min)},jsts.index.strtree.Interval.prototype.equals=function(t){return t instanceof jsts.index.strtree.Interval?(other=t,this.min===other.min&&this.max===other.max):!1},jsts.geom.GeometryFactory=function(t){this.precisionModel=t||new jsts.geom.PrecisionModel},jsts.geom.GeometryFactory.prototype.precisionModel=null,jsts.geom.GeometryFactory.prototype.getPrecisionModel=function(){return this.precisionModel},jsts.geom.GeometryFactory.prototype.createPoint=function(t){var e=new jsts.geom.Point(t,this);return e},jsts.geom.GeometryFactory.prototype.createLineString=function(t){var e=new jsts.geom.LineString(t,this);return e},jsts.geom.GeometryFactory.prototype.createLinearRing=function(t){var e=new jsts.geom.LinearRing(t,this);return e},jsts.geom.GeometryFactory.prototype.createPolygon=function(t,e){var n=new jsts.geom.Polygon(t,e,this);return n},jsts.geom.GeometryFactory.prototype.createMultiPoint=function(t){if(t&&t[0]instanceof jsts.geom.Coordinate){var e,n=[];for(e=0;e<t.length;e++)n.push(this.createPoint(t[e]));t=n}return new jsts.geom.MultiPoint(t,this)},jsts.geom.GeometryFactory.prototype.createMultiLineString=function(t){return new jsts.geom.MultiLineString(t,this)},jsts.geom.GeometryFactory.prototype.createMultiPolygon=function(t){return new jsts.geom.MultiPolygon(t,this)},jsts.geom.GeometryFactory.prototype.buildGeometry=function(t){for(var e=null,n=!1,o=!1,r=t.iterator();r.hasNext();){var i=r.next(),s=i.CLASS_NAME;null===e&&(e=s),s!==e&&(n=!0),i.isGeometryCollectionBase()&&(o=!0)}if(null===e)return this.createGeometryCollection(null);if(n||o)return this.createGeometryCollection(t.toArray());var a=t.get(0),u=t.size()>1;if(u){if(a instanceof jsts.geom.Polygon)return this.createMultiPolygon(t.toArray());if(a instanceof jsts.geom.LineString)return this.createMultiLineString(t.toArray());if(a instanceof jsts.geom.Point)return this.createMultiPoint(t.toArray());jsts.util.Assert.shouldNeverReachHere("Unhandled class: "+a)}return a},jsts.geom.GeometryFactory.prototype.createGeometryCollection=function(t){return new jsts.geom.GeometryCollection(t,this)},jsts.geom.GeometryFactory.prototype.toGeometry=function(t){return t.isNull()?this.createPoint(null):t.getMinX()===t.getMaxX()&&t.getMinY()===t.getMaxY()?this.createPoint(new jsts.geom.Coordinate(t.getMinX(),t.getMinY())):t.getMinX()===t.getMaxX()||t.getMinY()===t.getMaxY()?this.createLineString([new jsts.geom.Coordinate(t.getMinX(),t.getMinY()),new jsts.geom.Coordinate(t.getMaxX(),t.getMaxY())]):this.createPolygon(this.createLinearRing([new jsts.geom.Coordinate(t.getMinX(),t.getMinY()),new jsts.geom.Coordinate(t.getMinX(),t.getMaxY()),new jsts.geom.Coordinate(t.getMaxX(),t.getMaxY()),new jsts.geom.Coordinate(t.getMaxX(),t.getMinY()),new jsts.geom.Coordinate(t.getMinX(),t.getMinY())]),null)},jsts.geomgraph.NodeFactory=function(){},jsts.geomgraph.NodeFactory.prototype.createNode=function(t){return new jsts.geomgraph.Node(t,null)},function(){jsts.geomgraph.Position=function(){},jsts.geomgraph.Position.ON=0,jsts.geomgraph.Position.LEFT=1,jsts.geomgraph.Position.RIGHT=2,jsts.geomgraph.Position.opposite=function(t){return t===jsts.geomgraph.Position.LEFT?jsts.geomgraph.Position.RIGHT:t===jsts.geomgraph.Position.RIGHT?jsts.geomgraph.Position.LEFT:t}}(),jsts.geomgraph.TopologyLocation=function(){if(this.location=[],3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2];this.init(3),this.location[jsts.geomgraph.Position.ON]=t,this.location[jsts.geomgraph.Position.LEFT]=e,this.location[jsts.geomgraph.Position.RIGHT]=n}else if(arguments[0]instanceof jsts.geomgraph.TopologyLocation){var o=arguments[0];if(this.init(o.location.length),null!=o)for(var r=0;r<this.location.length;r++)this.location[r]=o.location[r]}else if("number"==typeof arguments[0]){var t=arguments[0];this.init(1),this.location[jsts.geomgraph.Position.ON]=t}else if(arguments[0]instanceof Array){var i=arguments[0];this.init(i.length)}},jsts.geomgraph.TopologyLocation.prototype.location=null,jsts.geomgraph.TopologyLocation.prototype.init=function(t){this.location[t-1]=null,this.setAllLocations(jsts.geom.Location.NONE)},jsts.geomgraph.TopologyLocation.prototype.get=function(t){return t<this.location.length?this.location[t]:jsts.geom.Location.NONE},jsts.geomgraph.TopologyLocation.prototype.isNull=function(){for(var t=0;t<this.location.length;t++)if(this.location[t]!==jsts.geom.Location.NONE)return!1;return!0},jsts.geomgraph.TopologyLocation.prototype.isAnyNull=function(){for(var t=0;t<this.location.length;t++)if(this.location[t]===jsts.geom.Location.NONE)return!0;return!1},jsts.geomgraph.TopologyLocation.prototype.isEqualOnSide=function(t,e){return this.location[e]==t.location[e]},jsts.geomgraph.TopologyLocation.prototype.isArea=function(){return this.location.length>1},jsts.geomgraph.TopologyLocation.prototype.isLine=function(){return 1===this.location.length},jsts.geomgraph.TopologyLocation.prototype.flip=function(){if(!(this.location.length<=1)){var t=this.location[jsts.geomgraph.Position.LEFT];this.location[jsts.geomgraph.Position.LEFT]=this.location[jsts.geomgraph.Position.RIGHT],this.location[jsts.geomgraph.Position.RIGHT]=t}},jsts.geomgraph.TopologyLocation.prototype.setAllLocations=function(t){for(var e=0;e<this.location.length;e++)this.location[e]=t},jsts.geomgraph.TopologyLocation.prototype.setAllLocationsIfNull=function(t){for(var e=0;e<this.location.length;e++)this.location[e]===jsts.geom.Location.NONE&&(this.location[e]=t)},jsts.geomgraph.TopologyLocation.prototype.setLocation=function(t,e){void 0!==e?this.location[t]=e:this.setLocation(jsts.geomgraph.Position.ON,t)},jsts.geomgraph.TopologyLocation.prototype.getLocations=function(){return location},jsts.geomgraph.TopologyLocation.prototype.setLocations=function(t,e,n){this.location[jsts.geomgraph.Position.ON]=t,this.location[jsts.geomgraph.Position.LEFT]=e,this.location[jsts.geomgraph.Position.RIGHT]=n},jsts.geomgraph.TopologyLocation.prototype.allPositionsEqual=function(t){for(var e=0;e<this.location.length;e++)if(this.location[e]!==t)return!1;return!0},jsts.geomgraph.TopologyLocation.prototype.merge=function(t){if(t.location.length>this.location.length){var e=[];e[jsts.geomgraph.Position.ON]=this.location[jsts.geomgraph.Position.ON],e[jsts.geomgraph.Position.LEFT]=jsts.geom.Location.NONE,e[jsts.geomgraph.Position.RIGHT]=jsts.geom.Location.NONE,this.location=e}for(var n=0;n<this.location.length;n++)this.location[n]===jsts.geom.Location.NONE&&n<t.location.length&&(this.location[n]=t.location[n])},jsts.geomgraph.Label=function(){this.elt=[];var t,e,n,o,r;4===arguments.length?(t=arguments[0],e=arguments[1],n=arguments[2],r=arguments[3],this.elt[0]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE),this.elt[1]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE),this.elt[t].setLocations(e,n,r)):3===arguments.length?(e=arguments[0],n=arguments[1],r=arguments[2],this.elt[0]=new jsts.geomgraph.TopologyLocation(e,n,r),this.elt[1]=new jsts.geomgraph.TopologyLocation(e,n,r)):2===arguments.length?(t=arguments[0],e=arguments[1],this.elt[0]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE),this.elt[1]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE),this.elt[t].setLocation(e)):arguments[0]instanceof jsts.geomgraph.Label?(o=arguments[0],this.elt[0]=new jsts.geomgraph.TopologyLocation(o.elt[0]),this.elt[1]=new jsts.geomgraph.TopologyLocation(o.elt[1])):"number"==typeof arguments[0]&&(e=arguments[0],this.elt[0]=new jsts.geomgraph.TopologyLocation(e),this.elt[1]=new jsts.geomgraph.TopologyLocation(e))},jsts.geomgraph.Label.toLineLabel=function(t){var e,n=new jsts.geomgraph.Label(jsts.geom.Location.NONE);for(e=0;2>e;e++)n.setLocation(e,t.getLocation(e));return n},jsts.geomgraph.Label.prototype.elt=null,jsts.geomgraph.Label.prototype.flip=function(){this.elt[0].flip(),this.elt[1].flip()},jsts.geomgraph.Label.prototype.getLocation=function(t,e){return 1==arguments.length?this.getLocation2.apply(this,arguments):this.elt[t].get(e)},jsts.geomgraph.Label.prototype.getLocation2=function(t){return this.elt[t].get(jsts.geomgraph.Position.ON)},jsts.geomgraph.Label.prototype.setLocation=function(t,e,n){return 2==arguments.length?void this.setLocation2.apply(this,arguments):void this.elt[t].setLocation(e,n)},jsts.geomgraph.Label.prototype.setLocation2=function(t,e){this.elt[t].setLocation(jsts.geomgraph.Position.ON,e)},jsts.geomgraph.Label.prototype.setAllLocations=function(t,e){this.elt[t].setAllLocations(e)},jsts.geomgraph.Label.prototype.setAllLocationsIfNull=function(t,e){return 1==arguments.length?void this.setAllLocationsIfNull2.apply(this,arguments):void this.elt[t].setAllLocationsIfNull(e)},jsts.geomgraph.Label.prototype.setAllLocationsIfNull2=function(t){this.setAllLocationsIfNull(0,t),this.setAllLocationsIfNull(1,t)},jsts.geomgraph.Label.prototype.merge=function(t){var e;for(e=0;2>e;e++)null===this.elt[e]&&null!==t.elt[e]?this.elt[e]=new jsts.geomgraph.TopologyLocation(t.elt[e]):this.elt[e].merge(t.elt[e])},jsts.geomgraph.Label.prototype.getGeometryCount=function(){var t=0;return this.elt[0].isNull()||t++,this.elt[1].isNull()||t++,t},jsts.geomgraph.Label.prototype.isNull=function(t){return this.elt[t].isNull()},jsts.geomgraph.Label.prototype.isAnyNull=function(t){return this.elt[t].isAnyNull()},jsts.geomgraph.Label.prototype.isArea=function(){return 1==arguments.length?this.isArea2(arguments[0]):this.elt[0].isArea()||this.elt[1].isArea()},jsts.geomgraph.Label.prototype.isArea2=function(t){return this.elt[t].isArea()},jsts.geomgraph.Label.prototype.isLine=function(t){return this.elt[t].isLine()},jsts.geomgraph.Label.prototype.isEqualOnSide=function(t,e){return this.elt[0].isEqualOnSide(t.elt[0],e)&&this.elt[1].isEqualOnSide(t.elt[1],e)},jsts.geomgraph.Label.prototype.allPositionsEqual=function(t,e){return this.elt[t].allPositionsEqual(e)},jsts.geomgraph.Label.prototype.toLine=function(t){this.elt[t].isArea()&&(this.elt[t]=new jsts.geomgraph.TopologyLocation(this.elt[t].location[0]))},jsts.geomgraph.EdgeRing=function(t,e){this.edges=[],this.pts=[],this.holes=[],this.label=new jsts.geomgraph.Label(jsts.geom.Location.NONE),this.geometryFactory=e,t&&(this.computePoints(t),this.computeRing())},jsts.geomgraph.EdgeRing.prototype.startDe=null,jsts.geomgraph.EdgeRing.prototype.maxNodeDegree=-1,jsts.geomgraph.EdgeRing.prototype.edges=null,jsts.geomgraph.EdgeRing.prototype.pts=null,jsts.geomgraph.EdgeRing.prototype.label=null,jsts.geomgraph.EdgeRing.prototype.ring=null,jsts.geomgraph.EdgeRing.prototype._isHole=null,jsts.geomgraph.EdgeRing.prototype.shell=null,jsts.geomgraph.EdgeRing.prototype.holes=null,jsts.geomgraph.EdgeRing.prototype.geometryFactory=null,jsts.geomgraph.EdgeRing.prototype.isIsolated=function(){return 1==this.label.getGeometryCount()},jsts.geomgraph.EdgeRing.prototype.isHole=function(){return this._isHole},jsts.geomgraph.EdgeRing.prototype.getCoordinate=function(t){return this.pts[t]},jsts.geomgraph.EdgeRing.prototype.getLinearRing=function(){return this.ring},jsts.geomgraph.EdgeRing.prototype.getLabel=function(){return this.label},jsts.geomgraph.EdgeRing.prototype.isShell=function(){return null===this.shell},jsts.geomgraph.EdgeRing.prototype.getShell=function(){return this.shell},jsts.geomgraph.EdgeRing.prototype.setShell=function(t){this.shell=t,null!==t&&t.addHole(this)},jsts.geomgraph.EdgeRing.prototype.addHole=function(t){this.holes.push(t)},jsts.geomgraph.EdgeRing.prototype.toPolygon=function(){for(var t=[],e=0;e<this.holes.length;e++)t[e]=this.holes[e].getLinearRing();var n=this.geometryFactory.createPolygon(this.getLinearRing(),t);return n},jsts.geomgraph.EdgeRing.prototype.computeRing=function(){if(null===this.ring){for(var t=[],e=0;e<this.pts.length;e++)t[e]=this.pts[e];this.ring=this.geometryFactory.createLinearRing(t),this._isHole=jsts.algorithm.CGAlgorithms.isCCW(this.ring.getCoordinates())}},jsts.geomgraph.EdgeRing.prototype.getNext=function(){throw new jsts.error.AbstractInvocationError},jsts.geomgraph.EdgeRing.prototype.setEdgeRing=function(){throw new jsts.error.AbstractInvocationError},jsts.geomgraph.EdgeRing.prototype.getEdges=function(){return this.edges},jsts.geomgraph.EdgeRing.prototype.computePoints=function(t){this.startDe=t;var e=t,n=!0;do{if(null===e)throw new jsts.error.TopologyError("Found null DirectedEdge");if(e.getEdgeRing()===this)throw new jsts.error.TopologyError("Directed Edge visited twice during ring-building at "+e.getCoordinate());this.edges.push(e);var o=e.getLabel();jsts.util.Assert.isTrue(o.isArea()),this.mergeLabel(o),this.addPoints(e.getEdge(),e.isForward(),n),n=!1,this.setEdgeRing(e,this),e=this.getNext(e)}while(e!==this.startDe)},jsts.geomgraph.EdgeRing.prototype.getMaxNodeDegree=function(){return this.maxNodeDegree<0&&this.computeMaxNodeDegree(),this.maxNodeDegree},jsts.geomgraph.EdgeRing.prototype.computeMaxNodeDegree=function(){this.maxNodeDegree=0;var t=this.startDe;do{var e=t.getNode(),n=e.getEdges().getOutgoingDegree(this);n>this.maxNodeDegree&&(this.maxNodeDegree=n),t=this.getNext(t)}while(t!==this.startDe);this.maxNodeDegree*=2},jsts.geomgraph.EdgeRing.prototype.setInResult=function(){var t=this.startDe;do t.getEdge().setInResult(!0),t=t.getNext();while(t!=this.startDe)},jsts.geomgraph.EdgeRing.prototype.mergeLabel=function(t){this.mergeLabel2(t,0),this.mergeLabel2(t,1)},jsts.geomgraph.EdgeRing.prototype.mergeLabel2=function(t,e){var n=t.getLocation(e,jsts.geomgraph.Position.RIGHT);if(n!=jsts.geom.Location.NONE)return this.label.getLocation(e)===jsts.geom.Location.NONE?void this.label.setLocation(e,n):void 0},jsts.geomgraph.EdgeRing.prototype.addPoints=function(t,e,n){var o=t.getCoordinates();if(e){var r=1;n&&(r=0);for(var i=r;i<o.length;i++)this.pts.push(o[i])}else{var r=o.length-2;n&&(r=o.length-1);for(var i=r;i>=0;i--)this.pts.push(o[i])}},jsts.geomgraph.EdgeRing.prototype.containsPoint=function(t){var e=this.getLinearRing(),n=e.getEnvelopeInternal();
if(!n.contains(t))return!1;if(!jsts.algorithm.CGAlgorithms.isPointInRing(t,e.getCoordinates()))return!1;for(var o=0;o<this.holes.length;o++){var r=this.holes[o];if(r.containsPoint(t))return!1}return!0},function(){jsts.geom.LinearRing=function(){jsts.geom.LineString.apply(this,arguments)},jsts.geom.LinearRing.prototype=new jsts.geom.LineString,jsts.geom.LinearRing.constructor=jsts.geom.LinearRing,jsts.geom.LinearRing.prototype.getBoundaryDimension=function(){return jsts.geom.Dimension.FALSE},jsts.geom.LinearRing.prototype.isSimple=function(){return!0},jsts.geom.LinearRing.prototype.getGeometryType=function(){return"LinearRing"},jsts.geom.LinearRing.MINIMUM_VALID_SIZE=4,jsts.geom.LinearRing.prototype.CLASS_NAME="jsts.geom.LinearRing"}(),jsts.index.strtree.Boundable=function(){},jsts.index.strtree.Boundable.prototype.getBounds=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractNode=function(t){this.level=t,this.childBoundables=[]},jsts.index.strtree.AbstractNode.prototype=new jsts.index.strtree.Boundable,jsts.index.strtree.AbstractNode.constructor=jsts.index.strtree.AbstractNode,jsts.index.strtree.AbstractNode.prototype.childBoundables=null,jsts.index.strtree.AbstractNode.prototype.bounds=null,jsts.index.strtree.AbstractNode.prototype.level=null,jsts.index.strtree.AbstractNode.prototype.getChildBoundables=function(){return this.childBoundables},jsts.index.strtree.AbstractNode.prototype.computeBounds=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractNode.prototype.getBounds=function(){return null===this.bounds&&(this.bounds=this.computeBounds()),this.bounds},jsts.index.strtree.AbstractNode.prototype.getLevel=function(){return this.level},jsts.index.strtree.AbstractNode.prototype.addChildBoundable=function(t){this.childBoundables.push(t)},function(){jsts.noding.Noder=function(){},jsts.noding.Noder.prototype.computeNodes=jsts.abstractFunc,jsts.noding.Noder.prototype.getNodedSubstrings=jsts.abstractFunc}(),function(){var t=jsts.noding.Noder;jsts.noding.SinglePassNoder=function(){},jsts.noding.SinglePassNoder.prototype=new t,jsts.noding.SinglePassNoder.constructor=jsts.noding.SinglePassNoder,jsts.noding.SinglePassNoder.prototype.segInt=null,jsts.noding.SinglePassNoder.prototype.setSegmentIntersector=function(t){this.segInt=t}}(),jsts.index.SpatialIndex=function(){},jsts.index.SpatialIndex.prototype.insert=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.SpatialIndex.prototype.query=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.SpatialIndex.prototype.remove=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractSTRtree=function(t){void 0!==t&&(this.itemBoundables=[],jsts.util.Assert.isTrue(t>1,"Node capacity must be greater than 1"),this.nodeCapacity=t)},jsts.index.strtree.AbstractSTRtree.IntersectsOp=function(){},jsts.index.strtree.AbstractSTRtree.IntersectsOp.prototype.intersects=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractSTRtree.prototype.root=null,jsts.index.strtree.AbstractSTRtree.prototype.built=!1,jsts.index.strtree.AbstractSTRtree.prototype.itemBoundables=null,jsts.index.strtree.AbstractSTRtree.prototype.nodeCapacity=null,jsts.index.strtree.AbstractSTRtree.prototype.build=function(){jsts.util.Assert.isTrue(!this.built),this.root=0===this.itemBoundables.length?this.createNode(0):this.createHigherLevels(this.itemBoundables,-1),this.built=!0},jsts.index.strtree.AbstractSTRtree.prototype.createNode=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables=function(t,e){jsts.util.Assert.isTrue(!(0===t.length));var n=[];n.push(this.createNode(e));for(var o=[],r=0;r<t.length;r++)o.push(t[r]);o.sort(this.getComparator());for(var r=0;r<o.length;r++){var i=o[r];this.lastNode(n).getChildBoundables().length===this.getNodeCapacity()&&n.push(this.createNode(e)),this.lastNode(n).addChildBoundable(i)}return n},jsts.index.strtree.AbstractSTRtree.prototype.lastNode=function(t){return t[t.length-1]},jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles=function(t,e){return t>e?1:e>t?-1:0},jsts.index.strtree.AbstractSTRtree.prototype.createHigherLevels=function(t,e){jsts.util.Assert.isTrue(!(0===t.length));var n=this.createParentBoundables(t,e+1);return 1===n.length?n[0]:this.createHigherLevels(n,e+1)},jsts.index.strtree.AbstractSTRtree.prototype.getRoot=function(){return this.built||this.build(),this.root},jsts.index.strtree.AbstractSTRtree.prototype.getNodeCapacity=function(){return this.nodeCapacity},jsts.index.strtree.AbstractSTRtree.prototype.size=function(){return 1===arguments.length?this.size2(arguments[0]):(this.built||this.build(),0===this.itemBoundables.length?0:this.size2(root))},jsts.index.strtree.AbstractSTRtree.prototype.size2=function(t){for(var e=0,n=t.getChildBoundables(),o=0;o<n.length;o++){var r=n[o];r instanceof jsts.index.strtree.AbstractNode?e+=this.size(r):r instanceof jsts.index.strtree.ItemBoundable&&(e+=1)}return e},jsts.index.strtree.AbstractSTRtree.prototype.depth=function(){return 1===arguments.length?this.depth2(arguments[0]):(this.built||this.build(),0===this.itemBoundables.length?0:this.depth2(root))},jsts.index.strtree.AbstractSTRtree.prototype.depth2=function(){for(var t=0,e=node.getChildBoundables(),n=0;n<e.length;n++){var o=e[n];if(o instanceof jsts.index.strtree.AbstractNode){var r=this.depth(o);r>t&&(t=r)}}return t+1},jsts.index.strtree.AbstractSTRtree.prototype.insert=function(t,e){jsts.util.Assert.isTrue(!this.built,"Cannot insert items into an STR packed R-tree after it has been built."),this.itemBoundables.push(new jsts.index.strtree.ItemBoundable(t,e))},jsts.index.strtree.AbstractSTRtree.prototype.query=function(t){arguments.length>1&&this.query2.apply(this,arguments),this.built||this.build();var e=[];return 0===this.itemBoundables.length?(jsts.util.Assert.isTrue(null===this.root.getBounds()),e):(this.getIntersectsOp().intersects(this.root.getBounds(),t)&&this.query3(t,this.root,e),e)},jsts.index.strtree.AbstractSTRtree.prototype.query2=function(t,e){arguments.length>2&&this.query3.apply(this,arguments),this.built||this.build(),0===this.itemBoundables.length&&jsts.util.Assert.isTrue(null===this.root.getBounds()),this.getIntersectsOp().intersects(this.root.getBounds(),t)&&this.query4(t,this.root,e)},jsts.index.strtree.AbstractSTRtree.prototype.query3=function(t,e,n){arguments[2]instanceof Array||this.query4.apply(this,arguments);for(var o=e.getChildBoundables(),r=0;r<o.length;r++){var i=o[r];this.getIntersectsOp().intersects(i.getBounds(),t)&&(i instanceof jsts.index.strtree.AbstractNode?this.query3(t,i,n):i instanceof jsts.index.strtree.ItemBoundable?n.push(i.getItem()):jsts.util.Assert.shouldNeverReachHere())}},jsts.index.strtree.AbstractSTRtree.prototype.query4=function(t,e,n){for(var o=e.getChildBoundables(),r=0;r<o.length;r++){var i=o[r];this.getIntersectsOp().intersects(i.getBounds(),t)&&(i instanceof jsts.index.strtree.AbstractNode?this.query4(t,i,n):i instanceof jsts.index.strtree.ItemBoundable?n.visitItem(i.getItem()):jsts.util.Assert.shouldNeverReachHere())}},jsts.index.strtree.AbstractSTRtree.prototype.getIntersectsOp=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.AbstractSTRtree.prototype.itemsTree=function(){if(1===arguments.length)return this.itemsTree2.apply(this,arguments);this.built||this.build();var t=this.itemsTree2(this.root);return null===t?[]:t},jsts.index.strtree.AbstractSTRtree.prototype.itemsTree2=function(t){for(var e=[],n=t.getChildBoundables(),o=0;o<n.length;o++){var r=n[o];if(r instanceof jsts.index.strtree.AbstractNode){var i=this.itemsTree(r);null!=i&&e.push(i)}else r instanceof jsts.index.strtree.ItemBoundable?e.push(r.getItem()):jsts.util.Assert.shouldNeverReachHere()}return e.length<=0?null:e},jsts.index.strtree.AbstractSTRtree.prototype.remove=function(t,e){return this.built||this.build(),0===this.itemBoundables.length&&jsts.util.Assert.isTrue(null==this.root.getBounds()),this.getIntersectsOp().intersects(this.root.getBounds(),t)?this.remove2(t,this.root,e):!1},jsts.index.strtree.AbstractSTRtree.prototype.remove2=function(t,e,n){var o=this.removeItem(e,n);if(o)return!0;for(var r=null,i=e.getChildBoundables(),s=0;s<i.length;s++){var a=i[s];if(this.getIntersectsOp().intersects(a.getBounds(),t)&&a instanceof jsts.index.strtree.AbstractNode&&(o=this.remove(t,a,n))){r=a;break}}return null!=r&&0===r.getChildBoundables().length&&i.splice(i.indexOf(r),1),o},jsts.index.strtree.AbstractSTRtree.prototype.removeItem=function(t,e){for(var n=null,o=t.getChildBoundables(),r=0;r<o.length;r++){var i=o[r];i instanceof jsts.index.strtree.ItemBoundable&&i.getItem()===e&&(n=i)}return null!==n?(o.splice(o.indexOf(n),1),!0):!1},jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel=function(t){if(arguments.length>1)return void this.boundablesAtLevel2.apply(this,arguments);var e=[];return this.boundablesAtLevel2(t,this.root,e),e},jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel2=function(t,e,n){if(jsts.util.Assert.isTrue(t>-2),e.getLevel()===t)return void n.add(e);for(var o=node.getChildBoundables(),r=0;r<o.length;r++){var i=o[r];i instanceof jsts.index.strtree.AbstractNode?this.boundablesAtLevel(t,i,n):(jsts.util.Assert.isTrue(i instanceof jsts.index.strtree.ItemBoundable),-1===t&&n.add(i))}},jsts.index.strtree.AbstractSTRtree.prototype.getComparator=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.index.strtree.STRtree=function(t){t=t||jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY,jsts.index.strtree.AbstractSTRtree.call(this,t)},jsts.index.strtree.STRtree.prototype=new jsts.index.strtree.AbstractSTRtree,jsts.index.strtree.STRtree.constructor=jsts.index.strtree.STRtree,jsts.index.strtree.STRtree.prototype.xComparator=function(t,e){return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(jsts.index.strtree.STRtree.prototype.centreX(t.getBounds()),jsts.index.strtree.STRtree.prototype.centreX(e.getBounds()))},jsts.index.strtree.STRtree.prototype.yComparator=function(t,e){return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(jsts.index.strtree.STRtree.prototype.centreY(t.getBounds()),jsts.index.strtree.STRtree.prototype.centreY(e.getBounds()))},jsts.index.strtree.STRtree.prototype.centreX=function(t){return jsts.index.strtree.STRtree.prototype.avg(t.getMinX(),t.getMaxX())},jsts.index.strtree.STRtree.prototype.centreY=function(t){return jsts.index.strtree.STRtree.prototype.avg(t.getMinY(),t.getMaxY())},jsts.index.strtree.STRtree.prototype.avg=function(t,e){return(t+e)/2},jsts.index.strtree.STRtree.prototype.intersectsOp={intersects:function(t,e){return t.intersects(e)}},jsts.index.strtree.STRtree.prototype.createParentBoundables=function(t,e){jsts.util.Assert.isTrue(!(0===t.length));for(var n=Math.ceil(t.length/this.getNodeCapacity()),o=[],r=0;r<t.length;r++)o.push(t[r]);o.sort(this.xComparator);var i=this.verticalSlices(o,Math.ceil(Math.sqrt(n)));return this.createParentBoundablesFromVerticalSlices(i,e)},jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlices=function(t,e){jsts.util.Assert.isTrue(t.length>0);for(var n=[],o=0;o<t.length;o++)n=n.concat(this.createParentBoundablesFromVerticalSlice(t[o],e));return n},jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlice=function(t,e){return jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables.call(this,t,e)},jsts.index.strtree.STRtree.prototype.verticalSlices=function(t,e){for(var n,o,r=Math.ceil(t.length/e),i=[],s=0,a=0;e>a;a++)for(i[a]=[],n=0;s<t.length&&r>n;)o=t[s++],i[a].push(o),n++;return i},jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY=10,jsts.index.strtree.STRtree.prototype.createNode=function(t){var e=new jsts.index.strtree.AbstractNode(t);return e.computeBounds=function(){for(var t=null,e=this.getChildBoundables(),n=0;n<e.length;n++){var o=e[n];null===t?t=new jsts.geom.Envelope(o.getBounds()):t.expandToInclude(o.getBounds())}return t},e},jsts.index.strtree.STRtree.prototype.getIntersectsOp=function(){return this.intersectsOp},jsts.index.strtree.STRtree.prototype.insert=function(t,e){t.isNull()||jsts.index.strtree.AbstractSTRtree.prototype.insert.call(this,t,e)},jsts.index.strtree.STRtree.prototype.query=function(){return jsts.index.strtree.AbstractSTRtree.prototype.query.apply(this,arguments)},jsts.index.strtree.STRtree.prototype.remove=function(t,e){return jsts.index.strtree.AbstractSTRtree.prototype.remove.call(this,t,e)},jsts.index.strtree.STRtree.prototype.size=function(){return jsts.index.strtree.AbstractSTRtree.prototype.size.call(this)},jsts.index.strtree.STRtree.prototype.depth=function(){return jsts.index.strtree.AbstractSTRtree.prototype.depth.call(this)},jsts.index.strtree.STRtree.prototype.getComparator=function(){return this.yComparator},jsts.index.strtree.STRtree.prototype.nearestNeighbour=function(t){var e=new jsts.index.strtree.BoundablePair(this.getRoot(),this.getRoot(),t);return this.nearestNeighbour4(e)},jsts.index.strtree.STRtree.prototype.nearestNeighbour2=function(t,e,n){var o=new jsts.index.strtree.ItemBoundable(t,e),r=new jsts.index.strtree.BoundablePair(this.getRoot(),o,n);return this.nearestNeighbour4(r)[0]},jsts.index.strtree.STRtree.prototype.nearestNeighbour3=function(t,e){var n=new jsts.index.strtree.BoundablePair(this.getRoot(),t.getRoot(),e);return this.nearestNeighbour4(n)},jsts.index.strtree.STRtree.prototype.nearestNeighbour4=function(t){return this.nearestNeighbour5(t,Double.POSITIVE_INFINITY)},jsts.index.strtree.STRtree.prototype.nearestNeighbour5=function(t,e){var n=e,o=null,r=[];for(r.push(t);!r.isEmpty()&&n>0;){var i=r.pop(),s=i.getDistance();if(s>=n)break;i.isLeaves()?(n=s,o=i):i.expandToQueue(r,n)}return[o.getBoundable(0).getItem(),o.getBoundable(1).getItem()]},jsts.noding.SegmentString=function(){},jsts.noding.SegmentString.prototype.getData=jsts.abstractFunc,jsts.noding.SegmentString.prototype.setData=jsts.abstractFunc,jsts.noding.SegmentString.prototype.size=jsts.abstractFunc,jsts.noding.SegmentString.prototype.getCoordinate=jsts.abstractFunc,jsts.noding.SegmentString.prototype.getCoordinates=jsts.abstractFunc,jsts.noding.SegmentString.prototype.isClosed=jsts.abstractFunc,jsts.noding.NodableSegmentString=function(){},jsts.noding.NodableSegmentString.prototype=new jsts.noding.SegmentString,jsts.noding.NodableSegmentString.prototype.addIntersection=jsts.abstractFunc,jsts.noding.NodedSegmentString=function(t,e){this.nodeList=new jsts.noding.SegmentNodeList(this),this.pts=t,this.data=e},jsts.noding.NodedSegmentString.prototype=new jsts.noding.NodableSegmentString,jsts.noding.NodedSegmentString.constructor=jsts.noding.NodedSegmentString,jsts.noding.NodedSegmentString.getNodedSubstrings=function(t){if(2===arguments.length)return void jsts.noding.NodedSegmentString.getNodedSubstrings2.apply(this,arguments);var e=new javascript.util.ArrayList;return jsts.noding.NodedSegmentString.getNodedSubstrings2(t,e),e},jsts.noding.NodedSegmentString.getNodedSubstrings2=function(t,e){for(var n=t.iterator();n.hasNext();){var o=n.next();o.getNodeList().addSplitEdges(e)}},jsts.noding.NodedSegmentString.prototype.nodeList=null,jsts.noding.NodedSegmentString.prototype.pts=null,jsts.noding.NodedSegmentString.prototype.data=null,jsts.noding.NodedSegmentString.prototype.getData=function(){return this.data},jsts.noding.NodedSegmentString.prototype.setData=function(t){this.data=t},jsts.noding.NodedSegmentString.prototype.getNodeList=function(){return this.nodeList},jsts.noding.NodedSegmentString.prototype.size=function(){return this.pts.length},jsts.noding.NodedSegmentString.prototype.getCoordinate=function(t){return this.pts[t]},jsts.noding.NodedSegmentString.prototype.getCoordinates=function(){return this.pts},jsts.noding.NodedSegmentString.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1])},jsts.noding.NodedSegmentString.prototype.getSegmentOctant=function(t){return t===this.pts.length-1?-1:this.safeOctant(this.getCoordinate(t),this.getCoordinate(t+1))},jsts.noding.NodedSegmentString.prototype.safeOctant=function(t,e){return t.equals2D(e)?0:jsts.noding.Octant.octant(t,e)},jsts.noding.NodedSegmentString.prototype.addIntersections=function(t,e,n){for(var o=0;o<t.getIntersectionNum();o++)this.addIntersection(t,e,n,o)},jsts.noding.NodedSegmentString.prototype.addIntersection=function(t,e,n,o){if(t instanceof jsts.geom.Coordinate)return void this.addIntersection2.apply(this,arguments);var r=new jsts.geom.Coordinate(t.getIntersection(o));this.addIntersection2(r,e)},jsts.noding.NodedSegmentString.prototype.addIntersection2=function(t,e){this.addIntersectionNode(t,e)},jsts.noding.NodedSegmentString.prototype.addIntersectionNode=function(t,e){var n=e,o=n+1;if(o<this.pts.length){var r=this.pts[o];t.equals2D(r)&&(n=o)}var i=this.nodeList.add(t,n);return i},jsts.noding.NodedSegmentString.prototype.toString=function(){var t=new jsts.geom.GeometryFactory;return(new jsts.io.WKTWriter).write(t.createLineString(this.pts))},jsts.index.chain.MonotoneChainBuilder=function(){},jsts.index.chain.MonotoneChainBuilder.toIntArray=function(t){for(var e=[],n=0;n<t.length;n++)e[n]=t[n];return e},jsts.index.chain.MonotoneChainBuilder.getChains=function(t){return 2===arguments.length?jsts.index.chain.MonotoneChainBuilder.getChains2.apply(this,arguments):jsts.index.chain.MonotoneChainBuilder.getChains2(t,null)},jsts.index.chain.MonotoneChainBuilder.getChains2=function(t,e){for(var n=[],o=jsts.index.chain.MonotoneChainBuilder.getChainStartIndices(t),r=0;r<o.length-1;r++){var i=new jsts.index.chain.MonotoneChain(t,o[r],o[r+1],e);n.push(i)}return n},jsts.index.chain.MonotoneChainBuilder.getChainStartIndices=function(t){var e=0,n=[];n.push(e);do{var o=jsts.index.chain.MonotoneChainBuilder.findChainEnd(t,e);n.push(o),e=o}while(e<t.length-1);var r=jsts.index.chain.MonotoneChainBuilder.toIntArray(n);return r},jsts.index.chain.MonotoneChainBuilder.findChainEnd=function(t,e){for(var n=e;n<t.length-1&&t[n].equals2D(t[n+1]);)n++;if(n>=t.length-1)return t.length-1;for(var o=jsts.geomgraph.Quadrant.quadrant(t[n],t[n+1]),r=e+1;r<t.length;){if(!t[r-1].equals2D(t[r])){var i=jsts.geomgraph.Quadrant.quadrant(t[r-1],t[r]);if(i!==o)break}r++}return r-1},jsts.algorithm.LineIntersector=function(){this.inputLines=[[],[]],this.intPt=[null,null],this.pa=this.intPt[0],this.pb=this.intPt[1],this.result=jsts.algorithm.LineIntersector.NO_INTERSECTION},jsts.algorithm.LineIntersector.NO_INTERSECTION=0,jsts.algorithm.LineIntersector.POINT_INTERSECTION=1,jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION=2,jsts.algorithm.LineIntersector.prototype.setPrecisionModel=function(t){this.precisionModel=t},jsts.algorithm.LineIntersector.prototype.getEndpoint=function(t,e){return this.inputLines[t][e]},jsts.algorithm.LineIntersector.computeEdgeDistance=function(t,e,n){var o=Math.abs(n.x-e.x),r=Math.abs(n.y-e.y),i=-1;if(t.equals(e))i=0;else if(t.equals(n))i=o>r?o:r;else{var s=Math.abs(t.x-e.x),a=Math.abs(t.y-e.y);i=o>r?s:a,0!==i||t.equals(e)||(i=Math.max(s,a))}if(0===i&&!t.equals(e))throw new jsts.error.IllegalArgumentError("Bad distance calculation");return i},jsts.algorithm.LineIntersector.nonRobustComputeEdgeDistance=function(t,e){var n=t.x-e.x,o=t.y-e.y,r=Math.sqrt(n*n+o*o);if(0!==r||t.equals(e))throw new jsts.error.IllegalArgumentError("Invalid distance calculation");return r},jsts.algorithm.LineIntersector.prototype.result=null,jsts.algorithm.LineIntersector.prototype.inputLines=null,jsts.algorithm.LineIntersector.prototype.intPt=null,jsts.algorithm.LineIntersector.prototype.intLineIndex=null,jsts.algorithm.LineIntersector.prototype._isProper=null,jsts.algorithm.LineIntersector.prototype.pa=null,jsts.algorithm.LineIntersector.prototype.pb=null,jsts.algorithm.LineIntersector.prototype.precisionModel=null,jsts.algorithm.LineIntersector.prototype.computeIntersection=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.algorithm.LineIntersector.prototype.isCollinear=function(){return this.result===jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION},jsts.algorithm.LineIntersector.prototype.computeIntersection=function(t,e,n,o){this.inputLines[0][0]=t,this.inputLines[0][1]=e,this.inputLines[1][0]=n,this.inputLines[1][1]=o,this.result=this.computeIntersect(t,e,n,o)},jsts.algorithm.LineIntersector.prototype.computeIntersect=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.algorithm.LineIntersector.prototype.isEndPoint=function(){return this.hasIntersection()&&!this._isProper},jsts.algorithm.LineIntersector.prototype.hasIntersection=function(){return this.result!==jsts.algorithm.LineIntersector.NO_INTERSECTION},jsts.algorithm.LineIntersector.prototype.getIntersectionNum=function(){return this.result},jsts.algorithm.LineIntersector.prototype.getIntersection=function(t){return this.intPt[t]},jsts.algorithm.LineIntersector.prototype.computeIntLineIndex=function(){null===this.intLineIndex&&(this.intLineIndex=[[],[]],this.computeIntLineIndex(0),this.computeIntLineIndex(1))},jsts.algorithm.LineIntersector.prototype.isIntersection=function(t){var e;for(e=0;e<this.result;e++)if(this.intPt[e].equals2D(t))return!0;return!1},jsts.algorithm.LineIntersector.prototype.isInteriorIntersection=function(){return 1===arguments.length?this.isInteriorIntersection2.apply(this,arguments):this.isInteriorIntersection(0)?!0:this.isInteriorIntersection(1)?!0:!1},jsts.algorithm.LineIntersector.prototype.isInteriorIntersection2=function(t){var e;for(e=0;e<this.result;e++)if(!this.intPt[e].equals2D(this.inputLines[t][0])&&!this.intPt[e].equals2D(this.inputLines[t][1]))return!0;return!1},jsts.algorithm.LineIntersector.prototype.isProper=function(){return this.hasIntersection()&&this._isProper},jsts.algorithm.LineIntersector.prototype.getIntersectionAlongSegment=function(t,e){return this.computeIntLineIndex(),this.intPt[intLineIndex[t][e]]},jsts.algorithm.LineIntersector.prototype.getIndexAlongSegment=function(t,e){return this.computeIntLineIndex(),this.intLineIndex[t][e]},jsts.algorithm.LineIntersector.prototype.computeIntLineIndex=function(t){var e=this.getEdgeDistance(t,0),n=this.getEdgeDistance(t,1);e>n?(this.intLineIndex[t][0]=0,this.intLineIndex[t][1]=1):(this.intLineIndex[t][0]=1,this.intLineIndex[t][1]=0)},jsts.algorithm.LineIntersector.prototype.getEdgeDistance=function(t,e){var n=jsts.algorithm.LineIntersector.computeEdgeDistance(this.intPt[e],this.inputLines[t][0],this.inputLines[t][1]);return n},jsts.algorithm.RobustLineIntersector=function(){jsts.algorithm.RobustLineIntersector.prototype.constructor.call(this)},jsts.algorithm.RobustLineIntersector.prototype=new jsts.algorithm.LineIntersector,jsts.algorithm.RobustLineIntersector.prototype.computeIntersection=function(t,e,n){return 4===arguments.length?void jsts.algorithm.LineIntersector.prototype.computeIntersection.apply(this,arguments):(this._isProper=!1,jsts.geom.Envelope.intersects(e,n,t)&&0===jsts.algorithm.CGAlgorithms.orientationIndex(e,n,t)&&0===jsts.algorithm.CGAlgorithms.orientationIndex(n,e,t)?(this._isProper=!0,(t.equals(e)||t.equals(n))&&(this._isProper=!1),void(this.result=jsts.algorithm.LineIntersector.POINT_INTERSECTION)):void(this.result=jsts.algorithm.LineIntersector.NO_INTERSECTION))},jsts.algorithm.RobustLineIntersector.prototype.computeIntersect=function(t,e,n,o){if(this._isProper=!1,!jsts.geom.Envelope.intersects(t,e,n,o))return jsts.algorithm.LineIntersector.NO_INTERSECTION;var r=jsts.algorithm.CGAlgorithms.orientationIndex(t,e,n),i=jsts.algorithm.CGAlgorithms.orientationIndex(t,e,o);if(r>0&&i>0||0>r&&0>i)return jsts.algorithm.LineIntersector.NO_INTERSECTION;var s=jsts.algorithm.CGAlgorithms.orientationIndex(n,o,t),a=jsts.algorithm.CGAlgorithms.orientationIndex(n,o,e);if(s>0&&a>0||0>s&&0>a)return jsts.algorithm.LineIntersector.NO_INTERSECTION;var u=0===r&&0===i&&0===s&&0===a;return u?this.computeCollinearIntersection(t,e,n,o):(0===r||0===i||0===s||0===a?(this._isProper=!1,t.equals2D(n)||t.equals2D(o)?this.intPt[0]=t:e.equals2D(n)||e.equals2D(o)?this.intPt[0]=e:0===r?this.intPt[0]=new jsts.geom.Coordinate(n):0===i?this.intPt[0]=new jsts.geom.Coordinate(o):0===s?this.intPt[0]=new jsts.geom.Coordinate(t):0===a&&(this.intPt[0]=new jsts.geom.Coordinate(e))):(this._isProper=!0,this.intPt[0]=this.intersection(t,e,n,o)),jsts.algorithm.LineIntersector.POINT_INTERSECTION)},jsts.algorithm.RobustLineIntersector.prototype.computeCollinearIntersection=function(t,e,n,o){var r=jsts.geom.Envelope.intersects(t,e,n),i=jsts.geom.Envelope.intersects(t,e,o),s=jsts.geom.Envelope.intersects(n,o,t),a=jsts.geom.Envelope.intersects(n,o,e);return r&&i?(this.intPt[0]=n,this.intPt[1]=o,jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION):s&&a?(this.intPt[0]=t,this.intPt[1]=e,jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION):r&&s?(this.intPt[0]=n,this.intPt[1]=t,!n.equals(t)||i||a?jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION:jsts.algorithm.LineIntersector.POINT_INTERSECTION):r&&a?(this.intPt[0]=n,this.intPt[1]=e,!n.equals(e)||i||s?jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION:jsts.algorithm.LineIntersector.POINT_INTERSECTION):i&&s?(this.intPt[0]=o,this.intPt[1]=t,!o.equals(t)||r||a?jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION:jsts.algorithm.LineIntersector.POINT_INTERSECTION):i&&a?(this.intPt[0]=o,this.intPt[1]=e,!o.equals(e)||r||s?jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION:jsts.algorithm.LineIntersector.POINT_INTERSECTION):jsts.algorithm.LineIntersector.NO_INTERSECTION},jsts.algorithm.RobustLineIntersector.prototype.intersection=function(t,e,n,o){var r=this.intersectionWithNormalization(t,e,n,o);return this.isInSegmentEnvelopes(r)||(r=jsts.algorithm.CentralEndpointIntersector.getIntersection(t,e,n,o)),null!==this.precisionModel&&this.precisionModel.makePrecise(r),r},jsts.algorithm.RobustLineIntersector.prototype.intersectionWithNormalization=function(t,e,n,o){var r=new jsts.geom.Coordinate(t),i=new jsts.geom.Coordinate(e),s=new jsts.geom.Coordinate(n),a=new jsts.geom.Coordinate(o),u=new jsts.geom.Coordinate;this.normalizeToEnvCentre(r,i,s,a,u);var p=this.safeHCoordinateIntersection(r,i,s,a);return p.x+=u.x,p.y+=u.y,p},jsts.algorithm.RobustLineIntersector.prototype.safeHCoordinateIntersection=function(t,e,n,o){var r=null;try{r=jsts.algorithm.HCoordinate.intersection(t,e,n,o)}catch(i){if(!(i instanceof jsts.error.NotRepresentableError))throw i;r=jsts.algorithm.CentralEndpointIntersector.getIntersection(t,e,n,o)}return r},jsts.algorithm.RobustLineIntersector.prototype.normalizeToMinimum=function(t,e,n,o,r){r.x=this.smallestInAbsValue(t.x,e.x,n.x,o.x),r.y=this.smallestInAbsValue(t.y,e.y,n.y,o.y),t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,o.x-=r.x,o.y-=r.y},jsts.algorithm.RobustLineIntersector.prototype.normalizeToEnvCentre=function(t,e,n,o,r){var i=t.x<e.x?t.x:e.x,s=t.y<e.y?t.y:e.y,a=t.x>e.x?t.x:e.x,u=t.y>e.y?t.y:e.y,p=n.x<o.x?n.x:o.x,g=n.y<o.y?n.y:o.y,l=n.x>o.x?n.x:o.x,h=n.y>o.y?n.y:o.y,d=i>p?i:p,c=l>a?a:l,f=s>g?s:g,m=h>u?u:h,y=(d+c)/2,j=(f+m)/2;r.x=y,r.y=j,t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,o.x-=r.x,o.y-=r.y},jsts.algorithm.RobustLineIntersector.prototype.smallestInAbsValue=function(t,e,n,o){var r=t,i=Math.abs(r);return Math.abs(e)<i&&(r=e,i=Math.abs(e)),Math.abs(n)<i&&(r=n,i=Math.abs(n)),Math.abs(o)<i&&(r=o),r},jsts.algorithm.RobustLineIntersector.prototype.isInSegmentEnvelopes=function(t){var e=new jsts.geom.Envelope(this.inputLines[0][0],this.inputLines[0][1]),n=new jsts.geom.Envelope(this.inputLines[1][0],this.inputLines[1][1]);return e.contains(t)&&n.contains(t)},jsts.algorithm.HCoordinate=function(){this.x=0,this.y=0,this.w=1,1===arguments.length?this.initFrom1Coordinate(arguments[0]):2===arguments.length&&arguments[0]instanceof jsts.geom.Coordinate?this.initFrom2Coordinates(arguments[0],arguments[1]):2===arguments.length&&arguments[0]instanceof jsts.algorithm.HCoordinate?this.initFrom2HCoordinates(arguments[0],arguments[1]):2===arguments.length?this.initFromXY(arguments[0],arguments[1]):3===arguments.length?this.initFromXYW(arguments[0],arguments[1],arguments[2]):4===arguments.length&&this.initFromXYW(arguments[0],arguments[1],arguments[2],arguments[3])},jsts.algorithm.HCoordinate.intersection=function(t,e,n,o){var r,i,s,a,u,p,g,l,h,d,c;if(r=t.y-e.y,i=e.x-t.x,s=t.x*e.y-e.x*t.y,a=n.y-o.y,u=o.x-n.x,p=n.x*o.y-o.x*n.y,g=i*p-u*s,l=a*s-r*p,h=r*u-a*i,d=g/h,c=l/h,!isFinite(d)||!isFinite(c))throw new jsts.error.NotRepresentableError;return new jsts.geom.Coordinate(d,c)},jsts.algorithm.HCoordinate.prototype.initFrom1Coordinate=function(t){this.x=t.x,this.y=t.y,this.w=1},jsts.algorithm.HCoordinate.prototype.initFrom2Coordinates=function(t,e){this.x=t.y-e.y,this.y=e.x-t.x,this.w=t.x*e.y-e.x*t.y},jsts.algorithm.HCoordinate.prototype.initFrom2HCoordinates=function(t,e){this.x=t.y*e.w-e.y*t.w,this.y=e.x*t.w-t.x*e.w,this.w=t.x*e.y-e.x*t.y},jsts.algorithm.HCoordinate.prototype.initFromXYW=function(t,e,n){this.x=t,this.y=e,this.w=n},jsts.algorithm.HCoordinate.prototype.initFromXY=function(t,e){this.x=t,this.y=e,this.w=1},jsts.algorithm.HCoordinate.prototype.initFrom4Coordinates=function(t,e,n,o){var r,i,s,a,u,p;r=t.y-e.y,i=e.x-t.x,s=t.x*e.y-e.x*t.y,a=n.y-o.y,u=o.x-n.x,p=n.x*o.y-o.x*n.y,this.x=i*p-u*s,this.y=a*s-r*p,this.w=r*u-a*i},jsts.algorithm.HCoordinate.prototype.getX=function(){var t=this.x/this.w;if(!isFinite(t))throw new jsts.error.NotRepresentableError;return t},jsts.algorithm.HCoordinate.prototype.getY=function(){var t=this.y/this.w;if(!isFinite(t))throw new jsts.error.NotRepresentableError;return t},jsts.algorithm.HCoordinate.prototype.getCoordinate=function(){var t=new jsts.geom.Coordinate;return t.x=this.getX(),t.y=this.getY(),t},jsts.geom.LineSegment=function(){0===arguments.length?(this.p0=new jsts.geom.Coordinate,this.p1=new jsts.geom.Coordinate):1===arguments.length?(this.p0=arguments[0].p0,this.p1=arguments[0].p1):2===arguments.length?(this.p0=arguments[0],this.p1=arguments[1]):4===arguments.length&&(this.p0=new jsts.geom.Coordinate(arguments[0],arguments[1]),this.p1=new jsts.geom.Coordinate(arguments[2],arguments[3]))},jsts.geom.LineSegment.prototype.p0=null,jsts.geom.LineSegment.prototype.p1=null,jsts.geom.LineSegment.midPoint=function(t,e){return new jsts.geom.Coordinate((t.x+e.x)/2,(t.y+e.y)/2)},jsts.geom.LineSegment.prototype.getCoordinate=function(t){return 0===t?this.p0:this.p1},jsts.geom.LineSegment.prototype.getLength=function(){return this.p0.distance(this.p1)},jsts.geom.LineSegment.prototype.isHorizontal=function(){return this.p0.y===this.p1.y},jsts.geom.LineSegment.prototype.isVertical=function(){return this.p0.x===this.p1.x},jsts.geom.LineSegment.prototype.orientationIndex=function(t){return t instanceof jsts.geom.LineSegment?this.orientationIndex1(t):t instanceof jsts.geom.Coordinate?this.orientationIndex2(t):void 0},jsts.geom.LineSegment.prototype.orientationIndex1=function(t){var e=jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,t.p0),n=jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,t.p1);return e>=0&&n>=0?Math.max(e,n):0>=e&&0>=n?Math.max(e,n):0},jsts.geom.LineSegment.prototype.orientationIndex2=function(t){return jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,t)},jsts.geom.LineSegment.prototype.reverse=function(){var t=this.p0;this.p0=this.p1,this.p1=t},jsts.geom.LineSegment.prototype.normalize=function(){this.p1.compareTo(this.p0)<0&&this.reverse()},jsts.geom.LineSegment.prototype.angle=function(){return Math.atan2(this.p1.y-this.p0.y,this.p1.x-this.p0.x)},jsts.geom.LineSegment.prototype.midPoint=function(){return jsts.geom.LineSegment.midPoint(this.p0,this.p1)},jsts.geom.LineSegment.prototype.distance=function(t){return t instanceof jsts.geom.LineSegment?this.distance1(t):t instanceof jsts.geom.Coordinate?this.distance2(t):void 0},jsts.geom.LineSegment.prototype.distance1=function(t){return jsts.algorithm.CGAlgorithms.distanceLineLine(this.p0,this.p1,t.p0,t.p1)},jsts.geom.LineSegment.prototype.distance2=function(t){return jsts.algorithm.CGAlgorithms.distancePointLine(t,this.p0,this.p1)
},jsts.geom.LineSegment.prototype.pointAlong=function(t){var e=new jsts.geom.Coordinate;return e.x=this.p0.x+t*(this.p1.x-this.p0.x),e.y=this.p0.y+t*(this.p1.y-this.p0.y),e},jsts.geom.LineSegment.prototype.pointAlongOffset=function(t,e){var n=this.p0.x+t*(this.p1.x-this.p0.x),o=this.p0.y+t*(this.p1.y-this.p0.y),r=this.p1.x-this.p0.x,i=this.p1.y-this.p0.y,s=Math.sqrt(r*r+i*i),a=0,u=0;if(0!==e){if(0>=s)throw"Cannot compute offset from zero-length line segment";a=e*r/s,u=e*i/s}var p=n-u,g=o+a,l=new jsts.geom.Coordinate(p,g);return l},jsts.geom.LineSegment.prototype.projectionFactor=function(t){if(t.equals(this.p0))return 0;if(t.equals(this.p1))return 1;var e=this.p1.x-this.p0.x,n=this.p1.y-this.p0.y,o=e*e+n*n,r=((t.x-this.p0.x)*e+(t.y-this.p0.y)*n)/o;return r},jsts.geom.LineSegment.prototype.segmentFraction=function(t){var e=this.projectionFactor(t);return 0>e?e=0:(e>1||isNaN(e))&&(e=1),e},jsts.geom.LineSegment.prototype.project=function(t){return t instanceof jsts.geom.Coordinate?this.project1(t):t instanceof jsts.geom.LineSegment?this.project2(t):void 0},jsts.geom.LineSegment.prototype.project1=function(t){if(t.equals(this.p0)||t.equals(this.p1))return new jsts.geom.Coordinate(t);var e=this.projectionFactor(t),n=new jsts.geom.Coordinate;return n.x=this.p0.x+e*(this.p1.x-this.p0.x),n.y=this.p0.y+e*(this.p1.y-this.p0.y),n},jsts.geom.LineSegment.prototype.project2=function(t){var e=this.projectionFactor(t.p0),n=this.projectionFactor(t.p1);if(e>=1&&n>=1)return null;if(0>=e&&0>=n)return null;var o=this.project(t.p0);0>e&&(o=p0),e>1&&(o=p1);var r=this.project(t.p1);return 0>n&&(r=p0),n>1&&(r=p1),new jsts.geom.LineSegment(o,r)},jsts.geom.LineSegment.prototype.closestPoint=function(t){var e=this.projectionFactor(t);if(e>0&&1>e)return this.project(t);var n=this.p0.distance(t),o=this.p1.distance(t);return o>n?this.p0:this.p1},jsts.geom.LineSegment.prototype.closestPoints=function(t){var e=this.intersection(t);if(null!==e)return[e,e];var n,o=[],r=Number.MAX_VALUE,i=this.closestPoint(t.p0);r=i.distance(t.p0),o[0]=i,o[1]=t.p0;var s=this.closestPoint(t.p1);n=s.distance(t.p1),r>n&&(r=n,o[0]=s,o[1]=t.p1);var a=t.closestPoint(this.p0);n=a.distance(this.p0),r>n&&(r=n,o[0]=this.p0,o[1]=a);var u=t.closestPoint(this.p1);return n=u.distance(this.p1),r>n&&(r=n,o[0]=this.p1,o[1]=u),o},jsts.geom.LineSegment.prototype.intersection=function(t){var e=new jsts.algorithm.RobustLineIntersector;return e.computeIntersection(this.p0,this.p1,t.p0,t.p1),e.hasIntersection()?e.getIntersection(0):null},jsts.geom.LineSegment.prototype.setCoordinates=function(t){return t instanceof jsts.geom.Coordinate?void this.setCoordinates2.apply(this,arguments):void this.setCoordinates2(t.p0,t.p1)},jsts.geom.LineSegment.prototype.setCoordinates2=function(t,e){this.p0.x=t.x,this.p0.y=t.y,this.p1.x=e.x,this.p1.y=e.y},jsts.geom.LineSegment.prototype.distancePerpendicular=function(t){return jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular(t,this.p0,this.p1)},jsts.geom.LineSegment.prototype.lineIntersection=function(t){try{var e=jsts.algorithm.HCoordinate.intersection(this.p0,this.p1,t.p0,t.p1);return e}catch(n){}return null},jsts.geom.LineSegment.prototype.toGeometry=function(t){return t.createLineString([this.p0,this.p1])},jsts.geom.LineSegment.prototype.equals=function(t){return t instanceof jsts.geom.LineSegment?this.p0.equals(t.p0)&&this.p1.equals(t.p1):!1},jsts.geom.LineSegment.prototype.compareTo=function(t){var e=this.p0.compareTo(t.p0);return 0!==e?e:this.p1.compareTo(t.p1)},jsts.geom.LineSegment.prototype.equalsTopo=function(t){return this.p0.equals(t.p0)&&this.p1.equals(t.p1)||this.p0.equals(t.p1)&&this.p1.equals(t.p0)},jsts.geom.LineSegment.prototype.toString=function(){return"LINESTRING("+this.p0.x+" "+this.p0.y+", "+this.p1.x+" "+this.p1.y+")"},jsts.index.chain.MonotoneChainOverlapAction=function(){this.tempEnv1=new jsts.geom.Envelope,this.tempEnv2=new jsts.geom.Envelope,this.overlapSeg1=new jsts.geom.LineSegment,this.overlapSeg2=new jsts.geom.LineSegment},jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv1=null,jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv2=null,jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg1=null,jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg2=null,jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap=function(t,e,n,o){this.mc1.getLineSegment(e,this.overlapSeg1),this.mc2.getLineSegment(o,this.overlapSeg2),this.overlap2(this.overlapSeg1,this.overlapSeg2)},jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap2=function(){},function(){var t=jsts.index.chain.MonotoneChainOverlapAction,e=jsts.noding.SinglePassNoder,n=jsts.index.strtree.STRtree,o=jsts.noding.NodedSegmentString,r=jsts.index.chain.MonotoneChainBuilder,i=function(t){this.si=t};i.prototype=new t,i.constructor=i,i.prototype.si=null,i.prototype.overlap=function(t,e,n,o){var r=t.getContext(),i=n.getContext();this.si.processIntersections(r,e,i,o)},jsts.noding.MCIndexNoder=function(){this.monoChains=[],this.index=new n},jsts.noding.MCIndexNoder.prototype=new e,jsts.noding.MCIndexNoder.constructor=jsts.noding.MCIndexNoder,jsts.noding.MCIndexNoder.prototype.monoChains=null,jsts.noding.MCIndexNoder.prototype.index=null,jsts.noding.MCIndexNoder.prototype.idCounter=0,jsts.noding.MCIndexNoder.prototype.nodedSegStrings=null,jsts.noding.MCIndexNoder.prototype.nOverlaps=0,jsts.noding.MCIndexNoder.prototype.getMonotoneChains=function(){return this.monoChains},jsts.noding.MCIndexNoder.prototype.getIndex=function(){return this.index},jsts.noding.MCIndexNoder.prototype.getNodedSubstrings=function(){return o.getNodedSubstrings(this.nodedSegStrings)},jsts.noding.MCIndexNoder.prototype.computeNodes=function(t){this.nodedSegStrings=t;for(var e=t.iterator();e.hasNext();)this.add(e.next());this.intersectChains()},jsts.noding.MCIndexNoder.prototype.intersectChains=function(){for(var t=new i(this.segInt),e=0;e<this.monoChains.length;e++)for(var n=this.monoChains[e],o=this.index.query(n.getEnvelope()),r=0;r<o.length;r++){var s=o[r];if(s.getId()>n.getId()&&(n.computeOverlaps(s,t),this.nOverlaps++),this.segInt.isDone())return}},jsts.noding.MCIndexNoder.prototype.add=function(t){for(var e=r.getChains(t.getCoordinates(),t),n=0;n<e.length;n++){var o=e[n];o.setId(this.idCounter++),this.index.insert(o.getEnvelope(),o),this.monoChains.push(o)}}}(),jsts.simplify.LineSegmentIndex=function(){this.index=new jsts.index.quadtree.Quadtree},jsts.simplify.LineSegmentIndex.prototype.index=null,jsts.simplify.LineSegmentIndex.prototype.add=function(t){if(t instanceof jsts.geom.LineSegment)return void this.add2(t);for(var e=t.getSegments(),n=0;n<e.length;n++){var o=e[n];this.add2(o)}},jsts.simplify.LineSegmentIndex.prototype.add2=function(t){this.index.insert(new jsts.geom.Envelope(t.p0,t.p1),t)},jsts.simplify.LineSegmentIndex.prototype.remove=function(t){this.index.remove(new jsts.geom.Envelope(t.p0,t.p1),t)},jsts.simplify.LineSegmentIndex.prototype.query=function(t){var e=new jsts.geom.Envelope(t.p0,t.p1),n=new jsts.simplify.LineSegmentIndex.LineSegmentVisitor(t);this.index.query(e,n);var o=n.getItems();return o},jsts.simplify.LineSegmentIndex.LineSegmentVisitor=function(t){this.items=[],this.querySeg=t},jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype=new jsts.index.ItemVisitor,jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.querySeg=null,jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.items=null,jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.visitItem=function(t){var e=t;jsts.geom.Envelope.intersects(e.p0,e.p1,this.querySeg.p0,this.querySeg.p1)&&this.items.push(t)},jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.getItems=function(){return this.items},jsts.geomgraph.EdgeEndStar=function(){this.edgeMap=new javascript.util.TreeMap,this.edgeList=null,this.ptInAreaLocation=[jsts.geom.Location.NONE,jsts.geom.Location.NONE]},jsts.geomgraph.EdgeEndStar.prototype.edgeMap=null,jsts.geomgraph.EdgeEndStar.prototype.edgeList=null,jsts.geomgraph.EdgeEndStar.prototype.ptInAreaLocation=null,jsts.geomgraph.EdgeEndStar.prototype.insert=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.EdgeEndStar.prototype.insertEdgeEnd=function(t,e){this.edgeMap.put(t,e),this.edgeList=null},jsts.geomgraph.EdgeEndStar.prototype.getCoordinate=function(){var t=this.iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},jsts.geomgraph.EdgeEndStar.prototype.getDegree=function(){return this.edgeMap.size()},jsts.geomgraph.EdgeEndStar.prototype.iterator=function(){return this.getEdges().iterator()},jsts.geomgraph.EdgeEndStar.prototype.getEdges=function(){return null===this.edgeList&&(this.edgeList=new javascript.util.ArrayList(this.edgeMap.values())),this.edgeList},jsts.geomgraph.EdgeEndStar.prototype.getNextCW=function(t){this.getEdges();var e=this.edgeList.indexOf(t),n=e-1;return 0===e&&(n=this.edgeList.length-1),this.edgeList[n]},jsts.geomgraph.EdgeEndStar.prototype.computeLabelling=function(t){this.computeEdgeEndLabels(t[0].getBoundaryNodeRule()),this.propagateSideLabels(0),this.propagateSideLabels(1);for(var e=[!1,!1],n=this.iterator();n.hasNext();)for(var o=n.next(),r=o.getLabel(),i=0;2>i;i++)r.isLine(i)&&r.getLocation(i)===jsts.geom.Location.BOUNDARY&&(e[i]=!0);for(var n=this.iterator();n.hasNext();)for(var o=n.next(),r=o.getLabel(),i=0;2>i;i++)if(r.isAnyNull(i)){var s=jsts.geom.Location.NONE;if(e[i])s=jsts.geom.Location.EXTERIOR;else{var a=o.getCoordinate();s=this.getLocation(i,a,t)}r.setAllLocationsIfNull(i,s)}},jsts.geomgraph.EdgeEndStar.prototype.computeEdgeEndLabels=function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.computeLabel(t)}},jsts.geomgraph.EdgeEndStar.prototype.getLocation=function(t,e,n){return this.ptInAreaLocation[t]===jsts.geom.Location.NONE&&(this.ptInAreaLocation[t]=jsts.algorithm.locate.SimplePointInAreaLocator.locate(e,n[t].getGeometry())),this.ptInAreaLocation[t]},jsts.geomgraph.EdgeEndStar.prototype.isAreaLabelsConsistent=function(t){return this.computeEdgeEndLabels(t.getBoundaryNodeRule()),this.checkAreaLabelsConsistent(0)},jsts.geomgraph.EdgeEndStar.prototype.checkAreaLabelsConsistent=function(t){var e=this.getEdges();if(e.size()<=0)return!0;var n=e.size()-1,o=e.get(n).getLabel(),r=o.getLocation(t,jsts.geomgraph.Position.LEFT);jsts.util.Assert.isTrue(r!=jsts.geom.Location.NONE,"Found unlabelled area edge");for(var i=r,s=this.iterator();s.hasNext();){var a=s.next(),u=a.getLabel();jsts.util.Assert.isTrue(u.isArea(t),"Found non-area edge");var p=u.getLocation(t,jsts.geomgraph.Position.LEFT),g=u.getLocation(t,jsts.geomgraph.Position.RIGHT);if(p===g)return!1;if(g!==i)return!1;i=p}return!0},jsts.geomgraph.EdgeEndStar.prototype.propagateSideLabels=function(t){for(var e=jsts.geom.Location.NONE,n=this.iterator();n.hasNext();){var o=n.next(),r=o.getLabel();r.isArea(t)&&r.getLocation(t,jsts.geomgraph.Position.LEFT)!==jsts.geom.Location.NONE&&(e=r.getLocation(t,jsts.geomgraph.Position.LEFT))}if(e!==jsts.geom.Location.NONE)for(var i=e,n=this.iterator();n.hasNext();){var o=n.next(),r=o.getLabel();if(r.getLocation(t,jsts.geomgraph.Position.ON)===jsts.geom.Location.NONE&&r.setLocation(t,jsts.geomgraph.Position.ON,i),r.isArea(t)){var s=r.getLocation(t,jsts.geomgraph.Position.LEFT),a=r.getLocation(t,jsts.geomgraph.Position.RIGHT);if(a!==jsts.geom.Location.NONE){if(a!==i)throw new jsts.error.TopologyError("side location conflict",o.getCoordinate());s===jsts.geom.Location.NONE&&jsts.util.Assert.shouldNeverReachHere("found single null side (at "+o.getCoordinate()+")"),i=s}else jsts.util.Assert.isTrue(r.getLocation(t,jsts.geomgraph.Position.LEFT)===jsts.geom.Location.NONE,"found single null side"),r.setLocation(t,jsts.geomgraph.Position.RIGHT,i),r.setLocation(t,jsts.geomgraph.Position.LEFT,i)}}},jsts.geomgraph.EdgeEndStar.prototype.findIndex=function(t){this.iterator();for(var e=0;e<this.edgeList.size();e++){var n=this.edgeList.get(e);if(n===t)return e}return-1},jsts.operation.relate.EdgeEndBundleStar=function(){jsts.geomgraph.EdgeEndStar.apply(this,arguments)},jsts.operation.relate.EdgeEndBundleStar.prototype=new jsts.geomgraph.EdgeEndStar,jsts.operation.relate.EdgeEndBundleStar.prototype.insert=function(t){var e=this.edgeMap.get(t);null===e?(e=new jsts.operation.relate.EdgeEndBundle(t),this.insertEdgeEnd(t,e)):e.insert(t)},jsts.operation.relate.EdgeEndBundleStar.prototype.updateIM=function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}},jsts.index.ArrayListVisitor=function(){this.items=[]},jsts.index.ArrayListVisitor.prototype.visitItem=function(t){this.items.push(t)},jsts.index.ArrayListVisitor.prototype.getItems=function(){return this.items},jsts.algorithm.distance.DistanceToPoint=function(){},jsts.algorithm.distance.DistanceToPoint.computeDistance=function(t,e,n){if(t instanceof jsts.geom.LineString)jsts.algorithm.distance.DistanceToPoint.computeDistance2(t,e,n);else if(t instanceof jsts.geom.Polygon)jsts.algorithm.distance.DistanceToPoint.computeDistance4(t,e,n);else if(t instanceof jsts.geom.GeometryCollection)for(var o=t,r=0;r<o.getNumGeometries();r++){var i=o.getGeometryN(r);jsts.algorithm.distance.DistanceToPoint.computeDistance(i,e,n)}else n.setMinimum(t.getCoordinate(),e)},jsts.algorithm.distance.DistanceToPoint.computeDistance2=function(t,e,n){for(var o=new jsts.geom.LineSegment,r=t.getCoordinates(),i=0;i<r.length-1;i++){o.setCoordinates(r[i],r[i+1]);var s=o.closestPoint(e);n.setMinimum(s,e)}},jsts.algorithm.distance.DistanceToPoint.computeDistance3=function(t,e,n){var o=t.closestPoint(e);n.setMinimum(o,e)},jsts.algorithm.distance.DistanceToPoint.computeDistance4=function(t,e,n){jsts.algorithm.distance.DistanceToPoint.computeDistance2(t.getExteriorRing(),e,n);for(var o=0;o<t.getNumInteriorRing();o++)jsts.algorithm.distance.DistanceToPoint.computeDistance2(t.getInteriorRingN(o),e,n)},jsts.index.strtree.ItemBoundable=function(t,e){this.bounds=t,this.item=e},jsts.index.strtree.ItemBoundable.prototype=new jsts.index.strtree.Boundable,jsts.index.strtree.ItemBoundable.constructor=jsts.index.strtree.ItemBoundable,jsts.index.strtree.ItemBoundable.prototype.bounds=null,jsts.index.strtree.ItemBoundable.prototype.item=null,jsts.index.strtree.ItemBoundable.prototype.getBounds=function(){return this.bounds},jsts.index.strtree.ItemBoundable.prototype.getItem=function(){return this.item},function(){var t=javascript.util.ArrayList,e=javascript.util.TreeMap;jsts.geomgraph.EdgeList=function(){this.edges=new t,this.ocaMap=new e},jsts.geomgraph.EdgeList.prototype.edges=null,jsts.geomgraph.EdgeList.prototype.ocaMap=null,jsts.geomgraph.EdgeList.prototype.add=function(t){this.edges.add(t);var e=new jsts.noding.OrientedCoordinateArray(t.getCoordinates());this.ocaMap.put(e,t)},jsts.geomgraph.EdgeList.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next())},jsts.geomgraph.EdgeList.prototype.getEdges=function(){return this.edges},jsts.geomgraph.EdgeList.prototype.findEqualEdge=function(t){var e=new jsts.noding.OrientedCoordinateArray(t.getCoordinates()),n=this.ocaMap.get(e);return n},jsts.geomgraph.EdgeList.prototype.getEdges=function(){return this.edges},jsts.geomgraph.EdgeList.prototype.iterator=function(){return this.edges.iterator()},jsts.geomgraph.EdgeList.prototype.get=function(t){return this.edges.get(t)},jsts.geomgraph.EdgeList.prototype.findEdgeIndex=function(t){for(var e=0;e<this.edges.size();e++)if(this.edges.get(e).equals(t))return e;return-1}}(),jsts.operation.IsSimpleOp=function(t){this.geom=t},jsts.operation.IsSimpleOp.prototype.geom=null,jsts.operation.IsSimpleOp.prototype.isClosedEndpointsInInterior=!0,jsts.operation.IsSimpleOp.prototype.nonSimpleLocation=null,jsts.operation.IsSimpleOp.prototype.IsSimpleOp=function(t){this.geom=t},jsts.operation.IsSimpleOp.prototype.isSimple=function(){return this.nonSimpleLocation=null,this.geom instanceof jsts.geom.LineString?this.isSimpleLinearGeometry(this.geom):this.geom instanceof jsts.geom.MultiLineString?this.isSimpleLinearGeometry(this.geom):this.geom instanceof jsts.geom.MultiPoint?this.isSimpleMultiPoint(this.geom):!0},jsts.operation.IsSimpleOp.prototype.isSimpleMultiPoint=function(t){if(t.isEmpty())return!0;for(var e=[],n=0;n<t.getNumGeometries();n++){for(var o=t.getGeometryN(n),r=o.getCoordinate(),i=0;i<e.length;i++){var s=e[i];if(r.equals2D(s))return this.nonSimpleLocation=r,!1}e.push(r)}return!0},jsts.operation.IsSimpleOp.prototype.isSimpleLinearGeometry=function(t){if(t.isEmpty())return!0;var e=new jsts.geomgraph.GeometryGraph(0,t),n=new jsts.algorithm.RobustLineIntersector,o=e.computeSelfNodes(n,!0);return o.hasIntersection()?o.hasProperIntersection()?(this.nonSimpleLocation=o.getProperIntersectionPoint(),!1):this.hasNonEndpointIntersection(e)?!1:this.isClosedEndpointsInInterior&&this.hasClosedEndpointIntersection(e)?!1:!0:!0},jsts.operation.IsSimpleOp.prototype.hasNonEndpointIntersection=function(t){for(var e=t.getEdgeIterator();e.hasNext();)for(var n=e.next(),o=n.getMaximumSegmentIndex(),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var i=r.next();if(!i.isEndPoint(o))return this.nonSimpleLocation=i.getCoordinate(),!0}return!1},jsts.operation.IsSimpleOp.prototype.hasClosedEndpointIntersection=function(t){for(var e=new javascript.util.TreeMap,n=t.getEdgeIterator();n.hasNext();){var o=n.next(),r=(o.getMaximumSegmentIndex(),o.isClosed()),i=o.getCoordinate(0);this.addEndpoint(e,i,r);var s=o.getCoordinate(o.getNumPoints()-1);this.addEndpoint(e,s,r)}for(var n=e.values().iterator();n.hasNext();){var a=n.next();if(a.isClosed&&2!=a.degree)return this.nonSimpleLocation=a.getCoordinate(),!0}return!1},jsts.operation.IsSimpleOp.EndpointInfo=function(t){this.pt=t,this.isClosed=!1,this.degree=0},jsts.operation.IsSimpleOp.EndpointInfo.prototype.pt=null,jsts.operation.IsSimpleOp.EndpointInfo.prototype.isClosed=null,jsts.operation.IsSimpleOp.EndpointInfo.prototype.degree=null,jsts.operation.IsSimpleOp.EndpointInfo.prototype.getCoordinate=function(){return this.pt},jsts.operation.IsSimpleOp.EndpointInfo.prototype.addEndpoint=function(t){this.degree++,this.isClosed=this.isClosed||t},jsts.operation.IsSimpleOp.prototype.addEndpoint=function(t,e,n){var o=t.get(e);null===o&&(o=new jsts.operation.IsSimpleOp.EndpointInfo(e),t.put(e,o)),o.addEndpoint(n)},function(){var t=function(){this.snapTolerance=0,this.seg=new jsts.geom.LineSegment,this.allowSnappingToSourceVertices=!1,this.isClosed=!1,this.srcPts=[],arguments[0]instanceof jsts.geom.LineString?this.initFromLine.apply(this,arguments):this.initFromPoints.apply(this,arguments)};t.prototype.initFromLine=function(t,e){this.initFromPoints(t.getCoordinates(),e)},t.prototype.initFromPoints=function(t,e){this.srcPts=t,this.isClosed=this.calcIsClosed(t),this.snapTolerance=e},t.prototype.setAllowSnappingToSourceVertices=function(t){this.allowSnappingToSourceVertices=t},t.prototype.calcIsClosed=function(t){return t.length<=1?!1:t[0].equals(t[t.length-1])},t.prototype.snapTo=function(t){var e=new jsts.geom.CoordinateList(this.srcPts);return this.snapVertices(e,t),this.snapSegments(e,t),e.toCoordinateArray()},t.prototype.snapVertices=function(t,e){var n,o,r=this.isClosed?t.size()-1:t.size(),i=0;for(i;r>i;i++)n=t.get(i),o=this.findSnapForVertex(n,e),null!==o&&(t.set(i,new jsts.geom.Coordinate(o)),0===i&&this.isClosed&&t.set(t.size()-1,new jsts.geom.Coordinate(o)))},t.prototype.findSnapForVertex=function(t,e){var n=0,o=e.length;for(n=0;o>n;n++){if(t.equals(e[n]))return null;if(t.distance(e[n])<this.snapTolerance)return e[n]}return null},t.prototype.snapSegments=function(t,e){if(0!==e.length){var n,o,r,i=e.length;for(e.length>1&&e[0].equals2D(e[e.length-1])&&(i=e.length-1),n=0;i>n;n++)o=e[n],r=this.findSegmentIndexToSnap(o,t),r>=0&&t.add(r+1,new jsts.geom.Coordinate(o),!1)}},t.prototype.findSegmentIndexToSnap=function(t,e){var n,o=Number.MAX_VALUE,r=-1,i=0;for(i;i<e.size()-1;i++){if(this.seg.p0=e.get(i),this.seg.p1=e.get(i+1),this.seg.p0.equals(t)||this.seg.p1.equals(t)){if(this.allowSnappingToSourceVertices)continue;return-1}n=this.seg.distance(t),n<this.snapTolerance&&o>n&&(o=n,r=i)}return r},jsts.operation.overlay.snap.LineStringSnapper=t}(),function(){var t=javascript.util.ArrayList,e=jsts.geom.GeometryComponentFilter,n=jsts.geom.LineString,o=jsts.operation.polygonize.EdgeRing,r=jsts.operation.polygonize.PolygonizeGraph,i=function(){var o=this,r=function(){};r.prototype=new e,r.prototype.filter=function(t){t instanceof n&&o.add(t)},this.lineStringAdder=new r,this.dangles=new t,this.cutEdges=new t,this.invalidRingLines=new t};i.prototype.lineStringAdder=null,i.prototype.graph=null,i.prototype.dangles=null,i.prototype.cutEdges=null,i.prototype.invalidRingLines=null,i.prototype.holeList=null,i.prototype.shellList=null,i.prototype.polyList=null,i.prototype.add=function(t){if(t instanceof jsts.geom.LineString)return this.add3(t);if(t instanceof jsts.geom.Geometry)return this.add2(t);for(var e=t.iterator();e.hasNext();){var n=e.next();this.add2(n)}},i.prototype.add2=function(t){t.apply(this.lineStringAdder)},i.prototype.add3=function(t){null==this.graph&&(this.graph=new r(t.getFactory())),this.graph.addEdge(t)},i.prototype.getPolygons=function(){return this.polygonize(),this.polyList},i.prototype.getDangles=function(){return this.polygonize(),this.dangles},i.prototype.getCutEdges=function(){return this.polygonize(),this.cutEdges},i.prototype.getInvalidRingLines=function(){return this.polygonize(),this.invalidRingLines},i.prototype.polygonize=function(){if(null==this.polyList&&(this.polyList=new t,null!=this.graph)){this.dangles=this.graph.deleteDangles(),this.cutEdges=this.graph.deleteCutEdges();var e=this.graph.getEdgeRings(),n=new t;this.invalidRingLines=new t,this.findValidRings(e,n,this.invalidRingLines),this.findShellsAndHoles(n),i.assignHolesToShells(this.holeList,this.shellList),this.polyList=new t;for(var o=this.shellList.iterator();o.hasNext();){var r=o.next();this.polyList.add(r.getPolygon())}}},i.prototype.findValidRings=function(t,e,n){for(var o=t.iterator();o.hasNext();){var r=o.next();r.isValid()?e.add(r):n.add(r.getLineString())}},i.prototype.findShellsAndHoles=function(e){this.holeList=new t,this.shellList=new t;for(var n=e.iterator();n.hasNext();){var o=n.next();o.isHole()?this.holeList.add(o):this.shellList.add(o)}},i.assignHolesToShells=function(t,e){for(var n=t.iterator();n.hasNext();){var o=n.next();i.assignHoleToShell(o,e)}},i.assignHoleToShell=function(t,e){var n=o.findEdgeRingContaining(t,e);null!=n&&n.addHole(t.getRing())},jsts.operation.polygonize.Polygonizer=i}(),function(){var t=javascript.util.ArrayList,e=function(){};e.prototype.inputGeom=null,e.prototype.factory=null,e.prototype.pruneEmptyGeometry=!0,e.prototype.preserveGeometryCollectionType=!0,e.prototype.preserveCollections=!1,e.prototype.reserveType=!1,e.prototype.getInputGeometry=function(){return this.inputGeom},e.prototype.transform=function(t){if(this.inputGeom=t,this.factory=t.getFactory(),t instanceof jsts.geom.Point)return this.transformPoint(t,null);if(t instanceof jsts.geom.MultiPoint)return this.transformMultiPoint(t,null);if(t instanceof jsts.geom.LinearRing)return this.transformLinearRing(t,null);if(t instanceof jsts.geom.LineString)return this.transformLineString(t,null);if(t instanceof jsts.geom.MultiLineString)return this.transformMultiLineString(t,null);if(t instanceof jsts.geom.Polygon)return this.transformPolygon(t,null);if(t instanceof jsts.geom.MultiPolygon)return this.transformMultiPolygon(t,null);if(t instanceof jsts.geom.GeometryCollection)return this.transformGeometryCollection(t,null);throw new jsts.error.IllegalArgumentException("Unknown Geometry subtype: "+t.getClass().getName())},e.prototype.createCoordinateSequence=function(t){return this.factory.getCoordinateSequenceFactory().create(t)},e.prototype.copy=function(t){return t.clone()},e.prototype.transformCoordinates=function(t){return this.copy(t)},e.prototype.transformPoint=function(t){return this.factory.createPoint(this.transformCoordinates(t.getCoordinateSequence(),t))},e.prototype.transformMultiPoint=function(e){for(var n=new t,o=0;o<e.getNumGeometries();o++){var r=this.transformPoint(e.getGeometryN(o),e);null!=r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},e.prototype.transformLinearRing=function(t){var e=this.transformCoordinates(t.getCoordinateSequence(),t),n=e.length;return n>0&&4>n&&!this.preserveType?this.factory.createLineString(e):this.factory.createLinearRing(e)},e.prototype.transformLineString=function(t){return this.factory.createLineString(this.transformCoordinates(t.getCoordinateSequence(),t))},e.prototype.transformMultiLineString=function(e){for(var n=new t,o=0;o<e.getNumGeometries();o++){var r=this.transformLineString(e.getGeometryN(o),e);null!=r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},e.prototype.transformPolygon=function(e){var n=!0,o=this.transformLinearRing(e.getExteriorRing(),e);null!=o&&o instanceof jsts.geom.LinearRing&&!o.isEmpty()||(n=!1);for(var r=new t,i=0;i<e.getNumInteriorRing();i++){var s=this.transformLinearRing(e.getInteriorRingN(i),e);null==s||s.isEmpty()||(s instanceof jsts.geom.LinearRing||(n=!1),r.add(s))}if(n)return this.factory.createPolygon(o,r.toArray());var a=new t;return null!=o&&a.add(o),a.addAll(r),this.factory.buildGeometry(a)},e.prototype.transformMultiPolygon=function(e){for(var n=new t,o=0;o<e.getNumGeometries();o++){var r=this.transformPolygon(e.getGeometryN(o),e);null!=r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},e.prototype.transformGeometryCollection=function(e){for(var n=new t,o=0;o<e.getNumGeometries();o++){var r=this.transform(e.getGeometryN(o));null!=r&&(this.pruneEmptyGeometry&&r.isEmpty()||n.add(r))}return this.preserveGeometryCollectionType?this.factory.createGeometryCollection(GeometryFactory.toGeometryArray(n)):this.factory.buildGeometry(n)},jsts.geom.util.GeometryTransformer=e}(),function(){var t=jsts.operation.overlay.snap.LineStringSnapper,e=jsts.geom.PrecisionModel,n=javascript.util.TreeSet,o=function(t,e,n){this.snapTolerance=t,this.snapPts=e,this.isSelfSnap=n||!1};o.prototype=new jsts.geom.util.GeometryTransformer,o.prototype.snapTolerance=null,o.prototype.snapPts=null,o.prototype.isSelfSnap=!1,o.prototype.transformCoordinates=function(t){var e=t,n=this.snapLine(e,this.snapPts);return n},o.prototype.snapLine=function(e,n){var o=new t(e,this.snapTolerance);return o.setAllowSnappingToSourceVertices(this.isSelfSnap),o.snapTo(n)};var r=function(t){this.srcGeom=t};r.SNAP_PRECISION_FACTOR=1e-9,r.computeOverlaySnapTolerance=function(t){if(2===arguments.length)return r.computeOverlaySnapTolerance2.apply(this,arguments);var n=this.computeSizeBasedSnapTolerance(t),o=t.getPrecisionModel();if(o.getType()==e.FIXED){var i=1/o.getScale()*2/1.415;i>n&&(n=i)}return n},r.computeSizeBasedSnapTolerance=function(t){var e=t.getEnvelopeInternal(),n=Math.min(e.getHeight(),e.getWidth()),o=n*r.SNAP_PRECISION_FACTOR;return o},r.computeOverlaySnapTolerance2=function(t,e){return Math.min(this.computeOverlaySnapTolerance(t),this.computeOverlaySnapTolerance(e))},r.snap=function(t,e,n){var o=[],i=new r(t);o[0]=i.snapTo(e,n);var s=new r(e);return o[1]=s.snapTo(o[0],n),o},r.snapToSelf=function(t,e,n){var o=new r(t);return o.snapToSelf(e,n)},r.prototype.srcGeom=null,r.prototype.snapTo=function(t,e){var n=this.extractTargetCoordinates(t),r=new o(e,n);return r.transform(this.srcGeom)},r.prototype.snapToSelf=function(t,e){var n=this.extractTargetCoordinates(srcGeom),r=new o(t,n,!0),i=r.transform(srcGeom),s=i;return e&&s instanceof Polygonal&&(s=i.buffer(0)),s},r.prototype.extractTargetCoordinates=function(t){for(var e=new n,o=t.getCoordinates(),r=0;r<o.length;r++)e.add(o[r]);return e.toArray()},r.prototype.computeSnapTolerance=function(t){var e=this.computeMinimumSegmentLength(t),n=e/10;return n},r.prototype.computeMinimumSegmentLength=function(t){for(var e=Number.MAX_VALUE,n=0;n<t.length-1;n++){var o=t[n].distance(t[n+1]);e>o&&(e=o)}return e},jsts.operation.overlay.snap.GeometrySnapper=r}(),jsts.algorithm.PointLocator=function(t){this.boundaryRule=t?t:jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE},jsts.algorithm.PointLocator.prototype.boundaryRule=null,jsts.algorithm.PointLocator.prototype.isIn=null,jsts.algorithm.PointLocator.prototype.numBoundaries=null,jsts.algorithm.PointLocator.prototype.intersects=function(t,e){return this.locate(t,e)!==jsts.geom.Location.EXTERIOR},jsts.algorithm.PointLocator.prototype.locate=function(t,e){return e.isEmpty()?jsts.geom.Location.EXTERIOR:e instanceof jsts.geom.Point?this.locate2(t,e):e instanceof jsts.geom.LineString?this.locate3(t,e):e instanceof jsts.geom.Polygon?this.locate4(t,e):(this.isIn=!1,this.numBoundaries=0,this.computeLocation(t,e),this.boundaryRule.isInBoundary(this.numBoundaries)?jsts.geom.Location.BOUNDARY:this.numBoundaries>0||this.isIn?jsts.geom.Location.INTERIOR:jsts.geom.Location.EXTERIOR)},jsts.algorithm.PointLocator.prototype.computeLocation=function(t,e){if(e instanceof jsts.geom.Point||e instanceof jsts.geom.LineString||e instanceof jsts.geom.Polygon)this.updateLocationInfo(this.locate(t,e));else if(e instanceof jsts.geom.MultiLineString)for(var n=e,o=0;o<n.getNumGeometries();o++){var r=n.getGeometryN(o);this.updateLocationInfo(this.locate(t,r))}else if(e instanceof jsts.geom.MultiPolygon)for(var i=e,o=0;o<i.getNumGeometries();o++){var s=i.getGeometryN(o);this.updateLocationInfo(this.locate(t,s))}else if(e instanceof jsts.geom.MultiPoint||e instanceof jsts.geom.GeometryCollection)for(var o=0;o<e.getNumGeometries();o++){var a=e.getGeometryN(o);a!==e&&this.computeLocation(t,a)}},jsts.algorithm.PointLocator.prototype.updateLocationInfo=function(t){t===jsts.geom.Location.INTERIOR&&(this.isIn=!0),t===jsts.geom.Location.BOUNDARY&&this.numBoundaries++},jsts.algorithm.PointLocator.prototype.locate2=function(t,e){var n=e.getCoordinate();return n.equals2D(t)?jsts.geom.Location.INTERIOR:jsts.geom.Location.EXTERIOR},jsts.algorithm.PointLocator.prototype.locate3=function(t,e){if(!e.getEnvelopeInternal().intersects(t))return jsts.geom.Location.EXTERIOR;var n=e.getCoordinates();return e.isClosed()||!t.equals(n[0])&&!t.equals(n[n.length-1])?jsts.algorithm.CGAlgorithms.isOnLine(t,n)?jsts.geom.Location.INTERIOR:jsts.geom.Location.EXTERIOR:jsts.geom.Location.BOUNDARY},jsts.algorithm.PointLocator.prototype.locateInPolygonRing=function(t,e){return e.getEnvelopeInternal().intersects(t)?jsts.algorithm.CGAlgorithms.locatePointInRing(t,e.getCoordinates()):jsts.geom.Location.EXTERIOR},jsts.algorithm.PointLocator.prototype.locate4=function(t,e){if(e.isEmpty())return jsts.geom.Location.EXTERIOR;var n=e.getExteriorRing(),o=this.locateInPolygonRing(t,n);if(o===jsts.geom.Location.EXTERIOR)return jsts.geom.Location.EXTERIOR;if(o===jsts.geom.Location.BOUNDARY)return jsts.geom.Location.BOUNDARY;for(var r=0;r<e.getNumInteriorRing();r++){var i=e.getInteriorRingN(r),s=this.locateInPolygonRing(t,i);if(s===jsts.geom.Location.INTERIOR)return jsts.geom.Location.EXTERIOR;if(s===jsts.geom.Location.BOUNDARY)return jsts.geom.Location.BOUNDARY}return jsts.geom.Location.INTERIOR},function(){var t=jsts.geom.Location,e=javascript.util.ArrayList,n=javascript.util.TreeMap;jsts.geomgraph.NodeMap=function(t){this.nodeMap=new n,this.nodeFact=t},jsts.geomgraph.NodeMap.prototype.nodeMap=null,jsts.geomgraph.NodeMap.prototype.nodeFact=null,jsts.geomgraph.NodeMap.prototype.addNode=function(t){var e,n;if(t instanceof jsts.geom.Coordinate)return n=t,e=this.nodeMap.get(n),null===e&&(e=this.nodeFact.createNode(n),this.nodeMap.put(n,e)),e;if(t instanceof jsts.geomgraph.Node){var o=t;return n=o.getCoordinate(),e=this.nodeMap.get(n),null===e?(this.nodeMap.put(n,o),o):(e.mergeLabel(o),e)}},jsts.geomgraph.NodeMap.prototype.add=function(t){var e=t.getCoordinate(),n=this.addNode(e);n.add(t)},jsts.geomgraph.NodeMap.prototype.find=function(t){return this.nodeMap.get(t)},jsts.geomgraph.NodeMap.prototype.values=function(){return this.nodeMap.values()},jsts.geomgraph.NodeMap.prototype.iterator=function(){return this.values().iterator()
},jsts.geomgraph.NodeMap.prototype.getBoundaryNodes=function(n){for(var o=new e,r=this.iterator();r.hasNext();){var i=r.next();i.getLabel().getLocation(n)===t.BOUNDARY&&o.add(i)}return o}}(),function(){var t=javascript.util.ArrayList;jsts.geomgraph.PlanarGraph=function(e){this.edges=new t,this.edgeEndList=new t,this.nodes=new jsts.geomgraph.NodeMap(e||new jsts.geomgraph.NodeFactory)},jsts.geomgraph.PlanarGraph.prototype.edges=null,jsts.geomgraph.PlanarGraph.prototype.nodes=null,jsts.geomgraph.PlanarGraph.prototype.edgeEndList=null,jsts.geomgraph.PlanarGraph.linkResultDirectedEdges=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.getEdges().linkResultDirectedEdges()}},jsts.geomgraph.PlanarGraph.prototype.getEdgeIterator=function(){return this.edges.iterator()},jsts.geomgraph.PlanarGraph.prototype.getEdgeEnds=function(){return this.edgeEndList},jsts.geomgraph.PlanarGraph.prototype.isBoundaryNode=function(t,e){var n=this.nodes.find(e);if(null===n)return!1;var o=n.getLabel();return null!==o&&o.getLocation(t)===jsts.geom.Location.BOUNDARY?!0:!1},jsts.geomgraph.PlanarGraph.prototype.insertEdge=function(t){this.edges.add(t)},jsts.geomgraph.PlanarGraph.prototype.add=function(t){this.nodes.add(t),this.edgeEndList.add(t)},jsts.geomgraph.PlanarGraph.prototype.getNodeIterator=function(){return this.nodes.iterator()},jsts.geomgraph.PlanarGraph.prototype.getNodes=function(){return this.nodes.values()},jsts.geomgraph.PlanarGraph.prototype.addNode=function(t){return this.nodes.addNode(t)},jsts.geomgraph.PlanarGraph.prototype.addEdges=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.edges.add(n);var o=new jsts.geomgraph.DirectedEdge(n,!0),r=new jsts.geomgraph.DirectedEdge(n,!1);o.setSym(r),r.setSym(o),this.add(o),this.add(r)}},jsts.geomgraph.PlanarGraph.prototype.linkResultDirectedEdges=function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().linkResultDirectedEdges()}},jsts.geomgraph.PlanarGraph.prototype.findEdgeInSameDirection=function(t,e){var n,o,r=0,i=this.edges.size();for(r;i>r;r++){if(n=this.edges.get(r),o=n.getCoordinates(),this.matchInSameDirection(t,e,o[0],o[1]))return n;if(this.matchInSameDirection(t,e,o[o.length-1],o[o.length-2]))return n}return null},jsts.geomgraph.PlanarGraph.prototype.matchInSameDirection=function(t,e,n,o){return t.equals(n)&&jsts.algorithm.CGAlgorithms.computeOrientation(t,e,o)===jsts.algorithm.CGAlgorithms.COLLINEAR&&jsts.geomgraph.Quadrant.quadrant(t,e)===jsts.geomgraph.Quadrant.quadrant(n,o)?!0:!1},jsts.geomgraph.PlanarGraph.prototype.findEdgeEnd=function(t){for(var e=this.getEdgeEnds().iterator();e.hasNext();){var n=e.next();if(n.getEdge()===t)return n}return null}}(),jsts.noding.SegmentIntersector=function(){},jsts.noding.SegmentIntersector.prototype.processIntersections=jsts.abstractFunc,jsts.noding.SegmentIntersector.prototype.isDone=jsts.abstractFunc,function(){var t=jsts.noding.SegmentIntersector,e=javascript.util.ArrayList;jsts.noding.InteriorIntersectionFinder=function(t){this.li=t,this.intersections=new e,this.interiorIntersection=null},jsts.noding.InteriorIntersectionFinder.prototype=new t,jsts.noding.InteriorIntersectionFinder.constructor=jsts.noding.InteriorIntersectionFinder,jsts.noding.InteriorIntersectionFinder.prototype.findAllIntersections=!1,jsts.noding.InteriorIntersectionFinder.prototype.isCheckEndSegmentsOnly=!1,jsts.noding.InteriorIntersectionFinder.prototype.li=null,jsts.noding.InteriorIntersectionFinder.prototype.interiorIntersection=null,jsts.noding.InteriorIntersectionFinder.prototype.intSegments=null,jsts.noding.InteriorIntersectionFinder.prototype.intersections=null,jsts.noding.InteriorIntersectionFinder.prototype.setFindAllIntersections=function(t){this.findAllIntersections=t},jsts.noding.InteriorIntersectionFinder.prototype.getIntersections=function(){return intersections},jsts.noding.InteriorIntersectionFinder.prototype.setCheckEndSegmentsOnly=function(t){this.isCheckEndSegmentsOnly=t},jsts.noding.InteriorIntersectionFinder.prototype.hasIntersection=function(){return null!=this.interiorIntersection},jsts.noding.InteriorIntersectionFinder.prototype.getInteriorIntersection=function(){return this.interiorIntersection},jsts.noding.InteriorIntersectionFinder.prototype.getIntersectionSegments=function(){return this.intSegments},jsts.noding.InteriorIntersectionFinder.prototype.processIntersections=function(t,e,n,o){if(!this.hasIntersection()&&(t!=n||e!=o)){if(this.isCheckEndSegmentsOnly){var r=this.isEndSegment(t,e)||isEndSegment(n,o);if(!r)return}var i=t.getCoordinates()[e],s=t.getCoordinates()[e+1],a=n.getCoordinates()[o],u=n.getCoordinates()[o+1];this.li.computeIntersection(i,s,a,u),this.li.hasIntersection()&&this.li.isInteriorIntersection()&&(this.intSegments=[],this.intSegments[0]=i,this.intSegments[1]=s,this.intSegments[2]=a,this.intSegments[3]=u,this.interiorIntersection=this.li.getIntersection(0),this.intersections.add(this.interiorIntersection))}},jsts.noding.InteriorIntersectionFinder.prototype.isEndSegment=function(t,e){return 0==e?!0:e>=t.size()-2?!0:!1},jsts.noding.InteriorIntersectionFinder.prototype.isDone=function(){return this.findAllIntersections?!1:null!=this.interiorIntersection}}(),function(){var t=jsts.algorithm.RobustLineIntersector,e=jsts.noding.InteriorIntersectionFinder,n=jsts.noding.MCIndexNoder;jsts.noding.FastNodingValidator=function(e){this.li=new t,this.segStrings=e},jsts.noding.FastNodingValidator.prototype.li=null,jsts.noding.FastNodingValidator.prototype.segStrings=null,jsts.noding.FastNodingValidator.prototype.findAllIntersections=!1,jsts.noding.FastNodingValidator.prototype.segInt=null,jsts.noding.FastNodingValidator.prototype._isValid=!0,jsts.noding.FastNodingValidator.prototype.setFindAllIntersections=function(t){this.findAllIntersections=t},jsts.noding.FastNodingValidator.prototype.getIntersections=function(){return segInt.getIntersections()},jsts.noding.FastNodingValidator.prototype.isValid=function(){return this.execute(),this._isValid},jsts.noding.FastNodingValidator.prototype.getErrorMessage=function(){if(this._isValid)return"no intersections found";var t=this.segInt.getIntersectionSegments();return"found non-noded intersection between "+jsts.io.WKTWriter.toLineString(t[0],t[1])+" and "+jsts.io.WKTWriter.toLineString(t[2],t[3])},jsts.noding.FastNodingValidator.prototype.checkValid=function(){if(this.execute(),!this._isValid)throw new jsts.error.TopologyError(this.getErrorMessage(),this.segInt.getInteriorIntersection())},jsts.noding.FastNodingValidator.prototype.execute=function(){null==this.segInt&&this.checkInteriorIntersections()},jsts.noding.FastNodingValidator.prototype.checkInteriorIntersections=function(){this._isValid=!0,this.segInt=new e(this.li),this.segInt.setFindAllIntersections(this.findAllIntersections);var t=new n;return t.setSegmentIntersector(this.segInt),t.computeNodes(this.segStrings),this.segInt.hasIntersection()?void(this._isValid=!1):void 0}}(),function(){jsts.noding.BasicSegmentString=function(t,e){this.pts=t,this.data=e},jsts.noding.BasicSegmentString.prototype=new jsts.noding.SegmentString,jsts.noding.BasicSegmentString.prototype.pts=null,jsts.noding.BasicSegmentString.prototype.data=null,jsts.noding.BasicSegmentString.prototype.getData=function(){return this.data},jsts.noding.BasicSegmentString.prototype.setData=function(t){this.data=t},jsts.noding.BasicSegmentString.prototype.size=function(){return this.pts.length},jsts.noding.BasicSegmentString.prototype.getCoordinate=function(t){return this.pts[t]},jsts.noding.BasicSegmentString.prototype.getCoordinates=function(){return this.pts},jsts.noding.BasicSegmentString.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1])},jsts.noding.BasicSegmentString.prototype.getSegmentOctant=function(t){return t==this.pts.length-1?-1:jsts.noding.Octant.octant(this.getCoordinate(t),this.getCoordinate(t+1))}}(),function(){var t=jsts.noding.FastNodingValidator,e=jsts.noding.BasicSegmentString,n=javascript.util.ArrayList;jsts.geomgraph.EdgeNodingValidator=function(e){this.nv=new t(jsts.geomgraph.EdgeNodingValidator.toSegmentStrings(e))},jsts.geomgraph.EdgeNodingValidator.checkValid=function(t){var e=new jsts.geomgraph.EdgeNodingValidator(t);e.checkValid()},jsts.geomgraph.EdgeNodingValidator.toSegmentStrings=function(t){for(var o=new n,r=t.iterator();r.hasNext();){var i=r.next();o.add(new e(i.getCoordinates(),i))}return o},jsts.geomgraph.EdgeNodingValidator.prototype.nv=null,jsts.geomgraph.EdgeNodingValidator.prototype.checkValid=function(){this.nv.checkValid()}}(),jsts.operation.GeometryGraphOperation=function(t,e,n){if(this.li=new jsts.algorithm.RobustLineIntersector,this.arg=[],void 0!==t){if(void 0===e)return this.setComputationPrecision(t.getPrecisionModel()),void(this.arg[0]=new jsts.geomgraph.GeometryGraph(0,t));n=n||jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE,this.setComputationPrecision(t.getPrecisionModel().compareTo(e.getPrecisionModel())>=0?t.getPrecisionModel():e.getPrecisionModel()),this.arg[0]=new jsts.geomgraph.GeometryGraph(0,t,n),this.arg[1]=new jsts.geomgraph.GeometryGraph(1,e,n)}},jsts.operation.GeometryGraphOperation.prototype.li=null,jsts.operation.GeometryGraphOperation.prototype.resultPrecisionModel=null,jsts.operation.GeometryGraphOperation.prototype.arg=null,jsts.operation.GeometryGraphOperation.prototype.getArgGeometry=function(t){return arg[t].getGeometry()},jsts.operation.GeometryGraphOperation.prototype.setComputationPrecision=function(t){this.resultPrecisionModel=t,this.li.setPrecisionModel(this.resultPrecisionModel)},jsts.operation.overlay.OverlayNodeFactory=function(){},jsts.operation.overlay.OverlayNodeFactory.prototype=new jsts.geomgraph.NodeFactory,jsts.operation.overlay.OverlayNodeFactory.constructor=jsts.operation.overlay.OverlayNodeFactory,jsts.operation.overlay.OverlayNodeFactory.prototype.createNode=function(t){return new jsts.geomgraph.Node(t,new jsts.geomgraph.DirectedEdgeStar)},jsts.operation.overlay.PolygonBuilder=function(t){this.shellList=[],this.geometryFactory=t},jsts.operation.overlay.PolygonBuilder.prototype.geometryFactory=null,jsts.operation.overlay.PolygonBuilder.prototype.shellList=null,jsts.operation.overlay.PolygonBuilder.prototype.add=function(t){return 2===arguments.length?void this.add2.apply(this,arguments):void this.add2(t.getEdgeEnds(),t.getNodes())},jsts.operation.overlay.PolygonBuilder.prototype.add2=function(t,e){jsts.geomgraph.PlanarGraph.linkResultDirectedEdges(e);var n=this.buildMaximalEdgeRings(t),o=[],r=this.buildMinimalEdgeRings(n,this.shellList,o);this.sortShellsAndHoles(r,this.shellList,o),this.placeFreeHoles(this.shellList,o)},jsts.operation.overlay.PolygonBuilder.prototype.getPolygons=function(){var t=this.computePolygons(this.shellList);return t},jsts.operation.overlay.PolygonBuilder.prototype.buildMaximalEdgeRings=function(t){for(var e=[],n=t.iterator();n.hasNext();){var o=n.next();if(o.isInResult()&&o.getLabel().isArea()&&null==o.getEdgeRing()){var r=new jsts.operation.overlay.MaximalEdgeRing(o,this.geometryFactory);e.push(r),r.setInResult()}}return e},jsts.operation.overlay.PolygonBuilder.prototype.buildMinimalEdgeRings=function(t,e,n){for(var o=[],r=0;r<t.length;r++){var i=t[r];if(i.getMaxNodeDegree()>2){i.linkDirectedEdgesForMinimalEdgeRings();var s=i.buildMinimalRings(),a=this.findShell(s);null!==a?(this.placePolygonHoles(a,s),e.push(a)):n=n.concat(s)}else o.push(i)}return o},jsts.operation.overlay.PolygonBuilder.prototype.findShell=function(t){for(var e=0,n=null,o=0;o<t.length;o++){var r=t[o];r.isHole()||(n=r,e++)}return jsts.util.Assert.isTrue(1>=e,"found two shells in MinimalEdgeRing list"),n},jsts.operation.overlay.PolygonBuilder.prototype.placePolygonHoles=function(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.isHole()&&o.setShell(t)}},jsts.operation.overlay.PolygonBuilder.prototype.sortShellsAndHoles=function(t,e,n){for(var o=0;o<t.length;o++){var r=t[o];r.isHole()?n.push(r):e.push(r)}},jsts.operation.overlay.PolygonBuilder.prototype.placeFreeHoles=function(t,e){for(var n=0;n<e.length;n++){var o=e[n];if(null==o.getShell()){var r=this.findEdgeRingContaining(o,t);if(null===r)throw new jsts.error.TopologyError("unable to assign hole to a shell",o.getCoordinate(0));o.setShell(r)}}},jsts.operation.overlay.PolygonBuilder.prototype.findEdgeRingContaining=function(t,e){for(var n=t.getLinearRing(),o=n.getEnvelopeInternal(),r=n.getCoordinateN(0),i=null,s=null,a=0;a<e.length;a++){var u=e[a],p=u.getLinearRing(),g=p.getEnvelopeInternal();null!==i&&(s=i.getLinearRing().getEnvelopeInternal());var l=!1;g.contains(o)&&jsts.algorithm.CGAlgorithms.isPointInRing(r,p.getCoordinates())&&(l=!0),l&&(null==i||s.contains(g))&&(i=u)}return i},jsts.operation.overlay.PolygonBuilder.prototype.computePolygons=function(t){for(var e=new javascript.util.ArrayList,n=0;n<t.length;n++){var o=t[n],r=o.toPolygon(this.geometryFactory);e.add(r)}return e},jsts.operation.overlay.PolygonBuilder.prototype.containsPoint=function(t){for(var e=0;e<this.shellList.length;e++){var n=this.shellList[e];if(n.containsPoint(t))return!0}return!1},function(){var t=jsts.util.Assert,e=javascript.util.ArrayList,n=function(t,n,o){this.lineEdgesList=new e,this.resultLineList=new e,this.op=t,this.geometryFactory=n,this.ptLocator=o};n.prototype.op=null,n.prototype.geometryFactory=null,n.prototype.ptLocator=null,n.prototype.lineEdgesList=null,n.prototype.resultLineList=null,n.prototype.build=function(t){return this.findCoveredLineEdges(),this.collectLines(t),this.buildLines(t),this.resultLineList},n.prototype.findCoveredLineEdges=function(){for(var t=this.op.getGraph().getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().findCoveredLineEdges()}for(var n=this.op.getGraph().getEdgeEnds().iterator();n.hasNext();){var o=n.next(),r=o.getEdge();if(o.isLineEdge()&&!r.isCoveredSet()){var i=this.op.isCoveredByA(o.getCoordinate());r.setCovered(i)}}},n.prototype.collectLines=function(t){for(var e=this.op.getGraph().getEdgeEnds().iterator();e.hasNext();){var n=e.next();this.collectLineEdge(n,t,this.lineEdgesList),this.collectBoundaryTouchEdge(n,t,this.lineEdgesList)}},n.prototype.collectLineEdge=function(t,e,n){var o=t.getLabel(),r=t.getEdge();t.isLineEdge()&&(t.isVisited()||!jsts.operation.overlay.OverlayOp.isResultOfOp(o,e)||r.isCovered()||(n.add(r),t.setVisitedEdge(!0)))},n.prototype.collectBoundaryTouchEdge=function(e,n,o){var r=e.getLabel();e.isLineEdge()||e.isVisited()||e.isInteriorAreaEdge()||e.getEdge().isInResult()||(t.isTrue(!(e.isInResult()||e.getSym().isInResult())||!e.getEdge().isInResult()),jsts.operation.overlay.OverlayOp.isResultOfOp(r,n)&&n===jsts.operation.overlay.OverlayOp.INTERSECTION&&(o.add(e.getEdge()),e.setVisitedEdge(!0)))},n.prototype.buildLines=function(){for(var t=this.lineEdgesList.iterator();t.hasNext();){var e=t.next(),n=(e.getLabel(),this.geometryFactory.createLineString(e.getCoordinates()));this.resultLineList.add(n),e.setInResult(!0)}},n.prototype.labelIsolatedLines=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),o=n.getLabel();n.isIsolated()&&(o.isNull(0)?this.labelIsolatedLine(n,0):this.labelIsolatedLine(n,1))}},n.prototype.labelIsolatedLine=function(t,e){var n=ptLocator.locate(t.getCoordinate(),op.getArgGeometry(e));t.getLabel().setLocation(e,n)},jsts.operation.overlay.LineBuilder=n}(),function(){var t=javascript.util.ArrayList,e=function(e,n){this.resultPointList=new t,this.op=e,this.geometryFactory=n};e.prototype.op=null,e.prototype.geometryFactory=null,e.prototype.resultPointList=null,e.prototype.build=function(t){return this.extractNonCoveredResultNodes(t),this.resultPointList},e.prototype.extractNonCoveredResultNodes=function(t){for(var e=this.op.getGraph().getNodes().iterator();e.hasNext();){var n=e.next();if(!(n.isInResult()||n.isIncidentEdgeInResult()||0!==n.getEdges().getDegree()&&t!==jsts.operation.overlay.OverlayOp.INTERSECTION)){var o=n.getLabel();jsts.operation.overlay.OverlayOp.isResultOfOp(o,t)&&this.filterCoveredNodeToPoint(n)}}},e.prototype.filterCoveredNodeToPoint=function(t){var e=t.getCoordinate();if(!this.op.isCoveredByLA(e)){var n=this.geometryFactory.createPoint(e);this.resultPointList.add(n)}},jsts.operation.overlay.PointBuilder=e}(),function(){var t=jsts.algorithm.PointLocator,e=jsts.geom.Location,n=jsts.geomgraph.EdgeList,o=jsts.geomgraph.Label,r=jsts.geomgraph.PlanarGraph,i=jsts.geomgraph.Position,s=jsts.geomgraph.EdgeNodingValidator,a=jsts.operation.GeometryGraphOperation,u=jsts.operation.overlay.OverlayNodeFactory,p=jsts.operation.overlay.PolygonBuilder,g=jsts.operation.overlay.LineBuilder,l=jsts.operation.overlay.PointBuilder,h=jsts.util.Assert,d=javascript.util.ArrayList;jsts.operation.overlay.OverlayOp=function(e,o){this.ptLocator=new t,this.edgeList=new n,this.resultPolyList=new d,this.resultLineList=new d,this.resultPointList=new d,a.call(this,e,o),this.graph=new r(new u),this.geomFact=e.getFactory()},jsts.operation.overlay.OverlayOp.prototype=new a,jsts.operation.overlay.OverlayOp.constructor=jsts.operation.overlay.OverlayOp,jsts.operation.overlay.OverlayOp.INTERSECTION=1,jsts.operation.overlay.OverlayOp.UNION=2,jsts.operation.overlay.OverlayOp.DIFFERENCE=3,jsts.operation.overlay.OverlayOp.SYMDIFFERENCE=4,jsts.operation.overlay.OverlayOp.overlayOp=function(t,e,n){var o=new jsts.operation.overlay.OverlayOp(t,e),r=o.getResultGeometry(n);return r},jsts.operation.overlay.OverlayOp.isResultOfOp=function(t,e){if(3===arguments.length)return jsts.operation.overlay.OverlayOp.isResultOfOp2.apply(this,arguments);var n=t.getLocation(0),o=t.getLocation(1);return jsts.operation.overlay.OverlayOp.isResultOfOp2(n,o,e)},jsts.operation.overlay.OverlayOp.isResultOfOp2=function(t,n,o){switch(t==e.BOUNDARY&&(t=e.INTERIOR),n==e.BOUNDARY&&(n=e.INTERIOR),o){case jsts.operation.overlay.OverlayOp.INTERSECTION:return t==e.INTERIOR&&n==e.INTERIOR;case jsts.operation.overlay.OverlayOp.UNION:return t==e.INTERIOR||n==e.INTERIOR;case jsts.operation.overlay.OverlayOp.DIFFERENCE:return t==e.INTERIOR&&n!=e.INTERIOR;case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:return t==e.INTERIOR&&n!=e.INTERIOR||t!=e.INTERIOR&&n==e.INTERIOR}return!1},jsts.operation.overlay.OverlayOp.prototype.ptLocator=null,jsts.operation.overlay.OverlayOp.prototype.geomFact=null,jsts.operation.overlay.OverlayOp.prototype.resultGeom=null,jsts.operation.overlay.OverlayOp.prototype.graph=null,jsts.operation.overlay.OverlayOp.prototype.edgeList=null,jsts.operation.overlay.OverlayOp.prototype.resultPolyList=null,jsts.operation.overlay.OverlayOp.prototype.resultLineList=null,jsts.operation.overlay.OverlayOp.prototype.resultPointList=null,jsts.operation.overlay.OverlayOp.prototype.getResultGeometry=function(t){return this.computeOverlay(t),this.resultGeom},jsts.operation.overlay.OverlayOp.prototype.getGraph=function(){return this.graph},jsts.operation.overlay.OverlayOp.prototype.computeOverlay=function(t){this.copyPoints(0),this.copyPoints(1),this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1),this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!0);var e=new d;this.arg[0].computeSplitEdges(e),this.arg[1].computeSplitEdges(e);this.insertUniqueEdges(e),this.computeLabelsFromDepths(),this.replaceCollapsedEdges(),s.checkValid(this.edgeList.getEdges()),this.graph.addEdges(this.edgeList.getEdges()),this.computeLabelling(),this.labelIncompleteNodes(),this.findResultAreaEdges(t),this.cancelDuplicateResultEdges();var n=new p(this.geomFact);n.add(this.graph),this.resultPolyList=n.getPolygons();var o=new g(this,this.geomFact,this.ptLocator);this.resultLineList=o.build(t);var r=new l(this,this.geomFact,this.ptLocator);this.resultPointList=r.build(t),this.resultGeom=this.computeGeometry(this.resultPointList,this.resultLineList,this.resultPolyList,t)},jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdges=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertUniqueEdge(n)}},jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdge=function(t){var e=this.edgeList.findEqualEdge(t);if(null!==e){var n=e.getLabel(),r=t.getLabel();e.isPointwiseEqual(t)||(r=new o(t.getLabel()),r.flip());var i=e.getDepth();i.isNull()&&i.add(n),i.add(r),n.merge(r)}else this.edgeList.add(t)},jsts.operation.overlay.OverlayOp.prototype.computeLabelsFromDepths=function(){for(var t=this.edgeList.iterator();t.hasNext();){var e=t.next(),n=e.getLabel(),o=e.getDepth();if(!o.isNull()){o.normalize();for(var r=0;2>r;r++)n.isNull(r)||!n.isArea()||o.isNull(r)||(0==o.getDelta(r)?n.toLine(r):(h.isTrue(!o.isNull(r,i.LEFT),"depth of LEFT side has not been initialized"),n.setLocation(r,i.LEFT,o.getLocation(r,i.LEFT)),h.isTrue(!o.isNull(r,i.RIGHT),"depth of RIGHT side has not been initialized"),n.setLocation(r,i.RIGHT,o.getLocation(r,i.RIGHT))))}}},jsts.operation.overlay.OverlayOp.prototype.replaceCollapsedEdges=function(){for(var t=new d,e=this.edgeList.iterator();e.hasNext();){var n=e.next();n.isCollapsed()&&(e.remove(),t.add(n.getCollapsedEdge()))}this.edgeList.addAll(t)},jsts.operation.overlay.OverlayOp.prototype.copyPoints=function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),o=this.graph.addNode(n.getCoordinate());o.setLabel(t,n.getLabel().getLocation(t))}},jsts.operation.overlay.OverlayOp.prototype.computeLabelling=function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}this.mergeSymLabels(),this.updateNodeLabelling()},jsts.operation.overlay.OverlayOp.prototype.mergeSymLabels=function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().mergeSymLabels()}},jsts.operation.overlay.OverlayOp.prototype.updateNodeLabelling=function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next(),n=e.getEdges().getLabel();e.getLabel().merge(n)}},jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNodes=function(){for(var t=0,e=this.graph.getNodes().iterator();e.hasNext();){var n=e.next(),o=n.getLabel();n.isIsolated()&&(t++,o.isNull(0)?this.labelIncompleteNode(n,0):this.labelIncompleteNode(n,1)),n.getEdges().updateLabelling(o)}},jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNode=function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setLocation(e,n)},jsts.operation.overlay.OverlayOp.prototype.findResultAreaEdges=function(t){for(var e=this.graph.getEdgeEnds().iterator();e.hasNext();){var n=e.next(),o=n.getLabel();o.isArea()&&!n.isInteriorAreaEdge()&&jsts.operation.overlay.OverlayOp.isResultOfOp(o.getLocation(0,i.RIGHT),o.getLocation(1,i.RIGHT),t)&&n.setInResult(!0)}},jsts.operation.overlay.OverlayOp.prototype.cancelDuplicateResultEdges=function(){for(var t=this.graph.getEdgeEnds().iterator();t.hasNext();){var e=t.next(),n=e.getSym();e.isInResult()&&n.isInResult()&&(e.setInResult(!1),n.setInResult(!1))}},jsts.operation.overlay.OverlayOp.prototype.isCoveredByLA=function(t){return this.isCovered(t,this.resultLineList)?!0:this.isCovered(t,this.resultPolyList)?!0:!1},jsts.operation.overlay.OverlayOp.prototype.isCoveredByA=function(t){return this.isCovered(t,this.resultPolyList)?!0:!1},jsts.operation.overlay.OverlayOp.prototype.isCovered=function(t,n){for(var o=n.iterator();o.hasNext();){var r=o.next(),i=this.ptLocator.locate(t,r);if(i!=e.EXTERIOR)return!0}return!1},jsts.operation.overlay.OverlayOp.prototype.computeGeometry=function(t,e,n){var o=new d;return o.addAll(t),o.addAll(e),o.addAll(n),this.geomFact.buildGeometry(o)},jsts.operation.overlay.OverlayOp.prototype.createEmptyResult=function(t){var e=null;switch(resultDimension(t,this.arg[0].getGeometry(),this.arg[1].getGeometry())){case-1:e=geomFact.createGeometryCollection();break;case 0:e=geomFact.createPoint(null);break;case 1:e=geomFact.createLineString(null);break;case 2:e=geomFact.createPolygon(null,null)}return e},jsts.operation.overlay.OverlayOp.prototype.resultDimension=function(t,e,n){var o=e.getDimension(),r=n.getDimension(),i=-1;switch(t){case jsts.operation.overlay.OverlayOp.INTERSECTION:i=Math.min(o,r);break;case jsts.operation.overlay.OverlayOp.UNION:i=Math.max(o,r);break;case jsts.operation.overlay.OverlayOp.DIFFERENCE:i=o;break;case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:i=Math.max(o,r)}return i}}(),function(){var t=jsts.operation.overlay.OverlayOp,e=jsts.operation.overlay.snap.GeometrySnapper,n=function(t,e){this.geom=[],this.geom[0]=t,this.geom[1]=e,this.computeSnapTolerance()};n.overlayOp=function(t,e,o){var r=new n(t,e);return r.getResultGeometry(o)},n.intersection=function(e,n){return this.overlayOp(e,n,t.INTERSECTION)},n.union=function(e,n){return this.overlayOp(e,n,t.UNION)},n.difference=function(e,n){return overlayOp(e,n,t.DIFFERENCE)},n.symDifference=function(e,n){return overlayOp(e,n,t.SYMDIFFERENCE)},n.prototype.geom=null,n.prototype.snapTolerance=null,n.prototype.computeSnapTolerance=function(){this.snapTolerance=e.computeOverlaySnapTolerance(this.geom[0],this.geom[1])},n.prototype.getResultGeometry=function(e){var n=this.snap(this.geom),o=t.overlayOp(n[0],n[1],e);return this.prepareResult(o)},n.prototype.selfSnap=function(t){var n=new e(t),o=n.snapTo(t,this.snapTolerance);return o},n.prototype.snap=function(t){var n=t,o=e.snap(n[0],n[1],this.snapTolerance);return o},n.prototype.prepareResult=function(t){return t},n.prototype.cbr=null,n.prototype.removeCommonBits=function(){this.cbr=new jsts.precision.CommonBitsRemover,this.cbr.add(this.geom[0]),this.cbr.add(this.geom[1]);var t=[];return t[0]=cbr.removeCommonBits(this.geom[0].clone()),t[1]=cbr.removeCommonBits(this.geom[1].clone()),t},jsts.operation.overlay.snap.SnapOverlayOp=n}(),jsts.geomgraph.index.EdgeSetIntersector=function(){},jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections2=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geomgraph.index.SimpleMCSweepLineIntersector=function(){this.events=[]},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector,jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.events=null,jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.nOverlaps=0,jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections=function(t,e,n){return e instanceof javascript.util.List?void this.computeIntersections2.apply(this,arguments):(n?this.addList2(t,null):this.addList(t),void this.computeIntersections3(e))},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections2=function(t,e,n){this.addList2(t,t),this.addList2(e,e),this.computeIntersections3(n)},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.add=function(t,e){if(t instanceof javascript.util.List)return void this.addList.apply(this,arguments);for(var n=t.getMonotoneChainEdge(),o=n.getStartIndexes(),r=0;r<o.length-1;r++){var i=new jsts.geomgraph.index.MonotoneChain(n,r),s=new jsts.geomgraph.index.SweepLineEvent(n.getMinX(r),i,e);this.events.push(s),this.events.push(new jsts.geomgraph.index.SweepLineEvent(n.getMaxX(r),s))}},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.add(n,n)}},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList2=function(t,e){for(var n=t.iterator();n.hasNext();){var o=n.next();this.add(o,e)}},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.prepareEvents=function(){this.events.sort(function(t,e){return t.compareTo(e)});for(var t=0;t<this.events.length;t++){var e=this.events[t];e.isDelete()&&e.getInsertEvent().setDeleteEventIndex(t)}},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections3=function(t){this.nOverlaps=0,this.prepareEvents();for(var e=0;e<this.events.length;e++){var n=this.events[e];n.isInsert()&&this.processOverlaps(e,n.getDeleteEventIndex(),n,t)}},jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.processOverlaps=function(t,e,n,o){for(var r=n.getObject(),i=t;e>i;i++){var s=this.events[i];if(s.isInsert()){var a=s.getObject();n.isSameLabel(s)||(r.computeIntersections(a,o),this.nOverlaps++)}}},jsts.algorithm.locate.SimplePointInAreaLocator=function(t){this.geom=t},jsts.algorithm.locate.SimplePointInAreaLocator.locate=function(t,e){return e.isEmpty()?jsts.geom.Location.EXTERIOR:jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(t,e)?jsts.geom.Location.INTERIOR:jsts.geom.Location.EXTERIOR},jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint=function(t,e){if(e instanceof jsts.geom.Polygon)return jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon(t,e);if(e instanceof jsts.geom.GeometryCollection||e instanceof jsts.geom.MultiPoint||e instanceof jsts.geom.MultiLineString||e instanceof jsts.geom.MultiPolygon)for(var n=0;n<e.geometries.length;n++){var o=e.geometries[n];if(o!==e&&jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(t,o))return!0}return!1},jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon=function(t,e){if(e.isEmpty())return!1;var n=e.getExteriorRing();if(!jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(t,n))return!1;for(var o=0;o<e.getNumInteriorRing();o++){var r=e.getInteriorRingN(o);if(jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(t,r))return!1}return!0},jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing=function(t,e){return e.getEnvelopeInternal().intersects(t)?jsts.algorithm.CGAlgorithms.isPointInRing(t,e.getCoordinates()):!1},jsts.algorithm.locate.SimplePointInAreaLocator.prototype.geom=null,jsts.algorithm.locate.SimplePointInAreaLocator.prototype.locate=function(t){return jsts.algorithm.locate.SimplePointInAreaLocator.locate(t,geom)},function(){var t=jsts.geom.Location,e=jsts.geomgraph.Position,n=jsts.geomgraph.EdgeEndStar,o=jsts.util.Assert;jsts.geomgraph.DirectedEdgeStar=function(){jsts.geomgraph.EdgeEndStar.call(this)},jsts.geomgraph.DirectedEdgeStar.prototype=new n,jsts.geomgraph.DirectedEdgeStar.constructor=jsts.geomgraph.DirectedEdgeStar,jsts.geomgraph.DirectedEdgeStar.prototype.resultAreaEdgeList=null,jsts.geomgraph.DirectedEdgeStar.prototype.label=null,jsts.geomgraph.DirectedEdgeStar.prototype.insert=function(t){var e=t;this.insertEdgeEnd(e,e)},jsts.geomgraph.DirectedEdgeStar.prototype.getLabel=function(){return this.label},jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree=function(){for(var t=0,e=this.iterator();e.hasNext();){var n=e.next();n.isInResult()&&t++}return t},jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree=function(t){for(var e=0,n=this.iterator();n.hasNext();){var o=n.next();o.getEdgeRing()===t&&e++}return e},jsts.geomgraph.DirectedEdgeStar.prototype.getRightmostEdge=function(){var t=this.getEdges(),e=t.size();if(1>e)return null;var n=t.get(0);if(1==e)return n;var r=t.get(e-1),i=n.getQuadrant(),s=r.getQuadrant();if(jsts.geomgraph.Quadrant.isNorthern(i)&&jsts.geomgraph.Quadrant.isNorthern(s))return n;if(!jsts.geomgraph.Quadrant.isNorthern(i)&&!jsts.geomgraph.Quadrant.isNorthern(s))return r;return 0!=n.getDy()?n:0!=r.getDy()?r:(o.shouldNeverReachHere("found two horizontal edges incident on node"),null)},jsts.geomgraph.DirectedEdgeStar.prototype.computeLabelling=function(e){n.prototype.computeLabelling.call(this,e),this.label=new jsts.geomgraph.Label(t.NONE);for(var o=this.iterator();o.hasNext();)for(var r=o.next(),i=r.getEdge(),s=i.getLabel(),a=0;2>a;a++){var u=s.getLocation(a);(u===t.INTERIOR||u===t.BOUNDARY)&&this.label.setLocation(a,t.INTERIOR)}},jsts.geomgraph.DirectedEdgeStar.prototype.mergeSymLabels=function(){for(var t=this.iterator();t.hasNext();){var e=t.next(),n=e.getLabel();n.merge(e.getSym().getLabel())}},jsts.geomgraph.DirectedEdgeStar.prototype.updateLabelling=function(t){for(var e=this.iterator();e.hasNext();){var n=e.next(),o=n.getLabel();o.setAllLocationsIfNull(0,t.getLocation(0)),o.setAllLocationsIfNull(1,t.getLocation(1))}},jsts.geomgraph.DirectedEdgeStar.prototype.getResultAreaEdges=function(){if(null!==this.resultAreaEdgeList)return this.resultAreaEdgeList;
this.resultAreaEdgeList=new javascript.util.ArrayList;for(var t=this.iterator();t.hasNext();){var e=t.next();(e.isInResult()||e.getSym().isInResult())&&this.resultAreaEdgeList.add(e)}return this.resultAreaEdgeList},jsts.geomgraph.DirectedEdgeStar.prototype.SCANNING_FOR_INCOMING=1,jsts.geomgraph.DirectedEdgeStar.prototype.LINKING_TO_OUTGOING=2,jsts.geomgraph.DirectedEdgeStar.prototype.linkResultDirectedEdges=function(){this.getResultAreaEdges();for(var t=null,e=null,n=this.SCANNING_FOR_INCOMING,r=0;r<this.resultAreaEdgeList.size();r++){var i=this.resultAreaEdgeList.get(r),s=i.getSym();if(i.getLabel().isArea())switch(null===t&&i.isInResult()&&(t=i),n){case this.SCANNING_FOR_INCOMING:if(!s.isInResult())continue;e=s,n=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(!i.isInResult())continue;e.setNext(i),n=this.SCANNING_FOR_INCOMING}}if(n===this.LINKING_TO_OUTGOING){if(null===t)throw new jsts.error.TopologyError("no outgoing dirEdge found",this.getCoordinate());o.isTrue(t.isInResult(),"unable to link last incoming dirEdge"),e.setNext(t)}},jsts.geomgraph.DirectedEdgeStar.prototype.linkMinimalDirectedEdges=function(t){for(var e=null,n=null,r=this.SCANNING_FOR_INCOMING,i=this.resultAreaEdgeList.size()-1;i>=0;i--){var s=this.resultAreaEdgeList.get(i),a=s.getSym();switch(null===e&&s.getEdgeRing()===t&&(e=s),r){case this.SCANNING_FOR_INCOMING:if(a.getEdgeRing()!=t)continue;n=a,r=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(s.getEdgeRing()!==t)continue;n.setNextMin(s),r=this.SCANNING_FOR_INCOMING}}r===this.LINKING_TO_OUTGOING&&(o.isTrue(null!==e,"found null for first outgoing dirEdge"),o.isTrue(e.getEdgeRing()===t,"unable to link last incoming dirEdge"),n.setNextMin(e))},jsts.geomgraph.DirectedEdgeStar.prototype.linkAllDirectedEdges=function(){this.getEdges();for(var t=null,e=null,n=this.edgeList.size()-1;n>=0;n--){var o=this.edgeList.get(n),r=o.getSym();null===e&&(e=r),null!==t&&r.setNext(t),t=o}e.setNext(t)},jsts.geomgraph.DirectedEdgeStar.prototype.findCoveredLineEdges=function(){for(var e=t.NONE,n=this.iterator();n.hasNext();){var o=n.next(),r=o.getSym();if(!o.isLineEdge()){if(o.isInResult()){e=t.INTERIOR;break}if(r.isInResult()){e=t.EXTERIOR;break}}}if(e!==t.NONE)for(var i=e,n=this.iterator();n.hasNext();){var o=n.next(),r=o.getSym();o.isLineEdge()?o.getEdge().setCovered(i===t.INTERIOR):(o.isInResult()&&(i=t.EXTERIOR),r.isInResult()&&(i=t.INTERIOR))}},jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths=function(t){if(2===arguments.length)return void this.computeDepths2.apply(this,arguments);var n=this.findIndex(t),o=(t.getLabel(),t.getDepth(e.LEFT)),r=t.getDepth(e.RIGHT),i=this.computeDepths2(n+1,this.edgeList.size(),o),s=this.computeDepths2(0,n,i);if(s!=r)throw new jsts.error.TopologyError("depth mismatch at "+t.getCoordinate())},jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths2=function(t,n,o){for(var r=o,i=t;n>i;i++){{var s=this.edgeList.get(i);s.getLabel()}s.setEdgeDepths(e.RIGHT,r),r=s.getDepth(e.LEFT)}return r}}(),jsts.algorithm.CentroidLine=function(){this.centSum=new jsts.geom.Coordinate},jsts.algorithm.CentroidLine.prototype.centSum=null,jsts.algorithm.CentroidLine.prototype.totalLength=0,jsts.algorithm.CentroidLine.prototype.add=function(t){if(t instanceof Array)return void this.add2.apply(this,arguments);if(t instanceof jsts.geom.LineString)this.add(t.getCoordinates());else if(t instanceof jsts.geom.Polygon){var e=t;this.add(e.getExteriorRing().getCoordinates());for(var n=0;n<e.getNumInteriorRing();n++)this.add(e.getInteriorRingN(n).getCoordinates())}else if(t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.MultiPolygon)for(var o=t,n=0;n<o.getNumGeometries();n++)this.add(o.getGeometryN(n))},jsts.algorithm.CentroidLine.prototype.getCentroid=function(){var t=new jsts.geom.Coordinate;return t.x=this.centSum.x/this.totalLength,t.y=this.centSum.y/this.totalLength,t},jsts.algorithm.CentroidLine.prototype.add2=function(t){for(var e=0;e<t.length-1;e++){var n=t[e].distance(t[e+1]);this.totalLength+=n;var o=(t[e].x+t[e+1].x)/2;this.centSum.x+=n*o;var r=(t[e].y+t[e+1].y)/2;this.centSum.y+=n*r}},jsts.index.IntervalSize=function(){},jsts.index.IntervalSize.MIN_BINARY_EXPONENT=-50,jsts.index.IntervalSize.isZeroWidth=function(t,e){var n=e-t;if(0===n)return!0;var o,r,i;return o=Math.max(Math.abs(t),Math.abs(e)),r=n/o,i=jsts.index.DoubleBits.exponent(r),i<=jsts.index.IntervalSize.MIN_BINARY_EXPONENT},jsts.geomgraph.index.SimpleEdgeSetIntersector=function(){},jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector,jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.nOverlaps=0,jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections=function(t,e,n){if(e instanceof javascript.util.List)return void this.computeIntersections2.apply(this,arguments);this.nOverlaps=0;for(var o=t.iterator();o.hasNext();)for(var r=o.next(),i=t.iterator();i.hasNext();){var s=i.next();(n||r!=s)&&this.computeIntersects(r,s,e)}},jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections2=function(t,e,n){this.nOverlaps=0;for(var o=t.iterator();o.hasNext();)for(var r=o.next(),i=e.iterator();i.hasNext();){var s=i.next();this.computeIntersects(r,s,n)}},jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersects=function(t,e,n){var o,r,i=t.getCoordinates(),s=e.getCoordinates();for(o=0;o<i.length-1;o++)for(r=0;r<s.length-1;r++)n.addIntersections(t,o,e,r)},jsts.geomgraph.Edge=function(t,e){this.pts=t,this.label=e,this.eiList=new jsts.geomgraph.EdgeIntersectionList(this),this.depth=new jsts.geomgraph.Depth},jsts.geomgraph.Edge.prototype=new jsts.geomgraph.GraphComponent,jsts.geomgraph.Edge.constructor=jsts.geomgraph.Edge,jsts.geomgraph.Edge.updateIM=function(t,e){e.setAtLeastIfValid(t.getLocation(0,jsts.geomgraph.Position.ON),t.getLocation(1,jsts.geomgraph.Position.ON),1),t.isArea()&&(e.setAtLeastIfValid(t.getLocation(0,jsts.geomgraph.Position.LEFT),t.getLocation(1,jsts.geomgraph.Position.LEFT),2),e.setAtLeastIfValid(t.getLocation(0,jsts.geomgraph.Position.RIGHT),t.getLocation(1,jsts.geomgraph.Position.RIGHT),2))},jsts.geomgraph.Edge.prototype.pts=null,jsts.geomgraph.Edge.prototype.env=null,jsts.geomgraph.Edge.prototype.name=null,jsts.geomgraph.Edge.prototype.mce=null,jsts.geomgraph.Edge.prototype._isIsolated=!0,jsts.geomgraph.Edge.prototype.depth=null,jsts.geomgraph.Edge.prototype.depthDelta=0,jsts.geomgraph.Edge.prototype.eiList=null,jsts.geomgraph.Edge.prototype.getNumPoints=function(){return this.pts.length},jsts.geomgraph.Edge.prototype.getEnvelope=function(){if(null===this.env){this.env=new jsts.geom.Envelope;for(var t=0;t<this.pts.length;t++)this.env.expandToInclude(pts[t])}return env},jsts.geomgraph.Edge.prototype.getDepth=function(){return this.depth},jsts.geomgraph.Edge.prototype.getDepthDelta=function(){return this.depthDelta},jsts.geomgraph.Edge.prototype.setDepthDelta=function(t){this.depthDelta=t},jsts.geomgraph.Edge.prototype.getCoordinates=function(){return this.pts},jsts.geomgraph.Edge.prototype.getCoordinate=function(t){return void 0===t?this.pts.length>0?this.pts[0]:null:this.pts[t]},jsts.geomgraph.Edge.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1])},jsts.geomgraph.Edge.prototype.setIsolated=function(t){this._isIsolated=t},jsts.geomgraph.Edge.prototype.isIsolated=function(){return this._isIsolated},jsts.geomgraph.Edge.prototype.addIntersections=function(t,e,n){for(var o=0;o<t.getIntersectionNum();o++)this.addIntersection(t,e,n,o)},jsts.geomgraph.Edge.prototype.addIntersection=function(t,e,n,o){var r=new jsts.geom.Coordinate(t.getIntersection(o)),i=e,s=t.getEdgeDistance(n,o),a=i+1;if(a<this.pts.length){var u=this.pts[a];r.equals2D(u)&&(i=a,s=0)}this.eiList.add(r,i,s)},jsts.geomgraph.Edge.prototype.getMaximumSegmentIndex=function(){return this.pts.length-1},jsts.geomgraph.Edge.prototype.getEdgeIntersectionList=function(){return this.eiList},jsts.geomgraph.Edge.prototype.getMonotoneChainEdge=function(){return null==this.mce&&(this.mce=new jsts.geomgraph.index.MonotoneChainEdge(this)),this.mce},jsts.geomgraph.Edge.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1])},jsts.geomgraph.Edge.prototype.isCollapsed=function(){return this.label.isArea()?3!=this.pts.length?!1:this.pts[0].equals(this.pts[2])?!0:!1:!1},jsts.geomgraph.Edge.prototype.getCollapsedEdge=function(){var t=[];t[0]=this.pts[0],t[1]=this.pts[1];var e=new jsts.geomgraph.Edge(t,jsts.geomgraph.Label.toLineLabel(this.label));return e},jsts.geomgraph.Edge.prototype.computeIM=function(t){jsts.geomgraph.Edge.updateIM(this.label,t)},jsts.geomgraph.Edge.prototype.isPointwiseEqual=function(t){if(this.pts.length!=t.pts.length)return!1;for(var e=0;e<this.pts.length;e++)if(!this.pts[e].equals2D(t.pts[e]))return!1;return!0},jsts.noding.Octant=function(){throw jsts.error.AbstractMethodInvocationError()},jsts.noding.Octant.octant=function(t,e){if(t instanceof jsts.geom.Coordinate)return jsts.noding.Octant.octant2.apply(this,arguments);if(0===t&&0===e)throw new jsts.error.IllegalArgumentError("Cannot compute the octant for point ( "+t+", "+e+" )");var n=Math.abs(t),o=Math.abs(e);return t>=0?e>=0?n>=o?0:1:n>=o?7:6:e>=0?n>=o?3:2:n>=o?4:5},jsts.noding.Octant.octant2=function(t,e){var n=e.x-t.x,o=e.y-t.y;if(0===n&&0===o)throw new jsts.error.IllegalArgumentError("Cannot compute the octant for two identical points "+t);return jsts.noding.Octant.octant(n,o)},jsts.operation.union.UnionInteracting=function(t,e){this.g0=t,this.g1=e,this.geomFactory=t.getFactory(),this.interacts0=[],this.interacts1=[]},jsts.operation.union.UnionInteracting.union=function(t,e){var n=new jsts.operation.union.UnionInteracting(t,e);return n.union()},jsts.operation.union.UnionInteracting.prototype.geomFactory=null,jsts.operation.union.UnionInteracting.prototype.g0=null,jsts.operation.union.UnionInteracting.prototype.g1=null,jsts.operation.union.UnionInteracting.prototype.interacts0=null,jsts.operation.union.UnionInteracting.prototype.interacts1=null,jsts.operation.union.UnionInteracting.prototype.union=function(){this.computeInteracting();var t=this.extractElements(this.g0,this.interacts0,!0),e=this.extractElements(this.g1,this.interacts1,!0);t.isEmpty()||e.isEmpty();var n=in0.union(e),o=this.extractElements(this.g0,this.interacts0,!1),r=this.extractElements(this.g1,this.interacts1,!1),i=jsts.geom.util.GeometryCombiner.combine(n,o,r);return i},jsts.operation.union.UnionInteracting.prototype.bufferUnion=function(t,e){var n=t.getFactory(),o=n.createGeometryCollection([t,e]),r=o.buffer(0);return r},jsts.operation.union.UnionInteracting.prototype.computeInteracting=function(t){if(t){for(var e=!1,n=0,o=g1.getNumGeometries();o>n;n++){var r=this.g1.getGeometryN(n),i=r.getEnvelopeInternal().intersects(t.getEnvelopeInternal());i&&(this.interacts1[n]=!0,e=!0)}return e}for(var n=0,o=this.g0.getNumGeometries();o>n;n++){var s=this.g0.getGeometryN(n);this.interacts0[n]=this.computeInteracting(s)}},jsts.operation.union.UnionInteracting.prototype.extractElements=function(t,e,n){for(var o=[],r=0,i=t.getNumGeometries();i>r;r++){var s=t.getGeometryN(r);e[r]===n&&o.push(s)}return this.geomFactory.buildGeometry(o)},jsts.triangulate.quadedge.TrianglePredicate=function(){},jsts.triangulate.quadedge.TrianglePredicate.isInCircleNonRobust=function(t,e,n,o){var r=(t.x*t.x+t.y*t.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(e,n,o)-(e.x*e.x+e.y*e.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(t,n,o)+(n.x*n.x+n.y*n.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(t,e,o)-(o.x*o.x+o.y*o.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(t,e,n)>0;return r},jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized=function(t,e,n,o){var r,i,s,a,u,p,g,l,h,d,c,f,m;return r=t.x-o.x,i=t.y-o.y,s=e.x-o.x,a=e.y-o.y,u=n.x-o.x,p=n.y-o.y,g=r*a-s*i,l=s*p-u*a,h=u*i-r*p,d=r*r+i*i,c=s*s+a*a,f=u*u+p*p,m=d*l+c*h+f*g,m>0},jsts.triangulate.quadedge.TrianglePredicate.triArea=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(e.y-t.y)*(n.x-t.x)},jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust=function(t,e,n,o){return jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized(t,e,n,o)},jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDSlow=function(t,e,n,o){var r,i,s,a,u,p,g,l,h,d,c,f,m,y;return r=jsts.math.DD.valueOf(o.x),i=jsts.math.DD.valueOf(o.y),s=jsts.math.DD.valueOf(t.x),a=jsts.math.DD.valueOf(t.y),u=jsts.math.DD.valueOf(e.x),p=jsts.math.DD.valueOf(e.y),g=jsts.math.DD.valueOf(n.x),l=jsts.math.DD.valueOf(n.y),h=s.multiply(s).add(a.multiply(a)).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(u,p,g,l,r,i)),d=u.multiply(u).add(p.multiply(p)).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(s,a,g,l,r,i)),c=g.multiply(g).add(l.multiply(l)).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(s,a,u,p,r,i)),f=r.multiply(r).add(i.multiply(i)).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(s,a,u,p,g,l)),m=h.subtract(d).add(c).subtract(f),y=m.doubleValue()>0},jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow=function(t,e,n,o,r,i){return n.subtract(t).multiply(i.subtract(e)).subtract(o.subtract(e).multiply(r.subtract(t)))},jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDFast=function(t,e,n,o){var r,i,s,a,u,p;return r=jsts.math.DD.sqr(t.x).selfAdd(jsts.math.DD.sqr(t.y)).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(e,n,o)),i=jsts.math.DD.sqr(e.x).selfAdd(jsts.math.DD.sqr(e.y)).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(t,n,o)),s=jsts.math.DD.sqr(n.x).selfAdd(jsts.math.DD.sqr(n.y)).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(t,e,o)),a=jsts.math.DD.sqr(o.x).selfAdd(jsts.math.DD.sqr(o.y)).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(t,e,n)),u=r.selfSubtract(i).selfAdd(s).selfSubtract(a),p=u.doubleValue()>0},jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast=function(t,e,n){var o,r;return o=jsts.math.DD.valueOf(e.x).selfSubtract(t.x).selfMultiply(jsts.math.DD.valueOf(n.y).selfSubtract(t.y)),r=jsts.math.DD.valueOf(e.y).selSubtract(t.y).selfMultiply(jsts.math.DD.valueOf(n.x).selfSubtract(t.x)),o.selfSubtract(r)},jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDNormalized=function(t,e,n,o){var r,i,s,a,u,p,g,l,h,d,c,f,m,y;return r=jsts.math.DD.valueOf(t.x).selfSubtract(o.x),i=jsts.math.DD.valueOf(t.y).selfSubtract(o.y),s=jsts.math.DD.valueOf(e.x).selfSubtract(o.x),s=jsts.math.DD.valueOf(e.y).selfSubtract(o.y),u=jsts.math.DD.valueOf(n.x).selfSubtract(o.x),u=jsts.math.DD.valueOf(n.y).selfSubtract(o.y),g=r.multiply(a).selfSubtract(s.multiply(i)),l=s.multiply(p).selfSubtract(u.multiply(a)),h=u.multiply(i).selfSubtract(r.multiply(p)),d=r.multiply(r).selfAdd(i.multiply(i)),c=s.multiply(s).selfAdd(a.multiply(a)),f=u.multiply(u).selfAdd(p.multiply(p)),m=d.selfMultiply(l).selfAdd(c.selfMultiply(h)).selfAdd(f.selfMultiply(g)),y=m.doubleValue()>0},jsts.triangulate.quadedge.TrianglePredicate.isInCircleCC=function(t,e,n,o){var r,i,s;return r=jsts.geom.Triangle.circumcentre(t,e,n),i=t.distance(r),s=o.distance(r)-i,0>=s},jsts.operation.union.PointGeometryUnion=function(t,e){this.pointGeom=t,this.otherGeom=e,this.geomFact=e.getFactory()},jsts.operation.union.PointGeometryUnion.union=function(t,e){var n=new jsts.operation.union.PointGeometryUnion(t,e);return n.union()},jsts.operation.union.PointGeometryUnion.prototype.pointGeom=null,jsts.operation.union.PointGeometryUnion.prototype.otherGeom=null,jsts.operation.union.PointGeometryUnion.prototype.geomFact=null,jsts.operation.union.PointGeometryUnion.prototype.union=function(){for(var t=new jsts.algorithm.PointLocator,e=[],n=0,o=this.pointGeom.getNumGeometries();o>n;n++){var r=this.pointGeom.getGeometryN(n),i=r.getCoordinate(),s=t.locate(i,this.otherGeom);if(s===jsts.geom.Location.EXTERIOR){for(var a=!0,u=e.length;n--;)if(e[u].equals(i)){a=!1;break}a&&e.push(i)}}if(e.sort(function(t,e){return t.compareTo(e)}),0===e.length)return this.otherGeom;var p=null,g=jsts.geom.CoordinateArrays.toCoordinateArray(e);return p=1===g.length?this.geomFact.createPoint(g[0]):this.geomFact.createMultiPoint(g),jsts.geom.util.GeometryCombiner.combine(p,this.otherGeom)},jsts.noding.IntersectionFinderAdder=function(t){this.li=t,this.interiorIntersections=new javascript.util.ArrayList},jsts.noding.IntersectionFinderAdder.prototype=new jsts.noding.SegmentIntersector,jsts.noding.IntersectionFinderAdder.constructor=jsts.noding.IntersectionFinderAdder,jsts.noding.IntersectionFinderAdder.prototype.li=null,jsts.noding.IntersectionFinderAdder.prototype.interiorIntersections=null,jsts.noding.IntersectionFinderAdder.prototype.getInteriorIntersections=function(){return this.interiorIntersections},jsts.noding.IntersectionFinderAdder.prototype.processIntersections=function(t,e,n,o){if(t!==n||e!==o){var r=t.getCoordinates()[e],i=t.getCoordinates()[e+1],s=n.getCoordinates()[o],a=n.getCoordinates()[o+1];if(this.li.computeIntersection(r,i,s,a),this.li.hasIntersection()&&this.li.isInteriorIntersection()){for(var u=0;u<this.li.getIntersectionNum();u++)this.interiorIntersections.add(this.li.getIntersection(u));t.addIntersections(this.li,e,0),n.addIntersections(this.li,o,1)}}},jsts.noding.IntersectionFinderAdder.prototype.isDone=function(){return!1},jsts.noding.snapround.MCIndexSnapRounder=function(t){this.pm=t,this.li=new jsts.algorithm.RobustLineIntersector,this.li.setPrecisionModel(t),this.scaleFactor=t.getScale()},jsts.noding.snapround.MCIndexSnapRounder.prototype=new jsts.noding.Noder,jsts.noding.snapround.MCIndexSnapRounder.constructor=jsts.noding.snapround.MCIndexSnapRounder,jsts.noding.snapround.MCIndexSnapRounder.prototype.pm=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.li=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.scaleFactor=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.noder=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.pointSnapper=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.nodedSegStrings=null,jsts.noding.snapround.MCIndexSnapRounder.prototype.getNodedSubstrings=function(){return jsts.noding.NodedSegmentString.getNodedSubstrings(this.nodedSegStrings)},jsts.noding.snapround.MCIndexSnapRounder.prototype.computeNodes=function(t){this.nodedSegStrings=t,this.noder=new jsts.noding.MCIndexNoder,this.pointSnapper=new jsts.noding.snapround.MCIndexPointSnapper(this.noder.getIndex()),this.snapRound(t,this.li)},jsts.noding.snapround.MCIndexSnapRounder.prototype.snapRound=function(t,e){var n=this.findInteriorIntersections(t,e);this.computeIntersectionSnaps(n),this.computeVertexSnaps(t)},jsts.noding.snapround.MCIndexSnapRounder.prototype.findInteriorIntersections=function(t,e){var n=new jsts.noding.IntersectionFinderAdder(e);return this.noder.setSegmentIntersector(n),this.noder.computeNodes(t),n.getInteriorIntersections()},jsts.noding.snapround.MCIndexSnapRounder.prototype.computeIntersectionSnaps=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),o=new jsts.noding.snapround.HotPixel(n,this.scaleFactor,this.li);this.pointSnapper.snap(o)}},jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps=function(t){if(t instanceof jsts.noding.NodedSegmentString)return void this.computeVertexSnaps2.apply(this,arguments);for(var e=t.iterator();e.hasNext();){var n=e.next();this.computeVertexSnaps(n)}},jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps2=function(t){for(var e=t.getCoordinates(),n=0;n<e.length-1;n++){var o=new jsts.noding.snapround.HotPixel(e[n],this.scaleFactor,this.li),r=this.pointSnapper.snap(o,t,n);r&&t.addIntersection(e[n],n)}},jsts.operation.valid.ConnectedInteriorTester=function(t){this.geomGraph=t,this.geometryFactory=new jsts.geom.GeometryFactory,this.disconnectedRingcoord=null},jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint=function(t,e){var n=0,o=t.length;for(n;o>n;n++)if(!t[n].equals(e))return t[n];return null},jsts.operation.valid.ConnectedInteriorTester.prototype.getCoordinate=function(){return this.disconnectedRingcoord},jsts.operation.valid.ConnectedInteriorTester.prototype.isInteriorsConnected=function(){var t=new javascript.util.ArrayList;this.geomGraph.computeSplitEdges(t);var e=new jsts.geomgraph.PlanarGraph(new jsts.operation.overlay.OverlayNodeFactory);e.addEdges(t),this.setInteriorEdgesInResult(e),e.linkResultDirectedEdges();var n=this.buildEdgeRings(e.getEdgeEnds());return this.visitShellInteriors(this.geomGraph.getGeometry(),e),!this.hasUnvisitedShellEdge(n)},jsts.operation.valid.ConnectedInteriorTester.prototype.setInteriorEdgesInResult=function(t){for(var e,n=t.getEdgeEnds().iterator();n.hasNext();)e=n.next(),e.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR&&e.setInResult(!0)},jsts.operation.valid.ConnectedInteriorTester.prototype.buildEdgeRings=function(t){for(var e=new javascript.util.ArrayList,n=t.iterator();n.hasNext();){var o=n.next();if(o.isInResult()&&null==o.getEdgeRing()){var r=new jsts.operation.overlay.MaximalEdgeRing(o,this.geometryFactory);r.linkDirectedEdgesForMinimalEdgeRings();var i=r.buildMinimalRings(),s=0,a=i.length;for(s;a>s;s++)e.add(i[s])}}return e},jsts.operation.valid.ConnectedInteriorTester.prototype.visitShellInteriors=function(t,e){if(t instanceof jsts.geom.Polygon){var n=t;this.visitInteriorRing(n.getExteriorRing(),e)}if(t instanceof jsts.geom.MultiPolygon)for(var o=t,r=0;r<o.getNumGeometries();r++){var n=o.getGeometryN(r);this.visitInteriorRing(n.getExteriorRing(),e)}},jsts.operation.valid.ConnectedInteriorTester.prototype.visitInteriorRing=function(t,e){var n=t.getCoordinates(),o=n[0],r=jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint(n,o),i=e.findEdgeInSameDirection(o,r),s=e.findEdgeEnd(i),a=null;s.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR?a=s:s.getSym().getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR&&(a=s.getSym()),this.visitLinkedDirectedEdges(a)},jsts.operation.valid.ConnectedInteriorTester.prototype.visitLinkedDirectedEdges=function(t){var e=t,n=t;do n.setVisited(!0),n=n.getNext();while(n!=e)},jsts.operation.valid.ConnectedInteriorTester.prototype.hasUnvisitedShellEdge=function(t){for(var e=0;e<t.size();e++){var n=t.get(e);if(!n.isHole()){var o=n.getEdges(),r=o[0];if(r.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR)for(var i=0;i<o.length;i++)if(r=o[i],!r.isVisited())return disconnectedRingcoord=r.getCoordinate(),!0}}return!1},jsts.algorithm.InteriorPointLine=function(t){this.centroid,this.minDistance=Number.MAX_VALUE,this.interiorPoint=null,this.centroid=t.getCentroid().getCoordinate(),this.addInterior(t),null==this.interiorPoint&&this.addEndpoints(t)},jsts.algorithm.InteriorPointLine.prototype.getInteriorPoint=function(){return this.interiorPoint},jsts.algorithm.InteriorPointLine.prototype.addInterior=function(t){if(t instanceof jsts.geom.LineString)this.addInteriorCoord(t.getCoordinates());else if(t instanceof jsts.geom.GeometryCollection)for(var e=0;e<t.getNumGeometries();e++)this.addInterior(t.getGeometryN(e))},jsts.algorithm.InteriorPointLine.prototype.addInteriorCoord=function(t){for(var e=1;e<t.length-1;e++)this.add(t[e])},jsts.algorithm.InteriorPointLine.prototype.addEndpoints=function(t){if(t instanceof jsts.geom.LineString)this.addEndpointsCoord(t.getCoordinates());else if(t instanceof jsts.geom.GeometryCollection)for(var e=0;e<t.getNumGeometries();e++)this.addEndpoints(t.getGeometryN(e))},jsts.algorithm.InteriorPointLine.prototype.addEndpointsCoord=function(t){this.add(t[0]),this.add(t[t.length-1])},jsts.algorithm.InteriorPointLine.prototype.add=function(t){var e=t.distance(this.centroid);e<this.minDistance&&(this.interiorPoint=new jsts.geom.Coordinate(t),this.minDistance=e)},jsts.index.chain.MonotoneChainSelectAction=function(){this.tempEnv1=new jsts.geom.Envelope,this.selectedSegment=new jsts.geom.LineSegment},jsts.index.chain.MonotoneChainSelectAction.prototype.tempEnv1=null,jsts.index.chain.MonotoneChainSelectAction.prototype.selectedSegment=null,jsts.index.chain.MonotoneChainSelectAction.prototype.select=function(t,e){t.getLineSegment(e,this.selectedSegment),this.select2(this.selectedSegment)},jsts.index.chain.MonotoneChainSelectAction.prototype.select2=function(){},jsts.algorithm.MCPointInRing=function(t){this.ring=t,this.tree=null,this.crossings=0,this.interval=new jsts.index.bintree.Interval,this.buildIndex()},jsts.algorithm.MCPointInRing.MCSelecter=function(t,e){this.parent=e,this.p=t},jsts.algorithm.MCPointInRing.MCSelecter.prototype=new jsts.index.chain.MonotoneChainSelectAction,jsts.algorithm.MCPointInRing.MCSelecter.prototype.constructor=jsts.algorithm.MCPointInRing.MCSelecter,jsts.algorithm.MCPointInRing.MCSelecter.prototype.select2=function(t){this.parent.testLineSegment.apply(this.parent,[this.p,t])},jsts.algorithm.MCPointInRing.prototype.buildIndex=function(){this.tree=new jsts.index.bintree.Bintree;for(var t=jsts.geom.CoordinateArrays.removeRepeatedPoints(this.ring.getCoordinates()),e=jsts.index.chain.MonotoneChainBuilder.getChains(t),n=0;n<e.length;n++){var o=e[n],r=o.getEnvelope();this.interval.min=r.getMinY(),this.interval.max=r.getMaxY(),this.tree.insert(this.interval,o)}},jsts.algorithm.MCPointInRing.prototype.isInside=function(t){this.crossings=0;var e=new jsts.geom.Envelope(-Number.MAX_VALUE,Number.MAX_VALUE,t.y,t.y);this.interval.min=t.y,this.interval.max=t.y;for(var n=this.tree.query(this.interval),o=new jsts.algorithm.MCPointInRing.MCSelecter(t,this),r=n.iterator();r.hasNext();){var i=r.next();this.testMonotoneChain(e,o,i)}return this.crossings%2==1?!0:!1},jsts.algorithm.MCPointInRing.prototype.testMonotoneChain=function(t,e,n){n.select(t,e)},jsts.algorithm.MCPointInRing.prototype.testLineSegment=function(t,e){var n,o,r,i,s,a,u;a=e.p0,u=e.p1,o=a.x-t.x,r=a.y-t.y,i=u.x-t.x,s=u.y-t.y,(r>0&&0>=s||s>0&&0>=r)&&(n=jsts.algorithm.RobustDeterminant.signOfDet2x2(o,r,i,s)/(s-r),n>0&&this.crossings++)},jsts.operation.valid.TopologyValidationError=function(t,e){this.errorType=t,this.pt=null,null!=e&&(this.pt=e.clone())},jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL=2,jsts.operation.valid.TopologyValidationError.NESTED_HOLES=3,jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR=4,jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION=5,jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION=6,jsts.operation.valid.TopologyValidationError.NESTED_SHELLS=7,jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS=8,jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS=9,jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE=10,jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED=11,jsts.operation.valid.TopologyValidationError.prototype.errMsg=["Topology Validation Error","Repeated Point","Hole lies outside shell","Holes are nested","Interior is disconnected","Self-intersection","Ring Self-intersection","Nested shells","Duplicate Rings","Too few distinct points in geometry component","Invalid Coordinate","Ring is not closed"],jsts.operation.valid.TopologyValidationError.prototype.getCoordinate=function(){return this.pt},jsts.operation.valid.TopologyValidationError.prototype.getErrorType=function(){return this.errorType},jsts.operation.valid.TopologyValidationError.prototype.getMessage=function(){return this.errMsg[this.errorType]},jsts.operation.valid.TopologyValidationError.prototype.toString=function(){var t="";return null!=this.pt?(t=" at or near point "+this.pt,this.getMessage()+t):t},function(){jsts.geom.MultiPolygon=function(t,e){this.geometries=t||[],this.factory=e},jsts.geom.MultiPolygon.prototype=new jsts.geom.GeometryCollection,jsts.geom.MultiPolygon.constructor=jsts.geom.MultiPolygon,jsts.geom.MultiPolygon.prototype.getBoundary=function(){if(this.isEmpty())return this.getFactory().createMultiLineString(null);for(var t=[],e=0;e<this.geometries.length;e++)for(var n=this.geometries[e],o=n.getBoundary(),r=0;r<o.getNumGeometries();r++)t.push(o.getGeometryN(r));return this.getFactory().createMultiLineString(t)},jsts.geom.MultiPolygon.prototype.equalsExact=function(t,e){return this.isEquivalentClass(t)?jsts.geom.GeometryCollection.prototype.equalsExact.call(this,t,e):!1},jsts.geom.MultiPolygon.prototype.CLASS_NAME="jsts.geom.MultiPolygon"}(),jsts.geom.CoordinateSequenceFilter=function(){},jsts.geom.CoordinateSequenceFilter.prototype.filter=jsts.abstractFunc,jsts.geom.CoordinateSequenceFilter.prototype.isDone=jsts.abstractFunc,jsts.geom.CoordinateSequenceFilter.prototype.isGeometryChanged=jsts.abstractFunc,function(){var t=function(){if(this.min=0,this.max=0,1===arguments.length){var t=arguments[0];this.init(t.min,t.max)}else 2===arguments.length&&this.init(arguments[0],arguments[1])};t.prototype.init=function(t,e){this.min=t,this.max=e,t>e&&(this.min=e,this.max=t)},t.prototype.getMin=function(){return this.min},t.prototype.getMax=function(){return this.max},t.prototype.getWidth=function(){return this.max-this.min},t.prototype.expandToInclude=function(t){t.max>this.max&&(this.max=t.max),t.min<this.min&&(this.min=t.min)},t.prototype.overlaps=function(){return 1===arguments.length?this.overlapsInterval.apply(this,arguments):this.overlapsMinMax.apply(this,arguments)},t.prototype.overlapsInterval=function(t){return this.overlaps(t.min,t.max)},t.prototype.overlapsMinMax=function(t,e){return this.min>e||this.max<t?!1:!0},t.prototype.contains=function(){var t;return arguments[0]instanceof jsts.index.bintree.Interval?(t=arguments[0],this.containsMinMax(t.min,t.max)):1===arguments.length?this.containsPoint(arguments[0]):this.containsMinMax(arguments[0],arguments[1])},t.prototype.containsMinMax=function(t,e){return t>=this.min&&e<=this.max},t.prototype.containsPoint=function(t){return t>=this.min&&t<=this.max},jsts.index.bintree.Interval=t}(),jsts.index.DoubleBits=function(){},jsts.index.DoubleBits.powerOf2=function(t){return Math.pow(2,t)},jsts.index.DoubleBits.exponent=function(t){return jsts.index.DoubleBits.CVTFWD(64,t)-1023},jsts.index.DoubleBits.CVTFWD=function(t,e){var n,o,r,i,s="",a={32:{d:127,c:128,b:0,a:0},64:{d:32752,c:0,b:0,a:0}},u={32:8,64:11}[t];if(i||(n=0>e||0>1/e,isFinite(e)||(i=a[t],n&&(i.d+=1<<t/4-1),o=Math.pow(2,u)-1,r=0)),!i){for(o={32:127,64:1023}[t],r=Math.abs(e);r>=2;)o++,r/=2;for(;1>r&&o>0;)o--,r*=2;0>=o&&(r/=2,s="Zero or Denormal"),32===t&&o>254&&(s="Too big for Single",i={d:n?255:127,c:128,b:0,a:0},o=Math.pow(2,u)-1,r=0)}return o},function(){var t=jsts.index.DoubleBits,e=jsts.index.bintree.Interval,n=function(t){this.pt=0,this.level=0,this.computeKey(t)};n.computeLevel=function(e){var n,o=e.getWidth();return n=t.exponent(o)+1},n.prototype.getPoint=function(){return this.pt},n.prototype.getLevel=function(){return this.level},n.prototype.getInterval=function(){return this.interval},n.prototype.computeKey=function(t){for(this.level=n.computeLevel(t),this.interval=new e,this.computeInterval(this.level,t);!this.interval.contains(t);)this.level+=1,this.computeInterval(this.level,t)},n.prototype.computeInterval=function(e,n){var o=t.powerOf2(e);this.pt=Math.floor(n.getMin()/o)*o,this.interval.init(this.pt,this.pt+o)},jsts.index.bintree.Key=n}(),jsts.operation.buffer.SubgraphDepthLocater=function(t){this.subgraphs=[],this.seg=new jsts.geom.LineSegment,this.subgraphs=t},jsts.operation.buffer.SubgraphDepthLocater.prototype.subgraphs=null,jsts.operation.buffer.SubgraphDepthLocater.prototype.seg=null,jsts.operation.buffer.SubgraphDepthLocater.prototype.getDepth=function(t){var e=this.findStabbedSegments(t);if(0===e.length)return 0;e.sort();var n=e[0];return n.leftDepth},jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments=function(t){if(3===arguments.length)return void this.findStabbedSegments2.apply(this,arguments);for(var e=[],n=0;n<this.subgraphs.length;n++){var o=this.subgraphs[n],r=o.getEnvelope();
t.y<r.getMinY()||t.y>r.getMaxY()||this.findStabbedSegments2(t,o.getDirectedEdges(),e)}return e},jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments2=function(t,e,n){if(arguments[1]instanceof jsts.geomgraph.DirectedEdge)return void this.findStabbedSegments3(t,e,n);for(var o=e.iterator();o.hasNext();){var r=o.next();r.isForward()&&this.findStabbedSegments3(t,r,n)}},jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments3=function(t,e,n){for(var o=e.getEdge().getCoordinates(),r=0;r<o.length-1;r++){this.seg.p0=o[r],this.seg.p1=o[r+1],this.seg.p0.y>this.seg.p1.y&&this.seg.reverse();var i=Math.max(this.seg.p0.x,this.seg.p1.x);if(!(i<t.x||this.seg.isHorizontal()||t.y<this.seg.p0.y||t.y>this.seg.p1.y||jsts.algorithm.CGAlgorithms.computeOrientation(this.seg.p0,this.seg.p1,t)===jsts.algorithm.CGAlgorithms.RIGHT)){var s=e.getDepth(jsts.geomgraph.Position.LEFT);this.seg.p0.equals(o[r])||(s=e.getDepth(jsts.geomgraph.Position.RIGHT));var a=new jsts.operation.buffer.SubgraphDepthLocater.DepthSegment(this.seg,s);n.push(a)}}},jsts.operation.buffer.SubgraphDepthLocater.DepthSegment=function(t,e){this.upwardSeg=new jsts.geom.LineSegment(t),this.leftDepth=e},jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.upwardSeg=null,jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.leftDepth=null,jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareTo=function(t){var e=t,n=this.upwardSeg.orientationIndex(e.upwardSeg);return 0===n&&(n=-1*e.upwardSeg.orientationIndex(upwardSeg)),0!==n?n:this.compareX(this.upwardSeg,e.upwardSeg)},jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareX=function(t,e){var n=t.p0.compareTo(e.p0);return 0!==n?n:t.p1.compareTo(e.p1)},jsts.noding.snapround.HotPixel=function(t,e,n){this.corner=[],this.originalPt=t,this.pt=t,this.scaleFactor=e,this.li=n,1!==this.scaleFactor&&(this.pt=new jsts.geom.Coordinate(this.scale(t.x),this.scale(t.y)),this.p0Scaled=new jsts.geom.Coordinate,this.p1Scaled=new jsts.geom.Coordinate),this.initCorners(this.pt)},jsts.noding.snapround.HotPixel.prototype.li=null,jsts.noding.snapround.HotPixel.prototype.pt=null,jsts.noding.snapround.HotPixel.prototype.originalPt=null,jsts.noding.snapround.HotPixel.prototype.ptScaled=null,jsts.noding.snapround.HotPixel.prototype.p0Scaled=null,jsts.noding.snapround.HotPixel.prototype.p1Scaled=null,jsts.noding.snapround.HotPixel.prototype.scaleFactor=void 0,jsts.noding.snapround.HotPixel.prototype.minx=void 0,jsts.noding.snapround.HotPixel.prototype.maxx=void 0,jsts.noding.snapround.HotPixel.prototype.miny=void 0,jsts.noding.snapround.HotPixel.prototype.maxy=void 0,jsts.noding.snapround.HotPixel.prototype.corner=null,jsts.noding.snapround.HotPixel.prototype.safeEnv=null,jsts.noding.snapround.HotPixel.prototype.getCoordinate=function(){return this.originalPt},jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR=.75,jsts.noding.snapround.HotPixel.prototype.getSafeEnvelope=function(){if(null===this.safeEnv){var t=jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR/this.scaleFactor;this.safeEnv=new jsts.geom.Envelope(this.originalPt.x-t,this.originalPt.x+t,this.originalPt.y-t,this.originalPt.y+t)}return this.safeEnv},jsts.noding.snapround.HotPixel.prototype.initCorners=function(t){var e=.5;this.minx=t.x-e,this.maxx=t.x+e,this.miny=t.y-e,this.maxy=t.y+e,this.corner[0]=new jsts.geom.Coordinate(this.maxx,this.maxy),this.corner[1]=new jsts.geom.Coordinate(this.minx,this.maxy),this.corner[2]=new jsts.geom.Coordinate(this.minx,this.miny),this.corner[3]=new jsts.geom.Coordinate(this.maxx,this.miny)},jsts.noding.snapround.HotPixel.prototype.scale=function(t){return Math.round(t*this.scaleFactor)},jsts.noding.snapround.HotPixel.prototype.intersects=function(t,e){return 1===this.scaleFactor?this.intersectsScaled(t,e):(this.copyScaled(t,this.p0Scaled),this.copyScaled(e,this.p1Scaled),this.intersectsScaled(this.p0Scaled,this.p1Scaled))},jsts.noding.snapround.HotPixel.prototype.copyScaled=function(t,e){e.x=this.scale(t.x),e.y=this.scale(t.y)},jsts.noding.snapround.HotPixel.prototype.intersectsScaled=function(t,e){var n=Math.min(t.x,e.x),o=Math.max(t.x,e.x),r=Math.min(t.y,e.y),i=Math.max(t.y,e.y),s=this.maxx<n||this.minx>o||this.maxy<r||this.miny>i;if(s)return!1;var a=this.intersectsToleranceSquare(t,e);return jsts.util.Assert.isTrue(!(s&&a),"Found bad envelope test"),a},jsts.noding.snapround.HotPixel.prototype.intersectsToleranceSquare=function(t,e){var n=!1,o=!1;return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.isProper()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.isProper()?!0:(this.li.hasIntersection()&&(n=!0),this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.isProper()?!0:(this.li.hasIntersection()&&(o=!0),this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),this.li.isProper()?!0:n&&o?!0:t.equals(this.pt)?!0:e.equals(this.pt)?!0:!1)))},jsts.noding.snapround.HotPixel.prototype.intersectsPixelClosure=function(t,e){return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),this.li.hasIntersection()?!0:!1)))},jsts.noding.snapround.HotPixel.prototype.addSnappedNode=function(t,e){var n=t.getCoordinate(e),o=t.getCoordinate(e+1);return this.intersects(n,o)?(t.addIntersection(this.getCoordinate(),e),!0):!1},jsts.operation.buffer.BufferInputLineSimplifier=function(t){this.inputLine=t},jsts.operation.buffer.BufferInputLineSimplifier.simplify=function(t,e){var n=new jsts.operation.buffer.BufferInputLineSimplifier(t);return n.simplify(e)},jsts.operation.buffer.BufferInputLineSimplifier.INIT=0,jsts.operation.buffer.BufferInputLineSimplifier.DELETE=1,jsts.operation.buffer.BufferInputLineSimplifier.KEEP=1,jsts.operation.buffer.BufferInputLineSimplifier.prototype.inputLine=null,jsts.operation.buffer.BufferInputLineSimplifier.prototype.distanceTol=null,jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeleted=null,jsts.operation.buffer.BufferInputLineSimplifier.prototype.angleOrientation=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE,jsts.operation.buffer.BufferInputLineSimplifier.prototype.simplify=function(t){this.distanceTol=Math.abs(t),0>t&&(this.angleOrientation=jsts.algorithm.CGAlgorithms.CLOCKWISE),this.isDeleted=[],this.isDeleted.length=this.inputLine.length;var e=!1;do e=this.deleteShallowConcavities();while(e);return this.collapseLine()},jsts.operation.buffer.BufferInputLineSimplifier.prototype.deleteShallowConcavities=function(){for(var t=1,e=(this.inputLine.length-1,this.findNextNonDeletedIndex(t)),n=this.findNextNonDeletedIndex(e),o=!1;n<this.inputLine.length;){var r=!1;this.isDeletable(t,e,n,this.distanceTol)&&(this.isDeleted[e]=jsts.operation.buffer.BufferInputLineSimplifier.DELETE,r=!0,o=!0),t=r?n:e,e=this.findNextNonDeletedIndex(t),n=this.findNextNonDeletedIndex(e)}return o},jsts.operation.buffer.BufferInputLineSimplifier.prototype.findNextNonDeletedIndex=function(t){for(var e=t+1;e<this.inputLine.length&&this.isDeleted[e]===jsts.operation.buffer.BufferInputLineSimplifier.DELETE;)e++;return e},jsts.operation.buffer.BufferInputLineSimplifier.prototype.collapseLine=function(){for(var t=[],e=0;e<this.inputLine.length;e++)this.isDeleted[e]!==jsts.operation.buffer.BufferInputLineSimplifier.DELETE&&t.push(this.inputLine[e]);return t},jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeletable=function(t,e,n,o){var r=this.inputLine[t],i=this.inputLine[e],s=this.inputLine[n];return this.isConcave(r,i,s)&&this.isShallow(r,i,s,o)?this.isShallowSampled(r,i,t,n,o):!1},jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowConcavity=function(t,e,n,o){var r=jsts.algorithm.CGAlgorithms.computeOrientation(t,e,n),i=r===this.angleOrientation;if(!i)return!1;var s=jsts.algorithm.CGAlgorithms.distancePointLine(e,t,n);return o>s},jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK=10,jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowSampled=function(t,e,n,o,r){var i=parseInt((o-n)/jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK);0>=i&&(i=1);for(var s=n;o>s;s+=i)if(!this.isShallow(t,e,this.inputLine[s],r))return!1;return!0},jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallow=function(t,e,n,o){var r=jsts.algorithm.CGAlgorithms.distancePointLine(e,t,n);return o>r},jsts.operation.buffer.BufferInputLineSimplifier.prototype.isConcave=function(t,e,n){var o=jsts.algorithm.CGAlgorithms.computeOrientation(t,e,n),r=o===this.angleOrientation;return r},jsts.geomgraph.index.SweepLineEvent=function(t,e,n){return e instanceof jsts.geomgraph.index.SweepLineEvent?(this.eventType=jsts.geomgraph.index.SweepLineEvent.DELETE,this.xValue=t,void(this.insertEvent=e)):(this.eventType=jsts.geomgraph.index.SweepLineEvent.INSERT,this.label=n,this.xValue=t,void(this.obj=e))},jsts.geomgraph.index.SweepLineEvent.INSERT=1,jsts.geomgraph.index.SweepLineEvent.DELETE=2,jsts.geomgraph.index.SweepLineEvent.prototype.label=null,jsts.geomgraph.index.SweepLineEvent.prototype.xValue=null,jsts.geomgraph.index.SweepLineEvent.prototype.eventType=null,jsts.geomgraph.index.SweepLineEvent.prototype.insertEvent=null,jsts.geomgraph.index.SweepLineEvent.prototype.deleteEventIndex=null,jsts.geomgraph.index.SweepLineEvent.prototype.obj=null,jsts.geomgraph.index.SweepLineEvent.prototype.isInsert=function(){return this.eventType==jsts.geomgraph.index.SweepLineEvent.INSERT},jsts.geomgraph.index.SweepLineEvent.prototype.isDelete=function(){return this.eventType==jsts.geomgraph.index.SweepLineEvent.DELETE},jsts.geomgraph.index.SweepLineEvent.prototype.getInsertEvent=function(){return this.insertEvent},jsts.geomgraph.index.SweepLineEvent.prototype.getDeleteEventIndex=function(){return this.deleteEventIndex},jsts.geomgraph.index.SweepLineEvent.prototype.setDeleteEventIndex=function(t){this.deleteEventIndex=t},jsts.geomgraph.index.SweepLineEvent.prototype.getObject=function(){return this.obj},jsts.geomgraph.index.SweepLineEvent.prototype.isSameLabel=function(t){return null==this.label?!1:this.label==t.label},jsts.geomgraph.index.SweepLineEvent.prototype.compareTo=function(t){return this.xValue<t.xValue?-1:this.xValue>t.xValue?1:this.eventType<t.eventType?-1:this.eventType>t.eventType?1:0},jsts.geom.CoordinateList=function(t,e){this.array=[],e=void 0===e?!0:e,void 0!==t&&this.add(t,e)},jsts.geom.CoordinateList.prototype=new javascript.util.ArrayList,jsts.geom.CoordinateList.prototype.iterator=null,jsts.geom.CoordinateList.prototype.remove=null,jsts.geom.CoordinateList.prototype.get=function(t){return this.array[t]},jsts.geom.CoordinateList.prototype.set=function(t,e){var n=this.array[t];return this.array[t]=e,n},jsts.geom.CoordinateList.prototype.size=function(){return this.array.length},jsts.geom.CoordinateList.prototype.add=function(){return arguments.length>1?this.addCoordinates.apply(this,arguments):this.array.push(arguments[0])},jsts.geom.CoordinateList.prototype.addCoordinates=function(t,e,n){if(t instanceof jsts.geom.Coordinate)return this.addCoordinate.apply(this,arguments);if("number"==typeof t)return this.insertCoordinate.apply(this,arguments);if(n=n||!0)for(var o=0;o<t.length;o++)this.addCoordinate(t[o],e);else for(var o=t.length-1;o>=0;o--)this.addCoordinate(t[o],e);return!0},jsts.geom.CoordinateList.prototype.addCoordinate=function(t,e){if(!e&&this.size()>=1){var n=this.get(this.size()-1);if(n.equals2D(t))return}this.add(t)},jsts.geom.CoordinateList.prototype.insertCoordinate=function(t,e,n){if(!n){var o=t>0?t-1:-1;if(-1!==o&&this.get(o).equals2D(e))return;var r=t<this.size()-1?t+1:-1;if(-1!==r&&this.get(r).equals2D(e))return}this.array.splice(t,0,e)},jsts.geom.CoordinateList.prototype.closeRing=function(){this.size()>0&&this.addCoordinate(new jsts.geom.Coordinate(this.get(0)),!1)},jsts.geom.CoordinateList.prototype.toArray=function(){return this.array},jsts.geom.CoordinateList.prototype.toCoordinateArray=function(){return this.array},jsts.operation.buffer.OffsetSegmentGenerator=function(t,e,n){this.seg0=new jsts.geom.LineSegment,this.seg1=new jsts.geom.LineSegment,this.offset0=new jsts.geom.LineSegment,this.offset1=new jsts.geom.LineSegment,this.precisionModel=t,this.bufParams=e,this.li=new jsts.algorithm.RobustLineIntersector,this.filletAngleQuantum=Math.PI/2/e.getQuadrantSegments(),this.bufParams.getQuadrantSegments()>=8&&this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_ROUND&&(this.closingSegLengthFactor=jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR),this.init(n)},jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR=.001,jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR=.001,jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR=1e-6,jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR=80,jsts.operation.buffer.OffsetSegmentGenerator.prototype.maxCurveSegmentError=0,jsts.operation.buffer.OffsetSegmentGenerator.prototype.filletAngleQuantum=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.closingSegLengthFactor=1,jsts.operation.buffer.OffsetSegmentGenerator.prototype.segList=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.distance=0,jsts.operation.buffer.OffsetSegmentGenerator.prototype.precisionModel=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.bufParams=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.li=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.s0=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.s1=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.s2=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg0=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg1=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset0=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset1=null,jsts.operation.buffer.OffsetSegmentGenerator.prototype.side=0,jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle=!1,jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle=function(){return this.hasNarrowConcaveAngle},jsts.operation.buffer.OffsetSegmentGenerator.prototype.init=function(t){this.distance=t,this.maxCurveSegmentError=this.distance*(1-Math.cos(this.filletAngleQuantum/2)),this.segList=new jsts.operation.buffer.OffsetSegmentString,this.segList.setPrecisionModel(this.precisionModel),this.segList.setMinimumVertexDistance(this.distance*jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.initSideSegments=function(t,e,n){this.s1=t,this.s2=e,this.side=n,this.seg1.setCoordinates(this.s1,this.s2),this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.getCoordinates=function(){return this.segList.getCoordinates()},jsts.operation.buffer.OffsetSegmentGenerator.prototype.closeRing=function(){this.segList.closeRing()},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addSegments=function(t,e){this.segList.addPts(t,e)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFirstSegment=function(){this.segList.addPt(this.offset1.p0)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLastSegment=function(){this.segList.addPt(this.offset1.p1)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addNextSegment=function(t,e){if(this.s0=this.s1,this.s1=this.s2,this.s2=t,this.seg0.setCoordinates(this.s0,this.s1),this.computeOffsetSegment(this.seg0,this.side,this.distance,this.offset0),this.seg1.setCoordinates(this.s1,this.s2),this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1),!this.s1.equals(this.s2)){var n=jsts.algorithm.CGAlgorithms.computeOrientation(this.s0,this.s1,this.s2),o=n===jsts.algorithm.CGAlgorithms.CLOCKWISE&&this.side===jsts.geomgraph.Position.LEFT||n===jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE&&this.side===jsts.geomgraph.Position.RIGHT;0==n?this.addCollinear(e):o?this.addOutsideTurn(n,e):this.addInsideTurn(n,e)}},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addCollinear=function(t){this.li.computeIntersection(this.s0,this.s1,this.s1,this.s2);var e=this.li.getIntersectionNum();e>=2&&(this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_BEVEL||this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_MITRE?(t&&this.segList.addPt(this.offset0.p1),this.segList.addPt(this.offset1.p0)):this.addFillet(this.s1,this.offset0.p1,this.offset1.p0,jsts.algorithm.CGAlgorithms.CLOCKWISE,this.distance))},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addOutsideTurn=function(t,e){return this.offset0.p1.distance(this.offset1.p0)<this.distance*jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR?void this.segList.addPt(this.offset0.p1):void(this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_MITRE?this.addMitreJoin(this.s1,this.offset0,this.offset1,this.distance):this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_BEVEL?this.addBevelJoin(this.offset0,this.offset1):(e&&this.segList.addPt(this.offset0.p1),this.addFillet(this.s1,this.offset0.p1,this.offset1.p0,t,this.distance),this.segList.addPt(this.offset1.p0)))},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addInsideTurn=function(){if(this.li.computeIntersection(this.offset0.p0,this.offset0.p1,this.offset1.p0,this.offset1.p1),this.li.hasIntersection())this.segList.addPt(this.li.getIntersection(0));else if(this.hasNarrowConcaveAngle=!0,this.offset0.p1.distance(this.offset1.p0)<this.distance*jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR)this.segList.addPt(this.offset0.p1);else{if(this.segList.addPt(this.offset0.p1),this.closingSegLengthFactor>0){var t=new jsts.geom.Coordinate((this.closingSegLengthFactor*this.offset0.p1.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset0.p1.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(t);var e=new jsts.geom.Coordinate((this.closingSegLengthFactor*this.offset1.p0.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset1.p0.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(e)}else this.segList.addPt(this.s1);this.segList.addPt(this.offset1.p0)}},jsts.operation.buffer.OffsetSegmentGenerator.prototype.computeOffsetSegment=function(t,e,n,o){var r=e===jsts.geomgraph.Position.LEFT?1:-1,i=t.p1.x-t.p0.x,s=t.p1.y-t.p0.y,a=Math.sqrt(i*i+s*s),u=r*n*i/a,p=r*n*s/a;o.p0.x=t.p0.x-p,o.p0.y=t.p0.y+u,o.p1.x=t.p1.x-p,o.p1.y=t.p1.y+u},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLineEndCap=function(t,e){var n=new jsts.geom.LineSegment(t,e),o=new jsts.geom.LineSegment;this.computeOffsetSegment(n,jsts.geomgraph.Position.LEFT,this.distance,o);var r=new jsts.geom.LineSegment;this.computeOffsetSegment(n,jsts.geomgraph.Position.RIGHT,this.distance,r);var i=e.x-t.x,s=e.y-t.y,a=Math.atan2(s,i);switch(this.bufParams.getEndCapStyle()){case jsts.operation.buffer.BufferParameters.CAP_ROUND:this.segList.addPt(o.p1),this.addFillet(e,a+Math.PI/2,a-Math.PI/2,jsts.algorithm.CGAlgorithms.CLOCKWISE,this.distance),this.segList.addPt(r.p1);break;case jsts.operation.buffer.BufferParameters.CAP_FLAT:this.segList.addPt(o.p1),this.segList.addPt(r.p1);break;case jsts.operation.buffer.BufferParameters.CAP_SQUARE:var u=new jsts.geom.Coordinate;u.x=Math.abs(this.distance)*Math.cos(a),u.y=Math.abs(this.distance)*Math.sin(a);var p=new jsts.geom.Coordinate(o.p1.x+u.x,o.p1.y+u.y),g=new jsts.geom.Coordinate(r.p1.x+u.x,r.p1.y+u.y);this.segList.addPt(p),this.segList.addPt(g)}},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addMitreJoin=function(t,e,n,o){var r=!0,i=null;try{i=jsts.algorithm.HCoordinate.intersection(e.p0,e.p1,n.p0,n.p1);var s=0>=o?1:i.distance(t)/Math.abs(o);s>this.bufParams.getMitreLimit()&&(this.isMitreWithinLimit=!1)}catch(a){a instanceof jsts.error.NotRepresentableError&&(i=new jsts.geom.Coordinate(0,0),this.isMitreWithinLimit=!1)}r?this.segList.addPt(i):this.addLimitedMitreJoin(e,n,o,bufParams.getMitreLimit())},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLimitedMitreJoin=function(t,e,n,o){var r=this.seg0.p1,i=jsts.algorithm.Angle.angle(r,this.seg0.p0),s=(jsts.algorithm.Angle.angle(r,this.seg1.p1),jsts.algorithm.Angle.angleBetweenOriented(this.seg0.p0,r,this.seg1.p1)),a=s/2,u=jsts.algorithm.Angle.normalize(i+a),p=jsts.algorithm.Angle.normalize(u+Math.PI),g=o*n,l=g*Math.abs(Math.sin(a)),h=n-l,d=r.x+g*Math.cos(p),c=r.y+g*Math.sin(p),f=new jsts.geom.Coordinate(d,c),m=new jsts.geom.LineSegment(r,f),y=m.pointAlongOffset(1,h),j=m.pointAlongOffset(1,-h);this.side==jsts.geomgraph.Position.LEFT?(this.segList.addPt(y),this.segList.addPt(j)):(this.segList.addPt(j),this.segList.addPt(y))},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addBevelJoin=function(t,e){this.segList.addPt(t.p1),this.segList.addPt(e.p0)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet=function(t,e,n,o,r){if(!(n instanceof jsts.geom.Coordinate))return void this.addFillet2.apply(this,arguments);var i=e.x-t.x,s=e.y-t.y,a=Math.atan2(s,i),u=n.x-t.x,p=n.y-t.y,g=Math.atan2(p,u);o===jsts.algorithm.CGAlgorithms.CLOCKWISE?g>=a&&(a+=2*Math.PI):a>=g&&(a-=2*Math.PI),this.segList.addPt(e),this.addFillet(t,a,g,o,r),this.segList.addPt(n)},jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet2=function(t,e,n,o,r){var i=o===jsts.algorithm.CGAlgorithms.CLOCKWISE?-1:1,s=Math.abs(e-n),a=parseInt(s/this.filletAngleQuantum+.5);if(!(1>a)){var u,p;u=0,p=s/a;for(var g=u,l=new jsts.geom.Coordinate;s>g;){var h=e+i*g;l.x=t.x+r*Math.cos(h),l.y=t.y+r*Math.sin(h),this.segList.addPt(l),g+=p}}},jsts.operation.buffer.OffsetSegmentGenerator.prototype.createCircle=function(t){var e=new jsts.geom.Coordinate(t.x+this.distance,t.y);this.segList.addPt(e),this.addFillet(t,0,2*Math.PI,-1,this.distance),this.segList.closeRing()},jsts.operation.buffer.OffsetSegmentGenerator.prototype.createSquare=function(t){this.segList.addPt(new jsts.geom.Coordinate(t.x+distance,t.y+distance)),this.segList.addPt(new jsts.geom.Coordinate(t.x+distance,t.y-distance)),this.segList.addPt(new jsts.geom.Coordinate(t.x-distance,t.y-distance)),this.segList.addPt(new jsts.geom.Coordinate(t.x-distance,t.y+distance)),this.segList.closeRing()},jsts.operation.overlay.MaximalEdgeRing=function(t,e){jsts.geomgraph.EdgeRing.call(this,t,e)},jsts.operation.overlay.MaximalEdgeRing.prototype=new jsts.geomgraph.EdgeRing,jsts.operation.overlay.MaximalEdgeRing.constructor=jsts.operation.overlay.MaximalEdgeRing,jsts.operation.overlay.MaximalEdgeRing.prototype.getNext=function(t){return t.getNext()},jsts.operation.overlay.MaximalEdgeRing.prototype.setEdgeRing=function(t,e){t.setEdgeRing(e)},jsts.operation.overlay.MaximalEdgeRing.prototype.linkDirectedEdgesForMinimalEdgeRings=function(){var t=this.startDe;do{var e=t.getNode();e.getEdges().linkMinimalDirectedEdges(this),t=t.getNext()}while(t!=this.startDe)},jsts.operation.overlay.MaximalEdgeRing.prototype.buildMinimalRings=function(){var t=[],e=this.startDe;do{if(null===e.getMinEdgeRing()){var n=new jsts.operation.overlay.MinimalEdgeRing(e,this.geometryFactory);t.push(n)}e=e.getNext()}while(e!=this.startDe);return t},jsts.algorithm.CentroidPoint=function(){this.centSum=new jsts.geom.Coordinate},jsts.algorithm.CentroidPoint.prototype.ptCount=0,jsts.algorithm.CentroidPoint.prototype.centSum=null,jsts.algorithm.CentroidPoint.prototype.add=function(t){if(t instanceof jsts.geom.Point)this.add2(t.getCoordinate());else if(t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.MultiPolygon)for(var e=t,n=0;n<e.getNumGeometries();n++)this.add(e.getGeometryN(n))},jsts.algorithm.CentroidPoint.prototype.add2=function(t){this.ptCount+=1,this.centSum.x+=t.x,this.centSum.y+=t.y},jsts.algorithm.CentroidPoint.prototype.getCentroid=function(){var t=new jsts.geom.Coordinate;return t.x=this.centSum.x/this.ptCount,t.y=this.centSum.y/this.ptCount,t},jsts.operation.distance.ConnectedElementLocationFilter=function(t){this.locations=t},jsts.operation.distance.ConnectedElementLocationFilter.prototype=new jsts.geom.GeometryFilter,jsts.operation.distance.ConnectedElementLocationFilter.prototype.locations=null,jsts.operation.distance.ConnectedElementLocationFilter.getLocations=function(t){var e=[];return t.apply(new jsts.operation.distance.ConnectedElementLocationFilter(e)),e},jsts.operation.distance.ConnectedElementLocationFilter.prototype.filter=function(t){(t instanceof jsts.geom.Point||t instanceof jsts.geom.LineString||t instanceof jsts.geom.Polygon)&&this.locations.push(new jsts.operation.distance.GeometryLocation(t,0,t.getCoordinate()))},jsts.geomgraph.index.MonotoneChainEdge=function(t){this.e=t,this.pts=t.getCoordinates();var e=new jsts.geomgraph.index.MonotoneChainIndexer;this.startIndex=e.getChainStartIndices(this.pts)},jsts.geomgraph.index.MonotoneChainEdge.prototype.e=null,jsts.geomgraph.index.MonotoneChainEdge.prototype.pts=null,jsts.geomgraph.index.MonotoneChainEdge.prototype.startIndex=null,jsts.geomgraph.index.MonotoneChainEdge.prototype.env1=new jsts.geom.Envelope,jsts.geomgraph.index.MonotoneChainEdge.prototype.env2=new jsts.geom.Envelope,jsts.geomgraph.index.MonotoneChainEdge.prototype.getCoordinates=function(){return this.pts},jsts.geomgraph.index.MonotoneChainEdge.prototype.getStartIndexes=function(){return this.startIndex},jsts.geomgraph.index.MonotoneChainEdge.prototype.getMinX=function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return n>e?e:n},jsts.geomgraph.index.MonotoneChainEdge.prototype.getMaxX=function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return e>n?e:n},jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersects=function(t,e){for(var n=0;n<this.startIndex.length-1;n++)for(var o=0;o<t.startIndex.length-1;o++)this.computeIntersectsForChain(n,t,o,e)},jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain=function(t,e,n,o){this.computeIntersectsForChain2(this.startIndex[t],this.startIndex[t+1],e,e.startIndex[n],e.startIndex[n+1],o)},jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain2=function(t,e,n,o,r,i){var s=this.pts[t],a=this.pts[e],u=n.pts[o],p=n.pts[r];if(e-t==1&&r-o==1)return void i.addIntersections(this.e,t,n.e,o);if(this.env1.init(s,a),this.env2.init(u,p),this.env1.intersects(this.env2)){var g=Math.floor((t+e)/2),l=Math.floor((o+r)/2);g>t&&(l>o&&this.computeIntersectsForChain2(t,g,n,o,l,i),r>l&&this.computeIntersectsForChain2(t,g,n,l,r,i)),e>g&&(l>o&&this.computeIntersectsForChain2(g,e,n,o,l,i),r>l&&this.computeIntersectsForChain2(g,e,n,l,r,i))}},function(){var t=javascript.util.ArrayList;jsts.operation.relate.EdgeEndBuilder=function(){},jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds=function(e){if(2==arguments.length)return void this.computeEdgeEnds2.apply(this,arguments);for(var n=new t,o=e;o.hasNext();){var r=o.next();this.computeEdgeEnds2(r,n)}return n},jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds2=function(t,e){var n=t.getEdgeIntersectionList();n.addEndpoints();var o=n.iterator(),r=null,i=null;if(o.hasNext()){var s=o.next();do r=i,i=s,s=null,o.hasNext()&&(s=o.next()),null!==i&&(this.createEdgeEndForPrev(t,e,i,r),this.createEdgeEndForNext(t,e,i,s));while(null!==i)}},jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForPrev=function(t,e,n,o){var r=n.segmentIndex;if(0===n.dist){if(0===r)return;r--}var i=t.getCoordinate(r);null!==o&&o.segmentIndex>=r&&(i=o.coord);var s=new jsts.geomgraph.Label(t.getLabel());s.flip();var a=new jsts.geomgraph.EdgeEnd(t,n.coord,i,s);e.add(a)},jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForNext=function(t,e,n,o){var r=n.segmentIndex+1;if(!(r>=t.getNumPoints()&&null===o)){var i=t.getCoordinate(r);null!==o&&o.segmentIndex===n.segmentIndex&&(i=o.coord);var s=new jsts.geomgraph.EdgeEnd(t,n.coord,i,new jsts.geomgraph.Label(t.getLabel()));e.add(s)}}}(),function(){var t=javascript.util.ArrayList,e=javascript.util.TreeSet,n=jsts.geom.CoordinateFilter;jsts.util.UniqueCoordinateArrayFilter=function(){this.treeSet=new e,this.list=new t},jsts.util.UniqueCoordinateArrayFilter.prototype=new n,jsts.util.UniqueCoordinateArrayFilter.prototype.treeSet=null,jsts.util.UniqueCoordinateArrayFilter.prototype.list=null,jsts.util.UniqueCoordinateArrayFilter.prototype.getCoordinates=function(){return this.list.toArray()},jsts.util.UniqueCoordinateArrayFilter.prototype.filter=function(t){this.treeSet.contains(t)||(this.list.add(t),this.treeSet.add(t))}}(),function(){var t=jsts.algorithm.CGAlgorithms,e=jsts.util.UniqueCoordinateArrayFilter,n=jsts.util.Assert,o=javascript.util.Stack,r=javascript.util.ArrayList,i=javascript.util.Arrays,s=function(t){this.origin=t};s.prototype.origin=null,s.prototype.compare=function(t,e){var n=t,o=e;return s.polarCompare(this.origin,n,o)},s.polarCompare=function(e,n,o){var r=n.x-e.x,i=n.y-e.y,s=o.x-e.x,a=o.y-e.y,u=t.computeOrientation(e,n,o);if(u==t.COUNTERCLOCKWISE)return 1;if(u==t.CLOCKWISE)return-1;var p=r*r+i*i,g=s*s+a*a;return g>p?-1:p>g?1:0},jsts.algorithm.ConvexHull=function(){if(1===arguments.length){var t=arguments[0];this.inputPts=jsts.algorithm.ConvexHull.extractCoordinates(t),this.geomFactory=t.getFactory()}else this.pts=arguments[0],this.geomFactory=arguments[1]},jsts.algorithm.ConvexHull.prototype.geomFactory=null,jsts.algorithm.ConvexHull.prototype.inputPts=null,jsts.algorithm.ConvexHull.extractCoordinates=function(t){var n=new e;return t.apply(n),n.getCoordinates()},jsts.algorithm.ConvexHull.prototype.getConvexHull=function(){if(0==this.inputPts.length)return this.geomFactory.createGeometryCollection(null);if(1==this.inputPts.length)return this.geomFactory.createPoint(this.inputPts[0]);if(2==this.inputPts.length)return this.geomFactory.createLineString(this.inputPts);var t=this.inputPts;this.inputPts.length>50&&(t=this.reduce(this.inputPts));var e=this.preSort(t),n=this.grahamScan(e),o=n.toArray();return this.lineOrPolygon(o)},jsts.algorithm.ConvexHull.prototype.reduce=function(e){var n=this.computeOctRing(e);if(null==n)return this.inputPts;for(var o=new javascript.util.TreeSet,r=0;r<n.length;r++)o.add(n[r]);for(var r=0;r<e.length;r++)t.isPointInRing(e[r],n)||o.add(e[r]);var i=o.toArray();return i.length<3?this.padArray3(i):i},jsts.algorithm.ConvexHull.prototype.padArray3=function(t){for(var e=[],n=0;n<e.length;n++)e[n]=n<t.length?t[n]:t[0];return e},jsts.algorithm.ConvexHull.prototype.preSort=function(t){for(var e,n=1;n<t.length;n++)(t[n].y<t[0].y||t[n].y==t[0].y&&t[n].x<t[0].x)&&(e=t[0],t[0]=t[n],t[n]=e);return i.sort(t,1,t.length,new s(t[0])),t},jsts.algorithm.ConvexHull.prototype.grahamScan=function(e){var n,r=new o;n=r.push(e[0]),n=r.push(e[1]),n=r.push(e[2]);for(var i=3;i<e.length;i++){for(n=r.pop();!r.empty()&&t.computeOrientation(r.peek(),n,e[i])>0;)n=r.pop();n=r.push(n),n=r.push(e[i])}return n=r.push(e[0]),r},jsts.algorithm.ConvexHull.prototype.isBetween=function(e,n,o){if(0!==t.computeOrientation(e,n,o))return!1;if(e.x!=o.x){if(e.x<=n.x&&n.x<=o.x)return!0;if(o.x<=n.x&&n.x<=e.x)return!0}if(e.y!=o.y){if(e.y<=n.y&&n.y<=o.y)return!0;if(o.y<=n.y&&n.y<=e.y)return!0}return!1},jsts.algorithm.ConvexHull.prototype.computeOctRing=function(t){var e=this.computeOctPts(t),n=new jsts.geom.CoordinateList;return n.add(e,!1),n.size()<3?null:(n.closeRing(),n.toCoordinateArray())},jsts.algorithm.ConvexHull.prototype.computeOctPts=function(t){for(var e=[],n=0;8>n;n++)e[n]=t[0];for(var o=1;o<t.length;o++)t[o].x<e[0].x&&(e[0]=t[o]),t[o].x-t[o].y<e[1].x-e[1].y&&(e[1]=t[o]),t[o].y>e[2].y&&(e[2]=t[o]),t[o].x+t[o].y>e[3].x+e[3].y&&(e[3]=t[o]),t[o].x>e[4].x&&(e[4]=t[o]),t[o].x-t[o].y>e[5].x-e[5].y&&(e[5]=t[o]),t[o].y<e[6].y&&(e[6]=t[o]),t[o].x+t[o].y<e[7].x+e[7].y&&(e[7]=t[o]);
return e},jsts.algorithm.ConvexHull.prototype.lineOrPolygon=function(t){if(t=this.cleanRing(t),3==t.length)return this.geomFactory.createLineString([t[0],t[1]]);var e=this.geomFactory.createLinearRing(t);return this.geomFactory.createPolygon(e,null)},jsts.algorithm.ConvexHull.prototype.cleanRing=function(t){n.equals(t[0],t[t.length-1]);for(var e=new r,o=null,i=0;i<=t.length-2;i++){var s=t[i],a=t[i+1];s.equals(a)||null!=o&&this.isBetween(o,s,a)||(e.add(s),o=s)}e.add(t[t.length-1]);var u=[];return e.toArray(u)}}(),jsts.algorithm.MinimumDiameter=function(t,e){this.convexHullPts=null,this.minBaseSeg=new jsts.geom.LineSegment,this.minWidthPt=null,this.minPtIndex=0,this.minWidth=0,jsts.algorithm.MinimumDiameter.inputGeom=t,jsts.algorithm.MinimumDiameter.isConvex=e||!1},jsts.algorithm.MinimumDiameter.inputGeom=null,jsts.algorithm.MinimumDiameter.isConvex=!1,jsts.algorithm.MinimumDiameter.nextIndex=function(t,e){return e++,e>=t.length&&(e=0),e},jsts.algorithm.MinimumDiameter.computeC=function(t,e,n){return t*n.y-e*n.x},jsts.algorithm.MinimumDiameter.computeSegmentForLine=function(t,e,n){var o,r;return Math.abs(e)>Math.abs(t)?(o=new jsts.geom.Coordinate(0,n/e),r=new jsts.geom.Coordinate(1,n/e-t/e)):(o=new jsts.geom.Coordinate(n/t,0),r=new jsts.geom.Coordinate(n/t-e/t,1)),new jsts.geom.LineSegment(o,r)},jsts.algorithm.MinimumDiameter.prototype.getLength=function(){return this.computeMinimumDiameter(),this.minWidth},jsts.algorithm.MinimumDiameter.prototype.getWidthCoordinate=function(){return this.computeMinimumDiameter(),this.minWidthPt},jsts.algorithm.MinimumDiameter.prototype.getSupportingSegment=function(){this.computeMinimumDiameter();var t=[this.minBaseSeg.p0,this.minBaseSeg.p1];return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString(t)},jsts.algorithm.MinimumDiameter.prototype.getDiameter=function(){if(this.computeMinimumDiameter(),null===this.minWidthPt)return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString(null);var t=this.minBaseSeg.project(this.minWidthPt);return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString([t,this.minWidthPt])},jsts.algorithm.MinimumDiameter.prototype.computeMinimumDiameter=function(){if(null===this.minWidthPt)if(jsts.algorithm.MinimumDiameter.isConvex)this.computeWidthConvex(jsts.algorithm.MinimumDiameter.inputGeom);else{var t=new jsts.algorithm.ConvexHull(jsts.algorithm.MinimumDiameter.inputGeom).getConvexHull();this.computeWidthConvex(t)}},jsts.algorithm.MinimumDiameter.prototype.computeWidthConvex=function(t){this.convexHullPts=t instanceof jsts.geom.Polygon?t.getExteriorRing().getCoordinates():t.getCoordinates(),0===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=null,this.minBaseSeg=null):1===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[0]):2===this.convexHullPts.length||3===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[1]):this.computeConvexRingMinDiameter(this.convexHullPts)},jsts.algorithm.MinimumDiameter.prototype.computeConvexRingMinDiameter=function(t){this.minWidth=Number.MAX_VALUE;for(var e=1,n=new jsts.geom.LineSegment,o=0;o<t.length-1;o++)n.p0=t[o],n.p1=t[o+1],e=this.findMaxPerpDistance(t,n,e)},jsts.algorithm.MinimumDiameter.prototype.findMaxPerpDistance=function(t,e,n){for(var o=e.distancePerpendicular(t[n]),r=o,i=n,s=i;r>=o;)o=r,i=s,s=jsts.algorithm.MinimumDiameter.nextIndex(t,i),r=e.distancePerpendicular(t[s]);return o<this.minWidth&&(this.minPtIndex=i,this.minWidth=o,this.minWidthPt=t[this.minPtIndex],this.minBaseSeg=new jsts.geom.LineSegment(e)),i},jsts.algorithm.MinimumDiameter.prototype.getMinimumRectangle=function(){if(this.computeMinimumDiameter(),0===this.minWidth)return this.minBaseSeg.p0.equals2D(this.minBaseSeg.p1)?jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createPoint(this.minBaseSeg.p0):this.minBaseSeg.toGeometry(jsts.algorithm.MinimumDiameter.inputGeom.getFactory());for(var t=this.minBaseSeg.p1.x-this.minBaseSeg.p0.x,e=this.minBaseSeg.p1.y-this.minBaseSeg.p0.y,n=Number.MAX_VALUE,o=-Number.MAX_VALUE,r=Number.MAX_VALUE,i=-Number.MAX_VALUE,s=0;s<this.convexHullPts.length;s++){var a=jsts.algorithm.MinimumDiameter.computeC(t,e,this.convexHullPts[s]);a>o&&(o=a),n>a&&(n=a);var u=jsts.algorithm.MinimumDiameter.computeC(-e,t,this.convexHullPts[s]);u>i&&(i=u),r>u&&(r=u)}var p=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-t,-e,i),g=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-t,-e,r),l=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-e,t,o),h=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-e,t,n),d=l.lineIntersection(p),c=h.lineIntersection(p),f=h.lineIntersection(g),m=l.lineIntersection(g),y=jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLinearRing([d,c,f,m,d]);return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createPolygon(y,null)},function(){jsts.io.GeoJSONParser=function(t){this.geometryFactory=t||new jsts.geom.GeometryFactory,this.geometryTypes=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"]},jsts.io.GeoJSONParser.prototype.read=function(t){var e;e="string"==typeof t?JSON.parse(t):t;var n=e.type;if(!this.parse[n])throw new Error("Unknown GeoJSON type: "+e.type);return-1!=this.geometryTypes.indexOf(n)?this.parse[n].apply(this,[e.coordinates]):"GeometryCollection"===n?this.parse[n].apply(this,[e.geometries]):this.parse[n].apply(this,[e])},jsts.io.GeoJSONParser.prototype.parse={Feature:function(t){var e={};for(var n in t)e[n]=t[n];if(t.geometry){var o=t.geometry.type;if(!this.parse[o])throw new Error("Unknown GeoJSON type: "+t.type);e.geometry=this.read(t.geometry)}return t.bbox&&(e.bbox=this.parse.bbox.apply(this,[t.bbox])),e},FeatureCollection:function(t){var e={};if(t.features){e.features=[];for(var n=0;n<t.features.length;++n)e.features.push(this.read(t.features[n]))}return t.bbox&&(e.bbox=this.parse.bbox.apply(this,[t.bbox])),e},coordinates:function(t){for(var e=[],n=0;n<t.length;++n){var o=t[n];e.push(new jsts.geom.Coordinate(o[0],o[1]))}return e},bbox:function(t){return this.geometryFactory.createLinearRing([new jsts.geom.Coordinate(t[0],t[1]),new jsts.geom.Coordinate(t[2],t[1]),new jsts.geom.Coordinate(t[2],t[3]),new jsts.geom.Coordinate(t[0],t[3]),new jsts.geom.Coordinate(t[0],t[1])])},Point:function(t){var e=new jsts.geom.Coordinate(t[0],t[1]);return this.geometryFactory.createPoint(e)},MultiPoint:function(t){for(var e=[],n=0;n<t.length;++n)e.push(this.parse.Point.apply(this,[t[n]]));return this.geometryFactory.createMultiPoint(e)},LineString:function(t){var e=this.parse.coordinates.apply(this,[t]);return this.geometryFactory.createLineString(e)},MultiLineString:function(t){for(var e=[],n=0;n<t.length;++n)e.push(this.parse.LineString.apply(this,[t[n]]));return this.geometryFactory.createMultiLineString(e)},Polygon:function(t){for(var e=this.parse.coordinates.apply(this,[t[0]]),n=this.geometryFactory.createLinearRing(e),o=[],r=1;r<t.length;++r){var i=t[r],s=this.parse.coordinates.apply(this,[i]),a=this.geometryFactory.createLinearRing(s);o.push(a)}return this.geometryFactory.createPolygon(n,o)},MultiPolygon:function(t){for(var e=[],n=0;n<t.length;++n){var o=t[n];e.push(this.parse.Polygon.apply(this,[o]))}return this.geometryFactory.createMultiPolygon(e)},GeometryCollection:function(t){for(var e=[],n=0;n<t.length;++n){var o=t[n];e.push(this.read(o))}return this.geometryFactory.createGeometryCollection(e)}},jsts.io.GeoJSONParser.prototype.write=function(t){var e=t.CLASS_NAME.slice(10);if(!this.extract[e])throw new Error("Geometry is not supported");return this.extract[e].apply(this,[t])},jsts.io.GeoJSONParser.prototype.extract={coordinate:function(t){return[t.x,t.y]},Point:function(t){var e=this.extract.coordinate.apply(this,[t.coordinate]);return{type:"Point",coordinates:e}},MultiPoint:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var o=t.geometries[n],r=this.extract.Point.apply(this,[o]);e.push(r.coordinates)}return{type:"MultiPoint",coordinates:e}},LineString:function(t){for(var e=[],n=0;n<t.points.length;++n){var o=t.points[n];e.push(this.extract.coordinate.apply(this,[o]))}return{type:"LineString",coordinates:e}},MultiLineString:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var o=t.geometries[n],r=this.extract.LineString.apply(this,[o]);e.push(r.coordinates)}return{type:"MultiLineString",coordinates:e}},Polygon:function(t){var e=[],n=this.extract.LineString.apply(this,[t.shell]);e.push(n.coordinates);for(var o=0;o<t.holes.length;++o){var r=t.holes[o],i=this.extract.LineString.apply(this,[r]);e.push(i.coordinates)}return{type:"Polygon",coordinates:e}},MultiPolygon:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var o=t.geometries[n],r=this.extract.Polygon.apply(this,[o]);e.push(r.coordinates)}return{type:"MultiPolygon",coordinates:e}},GeometryCollection:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var o=t.geometries[n],r=o.CLASS_NAME.slice(10);e.push(this.extract[r].apply(this,[o]))}return{type:"GeometryCollection",geometries:e}}}}(),jsts.triangulate.quadedge.Vertex=function(){1===arguments.length?this.initFromCoordinate(arguments[0]):this.initFromXY(arguments[0],arguments[1])},jsts.triangulate.quadedge.Vertex.LEFT=0,jsts.triangulate.quadedge.Vertex.RIGHT=1,jsts.triangulate.quadedge.Vertex.BEYOND=2,jsts.triangulate.quadedge.Vertex.BEHIND=3,jsts.triangulate.quadedge.Vertex.BETWEEN=4,jsts.triangulate.quadedge.Vertex.ORIGIN=5,jsts.triangulate.quadedge.Vertex.DESTINATION=6,jsts.triangulate.quadedge.Vertex.prototype.initFromXY=function(t,e){this.p=new jsts.geom.Coordinate(t,e)},jsts.triangulate.quadedge.Vertex.prototype.initFromCoordinate=function(t){this.p=new jsts.geom.Coordinate(t)},jsts.triangulate.quadedge.Vertex.prototype.getX=function(){return this.p.x},jsts.triangulate.quadedge.Vertex.prototype.getY=function(){return this.p.y},jsts.triangulate.quadedge.Vertex.prototype.getZ=function(){return this.p.z},jsts.triangulate.quadedge.Vertex.prototype.setZ=function(t){this.p.z=t},jsts.triangulate.quadedge.Vertex.prototype.getCoordinate=function(){return this.p},jsts.triangulate.quadedge.Vertex.prototype.toString=function(){return"POINT ("+this.p.x+" "+this.p.y+")"},jsts.triangulate.quadedge.Vertex.prototype.equals=function(){return 1===arguments.length?this.equalsExact(arguments[0]):this.equalsWithTolerance(arguments[0],arguments[1])},jsts.triangulate.quadedge.Vertex.prototype.equalsExact=function(t){return this.p.x===t.getX()&&this.p.y===t.getY()},jsts.triangulate.quadedge.Vertex.prototype.equalsWithTolerance=function(t,e){return this.p.distance(t.getCoordinate())<e},jsts.triangulate.quadedge.Vertex.prototype.classify=function(t,e){var n,o,r,i;return n=this,o=e.sub(t),r=n.sub(t),i=o.crossProduct(r),i>0?jsts.triangulate.quadedge.Vertex.LEFT:0>i?jsts.triangulate.quadedge.Vertex.RIGHT:o.getX()*r.getX()<0||o.getY()*r.getY()<0?jsts.triangulate.quadedge.Vertex.BEHIND:o.magn()<r.magn()?jsts.triangulate.quadedge.Vertex.BEYOND:t.equals(n)?jsts.triangulate.quadedge.Vertex.ORIGIN:e.equals(n)?jsts.triangulate.quadedge.Vertex.DESTINATION:jsts.triangulate.quadedge.Vertex.BETWEEN},jsts.triangulate.quadedge.Vertex.prototype.crossProduct=function(t){return this.p.x*t.getY()-this.p.y*t.getX()},jsts.triangulate.quadedge.Vertex.prototype.dot=function(t){return this.p.x*t.getX()+this.p.y*t.getY()},jsts.triangulate.quadedge.Vertex.prototype.times=function(t){return new jsts.triangulate.quadedge.Vertex(t*this.p.x,t*this.p.y)},jsts.triangulate.quadedge.Vertex.prototype.sum=function(t){return new jsts.triangulate.quadedge.Vertex(this.p.x+t.getX(),this.p.y+t.getY())},jsts.triangulate.quadedge.Vertex.prototype.sub=function(t){return new jsts.triangulate.quadedge.Vertex(this.p.x-t.getX(),this.p.y-t.getY())},jsts.triangulate.quadedge.Vertex.prototype.magn=function(){return Math.sqrt(this.p.x*this.p.x+this.p.y*this.p.y)},jsts.triangulate.quadedge.Vertex.prototype.cross=function(){return new Vertex(this.p.y,-this.p.x)},jsts.triangulate.quadedge.Vertex.prototype.isInCircle=function(t,e,n){return jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust(t.p,e.p,n.p,this.p)},jsts.triangulate.quadedge.Vertex.prototype.isCCW=function(t,e){return(t.p.x-this.p.x)*(e.p.y-this.p.y)-(t.p.y-this.p.y)*(e.p.x-this.p.x)>0},jsts.triangulate.quadedge.Vertex.prototype.rightOf=function(t){return this.isCCW(t.dest(),t.orig())},jsts.triangulate.quadedge.Vertex.prototype.leftOf=function(t){return this.isCCW(t.orig(),t.dest())},jsts.triangulate.quadedge.Vertex.prototype.bisector=function(t,e){var n,o,r,i;return n=e.getX()-t.getX(),o=e.getY()-t.getY(),r=new jsts.algorithm.HCoordinate(t.getX()+n/2,t.getY()+o/2,1),i=new jsts.algorithm.HCoordinate(t.getX()-o+n/2,t.getY()+n+o/2,1),new jsts.algorithm.HCoordinate(r,i)},jsts.triangulate.quadedge.Vertex.prototype.distance=function(t,e){return t.p.distance(e.p)},jsts.triangulate.quadedge.Vertex.prototype.circumRadiusRatio=function(t,e){var n,o,r,i;return n=this.circleCenter(t,e),o=this.distance(n,t),r=this.distance(this,t),i=this.distance(t,e),r>i&&(r=i),i=this.distance(e,this),r>i&&(r=i),o/r},jsts.triangulate.quadedge.Vertex.prototype.midPoint=function(t){var e,n;return e=(this.p.x+t.getX())/2,n=(this.p.y+t.getY())/2,new jsts.triangulate.quadedge.Vertex(e,n)},jsts.triangulate.quadedge.Vertex.prototype.circleCenter=function(t,e){var n,o,r,i,s;n=new jsts.triangulate.quadedge.Vertex(this.getX(),this.getY()),o=this.bisector(n,t),r=this.bisector(t,e),i=new jsts.algorithm.HCoordinate(o,r),s=null;try{s=new jsts.triangulate.quadedge.Vertex(i.getX(),i.getY())}catch(a){}return s},jsts.operation.valid.IsValidOp=function(t){this.parentGeometry=t,this.isSelfTouchingRingFormingHoleValid=!1,this.validErr=null},jsts.operation.valid.IsValidOp.isValid=function(t){if(arguments[0]instanceof jsts.geom.Coordinate)return isNaN(t.x)?!1:isFinite(t.x)||isNaN(t.x)?isNaN(t.y)?!1:isFinite(t.y)||isNaN(t.y)?!0:!1:!1;var e=new jsts.operation.valid.IsValidOp(t);return e.isValid()},jsts.operation.valid.IsValidOp.findPtNotNode=function(t,e,n){for(var o=n.findEdge(e),r=o.getEdgeIntersectionList(),i=0;i<t.length;i++){var s=t[i];if(!r.isIntersection(s))return s}return null},jsts.operation.valid.IsValidOp.prototype.setSelfTouchingRingFormingHoleValid=function(t){this.isSelfTouchingRingFormingHoleValid=t},jsts.operation.valid.IsValidOp.prototype.isValid=function(){return this.checkValid(this.parentGeometry),null==this.validErr},jsts.operation.valid.IsValidOp.prototype.getValidationError=function(){return this.checkValid(this.parentGeometry),this.validErr},jsts.operation.valid.IsValidOp.prototype.checkValid=function(t){if(this.validErr=null,!t.isEmpty())if(t instanceof jsts.geom.Point)this.checkValidPoint(t);else if(t instanceof jsts.geom.MultiPoint)this.checkValidMultiPoint(t);else if(t instanceof jsts.geom.LinearRing)this.checkValidLinearRing(t);else if(t instanceof jsts.geom.LineString)this.checkValidLineString(t);else if(t instanceof jsts.geom.Polygon)this.checkValidPolygon(t);else if(t instanceof jsts.geom.MultiPolygon)this.checkValidMultiPolygon(t);else{if(!(t instanceof jsts.geom.GeometryCollection))throw t.constructor;this.checkValidGeometryCollection(t)}},jsts.operation.valid.IsValidOp.prototype.checkValidPoint=function(t){this.checkInvalidCoordinates(t.getCoordinates())},jsts.operation.valid.IsValidOp.prototype.checkValidMultiPoint=function(t){this.checkInvalidCoordinates(t.getCoordinates())},jsts.operation.valid.IsValidOp.prototype.checkValidLineString=function(t){if(this.checkInvalidCoordinates(t.getCoordinates()),null==this.validErr){var e=new jsts.geomgraph.GeometryGraph(0,t);this.checkTooFewPoints(e)}},jsts.operation.valid.IsValidOp.prototype.checkValidLinearRing=function(t){if(this.checkInvalidCoordinates(t.getCoordinates()),null==this.validErr&&(this.checkClosedRing(t),null==this.validErr)){var e=new jsts.geomgraph.GeometryGraph(0,t);if(this.checkTooFewPoints(e),null==this.validErr){var n=new jsts.algorithm.RobustLineIntersector;e.computeSelfNodes(n,!0),this.checkNoSelfIntersectingRings(e)}}},jsts.operation.valid.IsValidOp.prototype.checkValidPolygon=function(t){if(this.checkInvalidCoordinates(t),null==this.validErr&&(this.checkClosedRings(t),null==this.validErr)){var e=new jsts.geomgraph.GeometryGraph(0,t);this.checkTooFewPoints(e),null==this.validErr&&(this.checkConsistentArea(e),null==this.validErr&&(this.isSelfTouchingRingFormingHoleValid||(this.checkNoSelfIntersectingRings(e),null==this.validErr))&&(this.checkHolesInShell(t,e),null==this.validErr&&(this.checkHolesNotNested(t,e),null==this.validErr&&this.checkConnectedInteriors(e))))}},jsts.operation.valid.IsValidOp.prototype.checkValidMultiPolygon=function(t){for(var e=t.getNumGeometries(),n=0;e>n;n++){var o=t.getGeometryN(n);if(this.checkInvalidCoordinates(o),null!=this.validErr)return;if(this.checkClosedRings(o),null!=this.validErr)return}var r=new jsts.geomgraph.GeometryGraph(0,t);if(this.checkTooFewPoints(r),null==this.validErr&&(this.checkConsistentArea(r),null==this.validErr&&(this.isSelfTouchingRingFormingHoleValid||(this.checkNoSelfIntersectingRings(r),null==this.validErr)))){for(var n=0;n<t.getNumGeometries();n++){var o=t.getGeometryN(n);if(this.checkHolesInShell(o,r),null!=this.validErr)return}for(var n=0;n<t.getNumGeometries();n++){var o=t.getGeometryN(n);if(this.checkHolesNotNested(o,r),null!=this.validErr)return}this.checkShellsNotNested(t,r),null==this.validErr&&this.checkConnectedInteriors(r)}},jsts.operation.valid.IsValidOp.prototype.checkValidGeometryCollection=function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(this.checkValid(n),null!=this.validErr)return}},jsts.operation.valid.IsValidOp.prototype.checkInvalidCoordinates=function(t){if(t instanceof jsts.geom.Polygon){var e=t;if(this.checkInvalidCoordinates(e.getExteriorRing().getCoordinates()),null!=this.validErr)return;for(var n=0;n<e.getNumInteriorRing();n++)if(this.checkInvalidCoordinates(e.getInteriorRingN(n).getCoordinates()),null!=this.validErr)return}else for(var o=t,n=0;n<o.length;n++)if(!jsts.operation.valid.IsValidOp.isValid(o[n]))return void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE,o[n]))},jsts.operation.valid.IsValidOp.prototype.checkClosedRings=function(t){if(this.checkClosedRing(t.getExteriorRing()),null==this.validErr)for(var e=0;e<t.getNumInteriorRing();e++)if(this.checkClosedRing(t.getInteriorRingN(e)),null!=this.validErr)return},jsts.operation.valid.IsValidOp.prototype.checkClosedRing=function(t){if(!t.isClosed()){var e=null;t.getNumPoints()>=1&&(e=t.getCoordinateN(0)),this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED,e)}},jsts.operation.valid.IsValidOp.prototype.checkTooFewPoints=function(t){return t.hasTooFewPoints?void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS,t.getInvalidPoint())):void 0},jsts.operation.valid.IsValidOp.prototype.checkConsistentArea=function(t){var e=new jsts.operation.valid.ConsistentAreaTester(t),n=e.isNodeConsistentArea();return n?void(e.hasDuplicateRings()&&(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS,e.getInvalidPoint()))):void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION,e.getInvalidPoint()))},jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRings=function(t){for(var e=t.getEdgeIterator();e.hasNext();){var n=e.next();if(this.checkNoSelfIntersectingRing(n.getEdgeIntersectionList()),null!=this.validErr)return}},jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRing=function(t){for(var e=[],n=!0,o=t.iterator();o.hasNext();){var r=o.next();if(n)n=!1;else{if(e.indexOf(r.coord)>=0)return void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION,r.coord));e.push(r.coord)}}},jsts.operation.valid.IsValidOp.prototype.checkHolesInShell=function(t,e){for(var n=t.getExteriorRing(),o=new jsts.algorithm.MCPointInRing(n),r=0;r<t.getNumInteriorRing();r++){var i=t.getInteriorRingN(r),s=jsts.operation.valid.IsValidOp.findPtNotNode(i.getCoordinates(),n,e);if(null==s)return;var a=!o.isInside(s);if(a)return void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL,s))}},jsts.operation.valid.IsValidOp.prototype.checkHolesNotNested=function(t,e){for(var n=new jsts.operation.valid.IndexedNestedRingTester(e),o=0;o<t.getNumInteriorRing();o++){var r=t.getInteriorRingN(o);n.add(r)}var i=n.isNonNested();i||(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_HOLES,n.getNestedPoint()))},jsts.operation.valid.IsValidOp.prototype.checkShellsNotNested=function(t,e){for(var n=0;n<t.getNumGeometries();n++)for(var o=t.getGeometryN(n),r=o.getExteriorRing(),i=0;i<t.getNumGeometries();i++)if(n!=i){var s=t.getGeometryN(i);if(this.checkShellNotNested(r,s,e),null!=this.validErr)return}},jsts.operation.valid.IsValidOp.prototype.checkShellNotNested=function(t,e,n){var o=t.getCoordinates(),r=e.getExteriorRing(),i=r.getCoordinates(),s=jsts.operation.valid.IsValidOp.findPtNotNode(o,r,n);if(null!=s){var a=jsts.algorithm.CGAlgorithms.isPointInRing(s,i);if(a){if(e.getNumInteriorRing()<=0)return void(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_SHELLS,s));for(var u=null,p=0;p<e.getNumInteriorRing();p++){var g=e.getInteriorRingN(p);if(u=this.checkShellInsideHole(t,g,n),null==u)return}this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_SHELLS,u)}}},jsts.operation.valid.IsValidOp.prototype.checkShellInsideHole=function(t,e,n){var o=t.getCoordinates(),r=e.getCoordinates(),i=jsts.operation.valid.IsValidOp.findPtNotNode(o,e,n);if(null!=i){var s=jsts.algorithm.CGAlgorithms.isPointInRing(i,r);if(!s)return i}var a=jsts.operation.valid.IsValidOp.findPtNotNode(r,t,n);if(null!=a){var u=jsts.algorithm.CGAlgorithms.isPointInRing(a,o);return u?a:null}return jsts.util.Assert.shouldNeverReachHere("points in shell and hole appear to be equal"),null},jsts.operation.valid.IsValidOp.prototype.checkConnectedInteriors=function(t){var e=new jsts.operation.valid.ConnectedInteriorTester(t);e.isInteriorsConnected()||(this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR,e.getCoordinate()))},jsts.algorithm.RobustDeterminant=function(){},jsts.algorithm.RobustDeterminant.signOfDet2x2=function(t,e,n,o){var r,i,s,a;if(a=0,r=1,0===t||0===o)return 0===e||0===n?0:e>0?n>0?-r:r:n>0?r:-r;if(0===e||0===n)return o>0?t>0?r:-r:t>0?-r:r;if(e>0?o>0?e>o&&(r=-r,i=t,t=n,n=i,i=e,e=o,o=i):-o>=e?(r=-r,n=-n,o=-o):(i=t,t=-n,n=i,i=e,e=-o,o=i):o>0?o>=-e?(r=-r,t=-t,e=-e):(i=-t,t=n,n=i,i=-e,e=o,o=i):e>=o?(t=-t,e=-e,n=-n,o=-o):(r=-r,i=-t,t=-n,n=i,i=-e,e=-o,o=i),t>0){if(!(n>0))return r;if(t>n)return r}else{if(n>0)return-r;if(!(t>=n))return-r;r=-r,t=-t,n=-n}for(;;){if(a+=1,s=Math.floor(n/t),n-=s*t,o-=s*e,0>o)return-r;if(o>e)return r;if(t>n+n){if(o+o>e)return r}else{if(e>o+o)return-r;n=t-n,o=e-o,r=-r}if(0===o)return 0===n?0:-r;if(0===n)return r;if(s=Math.floor(t/n),t-=s*n,e-=s*o,0>e)return r;if(e>o)return-r;if(n>t+t){if(e+e>o)return-r}else{if(o>e+e)return r;t=n-t,e=o-e,r=-r}if(0===e)return 0===t?0:r;if(0===t)return-r}},jsts.algorithm.RobustDeterminant.orientationIndex=function(t,e,n){var o=e.x-t.x,r=e.y-t.y,i=n.x-e.x,s=n.y-e.y;return jsts.algorithm.RobustDeterminant.signOfDet2x2(o,r,i,s)},jsts.index.quadtree.NodeBase=function(){this.subnode=new Array(4),this.subnode[0]=null,this.subnode[1]=null,this.subnode[2]=null,this.subnode[3]=null,this.items=[]},jsts.index.quadtree.NodeBase.prototype.getSubnodeIndex=function(t,e){var n=-1;return t.getMinX()>=e.x&&(t.getMinY()>=e.y&&(n=3),t.getMaxY()<=e.y&&(n=1)),t.getMaxX()<=e.x&&(t.getMinY()>=e.y&&(n=2),t.getMaxY()<=e.y&&(n=0)),n},jsts.index.quadtree.NodeBase.prototype.getItems=function(){return this.items},jsts.index.quadtree.NodeBase.prototype.hasItems=function(){return this.items.length>0},jsts.index.quadtree.NodeBase.prototype.add=function(t){this.items.push(t)},jsts.index.quadtree.NodeBase.prototype.remove=function(t,e){if(!this.isSearchMatch(t))return!1;var n=!1,o=0;for(o;4>o;o++)if(null!==this.subnode[o]&&(n=this.subnode[o].remove(t,e))){this.subnode[o].isPrunable()&&(this.subnode[o]=null);break}if(n)return n;if(-1!==this.items.indexOf(e)){for(var o=this.items.length-1;o>=0;o--)this.items[o]===e&&this.items.splice(o,1);n=!0}return n},jsts.index.quadtree.NodeBase.prototype.isPrunable=function(){return!(this.hasChildren()||this.hasItems())},jsts.index.quadtree.NodeBase.prototype.hasChildren=function(){var t=0;for(t;4>t;t++)if(null!==this.subnode[t])return!0;return!1},jsts.index.quadtree.NodeBase.prototype.isEmpty=function(){var t=!0;this.items.length>0&&(t=!1);var e=0;for(e;4>e;e++)null!==this.subnode[e]&&(this.subnode[e].isEmpty()||(t=!1));return t},jsts.index.quadtree.NodeBase.prototype.addAllItems=function(t){t=t.concat(this.items);var e=0;for(e;4>e;e++)null!==this.subnode[e]&&(t=this.subnode[e].addAllItems(t));return t},jsts.index.quadtree.NodeBase.prototype.addAllItemsFromOverlapping=function(t,e){if(this.isSearchMatch(t)){e=e.concat(this.items);var n=0;for(n;4>n;n++)null!==this.subnode[n]&&(e=this.subnode[n].addAllItemsFromOverlapping(t,e))}},jsts.index.quadtree.NodeBase.prototype.visit=function(t,e){if(this.isSearchMatch(t)){this.visitItems(t,e);var n=0;for(n;4>n;n++)null!==this.subnode[n]&&this.subnode[n].visit(t,e)}},jsts.index.quadtree.NodeBase.prototype.visitItems=function(t,e){var n=0,o=this.items.length;for(n;o>n;n++)e.visitItem(this.items[n])},jsts.index.quadtree.NodeBase.prototype.depth=function(){var t,e=0,n=0;for(n;4>n;n++)null!==this.subnode[n]&&(t=this.subnode[n].depth(),t>e&&(e=t));return e+1},jsts.index.quadtree.NodeBase.prototype.size=function(){var t=0,e=0;for(e;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.length},jsts.index.quadtree.NodeBase.prototype.getNodeCount=function(){var t=0,e=0;for(e;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+1},jsts.index.quadtree.Node=function(t,e){jsts.index.quadtree.NodeBase.prototype.constructor.apply(this,arguments),this.env=t,this.level=e,this.centre=new jsts.geom.Coordinate,this.centre.x=(t.getMinX()+t.getMaxX())/2,this.centre.y=(t.getMinY()+t.getMaxY())/2},jsts.index.quadtree.Node.prototype=new jsts.index.quadtree.NodeBase,jsts.index.quadtree.Node.createNode=function(t){var e,n;return e=new jsts.index.quadtree.Key(t),n=new jsts.index.quadtree.Node(e.getEnvelope(),e.getLevel())},jsts.index.quadtree.Node.createExpanded=function(t,e){var n,o=new jsts.geom.Envelope(e);return null!==t&&o.expandToInclude(t.env),n=jsts.index.quadtree.Node.createNode(o),null!==t&&n.insertNode(t),n},jsts.index.quadtree.Node.prototype.getEnvelope=function(){return this.env},jsts.index.quadtree.Node.prototype.isSearchMatch=function(t){return this.env.intersects(t)},jsts.index.quadtree.Node.prototype.getNode=function(t){var e,n=this.getSubnodeIndex(t,this.centre);return-1!==n?(e=this.getSubnode(n),e.getNode(t)):this},jsts.index.quadtree.Node.prototype.find=function(t){var e,n=this.getSubnodeIndex(t,this.centre);return-1===n?this:null!==this.subnode[n]?(e=this.subnode[n],e.find(t)):this},jsts.index.quadtree.Node.prototype.insertNode=function(t){var e,n=this.getSubnodeIndex(t.env,this.centre);t.level===this.level-1?this.subnode[n]=t:(e=this.createSubnode(n),e.insertNode(t),this.subnode[n]=e)},jsts.index.quadtree.Node.prototype.getSubnode=function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},jsts.index.quadtree.Node.prototype.createSubnode=function(t){var e,n,o=0,r=0,i=0,s=0;switch(t){case 0:o=this.env.getMinX(),r=this.centre.x,i=this.env.getMinY(),s=this.centre.y;break;case 1:o=this.centre.x,r=this.env.getMaxX(),i=this.env.getMinY(),s=this.centre.y;break;case 2:o=this.env.getMinX(),r=this.centre.x,i=this.centre.y,s=this.env.getMaxY();break;case 3:o=this.centre.x,r=this.env.getMaxX(),i=this.centre.y,s=this.env.getMaxY()}return e=new jsts.geom.Envelope(o,r,i,s),n=new jsts.index.quadtree.Node(e,this.level-1)},function(){jsts.triangulate.quadedge.QuadEdge=function(){this.rot=null,this.vertex=null,this.next=null,this.data=null};var t=jsts.triangulate.quadedge.QuadEdge;jsts.triangulate.quadedge.QuadEdge.makeEdge=function(e,n){var o,r,i,s,a;return o=new t,r=new t,i=new t,s=new t,o.rot=r,r.rot=i,i.rot=s,s.rot=o,o.setNext(o),r.setNext(s),i.setNext(i),s.setNext(r),a=o,a.setOrig(e),a.setDest(n),a},jsts.triangulate.quadedge.QuadEdge.connect=function(e,n){var o=t.makeEdge(e.dest(),n.orig());return t.splice(o,e.lNext()),t.splice(o.sym(),n),o},jsts.triangulate.quadedge.QuadEdge.splice=function(t,e){var n,o,r,i,s,a;n=t.oNext().rot,o=e.oNext().rot,r=e.oNext(),i=t.oNext(),s=o.oNext(),a=n.oNext(),t.setNext(r),e.setNext(i),n.setNext(s),o.setNext(a)},jsts.triangulate.quadedge.QuadEdge.swap=function(e){var n,o;n=e.oPrev(),o=e.sym().oPrev(),t.splice(e,n),t.splice(e.sym(),o),t.splice(e,n.lNext()),t.splice(e.sym(),o.lNext()),e.setOrig(n.dest()),e.setDest(o.dest())},jsts.triangulate.quadedge.QuadEdge.prototype.getPrimary=function(){return this.orig().getCoordinate().compareTo(this.dest().getCoordinate())<=0?this:this.sym()},jsts.triangulate.quadedge.QuadEdge.prototype.setData=function(t){this.data=t},jsts.triangulate.quadedge.QuadEdge.prototype.getData=function(){return this.data},jsts.triangulate.quadedge.QuadEdge.prototype.delete_jsts=function(){this.rot=null},jsts.triangulate.quadedge.QuadEdge.prototype.isLive=function(){return null!==this.rot},jsts.triangulate.quadedge.QuadEdge.prototype.setNext=function(t){this.next=t},jsts.triangulate.quadedge.QuadEdge.prototype.invRot=function(){return this.rot.sym()},jsts.triangulate.quadedge.QuadEdge.prototype.sym=function(){return this.rot.rot},jsts.triangulate.quadedge.QuadEdge.prototype.oNext=function(){return this.next},jsts.triangulate.quadedge.QuadEdge.prototype.oPrev=function(){return this.rot.next.rot},jsts.triangulate.quadedge.QuadEdge.prototype.dNext=function(){return this.sym().oNext().sym()},jsts.triangulate.quadedge.QuadEdge.prototype.dPrev=function(){return this.invRot().oNext().invRot()},jsts.triangulate.quadedge.QuadEdge.prototype.lNext=function(){return this.invRot().oNext().rot},jsts.triangulate.quadedge.QuadEdge.prototype.lPrev=function(){return this.next.sym()},jsts.triangulate.quadedge.QuadEdge.prototype.rNext=function(){return this.rot.next.invRot()},jsts.triangulate.quadedge.QuadEdge.prototype.rPrev=function(){return this.sym().oNext()},jsts.triangulate.quadedge.QuadEdge.prototype.setOrig=function(t){this.vertex=t},jsts.triangulate.quadedge.QuadEdge.prototype.setDest=function(t){this.sym().setOrig(t)},jsts.triangulate.quadedge.QuadEdge.prototype.orig=function(){return this.vertex},jsts.triangulate.quadedge.QuadEdge.prototype.dest=function(){return this.sym().orig()},jsts.triangulate.quadedge.QuadEdge.prototype.getLength=function(){return this.orig().getCoordinate().distance(dest().getCoordinate())},jsts.triangulate.quadedge.QuadEdge.prototype.equalsNonOriented=function(t){return this.equalsOriented(t)?!0:this.equalsOriented(t.sym())?!0:!1},jsts.triangulate.quadedge.QuadEdge.prototype.equalsOriented=function(t){return this.orig().getCoordinate().equals2D(t.orig().getCoordinate())&&this.dest().getCoordinate().equals2D(t.dest().getCoordinate())?!0:!1},jsts.triangulate.quadedge.QuadEdge.prototype.toLineSegment=function(){return new jsts.geom.LineSegment(this.vertex.getCoordinate(),this.dest().getCoordinate())
},jsts.triangulate.quadedge.QuadEdge.prototype.toString=function(){var t,e;return t=this.vertex.getCoordinate(),e=this.dest().getCoordinate(),jsts.io.WKTWriter.toLineString(t,e)}}(),function(){var t=jsts.util.Assert;jsts.geomgraph.EdgeEnd=function(t,e,n,o){this.edge=t,e&&n&&this.init(e,n),o&&(this.label=o||null)},jsts.geomgraph.EdgeEnd.prototype.edge=null,jsts.geomgraph.EdgeEnd.prototype.label=null,jsts.geomgraph.EdgeEnd.prototype.node=null,jsts.geomgraph.EdgeEnd.prototype.p0=null,jsts.geomgraph.EdgeEnd.prototype.p1=null,jsts.geomgraph.EdgeEnd.prototype.dx=null,jsts.geomgraph.EdgeEnd.prototype.dy=null,jsts.geomgraph.EdgeEnd.prototype.quadrant=null,jsts.geomgraph.EdgeEnd.prototype.init=function(e,n){this.p0=e,this.p1=n,this.dx=n.x-e.x,this.dy=n.y-e.y,this.quadrant=jsts.geomgraph.Quadrant.quadrant(this.dx,this.dy),t.isTrue(!(0===this.dx&&0===this.dy),"EdgeEnd with identical endpoints found")},jsts.geomgraph.EdgeEnd.prototype.getEdge=function(){return this.edge},jsts.geomgraph.EdgeEnd.prototype.getLabel=function(){return this.label},jsts.geomgraph.EdgeEnd.prototype.getCoordinate=function(){return this.p0},jsts.geomgraph.EdgeEnd.prototype.getDirectedCoordinate=function(){return this.p1},jsts.geomgraph.EdgeEnd.prototype.getQuadrant=function(){return this.quadrant},jsts.geomgraph.EdgeEnd.prototype.getDx=function(){return this.dx},jsts.geomgraph.EdgeEnd.prototype.getDy=function(){return this.dy},jsts.geomgraph.EdgeEnd.prototype.setNode=function(t){this.node=t},jsts.geomgraph.EdgeEnd.prototype.getNode=function(){return this.node},jsts.geomgraph.EdgeEnd.prototype.compareTo=function(t){return this.compareDirection(t)},jsts.geomgraph.EdgeEnd.prototype.compareDirection=function(t){return this.dx===t.dx&&this.dy===t.dy?0:this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:jsts.algorithm.CGAlgorithms.computeOrientation(t.p0,t.p1,this.p1)},jsts.geomgraph.EdgeEnd.prototype.computeLabel=function(){}}(),jsts.operation.buffer.RightmostEdgeFinder=function(){},jsts.operation.buffer.RightmostEdgeFinder.prototype.minIndex=-1,jsts.operation.buffer.RightmostEdgeFinder.prototype.minCoord=null,jsts.operation.buffer.RightmostEdgeFinder.prototype.minDe=null,jsts.operation.buffer.RightmostEdgeFinder.prototype.orientedDe=null,jsts.operation.buffer.RightmostEdgeFinder.prototype.getEdge=function(){return this.orientedDe},jsts.operation.buffer.RightmostEdgeFinder.prototype.getCoordinate=function(){return this.minCoord},jsts.operation.buffer.RightmostEdgeFinder.prototype.findEdge=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.isForward()&&this.checkForRightmostCoordinate(n)}jsts.util.Assert.isTrue(0!==this.minIndex||this.minCoord.equals(this.minDe.getCoordinate()),"inconsistency in rightmost processing"),0===this.minIndex?this.findRightmostEdgeAtNode():this.findRightmostEdgeAtVertex(),this.orientedDe=this.minDe;var o=this.getRightmostSide(this.minDe,this.minIndex);o==jsts.geomgraph.Position.LEFT&&(this.orientedDe=this.minDe.getSym())},jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtNode=function(){var t=this.minDe.getNode(),e=t.getEdges();this.minDe=e.getRightmostEdge(),this.minDe.isForward()||(this.minDe=this.minDe.getSym(),this.minIndex=this.minDe.getEdge().getCoordinates().length-1)},jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtVertex=function(){var t=this.minDe.getEdge().getCoordinates();jsts.util.Assert.isTrue(this.minIndex>0&&this.minIndex<t.length,"rightmost point expected to be interior vertex of edge");var e=t[this.minIndex-1],n=t[this.minIndex+1],o=jsts.algorithm.CGAlgorithms.computeOrientation(this.minCoord,n,e),r=!1;e.y<this.minCoord.y&&n.y<this.minCoord.y&&o===jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE?r=!0:e.y>this.minCoord.y&&n.y>this.minCoord.y&&o===jsts.algorithm.CGAlgorithms.CLOCKWISE&&(r=!0),r&&(this.minIndex=this.minIndex-1)},jsts.operation.buffer.RightmostEdgeFinder.prototype.checkForRightmostCoordinate=function(t){for(var e=t.getEdge().getCoordinates(),n=0;n<e.length-1;n++)(null===this.minCoord||e[n].x>this.minCoord.x)&&(this.minDe=t,this.minIndex=n,this.minCoord=e[n])},jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSide=function(t,e){var n=this.getRightmostSideOfSegment(t,e);return 0>n&&(n=this.getRightmostSideOfSegment(t,e-1)),0>n&&(this.minCoord=null,this.checkForRightmostCoordinate(t)),n},jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSideOfSegment=function(t,e){var n=t.getEdge(),o=n.getCoordinates();if(0>e||e+1>=o.length)return-1;if(o[e].y==o[e+1].y)return-1;var r=jsts.geomgraph.Position.LEFT;return o[e].y<o[e+1].y&&(r=jsts.geomgraph.Position.RIGHT),r},function(){jsts.triangulate.IncrementalDelaunayTriangulator=function(t){this.subdiv=t,this.isUsingTolerance=t.getTolerance()>0},jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSites=function(t){var e,n=0,o=t.length;for(n;o>n;n++)e=t[n],this.insertSite(e)},jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSite=function(t){var e,n,o,r;if(e=this.subdiv.locate(t),this.subdiv.isVertexOfEdge(e,t))return e;this.subdiv.isOnEdge(e,t.getCoordinate())&&(e=e.oPrev(),this.subdiv.delete_jsts(e.oNext())),n=this.subdiv.makeEdge(e.orig(),t),jsts.triangulate.quadedge.QuadEdge.splice(n,e),o=n;do n=this.subdiv.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!=o);for(;;)if(r=e.oPrev(),r.dest().rightOf(e)&&t.isInCircle(e.orig(),r.dest(),e.dest()))jsts.triangulate.quadedge.QuadEdge.swap(e),e=e.oPrev();else{if(e.oNext()==o)return n;e=e.oNext().lPrev()}}}(),jsts.algorithm.CentroidArea=function(){this.basePt=null,this.triangleCent3=new jsts.geom.Coordinate,this.centSum=new jsts.geom.Coordinate,this.cg3=new jsts.geom.Coordinate},jsts.algorithm.CentroidArea.prototype.basePt=null,jsts.algorithm.CentroidArea.prototype.triangleCent3=null,jsts.algorithm.CentroidArea.prototype.areasum2=0,jsts.algorithm.CentroidArea.prototype.cg3=null,jsts.algorithm.CentroidArea.prototype.centSum=null,jsts.algorithm.CentroidArea.prototype.totalLength=0,jsts.algorithm.CentroidArea.prototype.add=function(t){if(t instanceof jsts.geom.Polygon){var e=t;this.setBasePoint(e.getExteriorRing().getCoordinateN(0)),this.add3(e)}else if(t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPolygon)for(var n=t,o=0;o<n.getNumGeometries();o++)this.add(n.getGeometryN(o));else t instanceof Array&&this.add2(t)},jsts.algorithm.CentroidArea.prototype.add2=function(t){this.setBasePoint(t[0]),this.addShell(t)},jsts.algorithm.CentroidArea.prototype.getCentroid=function(){var t=new jsts.geom.Coordinate;return Math.abs(this.areasum2)>0?(t.x=this.cg3.x/3/this.areasum2,t.y=this.cg3.y/3/this.areasum2):(t.x=this.centSum.x/this.totalLength,t.y=this.centSum.y/this.totalLength),t},jsts.algorithm.CentroidArea.prototype.setBasePoint=function(t){null==this.basePt&&(this.basePt=t)},jsts.algorithm.CentroidArea.prototype.add3=function(t){this.addShell(t.getExteriorRing().getCoordinates());for(var e=0;e<t.getNumInteriorRing();e++)this.addHole(t.getInteriorRingN(e).getCoordinates())},jsts.algorithm.CentroidArea.prototype.addShell=function(t){for(var e=!jsts.algorithm.CGAlgorithms.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.basePt,t[n],t[n+1],e);this.addLinearSegments(t)},jsts.algorithm.CentroidArea.prototype.addHole=function(t){for(var e=jsts.algorithm.CGAlgorithms.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.basePt,t[n],t[n+1],e);this.addLinearSegments(t)},jsts.algorithm.CentroidArea.prototype.addTriangle=function(t,e,n,o){var r=o?1:-1;jsts.algorithm.CentroidArea.centroid3(t,e,n,this.triangleCent3);var i=jsts.algorithm.CentroidArea.area2(t,e,n);this.cg3.x+=r*i*this.triangleCent3.x,this.cg3.y+=r*i*this.triangleCent3.y,this.areasum2+=r*i},jsts.algorithm.CentroidArea.centroid3=function(t,e,n,o){o.x=t.x+e.x+n.x,o.y=t.y+e.y+n.y},jsts.algorithm.CentroidArea.area2=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(n.x-t.x)*(e.y-t.y)},jsts.algorithm.CentroidArea.prototype.addLinearSegments=function(t){for(var e=0;e<t.length-1;e++){var n=t[e].distance(t[e+1]);this.totalLength+=n;var o=(t[e].x+t[e+1].x)/2;this.centSum.x+=n*o;var r=(t[e].y+t[e+1].y)/2;this.centSum.y+=n*r}},jsts.geomgraph.index.SweepLineSegment=function(t,e){this.edge=t,this.ptIndex=e,this.pts=t.getCoordinates()},jsts.geomgraph.index.SweepLineSegment.prototype.edge=null,jsts.geomgraph.index.SweepLineSegment.prototype.pts=null,jsts.geomgraph.index.SweepLineSegment.prototype.ptIndex=null,jsts.geomgraph.index.SweepLineSegment.prototype.getMinX=function(){var t=this.pts[this.ptIndex].x,e=this.pts[this.ptIndex+1].x;return e>t?t:e},jsts.geomgraph.index.SweepLineSegment.prototype.getMaxX=function(){var t=this.pts[this.ptIndex].x,e=this.pts[this.ptIndex+1].x;return t>e?t:e},jsts.geomgraph.index.SweepLineSegment.prototype.computeIntersections=function(t,e){e.addIntersections(this.edge,this.ptIndex,t.edge,t.ptIndex)},jsts.index.quadtree.Root=function(){jsts.index.quadtree.NodeBase.prototype.constructor.apply(this,arguments),this.origin=new jsts.geom.Coordinate(0,0)},jsts.index.quadtree.Root.prototype=new jsts.index.quadtree.NodeBase,jsts.index.quadtree.Root.prototype.insert=function(t,e){var n=this.getSubnodeIndex(t,this.origin);if(-1===n)return void this.add(e);var o=this.subnode[n];if(null===o||!o.getEnvelope().contains(t)){var r=jsts.index.quadtree.Node.createExpanded(o,t);this.subnode[n]=r}this.insertContained(this.subnode[n],t,e)},jsts.index.quadtree.Root.prototype.insertContained=function(t,e,n){var o,r,i;o=jsts.index.IntervalSize.isZeroWidth(e.getMinX(),e.getMaxX()),r=jsts.index.IntervalSize.isZeroWidth(e.getMinY(),e.getMaxY()),i=o||r?t.find(e):t.getNode(e),i.add(n)},jsts.index.quadtree.Root.prototype.isSearchMatch=function(){return!0},jsts.geomgraph.index.MonotoneChainIndexer=function(){},jsts.geomgraph.index.MonotoneChainIndexer.toIntArray=function(t){for(var e=[],n=t.iterator();n.hasNext();){var o=n.next();e.push(o)}return e},jsts.geomgraph.index.MonotoneChainIndexer.prototype.getChainStartIndices=function(t){var e=0,n=new javascript.util.ArrayList;n.add(e);do{var o=this.findChainEnd(t,e);n.add(o),e=o}while(e<t.length-1);var r=jsts.geomgraph.index.MonotoneChainIndexer.toIntArray(n);return r},jsts.geomgraph.index.MonotoneChainIndexer.prototype.findChainEnd=function(t,e){for(var n=jsts.geomgraph.Quadrant.quadrant(t[e],t[e+1]),o=e+1;o<t.length;){var r=jsts.geomgraph.Quadrant.quadrant(t[o-1],t[o]);if(r!=n)break;o++}return o-1},jsts.noding.IntersectionAdder=function(t){this.li=t},jsts.noding.IntersectionAdder.prototype=new jsts.noding.SegmentIntersector,jsts.noding.IntersectionAdder.constructor=jsts.noding.IntersectionAdder,jsts.noding.IntersectionAdder.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},jsts.noding.IntersectionAdder.prototype._hasIntersection=!1,jsts.noding.IntersectionAdder.prototype.hasProper=!1,jsts.noding.IntersectionAdder.prototype.hasProperInterior=!1,jsts.noding.IntersectionAdder.prototype.hasInterior=!1,jsts.noding.IntersectionAdder.prototype.properIntersectionPoint=null,jsts.noding.IntersectionAdder.prototype.li=null,jsts.noding.IntersectionAdder.prototype.isSelfIntersection=null,jsts.noding.IntersectionAdder.prototype.numIntersections=0,jsts.noding.IntersectionAdder.prototype.numInteriorIntersections=0,jsts.noding.IntersectionAdder.prototype.numProperIntersections=0,jsts.noding.IntersectionAdder.prototype.numTests=0,jsts.noding.IntersectionAdder.prototype.getLineIntersector=function(){return this.li},jsts.noding.IntersectionAdder.prototype.getProperIntersectionPoint=function(){return this.properIntersectionPoint},jsts.noding.IntersectionAdder.prototype.hasIntersection=function(){return this._hasIntersection},jsts.noding.IntersectionAdder.prototype.hasProperIntersection=function(){return this.hasProper},jsts.noding.IntersectionAdder.prototype.hasProperInteriorIntersection=function(){return this.hasProperInterior},jsts.noding.IntersectionAdder.prototype.hasInteriorIntersection=function(){return this.hasInterior},jsts.noding.IntersectionAdder.prototype.isTrivialIntersection=function(t,e,n,o){if(t==n&&1==this.li.getIntersectionNum()){if(jsts.noding.IntersectionAdder.isAdjacentSegments(e,o))return!0;if(t.isClosed()){var r=t.size()-1;if(0===e&&o===r||0===o&&e===r)return!0}}return!1},jsts.noding.IntersectionAdder.prototype.processIntersections=function(t,e,n,o){if(t!==n||e!==o){this.numTests++;var r=t.getCoordinates()[e],i=t.getCoordinates()[e+1],s=n.getCoordinates()[o],a=n.getCoordinates()[o+1];this.li.computeIntersection(r,i,s,a),this.li.hasIntersection()&&(this.numIntersections++,this.li.isInteriorIntersection()&&(this.numInteriorIntersections++,this.hasInterior=!0),this.isTrivialIntersection(t,e,n,o)||(this._hasIntersection=!0,t.addIntersections(this.li,e,0),n.addIntersections(this.li,o,1),this.li.isProper()&&(this.numProperIntersections++,this.hasProper=!0,this.hasProperInterior=!0)))}},jsts.noding.IntersectionAdder.prototype.isDone=function(){return!1},jsts.operation.union.CascadedPolygonUnion=function(t){this.inputPolys=t},jsts.operation.union.CascadedPolygonUnion.union=function(t){var e=new jsts.operation.union.CascadedPolygonUnion(t);return e.union()},jsts.operation.union.CascadedPolygonUnion.prototype.inputPolys,jsts.operation.union.CascadedPolygonUnion.prototype.geomFactory=null,jsts.operation.union.CascadedPolygonUnion.prototype.STRTREE_NODE_CAPACITY=4,jsts.operation.union.CascadedPolygonUnion.prototype.union=function(){if(0===this.inputPolys.length)return null;this.geomFactory=this.inputPolys[0].getFactory();for(var t=new jsts.index.strtree.STRtree(this.STRTREE_NODE_CAPACITY),e=0,n=this.inputPolys.length;n>e;e++){var o=this.inputPolys[e];t.insert(o.getEnvelopeInternal(),o)}var r=t.itemsTree(),i=this.unionTree(r);return i},jsts.operation.union.CascadedPolygonUnion.prototype.unionTree=function(t){var e=this.reduceToGeometries(t),n=this.binaryUnion(e);return n},jsts.operation.union.CascadedPolygonUnion.prototype.binaryUnion=function(t,e,n){if(e=e||0,n=n||t.length,1>=n-e){var o=this.getGeometry(t,e);return this.unionSafe(o,null)}if(n-e===2)return this.unionSafe(this.getGeometry(t,e),this.getGeometry(t,e+1));var r=parseInt((n+e)/2),o=this.binaryUnion(t,e,r),i=this.binaryUnion(t,r,n);return this.unionSafe(o,i)},jsts.operation.union.CascadedPolygonUnion.prototype.getGeometry=function(t,e){return e>=t.length?null:t[e]},jsts.operation.union.CascadedPolygonUnion.prototype.reduceToGeometries=function(t){for(var e=[],n=0,o=t.length;o>n;n++){var r=t[n],i=null;r instanceof Array?i=this.unionTree(r):r instanceof jsts.geom.Geometry&&(i=r),e.push(i)}return e},jsts.operation.union.CascadedPolygonUnion.prototype.unionSafe=function(t,e){return null===t&&null===e?null:null===t?e.clone():null===e?t.clone():this.unionOptimized(t,e)},jsts.operation.union.CascadedPolygonUnion.prototype.unionOptimized=function(t,e){var n=t.getEnvelopeInternal(),o=e.getEnvelopeInternal();if(!n.intersects(o)){var r=jsts.geom.util.GeometryCombiner.combine(t,e);return r}if(t.getNumGeometries<=1&&e.getNumGeometries<=1)return this.unionActual(t,e);var i=n.intersection(o);return this.unionUsingEnvelopeIntersection(t,e,i)},jsts.operation.union.CascadedPolygonUnion.prototype.unionUsingEnvelopeIntersection=function(t,e,n){var o=new javascript.util.ArrayList,r=this.extractByEnvelope(n,t,o),i=this.extractByEnvelope(n,e,o),s=this.unionActual(r,i);o.add(s);var a=jsts.geom.util.GeometryCombiner.combine(o);return a},jsts.operation.union.CascadedPolygonUnion.prototype.extractByEnvelope=function(t,e,n){for(var o=new javascript.util.ArrayList,r=0;r<e.getNumGeometries();r++){var i=e.getGeometryN(r);i.getEnvelopeInternal().intersects(t)?o.add(i):n.add(i)}return this.geomFactory.buildGeometry(o)},jsts.operation.union.CascadedPolygonUnion.prototype.unionActual=function(t,e){return t.union(e)},function(){jsts.geom.MultiPoint=function(t,e){this.geometries=t||[],this.factory=e},jsts.geom.MultiPoint.prototype=new jsts.geom.GeometryCollection,jsts.geom.MultiPoint.constructor=jsts.geom.MultiPoint,jsts.geom.MultiPoint.prototype.getBoundary=function(){return this.getFactory().createGeometryCollection(null)},jsts.geom.MultiPoint.prototype.getGeometryN=function(t){return this.geometries[t]},jsts.geom.MultiPoint.prototype.equalsExact=function(t,e){return this.isEquivalentClass(t)?jsts.geom.GeometryCollection.prototype.equalsExact.call(this,t,e):!1},jsts.geom.MultiPoint.prototype.CLASS_NAME="jsts.geom.MultiPoint"}(),jsts.operation.buffer.OffsetCurveBuilder=function(t,e){this.precisionModel=t,this.bufParams=e},jsts.operation.buffer.OffsetCurveBuilder.prototype.distance=0,jsts.operation.buffer.OffsetCurveBuilder.prototype.precisionModel=null,jsts.operation.buffer.OffsetCurveBuilder.prototype.bufParams=null,jsts.operation.buffer.OffsetCurveBuilder.prototype.getBufferParameters=function(){return this.bufParams},jsts.operation.buffer.OffsetCurveBuilder.prototype.getLineCurve=function(t,e){if(this.distance=e,this.distance<0&&!this.bufParams.isSingleSided())return null;if(0==this.distance)return null;var n=Math.abs(this.distance),o=this.getSegGen(n);if(t.length<=1)this.computePointCurve(t[0],o);else if(this.bufParams.isSingleSided()){var r=0>e;this.computeSingleSidedBufferCurve(t,r,o)}else this.computeLineBufferCurve(t,o);var i=o.getCoordinates();return i},jsts.operation.buffer.OffsetCurveBuilder.prototype.getRingCurve=function(t,e,n){if(this.distance=n,t.length<=2)return this.getLineCurve(t,n);if(0==this.distance)return jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates(t);var o=this.getSegGen(this.distance);return this.computeRingBufferCurve(t,e,o),o.getCoordinates()},jsts.operation.buffer.OffsetCurveBuilder.prototype.getOffsetCurve=function(t,e){if(this.distance=e,0===this.distance)return null;var n=this.distance<0,o=Math.abs(this.distance),r=this.getSegGen(o);t.length<=1?this.computePointCurve(t[0],r):this.computeOffsetCurve(t,n,r);var i=r.getCoordinates();return n&&i.reverse(),i},jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates=function(t){for(var e=[],n=0;n<t.length;n++)e.push(t[n].clone());return e},jsts.operation.buffer.OffsetCurveBuilder.prototype.getSegGen=function(t){return new jsts.operation.buffer.OffsetSegmentGenerator(this.precisionModel,this.bufParams,t)},jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR=100,jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance=function(t){return t/jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR},jsts.operation.buffer.OffsetCurveBuilder.prototype.computePointCurve=function(t,e){switch(this.bufParams.getEndCapStyle()){case jsts.operation.buffer.BufferParameters.CAP_ROUND:e.createCircle(t);break;case jsts.operation.buffer.BufferParameters.CAP_SQUARE:e.createSquare(t)}},jsts.operation.buffer.OffsetCurveBuilder.prototype.computeLineBufferCurve=function(t,e){var n=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance),o=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,n),r=o.length-1;e.initSideSegments(o[0],o[1],jsts.geomgraph.Position.LEFT);for(var i=2;r>=i;i++)e.addNextSegment(o[i],!0);e.addLastSegment(),e.addLineEndCap(o[r-1],o[r]);var s=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,-n),a=s.length-1;e.initSideSegments(s[a],s[a-1],jsts.geomgraph.Position.LEFT);for(var i=a-2;i>=0;i--)e.addNextSegment(s[i],!0);e.addLastSegment(),e.addLineEndCap(s[1],s[0]),e.closeRing()},jsts.operation.buffer.OffsetCurveBuilder.prototype.computeSingleSidedBufferCurve=function(t,e,n){var o=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);if(e){n.addSegments(t,!0);var r=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,-o),i=r.length-1;n.initSideSegments(r[i],r[i-1],jsts.geomgraph.Position.LEFT),n.addFirstSegment();for(var s=i-2;s>=0;s--)n.addNextSegment(r[s],!0)}else{n.addSegments(t,!1);var a=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,o),u=a.length-1;n.initSideSegments(a[0],a[1],jsts.geomgraph.Position.LEFT),n.addFirstSegment();for(var s=2;u>=s;s++)n.addNextSegment(a[s],!0)}n.addLastSegment(),n.closeRing()},jsts.operation.buffer.OffsetCurveBuilder.prototype.computeOffsetCurve=function(t,e,n){var o=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);if(e){var r=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,-o),i=r.length-1;n.initSideSegments(r[i],r[i-1],jsts.geomgraph.Position.LEFT),n.addFirstSegment();for(var s=i-2;s>=0;s--)n.addNextSegment(r[s],!0)}else{var a=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,o),u=a.length-1;n.initSideSegments(a[0],a[1],jsts.geomgraph.Position.LEFT),n.addFirstSegment();for(var s=2;u>=s;s++)n.addNextSegment(a[s],!0)}n.addLastSegment()},jsts.operation.buffer.OffsetCurveBuilder.prototype.computeRingBufferCurve=function(t,e,n){var o=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);e===jsts.geomgraph.Position.RIGHT&&(o=-o);var r=jsts.operation.buffer.BufferInputLineSimplifier.simplify(t,o),i=r.length-1;n.initSideSegments(r[i-1],r[0],e);for(var s=1;i>=s;s++){var a=1!==s;n.addNextSegment(r[s],a)}n.closeRing()},function(){var t=function(t,e,n){this.hotPixel=t,this.parentEdge=e,this.vertexIndex=n};t.prototype=new jsts.index.chain.MonotoneChainSelectAction,t.constructor=t,t.prototype.hotPixel=null,t.prototype.parentEdge=null,t.prototype.vertexIndex=null,t.prototype._isNodeAdded=!1,t.prototype.isNodeAdded=function(){return this._isNodeAdded},t.prototype.select=function(t,e){var n=t.getContext();(null===this.parentEdge||n!==this.parentEdge||e!==this.vertexIndex)&&(this._isNodeAdded=this.hotPixel.addSnappedNode(n,e))},jsts.noding.snapround.MCIndexPointSnapper=function(t){this.index=t},jsts.noding.snapround.MCIndexPointSnapper.prototype.index=null,jsts.noding.snapround.MCIndexPointSnapper.prototype.snap=function(e,n,o){if(1===arguments.length)return void this.snap2.apply(this,arguments);var r=e.getSafeEnvelope(),i=new t(e,n,o);return this.index.query(r,{visitItem:function(t){t.select(r,i)}}),i.isNodeAdded()},jsts.noding.snapround.MCIndexPointSnapper.prototype.snap2=function(t){return this.snap(t,null,-1)}}(),function(){var t=function(){this.items=new javascript.util.ArrayList,this.subnode=[null,null]};t.getSubnodeIndex=function(t,e){var n=-1;return t.min>=e&&(n=1),t.max<=e&&(n=0),n},t.prototype.getItems=function(){return this.items},t.prototype.add=function(t){this.items.add(t)},t.prototype.addAllItems=function(t){t.addAll(this.items);var e=0,n=2;for(e;n>e;e++)null!==this.subnode[e]&&this.subnode[e].addAllItems(t);return t},t.prototype.addAllItemsFromOverlapping=function(t,e){(null===t||this.isSearchMatch(t))&&(e.addAll(this.items),null!==this.subnode[0]&&this.subnode[0].addAllItemsFromOverlapping(t,e),null!==this.subnode[1]&&this.subnode[1].addAllItemsFromOverlapping(t,e))},t.prototype.remove=function(t,e){if(!this.isSearchMatch(t))return!1;var n=!1,o=0,r=2;for(o;r>o;o++)if(null!==this.subnode[o]&&(n=this.subnode[o].remove(t,e))){this.subnode[o].isPrunable()&&(this.subnode[o]=null);break}return n?n:n=this.items.remove(e)},t.prototype.isPrunable=function(){return!(this.hasChildren()||this.hasItems())},t.prototype.hasChildren=function(){var t=0,e=2;for(t;e>t;t++)if(null!==this.subnode[t])return!0;return!1},t.prototype.hasItems=function(){return!this.items.isEmpty()},t.prototype.depth=function(){var t,e=0,n=0,o=2;for(n;o>n;n++)null!==this.subnode[n]&&(t=this.subnode[n].depth(),t>e&&(e=t));return e+1},t.prototype.size=function(){var t=0,e=0,n=2;for(e;n>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.size()},t.prototype.nodeSize=function(){var t=0,e=0,n=2;for(e;n>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].nodeSize());return t+1},jsts.index.bintree.NodeBase=t}(),function(){var t=jsts.index.bintree.NodeBase,e=jsts.index.bintree.Key,n=jsts.index.bintree.Interval,o=function(t,e){this.items=new javascript.util.ArrayList,this.subnode=[null,null],this.interval=t,this.level=e,this.centre=(t.getMin()+t.getMax())/2};o.prototype=new t,o.constructor=o,o.createNode=function(t){var n,r;return n=new e(t),r=new o(n.getInterval(),n.getLevel())},o.createExpanded=function(t,e){var r,i;return r=new n(e),null!==t&&r.expandToInclude(t.interval),i=o.createNode(r),null!==t&&i.insert(t),i},o.prototype.getInterval=function(){return this.interval},o.prototype.isSearchMatch=function(t){return t.overlaps(this.interval)},o.prototype.getNode=function(e){var n,o=t.getSubnodeIndex(e,this.centre);return-1!=o?(n=this.getSubnode(o),n.getNode(e)):this},o.prototype.find=function(e){var n,o=t.getSubnodeIndex(e,this.centre);return-1===o?this:null!==this.subnode[o]?(n=this.subnode[o],n.find(e)):this},o.prototype.insert=function(e){var n,o=t.getSubnodeIndex(e.interval,this.centre);e.level===this.level-1?this.subnode[o]=e:(n=this.createSubnode(o),n.insert(e),this.subnode[o]=n)},o.prototype.getSubnode=function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},o.prototype.createSubnode=function(t){var e,r,i,s;switch(e=0,r=0,t){case 0:e=this.interval.getMin(),r=this.centre;break;case 1:e=this.centre,r=this.interval.getMax()}return i=new n(e,r),s=new o(i,this.level-1)},jsts.index.bintree.Node=o}(),function(){var t=jsts.index.bintree.Node,e=jsts.index.bintree.NodeBase,n=function(){this.subnode=[null,null],this.items=new javascript.util.ArrayList};n.prototype=new jsts.index.bintree.NodeBase,n.constructor=n,n.origin=0,n.prototype.insert=function(o,r){var i,s,a=e.getSubnodeIndex(o,n.origin);return-1===a?void this.add(r):(i=this.subnode[a],null!==i&&i.getInterval().contains(o)||(s=t.createExpanded(i,o),this.subnode[a]=s),void this.insertContained(this.subnode[a],o,r))},n.prototype.insertContained=function(t,e,n){var o,r;o=jsts.index.IntervalSize.isZeroWidth(e.getMin(),e.getMax()),r=o?t.find(e):t.getNode(e),r.add(n)},n.prototype.isSearchMatch=function(){return!0},jsts.index.bintree.Root=n}(),jsts.geomgraph.Quadrant=function(){},jsts.geomgraph.Quadrant.NE=0,jsts.geomgraph.Quadrant.NW=1,jsts.geomgraph.Quadrant.SW=2,jsts.geomgraph.Quadrant.SE=3,jsts.geomgraph.Quadrant.quadrant=function(t,e){if(t instanceof jsts.geom.Coordinate)return jsts.geomgraph.Quadrant.quadrant2.apply(this,arguments);if(0===t&&0===e)throw new jsts.error.IllegalArgumentError("Cannot compute the quadrant for point ( "+t+", "+e+" )");return t>=0?e>=0?jsts.geomgraph.Quadrant.NE:jsts.geomgraph.Quadrant.SE:e>=0?jsts.geomgraph.Quadrant.NW:jsts.geomgraph.Quadrant.SW},jsts.geomgraph.Quadrant.quadrant2=function(t,e){if(e.x===t.x&&e.y===t.y)throw new jsts.error.IllegalArgumentError("Cannot compute the quadrant for two identical points "+t);return e.x>=t.x?e.y>=t.y?jsts.geomgraph.Quadrant.NE:jsts.geomgraph.Quadrant.SE:e.y>=t.y?jsts.geomgraph.Quadrant.NW:jsts.geomgraph.Quadrant.SW},jsts.geomgraph.Quadrant.isOpposite=function(t,e){if(t===e)return!1;var n=(t-e+4)%4;return 2===n?!0:!1},jsts.geomgraph.Quadrant.commonHalfPlane=function(t,e){if(t===e)return t;var n=(t-e+4)%4;if(2===n)return-1;var o=e>t?t:e,r=t>e?t:e;return 0===o&&3===r?3:o},jsts.geomgraph.Quadrant.isInHalfPlane=function(t,e){return e===jsts.geomgraph.Quadrant.SE?t===jsts.geomgraph.Quadrant.SE||t===jsts.geomgraph.Quadrant.SW:t===e||t===e+1},jsts.geomgraph.Quadrant.isNorthern=function(t){return t===jsts.geomgraph.Quadrant.NE||t===jsts.geomgraph.Quadrant.NW},jsts.operation.valid.ConsistentAreaTester=function(t){this.geomGraph=t,this.li=new jsts.algorithm.RobustLineIntersector,this.nodeGraph=new jsts.operation.relate.RelateNodeGraph,this.invalidPoint=null},jsts.operation.valid.ConsistentAreaTester.prototype.getInvalidPoint=function(){return this.invalidPoint},jsts.operation.valid.ConsistentAreaTester.prototype.isNodeConsistentArea=function(){var t=this.geomGraph.computeSelfNodes(this.li,!0);return t.hasProperIntersection()?(this.invalidPoint=t.getProperIntersectionPoint(),!1):(this.nodeGraph.build(this.geomGraph),this.isNodeEdgeAreaLabelsConsistent())},jsts.operation.valid.ConsistentAreaTester.prototype.isNodeEdgeAreaLabelsConsistent=function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();){var e=t.next();if(!e.getEdges().isAreaLabelsConsistent(this.geomGraph))return this.invalidPoint=e.getCoordinate().clone(),!1}return!0},jsts.operation.valid.ConsistentAreaTester.prototype.hasDuplicateRings=function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();)for(var e=t.next(),n=e.getEdges().iterator();n.hasNext();){var o=n.next();if(o.getEdgeEnds().length>1)return invalidPoint=o.getEdge().getCoordinate(0),!0}return!1},jsts.operation.relate.RelateNode=function(){jsts.geomgraph.Node.apply(this,arguments)},jsts.operation.relate.RelateNode.prototype=new jsts.geomgraph.Node,jsts.operation.relate.RelateNode.prototype.computeIM=function(t){t.setAtLeastIfValid(this.label.getLocation(0),this.label.getLocation(1),0)},jsts.operation.relate.RelateNode.prototype.updateIMFromEdges=function(t){this.edges.updateIM(t)},function(){var t=jsts.geom.Location,e=jsts.geomgraph.Position,n=jsts.geomgraph.EdgeEnd;jsts.geomgraph.DirectedEdge=function(t,e){if(n.call(this,t),this.depth=[0,-999,-999],this._isForward=e,e)this.init(t.getCoordinate(0),t.getCoordinate(1));else{var o=t.getNumPoints()-1;this.init(t.getCoordinate(o),t.getCoordinate(o-1))}this.computeDirectedLabel()},jsts.geomgraph.DirectedEdge.prototype=new n,jsts.geomgraph.DirectedEdge.constructor=jsts.geomgraph.DirectedEdge,jsts.geomgraph.DirectedEdge.depthFactor=function(e,n){return e===t.EXTERIOR&&n===t.INTERIOR?1:e===t.INTERIOR&&n===t.EXTERIOR?-1:0},jsts.geomgraph.DirectedEdge.prototype._isForward=null,jsts.geomgraph.DirectedEdge.prototype._isInResult=!1,jsts.geomgraph.DirectedEdge.prototype._isVisited=!1,jsts.geomgraph.DirectedEdge.prototype.sym=null,jsts.geomgraph.DirectedEdge.prototype.next=null,jsts.geomgraph.DirectedEdge.prototype.nextMin=null,jsts.geomgraph.DirectedEdge.prototype.edgeRing=null,jsts.geomgraph.DirectedEdge.prototype.minEdgeRing=null,jsts.geomgraph.DirectedEdge.prototype.depth=null,jsts.geomgraph.DirectedEdge.prototype.getEdge=function(){return this.edge},jsts.geomgraph.DirectedEdge.prototype.setInResult=function(t){this._isInResult=t},jsts.geomgraph.DirectedEdge.prototype.isInResult=function(){return this._isInResult},jsts.geomgraph.DirectedEdge.prototype.isVisited=function(){return this._isVisited},jsts.geomgraph.DirectedEdge.prototype.setVisited=function(t){this._isVisited=t},jsts.geomgraph.DirectedEdge.prototype.setEdgeRing=function(t){this.edgeRing=t},jsts.geomgraph.DirectedEdge.prototype.getEdgeRing=function(){return this.edgeRing},jsts.geomgraph.DirectedEdge.prototype.setMinEdgeRing=function(t){this.minEdgeRing=t},jsts.geomgraph.DirectedEdge.prototype.getMinEdgeRing=function(){return this.minEdgeRing},jsts.geomgraph.DirectedEdge.prototype.getDepth=function(t){return this.depth[t]},jsts.geomgraph.DirectedEdge.prototype.setDepth=function(t,e){if(-999!==this.depth[t]&&this.depth[t]!==e)throw new jsts.error.TopologyError("assigned depths do not match",this.getCoordinate());this.depth[t]=e},jsts.geomgraph.DirectedEdge.prototype.getDepthDelta=function(){var t=this.edge.getDepthDelta();return this._isForward||(t=-t),t},jsts.geomgraph.DirectedEdge.prototype.setVisitedEdge=function(t){this.setVisited(t),this.sym.setVisited(t)},jsts.geomgraph.DirectedEdge.prototype.getSym=function(){return this.sym},jsts.geomgraph.DirectedEdge.prototype.isForward=function(){return this._isForward},jsts.geomgraph.DirectedEdge.prototype.setSym=function(t){this.sym=t},jsts.geomgraph.DirectedEdge.prototype.getNext=function(){return this.next},jsts.geomgraph.DirectedEdge.prototype.setNext=function(t){this.next=t},jsts.geomgraph.DirectedEdge.prototype.getNextMin=function(){return this.nextMin},jsts.geomgraph.DirectedEdge.prototype.setNextMin=function(t){this.nextMin=t},jsts.geomgraph.DirectedEdge.prototype.isLineEdge=function(){var e=this.label.isLine(0)||this.label.isLine(1),n=!this.label.isArea(0)||this.label.allPositionsEqual(0,t.EXTERIOR),o=!this.label.isArea(1)||this.label.allPositionsEqual(1,t.EXTERIOR);return e&&n&&o},jsts.geomgraph.DirectedEdge.prototype.isInteriorAreaEdge=function(){for(var n=!0,o=0;2>o;o++)this.label.isArea(o)&&this.label.getLocation(o,e.LEFT)===t.INTERIOR&&this.label.getLocation(o,e.RIGHT)===t.INTERIOR||(n=!1);
return n},jsts.geomgraph.DirectedEdge.prototype.computeDirectedLabel=function(){this.label=new jsts.geomgraph.Label(this.edge.getLabel()),this._isForward||this.label.flip()},jsts.geomgraph.DirectedEdge.prototype.setEdgeDepths=function(t,n){var o=this.getEdge().getDepthDelta();this._isForward||(o=-o);var r=1;t===e.LEFT&&(r=-1);var i=e.opposite(t),s=o*r,a=n+s;this.setDepth(t,n),this.setDepth(i,a)}}(),jsts.operation.distance.DistanceOp=function(t,e,n){this.ptLocator=new jsts.algorithm.PointLocator,this.geom=[],this.geom[0]=t,this.geom[1]=e,this.terminateDistance=n},jsts.operation.distance.DistanceOp.prototype.geom=null,jsts.operation.distance.DistanceOp.prototype.terminateDistance=0,jsts.operation.distance.DistanceOp.prototype.ptLocator=null,jsts.operation.distance.DistanceOp.prototype.minDistanceLocation=null,jsts.operation.distance.DistanceOp.prototype.minDistance=Number.MAX_VALUE,jsts.operation.distance.DistanceOp.distance=function(t,e){var n=new jsts.operation.distance.DistanceOp(t,e,0);return n.distance()},jsts.operation.distance.DistanceOp.isWithinDistance=function(t,e,n){var o=new jsts.operation.distance.DistanceOp(t,e,n);return o.distance()<=n},jsts.operation.distance.DistanceOp.nearestPoints=function(t,e){var n=new jsts.operation.distance.DistanceOp(t,e,0);return n.nearestPoints()},jsts.operation.distance.DistanceOp.prototype.distance=function(){if(null===this.geom[0]||null===this.geom[1])throw new jsts.error.IllegalArgumentError("null geometries are not supported");return this.geom[0].isEmpty()||this.geom[1].isEmpty()?0:(this.computeMinDistance(),this.minDistance)},jsts.operation.distance.DistanceOp.prototype.nearestPoints=function(){this.computeMinDistance();var t=[this.minDistanceLocation[0].getCoordinate(),this.minDistanceLocation[1].getCoordinate()];return t},jsts.operation.distance.DistanceOp.prototype.nearestLocations=function(){return this.computeMinDistance(),this.minDistanceLocation},jsts.operation.distance.DistanceOp.prototype.updateMinDistance=function(t,e){null!==t[0]&&(e?(this.minDistanceLocation[0]=t[1],this.minDistanceLocation[1]=t[0]):(this.minDistanceLocation[0]=t[0],this.minDistanceLocation[1]=t[1]))},jsts.operation.distance.DistanceOp.prototype.computeMinDistance=function(){return arguments.length>0?void this.computeMinDistance2.apply(this,arguments):void(null===this.minDistanceLocation&&(this.minDistanceLocation=[],this.computeContainmentDistance(),this.minDistance<=this.terminateDistance||this.computeFacetDistance()))},jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance=function(){if(2===arguments.length)return void this.computeContainmentDistance2.apply(this,arguments);if(3===arguments.length&&!arguments[0]instanceof jsts.operation.distance.GeometryLocation)return void this.computeContainmentDistance3.apply(this,arguments);if(3===arguments.length)return void this.computeContainmentDistance4.apply(this,arguments);var t=[];this.computeContainmentDistance2(0,t),this.minDistance<=this.terminateDistance||this.computeContainmentDistance2(1,t)},jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance2=function(t,e){var n=1-t,o=jsts.geom.util.PolygonExtracter.getPolygons(this.geom[t]);if(o.length>0){var r=jsts.operation.distance.ConnectedElementLocationFilter.getLocations(this.geom[n]);if(this.computeContainmentDistance3(r,o,e),this.minDistance<=this.terminateDistance)return this.minDistanceLocation[n]=e[0],void(this.minDistanceLocation[t]=e[1])}},jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance3=function(t,e,n){for(var o=0;o<t.length;o++)for(var r=t[o],i=0;i<e.length;i++)if(this.computeContainmentDistance4(r,e[i],n),this.minDistance<=this.terminateDistance)return},jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance4=function(t,e,n){var o=t.getCoordinate();return jsts.geom.Location.EXTERIOR!==this.ptLocator.locate(o,e)?(this.minDistance=0,n[0]=t,void(n[1]=new jsts.operation.distance.GeometryLocation(e,o))):void 0},jsts.operation.distance.DistanceOp.prototype.computeFacetDistance=function(){var t=[],e=jsts.geom.util.LinearComponentExtracter.getLines(this.geom[0]),n=jsts.geom.util.LinearComponentExtracter.getLines(this.geom[1]),o=jsts.geom.util.PointExtracter.getPoints(this.geom[0]),r=jsts.geom.util.PointExtracter.getPoints(this.geom[1]);this.computeMinDistanceLines(e,n,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance||(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(e,r,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance||(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(n,o,t),this.updateMinDistance(t,!0),this.minDistance<=this.terminateDistance||(t[0]=null,t[1]=null,this.computeMinDistancePoints(o,r,t),this.updateMinDistance(t,!1))))},jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLines=function(t,e,n){for(var o=0;o<t.length;o++)for(var r=t[o],i=0;i<e.length;i++){var s=e[i];if(this.computeMinDistance(r,s,n),this.minDistance<=this.terminateDistance)return}},jsts.operation.distance.DistanceOp.prototype.computeMinDistancePoints=function(t,e,n){for(var o=0;o<t.length;o++)for(var r=t[o],i=0;i<e.length;i++){var s=e[i],a=r.getCoordinate().distance(s.getCoordinate());if(a<this.minDistance&&(this.minDistance=a,n[0]=new jsts.operation.distance.GeometryLocation(r,0,r.getCoordinate()),n[1]=new jsts.operation.distance.GeometryLocation(s,0,s.getCoordinate())),this.minDistance<=this.terminateDistance)return}},jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLinesPoints=function(t,e,n){for(var o=0;o<t.length;o++)for(var r=t[o],i=0;i<e.length;i++){var s=e[i];if(this.computeMinDistance(r,s,n),this.minDistance<=this.terminateDistance)return}},jsts.operation.distance.DistanceOp.prototype.computeMinDistance2=function(t,e,n){if(e instanceof jsts.geom.Point)return void this.computeMinDistance3(t,e,n);if(!(t.getEnvelopeInternal().distance(e.getEnvelopeInternal())>this.minDistance))for(var o=t.getCoordinates(),r=e.getCoordinates(),i=0;i<o.length-1;i++)for(var s=0;s<r.length-1;s++){var a=jsts.algorithm.CGAlgorithms.distanceLineLine(o[i],o[i+1],r[s],r[s+1]);if(a<this.minDistance){this.minDistance=a;var u=new jsts.geom.LineSegment(o[i],o[i+1]),p=new jsts.geom.LineSegment(r[s],r[s+1]),g=u.closestPoints(p);n[0]=new jsts.operation.distance.GeometryLocation(t,i,g[0]),n[1]=new jsts.operation.distance.GeometryLocation(e,s,g[1])}if(this.minDistance<=this.terminateDistance)return}},jsts.operation.distance.DistanceOp.prototype.computeMinDistance3=function(t,e,n){if(!(t.getEnvelopeInternal().distance(e.getEnvelopeInternal())>this.minDistance))for(var o=t.getCoordinates(),r=e.getCoordinate(),i=0;i<o.length-1;i++){var s=jsts.algorithm.CGAlgorithms.distancePointLine(r,o[i],o[i+1]);if(s<this.minDistance){this.minDistance=s;var a=new jsts.geom.LineSegment(o[i],o[i+1]),u=a.closestPoint(r);n[0]=new jsts.operation.distance.GeometryLocation(t,i,u),n[1]=new jsts.operation.distance.GeometryLocation(e,0,r)}if(this.minDistance<=this.terminateDistance)return}},jsts.index.strtree.SIRtree=function(t){t=t||10,jsts.index.strtree.AbstractSTRtree.call(this,t)},jsts.index.strtree.SIRtree.prototype=new jsts.index.strtree.AbstractSTRtree,jsts.index.strtree.SIRtree.constructor=jsts.index.strtree.SIRtree,jsts.index.strtree.SIRtree.prototype.comperator={compare:function(t,e){return t.getBounds().getCentre()-e.getBounds().getCentre()}},jsts.index.strtree.SIRtree.prototype.intersectionOp={intersects:function(t,e){return t.intersects(e)}},jsts.index.strtree.SIRtree.prototype.createNode=function(){var t=function(){jsts.index.strtree.AbstractNode.apply(this,arguments)};return t.prototype=new jsts.index.strtree.AbstractNode,t.constructor=t,t.prototype.computeBounds=function(){for(var t,e=null,n=this.getChildBoundables(),o=0,r=n.length;r>o;o++)t=n[o],null===e?e=new jsts.index.strtree.Interval(t.getBounds()):e.expandToInclude(t.getBounds());return e},t},jsts.index.strtree.SIRtree.prototype.insert=function(t,e,n){jsts.index.strtree.AbstractSTRtree.prototype.insert(new jsts.index.strtree.Interval(Math.min(t,e),Math.max(t,e)),n)},jsts.index.strtree.SIRtree.prototype.query=function(t,e){e=e||t,jsts.index.strtree.AbstractSTRtree.prototype.query(new jsts.index.strtree.Interval(Math.min(t,e),Math.max(t,e)))},jsts.index.strtree.SIRtree.prototype.getIntersectsOp=function(){return this.intersectionOp},jsts.index.strtree.SIRtree.prototype.getComparator=function(){return this.comperator},jsts.simplify.DouglasPeuckerSimplifier=function(t){this.inputGeom=t,this.isEnsureValidTopology=!0},jsts.simplify.DouglasPeuckerSimplifier.prototype.inputGeom=null,jsts.simplify.DouglasPeuckerSimplifier.prototype.distanceTolerance=null,jsts.simplify.DouglasPeuckerSimplifier.prototype.isEnsureValidTopology=null,jsts.simplify.DouglasPeuckerSimplifier.simplify=function(t,e){var n=new jsts.simplify.DouglasPeuckerSimplifier(t);return n.setDistanceTolerance(e),n.getResultGeometry()},jsts.simplify.DouglasPeuckerSimplifier.prototype.setDistanceTolerance=function(t){if(0>t)throw"Tolerance must be non-negative";this.distanceTolerance=t},jsts.simplify.DouglasPeuckerSimplifier.prototype.setEnsureValid=function(t){this.isEnsureValidTopology=t},jsts.simplify.DouglasPeuckerSimplifier.prototype.getResultGeometry=function(){return this.inputGeom.isEmpty()?this.inputGeom.clone():new jsts.simplify.DPTransformer(this.distanceTolerance,this.isEnsureValidTopology).transform(this.inputGeom)},function(){jsts.operation.predicate.RectangleContains=function(t){this.rectEnv=t.getEnvelopeInternal()},jsts.operation.predicate.RectangleContains.contains=function(t,e){var n=new jsts.operation.predicate.RectangleContains(t);return n.contains(e)},jsts.operation.predicate.RectangleContains.prototype.rectEnv=null,jsts.operation.predicate.RectangleContains.prototype.contains=function(t){return this.rectEnv.contains(t.getEnvelopeInternal())?this.isContainedInBoundary(t)?!1:!0:!1},jsts.operation.predicate.RectangleContains.prototype.isContainedInBoundary=function(t){if(t instanceof jsts.geom.Polygon)return!1;if(t instanceof jsts.geom.Point)return this.isPointContainedInBoundary(t.getCoordinate());if(t instanceof jsts.geom.LineString)return this.isLineStringContainedInBoundary(t);for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(!this.isContainedInBoundary(n))return!1}return!0},jsts.operation.predicate.RectangleContains.prototype.isPointContainedInBoundary=function(t){return t.x==this.rectEnv.getMinX()||t.x==this.rectEnv.getMaxX()||t.y==this.rectEnv.getMinY()||t.y==this.rectEnv.getMaxY()},jsts.operation.predicate.RectangleContains.prototype.isLineStringContainedInBoundary=function(t){for(var e=t.getCoordinateSequence(),n=0;n<e.length-1;n++){var o=e[n],r=e[n+1];if(!this.isLineSegmentContainedInBoundary(o,r))return!1}return!0},jsts.operation.predicate.RectangleContains.prototype.isLineSegmentContainedInBoundary=function(t,e){if(t.equals(e))return this.isPointContainedInBoundary(t);if(t.x==e.x){if(t.x==this.rectEnv.getMinX()||t.x==this.rectEnv.getMaxX())return!0}else if(t.y==e.y&&(t.y==this.rectEnv.getMinY()||t.y==this.rectEnv.getMaxY()))return!0;return!1}}(),function(){var t=jsts.geom.Location,e=jsts.geomgraph.Position;jsts.geomgraph.Depth=function(){this.depth=[[],[]];for(var t=0;2>t;t++)for(var e=0;3>e;e++)this.depth[t][e]=jsts.geomgraph.Depth.NULL_VALUE},jsts.geomgraph.Depth.NULL_VALUE=-1,jsts.geomgraph.Depth.depthAtLocation=function(e){return e===t.EXTERIOR?0:e===t.INTERIOR?1:jsts.geomgraph.Depth.NULL_VALUE},jsts.geomgraph.Depth.prototype.depth=null,jsts.geomgraph.Depth.prototype.getDepth=function(t,e){return this.depth[t][e]},jsts.geomgraph.Depth.prototype.setDepth=function(t,e,n){this.depth[t][e]=n},jsts.geomgraph.Depth.prototype.getLocation=function(e,n){return this.depth[e][n]<=0?t.EXTERIOR:t.INTERIOR},jsts.geomgraph.Depth.prototype.add=function(e,n,o){o===t.INTERIOR&&this.depth[e][n]++},jsts.geomgraph.Depth.prototype.isNull=function(){if(arguments.length>0)return this.isNull2.apply(this,arguments);for(var t=0;2>t;t++)for(var e=0;3>e;e++)if(this.depth[t][e]!==jsts.geomgraph.Depth.NULL_VALUE)return!1;return!0},jsts.geomgraph.Depth.prototype.isNull2=function(t){return arguments.length>1?this.isNull3.apply(this,arguments):this.depth[t][1]==jsts.geomgraph.Depth.NULL_VALUE},jsts.geomgraph.Depth.prototype.isNull3=function(t,e){return this.depth[t][e]==jsts.geomgraph.Depth.NULL_VALUE},jsts.geomgraph.Depth.prototype.add=function(e){for(var n=0;2>n;n++)for(var o=1;3>o;o++){var r=e.getLocation(n,o);(r===t.EXTERIOR||r===t.INTERIOR)&&(this.isNull(n,o)?this.depth[n][o]=jsts.geomgraph.Depth.depthAtLocation(r):this.depth[n][o]+=jsts.geomgraph.Depth.depthAtLocation(r))}},jsts.geomgraph.Depth.prototype.getDelta=function(t){return this.depth[t][e.RIGHT]-this.depth[t][e.LEFT]},jsts.geomgraph.Depth.prototype.normalize=function(){for(var t=0;2>t;t++)if(!this.isNull(t)){var e=this.depth[t][1];this.depth[t][2]<e&&(e=this.depth[t][2]),0>e&&(e=0);for(var n=1;3>n;n++){var o=0;this.depth[t][n]>e&&(o=1),this.depth[t][n]=o}}},jsts.geomgraph.Depth.prototype.toString=function(){return"A: "+this.depth[0][1]+","+this.depth[0][2]+" B: "+this.depth[1][1]+","+this.depth[1][2]}}(),jsts.algorithm.BoundaryNodeRule=function(){},jsts.algorithm.BoundaryNodeRule.prototype.isInBoundary=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.algorithm.Mod2BoundaryNodeRule=function(){},jsts.algorithm.Mod2BoundaryNodeRule.prototype=new jsts.algorithm.BoundaryNodeRule,jsts.algorithm.Mod2BoundaryNodeRule.prototype.isInBoundary=function(t){return t%2===1},jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE=new jsts.algorithm.Mod2BoundaryNodeRule,jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE=jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE,jsts.operation.distance.GeometryLocation=function(t,e,n){this.component=t,this.segIndex=e,this.pt=n},jsts.operation.distance.GeometryLocation.INSIDE_AREA=-1,jsts.operation.distance.GeometryLocation.prototype.component=null,jsts.operation.distance.GeometryLocation.prototype.segIndex=null,jsts.operation.distance.GeometryLocation.prototype.pt=null,jsts.operation.distance.GeometryLocation.prototype.getGeometryComponent=function(){return this.component},jsts.operation.distance.GeometryLocation.prototype.getSegmentIndex=function(){return this.segIndex},jsts.operation.distance.GeometryLocation.prototype.getCoordinate=function(){return this.pt},jsts.operation.distance.GeometryLocation.prototype.isInsideArea=function(){return this.segIndex===jsts.operation.distance.GeometryLocation.INSIDE_AREA},jsts.geom.util.PointExtracter=function(t){this.pts=t},jsts.geom.util.PointExtracter.prototype=new jsts.geom.GeometryFilter,jsts.geom.util.PointExtracter.prototype.pts=null,jsts.geom.util.PointExtracter.getPoints=function(t,e){return void 0===e&&(e=[]),t instanceof jsts.geom.Point?e.push(t):(t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.MultiPolygon)&&t.apply(new jsts.geom.util.PointExtracter(e)),e},jsts.geom.util.PointExtracter.prototype.filter=function(t){t instanceof jsts.geom.Point&&this.pts.push(t)},function(){var t=jsts.geom.Location;jsts.operation.relate.RelateNodeGraph=function(){this.nodes=new jsts.geomgraph.NodeMap(new jsts.operation.relate.RelateNodeFactory)},jsts.operation.relate.RelateNodeGraph.prototype.nodes=null,jsts.operation.relate.RelateNodeGraph.prototype.build=function(t){this.computeIntersectionNodes(t,0),this.copyNodesAndLabels(t,0);var e=new jsts.operation.relate.EdgeEndBuilder,n=e.computeEdgeEnds(t.getEdgeIterator());this.insertEdgeEnds(n)},jsts.operation.relate.RelateNodeGraph.prototype.computeIntersectionNodes=function(e,n){for(var o=e.getEdgeIterator();o.hasNext();)for(var r=o.next(),i=r.getLabel().getLocation(n),s=r.getEdgeIntersectionList().iterator();s.hasNext();){var a=s.next(),u=this.nodes.addNode(a.coord);i===t.BOUNDARY?u.setLabelBoundary(n):u.getLabel().isNull(n)&&u.setLabel(n,t.INTERIOR)}},jsts.operation.relate.RelateNodeGraph.prototype.copyNodesAndLabels=function(t,e){for(var n=t.getNodeIterator();n.hasNext();){var o=n.next(),r=this.nodes.addNode(o.getCoordinate());r.setLabel(e,o.getLabel().getLocation(e))}},jsts.operation.relate.RelateNodeGraph.prototype.insertEdgeEnds=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},jsts.operation.relate.RelateNodeGraph.prototype.getNodeIterator=function(){return this.nodes.iterator()}}(),jsts.geomgraph.index.SimpleSweepLineIntersector=function(){},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector,jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.events=[],jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.nOverlaps=null,jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections=function(t,e,n){return e instanceof javascript.util.List?void this.computeIntersections2.apply(this,arguments):(n?this.add(t,null):this.add(t),void this.computeIntersections3(e))},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections2=function(t,e,n){this.add(t,t),this.add(e,e),this.computeIntersections3(n)},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.add=function(t,e){if(t instanceof javascript.util.List)return void this.add2.apply(this,arguments);for(var n=t.getCoordinates(),o=0;o<n.length-1;o++){var r=new jsts.geomgraph.index.SweepLineSegment(t,o),i=new jsts.geomgraph.index.SweepLineEvent(r.getMinX(),r,e);this.events.push(i),this.events.push(new jsts.geomgraph.index.SweepLineEvent(r.getMaxX(),i))}},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.add2=function(t,e){for(var n=t.iterator();n.hasNext();){var o=n.next();e?this.add(o,e):this.add(o,o)}},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.prepareEvents=function(){this.events.sort(function(t,e){return t.compareTo(e)});for(var t=0;t<this.events.length;t++){var e=this.events[t];e.isDelete()&&e.getInsertEvent().setDeleteEventIndex(t)}},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections3=function(t){this.nOverlaps=0,this.prepareEvents();for(var e=0;e<this.events.length;e++){var n=this.events[e];n.isInsert()&&this.processOverlaps(e,n.getDeleteEventIndex(),n,t)}},jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.processOverlaps=function(t,e,n,o){for(var r=n.getObject(),i=t;e>i;i++){var s=this.events[i];if(s.isInsert()){var a=s.getObject();n.isSameLabel(s)||(r.computeIntersections(a,o),this.nOverlaps++)}}},jsts.triangulate.VoronoiDiagramBuilder=function(){this.siteCoords=null,this.tolerance=0,this.subdiv=null,this.clipEnv=null,this.diagramEnv=null},jsts.triangulate.VoronoiDiagramBuilder.prototype.setSites=function(){var t=arguments[0];t instanceof jsts.geom.Geometry||t instanceof jsts.geom.Coordinate||t instanceof jsts.geom.Point||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.LineString||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.LinearRing||t instanceof jsts.geom.Polygon||t instanceof jsts.geom.MultiPolygon?this.setSitesByGeometry(t):this.setSitesByArray(t)},jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByGeometry=function(t){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates(t)},jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByArray=function(t){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.unique(t)},jsts.triangulate.VoronoiDiagramBuilder.prototype.setClipEnvelope=function(t){this.clipEnv=t},jsts.triangulate.VoronoiDiagramBuilder.prototype.setTolerance=function(t){this.tolerance=t},jsts.triangulate.VoronoiDiagramBuilder.prototype.create=function(){if(null===this.subdiv){var t,e,n,o;t=jsts.triangulate.DelaunayTriangulationBuilder.envelope(this.siteCoords),this.diagramEnv=t,e=Math.max(this.diagramEnv.getWidth(),this.diagramEnv.getHeight()),this.diagramEnv.expandBy(e),null!==this.clipEnv&&this.diagramEnv.expandToInclude(this.clipEnv),n=jsts.triangulate.DelaunayTriangulationBuilder.toVertices(this.siteCoords),this.subdiv=new jsts.triangulate.quadedge.QuadEdgeSubdivision(t,this.tolerance),o=new jsts.triangulate.IncrementalDelaunayTriangulator(this.subdiv),o.insertSites(n)}},jsts.triangulate.VoronoiDiagramBuilder.prototype.getSubdivision=function(){return this.create(),this.subdiv},jsts.triangulate.VoronoiDiagramBuilder.prototype.getDiagram=function(t){this.create();var e=this.subdiv.getVoronoiDiagram(t);return this.clipGeometryCollection(e,this.diagramEnv)},jsts.triangulate.VoronoiDiagramBuilder.prototype.clipGeometryCollection=function(t,e){var n,o,r,i,s,a;for(n=t.getFactory().toGeometry(e),o=[],r=0,i=t.getNumGeometries(),r;i>r;r++)s=t.getGeometryN(r),a=null,e.contains(s.getEnvelopeInternal())?a=s:e.intersects(s.getEnvelopeInternal())&&(a=n.intersection(s)),null===a||a.isEmpty()||o.push(a);return t.getFactory().createGeometryCollection(o)},jsts.operation.valid.IndexedNestedRingTester=function(t){this.graph=t,this.rings=new javascript.util.ArrayList,this.totalEnv=new jsts.geom.Envelope,this.index=null,this.nestedPt=null},jsts.operation.valid.IndexedNestedRingTester.prototype.getNestedPoint=function(){return this.nestedPt},jsts.operation.valid.IndexedNestedRingTester.prototype.add=function(t){this.rings.add(t),this.totalEnv.expandToInclude(t.getEnvelopeInternal())},jsts.operation.valid.IndexedNestedRingTester.prototype.isNonNested=function(){this.buildIndex();for(var t=0;t<this.rings.size();t++)for(var e=this.rings.get(t),n=e.getCoordinates(),o=this.index.query(e.getEnvelopeInternal()),r=0;r<o.length;r++){var i=o[r],s=i.getCoordinates();if(e!=i&&e.getEnvelopeInternal().intersects(i.getEnvelopeInternal())){var a=jsts.operation.valid.IsValidOp.findPtNotNode(n,i,this.graph);if(null!=a){var u=jsts.algorithm.CGAlgorithms.isPointInRing(a,s);if(u)return this.nestedPt=a,!1}}}return!0},jsts.operation.valid.IndexedNestedRingTester.prototype.buildIndex=function(){this.index=new jsts.index.strtree.STRtree;for(var t=0;t<this.rings.size();t++){var e=this.rings.get(t),n=e.getEnvelopeInternal();this.index.insert(n,e)}},jsts.geomgraph.index.MonotoneChain=function(t,e){this.mce=t,this.chainIndex=e},jsts.geomgraph.index.MonotoneChain.prototype.mce=null,jsts.geomgraph.index.MonotoneChain.prototype.chainIndex=null,jsts.geomgraph.index.MonotoneChain.prototype.computeIntersections=function(t,e){this.mce.computeIntersectsForChain(this.chainIndex,t.mce,t.chainIndex,e)},jsts.noding.SegmentNode=function(t,e,n,o){this.segString=t,this.coord=new jsts.geom.Coordinate(e),this.segmentIndex=n,this.segmentOctant=o,this._isInterior=!e.equals2D(t.getCoordinate(n))},jsts.noding.SegmentNode.prototype.segString=null,jsts.noding.SegmentNode.prototype.coord=null,jsts.noding.SegmentNode.prototype.segmentIndex=null,jsts.noding.SegmentNode.prototype.segmentOctant=null,jsts.noding.SegmentNode.prototype._isInterior=null,jsts.noding.SegmentNode.prototype.getCoordinate=function(){return this.coord},jsts.noding.SegmentNode.prototype.isInterior=function(){return this._isInterior},jsts.noding.SegmentNode.prototype.isEndPoint=function(){return 0!==this.segmentIndex||this._isInterior?this.segmentIndex===this.maxSegmentIndex?!0:!1:!0},jsts.noding.SegmentNode.prototype.compareTo=function(t){var e=t;return this.segmentIndex<e.segmentIndex?-1:this.segmentIndex>e.segmentIndex?1:this.coord.equals2D(e.coord)?0:jsts.noding.SegmentPointComparator.compare(this.segmentOctant,this.coord,e.coord)},function(){jsts.io.GeoJSONWriter=function(){this.parser=new jsts.io.GeoJSONParser(this.geometryFactory)},jsts.io.GeoJSONWriter.prototype.write=function(t){var e=this.parser.write(t);return e}}(),jsts.io.OpenLayersParser=function(t){this.geometryFactory=t||new jsts.geom.GeometryFactory},jsts.io.OpenLayersParser.prototype.read=function(t){return"OpenLayers.Geometry.Point"===t.CLASS_NAME?this.convertFromPoint(t):"OpenLayers.Geometry.LineString"===t.CLASS_NAME?this.convertFromLineString(t):"OpenLayers.Geometry.LinearRing"===t.CLASS_NAME?this.convertFromLinearRing(t):"OpenLayers.Geometry.Polygon"===t.CLASS_NAME?this.convertFromPolygon(t):"OpenLayers.Geometry.MultiPoint"===t.CLASS_NAME?this.convertFromMultiPoint(t):"OpenLayers.Geometry.MultiLineString"===t.CLASS_NAME?this.convertFromMultiLineString(t):"OpenLayers.Geometry.MultiPolygon"===t.CLASS_NAME?this.convertFromMultiPolygon(t):"OpenLayers.Geometry.Collection"===t.CLASS_NAME?this.convertFromCollection(t):void 0},jsts.io.OpenLayersParser.prototype.convertFromPoint=function(t){return this.geometryFactory.createPoint(new jsts.geom.Coordinate(t.x,t.y))},jsts.io.OpenLayersParser.prototype.convertFromLineString=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(new jsts.geom.Coordinate(t.components[e].x,t.components[e].y));return this.geometryFactory.createLineString(n)},jsts.io.OpenLayersParser.prototype.convertFromLinearRing=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(new jsts.geom.Coordinate(t.components[e].x,t.components[e].y));return this.geometryFactory.createLinearRing(n)},jsts.io.OpenLayersParser.prototype.convertFromPolygon=function(t){var e,n=null,o=[];for(e=0;e<t.components.length;e++){var r=this.convertFromLinearRing(t.components[e]);0===e?n=r:o.push(r)}return this.geometryFactory.createPolygon(n,o)},jsts.io.OpenLayersParser.prototype.convertFromMultiPoint=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(this.convertFromPoint(t.components[e]));return this.geometryFactory.createMultiPoint(n)},jsts.io.OpenLayersParser.prototype.convertFromMultiLineString=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(this.convertFromLineString(t.components[e]));return this.geometryFactory.createMultiLineString(n)},jsts.io.OpenLayersParser.prototype.convertFromMultiPolygon=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(this.convertFromPolygon(t.components[e]));return this.geometryFactory.createMultiPolygon(n)},jsts.io.OpenLayersParser.prototype.convertFromCollection=function(t){var e,n=[];for(e=0;e<t.components.length;e++)n.push(this.read(t.components[e]));return this.geometryFactory.createGeometryCollection(n)},jsts.io.OpenLayersParser.prototype.write=function(t){return"jsts.geom.Point"===t.CLASS_NAME?this.convertToPoint(t.coordinate):"jsts.geom.LineString"===t.CLASS_NAME?this.convertToLineString(t):"jsts.geom.LinearRing"===t.CLASS_NAME?this.convertToLinearRing(t):"jsts.geom.Polygon"===t.CLASS_NAME?this.convertToPolygon(t):"jsts.geom.MultiPoint"===t.CLASS_NAME?this.convertToMultiPoint(t):"jsts.geom.MultiLineString"===t.CLASS_NAME?this.convertToMultiLineString(t):"jsts.geom.MultiPolygon"===t.CLASS_NAME?this.convertToMultiPolygon(t):"jsts.geom.GeometryCollection"===t.CLASS_NAME?this.convertToCollection(t):void 0},jsts.io.OpenLayersParser.prototype.convertToPoint=function(t){return new OpenLayers.Geometry.Point(t.x,t.y)},jsts.io.OpenLayersParser.prototype.convertToLineString=function(t){var e,n=[];for(e=0;e<t.points.length;e++){var o=t.points[e];n.push(this.convertToPoint(o))}return new OpenLayers.Geometry.LineString(n)},jsts.io.OpenLayersParser.prototype.convertToLinearRing=function(t){var e,n=[];for(e=0;e<t.points.length;e++){var o=t.points[e];n.push(this.convertToPoint(o))}return new OpenLayers.Geometry.LinearRing(n)},jsts.io.OpenLayersParser.prototype.convertToPolygon=function(t){var e,n=[];for(n.push(this.convertToLinearRing(t.shell)),e=0;e<t.holes.length;e++){var o=t.holes[e];n.push(this.convertToLinearRing(o))}return new OpenLayers.Geometry.Polygon(n)},jsts.io.OpenLayersParser.prototype.convertToMultiPoint=function(t){var e,n=[];for(e=0;e<t.geometries.length;e++){var o=t.geometries[e].coordinate;n.push(new OpenLayers.Geometry.Point(o.x,o.y))}return new OpenLayers.Geometry.MultiPoint(n)},jsts.io.OpenLayersParser.prototype.convertToMultiLineString=function(t){var e,n=[];for(e=0;e<t.geometries.length;e++)n.push(this.convertToLineString(t.geometries[e]));return new OpenLayers.Geometry.MultiLineString(n)},jsts.io.OpenLayersParser.prototype.convertToMultiPolygon=function(t){var e,n=[];for(e=0;e<t.geometries.length;e++)n.push(this.convertToPolygon(t.geometries[e]));return new OpenLayers.Geometry.MultiPolygon(n)},jsts.io.OpenLayersParser.prototype.convertToCollection=function(t){var e,n=[];for(e=0;e<t.geometries.length;e++){var o=t.geometries[e],r=this.write(o);n.push(r)}return new OpenLayers.Geometry.Collection(n)},jsts.index.quadtree.Quadtree=function(){this.root=new jsts.index.quadtree.Root,this.minExtent=1},jsts.index.quadtree.Quadtree.ensureExtent=function(t,e){var n,o,r,i;return n=t.getMinX(),o=t.getMaxX(),r=t.getMinY(),i=t.getMaxY(),n!==o&&r!==i?t:(n===o&&(n-=e/2,o=n+e/2),r===i&&(r-=e/2,i=r+e/2),new jsts.geom.Envelope(n,o,r,i))},jsts.index.quadtree.Quadtree.prototype.depth=function(){return this.root.depth()},jsts.index.quadtree.Quadtree.prototype.size=function(){return this.root.size()},jsts.index.quadtree.Quadtree.prototype.insert=function(t,e){this.collectStats(t);var n=jsts.index.quadtree.Quadtree.ensureExtent(t,this.minExtent);this.root.insert(n,e)},jsts.index.quadtree.Quadtree.prototype.remove=function(t,e){var n=jsts.index.quadtree.Quadtree.ensureExtent(t,this.minExtent);return this.root.remove(n,e)},jsts.index.quadtree.Quadtree.prototype.query=function(){return 1===arguments.length?jsts.index.quadtree.Quadtree.prototype.queryByEnvelope.apply(this,arguments):void jsts.index.quadtree.Quadtree.prototype.queryWithVisitor.apply(this,arguments)},jsts.index.quadtree.Quadtree.prototype.queryByEnvelope=function(t){var e=new jsts.index.ArrayListVisitor;return this.query(t,e),e.getItems()},jsts.index.quadtree.Quadtree.prototype.queryWithVisitor=function(t,e){this.root.visit(t,e)},jsts.index.quadtree.Quadtree.prototype.queryAll=function(){var t=[];return t=this.root.addAllItems(t)},jsts.index.quadtree.Quadtree.prototype.collectStats=function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e);var n=t.getHeight();n<this.minExtent&&n>0&&(this.minExtent=n)},jsts.operation.relate.RelateNodeFactory=function(){},jsts.operation.relate.RelateNodeFactory.prototype=new jsts.geomgraph.NodeFactory,jsts.operation.relate.RelateNodeFactory.prototype.createNode=function(t){return new jsts.operation.relate.RelateNode(t,new jsts.operation.relate.EdgeEndBundleStar)},jsts.index.quadtree.Key=function(t){this.pt=new jsts.geom.Coordinate,this.level=0,this.env=null,this.computeKey(t)},jsts.index.quadtree.Key.computeQuadLevel=function(t){var e,n,o,r;return e=t.getWidth(),n=t.getHeight(),o=e>n?e:n,r=jsts.index.DoubleBits.exponent(o)+1},jsts.index.quadtree.Key.prototype.getPoint=function(){return this.pt},jsts.index.quadtree.Key.prototype.getLevel=function(){return this.level},jsts.index.quadtree.Key.prototype.getEnvelope=function(){return this.env},jsts.index.quadtree.Key.prototype.getCentre=function(){var t,e;return t=(this.env.getMinX()+this.env.getMaxX())/2,e=(this.env.getMinY()+this.env.getMaxY())/2,new jsts.geom.Coordinate(t,e)},jsts.index.quadtree.Key.prototype.computeKey=function(){arguments[0]instanceof jsts.geom.Envelope?this.computeKeyFromEnvelope(arguments[0]):this.computeKeyFromLevel(arguments[0],arguments[1])},jsts.index.quadtree.Key.prototype.computeKeyFromEnvelope=function(t){for(this.level=jsts.index.quadtree.Key.computeQuadLevel(t),this.env=new jsts.geom.Envelope,this.computeKey(this.level,t);!this.env.contains(t);)this.level+=1,this.computeKey(this.level,t)},jsts.index.quadtree.Key.prototype.computeKeyFromLevel=function(t,e){var n=jsts.index.DoubleBits.powerOf2(t);this.pt.x=Math.floor(e.getMinX()/n)*n,this.pt.y=Math.floor(e.getMinY()/n)*n,this.env.init(this.pt.x,this.pt.x+n,this.pt.y,this.pt.y+n)},jsts.geom.CoordinateArrays=function(){throw new jsts.error.AbstractMethodInvocationError},jsts.geom.CoordinateArrays.copyDeep=function(){return 1===arguments.length?jsts.geom.CoordinateArrays.copyDeep1(arguments[0]):void(5===arguments.length&&jsts.geom.CoordinateArrays.copyDeep2(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]))},jsts.geom.CoordinateArrays.copyDeep1=function(t){for(var e=[],n=0;n<t.length;n++)e[n]=new jsts.geom.Coordinate(t[n]);
return e},jsts.geom.CoordinateArrays.copyDeep2=function(t,e,n,o,r){for(var i=0;r>i;i++)n[o+i]=new jsts.geom.Coordinate(t[e+i])},jsts.geom.CoordinateArrays.removeRepeatedPoints=function(t){var e;return this.hasRepeatedPoints(t)?(e=new jsts.geom.CoordinateList(t,!1),e.toCoordinateArray()):t},jsts.geom.CoordinateArrays.hasRepeatedPoints=function(t){var e;for(e=1;e<t.length;e++)if(t[e-1].equals(t[e]))return!0;return!1},jsts.geom.CoordinateArrays.ptNotInList=function(t,e){for(var n=0;n<t.length;n++){var o=t[n];if(jsts.geom.CoordinateArrays.indexOf(o,e)<0)return o}return null},jsts.geom.CoordinateArrays.increasingDirection=function(t){for(var e=0;e<parseInt(t.length/2);e++){var n=t.length-1-e,o=t[e].compareTo(t[n]);if(0!=o)return o}return 1},jsts.geom.CoordinateArrays.minCoordinate=function(t){for(var e=null,n=0;n<t.length;n++)(null===e||e.compareTo(t[n])>0)&&(e=t[n]);return e},jsts.geom.CoordinateArrays.scroll=function(t,e){var n=jsts.geom.CoordinateArrays.indexOf(e,t);if(!(0>n)){var o=t.slice(n).concat(t.slice(0,n));for(n=0;n<o.length;n++)t[n]=o[n]}},jsts.geom.CoordinateArrays.indexOf=function(t,e){for(var n=0;n<e.length;n++)if(t.equals(e[n]))return n;return-1},jsts.operation.overlay.MinimalEdgeRing=function(t,e){jsts.geomgraph.EdgeRing.call(this,t,e)},jsts.operation.overlay.MinimalEdgeRing.prototype=new jsts.geomgraph.EdgeRing,jsts.operation.overlay.MinimalEdgeRing.constructor=jsts.operation.overlay.MinimalEdgeRing,jsts.operation.overlay.MinimalEdgeRing.prototype.getNext=function(t){return t.getNextMin()},jsts.operation.overlay.MinimalEdgeRing.prototype.setEdgeRing=function(t,e){t.setMinEdgeRing(e)},jsts.triangulate.DelaunayTriangulationBuilder=function(){this.siteCoords=null,this.tolerance=0,this.subdiv=null},jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates=function(t){if(void 0===t||null===t)return new jsts.geom.CoordinateList([],!1).toArray();var e=t.getCoordinates();return jsts.triangulate.DelaunayTriangulationBuilder.unique(e)},jsts.triangulate.DelaunayTriangulationBuilder.unique=function(t){t.sort(function(t,e){return t.compareTo(e)});var e=new jsts.geom.CoordinateList(t,!1);return e.toArray()},jsts.triangulate.DelaunayTriangulationBuilder.toVertices=function(t){var e,n=new Array(t.length),o=0,r=t.length;for(o;r>o;o++)e=t[o],n[o]=new jsts.triangulate.quadedge.Vertex(e);return n},jsts.triangulate.DelaunayTriangulationBuilder.envelope=function(t){var e=new jsts.geom.Envelope,n=0,o=t.length;for(n;o>n;n++)e.expandToInclude(t[n]);return e},jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSites=function(){var t=arguments[0];t instanceof jsts.geom.Geometry||t instanceof jsts.geom.Coordinate||t instanceof jsts.geom.Point||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.LineString||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.LinearRing||t instanceof jsts.geom.Polygon||t instanceof jsts.geom.MultiPolygon?this.setSitesFromGeometry(t):this.setSitesFromCollection(t)},jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSitesFromGeometry=function(t){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates(t)},jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSitesFromCollection=function(t){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.unique(t)},jsts.triangulate.DelaunayTriangulationBuilder.prototype.setTolerance=function(t){this.tolerance=t},jsts.triangulate.DelaunayTriangulationBuilder.prototype.create=function(){if(null===this.subdiv){var t,e,n;t=jsts.triangulate.DelaunayTriangulationBuilder.envelope(this.siteCoords),e=jsts.triangulate.DelaunayTriangulationBuilder.toVertices(this.siteCoords),this.subdiv=new jsts.triangulate.quadedge.QuadEdgeSubdivision(t,this.tolerance),n=new jsts.triangulate.IncrementalDelaunayTriangulator(this.subdiv),n.insertSites(e)}},jsts.triangulate.DelaunayTriangulationBuilder.prototype.getSubdivision=function(){return this.create(),this.subdiv},jsts.triangulate.DelaunayTriangulationBuilder.prototype.getEdges=function(t){return this.create(),this.subdiv.getEdges(t)},jsts.triangulate.DelaunayTriangulationBuilder.prototype.getTriangles=function(t){return this.create(),this.subdiv.getTriangles(t)},jsts.algorithm.RayCrossingCounter=function(t){this.p=t},jsts.algorithm.RayCrossingCounter.locatePointInRing=function(t,e){for(var n=new jsts.algorithm.RayCrossingCounter(t),o=1;o<e.length;o++){var r=e[o],i=e[o-1];if(n.countSegment(r,i),n.isOnSegment())return n.getLocation()}return n.getLocation()},jsts.algorithm.RayCrossingCounter.prototype.p=null,jsts.algorithm.RayCrossingCounter.prototype.crossingCount=0,jsts.algorithm.RayCrossingCounter.prototype.isPointOnSegment=!1,jsts.algorithm.RayCrossingCounter.prototype.countSegment=function(t,e){if(!(t.x<this.p.x&&e.x<this.p.x)){if(this.p.x==e.x&&this.p.y===e.y)return void(this.isPointOnSegment=!0);if(t.y===this.p.y&&e.y===this.p.y){var n=t.x,o=e.x;return n>o&&(n=e.x,o=t.x),void(this.p.x>=n&&this.p.x<=o&&(this.isPointOnSegment=!0))}if(t.y>this.p.y&&e.y<=this.p.y||e.y>this.p.y&&t.y<=this.p.y){var r=t.x-this.p.x,i=t.y-this.p.y,s=e.x-this.p.x,a=e.y-this.p.y,u=jsts.algorithm.RobustDeterminant.signOfDet2x2(r,i,s,a);if(0===u)return void(this.isPointOnSegment=!0);i>a&&(u=-u),u>0&&this.crossingCount++}}},jsts.algorithm.RayCrossingCounter.prototype.isOnSegment=function(){return jsts.geom.isPointOnSegment},jsts.algorithm.RayCrossingCounter.prototype.getLocation=function(){return this.isPointOnSegment?jsts.geom.Location.BOUNDARY:this.crossingCount%2===1?jsts.geom.Location.INTERIOR:jsts.geom.Location.EXTERIOR},jsts.algorithm.RayCrossingCounter.prototype.isPointInPolygon=function(){return this.getLocation()!==jsts.geom.Location.EXTERIOR},jsts.operation.BoundaryOp=function(t,e){this.geom=t,this.geomFact=t.getFactory(),this.bnRule=e||jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE},jsts.operation.BoundaryOp.prototype.geom=null,jsts.operation.BoundaryOp.prototype.geomFact=null,jsts.operation.BoundaryOp.prototype.bnRule=null,jsts.operation.BoundaryOp.prototype.getBoundary=function(){return this.geom instanceof jsts.geom.LineString?this.boundaryLineString(this.geom):this.geom instanceof jsts.geom.MultiLineString?this.boundaryMultiLineString(this.geom):this.geom.getBoundary()},jsts.operation.BoundaryOp.prototype.getEmptyMultiPoint=function(){return this.geomFact.createMultiPoint(null)},jsts.operation.BoundaryOp.prototype.boundaryMultiLineString=function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();var e=this.computeBoundaryCoordinates(t);return 1==e.length?this.geomFact.createPoint(e[0]):this.geomFact.createMultiPoint(e)},jsts.operation.BoundaryOp.prototype.endpoints=null,jsts.operation.BoundaryOp.prototype.computeBoundaryCoordinates=function(t){var e,n,o,r=[];for(this.endpoints=[],e=0;e<t.getNumGeometries();e++)n=t.getGeometryN(e),0!=n.getNumPoints()&&(this.addEndpoint(n.getCoordinateN(0)),this.addEndpoint(n.getCoordinateN(n.getNumPoints()-1)));for(e=0;e<this.endpoints.length;e++)o=this.endpoints[e],this.bnRule.isInBoundary(o.count)&&r.push(o.coordinate);return r},jsts.operation.BoundaryOp.prototype.addEndpoint=function(t){var e,n,o=!1;for(e=0;e<this.endpoints.length;e++)if(n=this.endpoints[e],n.coordinate.equals(t)){o=!0;break}o||(n={},n.coordinate=t,n.count=0,this.endpoints.push(n)),n.count++},jsts.operation.BoundaryOp.prototype.boundaryLineString=function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();if(t.isClosed()){var e=this.bnRule.isInBoundary(2);return e?t.getStartPoint():this.geomFact.createMultiPoint(null)}return this.geomFact.createMultiPoint([t.getStartPoint(),t.getEndPoint()])},jsts.operation.buffer.OffsetCurveSetBuilder=function(t,e,n){this.inputGeom=t,this.distance=e,this.curveBuilder=n,this.curveList=new javascript.util.ArrayList},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.inputGeom=null,jsts.operation.buffer.OffsetCurveSetBuilder.prototype.distance=null,jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveBuilder=null,jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveList=null,jsts.operation.buffer.OffsetCurveSetBuilder.prototype.getCurves=function(){return this.add(this.inputGeom),this.curveList},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCurve=function(t,e,n){if(!(null==t||t.length<2)){var o=new jsts.noding.NodedSegmentString(t,new jsts.geomgraph.Label(0,jsts.geom.Location.BOUNDARY,e,n));this.curveList.add(o)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.add=function(t){if(!t.isEmpty())if(t instanceof jsts.geom.Polygon)this.addPolygon(t);else if(t instanceof jsts.geom.LineString)this.addLineString(t);else if(t instanceof jsts.geom.Point)this.addPoint(t);else if(t instanceof jsts.geom.MultiPoint)this.addCollection(t);else if(t instanceof jsts.geom.MultiLineString)this.addCollection(t);else if(t instanceof jsts.geom.MultiPolygon)this.addCollection(t);else{if(!(t instanceof jsts.geom.GeometryCollection))throw new jsts.error.IllegalArgumentError;this.addCollection(t)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCollection=function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPoint=function(t){if(!(this.distance<=0)){var e=t.getCoordinates(),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addLineString=function(t){if(!(this.distance<=0)||this.curveBuilder.getBufferParameters().isSingleSided()){var e=jsts.geom.CoordinateArrays.removeRepeatedPoints(t.getCoordinates()),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygon=function(t){var e=this.distance,n=jsts.geomgraph.Position.LEFT;this.distance<0&&(e=-this.distance,n=jsts.geomgraph.Position.RIGHT);var o=t.getExteriorRing(),r=jsts.geom.CoordinateArrays.removeRepeatedPoints(o.getCoordinates());if(!(this.distance<0&&this.isErodedCompletely(o,this.distance)||this.distance<=0&&r.length<3)){this.addPolygonRing(r,e,n,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR);for(var i=0;i<t.getNumInteriorRing();i++){var s=t.getInteriorRingN(i),a=jsts.geom.CoordinateArrays.removeRepeatedPoints(s.getCoordinates());this.distance>0&&this.isErodedCompletely(s,-this.distance)||this.addPolygonRing(a,e,jsts.geomgraph.Position.opposite(n),jsts.geom.Location.INTERIOR,jsts.geom.Location.EXTERIOR)}}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygonRing=function(t,e,n,o,r){if(!(0==e&&t.length<jsts.geom.LinearRing.MINIMUM_VALID_SIZE)){var i=o,s=r;t.length>=jsts.geom.LinearRing.MINIMUM_VALID_SIZE&&jsts.algorithm.CGAlgorithms.isCCW(t)&&(i=r,s=o,n=jsts.geomgraph.Position.opposite(n));var a=this.curveBuilder.getRingCurve(t,n,e);this.addCurve(a,i,s)}},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isErodedCompletely=function(t,e){var n=t.getCoordinates();if(n.length<4)return 0>e;if(4==n.length)return this.isTriangleErodedCompletely(n,e);var o=t.getEnvelopeInternal(),r=Math.min(o.getHeight(),o.getWidth());return 0>e&&2*Math.abs(e)>r?!0:!1},jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isTriangleErodedCompletely=function(t,e){var n=new jsts.geom.Triangle(t[0],t[1],t[2]),o=n.inCentre(),r=jsts.algorithm.CGAlgorithms.distancePointLine(o,n.p0,n.p1);return r<Math.abs(e)},jsts.operation.buffer.BufferSubgraph=function(){this.dirEdgeList=new javascript.util.ArrayList,this.nodes=new javascript.util.ArrayList,this.finder=new jsts.operation.buffer.RightmostEdgeFinder},jsts.operation.buffer.BufferSubgraph.prototype.finder=null,jsts.operation.buffer.BufferSubgraph.prototype.dirEdgeList=null,jsts.operation.buffer.BufferSubgraph.prototype.nodes=null,jsts.operation.buffer.BufferSubgraph.prototype.rightMostCoord=null,jsts.operation.buffer.BufferSubgraph.prototype.env=null,jsts.operation.buffer.BufferSubgraph.prototype.getDirectedEdges=function(){return this.dirEdgeList},jsts.operation.buffer.BufferSubgraph.prototype.getNodes=function(){return this.nodes},jsts.operation.buffer.BufferSubgraph.prototype.getEnvelope=function(){if(null===this.env){for(var t=new jsts.geom.Envelope,e=this.dirEdgeList.iterator();e.hasNext();)for(var n=e.next(),o=n.getEdge().getCoordinates(),r=0;r<o.length-1;r++)t.expandToInclude(o[r]);this.env=t}return this.env},jsts.operation.buffer.BufferSubgraph.prototype.getRightmostCoordinate=function(){return this.rightMostCoord},jsts.operation.buffer.BufferSubgraph.prototype.create=function(t){this.addReachable(t),this.finder.findEdge(this.dirEdgeList),this.rightMostCoord=this.finder.getCoordinate()},jsts.operation.buffer.BufferSubgraph.prototype.addReachable=function(t){var e=[];for(e.push(t);0!==e.length;){var n=e.pop();this.add(n,e)}},jsts.operation.buffer.BufferSubgraph.prototype.add=function(t,e){t.setVisited(!0),this.nodes.add(t);for(var n=t.getEdges().iterator();n.hasNext();){var o=n.next();this.dirEdgeList.add(o);var r=o.getSym(),i=r.getNode();i.isVisited()||e.push(i)}},jsts.operation.buffer.BufferSubgraph.prototype.clearVisitedEdges=function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.setVisited(!1)}},jsts.operation.buffer.BufferSubgraph.prototype.computeDepth=function(t){this.clearVisitedEdges();{var e=this.finder.getEdge();e.getNode(),e.getLabel()}e.setEdgeDepths(jsts.geomgraph.Position.RIGHT,t),this.copySymDepths(e),this.computeDepths(e)},jsts.operation.buffer.BufferSubgraph.prototype.computeDepths=function(t){var e=[],n=[],o=t.getNode();for(n.push(o),e.push(o),t.setVisited(!0);0!==n.length;){var r=n.shift();e.push(r),this.computeNodeDepth(r);for(var i=r.getEdges().iterator();i.hasNext();){var s=i.next(),a=s.getSym();if(!a.isVisited()){var u=a.getNode();-1===e.indexOf(u)&&(n.push(u),e.push(u))}}}},jsts.operation.buffer.BufferSubgraph.prototype.computeNodeDepth=function(t){for(var e=null,n=t.getEdges().iterator();n.hasNext();){var o=n.next();if(o.isVisited()||o.getSym().isVisited()){e=o;break}}if(null==e)throw new jsts.error.TopologyError("unable to find edge to compute depths at "+t.getCoordinate());t.getEdges().computeDepths(e);for(var n=t.getEdges().iterator();n.hasNext();){var o=n.next();o.setVisited(!0),this.copySymDepths(o)}},jsts.operation.buffer.BufferSubgraph.prototype.copySymDepths=function(t){var e=t.getSym();e.setDepth(jsts.geomgraph.Position.LEFT,t.getDepth(jsts.geomgraph.Position.RIGHT)),e.setDepth(jsts.geomgraph.Position.RIGHT,t.getDepth(jsts.geomgraph.Position.LEFT))},jsts.operation.buffer.BufferSubgraph.prototype.findResultEdges=function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.getDepth(jsts.geomgraph.Position.RIGHT)>=1&&e.getDepth(jsts.geomgraph.Position.LEFT)<=0&&!e.isInteriorAreaEdge()&&e.setInResult(!0)}},jsts.operation.buffer.BufferSubgraph.prototype.compareTo=function(t){var e=t;return this.rightMostCoord.x<e.rightMostCoord.x?-1:this.rightMostCoord.x>e.rightMostCoord.x?1:0},jsts.simplify.DPTransformer=function(t,e){this.distanceTolerance=t,this.isEnsureValidTopology=e},jsts.simplify.DPTransformer.prototype=new jsts.geom.util.GeometryTransformer,jsts.simplify.DPTransformer.prototype.distanceTolerance=null,jsts.simplify.DPTransformer.prototype.isEnsureValidTopology=null,jsts.simplify.DPTransformer.prototype.transformCoordinates=function(t){var e=t,n=null;return n=0==e.length?[]:jsts.simplify.DouglasPeuckerLineSimplifier.simplify(e,this.distanceTolerance)},jsts.simplify.DPTransformer.prototype.transformPolygon=function(t,e){if(t.isEmpty())return null;var n=jsts.geom.util.GeometryTransformer.prototype.transformPolygon.apply(this,arguments);return e instanceof jsts.geom.MultiPolygon?n:this.createValidArea(n)},jsts.simplify.DPTransformer.prototype.transformLinearRing=function(t,e){var n=e instanceof jsts.geom.Polygon,o=jsts.geom.util.GeometryTransformer.prototype.transformLinearRing.apply(this,arguments);return!n||o instanceof jsts.geom.LinearRing?o:null},jsts.simplify.DPTransformer.prototype.transformMultiPolygon=function(){var t=jsts.geom.util.GeometryTransformer.prototype.transformMultiPolygon.apply(this,arguments);return this.createValidArea(t)},jsts.simplify.DPTransformer.prototype.createValidArea=function(t){return this.isEnsureValidTopology?t.buffer(0):t},jsts.geom.util.GeometryExtracter=function(t,e){this.clz=t,this.comps=e},jsts.geom.util.GeometryExtracter.prototype=new jsts.geom.GeometryFilter,jsts.geom.util.GeometryExtracter.prototype.clz=null,jsts.geom.util.GeometryExtracter.prototype.comps=null,jsts.geom.util.GeometryExtracter.extract=function(t,e,n){return n=n||new javascript.util.ArrayList,t instanceof e?n.add(t):(t instanceof jsts.geom.GeometryCollection||t instanceof jsts.geom.MultiPoint||t instanceof jsts.geom.MultiLineString||t instanceof jsts.geom.MultiPolygon)&&t.apply(new jsts.geom.util.GeometryExtracter(e,n)),n},jsts.geom.util.GeometryExtracter.prototype.filter=function(t){(null===this.clz||t instanceof this.clz)&&this.comps.add(t)},function(){var t=jsts.operation.overlay.OverlayOp,e=jsts.operation.overlay.snap.SnapOverlayOp,n=function(t,e){this.geom=[],this.geom[0]=t,this.geom[1]=e};n.overlayOp=function(t,e,o){var r=new n(t,e);return r.getResultGeometry(o)},n.intersection=function(e,n){return overlayOp(e,n,t.INTERSECTION)},n.union=function(e,n){return overlayOp(e,n,t.UNION)},n.difference=function(e,n){return overlayOp(e,n,t.DIFFERENCE)},n.symDifference=function(e,n){return overlayOp(e,n,t.SYMDIFFERENCE)},n.prototype.geom=null,n.prototype.getResultGeometry=function(n){var o=null,r=!1,i=null;try{o=t.overlayOp(this.geom[0],this.geom[1],n);var s=!0;s&&(r=!0)}catch(a){i=a}if(!r)try{o=e.overlayOp(this.geom[0],this.geom[1],n)}catch(a){throw i}return o},jsts.operation.overlay.snap.SnapIfNeededOverlayOp=n}(),function(){var t=jsts.geom.util.GeometryExtracter,e=jsts.operation.union.CascadedPolygonUnion,n=jsts.operation.union.PointGeometryUnion,o=jsts.operation.overlay.OverlayOp,r=jsts.operation.overlay.snap.SnapIfNeededOverlayOp,i=javascript.util.ArrayList;jsts.operation.union.UnaryUnionOp=function(t,e){this.polygons=new i,this.lines=new i,this.points=new i,e&&(this.geomFact=e),this.extract(t)},jsts.operation.union.UnaryUnionOp.union=function(t,e){var n=new jsts.operation.union.UnaryUnionOp(t,e);return n.union()},jsts.operation.union.UnaryUnionOp.prototype.polygons=null,jsts.operation.union.UnaryUnionOp.prototype.lines=null,jsts.operation.union.UnaryUnionOp.prototype.points=null,jsts.operation.union.UnaryUnionOp.prototype.geomFact=null,jsts.operation.union.UnaryUnionOp.prototype.extract=function(e){if(e instanceof i)for(var n=e.iterator();n.hasNext();){var o=n.next();this.extract(o)}else null===this.geomFact&&(this.geomFact=e.getFactory()),t.extract(e,jsts.geom.Polygon,this.polygons),t.extract(e,jsts.geom.LineString,this.lines),t.extract(e,jsts.geom.Point,this.points)},jsts.operation.union.UnaryUnionOp.prototype.union=function(){if(null===this.geomFact)return null;var t=null;if(this.points.size()>0){var o=this.geomFact.buildGeometry(this.points);t=this.unionNoOpt(o)}var r=null;if(this.lines.size()>0){var i=this.geomFact.buildGeometry(this.lines);r=this.unionNoOpt(i)}var s=null;this.polygons.size()>0&&(s=e.union(this.polygons));var a=this.unionWithNull(r,s),u=null;return u=null===t?a:null===a?t:n(t,a),null===u?this.geomFact.createGeometryCollection(null):u},jsts.operation.union.UnaryUnionOp.prototype.unionWithNull=function(t,e){return null===t&&null===e?null:null===e?t:null===t?e:t.union(e)},jsts.operation.union.UnaryUnionOp.prototype.unionNoOpt=function(t){var e=this.geomFact.createPoint(null);return r.overlayOp(t,e,o.UNION)}}(),jsts.index.kdtree.KdNode=function(){this.left=null,this.right=null,this.count=1,2===arguments.length?this.initializeFromCoordinate.apply(this,arguments[0],arguments[1]):3===arguments.length&&this.initializeFromXY.apply(this,arguments[0],arguments[1],arguments[2])},jsts.index.kdtree.KdNode.prototype.initializeFromXY=function(t,e,n){this.p=new jsts.geom.Coordinate(t,e),this.data=n},jsts.index.kdtree.KdNode.prototype.initializeFromCoordinate=function(t,e){this.p=t,this.data=e},jsts.index.kdtree.KdNode.prototype.getX=function(){return this.p.x},jsts.index.kdtree.KdNode.prototype.getY=function(){return this.p.y},jsts.index.kdtree.KdNode.prototype.getCoordinate=function(){return this.p},jsts.index.kdtree.KdNode.prototype.getData=function(){return this.data},jsts.index.kdtree.KdNode.prototype.getLeft=function(){return this.left},jsts.index.kdtree.KdNode.prototype.getRight=function(){return this.right},jsts.index.kdtree.KdNode.prototype.increment=function(){this.count+=1},jsts.index.kdtree.KdNode.prototype.getCount=function(){return this.count},jsts.index.kdtree.KdNode.prototype.isRepeated=function(){return count>1},jsts.index.kdtree.KdNode.prototype.setLeft=function(t){this.left=t},jsts.index.kdtree.KdNode.prototype.setRight=function(t){this.right=t},jsts.algorithm.InteriorPointPoint=function(t){this.minDistance=Number.MAX_VALUE,this.interiorPoint=null,this.centroid=t.getCentroid().getCoordinate(),this.add(t)},jsts.algorithm.InteriorPointPoint.prototype.add=function(t){if(t instanceof jsts.geom.Point)this.addPoint(t.getCoordinate());else if(t instanceof jsts.geom.GeometryCollection)for(var e=0;e<t.getNumGeometries();e++)this.add(t.getGeometryN(e))},jsts.algorithm.InteriorPointPoint.prototype.addPoint=function(t){var e=t.distance(this.centroid);e<this.minDistance&&(this.interiorPoint=new jsts.geom.Coordinate(t),this.minDistance=e)},jsts.algorithm.InteriorPointPoint.prototype.getInteriorPoint=function(){return this.interiorPoint},function(){jsts.geom.MultiLineString=function(t,e){this.geometries=t||[],this.factory=e},jsts.geom.MultiLineString.prototype=new jsts.geom.GeometryCollection,jsts.geom.MultiLineString.constructor=jsts.geom.MultiLineString,jsts.geom.MultiLineString.prototype.getBoundary=function(){return new jsts.operation.BoundaryOp(this).getBoundary()},jsts.geom.MultiLineString.prototype.equalsExact=function(t,e){return this.isEquivalentClass(t)?jsts.geom.GeometryCollection.prototype.equalsExact.call(this,t,e):!1},jsts.geom.MultiLineString.prototype.CLASS_NAME="jsts.geom.MultiLineString"}(),function(){var t=jsts.index.bintree.Interval,e=jsts.index.bintree.Root,n=function(){this.root=new e,this.minExtent=1};n.ensureExtent=function(e,n){var o,r;return o=e.getMin(),r=e.getMax(),o!==r?e:(o===r&&(o-=n/2,r=o+n/2),new t(o,r))},n.prototype.depth=function(){return null!==this.root?this.root.depth():0},n.prototype.size=function(){return null!==this.root?this.root.size():0},n.prototype.nodeSize=function(){return null!==this.root?this.root.nodeSize():0},n.prototype.insert=function(t,e){this.collectStats(t);var o=n.ensureExtent(t,this.minExtent);this.root.insert(o,e)},n.prototype.remove=function(t,e){var o=n.ensureExtent(t,this.minExtent);return this.root.remove(o,e)},n.prototype.iterator=function(){var t=new javascript.util.ArrayList;return this.root.addAllItems(t),t.iterator()},n.prototype.query=function(){if(2!==arguments.length){var e=arguments[0];return!e instanceof t&&(e=new t(e,e)),this.queryInterval(e)}this.queryAndAdd(arguments[0],arguments[1])},n.prototype.queryInterval=function(t){var e=new javascript.util.ArrayList;return this.query(t,e),e},n.prototype.queryAndAdd=function(t,e){this.root.addAllItemsFromOverlapping(t,e)},n.prototype.collectStats=function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e)},jsts.index.bintree.Bintree=n}(),jsts.algorithm.InteriorPointArea=function(t){this.factory,this.interiorPoint=null,this.maxWidth=0,this.factory=t.getFactory(),this.add(t)},jsts.algorithm.InteriorPointArea.avg=function(t,e){return(t+e)/2},jsts.algorithm.InteriorPointArea.prototype.getInteriorPoint=function(){return this.interiorPoint},jsts.algorithm.InteriorPointArea.prototype.add=function(t){if(t instanceof jsts.geom.Polygon)this.addPolygon(t);else if(t instanceof jsts.geom.GeometryCollection)for(var e=0;e<t.getNumGeometries();e++)this.add(t.getGeometryN(e))},jsts.algorithm.InteriorPointArea.prototype.addPolygon=function(t){if(!t.isEmpty()){var e,n=0,o=this.horizontalBisector(t);if(0==o.getLength())n=0,e=o.getCoordinate();else{var r=o.intersection(t),i=this.widestGeometry(r);n=i.getEnvelopeInternal().getWidth(),e=this.centre(i.getEnvelopeInternal())}(null==this.interiorPoint||n>this.maxWidth)&&(this.interiorPoint=e,this.maxWidth=n)}},jsts.algorithm.InteriorPointArea.prototype.widestGeometry=function(t){if(t instanceof jsts.geom.GeometryCollection){var e=t;if(e.isEmpty())return e;for(var n=e.getGeometryN(0),o=1;o<e.getNumGeometries();o++)e.getGeometryN(o).getEnvelopeInternal().getWidth()>n.getEnvelopeInternal().getWidth()&&(n=e.getGeometryN(o));return n}return t instanceof jsts.geom.Geometry?t:void 0},jsts.algorithm.InteriorPointArea.prototype.horizontalBisector=function(t){var e=t.getEnvelopeInternal(),n=jsts.algorithm.SafeBisectorFinder.getBisectorY(t);return this.factory.createLineString([new jsts.geom.Coordinate(e.getMinX(),n),new jsts.geom.Coordinate(e.getMaxX(),n)])},jsts.algorithm.InteriorPointArea.prototype.centre=function(t){return new jsts.geom.Coordinate(jsts.algorithm.InteriorPointArea.avg(t.getMinX(),t.getMaxX()),jsts.algorithm.InteriorPointArea.avg(t.getMinY(),t.getMaxY()))},jsts.algorithm.SafeBisectorFinder=function(t){this.poly,this.centreY,this.hiY=Number.MAX_VALUE,this.loY=-Number.MAX_VALUE,this.poly=t,this.hiY=t.getEnvelopeInternal().getMaxY(),this.loY=t.getEnvelopeInternal().getMinY(),this.centreY=jsts.algorithm.InteriorPointArea.avg(this.loY,this.hiY)},jsts.algorithm.SafeBisectorFinder.getBisectorY=function(t){var e=new jsts.algorithm.SafeBisectorFinder(t);return e.getBisectorY()},jsts.algorithm.SafeBisectorFinder.prototype.getBisectorY=function(){this.process(this.poly.getExteriorRing());for(var t=0;t<this.poly.getNumInteriorRing();t++)this.process(this.poly.getInteriorRingN(t));var e=jsts.algorithm.InteriorPointArea.avg(this.hiY,this.loY);return e},jsts.algorithm.SafeBisectorFinder.prototype.process=function(t){for(var e=t.getCoordinateSequence(),n=0;n<e.length;n++){var o=e[n].y;this.updateInterval(o)}},jsts.algorithm.SafeBisectorFinder.prototype.updateInterval=function(t){t<=this.centreY?t>this.loY&&(this.loY=t):t>this.centreY&&t<this.hiY&&(this.hiY=t)},jsts.operation.buffer.BufferParameters=function(t,e,n,o){t&&this.setQuadrantSegments(t),e&&this.setEndCapStyle(e),n&&this.setJoinStyle(n),o&&this.setMitreLimit(o)},jsts.operation.buffer.BufferParameters.CAP_ROUND=1,jsts.operation.buffer.BufferParameters.CAP_FLAT=2,jsts.operation.buffer.BufferParameters.CAP_SQUARE=3,jsts.operation.buffer.BufferParameters.JOIN_ROUND=1,jsts.operation.buffer.BufferParameters.JOIN_MITRE=2,jsts.operation.buffer.BufferParameters.JOIN_BEVEL=3,jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS=8,jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT=5,jsts.operation.buffer.BufferParameters.prototype.quadrantSegments=jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS,jsts.operation.buffer.BufferParameters.prototype.endCapStyle=jsts.operation.buffer.BufferParameters.CAP_ROUND,jsts.operation.buffer.BufferParameters.prototype.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_ROUND,jsts.operation.buffer.BufferParameters.prototype.mitreLimit=jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT,jsts.operation.buffer.BufferParameters.prototype._isSingleSided=!1,jsts.operation.buffer.BufferParameters.prototype.getQuadrantSegments=function(){return this.quadrantSegments},jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments=function(t){this.quadrantSegments=t},jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments=function(t){this.quadrantSegments=t,0===this.quadrantSegments&&(this.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_BEVEL),this.quadrantSegments<0&&(this.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_MITRE,this.mitreLimit=Math.abs(this.quadrantSegments)),0>=t&&(this.quadrantSegments=1),this.joinStyle!==jsts.operation.buffer.BufferParameters.JOIN_ROUND&&(this.quadrantSegments=jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS)},jsts.operation.buffer.BufferParameters.bufferDistanceError=function(t){var e=Math.PI/2/t;return 1-Math.cos(e/2)},jsts.operation.buffer.BufferParameters.prototype.getEndCapStyle=function(){return this.endCapStyle},jsts.operation.buffer.BufferParameters.prototype.setEndCapStyle=function(t){this.endCapStyle=t},jsts.operation.buffer.BufferParameters.prototype.getJoinStyle=function(){return this.joinStyle},jsts.operation.buffer.BufferParameters.prototype.setJoinStyle=function(t){this.joinStyle=t},jsts.operation.buffer.BufferParameters.prototype.getMitreLimit=function(){return this.mitreLimit},jsts.operation.buffer.BufferParameters.prototype.setMitreLimit=function(t){this.mitreLimit=t},jsts.operation.buffer.BufferParameters.prototype.setSingleSided=function(t){this._isSingleSided=t},jsts.operation.buffer.BufferParameters.prototype.isSingleSided=function(){return this._isSingleSided},function(){jsts.geom.util.ShortCircuitedGeometryVisitor=function(){},jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.isDone=!1,jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.applyTo=function(t){for(var e=0;e<t.getNumGeometries()&&!this.isDone;e++){var n=t.getGeometryN(e);if(n instanceof jsts.geom.GeometryCollection)this.applyTo(n);else if(this.visit(n),this.isDone())return void(this.isDone=!0)}},jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.visit=function(){},jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.isDone=function(){}}(),function(){var t=function(t){this.rectEnv=t};t.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor,t.constructor=t,t.prototype.rectEnv=null,t.prototype.intersects=!1,t.prototype.intersects=function(){return this.intersects},t.prototype.visit=function(t){var e=t.getEnvelopeInternal();if(this.rectEnv.intersects(e))return this.rectEnv.contains(e)?void(this.intersects=!0):e.getMinX()>=rectEnv.getMinX()&&e.getMaxX()<=rectEnv.getMaxX()?void(this.intersects=!0):e.getMinY()>=rectEnv.getMinY()&&e.getMaxY()<=rectEnv.getMaxY()?void(this.intersects=!0):void 0},t.prototype.isDone=function(){return 1==this.intersects};var e=function(t){this.rectSeq=t.getExteriorRing().getCoordinateSequence(),this.rectEnv=t.getEnvelopeInternal()};e.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor,e.constructor=e,e.prototype.rectSeq=null,e.prototype.rectEnv=null,e.prototype.containsPoint=!1,e.prototype.containsPoint=function(){return this.containsPoint},e.prototype.visit=function(t){if(t instanceof jsts.geom.Polygon){var e=t.getEnvelopeInternal();if(this.rectEnv.intersects(e))for(var n=new jsts.geom.Coordinate,o=0;4>o;o++)if(this.rectSeq.getCoordinate(o,n),e.contains(n)&&SimplePointInAreaLocator.containsPointInPolygon(n,t))return void(this.containsPoint=!0)}},e.prototype.isDone=function(){return 1==this.containsPoint};var n=function(t){this.rectEnv=t.getEnvelopeInternal(),this.rectIntersector=new RectangleLineIntersector(rectEnv)};n.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor,n.constructor=n,n.prototype.rectEnv=null,n.prototype.rectIntersector=null,n.prototype.hasIntersection=!1,n.prototype.p0=null,n.prototype.p1=null,n.prototype.intersects=function(){return this.hasIntersection},n.prototype.visit=function(t){var e=t.getEnvelopeInternal();if(this.rectEnv.intersects(e)){var n=LinearComponentExtracter.getLines(t);this.checkIntersectionWithLineStrings(n)}},n.prototype.checkIntersectionWithLineStrings=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();if(this.checkIntersectionWithSegments(n),this.hasIntersection)return}},n.prototype.checkIntersectionWithSegments=function(t){for(var e=t.getCoordinateSequence(),n=1;n<e.length;n++)if(this.p0=e[n-1],this.p1=e[n],rectIntersector.intersects(p0,p1))return void(this.hasIntersection=!0)},n.prototype.isDone=function(){return 1==this.hasIntersection},jsts.operation.predicate.RectangleIntersects=function(t){this.rectangle=t,this.rectEnv=t.getEnvelopeInternal()
},jsts.operation.predicate.RectangleIntersects.intersects=function(t,e){var n=new jsts.operation.predicate.RectangleIntersects(t);return n.intersects(e)},jsts.operation.predicate.RectangleIntersects.prototype.rectangle=null,jsts.operation.predicate.RectangleIntersects.prototype.rectEnv=null,jsts.operation.predicate.RectangleIntersects.prototype.intersects=function(o){if(!this.rectEnv.intersects(o.getEnvelopeInternal()))return!1;var r=new t(this.rectEnv);if(r.applyTo(o),r.intersects())return!0;var i=new e(rectangle);if(i.applyTo(o),i.containsPoint())return!0;var s=new n(rectangle);return s.applyTo(o),s.intersects()?!0:!1}}(),jsts.operation.buffer.BufferBuilder=function(t){this.bufParams=t,this.edgeList=new jsts.geomgraph.EdgeList},jsts.operation.buffer.BufferBuilder.depthDelta=function(t){var e=t.getLocation(0,jsts.geomgraph.Position.LEFT),n=t.getLocation(0,jsts.geomgraph.Position.RIGHT);return e===jsts.geom.Location.INTERIOR&&n===jsts.geom.Location.EXTERIOR?1:e===jsts.geom.Location.EXTERIOR&&n===jsts.geom.Location.INTERIOR?-1:0},jsts.operation.buffer.BufferBuilder.prototype.bufParams=null,jsts.operation.buffer.BufferBuilder.prototype.workingPrecisionModel=null,jsts.operation.buffer.BufferBuilder.prototype.workingNoder=null,jsts.operation.buffer.BufferBuilder.prototype.geomFact=null,jsts.operation.buffer.BufferBuilder.prototype.graph=null,jsts.operation.buffer.BufferBuilder.prototype.edgeList=null,jsts.operation.buffer.BufferBuilder.prototype.setWorkingPrecisionModel=function(t){this.workingPrecisionModel=t},jsts.operation.buffer.BufferBuilder.prototype.setNoder=function(t){this.workingNoder=t},jsts.operation.buffer.BufferBuilder.prototype.buffer=function(t,e){var n=this.workingPrecisionModel;null===n&&(n=t.getPrecisionModel()),this.geomFact=t.getFactory();var o=new jsts.operation.buffer.OffsetCurveBuilder(n,this.bufParams),r=new jsts.operation.buffer.OffsetCurveSetBuilder(t,e,o),i=r.getCurves();if(i.size()<=0)return this.createEmptyResultGeometry();this.computeNodedEdges(i,n),this.graph=new jsts.geomgraph.PlanarGraph(new jsts.operation.overlay.OverlayNodeFactory),this.graph.addEdges(this.edgeList.getEdges());var s=this.createSubgraphs(this.graph),a=new jsts.operation.overlay.PolygonBuilder(this.geomFact);this.buildSubgraphs(s,a);var u=a.getPolygons();if(u.size()<=0)return this.createEmptyResultGeometry();var p=this.geomFact.buildGeometry(u);return p},jsts.operation.buffer.BufferBuilder.prototype.getNoder=function(t){if(null!==this.workingNoder)return this.workingNoder;var e=new jsts.noding.MCIndexNoder,n=new jsts.algorithm.RobustLineIntersector;return n.setPrecisionModel(t),e.setSegmentIntersector(new jsts.noding.IntersectionAdder(n)),e},jsts.operation.buffer.BufferBuilder.prototype.computeNodedEdges=function(t,e){var n=this.getNoder(e);n.computeNodes(t);for(var o=n.getNodedSubstrings(),r=o.iterator();r.hasNext();){var i=r.next(),s=i.getData(),a=new jsts.geomgraph.Edge(i.getCoordinates(),new jsts.geomgraph.Label(s));this.insertUniqueEdge(a)}},jsts.operation.buffer.BufferBuilder.prototype.insertUniqueEdge=function(t){var e=this.edgeList.findEqualEdge(t);if(null!=e){var n=e.getLabel(),o=t.getLabel();e.isPointwiseEqual(t)||(o=new jsts.geomgraph.Label(t.getLabel()),o.flip()),n.merge(o);var r=jsts.operation.buffer.BufferBuilder.depthDelta(o),i=e.getDepthDelta(),s=i+r;e.setDepthDelta(s)}else this.edgeList.add(t),t.setDepthDelta(jsts.operation.buffer.BufferBuilder.depthDelta(t.getLabel()))},jsts.operation.buffer.BufferBuilder.prototype.createSubgraphs=function(t){for(var e=[],n=t.getNodes().iterator();n.hasNext();){var o=n.next();if(!o.isVisited()){var r=new jsts.operation.buffer.BufferSubgraph;r.create(o),e.push(r)}}var i=function(t,e){return t.compareTo(e)};return e.sort(i),e.reverse(),e},jsts.operation.buffer.BufferBuilder.prototype.buildSubgraphs=function(t,e){for(var n=[],o=0;o<t.length;o++){var r=t[o],i=r.getRightmostCoordinate(),s=new jsts.operation.buffer.SubgraphDepthLocater(n),a=s.getDepth(i);r.computeDepth(a),r.findResultEdges(),n.push(r),e.add(r.getDirectedEdges(),r.getNodes())}},jsts.operation.buffer.BufferBuilder.convertSegStrings=function(t){for(var e=new jsts.geom.GeometryFactory,n=new javascript.util.ArrayList;t.hasNext();){var o=t.next(),r=e.createLineString(o.getCoordinates());n.add(r)}return e.buildGeometry(n)},jsts.operation.buffer.BufferBuilder.prototype.createEmptyResultGeometry=function(){var t=this.geomFact.createPolygon(null,null);return t},jsts.noding.SegmentPointComparator=function(){},jsts.noding.SegmentPointComparator.compare=function(t,e,n){if(e.equals2D(n))return 0;var o=jsts.noding.SegmentPointComparator.relativeSign(e.x,n.x),r=jsts.noding.SegmentPointComparator.relativeSign(e.y,n.y);switch(t){case 0:return jsts.noding.SegmentPointComparator.compareValue(o,r);case 1:return jsts.noding.SegmentPointComparator.compareValue(r,o);case 2:return jsts.noding.SegmentPointComparator.compareValue(r,-o);case 3:return jsts.noding.SegmentPointComparator.compareValue(-o,r);case 4:return jsts.noding.SegmentPointComparator.compareValue(-o,-r);case 5:return jsts.noding.SegmentPointComparator.compareValue(-r,-o);case 6:return jsts.noding.SegmentPointComparator.compareValue(-r,o);case 7:return jsts.noding.SegmentPointComparator.compareValue(o,-r)}return 0},jsts.noding.SegmentPointComparator.relativeSign=function(t,e){return e>t?-1:t>e?1:0},jsts.noding.SegmentPointComparator.compareValue=function(t,e){return 0>t?-1:t>0?1:0>e?-1:e>0?1:0},jsts.operation.relate.RelateOp=function(){jsts.operation.GeometryGraphOperation.apply(this,arguments),this._relate=new jsts.operation.relate.RelateComputer(this.arg)},jsts.operation.relate.RelateOp.prototype=new jsts.operation.GeometryGraphOperation,jsts.operation.relate.RelateOp.relate=function(t,e,n){var o=new jsts.operation.relate.RelateOp(t,e,n),r=o.getIntersectionMatrix();return r},jsts.operation.relate.RelateOp.prototype._relate=null,jsts.operation.relate.RelateOp.prototype.getIntersectionMatrix=function(){return this._relate.computeIM()},jsts.index.chain.MonotoneChain=function(t,e,n,o){this.pts=t,this.start=e,this.end=n,this.context=o},jsts.index.chain.MonotoneChain.prototype.pts=null,jsts.index.chain.MonotoneChain.prototype.start=null,jsts.index.chain.MonotoneChain.prototype.end=null,jsts.index.chain.MonotoneChain.prototype.env=null,jsts.index.chain.MonotoneChain.prototype.context=null,jsts.index.chain.MonotoneChain.prototype.id=null,jsts.index.chain.MonotoneChain.prototype.setId=function(t){this.id=t},jsts.index.chain.MonotoneChain.prototype.getId=function(){return this.id},jsts.index.chain.MonotoneChain.prototype.getContext=function(){return this.context},jsts.index.chain.MonotoneChain.prototype.getEnvelope=function(){if(null==this.env){var t=this.pts[this.start],e=this.pts[this.end];this.env=new jsts.geom.Envelope(t,e)}return this.env},jsts.index.chain.MonotoneChain.prototype.getStartIndex=function(){return this.start},jsts.index.chain.MonotoneChain.prototype.getEndIndex=function(){return this.end},jsts.index.chain.MonotoneChain.prototype.getLineSegment=function(t,e){e.p0=this.pts[t],e.p1=this.pts[t+1]},jsts.index.chain.MonotoneChain.prototype.getCoordinates=function(){for(var t=[],e=0,n=this.start;n<=this.end;n++)t[e++]=this.pts[n];return t},jsts.index.chain.MonotoneChain.prototype.select=function(t,e){this.computeSelect2(t,this.start,this.end,e)},jsts.index.chain.MonotoneChain.prototype.computeSelect2=function(t,e,n,o){var r=this.pts[e],i=this.pts[n];if(o.tempEnv1.init(r,i),n-e===1)return void o.select(this,e);if(t.intersects(o.tempEnv1)){var s=parseInt((e+n)/2);s>e&&this.computeSelect2(t,e,s,o),n>s&&this.computeSelect2(t,s,n,o)}},jsts.index.chain.MonotoneChain.prototype.computeOverlaps=function(t,e){return 6===arguments.length?this.computeOverlaps2.apply(this,arguments):void this.computeOverlaps2(this.start,this.end,t,t.start,t.end,e)},jsts.index.chain.MonotoneChain.prototype.computeOverlaps2=function(t,e,n,o,r,i){var s=this.pts[t],a=this.pts[e],u=n.pts[o],p=n.pts[r];if(e-t===1&&r-o===1)return void i.overlap(this,t,n,o);if(i.tempEnv1.init(s,a),i.tempEnv2.init(u,p),i.tempEnv1.intersects(i.tempEnv2)){var g=parseInt((t+e)/2),l=parseInt((o+r)/2);g>t&&(l>o&&this.computeOverlaps2(t,g,n,o,l,i),r>l&&this.computeOverlaps2(t,g,n,l,r,i)),e>g&&(l>o&&this.computeOverlaps2(g,e,n,o,l,i),r>l&&this.computeOverlaps2(g,e,n,l,r,i))}},function(){var t=jsts.geom.Location,e=jsts.geom.Dimension;jsts.geom.IntersectionMatrix=function(n){var o=n;void 0===n||null===n?(this.matrix=[[],[],[]],this.setAll(e.FALSE)):"string"==typeof n?this.set(n):o instanceof jsts.geom.IntersectionMatrix&&(this.matrix[t.INTERIOR][t.INTERIOR]=o.matrix[t.INTERIOR][t.INTERIOR],this.matrix[t.INTERIOR][t.BOUNDARY]=o.matrix[t.INTERIOR][t.BOUNDARY],this.matrix[t.INTERIOR][t.EXTERIOR]=o.matrix[t.INTERIOR][t.EXTERIOR],this.matrix[t.BOUNDARY][t.INTERIOR]=o.matrix[t.BOUNDARY][t.INTERIOR],this.matrix[t.BOUNDARY][t.BOUNDARY]=o.matrix[t.BOUNDARY][t.BOUNDARY],this.matrix[t.BOUNDARY][t.EXTERIOR]=o.matrix[t.BOUNDARY][t.EXTERIOR],this.matrix[t.EXTERIOR][t.INTERIOR]=o.matrix[t.EXTERIOR][t.INTERIOR],this.matrix[t.EXTERIOR][t.BOUNDARY]=o.matrix[t.EXTERIOR][t.BOUNDARY],this.matrix[t.EXTERIOR][t.EXTERIOR]=o.matrix[t.EXTERIOR][t.EXTERIOR])},jsts.geom.IntersectionMatrix.prototype.matrix=null,jsts.geom.IntersectionMatrix.prototype.add=function(t){var e,n;for(e=0;3>e;e++)for(n=0;3>n;n++)this.setAtLeast(e,n,t.get(e,n))},jsts.geom.IntersectionMatrix.matches=function(t,n){return"string"==typeof t?jsts.geom.IntersectionMatrix.matches2.call(this,arguments):"*"===n?!0:"T"===n&&(t>=0||t===e.TRUE)?!0:"F"===n&&t===e.FALSE?!0:"0"===n&&t===e.P?!0:"1"===n&&t===e.L?!0:"2"===n&&t===e.A?!0:!1},jsts.geom.IntersectionMatrix.matches2=function(t,e){var n=new jsts.geom.IntersectionMatrix(t);return n.matches(e)},jsts.geom.IntersectionMatrix.prototype.set=function(t,e,n){return"string"==typeof t?void this.set2(t):void(this.matrix[t][e]=n)},jsts.geom.IntersectionMatrix.prototype.set2=function(t){for(var n=0;n<t.length();n++){var o=n/3,r=n%3;this.matrix[o][r]=e.toDimensionValue(t.charAt(n))}},jsts.geom.IntersectionMatrix.prototype.setAtLeast=function(t,e,n){return 1===arguments.length?void this.setAtLeast2(arguments[0]):void(this.matrix[t][e]<n&&(this.matrix[t][e]=n))},jsts.geom.IntersectionMatrix.prototype.setAtLeastIfValid=function(t,e,n){t>=0&&e>=0&&this.setAtLeast(t,e,n)},jsts.geom.IntersectionMatrix.prototype.setAtLeast2=function(t){var e;for(e=0;e<t.length;e++){var n=parseInt(e/3),o=parseInt(e%3);this.setAtLeast(n,o,jsts.geom.Dimension.toDimensionValue(t.charAt(e)))}},jsts.geom.IntersectionMatrix.prototype.setAll=function(t){var e,n;for(e=0;3>e;e++)for(n=0;3>n;n++)this.matrix[e][n]=t},jsts.geom.IntersectionMatrix.prototype.get=function(t,e){return this.matrix[t][e]},jsts.geom.IntersectionMatrix.prototype.isDisjoint=function(){return this.matrix[t.INTERIOR][t.INTERIOR]===e.FALSE&&this.matrix[t.INTERIOR][t.BOUNDARY]===e.FALSE&&this.matrix[t.BOUNDARY][t.INTERIOR]===e.FALSE&&this.matrix[t.BOUNDARY][t.BOUNDARY]===e.FALSE},jsts.geom.IntersectionMatrix.prototype.isIntersects=function(){return!this.isDisjoint()},jsts.geom.IntersectionMatrix.prototype.isTouches=function(n,o){return n>o?this.isTouches(o,n):n==e.A&&o==e.A||n==e.L&&o==e.L||n==e.L&&o==e.A||n==e.P&&o==e.A||n==e.P&&o==e.L?this.matrix[t.INTERIOR][t.INTERIOR]===e.FALSE&&(jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.BOUNDARY],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.INTERIOR],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.BOUNDARY],"T")):!1},jsts.geom.IntersectionMatrix.prototype.isCrosses=function(n,o){return n==e.P&&o==e.L||n==e.P&&o==e.A||n==e.L&&o==e.A?jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.EXTERIOR],"T"):n==e.L&&o==e.P||n==e.A&&o==e.P||n==e.A&&o==e.L?jsts.geom.IntersectionMatrix.matches(matrix[t.INTERIOR][t.INTERIOR],"T")&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.EXTERIOR][t.INTERIOR],"T"):n===e.L&&o===e.L?0===this.matrix[t.INTERIOR][t.INTERIOR]:!1},jsts.geom.IntersectionMatrix.prototype.isWithin=function(){return jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")&&this.matrix[t.INTERIOR][t.EXTERIOR]==e.FALSE&&this.matrix[t.BOUNDARY][t.EXTERIOR]==e.FALSE},jsts.geom.IntersectionMatrix.prototype.isContains=function(){return jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")&&this.matrix[t.EXTERIOR][t.INTERIOR]==e.FALSE&&this.matrix[t.EXTERIOR][t.BOUNDARY]==e.FALSE},jsts.geom.IntersectionMatrix.prototype.isCovers=function(){var n=jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.BOUNDARY],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.INTERIOR],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.BOUNDARY],"T");return n&&this.matrix[t.EXTERIOR][t.INTERIOR]==e.FALSE&&this.matrix[t.EXTERIOR][t.BOUNDARY]==e.FALSE},jsts.geom.IntersectionMatrix.prototype.isCoveredBy=function(){var n=jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.BOUNDARY],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.INTERIOR],"T")||jsts.geom.IntersectionMatrix.matches(this.matrix[t.BOUNDARY][t.BOUNDARY],"T");return n&&this.matrix[t.INTERIOR][t.EXTERIOR]===e.FALSE&&this.matrix[t.BOUNDARY][t.EXTERIOR]===e.FALSE},jsts.geom.IntersectionMatrix.prototype.isEquals=function(n,o){return n!==o?!1:jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")&&this.matrix[t.EXTERIOR][t.INTERIOR]===e.FALSE&&this.matrix[t.INTERIOR][t.EXTERIOR]===e.FALSE&&this.matrix[t.EXTERIOR][t.BOUNDARY]===e.FALSE&&this.matrix[t.BOUNDARY][t.EXTERIOR]===e.FALSE},jsts.geom.IntersectionMatrix.prototype.isOverlaps=function(n,o){return n==e.P&&o===e.P||n==e.A&&o===e.A?jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.INTERIOR],"T")&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.EXTERIOR],"T")&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.EXTERIOR][t.INTERIOR],"T"):n===e.L&&o===e.L?1==this.matrix[t.INTERIOR][t.INTERIOR]&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.INTERIOR][t.EXTERIOR],"T")&&jsts.geom.IntersectionMatrix.matches(this.matrix[t.EXTERIOR][t.INTERIOR],"T"):!1},jsts.geom.IntersectionMatrix.prototype.matches=function(t){if(9!=t.length)throw new jsts.error.IllegalArgumentException("Should be length 9: "+t);for(var e=0;3>e;e++)for(var n=0;3>n;n++)if(!jsts.geom.IntersectionMatrix.matches(this.matrix[e][n],t.charAt(3*e+n)))return!1;return!0},jsts.geom.IntersectionMatrix.prototype.transpose=function(){var t=matrix[1][0];return this.matrix[1][0]=this.matrix[0][1],this.matrix[0][1]=t,t=this.matrix[2][0],this.matrix[2][0]=this.matrix[0][2],this.matrix[0][2]=t,t=this.matrix[2][1],this.matrix[2][1]=this.matrix[1][2],this.matrix[1][2]=t,this},jsts.geom.IntersectionMatrix.prototype.toString=function(){var t,n,o="";for(t=0;3>t;t++)for(n=0;3>n;n++)o+=e.toDimensionSymbol(this.matrix[t][n]);return o}}(),jsts.triangulate.quadedge.LastFoundQuadEdgeLocator=function(t){this.subdiv=t,this.lastEdge=null,this.init()},jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.init=function(){this.lastEdge=this.findEdge()},jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.findEdge=function(){var t=this.subdiv.getEdges();return t[0]},jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.locate=function(t){this.lastEdge.isLive()||this.init();var e=this.subdiv.locateFromEdge(t,this.lastEdge);return this.lastEdge=e,e},jsts.noding.SegmentNodeList=function(t){this.nodeMap=new javascript.util.TreeMap,this.edge=t},jsts.noding.SegmentNodeList.prototype.nodeMap=null,jsts.noding.SegmentNodeList.prototype.iterator=function(){return this.nodeMap.values().iterator()},jsts.noding.SegmentNodeList.prototype.edge=null,jsts.noding.SegmentNodeList.prototype.getEdge=function(){return this.edge},jsts.noding.SegmentNodeList.prototype.add=function(t,e){var n=new jsts.noding.SegmentNode(this.edge,t,e,this.edge.getSegmentOctant(e)),o=this.nodeMap.get(n);return null!==o?(jsts.util.Assert.isTrue(o.coord.equals2D(t),"Found equal nodes with different coordinates"),o):(this.nodeMap.put(n,n),n)},jsts.noding.SegmentNodeList.prototype.addEndpoints=function(){var t=this.edge.size()-1;this.add(this.edge.getCoordinate(0),0),this.add(this.edge.getCoordinate(t),t)},jsts.noding.SegmentNodeList.prototype.addCollapsedNodes=function(){var t=[];this.findCollapsesFromInsertedNodes(t),this.findCollapsesFromExistingVertices(t);for(var e=0;e<t.length;e++){var n=t[e];this.add(this.edge.getCoordinate(n),n)}},jsts.noding.SegmentNodeList.prototype.findCollapsesFromExistingVertices=function(t){for(var e=0;e<this.edge.size()-2;e++){var n=this.edge.getCoordinate(e),o=(this.edge.getCoordinate(e+1),this.edge.getCoordinate(e+2));n.equals2D(o)&&t.push(e+1)}},jsts.noding.SegmentNodeList.prototype.findCollapsesFromInsertedNodes=function(t){for(var e=[null],n=this.iterator(),o=n.next();n.hasNext();){var r=n.next(),i=this.findCollapseIndex(o,r,e);i&&t.push(e[0]),o=r}},jsts.noding.SegmentNodeList.prototype.findCollapseIndex=function(t,e,n){if(!t.coord.equals2D(e.coord))return!1;var o=e.segmentIndex-t.segmentIndex;return e.isInterior()||o--,1===o?(n[0]=t.segmentIndex+1,!0):!1},jsts.noding.SegmentNodeList.prototype.addSplitEdges=function(t){this.addEndpoints(),this.addCollapsedNodes();for(var e=this.iterator(),n=e.next();e.hasNext();){var o=e.next(),r=this.createSplitEdge(n,o);t.add(r),n=o}},jsts.noding.SegmentNodeList.prototype.checkSplitEdgesCorrectness=function(t){var e=edge.getCoordinates(),n=t[0],o=n.getCoordinate(0);if(!o.equals2D(e[0]))throw new Error("bad split edge start point at "+o);var r=t[t.length-1],i=r.getCoordinates(),s=i[i.length-1];if(!s.equals2D(e[e.length-1]))throw new Error("bad split edge end point at "+s)},jsts.noding.SegmentNodeList.prototype.createSplitEdge=function(t,e){var n=e.segmentIndex-t.segmentIndex+2,o=this.edge.getCoordinate(e.segmentIndex),r=e.isInterior()||!e.coord.equals2D(o);r||n--;var i=[],s=0;i[s++]=new jsts.geom.Coordinate(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)i[s++]=this.edge.getCoordinate(a);return r&&(i[s]=e.coord),new jsts.noding.NodedSegmentString(i,this.edge.getData())},jsts.io.WKTWriter=function(){this.parser=new jsts.io.WKTParser(this.geometryFactory)},jsts.io.WKTWriter.prototype.write=function(t){var e=this.parser.write(t);return e},jsts.io.WKTWriter.toLineString=function(t,e){if(2!==arguments.length)throw new jsts.error.NotImplementedError;return"LINESTRING ( "+t.x+" "+t.y+", "+e.x+" "+e.y+" )"},jsts.io.WKTReader=function(t){this.geometryFactory=t||new jsts.geom.GeometryFactory,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new jsts.io.WKTParser(this.geometryFactory)},jsts.io.WKTReader.prototype.read=function(t){var e=this.parser.read(t);return this.precisionModel.getType()===jsts.geom.PrecisionModel.FIXED&&this.reducePrecision(e),e},jsts.io.WKTReader.prototype.reducePrecision=function(t){var e,n;if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(e=0,n=t.points.length;n>e;e++)this.precisionModel.makePrecise(t.points[e]);else if(t.geometries)for(e=0,n=t.geometries.length;n>e;e++)this.reducePrecision(t.geometries[e])},jsts.triangulate.quadedge.QuadEdgeSubdivision=function(t,e){this.tolerance=e,this.edgeCoincidenceTolerance=e/jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR,this.visitedKey=0,this.quadEdges=[],this.startingEdge,this.tolerance,this.edgeCoincidenceTolerance,this.frameEnv,this.locator=null,this.seg=new jsts.geom.LineSegment,this.triEdges=new Array(3),this.frameVertex=new Array(3),this.createFrame(t),this.startingEdge=this.initSubdiv(),this.locator=new jsts.triangulate.quadedge.LastFoundQuadEdgeLocator(this)},jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR=1e3,jsts.triangulate.quadedge.QuadEdgeSubdivision.getTriangleEdges=function(t,e){if(e[0]=t,e[1]=e[0].lNext(),e[2]=e[1].lNext(),e[2].lNext()!=e[0])throw new jsts.IllegalArgumentError("Edges do not form a triangle")},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.createFrame=function(t){var e,n,o;e=t.getWidth(),n=t.getHeight(),o=0,o=e>n?10*e:10*n,this.frameVertex[0]=new jsts.triangulate.quadedge.Vertex((t.getMaxX()+t.getMinX())/2,t.getMaxY()+o),this.frameVertex[1]=new jsts.triangulate.quadedge.Vertex(t.getMinX()-o,t.getMinY()-o),this.frameVertex[2]=new jsts.triangulate.quadedge.Vertex(t.getMaxX()+o,t.getMinY()-o),this.frameEnv=new jsts.geom.Envelope(this.frameVertex[0].getCoordinate(),this.frameVertex[1].getCoordinate()),this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate())},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.initSubdiv=function(){var t,e,n;return t=this.makeEdge(this.frameVertex[0],this.frameVertex[1]),e=this.makeEdge(this.frameVertex[1],this.frameVertex[2]),jsts.triangulate.quadedge.QuadEdge.splice(t.sym(),e),n=this.makeEdge(this.frameVertex[2],this.frameVertex[0]),jsts.triangulate.quadedge.QuadEdge.splice(e.sym(),n),jsts.triangulate.quadedge.QuadEdge.splice(n.sym(),t),t},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTolerance=function(){return this.tolerance},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEnvelope=function(){return new jsts.geom.Envelope(this.frameEnv)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdges=function(){return arguments.length>0?this.getEdgesByFactory(arguments[0]):this.quadEdges},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.setLocator=function(t){this.locator=t},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.makeEdge=function(t,e){var n=jsts.triangulate.quadedge.QuadEdge.makeEdge(t,e);return this.quadEdges.push(n),n},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.connect=function(t,e){var n=jsts.triangulate.quadedge.QuadEdge.connect(t,e);return this.quadEdges.push(n),n},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.delete_jsts=function(t){jsts.triangulate.quadedge.QuadEdge.splice(t,t.oPrev()),jsts.triangulate.quadedge.QuadEdge.splice(t.sym(),t.sym().oPrev());var e,n,o;t.eSym=t.sym(),n=t.rot,o=t.rot.sym();var r=this.quadEdges.indexOf(t);-1!==r&&this.quadEdges.splice(r,1),r=this.quadEdges.indexOf(e),-1!==r&&this.quadEdges.splice(r,1),r=this.quadEdges.indexOf(n),-1!==r&&this.quadEdges.splice(r,1),r=this.quadEdges.indexOf(o),-1!==r&&this.quadEdges.splice(r,1),t.delete_jsts(),e.delete_jsts(),n.delete_jsts(),o.delete_jsts()},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateFromEdge=function(t,e){var n,o=0,r=this.quadEdges.length;for(n=e;;){if(o++,o>r)throw new jsts.error.LocateFailureError(n.toLineSegment());if(t.equals(n.orig())||t.equals(n.dest()))break;if(t.rightOf(n))n=n.sym();else if(t.rightOf(n.oNext())){if(t.rightOf(n.dPrev()))break;n=n.dPrev()}else n=n.oNext()}return n},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locate=function(){return 1===arguments.length?arguments[0]instanceof jsts.triangulate.quadedge.Vertex?this.locateByVertex(arguments[0]):this.locateByCoordinate(arguments[0]):this.locateByCoordinates(arguments[0],arguments[1])},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByVertex=function(t){return this.locator.locate(t)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinate=function(t){return this.locator.locate(new jsts.triangulate.quadedge.Vertex(t))},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinates=function(t,e){var n,o,r,n=this.locator.locate(new jsts.triangulate.quadedge.Vertex(t));if(null===n)return null;o=n,n.dest().getCoordinate().equals2D(t)&&(o=n.sym()),r=o;do{if(r.dest().getCoordinate().equals2D(e))return r;r=r.oNext()}while(r!=o);return null},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.insertSite=function(t){var e,n,o;if(e=this.locate(t),t.equals(e.orig(),this.tolerance)||t.equals(e.dest(),this.tolerance))return e;n=this.makeEdge(e.orig(),t),jsts.triangulate.quadedge.QuadEdge.splice(n,e),o=n;do n=this.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!=o);return o},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameEdge=function(t){return this.isFrameVertex(t.orig())||this.isFrameVertex(t.dest())?!0:!1},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameBorderEdge=function(t){var e,n,o,r;return e=new Array(3),this.getTriangleEdges(t,e),n=new Array(3),this.getTriangleEdges(t.sym(),n),o=t.lNext().dest(),this.isFrameVertex(o)?!0:(r=t.sym().lNext().dest(),this.isFrameVertex(r)?!0:!1)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameVertex=function(t){return t.equals(this.frameVertex[0])?!0:t.equals(this.frameVertex[1])?!0:t.equals(this.frameVertex[2])?!0:!1},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isOnEdge=function(t,e){this.seg.setCoordinates(t.orig().getCoordinate(),t.dest().getCoordinate());var n=this.seg.distance(e);return n<this.edgeCoincidenceTolerance},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isVertexOfEdge=function(t,e){return e.equals(t.orig(),this.tolerance)||e.equals(t.dest(),this.tolerance)?!0:!1},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertices=function(t){var e,n,o,r,i,s=[];for(e=0,n=this.quadEdges.length,e;n>e;e++)o=this.quadEdges[e],r=o.orig(),(t||!this.isFrameVertex(r))&&s.push(r),i=o.dest(),(t||!this.isFrameVertex(i))&&s.push(i);return s},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertexUniqueEdges=function(t){var e,n,o,r,i,s,a,u;for(e=[],n=[],o=0,r=this.quadEdges.length,o;r>o;o++)i=this.quadEdges[o],s=i.orig(),-1===n.indexOf(s)&&(n.push(s),(t||!this.isFrameVertex(s))&&e.push(i)),a=i.sym(),u=a.orig(),-1===n.indexOf(u)&&(n.push(u),(t||!this.isFrameVertex(u))&&e.push(a));return e},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getPrimaryEdges=function(t){this.visitedKey++;var e,n,o,r,i;for(e=[],n=[],n.push(this.startingEdge),o=[];n.length>0;)r=n.pop(),-1===o.indexOf(r)&&(i=r.getPrimary(),(t||!this.isFrameEdge(i))&&e.push(i),n.push(r.oNext()),n.push(r.sym().oNext()),o.push(r),o.push(r.sym()));return e},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.visitTriangles=function(t,e){this.visitedKey++;var n,o,r,i;for(n=[],n.push(this.startingEdge),o=[];n.length>0;)r=n.pop(),-1===o.indexOf(r)&&(i=this.fetchTriangleToVisit(r,n,e,o),null!==i&&t.visit(i))},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.fetchTriangleToVisit=function(t,e,n,o){var r,i,s,a;r=t,i=0,s=!1;do this.triEdges[i]=r,this.isFrameEdge(r)&&(s=!0),a=r.sym(),-1===o.indexOf(a)&&e.push(a),o.push(r),i++,r=r.lNext();while(r!==t);return s&&!n?null:this.triEdges},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleEdges=function(t){var e=new jsts.triangulate.quadedge.TriangleEdgesListVisitor;return this.visitTriangles(e,t),e.getTriangleEdges()},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleVertices=function(t){var e=new TriangleVertexListVisitor;return this.visitTriangles(e,t),e.getTriangleVertices()},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleCoordinates=function(t){var e=new jsts.triangulate.quadedge.TriangleCoordinatesVisitor;return this.visitTriangles(e,t),e.getTriangles()},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdgesByFactory=function(t){var e,n,o,r,i,s;for(e=this.getPrimaryEdges(!1),n=[],o=0,r=e.length,o;r>o;o++)i=e[o],s=[],s[0]=i.orig().getCoordinate(),s[1]=i.dest().getCoordinate(),n[o]=t.createLineString(s);return t.createMultiLineString(n)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangles=function(t){var e,n,o,r,i;for(e=this.getTriangleCoordinates(!1),n=new Array(e.length),r=0,i=e.length,r;i>r;r++)o=e[r],n[r]=t.createPolygon(t.createLinearRing(o,null));return t.createGeometryCollection(n)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiDiagram=function(t){var e=this.getVoronoiCellPolygons(t);return t.createGeometryCollection(e)},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygons=function(t){this.visitTriangles(new jsts.triangulate.quadedge.TriangleCircumcentreVisitor,!0);var e,n,o,r,i;for(e=[],n=this.getVertexUniqueEdges(!1),o=0,r=n.length,o;r>o;o++)i=n[o],e.push(this.getVoronoiCellPolygon(i,t));return e},jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygon=function(t,e){var n,o,r,i,s;n=[],startQE=t;do o=t.rot.orig().getCoordinate(),n.push(o),t=t.oPrev();while(t!==startQE);return r=new jsts.geom.CoordinateList([],!1),r.add(n,!1),r.closeRing(),r.size()<4&&r.add(r.get(r.size()-1),!0),i=e.createPolygon(e.createLinearRing(r.toArray()),null),s=startQE.orig(),i},jsts.triangulate.quadedge.TriangleCircumcentreVisitor=function(){},jsts.triangulate.quadedge.TriangleCircumcentreVisitor.prototype.visit=function(t){var e,n,o,r,i,s;for(e=t[0].orig().getCoordinate(),n=t[1].orig().getCoordinate(),o=t[2].orig().getCoordinate(),r=jsts.geom.Triangle.circumcentre(e,n,o),i=new jsts.triangulate.quadedge.Vertex(r),s=0;3>s;s++)t[s].rot.setOrig(i)},jsts.triangulate.quadedge.TriangleEdgesListVisitor=function(){this.triList=[]},jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.visit=function(t){var e=t.concat();this.triList.push(e)},jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.getTriangleEdges=function(){return this.triList},jsts.triangulate.quadedge.TriangleVertexListVisitor=function(){this.triList=[]},jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.visit=function(){var t=[];t.push(trieEdges[0].orig()),t.push(trieEdges[1].orig()),t.push(trieEdges[2].orig()),this.triList.push(t)},jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.getTriangleVertices=function(){return this.triList},jsts.triangulate.quadedge.TriangleCoordinatesVisitor=function(){this.coordList=new jsts.geom.CoordinateList([],!1),this.triCoords=[]},jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.visit=function(t){this.coordList=new jsts.geom.CoordinateList([],!1);var e,n,o=0;for(o;3>o;o++)e=t[o].orig(),this.coordList.add(e.getCoordinate());if(this.coordList.size()>0){if(this.coordList.closeRing(),n=this.coordList.toArray(),4!==n.length)return;this.triCoords.push(n)}},jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.getTriangles=function(){return this.triCoords},jsts.operation.relate.EdgeEndBundle=function(){this.edgeEnds=[];var t=arguments[0]instanceof jsts.geomgraph.EdgeEnd?arguments[0]:arguments[1],e=t.getEdge(),n=t.getCoordinate(),o=t.getDirectedCoordinate(),r=new jsts.geomgraph.Label(t.getLabel());jsts.geomgraph.EdgeEnd.call(this,e,n,o,r),this.insert(t)},jsts.operation.relate.EdgeEndBundle.prototype=new jsts.geomgraph.EdgeEnd,jsts.operation.relate.EdgeEndBundle.prototype.edgeEnds=null,jsts.operation.relate.EdgeEndBundle.prototype.getLabel=function(){return this.label},jsts.operation.relate.EdgeEndBundle.prototype.getEdgeEnds=function(){return this.edgeEnds},jsts.operation.relate.EdgeEndBundle.prototype.insert=function(t){this.edgeEnds.push(t)},jsts.operation.relate.EdgeEndBundle.prototype.computeLabel=function(t){for(var e=!1,n=0;n<this.edgeEnds.length;n++){var o=this.edgeEnds[n];o.getLabel().isArea()&&(e=!0)}this.label=e?new jsts.geomgraph.Label(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE):new jsts.geomgraph.Label(jsts.geom.Location.NONE);for(var n=0;2>n;n++)this.computeLabelOn(n,t),e&&this.computeLabelSides(n)},jsts.operation.relate.EdgeEndBundle.prototype.computeLabelOn=function(t,e){for(var n=0,o=!1,r=0;r<this.edgeEnds.length;r++){var i=this.edgeEnds[r],s=i.getLabel().getLocation(t);s==jsts.geom.Location.BOUNDARY&&n++,s==jsts.geom.Location.INTERIOR&&(o=!0)}var s=jsts.geom.Location.NONE;o&&(s=jsts.geom.Location.INTERIOR),n>0&&(s=jsts.geomgraph.GeometryGraph.determineBoundary(e,n)),this.label.setLocation(t,s)},jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSides=function(t){this.computeLabelSide(t,jsts.geomgraph.Position.LEFT),this.computeLabelSide(t,jsts.geomgraph.Position.RIGHT)
},jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSide=function(t,e){for(var n=0;n<this.edgeEnds.length;n++){var o=this.edgeEnds[n];if(o.getLabel().isArea()){var r=o.getLabel().getLocation(t,e);if(r===jsts.geom.Location.INTERIOR)return void this.label.setLocation(t,e,jsts.geom.Location.INTERIOR);r===jsts.geom.Location.EXTERIOR&&this.label.setLocation(t,e,jsts.geom.Location.EXTERIOR)}}},jsts.operation.relate.EdgeEndBundle.prototype.updateIM=function(t){jsts.geomgraph.Edge.updateIM(this.label,t)},jsts.index.kdtree.KdTree=function(t){var e=0;void 0!==t&&(e=t),this.root=null,this.last=null,this.numberOfNodes=0,this.tolerance=e},jsts.index.kdtree.KdTree.prototype.insert=function(){return 1===arguments.length?this.insertCoordinate.apply(this,arguments[0]):this.insertWithData.apply(this,arguments[0],arguments[1])},jsts.index.kdtree.KdTree.prototype.insertCoordinate=function(t){return this.insertWithData(t,null)},jsts.index.kdtree.KdTree.prototype.insertWithData=function(t,e){if(null===this.root)return this.root=new jsts.index.kdtree.KdNode(t,e),this.root;for(var n=this.root,o=this.root,r=!0,i=!0;n!==last;){if(i=r?t.x<n.getX():t.y<n.getY(),o=n,n=i?n.getLeft():n.getRight(),null!==n){var s=t.distance(n.getCoordinate())<=this.tolerance;if(s)return n.increment(),n}r=!r}this.numberOfNodes=numberOfNodes+1;var a=new jsts.index.kdtree.KdNode(t,e);return a.setLeft(this.last),a.setRight(this.last),i?o.setLeft(a):o.setRight(a),a},jsts.index.kdtree.KdTree.prototype.queryNode=function(t,e,n,o,r){if(t!==e){var i,s,a;o?(i=n.getMinX(),s=n.getMaxX(),a=t.getX()):(i=n.getMinY(),s=n.getMaxY(),a=t.getY());var u=a>i,p=s>=a;u&&this.queryNode(t.getLeft(),e,n,!o,r),n.contains(t.getCoordinate())&&r.add(t),p&&this.queryNode(t.getRight(),e,n,!o,r)}},jsts.index.kdtree.KdTree.prototype.query=function(){return 1===arguments.length?this.queryByEnvelope.apply(this,arguments[0]):this.queryWithArray.apply(this,arguments[0],arguments[1])},jsts.index.kdtree.KdTree.prototype.queryByEnvelope=function(t){var e=[];return this.queryNode(this.root,this.last,t,!0,e),e},jsts.index.kdtree.KdTree.prototype.queryWithArray=function(t,e){this.queryNode(this.root,this.last,t,!0,e)},jsts.geom.Triangle=function(t,e,n){this.p0=t,this.p1=e,this.p2=n},jsts.geom.Triangle.isAcute=function(t,e,n){return jsts.algorithm.Angle.isAcute(t,e,n)&&jsts.algorithm.Angle.isAcute(e,n,t)&&jsts.algorithm.Angle.isAcute(n,t,e)?!0:!1},jsts.geom.Triangle.perpendicularBisector=function(t,e){var n,o,r,i;return n=e.x-t.x,o=e.y-t.y,r=new jsts.algorithm.HCoordinate(t.x+n/2,t.y+o/2,1),i=new jsts.algorithm.HCoordinate(t.x-o+n/2,t.y+n+o/2,1),new jsts.algorithm.HCoordinate(r,i)},jsts.geom.Triangle.circumcentre=function(t,e,n){var o,r,i,s,a,u,p,g,l,h,d;return o=n.x,r=n.y,i=t.x-o,s=t.y-r,a=e.x-o,u=e.y-r,p=2*jsts.geom.Triangle.det(i,s,a,u),g=jsts.geom.Triangle.det(s,i*i+s*s,u,a*a+u*u),l=jsts.geom.Triangle.det(i,i*i+s*s,a,a*a+u*u),h=o-g/p,d=r+l/p,new jsts.geom.Coordinate(h,d)},jsts.geom.Triangle.det=function(t,e,n,o){return t*o-e*n},jsts.geom.Triangle.inCentre=function(t,e,n){var o,r,i,s,a,u;return o=e.distance(n),r=t.distance(n),i=t.distance(e),s=o+r+i,a=(o*t.x+r*e.x+i*n.x)/s,u=(o*t.y+r*e.y+i*n.y)/s,new jsts.geom.Coordinate(a,u)},jsts.geom.Triangle.centroid=function(t,e,n){var o,r;return o=(t.x+e.x+n.x)/3,r=(t.y+e.y+n.y)/3,new jsts.geom.Coordinate(o,r)},jsts.geom.Triangle.longestSideLength=function(t,e,n){var o,r,i,s;return o=t.distance(e),r=e.distance(n),i=n.distance(t),s=o,r>s&&(s=r),i>s&&(s=i),s},jsts.geom.Triangle.angleBisector=function(t,e,n){var o,r,i,s,a,u;return o=e.distance(t),r=e.distance(n),i=o/(o+r),s=n.x-t.x,a=n.y-t.y,u=new jsts.geom.Coordinate(t.x+i*s,t.y+i*a)},jsts.geom.Triangle.area=function(t,e,n){return Math.abs(((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2)},jsts.geom.Triangle.signedArea=function(t,e,n){return((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2},jsts.geom.Triangle.prototype.inCentre=function(){return jsts.geom.Triangle.inCentre(this.p0,this.p1,this.p2)},jsts.noding.OrientedCoordinateArray=function(t){this.pts=t,this._orientation=jsts.noding.OrientedCoordinateArray.orientation(t)},jsts.noding.OrientedCoordinateArray.prototype.pts=null,jsts.noding.OrientedCoordinateArray.prototype._orientation=void 0,jsts.noding.OrientedCoordinateArray.orientation=function(t){return 1===jsts.geom.CoordinateArrays.increasingDirection(t)},jsts.noding.OrientedCoordinateArray.prototype.compareTo=function(t){var e=t,n=jsts.noding.OrientedCoordinateArray.compareOriented(this.pts,this._orientation,e.pts,e._orientation);return n},jsts.noding.OrientedCoordinateArray.compareOriented=function(t,e,n,o){for(var r=e?1:-1,i=o?1:-1,s=e?t.length:-1,a=o?n.length:-1,u=e?0:t.length-1,p=o?0:n.length-1;;){var g=t[u].compareTo(n[p]);if(0!==g)return g;u+=r,p+=i;var l=u===s,h=p===a;if(l&&!h)return-1;if(!l&&h)return 1;if(l&&h)return 0}},jsts.algorithm.CentralEndpointIntersector=function(t,e,n,o){this.pts=[t,e,n,o],this.compute()},jsts.algorithm.CentralEndpointIntersector.getIntersection=function(t,e,n,o){var r=new jsts.algorithm.CentralEndpointIntersector(t,e,n,o);return r.getIntersection()},jsts.algorithm.CentralEndpointIntersector.prototype.pts=null,jsts.algorithm.CentralEndpointIntersector.prototype.intPt=null,jsts.algorithm.CentralEndpointIntersector.prototype.compute=function(){var t=jsts.algorithm.CentralEndpointIntersector.average(this.pts);this.intPt=this.findNearestPoint(t,this.pts)},jsts.algorithm.CentralEndpointIntersector.prototype.getIntersection=function(){return this.intPt},jsts.algorithm.CentralEndpointIntersector.average=function(t){var e,n=new jsts.geom.Coordinate,o=t.length;for(e=0;o>e;e++)n.x+=t[e].x,n.y+=t[e].y;return o>0&&(n.x/=o,n.y/=o),n},jsts.algorithm.CentralEndpointIntersector.prototype.findNearestPoint=function(t,e){var n,o,r=Number.MAX_VALUE,i=null;for(n=0;n<e.length;n++)o=t.distance(e[n]),r>o&&(r=o,i=e[n]);return i},jsts.operation.buffer.BufferOp=function(t,e){this.argGeom=t,this.bufParams=e?e:new jsts.operation.buffer.BufferParameters},jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS=12,jsts.operation.buffer.BufferOp.precisionScaleFactor=function(t,e,n){var o=t.getEnvelopeInternal(),r=Math.max(o.getHeight(),o.getWidth()),i=e>0?e:0,s=r+2*i,a=Math.log(s)/Math.log(10)+1,u=a-n,p=Math.pow(10,-u);return p},jsts.operation.buffer.BufferOp.bufferOp=function(t,e){if(arguments.length>2)return jsts.operation.buffer.BufferOp.bufferOp2.apply(this,arguments);var n=new jsts.operation.buffer.BufferOp(t),o=n.getResultGeometry(e);return o},jsts.operation.buffer.BufferOp.bufferOp2=function(t,e,n){if(arguments.length>3)return jsts.operation.buffer.BufferOp.bufferOp3.apply(this,arguments);var o=new jsts.operation.buffer.BufferOp(t,n),r=o.getResultGeometry(e);return r},jsts.operation.buffer.BufferOp.bufferOp3=function(t,e,n){if(arguments.length>4)return jsts.operation.buffer.BufferOp.bufferOp4.apply(this,arguments);var o=new jsts.operation.buffer.BufferOp(t);o.setQuadrantSegments(n);var r=o.getResultGeometry(e);return r},jsts.operation.buffer.BufferOp.bufferOp4=function(t,e,n,o){var r=new jsts.operation.buffer.BufferOp(t);r.setQuadrantSegments(n),r.setEndCapStyle(o);var i=r.getResultGeometry(e);return i},jsts.operation.buffer.BufferOp.prototype.argGeom=null,jsts.operation.buffer.BufferOp.prototype.distance=null,jsts.operation.buffer.BufferOp.prototype.bufParams=null,jsts.operation.buffer.BufferOp.prototype.resultGeometry=null,jsts.operation.buffer.BufferOp.prototype.setEndCapStyle=function(t){this.bufParams.setEndCapStyle(t)},jsts.operation.buffer.BufferOp.prototype.setQuadrantSegments=function(t){this.bufParams.setQuadrantSegments(t)},jsts.operation.buffer.BufferOp.prototype.getResultGeometry=function(t){return this.distance=t,this.computeGeometry(),this.resultGeometry},jsts.operation.buffer.BufferOp.prototype.computeGeometry=function(){if(this.bufferOriginalPrecision(),null===this.resultGeometry){var t=this.argGeom.getPrecisionModel();t.getType()===jsts.geom.PrecisionModel.FIXED?this.bufferFixedPrecision(t):this.bufferReducedPrecision()}},jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision=function(){var t,e=null;for(t=jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS;t>=0;t--){try{this.bufferReducedPrecision2(t)}catch(n){e=n}if(null!==this.resultGeometry)return}throw e},jsts.operation.buffer.BufferOp.prototype.bufferOriginalPrecision=function(){try{var t=new jsts.operation.buffer.BufferBuilder(this.bufParams);this.resultGeometry=t.buffer(this.argGeom,this.distance)}catch(e){}},jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision2=function(t){var e=jsts.operation.buffer.BufferOp.precisionScaleFactor(this.argGeom,this.distance,t),n=new jsts.geom.PrecisionModel(e);this.bufferFixedPrecision(n)},jsts.operation.buffer.BufferOp.prototype.bufferFixedPrecision=function(t){var e=new jsts.noding.ScaledNoder(new jsts.noding.snapround.MCIndexSnapRounder(new jsts.geom.PrecisionModel(1)),t.getScale()),n=new jsts.operation.buffer.BufferBuilder(this.bufParams);n.setWorkingPrecisionModel(t),n.setNoder(e),this.resultGeometry=n.buffer(this.argGeom,this.distance)},function(){var t=jsts.geom.Location,e=jsts.geomgraph.Position,n=jsts.util.Assert;jsts.geomgraph.GeometryGraph=function(t,e,n){jsts.geomgraph.PlanarGraph.call(this),this.lineEdgeMap=new javascript.util.HashMap,this.ptLocator=new jsts.algorithm.PointLocator,this.argIndex=t,this.parentGeom=e,this.boundaryNodeRule=n||jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE,null!==e&&this.add(e)},jsts.geomgraph.GeometryGraph.prototype=new jsts.geomgraph.PlanarGraph,jsts.geomgraph.GeometryGraph.constructor=jsts.geomgraph.GeometryGraph,jsts.geomgraph.GeometryGraph.prototype.createEdgeSetIntersector=function(){return new jsts.geomgraph.index.SimpleMCSweepLineIntersector},jsts.geomgraph.GeometryGraph.determineBoundary=function(e,n){return e.isInBoundary(n)?t.BOUNDARY:t.INTERIOR},jsts.geomgraph.GeometryGraph.prototype.parentGeom=null,jsts.geomgraph.GeometryGraph.prototype.lineEdgeMap=null,jsts.geomgraph.GeometryGraph.prototype.boundaryNodeRule=null,jsts.geomgraph.GeometryGraph.prototype.useBoundaryDeterminationRule=!0,jsts.geomgraph.GeometryGraph.prototype.argIndex=null,jsts.geomgraph.GeometryGraph.prototype.boundaryNodes=null,jsts.geomgraph.GeometryGraph.prototype.hasTooFewPoints=!1,jsts.geomgraph.GeometryGraph.prototype.invalidPoint=null,jsts.geomgraph.GeometryGraph.prototype.areaPtLocator=null,jsts.geomgraph.GeometryGraph.prototype.ptLocator=null,jsts.geomgraph.GeometryGraph.prototype.getGeometry=function(){return this.parentGeom},jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodes=function(){return null===this.boundaryNodes&&(this.boundaryNodes=this.nodes.getBoundaryNodes(this.argIndex)),this.boundaryNodes},jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodeRule=function(){return this.boundaryNodeRule},jsts.geomgraph.GeometryGraph.prototype.findEdge=function(t){return this.lineEdgeMap.get(t)},jsts.geomgraph.GeometryGraph.prototype.computeSplitEdges=function(t){for(var e=this.edges.iterator();e.hasNext();){var n=e.next();n.eiList.addSplitEdges(t)}},jsts.geomgraph.GeometryGraph.prototype.add=function(t){if(!t.isEmpty())if(t instanceof jsts.geom.MultiPolygon&&(this.useBoundaryDeterminationRule=!1),t instanceof jsts.geom.Polygon)this.addPolygon(t);else if(t instanceof jsts.geom.LineString)this.addLineString(t);else if(t instanceof jsts.geom.Point)this.addPoint(t);else if(t instanceof jsts.geom.MultiPoint)this.addCollection(t);else if(t instanceof jsts.geom.MultiLineString)this.addCollection(t);else if(t instanceof jsts.geom.MultiPolygon)this.addCollection(t);else{if(!(t instanceof jsts.geom.GeometryCollection))throw new jsts.error.IllegalArgumentError("Geometry type not supported.");this.addCollection(t)}},jsts.geomgraph.GeometryGraph.prototype.addCollection=function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},jsts.geomgraph.GeometryGraph.prototype.addEdge=function(e){this.insertEdge(e);var n=e.getCoordinates();this.insertPoint(this.argIndex,n[0],t.BOUNDARY),this.insertPoint(this.argIndex,n[n.length-1],t.BOUNDARY)},jsts.geomgraph.GeometryGraph.prototype.addPoint=function(e){var n=e.getCoordinate();this.insertPoint(this.argIndex,n,t.INTERIOR)},jsts.geomgraph.GeometryGraph.prototype.addLineString=function(e){var o=jsts.geom.CoordinateArrays.removeRepeatedPoints(e.getCoordinates());if(o.length<2)return this.hasTooFewPoints=!0,void(this.invalidPoint=coords[0]);var r=new jsts.geomgraph.Edge(o,new jsts.geomgraph.Label(this.argIndex,t.INTERIOR));this.lineEdgeMap.put(e,r),this.insertEdge(r),n.isTrue(o.length>=2,"found LineString with single point"),this.insertBoundaryPoint(this.argIndex,o[0]),this.insertBoundaryPoint(this.argIndex,o[o.length-1])},jsts.geomgraph.GeometryGraph.prototype.addPolygonRing=function(e,n,o){if(!e.isEmpty()){var r=jsts.geom.CoordinateArrays.removeRepeatedPoints(e.getCoordinates());if(r.length<4)return this.hasTooFewPoints=!0,void(this.invalidPoint=r[0]);var i=n,s=o;jsts.algorithm.CGAlgorithms.isCCW(r)&&(i=o,s=n);var a=new jsts.geomgraph.Edge(r,new jsts.geomgraph.Label(this.argIndex,t.BOUNDARY,i,s));this.lineEdgeMap.put(e,a),this.insertEdge(a),this.insertPoint(this.argIndex,r[0],t.BOUNDARY)}},jsts.geomgraph.GeometryGraph.prototype.addPolygon=function(e){this.addPolygonRing(e.getExteriorRing(),t.EXTERIOR,t.INTERIOR);for(var n=0;n<e.getNumInteriorRing();n++){var o=e.getInteriorRingN(n);this.addPolygonRing(o,t.INTERIOR,t.EXTERIOR)}},jsts.geomgraph.GeometryGraph.prototype.computeEdgeIntersections=function(t,e,n){var o=new jsts.geomgraph.index.SegmentIntersector(e,n,!0);o.setBoundaryNodes(this.getBoundaryNodes(),t.getBoundaryNodes());var r=this.createEdgeSetIntersector();return r.computeIntersections(this.edges,t.edges,o),o},jsts.geomgraph.GeometryGraph.prototype.computeSelfNodes=function(t,e){var n=new jsts.geomgraph.index.SegmentIntersector(t,!0,!1),o=this.createEdgeSetIntersector();return!e&&(this.parentGeom instanceof jsts.geom.LinearRing||this.parentGeom instanceof jsts.geom.Polygon||this.parentGeom instanceof jsts.geom.MultiPolygon)?o.computeIntersections(this.edges,n,!1):o.computeIntersections(this.edges,n,!0),this.addSelfIntersectionNodes(this.argIndex),n},jsts.geomgraph.GeometryGraph.prototype.insertPoint=function(t,e,n){var o=this.nodes.addNode(e),r=o.getLabel();null==r?o.label=new jsts.geomgraph.Label(t,n):r.setLocation(t,n)},jsts.geomgraph.GeometryGraph.prototype.insertBoundaryPoint=function(n,o){var r=this.nodes.addNode(o),i=r.getLabel(),s=1,a=t.NONE;null!==i&&(a=i.getLocation(n,e.ON)),a===t.BOUNDARY&&s++;var u=jsts.geomgraph.GeometryGraph.determineBoundary(this.boundaryNodeRule,s);i.setLocation(n,u)},jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNodes=function(t){for(var e=this.edges.iterator();e.hasNext();)for(var n=e.next(),o=n.getLabel().getLocation(t),r=n.eiList.iterator();r.hasNext();){var i=r.next();this.addSelfIntersectionNode(t,i.coord,o)}},jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNode=function(e,n,o){this.isBoundaryNode(e,n)||(o===t.BOUNDARY&&this.useBoundaryDeterminationRule?this.insertBoundaryPoint(e,n):this.insertPoint(e,n,o))},jsts.geomgraph.GeometryGraph.prototype.getInvalidPoint=function(){return this.invalidPoint}}(),jsts.operation.buffer.OffsetSegmentString=function(){this.ptList=[]},jsts.operation.buffer.OffsetSegmentString.prototype.ptList=null,jsts.operation.buffer.OffsetSegmentString.prototype.precisionModel=null,jsts.operation.buffer.OffsetSegmentString.prototype.minimimVertexDistance=0,jsts.operation.buffer.OffsetSegmentString.prototype.setPrecisionModel=function(t){this.precisionModel=t},jsts.operation.buffer.OffsetSegmentString.prototype.setMinimumVertexDistance=function(t){this.minimimVertexDistance=t},jsts.operation.buffer.OffsetSegmentString.prototype.addPt=function(t){var e=new jsts.geom.Coordinate(t);this.precisionModel.makePrecise(e),this.isRedundant(e)||this.ptList.push(e)},jsts.operation.buffer.OffsetSegmentString.prototype.addPts=function(t,e){if(e)for(var n=0;n<t.length;n++)this.addPt(t[n]);else for(var n=t.length-1;n>=0;n--)this.addPt(t[n])},jsts.operation.buffer.OffsetSegmentString.prototype.isRedundant=function(t){if(this.ptList.length<1)return!1;var e=this.ptList[this.ptList.length-1],n=t.distance(e);return n<this.minimimVertexDistance?!0:!1},jsts.operation.buffer.OffsetSegmentString.prototype.closeRing=function(){if(!(this.ptList.length<1)){var t=new jsts.geom.Coordinate(this.ptList[0]),e=this.ptList[this.ptList.length-1],n=null;this.ptList.length>=2&&(n=this.ptList[this.ptList.length-2]),t.equals(e)||this.ptList.push(t)}},jsts.operation.buffer.OffsetSegmentString.prototype.reverse=function(){},jsts.operation.buffer.OffsetSegmentString.prototype.getCoordinates=function(){return this.ptList},jsts.algorithm.distance.PointPairDistance=function(){this.pt=[new jsts.geom.Coordinate,new jsts.geom.Coordinate]},jsts.algorithm.distance.PointPairDistance.prototype.pt=null,jsts.algorithm.distance.PointPairDistance.prototype.distance=0/0,jsts.algorithm.distance.PointPairDistance.prototype.isNull=!0,jsts.algorithm.distance.PointPairDistance.prototype.initialize=function(t,e,n){return void 0===t?void(this.isNull=!0):(this.pt[0].setCoordinate(t),this.pt[1].setCoordinate(e),this.distance=void 0!==n?n:t.distance(e),void(this.isNull=!1))},jsts.algorithm.distance.PointPairDistance.prototype.getDistance=function(){return this.distance},jsts.algorithm.distance.PointPairDistance.prototype.getCoordinates=function(){return this.pt},jsts.algorithm.distance.PointPairDistance.prototype.getCoordinate=function(t){return this.pt[t]},jsts.algorithm.distance.PointPairDistance.prototype.setMaximum=function(t){return 2===arguments.length?void this.setMaximum2.apply(this,arguments):void this.setMaximum(t.pt[0],t.pt[1])},jsts.algorithm.distance.PointPairDistance.prototype.setMaximum2=function(t,e){if(this.isNull)return void this.initialize(t,e);var n=t.distance(e);n>this.distance&&this.initialize(t,e,n)},jsts.algorithm.distance.PointPairDistance.prototype.setMinimum=function(t){return 2===arguments.length?void this.setMinimum2.apply(this,arguments):void this.setMinimum(t.pt[0],t.pt[1])},jsts.algorithm.distance.PointPairDistance.prototype.setMinimum2=function(t,e){if(this.isNull)return void this.initialize(t,e);var n=t.distance(e);n<this.distance&&this.initialize(t,e,n)},function(){var t=jsts.algorithm.distance.PointPairDistance,e=jsts.algorithm.distance.DistanceToPoint,n=function(n){this.maxPtDist=new t,this.minPtDist=new t,this.euclideanDist=new e,this.geom=n};n.prototype=new jsts.geom.CoordinateFilter,n.prototype.maxPtDist=new t,n.prototype.minPtDist=new t,n.prototype.euclideanDist=new e,n.prototype.geom,n.prototype.filter=function(t){this.minPtDist.initialize(),e.computeDistance(this.geom,t,this.minPtDist),this.maxPtDist.setMaximum(this.minPtDist)},n.prototype.getMaxPointDistance=function(){return this.maxPtDist};var o=function(e,n){this.maxPtDist=new t,this.minPtDist=new t,this.geom=e,this.numSubSegs=Math.round(1/n)};o.prototype=new jsts.geom.CoordinateSequenceFilter,o.prototype.maxPtDist=new t,o.prototype.minPtDist=new t,o.prototype.geom,o.prototype.numSubSegs=0,o.prototype.filter=function(t,n){if(0!=n)for(var o=t[n-1],r=t[n],i=(r.x-o.x)/this.numSubSegs,s=(r.y-o.y)/this.numSubSegs,a=0;a<this.numSubSegs;a++){var u=o.x+a*i,p=o.y+a*s,g=new jsts.geom.Coordinate(u,p);this.minPtDist.initialize(),e.computeDistance(this.geom,g,this.minPtDist),this.maxPtDist.setMaximum(this.minPtDist)}},o.prototype.isGeometryChanged=function(){return!1},o.prototype.isDone=function(){return!1},o.prototype.getMaxPointDistance=function(){return this.maxPtDist},jsts.algorithm.distance.DiscreteHausdorffDistance=function(t,e){this.g0=t,this.g1=e,this.ptDist=new jsts.algorithm.distance.PointPairDistance},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g0=null,jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g1=null,jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.ptDist=null,jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.densifyFrac=0,jsts.algorithm.distance.DiscreteHausdorffDistance.distance=function(t,e,n){var o=new jsts.algorithm.distance.DiscreteHausdorffDistance(t,e);return void 0!==n&&o.setDensifyFraction(n),o.distance()},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.setDensifyFraction=function(t){if(t>1||0>=t)throw new jsts.error.IllegalArgumentError("Fraction is not in range (0.0 - 1.0]");this.densifyFrac=t},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.distance=function(){return this.compute(this.g0,this.g1),ptDist.getDistance()},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.orientedDistance=function(){return this.computeOrientedDistance(this.g0,this.g1,this.ptDist),this.ptDist.getDistance()},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.getCoordinates=function(){return ptDist.getCoordinates()},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.compute=function(t,e){this.computeOrientedDistance(t,e,this.ptDist),this.computeOrientedDistance(e,t,this.ptDist)},jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.computeOrientedDistance=function(t,e,r){var i=new n(e);if(t.apply(i),r.setMaximum(i.getMaxPointDistance()),this.densifyFrac>0){var s=new o(e,this.densifyFrac);t.apply(s),r.setMaximum(s.getMaxPointDistance())}}}(),jsts.algorithm.MinimumBoundingCircle=function(t){this.input=null,this.extremalPts=null,this.centre=null,this.radius=0,this.input=t},jsts.algorithm.MinimumBoundingCircle.prototype.getCircle=function(){if(this.compute(),null===this.centre)return this.input.getFactory().createPolygon(null,null);var t=this.input.getFactory().createPoint(this.centre);return 0===this.radius?t:t.buffer(this.radius)},jsts.algorithm.MinimumBoundingCircle.prototype.getExtremalPoints=function(){return this.compute(),this.extremalPts},jsts.algorithm.MinimumBoundingCircle.prototype.getCentre=function(){return this.compute(),this.centre},jsts.algorithm.MinimumBoundingCircle.prototype.getRadius=function(){return this.compute(),this.radius},jsts.algorithm.MinimumBoundingCircle.prototype.computeCentre=function(){switch(this.extremalPts.length){case 0:this.centre=null;break;case 1:this.centre=this.extremalPts[0];break;case 2:this.centre=new jsts.geom.Coordinate((this.extremalPts[0].x+this.extremalPts[1].x)/2,(this.extremalPts[0].y+this.extremalPts[1].y)/2);break;case 3:this.centre=jsts.geom.Triangle.circumcentre(this.extremalPts[0],this.extremalPts[1],this.extremalPts[2])}},jsts.algorithm.MinimumBoundingCircle.prototype.compute=function(){null===this.extremalPts&&(this.computeCirclePoints(),this.computeCentre(),null!==this.centre&&(this.radius=this.centre.distance(this.extremalPts[0])))},jsts.algorithm.MinimumBoundingCircle.prototype.computeCirclePoints=function(){if(this.input.isEmpty())return void(this.extremalPts=[]);var t;if(1===this.input.getNumPoints())return t=this.input.getCoordinates(),void(this.extremalPts=[new jsts.geom.Coordinate(t[0])]);var e=this.input.convexHull(),n=e.getCoordinates();if(t=n,n[0].equals2D(n[n.length-1])&&(t=[],jsts.geom.CoordinateArrays.copyDeep(n,0,t,0,n.length-1)),t.length<=2)return void(this.extremalPts=jsts.geom.CoordinateArrays.copyDeep(t));for(var o=jsts.algorithm.MinimumBoundingCircle.lowestPoint(t),r=jsts.algorithm.MinimumBoundingCircle.pointWitMinAngleWithX(t,o),i=0;i<t.length;i++){var s=jsts.algorithm.MinimumBoundingCircle.pointWithMinAngleWithSegment(t,o,r);if(jsts.algorithm.Angle.isObtuse(o,s,r))return void(this.extremalPts=[new jsts.geom.Coordinate(o),new jsts.geom.Coordinate(r)]);if(jsts.algorithm.Angle.isObtuse(s,o,r))o=s;else{if(!jsts.algorithm.Angle.isObtuse(s,r,o))return void(this.extremalPts=[new jsts.geom.Coordinate(o),new jsts.geom.Coordinate(r),new jsts.geom.Coordinate(s)]);r=s}}throw new Error("Logic failure in Minimum Bounding Circle algorithm!")},jsts.algorithm.MinimumBoundingCircle.lowestPoint=function(t){for(var e=t[0],n=1;n<t.length;n++)t[n].y<e.y&&(e=t[n]);return e},jsts.algorithm.MinimumBoundingCircle.pointWitMinAngleWithX=function(t,e){for(var n=Number.MAX_VALUE,o=null,r=0;r<t.length;r++){var i=t[r];if(i!==e){var s=i.x-e.x,a=i.y-e.y;0>a&&(a=-a);var u=Math.sqrt(s*s+a*a),p=a/u;n>p&&(n=p,o=i)}}return o},jsts.algorithm.MinimumBoundingCircle.pointWithMinAngleWithSegment=function(t,e,n){for(var o=Number.MAX_VALUE,r=null,i=0;i<t.length;i++){var s=t[i];if(s!==e&&s!==n){var a=jsts.algorithm.Angle.angleBetween(e,s,n);o>a&&(o=a,r=s)}}return r},jsts.noding.ScaledNoder=function(t,e,n,o){this.offsetX=n?n:0,this.offsetY=o?o:0,this.noder=t,this.scaleFactor=e,this.isScaled=!this.isIntegerPrecision()},jsts.noding.ScaledNoder.prototype=new jsts.noding.Noder,jsts.noding.ScaledNoder.constructor=jsts.noding.ScaledNoder,jsts.noding.ScaledNoder.prototype.noder=null,jsts.noding.ScaledNoder.prototype.scaleFactor=void 0,jsts.noding.ScaledNoder.prototype.offsetX=void 0,jsts.noding.ScaledNoder.prototype.offsetY=void 0,jsts.noding.ScaledNoder.prototype.isScaled=!1,jsts.noding.ScaledNoder.prototype.isIntegerPrecision=function(){return 1===this.scaleFactor},jsts.noding.ScaledNoder.prototype.getNodedSubstrings=function(){var t=this.noder.getNodedSubstrings();return this.isScaled&&this.rescale(t),t},jsts.noding.ScaledNoder.prototype.computeNodes=function(t){var e=t;this.isScaled&&(e=this.scale(t)),this.noder.computeNodes(e)},jsts.noding.ScaledNoder.prototype.scale=function(t){if(t instanceof Array)return this.scale2(t);for(var e=new javascript.util.ArrayList,n=t.iterator();n.hasNext();){var o=n.next();e.add(new jsts.noding.NodedSegmentString(this.scale(o.getCoordinates()),o.getData()))}return e},jsts.noding.ScaledNoder.prototype.scale2=function(t){for(var e=[],n=0;n<t.length;n++)e[n]=new jsts.geom.Coordinate(Math.round((t[n].x-this.offsetX)*this.scaleFactor),Math.round((t[n].y-this.offsetY)*this.scaleFactor));var o=jsts.geom.CoordinateArrays.removeRepeatedPoints(e);return o},jsts.noding.ScaledNoder.prototype.rescale=function(t){if(t instanceof Array)return void this.rescale2(t);for(var e=t.iterator();e.hasNext();){var n=e.next();this.rescale(n.getCoordinates())}},jsts.noding.ScaledNoder.prototype.rescale2=function(t){for(var e=0;e<t.length;e++)t[e].x=t[e].x/this.scaleFactor+this.offsetX,t[e].y=t[e].y/this.scaleFactor+this.offsetY},function(){javascript.util.ArrayList;jsts.geomgraph.index.SegmentIntersector=function(t,e,n){this.li=t,this.includeProper=e,this.recordIsolated=n},jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},jsts.geomgraph.index.SegmentIntersector.prototype._hasIntersection=!1,jsts.geomgraph.index.SegmentIntersector.prototype.hasProper=!1,jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInterior=!1,jsts.geomgraph.index.SegmentIntersector.prototype.properIntersectionPoint=null,jsts.geomgraph.index.SegmentIntersector.prototype.li=null,jsts.geomgraph.index.SegmentIntersector.prototype.includeProper=null,jsts.geomgraph.index.SegmentIntersector.prototype.recordIsolated=null,jsts.geomgraph.index.SegmentIntersector.prototype.isSelfIntersection=null,jsts.geomgraph.index.SegmentIntersector.prototype.numIntersections=0,jsts.geomgraph.index.SegmentIntersector.prototype.numTests=0,jsts.geomgraph.index.SegmentIntersector.prototype.bdyNodes=null,jsts.geomgraph.index.SegmentIntersector.prototype.setBoundaryNodes=function(t,e){this.bdyNodes=[],this.bdyNodes[0]=t,this.bdyNodes[1]=e},jsts.geomgraph.index.SegmentIntersector.prototype.getProperIntersectionPoint=function(){return this.properIntersectionPoint},jsts.geomgraph.index.SegmentIntersector.prototype.hasIntersection=function(){return this._hasIntersection},jsts.geomgraph.index.SegmentIntersector.prototype.hasProperIntersection=function(){return this.hasProper},jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInteriorIntersection=function(){return this.hasProperInterior},jsts.geomgraph.index.SegmentIntersector.prototype.isTrivialIntersection=function(t,e,n,o){if(t===n&&1===this.li.getIntersectionNum()){if(jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments(e,o))return!0;if(t.isClosed()){var r=t.getNumPoints()-1;if(0===e&&o===r||0===o&&e===r)return!0}}return!1},jsts.geomgraph.index.SegmentIntersector.prototype.addIntersections=function(t,e,n,o){if(t!==n||e!==o){this.numTests++;var r=t.getCoordinates()[e],i=t.getCoordinates()[e+1],s=n.getCoordinates()[o],a=n.getCoordinates()[o+1];this.li.computeIntersection(r,i,s,a),this.li.hasIntersection()&&(this.recordIsolated&&(t.setIsolated(!1),n.setIsolated(!1)),this.numIntersections++,this.isTrivialIntersection(t,e,n,o)||(this._hasIntersection=!0,(this.includeProper||!this.li.isProper())&&(t.addIntersections(this.li,e,0),n.addIntersections(this.li,o,1)),this.li.isProper()&&(this.properIntersectionPoint=this.li.getIntersection(0).clone(),this.hasProper=!0,this.isBoundaryPoint(this.li,this.bdyNodes)||(this.hasProperInterior=!0))))}},jsts.geomgraph.index.SegmentIntersector.prototype.isBoundaryPoint=function(t,e){if(null===e)return!1;if(e instanceof Array)return this.isBoundaryPoint(t,e[0])?!0:this.isBoundaryPoint(t,e[1])?!0:!1;for(var n=e.iterator();n.hasNext();){var o=n.next(),r=o.getCoordinate();if(t.isIntersection(r))return!0}return!1}}()},{}],19:[function(){(function(t){(function(){function e(t,e){var n=t.split("."),o=O;n[0]in o||!o.execScript||o.execScript("var "+n[0]);for(var r;n.length&&(r=n.shift());)n.length||void 0===e?o=o[r]?o[r]:o[r]={}:o[r]=e}function n(t,e){function n(){}n.prototype=e.prototype,t.q=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.p=function(t,n){var o=Array.prototype.slice.call(arguments,2);return e.prototype[n].apply(t,o)}}function o(t){this.message=t||""}function r(t){this.message=t||""}function i(){}function s(){}function a(){}function u(){}function p(t){this.message=t||""}function g(t){this.message=t||""}function l(t){this.a=[],t instanceof s&&this.e(t)}function h(t){this.j=t}function d(){}function c(){this.i={}}function f(){}function m(t){this.a=[],t instanceof s&&this.e(t)}function y(t){this.k=t}function j(){}function v(){}function E(){this.a=[]}function x(t){return null==t?null:t.parent}function I(t,e){null!==t&&(t.color=e)}function S(t){return null==t?null:t.left}function L(t){return null==t?null:t.right}function C(){this.d=null,this.n=0}function N(t,e){if(null!=e){var n=e.right;e.right=n.left,null!=n.left&&(n.left.parent=e),n.parent=e.parent,null==e.parent?t.d=n:e.parent.left==e?e.parent.left=n:e.parent.right=n,n.left=e,e.parent=n}}function b(t,e){if(null!=e){var n=e.left;e.left=n.right,null!=n.right&&(n.right.parent=e),n.parent=e.parent,null==e.parent?t.d=n:e.parent.right==e?e.parent.right=n:e.parent.left=n,n.right=e,e.parent=n}}function P(t){if(null===t)return null;if(null!==t.right)for(var e=t.right;null!==e.left;)e=e.left;else for(e=t.parent;null!==e&&t===e.right;)t=e,e=e.parent;return e}function R(t){this.a=[],t instanceof s&&this.e(t)}function w(t){this.l=t}var O=this;n(o,Error),e("javascript.util.EmptyStackException",o),o.prototype.name="EmptyStackException",n(r,Error),e("javascript.util.IndexOutOfBoundsException",r),r.prototype.name="IndexOutOfBoundsException",e("javascript.util.Iterator",i),i.prototype.hasNext=i.prototype.c,i.prototype.next=i.prototype.next,i.prototype.remove=i.prototype.remove,e("javascript.util.Collection",s),n(a,s),e("javascript.util.List",a),e("javascript.util.Map",u),n(p,Error),e("javascript.util.NoSuchElementException",p),p.prototype.name="NoSuchElementException",n(g,Error),g.prototype.name="OperationNotSupported",n(l,a),e("javascript.util.ArrayList",l),l.prototype.a=null,l.prototype.add=function(t){return this.a.push(t),!0},l.prototype.add=l.prototype.add,l.prototype.e=function(t){for(t=t.f();t.c();)this.add(t.next());return!0},l.prototype.addAll=l.prototype.e,l.prototype.set=function(t,e){var n=this.a[t];return this.a[t]=e,n},l.prototype.set=l.prototype.set,l.prototype.f=function(){return new h(this)},l.prototype.iterator=l.prototype.f,l.prototype.get=function(t){if(0>t||t>=this.size())throw new r;return this.a[t]},l.prototype.get=l.prototype.get,l.prototype.g=function(){return 0===this.a.length
},l.prototype.isEmpty=l.prototype.g,l.prototype.size=function(){return this.a.length},l.prototype.size=l.prototype.size,l.prototype.h=function(){for(var t=[],e=0,n=this.a.length;n>e;e++)t.push(this.a[e]);return t},l.prototype.toArray=l.prototype.h,l.prototype.remove=function(t){for(var e=!1,n=0,o=this.a.length;o>n;n++)if(this.a[n]===t){this.a.splice(n,1),e=!0;break}return e},l.prototype.remove=l.prototype.remove,e("$jscomp.scope.Iterator_",h),h.prototype.j=null,h.prototype.b=0,h.prototype.next=function(){if(this.b===this.j.size())throw new p;return this.j.get(this.b++)},h.prototype.next=h.prototype.next,h.prototype.c=function(){return this.b<this.j.size()?!0:!1},h.prototype.hasNext=h.prototype.c,h.prototype.remove=function(){throw new g},h.prototype.remove=h.prototype.remove,e("javascript.util.Arrays",d),d.sort=function(){var t,e,n,o=arguments[0];if(1===arguments.length)o.sort();else if(2===arguments.length)e=arguments[1],n=function(t,n){return e.compare(t,n)},o.sort(n);else if(3===arguments.length)for(t=o.slice(arguments[1],arguments[2]),t.sort(),n=o.slice(0,arguments[1]).concat(t,o.slice(arguments[2],o.length)),o.splice(0,o.length),t=0;t<n.length;t++)o.push(n[t]);else if(4===arguments.length)for(t=o.slice(arguments[1],arguments[2]),e=arguments[3],n=function(t,n){return e.compare(t,n)},t.sort(n),n=o.slice(0,arguments[1]).concat(t,o.slice(arguments[2],o.length)),o.splice(0,o.length),t=0;t<n.length;t++)o.push(n[t])},d.asList=function(t){for(var e=new l,n=0,o=t.length;o>n;n++)e.add(t[n]);return e},n(c,u),e("javascript.util.HashMap",c),c.prototype.i=null,c.prototype.get=function(t){return this.i[t]||null},c.prototype.get=c.prototype.get,c.prototype.put=function(t,e){return this.i[t]=e},c.prototype.put=c.prototype.put,c.prototype.m=function(){var t,e=new l;for(t in this.i)this.i.hasOwnProperty(t)&&e.add(this.i[t]);return e},c.prototype.values=c.prototype.m,c.prototype.size=function(){return this.m().size()},c.prototype.size=c.prototype.size,n(f,s),e("javascript.util.Set",f),n(m,f),e("javascript.util.HashSet",m),m.prototype.a=null,m.prototype.contains=function(t){for(var e=0,n=this.a.length;n>e;e++)if(this.a[e]===t)return!0;return!1},m.prototype.contains=m.prototype.contains,m.prototype.add=function(t){return this.contains(t)?!1:(this.a.push(t),!0)},m.prototype.add=m.prototype.add,m.prototype.e=function(t){for(t=t.f();t.c();)this.add(t.next());return!0},m.prototype.addAll=m.prototype.e,m.prototype.remove=function(){throw new g},m.prototype.remove=m.prototype.remove,m.prototype.size=function(){return this.a.length},m.prototype.g=function(){return 0===this.a.length},m.prototype.isEmpty=m.prototype.g,m.prototype.h=function(){for(var t=[],e=0,n=this.a.length;n>e;e++)t.push(this.a[e]);return t},m.prototype.toArray=m.prototype.h,m.prototype.f=function(){return new y(this)},m.prototype.iterator=m.prototype.f,e("$jscomp.scope.Iterator_$1",y),y.prototype.k=null,y.prototype.b=0,y.prototype.next=function(){if(this.b===this.k.size())throw new p;return this.k.a[this.b++]},y.prototype.next=y.prototype.next,y.prototype.c=function(){return this.b<this.k.size()?!0:!1},y.prototype.hasNext=y.prototype.c,y.prototype.remove=function(){throw new g},y.prototype.remove=y.prototype.remove,n(j,u),e("javascript.util.SortedMap",j),n(v,f),e("javascript.util.SortedSet",v),n(E,a),e("javascript.util.Stack",E),E.prototype.a=null,E.prototype.push=function(t){return this.a.push(t),t},E.prototype.push=E.prototype.push,E.prototype.pop=function(){if(0===this.a.length)throw new o;return this.a.pop()},E.prototype.pop=E.prototype.pop,E.prototype.o=function(){if(0===this.a.length)throw new o;return this.a[this.a.length-1]},E.prototype.peek=E.prototype.o,E.prototype.empty=function(){return 0===this.a.length?!0:!1},E.prototype.empty=E.prototype.empty,E.prototype.g=function(){return this.empty()},E.prototype.isEmpty=E.prototype.g,E.prototype.search=function(t){return this.a.indexOf(t)},E.prototype.search=E.prototype.search,E.prototype.size=function(){return this.a.length},E.prototype.size=E.prototype.size,E.prototype.h=function(){for(var t=[],e=0,n=this.a.length;n>e;e++)t.push(this.a[e]);return t},E.prototype.toArray=E.prototype.h,n(C,j),e("javascript.util.TreeMap",C),C.prototype.get=function(t){for(var e=this.d;null!==e;){var n=t.compareTo(e.key);if(0>n)e=e.left;else{if(!(n>0))return e.value;e=e.right}}return null},C.prototype.get=C.prototype.get,C.prototype.put=function(t,e){if(null===this.d)return this.d={key:t,value:e,left:null,right:null,parent:null,color:0},this.n=1,null;var n,o,r=this.d;do if(n=r,o=t.compareTo(r.key),0>o)r=r.left;else{if(!(o>0))return n=r.value,r.value=e,n;r=r.right}while(null!==r);for(r={key:t,left:null,right:null,value:e,parent:n,color:0},0>o?n.left=r:n.right=r,r.color=1;null!=r&&r!=this.d&&1==r.parent.color;)x(r)==S(x(x(r)))?(n=L(x(x(r))),1==(null==n?0:n.color)?(I(x(r),0),I(n,0),I(x(x(r)),1),r=x(x(r))):(r==L(x(r))&&(r=x(r),N(this,r)),I(x(r),0),I(x(x(r)),1),b(this,x(x(r))))):(n=S(x(x(r))),1==(null==n?0:n.color)?(I(x(r),0),I(n,0),I(x(x(r)),1),r=x(x(r))):(r==S(x(r))&&(r=x(r),b(this,r)),I(x(r),0),I(x(x(r)),1),N(this,x(x(r)))));return this.d.color=0,this.n++,null},C.prototype.put=C.prototype.put,C.prototype.m=function(){var t,e=new l;if(t=this.d,null!=t)for(;null!=t.left;)t=t.left;if(null!==t)for(e.add(t.value);null!==(t=P(t));)e.add(t.value);return e},C.prototype.values=C.prototype.m,C.prototype.size=function(){return this.n},C.prototype.size=C.prototype.size,n(R,v),e("javascript.util.TreeSet",R),R.prototype.a=null,R.prototype.contains=function(t){for(var e=0,n=this.a.length;n>e;e++)if(0===this.a[e].compareTo(t))return!0;return!1},R.prototype.contains=R.prototype.contains,R.prototype.add=function(t){if(this.contains(t))return!1;for(var e=0,n=this.a.length;n>e;e++)if(1===this.a[e].compareTo(t))return this.a.splice(e,0,t),!0;return this.a.push(t),!0},R.prototype.add=R.prototype.add,R.prototype.e=function(t){for(t=t.f();t.c();)this.add(t.next());return!0},R.prototype.addAll=R.prototype.e,R.prototype.remove=function(){throw new g},R.prototype.remove=R.prototype.remove,R.prototype.size=function(){return this.a.length},R.prototype.size=R.prototype.size,R.prototype.g=function(){return 0===this.a.length},R.prototype.isEmpty=R.prototype.g,R.prototype.h=function(){for(var t=[],e=0,n=this.a.length;n>e;e++)t.push(this.a[e]);return t},R.prototype.toArray=R.prototype.h,R.prototype.f=function(){return new w(this)},R.prototype.iterator=R.prototype.f,e("$jscomp.scope.Iterator_$2",w),w.prototype.l=null,w.prototype.b=0,w.prototype.next=function(){if(this.b===this.l.size())throw new p;return this.l.a[this.b++]},w.prototype.next=w.prototype.next,w.prototype.c=function(){return this.b<this.l.size()?!0:!1},w.prototype.hasNext=w.prototype.c,w.prototype.remove=function(){throw new g},w.prototype.remove=w.prototype.remove,"undefined"!=typeof t&&(t.javascript={},t.javascript.util={},t.javascript.util.ArrayList=l,t.javascript.util.Arrays=d,t.javascript.util.Collection=s,t.javascript.util.EmptyStackException=o,t.javascript.util.HashMap=c,t.javascript.util.HashSet=m,t.javascript.util.IndexOutOfBoundsException=r,t.javascript.util.Iterator=i,t.javascript.util.List=a,t.javascript.util.Map=u,t.javascript.util.NoSuchElementException=p,t.javascript.util.OperationNotSupported=g,t.javascript.util.Set=f,t.javascript.util.SortedMap=j,t.javascript.util.SortedSet=v,t.javascript.util.Stack=E,t.javascript.util.TreeMap=C,t.javascript.util.TreeSet=R)}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],20:[function(t){t("./dist/javascript.util-node.min.js")},{"./dist/javascript.util-node.min.js":19}],21:[function(t,e){var n=t("turf-extent"),o=t("turf-point");e.exports=function(t){var e=n(t),r=(e[0]+e[2])/2,i=(e[1]+e[3])/2;return o([r,i])}},{"turf-extent":70,"turf-point":102}],22:[function(t,e){var n=t("turf-meta").coordEach,o=t("turf-point");e.exports=function(t){var e=0,r=0,i=0;return n(t,function(t){e+=t[0],r+=t[1],i++},!0),o([e/i,r/i])}},{"turf-meta":23,"turf-point":102}],23:[function(t,e){function n(t,e,n){var o,r,i,s,a,u,p,g,h,d=0,c="FeatureCollection"===t.type,f="Feature"===t.type,m=c?t.features.length:1;for(o=0;m>o;o++)for(g=c?t.features[o].geometry:f?t.geometry:t,h="GeometryCollection"===g.type,u=h?g.geometries.length:1,s=0;u>s;s++)if(a=h?g.geometries[s]:g,p=a.coordinates,d=!n||"Polygon"!==a.type&&"MultiPolygon"!==a.type?0:1,"Point"===a.type)e(p);else if("LineString"===a.type||"MultiPoint"===a.type)for(r=0;r<p.length;r++)e(p[r]);else if("Polygon"===a.type||"MultiLineString"===a.type)for(r=0;r<p.length;r++)for(i=0;i<p[r].length-d;i++)e(p[r][i]);else{if("MultiPolygon"!==a.type)throw new Error("Unknown Geometry Type");for(r=0;r<p.length;r++)for(i=0;i<p[r].length;i++)for(l=0;l<p[r][i].length-d;l++)e(p[r][i][l])}}function o(t,e,o,r){return n(t,function(t){o=e(o,t)},r),o}function r(t,e){var n;switch(t.type){case"FeatureCollection":for(features=t.features,n=0;n<t.features.length;n++)e(t.features[n].properties);break;case"Feature":e(t.properties)}}function i(t,e,n){return r(t,function(t){n=e(n,t)}),n}e.exports.coordEach=n,e.exports.coordReduce=o,e.exports.propEach=r,e.exports.propReduce=i},{}],24:[function(t,e){function n(t){return t.map(function(t){return t.coordinates})}e.exports=function(t){var e=t.features[0].geometry.type,o=t.features.map(function(t){return t.geometry});switch(e){case"Point":return{type:"Feature",properties:{},geometry:{type:"MultiPoint",coordinates:n(o)}};case"LineString":return{type:"Feature",properties:{},geometry:{type:"MultiLineString",coordinates:n(o)}};case"Polygon":return{type:"Feature",properties:{},geometry:{type:"MultiPolygon",coordinates:n(o)}};default:return t}}},{}],25:[function(t,e){var n={};n.tin=t("turf-tin"),n.merge=t("turf-merge"),n.distance=t("turf-distance"),n.point=t("turf-point"),e.exports=function(t,e,o){function r(t){var r=n.point(t.geometry.coordinates[0][0]),i=n.point(t.geometry.coordinates[0][1]),s=n.point(t.geometry.coordinates[0][2]),a=n.distance(r,i,o),u=n.distance(i,s,o),p=n.distance(r,s,o);return e>=a&&e>=u&&e>=p}if("number"!=typeof e)throw new Error("maxEdge parameter is required");if("string"!=typeof o)throw new Error("units parameter is required");var i=n.tin(t),s=i.features.filter(r);return i.features=s,n.merge(i)}},{"turf-distance":60,"turf-merge":93,"turf-point":102,"turf-tin":118}],26:[function(t,e){var n=t("turf-meta").coordEach,o=t("convex-hull"),r=t("turf-polygon");e.exports=function(t){var e=[];n(t,function(t){e.push(t)});for(var i=o(e),s=[],a=0;a<i.length;a++)s.push(e[i[a][0]]);return s.push(e[i[i.length-1][1]]),r([s])}},{"convex-hull":27,"turf-meta":55,"turf-polygon":103}],27:[function(t,e){"use strict";function n(t){var e=t.length;if(0===e)return[];if(1===e)return[[0]];var n=t[0].length;return 0===n?[]:1===n?o(t):2===n?r(t):i(t,n)}var o=t("./lib/ch1d"),r=t("./lib/ch2d"),i=t("./lib/chnd");e.exports=n},{"./lib/ch1d":28,"./lib/ch2d":29,"./lib/chnd":30}],28:[function(t,e){"use strict";function n(t){for(var e=0,n=0,o=1;o<t.length;++o)t[o][0]<t[e][0]&&(e=o),t[o][0]>t[n][0]&&(n=o);return n>e?[[e],[n]]:e>n?[[n],[e]]:[[e]]}e.exports=n},{}],29:[function(t,e){"use strict";function n(t){var e=o(t),n=e.length;if(2>=n)return[];for(var r=new Array(n),i=e[n-1],s=0;n>s;++s){var a=e[s];r[s]=[i,a],i=a}return r}e.exports=n;var o=t("monotone-convex-hull-2d")},{"monotone-convex-hull-2d":48}],30:[function(t,e){"use strict";function n(t,e){for(var n=t.length,o=new Array(n),r=0;r<e.length;++r)o[r]=t[e[r]];for(var i=e.length,r=0;n>r;++r)e.indexOf(r)<0&&(o[i++]=t[r]);return o}function o(t,e){for(var n=t.length,o=e.length,r=0;n>r;++r)for(var i=t[r],s=0;s<i.length;++s){var a=i[s];if(o>a)i[s]=e[a];else{a-=o;for(var u=0;o>u;++u)a>=e[u]&&(a+=1);i[s]=a}}return t}function r(t,e){try{return i(t,!0)}catch(r){var a=s(t);if(a.length<=e)return[];var u=n(t,a),p=i(u,!0);return o(p,a)}}e.exports=r;var i=t("incremental-convex-hull"),s=t("affine-hull")},{"affine-hull":31,"incremental-convex-hull":38}],31:[function(t,e){"use strict";function n(t,e){for(var n=new Array(e+1),o=0;o<t.length;++o)n[o]=t[o];for(var o=0;o<=t.length;++o){for(var i=t.length;e>=i;++i){for(var s=new Array(e),a=0;e>a;++a)s[a]=Math.pow(i+1-o,a);n[i]=s}var u=r.apply(void 0,n);if(u)return!0}return!1}function o(t){var e=t.length;if(0===e)return[];if(1===e)return[0];for(var o=t[0].length,r=[t[0]],i=[0],s=1;e>s;++s)if(r.push(t[s]),n(r,o)){if(i.push(s),i.length===o+1)return i}else r.pop();return i}e.exports=o;var r=t("robust-orientation")},{"robust-orientation":37}],32:[function(t,e){"use strict";function n(t,e,n){var o=t+e,r=o-t,i=o-r,s=e-r,a=t-i;return n?(n[0]=a+s,n[1]=o,n):[a+s,o]}e.exports=n},{}],33:[function(t,e){"use strict";function n(t,e){var n=t.length;if(1===n){var i=o(t[0],e);return i[0]?i:[i[1]]}var s=new Array(2*n),a=[.1,.1],u=[.1,.1],p=0;o(t[0],e,a),a[0]&&(s[p++]=a[0]);for(var g=1;n>g;++g){o(t[g],e,u);var l=a[1];r(l,u[0],a),a[0]&&(s[p++]=a[0]);var h=u[1],d=a[1],c=h+d,f=c-h,m=d-f;a[1]=c,m&&(s[p++]=m)}return a[1]&&(s[p++]=a[1]),0===p&&(s[p++]=0),s.length=p,s}var o=t("two-product"),r=t("two-sum");e.exports=n},{"two-product":36,"two-sum":32}],34:[function(t,e){"use strict";function n(t,e){var n=t+e,o=n-t,r=n-o,i=e-o,s=t-r,a=s+i;return a?[a,n]:[n]}function o(t,e){var o=0|t.length,r=0|e.length;if(1===o&&1===r)return n(t[0],-e[0]);var i,s,a=o+r,u=new Array(a),p=0,g=0,l=0,h=Math.abs,d=t[g],c=h(d),f=-e[l],m=h(f);m>c?(s=d,g+=1,o>g&&(d=t[g],c=h(d))):(s=f,l+=1,r>l&&(f=-e[l],m=h(f))),o>g&&m>c||l>=r?(i=d,g+=1,o>g&&(d=t[g],c=h(d))):(i=f,l+=1,r>l&&(f=-e[l],m=h(f)));for(var y,j,v,E,x,I=i+s,S=I-i,L=s-S,C=L,N=I;o>g&&r>l;)m>c?(i=d,g+=1,o>g&&(d=t[g],c=h(d))):(i=f,l+=1,r>l&&(f=-e[l],m=h(f))),s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y;for(;o>g;)i=d,s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y,g+=1,o>g&&(d=t[g]);for(;r>l;)i=f,s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y,l+=1,r>l&&(f=-e[l]);return C&&(u[p++]=C),N&&(u[p++]=N),p||(u[p++]=0),u.length=p,u}e.exports=o},{}],35:[function(t,e){"use strict";function n(t,e){var n=t+e,o=n-t,r=n-o,i=e-o,s=t-r,a=s+i;return a?[a,n]:[n]}function o(t,e){var o=0|t.length,r=0|e.length;if(1===o&&1===r)return n(t[0],e[0]);var i,s,a=o+r,u=new Array(a),p=0,g=0,l=0,h=Math.abs,d=t[g],c=h(d),f=e[l],m=h(f);m>c?(s=d,g+=1,o>g&&(d=t[g],c=h(d))):(s=f,l+=1,r>l&&(f=e[l],m=h(f))),o>g&&m>c||l>=r?(i=d,g+=1,o>g&&(d=t[g],c=h(d))):(i=f,l+=1,r>l&&(f=e[l],m=h(f)));for(var y,j,v,E,x,I=i+s,S=I-i,L=s-S,C=L,N=I;o>g&&r>l;)m>c?(i=d,g+=1,o>g&&(d=t[g],c=h(d))):(i=f,l+=1,r>l&&(f=e[l],m=h(f))),s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y;for(;o>g;)i=d,s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y,g+=1,o>g&&(d=t[g]);for(;r>l;)i=f,s=C,I=i+s,S=I-i,L=s-S,L&&(u[p++]=L),y=N+I,j=y-N,v=y-j,E=I-j,x=N-v,C=x+E,N=y,l+=1,r>l&&(f=e[l]);return C&&(u[p++]=C),N&&(u[p++]=N),p||(u[p++]=0),u.length=p,u}e.exports=o},{}],36:[function(t,e){"use strict";function n(t,e,n){var r=t*e,i=o*t,s=i-t,a=i-s,u=t-a,p=o*e,g=p-e,l=p-g,h=e-l,d=r-a*l,c=d-u*l,f=c-a*h,m=u*h-f;return n?(n[0]=m,n[1]=r,n):[m,r]}e.exports=n;var o=+(Math.pow(2,27)+1)},{}],37:[function(t,e){"use strict";function n(t,e){for(var n=new Array(t.length-1),o=1;o<t.length;++o)for(var r=n[o-1]=new Array(t.length-1),i=0,s=0;i<t.length;++i)i!==e&&(r[s++]=t[o][i]);return n}function o(t){for(var e=new Array(t),n=0;t>n;++n){e[n]=new Array(t);for(var o=0;t>o;++o)e[n][o]=["m",o,"[",t-n-1,"]"].join("")}return e}function r(t){return 1&t?"-":""}function i(t){if(1===t.length)return t[0];if(2===t.length)return["sum(",t[0],",",t[1],")"].join("");var e=t.length>>1;return["sum(",i(t.slice(0,e)),",",i(t.slice(e)),")"].join("")}function s(t){if(2===t.length)return[["sum(prod(",t[0][0],",",t[1][1],"),prod(-",t[0][1],",",t[1][0],"))"].join("")];for(var e=[],o=0;o<t.length;++o)e.push(["scale(",i(s(n(t,o))),",",r(o),t[0][o],")"].join(""));return e}function a(t){for(var e=[],r=[],a=o(t),u=[],p=0;t>p;++p)0===(1&p)?e.push.apply(e,s(n(a,p))):r.push.apply(r,s(n(a,p))),u.push("m"+p);var c=i(e),f=i(r),m="orientation"+t+"Exact",y=["function ",m,"(",u.join(),"){var p=",c,",n=",f,",d=sub(p,n);return d[d.length-1];};return ",m].join(""),j=new Function("sum","prod","scale","sub",y);return j(l,g,h,d)}function u(t){var e=E[t.length];return e||(e=E[t.length]=a(t.length)),e.apply(void 0,t)}function p(){for(;E.length<=c;)E.push(a(E.length));for(var t=[],n=["slow"],o=0;c>=o;++o)t.push("a"+o),n.push("o"+o);for(var r=["function getOrientation(",t.join(),"){switch(arguments.length){case 0:case 1:return 0;"],o=2;c>=o;++o)r.push("case ",o,":return o",o,"(",t.slice(0,o).join(),");");r.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation"),n.push(r.join(""));var i=Function.apply(void 0,n);e.exports=i.apply(void 0,[u].concat(E));for(var o=0;c>=o;++o)e.exports[o]=E[o]}var g=t("two-product"),l=t("robust-sum"),h=t("robust-scale"),d=t("robust-subtract"),c=5,f=1.1102230246251565e-16,m=(3+16*f)*f,y=(7+56*f)*f,j=a(3),v=a(4),E=[function(){return 0},function(){return 0},function(t,e){return e[0]-t[0]},function(t,e,n){var o,r=(t[1]-n[1])*(e[0]-n[0]),i=(t[0]-n[0])*(e[1]-n[1]),s=r-i;if(r>0){if(0>=i)return s;o=r+i}else{if(!(0>r))return s;if(i>=0)return s;o=-(r+i)}var a=m*o;return s>=a||-a>=s?s:j(t,e,n)},function(t,e,n,o){var r=t[0]-o[0],i=e[0]-o[0],s=n[0]-o[0],a=t[1]-o[1],u=e[1]-o[1],p=n[1]-o[1],g=t[2]-o[2],l=e[2]-o[2],h=n[2]-o[2],d=i*p,c=s*u,f=s*a,m=r*p,j=r*u,E=i*a,x=g*(d-c)+l*(f-m)+h*(j-E),I=(Math.abs(d)+Math.abs(c))*Math.abs(g)+(Math.abs(f)+Math.abs(m))*Math.abs(l)+(Math.abs(j)+Math.abs(E))*Math.abs(h),S=y*I;return x>S||-x>S?x:v(t,e,n,o)}];p()},{"robust-scale":33,"robust-subtract":34,"robust-sum":35,"two-product":36}],38:[function(t,e){"use strict";function n(t,e,n){this.vertices=t,this.adjacent=e,this.boundary=n,this.lastVisited=-1}function o(t,e,n){this.vertices=t,this.cell=e,this.index=n}function r(t,e){return p(t.vertices,e.vertices)}function i(t){for(var e=["function orient(){var tuple=this.tuple;return test("],n=0;t>=n;++n)n>0&&e.push(","),e.push("tuple[",n,"]");e.push(")}return orient");var o=new Function("test",e.join("")),r=u[t+1];return r||(r=u),o(r)}function s(t,e,n){this.dimension=t,this.vertices=e,this.simplices=n,this.interior=n.filter(function(t){return!t.boundary}),this.tuple=new Array(t+1);for(var o=0;t>=o;++o)this.tuple[o]=this.vertices[o];var r=g[t];r||(r=g[t]=i(t)),this.orient=r}function a(t,e){var o=t.length;if(0===o)throw new Error("Must have at least d+1 points");var r=t[0].length;if(r>=o)throw new Error("Must input at least d+1 points");var i=t.slice(0,r+1),a=u.apply(void 0,i);if(0===a)throw new Error("Input not in general position");for(var p=new Array(r+1),g=0;r>=g;++g)p[g]=g;0>a&&(p[0]=1,p[1]=0);for(var l=new n(p,new Array(r+1),!1),h=l.adjacent,d=new Array(r+2),g=0;r>=g;++g){for(var c=p.slice(),f=0;r>=f;++f)f===g&&(c[f]=-1);var m=c[0];c[0]=c[1],c[1]=m;var y=new n(c,new Array(r+1),!0);h[g]=y,d[g]=y}d[r+1]=l;for(var g=0;r>=g;++g)for(var c=h[g].vertices,j=h[g].adjacent,f=0;r>=f;++f){var v=c[f];if(0>v)j[f]=l;else for(var E=0;r>=E;++E)h[E].vertices.indexOf(v)<0&&(j[f]=h[E])}for(var x=new s(r,i,d),I=!!e,g=r+1;o>g;++g)x.insert(t[g],I);return x.boundary()}e.exports=a;var u=t("robust-orientation"),p=t("simplicial-complex").compareCells;n.prototype.flip=function(){var t=this.vertices[0];this.vertices[0]=this.vertices[1],this.vertices[1]=t;var e=this.adjacent[0];this.adjacent[0]=this.adjacent[1],this.adjacent[1]=e};var g=[],l=s.prototype;l.handleBoundaryDegeneracy=function(t,e){var n=this.dimension,o=this.vertices.length-1,r=this.tuple,i=this.vertices,s=[t];for(t.lastVisited=-o;s.length>0;){t=s.pop();for(var a=(t.vertices,t.adjacent),u=0;n>=u;++u){var p=a[u];if(p.boundary&&!(p.lastVisited<=-o)){for(var g=p.vertices,l=0;n>=l;++l){var h=g[l];r[l]=0>h?e:i[h]}var d=this.orient();if(d>0)return p;p.lastVisited=-o,0===d&&s.push(p)}}}return null},l.walk=function(t,e){var n=this.vertices.length-1,o=this.dimension,r=this.vertices,i=this.tuple,s=e?this.interior.length*Math.random()|0:this.interior.length-1,a=this.interior[s];t:for(;!a.boundary;){for(var u=a.vertices,p=a.adjacent,g=0;o>=g;++g)i[g]=r[u[g]];a.lastVisited=n;for(var g=0;o>=g;++g){var l=p[g];if(!(l.lastVisited>=n)){var h=i[g];i[g]=t;var d=this.orient();if(i[g]=h,0>d){a=l;continue t}l.lastVisited=l.boundary?-n:n}}return}return a},l.addPeaks=function(t,e){var i=this.vertices.length-1,s=this.dimension,a=this.vertices,u=this.tuple,p=this.interior,g=this.simplices,l=[e];e.lastVisited=i,e.vertices[e.vertices.indexOf(-1)]=i,e.boundary=!1,p.push(e);for(var h=[];l.length>0;){var e=l.pop(),d=e.vertices,c=e.adjacent,f=d.indexOf(i);if(!(0>f))for(var m=0;s>=m;++m)if(m!==f){var y=c[m];if(y.boundary&&!(y.lastVisited>=i)){var j=y.vertices;if(y.lastVisited!==-i){for(var v=0,E=0;s>=E;++E)j[E]<0?(v=E,u[E]=t):u[E]=a[j[E]];var x=this.orient();if(x>0){j[v]=i,y.boundary=!1,p.push(y),l.push(y),y.lastVisited=i;continue}y.lastVisited=-i}var I=y.adjacent,S=d.slice(),L=c.slice(),C=new n(S,L,!0);g.push(C);var N=I.indexOf(e);if(!(0>N)){I[N]=C,L[f]=y,S[m]=-1,L[m]=e,c[m]=C,C.flip();for(var E=0;s>=E;++E){var b=S[E];if(!(0>b||b===i)){for(var P=new Array(s-1),R=0,w=0;s>=w;++w){var O=S[w];0>O||w===E||(P[R++]=O)}h.push(new o(P,C,E))}}}}}}h.sort(r);for(var m=0;m+1<h.length;m+=2){var M=h[m],A=h[m+1],T=M.index,D=A.index;0>T||0>D||(M.cell.adjacent[M.index]=A.cell,A.cell.adjacent[A.index]=M.cell)}},l.insert=function(t,e){var n=this.vertices;n.push(t);var o=this.walk(t,e);if(o){for(var r=this.dimension,i=this.tuple,s=0;r>=s;++s){var a=o.vertices[s];i[s]=0>a?t:n[a]}var u=this.orient(i);0>u||(0!==u||(o=this.handleBoundaryDegeneracy(o,t)))&&this.addPeaks(t,o)}},l.boundary=function(){for(var t=this.dimension,e=[],n=this.simplices,o=n.length,r=0;o>r;++r){var i=n[r];if(i.boundary){for(var s=new Array(t),a=i.vertices,u=0,p=0,g=0;t>=g;++g)a[g]>=0?s[u++]=a[g]:p=1&g;if(p===(1&t)){var l=s[0];s[0]=s[1],s[1]=l}e.push(s)}}return e}},{"robust-orientation":44,"simplicial-complex":47}],39:[function(t,e,n){arguments[4][32][0].apply(n,arguments)},{dup:32}],40:[function(t,e,n){arguments[4][33][0].apply(n,arguments)},{dup:33,"two-product":43,"two-sum":39}],41:[function(t,e,n){arguments[4][34][0].apply(n,arguments)},{dup:34}],42:[function(t,e,n){arguments[4][35][0].apply(n,arguments)},{dup:35}],43:[function(t,e,n){arguments[4][36][0].apply(n,arguments)},{dup:36}],44:[function(t,e,n){arguments[4][37][0].apply(n,arguments)},{dup:37,"robust-scale":40,"robust-subtract":41,"robust-sum":42,"two-product":43}],45:[function(t,e,n){"use strict";"use restrict";function o(t){var e=32;return t&=-t,t&&e--,65535&t&&(e-=16),16711935&t&&(e-=8),252645135&t&&(e-=4),858993459&t&&(e-=2),1431655765&t&&(e-=1),e}var r=32;n.INT_BITS=r,n.INT_MAX=2147483647,n.INT_MIN=-1<<r-1,n.sign=function(t){return(t>0)-(0>t)},n.abs=function(t){var e=t>>r-1;return(t^e)-e},n.min=function(t,e){return e^(t^e)&-(e>t)},n.max=function(t,e){return t^(t^e)&-(e>t)},n.isPow2=function(t){return!(t&t-1||!t)},n.log2=function(t){var e,n;return e=(t>65535)<<4,t>>>=e,n=(t>255)<<3,t>>>=n,e|=n,n=(t>15)<<2,t>>>=n,e|=n,n=(t>3)<<1,t>>>=n,e|=n,e|t>>1},n.log10=function(t){return t>=1e9?9:t>=1e8?8:t>=1e7?7:t>=1e6?6:t>=1e5?5:t>=1e4?4:t>=1e3?3:t>=100?2:t>=10?1:0},n.popCount=function(t){return t-=t>>>1&1431655765,t=(858993459&t)+(t>>>2&858993459),16843009*(t+(t>>>4)&252645135)>>>24},n.countTrailingZeros=o,n.nextPow2=function(t){return t+=0===t,--t,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t+1},n.prevPow2=function(t){return t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,t|=t>>>16,t-(t>>>1)},n.parity=function(t){return t^=t>>>16,t^=t>>>8,t^=t>>>4,t&=15,27030>>>t&1};var i=new Array(256);!function(t){for(var e=0;256>e;++e){var n=e,o=e,r=7;for(n>>>=1;n;n>>>=1)o<<=1,o|=1&n,--r;t[e]=o<<r&255}}(i),n.reverse=function(t){return i[255&t]<<24|i[t>>>8&255]<<16|i[t>>>16&255]<<8|i[t>>>24&255]},n.interleave2=function(t,e){return t&=65535,t=16711935&(t|t<<8),t=252645135&(t|t<<4),t=858993459&(t|t<<2),t=1431655765&(t|t<<1),e&=65535,e=16711935&(e|e<<8),e=252645135&(e|e<<4),e=858993459&(e|e<<2),e=1431655765&(e|e<<1),t|e<<1},n.deinterleave2=function(t,e){return t=t>>>e&1431655765,t=858993459&(t|t>>>1),t=252645135&(t|t>>>2),t=16711935&(t|t>>>4),t=65535&(t|t>>>16),t<<16>>16},n.interleave3=function(t,e,n){return t&=1023,t=4278190335&(t|t<<16),t=251719695&(t|t<<8),t=3272356035&(t|t<<4),t=1227133513&(t|t<<2),e&=1023,e=4278190335&(e|e<<16),e=251719695&(e|e<<8),e=3272356035&(e|e<<4),e=1227133513&(e|e<<2),t|=e<<1,n&=1023,n=4278190335&(n|n<<16),n=251719695&(n|n<<8),n=3272356035&(n|n<<4),n=1227133513&(n|n<<2),t|n<<2},n.deinterleave3=function(t,e){return t=t>>>e&1227133513,t=3272356035&(t|t>>>2),t=251719695&(t|t>>>4),t=4278190335&(t|t>>>8),t=1023&(t|t>>>16),t<<22>>22},n.nextCombination=function(t){var e=t|t-1;return e+1|(~e&-~e)-1>>>o(t)+1}},{}],46:[function(t,e){"use strict";"use restrict";function n(t){this.roots=new Array(t),this.ranks=new Array(t);for(var e=0;t>e;++e)this.roots[e]=e,this.ranks[e]=0}e.exports=n;var o=n.prototype;Object.defineProperty(o,"length",{get:function(){return this.roots.length}}),o.makeSet=function(){var t=this.roots.length;return this.roots.push(t),this.ranks.push(0),t},o.find=function(t){for(var e=this.roots;e[t]!==t;){var n=e[t];e[t]=e[n],t=n}return t},o.link=function(t,e){var n=this.find(t),o=this.find(e);if(n!==o){var r=this.ranks,i=this.roots,s=r[n],a=r[o];a>s?i[n]=o:s>a?i[o]=n:(i[o]=n,++r[n])}}},{}],47:[function(t,e,n){"use strict";"use restrict";function o(t){for(var e=0,n=Math.max,o=0,r=t.length;r>o;++o)e=n(e,t[o].length);return e-1}function r(t){for(var e=-1,n=Math.max,o=0,r=t.length;r>o;++o)for(var i=t[o],s=0,a=i.length;a>s;++s)e=n(e,i[s]);return e+1}function i(t){for(var e=new Array(t.length),n=0,o=t.length;o>n;++n)e[n]=t[n].slice(0);return e}function s(t,e){var n=t.length,o=t.length-e.length,r=Math.min;if(o)return o;switch(n){case 0:return 0;case 1:return t[0]-e[0];case 2:var i=t[0]+t[1]-e[0]-e[1];return i?i:r(t[0],t[1])-r(e[0],e[1]);case 3:var s=t[0]+t[1],a=e[0]+e[1];if(i=s+t[2]-(a+e[2]))return i;var u=r(t[0],t[1]),p=r(e[0],e[1]),i=r(u,t[2])-r(p,e[2]);return i?i:r(u+t[2],s)-r(p+e[2],a);default:var g=t.slice(0);g.sort();var l=e.slice(0);l.sort();for(var h=0;n>h;++h)if(o=g[h]-l[h])return o;return 0}}function a(t,e){return s(t[0],e[0])}function u(t,e){if(e){for(var n=t.length,o=new Array(n),r=0;n>r;++r)o[r]=[t[r],e[r]];o.sort(a);for(var r=0;n>r;++r)t[r]=o[r][0],e[r]=o[r][1];return t}return t.sort(s),t}function p(t){if(0===t.length)return[];for(var e=1,n=t.length,o=1;n>o;++o){var r=t[o];if(s(r,t[o-1])){if(o===e){e++;continue}t[e++]=r}}return t.length=e,t}function g(t,e){for(var n=0,o=t.length-1,r=-1;o>=n;){var i=n+o>>1,a=s(t[i],e);0>=a?(0===a&&(r=i),n=i+1):a>0&&(o=i-1)}return r}function l(t,e){for(var n=new Array(t.length),o=0,r=n.length;r>o;++o)n[o]=[];for(var i=[],o=0,a=e.length;a>o;++o)for(var u=e[o],p=u.length,l=1,h=1<<p;h>l;++l){i.length=v.popCount(l);for(var d=0,c=0;p>c;++c)l&1<<c&&(i[d++]=u[c]);var f=g(t,i);if(!(0>f))for(;;)if(n[f++].push(o),f>=t.length||0!==s(t[f],i))break}return n}function h(t,e){if(!e)return l(p(c(t,0)),t,0);for(var n=new Array(e),o=0;e>o;++o)n[o]=[];for(var o=0,r=t.length;r>o;++o)for(var i=t[o],s=0,a=i.length;a>s;++s)n[i[s]].push(o);return n}function d(t){for(var e=[],n=0,o=t.length;o>n;++n)for(var r=t[n],i=0|r.length,s=1,a=1<<i;a>s;++s){for(var p=[],g=0;i>g;++g)s>>>g&1&&p.push(r[g]);e.push(p)}return u(e)}function c(t,e){if(0>e)return[];for(var n=[],o=(1<<e+1)-1,r=0;r<t.length;++r)for(var i=t[r],s=o;s<1<<i.length;s=v.nextCombination(s)){for(var a=new Array(e+1),p=0,g=0;g<i.length;++g)s&1<<g&&(a[p++]=i[g]);n.push(a)}return u(n)}function f(t){for(var e=[],n=0,o=t.length;o>n;++n)for(var r=t[n],i=0,s=r.length;s>i;++i){for(var a=new Array(r.length-1),p=0,g=0;s>p;++p)p!==i&&(a[g++]=r[p]);e.push(a)}return u(e)}function m(t,e){for(var n=new E(e),o=0;o<t.length;++o)for(var r=t[o],i=0;i<r.length;++i)for(var s=i+1;s<r.length;++s)n.link(r[i],r[s]);for(var a=[],u=n.ranks,o=0;o<u.length;++o)u[o]=-1;for(var o=0;o<t.length;++o){var p=n.find(t[o][0]);u[p]<0?(u[p]=a.length,a.push([t[o].slice(0)])):a[u[p]].push(t[o].slice(0))}return a}function y(t){for(var e=p(u(c(t,0))),n=new E(e.length),o=0;o<t.length;++o)for(var r=t[o],i=0;i<r.length;++i)for(var s=g(e,[r[i]]),a=i+1;a<r.length;++a)n.link(s,g(e,[r[a]]));for(var l=[],h=n.ranks,o=0;o<h.length;++o)h[o]=-1;for(var o=0;o<t.length;++o){var d=n.find(g(e,[t[o][0]]));h[d]<0?(h[d]=l.length,l.push([t[o].slice(0)])):l[h[d]].push(t[o].slice(0))}return l}function j(t,e){return e?m(t,e):y(t)}var v=t("bit-twiddle"),E=t("union-find");n.dimension=o,n.countVertices=r,n.cloneCells=i,n.compareCells=s,n.normalize=u,n.unique=p,n.findCell=g,n.incidence=l,n.dual=h,n.explode=d,n.skeleton=c,n.boundary=f,n.connectedComponents=j},{"bit-twiddle":45,"union-find":46}],48:[function(t,e){"use strict";function n(t){var e=t.length;if(3>e){for(var n=new Array(e),r=0;e>r;++r)n[r]=r;return 2===e&&t[0][0]===t[1][0]&&t[0][1]===t[1][1]?[0]:n}for(var i=new Array(e),r=0;e>r;++r)i[r]=r;i.sort(function(e,n){var o=t[e][0]-t[n][0];return o?o:t[e][1]-t[n][1]});for(var s=[i[0],i[1]],a=[i[0],i[1]],r=2;e>r;++r){for(var u=i[r],p=t[u],g=s.length;g>1&&o(t[s[g-2]],t[s[g-1]],p)<=0;)g-=1,s.pop();for(s.push(u),g=a.length;g>1&&o(t[a[g-2]],t[a[g-1]],p)>=0;)g-=1,a.pop();a.push(u)}for(var n=new Array(a.length+s.length-2),l=0,r=0,h=s.length;h>r;++r)n[l++]=s[r];for(var d=a.length-2;d>0;--d)n[l++]=a[d];return n}e.exports=n;var o=t("robust-orientation")[3]},{"robust-orientation":54}],49:[function(t,e,n){arguments[4][32][0].apply(n,arguments)},{dup:32}],50:[function(t,e,n){arguments[4][33][0].apply(n,arguments)},{dup:33,"two-product":53,"two-sum":49}],51:[function(t,e,n){arguments[4][34][0].apply(n,arguments)},{dup:34}],52:[function(t,e,n){arguments[4][35][0].apply(n,arguments)},{dup:35}],53:[function(t,e,n){arguments[4][36][0].apply(n,arguments)},{dup:36}],54:[function(t,e,n){arguments[4][37][0].apply(n,arguments)},{dup:37,"robust-scale":50,"robust-subtract":51,"robust-sum":52,"two-product":53}],55:[function(t,e,n){arguments[4][23][0].apply(n,arguments)},{dup:23}],56:[function(t,e){var n=t("turf-inside");e.exports=function(t,e,o){for(var r=0;r<t.features.length;r++){var i=t.features[r];i.properties||(i.properties={});for(var s=0,a=0;a<e.features.length;a++){var u=e.features[a];n(u,i)&&s++}i.properties[o]=s}return t}},{"turf-inside":76}],57:[function(t,e){function n(t){return t*Math.PI/180}function o(t){return 180*t/Math.PI}var r=t("turf-point");e.exports=function(t,e,i,s){var a=t.geometry.coordinates,u=n(a[0]),p=n(a[1]),g=n(i),l=0;switch(s){case"miles":l=3960;break;case"kilometers":l=6373;break;case"degrees":l=57.2957795;break;case"radians":l=1}var h=Math.asin(Math.sin(p)*Math.cos(e/l)+Math.cos(p)*Math.sin(e/l)*Math.cos(g)),d=u+Math.atan2(Math.sin(g)*Math.sin(e/l)*Math.cos(p),Math.cos(e/l)-Math.sin(p)*Math.sin(h));return r([o(d),o(h)])}},{"turf-point":102}],58:[function(t,e){var n=t("simple-statistics"),o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n.standard_deviation(s)}),t}},{"simple-statistics":59,"turf-inside":76}],59:[function(t,e){!function(){function t(){var t={},e=[];return t.data=function(n){return arguments.length?(e=n.slice(),t):e},t.mb=function(){var t,n,o=e.length;if(1===o)t=0,n=e[0][1];else{for(var r,i,s,a=0,u=0,p=0,g=0,l=0;o>l;l++)r=e[l],i=r[0],s=r[1],a+=i,u+=s,p+=i*i,g+=i*s;t=(o*g-a*u)/(o*p-a*a),n=u/o-t*a/o}return{m:t,b:n}},t.m=function(){return t.mb().m},t.b=function(){return t.mb().b},t.line=function(){var e=t.mb(),n=e.m,o=e.b;return function(t){return o+n*t}},t}function n(t,e){if(t.length<2)return 1;for(var n,o=0,r=0;r<t.length;r++)o+=t[r][1];n=o/t.length;for(var i=0,s=0;s<t.length;s++)i+=Math.pow(n-t[s][1],2);for(var a=0,u=0;u<t.length;u++)a+=Math.pow(t[u][1]-e(t[u][0]),2);return 1-a/i}function o(){var t={},e=0,n={};return t.train=function(t,o){n[o]||(n[o]={});for(var r in t){var i=t[r];
void 0===n[o][r]&&(n[o][r]={}),void 0===n[o][r][i]&&(n[o][r][i]=0),n[o][r][t[r]]++}e++},t.score=function(t){var o,r={};for(var i in t){var s=t[i];for(o in n)void 0===r[o]&&(r[o]={}),r[o][i+"_"+s]=n[o][i]?(n[o][i][s]||0)/e:0}var a={};for(o in r)for(var u in r[o])void 0===a[o]&&(a[o]=0),a[o]+=r[o][u];return a},t}function r(t){for(var e=0,n=0;n<t.length;n++)e+=t[n];return e}function i(t){return 0===t.length?null:r(t)/t.length}function s(t){if(0===t.length)return null;for(var e=1,n=0;n<t.length;n++){if(t[n]<=0)return null;e*=t[n]}return Math.pow(e,1/t.length)}function a(t){if(0===t.length)return null;for(var e=0,n=0;n<t.length;n++){if(t[n]<=0)return null;e+=1/t[n]}return t.length/e}function u(t){for(var e,n=0;n<t.length;n++)(t[n]<e||void 0===e)&&(e=t[n]);return e}function p(t){for(var e,n=0;n<t.length;n++)(t[n]>e||void 0===e)&&(e=t[n]);return e}function g(t){if(0===t.length)return null;for(var e=i(t),n=[],o=0;o<t.length;o++)n.push(Math.pow(t[o]-e,2));return i(n)}function l(t){return 0===t.length?null:Math.sqrt(g(t))}function h(t,e){for(var n=i(t),o=0,r=0;r<t.length;r++)o+=Math.pow(t[r]-n,e);return o}function d(t){if(t.length<=1)return null;var e=h(t,2);return e/(t.length-1)}function c(t){return t.length<=1?null:Math.sqrt(d(t))}function f(t,e){if(t.length<=1||t.length!=e.length)return null;for(var n=i(t),o=i(e),r=0,s=0;s<t.length;s++)r+=(t[s]-n)*(e[s]-o);return r/(t.length-1)}function m(t,e){var n=f(t,e),o=c(t),r=c(e);return null===n||null===o||null===r?null:n/o/r}function y(t){if(0===t.length)return null;var e=t.slice().sort(function(t,e){return t-e});if(e.length%2===1)return e[(e.length-1)/2];var n=e[e.length/2-1],o=e[e.length/2];return(n+o)/2}function j(t){if(0===t.length)return null;if(1===t.length)return t[0];for(var e,n=t.slice().sort(function(t,e){return t-e}),o=n[0],r=0,i=1,s=1;s<n.length+1;s++)n[s]!==o?(i>r&&(r=i,e=o),i=1,o=n[s]):i++;return e}function v(t,e){var n=i(t),o=l(t),r=Math.sqrt(t.length);return(n-e)/(o/r)}function E(t,e,n){var o=t.length,r=e.length;if(!o||!r)return null;n||(n=0);var s=i(t),a=i(e),u=((o-1)*d(t)+(r-1)*d(e))/(o+r-2);return(s-a-n)/Math.sqrt(u*(1/o+1/r))}function x(t,e){var n=[];if(0>=e)return null;for(var o=0;o<t.length;o+=e)n.push(t.slice(o,o+e));return n}function I(t,e){e=e||Math.random;for(var n,o,r=t.length;r>0;)o=Math.floor(e()*r--),n=t[r],t[r]=t[o],t[o]=n;return t}function S(t,e){return t=t.slice(),I(t.slice(),e)}function L(t,e,n){var o=S(t,n);return o.slice(0,e)}function C(t,e){if(0===t.length)return null;var n=t.slice().sort(function(t,e){return t-e});if(e.length){for(var o=[],r=0;r<e.length;r++)o[r]=N(n,e[r]);return o}return N(n,e)}function N(t,e){var n=t.length*e;return 0>e||e>1?null:1===e?t[t.length-1]:0===e?t[0]:n%1!==0?t[Math.ceil(n)-1]:t.length%2===0?(t[n-1]+t[n])/2:t[n]}function b(t){return 0===t.length?null:C(t,.75)-C(t,.25)}function P(t){if(!t||0===t.length)return null;for(var e=y(t),n=[],o=0;o<t.length;o++)n.push(Math.abs(t[o]-e));return y(n)}function R(t,e){var n,o,r=[],i=[],s=0;for(n=0;n<t.length+1;n++){var a=[],u=[];for(o=0;e+1>o;o++)a.push(0),u.push(0);r.push(a),i.push(u)}for(n=1;e+1>n;n++)for(r[1][n]=1,i[1][n]=0,o=2;o<t.length+1;o++)i[o][n]=1/0;for(var p=2;p<t.length+1;p++){for(var g=0,l=0,h=0,d=0,c=1;p+1>c;c++){var f=p-c+1,m=t[f-1];if(h++,g+=m,l+=m*m,s=l-g*g/h,d=f-1,0!==d)for(o=2;e+1>o;o++)i[p][o]>=s+i[d][o-1]&&(r[p][o]=f,i[p][o]=s+i[d][o-1])}r[p][1]=1,i[p][1]=s}return{lower_class_limits:r,variance_combinations:i}}function w(t,e,n){var o=t.length-1,r=[],i=n;for(r[n]=t[t.length-1],r[0]=t[0];i>1;)r[i-1]=t[e[o][i]-2],o=e[o][i]-1,i--;return r}function O(t,e){if(e>t.length)return null;t=t.slice().sort(function(t,e){return t-e});var n=R(t,e),o=n.lower_class_limits;return w(t,o,e)}function M(t){if(t.length<3)return null;var e=t.length,n=Math.pow(c(t),3),o=h(t,3);return e*o/((e-1)*(e-2)*n)}function A(t){var e=Math.abs(t),n=Math.floor(10*e),o=10*(Math.floor(100*e)/10-Math.floor(100*e/10)),r=Math.min(10*n+o,k.length-1);return t>=0?k[r]:+(1-k[r]).toFixed(4)}function T(t,e,n){return(t-e)/n}function D(t){if(0>t)return null;for(var e=1,n=2;t>=n;n++)e*=n;return e}function G(t){return 0>t||t>1?null:F(1,t)}function F(t,e){function n(t,e,n){return D(e)/(D(t)*D(e-t))*Math.pow(n,t)*Math.pow(1-n,e-t)}if(0>e||e>1||0>=t||t%1!==0)return null;var o=0,r=0,i={};do i[o]=n(o,t,e),r+=i[o],o++;while(1-U>r);return i}function B(t){function e(t,e){return Math.pow(Math.E,-e)*Math.pow(e,t)/D(t)}if(0>=t)return null;var n=0,o=0,r={};do r[n]=e(n,t),o+=r[n],n++;while(1-U>o);return r}function q(t,e,n){for(var o,r,s=i(t),a=0,u=1,p=e(s),g=[],l=[],h=0;h<t.length;h++)void 0===g[t[h]]&&(g[t[h]]=0),g[t[h]]++;for(h=0;h<g.length;h++)void 0===g[h]&&(g[h]=0);for(r in p)r in g&&(l[r]=p[r]*t.length);for(r=l.length-1;r>=0;r--)l[r]<3&&(l[r-1]+=l[r],l.pop(),g[r-1]+=g[r],g.pop());for(r=0;r<g.length;r++)a+=Math.pow(g[r]-l[r],2)/l[r];return o=g.length-u-1,Y[o][n]<a}function _(t){function e(t){return function(){var e=Array.prototype.slice.apply(arguments);return e.unshift(this),V[t].apply(V,e)}}var n=!(!Object.defineProperty||!Object.defineProperties);if(!n)throw new Error("without defineProperty, simple-statistics cannot be mixed in");var o,r=["median","standard_deviation","sum","sample_skewness","mean","min","max","quantile","geometric_mean","harmonic_mean"];o=t?t.slice():Array.prototype;for(var i=0;i<r.length;i++)Object.defineProperty(o,r[i],{value:e(r[i]),configurable:!0,enumerable:!1,writable:!0});return o}var V={};"undefined"!=typeof e?e.exports=V:this.ss=V;var k=[.5,.504,.508,.512,.516,.5199,.5239,.5279,.5319,.5359,.5398,.5438,.5478,.5517,.5557,.5596,.5636,.5675,.5714,.5753,.5793,.5832,.5871,.591,.5948,.5987,.6026,.6064,.6103,.6141,.6179,.6217,.6255,.6293,.6331,.6368,.6406,.6443,.648,.6517,.6554,.6591,.6628,.6664,.67,.6736,.6772,.6808,.6844,.6879,.6915,.695,.6985,.7019,.7054,.7088,.7123,.7157,.719,.7224,.7257,.7291,.7324,.7357,.7389,.7422,.7454,.7486,.7517,.7549,.758,.7611,.7642,.7673,.7704,.7734,.7764,.7794,.7823,.7852,.7881,.791,.7939,.7967,.7995,.8023,.8051,.8078,.8106,.8133,.8159,.8186,.8212,.8238,.8264,.8289,.8315,.834,.8365,.8389,.8413,.8438,.8461,.8485,.8508,.8531,.8554,.8577,.8599,.8621,.8643,.8665,.8686,.8708,.8729,.8749,.877,.879,.881,.883,.8849,.8869,.8888,.8907,.8925,.8944,.8962,.898,.8997,.9015,.9032,.9049,.9066,.9082,.9099,.9115,.9131,.9147,.9162,.9177,.9192,.9207,.9222,.9236,.9251,.9265,.9279,.9292,.9306,.9319,.9332,.9345,.9357,.937,.9382,.9394,.9406,.9418,.9429,.9441,.9452,.9463,.9474,.9484,.9495,.9505,.9515,.9525,.9535,.9545,.9554,.9564,.9573,.9582,.9591,.9599,.9608,.9616,.9625,.9633,.9641,.9649,.9656,.9664,.9671,.9678,.9686,.9693,.9699,.9706,.9713,.9719,.9726,.9732,.9738,.9744,.975,.9756,.9761,.9767,.9772,.9778,.9783,.9788,.9793,.9798,.9803,.9808,.9812,.9817,.9821,.9826,.983,.9834,.9838,.9842,.9846,.985,.9854,.9857,.9861,.9864,.9868,.9871,.9875,.9878,.9881,.9884,.9887,.989,.9893,.9896,.9898,.9901,.9904,.9906,.9909,.9911,.9913,.9916,.9918,.992,.9922,.9925,.9927,.9929,.9931,.9932,.9934,.9936,.9938,.994,.9941,.9943,.9945,.9946,.9948,.9949,.9951,.9952,.9953,.9955,.9956,.9957,.9959,.996,.9961,.9962,.9963,.9964,.9965,.9966,.9967,.9968,.9969,.997,.9971,.9972,.9973,.9974,.9974,.9975,.9976,.9977,.9977,.9978,.9979,.9979,.998,.9981,.9981,.9982,.9982,.9983,.9984,.9984,.9985,.9985,.9986,.9986,.9987,.9987,.9987,.9988,.9988,.9989,.9989,.9989,.999,.999],U=1e-4,Y={1:{.995:0,.99:0,.975:0,.95:0,.9:.02,.5:.45,.1:2.71,.05:3.84,.025:5.02,.01:6.63,.005:7.88},2:{.995:.01,.99:.02,.975:.05,.95:.1,.9:.21,.5:1.39,.1:4.61,.05:5.99,.025:7.38,.01:9.21,.005:10.6},3:{.995:.07,.99:.11,.975:.22,.95:.35,.9:.58,.5:2.37,.1:6.25,.05:7.81,.025:9.35,.01:11.34,.005:12.84},4:{.995:.21,.99:.3,.975:.48,.95:.71,.9:1.06,.5:3.36,.1:7.78,.05:9.49,.025:11.14,.01:13.28,.005:14.86},5:{.995:.41,.99:.55,.975:.83,.95:1.15,.9:1.61,.5:4.35,.1:9.24,.05:11.07,.025:12.83,.01:15.09,.005:16.75},6:{.995:.68,.99:.87,.975:1.24,.95:1.64,.9:2.2,.5:5.35,.1:10.65,.05:12.59,.025:14.45,.01:16.81,.005:18.55},7:{.995:.99,.99:1.25,.975:1.69,.95:2.17,.9:2.83,.5:6.35,.1:12.02,.05:14.07,.025:16.01,.01:18.48,.005:20.28},8:{.995:1.34,.99:1.65,.975:2.18,.95:2.73,.9:3.49,.5:7.34,.1:13.36,.05:15.51,.025:17.53,.01:20.09,.005:21.96},9:{.995:1.73,.99:2.09,.975:2.7,.95:3.33,.9:4.17,.5:8.34,.1:14.68,.05:16.92,.025:19.02,.01:21.67,.005:23.59},10:{.995:2.16,.99:2.56,.975:3.25,.95:3.94,.9:4.87,.5:9.34,.1:15.99,.05:18.31,.025:20.48,.01:23.21,.005:25.19},11:{.995:2.6,.99:3.05,.975:3.82,.95:4.57,.9:5.58,.5:10.34,.1:17.28,.05:19.68,.025:21.92,.01:24.72,.005:26.76},12:{.995:3.07,.99:3.57,.975:4.4,.95:5.23,.9:6.3,.5:11.34,.1:18.55,.05:21.03,.025:23.34,.01:26.22,.005:28.3},13:{.995:3.57,.99:4.11,.975:5.01,.95:5.89,.9:7.04,.5:12.34,.1:19.81,.05:22.36,.025:24.74,.01:27.69,.005:29.82},14:{.995:4.07,.99:4.66,.975:5.63,.95:6.57,.9:7.79,.5:13.34,.1:21.06,.05:23.68,.025:26.12,.01:29.14,.005:31.32},15:{.995:4.6,.99:5.23,.975:6.27,.95:7.26,.9:8.55,.5:14.34,.1:22.31,.05:25,.025:27.49,.01:30.58,.005:32.8},16:{.995:5.14,.99:5.81,.975:6.91,.95:7.96,.9:9.31,.5:15.34,.1:23.54,.05:26.3,.025:28.85,.01:32,.005:34.27},17:{.995:5.7,.99:6.41,.975:7.56,.95:8.67,.9:10.09,.5:16.34,.1:24.77,.05:27.59,.025:30.19,.01:33.41,.005:35.72},18:{.995:6.26,.99:7.01,.975:8.23,.95:9.39,.9:10.87,.5:17.34,.1:25.99,.05:28.87,.025:31.53,.01:34.81,.005:37.16},19:{.995:6.84,.99:7.63,.975:8.91,.95:10.12,.9:11.65,.5:18.34,.1:27.2,.05:30.14,.025:32.85,.01:36.19,.005:38.58},20:{.995:7.43,.99:8.26,.975:9.59,.95:10.85,.9:12.44,.5:19.34,.1:28.41,.05:31.41,.025:34.17,.01:37.57,.005:40},21:{.995:8.03,.99:8.9,.975:10.28,.95:11.59,.9:13.24,.5:20.34,.1:29.62,.05:32.67,.025:35.48,.01:38.93,.005:41.4},22:{.995:8.64,.99:9.54,.975:10.98,.95:12.34,.9:14.04,.5:21.34,.1:30.81,.05:33.92,.025:36.78,.01:40.29,.005:42.8},23:{.995:9.26,.99:10.2,.975:11.69,.95:13.09,.9:14.85,.5:22.34,.1:32.01,.05:35.17,.025:38.08,.01:41.64,.005:44.18},24:{.995:9.89,.99:10.86,.975:12.4,.95:13.85,.9:15.66,.5:23.34,.1:33.2,.05:36.42,.025:39.36,.01:42.98,.005:45.56},25:{.995:10.52,.99:11.52,.975:13.12,.95:14.61,.9:16.47,.5:24.34,.1:34.28,.05:37.65,.025:40.65,.01:44.31,.005:46.93},26:{.995:11.16,.99:12.2,.975:13.84,.95:15.38,.9:17.29,.5:25.34,.1:35.56,.05:38.89,.025:41.92,.01:45.64,.005:48.29},27:{.995:11.81,.99:12.88,.975:14.57,.95:16.15,.9:18.11,.5:26.34,.1:36.74,.05:40.11,.025:43.19,.01:46.96,.005:49.65},28:{.995:12.46,.99:13.57,.975:15.31,.95:16.93,.9:18.94,.5:27.34,.1:37.92,.05:41.34,.025:44.46,.01:48.28,.005:50.99},29:{.995:13.12,.99:14.26,.975:16.05,.95:17.71,.9:19.77,.5:28.34,.1:39.09,.05:42.56,.025:45.72,.01:49.59,.005:52.34},30:{.995:13.79,.99:14.95,.975:16.79,.95:18.49,.9:20.6,.5:29.34,.1:40.26,.05:43.77,.025:46.98,.01:50.89,.005:53.67},40:{.995:20.71,.99:22.16,.975:24.43,.95:26.51,.9:29.05,.5:39.34,.1:51.81,.05:55.76,.025:59.34,.01:63.69,.005:66.77},50:{.995:27.99,.99:29.71,.975:32.36,.95:34.76,.9:37.69,.5:49.33,.1:63.17,.05:67.5,.025:71.42,.01:76.15,.005:79.49},60:{.995:35.53,.99:37.48,.975:40.48,.95:43.19,.9:46.46,.5:59.33,.1:74.4,.05:79.08,.025:83.3,.01:88.38,.005:91.95},70:{.995:43.28,.99:45.44,.975:48.76,.95:51.74,.9:55.33,.5:69.33,.1:85.53,.05:90.53,.025:95.02,.01:100.42,.005:104.22},80:{.995:51.17,.99:53.54,.975:57.15,.95:60.39,.9:64.28,.5:79.33,.1:96.58,.05:101.88,.025:106.63,.01:112.33,.005:116.32},90:{.995:59.2,.99:61.75,.975:65.65,.95:69.13,.9:73.29,.5:89.33,.1:107.57,.05:113.14,.025:118.14,.01:124.12,.005:128.3},100:{.995:67.33,.99:70.06,.975:74.22,.95:77.93,.9:82.36,.5:99.33,.1:118.5,.05:124.34,.025:129.56,.01:135.81,.005:140.17}};V.linear_regression=t,V.standard_deviation=l,V.r_squared=n,V.median=y,V.mean=i,V.mode=j,V.min=u,V.max=p,V.sum=r,V.quantile=C,V.quantile_sorted=N,V.iqr=b,V.mad=P,V.chunk=x,V.shuffle=S,V.shuffle_in_place=I,V.sample=L,V.sample_covariance=f,V.sample_correlation=m,V.sample_variance=d,V.sample_standard_deviation=c,V.sample_skewness=M,V.geometric_mean=s,V.harmonic_mean=a,V.variance=g,V.t_test=v,V.t_test_two_sample=E,V.jenksMatrices=R,V.jenksBreaks=w,V.jenks=O,V.bayesian=o,V.epsilon=U,V.factorial=D,V.bernoulli_distribution=G,V.binomial_distribution=F,V.poisson_distribution=B,V.chi_squared_goodness_of_fit=q,V.z_score=T,V.cumulative_std_normal_probability=A,V.standard_normal_table=k,V.average=i,V.interquartile_range=b,V.mixin=_,V.median_absolute_deviation=P}(this)},{}],60:[function(t,e){function n(t){return t*Math.PI/180}var o=t("turf-invariant");e.exports=function(t,e,r){o.featureOf(t,"Point","distance"),o.featureOf(e,"Point","distance");var i,s=t.geometry.coordinates,a=e.geometry.coordinates,u=n(a[1]-s[1]),p=n(a[0]-s[0]),g=n(s[1]),l=n(a[1]),h=Math.sin(u/2)*Math.sin(u/2)+Math.sin(p/2)*Math.sin(p/2)*Math.cos(g)*Math.cos(l),d=2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));switch(r){case"miles":i=3960;break;case"kilometers":i=6373;break;case"degrees":i=57.2957795;break;case"radians":i=1;break;case void 0:i=6373;break;default:throw new Error('unknown option given to "units"')}var c=i*d;return c}},{"turf-invariant":61}],61:[function(t,e){function n(t,e,n){if(!e||!n)throw new Error("type and name required");if(!t||t.type!==e)throw new Error("Invalid input to "+n+": must be a "+e+", given "+t.type)}function o(t,e,n){if(!n)throw new Error(".featureOf() requires a name");if(!t||"Feature"!==t.type||!t.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!t.geometry||t.geometry.type!==e)throw new Error("Invalid input to "+n+": must be a "+e+", given "+t.geometry.type)}function r(t,e,n){if(!n)throw new Error(".collectionOf() requires a name");if(!t||"FeatureCollection"!==t.type)throw new Error("Invalid input to "+n+", FeatureCollection required");for(var o=0;o<t.features.length;o++){var r=t.features[o];if(!r||"Feature"!==r.type||!r.geometry)throw new Error("Invalid input to "+n+", Feature with geometry required");if(!r.geometry||r.geometry.type!==e)throw new Error("Invalid input to "+n+": must be a "+e+", given "+r.geometry.type)}}e.exports.geojsonType=n,e.exports.collectionOf=r,e.exports.featureOf=o},{}],62:[function(t,e){var n=t("turf-extent"),o=t("turf-bbox-polygon");e.exports=function(t){var e=n(t),r=o(e);return r}},{"turf-bbox-polygon":12,"turf-extent":70}],63:[function(t,e){var n=t("jsts");e.exports=function(t,e){var o=JSON.parse(JSON.stringify(t)),r=JSON.parse(JSON.stringify(e));"Feature"!==o.type&&(o={type:"Feature",properties:{},geometry:o}),"Feature"!==r.type&&(r={type:"Feature",properties:{},geometry:r});var i=new n.io.GeoJSONReader,s=i.read(JSON.stringify(o.geometry)),a=i.read(JSON.stringify(r.geometry)),u=s.difference(a),p=new n.io.GeoJSONParser;return u=p.write(u),o.geometry=u,"GeometryCollection"===o.geometry.type&&0===o.geometry.geometries.length?void 0:{type:"Feature",properties:o.properties,geometry:u}}},{jsts:64}],64:[function(t,e,n){arguments[4][17][0].apply(n,arguments)},{"./lib/jsts":65,dup:17,"javascript.util":67}],65:[function(t,e,n){arguments[4][18][0].apply(n,arguments)},{dup:18}],66:[function(t,e,n){arguments[4][19][0].apply(n,arguments)},{dup:19}],67:[function(t,e,n){arguments[4][20][0].apply(n,arguments)},{"./dist/javascript.util-node.min.js":66,dup:20}],68:[function(t,e){var n=t("turf-featurecollection"),o=t("turf-meta").coordEach,r=t("turf-point");e.exports=function(t){var e=[];return o(t,function(t){e.push(r(t))}),n(e)}},{"turf-featurecollection":72,"turf-meta":69,"turf-point":102}],69:[function(t,e,n){arguments[4][23][0].apply(n,arguments)},{dup:23}],70:[function(t,e){var n=t("turf-meta").coordEach;e.exports=function(t){var e=[1/0,1/0,-1/0,-1/0];return n(t,function(t){e[0]>t[0]&&(e[0]=t[0]),e[1]>t[1]&&(e[1]=t[1]),e[2]<t[0]&&(e[2]=t[0]),e[3]<t[1]&&(e[3]=t[1])}),e}},{"turf-meta":71}],71:[function(t,e,n){arguments[4][23][0].apply(n,arguments)},{dup:23}],72:[function(t,e){e.exports=function(t){return{type:"FeatureCollection",features:t}}},{}],73:[function(t,e){var n=t("turf-featurecollection");e.exports=function(t,e,o){for(var r=n([]),i=0;i<t.features.length;i++)t.features[i].properties[e]===o&&r.features.push(t.features[i]);return r}},{"turf-featurecollection":72}],74:[function(t,e){function n(t){var e=JSON.parse(JSON.stringify(t));switch(e.type){case"FeatureCollection":for(var n=0;n<e.features.length;n++)o(e.features[n].geometry);return e;case"Feature":return o(e.geometry),e;default:return o(e),e}}function o(t){var e=t.coordinates;switch(t.type){case"Point":r(e);break;case"LineString":case"MultiPoint":i(e);break;case"Polygon":case"MultiLineString":s(e);break;case"MultiPolygon":a(e);break;case"GeometryCollection":t.geometries.forEach(o)}}function r(t){t.reverse()}function i(t){for(var e=0;e<t.length;e++)t[e].reverse()}function s(t){for(var e=0;e<t.length;e++)for(var n=0;n<t[e].length;n++)t[e][n].reverse()}function a(t){for(var e=0;e<t.length;e++)for(var n=0;n<t[e].length;n++)for(var o=0;o<t[e][n].length;o++)t[e][n][o].reverse()}e.exports=n},{}],75:[function(t,e){function n(t,e){for(var n=[],o=0;6>o;o++){var i=t[0]+e*a[o],s=t[1]+e*u[o];n.push([i,s])}return n.push(n[0]),r([n])}for(var o=t("turf-point"),r=t("turf-polygon"),i=t("turf-distance"),s=t("turf-featurecollection"),a=[],u=[],p=0;6>p;p++){var g=2*Math.PI/6*p;a.push(Math.cos(g)),u.push(Math.sin(g))}e.exports=function(t,e,r){var a=e/i(o([t[0],t[1]]),o([t[2],t[1]]),r),u=a*(t[2]-t[0]),p=e/i(o([t[0],t[1]]),o([t[0],t[3]]),r),g=(p*(t[3]-t[1]),u/2),l=2*g,h=Math.sqrt(3)/2*l,d=t[2]-t[0],c=t[3]-t[1],f=.75*l,m=h,y=d/(l-g/2),j=Math.ceil(y);Math.round(y)===j&&j++;var v=(j*f-g/2-d)/2-g/2,E=Math.ceil(c/h),x=(c-E*h)/2,I=E*h-c>h/2;I&&(x-=h/4);for(var S=s([]),L=0;j>L;L++)for(var C=0;E>=C;C++){var N=L%2===1;if(!(0===C&&N||0===C&&I)){var b=L*f+t[0]-v,P=C*m+t[1]+x;N&&(P-=h/2),S.features.push(n([b,P],g))}}return S}},{"turf-distance":60,"turf-featurecollection":72,"turf-point":102,"turf-polygon":103}],76:[function(t,e){function n(t,e){for(var n=!1,o=0,r=e.length-1;o<e.length;r=o++){var i=e[o][0],s=e[o][1],a=e[r][0],u=e[r][1],p=s>t[1]!=u>t[1]&&t[0]<(a-i)*(t[1]-s)/(u-s)+i;p&&(n=!n)}return n}e.exports=function(t,e){var o=e.geometry.coordinates,r=[t.geometry.coordinates[0],t.geometry.coordinates[1]];"Polygon"===e.geometry.type&&(o=[o]);for(var i=!1,s=0;s<o.length&&!i;){if(n(r,o[s][0])){for(var a=!1,u=1;u<o[s].length&&!a;)n(r,o[s][u])&&(a=!0),u++;a||(i=!0)}s++}return i}},{}],77:[function(t,e){{var n=t("jsts");t("turf-featurecollection")}e.exports=function(t,e){var o;o="Feature"===t.type?t.geometry:t,geom2="Feature"===e.type?e.geometry:e;var r=new n.io.GeoJSONReader,i=r.read(JSON.stringify(o)),s=r.read(JSON.stringify(geom2)),a=i.intersection(s),u=new n.io.GeoJSONParser;return a=u.write(a),"GeometryCollection"===a.type&&0===a.geometries.length?void 0:{type:"Feature",properties:{},geometry:a}}},{jsts:78,"turf-featurecollection":72}],78:[function(t,e,n){arguments[4][17][0].apply(n,arguments)},{"./lib/jsts":79,dup:17,"javascript.util":81}],79:[function(t,e,n){arguments[4][18][0].apply(n,arguments)},{dup:18}],80:[function(t,e,n){arguments[4][19][0].apply(n,arguments)},{dup:19}],81:[function(t,e,n){arguments[4][20][0].apply(n,arguments)},{"./dist/javascript.util-node.min.js":80,dup:20}],82:[function(t,e){function n(t,e){var n=t.x-e.x,o=t.y-e.y;return s>n*n+o*o}function o(t){for(var e=t.head;e;){var n=e.next;e.next=e.prev,e.prev=n,e=n}var n=t.head;t.head=t.tail,t.tail=n}function r(t){this.level=t,this.s=null,this.count=0}function i(t){if(t)this.drawContour=t;else{var e=this;e.contours={},this.drawContour=function(t,n,o,i,s,a){var u=e.contours[a];u||(u=e.contours[a]=new r(s)),u.addSegment({x:t,y:n},{x:o,y:i})},this.contourList=function(){var t=[],n=e.contours;for(var o in n)for(var r=n[o].s,i=n[o].level;r;){var s=r.head,a=[];for(a.level=i,a.k=o;s&&s.p;)a.push(s.p),s=s.next;t.push(a),r=r.next}return t.sort(function(t,e){return t.k-e.k}),t}}this.h=new Array(5),this.sh=new Array(5),this.xh=new Array(5),this.yh=new Array(5)}e.exports=i;var s=1e-10;r.prototype.remove_seq=function(t){t.prev?t.prev.next=t.next:this.s=t.next,t.next&&(t.next.prev=t.prev),--this.count},r.prototype.addSegment=function(t,e){for(var r=this.s,i=null,s=null,a=!1,u=!1;r&&(null==i&&(n(t,r.head.p)?(i=r,a=!0):n(t,r.tail.p)&&(i=r)),null==s&&(n(e,r.head.p)?(s=r,u=!0):n(e,r.tail.p)&&(s=r)),null==s||null==i);)r=r.next;var p=(null!=i?1:0)|(null!=s?2:0);switch(p){case 0:var g={p:t,prev:null},l={p:e,next:null};g.next=l,l.prev=g,i={head:g,tail:l,next:this.s,prev:null,closed:!1},this.s&&(this.s.prev=i),this.s=i,++this.count;break;case 1:var h={p:e};a?(h.next=i.head,h.prev=null,i.head.prev=h,i.head=h):(h.next=null,h.prev=i.tail,i.tail.next=h,i.tail=h);break;case 2:var h={p:t};u?(h.next=s.head,h.prev=null,s.head.prev=h,s.head=h):(h.next=null,h.prev=s.tail,s.tail.next=h,s.tail=h);break;case 3:if(i===s){var h={p:i.tail.p,next:i.head,prev:null};i.head.prev=h,i.head=h,i.closed=!0;break}switch((a?1:0)|(u?2:0)){case 0:o(i);case 1:s.tail.next=i.head,i.head.prev=s.tail,s.tail=i.tail,this.remove_seq(i);break;case 3:o(i);case 2:i.tail.next=s.head,s.head.prev=i.tail,i.tail=s.tail,this.remove_seq(s)}}},i.prototype.contour=function(t,e,n,o,r,i,a,u,p){var g=this.h,l=this.sh,h=this.xh,d=this.yh,c=this.drawContour;this.contours={};for(var f,m,y,j,v,E,x=function(t,e){return(g[e]*h[t]-g[t]*h[e])/(g[e]-g[t])},I=function(t,e){return(g[e]*d[t]-g[t]*d[e])/(g[e]-g[t])},S=0,L=0,C=0,N=0,b=[0,1,1,0],P=[0,0,1,1],R=[[[0,0,8],[0,2,5],[7,6,9]],[[0,3,4],[1,3,1],[4,3,0]],[[9,6,7],[5,2,0],[8,0,0]]],w=r-1;w>=o;w--)for(var O=e;n-1>=O;O++){var M,A;if(M=Math.min(t[O][w],t[O][w+1]),A=Math.min(t[O+1][w],t[O+1][w+1]),v=Math.min(M,A),M=Math.max(t[O][w],t[O][w+1]),A=Math.max(t[O+1][w],t[O+1][w+1]),E=Math.max(M,A),E>=p[0]&&v<=p[u-1])for(var T=0;u>T;T++)if(p[T]>=v&&p[T]<=E){for(var D=4;D>=0;D--)D>0?(g[D]=t[O+b[D-1]][w+P[D-1]]-p[T],h[D]=i[O+b[D-1]],d[D]=a[w+P[D-1]]):(g[0]=.25*(g[1]+g[2]+g[3]+g[4]),h[0]=.5*(i[O]+i[O+1]),d[0]=.5*(a[w]+a[w+1])),l[D]=g[D]>s?1:g[D]<-s?-1:0;for(D=1;4>=D;D++)if(f=D,m=0,y=4!=D?D+1:1,j=R[l[f]+1][l[m]+1][l[y]+1],0!=j){switch(j){case 1:S=h[f],C=d[f],L=h[m],N=d[m];break;case 2:S=h[m],C=d[m],L=h[y],N=d[y];break;case 3:S=h[y],C=d[y],L=h[f],N=d[f];break;case 4:S=h[f],C=d[f],L=x(m,y),N=I(m,y);break;case 5:S=h[m],C=d[m],L=x(y,f),N=I(y,f);break;case 6:S=h[y],C=d[y],L=x(f,m),N=I(f,m);break;case 7:S=x(f,m),C=I(f,m),L=x(m,y),N=I(m,y);break;case 8:S=x(m,y),C=I(m,y),L=x(y,f),N=I(y,f);break;case 9:S=x(y,f),C=I(y,f),L=x(f,m),N=I(f,m)}c(S,C,L,N,p[T],T)}}}}},{}],83:[function(t,e){var n=t("turf-tin"),o=t("turf-inside"),r=t("turf-grid"),i=t("turf-extent"),s=t("turf-planepoint"),a=t("turf-featurecollection"),u=t("turf-linestring"),p=t("turf-square"),g=t("./conrec");e.exports=function(t,e,l,h){for(var d=n(t,e),c=i(t),f=p(c),m=r(f,l),y=[],j=0;j<m.features.length;j++)for(var v=m.features[j],E=0;E<d.features.length;E++){var x=d.features[E];o(v,x)&&(v.properties={},v.properties[e]=s(v,x))}for(var I=Math.sqrt(m.features.length),S=0;I>S;S++){var L=m.features.slice(S*I,(S+1)*I),C=[];L.forEach(function(t){C.push(t.properties?t.properties[e]:0)}),y.push(C)}for(var N=(f[2]-f[0])/I,b=[],P=[],S=0;I>S;S++)b.push(S*N+f[0]),P.push(S*N+f[1]);var R=new g;R.contour(y,0,l,0,l,b,P,h.length,h);var w=R.contourList(),O=a([]);return w.forEach(function(t){if(t.length>2){var n=[];t.forEach(function(t){n.push([t.x,t.y])});var o=u(n);o.properties={},o.properties[e]=t.level,O.features.push(o)}}),O}},{"./conrec":82,"turf-extent":70,"turf-featurecollection":72,"turf-grid":84,"turf-inside":76,"turf-linestring":90,"turf-planepoint":98,"turf-square":115,"turf-tin":118}],84:[function(t,e){var n=t("turf-point");e.exports=function(t,e){for(var o=t[0],r=t[1],i=t[2],s=(t[3],(i-o)/e),a={type:"FeatureCollection",features:[]},u=0;e>=u;u++)for(var p=0;e>=p;p++)a.features.push(n([u*s+o,p*s+r]));return a}},{"turf-point":102}],85:[function(t,e){var n=t("simple-statistics");e.exports=function(t,e,o){var r=[],i=[];return t.features.forEach(function(t){void 0!==t.properties[e]&&r.push(t.properties[e])}),i=n.jenks(r,o)}},{"simple-statistics":86}],86:[function(t,e,n){arguments[4][59][0].apply(n,arguments)},{dup:59}],87:[function(t,e){function n(t,e,n,o,r,i,s,a){var u,p,g,l,h,d={x:null,y:null,onLine1:!1,onLine2:!1};return u=(a-i)*(n-t)-(s-r)*(o-e),0==u?null!=d.x&&null!=d.y?d:!1:(p=e-i,g=t-r,l=(s-r)*p-(a-i)*g,h=(n-t)*p-(o-e)*g,p=l/u,g=h/u,d.x=t+p*(n-t),d.y=e+p*(o-e),p>0&&1>p&&(d.onLine1=!0),g>0&&1>g&&(d.onLine2=!0),d.onLine1&&d.onLine2?[d.x,d.y]:!1)}var o=(t("turf-polygon"),t("turf-point")),r=t("turf-featurecollection");e.exports=function(t){var e,i={intersections:r([]),fixed:null};e="Feature"===t.type?t.geometry:t;return e.coordinates.forEach(function(t){e.coordinates.forEach(function(e){for(var r=0;r<t.length-1;r++)for(var s=0;s<e.length-1;s++){var a=n(t[r][0],t[r][1],t[r+1][0],t[r+1][1],e[s][0],e[s][1],e[s+1][0],e[s+1][1]);a&&i.intersections.features.push(o([a[0],a[1]]))}})}),i}},{"turf-featurecollection":72,"turf-point":102,"turf-polygon":103}],88:[function(t,e){var n=t("turf-distance"),o=t("turf-point");e.exports=function(t,e){var r;if("Feature"===t.type)r=t.geometry.coordinates;else{if("LineString"!==t.type)throw new Error("input must be a LineString Feature or Geometry");r=t.geometry.coordinates}for(var i=0,s=0;s<r.length-1;s++)i+=n(o(r[s]),o(r[s+1]),e);return i}},{"turf-distance":60,"turf-point":102}],89:[function(t,e){function n(t,e){for(var n="miles",s=i([1/0,1/0],{dist:1/0}),p=0;p<e.length-1;p++){var g=i(e[p]),l=i(e[p+1]);g.properties.dist=r(t,g,n),l.properties.dist=r(t,l,n);var h=a(g,l),d=u(t,1e3,h+90,n),c=o(t.geometry.coordinates[0],t.geometry.coordinates[1],d.geometry.coordinates[0],d.geometry.coordinates[1],g.geometry.coordinates[0],g.geometry.coordinates[1],l.geometry.coordinates[0],l.geometry.coordinates[1]);c||(d=u(t,1e3,h-90,n),c=o(t.geometry.coordinates[0],t.geometry.coordinates[1],d.geometry.coordinates[0],d.geometry.coordinates[1],g.geometry.coordinates[0],g.geometry.coordinates[1],l.geometry.coordinates[0],l.geometry.coordinates[1])),d.properties.dist=1/0;var f;if(c){var f=i(c);f.properties.dist=r(t,f,n)}g.properties.dist<s.properties.dist&&(s=g,s.properties.index=p),l.properties.dist<s.properties.dist&&(s=l,s.properties.index=p),f&&f.properties.dist<s.properties.dist&&(s=f,s.properties.index=p)}return s}function o(t,e,n,o,r,i,s,a){var u,p,g,l,h,d={x:null,y:null,onLine1:!1,onLine2:!1};return u=(a-i)*(n-t)-(s-r)*(o-e),0==u?null!=d.x&&null!=d.y?d:!1:(p=e-i,g=t-r,l=(s-r)*p-(a-i)*g,h=(n-t)*p-(o-e)*g,p=l/u,g=h/u,d.x=t+p*(n-t),d.y=e+p*(o-e),p>0&&1>p&&(d.onLine1=!0),g>0&&1>g&&(d.onLine2=!0),d.onLine1&&d.onLine2?[d.x,d.y]:!1)}var r=t("turf-distance"),i=t("turf-point"),s=t("turf-linestring"),a=t("turf-bearing"),u=t("turf-destination");e.exports=function(t,e,o){var r;if("Feature"===o.type)r=o.geometry.coordinates;else{if("LineString"!==o.type)throw new Error("input must be a LineString Feature or Geometry");r=o.geometry.coordinates}var i,a=n(t,r),u=n(e,r);i=a.properties.index<=u.properties.index?[a,u]:[u,a];for(var p=s([i[0].geometry.coordinates],{}),g=i[0].properties.index+1;g<i[1].properties.index+1;g++)p.geometry.coordinates.push(r[g]);return p.geometry.coordinates.push(i[1].geometry.coordinates),p}},{"turf-bearing":13,"turf-destination":57,"turf-distance":60,"turf-linestring":90,"turf-point":102}],90:[function(t,e){e.exports=function(t,e){if(!t)throw new Error("No coordinates passed");return{type:"Feature",geometry:{type:"LineString",coordinates:t},properties:e||{}}}},{}],91:[function(t,e){function n(t){for(var e,n=0;n<t.length;n++)(t[n]>e||void 0===e)&&(e=t[n]);return e}var o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n(s)}),t}},{"turf-inside":76}],92:[function(t,e){function n(t){if(0===t.length)return null;var e=t.slice().sort(function(t,e){return t-e});if(e.length%2===1)return e[(e.length-1)/2];var n=e[e.length/2-1],o=e[e.length/2];return(n+o)/2}var o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n(s)}),t}},{"turf-inside":76}],93:[function(t,e){var n=t("clone"),o=t("turf-union");e.exports=function(t){for(var e=n(t.features[0]),r=t.features,i=0,s=r.length;s>i;i++){var a=r[i];a.geometry&&(e=o(e,a))}return e}},{clone:94,"turf-union":120}],94:[function(t,e){(function(t){"use strict";function n(t){return Object.prototype.toString.call(t)}function o(e,n,o,i){function s(e,o){if(null===e)return null;if(0==o)return e;var g,l;if("object"!=typeof e)return e;if(r.isArray(e))g=[];else if(r.isRegExp(e))g=new RegExp(e.source,r.getRegExpFlags(e)),e.lastIndex&&(g.lastIndex=e.lastIndex);else if(r.isDate(e))g=new Date(e.getTime());else{if(p&&t.isBuffer(e))return g=new t(e.length),e.copy(g),g;"undefined"==typeof i?(l=Object.getPrototypeOf(e),g=Object.create(l)):(g=Object.create(i),l=i)}if(n){var h=a.indexOf(e);if(-1!=h)return u[h];a.push(e),u.push(g)}for(var d in e){var c;l&&(c=Object.getOwnPropertyDescriptor(l,d)),c&&null==c.set||(g[d]=s(e[d],o-1))}return g}var a=[],u=[],p="undefined"!=typeof t;return"undefined"==typeof n&&(n=!0),"undefined"==typeof o&&(o=1/0),s(e,o)}var r={isArray:function(t){return Array.isArray(t)||"object"==typeof t&&"[object Array]"===n(t)},isDate:function(t){return"object"==typeof t&&"[object Date]"===n(t)},isRegExp:function(t){return"object"==typeof t&&"[object RegExp]"===n(t)},getRegExpFlags:function(t){var e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),e}};"object"==typeof e&&(e.exports=o),o.clonePrototype=function(t){if(null===t)return null;var e=function(){};return e.prototype=t,new e}}).call(this,t("buffer").Buffer)},{buffer:2}],95:[function(t,e){var n=t("turf-point");e.exports=function(t,e){if(null===t||null===e)throw new Error("Less than two points passed.");var o=t.geometry.coordinates[0],r=e.geometry.coordinates[0],i=t.geometry.coordinates[1],s=e.geometry.coordinates[1],a=o+r,u=a/2,p=i+s,g=p/2;return n([u,g])}},{"turf-point":102}],96:[function(t,e){function n(t){for(var e,n=0;n<t.length;n++)(t[n]<e||void 0===e)&&(e=t[n]);return e}var o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n(s)}),t}},{"turf-inside":76}],97:[function(t,e){var n=t("turf-distance");e.exports=function(t,e){var o;return e.features.forEach(function(e){if(o){var r=n(t,e,"miles");r<o.properties.distance&&(o=e,o.properties.distance=r)}else{o=e;var r=n(t,e,"miles");o.properties.distance=r}}),delete o.properties.distance,o}},{"turf-distance":60}],98:[function(t,e){e.exports=function(t,e){var n=t.geometry.coordinates[0],o=t.geometry.coordinates[1],r=e.geometry.coordinates[0][0][0],i=e.geometry.coordinates[0][0][1],s=e.properties.a,a=e.geometry.coordinates[0][1][0],u=e.geometry.coordinates[0][1][1],p=e.properties.b,g=e.geometry.coordinates[0][2][0],l=e.geometry.coordinates[0][2][1],h=e.properties.c,d=(h*(n-r)*(o-u)+s*(n-a)*(o-l)+p*(n-g)*(o-i)-p*(n-r)*(o-l)-h*(n-a)*(o-i)-s*(n-g)*(o-u))/((n-r)*(o-u)+(n-a)*(o-l)+(n-g)*(o-i)-(n-r)*(o-l)-(n-a)*(o-i)-(n-g)*(o-u));return d}},{}],99:[function(t,e){var n=t("turf-point"),o=t("turf-featurecollection"),r=t("turf-distance");e.exports=function(t,e,i){for(var s=o([]),a=e/r(n([t[0],t[1]]),n([t[2],t[1]]),i),u=a*(t[2]-t[0]),p=e/r(n([t[0],t[1]]),n([t[0],t[3]]),i),g=p*(t[3]-t[1]),l=t[0];l<=t[2];){for(var h=t[1];h<=t[3];)s.features.push(n([l,h])),h+=g;l+=u}return s}},{"turf-distance":60,"turf-featurecollection":72,"turf-point":102}],100:[function(t,e){function n(t,e){for(var n="miles",u=i([1/0,1/0],{dist:1/0}),p=0;p<e.length-1;p++){var g=i(e[p]),l=i(e[p+1]);g.properties.dist=r(t,g,n),l.properties.dist=r(t,l,n);var h=s(g,l),d=a(t,1e3,h+90,n),c=o(t.geometry.coordinates[0],t.geometry.coordinates[1],d.geometry.coordinates[0],d.geometry.coordinates[1],g.geometry.coordinates[0],g.geometry.coordinates[1],l.geometry.coordinates[0],l.geometry.coordinates[1]);c||(d=a(t,1e3,h-90,n),c=o(t.geometry.coordinates[0],t.geometry.coordinates[1],d.geometry.coordinates[0],d.geometry.coordinates[1],g.geometry.coordinates[0],g.geometry.coordinates[1],l.geometry.coordinates[0],l.geometry.coordinates[1])),d.properties.dist=1/0;
var f;if(c){var f=i(c);f.properties.dist=r(t,f,n)}g.properties.dist<u.properties.dist&&(u=g,u.properties.index=p),l.properties.dist<u.properties.dist&&(u=l,u.properties.index=p),f&&f.properties.dist<u.properties.dist&&(u=f,u.properties.index=p)}return u}function o(t,e,n,o,r,i,s,a){var u,p,g,l,h,d={x:null,y:null,onLine1:!1,onLine2:!1};return u=(a-i)*(n-t)-(s-r)*(o-e),0==u?null!=d.x&&null!=d.y?d:!1:(p=e-i,g=t-r,l=(s-r)*p-(a-i)*g,h=(n-t)*p-(o-e)*g,p=l/u,g=h/u,d.x=t+p*(n-t),d.y=e+p*(o-e),p>0&&1>p&&(d.onLine1=!0),g>0&&1>g&&(d.onLine2=!0),d.onLine1&&d.onLine2?[d.x,d.y]:!1)}var r=t("turf-distance"),i=t("turf-point"),s=(t("turf-linestring"),t("turf-bearing")),a=t("turf-destination");e.exports=function(t,e){var o;if("Feature"===t.type)o=t.geometry.coordinates;else{if("LineString"!==t.type)throw new Error("input must be a LineString Feature or Geometry");o=t.geometry.coordinates}return n(e,o)}},{"turf-bearing":13,"turf-destination":57,"turf-distance":60,"turf-linestring":90,"turf-point":102}],101:[function(t,e){function n(t,e,n,o,r,i){var s=Math.sqrt((r-n)*(r-n)+(i-o)*(i-o)),a=Math.sqrt((t-n)*(t-n)+(e-o)*(e-o)),u=Math.sqrt((r-t)*(r-t)+(i-e)*(i-e));return s===a+u?!0:void 0}var o=t("turf-featurecollection"),r=t("turf-center"),i=t("turf-distance"),s=t("turf-inside"),a=t("turf-explode");e.exports=function(t){"FeatureCollection"!=t.type&&("Feature"!=t.type&&(t={type:"Feature",geometry:t,properties:{}}),t=o([t]));for(var e=r(t),u=!1,p=0;!u&&p<t.features.length;){var g=t.features[p].geometry;if("Point"===g.type)e.geometry.coordinates[0]===g.coordinates[0]&&e.geometry.coordinates[1]===g.coordinates[1]&&(u=!0);else if("MultiPoint"===g.type)for(var l=!1,h=0;!l&&h<g.coordinates.length;)e.geometry.coordinates[0]===g.coordinates[h][0]&&e.geometry.coordinates[1]===g.coordinates[h][1]&&(u=!0,l=!0),h++;else if("LineString"===g.type)for(var d=!1,h=0;!d&&h<g.coordinates.length-1;){var c=e.geometry.coordinates[0],f=e.geometry.coordinates[1],m=g.coordinates[h][0],y=g.coordinates[h][1],j=g.coordinates[h+1][0],v=g.coordinates[h+1][1];n(c,f,m,y,j,v)&&(d=!0,u=!0),h++}else if("MultiLineString"===g.type)for(var E=!1,x=0;!E&&x<g.coordinates.length;){for(var d=!1,h=0,I=g.coordinates[x];!d&&h<I.length-1;){var c=e.geometry.coordinates[0],f=e.geometry.coordinates[1],m=I[h][0],y=I[h][1],j=I[h+1][0],v=I[h+1][1];n(c,f,m,y,j,v)&&(d=!0,u=!0),h++}x++}else if("Polygon"===g.type||"MultiPolygon"===g.type){var S={type:"Feature",geometry:g,properties:{}};s(e,S)&&(u=!0)}p++}if(u)return e;for(var L=o([]),p=0;p<t.features.length;p++)L.features=L.features.concat(a(t.features[p]).features);for(var C,N=1/0,p=0;p<L.features.length;p++){var b=i(e,L.features[p],"miles");N>b&&(N=b,C=L.features[p])}return C}},{"turf-center":21,"turf-distance":60,"turf-explode":68,"turf-featurecollection":72,"turf-inside":76}],102:[function(t,e){var n=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};e.exports=function(t,e){if(!n(t))throw new Error("Coordinates must be an array");if(t.length<2)throw new Error("Coordinates must be at least 2 numbers long");return{type:"Feature",geometry:{type:"Point",coordinates:t},properties:e||{}}}},{}],103:[function(t,e){e.exports=function(t,e){if(null===t)throw new Error("No coordinates passed");for(var n=0;n<t.length;n++)for(var o=t[n],r=0;r<o[o.length-1].length;r++){if(o.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");if(o[o.length-1][r]!==o[0][r])throw new Error("First and last Position are not equivalent.")}var i={type:"Feature",geometry:{type:"Polygon",coordinates:t},properties:e};return i.properties||(i.properties={}),i}},{}],104:[function(t,e){var n=t("simple-statistics");e.exports=function(t,e,o){var r=[],i=[];return t.features.forEach(function(t){r.push(t.properties[e])}),o.forEach(function(t){i.push(n.quantile(r,.01*t))}),i}},{"simple-statistics":105}],105:[function(t,e,n){arguments[4][59][0].apply(n,arguments)},{dup:59}],106:[function(t,e){var n=t("geojson-random");e.exports=function(t,e,o){switch(o=o||{},e=e||1,t){case"point":case"points":case void 0:return n.point(e,o.bbox);case"polygon":case"polygons":return n.polygon(e,o.num_vertices,o.max_radial_length,o.bbox);default:throw new Error("Unknown type given: valid options are points and polygons")}}},{"geojson-random":107}],107:[function(t,e){function n(t){return t?p(t):[s(),a()]}function o(t){return function(e){return[e[0]+t[0],e[1]+t[1]]}}function r(){return Math.random()-.5}function s(){return 360*r()}function a(){return 180*r()}function u(t){return{type:"Point",coordinates:t||[s(),a()]}}function p(t){return[Math.random()*(t[2]-t[0])+t[0],Math.random()*(t[3]-t[1])+t[1]]}function g(t){return{type:"Polygon",coordinates:t}}function l(t){return{type:"Feature",geometry:t,properties:{}}}function h(t){return{type:"FeatureCollection",features:t}}e.exports=function(){throw new Error("call .point() or .polygon() instead")},e.exports.position=n,e.exports.point=function(t,e){var o=[];for(i=0;i<t;i++)o.push(l(e?u(n(e)):u()));return h(o)},e.exports.polygon=function(t,e,r,s){function a(t,e,n){n[e]=e>0?t+n[e-1]:t}function u(t){t=2*t*Math.PI/c[c.length-1];var e=Math.random();d.push([e*r*Math.sin(t),e*r*Math.cos(t)])}"number"!=typeof e&&(e=10),"number"!=typeof r&&(r=10);var p=[];for(i=0;i<t;i++){var d=[],c=Array.apply(null,new Array(e+1)).map(Math.random);c.forEach(a),c.forEach(u),d[d.length-1]=d[0],d=d.map(o(n(s))),p.push(l(g([d])))}return h(p)}},{}],108:[function(t,e){{var n=t("turf-featurecollection");t("./index.js")}e.exports=function(t,e,o,r){var i=n([]);return t.features.forEach(function(t){for(var n=0;n<r.length;n++)t.properties[e]>=r[n][0]&&t.properties[e]<=r[n][1]&&(t.properties[o]=r[n][2]);i.features.push(t)}),i}},{"./index.js":108,"turf-featurecollection":72}],109:[function(t,e){var n=t("turf-featurecollection");e.exports=function(t,e,o){for(var r=n([]),i=0;i<t.features.length;i++)t.features[i].properties[e]!=o&&r.features.push(t.features[i]);return r}},{"turf-featurecollection":72}],110:[function(t,e){function n(t,e){for(var n,o,r=t.slice(0),i=t.length,s=i-e;i-->s;)o=Math.floor((i+1)*Math.random()),n=r[o],r[o]=r[i],r[i]=n;return r.slice(s)}var o=t("turf-featurecollection");e.exports=function(t,e){var r=o(n(t.features,e));return r}},{"turf-featurecollection":72}],111:[function(t,e){function n(t,e){return{type:"Feature",geometry:t,properties:e}}var o=t("simplify-js");e.exports=function(t,e,r){if("LineString"===t.geometry.type){var i={type:"LineString",coordinates:[]},s=t.geometry.coordinates.map(function(t){return{x:t[0],y:t[1]}});return i.coordinates=o(s,e,r).map(function(t){return[t.x,t.y]}),n(i,t.properties)}if("Polygon"===t.geometry.type){var a={type:"Polygon",coordinates:[]};return t.geometry.coordinates.forEach(function(t){var n=t.map(function(t){return{x:t[0],y:t[1]}}),i=o(n,e,r).map(function(t){return[t.x,t.y]});a.coordinates.push(i)}),n(a,t.properties)}}},{"simplify-js":112}],112:[function(e,n){!function(){"use strict";function e(t,e){var n=t.x-e.x,o=t.y-e.y;return n*n+o*o}function o(t,e,n){var o=e.x,r=e.y,i=n.x-o,s=n.y-r;if(0!==i||0!==s){var a=((t.x-o)*i+(t.y-r)*s)/(i*i+s*s);a>1?(o=n.x,r=n.y):a>0&&(o+=i*a,r+=s*a)}return i=t.x-o,s=t.y-r,i*i+s*s}function r(t,n){for(var o,r=t[0],i=[r],s=1,a=t.length;a>s;s++)o=t[s],e(o,r)>n&&(i.push(o),r=o);return r!==o&&i.push(o),i}function i(t,e){var n,r,i,s,a=t.length,u="undefined"!=typeof Uint8Array?Uint8Array:Array,p=new u(a),g=0,l=a-1,h=[],d=[];for(p[g]=p[l]=1;l;){for(r=0,n=g+1;l>n;n++)i=o(t[n],t[g],t[l]),i>r&&(s=n,r=i);r>e&&(p[s]=1,h.push(g,s,s,l)),l=h.pop(),g=h.pop()}for(n=0;a>n;n++)p[n]&&d.push(t[n]);return d}function s(t,e,n){var o=void 0!==e?e*e:1;return t=n?t:r(t,o),t=i(t,o)}"function"==typeof t&&t.amd?t(function(){return s}):"undefined"!=typeof n?n.exports=s:"undefined"!=typeof self?self.simplify=s:window.simplify=s}()},{}],113:[function(t,e){e.exports=function(t,e){var n=t[2]-t[0],o=t[3]-t[1],r=n*e,i=o*e,s=r-n,a=i-o,u=t[0]-s/2,p=t[1]-a/2,g=s/2+t[2],l=a/2+t[3],h=[u,p,g,l];return h}},{}],114:[function(t,e){var n=t("turf-featurecollection"),o=t("turf-point"),r=t("turf-polygon"),i=t("turf-distance");e.exports=function(t,e,s){for(var a=n([]),u=e/i(o([t[0],t[1]]),o([t[2],t[1]]),s),p=u*(t[2]-t[0]),g=e/i(o([t[0],t[1]]),o([t[0],t[3]]),s),l=g*(t[3]-t[1]),h=t[0];h<=t[2];){for(var d=t[1];d<=t[3];){var c=r([[[h,d],[h,d+l],[h+p,d+l],[h+p,d],[h,d]]]);a.features.push(c),d+=l}h+=p}return a}},{"turf-distance":60,"turf-featurecollection":72,"turf-point":102,"turf-polygon":103}],115:[function(t,e){var n=t("turf-midpoint"),o=t("turf-point"),r=t("turf-distance");e.exports=function(t){var e=[0,0,0,0],i=o([t[0],t[1]]),s=o([t[0],t[3]]),a=(o([t[2],t[3]]),o([t[2],t[1]])),u=r(i,a,"miles"),p=r(i,s,"miles");if(u>=p){e[0]=t[0],e[2]=t[2];var g=n(i,s);return e[1]=g.geometry.coordinates[1]-(t[2]-t[0])/2,e[3]=g.geometry.coordinates[1]+(t[2]-t[0])/2,e}e[1]=t[1],e[3]=t[3];var l=n(i,a);return e[0]=l.geometry.coordinates[0]-(t[3]-t[1])/2,e[2]=l.geometry.coordinates[0]+(t[3]-t[1])/2,e}},{"turf-distance":60,"turf-midpoint":95,"turf-point":102}],116:[function(t,e){function n(t){for(var e=0,n=0;n<t.length;n++)e+=t[n];return e}var o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n(s)}),t}},{"turf-inside":76}],117:[function(t,e){var n=t("turf-inside");e.exports=function(t,e,o,r){return t=JSON.parse(JSON.stringify(t)),e=JSON.parse(JSON.stringify(e)),t.features.forEach(function(t){t.properties||(t.properties={}),e.features.forEach(function(e){if(void 0===t.properties[r]){var i=n(t,e);i&&(t.properties[r]=e.properties[o])}})}),t}},{"turf-inside":76}],118:[function(t,e){function n(t,e,n){this.a=t,this.b=e,this.c=n;var o,r,i,s,a=e.x-t.x,u=e.y-t.y,p=n.x-t.x,g=n.y-t.y,l=a*(t.x+e.x)+u*(t.y+e.y),h=p*(t.x+n.x)+g*(t.y+n.y),d=2*(a*(n.y-e.y)-u*(n.x-e.x));Math.abs(d)<1e-6?(o=Math.min(t.x,e.x,n.x),r=Math.min(t.y,e.y,n.y),i=.5*(Math.max(t.x,e.x,n.x)-o),s=.5*(Math.max(t.y,e.y,n.y)-r),this.x=o+i,this.y=r+s,this.r=i*i+s*s):(this.x=(g*l-u*h)/d,this.y=(a*h-p*l)/d,i=this.x-t.x,s=this.y-t.y,this.r=i*i+s*s)}function o(t,e){return e.x-t.x}function r(t){var e,n,o,r,i,s=t.length;t:for(;s;)for(n=t[--s],e=t[--s],o=s;o;)if(i=t[--o],r=t[--o],e===r&&n===i||e===i&&n===r){t.splice(s,2),t.splice(o,2),s-=2;continue t}}function i(t){if(t.length<3)return[];t.sort(o);for(var e=t.length-1,i=t[e].x,s=t[0].x,a=t[e].y,u=a;e--;)t[e].y<a&&(a=t[e].y),t[e].y>u&&(u=t[e].y);var p,g,l,h=s-i,d=u-a,c=h>d?h:d,f=.5*(s+i),m=.5*(u+a),y=[new n({x:f-20*c,y:m-c,__sentinel:!0},{x:f,y:m+20*c,__sentinel:!0},{x:f+20*c,y:m-c,__sentinel:!0})],j=[],v=[];for(e=t.length;e--;){for(v.length=0,p=y.length;p--;)h=t[e].x-y[p].x,h>0&&h*h>y[p].r?(j.push(y[p]),y.splice(p,1)):(d=t[e].y-y[p].y,h*h+d*d>y[p].r||(v.push(y[p].a,y[p].b,y[p].b,y[p].c,y[p].c,y[p].a),y.splice(p,1)));for(r(v),p=v.length;p;)l=v[--p],g=v[--p],y.push(new n(g,l,t[e]))}for(Array.prototype.push.apply(j,y),e=j.length;e--;)(j[e].a.__sentinel||j[e].b.__sentinel||j[e].c.__sentinel)&&j.splice(e,1);return j}var s=t("turf-polygon"),a=t("turf-featurecollection");e.exports=function(t,e){return a(i(t.features.map(function(t){var n={x:t.geometry.coordinates[0],y:t.geometry.coordinates[1]};return e&&(n.z=t.properties[e]),n})).map(function(t){return s([[[t.a.x,t.a.y],[t.b.x,t.b.y],[t.c.x,t.c.y],[t.a.x,t.a.y]]],{a:t.a.z,b:t.b.z,c:t.c.z})}))}},{"turf-featurecollection":72,"turf-polygon":103}],119:[function(t,e){var n=t("turf-featurecollection"),o=t("turf-point"),r=t("turf-polygon"),i=t("turf-distance");e.exports=function(t,e,s){for(var a=n([]),u=e/i(o([t[0],t[1]]),o([t[2],t[1]]),s),p=u*(t[2]-t[0]),g=e/i(o([t[0],t[1]]),o([t[0],t[3]]),s),l=g*(t[3]-t[1]),h=0,d=t[0];d<=t[2];){for(var c=0,f=t[1];f<=t[3];){if(h%2===0&&c%2===0){var m=r([[[d,f],[d,f+l],[d+p,f],[d,f]]]);a.features.push(m);var y=r([[[d,f+l],[d+p,f+l],[d+p,f],[d,f+l]]]);a.features.push(y)}else if(h%2===0&&c%2===1){var m=r([[[d,f],[d+p,f+l],[d+p,f],[d,f]]]);a.features.push(m);var y=r([[[d,f],[d,f+l],[d+p,f+l],[d,f]]]);a.features.push(y)}else if(c%2===0&&h%2===1){var m=r([[[d,f],[d,f+l],[d+p,f+l],[d,f]]]);a.features.push(m);var y=r([[[d,f],[d+p,f+l],[d+p,f],[d,f]]]);a.features.push(y)}else if(c%2===1&&h%2===1){var m=r([[[d,f],[d,f+l],[d+p,f],[d,f]]]);a.features.push(m);var y=r([[[d,f+l],[d+p,f+l],[d+p,f],[d,f+l]]]);a.features.push(y)}f+=l,c++}h++,d+=p}return a}},{"turf-distance":60,"turf-featurecollection":72,"turf-point":102,"turf-polygon":103}],120:[function(t,e){var n=t("jsts");e.exports=function(t,e){var o=new n.io.GeoJSONReader,r=o.read(JSON.stringify(t.geometry)),i=o.read(JSON.stringify(e.geometry)),s=r.union(i),a=new n.io.GeoJSONParser;return s=a.write(s),{type:"Feature",geometry:s,properties:t.properties}}},{jsts:121}],121:[function(t,e,n){arguments[4][17][0].apply(n,arguments)},{"./lib/jsts":122,dup:17,"javascript.util":124}],122:[function(t,e,n){arguments[4][18][0].apply(n,arguments)},{dup:18}],123:[function(t,e,n){arguments[4][19][0].apply(n,arguments)},{dup:19}],124:[function(t,e,n){arguments[4][20][0].apply(n,arguments)},{"./dist/javascript.util-node.min.js":123,dup:20}],125:[function(t,e){var n=t("simple-statistics"),o=t("turf-inside");e.exports=function(t,e,r,i){return t.features.forEach(function(t){t.properties||(t.properties={});var s=[];e.features.forEach(function(e){o(e,t)&&s.push(e.properties[r])}),t.properties[i]=n.variance(s)}),t}},{"simple-statistics":126,"turf-inside":76}],126:[function(t,e,n){arguments[4][59][0].apply(n,arguments)},{dup:59}],127:[function(t,e){var n=t("turf-inside"),o=t("turf-featurecollection");e.exports=function(t,e){for(var r=o([]),i=0;i<e.features.length;i++)for(var s=0;s<t.features.length;s++){var a=n(t.features[s],e.features[i]);a&&r.features.push(t.features[s])}return r}},{"turf-featurecollection":72,"turf-inside":76}]},{},[1])(1)});