javascript: (function(){
    if(window.isJumpCutterRunning){
        window.location.reload();
        return;
    }else{
        window.isJumpCutterRunning = true;
    }
    var video = document.getElementsByTagName('video')[0];
    var currentSpeed = 1;
    var unspikesBeforeChangeCount = 0;
    var spikesBeforeChangeCount = 0;
    
    var talk = prompt('Talking speed', 1.5);
    var silence = prompt('Silence speed', 5);
    var threshold = prompt('Percentage threshold', 3);
    var delaySilence = prompt('Number of set of unspikes before change to silence', 70);
    var delayTalk = prompt('Number of set of spikes before change to talk. Setting to -1 changes to talk instantly when one spike occurs', 0);
    var spikesThreshold = prompt('Least number of spikes in order to treat as talking', 30);
    
    var audioCtx = new window.AudioContext();
    var processor = audioCtx.createScriptProcessor(256, 1, 1);
    var source = audioCtx.createMediaElementSource(video);
    source.connect(processor);
    source.connect(audioCtx.destination);
    processor.connect(audioCtx.destination);
    
    currentSpeed = video.playbackRate;
    processor.onaudioprocess = function(evt) {
        var input = evt.inputBuffer.getChannelData(0);
        var countSpikes = 0;
        input.forEach((sample)=>{
            if(Math.abs(sample) > threshold/100){
                countSpikes++;
            }
        });
        if(countSpikes > spikesThreshold || (delayTalk == -1 && countSpikes > 0)){
            if(spikesBeforeChangeCount-- > 0){
                return;
            }
            unspikesBeforeChangeCount = 0;
            if(talk !== currentSpeed){
                currentSpeed = talk;
                video.playbackRate = talk;
            }
        }else{
            if(unspikesBeforeChangeCount++ > delaySilence){
                spikesBeforeChangeCount = delayTalk;
                if(silence !== currentSpeed){
                    currentSpeed = silence;
                    video.playbackRate = silence;
                }
            }
        }
    };
})()