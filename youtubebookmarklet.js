javascript: (function(){
    if(window.isJumpCutterRunning){
        window.location.reload();
        return;
    }else{
        window.isJumpCutterRunning = true;
    }
    var video = document.getElementsByTagName('video')[0];
    var changeFlag = false;
    var timeoutCancel = -1;
    var currentSpeed = 1;
    
    var talk = prompt('Talking speed', 1.5);
    var silence = prompt('Silence speed', 5);
    var threshold = prompt('Percentage threshold', 3);
    var delay = prompt('Delay in ms between changes', 30);
    var silenceDelay = prompt('Delay in ms before treating as delay', 30);
    
    var audioCtx = new window.AudioContext();
    var processor = audioCtx.createScriptProcessor(4096, 1, 1);
    var source = audioCtx.createMediaElementSource(video);
    source.connect(processor);
    source.connect(audioCtx.destination);
    processor.connect(audioCtx.destination);
    
    currentSpeed = video.playbackRate;
    processor.onaudioprocess = function(evt) {
        var input = evt.inputBuffer.getChannelData(0);
        
        var topVolume = Math.max(Math.max(...input), Math.abs(Math.min(...input)));
        if(topVolume > threshold/100){
            if((talk !== currentSpeed && !changeFlag) || timeoutCancel !== -1){
                clearTimeout(timeoutCancel);
                timeoutCancel = -1;
                currentSpeed = talk;
                video.playbackRate = talk;
                changeFlag = true;
                setTimeout(()=>changeFlag = false, delay);
            }
        }else{
            if(silence !== currentSpeed && !changeFlag){
                currentSpeed = silence;
                video.playbackRate = silence;
                changeFlag = true;
                setTimeout(()=>changeFlag = false, delay);
            }else{
                clearTimeout(timeoutCancel);
                timeoutCancel = -1;
                setTimeout(()=>{
                    currentSpeed = silence;
                    video.playbackRate = silence;
                    changeFlag = true;
                    setTimeout(()=>changeFlag = false, delay);
                }, silenceDelay);
            }
        }
    };
})()