function progressor( options ){
    this._media = options.media;
    this._bar = options.bar;
    this._text = options.text;
    this._time = options.time;
    this.initProgressBar();
    this.initMedia();
};


progressor.prototype.initMedia = function() {
    this._media.addEventListener('timeupdate', this.updateProgress.bind(this), false);
    this._media.addEventListener('timeupdate', this.updateTimeCount.bind(this), false);
    this.addClickEvents();
    this.updateTimeCount(this._media);
};

progressor.prototype.initProgressBar = function(){
    var text = document.createElement('span');
    text.textContent = this._text || "";
    this._bar.style.position = "relative";
    this._bar.style.zIndex = 1;
    
    var progress = document.createElement('div');
    progress.id = "progressor-progress";
    progress.style.width = "0%";
    progress.style.height = "100%";
    progress.style.position = "absolute";
    progress.style.top = 0;
    progress.style.zIndex = -1;
    
    this._bar.style.webkitUserSelect = "none";
    this._bar.style.userSelect = "none";
    this._bar.appendChild ( text );
    this._bar.appendChild( progress );
};

progressor.prototype.updateProgress = function() {
    this.updateTimeCount();
    var value = 0;
    if (this._media.currentTime > 0) {
        value = Math.floor((100 / this._media.duration) * this._media.currentTime);
    }
    // this._bar.getElementsByTagName('div')[0].clientWidth = value + "%";
    this._bar.getElementsByTagName('div')[0].style.width = value + "%";
};

progressor.prototype.formatTime = function ( time ) {
    var minutes = Math.floor(time / 60);
    var seconds = ("0" + Math.round( time - minutes * 60 ) ).slice(-2);
    return minutes+":"+seconds;    
}

progressor.prototype.updateTimeCount = function(){
    if ( this._time ) {
        var currTime = this.formatTime ( this._media.currentTime );
        var totalTime = this.formatTime ( this._media.duration );
        if ( isNaN( this._media.duration ) === true ) { totalTime = "00:00" };
        this._time.innerHTML = currTime + "/" + totalTime;        
    }
};


progressor.prototype.timeFromCursorPosition = function(element, event, duration){
    var dimensions = element.getBoundingClientRect();
    var pixelsOfBar = event.clientX - dimensions.left;
    var percentToSecs = pixelsOfBar / dimensions.width;
    return percentToSecs * duration;
};

progressor.prototype.setMediaProgress = function(event){
    this._media.currentTime = this.timeFromCursorPosition(
        this._bar,
        event,
        this._media.duration
    );
    this.updateProgress();
    
};

progressor.prototype.addClickEvents = function(){
    var isMouseDown = false,
        wasPlaying = false,
        mouseEventRefresh = '';

    var mouseDown = function(e){
        isMouseDown = true;
        wasPlaying = !this._media.paused;
        this._media.pause();
        this.setMediaProgress(e);
    }
    this._bar.addEventListener("mousedown", mouseDown.bind(this) );
    var mouseUp = function(e){
        clearInterval(mouseEventRefresh);
        isMouseDown = false;
        console.log(wasPlaying);
        if (wasPlaying == true) {
            this._media.play();
            wasPlaying = false;
        };
    }
    this._bar.addEventListener("mouseup", mouseUp.bind(this) );
    var mouseMove = function(e){
        if ( isMouseDown === true ) {
            mouseEventRefresh = setInterval( this.setMediaProgress(e) , 1000 );   
        }
    }
    this._bar.addEventListener("mousemove", mouseMove.bind(this) );
};

