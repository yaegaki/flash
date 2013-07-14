Flash Analyzer for javascript

swfファイルをjsのみで解析するためのライブラリ

現状では非圧縮/圧縮swfのヘッダ解析,タグの列挙,DefineBitsJPEG3タグからの画像の抽出ぐらいの機能しかありません.  
使用方法はnew flash(binary)するとtag情報などをもったオブジェクトが生成されます.  
binaryはUint8Arrayで与えてください.  
詳しいことはソースを参照してください.  



