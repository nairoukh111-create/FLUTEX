#!/usr/bin/env python3
"""Replace the hero-video playlist script on both homepages."""
import os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

NEW = (
    '<script>(function(){'
    'var v=[].slice.call(document.querySelectorAll("[data-hero-video]"));'
    'if(!v.length)return;'
    'var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;'
    'v.forEach(function(x,n){x.muted=true;x.playsInline=true;x.loop=false;'
    'x.style.transition="opacity .9s ease";x.style.opacity=n===0?"1":"0";});'
    'if(reduce){v.forEach(function(x,n){if(n)x.style.display="none";});return;}'
    'var i=0,armed=false;'
    'function play(x){var p;try{p=x.play();}catch(e){return;}if(p&&p.catch)p.catch(function(){});}'
    'function go(n){if(n===i)return;var prev=v[i];i=n;var c=v[i];'
    'c.style.opacity="1";prev.style.opacity="0";'
    'try{c.currentTime=0;}catch(e){}play(c);'
    'setTimeout(function(){if(prev!==c){try{prev.pause();}catch(e){}}},1000);}'
    'v.forEach(function(x,n){x.addEventListener("ended",function(){go((n+1)%v.length);});});'
    'function arm(){if(armed)return;armed=true;for(var k=1;k<v.length;k++){v[k].preload="auto";v[k].load();}}'
    'v[0].addEventListener("playing",arm);setTimeout(arm,2500);'
    'function kick(){if(v[i].paused)play(v[i]);}'
    'kick();'
    '["loadeddata","canplay","canplaythrough"].forEach(function(e){v[0].addEventListener(e,kick);});'
    'document.addEventListener("visibilitychange",function(){if(!document.hidden)kick();});'
    '["pointerdown","touchstart","keydown","scroll"].forEach(function(e){'
    'window.addEventListener(e,kick,{passive:true});});'
    'setInterval(function(){if(document.hidden)return;var c=v[i];'
    'if(c.paused&&!c.ended&&c.readyState>2)play(c);},2000);'
    '})();</script>'
)

MARK = '<script>(function(){var v=[].slice.call'

for f in ['index.html', 'ar/index.html']:
    h = open(f, encoding='utf-8').read()
    i = h.find(MARK)
    assert i > 0, f'playlist script not found in {f}'
    j = h.find('</script>', i) + len('</script>')
    open(f, 'w', encoding='utf-8').write(h[:i] + NEW + h[j:])
    print(f, 'patched')
