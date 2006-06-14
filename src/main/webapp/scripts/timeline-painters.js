/*==================================================
 *  Duration Event Painter
 *==================================================
 */

Timeline.DurationEventPainter = function(params, band, timeline) {
    this._band = band;
    this._timeline = timeline;
    this._layerDiv = null;
    this._showText = params.showText;
    this._textWidth = params.textWidth;
};

Timeline.DurationEventPainter.prototype.paint = function() {
    if (this._layerDiv) {
        this._band.removeLayerDiv(this._layerDiv);
    }
    this._layerDiv = this._band.createLayerDiv(10);
    this._layerDiv.style.visibility = "hidden";
    
    var eventSource = this._band.getEventSource();
    var minDate = this._band.getMinDate();
    var maxDate = this._band.getMaxDate();
    
    var streams = [ 0 ];
    
    var iterator = eventSource.getEventIterator(minDate, maxDate);
    while (iterator.hasNext()) {
        var evt = iterator.next();
        var startDate = new Date(Math.max(evt.getStart().getTime(), minDate.getTime()));
        var endDate = new Date(Math.min(evt.getEnd().getTime(), maxDate.getTime()));
        var instant = startDate.getTime() == endDate.getTime();
        
        var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
        var endPixel = Math.round(this._band.dateToPixelOffset(endDate));
        var length = Math.max(1, endPixel - startPixel);
        
        var div = this._timeline.getDocument().createElement("div");
        div.className = instant ? "timeline-instant-event" : "timeline-duration-event";
        div.title = evt.getText();
        
        var streamIndex = 0;
        for (; streamIndex < streams.length; streamIndex++) {
            if (streams[streamIndex] < startPixel) {
                break;
            }
        }
        if (streamIndex >= streams.length) {
            streams.push(0);
        }
        
        var streamOffset = (0.5 + streamIndex * 2) + "em";
        if (this._timeline.isHorizontal()) {
            div.style.top = streamOffset
            div.style.height = "1.5em";
            
            div.style.left = startPixel + "px";
            if (instant && this._showText) {
                div.style.width = this._textWidth;
            } else {
                div.style.width = length + "px";
            }
        } else {
            div.style.left = streamOffset;
            div.style.width = "1.5em";
            
            div.style.top = startPixel + "px";
            div.style.height = length + "px";
        }
        
        if (!instant || this._showText) {
            div.innerHTML = evt.getText();
        }
        
        this._layerDiv.appendChild(div);
        
        if (this._timeline.isHorizontal()) {
            streams[streamIndex] = div.offsetLeft + (instant && !this._showText ? -1 : div.offsetWidth);
        } else {
            streams[streamIndex] = div.offsetTop + (instant && !this._showText ? -1 : div.offsetHeight);
        }
    }
    this._layerDiv.style.visibility = "visible";
};

Timeline.DurationEventPainter.prototype.softPaint = function() {
};