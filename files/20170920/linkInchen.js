function runSWF(U,T,W,H){
	  document.write('<object '
      + ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'
      + ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"'
      + ' id=' + T
      + ' align="middle"'
      + ' width=' + W
      + ' height=' + H + '>'
      + ' <param name="allowScriptAccess" value="always" />'
      + ' <param name="movie" value="' + U + '">'
      + ' <param name="quality" value="best" />'
      + ' <param name="scale" value="noscale" />'
      + ' <param name="wmode" value="transparent" />'
      + ' <embed src="' + U + '"'
      + ' name=' + T
      + ' quality=high'
      + ' width=' + W
      + ' height=' + H
      + ' allowScriptAccess="always" wmode="transparent" scale="noscale" swLiveConnect="true" type="application/x-shockwave-flash"'
      + ' pluginspage="http://www.macromedia.com/go/getflashplayer" />'
      + ' </object>')
	//window.main.focus();
      findSWF("main").focus();
}
function findSWF(swf) {
      console.log("navigator.appName --> " + navigator.appName);
      if (navigator.appName.indexOf("Microsoft") != -1){
            return window[swf]
      } else {
            return document[swf]
      }
}