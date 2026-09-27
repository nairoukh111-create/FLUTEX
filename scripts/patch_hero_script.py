#!/usr/bin/env python3
"""Replace the hero-video playlist script on both homepages.

Behaviour: play clip A for 3s, cross-fade to clip B for 3s, back to A which
RESUMES where it left off, and so on. Each clip restarts from 0 only after it
has played all the way through.
"""
import os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

NEW = (
    '<script>(function(){'
    'var v=[].slice.call(document.querySelectorAll("[data-hero-video]"));'
    'if(!v.length)return;'
    'var SEG=3000;'
    'var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;'
    'v.forEach(function(x,n){x.muted=true;x.playsInline=true;x.loop=false;'
    'x.style.transition="opacity .6s ease";x.style.opacity=n===0?"1":"0";});'
    'if(reduce){v.forEach(function(x,n){if(n)x.style.display="none";});return;}'
    'if(v.length<2){var s=v[0];s.loop=true;var p0=s.play();if(p0&&p0.catch)p0.catch(function(){});return;}'
    'var i=0,armed=false,timer=null;'
    'function play(x){var p;try{p=x.play();}catch(e){return;}if(p&&p.catch)p.catch(function(){});}'
    'function step(){'
    'var prev=v[i];i=(i+1)%v.length;var c=v[i];'
    'c.style.opacity="1";prev.style.opacity="0";'
    'if(c.ended||c.currentTime>=(c.duration||0)-0.15){try{c.currentTime=0;}catch(e){}}'
    'play(c);'
    'setTimeout(function(){if(v[i]!==prev){try{prev.pause();}catch(e){}}},700);'
    'schedule();}'
    'function schedule(){clearTimeout(timer);timer=setTimeout(step,SEG);}'
    'v.forEach(function(x){x.addEventListener("ended",function(){try{x.currentTime=0;}catch(e){}});});'
    'function arm(){if(armed)return;armed=true;for(var k=1;k<v.length;k++){v[k].preload="auto";v[k].load();}}'
    'v[0].addEventListener("playing",arm);setTimeout(arm,2000);'
    'function kick(){var c=v[i];if(c.paused&&!document.hidden)play(c);}'
    'kick();schedule();'
    '["loadeddata","canplay","canplaythrough"].forEach(function(e){v[0].addEventListener(e,kick);});'
    'document.addEventListener("visibilitychange",function(){'
    'if(document.hidden){clearTimeout(timer);}else{kick();schedule();}});'
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
